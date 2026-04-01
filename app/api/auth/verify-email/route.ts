import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const auth = Buffer.from(
  `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
).toString('base64')

async function updateCustomerMeta(customerId: number, meta: Record<string, string>) {
  const meta_data = Object.entries(meta).map(([key, value]) => ({ key, value }))
  await fetch(`${WC_API}/customers/${customerId}`, {
    method: 'PUT',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta_data }),
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const customerId = searchParams.get('id')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaleca.com.br'

  if (!token || !customerId) {
    return NextResponse.redirect(`${siteUrl}/verificar-email?status=invalid`)
  }

  try {
    const res = await fetch(`${WC_API}/customers/${customerId}`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.redirect(`${siteUrl}/verificar-email?status=invalid`)

    const customer = await res.json()
    const meta = customer.meta_data as Array<{ key: string; value: string }> | undefined
    const storedToken = meta?.find(m => m.key === 'email_verify_token')?.value
    const expires = meta?.find(m => m.key === 'email_verify_expires')?.value

    if (!storedToken || storedToken !== token) {
      return NextResponse.redirect(`${siteUrl}/verificar-email?status=invalid`)
    }
    if (expires && Date.now() > Number(expires)) {
      return NextResponse.redirect(`${siteUrl}/verificar-email?status=expired`)
    }

    await updateCustomerMeta(Number(customerId), {
      email_verified: '1',
      email_verify_token: '',
      email_verify_expires: '',
    })

    return NextResponse.redirect(`${siteUrl}/verificar-email?status=success`)
  } catch {
    return NextResponse.redirect(`${siteUrl}/verificar-email?status=invalid`)
  }
}
