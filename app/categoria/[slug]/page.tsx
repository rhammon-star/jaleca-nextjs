import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'

const CATEGORY_MAP: Record<string, { label: string; description: string; keywords: string }> = {
  jalecos: {
    label: 'Jalecos',
    description: 'Jalecos femininos e masculinos premium para profissionais da saúde. Modelos slim, clássicos e coloridos com tecido de alta qualidade.',
    keywords: 'jaleco, jaleco feminino, jaleco masculino, jaleco branco, jaleco profissional, jaleco médico',
  },
  scrubs: {
    label: 'Scrubs',
    description: 'Scrubs confortáveis e modernos para médicos, enfermeiros e profissionais da saúde. Tecido stretch anti-microbiano com design elegante.',
    keywords: 'scrub, scrub médico, scrub feminino, scrub masculino, uniforme cirúrgico, roupa hospitalar',
  },
  calcas: {
    label: 'Calças',
    description: 'Calças profissionais para saúde com conforto e estilo. Modelos com elastano e acabamento premium para uso clínico.',
    keywords: 'calça profissional, calça médica, calça hospitalar, uniforme saúde',
  },
  acessorios: {
    label: 'Acessórios',
    description: 'Acessórios para profissionais da saúde: toucas, aventais e complementos para completar seu uniforme.',
    keywords: 'acessórios médicos, touca, avental, uniforme saúde',
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
  if (!cat) return { title: 'Categoria não encontrada — Jaleca' }

  return {
    title: `${cat.label} — Jaleca`,
    description: cat.description,
    keywords: cat.keywords,
    alternates: { canonical: `https://jaleca.com.br/categoria/${slug}` },
    openGraph: {
      title: `${cat.label} | Jaleca`,
      description: cat.description,
      url: `https://jaleca.com.br/categoria/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: 'https://jaleca.com.br/logo.png', alt: `${cat.label} Jaleca` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.label} | Jaleca`,
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
      <ProductsClient products={products} initialCat={cat.label} />
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
