import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPIC_CLUSTERS } from '@/lib/topic-clusters'

const cluster = TOPIC_CLUSTERS.find(c => c.pillarSlug === 'guia-completo-scrub-feminino')!

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
  about: [{ '@type': 'Thing', name: 'Scrub feminino' }],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o melhor scrub feminino para enfermeira?', acceptedAnswer: { '@type': 'Answer', text: 'O scrub em tecido two way (poliéster com elastano) é o mais indicado para enfermeiras — máxima mobilidade, resistente a lavagens frequentes e confortável em turnos longos. Modelos com corte reto ou semi-acinturado e calça com elástico são os mais vendidos.' } },
    { '@type': 'Question', name: 'Scrub feminino e pijama cirúrgico são a mesma coisa?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. "Scrub" é o termo em inglês e "pijama cirúrgico" é o nome tradicional no Brasil. Ambos se referem ao conjunto blusa + calça usado por profissionais de saúde.' } },
    { '@type': 'Question', name: 'Como lavar scrub feminino corretamente?', acceptedAnswer: { '@type': 'Answer', text: 'Lave em água fria ou morna (até 30°C para sintéticos). Evite amaciante em tecidos com elastano. Não torça — esprema suavemente. Seque na sombra. Para manchas de sangue, use água fria imediatamente — água quente fixa a mancha.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Guia Scrub Feminino', item: `https://jaleca.com.br/blog/${cluster.pillarSlug}` },
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
          <span className="text-foreground">Guia Scrub Feminino</span>
        </nav>

        <header className="mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#c4a97d]">Guia Completo · Página Pilar</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mt-2 mb-4">
            {cluster.pillarTitle}
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">{cluster.pillarDescription}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Qual o melhor scrub feminino para enfermeira?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>O scrub em tecido two way (poliéster com elastano) é o mais indicado para enfermeiras — máxima mobilidade, resistente a lavagens frequentes e confortável em turnos longos. Modelos com corte reto ou semi-acinturado são os mais vendidos.</p>
          </blockquote>

          <h2>Qual a diferença entre scrub e jaleco?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>O jaleco é um avental sobre a roupa comum, geralmente branco. O scrub é um uniforme completo (blusa + calça) que substitui a roupa civil. O scrub é mais prático para procedimentos longos e rotinas hospitalares intensas.</p>
          </blockquote>

          <dl>
            <dt>Scrub</dt>
            <dd>Conjunto completo (blusa + calça). Substitui a roupa civil. Ideal para UTI, CC e rotinas hospitalares longas.</dd>
            <dt>Jaleco</dt>
            <dd>Avental por cima da roupa. Mantém identidade visual formal. Ideal para consultório e atendimento ambulatorial.</dd>
          </dl>

          <h2>Comparativo de tecidos para scrub feminino</h2>
          <table>
            <thead>
              <tr><th>Tecido</th><th>Conforto</th><th>Durabilidade</th><th>Ideal para</th></tr>
            </thead>
            <tbody>
              <tr><td>Two Way (Poliéster + Elastano)</td><td>Máximo</td><td>Alta</td><td>UTI, CC, Emergência</td></tr>
              <tr><td>Gabardine</td><td>Bom</td><td>Muito alta</td><td>Consultório, ambulatório</td></tr>
              <tr><td>Oxfordine</td><td>Médio</td><td>Média</td><td>Estudantes, clínicas</td></tr>
              <tr><td>Tricoline (Algodão)</td><td>Alto</td><td>Média</td><td>Climas quentes</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-6 text-[#1a1a1a]">Artigos deste guia</h2>
          <div className="grid gap-3">
            {cluster.posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center justify-between p-4 border border-[#e8e0d5] hover:border-[#c4a97d] transition-colors group">
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
          <h3 className="font-display text-xl font-semibold mb-2">Ver scrubs femininos</h3>
          <p className="text-muted-foreground mb-4">Two way, gabardine e oxfordine — do PP ao G3, entrega para todo o Brasil.</p>
          <Link href="/categoria/scrub" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Scrubs Femininos →
          </Link>
        </div>
      </article>
    </>
  )
}
