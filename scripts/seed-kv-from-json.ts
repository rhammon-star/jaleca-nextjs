// scripts/seed-kv-from-json.ts
// Seeds Vercel KV with the curated SEO entries from docs/SEO-PRODUTOS-CORES.json.
// Run: `npx tsx scripts/seed-kv-from-json.ts`
import { readFile } from 'fs/promises'
import { join } from 'path'
import { kv, seoKey, type SeoEntry } from '../lib/kv'

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type Raw = Partial<SeoEntry> & {
  url: string
  productName: string
  colorName: string
  category?: string
  variationId?: number
}

async function main() {
  const path = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const raw = JSON.parse(await readFile(path, 'utf-8')) as Raw[]

  let count = 0
  let skipped = 0

  for (const entry of raw) {
    if (!entry.url || !entry.colorName || !entry.productName) {
      console.warn('Skip (missing fields):', entry.url ?? '(no url)')
      skipped++
      continue
    }

    // URL is like "/produto/max-colete-jaleca-areia" — slug is everything after the leading "/"
    const slug = entry.url.replace(/^\//, '')
    const colorSlug = slugify(entry.colorName)

    // Best-effort productSlug derivation: drop the trailing "-{colorSlug}" or color name.
    // Phase 4 enriches this with the real WC parent slug.
    const productSlugGuess = slug
      .replace(new RegExp(`-?${colorSlug}$`), '')
      .replace(/^produto\//, '')

    const full: SeoEntry = {
      url: entry.url,
      productName: entry.productName,
      productSlug: entry.productSlug ?? productSlugGuess,
      colorName: entry.colorName,
      colorSlug,
      variationId: entry.variationId ?? 0, // 0 = pendente lookup (Task 10)
      category: entry.category ?? 'geral',
      h1: entry.h1,
      h2: entry.h2,
      title: entry.title,
      metaDescription: entry.metaDescription,
      colorPsychology: entry.colorPsychology,
      seoQuality: 'premium',
      stockStatus: 'instock',
      noindex: false,
      lastSyncedAt: new Date().toISOString(),
      geminiAttempts: 0,
    }

    await kv.set(seoKey(slug), full)
    if (full.variationId) {
      await kv.set(`variationToSlug:${full.variationId}`, slug)
    }
    count++
  }

  console.log(`Seeded ${count} entries (${skipped} skipped)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
