import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Fisioterapeuta: O Que Considerar Antes de Comprar',
  description: 'Fisioterapeuta precisa de jaleco com elastano para movimento livre. Guia com modelos, cores e o que o COFFITO permite.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-fisioterapeuta-guia' },
  openGraph: {
    title: 'Jaleco para Fisioterapeuta: O Que Considerar Antes de Comprar',
    description: 'Fisioterapeuta precisa de jaleco com elastano para movimento livre. Guia com modelos, cores e o que o COFFITO permite.',
    url: 'https://jaleca.com.br/blog/jaleco-para-fisioterapeuta-guia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Fisioterapeuta: O Que Considerar Antes de Comprar',
  description: 'Fisioterapeuta precisa de jaleco com elastano para movimento livre. Guia com modelos, cores e o que o COFFITO permite.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-para-fisioterapeuta-guia',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Fisioterapeuta pode usar jaleco colorido?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O COFFITO não regulamenta cor de jaleco. Em clínicas particulares, qualquer cor é aceita. Em hospitais, verificar a política interna. O branco é aceito em qualquer ambiente."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco é melhor para fisioterapeuta?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O Slim Elastex é o mais indicado: tecido com elastano bidirecional que permite agachar, elevar os braços e fazer movimentos amplos sem apertar. Para consultório de avaliação com menos movimentação, o Slim Tradicional em gabardine também atende."
    }
  },
  {
    "@type": "Question",
    "name": "Fisioterapeuta precisa usar jaleco?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "O COFFITO não torna o jaleco obrigatório. Muitos fisioterapeutas usam scrub ou roupa esportiva. Em consultórios clínicos e hospitais, o jaleco reforça a identidade profissional e é bem-vindo."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Fisioterapeuta', item: 'https://jaleca.com.br/blog/jaleco-para-fisioterapeuta-guia' },
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
          <span className="text-foreground">Jaleco Fisioterapeuta</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Fisioterapeuta: O Que Considerar Antes de Comprar
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Fisioterapeutas têm demandas específicas que a maioria dos jalecos não atende: liberdade de movimento, tecido durável e caimento profissional para ambiente clínico.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Fisioterapeuta pode usar jaleco colorido?</h2>
          <p>O COFFITO não regulamenta cor de jaleco. Em clínicas particulares, qualquer cor é aceita. Em hospitais, verificar a política interna. O branco é aceito em qualquer ambiente.</p>

          <h2>Qual jaleco é melhor para fisioterapeuta?</h2>
          <p>O Slim Elastex é o mais indicado: tecido com elastano bidirecional que permite agachar, elevar os braços e fazer movimentos amplos sem apertar. Para consultório de avaliação com menos movimentação, o Slim Tradicional em gabardine também atende.</p>

          <h2>Fisioterapeuta precisa usar jaleco?</h2>
          <p>O COFFITO não torna o jaleco obrigatório. Muitos fisioterapeutas usam scrub ou roupa esportiva. Em consultórios clínicos e hospitais, o jaleco reforça a identidade profissional e é bem-vindo.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-fisioterapeuta" className="text-[#c4a97d] hover:underline text-sm">→ Ver landing page — jaleco para fisioterapeuta</Link>
            <Link href="/blog/jaleco-slim-vs-jaleco-reto-diferencas" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim vs jaleco reto: qual a diferença</Link>
            <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o modelo certo para cada especialidade</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos com elastano para fisioterapeuta</h3>
          <p className="text-muted-foreground mb-4">Slim Elastex — corte acinturado com tecido bidirecional para máxima mobilidade. Do PP ao G3.</p>
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
