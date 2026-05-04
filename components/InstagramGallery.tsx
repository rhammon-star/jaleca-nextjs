import Image from 'next/image'
import Link from 'next/link'

interface InstagramPost {
  id: string
  caption?: string
  media_type: string
  media_url: string
  permalink: string
  timestamp: string
}

async function getPosts(): Promise<InstagramPost[]> {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN
    const igId = process.env.INSTAGRAM_BUSINESS_ID
    if (!token || !igId) return []

    const url = `https://graph.instagram.com/v19.0/${igId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=30&access_token=${token}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    if (data.error) return []

    return (data.data ?? []).filter(
      (p: InstagramPost) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM'
    )
  } catch {
    return []
  }
}

interface InstagramGalleryProps {
  maxItems?: number
  title?: string
}

export async function InstagramGallery({
  maxItems = 6,
  title = 'Siga @jaleca.oficial',
}: InstagramGalleryProps) {
  const posts = (await getPosts()).slice(0, maxItems)

  if (posts.length === 0) return null

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href="https://www.instagram.com/jaleca.oficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
        >
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative rounded-lg overflow-hidden group block"
          >
            <div className="relative aspect-square">
              <Image
                src={post.media_url}
                alt={post.caption?.slice(0, 100) ?? 'Post Jaleca no Instagram'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
