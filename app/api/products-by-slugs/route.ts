import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { graphqlClient } from '@/lib/graphql'

const GET_PRODUCTS_BY_SLUGS = `
  query GetProductsBySlugs($slugs: [String]) {
    products(where: { slugIn: $slugs }, first: 8) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          image { sourceUrl altText }
        }
        ... on VariableProduct {
          price
          regularPrice
          image { sourceUrl altText }
        }
      }
    }
  }
`

const fetchProductsBySlugs = unstable_cache(
  async (slugs: string[]) => {
    const data = await graphqlClient.request<{ products: { nodes: unknown[] } }>(
      GET_PRODUCTS_BY_SLUGS,
      { slugs }
    )
    return data.products.nodes
  },
  ['products-by-slugs'],
  { revalidate: 3600, tags: ['products'] }
)

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get('slugs')?.split(',').filter(Boolean) ?? []
  if (slugs.length === 0) return NextResponse.json([])
  try {
    const nodes = await fetchProductsBySlugs(slugs)
    return NextResponse.json(nodes)
  } catch {
    return NextResponse.json([])
  }
}
