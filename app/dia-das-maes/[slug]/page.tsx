import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { Truck, RotateCcw, ShieldCheck, Star, Gift, Heart } from 'lucide-react'

type NichoInfo = {
  titulo: string
  subtitulo: string
  profissoes: string
  profissaoLabel: string
  conteudoParagrafos: string[]
  emoji: string
}

const FAQ_TEMPLATE = (nicho: NichoInfo) => [
  {
    pergunta: `Jaleco é um bom presente de Dia das Mães para ${nicho.profissaoLabel}?`,
    resposta: `Com certeza! Um jaleco de qualidade é um presente funcional e cheio de significado. Mostra que você valoriza o trabalho dela. Os jalecos Jaleca têm tecido premium, design elegante e duram muito — é um presente que ela vai usar todo dia e lembrar de você.`,
  },
  {
    pergunta: `Qual tamanho escolher de jaleco para dar de presente?`,
    resposta: `Temos os tamanhos PP, P, M, G, GG, G1, G2 e G3. Se você não sabe o tamanho dela, recomendamos verificar a tabela de medidas no site. Também oferecemos troca grátis em até 30 dias, então se o tamanho não for perfeito, é só trocar sem custo.`,
  },
  {
    pergunta: `Qual o prazo de entrega para o Dia das Mães?`,
    resposta: `O prazo varia de 3 a 7 dias úteis após a confirmação do pagamento. Para garantir que o presente chegue a tempo, faça o pedido com antecedência. Você recebe o código de rastreamento por e-mail assim que o pedido for despachado.`,
  },
  {
    pergunta: `Posso trocar o jaleco se não ficar bom nela?`,
    resposta: `Sim! Oferecemos troca grátis em até 30 dias após o recebimento. Basta entrar em contato pelo WhatsApp ou e-mail, devolver o produto sem uso e com etiqueta, e enviamos o tamanho certo sem custo extra.`,
  },
]

