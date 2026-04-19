const WP_BASE = (process.env.NEXT_PUBLIC_WP_URL ?? 'https://wp.jaleca.com.br').replace(/\/wp-json\/wp\/v2\/?$/, '')
const WP_URL = `${WP_BASE}/wp-json/wp/v2`

export type WPPost = {
  id: number
  slug: string
  status: string
  link: string
  date: string
  modified: string
  title: { rendered: string }
  content: { rendered: string; protected: boolean }
  excerpt: { rendered: string; protected: boolean }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  yoast_head_json?: {
    og_image?: Array<{ url: string }>
    author?: string
  }
  _embedded?: {
    author?: Array<{ name: string; avatar_urls?: Record<string, string> }>
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>
  }
}

export type WPCategory = {
  id: number
  name: string
  slug: string
  count: number
  description: string
}

function getAuthHeader(credentials: { username: string; appPassword: string }): string {
  const token = Buffer.from(`${credentials.username}:${credentials.appPassword}`).toString('base64')
  return `Basic ${token}`
}

export async function publishPost(
  data: {
    title: string
    content: string
    excerpt: string
    slug: string
    status: 'draft' | 'publish'
    featured_media?: number
    categories?: number[]
    tags?: number[]
  },
  credentials: { username: string; appPassword: string }
): Promise<{ id: number; link: string }> {
  const res = await fetch(`${WP_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(credentials),
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `WordPress API error: ${res.status}`)
  }
  const post = await res.json()
  return { id: post.id, link: post.link }
}

export async function updatePost(
  postId: number,
  data: { content?: string; title?: string; excerpt?: string; status?: string },
  credentials: { username: string; appPassword: string }
): Promise<void> {
  const res = await fetch(`${WP_URL}/posts/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(credentials),
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `WordPress API error: ${res.status}`)
  }
}

export async function deletePost(
  postId: number,
  credentials: { username: string; appPassword: string }
): Promise<void> {
  const res = await fetch(`${WP_URL}/posts/${postId}?force=true`, {
    method: 'DELETE',
    headers: { Authorization: getAuthHeader(credentials) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `WordPress API error: ${res.status}`)
  }
}

export async function uploadMedia(
  imageUrl: string,
  filename: string,
  credentials: { username: string; appPassword: string }
): Promise<number> {
  // Download image first
  const imgRes = await fetch(imageUrl, { redirect: 'follow' })
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status} ${imgRes.statusText}`)
  const buffer = await imgRes.arrayBuffer()
  const contentType = imgRes.headers.get('content-type')?.split(';')[0].trim() || 'image/jpeg'

  // Fix filename extension to match actual content-type
  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
  }
  const ext = extMap[contentType] ?? '.jpg'
  const baseName = filename.replace(/\.[^.]+$/, '')
  const finalFilename = `${baseName}${ext}`

  const res = await fetch(`${WP_URL}/media`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(credentials),
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${finalFilename}"`,
    },
    body: buffer,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Media upload error: ${res.status}`)
  }
  const media = await res.json()
  return media.id
}

export async function getPosts(params?: {
  per_page?: number
  page?: number
  search?: string
}): Promise<WPPost[]> {
  const query = new URLSearchParams()
  query.set('_embed', '1')
  if (params?.per_page) query.set('per_page', String(params.per_page))
  if (params?.page) query.set('page', String(params.page))
  if (params?.search) query.set('search', params.search)

  const res = await fetch(`${WP_URL}/posts?${query.toString()}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  return res.json()
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(`${WP_URL}/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const posts: WPPost[] = await res.json()
  return posts[0] ?? null
}

export async function getCategories(): Promise<WPCategory[]> {
  const res = await fetch(`${WP_URL}/categories?per_page=100`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  return res.json()
}
