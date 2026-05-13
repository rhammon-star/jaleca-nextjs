import { ImageResponse } from 'next/og'
import { graphqlClient } from '@/lib/graphql'

export const runtime = 'nodejs'
export const revalidate = 86400
export const alt = 'Jaleca — Jaleco profissional'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Img = { sourceUrl?: string; altText?: string }
type Variation = {
  price?: string
  regularPrice?: string
  image?: Img
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

function pickImage(product: ProductData): string | undefined {
  const main = product.image?.sourceUrl
  if (main) return main
  const gallery = product.galleryImages?.nodes?.find((g) => g.sourceUrl)?.sourceUrl
  if (gallery) return gallery
  const firstVar = product.variations?.nodes?.find((v) => v.image?.sourceUrl)?.image?.sourceUrl
  return firstVar
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product: ProductData | null = null
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(OG_QUERY, { slug })
    product = data.product
  } catch {
    product = null
  }

  const name = product?.name ?? 'Jaleco profissional'
  const low = product ? lowestPrice(product) : undefined
  const priceLabel = low !== undefined ? `R$ ${low.toFixed(0)}` : null
  const imgUrl = product ? pickImage(product) : undefined

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
