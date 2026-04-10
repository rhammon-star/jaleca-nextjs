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
  status: string
  date_completed: string | null
  billing: { first_name: string; email: string }
  line_items: Array<{ name: string; product_id: number }>
  meta_data: Array<{ key: string; value: string }>
}

type WCProduct = {
  id: number
  slug: string
}

async function getProductSlugs(productIds: number[]): Promise<Record<number, string>> {
  if (productIds.length === 0) return {}
  const ids = productIds.join(',')
  try {
    const res = await fetch(`${WC_API_URL}/products?include=${ids}&per_page=100`, {
      headers: { Authorization: wcAuth() },
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const products = await res.json() as WCProduct[]
    return Object.fromEntries(products.map(p => [p.id, p.slug]))
  } catch {
    return {}
  }
}

async function markReviewRequestSent(orderId: number) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta_data: [{ key: 'jaleca_review_request_sent', value: '1' }] }),
  })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Pedidos concluídos nos últimos 30 dias
    const after = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${WC_API_URL}/orders?status=completed&per_page=50&after=${after}`,
      { headers: { Authorization: wcAuth() }, cache: 'no-store' }
    )

    if (!res.ok) return NextResponse.json({ error: 'WC fetch failed' }, { status: 500 })

    const orders = await res.json() as WCOrder[]
    const now = Date.now()
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
    const EIGHT_DAYS = 8 * 24 * 60 * 60 * 1000

    // Filtra pedidos elegíveis antes de buscar slugs
    const eligible = orders.filter(order => {
      if (order.meta_data.find(m => m.key === 'jaleca_review_request_sent')?.value === '1') return false
      if (!order.billing.email || !order.date_completed) return false
      const elapsed = now - new Date(order.date_completed).getTime()
      return elapsed >= SEVEN_DAYS && elapsed <= EIGHT_DAYS
    })

    if (eligible.length === 0) {
      return NextResponse.json({ ok: true, checked: orders.length, sent: 0 })
    }

    // Busca slugs de todos os produtos dos pedidos elegíveis (uma única chamada)
    const allProductIds = [...new Set(eligible.flatMap(o => o.line_items.map(i => i.product_id)))]
    const slugMap = await getProductSlugs(allProductIds)

    let sent = 0

    for (const order of eligible) {
      const { first_name, email } = order.billing
      const products = order.line_items.map(i => ({
        name: i.name,
        slug: slugMap[i.product_id] ?? '',
      })).filter(p => p.slug)

      if (products.length === 0) continue

      await sendReviewRequest(order.number || String(order.id), first_name, email, products)
      await markReviewRequestSent(order.id)
      sent++
    }

    console.log(`[Review Request] Verificados: ${orders.length} | Elegíveis: ${eligible.length} | Enviados: ${sent}`)
    return NextResponse.json({ ok: true, checked: orders.length, sent })
  } catch (err) {
    console.error('[Review Request] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
