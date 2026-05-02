import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher | Jaleca',
  description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher' },
  openGraph: {
    title: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher',
    description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
    url: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher',
  description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Gestante pode usar jaleco slim?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, quando a barriga cresce, o jaleco reto em tamanho maior é mais confortável. O Slim Elastex em tamanho maior pode funcionar por mais tempo por causa do elastano."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco para gestante profissional de saúde?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Jaleco reto em 1 ou 2 tamanhos acima do habitual é a opção mais prática. O Slim Elastex em tamanho maior também funciona bem até o 6º ou 7º mês na maioria dos casos."
    }
  },
  {
    "@type": "Question",
    "name": "Quando trocar o jaleco na gravidez?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Quando o jaleco aperta na cintura ou fica desconfortável ao sentar — geralmente entre o 3º e 4º mês. Não espere apertar demais: um jaleco apertado durante a gravidez prejudica a circulação e o conforto."
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
    { '@type': 'ListItem', position: 3, name: 'Jaleco Gestante', item: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher' },
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
          <span className="text-foreground">Jaleco Gestante</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino para Gestante: O Que Muda e Como Escolher
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A gravidez muda completamente a relação com o jaleco. O modelo que servia perfeitamente antes pode se tornar desconfortável no segundo trimestre.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
                    <h2>Gestante pode usar jaleco slim?</h2>
          <p>Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, quando a barriga cresce, o jaleco reto em tamanho maior é mais confortável. O Slim Elastex em tamanho maior pode funcionar por mais tempo por causa do elastano.</p>

          <h2>Qual jaleco para gestante profissional de saúde?</h2>
          <p>Jaleco reto em 1 ou 2 tamanhos acima do habitual é a opção mais prática. O Slim Elastex em tamanho maior também funciona bem até o 6º ou 7º mês na maioria dos casos.</p>

          <h2>Quando trocar o jaleco na gravidez?</h2>
          <p>Quando o jaleco aperta na cintura ou fica desconfortável ao sentar — geralmente entre o 3º e 4º mês. Não espere apertar demais: um jaleco apertado durante a gravidez prejudica a circulação e o conforto.</p>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-plus-size" className="text-[#c4a97d] hover:underline text-sm">→ Ver jalecos plus size e tamanhos maiores</Link>
            <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#c4a97d] hover:underline text-sm">→ Como medir e escolher o tamanho certo</Link>
            <Link href="/blog/jaleco-slim-vs-jaleco-reto-diferencas" className="text-[#c4a97d] hover:underline text-sm">→ Slim vs reto: qual a diferença</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos em tamanhos G, G2 e G3</h3>
          <p className="text-muted-foreground mb-4">Modelos com mais espaço para gestantes e plus size. Slim Elastex e Slim Tradicional do PP ao G3.</p>
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
