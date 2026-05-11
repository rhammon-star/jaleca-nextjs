import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Nutricionista: Qual Modelo e Cor Usar no Consultório',
  description: 'Guia de jaleco para nutricionista: modelos, cores e o que o CFN permite. Slim Tradicional, Princesa Laise e opções para consultório.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-nutricionista-consultorio' },
  openGraph: {
    title: 'Jaleco para Nutricionista: Qual Modelo e Cor Usar no Consultório',
    description: 'Guia de jaleco para nutricionista: modelos, cores e o que o CFN permite. Slim Tradicional, Princesa Laise e opções para consultório.',
    url: 'https://jaleca.com.br/blog/jaleco-para-nutricionista-consultorio',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Nutricionista: Qual Modelo e Cor Usar no Consultório',
  description: 'Guia de jaleco para nutricionista: modelos, cores e o que o CFN permite. Slim Tradicional, Princesa Laise e opções para consultório.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-nutricionista-consultorio',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Nutricionista é obrigada a usar jaleco?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O CFN não torna o jaleco obrigatório. Em consultórios particulares, a decisão é do profissional. Em hospitais, clínicas e UBSs, o jaleco geralmente é exigido por política interna."
    }
  },
  {
    "@type": "Question",
    "name": "Qual cor de jaleco para nutricionista?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O CFN não determina cor obrigatória. As mais usadas são verde (associação com saúde), azul claro (transmite calma), branco (neutro) e tons pastéis. O importante é que o jaleco esteja limpo, bem conservado e com o CRN visível."
    }
  },
  {
    "@type": "Question",
    "name": "Nutricionista pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim. O CFN não proíbe o uso de jaleco colorido. A cor é escolha do profissional ou da clínica."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Nutricionista', item: 'https://jaleca.com.br/blog/jaleco-para-nutricionista-consultorio' },
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
          <span className="text-foreground">Jaleco Nutricionista</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Nutricionista: Qual Modelo e Cor Usar no Consultório
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            O jaleco da nutricionista comunica saúde e profissionalismo antes de qualquer palavra. Em uma especialidade onde a imagem influencia a percepção do paciente, a escolha do jaleco importa.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Nutricionista é obrigada a usar jaleco?</h2>
          <p>O CFN não torna o jaleco obrigatório. Em consultórios particulares, a decisão é do profissional. Em hospitais, clínicas e UBSs, o jaleco geralmente é exigido por política interna.</p>

          <h2>Qual cor de jaleco para nutricionista?</h2>
          <p>O CFN não determina cor obrigatória. As mais usadas são verde (associação com saúde), azul claro (transmite calma), branco (neutro) e tons pastéis. O importante é que o jaleco esteja limpo, bem conservado e com o CRN visível.</p>

          <h2>Nutricionista pode usar jaleco colorido?</h2>
          <p>Sim. O CFN não proíbe o uso de jaleco colorido. A cor é escolha do profissional ou da clínica.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-nutricionista" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para nutricionista</Link>
            <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido: qual usar</Link>
            <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ O que cada conselho de saúde permite</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para nutricionista</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional e Slim Princesa Laise — caimento impecável para consultório. Do PP ao G3, em várias cores.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      
          <div className="mt-6 pt-6 border-t border-border">
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm block">→ Coleção completa de jaleco feminino</Link>
          </div>
        </article>
    </>
  )
}
