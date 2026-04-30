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
  searchText?: string
}

export async function GET() {
  const products = await getAllProducts()

  const bestRank = new Map<string, number>()
  BEST_SELLER_SLUGS.forEach((slug, i) => bestRank.set(slug, i))

  const entries: SearchIndexEntry[] = products.map(p => {
    const cleanName = p.name.replace(/ - Jaleca$/i, '')
    const slugWords = p.slug.replace(/-/g, ' ')
    const categories = p.productCategories?.nodes.map(c => c.name).join(' ') ?? ''
    const colors = p.attributes?.nodes
      .filter(a => /cor|color/i.test(a.name))
      .flatMap(a => a.options)
      .join(' ') ?? ''
    const searchText = [cleanName, slugWords, categories, colors]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return {
      id: String(p.id),
      name: cleanName,
      href: `/produto/${p.slug}`,
      price: p.price || undefined,
      image: p.image?.sourceUrl ? { sourceUrl: p.image.sourceUrl, altText: p.image.altText || p.name } : undefined,
      searchText,
    }
  })

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
