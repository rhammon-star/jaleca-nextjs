import Link from 'next/link'
import { ArrowRight, Calendar, User, Tag } from 'lucide-react'
import { getPosts } from '@/lib/wordpress'
import type { Metadata } from 'next'
import type { WPPost } from '@/lib/wordpress'

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
  try {
    posts = await getPosts({ per_page: perPage, page: currentPage })
  } catch {
    posts = []
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
    <main className="py-8 md:py-12">
      <div className="container max-w-4xl">
        <header className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Conteúdo para profissionais da saúde que valorizam estilo e informação
          </p>
        </header>

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
        {posts.length === perPage && (
          <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-border">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border px-4 py-2 hover:bg-secondary/20 transition-colors"
              >
                Anterior
              </Link>
            )}
            <span className="text-sm text-muted-foreground">Página {currentPage}</span>
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border px-4 py-2 hover:bg-secondary/20 transition-colors"
            >
              Próxima <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </main>
    </>
  )
}
