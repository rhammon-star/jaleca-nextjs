import { NextRequest, NextResponse } from 'next/server'
import { trackShipments, getRecentShippedMEOrders, type MEShippedOrder } from '@/lib/melhor-envio'
import { register17track } from '@/lib/track17'
import {
  sendOrderInTransit,
  sendOrderOutForDelivery,
  sendOrderDelivered,
  sendOrderShippedWithTracking,
  sendOrderShippedManual,
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
      const shippedMeOrders = await getRecentShippedMEOrders()

      // Build resolver: tag match (primary) → CPF match (fallback)
      const pendingByCpf = new Map<string, WCOrder>()
      for (const o of pendingOrders) {
        const cpf = getMeta(o, 'billing_cpf').replace(/\D/g, '')
        if (cpf) pendingByCpf.set(cpf, o)
      }

      const resolveWCOrder = (meOrder: MEShippedOrder): { wc: WCOrder; via: 'tag' | 'cpf' } | null => {
        const wcOrderTag = meOrder.tags?.find(t => t.tag.startsWith('wc-order-'))?.tag
        if (wcOrderTag) {
          const id = parseInt(wcOrderTag.replace('wc-order-', ''), 10)
          const wc = pendingOrders.find(o => o.id === id)
          if (wc) return { wc, via: 'tag' }
        }
        const cpf = (meOrder.to?.document || '').replace(/\D/g, '')
        if (cpf) {
          const wc = pendingByCpf.get(cpf)
          if (wc) return { wc, via: 'cpf' }
        }
        return null
      }

      for (const meOrder of shippedMeOrders) {
        if (!meOrder.tracking) continue
        const match = resolveWCOrder(meOrder)
        if (!match) continue

        const wcOrderId = match.wc.id
        const trackingCode = meOrder.tracking
        const carrier = meOrder.service?.name || 'Transportadora'

        // Register tracking in WC meta
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_code', trackingCode)
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_carrier', carrier)
        await updateOrderMeta(wcOrderId, 'jaleca_me_tag', meOrder.id)
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_active', '1')
        await updateOrderMeta(wcOrderId, 'jaleca_tracking_status', 'posted')
        await updateOrderMeta(wcOrderId, 'jaleca_notified_statuses', 'shipped')

        // Update WC order status to "enviado" so portal reflects the change
        await fetch(`${WC_API_URL}/orders/${wcOrderId}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'enviado' }),
        })

        // Send "shipped" email
        const firstName = match.wc.billing.first_name
        const email = match.wc.billing.email
        const matchNote = match.via === 'cpf' ? ' (casado por CPF — sem tag wc-order)' : ''
        await addOrderNote(wcOrderId, `Código de rastreio: ${trackingCode} | Transportadora: ${carrier}${matchNote}`)
        await sendOrderShippedWithTracking(wcOrderId, firstName, email, trackingCode, carrier, undefined)
        // Registra no 17track para receber eventos de movimentação via webhook
        await register17track([{ trackingCode, carrierName: carrier }])
          .catch(err => console.error('[Tracking Check-All] register17track failed:', err))

        // Remove from pending pool to avoid double-processing in same run
        pendingByCpf.delete((meOrder.to?.document || '').replace(/\D/g, ''))

        console.log(`[Tracking Check-All] Auto-registrado via ${match.via}: pedido WC #${wcOrderId} — ${carrier} ${trackingCode} → status enviado`)
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

    // ── Step 1b: Backfill 17track — registra códigos já existentes ainda não registrados
    try {
      const toRegister: Array<{ orderId: number; trackingCode: string; carrierName: string }> = []
      for (const o of orders) {
        if (getMeta(o, 'jaleca_17track_registered') === '1') continue
        const code = getMeta(o, 'jaleca_tracking_code')
        const carrier = getMeta(o, 'jaleca_tracking_carrier') || 'Correios'
        if (code) toRegister.push({ orderId: o.id, trackingCode: code, carrierName: carrier })
      }
      if (toRegister.length > 0) {
        const result = await register17track(toRegister.map(t => ({ trackingCode: t.trackingCode, carrierName: t.carrierName })))
        if (result) {
          for (const t of toRegister) {
            await updateOrderMeta(t.orderId, 'jaleca_17track_registered', '1')
          }
          console.log(`[Tracking Check-All] 17track backfill: ${toRegister.length} pedidos registrados`)
        }
      }
    } catch (err) {
      console.error('[Tracking Check-All] 17track backfill error:', err)
    }

    // ── Step 2: Pedidos marcados como "enviado" manualmente sem código ME ─────
    // Cliente precisa ser avisado mesmo que o ME ainda não tenha gerado etiqueta.
    let manualNotified = 0
    try {
      const manualRes = await fetch(`${WC_API_URL}/orders?per_page=50&status=enviado`, {
        headers: { Authorization: wcAuth() }, cache: 'no-store',
      })
      if (manualRes.ok) {
        const manualOrders = await manualRes.json() as WCOrder[]
        for (const o of manualOrders) {
          const already = getMeta(o, 'jaleca_notified_statuses')
          const hasTracking = getMeta(o, 'jaleca_tracking_active') === '1'
          if (already.includes('shipped') || hasTracking) continue
          const email = o.billing?.email
          const firstName = o.billing?.first_name
          if (!email) continue
          await sendOrderShippedManual(o.id, firstName, email)
          await updateOrderMeta(o.id, 'jaleca_notified_statuses', 'shipped_manual')
          await addOrderNote(o.id, '✉️ Email "pedido despachado" (sem rastreio) enviado ao cliente.')
          manualNotified++
        }
      }
    } catch (err) {
      console.error('[Tracking Check-All] manual-shipped step error:', err)
    }

    console.log(`[Tracking Check-All] Verificados: ${orders.length} | Emails tracking: ${notified} | Emails manual-shipped: ${manualNotified}`)
    return NextResponse.json({ ok: true, checked: orders.length, notified, manualNotified })
  } catch (err) {
    console.error('[Tracking Check-All] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
