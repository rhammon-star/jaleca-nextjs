import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  sendOrderUnderReview,
  sendOrderInvoiced,
  sendOrderPacking,
  sendOrderCancelled,
  sendOrderRefunded,
} from '@/lib/email'

const WEBHOOK_SECRET = process.env.JALECA_WEBHOOK_SECRET!

const STATUS_MAP: Record<string, 'under_review' | 'invoiced' | 'packing' | 'cancelled' | 'refunded'> = {
  'on-hold':              'under_review',
  'wc-pagamento-analise': 'under_review',
  'pagamento-analise':    'under_review',
  'wc-faturado':          'invoiced',
  'faturado':             'invoiced',
  'wc-em-separacao':      'packing',
  'em-separacao':         'packing',
  'cancelled':            'cancelled',
  'wc-cancelado':         'cancelled',
  'refunded':             'refunded',
  'wc-reembolsado':       'refunded',
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Verifica assinatura WooCommerce nativo (HMAC-SHA256)
    const wcSignature = req.headers.get('x-wc-webhook-signature')
    if (wcSignature) {
      const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
      hmac.update(rawBody, 'utf8')
      const expected = hmac.digest('base64')
      if (expected !== wcSignature) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Formato WooCommerce nativo
      const order = JSON.parse(rawBody) as {
        id: number
        status: string
        total: string
        billing: { first_name: string; last_name: string; email: string }
      }

      const newStatus = order.status
      const action = STATUS_MAP[newStatus] ?? STATUS_MAP['wc-' + newStatus]

      if (!action) {
        return NextResponse.json({ ok: true, skipped: true, reason: `Status "${newStatus}" sem email mapeado` })
      }

      const orderId = order.id
      const customerEmail = order.billing.email
      const customerName = `${order.billing.first_name} ${order.billing.last_name}`.trim()
      const orderTotal = `R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

      await dispatchEmail(action, orderId, customerName, customerEmail, orderTotal)
      console.log(`[Orders Notify WC] Pedido #${orderId} status "${newStatus}" → email "${action}" enviado`)
      return NextResponse.json({ ok: true, action })
    }

    // Formato customizado (functions.php)
    const body = JSON.parse(rawBody) as {
      secret: string
      orderId: number
      newStatus: string
      customerEmail: string
      customerName: string
      orderTotal?: string
    }

    if (body.secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, newStatus, customerEmail, customerName, orderTotal } = body
    const action = STATUS_MAP[newStatus]

    if (!action) {
      return NextResponse.json({ ok: true, skipped: true, reason: `Status "${newStatus}" sem email mapeado` })
    }

    await dispatchEmail(action, orderId, customerName, customerEmail, orderTotal ?? 'N/A')
    console.log(`[Orders Notify] Pedido #${orderId} status "${newStatus}" → email "${action}" enviado`)
    return NextResponse.json({ ok: true, action })

  } catch (err) {
    console.error('[Orders Notify] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function dispatchEmail(
  action: 'under_review' | 'invoiced' | 'packing' | 'cancelled' | 'refunded',
  orderId: number,
  customerName: string,
  customerEmail: string,
  orderTotal: string
) {
  switch (action) {
    case 'under_review':
      await sendOrderUnderReview(orderId, customerName, customerEmail)
      break
    case 'invoiced':
      await sendOrderInvoiced(orderId, customerName, customerEmail)
      break
    case 'packing':
      await sendOrderPacking(orderId, customerName, customerEmail)
      break
    case 'cancelled':
      await sendOrderCancelled(orderId, customerName, customerEmail)
      break
    case 'refunded':
      await sendOrderRefunded(orderId, customerName, customerEmail, orderTotal)
      break
  }
}
