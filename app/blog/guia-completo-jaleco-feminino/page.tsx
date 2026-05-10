import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPIC_CLUSTERS } from '@/lib/topic-clusters'

const cluster = TOPIC_CLUSTERS.find(c => c.pillarSlug === 'guia-completo-jaleco-feminino')!

export const metadata: Metadata = {
  title: `${cluster.pillarTitle} | Jaleca`,
  description: cluster.pillarDescription,
  alternates: { canonical: `https://jaleca.com.br/blog/${cluster.pillarSlug}` },
  openGraph: {
    title: cluster.pillarTitle,
    description: cluster.pillarDescription,
    url: `https://jaleca.com.br/blog/${cluster.pillarSlug}`,
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: cluster.pillarTitle,
  description: cluster.pillarDescription,
  author: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  datePublished: '2026-05-09',
  dateModified: '2026-05-09',
  url: `https://jaleca.com.br/blog/${cluster.pillarSlug}`,
  about: [{ '@type': 'Thing', name: 'Jaleco feminino', sameAs: 'https://pt.wikipedia.org/wiki/Jaleco' }],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o melhor jaleco feminino para médica?', acceptedAnswer: { '@type': 'Answer', text: 'O jaleco slim com elastano é o mais indicado para médicas — alia conforto, liberdade de movimento e caimento elegante. Para plantão de 12h, o modelo Elastex da Jaleca é o mais vendido. Para consultório, o Slim Tradicional branco é o padrão.' } },
    { '@type': 'Question', name: 'Jaleco feminino pode ser colorido?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Não há norma federal que exija branco — a cor depende da política da instituição. Em hospitais públicos, o branco geralmente é padrão. Em consultórios particulares e clínicas, qualquer cor é aceita.' } },
    { '@type': 'Question', name: 'Como medir para comprar jaleco feminino online?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Compare com a tabela de medidas da peça específica (não da marca em geral). Na dúvida entre dois tamanhos, opte pelo maior — jaleco apertado nos ombros restringe movimento.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Guia Jaleco Feminino', item: `https://jaleca.com.br/blog/${cluster.pillarSlug}` },
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
          <span className="text-foreground">Guia Jaleco Feminino</span>
        </nav>

        <header className="mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#c4a97d]">Guia Completo · Página Pilar</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mt-2 mb-4">
            {cluster.pillarTitle}
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">{cluster.pillarDescription}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Qual o melhor jaleco feminino para médica?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>O jaleco slim com elastano é o mais indicado para médicas — alia conforto, liberdade de movimento e caimento elegante. Para plantão de 12h, o modelo Elastex é o mais vendido na Jaleca. Para consultório, o Slim Tradicional branco é o padrão.</p>
          </blockquote>

          <h2>Jaleco feminino pode ser colorido?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>Sim. Não há norma federal que exija branco. A cor depende da política da instituição. Em hospitais públicos e UPAs, o branco é geralmente exigido por norma interna. Em consultórios particulares, qualquer cor é aceita.</p>
          </blockquote>
          <p>Segundo dados da Jaleca, o branco é a cor mais vendida em todas as categorias — mas jalecos coloridos (rosa, azul royal, verde) representam uma fatia crescente das vendas, especialmente em clínicas privadas e consultórios estéticos.</p>

          <h2>Como medir para comprar jaleco feminino online?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>Meça busto, cintura e quadril com fita métrica. Compare com a tabela de medidas da peça específica. Na dúvida entre dois tamanhos, opte pelo maior — o tamanho P feminino e M masculino representam ~50% das vendas na Jaleca, mas o ajuste varia por modelo.</p>
          </blockquote>

          <h2>Comparativo: jaleco slim vs jaleco clássico</h2>
          <table>
            <thead>
              <tr><th>Característica</th><th>Slim</th><th>Clássico</th></tr>
            </thead>
            <tbody>
              <tr><td>Corte</td><td>Acinturado</td><td>Reto</td></tr>
              <tr><td>Ideal para</td><td>Consultório, clínica</td><td>Laboratório, procedimentos</td></tr>
              <tr><td>Tecido</td><td>Gabardine + elastano</td><td>Gabardine tradicional</td></tr>
              <tr><td>Amplitude</td><td>Média (elastano compensa)</td><td>Alta</td></tr>
              <tr><td>Visual</td><td>Elegante, moderno</td><td>Formal, neutro</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-6 text-[#1a1a1a]">Artigos deste guia</h2>
          <div className="grid gap-3">
            {cluster.posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between p-4 border border-[#e8e0d5] hover:border-[#c4a97d] transition-colors group"
              >
                <div>
                  <p className="font-medium text-[#1a1a1a] group-hover:text-[#c4a97d] transition-colors">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.description}</p>
                </div>
                <span className="text-[#c4a97d] text-sm flex-shrink-0 ml-4">Ler →</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos femininos</h3>
          <p className="text-muted-foreground mb-4">Slim, Elastex, branco e colorido — do PP ao G3, entrega para todo o Brasil.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
          </Link>
        </div>
      </article>
    </>
  )
}
