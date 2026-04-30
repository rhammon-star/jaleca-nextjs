import { NextRequest, NextResponse } from 'next/server'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { fetchVariation, fetchParentProduct } from '@/lib/wc-variation'
import { upsertSeo, setSnapshot } from '@/lib/variation-state'
import { registerColorSlug } from '@/lib/kv-colors'
import { revalidateTag } from 'next/cache'
import { graphqlClient } from '@/lib/graphql'

export const runtime = 'nodejs'
export const maxDuration = 300

const GET_ALL_VARIATION_IDS = `
  query {
    products(first: 100) {
      nodes {
        ... on VariableProduct {
          variations(first: 100) {
            nodes { databaseId }
          }
        }
      }
    }
  }
`

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const data = await graphqlClient.request<{
    products: { nodes: Array<{ variations?: { nodes: Array<{ databaseId: number }> } }> }
  }>(GET_ALL_VARIATION_IDS)

  const allIds: number[] = []
  for (const p of data.products.nodes) {
    for (const v of p.variations?.nodes ?? []) {
      if (v.databaseId) allIds.push(v.databaseId)
    }
  }

  const existingIds = new Set<number>()
  for await (const key of kv.scanIterator({ match: 'seo:produto/*', count: 200 })) {
    const e = await kv.get<SeoEntry>(key)
    if (e?.variationId && e.variationId > 0) existingIds.add(e.variationId)
  }

  const missing = allIds.filter(id => !existingIds.has(id))
  const created: number[] = []

  for (const variationId of missing) {
    try {
      const live = await fetchVariation(variationId)
      if (!live || live.snapshot.status !== 'publish') continue

      const parent = await fetchParentProduct(live.parentId)
      const productName = parent?.name ?? `Produto ${live.parentId}`
      const productSlug = parent?.slug ?? `produto-${live.parentId}`
      const category = parent?.categories?.[0] ?? 'geral'
      const colorName = live.attributes['Cor'] ?? live.attributes['cor'] ?? live.attributes['pa_color'] ?? 'Padrão'
      const colorSlug = slugify(colorName)
      const url = `/produto/${productSlug}-${colorSlug}`

      const existing = await kv.get<SeoEntry>(seoKey(url.replace('/produto/', '')))
      if (existing) continue

      await registerColorSlug(colorSlug)

      const entry: SeoEntry = {
        url, productName, productSlug, colorName, colorSlug, variationId, category,
        imageUrl: live.imageUrl,
        title: `${productName} ${colorName} | Jaleca`,
        metaDescription: `${productName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
        seoQuality: 'template',
        stockStatus: live.snapshot.stockStatus,
        noindex: live.snapshot.stockStatus === 'outofstock',
        lastSyncedAt: new Date().toISOString(),
        geminiAttempts: 0,
      }

      await upsertSeo(entry)
      await setSnapshot(variationId, live.snapshot)
      created.push(variationId)
    } catch {
      // silently skip
    }
  }

  if (created.length > 0) revalidateTag('products', {})

  return NextResponse.json({ totalWc: allIds.length, missing: missing.length, created: created.length })
}
