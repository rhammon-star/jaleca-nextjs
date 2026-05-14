import howtoData from './profession-howto-data.json'

type HowToEntry = {
  occupationName: string
  isMedical: boolean
  howToName: string
  steps: { name: string; text: string }[]
}

const DATA = howtoData as Record<string, HowToEntry>

export function getProfessionData(slug: string): HowToEntry | null {
  return DATA[slug] ?? null
}

export function buildHowToSchema(slug: string, pageUrl: string) {
  const d = DATA[slug]
  if (!d) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: d.howToName,
    inLanguage: 'pt-BR',
    totalTime: 'PT5M',
    mainEntityOfPage: pageUrl,
    step: d.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${pageUrl}#step-${i + 1}`,
    })),
  }
}

export function buildOccupationSchema(slug: string, pageUrl: string) {
  const d = DATA[slug]
  if (!d) return null
  const type = d.isMedical ? 'MedicalBusiness' : 'Occupation'
  if (d.isMedical) {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalAudience',
      audienceType: d.occupationName,
      healthCondition: { '@type': 'MedicalCondition', name: 'Saúde ocupacional' },
      url: pageUrl,
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: d.occupationName,
    occupationalCategory: d.occupationName,
    url: pageUrl,
  }
}

export const AI_CONTENT_DECLARATION = 'human-authored-with-ai-assistance' as const

type ItemListProduct = {
  name?: string
  slug?: string
  image?: { sourceUrl?: string | null } | string | null
  price?: string | null
  regularPrice?: string | null
  stockStatus?: string | null
  sku?: string | null
}

function priceToNumber(p?: string | null): number | null {
  if (!p) return null
  const s = String(p).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const n = parseFloat(s)
  return isFinite(n) && n > 0 ? n : null
}

const FALLBACK_PRODUCT_IMAGE = 'https://jaleca.com.br/og-home.jpg'

export function buildProductListSchema(produtos: ItemListProduct[], pageUrl: string) {
  if (!produtos || produtos.length === 0) return null
  return produtos.map((p) => {
    const img = (typeof p.image === 'string' ? p.image : p.image?.sourceUrl ?? undefined) || FALLBACK_PRODUCT_IMAGE
    const price = priceToNumber(p.price) ?? priceToNumber(p.regularPrice)
    const productUrl = p.slug ? `https://jaleca.com.br/produto/${p.slug}` : pageUrl
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      url: productUrl,
      image: img,
      ...(p.sku ? { sku: p.sku } : { mpn: p.slug }),
      brand: { '@type': 'Brand', name: 'Jaleca' },
      ...(price ? {
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'BRL',
          price: price.toFixed(2),
          availability: p.stockStatus === 'OUT_OF_STOCK'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Jaleca' },
        },
      } : {}),
    }
  })
}

type ReviewItem = { authorName: string; rating: number; text: string; relativeTime?: string }
export function buildReviewSchema(reviews: ReviewItem[] | undefined, pageUrl: string, productName: string) {
  if (!reviews || reviews.length === 0) return null
  return reviews.slice(0, 5).map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: productName, url: pageUrl },
    author: { '@type': 'Person', name: r.authorName },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
    publisher: { '@type': 'Organization', name: 'Google' },
  }))
}

export function buildItemListSchema(produtos: ItemListProduct[], pageUrl: string, listName: string) {
  if (!produtos || produtos.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: produtos.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: produtos.map((p, i) => {
      const img = typeof p.image === 'string' ? p.image : p.image?.sourceUrl ?? undefined
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: p.slug ? `https://jaleca.com.br/produto/${p.slug}` : pageUrl,
        name: p.name,
        ...(img ? { image: img } : {}),
      }
    }),
  }
}
