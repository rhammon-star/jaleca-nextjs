import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAuthorBySlug, AUTHORS, authorSchema } from '@/lib/authors'

export async function generateStaticParams() {
  return AUTHORS.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: `${author.name} — ${author.jobTitle} | Jaleca`,
    description: author.bio,
    alternates: { canonical: `https://jaleca.com.br/autor/${author.slug}` },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const base = authorSchema(author)
  const schema = {
    '@context': 'https://schema.org',
    ...base,
    description: author.bio,
    worksFor: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />

      <div className="container py-16 max-w-2xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Autor</span>
        </nav>

        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary/20 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">{author.name}</h1>
            <p className="text-sm text-[#c4a97d] font-medium mt-1">{author.jobTitle}</p>
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground mt-2 inline-block underline"
            >
              LinkedIn →
            </a>
          </div>
        </div>

        <p className="text-[#555] leading-relaxed mb-8">{author.bio}</p>

        <div className="mb-10">
          <h2 className="font-display text-base font-semibold mb-3 text-[#1a1a1a]">Especialidades</h2>
          <div className="flex flex-wrap gap-2">
            {author.knowsAbout.map(topic => (
              <span key={topic} className="text-xs border border-[#e8e0d5] px-3 py-1 text-[#555]">{topic}</span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="text-sm text-[#c4a97d] hover:underline">
            ← Ver todos os artigos do blog
          </Link>
        </div>
      </div>
    </>
  )
}
