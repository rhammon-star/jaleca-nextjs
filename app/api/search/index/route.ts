import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/all-products'
import { BEST_SELLER_SLUGS } from '@/lib/best-sellers'

export const revalidate = 86400

export type SearchIndexEntry = {
  id: string
  name: string
  href: string
  price?: string
  image?: { sourceUrl: string; altText: string }
}

export async function GET() {
  const products = await getAllProducts()

  const bestRank = new Map<string, number>()
  BEST_SELLER_SLUGS.forEach((slug, i) => bestRank.set(slug, i))

  const entries: SearchIndexEntry[] = products.map(p => ({
    id: String(p.id),
    name: p.name.replace(/ - Jaleca$/i, ''),
    href: `/produto/${p.slug}`,
    price: p.price || undefined,
    image: p.image?.sourceUrl ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText || p.name } : undefined,
  }))

  entries.sort((a, b) => {
    const slugA = a.href.replace('/produto/', '')
    const slugB = b.href.replace('/produto/', '')
    const ra = bestRank.has(slugA) ? bestRank.get(slugA)! : 999
    const rb = bestRank.has(slugB) ? bestRank.get(slugB)! : 999
    return ra - rb
  })

  return NextResponse.json(
    { entries, generatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
  )
}
