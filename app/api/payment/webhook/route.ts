import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { sendOrderConfirmation } from '@/lib/email'
import { sendMetaPurchase } from '@/lib/meta-conversions'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function verifyPagarmeSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false
  const secret = process.env.PAGARME_SECRET_KEY
  if (!secret) return false
  const parts = signature.split('=')
  if (parts.length !== 2 || parts[0] !== 'sha1') return false
  const expected = createHmac('sha1', secret).update(rawBody).digest('hex')
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

// Pagar.me → WooCommerce status map
const STATUS_MAP: Record<string, string> = {
  paid: 'processing',
  pending: 'pending',
  failed: 'failed',
  canceled: 'cancelled',
  chargedback: 'refunded',
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature')

    if (!verifyPagarmeSignature(rawBody, signature)) {
      console.warn('[Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)

    // Pagar.me sends order or charge events
    const eventType: string = body.type || ''
    const orderData = body.data

    if (!orderData) {
      return NextResponse.json({ ok: true })
    }

    // Extract WooCommerce order ID from metadata
    const metadata = orderData.metadata as Record<string, string> | undefined
    const wcOrderId = metadata?.wc_order_id

    if (!wcOrderId) {
      return NextResponse.json({ ok: true })
    }

    // Map Pagar.me status to WooCommerce
    let pagarmeStatus = orderData.status as string
    if (eventType.includes('charge')) {
      pagarmeStatus = orderData.status
    }

    const wcStatus = STATUS_MAP[pagarmeStatus]
    if (wcStatus) {
      await updateWCOrderStatus(wcOrderId, wcStatus)

      // Send confirmation email when payment is confirmed
      if (wcStatus === 'processing') {
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
              ).catch(() => {})
            }
          }
        } catch {}
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ ok: true }) // Always return 200 to Pagar.me
  }
}
