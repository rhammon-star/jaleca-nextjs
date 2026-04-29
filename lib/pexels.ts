const PEXELS_API_URL = 'https://api.pexels.com/v1'

type PexelsPhoto = {
  id: number
  photographer: string
  photographer_url: string
  alt: string
  src: {
    landscape: string
    large: string
    medium: string
  }
}

type PexelsSearchResponse = {
  photos: PexelsPhoto[]
  total_results: number
}

const FALLBACK_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?w=1200&q=80',
    authorName: 'Pexels',
    authorLink: 'https://www.pexels.com',
    caption: 'Profissional de saúde com jaleco branco',
  },
  {
    url: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?w=1200&q=80',
    authorName: 'Pexels',
    authorLink: 'https://www.pexels.com',
    caption: 'Equipe médica em ambiente clínico',
  },
  {
    url: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?w=1200&q=80',
    authorName: 'Pexels',
    authorLink: 'https://www.pexels.com',
    caption: 'Profissional de enfermagem em uniforme',
  },
]

export async function searchImage(
  query: string,
  caption?: string
): Promise<{ url: string; authorName: string; authorLink: string; caption: string } | null> {
  const apiKey = process.env.PEXELS_API_KEY

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        query,
        per_page: '10',
        orientation: 'landscape',
        size: 'large',
      })
      const res = await fetch(`${PEXELS_API_URL}/search?${params.toString()}`, {
        headers: { Authorization: apiKey },
      })
      if (res.ok) {
        const data: PexelsSearchResponse = await res.json()
        if (data.photos?.length) {
          const photo = data.photos[Math.floor(Math.random() * Math.min(data.photos.length, 5))]
          return {
            url: photo.src.landscape || photo.src.large,
            authorName: photo.photographer,
            authorLink: photo.photographer_url,
            caption: caption || photo.alt || query,
          }
        }
      }
    } catch { /* fall through to fallback */ }
  }

  const idx = Math.floor(Math.random() * FALLBACK_IMAGES.length)
  return { ...FALLBACK_IMAGES[idx], caption: caption || FALLBACK_IMAGES[idx].caption }
}

export async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
