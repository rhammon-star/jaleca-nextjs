import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Esteticista: Visual Profissional que Transmite Confiança | Jaleca',
  description: 'Jaleco para esteticista: modelos com acabamento premium, cores para identidade visual da clínica e resistência a produtos cosméticos.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-esteticista-guia' },
  openGraph: {
    title: 'Jaleco para Esteticista: Visual Profissional que Transmite Confiança',
    description: 'Jaleco para esteticista: modelos com acabamento premium, cores para identidade visual da clínica e resistência a produtos cosméticos.',
    url: 'https://jaleca.com.br/blog/jaleco-para-esteticista-guia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Esteticista: Visual Profissional que Transmite Confiança',
  description: 'Jaleco para esteticista: modelos com acabamento premium, cores para identidade visual da clínica e resistência a produtos cosméticos.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-esteticista-guia',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Esteticista precisa usar jaleco?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Não há obrigatoriedade legal. Mas em clínicas de estética, o jaleco é parte do uniforme profissional e reforça a identidade visual do espaço. É quase unanimidade nas clínicas de médio e alto padrão."
    }
  },
  {
    "@type": "Question",
    "name": "Qual cor de jaleco para esteticista?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Lilás, rosê, nude, branco e preto são os mais usados. O preto é elegante e esconde respingos de produtos. Cores pastéis transmitem suavidade e alinhamento com bem-estar."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco com bordado na estética vale a pena?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim. Bordado com nome e especialidade valoriza o jaleco e reforça a identidade profissional. É comum em clínicas com padrão de atendimento diferenciado."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Esteticista', item: 'https://jaleca.com.br/blog/jaleco-para-esteticista-guia' },
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
          <span className="text-foreground">Jaleco Esteticista</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Esteticista: Visual Profissional que Transmite Confiança
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A esteticista trabalha com a imagem das pessoas — e o jaleco faz parte desse cuidado. Um jaleco bem escolhido reforça a credibilidade do espaço antes do atendimento começar.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Esteticista precisa usar jaleco?</h2>
          <p>Não há obrigatoriedade legal. Mas em clínicas de estética, o jaleco é parte do uniforme profissional e reforça a identidade visual do espaço. É quase unanimidade nas clínicas de médio e alto padrão.</p>

          <h2>Qual cor de jaleco para esteticista?</h2>
          <p>Lilás, rosê, nude, branco e preto são os mais usados. O preto é elegante e esconde respingos de produtos. Cores pastéis transmitem suavidade e alinhamento com bem-estar.</p>

          <h2>Jaleco com bordado na estética vale a pena?</h2>
          <p>Sim. Bordado com nome e especialidade valoriza o jaleco e reforça a identidade profissional. É comum em clínicas com padrão de atendimento diferenciado.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-esteticista" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para esteticista</Link>
            <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido: qual usar</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o modelo certo</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos para esteticista</h3>
          <p className="text-muted-foreground mb-4">Slim Gold e Slim Tradicional — acabamento premium para clínicas de alto padrão. Do PP ao G3.</p>
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
