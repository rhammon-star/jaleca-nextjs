import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'

const CATEGORY_MAP: Record<string, { label: string; description: string; keywords: string; filterLabel?: string }> = {
  jalecos: {
    label: 'Jalecos',
    description: 'Jalecos femininos e masculinos premium para médicos, enfermeiros, dentistas e cirurgiões. Modelos slim fit, clássicos, brancos e coloridos com tecido stretch anti-microbiano e acabamento refinado. Tamanhos PP ao G3, entrega rápida para todo o Brasil.',
    keywords: 'jaleco feminino, jaleco masculino, jaleco branco, jaleco médico, jaleco enfermagem, jaleco dentista, jaleco cirurgião, jaleco slim, jaleco profissional, comprar jaleco',
  },
  'jalecos-femininos': {
    label: 'Jalecos Femininos',
    filterLabel: 'Jalecos',
    description: 'Jalecos femininos premium para médicas, dentistas e enfermeiras. Modelos slim fit acinturados, com zíper central, zíper lateral e botões — brancos, pretos e coloridos. Tecido confortável, caimento elegante e aparência profissional superior. Tamanhos PP ao G3, entrega rápida para todo o Brasil.',
    keywords: 'jaleco feminino, jaleco feminino slim, jaleco feminino médica, jaleco feminino dentista, jaleco feminino enfermagem, jaleco feminino branco, jaleco feminino colorido, jaleco feminino premium, comprar jaleco feminino, jaleco para médica, jaleco para dentista feminino',
  },
  'jalecos-masculinos': {
    label: 'Jalecos Masculinos',
    filterLabel: 'Jalecos',
    description: 'Jalecos masculinos premium para médicos, dentistas e enfermeiros. Modelos slim fit modernos com zíper e botões, brancos, pretos e coloridos. Tecido de alta performance, corte anatômico e aparência profissional impecável. Tamanhos PP ao G3, entrega rápida para todo o Brasil.',
    keywords: 'jaleco masculino, jaleco masculino slim, jaleco masculino médico, jaleco masculino dentista, jaleco masculino enfermagem, jaleco masculino branco, jaleco masculino preto, jaleco para médico, comprar jaleco masculino',
  },
  domas: {
    label: 'Dólmãs',
    description: 'Dólmãs profissionais femininas e masculinas para médicos, enfermeiros e cirurgiões. Tecido de alta performance, modelagem ergonômica e conforto para longas jornadas. Disponível em PP ao G3.',
    keywords: 'doma médica, doma feminina, doma masculina, doma cirúrgica, uniforme cirúrgico, roupa hospitalar, doma colorida',
  },
  'domas-femininas': {
    label: 'Dólmãs Femininas',
    filterLabel: 'Dólmãs',
    description: 'Dólmãs femininas premium para médicas, enfermeiras e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte elegante para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'doma feminina, doma médica feminina, doma enfermagem feminina, uniforme feminino saúde, roupa hospitalar feminina',
  },
  'domas-masculinas': {
    label: 'Dólmãs Masculinas',
    filterLabel: 'Dólmãs',
    description: 'Dólmãs masculinas premium para médicos, enfermeiros e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte moderno para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'doma masculina, doma médica masculina, doma enfermagem masculina, uniforme masculino saúde, roupa hospitalar masculina',
  },
  conjuntos: {
    label: 'Conjuntos',
    description: 'Conjuntos profissionais para saúde com conforto, elastano e acabamento premium. Ideais para médicos, enfermeiros e técnicos de saúde. Modelos femininos e masculinos.',
    keywords: 'conjunto médico, conjunto hospitalar, conjunto enfermagem, conjunto uniforme saúde, conjunto feminino médico',
  },
  'conjuntos-femininos': {
    label: 'Conjuntos Femininos',
    filterLabel: 'Conjuntos',
    description: 'Conjuntos scrub femininos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub feminino, pijama cirúrgico feminino, conjunto médico feminino, scrub feminino, conjunto enfermagem feminino, pijama cirúrgico',
  },
  'conjuntos-masculinos': {
    label: 'Conjuntos Masculinos',
    filterLabel: 'Conjuntos',
    description: 'Conjuntos scrub masculinos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub masculino, pijama cirúrgico masculino, conjunto médico masculino, scrub masculino, conjunto enfermagem masculino',
  },
  acessorios: {
    label: 'Acessórios',
    description: 'Acessórios para profissionais da saúde: toucas, aventais e complementos para completar seu uniforme médico. Qualidade e praticidade para o dia a dia clínico.',
    keywords: 'acessórios médicos, touca cirúrgica, avental, complementos uniforme saúde, acessórios enfermagem',
  },
}

async function getProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
      GET_PRODUCTS,
      { first: 100 }
    )
    return data.products.nodes
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORY_MAP[slug]
  if (!cat) return { title: 'Categoria não encontrada' }

  const pageTitle = `${cat.label} Premium | Jaleca — Moda Profissional para Saúde`

  return {
    title: pageTitle,
    description: cat.description,
    keywords: cat.keywords,
    alternates: { canonical: `https://jaleca.com.br/categoria/${slug}` },
    openGraph: {
      title: pageTitle,
      description: cat.description,
      url: `https://jaleca.com.br/categoria/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: `${cat.label} Jaleca` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: cat.description,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map(slug => ({ slug }))
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cat = CATEGORY_MAP[slug]
  if (!cat) notFound()

  const products = await getProducts()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `https://jaleca.com.br/categoria/${slug}` },
    ],
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.label} — Jaleca`,
    description: cat.description,
    url: `https://jaleca.com.br/categoria/${slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
        { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
        { '@type': 'ListItem', position: 3, name: cat.label, item: `https://jaleca.com.br/categoria/${slug}` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema).replace(/</g, '\\u003c'),
        }}
      />
      <ProductsClient products={products} initialCat={cat.filterLabel ?? cat.label} />
      {/* Cross-category navigation for SEO internal linking */}
      <nav aria-label="Outras categorias" className="container pb-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
          Outras Categorias
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_MAP)
            .filter(([s]) => s !== slug)
            .map(([s, c]) => (
              <Link
                key={s}
                href={`/categoria/${s}`}
                className="text-xs border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                {c.label}
              </Link>
            ))}
          <Link
            href="/produtos"
            className="text-xs border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            Todos os Produtos
          </Link>
        </div>
      </nav>
    </>
  )
}
