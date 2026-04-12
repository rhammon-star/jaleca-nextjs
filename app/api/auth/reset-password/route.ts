import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const wcAuth = () =>
  'Basic ' + Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')

type WCCustomer = { id: number; meta_data?: Array<{ key: string; value: string }> }

async function findCustomerWithToken(customerId: number, resetKey: string): Promise<{
  customer: WCCustomer
  matchingIndex: number
  tokenEntries: Array<{ key: string; value: string }>
  expiresEntries: Array<{ key: string; value: string }>
} | null> {
  const res = await fetch(`${WC_API}/customers/${customerId}`, {
    headers: { Authorization: wcAuth() }, cache: 'no-store'
  })
  if (!res.ok) return null
  const customer: WCCustomer = await res.json()
  const meta = customer.meta_data || []
  console.log(`[findCustomerWithToken] Customer ${customerId} meta_data keys: ${meta.map(m => m.key).join(', ')}`)
  const tokenEntries = meta.filter(m => m.key === 'email_verify_token')
  const expiresEntries = meta.filter(m => m.key === 'email_verify_expires')
  console.log(`[findCustomerWithToken] ${customerId}: ${tokenEntries.length} token entries, ${expiresEntries.length} expires entries`)
  const cleanToken = resetKey.trim()
  const matchingIndex = tokenEntries.findIndex(m => m.value.trim() === cleanToken)
  if (matchingIndex !== -1) return { customer, matchingIndex, tokenEntries, expiresEntries }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { login, resetKey, password, customerId } = await request.json()

    if (!login || !resetKey || !password) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    // If customerId is provided, fetch that customer directly (most reliable path)
    let customers: WCCustomer[] = []
    if (customerId) {
      const singleRes = await fetch(`${WC_API}/customers/${customerId}`, {
        headers: { Authorization: wcAuth() }, cache: 'no-store'
      })
      if (singleRes.ok) {
        const single: WCCustomer = await singleRes.json()
        customers = [single]
        console.log(`[reset-password] Direct lookup customer ${customerId}: found=${single.id}`)
      }
    }

    // Fallback: search by email
    if (customers.length === 0) {
      const searchRes = await fetch(
        `${WC_API}/customers?email=${encodeURIComponent(login)}&role=all&per_page=20`,
        { headers: { Authorization: wcAuth() }, cache: 'no-store' }
      )
      if (!searchRes.ok) {
        return NextResponse.json({ error: 'Erro ao buscar cliente' }, { status: 500 })
      }
      customers = await searchRes.json()
      console.log(`[reset-password] Email search ${login}: found ${customers.length}`)
    }

    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
    }

    // Check ALL customers for matching token (most recent checkout may be a different customer ID)
    let found: Awaited<ReturnType<typeof findCustomerWithToken>> = null
    for (const c of customers) {
      found = await findCustomerWithToken(c.id, resetKey)
      if (found) {
        console.log(`[reset-password] Token matched on customer ${c.id}`)
        break
      }
    }

    if (!found) {
      console.log(`[reset-password] No matching token. Checked ${customers.length} customers, resetKey length=${resetKey.length}`)
      return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
    }

    const { customer, matchingIndex, expiresEntries } = found

    // Check expiry — use the matching index entry
    const storedExpires = expiresEntries[matchingIndex]?.value
    if (storedExpires && Date.now() > parseInt(storedExpires)) {
      console.log(`[reset-password] Token expired. Stored=${storedExpires}, Now=${Date.now()}`)
      return NextResponse.json({ error: 'Este link expirou. Solicite um novo.' }, { status: 400 })
    }

    // Update password and clear token
    const updateRes = await fetch(`${WC_API}/customers/${customer.id}`, {
      method: 'PUT',
      headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        meta_data: [
          { key: 'email_verify_token', value: '' },
          { key: 'email_verify_expires', value: '' },
          { key: 'email_verified', value: '1' },
        ],
      }),
    })

    if (!updateRes.ok) {
      return NextResponse.json({ error: 'Erro ao definir senha' }, { status: 500 })
    }

    console.log(`[reset-password] Success for customer ${customer.id}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}
