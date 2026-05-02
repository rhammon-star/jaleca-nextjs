import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Médica: Como Escolher o Modelo Certo para Cada Contexto | Jaleca',
  description: 'Consultório, plantão ou residência médica — cada contexto pede um jaleco diferente. Guia completo para médicas escolherem o modelo certo.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-medica-guia-completo' },
  openGraph: {
    title: 'Jaleco para Médica: Como Escolher o Modelo Certo para Cada Contexto',
    description: 'Consultório, plantão ou residência médica — cada contexto pede um jaleco diferente. Guia completo para médicas escolherem o modelo certo.',
    url: 'https://jaleca.com.br/blog/jaleco-para-medica-guia-completo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Médica: Como Escolher o Modelo Certo para Cada Contexto',
  description: 'Consultório, plantão ou residência médica — cada contexto pede um jaleco diferente. Guia completo para médicas escolherem o modelo certo.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-medica-guia-completo',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Médica pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O CFM não impõe cor obrigatória. Em hospitais públicos e UPAs, o branco geralmente é exigido por política interna. Em consultórios particulares, qualquer cor é aceita."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco usar no plantão?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Para plantões de 12 horas, o Slim Elastex é o mais indicado: tecido com elastano para movimentação intensa, resistência a lavagens industriais e conforto em turnos longos."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco usar no consultório médico?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O Slim Tradicional branco é o padrão de consultório: estruturado, formal e com caimento que valoriza a silhueta feminina. Para especialidades com apelo estético, o Slim Gold com acabamentos diferenciados agrega percepção de valor."
    }
  }
],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Médica', item: 'https://jaleca.com.br/blog/jaleco-para-medica-guia-completo' },
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
          <span className="text-foreground">Jaleco para Médica</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Médica: Como Escolher o Modelo Certo para Cada Contexto
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Médicas usam jaleco em contextos muito diferentes — consultório privado, plantão hospitalar, ambulatório público. Cada contexto pede um modelo diferente.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Médica pode usar jaleco colorido?</h2>
          <p>O CFM não impõe cor obrigatória. Em hospitais públicos e UPAs, o branco geralmente é exigido por política interna. Em consultórios particulares, qualquer cor é aceita.</p>

          <h2>Qual jaleco usar no plantão?</h2>
          <p>Para plantões de 12 horas, o Slim Elastex é o mais indicado: tecido com elastano para movimentação intensa, resistência a lavagens industriais e conforto em turnos longos.</p>

          <h2>Qual jaleco usar no consultório médico?</h2>
          <p>O Slim Tradicional branco é o padrão de consultório: estruturado, formal e com caimento que valoriza a silhueta feminina. Para especialidades com apelo estético, o Slim Gold com acabamentos diferenciados agrega percepção de valor.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-medica" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para médica</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o jaleco certo por especialidade</Link>
            <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido é permitido no hospital?</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para médica</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional para consultório, Elastex para plantão — do PP ao G3 em branco e colorido.</p>
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
