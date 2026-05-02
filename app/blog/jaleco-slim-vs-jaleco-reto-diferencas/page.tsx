import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Slim vs Jaleco Reto: Qual a Diferença e Quando Usar Cada Um | Jaleca',
  description: 'Jaleco slim ou reto? Diferenças de corte, quando cada um faz sentido e como escolher para seu ambiente de trabalho.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto-diferencas' },
  openGraph: {
    title: 'Jaleco Slim vs Jaleco Reto: Qual a Diferença e Quando Usar Cada Um',
    description: 'Jaleco slim ou reto? Diferenças de corte, quando cada um faz sentido e como escolher para seu ambiente de trabalho.',
    url: 'https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto-diferencas',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Slim vs Jaleco Reto: Qual a Diferença e Quando Usar Cada Um',
  description: 'Jaleco slim ou reto? Diferenças de corte, quando cada um faz sentido e como escolher para seu ambiente de trabalho.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto-diferencas',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Qual a diferença entre jaleco slim e jaleco reto?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O jaleco reto tem corte tubular sem ajuste de cintura — mesma largura do ombro até a barra. O jaleco slim tem recortes laterais que seguem a silhueta feminina, mais estreito na cintura. O slim valoriza mais a silhueta; o reto tem mais espaço interno e é mais fácil de vestir rapidamente."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco slim serve para gestante?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, o jaleco reto em tamanho maior é mais confortável — tem mais espaço para a barriga crescer."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco slim é adequado para plantão?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim, desde que seja o modelo com elastano. O Slim Elastex tem o caimento do acinturado com a liberdade de movimento do tecido stretch — ideal para plantões longos."
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
    { '@type': 'ListItem', position: 3, name: 'Slim vs Reto', item: 'https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto-diferencas' },
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
          <span className="text-foreground">Slim vs Reto</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Slim vs Jaleco Reto: Qual a Diferença e Quando Usar Cada Um
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Slim ou reto? É a dúvida mais comum de quem está comprando jaleco feminino pela primeira vez. A resposta certa depende do ambiente, do biótipo e do que você prioriza.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Qual a diferença entre jaleco slim e jaleco reto?</h2>
          <p>O jaleco reto tem corte tubular sem ajuste de cintura — mesma largura do ombro até a barra. O jaleco slim tem recortes laterais que seguem a silhueta feminina, mais estreito na cintura. O slim valoriza mais a silhueta; o reto tem mais espaço interno e é mais fácil de vestir rapidamente.</p>

          <h2>Jaleco slim serve para gestante?</h2>
          <p>Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, o jaleco reto em tamanho maior é mais confortável — tem mais espaço para a barriga crescer.</p>

          <h2>Jaleco slim é adequado para plantão?</h2>
          <p>Sim, desde que seja o modelo com elastano. O Slim Elastex tem o caimento do acinturado com a liberdade de movimento do tecido stretch — ideal para plantões longos.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-feminino-acinturado" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino acinturado — o que é</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher por especialidade</Link>
            <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o tamanho certo</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos slim femininos</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional, Elastex, Princesa, Gold — corte acinturado para cada necessidade. Do PP ao G3.</p>
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
