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
    subtitulo: 'Um presente que ela vai usar todo dia. De verdade.',
    profissoes: 'médicas, enfermeiras, dentistas, fisioterapeutas e profissionais de saúde',
    profissaoLabel: 'profissional de saúde',
    emoji: '🩺',
    conteudoParagrafos: [
      'Sua mãe é médica, enfermeira, dentista ou fisioterapeuta — e você quer dar um presente que diga mais do que "obrigado". Um jaleco bom faz isso.',
      'Ela usa jaleco todo dia. Às vezes por 8, 10, 12 horas seguidas. Sabe a diferença entre um tecido que abafa e um que deixa trabalhar à vontade. Sabe quando o corte valoriza ou quando só atrapalha. É esse tipo de detalhe que a Jaleca acerta há mais de 8 anos.',
      'Presente criativo pra mãe médica no Dia das Mães não precisa ser complicado. Um jaleco novo, bonito, que caiba direito — já é o suficiente pra fazer o dia dela melhor. Pra mãe enfermeira, um modelo de manga curta ou longa dependendo de onde ela trabalha. Pra mãe dentista, algo mais ajustado que fique bem mesmo com máscara e luvas.',
      'Mais de 500 avaliações. Nota 4.9. Não porque a gente fala que é bom — porque quem usou voltou pra contar.',
      'Frete grátis pra SP, RJ, MG e ES acima de R$499. Troca grátis em 30 dias se o tamanho não ficar perfeito. Compra 100% segura.',
      'O presente ideal pra mãe profissional de saúde tá logo abaixo.',
    ],
  },
  estetica: {
    titulo: 'Presente de Dia das Mães para Esteticista',
    subtitulo: 'Ela cuida de todo mundo. Quem cuida dela?',
    profissoes: 'esteticistas, cosmetólogas, micropigmentadoras e profissionais de beleza',
    profissaoLabel: 'esteticista ou profissional de beleza',
    emoji: '💆',
    conteudoParagrafos: [
      'Sua mãe passa o dia cuidando das outras — arruma, trata, embeleza. Quando é a vez dela, ela quase sempre fica pra depois. Esse Dia das Mães, muda isso.',
      'Esteticista usa jaleco em todo atendimento. Horas em pé, movimentos constantes, ambiente que exige aparência cuidada. Um jaleco que amassa, abafa ou puxa deixa o trabalho mais pesado do que precisa ser.',
      'Os jalecos da Jaleca são leves, não amarrotam e ficam bonitos mesmo depois de horas de uso. Ideal pra quem trabalha em clínica de estética, salão, espaço de micropigmentação ou atendimento domiciliar. Nas fotos do antes e depois, o jaleco dela vai aparecer — melhor aparecer bem.',
      'Presente criativo pra mãe esteticista no Dia das Mães: jaleco branco clássico pra quem é mais tradicional, ou modelo colorido pra quem gosta de personalidade. Tem opção pra todo estilo, do PP ao G3.',
      'Troca grátis em 30 dias. Entrega rastreada pra todo o Brasil.',
    ],
  },
  veterinaria: {
    titulo: 'Presente de Dia das Mães para Veterinária',
    subtitulo: 'Ela cuida de todo bicho que aparece. Merece um presente à altura.',
    profissoes: 'veterinárias, zootecnistas e profissionais de medicina veterinária',
    profissaoLabel: 'veterinária',
    emoji: '🐾',
    conteudoParagrafos: [
      'Veterinária é uma profissão que exige tudo. Sua mãe sabe disso melhor que ninguém. E o jaleco dela precisa acompanhar — lavar fácil, aguentar o tranco, não perder a forma depois de mil lavagens.',
      'Na clínica, no campo, na cirurgia ou no atendimento de emergência: o jaleco tá sempre lá. Quando é bom, ela nem pensa nele — simplesmente funciona. Quando é ruim, incomoda a jornada inteira.',
      'Os jalecos Jaleca têm costura reforçada, tecido que resiste ao uso intenso e bolsos que cabem o que precisa caber. Sem encolher, sem desbotar. Presente pra mãe veterinária no Dia das Mães que ela vai usar de verdade — não guardar na gaveta.',
      'Modelo branco clássico pra quem trabalha em clínica, ou dólmã pra quem prefere praticidade. Tamanhos de PP ao G3.',
      'Troca grátis em 30 dias. Entrega rastreada pra todo o Brasil.',
    ],
  },
  nutricao: {
    titulo: 'Presente de Dia das Mães para Nutricionista',
    subtitulo: 'Um jaleco que some no corpo. Do jeito que tem que ser.',
    profissoes: 'nutricionistas, dietistas e profissionais de nutrição',
    profissaoLabel: 'nutricionista',
    emoji: '🥗',
    conteudoParagrafos: [
      'Nutricionista chega no consultório, bota o jaleco e começa o dia. A partir daí, é paciente atrás de paciente — consultório, hospital, empresa, onde for. O jaleco fica ligado ao corpo dela por horas.',
      'Quando o jaleco é ruim, ela sente. Abafa, amassa, não cai bem. Quando é bom, some — ela nem lembra que tá usando. Esse segundo tipo é o que a Jaleca faz.',
      'Presente criativo pra mãe nutricionista no Dia das Mães: jaleco branco pra quem é mais clássica, com detalhes coloridos pra quem gosta de um toque diferente, ou dólmã pra quem prefere praticidade no dia a dia. Mais de 8 anos vestindo profissionais de saúde no Brasil — mais de 500 avaliações com nota 4.9.',
      'Não sabe o tamanho dela? Troca grátis em até 30 dias, sem precisar explicar nada. Tamanhos de PP ao G3.',
      'Frete grátis pra SP, RJ, MG e ES acima de R$499. Entrega rastreada pra todo o Brasil.',
    ],
  },
  farmacia: {
    titulo: 'Presente de Dia das Mães para Farmacêutica',
    subtitulo: 'Ela usa jaleco todo dia. Que seja um bom.',
    profissoes: 'farmacêuticas, bioquímicas e profissionais de farmácia',
    profissaoLabel: 'farmacêutica ou bioquímica',
    emoji: '💊',
    conteudoParagrafos: [
      'Farmacêutica usa jaleco no balcão, no lab de manipulação, no hospital — onde quer que ela trabalhe. É uma das poucas peças de roupa que ela coloca todo dia sem pensar duas vezes.',
      'Exatamente por isso, um jaleco bom de presente faz sentido. Ela não costuma comprar pra si mesma — gasta com o trabalho, com a família, com mil outras coisas. Quando recebe um de qualidade, percebe a diferença na hora.',
      'Tecido que não abafa, costura que não arrebenta no braço depois de um mês, bolsos que cabem caneta e bloco sem esticar. Presente pra mãe farmacêutica no Dia das Mães que vai durar — não só até o fim do mês.',
      'Manga longa pra quem trabalha em ambiente frio, manga curta pra quem prefere liberdade. Branco clássico ou modelos com detalhe. Tamanhos de PP ao G3.',
      'Troca grátis em 30 dias. Entrega rastreada pra todo o Brasil.',
    ],
  },
  laboratorio: {
    titulo: 'Presente de Dia das Mães para Laboratorista',
    subtitulo: 'Ela trabalha com precisão. O jaleco dela também tem que ser.',
    profissoes: 'laboratoristas, biomédicas, bioquímicas e profissionais de laboratório',
    profissaoLabel: 'laboratorista ou biomédica',
    emoji: '🔬',
    conteudoParagrafos: [
      'No laboratório, o jaleco não é opcional — faz parte da rotina, do protocolo, da identidade profissional. Sua mãe biomédica, laboratorista ou analista clínica sabe exatamente o que é usar um jaleco ruim por horas a fio.',
      'Lavagem frequente, contato com reagentes, jornadas longas: o jaleco precisa aguentar tudo isso sem perder a forma. E ainda ficar bem. A Jaleca resolve os dois lados — resistência do tecido e corte que valoriza.',
      'Presente criativo pra mãe biomédica no Dia das Mães: jaleco manga longa fechado pra quem trabalha em ambiente controlado, ou modelo versátil pra quem circula entre lab e atendimento. Branco clássico ou com detalhes. Do PP ao G3.',
      'Mais de 500 avaliações. Nota 4.9. Troca grátis em 30 dias se o tamanho não ficar certo.',
      'Frete grátis pra SP, RJ, MG e ES acima de R$499. Entrega rastreada pra todo o Brasil.',
    ],
  },
  ti: {
    titulo: 'Presente de Dia das Mães para Profissional de TI',
    subtitulo: 'Sai da caneca. Dá algo que ela vai usar de verdade.',
    profissoes: 'técnicas de laboratório de TI, analistas de campo, pesquisadoras e profissionais de tecnologia',
    profissaoLabel: 'profissional de tecnologia',
    emoji: '💻',
    conteudoParagrafos: [
      'Nem toda profissional de TI usa jaleco — mas muitas usam. Técnica de lab de hardware, analista de campo, pesquisadora em ambiente controlado, profissional de sala limpa. Se sua mãe é uma delas, sabe o valor de um jaleco bom.',
      'Confortável em ambiente de ar-condicionado intenso, com bolsos funcionais pra guardar o que precisa, tecido que não amassa depois de horas sentada ou em pé. Esses detalhes fazem diferença quando você usa todos os dias.',
      'Presente pra mãe profissional de TI no Dia das Mães que sai do óbvio. Não é caneca, não é quadro motivacional. É algo que ela vai usar no trabalho que ela escolheu — e vai lembrar de você toda vez que colocar.',
      'Se ela não usa jaleco no trabalho, um dólmã ou conjunto Jaleca também funciona — confortável pra home office, apresentável pra reunião presencial.',
      'Tamanhos de PP ao G3. Troca grátis em 30 dias. Entrega rastreada pra todo o Brasil.',
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
