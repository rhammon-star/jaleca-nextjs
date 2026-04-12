import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { sendOrderConfirmation } from '@/lib/email'
import { sendMetaPurchase } from '@/lib/meta-conversions'

async function sendGA4Purchase(order: {
  id: number
  total: string
  line_items?: Array<{ product_id: number; name: string; total: string; quantity: number }>
}) {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID
  const apiSecret = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET
  if (!measurementId || !apiSecret) return

  const value = parseFloat(order.total || '0')
  const items = (order.line_items ?? []).map((i) => ({
    item_id: String(i.product_id),
    item_name: i.name,
    price: parseFloat(i.total || '0') / (i.quantity || 1),
    quantity: i.quantity,
  }))

  const payload = {
    client_id: `webhook_${order.id}`,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: String(order.id),
        value,
        currency: 'BRL',
        items,
      },
    }],
  }

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    console.log(`[GA4 MP] Purchase sent — order ${order.id}, value R$${value}`)
  } catch (err) {
    console.error('[GA4 MP] Failed to send purchase:', err)
  }
}

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function verifyCieloSignature(rawBody: string, signature: string | null): boolean {
  // Cielo sends x-hub-signature: sha256=HASH
  if (!signature) return true // Cielo signature is optional if not configured in portal
  const secret = process.env.CIELO_WEBHOOK_SECRET
  if (!secret) return true
  const parts = signature.split('=')
  if (parts.length !== 2) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  return parts[1] === expected
}

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function updateWCOrderStatus(wcOrderId: string, status: string) {
  await fetch(`${WC_API}/orders/${wcOrderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

// Cielo Status → WooCommerce status map
// Status 2 = Captured/Paid, 3 = Denied, 10 = Voided, 11 = Refunded
const CIELO_STATUS_MAP: Record<number, string> = {
  2: 'processing',
  3: 'failed',
  10: 'cancelled',
  11: 'refunded',
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature')

    if (!verifyCieloSignature(rawBody, signature)) {
      console.warn('[Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)

    // Cielo sends: { PaymentId, ChangeType }
    // ChangeType 1 = payment status change
    const paymentId: string = body.PaymentId
    const changeType: number = body.ChangeType

    if (!paymentId || changeType !== 1) {
      return NextResponse.json({ ok: true })
    }

    // Query Cielo for full payment status
    const CIELO_QUERY_API = 'https://apiquery.cieloecommerce.cielo.com.br'
    const statusRes = await fetch(`${CIELO_QUERY_API}/1/sales/${paymentId}`, {
      headers: {
        'MerchantId': process.env.CIELO_MERCHANT_ID!,
        'MerchantKey': process.env.CIELO_MERCHANT_KEY!,
      },
      cache: 'no-store',
    })

    if (!statusRes.ok) {
      return NextResponse.json({ ok: true })
    }

    const saleData = await statusRes.json()
    const cieloStatus: number = saleData.Payment?.Status
    const wcOrderId: string = saleData.MerchantOrderId  // we set orderId = wcOrder.id

    if (!wcOrderId) {
      return NextResponse.json({ ok: true })
    }

    const wcStatus = CIELO_STATUS_MAP[cieloStatus]
    if (wcStatus) {
      // Fetch current WC order status BEFORE updating — to avoid duplicate emails
      let wasAlreadyProcessing = false
      if (wcStatus === 'processing') {
        try {
          const getRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
            headers: { Authorization: wcAuth() },
            cache: 'no-store',
          })
          if (getRes.ok) {
            const current = await getRes.json()
            wasAlreadyProcessing = current.status !== 'pending'
          }
        } catch {}
      }

      await updateWCOrderStatus(wcOrderId, wcStatus)

      // Send confirmation email when payment is confirmed — only if first time
      if (wcStatus === 'processing' && !wasAlreadyProcessing) {
        try {
          const orderRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
            headers: { Authorization: wcAuth() },
            cache: 'no-store',
          })
          if (orderRes.ok) {
            const order = await orderRes.json()
            const email = order.billing?.email
            if (email) {
              sendOrderConfirmation(order, email).catch(() => {})

              // Remove from cart recovery list — customer completed purchase
              import('@/lib/brevo-cart').then(m => m.removeFromRecoveryList(email)).catch(() => {})

              // GA4 Measurement Protocol — garante tracking de PIX/Boleto confirmados no servidor
              sendGA4Purchase(order).catch(err => console.error('[GA4 MP] webhook error:', err))

              // Meta Conversions API — Purchase event (PIX/Boleto confirmed via webhook)
              // Must be awaited — Vercel terminates fire-and-forget before completion
              await sendMetaPurchase(
                {
                  email: order.billing?.email,
                  phone: order.billing?.phone,
                  firstName: order.billing?.first_name,
                  lastName: order.billing?.last_name,
                  city: order.billing?.city,
                  state: order.billing?.state,
                  zip: order.billing?.postcode,
                  country: order.billing?.country,
                },
                {
                  orderId: String(order.id),
                  value: parseFloat(order.total || '0'),
                  items: order.line_items?.map((i: { product_id: number; quantity: number }) => ({
                    id: String(i.product_id),
                    quantity: i.quantity,
                  })),
                }
              ).catch(err => console.error('[CAPI] sendMetaPurchase failed (webhook):', err))
            }
          }
        } catch {}
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ ok: true }) // Always return 200 to Cielo
  }
}
