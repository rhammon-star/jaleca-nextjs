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
    // Step 1: find CPF via custom endpoint
    const res = await fetch(
      `${WC_API}/jaleca-cpf-lookup?cpf=${cpf}&consumer_key=${key}&consumer_secret=${secret}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return NextResponse.json({ found: false })
    const data = await res.json() as { found: boolean; id?: string }
    if (!data.found || !data.id) return NextResponse.json({ found: false })

    // Step 2: confirm the customer still exists in WooCommerce
    const verify = await fetch(
      `${WC_API}/customers/${data.id}?consumer_key=${key}&consumer_secret=${secret}`,
      { cache: 'no-store' }
    )
    if (!verify.ok) return NextResponse.json({ found: false })
    return NextResponse.json({ found: true, id: data.id })
  } catch {
    return NextResponse.json({ found: false })
  }
}
