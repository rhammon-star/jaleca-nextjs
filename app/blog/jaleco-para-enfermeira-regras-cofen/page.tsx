import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Enfermeira: Regras, Modelos e o Que o COFEN Permite | Jaleca',
  description: 'O que a resolução COFEN 358/2009 diz sobre jaleco de enfermagem. Modelos para hospital, clínica e consultório.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-enfermeira-regras-cofen' },
  openGraph: {
    title: 'Jaleco para Enfermeira: Regras, Modelos e o Que o COFEN Permite',
    description: 'O que a resolução COFEN 358/2009 diz sobre jaleco de enfermagem. Modelos para hospital, clínica e consultório.',
    url: 'https://jaleca.com.br/blog/jaleco-para-enfermeira-regras-cofen',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Enfermeira: Regras, Modelos e o Que o COFEN Permite',
  description: 'O que a resolução COFEN 358/2009 diz sobre jaleco de enfermagem. Modelos para hospital, clínica e consultório.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-enfermeira-regras-cofen',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "O COFEN obriga o uso de jaleco branco?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "A resolução COFEN 358/2009 não impõe cor específica. Cada COREN estadual pode ter complementações. Na prática, hospitais definem a cor por política interna — geralmente branco ou azul em ambientes hospitalares formais."
    }
  },
  {
    "@type": "Question",
    "name": "Enfermeira pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Depende do ambiente. O COFEN não proíbe, mas hospitais podem exigir cores específicas por política interna. Em clínicas e consultórios particulares, o colorido é aceito."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco para enfermeira de UTI?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Em UTI, geralmente é exigido jaleco branco com manga longa por protocolo de biossegurança. O Slim Tradicional em branco é a escolha mais segura — resistente a lavagens industriais e aceito em qualquer contexto hospitalar."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Enfermeira', item: 'https://jaleca.com.br/blog/jaleco-para-enfermeira-regras-cofen' },
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
          <span className="text-foreground">Jaleco Enfermeira</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Enfermeira: Regras, Modelos e o Que o COFEN Permite
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Enfermeiras trabalham em um dos ambientes mais exigentes da saúde — e o jaleco precisa estar à altura: resistente, funcional e dentro das normas do COFEN.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>O COFEN obriga o uso de jaleco branco?</h2>
          <p>A resolução COFEN 358/2009 não impõe cor específica. Cada COREN estadual pode ter complementações. Na prática, hospitais definem a cor por política interna — geralmente branco ou azul em ambientes hospitalares formais.</p>

          <h2>Enfermeira pode usar jaleco colorido?</h2>
          <p>Depende do ambiente. O COFEN não proíbe, mas hospitais podem exigir cores específicas por política interna. Em clínicas e consultórios particulares, o colorido é aceito.</p>

          <h2>Qual jaleco para enfermeira de UTI?</h2>
          <p>Em UTI, geralmente é exigido jaleco branco com manga longa por protocolo de biossegurança. O Slim Tradicional em branco é a escolha mais segura — resistente a lavagens industriais e aceito em qualquer contexto hospitalar.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-enfermeira" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para enfermeira</Link>
            <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ O que cada conselho de saúde permite</Link>
            <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido no trabalho</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para enfermeira</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional para hospital, Elastex para procedimentos — lavagem industrial, do PP ao G3.</p>
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
