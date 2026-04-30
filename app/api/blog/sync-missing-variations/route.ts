import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { upsertSeo, setSnapshot, getSeoByVariationId } from '@/lib/variation-state'
import { registerColorSlug } from '@/lib/kv-colors'
import { revalidateTag } from 'next/cache'
import { graphqlClient } from '@/lib/graphql'

export const runtime = 'nodejs'
export const maxDuration = 300

// Fetches all variable products with their variations, colors and images
const GET_PRODUCTS_WITH_VARIATIONS = `
  query {
    products(first: 100) {
      nodes {
        slug
        name
        productCategories { nodes { name slug } }
        ... on VariableProduct {
          variations(first: 100) {
            nodes {
              databaseId
              status
              stockStatus
              image { sourceUrl }
              attributes { nodes { name value } }
            }
          }
        }
      }
    }
  }
`

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  await requireAdmin()

  type GqlVariation = { databaseId: number; status: string; stockStatus: string; image?: { sourceUrl: string }; attributes: { nodes: Array<{ name: string; value: string }> } }
  type GqlProduct = { slug: string; name: string; productCategories: { nodes: Array<{ name: string; slug: string }> }; variations?: { nodes: GqlVariation[] } }

  const data = await graphqlClient.request<{ products: { nodes: GqlProduct[] } }>(GET_PRODUCTS_WITH_VARIATIONS)

  // Collect existing KV variationIds
  const existingVariationIds = new Set<number>()
  const existingColorUrls = new Set<string>()
  for await (const key of kv.scanIterator({ match: 'seo:produto/*', count: 200 })) {
    const e = await kv.get<SeoEntry>(key)
    if (!e) continue
    if (e.variationId > 0) existingVariationIds.add(e.variationId)
    // Track existing product+color combos to avoid duplicate URLs
    existingColorUrls.add(`${e.productSlug}::${slugify(e.colorName)}`)
  }

  const created: Array<{ variationId: number; url: string; colorName: string }> = []
  const skipped: Array<{ variationId: number; reason: string }> = []

  for (const product of data.products.nodes) {
    const variations = product.variations?.nodes ?? []
    const category = product.productCategories?.nodes?.[0]?.slug ?? 'geral'

    for (const variation of variations) {
      if (!variation.databaseId) continue
      if (existingVariationIds.has(variation.databaseId)) { skipped.push({ variationId: variation.databaseId, reason: 'already in KV' }); continue }
      if (variation.status !== 'publish') { skipped.push({ variationId: variation.databaseId, reason: `status=${variation.status}` }); continue }

      // Find color attribute
      const colorAttr = variation.attributes.nodes.find(a =>
        /cor|color|pa_cor|pa_color/i.test(a.name)
      )
      if (!colorAttr?.value) { skipped.push({ variationId: variation.databaseId, reason: 'no color attribute' }); continue }

      const colorName = colorAttr.value
      const colorSlug = slugify(colorName)
      const comboKey = `${product.slug}::${colorSlug}`

      // Skip if this product+color combo already has a URL
      if (existingColorUrls.has(comboKey)) { skipped.push({ variationId: variation.databaseId, reason: `color already exists: ${colorName}` }); continue }

      const url = `/produto/${product.slug}-${colorSlug}`
      const cleanName = product.name.replace(/ - Jaleca$/i, '').trim()

      await registerColorSlug(colorSlug)

      const entry: SeoEntry = {
        url,
        productName: cleanName,
        productSlug: product.slug,
        colorName,
        colorSlug,
        variationId: variation.databaseId,
        category,
        imageUrl: variation.image?.sourceUrl,
        title: `${cleanName} ${colorName} | Jaleca`,
        metaDescription: `${cleanName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
        seoQuality: 'template',
        stockStatus: variation.stockStatus === 'IN_STOCK' ? 'instock' : 'outofstock',
        noindex: variation.stockStatus !== 'IN_STOCK',
        lastSyncedAt: new Date().toISOString(),
        geminiAttempts: 0,
      }

      await upsertSeo(entry)
      await setSnapshot(variation.databaseId, {
        stockStatus: entry.stockStatus,
        status: 'publish',
        price: '',
        sku: '',
        updatedAt: new Date().toISOString(),
      })

      existingVariationIds.add(variation.databaseId)
      existingColorUrls.add(comboKey)
      created.push({ variationId: variation.databaseId, url, colorName })
    }
  }

  // Also delete malformed orphan entries (produto-{id}-* pattern)
  let malformedDeleted = 0
  for await (const key of kv.scanIterator({ match: 'seo:produto-*', count: 200 })) {
    await kv.del(key)
    malformedDeleted++
  }

  if (created.length > 0 || malformedDeleted > 0) revalidateTag('products', {})

  return NextResponse.json({
    created: created.length,
    skipped: skipped.length,
    malformedDeleted,
    createdEntries: created,
  })
}
