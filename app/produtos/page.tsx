import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { graphqlClient, GET_PRODUCTS_LISTING } from '@/lib/graphql'
import ProductsClient from './ProductsClient'
import type { WooProduct } from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

type ProductsPage = { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: WooProduct[] } }

const fetchAllProducts = async (): Promise<WooProduct[]> => {
  const all: WooProduct[] = []
  let cursor: string | null = null
  try {
    do {
      const data: ProductsPage = await graphqlClient.request<ProductsPage>(GET_PRODUCTS_LISTING, { first: 24, after: cursor })
      all.push(...data.products.nodes)
      cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
    } while (cursor)
  } catch (e) {
    console.error('[getAllProducts] GraphQL error:', e)
    if (all.length === 0) throw new Error('WooCommerce GraphQL retornou 0 produtos')
  }
  if (all.length === 0) throw new Error('Nenhum produto encontrado no WooCommerce')
  return all
}

const getAllProductsCached = unstable_cache(fetchAllProducts, ['all-products'], { revalidate: 3600, tags: ['products'] })

async function getAllProducts(): Promise<WooProduct[]> {
  try {
    return await getAllProductsCached()
  } catch {
    // Cache guardou erro ou está vazio — tenta direto sem cache
    console.warn('[getAllProducts] Cache miss/error, tentando fetch direto...')
    try {
      return await fetchAllProducts()
    } catch (e) {
      console.error('[getAllProducts] Fetch direto também falhou:', e)
      return []
    }
  }
}

export const metadata: Metadata = {
  title: 'Comprar Jaleco Online — Jalecos, Dólmãs e Scrubs | Jaleca',
  description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para médicos, dentistas e enfermeiros. Slim, Princesa, Duquesa, Elastex — PP ao G3. Frete grátis SP/MG/RJ/ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/produtos' },
  keywords: 'jalecos, jaleco feminino, jaleco masculino, jalecos para médicos, jalecos slim, dólmã, conjunto scrub, uniforme médico, comprar jaleco',
  openGraph: {
    title: 'Comprar Jaleco Online — Jalecos, Dólmãs e Scrubs | Jaleca',
    description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para profissionais da saúde. PP ao G3, frete grátis no Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/produtos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Coleção de Jalecos Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jalecos e Uniformes Médicos | Jaleca',
    description: 'Jalecos femininos e masculinos, dólmãs e conjuntos scrub para profissionais da saúde.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Jalecos e Uniformes Médicos — Jaleca',
  description: 'Jalecos femininos e masculinos, dólmãs, conjuntos scrub e acessórios para médicos, dentistas e enfermeiros. PP ao G3, frete grátis no Sudeste acima de R$499.',
  url: 'https://jaleca.com.br/produtos',
  publisher: { '@id': 'https://jaleca.com.br/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos e Uniformes Médicos', item: 'https://jaleca.com.br/produtos' },
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

// Mapeia slugs WooCommerce do parâmetro ?categoria= para os filtros internos
const CATEGORIA_MAP: Record<string, { cat?: string; genero?: string }> = {
  'jalecos-femininos':  { cat: 'Jalecos',   genero: 'Feminino'  },
  'jalecos-masculinos': { cat: 'Jalecos',   genero: 'Masculino' },
  'jalecos':            { cat: 'Jalecos'                        },
  'dolmas-femininas':   { cat: 'Dólmãs',    genero: 'Feminino'  },
  'dolmas-masculinos':  { cat: 'Dólmãs',    genero: 'Masculino' },
  'dolmas':             { cat: 'Dólmãs'                         },
  'conjuntos-femininos':{ cat: 'Conjuntos', genero: 'Feminino'  },
  'conjuntos-masculinos':{ cat: 'Conjuntos', genero: 'Masculino' },
  'conjuntos':          { cat: 'Conjuntos'                      },
  'acessorios':         { cat: 'Acessórios'                     },
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sale?: string; novidades?: string; genero?: string; cor?: string; categoria?: string }>
}) {
  const { cat, sale, novidades, genero, cor, categoria } = await searchParams
  const products = await getAllProducts()

  // Resolve filtros a partir de ?categoria= (vindo dos anúncios) ou ?cat= + ?genero=
  const catFromSlug = categoria ? CATEGORIA_MAP[categoria] : undefined
  const resolvedCat    = cat    || catFromSlug?.cat    || 'Todos'
  const resolvedGenero = genero || catFromSlug?.genero

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
      {/* H1 server-side para SEO — invisível ao usuário, visível para crawlers no HTML inicial */}
      <h1 className="sr-only">Jalecos e Uniformes Médicos — Femininos e Masculinos | Jaleca</h1>
      <ProductsClient
        key={`${resolvedCat}-${resolvedGenero ?? ''}-${cor ?? ''}-${sale ?? ''}-${novidades ?? ''}`}
        products={products}
        initialCat={resolvedCat}
        initialSale={sale === 'true'}
        initialNovidades={novidades === 'true'}
        initialGenero={resolvedGenero}
        initialCor={cor}
      />
    </>
  )
}
