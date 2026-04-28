import { kv, seoKey, type SeoEntry } from './kv'
import { getAllSeoSlugs } from './variation-seo'

export async function listAllVariations(): Promise<SeoEntry[]> {
  const slugs = await getAllSeoSlugs()
  const entries = await Promise.all(slugs.map((s) => kv.get<SeoEntry>(seoKey(s))))
  return entries
    .filter((e): e is SeoEntry => !!e)
    .sort(
      (a, b) =>
        a.productName.localeCompare(b.productName) || a.colorName.localeCompare(b.colorName),
    )
}

export type VariacoesStats = {
  total: number
  byQuality: { template: number; gemini: number; premium: number }
  outOfStock: number
  outOfStockOver30d: number
  templatePending: number
}

export async function getVariacoesStats(): Promise<VariacoesStats> {
  const all = await listAllVariations()
  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 3600 * 1000
  return {
    total: all.length,
    byQuality: {
      template: all.filter((e) => e.seoQuality === 'template').length,
      gemini: all.filter((e) => e.seoQuality === 'gemini').length,
      premium: all.filter((e) => e.seoQuality === 'premium').length,
    },
    outOfStock: all.filter((e) => e.stockStatus === 'outofstock').length,
    outOfStockOver30d: all.filter(
      (e) =>
        e.stockStatus === 'outofstock' &&
        now - new Date(e.lastSyncedAt).getTime() > THIRTY_DAYS,
    ).length,
    templatePending: all.filter((e) => e.seoQuality === 'template').length,
  }
}
