import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino: Como Escolher o Modelo Certo para Cada Especialidade',
  description: 'Médica, fisioterapeuta, nutricionista ou dentista? Cada especialidade pede um jaleco diferente. Guia prático para escolher o modelo certo sem errar.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-como-escolher-modelo-certo-especialidade' },
  openGraph: {
    title: 'Jaleco Feminino: Como Escolher o Modelo Certo para Cada Especialidade',
    description: 'Guia prático: qual jaleco feminino usar em consultório, plantão, fisioterapia, nutrição e estética.',
    url: 'https://jaleca.com.br/jaleco-feminino-como-escolher-modelo-certo-especialidade',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino: Como Escolher o Modelo Certo para Cada Especialidade',
  description: 'Guia prático para escolher jaleco feminino por especialidade: consultório, plantão, fisioterapia, nutrição e estética.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/jaleco-feminino-como-escolher-modelo-certo-especialidade',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual jaleco feminino é melhor para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para plantões longos, o Slim Elastex é o mais indicado. O tecido com elastano bidirecional cede em todos os sentidos, suporta 12 horas de movimentação intensa e mantém o caimento mesmo após várias lavagens. Para plantões mais tranquilos em consultório particular, o Slim Tradicional também atende bem.' },
    },
    {
      '@type': 'Question',
      name: 'Nutricionista pode usar jaleco colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O CFN (Conselho Federal de Nutricionistas) não proíbe o uso de jaleco colorido. A cor é uma escolha pessoal e da clínica. Nutricionistas costumam optar por verde, azul ou tons pastel como parte da identidade visual do consultório. O importante é que o jaleco esteja limpo, bem conservado e com o CRN visível.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado é adequado para fisioterapeuta?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, desde que o tecido tenha elastano. O Slim Elastex foi desenvolvido exatamente para profissionais que precisam de liberdade de movimento sem abrir mão do caimento. Fisioterapeutas que trabalham com RPG, pilates clínico ou procedimentos manuais intensos devem priorizar o Elastex em vez de modelos com gabardine rígido.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino por Especialidade', item: 'https://jaleca.com.br/jaleco-feminino-como-escolher-modelo-certo-especialidade' },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Jaleco Feminino por Especialidade</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino: Como Escolher o Modelo Certo para Cada Especialidade
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A escolha do jaleco certo vai além da preferência visual — cada especialidade da saúde tem uma demanda diferente de tecido, corte e acabamento.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            A escolha do jaleco feminino vai além da preferência visual. Cada especialidade da saúde tem rotinas, movimentos e contextos de uso diferentes — e o modelo errado custa caro: em conforto, em imagem e em durabilidade.
          </p>

          <h2>Médica e dentista: jaleco estruturado para consultório</h2>
          <p>
            Para consultas em consultório médico ou odontológico, o jaleco precisa ter boa estabilidade de tecido, caimento limpo e resistência a várias lavagens semanais. O <strong>Slim Tradicional</strong> em gabardine é o modelo mais pedido: estrutura firme, sem perder o corte acinturado que valoriza a silhueta feminina.
          </p>

          <h2>Fisioterapeuta e educadora física: prioridade é o movimento</h2>
          <p>
            Profissionais que se movimentam junto com o paciente precisam de um jaleco que ceda. O <strong>Slim Elastex</strong> tem elastano bidirecional — cede em todas as direções sem perder o caimento. Indicado para plantões com procedimentos físicos intensos, RPG, pilates clínico e atendimentos que exigem agachar, levantar os braços e se movimentar constantemente.
          </p>

          <h2>Nutricionista e esteticista: o visual conta mais</h2>
          <p>
            Consultas de nutrição e estética têm foco na imagem profissional. O <strong>Slim Princesa Laise</strong> tem evasê na parte inferior, o que dá um visual mais leve sem abrir mão do corte acinturado. O acabamento diferenciado passa exatamente o que esses atendimentos precisam transmitir. Para quem quer um toque premium, o <strong>Slim Gold</strong> é a escolha mais frequente.
          </p>

          <h2>Plantão em hospital ou UPA</h2>
          <p>
            Em ambientes de alta demanda, o jaleco precisa sobreviver a turnos de 12 horas, lavagens frequentes e esforço físico constante. O <strong>Elastex</strong> é a escolha mais segura: tecido durável, corte que permite movimento e lavagem industrial sem deformar. Para ambientes com risco biológico intenso, verifique se o protocolo da instituição exige tecido específico.
          </p>

          <h2>Como decidir na prática</h2>
          <p>
            Três perguntas ajudam a filtrar rápido: Você se movimenta muito durante o trabalho? Se sim, Elastex. Seu ambiente é consultório com recepção de pacientes? Slim Tradicional ou Gold. Você precisa de um jaleco para compromissos e eventos? Slim Duquesa ou Dama, com acabamentos mais refinados.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino branco ou colorido: qual usar no trabalho</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
              <Link href="/jaleco-feminino-acinturado" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino acinturado — o que é e por que faz diferença</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver todos os modelos femininos</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional, Elastex, Princesa, Gold, Duquesa e Dama — do PP ao G3, em branco, preto e 10 cores.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}
