import { kv } from '@/lib/kv'

const COLOR_SLUGS_KEY = 'color-slugs'

let cachedSlugs: Set<string> | null = null
let cacheExpiry = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export async function getKnownColorSlugs(): Promise<Set<string>> {
  if (cachedSlugs && Date.now() < cacheExpiry) return cachedSlugs
  const slugs = (await kv.smembers(COLOR_SLUGS_KEY)) as string[]
  cachedSlugs = new Set(slugs)
  cacheExpiry = Date.now() + CACHE_TTL
  return cachedSlugs
}

export async function registerColorSlug(colorSlug: string): Promise<void> {
  await kv.sadd(COLOR_SLUGS_KEY, colorSlug)
  // Invalida cache local
  cachedSlugs = null
}
