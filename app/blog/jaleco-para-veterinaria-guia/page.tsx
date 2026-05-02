import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Veterinária: O Que Funciona no Consultório e na Cirurgia | Jaleca',
  description: 'Jaleco para veterinária: liberdade de movimento, resistência química e modelos para consultório e cirurgia.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-veterinaria-guia' },
  openGraph: {
    title: 'Jaleco para Veterinária: O Que Funciona no Consultório e na Cirurgia',
    description: 'Jaleco para veterinária: liberdade de movimento, resistência química e modelos para consultório e cirurgia.',
    url: 'https://jaleca.com.br/blog/jaleco-para-veterinaria-guia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Veterinária: O Que Funciona no Consultório e na Cirurgia',
  description: 'Jaleco para veterinária: liberdade de movimento, resistência química e modelos para consultório e cirurgia.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-veterinaria-guia',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Qual jaleco usar na veterinária?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O Slim Elastex é o mais indicado: elastano para movimentos amplos, resistência a lavagens frequentes com produtos fortes e caimento profissional para atendimento clínico."
    }
  },
  {
    "@type": "Question",
    "name": "Veterinária pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim. O CFMV não regulamenta cor de jaleco. Branco e azul são tradicionais, mas verde, cinza e outras cores são comuns em clínicas modernas."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco ou scrub para veterinária?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Para cirurgias e procedimentos, o scrub é mais prático — mais fácil de trocar e lavar. Para consultas e recepção de clientes, o jaleco sobre o scrub transmite mais profissionalismo."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Veterinária', item: 'https://jaleca.com.br/blog/jaleco-para-veterinaria-guia' },
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
          <span className="text-foreground">Jaleco Veterinária</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Veterinária: O Que Funciona no Consultório e na Cirurgia
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Veterinárias enfrentam condições extremas: animais agitados, procedimentos físicos intensos e produtos de limpeza fortes. O jaleco precisa sobreviver a tudo isso.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Qual jaleco usar na veterinária?</h2>
          <p>O Slim Elastex é o mais indicado: elastano para movimentos amplos, resistência a lavagens frequentes com produtos fortes e caimento profissional para atendimento clínico.</p>

          <h2>Veterinária pode usar jaleco colorido?</h2>
          <p>Sim. O CFMV não regulamenta cor de jaleco. Branco e azul são tradicionais, mas verde, cinza e outras cores são comuns em clínicas modernas.</p>

          <h2>Jaleco ou scrub para veterinária?</h2>
          <p>Para cirurgias e procedimentos, o scrub é mais prático — mais fácil de trocar e lavar. Para consultas e recepção de clientes, o jaleco sobre o scrub transmite mais profissionalismo.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-veterinaria" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para veterinária</Link>
            <Link href="/blog/jaleco-slim-vs-jaleco-reto-diferencas" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim vs jaleco reto</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o modelo certo</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para veterinária</h3>
          <p className="text-muted-foreground mb-4">Slim Elastex — resistência e mobilidade para atendimentos intensos. Do PP ao G3.</p>
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
