import { NextRequest, NextResponse } from 'next/server'
import { sendReviewRequest } from '@/lib/email'

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth() {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type WCOrder = {
  id: number
  number: string
  billing: { first_name: string; email: string }
  line_items: Array<{ name: string; product_id: number }>
  meta_data: Array<{ key: string; value: string }>
}

type WCProduct = { id: number; slug: string }

export async function POST(req: NextRequest) {
  // Auth: mesmo CRON_SECRET (chamado pelo script mass-review-request.mjs)
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const orderId = body?.orderId
  if (!orderId || typeof orderId !== 'number') {
    return NextResponse.json({ error: 'orderId required' }, { status: 400 })
  }

  try {
    // Busca o pedido
    const orderRes = await fetch(`${WC_API_URL}/orders/${orderId}`, {
      headers: { Authorization: wcAuth() }, cache: 'no-store',
    })
    if (!orderRes.ok) return NextResponse.json({ error: 'order not found' }, { status: 404 })
    const order: WCOrder = await orderRes.json()

    // Já enviado? skip
    if (order.meta_data?.find(m => m.key === 'jaleca_review_request_sent')?.value === '1') {
      return NextResponse.json({ ok: true, skipped: 'already_sent' })
    }
    if (!order.billing?.email) {
      return NextResponse.json({ error: 'no email' }, { status: 400 })
    }

    // Busca slugs dos produtos
    const productIds = order.line_items.map(i => i.product_id)
    let products: Array<{ name: string; slug: string }> = []
    if (productIds.length > 0) {
      const ids = productIds.join(',')
      const prodRes = await fetch(`${WC_API_URL}/products?include=${ids}&per_page=100`, {
        headers: { Authorization: wcAuth() }, cache: 'no-store',
      })
      if (prodRes.ok) {
        const prods: WCProduct[] = await prodRes.json()
        const slugMap = Object.fromEntries(prods.map(p => [p.id, p.slug]))
        products = order.line_items.map(i => ({
          name: i.name, slug: slugMap[i.product_id] ?? '',
        })).filter(p => p.slug)
      }
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'no products with slugs' }, { status: 400 })
    }

    // Envia o e-mail
    await sendReviewRequest(order.number || String(order.id), order.billing.first_name, order.billing.email, products)

    // Marca como enviado
    await fetch(`${WC_API_URL}/orders/${order.id}`, {
      method: 'PUT',
      headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta_data: [{ key: 'jaleca_review_request_sent', value: '1' }] }),
    })

    return NextResponse.json({ ok: true, sent: true, orderId: order.id, email: order.billing.email })
  } catch (err) {
    console.error('[Mass Review Single] Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
