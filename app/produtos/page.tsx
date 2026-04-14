import type { Metadata } from 'next'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from './ProductsClient'
import type { WooProduct } from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

type ProductsPage = { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: WooProduct[] } }

async function getAllProducts(): Promise<WooProduct[]> {
  const all: WooProduct[] = []
  let cursor: string | null = null
  try {
    do {
      const data: ProductsPage = await graphqlClient.request<ProductsPage>(GET_PRODUCTS, { first: 24, after: cursor })
      all.push(...data.products.nodes)
      cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
    } while (cursor)
  } catch (e) {
    console.error('[getAllProducts] GraphQL error:', e)
    if (all.length === 0) return []
  }
  return all
}

export const metadata: Metadata = {
  title: 'Comprar Jaleco Feminino e Masculino — Frete Grátis no Sudeste',
  description: 'Jalecos femininos e masculinos para médicas, dentistas e enfermeiras. Tamanhos PP ao G3, tecido premium, entrega rápida. Frete grátis no Sudeste acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/produtos' },
  openGraph: {
    title: 'Comprar Jaleco Feminino e Masculino | Jaleca',
    description: 'Jalecos femininos e masculinos para médicas, dentistas e enfermeiras. Tamanhos PP ao G3, frete grátis no Sudeste.',
    url: 'https://jaleca.com.br/produtos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Coleção de Jalecos Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jalecos e Uniformes Profissionais | Jaleca',
    description: 'Explore nossa coleção completa de jalecos premium para profissionais da saúde.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Comprar Jaleco Feminino e Masculino — Jaleca',
  description: 'Jalecos femininos e masculinos para médicas, dentistas e enfermeiras. Tamanhos PP ao G3, tecido premium, entrega rápida. Frete grátis no Sudeste acima de R$499.',
  url: 'https://jaleca.com.br/produtos',
  publisher: { '@id': 'https://jaleca.com.br/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos e Uniformes', item: 'https://jaleca.com.br/produtos' },
    ],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Todos os Jalecos e Uniformes', item: 'https://jaleca.com.br/produtos' },
  ],
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sale?: string; novidades?: string; genero?: string; cor?: string }>
}) {
  const { cat, sale, novidades, genero, cor } = await searchParams
  const products = await getAllProducts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <ProductsClient
        key={`${cat ?? ''}-${genero ?? ''}-${cor ?? ''}-${sale ?? ''}-${novidades ?? ''}`}
        products={products}
        initialCat={cat || 'Todos'}
        initialSale={sale === 'true'}
        initialNovidades={novidades === 'true'}
        initialGenero={genero}
        initialCor={cor}
      />
    </>
  )
}
