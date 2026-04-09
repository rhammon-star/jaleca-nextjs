import { NextRequest, NextResponse } from 'next/server'
import { sendSetPasswordEmail } from '@/lib/email'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const wcAuth = () =>
  'Basic ' + Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')

export async function POST(request: NextRequest) {
  try {
    const { email, isNewCustomer } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // Find WC customer by email
    const searchRes = await fetch(
      `${WC_API}/customers?email=${encodeURIComponent(email)}&role=all`,
      { headers: { Authorization: wcAuth() }, cache: 'no-store' }
    )
    const customers = searchRes.ok ? await searchRes.json() : []
    if (!Array.isArray(customers) || customers.length === 0) {
      // Don't reveal if email exists
      return NextResponse.json({ success: true })
    }
    const customer = customers[0]

    await sendSetPasswordEmail(customer.id, email, isNewCustomer ?? false)

    console.log(`[ForgotPassword] Email enviado para ${email}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ForgotPassword] Unexpected error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
