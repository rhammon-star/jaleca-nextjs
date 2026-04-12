import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react'

type CidadeInfo = {
  nome: string
  estado: string
  uf: string
  tipo: 'fechada' | 'revenda' | 'propria'
  profissoes: string
}

const CIDADES: Record<string, CidadeInfo> = {
  'jaleco-belo-horizonte': {
    nome: 'Belo Horizonte',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de BH',
  },
  'jaleco-campo-grande': {
    nome: 'Campo Grande',
    estado: 'Mato Grosso do Sul',
    uf: 'MS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Campo Grande',
  },
  'jaleco-vitoria': {
    nome: 'Vitória',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Vitória',
  },
  'jaleco-barra-da-tijuca': {
    nome: 'Barra da Tijuca',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde da Barra da Tijuca',
  },
  'jaleco-muriae': {
    nome: 'Muriaé',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Muriaé',
  },
  'jaleco-marilia': {
    nome: 'Marília',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Marília',
  },
  'jaleco-itabira': {
    nome: 'Itabira',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Itabira',
  },
  'jaleco-joao-monlevade': {
    nome: 'João Monlevade',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de João Monlevade',
  },
  'jaleco-lagoa-santa': {
    nome: 'Lagoa Santa',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Lagoa Santa',
  },
  'jaleco-teixeira-de-freitas': {
    nome: 'Teixeira de Freitas',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Teixeira de Freitas',
  },
  'jaleco-curitiba': {
    nome: 'Curitiba',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Curitiba',
  },
  'jaleco-londrina': {
    nome: 'Londrina',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Londrina',
  },
  'jaleco-governador-valadares': {
    nome: 'Governador Valadares',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Governador Valadares',
  },
  'jaleco-uberaba': {
    nome: 'Uberaba',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Uberaba',
  },
  'jaleco-montes-claros': {
    nome: 'Montes Claros',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Montes Claros',
  },
  'jaleco-vila-velha': {
    nome: 'Vila Velha',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vila Velha',
  },
  'jaleco-cachoeiro-de-itapemirim': {
    nome: 'Cachoeiro de Itapemirim',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Cachoeiro de Itapemirim',
  },
  'jaleco-serra': {
    nome: 'Serra',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Serra',
  },
  'jaleco-vitoria-da-conquista': {
    nome: 'Vitória da Conquista',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vitória da Conquista',
  },
  'jaleco-colatina': {
    nome: 'Colatina',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'propria',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Colatina',
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
  const cidade = CIDADES[slug]
  if (!cidade) return { title: 'Página não encontrada' }

  const title = `Jaleco em ${cidade.nome} — Entrega Rápida | Jaleca`
  const description = `Compre jalecos, dólmãs e conjuntos profissionais em ${cidade.nome}, ${cidade.estado}. Entrega rápida para ${cidade.nome}, qualidade premium, tamanhos PP ao G3. Jaleca — 8 anos vestindo a saúde.`

  return {
    title,
    description,
    keywords: `jaleco ${cidade.nome.toLowerCase()}, jaleca ${cidade.nome.toLowerCase()}, jaleco ${cidade.uf.toLowerCase()}, jaleco feminino ${cidade.nome.toLowerCase()}, jaleco médico ${cidade.nome.toLowerCase()}, comprar jaleco ${cidade.nome.toLowerCase()}, uniforme saúde ${cidade.nome.toLowerCase()}`,
    alternates: { canonical: `https://jaleca.com.br/cidade/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://jaleca.com.br/cidade/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: `Jaleco em ${cidade.nome}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(CIDADES).map(slug => ({ slug }))
}

export default async function CidadePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cidade = CIDADES[slug]
  if (!cidade) notFound()

  const products = await getProducts()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: `Jaleco em ${cidade.nome}`, item: `https://jaleca.com.br/cidade/${slug}` },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-14 px-4">
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3">
            Entregamos em {cidade.nome} — {cidade.uf}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Jaleco em {cidade.nome}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Jalecos, dólmãs e conjuntos profissionais para {cidade.profissoes}.
            Qualidade premium, entrega rápida, troca garantida.
          </p>
          <Link
            href="#produtos"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-all"
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-secondary/30 py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-foreground" />
              <span>Entrega para {cidade.nome}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-foreground" />
              <span>Troca grátis em 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-foreground" />
              <span>Compra 100% segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-foreground" />
              <span>4.9 ★ — +500 avaliações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold mb-2">
              Nossos Produtos
            </h2>
            <p className="text-muted-foreground">
              Enviamos para {cidade.nome} via PAC, SEDEX e Jadlog
            </p>
          </div>
          <ProductsClient products={products} initialCat="Todos" />
        </div>
      </section>

      {/* Sobre entrega */}
      <section className="bg-secondary/30 py-12 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Enviamos para {cidade.nome}
          </h2>
          <p className="text-muted-foreground mb-6">
            Todos os pedidos para {cidade.nome}, {cidade.estado}, são enviados com rastreamento completo.
            Prazo estimado de 3 a 7 dias úteis dependendo da modalidade de frete escolhida.
            Troca garantida em até 30 dias caso o produto não sirva.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center gap-2 bg-ink text-background px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all"
            >
              Ver Todos os Produtos
            </Link>
            <Link
              href="/trocas-e-devolucoes"
              className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-all"
            >
              Política de Troca
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
