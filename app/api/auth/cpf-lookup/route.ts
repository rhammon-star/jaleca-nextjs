import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const key = process.env.WOOCOMMERCE_CONSUMER_KEY!
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cpf = searchParams.get('cpf')?.replace(/\D/g, '')
  if (!cpf || cpf.length !== 11) {
    return NextResponse.json({ found: false })
  }

  try {
    // Step 1: search all customers and find one with matching billing_cpf
    const res = await fetch(
      `${WC_API}/customers?role=all&per_page=100`,
      {
        headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return NextResponse.json({ found: false })

    const customers = await res.json()
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ found: false })
    }

    // Find customer with matching billing_cpf in meta_data
    const match = customers.find((c: { meta_data?: Array<{ key: string; value: string }> }) =>
      c.meta_data?.some(m => m.key === 'billing_cpf' && m.value === cpf)
    )

    if (match) {
      return NextResponse.json({ found: true, id: match.id })
    }

    // Step 2: also check native billing_cpf field from WooCommerce
    const searchRes = await fetch(
      `${WC_API}/customers?role=all&per_page=100&search=${cpf}`,
      {
        headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
        cache: 'no-store',
      }
    )
    if (searchRes.ok) {
      const allCustomers = await searchRes.json()
      if (Array.isArray(allCustomers)) {
        // WooCommerce native search returns customers where billing_cpf matches
        const match2 = allCustomers.find((c: { id: number }) => c.id > 0)
        if (match2) {
          return NextResponse.json({ found: true, id: match2.id })
        }
      }
    }

    // Step 3: also try direct lookup via WC customer search with email placeholder
    // Check if any customer has this CPF stored directly
    const directRes = await fetch(
      `${WC_API}/customers?role=all&per_page=100`,
      {
        headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
        cache: 'no-store',
      }
    )
    if (directRes.ok) {
      const allCustomers = await directRes.json()
      if (Array.isArray(allCustomers)) {
        // Check both native billing_cpf AND meta_data billing_cpf
        const match3 = allCustomers.find((c: Record<string, unknown>) => {
          const native = (c.billing as Record<string, string> | undefined)?.cpf?.replace(/\D/g, '')
          const meta = (c.meta_data as Array<{ key: string; value: string }> | undefined)
            ?.find(m => m.key === 'billing_cpf')?.value?.replace(/\D/g, '')
          return native === cpf || meta === cpf
        })
        if (match3) {
          return NextResponse.json({ found: true, id: match3.id })
        }
      }
    }

    return NextResponse.json({ found: false })
  } catch {
    return NextResponse.json({ found: false })
  }
}
