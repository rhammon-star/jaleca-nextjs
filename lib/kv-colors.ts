import { kv } from '@/lib/kv'

const COLOR_SLUGS_KEY = 'color-slugs'

let cachedSlugs: Set<string> | null = null
let cacheExpiry = 0
const CACHE_TTL_OK = 30 * 60 * 1000 // 30 min em sucesso
const CACHE_TTL_FAIL = 60 * 1000 // 1 min em falha (retry rápido)

export async function getKnownColorSlugs(): Promise<Set<string>> {
  if (cachedSlugs && Date.now() < cacheExpiry) return cachedSlugs
  try {
    const slugs = (await kv.smembers(COLOR_SLUGS_KEY)) as string[]
    cachedSlugs = new Set(slugs)
    cacheExpiry = Date.now() + CACHE_TTL_OK
    return cachedSlugs
  } catch (err) {
    console.error('[kv-colors] smembers failed, returning empty set:', err)
    const fallback = cachedSlugs ?? new Set<string>()
    cacheExpiry = Date.now() + CACHE_TTL_FAIL
    return fallback
  }
}

export async function registerColorSlug(colorSlug: string): Promise<void> {
  try {
    await kv.sadd(COLOR_SLUGS_KEY, colorSlug)
    cachedSlugs = null
  } catch (err) {
    console.error('[kv-colors] sadd failed:', err)
  }
}
