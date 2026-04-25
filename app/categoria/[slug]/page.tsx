import { notFound } from 'next/navigation'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { graphqlClient, GET_PRODUCTS_LISTING } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'

// FAQPage schema para GEO — responde perguntas que ChatGPT/Gemini usam para recomendar
const CAT_FAQ: Record<string, { q: string; a: string }[]> = {
  jalecos: [
    { q: 'Qual o melhor jaleco para médicas?', a: 'Para médicas, o melhor jaleco é o modelo Slim, que oferece corte acinturado, tecido premium com durabilidade clínica e visual elegante. A Jaleca oferece modelos Slim Feminino em várias cores com entrega rápida para todo o Brasil.' },
    { q: 'Qual tecido é melhor para jaleco profissional?', a: 'O gabardine e a microfibra são os melhores tecidos para jaleco profissional: resistentes a manchas, de fácil lavagem, não amassam e mantêm o caimento após várias lavagens.' },
    { q: 'Onde comprar jaleco feminino de qualidade?', a: 'A Jaleca é especialista em jalecos femininos para profissionais da saúde, com modelos Slim, Princesa, Duquesa e Elastex. Loja online em jaleca.com.br com entrega para todo o Brasil.' },
    { q: 'Jaleco feminino ou masculino: qual a diferença?', a: 'O jaleco feminino tem corte acinturado, manga mais curta e botões laterais. O masculino tem corte reto e manga mais longa. Ambos disponíveis na Jaleca em tamanhos PP ao G3.' },
  ],
  'jalecos-femininos': [
    { q: 'Qual jaleco feminino é mais elegante para consultório?', a: 'O Jaleco Slim Feminino é o modelo mais elegante para consultório: corte acinturado, tecido premium e disponível em branco, preto e colorido. Ideal para médicas e dentistas que querem aliar estilo e profissionalismo.' },
    { q: 'Como escolher o tamanho certo de jaleco feminino?', a: 'Para escolher o tamanho certo de jaleco feminino, meça o busto e a cintura. A Jaleca disponibiliza tabela de medidas detalhada e Size Advisor no site. Tamanhos de PP ao G3.' },
    { q: 'Jaleco feminino branco ou colorido: qual é mais profissional?', a: 'O jaleco branco é o mais tradicional em ambientes hospitalares. O jaleco colorido é muito comum em clínicas, consultórios e estética. Ambos são profissionais dependendo do ambiente de trabalho.' },
  ],
  conjuntos: [
    { q: 'O que é scrub médico?', a: 'Scrub médico é o conjunto de calça e blusa usados por profissionais da saúde, especialmente em cirurgias e centros cirúrgicos. É confortável, fácil de lavar e disponível em diversas cores. A Jaleca oferece scrubs femininos e masculinos de alta qualidade.' },
    { q: 'Qual a diferença entre scrub e pijama cirúrgico?', a: 'Scrub e pijama cirúrgico são a mesma coisa: conjunto de calça e blusa para uso em centros cirúrgicos e hospitais. O nome "scrub" é mais moderno, enquanto "pijama cirúrgico" é o termo tradicional.' },
    { q: 'Scrub serve para qual profissão?', a: 'Scrub serve para médicos, enfermeiros, técnicos de enfermagem, cirurgiões, anestesistas e qualquer profissional que trabalha em ambiente hospitalar ou centro cirúrgico.' },
  ],
  domas: [
    { q: 'O que é dólmã?', a: 'Dólmã é um jaleco de mangas curtas com abertura lateral e botões de pressão, muito usado por médicos, enfermeiros e profissionais de gastronomia. É mais leve que o jaleco tradicional e permite maior mobilidade.' },
    { q: 'Qual a diferença entre jaleco e dólmã?', a: 'O jaleco tem abertura frontal com botões ou zíper e mangas longas. A dólmã tem mangas curtas e abertura lateral, sendo mais leve e ventilada. A dólmã é muito usada em cirurgias e cozinhas profissionais.' },
  ],
  acessorios: [
    { q: 'Quais acessórios estão disponíveis para profissionais de saúde?', a: 'A Jaleca oferece toucas cirúrgicas, aventais e complementos para completar seu uniforme médico. Todos os produtos são de alta qualidade e entrega rápida para todo o Brasil.' },
    { q: 'Touca cirúrgica descartável ou reutilizável?', a: 'A touca cirúrgica reutilizável da Jaleca é produzida em tecido de alta performance, confortável para longas jornadas e sustentável. Pode ser lavada e reutilizada várias vezes.' },
    { q: 'Como escolher o avental ideal para profissional de saúde?', a: 'Para escolher o avental ideal, considere o ambiente de trabalho: centros cirúrgicos exigem material descartável, enquanto clínicas podem usar aventais reutilizáveis de tecido premium.' },
  ],
}

