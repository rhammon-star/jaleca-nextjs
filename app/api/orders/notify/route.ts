import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  sendOrderUnderReview,
  sendOrderInvoiced,
  sendOrderPacking,
  sendOrderCancelled,
  sendOrderRefunded,
  sendReviewRequest,
} from '@/lib/email'

const WEBHOOK_SECRET = process.env.JALECA_WEBHOOK_SECRET!
const WC_URL = process.env.WOOCOMMERCE_API_URL!
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

type Action = 'under_review' | 'invoiced' | 'packing' | 'cancelled' | 'refunded' | 'review_request'

const STATUS_MAP: Record<string, Action> = {
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
  'completed':            'review_request',
  'wc-completed':         'review_request',
}

type WCLineItem = { product_id: number; name: string }

async function getProductSlugs(lineItems: WCLineItem[]): Promise<Array<{ name: string; slug: string }>> {
  const auth = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
  return Promise.all(
    lineItems.map(async item => {
      try {
        const res = await fetch(`${WC_URL}/products/${item.product_id}`, {
          headers: { Authorization: auth },
        })
        if (!res.ok) return { name: item.name, slug: '' }
        const p = await res.json() as { slug: string }
        return { name: item.name, slug: p.slug }
      } catch {
        return { name: item.name, slug: '' }
      }
    })
  ).then(results => results.filter(p => p.slug))
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

      const order = JSON.parse(rawBody) as {
        id: number
        status: string
        total: string
        billing: { first_name: string; last_name: string; email: string }
        line_items?: WCLineItem[]
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

      if (action === 'review_request') {
        const products = order.line_items?.length
          ? await getProductSlugs(order.line_items)
          : []
        await sendReviewRequest(orderId, customerName, customerEmail, products)
      } else {
        await dispatchEmail(action, orderId, customerName, customerEmail, orderTotal)
      }

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

    if (action === 'review_request') {
      // Formato customizado não inclui line_items — busca da WC API
      const auth = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
      const orderRes = await fetch(`${WC_URL}/orders/${orderId}`, { headers: { Authorization: auth } }).catch(() => null)
      const orderData = orderRes?.ok ? await orderRes.json() as { line_items: WCLineItem[] } : null
      const products = orderData?.line_items ? await getProductSlugs(orderData.line_items) : []
      await sendReviewRequest(orderId, customerName, customerEmail, products)
    } else {
      await dispatchEmail(action, orderId, customerName, customerEmail, orderTotal ?? 'N/A')
    }

    console.log(`[Orders Notify] Pedido #${orderId} status "${newStatus}" → email "${action}" enviado`)
    return NextResponse.json({ ok: true, action })

  } catch (err) {
    console.error('[Orders Notify] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function dispatchEmail(
  action: Exclude<Action, 'review_request'>,
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
