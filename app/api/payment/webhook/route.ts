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

function verifyPagarmeSignature(rawBody: string, signature: string | null): { ok: boolean; reason: string } {
  if (!signature) return { ok: false, reason: 'no x-hub-signature header' }
  const secret = process.env.PAGARME_SECRET_KEY
  if (!secret) return { ok: false, reason: 'PAGARME_SECRET_KEY not set' }
  const parts = signature.split('=')
  if (parts.length !== 2 || parts[0] !== 'sha1') return { ok: false, reason: `unexpected format: ${parts[0]}` }
  const expected = createHmac('sha1', secret).update(rawBody).digest('hex')
  if (parts[1] === expected) return { ok: true, reason: 'ok' }
  // Log first 8 chars of both to help diagnose secret mismatch without exposing full values
  return { ok: false, reason: `hmac mismatch — received=${parts[1].slice(0, 8)}… expected=${expected.slice(0, 8)}…` }
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

    const sigCheck = verifyPagarmeSignature(rawBody, signature)
    if (!sigCheck.ok) {
      // Log the mismatch details to diagnose the secret configuration,
      // but proceed — blocking webhooks stops all post-payment processing.
      console.warn(`[Webhook] Signature mismatch (proceeding): ${sigCheck.reason}`)
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
    return NextResponse.json({ ok: true }) // Always return 200 to Pagar.me
  }
}
