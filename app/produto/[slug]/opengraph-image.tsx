import { ImageResponse } from 'next/og'
import { graphqlClient } from '@/lib/graphql'

export const runtime = 'nodejs'
export const revalidate = 86400
export const alt = 'Jaleca — Jaleco profissional'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Img = { sourceUrl?: string; altText?: string }
type Attribute = { name?: string; value?: string }
type Variation = {
  price?: string
  regularPrice?: string
  image?: Img
  attributes?: { nodes?: Attribute[] }
}
type ProductData = {
  name?: string
  price?: string
  regularPrice?: string
  image?: Img
  galleryImages?: { nodes?: Img[] }
  variations?: { nodes?: Variation[] }
}

const OG_QUERY = `
  query OgProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      name
      ... on SimpleProduct {
        price
        regularPrice
        image { sourceUrl }
        galleryImages { nodes { sourceUrl } }
      }
      ... on VariableProduct {
        price
        regularPrice
        image { sourceUrl }
        galleryImages { nodes { sourceUrl } }
        variations(first: 50) {
          nodes {
            price
            regularPrice
            image { sourceUrl }
            attributes { nodes { name value } }
          }
        }
      }
    }
  }
`

function parsePrice(raw?: string | null): number | undefined {
  if (!raw) return undefined
  const matches = String(raw).match(/[\d][\d.,]*/g)
  if (!matches) return undefined
  const nums = matches
    .map((t) => {
      let s = t
      if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
      const n = Number(s)
      return Number.isFinite(n) && n > 0 ? n : undefined
    })
    .filter((n): n is number => n !== undefined)
  return nums.length ? Math.min(...nums) : undefined
}

function lowestPrice(product: ProductData): number | undefined {
  const vNodes = product.variations?.nodes ?? []
  const variationPrices = vNodes
    .flatMap((v) => [parsePrice(v.price), parsePrice(v.regularPrice)])
    .filter((n): n is number => n !== undefined)
  if (variationPrices.length) return Math.min(...variationPrices)
  return parsePrice(product.price) ?? parsePrice(product.regularPrice)
}

function norm(s?: string): string {
  return (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function findWhiteVariationImage(product: ProductData): string | undefined {
  const whiteTokens = new Set(['branco', 'branca', 'white'])
  // Bug 19/05: WooCommerce na Jaleca usa `pa_color` (inglês, não pa_cor).
  // `.includes('cor')` NÃO casa com "pa_color" (color tem c-o-l, não c-o-r).
  // Por isso checa ambos: "cor" (pt) E "color" (en) E os nomes exatos.
  const colorAttrPatterns = ['cor', 'color']
  for (const v of product.variations?.nodes ?? []) {
    const attrs = v.attributes?.nodes ?? []
    const hasColorAttr = attrs.some(a => {
      const n = norm(a.name)
      const val = norm(a.value)
      const isColorAttr = colorAttrPatterns.some(p => n.includes(p))
      return isColorAttr && whiteTokens.has(val)
    })
    if (hasColorAttr && v.image?.sourceUrl) return v.image.sourceUrl
  }
  return undefined
}

function pickImage(product: ProductData): string | undefined {
  // Sempre prioriza a variação branca, se existir — miniatura compartilhada uniforme
  const white = findWhiteVariationImage(product)
  const candidates: string[] = []
  if (white) candidates.push(white)
  if (product.image?.sourceUrl) candidates.push(product.image.sourceUrl)
  for (const g of product.galleryImages?.nodes ?? []) {
    if (g.sourceUrl) candidates.push(g.sourceUrl)
  }
  for (const v of product.variations?.nodes ?? []) {
    if (v.image?.sourceUrl) candidates.push(v.image.sourceUrl)
  }
  // next/og (Satori) é mais estável com JPG/PNG do que WebP — prefere não-webp
  // (mas mantém a branca no topo mesmo se for webp)
  if (white) return white
  const nonWebp = candidates.find((u) => !/\.webp(\?|$)/i.test(u))
  return nonWebp ?? candidates[0]
}

async function fetchImageAsDataUri(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 6000)
    const res = await fetch(url, { cache: 'force-cache', signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || 'image/jpeg'
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength > 2_000_000) return null // > 2MB: passa URL direta em vez
    return `data:${ct};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

async function fetchProduct(slug: string): Promise<ProductData | null> {
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(OG_QUERY, { slug })
    return data.product
  } catch {
    return null
  }
}

// Tenta resolver slug. Se não achar produto, vai removendo o último segmento
// (caso de páginas filhas de cor: "...-jaleca-branco" → "...-jaleca")
async function resolveProductBySlug(slug: string): Promise<ProductData | null> {
  let current = slug
  for (let i = 0; i < 3; i++) {
    const p = await fetchProduct(current).catch(() => null)
    if (p) return p
    const lastDash = current.lastIndexOf('-')
    if (lastDash <= 0) break
    current = current.slice(0, lastDash)
  }
  return null
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let product: ProductData | null = null
  try {
    product = await resolveProductBySlug(slug)
  } catch {
    product = null
  }

  const name = product?.name ?? 'Jaleco profissional'
  const low = product ? lowestPrice(product) : undefined
  const priceLabel = low !== undefined ? `R$ ${low.toFixed(0)}` : null
  const rawImgUrl = product ? pickImage(product) : undefined
  const imgUrl = rawImgUrl ? (await fetchImageAsDataUri(rawImgUrl).catch(() => null)) ?? rawImgUrl : undefined

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f9f7f4',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Coluna esquerda — foto */}
        <div
          style={{
            width: 580,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e5e0d8',
            overflow: 'hidden',
          }}
        >
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={name}
              width={580}
              height={630}
              style={{ width: 580, height: 630, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                fontSize: 64,
                color: '#c8c4bc',
                fontStyle: 'italic',
                fontFamily: 'serif',
                display: 'flex',
              }}
            >
              Jaleca
            </div>
          )}
        </div>

        {/* Coluna direita — texto */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 56px',
            background: '#f9f7f4',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 6,
                textTransform: 'uppercase',
                color: '#c8a96e',
                marginBottom: 32,
                display: 'flex',
              }}
            >
              JALECA
            </div>
            <div
              style={{
                fontSize: 46,
                lineHeight: 1.15,
                color: '#1a1a1a',
                fontWeight: 500,
                marginBottom: 24,
                display: 'flex',
              }}
            >
              {name.length > 70 ? name.slice(0, 67) + '…' : name}
            </div>
            {priceLabel && (
              <div
                style={{
                  fontSize: 64,
                  color: '#1a1a1a',
                  fontWeight: 700,
                  marginTop: 8,
                  display: 'flex',
                }}
              >
                {priceLabel}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                fontSize: 22,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ color: '#c8a96e' }}>★ 4.9</span>
              <span style={{ color: '#6b6b6b' }}>· +200.000 vendidos</span>
            </div>
            <div
              style={{
                fontSize: 22,
                color: '#6b6b6b',
                display: 'flex',
              }}
            >
              Frete grátis Sudeste · Troca em 7 dias
            </div>
            <div
              style={{
                fontSize: 20,
                color: '#1a1a1a',
                marginTop: 8,
                display: 'flex',
                fontWeight: 600,
              }}
            >
              jaleca.com.br
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
