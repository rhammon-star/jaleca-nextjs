import { cache } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { kv, seoKey, type SeoEntry } from './kv'

export const getVariationSEO = cache(async (slug: string): Promise<SeoEntry | null> => {
  const fromKv = await kv.get<SeoEntry>(seoKey(slug))
  if (fromKv) return fromKv

  try {
    const path = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const entries = JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>[]
    const match = entries.find((e) => (e.url as string)?.replace(/^\//, '') === slug)
    if (!match) return null
    return {
      ...match,
      seoQuality: 'premium',
      stockStatus: 'instock',
      noindex: false,
      lastSyncedAt: new Date().toISOString(),
      geminiAttempts: 0,
    } as SeoEntry
  } catch {
    return null
  }
})

export const getAllSeoSlugs = cache(async (): Promise<string[]> => {
  const slugs: string[] = []
  let cursor: string | number = '0'
  do {
    const scanResult: [string | number, string[]] = await kv.scan(cursor, { match: 'seo:*', count: 200 }) as [string | number, string[]]
    cursor = scanResult[0].toString()
    const keys = scanResult[1]
    for (const k of keys as string[]) slugs.push(k.replace(/^seo:/, ''))
  } while (cursor !== '0')
  return slugs
})

export async function getInStockSiblings(
  productSlug: string,
  excludeVariationId: number,
): Promise<Array<{ url: string; colorName: string; image?: string }>> {
  const slugs = await getAllSeoSlugs()
  const results: Array<{ url: string; colorName: string; image?: string }> = []
  for (const slug of slugs) {
    const e = await kv.get<SeoEntry>(seoKey(slug))
    if (!e) continue
    if (e.productSlug !== productSlug) continue
    if (e.variationId === excludeVariationId) continue
    if (e.stockStatus !== 'instock') continue
    results.push({ url: e.url, colorName: e.colorName })
  }
  return results.slice(0, 6)
}
