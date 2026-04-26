import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'
import { getAllProducts } from '@/lib/all-products'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const dynamic = 'force-dynamic'

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
    { '@type': 'Question', name: 'Como funciona a troca de tamanho?', acceptedAnswer: { '@type': 'Answer', text: 'Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta.' } },
    { '@type': 'Question', name: 'Como escolher o tamanho certo do jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Compare com a tabela de medidas na página de cada produto. Em caso de dúvida entre dois tamanhos, opte pelo maior — jalecos Jaleca têm elastano e adaptam bem ao corpo.' } },
    { '@type': 'Question', name: 'Frete grátis para quais regiões?', acceptedAnswer: { '@type': 'Answer', text: 'Frete grátis para compras acima de R$499 nas regiões SP, RJ, MG e ES. Para outras regiões, o valor é calculado no checkout com base no CEP de entrega.' } },
    { '@type': 'Question', name: 'Posso comprar jaleco por atacado?', acceptedAnswer: { '@type': 'Answer', text: 'Para compras a partir de 10 peças do mesmo modelo, entre em contato pelo WhatsApp para preço especial Atacado. Temos condição diferenciada para clínicas e consultórios.' } },
  ],
}

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
  searchParams: Promise<{ cat?: string; sale?: string; novidades?: string; genero?: string; cor?: string; categoria?: string; sort?: string }>
}) {
  const { cat, sale, novidades, genero, cor, categoria, sort } = await searchParams
  const products = await getAllProducts()
  const bestSellersOnly = sort === 'mais-vendidos'

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
      <h1 className="sr-only">Jalecos e Uniformes Médicos — Femininos e Masculinos | Jaleca</h1>
      <ProductsClient
        key={`${resolvedCat}-${resolvedGenero ?? ''}-${cor ?? ''}-${sale ?? ''}-${novidades ?? ''}-${sort ?? ''}`}
        products={products}
        initialCat={resolvedCat}
        initialSale={sale === 'true'}
        initialNovidades={novidades === 'true'}
        initialGenero={resolvedGenero}
        initialCor={cor}
        initialBestSellersOnly={bestSellersOnly}
        pageTitle={bestSellersOnly ? 'Mais Vendidos' : undefined}
      />
    </>
  )
}
