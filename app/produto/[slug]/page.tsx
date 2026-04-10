import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { cache } from 'react'
import { graphqlClient, GET_PRODUCT_BY_SLUG, GET_RELATED_PRODUCTS } from '@/lib/graphql'
import ProductDetailClient from './ProductDetailClient'
import { getProductReviews, type WCReview } from '@/lib/woocommerce'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { sendMetaViewContent } from '@/lib/meta-conversions'

export const revalidate = 3600

type ProductData = Record<string, unknown> & {
  name?: string
  description?: string
  shortDescription?: string
  sku?: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl: string; altText: string }
  stockStatus?: string
}

const getProduct = cache(async (slug: string): Promise<ProductData | null> => {
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    return data.product
  } catch {
    return null
  }
})

async function getRelated(categorySlugs: string[], productId: string): Promise<WooProduct[]> {
  for (const categorySlug of categorySlugs) {
    try {
      const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
        GET_RELATED_PRODUCTS,
        { categorySlug, first: 8 }
      )
      const results = data.products.nodes.filter(p => p.id !== productId).slice(0, 4)
      if (results.length > 0) return results
    } catch {
      // try next category
    }
  }
  return []
}

async function getCachedReviews(databaseId: number): Promise<WCReview[]> {
  try {
    return await getProductReviews(databaseId)
  } catch {
    return []
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Produto não encontrado — Jaleca' }

  const name = String(product.name || '').replace(/ - Jaleca$/i, '')
  const shortDesc = product.shortDescription
    ? stripHtml(String(product.shortDescription)).slice(0, 160)
    : null
  const longDesc = product.description
    ? stripHtml(String(product.description)).slice(0, 160)
    : null
  const description = shortDesc || longDesc || `Compre ${name} na Jaleca. Uniformes profissionais premium.`
  const imageUrl = product.image?.sourceUrl

  return {
    title: name,
    description,
    alternates: { canonical: `https://jaleca.com.br/produto/${slug}` },
    openGraph: {
      title: name,
      description,
      url: `https://jaleca.com.br/produto/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      images: imageUrl ? [{ url: imageUrl, alt: name }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const name = String(product.name || '').replace(/ - Jaleca$/i, '')
  const shortDesc = product.shortDescription
    ? stripHtml(String(product.shortDescription)).slice(0, 200)
    : null
  const longDesc = product.description
    ? stripHtml(String(product.description)).slice(0, 200)
    : null
  const description = shortDesc || longDesc || `Uniforme profissional premium da Jaleca.`

  const databaseId = Number(product.databaseId)

  // CAPI ViewContent — server-side, sem bloquear o render
  const reqHeaders = await headers()
  const clientIp = reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? reqHeaders.get('x-real-ip') ?? undefined
  const clientUserAgent = reqHeaders.get('user-agent') ?? undefined
  sendMetaViewContent(
    { clientIp, clientUserAgent },
    {
      id: String(databaseId),
      name,
      value: parseFloat(String(product.price ?? '').replace(/[^0-9,]/g, '').replace(',', '.')) || undefined,
    },
    `https://jaleca.com.br/produto/${slug}`
  ).catch(() => {})

  // Fetch reviews and related products in parallel — all cached persistently
  const categorySlugs: string[] = ((product as any).productCategories?.nodes ?? []).map((n: { slug: string }) => n.slug).filter(Boolean)
  const [resolvedReviews, relatedNodes] = await Promise.all([
    databaseId ? getCachedReviews(databaseId) : Promise.resolve([] as WCReview[]),
    categorySlugs.length > 0 ? getRelated(categorySlugs, String(product.id)) : Promise.resolve([] as WooProduct[]),
  ])

  const avgRating =
    resolvedReviews.length > 0
      ? resolvedReviews.reduce((sum, r) => sum + r.rating, 0) / resolvedReviews.length
      : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name, item: `https://jaleca.com.br/produto/${slug}` },
    ],
  }

  // Extrair cores e tamanhos dos atributos do produto
  const attrs: Array<{ name: string; options?: string[] }> =
    (product as any).attributes?.nodes ?? []
  const colorAttr = attrs.find((a) => /cor/i.test(a.name))
  const sizeAttr = attrs.find((a) => /tamanho|size/i.test(a.name))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.image?.sourceUrl,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Jaleca' },
    manufacturer: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
    category: 'Uniformes Profissionais para Saúde',
    ...(colorAttr?.options?.length && { color: colorAttr.options.join(', ') }),
    ...(sizeAttr?.options?.length && { size: sizeAttr.options.join(', ') }),
    offers: {
      '@type': 'Offer',
      price: String(product.price || product.regularPrice || '').replace(/[^0-9,]/g, '').replace(',', '.') || undefined,
      priceCurrency: 'BRL',
      availability:
        product.stockStatus === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: `https://jaleca.com.br/produto/${slug}`,
      seller: { '@type': 'Organization', name: 'Jaleca' },
    },
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: resolvedReviews.length,
        bestRating: '5',
        worstRating: '1',
      },
      review: resolvedReviews.slice(0, 5).map(r => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5', worstRating: '1' },
        reviewBody: r.review.replace(/<[^>]*>/g, '').slice(0, 500),
        author: { '@type': 'Person', name: r.reviewer },
        datePublished: r.date_created.split('T')[0],
      })),
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetailClient
        product={product as Parameters<typeof ProductDetailClient>[0]['product']}
        initialReviews={resolvedReviews}
        relatedProducts={relatedNodes}
      />
    </>
  )
}
