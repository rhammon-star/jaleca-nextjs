import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { graphqlClient, SEARCH_PRODUCTS } from '@/lib/graphql'

type WCProduct = {
  id: string
  databaseId: number
  name: string
  slug: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl: string; altText: string }
}

type ColorEntry = {
  url: string
  productName: string
  colorName: string
}

export type SearchResultItem = {
  id: string
  name: string
  href: string
  price?: string
  image?: { sourceUrl: string; altText: string }
  isColorVariant?: boolean
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ results: [] })

  const normQ = normalize(q)

  // 1. WooCommerce parent products
  let wcProducts: WCProduct[] = []
  try {
    const data = await graphqlClient.request<{ products: { nodes: WCProduct[] } }>(
      SEARCH_PRODUCTS,
      { search: q, first: 20 }
    )
    wcProducts = data.products.nodes
  } catch {
    // continue with empty
  }

  // 2. Color variant pages from JSON
  let colorEntries: ColorEntry[] = []
  try {
    const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const raw = await readFile(jsonPath, 'utf-8')
    const all: ColorEntry[] = JSON.parse(raw)
    colorEntries = all.filter(e =>
      normalize(e.productName).includes(normQ) ||
      normalize(e.colorName).includes(normQ) ||
      normalize(`${e.productName} ${e.colorName}`).includes(normQ)
    )
  } catch {
    // continue without color variants
  }

  // Build parent product map for image/price lookup
  const parentMap = new Map<string, WCProduct>()
  wcProducts.forEach(p => {
    const clean = normalize(p.name.replace(/ - Jaleca$/i, '').replace(/ Jaleca$/i, '').trim())
    parentMap.set(clean, p)
  })

  // 3. Build parent results (deduplicated by slug)
  const seen = new Set<string>()
  const results: SearchResultItem[] = []

  for (const p of wcProducts) {
    if (seen.has(p.slug)) continue
    seen.add(p.slug)
    results.push({
      id: p.id,
      name: p.name.replace(/ - Jaleca$/i, ''),
      href: `/produto/${p.slug}`,
      price: p.price,
      image: p.image,
    })
  }

  // 4. Add color variant results (skip if parent already included)
  const colorResults: SearchResultItem[] = []
  const colorSeenHref = new Set<string>()

  for (const e of colorEntries) {
    if (colorSeenHref.has(e.url)) continue
    colorSeenHref.add(e.url)

    const normName = normalize(e.productName)
    const parent = parentMap.get(normName)

    colorResults.push({
      id: `color-${e.url}`,
      name: `${e.productName} — ${e.colorName}`,
      href: e.url,
      price: parent?.price,
      image: parent?.image,
      isColorVariant: true,
    })
  }

  // Merge: parents first, then color variants, cap at 15
  const merged = [...results, ...colorResults].slice(0, 15)

  return NextResponse.json({ results: merged })
}
