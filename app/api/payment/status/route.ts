import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/cielo'
import { sendOrderConfirmation } from '@/lib/email'

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
  // pagarmeOrderId field is reused — now contains Cielo PaymentId
  const paymentId = searchParams.get('id')
  const wcOrderId = searchParams.get('wc')

  if (!paymentId) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
  }

  try {
    const data = await getPaymentStatus(paymentId)
    const status = data.Payment?.Status

    // Cielo Status: 2 = Captured/Paid, 12 = Pending (PIX/Boleto waiting)
    const isPaid = status === 2

    if (isPaid && wcOrderId) {
      confirmWCOrder(wcOrderId).catch(() => {})
    }

    return NextResponse.json({
      status: isPaid ? 'paid' : 'pending',
      cieloStatus: status,
      paid: isPaid,
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
