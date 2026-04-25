import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Clock, User, Calendar } from 'lucide-react'
import { getPosts } from '@/lib/wordpress'
import type { WPPost } from '@/lib/wordpress'

export const metadata: Metadata = {
  title: 'Como Escolher o Jaleco Feminino Ideal para Sua Profissão',
  description: 'Guia completo para escolher o jaleco feminino perfeito: modelos Slim, Princesa, Duquesa e Elastex. Descubra qual tecido, tamanho e caimento mais adequado para médicas, dentistas e enfermeiras.',
  keywords: 'como escolher jaleco femenino, jaleco femenino ideal, jaleco para médica, jaleco para dentista, jaleco para enfermeira, jaleco slim femenino, jaleco princess, escolher tamanho jaleco',
  alternates: { canonical: 'https://jaleca.com.br/blog/como-escolher-jaleco-feminino-guia-completo' },
  openGraph: {
    title: 'Como Escolher o Jaleco Feminino Ideal para Sua Profissão',
    description: 'Guia completo para escolher o jaleco femenino perfeito. Modelos, tecidos e tamanhos para profissionais da saúde.',
    url: 'https://jaleca.com.br/blog/como-escolher-jaleco-feminino-guia-completo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const blogPostSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Como Escolher o Jaleco Feminino Ideal para Sua Profissão',
  description: 'Guia completo para escolher o jaleco femenino perfeito: modelos, tecidos e tamanhos.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-23',
  dateModified: '2026-04-23',
  image: 'https://jaleca.com.br/og-home.jpg',
  url: 'https://jaleca.com.br/blog/como-escolher-jaleco-feminino-guia-completo',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual o melhor jaleco femenino para médica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para médicas, o Jaleco Slim é o mais indicado: corte acinturado que valoriza o corpo, tecido premium com elasticity para conforto em longas jornadas e visual elegante que transmite autoridade no consultório.'
      }
    },
    {
      '@type': 'Question',
      name: 'Jaleco Slim ou clássico: qual é melhor para enfermeira?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para enfermeiras que fazem plantões de 12 horas, o Jaleco Elastex é a melhor escolha: tecido com elastano que permite movimento livre, não amassa e seca rápido. O modelo Slim também funciona bem para日常工作.'
      }
    },
    {
      '@type': 'Question',
      name: 'Como saber o tamanho certo do jaleco femenino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Meça busto e cintura com uma fita métrica. Na dúvida entre dois tamanhos, opte pelo maior — jalecos largos são mais fáceis de ajustar do que jalecos apertados. A Jaleca oferece tabela de medidas detalhada e tamanhos de PP ao G3.'
      }
    },
    {
      '@type': 'Question',
      name: 'Jaleco branco ou colorido: qual é mais profissional?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Em hospitais e centros cirúrgicos, o jaleco branco é obrigatório por questões de higiene. Em clínicas e consultórios, jalecos coloridos são cada vez mais aceitos e podem transmitir personalidade e acolhimento ao paciente.'
      }
    }
  ]
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Como Escolher o Jaleco Feminino', item: 'https://jaleca.com.br/blog/como-escolher-jaleco-feminino-guia-completo' },
  ],
}

