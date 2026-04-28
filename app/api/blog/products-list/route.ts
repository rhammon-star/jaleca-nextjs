import { NextRequest, NextResponse } from 'next/server'
import { kv, type SeoEntry } from '@/lib/kv'
import { getAllSeoSlugs } from '@/lib/variation-seo'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase() ?? ''

  const slugs = await getAllSeoSlugs()
  const entries = await Promise.all(
    slugs.map(async (s) => {
      const e = await kv.get<SeoEntry>(`seo:${s}`)
      if (!e) return null
      return { slug: s.replace(/^produto\//, ''), name: `${e.productName} — ${e.colorName}` }
    }),
  )

  const results = entries
    .filter((e): e is { slug: string; name: string } => !!e)
    .filter((e) => !q || e.name.toLowerCase().includes(q) || e.slug.includes(q))
    .slice(0, 20)

  return NextResponse.json(results)
}
