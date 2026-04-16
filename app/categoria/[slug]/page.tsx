import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'

const CATEGORY_MAP: Record<string, { label: string; description: string; keywords: string; filterLabel?: string; title?: string }> = {
  jalecos: {
    label: 'Jalecos',
    title: 'Jalecos para Médicos e Profissionais da Saúde | Jaleca',
    description: 'Jalecos femininos e masculinos para médicos, enfermeiros, dentistas e farmacêuticos. Modelos slim fit, Princesa, Duquesa, Elastex — brancos, pretos e coloridos. Tecido premium, tamanhos PP ao G3, frete grátis no Sudeste acima de R$499.',
    keywords: 'jalecos, jaleco feminino, jaleco masculino, jaleco branco, jaleco médico, jaleco enfermagem, jaleco dentista, jaleco slim, jaleco profissional, comprar jaleco',
  },
  'jalecos-femininos': {
    label: 'Jalecos Femininos',
    title: 'Jalecos Femininos | Jaleca — Slim, Princesa, Elastex | Frete Grátis SP/MG/RJ/ES',
    filterLabel: 'Jalecos',
    description: 'Jalecos femininos para médicas, dentistas e enfermeiras. Modelos Slim, Princesa, Duquesa e Elastex — brancos, pretos e coloridos. Corte acinturado, tecido de alta performance. Tamanhos PP ao G3 com frete grátis no Sudeste acima de R$499.',
    keywords: 'jaleco feminino, jalecos femininos, jaleco slim feminino, jaleco princesa, jaleco duquesa, jaleco elastex, comprar jaleco feminino, jaleco médica, jaleco dentista feminino, jaleco enfermagem feminino',
  },
  'jalecos-masculinos': {
    label: 'Jalecos Masculinos',
    title: 'Jalecos Masculinos | Jaleca — Slim Moderno | Frete Grátis Sudeste',
    filterLabel: 'Jalecos',
    description: 'Jalecos masculinos para médicos, dentistas e enfermeiros. Modelos slim fit com zíper e botões, brancos, pretos e coloridos. Corte anatômico, tecido de alta performance. Tamanhos PP ao G3, frete grátis no Sudeste acima de R$499.',
    keywords: 'jaleco masculino, jalecos masculinos, jaleco slim masculino, jaleco masculino branco, jaleco masculino preto, jaleco médico masculino, comprar jaleco masculino',
  },
  domas: {
    label: 'Dólmãs',
    title: 'Dólmãs para Profissionais da Saúde | Jaleca — Femininas e Masculinas',
    description: 'Dólmãs profissionais femininas e masculinas para médicos, enfermeiros e cirurgiões. Tecido de alta performance, modelagem ergonômica e conforto para longas jornadas. Disponível em PP ao G3.',
    keywords: 'dólmã médica, dólmã feminina, dólmã masculina, dólmã cozinheiro, uniforme cirúrgico, roupa hospitalar, doma colorida, dólmã profissional',
  },
  'domas-femininas': {
    label: 'Dólmãs Femininas',
    title: 'Dólmãs Femininas para Profissionais da Saúde | Jaleca',
    filterLabel: 'Dólmãs',
    description: 'Dólmãs femininas premium para médicas, enfermeiras e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte elegante para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã feminina, dólmã médica feminina, dólmã enfermagem feminina, uniforme feminino saúde, roupa hospitalar feminina',
  },
  'domas-masculinas': {
    label: 'Dólmãs Masculinas',
    title: 'Dólmãs Masculinas para Profissionais da Saúde | Jaleca',
    filterLabel: 'Dólmãs',
    description: 'Dólmãs masculinas premium para médicos, enfermeiros e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte moderno para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã masculina, dólmã médica masculina, dólmã enfermagem masculina, uniforme masculino saúde, roupa hospitalar masculina',
  },
  conjuntos: {
    label: 'Conjuntos',
    title: 'Conjuntos Scrub Femininos e Masculinos | Jaleca | Frete Grátis Sudeste',
    description: 'Conjuntos scrub e pijamas cirúrgicos para médicos, enfermeiros e profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Modelos femininos e masculinos, tamanhos PP ao G3.',
    keywords: 'conjunto scrub, conjunto médico, conjunto hospitalar, pijama cirúrgico, conjunto enfermagem, scrub feminino, scrub masculino, conjunto uniforme saúde',
  },
  'conjuntos-femininos': {
    label: 'Conjuntos Femininos',
    title: 'Conjuntos Scrub Femininos | Jaleca — Pijamas Cirúrgicos para Saúde',
    filterLabel: 'Conjuntos',
    description: 'Conjuntos scrub femininos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub feminino, pijama cirúrgico feminino, conjunto médico feminino, scrub feminino, conjunto enfermagem feminino, pijama cirúrgico',
  },
  'conjuntos-masculinos': {
    label: 'Conjuntos Masculinos',
    title: 'Conjuntos Scrub Masculinos | Jaleca — Pijamas Cirúrgicos para Saúde',
    filterLabel: 'Conjuntos',
    description: 'Conjuntos scrub masculinos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub masculino, pijama cirúrgico masculino, conjunto médico masculino, scrub masculino, conjunto enfermagem masculino',
  },
  acessorios: {
    label: 'Acessórios',
    title: 'Acessórios para Profissionais da Saúde | Jaleca — Toucas e Mais',
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

  const pageTitle = cat.title ?? `${cat.label} Premium | Jaleca — Moda Profissional para Saúde`

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
      <ProductsClient
        products={products}
        initialCat={cat.filterLabel ?? cat.label}
        pageTitle={`${cat.label} Premium — Jaleca`}
        pageDescription={cat.description}
      />

      {/* SEO text block — visible to crawlers, useful para usuário */}
      <section aria-label={`Sobre ${cat.label}`} className="container pb-10">
        <div className="border-t border-border pt-8 max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-3">{cat.label} para Profissionais da Saúde</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.description}</p>
          <h3 className="text-sm font-semibold mb-2">Por que escolher a Jaleca?</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Tecido premium com durabilidade comprovada em uso clínico</li>
            <li>Tamanhos PP ao G3 para todos os biótipos</li>
            <li>Entrega rápida para todo o Brasil — frete grátis no Sudeste acima de R$499</li>
            <li>Troca fácil em até 30 dias após o recebimento</li>
          </ul>
        </div>
      </section>

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
