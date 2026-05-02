import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Psicóloga: Discreção, Conforto e Identidade Profissional | Jaleca',
  description: 'Psicóloga deve usar jaleco? O que o CFP diz, quando faz sentido usar e qual modelo escolher para não desviar a atenção do paciente.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-psicologa-guia' },
  openGraph: {
    title: 'Jaleco para Psicóloga: Discreção, Conforto e Identidade Profissional',
    description: 'Psicóloga deve usar jaleco? O que o CFP diz, quando faz sentido usar e qual modelo escolher para não desviar a atenção do paciente.',
    url: 'https://jaleca.com.br/blog/jaleco-para-psicologa-guia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Psicóloga: Discreção, Conforto e Identidade Profissional',
  description: 'Psicóloga deve usar jaleco? O que o CFP diz, quando faz sentido usar e qual modelo escolher para não desviar a atenção do paciente.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-psicologa-guia',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Psicóloga é obrigada a usar jaleco?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Não. O CFP não exige o uso de jaleco. Em consultório particular de atendimento individual, a escolha é do profissional. Em contextos hospitalares, ambulatoriais e de avaliação psicológica formal, o jaleco é esperado."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco para psicóloga?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Para psicólogas que usam jaleco, o ideal é discreto: Slim Tradicional em tons neutros como branco, cinza, azul claro ou bege. Evitar cores muito chamativas ou modelos com muito detalhe — o jaleco não deve ser o foco da atenção durante o atendimento."
    }
  },
  {
    "@type": "Question",
    "name": "Psicóloga pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O CFP não proíbe. Mas na psicologia, cores muito saturadas podem ser distratoras em sessões de atendimento. Tons neutros e pastéis são mais indicados para o contexto terapêutico."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Psicóloga', item: 'https://jaleca.com.br/blog/jaleco-para-psicologa-guia' },
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
          <span className="text-foreground">Jaleco Psicóloga</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Psicóloga: Discreção, Conforto e Identidade Profissional
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A psicóloga usa o jaleco de forma diferente de outras profissionais de saúde. O objetivo é criar acolhimento — e o jaleco pode contribuir ou atrapalhar essa dinâmica.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Psicóloga é obrigada a usar jaleco?</h2>
          <p>Não. O CFP não exige o uso de jaleco. Em consultório particular de atendimento individual, a escolha é do profissional. Em contextos hospitalares, ambulatoriais e de avaliação psicológica formal, o jaleco é esperado.</p>

          <h2>Qual jaleco para psicóloga?</h2>
          <p>Para psicólogas que usam jaleco, o ideal é discreto: Slim Tradicional em tons neutros como branco, cinza, azul claro ou bege. Evitar cores muito chamativas ou modelos com muito detalhe — o jaleco não deve ser o foco da atenção durante o atendimento.</p>

          <h2>Psicóloga pode usar jaleco colorido?</h2>
          <p>O CFP não proíbe. Mas na psicologia, cores muito saturadas podem ser distratoras em sessões de atendimento. Tons neutros e pastéis são mais indicados para o contexto terapêutico.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-psicologa" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para psicóloga</Link>
            <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido</Link>
            <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ O que cada conselho permite</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para psicóloga</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional em tons neutros — discreto e elegante para consultório. Do PP ao G3.</p>
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