const CATEGORY_MAP: Record<string, { label: string; description: string; keywords: string; filterLabel?: string; title?: string; h1?: string; gender?: string }> = {
  jalecos: {
    label: 'Jalecos',
    title: 'Jalecos para Médicos e Profissionais de Saúde | Jaleca',
    h1: 'Jalecos Profissionais — Femininos e Masculinos',
    description: 'Compre jalecos para médicos, dentistas, enfermeiros e farmacêuticos. Modelos Slim, Princesa, Duquesa e Elastex — brancos, pretos e coloridos. Tecido premium, tamanhos PP ao G3, frete grátis no Sudeste acima de R$499.',
    keywords: 'jalecos, jaleco feminino, jaleco masculino, jaleco branco, jaleco médico, jaleco enfermagem, jaleco dentista, jaleco slim, jaleco profissional, comprar jaleco, jalecos profissionais',
  },
  'jalecos-femininos': {
    label: 'Jalecos Femininos',
    title: 'Jaleco Femenino à Venda Online — Slim, Princesa, Elastex | Jaleca',
    filterLabel: 'Jalecos',
    gender: 'Feminino',
    description: 'Jalecos femininos para médicas, dentistas e enfermeiras. Modelos Slim, Princesa, Duquesa e Elastex — brancos, pretos e coloridos. Corte acinturado, tecido de alta performance. Tamanhos PP ao G3 com frete grátis no Sudeste acima de R$499.',
    keywords: 'jaleco feminino, jalecos femininos, jaleco slim feminino, jaleco princesa, jaleco duquesa, jaleco elastex, comprar jaleco feminino, jaleco médica, jaleco dentista feminino, jaleco enfermagem feminino',
  },
  'jalecos-masculinos': {
    label: 'Jalecos Masculinos',
    title: 'Jaleco Masculino à Venda Online — Slim Moderno | Frete Grátis | Jaleca',
    filterLabel: 'Jalecos',
    gender: 'Masculino',
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
    gender: 'Feminino',
    description: 'Dólmãs femininas premium para médicas, enfermeiras e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte elegante para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã feminina, dólmã médica feminina, dólmã enfermagem feminina, uniforme feminino saúde, roupa hospitalar feminina',
  },
  'domas-masculinas': {
    label: 'Dólmãs Masculinas',
    title: 'Dólmãs Masculinas para Profissionais da Saúde | Jaleca',
    filterLabel: 'Dólmãs',
    gender: 'Masculino',
    description: 'Dólmãs masculinas premium para médicos, enfermeiros e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte moderno para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã masculina, dólmã médica masculina, dólmã enfermagem masculina, uniforme masculino saúde, roupa hospitalar masculina',
  },
  conjuntos: {
    label: 'Conjuntos',
    title: 'Conjuntos Scrub à Venda — Femininos e Masculinos | Jaleca',
    description: 'Conjuntos scrub e pijamas cirúrgicos para médicos, enfermeiros e profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Modelos femininos e masculinos, tamanhos PP ao G3.',
    keywords: 'conjunto scrub, conjunto médico, conjunto hospitalar, pijama cirúrgico, conjunto enfermagem, scrub feminino, scrub masculino, conjunto uniforme saúde',
  },
  'conjuntos-femininos': {
    label: 'Conjuntos Femininos',
    title: 'Conjuntos Scrub Femininos à Venda | Jaleca',
    filterLabel: 'Conjuntos',
    gender: 'Feminino',
    description: 'Conjuntos scrub femininos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub feminino, pijama cirúrgico feminino, conjunto médico feminino, scrub feminino, conjunto enfermagem feminino, pijama cirúrgico',
  },
  'conjuntos-masculinos': {
    label: 'Conjuntos Masculinos',
    title: 'Conjuntos Scrub Masculinos à Venda | Jaleca',
    filterLabel: 'Conjuntos',
    gender: 'Masculino',
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

const fetchProducts = async (): Promise<WooProduct[]> => {
  const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
    GET_PRODUCTS_LISTING,
    { first: 100 }
  )
  if (!data.products.nodes.length) throw new Error('WooCommerce retornou 0 produtos')
  return data.products.nodes
}

const getProductsCached = unstable_cache(fetchProducts, ['all-products'], { revalidate: 3600, tags: ['products'] })

async function getProducts(): Promise<WooProduct[]> {
  try {
    return await getProductsCached()
  } catch {
    console.warn('[getProducts/categoria] Cache miss, tentando fetch direto...')
    try { return await fetchProducts() } catch { return [] }
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

  // FAQPage schema — GEO (Generative Engine Optimization)
  // Responde perguntas que IAs (ChatGPT, Gemini) usam para recomendar produtos
  const faqSchema = CAT_FAQ[slug] ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CAT_FAQ[slug].map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <ProductsClient
        products={products}
        initialCat={cat.filterLabel ?? cat.label}
        initialGenero={cat.gender}
        pageTitle={cat.h1 ?? `${cat.label} — Jaleca`}
        pageDescription={cat.description}
      />

      {/* SEO text block — visible to crawlers, useful para usuário */}
      <section aria-label={`Sobre ${cat.label}`} className="container pb-10">
        <div className="border-t border-border pt-8 max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-3">{cat.label} para Profissionais da Saúde</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.description}</p>

          {slug === 'jalecos' && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Modelos de jalecos disponíveis</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><strong>Jaleco Slim</strong> — corte acinturado, ideal para médicas e dentistas que buscam elegância clínica</li>
                <li><strong>Jaleco Princesa</strong> — bordado no bolso, exclusivo para profissionais que querem personalidade</li>
                <li><strong>Jaleco Duquesa</strong> — manga longa com punho, formal e versátil para consultórios</li>
                <li><strong>Jaleco Elastex</strong> — tecido com elastano para máximo conforto em longas jornadas</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">Jalecos por profissão</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><Link href="/jaleco-dentista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para dentista</Link> — modelos aprovados em clínicas odontológicas</li>
                <li><Link href="/jaleco-para-enfermeira" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para enfermagem</Link> — resistência e praticidade para plantões</li>
                <li><Link href="/jaleco-medico" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para médico</Link> — elegância e autoridade no consultório</li>
                <li><Link href="/jaleco-universitario" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco universitário</Link> — custo-benefício para estudantes de medicina e enfermagem</li>
              </ul>
            </>
          )}

          <h3 className="text-sm font-semibold mb-2 mt-5">Por que escolher a Jaleca?</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Mais de 200 mil peças vendidas e 4.9/5 de avaliação no Google</li>
            <li>Tamanhos PP ao G3 — únicos no mercado para todos os biótipos</li>
            <li>Try-on virtual: experimente o jaleco antes de comprar</li>
            <li>Entrega rápida para todo o Brasil — frete grátis no Sudeste acima de R$499</li>
            <li>Troca fácil em até 30 dias após o recebimento</li>
          </ul>
          <h3 className="text-sm font-semibold mt-5 mb-2">Guias e dicas</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><Link href="/blog/como-lavar-jaleco-profissional-guia-completo" className="underline underline-offset-2 hover:text-foreground transition-colors">Como lavar jaleco profissional: guia completo</Link></li>
            <li><Link href="/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco ou scrub: qual a diferença e quando usar cada um</Link></li>
            <li><Link href="/blog/jaleco-feminino-premium-como-escolher" className="underline underline-offset-2 hover:text-foreground transition-colors">Como escolher o jaleco feminino ideal para sua profissão</Link></li>
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
