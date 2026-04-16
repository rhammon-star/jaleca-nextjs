import { NextRequest, NextResponse } from 'next/server'

const WC_URL = process.env.WOOCOMMERCE_API_URL!
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function auth() {
  return 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
}

// Retorna dados mínimos de um produto para pré-popular o carrinho
// Suporta retailer IDs do feed Meta como "62358_unica" ou "61201_azul-pastel"
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Extrai só a parte numérica: "62358_unica" → "62358"
  const numericId = id.match(/^(\d+)/)?.[1] ?? id
  const colorKey = id.includes('_') ? id.replace(/^\d+_/, '').replace(/_/g, ' ') : undefined

  const res = await fetch(`${WC_URL}/products/${numericId}`, {
    headers: { Authorization: auth() },
    next: { revalidate: 300 },
  })
  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const p = await res.json()
  const price = p.price || p.regular_price || '0'

  return NextResponse.json({
    id: String(p.id),
    databaseId: p.id,
    slug: p.slug,
    name: p.name,
    image: p.images?.[0]?.src,
    price: `R$\u00a0${parseFloat(price).toFixed(2).replace('.', ',')}`,
    ...(colorKey && { color: colorKey }),
    quantity: 1,
    addedAt: Date.now(),
  })
}
