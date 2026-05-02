import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductsClient from '@/app/produtos/ProductsClient'
import { getAllProducts } from '@/lib/all-products'
import type { Metadata } from 'next'

// FAQPage schema para GEO — responde perguntas que ChatGPT/Gemini usam para recomendar
const CAT_FAQ: Record<string, { q: string; a: string }[]> = {
  'jalecos-manga-curta': [
    { q: 'Jaleco manga curta é aceito em hospitais e clínicas?', a: 'Depende do protocolo da instituição. Em clínicas privadas, consultórios e ambientes com temperatura elevada, o jaleco manga curta é amplamente aceito. Em centros cirúrgicos e UTIs, jaleco manga longa é o padrão por questões de biossegurança.' },
    { q: 'Qual a vantagem do jaleco manga curta?', a: 'Maior conforto térmico em ambientes quentes, mais liberdade de movimento para procedimentos e facilidade de higienização dos braços entre atendimentos. É o modelo preferido em clínicas de estética, consultórios odontológicos e ambulatórios com ar-condicionado.' },
    { q: 'Jaleco manga curta feminino tem corte diferente do masculino?', a: 'Sim. O feminino tem corte acinturado, manga calibrada para o biótipo feminino e botões laterais. O masculino tem corte reto e modelagem mais estruturada. Ambos disponíveis na Jaleca do PP ao G3.' },
  ],
  jalecos: [
    { q: 'Qual o melhor jaleco para médicas?', a: 'Para médicas, o melhor jaleco é o modelo Slim, que oferece corte acinturado, tecido premium com durabilidade clínica e visual elegante. A Jaleca oferece modelos Slim Feminino em várias cores com entrega rápida para todo o Brasil.' },
    { q: 'Qual tecido é melhor para jaleco profissional?', a: 'O gabardine e a microfibra são os melhores tecidos para jaleco profissional: resistentes a manchas, de fácil lavagem, não amassam e mantêm o caimento após várias lavagens.' },
    { q: 'Onde comprar jaleco feminino de qualidade?', a: 'A Jaleca é especialista em jalecos femininos para profissionais da saúde, com modelos Slim, Princesa, Duquesa e Elastex. Loja online em jaleca.com.br com entrega para todo o Brasil.' },
    { q: 'Jaleco feminino ou masculino: qual a diferença?', a: 'O jaleco feminino tem corte acinturado, manga mais curta e botões laterais. O masculino tem corte reto e manga mais longa. Ambos disponíveis na Jaleca em tamanhos PP ao G3.' },
  ],
  'jalecos-femininos': [
    { q: 'Qual jaleco feminino é mais elegante para consultório?', a: 'O Jaleco Slim Feminino é o modelo mais elegante para consultório: corte acinturado, tecido premium e disponível em branco, preto e colorido. Ideal para médicas e dentistas que querem aliar estilo e profissionalismo.' },
    { q: 'Como escolher o tamanho certo de jaleco feminino?', a: 'Para escolher o tamanho certo de jaleco feminino, meça o busto e a cintura. A Jaleca disponibiliza tabela de medidas detalhada e Size Advisor no site. Tamanhos de PP ao G3.' },
    { q: 'Qual a diferença entre jaleco Slim, Princesa e Elastex feminino?', a: 'O Slim tem corte acinturado moderno, ideal para consultórios e clínicas. O Princesa tem modelagem mais solta na parte de baixo, perfeito para quem prefere mais conforto. O Elastex é feito em tecido com elastano, oferecendo máxima mobilidade para longas jornadas de trabalho.' },
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
    title: 'Jalecos Profissionais: Feminino, Masculino e Plus Size | Jaleca',
    h1: 'Jalecos Profissionais: Slim, Princesa, Duquesa e Elastex',
    description: 'Jalecos premium com tecido Elastex e gabardine. Modelos Slim, Princesa e Tradicional para médicos, dentistas e enfermeiros. Tamanhos PP ao G3. Frete grátis Sudeste acima de R$499.',
    keywords: 'jalecos, jaleco feminino, jaleco masculino, jaleco branco, jaleco médico, jaleco enfermagem, jaleco dentista, jaleco slim, jaleco profissional, comprar jaleco, jalecos profissionais',
  },
  'jalecos-femininos': {
    label: 'Jalecos Femininos',
    title: 'Jaleco Feminino Slim, Princesa e Elastex | PP ao G3 | Jaleca',
    h1: 'Jalecos Femininos Premium: Slim, Princesa e Elastex',
    filterLabel: 'Jalecos',
    gender: 'Feminino',
    description: 'Jaleco feminino com corte elegante e confortável para clínica, consultório e plantão. Modelos Slim, Princesa e Elastex, do PP ao G3, em várias cores.',
    keywords: 'jaleco feminino, jalecos femininos, jaleco slim feminino, jaleco princesa, jaleco duquesa, jaleco elastex, comprar jaleco feminino, jaleco médica, jaleco dentista feminino, jaleco enfermagem feminino',
  },
  'jalecos-masculinos': {
    label: 'Jalecos Masculinos',
    title: 'Jaleco Masculino à Venda Online — Slim Moderno | Frete Grátis',
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
    title: 'Dólmãs Femininas para Profissionais da Saúde',
    filterLabel: 'Dólmãs',
    gender: 'Feminino',
    description: 'Dólmãs femininas premium para médicas, enfermeiras e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte elegante para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã feminina, dólmã médica feminina, dólmã enfermagem feminina, uniforme feminino saúde, roupa hospitalar feminina',
  },
  'domas-masculinas': {
    label: 'Dólmãs Masculinas',
    title: 'Dólmãs Masculinas para Profissionais da Saúde',
    filterLabel: 'Dólmãs',
    gender: 'Masculino',
    description: 'Dólmãs masculinas premium para médicos, enfermeiros e profissionais da saúde. Modelagem ergonômica, tecido de alta performance e corte moderno para longas jornadas. Tamanhos PP ao G3.',
    keywords: 'dólmã masculina, dólmã médica masculina, dólmã enfermagem masculina, uniforme masculino saúde, roupa hospitalar masculina',
  },
  conjuntos: {
    label: 'Conjuntos',
    title: 'Conjuntos Scrub à Venda — Femininos e Masculinos',
    description: 'Conjuntos scrub e pijamas cirúrgicos para médicos, enfermeiros e profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Modelos femininos e masculinos, tamanhos PP ao G3.',
    keywords: 'conjunto scrub, conjunto médico, conjunto hospitalar, pijama cirúrgico, conjunto enfermagem, scrub feminino, scrub masculino, conjunto uniforme saúde',
  },
  'conjuntos-femininos': {
    label: 'Conjuntos Femininos',
    title: 'Conjuntos Scrub Femininos à Venda',
    filterLabel: 'Conjuntos',
    gender: 'Feminino',
    description: 'Conjuntos scrub femininos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub feminino, pijama cirúrgico feminino, conjunto médico feminino, scrub feminino, conjunto enfermagem feminino, pijama cirúrgico',
  },
  'conjuntos-masculinos': {
    label: 'Conjuntos Masculinos',
    title: 'Conjuntos Scrub Masculinos à Venda',
    filterLabel: 'Conjuntos',
    gender: 'Masculino',
    description: 'Conjuntos scrub masculinos e pijamas cirúrgicos para profissionais da saúde. Calça + blusa com elastano, confortáveis para longas jornadas, cores variadas. Tamanhos PP ao G3.',
    keywords: 'conjunto scrub masculino, pijama cirúrgico masculino, conjunto médico masculino, scrub masculino, conjunto enfermagem masculino',
  },
  'jalecos-manga-curta': {
    label: 'Jalecos Manga Curta',
    title: 'Jaleco Manga Curta: Leve, Confortável e Profissional | Jaleca',
    h1: 'Jalecos Manga Curta para Profissionais da Saúde',
    description: 'Jalecos manga curta para médicos, dentistas e profissionais da saúde. Tecido leve com elastano, ideal para clínicas com temperatura elevada. Femininos e masculinos, PP ao G3.',
    keywords: 'jaleco manga curta, jaleco manga curta feminino, jaleco manga curta médico, jaleco manga curta dentista, jaleco leve, jaleco verão, jaleco curto profissional',
  },
  acessorios: {
    label: 'Acessórios',
    title: 'Acessórios para Profissionais da Saúde | Jaleca — Toucas e Mais',
    description: 'Acessórios para profissionais da saúde: toucas, aventais e complementos para completar seu uniforme médico. Qualidade e praticidade para o dia a dia clínico.',
    keywords: 'acessórios médicos, touca cirúrgica, avental, complementos uniforme saúde, acessórios enfermagem',
  },
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

  const allProducts = await getAllProducts()

  // Para categorias baseadas em nome (não em categoria WooCommerce), filtra por nome do produto
  const NAME_FILTER: Record<string, string> = {
    'jalecos-manga-curta': 'manga curta',
  }
  const products = NAME_FILTER[slug]
    ? allProducts.filter(p => p.name?.toLowerCase().includes(NAME_FILTER[slug]))
    : allProducts

  // Filtra produtos da categoria atual para o ItemList
  const filterLabel = (cat.filterLabel ?? cat.label).toLowerCase()
  const categoryProducts = products
    .filter(p => {
      const matchCat = p.productCategories?.nodes?.some(c =>
        c.name.toLowerCase().includes(filterLabel) ||
        filterLabel.includes(c.name.toLowerCase()) ||
        c.slug.toLowerCase().includes(slug.toLowerCase())
      )
      return matchCat
    })
    .slice(0, 30)

  const itemListSchema = categoryProducts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.label} — Jaleca`,
    description: cat.description,
    numberOfItems: categoryProducts.length,
    itemListElement: categoryProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://jaleca.com.br/produto/${p.slug}`,
      name: p.name,
    })),
  } : null

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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'],
    },
  } : null

  // AggregateRating schema — rich snippet de estrelas no SERP para categoria feminina
  const aggregateRatingSchema = slug === 'jalecos-femininos' ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Jaleco Feminino Jaleca',
    description: 'Jalecos femininos premium: Slim, Princesa e Elastex. Do PP ao G3, em 12 cores.',
    brand: { '@type': 'Brand', name: 'Jaleca' },
    url: 'https://jaleca.com.br/categoria/jalecos-femininos',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '317',
      bestRating: '5',
      worstRating: '1',
    },
  } : null

  // Speakable schema — para assistentes de voz e IAs (Google Assistant, Copilot)
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: cat.h1 ?? `${cat.label} — Jaleca`,
    url: `https://jaleca.com.br/categoria/${slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'h3', '[aria-label*="Sobre"] p'],
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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      {aggregateRatingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(aggregateRatingSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(speakableSchema).replace(/</g, '\\u003c'),
        }}
      />

      <h1 className="sr-only">{cat.h1 ?? `${cat.label} — Jaleca`}</h1>
      <ProductsClient
        products={products}
        initialCat={NAME_FILTER[slug] ? 'Todos' : (cat.filterLabel ?? cat.label)}
        initialGenero={cat.gender}
        pageTitle={cat.h1 ?? `${cat.label} — Jaleca`}
        pageDescription={cat.description}
      />

      {/* SEO text block — visible to crawlers, useful para usuário */}
      <section aria-label={`Sobre ${cat.label}`} className="container pb-10">
        <div className="border-t border-border pt-8 max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-3">{cat.label} para Profissionais da Saúde</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.description}</p>

          {slug === 'jalecos-femininos' && (
            <>
              {/* Texto editorial de abertura */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                O jaleco feminino certo não é o masculino adaptado — é um modelo pensado do molde para cima para o corpo e a rotina de quem trabalha na saúde. A Jaleca desenvolve jalecos femininos com molde próprio: corte que acompanha a silhueta, manga calibrada para o biótipo feminino, comprimento proporcional e tecido que mantém o caimento após dezenas de lavagens. Seja para um consultório de dermatologia, um plantão de 12 horas na UTI ou uma clínica de estética, há um modelo específico para cada contexto — e <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="underline underline-offset-2 hover:text-foreground transition-colors">escolher o modelo certo faz diferença real no conforto e na percepção do paciente</Link>.
              </p>

              {/* Modelos */}
              <h2 className="font-display text-lg font-semibold mb-3 mt-6">Modelos de jaleco feminino</h2>
              <ul className="text-sm text-muted-foreground space-y-3 mb-6">
                <li>
                  <strong>Jaleco Slim Feminino</strong> — corte acinturado com recortes laterais que definem a cintura sem apertar. O modelo mais pedido por médicas e dentistas de consultório. <Link href="/blog/jaleco-slim-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors">Saiba quando o slim é a escolha certa →</Link>
                </li>
                <li>
                  <strong>Jaleco Princesa</strong> — modelagem levemente evasê na parte inferior, bordado delicado no bolso. Visual mais humanizado, muito escolhido por nutricionistas, psicólogas e profissionais de estética.
                </li>
                <li>
                  <strong>Jaleco Duquesa</strong> — manga longa com punho trabalhado, visual sofisticado. A opção mais formal da linha para quem precisa transmitir autoridade máxima no ambiente clínico.
                </li>
                <li>
                  <strong>Jaleco Elastex</strong> — tecido com elastano bidirecional, maior amplitude de movimento. Indicado para plantões longos, pronto-socorro e fisioterapeutas. <Link href="/blog/jaleco-elastano-vale-a-pena" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco com elastano vale a pena? →</Link>
                </li>
              </ul>

              {/* Tabela de decisão */}
              <h2 className="font-display text-lg font-semibold mb-3">Qual modelo escolher — guia rápido</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-white">
                      <th className="text-left p-2">Ambiente / rotina</th>
                      <th className="text-left p-2">Modelo indicado</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border"><td className="p-2">Consultório médico ou odontológico</td><td className="p-2">Slim Tradicional ou Gold</td></tr>
                    <tr className="border-b border-border bg-[#faf9f7]"><td className="p-2">Plantão 12h, UTI, pronto-socorro</td><td className="p-2">Slim Elastex</td></tr>
                    <tr className="border-b border-border"><td className="p-2">Nutrição, estética, psicologia</td><td className="p-2">Slim Princesa</td></tr>
                    <tr className="border-b border-border bg-[#faf9f7]"><td className="p-2">Visual mais formal e estruturado</td><td className="p-2">Duquesa manga longa</td></tr>
                    <tr className="border-b border-border"><td className="p-2">Tamanhos plus size (G1 ao G3)</td><td className="p-2">Slim ou Clássico c/ molde redesenhado</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Por profissão */}
              <h2 className="font-display text-lg font-semibold mb-3">Jaleco feminino por profissão</h2>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li><Link href="/jaleco-medico-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">Jaleco para médica</Link> — Slim e Duquesa, branco ou colorido, dentro das normas do CFM</li>
                <li><Link href="/jaleco-dentista-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">Jaleco para dentista feminino</Link> — modelos aprovados em clínicas odontológicas de todos os portes</li>
                <li><Link href="/jaleco-enfermagem-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">Jaleco para enfermeira</Link> — resistência e praticidade para plantões longos com movimento constante</li>
                <li><Link href="/jaleco-nutricionista" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">Jaleco para nutricionista</Link> — modelos femininos em cores variadas, Slim e Princesa</li>
                <li><Link href="/jaleco-fisioterapeuta" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">Jaleco para fisioterapeuta</Link> — Elastex com máxima amplitude de movimento</li>
              </ul>

              {/* Tamanhos */}
              <h2 className="font-display text-lg font-semibold mb-3">Tamanhos — do PP ao G3</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Os jalecos femininos da Jaleca vão do <strong>PP ao G3</strong>. Os tamanhos plus size (G1 ao G3) têm molde redesenhado — não é o G ampliado, mas um molde específico com maior amplitude no quadril, ombro proporcional e manga com circunferência adequada para o braço. Na dúvida entre dois tamanhos no modelo Slim, sempre vá para o maior. <Link href="/blog/jaleco-feminino-tamanho-certo" className="underline underline-offset-2 hover:text-foreground transition-colors">Veja o guia completo de medidas para jaleco feminino →</Link>
              </p>

              {/* Cores */}
              <h2 className="font-display text-lg font-semibold mb-3">Cores disponíveis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A linha feminina está disponível em <strong>12 cores</strong>, incluindo branco hospitalar, preto, marsala, verde musgo, azul marinho, rosê e outros. O tingimento de alta durabilidade garante que o branco permanece branco após dezenas de lavagens com alvejante. Para ambientes que exigem cor específica por protocolo, consulte o guia de <Link href="/blog/jaleco-colorido-clinica" className="underline underline-offset-2 hover:text-foreground transition-colors">jaleco colorido na clínica</Link>.
              </p>

              {/* Tecidos */}
              <h2 className="font-display text-lg font-semibold mb-3">Tecidos e composição</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Todos os jalecos femininos da Jaleca são produzidos em <strong>Elastex</strong> (poliéster com elastano bidirecional), <strong>gabardine</strong> ou <strong>Oxford premium</strong>. Cada tecido passa por controle de qualidade e é testado para resistir a múltiplas lavagens sem perder o caimento ou encolher. O elastano bidirecional — presente no Slim Elastex — cede em x e y, não apenas em um eixo, garantindo liberdade total de movimento.
              </p>

              {/* Blog hub links */}
              <h2 className="font-display text-lg font-semibold mb-3">Guias e leituras sobre jaleco feminino</h2>
              <ul className="text-sm space-y-2 mb-2">
                <li><Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline">→ Guia completo: como escolher jaleco feminino</Link></li>
                <li><Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline">→ Jaleco slim feminino: modelos e quando usar</Link></li>
                <li><Link href="/blog/jaleco-feminino-tamanho-certo" className="text-[#c4a97d] hover:underline">→ Como encontrar o tamanho certo de jaleco feminino</Link></li>
                <li><Link href="/blog/jaleco-plus-size-feminino-guia" className="text-[#c4a97d] hover:underline">→ Jaleco feminino plus size: do G1 ao G3</Link></li>
                <li><Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline">→ Jaleco branco: como manter sempre imaculado</Link></li>
                <li><Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline">→ Jaleco colorido na clínica: o que cada conselho permite</Link></li>
                <li><Link href="/blog/jaleco-elastano-vale-a-pena" className="text-[#c4a97d] hover:underline">→ Jaleco com elastano: vale a pena?</Link></li>
                <li><Link href="/blog/jaleco-ou-scrub-consultorio" className="text-[#c4a97d] hover:underline">→ Jaleco ou scrub: qual escolher para o consultório?</Link></li>
              </ul>
            </>
          )}

          {slug === 'jalecos' && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Modelos de jalecos disponíveis</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><strong>Jaleco Slim</strong> — corte acinturado, ideal para médicas e dentistas que buscam elegância clínica</li>
                <li><strong>Jaleco Princesa</strong> — logo Jaleca no bolso, exclusivo para profissionais que querem personalidade</li>
                <li><strong>Jaleco Duquesa</strong> — manga longa com punho, formal e versátil para consultórios</li>
                <li><strong>Jaleco Elastex</strong> — tecido com elastano para máximo conforto em longas jornadas</li>
                <li><strong>Jaleco Gold</strong> — linha premium com acabamentos diferenciados para quem exige o melhor</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">Como escolher o jaleco certo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A escolha do jaleco ideal depende da profissão, do ambiente de trabalho e do estilo pessoal. Para consultórios e clínicas, o <strong>Jaleco Slim</strong> é o mais elegante — corte acinturado e tecido que não amassa mesmo após horas de uso. Para quem precisa de mobilidade em plantões longos, o <strong>Jaleco Elastex</strong> com elastano é o mais confortável. Já o <strong>Jaleco Duquesa</strong>, com manga longa e punho trabalhado, é a escolha de quem quer transmitir autoridade e formalidade no ambiente clínico.
              </p>
              <h3 className="text-sm font-semibold mb-2">Jalecos por profissão</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><Link href="/categoria/jalecos-femininos" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco feminino</Link> — linha completa Slim, Princesa e Elastex para profissionais de saúde</li>
                <li><Link href="/jaleco-medico" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para médico</Link> — elegância e autoridade no consultório</li>
                <li><Link href="/jaleco-dentista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para dentista</Link> — modelos aprovados em clínicas odontológicas</li>
                <li><Link href="/jaleco-enfermeiro" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para enfermagem</Link> — resistência e praticidade para plantões</li>
                <li><Link href="/jaleco-universitario" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco universitário</Link> — custo-benefício para estudantes de medicina e enfermagem</li>
                <li><Link href="/jaleco-nutricionista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para nutricionista</Link> — modelos coloridos e práticos</li>
                <li><Link href="/jaleco-farmacia" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para farmácia</Link> — visual profissional com identificação visual</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">Tecidos e composição</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Os jalecos da Jaleca são produzidos em <strong>Elastex</strong> (poliéster + elastano), <strong>gabardine</strong> e <strong>Oxford premium</strong>. Todos resistem a lavagens frequentes sem encolher ou perder o caimento. O tingimento de alta durabilidade garante que o branco permanece branco mesmo após dezenas de lavagens com alvejante.
              </p>
            </>
          )}

          {slug === 'jalecos-masculinos' && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Modelos de jaleco masculino disponíveis</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><strong>Jaleco Slim Masculino</strong> — corte ajustado ao corpo com visual moderno. Ideal para médicos e dentistas que querem elegância sem abrir mão do conforto.</li>
                <li><strong>Jaleco Profissional</strong> — corte reto e estruturado, com mais espaço para movimento. A escolha clássica para quem prefere um jaleco mais amplo e formal.</li>
                <li><strong>Jaleco com Zíper</strong> — fechamento prático e visual contemporâneo, muito escolhido por profissionais de clínicas modernas.</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">Jaleco masculino pode ser acinturado?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Sim. O modelo Slim masculino da Jaleca tem leve ajuste na cintura, sem deixar o jaleco apertado. É diferente do corte feminino — o Slim masculino preserva a amplitude nos ombros e no tórax, com a silhueta levemente ajustada para um visual mais contemporâneo.
              </p>
              <h3 className="text-sm font-semibold mb-2">Jalecos masculinos por profissão</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><Link href="/jaleco-medico" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para médico</Link> — Slim e Profissional, branco ou colorido</li>
                <li><Link href="/jaleco-dentista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para dentista</Link> — modelos aprovados em clínicas odontológicas</li>
                <li><Link href="/jaleco-enfermeiro" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para enfermeiro</Link> — resistência para plantões longos</li>
                <li><Link href="/jaleco-biomedico" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para biomédico</Link> — modelos técnicos com bolsos funcionais</li>
              </ul>
            </>
          )}

          {slug === 'jalecos-manga-curta' && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Por que escolher jaleco manga curta</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                O jaleco manga curta é a escolha certa para profissionais que trabalham em ambientes quentes ou precisam de maior liberdade de movimento. Em consultórios odontológicos, clínicas de estética e ambulatórios, o manga curta oferece conforto térmico sem abrir mão da aparência profissional. O tecido com elastano da Jaleca garante que o jaleco acompanha os movimentos sem prender — essencial para quem passa horas realizando procedimentos.
              </p>
              <h3 className="text-sm font-semibold mb-2">Jaleco manga curta por profissão</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><Link href="/jaleco-dentista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco manga curta para dentista</Link> — liberdade de movimento ao redor da cadeira odontológica</li>
                <li><Link href="/jaleco-esteticista" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco manga curta para esteticista</Link> — conforto em cabines com temperatura elevada</li>
                <li><Link href="/jaleco-medico" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco manga curta para médico</Link> — aceito em consultórios e UPAs</li>
                <li><Link href="/jaleco-enfermeiro" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco manga curta para enfermagem</Link> — facilidade de higienização dos braços entre atendimentos</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">Manga curta vs. manga longa: quando usar cada um</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                O jaleco manga longa é exigido em centros cirúrgicos, UTIs e ambientes com risco biológico elevado — a manga funciona como barreira de proteção. Para consultórios, clínicas ambulatoriais e ambientes com ar-condicionado, a manga curta é aceita e preferida pela maioria dos profissionais por conforto. Verifique sempre o protocolo da sua instituição antes de escolher.
              </p>
            </>
          )}

          {slug === 'conjuntos-femininos' && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Conjunto scrub feminino: blusa + calça com elastano</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Os conjuntos femininos da Jaleca são a versão brasileira do <Link href="/scrub-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors">scrub feminino</Link> — blusa e calça desenvolvidos juntos para combinar perfeitamente. O tecido com elastano garante conforto durante longas jornadas, e o corte é pensado para o biótipo feminino real, não o masculino adaptado. Disponíveis em 12 cores, do branco clínico ao colorido, com tamanhos do PP ao G3.
              </p>
              <h3 className="text-sm font-semibold mb-2">Por que escolher conjunto em vez de jaleco?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                O jaleco é obrigatório em consultórios e ambientes clínicos formais. Já o conjunto (scrub) é a escolha de profissionais que precisam de mais mobilidade — enfermeiras em plantão, técnicas de enfermagem, fisioterapeutas e profissionais de estética. O conjunto tem acabamento profissional e segue as normas de uniformes de saúde, sem abrir mão do conforto.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li><Link href="/scrub-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors">Scrub feminino</Link> — guia completo com modelos, cores e como escolher o tamanho certo</li>
                <li><Link href="/jaleco-enfermeira" className="underline underline-offset-2 hover:text-foreground transition-colors">Jaleco para enfermeira</Link> — quando o jaleco é exigido no ambiente de trabalho</li>
                <li><Link href="/jaleco-feminino" className="underline underline-offset-2 hover:text-foreground transition-colors">Jalecos femininos</Link> — linha completa para médicas, dentistas e profissionais de saúde</li>
              </ul>
            </>
          )}

          {(slug === 'domas' || slug === 'domas-femininas' || slug === 'domas-masculinas') && (
            <>
              <h3 className="text-sm font-semibold mb-2 mt-5">Jaleco ou dólmã: qual a diferença?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                O jaleco tem abertura frontal com botões ou zíper e mangas longas — é o uniforme clássico de consultórios e hospitais. A dólmã tem mangas curtas, abertura lateral com botões de pressão e é mais leve e ventilada. A dólmã é muito usada em cirurgias, procedimentos estéticos, gastronomia profissional e qualquer ambiente que exija maior mobilidade dos braços.
              </p>
              {slug === 'domas-femininas' && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  As dólmãs femininas da Jaleca têm modelagem ergonômica pensada para o biótipo feminino — não são o modelo masculino adaptado. Disponíveis em cores variadas, do branco clínico ao azul e verde, com tamanhos do PP ao G3.
                </p>
              )}
              {slug === 'domas-masculinas' && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  As dólmãs masculinas da Jaleca combinam corte moderno com funcionalidade clínica. Tecido de alta performance, bolsos bem posicionados e costuras reforçadas para suportar a rotina intensa de plantões e procedimentos.
                </p>
              )}
              <h3 className="text-sm font-semibold mb-2">Quando usar dólmã</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li>Centros cirúrgicos e salas de procedimento — onde a mobilidade é essencial</li>
                <li>Profissionais de estética e fisioterapia — leveza para longas jornadas em pé</li>
                <li>Gastronomia profissional — modelo clássico de cozinha</li>
                <li>Ambientes com temperatura elevada — tecido mais ventilado que o jaleco tradicional</li>
              </ul>
            </>
          )}

          <h3 className="text-sm font-semibold mb-2 mt-5">Por que escolher a Jaleca?</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Mais de 200 mil peças vendidas e 4.9/5 de avaliação no Google</li>
            <li>Tamanhos PP ao G3 — únicos no mercado para todos os biótipos</li>
            <li>Try-on virtual: experimente o jaleco antes de comprar</li>
            <li>Entrega rápida para todo o Brasil — frete grátis no Sudeste acima de R$499</li>
            <li>Devolução em até 7 dias por arrependimento · 30 dias para defeito de fabricação</li>
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