export default async function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />

      <article className="container py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Como Escolher o Jaleco Feminino</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              23 de Abril de 2026
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              Jaleca
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              8 min de leitura
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Como Escolher o Jaleco Feminino Ideal para Sua Profissão
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Guia completo para médicas, dentistas e enfermeiras encontrarem o modelo perfeito — Slim, Princesa, Duquesa ou Elastex.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>Por que o jaleco certo importa</h2>
          <p>
            Seu jaleco é a primeira coisa que um paciente vê. Antes mesmo de você falar, ele já formou uma opinião sobre sua competência e profissionalismo. Um jaleco bem escolhido transmite confiança, conforto para você durante todo o plantão e credibilidade junto aos pacientes.
          </p>
          <p>
            Na Jaleca, já vendemos mais de 200 mil peças e sabemos exatamente o que profissionais da saúde buscam: <strong>corte que valoriza</strong>, <strong>tecido que não amassa</strong> e <strong>durabilidade que justifica o investimento</strong>.
          </p>

          <h2>Modelos de jaleco femenino: qual é o seu?</h2>

          <h3>Jaleco Slim — O mais vendido</h3>
          <p>
            O Jaleco Slim é o favorito das médicas e dentistas que trabalham em consultório. Com corte acinturado que define a silhueta sem apertar, é elegante o suficiente para reuniões e confortável o bastante para procedimentos longos.
          </p>
          <p><strong>Indicado para:</strong> médicas, dentistas, nutricionistas, fisioterapeutas</p>

          <h3>Jaleco Princesa — Personalidade no consultório</h3>
          <p>
            O Jaleco Princesa tem bordado delicado no bolso e caimento mais soltinho. É perfeito para profissionais que querem transmitir acolhimento e humanização no atendimento.
          </p>
          <p><strong>Indicado para:</strong> psicólogas, nutricionistas, esteticistas</p>

          <h3>Jaleco Duquesa — Clássico e versátil</h3>
          <p>
            O Jaleco Duquesa tem manga longa com punho, abertura frontal com botões e corte levemente estruturado. Funciona tanto em consultório quanto em ambiente hospitalar.
          </p>
          <p><strong>Indicado para:</strong> médicas, enfermeiras, biomédicas</p>

          <h3>Jaleco Elastex — Conforto máximo</h3>
          <p>
            O Jaleco Elastex é produzido com tecido que contém elastano, permitindo stretch em todas as direções. Ideal para profissionais que ficam de pé o dia inteiro ou fazem movimentos repetitivos.
          </p>
          <p><strong>Indicado para:</strong> enfermeiras, técnicas de enfermagem, médicas de plantão</p>

          <h2>Como escolher o tamanho certo</h2>
          <p>
            Ter o tamanho correto faz toda a diferença entre um jaleco profissional e um jaleco amador. Siga estes passos:
          </p>
          <ol>
            <li><strong>Meça o busto</strong> com a fita métrica na altura dos mamilos</li>
            <li><strong>Meça a cintura</strong> na parte mais estreita do tronco</li>
            <li><strong>Compare com nossa tabela</strong> de medidas (PP ao G3)</li>
            <li><strong>Na dúvida, escolha maior</strong> — jaleco largo é melhor que apertado</li>
          </ol>
          <p>
            A Jaleca oferece todos os tamanhos de PP ao G3 — únicos no mercado brasileiro para diferentes biótipos.
          </p>

          <h2>Cor do jaleco: branca ou colorida?</h2>
          <p>
            A resposta depende do seu ambiente de trabalho:
          </p>
          <ul>
            <li><strong>Hospital/centro cirúrgico:</strong> jaleco branco é obrigatório (normas de biossegurança)</li>
            <li><strong>Consultório/clínica:</strong> jalecos coloridos são cada vez mais aceitos e transmitem personalidade</li>
            <li><strong>Área de estética:</strong> preto, marsala e verde escuro são opções elegantes</li>
          </ul>

          <h2>Perguntas frequentes</h2>

          <h3>Qual o melhor jaleco para médica que faz plantão?</h3>
          <p>
            O Jaleco Elastex é a melhor escolha para médicas de plantão: o elastano permite conforto em longas jornadas, seca rápido e não amassa. O modelo Slim também é excelente se você prefere um visual mais estruturado.
          </p>

          <h3>Jaleco slim ou clássico para dentista?</h3>
          <p>
            Para dentistas que trabalham em consultório, o Jaleco Slim é o mais indicado: elegante sem ser exagerado, permite movimentação durante procedimentos e transmite profissionalismo.
          </p>

          <h3>Como lavar jaleco para manter a durabilidade?</h3>
          <p>
            Lave em água fria ou morna (máximo 40°C), use sabão neutro e evite alvejante. Seque à sombra — sol direto danifica as fibras. Jalecos com elastano devem ser secado em superfície plana para manter o caimento.
          </p>

          <h2>Onde comprar jaleco femenino de qualidade</h2>
          <p>
            A Jaleca é especialista em jalecos profissionais para mulheres há mais de uma década. Oferecemos:
          </p>
          <ul>
            <li>Mais de 200 mil peças vendidas</li>
            <li>Nota 4.9/5 no Google com mais de 50 avaliações</li>
            <li>Tamanhos de PP ao G3 — únicos no mercado</li>
            <li>Frete grátis no Sudeste acima de R$499</li>
            <li>Troca em até 30 dias após recebimento</li>
          </ul>
          <p>
            <Link href="/produtos" className="text-[#c4a97d] font-semibold hover:underline">
              Ver todos os jalecos feminino →
            </Link>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Pronto para escolher seu jaleco?</h3>
          <p className="text-muted-foreground mb-4">
            Conheça a coleção completa de jalecos femenino — do Slim ao Elastex, em várias cores e tamanhos.
          </p>
          <Link
            href="/categoria/jalecos-femininos"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]"
          >
            Ver Jalecos Femininos
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-8 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft size={16} />
            Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: 'como-escolher-jaleco-feminino-guia-completo' }]
}