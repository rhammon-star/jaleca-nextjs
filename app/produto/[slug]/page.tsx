import { notFound } from 'next/navigation'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import ProductDetailClient from './ProductDetailClient'
import { getProductReviews, type WCReview } from '@/lib/woocommerce'
import type { Metadata } from 'next'

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

async function getProduct(slug: string): Promise<ProductData | null> {
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    return data.product
  } catch {
    return null
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
    title: `${name} | Jaleca`,
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
      title: `${name} | Jaleca`,
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
  let reviews: WCReview[] = []
  if (databaseId) {
    try {
      reviews = await getProductReviews(databaseId)
    } catch {
      // continue without reviews
    }
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.image?.sourceUrl,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Jaleca',
    },
    offers: {
      '@type': 'Offer',
      price: String(product.price || product.regularPrice || '').replace(/[^0-9,]/g, '').replace(',', '.') || undefined,
      priceCurrency: 'BRL',
      availability:
        product.stockStatus === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: `https://jaleca.com.br/produto/${slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Jaleca',
      },
    },
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.slice(0, 5).map(r => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: '5',
          worstRating: '1',
        },
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ProductDetailClient product={product as Parameters<typeof ProductDetailClient>[0]['product']} />
    </>
  )
}
