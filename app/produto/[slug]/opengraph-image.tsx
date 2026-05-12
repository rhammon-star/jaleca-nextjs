import { ImageResponse } from 'next/og'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'

export const runtime = 'nodejs'
export const revalidate = 86400
export const alt = 'Jaleca — Jaleco profissional'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type ProductData = {
  name?: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl?: string; altText?: string }
}

function formatPrice(raw?: string): string | null {
  if (!raw) return null
  const m = raw.match(/[\d.,]+/g)
  if (!m) return null
  const last = m[m.length - 1].replace(/\./g, '').replace(',', '.')
  const n = Number(last)
  if (!Number.isFinite(n) || n <= 0) return null
  return `R$ ${n.toFixed(0)}`
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product: ProductData | null = null
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    product = data.product
  } catch {
    product = null
  }

  const name = product?.name ?? 'Jaleco profissional'
  const priceLabel = formatPrice(product?.price) ?? formatPrice(product?.regularPrice)
  const imgUrl = product?.image?.sourceUrl

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
