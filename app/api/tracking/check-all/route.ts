import { NextRequest, NextResponse } from 'next/server'
import { trackShipments, getMEShippedOrdersByTag } from '@/lib/melhor-envio'
import {
  sendOrderInTransit,
  sendOrderOutForDelivery,
  sendOrderDelivered,
  sendOrderShippedWithTracking,
} from '@/lib/email'

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth() {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type WCOrder = {
  id: number
  number: string
  status: string
  billing: { first_name: string; last_name: string; email: string }
  meta_data: Array<{ key: string; value: string }>
}

function getMeta(order: WCOrder, key: string): string {
  return order.meta_data.find(m => m.key === key)?.value ?? ''
}

async function getActiveTrackingOrders(): Promise<WCOrder[]> {
  // Busca pedidos com rastreio ativo (status shipped/processing/on-hold)
  const statuses = ['wc-enviado', 'processing', 'on-hold', 'wc-em-separacao'].join(',')
  const url = `${WC_API_URL}/orders?per_page=50&status=${statuses}`
  const res = await fetch(url, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (!res.ok) return []
  const orders = await res.json() as WCOrder[]
  // Filtra apenas os que têm rastreio ativo
  return orders.filter(o => getMeta(o, 'jaleca_tracking_active') === '1' && getMeta(o, 'jaleca_me_tag'))
}

async function getPendingTrackingOrders(): Promise<WCOrder[]> {
  // Busca pedidos que têm jaleca_me_cart_id mas ainda não têm rastreio registrado
  const statuses = ['processing', 'on-hold'].join(',')
  const url = `${WC_API_URL}/orders?per_page=50&status=${statuses}`
  const res = await fetch(url, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (!res.ok) return []
  const orders = await res.json() as WCOrder[]
  return orders.filter(o =>
    getMeta(o, 'jaleca_me_cart_id') &&
    getMeta(o, 'jaleca_tracking_active') !== '1'
  )
}

async function updateOrderMeta(orderId: number, key: string, value: string) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta_data: [{ key, value }] }),
  })
}

async function completeOrder(orderId: number) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  })
}

export async function GET(req: NextRequest) {
  // Verifica se é cron do Vercel ou chamada interna autorizada
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ── Step 0: Auto-detect newly generated labels from Melhor Envio ──────────
    const pendingOrders = await getPendingTrackingOrders()
    if (pendingOrders.length > 0) {
      const wcOrderIds = pendingOrders.map(o => o.id)
      const shippedMeOrders = await getMEShippedOrdersByTag(wcOrderIds)

      for (const meOrder of shippedMeOrders) {
        const wcOrderTag = meOrder.tags?.find(t => t.tag.startsWith('wc-order-'))?.tag
        const wcOrderId = wcOrderTag ? parseInt(wcOrderTag.replace('wc-order-', ''), 10) : null
        if (!wcOrderId || !meOrder.tracking) continue

        const wcOrder = pendingOrders.find(o => o.id === wcOrderId)
        if (!wcOrder) continue

        const trackingCode = meOrder.tracking
        const carrier = meOrder.service?.name || 'Transportadora'

        // Register tracking in WC meta
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_code', trackingCode)
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_carrier', carrier)
        await updateOrderMeta(wcOrderId, 'jaleca_me_tag', meOrder.id)
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_active', '1')
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_status', 'posted')
        await updateOrderMeta(wcOrderId, 'jaleca_notified_statuses', 'shipped')

        // Send "shipped" email
        const firstName = wcOrder.billing.first_name
        const email = wcOrder.billing.email
        await sendOrderShippedWithTracking(wcOrderId, firstName, email, trackingCode, carrier, undefined)

        console.log(`[Tracking Check-All] Auto-registrado: pedido WC #${wcOrderId} — ${carrier} ${trackingCode}`)
      }
    }

    // ── Step 1: Check active tracking orders ─────────────────────────────────
    const orders = await getActiveTrackingOrders()
    if (orders.length === 0) {
      return NextResponse.json({ ok: true, checked: 0 })
    }

    const meTags = orders.map(o => getMeta(o, 'jaleca_me_tag')).filter(Boolean)
    const trackingResults = await trackShipments(meTags)

    let notified = 0

    for (const order of orders) {
      const meTag = getMeta(order, 'jaleca_me_tag')
      const trackingCode = getMeta(order, 'jaleca_tracking_code')
      const carrier = getMeta(order, 'jaleca_tracking_carrier') || 'Transportadora'
      const notifiedStatuses = getMeta(order, 'jaleca_notified_statuses').split(',')

      const result = trackingResults.find(r => r.meTag === meTag)
      if (!result || result.error) continue

      const { status } = result
      const firstName = order.billing.first_name
      const email = order.billing.email
      const orderId = order.id

      if (status === 'in_transit' && !notifiedStatuses.includes('in_transit')) {
        await sendOrderInTransit(orderId, firstName, email, trackingCode, carrier)
        notifiedStatuses.push('in_transit')
        await updateOrderMeta(orderId, 'jaleca_notified_statuses', notifiedStatuses.join(','))
        await updateOrderMeta(orderId, 'jaleca_tracking_status', 'in_transit')
        notified++
      }

      if (status === 'out_for_delivery' && !notifiedStatuses.includes('out_for_delivery')) {
        await sendOrderOutForDelivery(orderId, firstName, email, trackingCode)
        notifiedStatuses.push('out_for_delivery')
        await updateOrderMeta(orderId, 'jaleca_notified_statuses', notifiedStatuses.join(','))
        await updateOrderMeta(orderId, 'jaleca_tracking_status', 'out_for_delivery')
        notified++
      }

      if (status === 'delivered' && !notifiedStatuses.includes('delivered')) {
        await sendOrderDelivered(orderId, firstName, email)
        notifiedStatuses.push('delivered')
        await updateOrderMeta(orderId, 'jaleca_notified_statuses', notifiedStatuses.join(','))
        await updateOrderMeta(orderId, 'jaleca_tracking_status', 'delivered')
        await updateOrderMeta(orderId, 'jaleca_tracking_active', '0')
        await completeOrder(orderId) // muda status para Concluído automaticamente
        notified++
      }
    }

    console.log(`[Tracking Check-All] Verificados: ${orders.length} | Emails enviados: ${notified}`)
    return NextResponse.json({ ok: true, checked: orders.length, notified })
  } catch (err) {
    console.error('[Tracking Check-All] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
