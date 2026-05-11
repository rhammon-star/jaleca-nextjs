import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Manga Curta: Quando Usar e Quem Pode na Área da Saúde',
  description: 'Manga curta é permitida? Quando faz sentido, quando manga longa é melhor e modelos disponíveis para profissionais de saúde.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-manga-curta-quando-usar-profissionais' },
  openGraph: {
    title: 'Jaleco Manga Curta: Quando Usar e Quem Pode na Área da Saúde',
    description: 'Manga curta é permitida? Quando faz sentido, quando manga longa é melhor e modelos disponíveis para profissionais de saúde.',
    url: 'https://jaleca.com.br/blog/jaleco-manga-curta-quando-usar-profissionais',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Manga Curta: Quando Usar e Quem Pode na Área da Saúde',
  description: 'Manga curta é permitida? Quando faz sentido, quando manga longa é melhor e modelos disponíveis para profissionais de saúde.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-manga-curta-quando-usar-profissionais',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Jaleco manga curta é permitido na área da saúde?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Nenhum conselho federal de saúde proíbe manga curta. A restrição vem de normas internas hospitalares em setores de alto risco (UTI, centro cirúrgico) onde manga longa é exigida por protocolo de biossegurança."
    }
  },
  {
    "@type": "Question",
    "name": "Médica pode usar jaleco manga curta no consultório?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim. Em consultório particular, não há restrição. O CFM não regulamenta comprimento de manga. Manga curta é muito comum em clínicas de dermatologia, nutrição e estética."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco manga curta facilita a lavagem das mãos?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim, essa é uma das principais vantagens em ambientes clínicos. Manga curta facilita a higienização correta dos antebraços — importante em odontologia e procedimentos que exigem paramentação frequente."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Manga Curta', item: 'https://jaleca.com.br/blog/jaleco-manga-curta-quando-usar-profissionais' },
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
          <span className="text-foreground">Jaleco Manga Curta</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Manga Curta: Quando Usar e Quem Pode na Área da Saúde
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Jaleco manga curta é permitido? Quando faz sentido usar e quando a manga longa é melhor — guia direto para profissionais de saúde.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Jaleco manga curta é permitido na área da saúde?</h2>
          <p>Nenhum conselho federal de saúde proíbe manga curta. A restrição vem de normas internas hospitalares em setores de alto risco (UTI, centro cirúrgico) onde manga longa é exigida por protocolo de biossegurança.</p>

          <h2>Médica pode usar jaleco manga curta no consultório?</h2>
          <p>Sim. Em consultório particular, não há restrição. O CFM não regulamenta comprimento de manga. Manga curta é muito comum em clínicas de dermatologia, nutrição e estética.</p>

          <h2>Jaleco manga curta facilita a lavagem das mãos?</h2>
          <p>Sim, essa é uma das principais vantagens em ambientes clínicos. Manga curta facilita a higienização correta dos antebraços — importante em odontologia e procedimentos que exigem paramentação frequente.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/blog/jaleco-para-medica-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco para médica: guia completo</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher por especialidade</Link>
            <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ O que cada conselho permite</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos manga curta femininos</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional Manga Curta e Slim Princesa Manga Curta — corte acinturado com conforto extra.</p>
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