const NICHOS: Record<string, NichoInfo> = {
  saude: {
    titulo: 'Presente de Dia das Mães para Profissional de Saúde',
    subtitulo: 'O jaleco que ela merece — elegante, confortável e feito para a rotina dela',
    profissoes: 'médicas, enfermeiras, dentistas, fisioterapeutas e profissionais de saúde',
    profissaoLabel: 'profissional de saúde',
    emoji: '🩺',
    conteudoParagrafos: [
      'Procurando um presente criativo para o Dia das Mães para uma médica, enfermeira ou dentista? Um jaleco de qualidade é uma das ideias de presente mais significativas que existem — porque é algo que ela vai usar todo dia, no trabalho que ela ama.',
      'Profissionais de saúde passam horas de jaleco. Uma médica usa o jaleco por toda a jornada no hospital ou na clínica. Uma enfermeira percorre corredores inteiros com o mesmo uniforme. Uma dentista recebe paciente após paciente. O jaleco não é só uma peça de roupa — é parte da identidade profissional delas.',
      'Por isso, quando o jaleco é bom, faz diferença. Tecido que não abafa, corte que valoriza, acabamento que dura lavagem após lavagem. Os jalecos Jaleca são desenvolvidos pensando nisso: conforto para longas jornadas, elegância que transmite confiança e qualidade que não decepciona.',
      'Ideias de presente para mãe médica no Dia das Mães podem incluir kits completos — jaleco + dólmã ou jaleco + conjunto — para ela ter opções durante a semana. Para mãe enfermeira, um jaleco de manga curta ou longa dependendo do ambiente em que ela trabalha. Para mãe dentista, modelos mais ajustados que ficam bonitos mesmo usando máscara e luvas.',
      'A Jaleca tem mais de 8 anos vestindo profissionais de saúde no Brasil. São mais de 500 avaliações com nota média 4.9 — porque o produto entrega o que promete. Tecido importado, costura reforçada, bolsos funcionais. Um presente que ela vai receber com emoção e usar com orgulho.',
      'Aproveite: frete grátis (PAC) para SP, RJ, MG e ES nas compras acima de R$499. Troca garantida em até 30 dias. Compra 100% segura. Escolha o presente perfeito para a sua mãe logo abaixo.',
    ],
  },
  estetica: {
    titulo: 'Presente de Dia das Mães para Esteticista',
    subtitulo: 'Ela cuida da beleza das outras — presenteie com elegância e conforto',
    profissoes: 'esteticistas, cosmetólogas, micropigmentadoras e profissionais de beleza',
    profissaoLabel: 'esteticista ou profissional de beleza',
    emoji: '💆',
    conteudoParagrafos: [
      'Procurando ideias de presente criativo para o Dia das Mães para uma esteticista ou profissional de beleza? Um jaleco elegante e confortável é exatamente o tipo de presente que ela não compra pra si mesma — mas que faz toda a diferença no dia a dia dela.',
      'A rotina de uma esteticista é intensa. Horas em pé, atendimentos consecutivos, movimentos constantes. O jaleco precisa acompanhar isso: tecido que não amassa, que não abafa, que deixa ela livre para trabalhar. E que, ao mesmo tempo, transmita a elegância que o ambiente de estética exige.',
      'Os jalecos Jaleca têm esse equilíbrio. O tecido é macio e respirável, o corte valoriza a silhueta sem apertar, e o acabamento é impecável — do botão à costura. Uma esteticista com um jaleco Jaleca chega ao trabalho com confiança e termina o dia sem aquela sensação de desconforto.',
      'Presente para mãe esteticista no Dia das Mães pode ser um jaleco clássico branco, que combina com qualquer ambiente, ou um modelo colorido para quem gosta de personalidade. A Jaleca tem opções para todos os estilos — e tamanhos de PP ao G3 para garantir o caimento perfeito.',
      'Micropigmentadoras e cosmetólogas também encontram aqui o jaleco ideal. Modelos que ficam bonitos nas fotos do antes e depois, que não soltam pano no cliente e que lavam fácil. Presente funcional, bonito e cheio de significado.',
      'Troca grátis em até 30 dias se o tamanho não ficar certo. Entrega com rastreamento para todo o Brasil. Aproveite e escolha o presente perfeito para ela logo abaixo.',
    ],
  },
  veterinaria: {
    titulo: 'Presente de Dia das Mães para Veterinária',
    subtitulo: 'Para a mãe que ama todos os bichos — um jaleco à altura da paixão dela',
    profissoes: 'veterinárias, zootecnistas e profissionais de medicina veterinária',
    profissaoLabel: 'veterinária',
    emoji: '🐾',
    conteudoParagrafos: [
      'Sua mãe escolheu uma das profissões mais desafiadoras e mais bonitas que existem. Cuidar de animais exige dedicação, resistência e muito amor. Se você está procurando um presente criativo para o Dia das Mães para veterinária, um jaleco de qualidade é uma ideia que ela vai adorar.',
      'Veterinárias usam o jaleco em atendimentos clínicos, cirurgias, exames e visitas a campo. Precisa ser resistente — aguentar o contato com animais, fácil de lavar, sem perder a forma. Mas também precisa ser confortável, porque a jornada é longa e exigente.',
      'Os jalecos Jaleca são feitos para isso. Tecido de alta qualidade que resiste a lavagens frequentes sem desbotar ou encolher. Costura reforçada nos pontos de tensão. Bolsos espaçosos e funcionais para quem precisa ter tudo à mão durante o atendimento. Um jaleco que dura de verdade.',
      'Presente para mãe veterinária no Dia das Mães pode ser um modelo clássico branco — o mais usado em clínicas — ou um dólmã para quem prefere praticidade. Para quem trabalha em pet shops ou clínicas com visual mais moderno, modelos coloridos ou com detalhes são uma ótima pedida.',
      'Ideias de presente para mãe que ama animais vão além dos mimos óbvios. Um jaleco que ela vai usar todos os dias é um presente com significado real — que lembra o quanto você valoriza a escolha dela, a profissão que ela exerce com tanto cuidado.',
      'Tamanhos de PP ao G3. Troca grátis em 30 dias. Entrega com rastreamento para todo o Brasil. Escolha o presente certo para ela logo abaixo.',
    ],
  },
  nutricao: {
    titulo: 'Presente de Dia das Mães para Nutricionista',
    subtitulo: 'Ela cuida da alimentação e da saúde — presenteie com qualidade',
    profissoes: 'nutricionistas, dietistas e profissionais de nutrição',
    profissaoLabel: 'nutricionista',
    emoji: '🥗',
    conteudoParagrafos: [
      'Procurando ideia de presente criativo para o Dia das Mães para nutricionista? Um jaleco elegante e de qualidade é uma das melhores opções — presente prático, bonito e com significado para quem usa jaleco todos os dias no trabalho.',
      'Nutricionistas atendem em consultórios, hospitais, clínicas de saúde e empresas. A imagem que transmitem importa: um jaleco bem cuidado passa profissionalismo e confiança para o paciente logo no primeiro momento. Por isso, a qualidade do jaleco faz diferença real na rotina dela.',
      'Os jalecos Jaleca têm tecido que mantém a aparência impecável mesmo depois de horas de uso. Não amassa, não abafa, não puxa. O corte é pensado para valorizar sem apertar — importante para quem fica em pé a maior parte do dia, circulando entre pacientes e revisando planos alimentares.',
      'Presente para mãe nutricionista no Dia das Mães pode ser um jaleco branco clássico ou um modelo com detalhes coloridos para quem gosta de um toque de personalidade. Dólmãs são outra opção muito usada por nutricionistas — práticos, confortáveis e com visual limpo.',
      'Se você não sabe o tamanho dela, não se preocupe: oferecemos troca grátis em até 30 dias. Escolha um tamanho e, se não ficar perfeito, é só trocar sem custo. Temos tamanhos de PP ao G3 para atender todos os biotipos.',
      'Frete para todo o Brasil com rastreamento. Frete grátis (PAC) para SP, RJ, MG e ES acima de R$499. Escolha o presente ideal para a sua mãe nutricionista logo abaixo.',
    ],
  },
  farmacia: {
    titulo: 'Presente de Dia das Mães para Farmacêutica',
    subtitulo: 'Para a mãe que trabalha com saúde e responsabilidade — um jaleco à altura',
    profissoes: 'farmacêuticas, bioquímicas e profissionais de farmácia',
    profissaoLabel: 'farmacêutica ou bioquímica',
    emoji: '💊',
    conteudoParagrafos: [
      'Se você está buscando uma ideia de presente para o Dia das Mães para farmacêutica ou bioquímica, um jaleco de qualidade é uma escolha acertada. É o presente que ela não compra pra si mesma, mas que vai agradecer muito quando receber.',
      'Farmacêuticas passam horas de jaleco. No balcão da farmácia, no laboratório de manipulação, na clínica ou no hospital. O jaleco é parte da identidade profissional delas — e quando é um jaleco bom, ela percebe a diferença desde o primeiro dia.',
      'Os jalecos Jaleca têm tecido importado que não abafa e não amassa fácil. Costura reforçada para aguentar o uso frequente e as lavagens da rotina. Bolsos bem posicionados para quem precisa ter caneta, bloco de anotações e outros itens à mão o tempo todo. Um jaleco funcional e elegante ao mesmo tempo.',
      'Presente para mãe farmacêutica no Dia das Mães pode ser um jaleco manga longa para quem trabalha em ambiente com ar-condicionado intenso, ou manga curta para quem prefere praticidade. O branco clássico nunca erra — é o padrão da profissão. Mas se ela gosta de personalidade, temos modelos com detalhes e cores.',
      'Bioquímicas que trabalham em laboratórios de análises clínicas também encontram aqui os modelos ideais — resistentes, fáceis de lavar e que mantêm a aparência profissional mesmo em jornadas longas.',
      'Tamanhos de PP ao G3. Troca grátis em 30 dias se não ficar bom. Entrega com rastreamento para todo o Brasil. Escolha o presente certo para a sua mãe logo abaixo.',
    ],
  },
  laboratorio: {
    titulo: 'Presente de Dia das Mães para Laboratorista',
    subtitulo: 'Para a mãe cientista — precisão, conforto e estilo no laboratório',
    profissoes: 'laboratoristas, biomédicas, bioquímicas e profissionais de laboratório',
    profissaoLabel: 'laboratorista ou biomédica',
    emoji: '🔬',
    conteudoParagrafos: [
      'Procurando um presente criativo para o Dia das Mães para biomédica, laboratorista ou profissional de análises clínicas? Um jaleco de qualidade é a escolha ideal — presente funcional, elegante e com significado para quem usa jaleco todos os dias.',
      'No laboratório, o jaleco é proteção e identidade ao mesmo tempo. Precisa ser resistente a reagentes e lavagens frequentes, fechar bem, ter mangas que não atrapalhem o trabalho. Mas também precisa ser confortável — porque a jornada dentro de um laboratório é longa e exige concentração.',
      'Os jalecos Jaleca têm tecido de alta qualidade que aguentam lavagens frequentes sem deformar ou desbotar. O corte oferece liberdade de movimentos — importante para quem trabalha com pipetas, microscópios e equipamentos que exigem precisão. Bolsos bem posicionados para quem precisa ter tudo à mão.',
      'Presente para mãe biomédica no Dia das Mães pode ser um jaleco manga longa fechado — o mais indicado para ambientes de laboratório — ou um modelo mais versátil para quem circula entre laboratório e atendimento ao paciente. O branco clássico é o padrão da área, mas modelos com detalhes também fazem sucesso.',
      'Ideias de presente para mãe que trabalha com ciência vão muito além do óbvio. Um jaleco Jaleca é um presente que ela vai receber com alegria e usar com orgulho — porque mostra que você entende e valoriza o trabalho dela.',
      'Tamanhos de PP ao G3. Troca grátis em 30 dias. Frete com rastreamento para todo o Brasil. Frete grátis para SP, RJ, MG e ES acima de R$499. Veja as opções logo abaixo.',
    ],
  },
  ti: {
    titulo: 'Presente de Dia das Mães para Profissional de TI',
    subtitulo: 'Para a mãe que trabalha com tecnologia — conforto e estilo do jeito dela',
    profissoes: 'técnicas de laboratório de TI, analistas de campo, pesquisadoras e profissionais de tecnologia',
    profissaoLabel: 'profissional de tecnologia',
    emoji: '💻',
    conteudoParagrafos: [
      'Sua mãe trabalha com tecnologia — e você quer dar um presente diferente e com significado neste Dia das Mães. Um jaleco pode ser exatamente o que ela precisa e não sabia que queria.',
      'Muitas profissionais de TI usam jaleco na rotina: técnicas que trabalham em laboratórios de hardware, analistas de campo que visitam datacenters, pesquisadoras em ambientes controlados, profissionais que atuam em salas limpas. Nesses ambientes, o jaleco é obrigatório — e um jaleco de qualidade faz toda a diferença.',
      'Os jalecos Jaleca têm tecido confortável e resistente, perfeito para jornadas longas em ambientes com ar-condicionado intenso. O corte é moderno, o acabamento é impecável e os bolsos são funcionais — importantes para quem precisa ter ferramentas, canetas e acessórios sempre à mão.',
      'Presente para mãe que trabalha com tecnologia no Dia das Mães é uma escolha diferenciada — que mostra que você prestou atenção no que ela faz e quer presentear com algo que tem uso real. Não é mais uma caneca ou um quadro: é um presente que ela vai usar no trabalho que ela ama.',
      'Se ela não usa jaleco no trabalho, um dólmã ou conjunto profissional Jaleca também é uma ótima ideia — confortável para trabalhar em home office, prático para dias de reunião presencial, com um visual cuidado e profissional.',
      'Tamanhos de PP ao G3. Troca grátis em 30 dias se não ficar perfeito. Entrega com rastreamento para todo o Brasil. Escolha o presente certo para ela logo abaixo.',
    ],
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
  const nicho = NICHOS[slug]
  if (!nicho) return { title: 'Página não encontrada' }

  const title = `${nicho.titulo} | Jaleca`
  const description = `Presenteie sua mãe ${nicho.profissaoLabel} com um jaleco Jaleca. Qualidade premium, tecido confortável, tamanhos PP ao G3. Entrega rápida, troca grátis em 30 dias. O presente ideal para o Dia das Mães.`

  return {
    title,
    description,
    keywords: `presente dia das mães ${nicho.profissaoLabel}, jaleco dia das mães, presente criativo dia das mães, jaleco para ${nicho.profissaoLabel}, ideias de presente dia das mães, jaleca dia das mães`,
    alternates: { canonical: `https://jaleca.com.br/dia-das-maes/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://jaleca.com.br/dia-das-maes/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: nicho.titulo }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(NICHOS).map(slug => ({ slug }))
}

export default async function DiasDasMaesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const nicho = NICHOS[slug]
  if (!nicho) notFound()

  const products = await getProducts()
  const faq = FAQ_TEMPLATE(nicho)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: nicho.titulo, item: `https://jaleca.com.br/dia-das-maes/${slug}` },
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

      {/* Banner Dia das Mães */}
      <div className="bg-rose-50 border-b border-rose-100 py-3 px-4 text-center">
        <p className="text-sm text-rose-700 font-medium flex items-center justify-center gap-2">
          <Heart size={14} className="fill-rose-400 text-rose-400" />
          Dia das Mães — Presente com significado, entrega rápida e troca grátis em 30 dias
          <Heart size={14} className="fill-rose-400 text-rose-400" />
        </p>
      </div>

      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-14 px-4">
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3">
            Dia das Mães {nicho.emoji}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            {nicho.titulo}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            {nicho.subtitulo}
          </p>
          <Link
            href="#produtos"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-all"
          >
            <Gift size={14} />
            Ver Presentes
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-secondary/30 py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-foreground" />
              <span>Entrega rápida para todo o Brasil</span>
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
              Escolha o Presente Perfeito
            </h2>
            <p className="text-muted-foreground">
              Jalecos, dólmãs e conjuntos para {nicho.profissoes}
            </p>
          </div>
          <ProductsClient products={products} initialCat="Todos" />
        </div>
      </section>

      {/* Conteúdo expandido */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container max-w-2xl">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {nicho.conteudoParagrafos.map((paragrafo, i) => (
              <p key={i}>{paragrafo}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 py-12 px-4">
        <div className="container max-w-2xl">
          <h2 className="font-display text-2xl font-semibold mb-8 text-center">
            Dúvidas sobre o presente
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

      {/* CTA final */}
      <section className="py-12 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Um presente que ela vai usar todo dia
          </h2>
          <p className="text-muted-foreground mb-6">
            Jalecos Jaleca são feitos para durar — tecido premium, corte elegante e acabamento que aguenta lavagem após lavagem.
            Se o tamanho não ficar perfeito, trocamos sem custo em até 30 dias.
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
