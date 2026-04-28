// scripts/link-variation-ids.ts
// Resolve variationId for each seo:* entry by querying WooCommerce GraphQL
// and matches by (productSlug, colorSlug). Run: `npx tsx scripts/link-variation-ids.ts`
import { GraphQLClient } from 'graphql-request'
import { kv, seoKey, type SeoEntry } from '../lib/kv'

const endpoint = process.env.NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL
if (!endpoint) {
  console.error('NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL não definido')
  process.exit(1)
}
const client = new GraphQLClient(endpoint)

const QUERY = `
  query AllVariations($first: Int, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        slug
        ... on VariableProduct {
          variations(first: 100) {
            nodes {
              databaseId
              attributes { nodes { name value } }
            }
          }
        }
      }
    }
  }
`

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type VariationNode = {
  databaseId: number
  attributes: { nodes: { name: string; value: string }[] }
}
type ProductNode = {
  slug: string
  variations?: { nodes: VariationNode[] }
}

async function buildIndex(): Promise<Map<string, number>> {
  const index = new Map<string, number>()
  let after: string | null = null

  while (true) {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: ProductNode[] } } =
      await client.request(QUERY, { first: 50, after })

    for (const p of data.products.nodes) {
      if (!p.variations) continue
      for (const v of p.variations.nodes) {
        const colorAttr = v.attributes.nodes.find((a) =>
          /(cor|color|pa_cor)/i.test(a.name)
        )
        if (!colorAttr) continue
        const key = `${p.slug}::${slugify(colorAttr.value)}`
        index.set(key, v.databaseId)
      }
    }

    if (!data.products.pageInfo.hasNextPage) break
    after = data.products.pageInfo.endCursor
  }

  return index
}

async function main() {
  console.log('Construindo índice de variações via GraphQL...')
  const index = await buildIndex()
  console.log(`Índice: ${index.size} variações`)

  let updated = 0
  let alreadyLinked = 0
  let notFound = 0

  let cursor = 0
  do {
    const [next, batch] = await kv.scan(cursor, { match: 'seo:*', count: 100 })
    cursor = Number(next)

    for (const k of batch as string[]) {
      const entry = (await kv.get(k)) as SeoEntry | null
      if (!entry) continue
      if (entry.variationId && entry.variationId > 0) {
        alreadyLinked++
        continue
      }

      const lookupKey = `${entry.productSlug}::${entry.colorSlug}`
      const variationId = index.get(lookupKey)
      if (!variationId) {
        console.warn(`Sem match: ${k} (lookup=${lookupKey})`)
        notFound++
        continue
      }

      const slug = k.replace(/^seo:/, '')
      const next: SeoEntry = { ...entry, variationId }
      await kv.set(seoKey(slug), next)
      await kv.set(`variationToSlug:${variationId}`, slug)
      updated++
    }
  } while (cursor !== 0)

  console.log(`Atualizadas: ${updated} | Já linkadas: ${alreadyLinked} | Sem match: ${notFound}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
