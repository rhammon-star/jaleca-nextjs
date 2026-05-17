import Image from 'next/image'
import Link from 'next/link'

interface InstagramPost {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp: string
}

const JALECO_KEYWORDS = [
  'jaleco', 'jalecos', 'jaleca', 'scrub', 'pijama cirurgico', 'pijama cirúrgico',
  'slim', 'princesa', 'duquesa', 'elastex', 'plus size',
  'consultorio', 'consultório', 'clinica', 'clínica',
  'medic', 'médic', 'dentist', 'enferm', 'nutric', 'estetic',
  'veterin', 'farmac', 'psicolo', 'psicólo', 'fisio',
  'uniforme', 'gabardine', 'elastano', 'microfibra',
]

function isJalecoRelated(post: InstagramPost): boolean {
  const text = (post.caption ?? '').toLowerCase()
  if (!text) return false
  return JALECO_KEYWORDS.some((kw) => text.includes(kw))
}

async function getPosts(): Promise<InstagramPost[]> {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const igId = process.env.INSTAGRAM_BUSINESS_ID
    if (!token || !igId) return []

    const url = `https://graph.facebook.com/v25.0/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=18&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    if (data.error) return []

    return (data.data ?? []).filter(isJalecoRelated).slice(0, 12)
  } catch {
    return []
  }
}

async function getTaggedPosts(): Promise<InstagramPost[]> {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const igId = process.env.INSTAGRAM_BUSINESS_ID
    if (!token || !igId) return []

    const url = `https://graph.facebook.com/v25.0/${igId}/tags?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=30&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    if (data.error) return []

    return (data.data ?? []).filter(isJalecoRelated).slice(0, 12)
  } catch {
    return []
  }
}

async function getStories(): Promise<InstagramPost[]> {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const igId = process.env.INSTAGRAM_BUSINESS_ID
    if (!token || !igId) return []

    const url = `https://graph.facebook.com/v25.0/${igId}/stories?fields=id,media_type,media_url,thumbnail_url,timestamp&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 900 } })
    const data = await res.json()
    if (data.error) return []

    return (data.data ?? []).slice(0, 12)
  } catch {
    return []
  }
}

function getImageSrc(post: InstagramPost): string {
  if (post.media_type === 'VIDEO') return post.thumbnail_url ?? post.media_url ?? ''
  return post.media_url ?? post.thumbnail_url ?? ''
}

function PostGrid({ posts, label }: { posts: InstagramPost[]; label: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 md:gap-2.5">
      {posts.map((post) => {
        const src = getImageSrc(post)
        if (!src) return null
        const href = post.permalink ?? 'https://www.instagram.com/jaleca.oficial/'
        return (
          <Link
            key={post.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative block overflow-hidden rounded-md"
          >
            <div className="relative" style={{ aspectRatio: '4 / 5' }}>
              <Image
                src={src}
                alt={post.caption?.slice(0, 100) ?? label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
              <svg className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function SectionHeader({ title, rightLabel, rightHref }: { title: string; rightLabel: string; rightHref?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 500, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>
        {title}
      </h3>
      {rightHref ? (
        <Link href={rightHref} target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase tracking-[0.12em] text-[#6b6b6b] transition-colors hover:text-[#1a1a1a]">
          {rightLabel}
        </Link>
      ) : (
        <span className="text-[11px] uppercase tracking-[0.12em] text-[#9b9b9b]">{rightLabel}</span>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function InstagramGallery(_props: { maxItems?: number; title?: string } = {}) {
  const [stories, feed, tagged] = await Promise.all([getStories(), getPosts(), getTaggedPosts()])

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {stories.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="Stories" rightLabel="Ver no Instagram →" rightHref="https://www.instagram.com/jaleca.oficial/" />
          <PostGrid posts={stories} label="Story Jaleca no Instagram" />
        </section>
      )}

      {feed.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Últimas postagens" rightLabel="@jaleca.oficial →" rightHref="https://www.instagram.com/jaleca.oficial/" />
          <PostGrid posts={feed} label="Post Jaleca no Instagram" />
        </section>
      )}

      {tagged.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Marcaram a Jaleca" rightLabel="@jaleca.oficial" />
          <PostGrid posts={tagged} label="Cliente usando jaleco Jaleca" />
        </section>
      )}
    </div>
  )
}
