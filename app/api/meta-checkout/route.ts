import { NextRequest, NextResponse } from 'next/server'

const WC_URL = process.env.WOOCOMMERCE_API_URL!
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function auth() {
  return 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
}

/**
 * Checkout redirect para Instagram/Facebook Shopping.
 *
 * A Meta chama: /api/meta-checkout?products=RETAILER_ID:QTY,RETAILER_ID:QTY[&coupon=CODE]
 *
 * Retailer ID pode ser:
 *   - "123"       → produto simples (WooCommerce product ID)
 *   - "123_cor"   → variação agrupada por cor (parent ID + color key)
 *
 * Para produto único → redireciona para a página do produto
 * Para múltiplos    → redireciona para /produtos
 */
async function resolveSlug(retailerId: string): Promise<string | null> {
  const match = retailerId.match(/^(\d+)(?:_(.+))?$/)
  if (!match) return null
  const [, parentId, colorKey] = match

  try {
    const res = await fetch(`${WC_URL}/products/${parentId}`, {
      headers: { Authorization: auth() },
    })
    if (!res.ok) return null
    const product = await res.json()
    const slug = product.slug as string

    if (colorKey) {
      const cor = colorKey.replace(/_/g, ' ')
      return `/produto/${slug}?cor=${encodeURIComponent(cor)}`
    }
    return `/produto/${slug}`
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const base = 'https://jaleca.com.br'

  // Formato Meta: products=ID:qty,ID:qty
  const productsParam = searchParams.get('products')
  if (productsParam) {
    const entries = productsParam.split(',').map(e => {
      const [id, qty] = e.split(':')
      return { id: id?.trim(), qty: qty?.trim() || '1' }
    }).filter(e => e.id)

    // Produto único → redireciona para a página do produto
    if (entries.length === 1) {
      const path = await resolveSlug(entries[0].id)
      return NextResponse.redirect(path ? `${base}${path}` : base, 302)
    }

    // Múltiplos produtos → loja
    return NextResponse.redirect(`${base}/produtos`, 302)
  }

  // Formato alternativo: id=RETAILER_ID
  const retailerId = searchParams.get('id') || searchParams.get('content_id') || ''
  if (retailerId) {
    const path = await resolveSlug(retailerId)
    return NextResponse.redirect(path ? `${base}${path}` : base, 302)
  }

  return NextResponse.redirect(base, 302)
}
