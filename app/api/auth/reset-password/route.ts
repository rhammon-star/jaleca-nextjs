import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const wcAuth = () =>
  'Basic ' + Buffer.from(`${process.env.WP_ADMIN_USER}:${process.env.WP_ADMIN_APP_PASSWORD}`).toString('base64')

export async function POST(request: NextRequest) {
  try {
    const { login, resetKey, password } = await request.json()

    if (!login || !resetKey || !password) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    // Find customer by email
    const searchRes = await fetch(
      `${WC_API}/customers?email=${encodeURIComponent(login)}&role=all`,
      { headers: { Authorization: wcAuth() }, cache: 'no-store' }
    )
    if (!searchRes.ok) {
      return NextResponse.json({ error: 'Erro ao buscar cliente' }, { status: 500 })
    }
    const customers = await searchRes.json()
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
    }
    const customer = customers[0]

    // Validate token from WC meta
    const meta: Array<{ key: string; value: string }> = customer.meta_data || []
    const storedToken = meta.find(m => m.key === 'email_verify_token')?.value
    const storedExpires = meta.find(m => m.key === 'email_verify_expires')?.value

    if (!storedToken || storedToken !== resetKey) {
      return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
    }
    if (storedExpires && Date.now() > parseInt(storedExpires)) {
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

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}
