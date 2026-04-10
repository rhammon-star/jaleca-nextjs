import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation } from '@/lib/email'

const PAGARME_API = 'https://api.pagar.me/core/v5'
const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function pagarmeAuth(): string {
  return `Basic ${Buffer.from(`${process.env.PAGARME_SECRET_KEY!}:`).toString('base64')}`
}

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function confirmWCOrder(wcOrderId: string) {
  // Check current status first — webhook may have already handled this
  const getRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (getRes.ok) {
    const current = await getRes.json()
    if (current.status !== 'pending') return // already processed, skip to avoid duplicate email
  }

  // Update WooCommerce order to processing
  const res = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'processing' }),
  })
  if (!res.ok) return

  // Send confirmation email
  const order = await res.json()
  const email = order.billing?.email
  if (email) {
    sendOrderConfirmation(order, email).catch(() => {})
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pagarmeOrderId = searchParams.get('id')
  const wcOrderId = searchParams.get('wc')

  if (!pagarmeOrderId) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
  }

  try {
    const res = await fetch(`${PAGARME_API}/orders/${pagarmeOrderId}`, {
      headers: { Authorization: pagarmeAuth() },
      cache: 'no-store',
    })
    const data = await res.json()

    const charge = data.charges?.[0]
    const status = data.status as string
    const isPaid = status === 'paid' || charge?.status === 'paid'

    // When paid, update WooCommerce immediately (for local dev + as fallback for webhook)
    if (isPaid && wcOrderId) {
      confirmWCOrder(wcOrderId).catch(() => {})
    }

    return NextResponse.json({ status, chargeStatus: charge?.status, paid: isPaid })
  } catch {
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
