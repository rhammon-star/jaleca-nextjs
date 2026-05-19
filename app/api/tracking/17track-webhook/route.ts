import { NextRequest, NextResponse } from 'next/server'
import {
  sendOrderInTransit,
  sendOrderOutForDelivery,
  sendOrderDelivered,
} from '@/lib/email'

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

async function addOrderNote(orderId: number, note: string) {
  await fetch(`${WC_API_URL}/orders/${orderId}/notes`, {
    method: 'POST',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ note, customer_note: false }),
  })
}

async function completeOrder(orderId: number) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  })
}

type WCOrderLite = {
  id: number
  billing: { first_name: string; email: string }
  meta_data: Array<{ key: string; value: string }>
}

async function findWCOrderByTracking(trackingCode: string): Promise<WCOrderLite | null> {
  // Search recent shipped orders for matching tracking code
  const res = await fetch(`${WC_API_URL}/orders?per_page=50&status=enviado,processing,completed`, {
    headers: { Authorization: wcAuth() }, cache: 'no-store',
  })
  if (!res.ok) return null
  const orders = await res.json() as WCOrderLite[]
  return orders.find(o => o.meta_data?.some(m => m.key === 'jaleca_tracking_code' && m.value === trackingCode)) ?? null
}

/**
 * 17track webhook receiver.
 * Configure at https://api.17track.net/ → Webhook → URL: https://www.jaleca.com.br/api/tracking/17track-webhook
 * Sends events when tracking status changes (InTransit, OutForDelivery, Delivered, etc.)
 */
export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await req.json() as Record<string, any>
    const event = body.event ?? body.event_type ?? ''
    const data = body.data ?? {}
    const trackingCode: string = data.number ?? ''

    if (!trackingCode) {
      // 17track sends a test ping without a tracking number
      console.log('[17track Webhook] Test ping received — OK')
      return NextResponse.json({ ok: true })
    }

    // Status normalization — v2.4 uses latest_status.status (Title-cased)
    const rawStatus: string = data.track_info?.latest_status?.status
      ?? data.track_info?.latest_status?.sub_status
      ?? data.latest_status
      ?? ''
    const status = String(rawStatus).toLowerCase().replace(/[^a-z]/g, '')

    console.log(`[17track Webhook] event=${event} tracking=${trackingCode} status="${rawStatus}"`)

    // Find matching WC order
    const order = await findWCOrderByTracking(trackingCode)
    if (!order) {
      console.log(`[17track Webhook] No WC order found for tracking ${trackingCode}`)
      return NextResponse.json({ ok: true, matched: false })
    }

    const orderId = order.id
    const firstName = order.billing.first_name
    const email = order.billing.email
    const carrier = order.meta_data.find(m => m.key === 'jaleca_tracking_carrier')?.value || 'Transportadora'
    const notifiedRaw = order.meta_data.find(m => m.key === 'jaleca_notified_statuses')?.value || ''
    const notified = notifiedRaw.split(',').filter(Boolean)

    if (!email) return NextResponse.json({ ok: true, skipped: 'no-email' })

    // Map 17track status → action
    const isInTransit = ['intransit', 'received', 'pickedup', 'pickup'].some(s => status.includes(s))
    const isOutForDelivery = status.includes('outfordelivery') || status.includes('outdelivery')
    const isDelivered = status === 'delivered' || status.includes('delivered')

    let action: 'in_transit' | 'out_for_delivery' | 'delivered' | null = null
    if (isDelivered) action = 'delivered'
    else if (isOutForDelivery) action = 'out_for_delivery'
    else if (isInTransit) action = 'in_transit'

    if (!action) {
      console.log(`[17track Webhook] Status "${rawStatus}" não mapeado para email`)
      return NextResponse.json({ ok: true, matched: true, action: null })
    }

    if (notified.includes(action)) {
      return NextResponse.json({ ok: true, matched: true, action, skipped: 'already-notified' })
    }

    if (action === 'in_transit') {
      await sendOrderInTransit(orderId, firstName, email, trackingCode, carrier)
    } else if (action === 'out_for_delivery') {
      await sendOrderOutForDelivery(orderId, firstName, email, trackingCode)
    } else if (action === 'delivered') {
      await sendOrderDelivered(orderId, firstName, email)
      await updateOrderMeta(orderId, 'jaleca_tracking_active', '0')
      await completeOrder(orderId)
    }

    notified.push(action)
    await updateOrderMeta(orderId, 'jaleca_notified_statuses', notified.join(','))
    await updateOrderMeta(orderId, 'jaleca_tracking_status', action)
    await addOrderNote(orderId, `📦 17track: ${rawStatus} — email "${action}" enviado ao cliente`)

    console.log(`[17track Webhook] Pedido #${orderId} → email "${action}" enviado`)
    return NextResponse.json({ ok: true, matched: true, action })
  } catch (err) {
    console.error('[17track Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
