import Link from 'next/link'
import { ArrowRight, Calendar, User, Tag } from 'lucide-react'
import { getPostsWithMeta } from '@/lib/wordpress'
import type { Metadata } from 'next'
import type { WPPost } from '@/lib/wordpress'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — Dicas para Profissionais da Saúde',
  description: 'Artigos e dicas sobre moda profissional para profissionais da saúde. Como escolher o jaleco ideal, tendências e cuidados com o uniforme.',
  alternates: { canonical: 'https://jaleca.com.br/blog' },
  openGraph: {
    title: 'Blog — Jaleca | Dicas para Profissionais da Saúde',
    description: 'Artigos e dicas sobre moda profissional para profissionais da saúde.',
    url: 'https://jaleca.com.br/blog',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Blog Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Jaleca | Dicas para Profissionais da Saúde',
    description: 'Artigos e dicas sobre moda profissional para profissionais da saúde.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

function getFeaturedImageUrl(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  return media?.source_url ?? null
}

function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? 'Jaleca'
}

function getCategories(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term']
  if (!terms) return []
  return terms.flat().filter(t => t.id).map(t => t.name)
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = Number(pageParam) || 1
  const perPage = 10

  let posts: WPPost[] = []
  let totalPages = 1
  try {
    const result = await getPostsWithMeta({ per_page: perPage, page: currentPage })
    posts = result.posts
    totalPages = result.totalPages
  } catch {
    posts = []
  }

  const FAQ_ITEMS = [
    { '@type': 'Question', name: 'Como escolher o jaleco ideal para minha profissão?', acceptedAnswer: { '@type': 'Answer', text: 'A escolha depende do seu ambiente de trabalho. Para consultórios, jalecos slim são elegantes. Para hospitais, modelos com elastano oferecem mais conforto em longas jornadas.' } },
    { '@type': 'Question', name: 'Qual a diferença entre jaleco Slim e Profissional?', acceptedAnswer: { '@type': 'Answer', text: 'O Slim tem corte ajustado ao corpo; o Profissional tem caimento mais solto e estruturado. Ambos são opções válidas dependendo da sua preferência e ambiente.' } },
    { '@type': 'Question', name: 'Jaleco branco ou colorido: qual escolher?', acceptedAnswer: { '@type': 'Answer', text: 'Hospitais e centros cirúrgicos exigem jaleco branco. Em consultórios e clínicas, cores são aceitas e transmitem personalidade.' } },
    { '@type': 'Question', name: 'Como cuidar do jaleco para aumentar a durabilidade?', acceptedAnswer: { '@type': 'Answer', text: 'Lave em água fria ou morna, use sabão neutro, evite alvejante. Seque à sombra e passe em temperatura média.' } },
    { '@type': 'Question', name: 'Qual tamanho de jaleco devo escolher?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto e cintura e compare com a tabela de medidas. Na dúvida entre dois tamanhos, opte pelo maior — jaleco largo é mais fácil de ajustar.' } },
    { '@type': 'Question', name: 'A Jaleca oferece troca de jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'Arrependimento: até 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta.' } },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS,
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Jaleca — Dicas para Profissionais da Saúde',
    description: 'Artigos e dicas sobre moda profissional, cuidados com uniformes e tendências para médicos, enfermeiros e profissionais da saúde.',
    url: 'https://jaleca.com.br/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo.svg' },
    },
    ...(posts.length > 0 && {
      blogPost: posts.slice(0, 10).map(p => ({
        '@type': 'BlogPosting',
        headline: stripHtml(p.title.rendered),
        url: `https://jaleca.com.br/blog/${p.slug}`,
        datePublished: p.date,
        dateModified: p.modified,
        author: { '@type': 'Person', name: p._embedded?.author?.[0]?.name ?? 'Jaleca' },
      })),
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    <main className="py-8 md:py-12">
      <div className="container max-w-4xl">
        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Conteúdo para profissionais da saúde que valorizam estilo e informação
          </p>
        </header>

        {currentPage === 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-accent mb-4">Leia também</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: '/blog/jaleco-enfermagem-o-que-considerar-comprar-2', label: 'Jaleco de Enfermagem: O que Considerar ao Comprar' },
                { href: '/blog/jaleco-odontologia-como-escolher', label: 'Jaleco de Odontologia: Como Escolher o Modelo Certo' },
                { href: '/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar', label: 'Jaleco ou Scrub: Qual a Diferença e Quando Usar' },
                { href: '/blog/jaleco-para-fisioterapeuta-conforto-longas-jornadas-2', label: 'Jaleco para Fisioterapeuta: Conforto em Longas Jornadas' },
                { href: '/blog/onde-comprar-jaleco-online-qualidade', label: 'Onde Comprar Jaleco Online com Qualidade' },
                { href: '/blog/scrub-x-jaleco-diferencas-e-quando-usar-cada-um-2', label: 'Scrub x Jaleco: Diferenças e Quando Usar Cada Um' },
                { href: '/blog/tecidos-para-jaleco-qual-o-melhor-material-profissionais-saude-2', label: 'Tecidos para Jaleco: Qual o Melhor Material' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <ArrowRight size={12} className="text-accent shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {posts.map(post => {
              const imageUrl = getFeaturedImageUrl(post)
              const author = getAuthorName(post)
              const categories = getCategories(post)
              const excerpt = stripHtml(post.excerpt.rendered)
              const title = stripHtml(post.title.rendered)

              return (
                <article key={post.id} className="py-8 group">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6 items-start">
                    <div>
                      {categories.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag size={10} className="text-accent" />
                          <span className="text-[10px] font-semibold tracking-widest uppercase text-accent">
                            {categories[0]}
                          </span>
                        </div>
                      )}

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="font-display text-xl md:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors leading-tight">
                          {title}
                        </h2>
                      </Link>

                      {excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-pretty line-clamp-3">
                          {excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {author}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-primary-text hover:underline underline-offset-4"
                      >
                        Ler artigo <ArrowRight size={12} />
                      </Link>
                    </div>

                    {imageUrl && (
                      <Link href={`/blog/${post.slug}`} className="order-first md:order-last">
                        <div className="aspect-[16/9] overflow-hidden bg-secondary/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-border">
            {currentPage > 1 ? (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border px-4 py-2 hover:bg-secondary/20 transition-colors"
              >
                ← Anterior
              </Link>
            ) : (
              <span className="w-24" />
            )}
            <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</span>
            {currentPage < totalPages ? (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border px-4 py-2 hover:bg-secondary/20 transition-colors"
              >
                Próxima <ArrowRight size={14} />
              </Link>
            ) : (
              <span className="w-24" />
            )}
          </div>
        )}
      </div>
    </main>
    </>
  )
}
