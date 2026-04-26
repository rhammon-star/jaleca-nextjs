import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { readFile } from 'fs/promises'
import { join } from 'path'
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

// Lista de produtos que têm páginas de cores (para filtrar depois)
const productsWithColorPages = new Set<string>()

async function getColorVariants(mainProducts: WooProduct[]): Promise<WooProduct[]> {
  try {
    const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const colorPages: Array<{ url: string; productName: string; colorName: string; title: string; metaDescription: string; category: string }> = JSON.parse(jsonContent)

    // Criar mapa de produtos por nome para buscar imagem/preço
    const productMap = new Map<string, WooProduct>()
    mainProducts.forEach(p => {
      // Normalizar nome: remover " - Jaleca" e limpar
      const cleanName = p.name.replace(/ - Jaleca$/i, '').trim()
      productMap.set(cleanName, p)
    })

    // Registrar quais produtos têm cores
    colorPages.forEach(page => {
      const cleanName = page.productName.replace(/ - Jaleca$/i, '').trim()
      productsWithColorPages.add(cleanName)
    })

    // Transform each color page into a WooProduct-like object
    return colorPages.map((page, idx) => {
      const parentProduct = productMap.get(page.productName)

      // Buscar variação específica dessa cor no produto pai
      let variantImage = parentProduct?.image
      let variantPrice = parentProduct?.price || ''
      let variantRegularPrice = parentProduct?.regularPrice || ''
      let variantSalePrice = parentProduct?.salePrice || null

      if (parentProduct?.variations?.nodes) {
        const colorNormalized = page.colorName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const variant = parentProduct.variations.nodes.find(v => {
          const vColor = v.attributes?.nodes?.find(a => /cor|color/i.test(a.name))
          if (!vColor) return false
          const vColorNormalized = vColor.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          return vColorNormalized.includes(colorNormalized) || colorNormalized.includes(vColorNormalized)
        })

        if (variant) {
          variantImage = variant.image || variantImage
          variantPrice = variant.price || variantPrice
          variantRegularPrice = variant.regularPrice || variantRegularPrice
          variantSalePrice = variant.salePrice || variantSalePrice
        }
      }

      return {
        id: `color-variant-${idx}`,
        databaseId: 90000 + idx,
        name: page.title,
        slug: page.url.replace('/produto/', ''),
        price: variantPrice,
        regularPrice: variantRegularPrice,
        salePrice: variantSalePrice,
        image: variantImage || { sourceUrl: '', altText: page.title },
        productCategories: {
          nodes: [{ name: page.category, slug: page.category }]
        },
        attributes: {
          nodes: [
            {
              name: 'pa_cor',
              options: [page.colorName.toLowerCase()]
            }
          ]
        },
        variations: { nodes: [] }
      } as WooProduct
    })
  } catch (e) {
    console.error('[getColorVariants] Error loading color variants:', e)
    return []
  }
}

async function getAllProducts(): Promise<WooProduct[]> {
  try {
    const mainProducts = await getAllProductsCached()
    const colorVariants = await getColorVariants(mainProducts)

    // Filtrar produtos pai que já têm páginas de cores
    const mainProductsWithoutColorPages = mainProducts.filter(p => {
      const cleanName = p.name.replace(/ - Jaleca$/i, '').trim()
      return !productsWithColorPages.has(cleanName)
    })

    console.log(`[getAllProducts] ${mainProducts.length} produtos WC, ${productsWithColorPages.size} com cores no JSON → ${mainProductsWithoutColorPages.length} produtos pai sem cores + ${colorVariants.length} cores = ${mainProductsWithoutColorPages.length + colorVariants.length} total`)

    // Combinar: cores primeiro (para aparecerem no topo) + produtos pai sem cores
    return [...colorVariants, ...mainProductsWithoutColorPages]
  } catch (e) {
    // Cache guardou erro ou está vazio — tenta direto sem cache
    console.warn('[getAllProducts] Cache miss/error, tentando fetch direto...', e)
    try {
      const mainProducts = await fetchAllProducts()
      const colorVariants = await getColorVariants(mainProducts)
      return [...mainProducts, ...colorVariants]
    } catch (e2) {
      console.error('[getAllProducts] Fetch direto também falhou:', e2)
      return []
    }
  }
}

export const metadata: Metadata = {
  title: 'Produtos Jaleca — Catálogo Completo de Uniformes Profissionais | 2026',
  description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para médicos, dentistas e enfermeiros. Slim, Princesa, Duquesa, Elastex — PP ao G3. Frete grátis SP/MG/RJ/ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/produtos' },
  keywords: 'jalecos, jaleco feminino, jaleco masculino, jalecos para médicos, jalecos slim, dólmã, conjunto scrub, uniforme médico, comprar jaleco',
  openGraph: {
    title: 'Comprar Jaleco Online — Femininos, Masculinos, Slim e Plus Size',
    description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para profissionais da saúde. PP ao G3, frete grátis no Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/produtos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Jalecos à Venda — Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comprar Jaleco Online — Femininos e Masculinos',
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

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual prazo de entrega dos produtos Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com CEP.' } },
    { '@type': 'Question', name: 'Como funciona a troca de tamanho?', acceptedAnswer: { '@type': 'Answer', text: 'Aceita troca em até 30 dias após o recebimento. Produto sem uso e com etiqueta. Manda mensagem pelo WhatsApp ou e-mail para iniciar o processo.' } },
    { '@type': 'Question', name: 'Como escolher o tamanho certo do jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Compare com a tabela de medidas na página de cada produto. Em caso de dúvida entre dois tamanhos, opte pelo maior — jalecos Jaleca têm elastano e adaptam bem ao corpo.' } },
    { '@type': 'Question', name: 'Frete grátis para quais regiões?', acceptedAnswer: { '@type': 'Answer', text: 'Frete grátis para compras acima de R$499 nas regiões SP, RJ, MG e ES. Para outras regiões, o valor é calculado no checkout com base no CEP de entrega.' } },
    { '@type': 'Question', name: 'Posso comprar jaleco por atacado?', acceptedAnswer: { '@type': 'Answer', text: 'Para compras a partir de 10 peças do mesmo modelo, entre em contato pelo WhatsApp para preço especial Atacado. Temos condição diferenciada para clínicas e consultórios.' } },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }}
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
