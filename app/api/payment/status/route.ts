import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation } from '@/lib/email'
import { getPaymentStatus } from '@/lib/cielo'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function confirmWCOrder(wcOrderId: string) {
  const getRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (getRes.ok) {
    const current = await getRes.json()
    if (current.status !== 'pending') return
  }

  const res = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'processing' }),
  })
  if (!res.ok) return

  const order = await res.json()
  const email = order.billing?.email
  if (email) {
    sendOrderConfirmation(order, email).catch(() => {})
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('paymentId')
  const wcOrderId = searchParams.get('wc')

  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId é obrigatório' }, { status: 400 })
  }

  try {
    const data = await getPaymentStatus(paymentId)
    // Cielo: Status 2 = PaymentConfirmed
    const isPaid = data.Payment.Status === 2

    if (isPaid && wcOrderId) {
      confirmWCOrder(wcOrderId).catch(() => {})
    }

    return NextResponse.json({ status: data.Payment.Status, paid: isPaid })
  } catch {
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
