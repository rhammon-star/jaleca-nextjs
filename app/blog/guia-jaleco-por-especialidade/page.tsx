import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPIC_CLUSTERS } from '@/lib/topic-clusters'

const cluster = TOPIC_CLUSTERS.find(c => c.pillarSlug === 'guia-jaleco-por-especialidade')!

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
  about: [{ '@type': 'Thing', name: 'Jaleco profissional', sameAs: 'https://pt.wikipedia.org/wiki/Jaleco' }],
  mentions: [
    { '@type': 'Organization', name: 'COFEN', sameAs: 'https://www.cofen.gov.br' },
    { '@type': 'Organization', name: 'CFM', sameAs: 'https://portal.cfm.org.br' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Médica é obrigada a usar jaleco branco?', acceptedAnswer: { '@type': 'Answer', text: 'O CFM não impõe cor obrigatória para médicos. Em hospitais públicos e UPAs, o branco geralmente é exigido por política interna. Em consultórios particulares, qualquer cor é aceita.' } },
    { '@type': 'Question', name: 'Enfermeira pode usar qualquer jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'O COFEN (Resolução 311/2007) não determina cor ou modelo específico. A instituição empregadora define a padronização. Em geral, brancos e azuis são os mais comuns em hospitais públicos.' } },
    { '@type': 'Question', name: 'Qual jaleco usar no consultório odontológico?', acceptedAnswer: { '@type': 'Answer', text: 'Para dentistas, o jaleco deve ter manga longa (exigência de biossegurança), ser de fácil desinfecção e resistente a respingos. O gabardine com elastano é o tecido mais indicado. Cores claras são preferidas para visualizar contaminação.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco por Especialidade', item: `https://jaleca.com.br/blog/${cluster.pillarSlug}` },
  ],
}

const ESPECIALIDADES = [
  { profissao: 'Médica', slug: 'jaleco-para-medica-guia-completo', cor: 'Branco (consultório) ou colorido (clínica privada)', modelo: 'Slim Tradicional ou Elastex', norma: 'CFM — sem cor obrigatória' },
  { profissao: 'Enfermeira', slug: 'jaleco-para-enfermeira-regras-cofen', cor: 'Branco ou azul (hospitais)', modelo: 'Clássico ou slim', norma: 'COFEN — sem padrão federal de cor' },
  { profissao: 'Dentista', slug: 'guia-jaleco-para-dentista-modelos-cores-como-escolher', cor: 'Branco ou claro', modelo: 'Manga longa obrigatória', norma: 'CFO — biossegurança exige manga longa' },
  { profissao: 'Fisioterapeuta', slug: 'jaleco-para-fisioterapeuta-guia', cor: 'Livre', modelo: 'Slim ou scrub', norma: 'COFFITO — sem padronização de cor' },
  { profissao: 'Nutricionista', slug: 'jaleco-para-nutricionista-consultorio', cor: 'Branco preferido', modelo: 'Slim ou clássico', norma: 'CFN — sem padrão de cor' },
]

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
          <span className="text-foreground">Jaleco por Especialidade</span>
        </nav>

        <header className="mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#c4a97d]">Guia Completo · Página Pilar</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mt-2 mb-4">
            {cluster.pillarTitle}
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">{cluster.pillarDescription}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Qual jaleco cada especialidade deve usar?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>A escolha do jaleco depende da especialidade, da norma do conselho regulador e da política da instituição. Não há lei federal que determine cor ou modelo — cada conselho (CFM, COFEN, CFO, COFFITO) tem suas próprias recomendações.</p>
          </blockquote>

          <h2>Comparativo: jaleco por profissão e norma</h2>
          <table>
            <thead>
              <tr><th>Profissão</th><th>Cor recomendada</th><th>Modelo</th><th>Norma</th></tr>
            </thead>
            <tbody>
              {ESPECIALIDADES.map(e => (
                <tr key={e.profissao}>
                  <td><Link href={`/blog/${e.slug}`} className="text-[#c4a97d] hover:underline">{e.profissao}</Link></td>
                  <td>{e.cor}</td>
                  <td>{e.modelo}</td>
                  <td>{e.norma}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Existe cor de jaleco obrigatória no Brasil?</h2>
          <blockquote cite="https://jaleca.com.br/pesquisa-jaleca">
            <p>Não existe lei federal que determine cor obrigatória para jalecos. A obrigação vem da política interna de cada instituição. O <a href="https://portal.cfm.org.br" target="_blank" rel="noopener noreferrer">CFM</a> e o <a href="https://www.cofen.gov.br" target="_blank" rel="noopener noreferrer">COFEN</a> não impõem cor específica em seus códigos de ética.</p>
          </blockquote>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-6 text-[#1a1a1a]">Guias por especialidade</h2>
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
          <h3 className="font-display text-xl font-semibold mb-2">Ver todos os jalecos</h3>
          <p className="text-muted-foreground mb-4">Jalecos para todas as especialidades — entrega para todo o Brasil.</p>
          <Link href="/categoria/jalecos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widets uppercase hover:bg-[#333]">
            Ver Todos os Jalecos →
          </Link>
        </div>
      </article>
    </>
  )
}
