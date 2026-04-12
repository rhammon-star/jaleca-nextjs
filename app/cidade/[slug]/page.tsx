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
  freteGratis?: boolean
  conteudoLocal?: string
}

const FAQ_TEMPLATE = (nome: string, estado: string) => [
  {
    pergunta: `Qual o prazo de entrega para jalecos em ${nome}?`,
    resposta: `O prazo de entrega para ${nome}, ${estado}, varia de 3 a 7 dias úteis após a confirmação do pagamento. Você recebe o código de rastreamento por e-mail assim que o pedido for despachado.`,
  },
  {
    pergunta: `Tem frete grátis para ${nome}?`,
    resposta: `Oferecemos frete grátis (PAC) para ${nome} nas compras acima de R$499, válido para os estados de SP, RJ, MG e ES. Para outros estados ou valores menores, calcule o frete informando seu CEP no checkout.`,
  },
  {
    pergunta: `Como funciona a troca de jalecos em ${nome}?`,
    resposta: `Você pode solicitar a troca em até 30 dias após o recebimento. Basta entrar em contato pelo WhatsApp ou e-mail, devolver o produto sem uso e com etiqueta, e enviamos o novo tamanho sem custo.`,
  },
  {
    pergunta: `Como rastrear meu pedido para ${nome}?`,
    resposta: `Assim que o pedido for despachado, você recebe o código de rastreamento por e-mail. O acompanhamento é feito diretamente no site dos Correios ou da transportadora escolhida.`,
  },
]

