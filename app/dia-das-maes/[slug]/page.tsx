import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { Truck, RotateCcw, ShieldCheck, Star, Gift } from 'lucide-react'

type NichoInfo = {
  titulo: string
  subtitulo: string
  profissoes: string
  profissaoLabel: string
  conteudo: string
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
    conteudo: 'Sua mãe dedica a vida a cuidar das pessoas — agora é a sua vez de cuidar dela. Um jaleco Jaleca é um presente que une carinho e praticidade: tecido premium que não amassa, corte que valoriza, e durabilidade para a rotina intensa de médicas, enfermeiras, dentistas e fisioterapeutas. Mais do que um uniforme, é um símbolo de reconhecimento pelo trabalho que ela faz todos os dias.',
  },
  estetica: {
    titulo: 'Presente de Dia das Mães para Esteticista',
    subtitulo: 'Ela cuida da beleza das outras — presenteie com elegância e conforto',
    profissoes: 'esteticistas, cosmetólogas, micropigmentadoras e profissionais de beleza',
    profissaoLabel: 'esteticista ou profissional de beleza',
    emoji: '💆',
    conteudo: 'Para a mãe que faz as outras se sentirem lindas, um jaleco Jaleca é o presente ideal. Com tecido macio, corte moderno e acabamento impecável, os jalecos Jaleca são perfeitos para o ambiente do salão, da clínica de estética ou do espaço de micropigmentação. Um presente que ela vai usar com orgulho todos os dias — e que reflete todo o cuidado que você tem por ela.',
  },
  veterinaria: {
    titulo: 'Presente de Dia das Mães para Veterinária',
    subtitulo: 'Para a mãe que ama todos os bichos — um jaleco à altura da paixão dela',
    profissoes: 'veterinárias, zootecnistas e profissionais de medicina veterinária',
    profissaoLabel: 'veterinária',
    emoji: '🐾',
    conteudo: 'Sua mãe escolheu uma profissão movida pelo amor aos animais. Presenteie ela com um jaleco Jaleca: resistente, confortável e com design que mantém a elegância mesmo na rotina agitada das clínicas veterinárias. Tecido de qualidade que facilita a limpeza e o cuidado, corte que garante liberdade de movimento. Um presente que combina funcionalidade e afeto.',
  },
  nutricao: {
    titulo: 'Presente de Dia das Mães para Nutricionista',
    subtitulo: 'Ela cuida da alimentação e da saúde — presenteie com qualidade',
    profissoes: 'nutricionistas, dietistas e profissionais de nutrição',
    profissaoLabel: 'nutricionista',
    emoji: '🥗',
    conteudo: 'Para a mãe que orienta pessoas a terem uma vida mais saudável, um jaleco Jaleca é um presente com significado. Elegante para atendimentos em consultório, confortável para longas jornadas, com tecido premium que mantém a aparência profissional o dia todo. Mostre que você reconhece e admira o trabalho dela com um presente que ela vai usar com prazer.',
  },
  farmacia: {
    titulo: 'Presente de Dia das Mães para Farmacêutica',
    subtitulo: 'Para a mãe que trabalha com saúde e responsabilidade — um jaleco à altura',
    profissoes: 'farmacêuticas, bioquímicas e profissionais de farmácia',
    profissaoLabel: 'farmacêutica ou bioquímica',
    emoji: '💊',
    conteudo: 'Farmacêuticas passam horas de jaleco, atendendo, analisando e orientando. Um jaleco Jaleca transforma esse uniforme diário em algo que ela vai querer vestir — tecido confortável para longas jornadas, corte moderno e acabamento que dura lavagem após lavagem. Um presente prático e cheio de carinho para a mãe que cuida da saúde de todos.',
  },
  laboratorio: {
    titulo: 'Presente de Dia das Mães para Laboratorista',
    subtitulo: 'Para a mãe cientista — precisão, conforto e estilo no laboratório',
    profissoes: 'laboratoristas, biomédicas, bioquímicas e profissionais de laboratório',
    profissaoLabel: 'laboratorista ou biomédica',
    emoji: '🔬',
    conteudo: 'No laboratório, o jaleco não é opcional — é essencial. Para a mãe que trabalha com análises clínicas, bioquímica ou pesquisa, um jaleco Jaleca é o presente certo: tecido resistente que protege, corte que facilita os movimentos e design que traz elegância mesmo no ambiente técnico. Um presente que une cuidado e admiração pela profissão dela.',
  },
  ti: {
    titulo: 'Presente de Dia das Mães para Profissional de TI',
    subtitulo: 'Para a mãe que trabalha com tecnologia — conforto e estilo do jeito dela',
    profissoes: 'analistas, desenvolvedoras, técnicas de laboratório de TI e profissionais de tecnologia',
    profissaoLabel: 'profissional de tecnologia',
    emoji: '💻',
    conteudo: 'Muitas profissionais de tecnologia — técnicas em lab de hardware, pesquisadoras, analistas de campo — usam jaleco na rotina. Para a mãe que alia precisão e inteligência no trabalho, um jaleco Jaleca é um presente diferenciado: confortável para longas jornadas, moderno e com tecido de qualidade. Um presente que mostra que você prestou atenção no que ela faz e no que ela merece.',
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
  const description = `Presenteie sua mãe ${nicho.profissaoLabel} com um jaleco Jaleca. Qualidade premium, tecido confortável, tamanhos PP ao G3. Entrega rápida, troca grátis. O presente ideal para o Dia das Mães.`

  return {
    title,
    description,
    keywords: `presente dia das mães ${nicho.profissaoLabel}, jaleco dia das mães, jaleco presente mãe, jaleco para ${nicho.profissaoLabel}, jaleca dia das mães`,
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

      {/* Conteúdo do nicho */}
      <section className="py-10 px-4">
        <div className="container max-w-2xl text-center">
          <p className="text-muted-foreground leading-relaxed">{nicho.conteudo}</p>
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
