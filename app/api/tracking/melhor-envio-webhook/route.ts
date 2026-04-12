import { NextRequest, NextResponse } from 'next/server'
import { sendOrderShippedWithTracking } from '@/lib/email'

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth() {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function updateOrderMeta(orderId: number, key: string, value: string) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta_data: [{ key, value }] }),
  })
}

async function findWCOrderByMECartId(meCartId: string): Promise<number | null> {
  const res = await fetch(
    `${WC_API_URL}/orders?per_page=100&status=processing,on-hold`,
    { headers: { Authorization: wcAuth() }, cache: 'no-store' }
  )
  if (!res.ok) return null
  const orders = await res.json() as Array<{ id: number; meta_data: Array<{ key: string; value: string }> }>
  const match = orders.find(o => o.meta_data?.find(m => m.key === 'jaleca_me_cart_id' && m.value === meCartId))
  return match?.id ?? null
}

/**
 * Melhor Envio webhook endpoint.
 * Configure in ME dashboard: https://app.melhorenvio.com.br → Preferências → Notificações
 * URL: https://jaleca.com.br/api/tracking/melhor-envio-webhook
 *
 * ME sends events when order status changes (posted, in_transit, delivered, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await req.json() as Record<string, any>

    // ME webhook format: { id, status, tracking, service: { name }, tags: [{ tag }], to: { email, name } }
    const meOrderId: string = body.id ?? body.order_id ?? ''
    const tracking: string = body.tracking ?? body.tracking_code ?? ''
    const status: string = body.status ?? ''
    const carrier: string = body.service?.name ?? body.carrier ?? 'Transportadora'
    const tags: Array<{ tag: string }> = body.tags ?? []

    if (!meOrderId) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
    }

    // Extract WC order ID from tags (format: "wc-order-62312")
    const wcTag = tags.find(t => t.tag?.startsWith('wc-order-'))
    const wcOrderId = wcTag ? parseInt(wcTag.tag.replace('wc-order-', ''), 10) : null

    // Fallback: find WC order by ME cart ID stored in meta
    const resolvedWCOrderId = wcOrderId ?? await findWCOrderByMECartId(meOrderId)

    if (!resolvedWCOrderId) {
      console.log(`[ME Webhook] Could not find WC order for ME order ${meOrderId}`)
      return NextResponse.json({ ok: true, matched: false })
    }

    // Check if already registered
    const orderRes = await fetch(`${WC_API_URL}/orders/${resolvedWCOrderId}`, {
      headers: { Authorization: wcAuth() }, cache: 'no-store',
    })
    if (!orderRes.ok) return NextResponse.json({ ok: true })
    const wcOrder = await orderRes.json() as {
      id: number
      billing: { first_name: string; last_name: string; email: string }
      meta_data: Array<{ key: string; value: string }>
    }

    const getMeta = (key: string) => wcOrder.meta_data?.find(m => m.key === key)?.value ?? ''
    const alreadyTracking = getMeta('jaleca_tracking_active') === '1'

    if (tracking && !alreadyTracking) {
      // First time: register tracking and send "shipped" email
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_tracking_code', tracking)
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_tracking_carrier', carrier)
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_me_tag', meOrderId)
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_tracking_active', '1')
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_tracking_status', 'posted')
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_notified_statuses', 'shipped')

      // Update WC order status to "enviado" so portal reflects the change
      await fetch(`${WC_API_URL}/orders/${resolvedWCOrderId}`, {
        method: 'PUT',
        headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'enviado' }),
      })

      await sendOrderShippedWithTracking(
        resolvedWCOrderId,
        wcOrder.billing.first_name,
        wcOrder.billing.email,
        tracking,
        carrier,
        undefined,
      )
      console.log(`[ME Webhook] Tracking registrado: WC #${resolvedWCOrderId} — ${carrier} ${tracking} → status enviado`)
    }

    // Update tracking status if changed
    if (status && getMeta('jaleca_tracking_status') !== status) {
      await updateOrderMeta(resolvedWCOrderId, 'jaleca_tracking_status', status)
      console.log(`[ME Webhook] Status atualizado: WC #${resolvedWCOrderId} → ${status}`)
    }

    return NextResponse.json({ ok: true, wcOrderId: resolvedWCOrderId })
  } catch (err) {
    console.error('[ME Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