const CIDADES: Record<string, CidadeInfo> = {
  'jaleco-belo-horizonte': {
    nome: 'Belo Horizonte',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de BH',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde em Belo Horizonte, do Mater Dei à Santa Casa, encontram na Jaleca a união perfeita de estilo e conforto. Nossos jalecos são ideais para a dinâmica das clínicas e hospitais da capital mineira, garantindo elegância e funcionalidade em cada atendimento.',
  },
  'jaleco-campo-grande': {
    nome: 'Campo Grande',
    estado: 'Mato Grosso do Sul',
    uf: 'MS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Campo Grande',
    conteudoLocal: 'Profissionais de Campo Grande, MS, da Santa Casa ao Hospital Regional, encontram na Jaleca a excelência em jalecos. Design moderno e conforto são essenciais para a rotina intensa das clínicas e hospitais da capital sul-mato-grossense.',
  },
  'jaleco-vitoria': {
    nome: 'Vitória',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Vitória',
    freteGratis: true,
    conteudoLocal: 'Em Vitória, ES, profissionais do HUCAM e das clínicas da Praia do Canto buscam distinção. Os jalecos Jaleca proporcionam elegância e praticidade, ideais para o ambiente de saúde da capital capixaba, combinando beleza e funcionalidade.',
  },
  'jaleco-barra-da-tijuca': {
    nome: 'Barra da Tijuca',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde da Barra da Tijuca',
    conteudoLocal: 'Profissionais de saúde na Barra da Tijuca, atuando em clínicas renomadas ou no Hospital Barra D\'Or, encontram na Jaleca o jaleco feminino ideal que une estilo e conforto para sua rotina.',
  },
  'jaleco-muriae': {
    nome: 'Muriaé',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Muriaé',
    freteGratis: true,
    conteudoLocal: 'Para os dedicados profissionais da saúde em Muriaé, seja no Hospital São Paulo ou em outras clínicas locais, a Jaleca oferece jalecos que garantem elegância e alta performance no dia a dia.',
  },
  'jaleco-marilia': {
    nome: 'Marília',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Marília',
    conteudoLocal: 'Em Marília, polo de saúde com o complexo FAMEMA e diversos hospitais, a Jaleca veste com excelência as profissionais que buscam jalecos femininos com qualidade e design superior.',
  },
  'jaleco-itabira': {
    nome: 'Itabira',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Itabira',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde em Itabira, do Hospital Nossa Senhora das Dores a outros centros, contam com a qualidade e o design dos jalecos femininos Jaleca para uma imagem impecável.',
  },
  'jaleco-joao-monlevade': {
    nome: 'João Monlevade',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de João Monlevade',
    freteGratis: true,
    conteudoLocal: 'Para enfermeiras e médicas em João Monlevade, a Jaleca oferece jalecos femininos de alta qualidade, perfeitos para o Hospital Margarida e clínicas da região, unindo estilo e funcionalidade.',
  },
  'jaleco-lagoa-santa': {
    nome: 'Lagoa Santa',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Lagoa Santa',
    freteGratis: true,
    conteudoLocal: 'Em Lagoa Santa, profissionais do Hospital São Judas Tadeu e clínicas locais encontram na Jaleca a escolha ideal para jalecos que aliam conforto, durabilidade e um toque moderno.',
  },
  'jaleco-teixeira-de-freitas': {
    nome: 'Teixeira de Freitas',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Teixeira de Freitas',
    conteudoLocal: 'Atendendo Teixeira de Freitas, a Jaleca oferece jalecos femininos profissionais para quem atua no Hospital Municipal ou nas diversas clínicas da cidade, com muito estilo e qualidade.',
  },
  'jaleco-curitiba': {
    nome: 'Curitiba',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Curitiba',
    conteudoLocal: 'Para os exigentes profissionais de Curitiba, do Hospital Marcelino Champagnat aos centros médicos do Batel, a Jaleca oferece jalecos que unem inovação e sofisticação. Vista-se com a qualidade que a saúde paranaense merece.',
  },
  'jaleco-londrina': {
    nome: 'Londrina',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Londrina',
    conteudoLocal: 'Em Londrina, PR, do Hospital Universitário à Santa Casa, a Jaleca é a escolha para jalecos que aliam conforto e estilo. Desenvolvidos para atender a dinâmica da saúde londrinense com elegância e durabilidade.',
  },
  'jaleco-governador-valadares': {
    nome: 'Governador Valadares',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Governador Valadares',
    freteGratis: true,
    conteudoLocal: 'Em Governador Valadares, do Hospital Regional ao Samaritano, a Jaleca veste com estilo e durabilidade as profissionais da saúde que buscam jalecos femininos de alto padrão.',
  },
  'jaleco-uberaba': {
    nome: 'Uberaba',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Uberaba',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde em Uberaba, atuando no Hospital de Clínicas da UFTM ou no Mário Palmério, encontram na Jaleca a elegância e funcionalidade necessárias em seus jalecos.',
  },
  'jaleco-montes-claros': {
    nome: 'Montes Claros',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Montes Claros',
    freteGratis: true,
    conteudoLocal: 'Em Montes Claros, seja na Santa Casa ou no Hospital Aroldo Tourinho, a Jaleca é a escolha certa para jalecos femininos que combinam sofisticação e praticidade na jornada de trabalho.',
  },
  'jaleco-vila-velha': {
    nome: 'Vila Velha',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vila Velha',
    freteGratis: true,
    conteudoLocal: 'Para profissionais em Vila Velha, do Hospital Santa Mônica ao Vila Velha Hospital, a Jaleca oferece jalecos femininos que garantem conforto, durabilidade e destaque elegante no ambiente de saúde.',
  },
  'jaleco-cachoeiro-de-itapemirim': {
    nome: 'Cachoeiro de Itapemirim',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Cachoeiro de Itapemirim',
    freteGratis: true,
    conteudoLocal: 'Em Cachoeiro de Itapemirim, profissionais da Santa Casa ou do Hospital Evangélico escolhem Jaleca para jalecos que unem design moderno e alta performance, essenciais no dia a dia.',
  },
  'jaleco-serra': {
    nome: 'Serra',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Serra',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde na Serra, do Hospital Jayme dos Santos Neves a outras unidades, encontram na Jaleca a qualidade e o estilo ideais para seus jalecos femininos, garantindo conforto e durabilidade.',
  },
  'jaleco-vitoria-da-conquista': {
    nome: 'Vitória da Conquista',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vitória da Conquista',
    conteudoLocal: 'Em Vitória da Conquista, do Hospital Geral ao São Vicente, a Jaleca é a parceira ideal para médicas e enfermeiras que buscam jalecos elegantes e duráveis, com design exclusivo.',
  },
  'jaleco-colatina': {
    nome: 'Colatina',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'propria',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Colatina',
    freteGratis: true,
    conteudoLocal: 'Em Colatina, ES, seja no Hospital São José ou nas clínicas da cidade, profissionais valorizam durabilidade e design. Os jalecos da Jaleca combinam funcionalidade e elegância para o dia a dia da saúde colatinense.',
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

  const faq = FAQ_TEMPLATE(cidade.nome, cidade.estado)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: `Jaleco em ${cidade.nome}`, item: `https://jaleca.com.br/cidade/${slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ pergunta, resposta }) => ({
      '@type': 'Question',
      name: pergunta,
      acceptedAnswer: { '@type': 'Answer', text: resposta },
    })),
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
              <span>{cidade.freteGratis ? `Frete Grátis acima de R$499 para ${cidade.nome}` : `Entrega para ${cidade.nome}`}</span>
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

      {/* Conteúdo local */}
      {cidade.conteudoLocal && (
        <section className="py-10 px-4">
          <div className="container max-w-2xl text-center">
            <p className="text-muted-foreground leading-relaxed">{cidade.conteudoLocal}</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-secondary/30 py-12 px-4">
        <div className="container max-w-2xl">
          <h2 className="font-display text-2xl font-semibold mb-8 text-center">
            Dúvidas sobre entrega em {cidade.nome}
          </h2>
          <div className="space-y-4">
            {faq.map(({ pergunta, resposta }) => (
              <details key={pergunta} className="border border-border bg-background group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-semibold list-none flex justify-between items-center gap-2">
                  {pergunta}
                  <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre entrega */}
      <section className="py-12 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Enviamos para {cidade.nome}
          </h2>
          <p className="text-muted-foreground mb-6">
            Todos os pedidos para {cidade.nome}, {cidade.estado}, são enviados com rastreamento completo.
            Prazo estimado de 3 a 7 dias úteis dependendo da modalidade de frete escolhida.
            {cidade.freteGratis && ' Frete grátis (PAC) para compras acima de R$499.'}{' '}
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
