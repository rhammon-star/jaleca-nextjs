import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation } from '@/lib/email'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

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
    const body = await request.json()

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
