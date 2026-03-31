import type { Metadata } from 'next'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from './ProductsClient'
import type { WooProduct } from '@/components/ProductCard'

async function getAllProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{
      products: { nodes: WooProduct[] }
    }>(GET_PRODUCTS, { first: 100 })
    return data.products.nodes
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  title: 'Jalecos e Uniformes Profissionais — Jaleca',
  description: 'Explore nossa coleção completa de jalecos femininos, masculinos, scrubs e uniformes premium para profissionais da saúde. Entrega rápida para todo o Brasil.',
  alternates: { canonical: 'https://jaleca.com.br/produtos' },
  openGraph: {
    title: 'Jalecos e Uniformes Profissionais — Jaleca',
    description: 'Explore nossa coleção completa de jalecos premium para profissionais da saúde.',
    url: 'https://jaleca.com.br/produtos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Coleção de Jalecos Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jalecos e Uniformes Profissionais — Jaleca',
    description: 'Explore nossa coleção completa de jalecos premium para profissionais da saúde.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Jalecos e Uniformes Profissionais — Jaleca',
  description: 'Coleção completa de jalecos femininos, masculinos, scrubs e uniformes premium para profissionais da saúde.',
  url: 'https://jaleca.com.br/produtos',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
    ],
  },
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sale?: string; novidades?: string }>
}) {
  const { cat, sale, novidades } = await searchParams
  const products = await getAllProducts()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema).replace(/</g, '\\u003c'),
        }}
      />
      <ProductsClient
        products={products}
        initialCat={cat || 'Todos'}
        initialSale={sale === 'true'}
        initialNovidades={novidades === 'true'}
      />
    </>
  )
}
