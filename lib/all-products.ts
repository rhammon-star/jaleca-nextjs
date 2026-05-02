import { unstable_cache } from 'next/cache'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { graphqlClient, GET_PRODUCTS_LISTING } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import { BEST_SELLER_SLUGS } from '@/lib/best-sellers'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'

type ProductsPage = { products: { pageInfo: { hasNextPage: boolean; endCursor: string }; nodes: WooProduct[] } }

const fetchAllProducts = async (): Promise<WooProduct[]> => {
  const all: WooProduct[] = []
  let cursor: string | null = null
  try {
    do {
      const data: ProductsPage = await graphqlClient.request<ProductsPage>(GET_PRODUCTS_LISTING, { first: 24, after: cursor })
      all.push(...data.products.nodes)
      cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
    } while (cursor)
  } catch (e) {
    console.error('[getAllProducts] GraphQL error:', e)
    if (all.length === 0) throw new Error('WooCommerce GraphQL retornou 0 produtos')
  }
  if (all.length === 0) throw new Error('Nenhum produto encontrado no WooCommerce')
  return all
}

const getAllProductsCached = unstable_cache(fetchAllProducts, ['all-products'], { revalidate: 3600, tags: ['products'] })

async function getColorVariants(mainProducts: WooProduct[]): Promise<{ variants: WooProduct[]; productsWithColorPages: Set<string>; parentsWithGeneratedVariants: Set<string> }> {
  const productsWithColorPages = new Set<string>()
  const parentsWithGeneratedVariants = new Set<string>()
  try {
    const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const colorPages: Array<{ url: string; productName: string; colorName: string; title: string; metaDescription: string; category: string }> = JSON.parse(jsonContent)

    const productMap = new Map<string, WooProduct>()
    mainProducts.forEach(p => {
      // Remove "– Jaleca" ou "- Jaleca" do final (em dash U+2013 ou hífen comum)
      const cleanName = p.name.replace(/\s*[\u2013\-]\s*Jaleca\s*$/i, '').trim()
      productMap.set(cleanName, p)
      productMap.set(p.name, p) // também indexa pelo nome completo
    })

    colorPages.forEach(page => {
      const cleanName = page.productName.replace(/ - Jaleca$/i, '').trim()
      productsWithColorPages.add(cleanName)
    })

    const variants: WooProduct[] = []
    colorPages.forEach((page, idx) => {
      const parentProduct = productMap.get(page.productName)

      // Best-sellers sempre aparecem como produto pai (não duplicar com variantes de cor)
      if (parentProduct && BEST_SELLER_SLUGS.includes(parentProduct.slug)) {
        return
      }

      let variantImage = parentProduct?.image
      let variantPrice = parentProduct?.price || ''
      let variantRegularPrice = parentProduct?.regularPrice || ''
      let variantSalePrice = parentProduct?.salePrice || null

      // Filtra entradas órfãs: se há produto pai com variações, exige match
      if (parentProduct?.variations?.nodes && parentProduct.variations.nodes.length > 0) {
        const toSlug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_]+/g, '-')
        const colorSlug = toSlug(page.colorName)
        const matches = (vSlug: string) =>
          vSlug === colorSlug ||
          vSlug.startsWith(colorSlug + '-') ||
          colorSlug.startsWith(vSlug + '-')

        let variant = parentProduct.variations.nodes.find(v => {
          const vColor = v.attributes?.nodes?.find(a => /cor|color/i.test(a.name))
          if (!vColor || !v.image?.sourceUrl) return false
          return matches(toSlug(vColor.value))
        })
        if (!variant) {
          variant = parentProduct.variations.nodes.find(v => {
            const vColor = v.attributes?.nodes?.find(a => /cor|color/i.test(a.name))
            if (!vColor) return false
            return matches(toSlug(vColor.value))
          })
        }
        if (!variant) {
          // Cor do JSON não existe no WC — pula esta entrada (link quebrado / foto errada)
          return
        }
        variantImage = variant.image || variantImage
        variantPrice = variant.price || variantPrice
        variantRegularPrice = variant.regularPrice || variantRegularPrice
        variantSalePrice = variant.salePrice || variantSalePrice
      }

      if (parentProduct) parentsWithGeneratedVariants.add(parentProduct.slug)

      const realCategories = parentProduct?.productCategories?.nodes ?? [
        { name: page.category, slug: page.category }
      ]

      // Display name limpo: "Jaleco Slim Tradicional Feminino - Pink" (sem "2", "3", etc.)
      const displayName = `${page.productName} - ${page.colorName}`

      variants.push({
        id: `color-variant-${idx}`,
        databaseId: 90000 + idx,
        name: displayName,
        slug: page.url.replace('/produto/', ''),
        featured: parentProduct?.featured ?? false,
        price: variantPrice,
        regularPrice: variantRegularPrice,
        salePrice: variantSalePrice,
        image: variantImage || { sourceUrl: '', altText: displayName },
        productCategories: { nodes: realCategories },
        attributes: {
          nodes: [
            {
              name: 'pa_cor',
              options: [page.colorName.toLowerCase()]
            }
          ]
        },
        variations: { nodes: [] }
      } as WooProduct)
    })

    return { variants, productsWithColorPages, parentsWithGeneratedVariants }
  } catch (e) {
    console.error('[getColorVariants] Error loading color variants:', e)
    return { variants: [], productsWithColorPages, parentsWithGeneratedVariants }
  }
}

async function filterOutOfStockVariants(variants: WooProduct[]): Promise<WooProduct[]> {
  // Verifica em batches de 10 para não sobrecarregar conexões KV
  const BATCH = 10
  const results: WooProduct[] = []
  for (let i = 0; i < variants.length; i += BATCH) {
    const batch = variants.slice(i, i + BATCH)
    const entries = await Promise.all(
      batch.map(v => kv.get<SeoEntry>(seoKey(`produto/${v.slug}`)).catch(() => null))
    )
    batch.forEach((v, j) => {
      if (entries[j]?.stockStatus !== 'outofstock') results.push(v)
    })
  }
  return results
}

const getKVVariantsCached = unstable_cache(
  async (mainProducts: WooProduct[], jsonSlugs: Set<string>) => _getKVVariants(mainProducts, jsonSlugs),
  ['kv-variants'],
  { revalidate: 3600, tags: ['products'] },
)

async function _getKVVariants(
  mainProducts: WooProduct[],
  jsonSlugs: Set<string>,
): Promise<WooProduct[]> {
  try {
    // Indexa produtos pai por slug para lookup rápido
    const productBySlug = new Map<string, WooProduct>()
    mainProducts.forEach(p => productBySlug.set(p.slug, p))

    // Varre todas as entradas SEO do KV
    const variants: WooProduct[] = []
    let idx = 0
    for await (const key of kv.scanIterator({ match: 'seo:produto/*', count: 100 })) {
        const entry = await kv.get<SeoEntry>(key)
        if (!entry) continue
        if (entry.stockStatus === 'outofstock' || entry.noindex) continue

        const slug = entry.url.replace('/produto/', '')

        // Pula se já está coberto pelo JSON estático
        if (jsonSlugs.has(slug)) continue

        const parent = productBySlug.get(entry.productSlug)

        // Tenta achar a variação específica pelo variationId (databaseId)
        let variantImage = parent?.image
        let variantPrice = parent?.price || ''
        let variantRegularPrice = parent?.regularPrice || ''
        let variantSalePrice = parent?.salePrice || null

        if (parent?.variations?.nodes && entry.variationId) {
          const variation = parent.variations.nodes.find(
            (v: any) => v.databaseId === entry.variationId
          )
          if (variation) {
            variantImage = variation.image || variantImage
            variantPrice = variation.price || variantPrice
            variantRegularPrice = variation.regularPrice || variantRegularPrice
            variantSalePrice = variation.salePrice || variantSalePrice
          }
        }

        // Se temos imageUrl no KV e a variação não tem imagem própria (ou é a mesma do pai), usa a do KV
        const variantSameAsParent = variantImage?.sourceUrl === parent?.image?.sourceUrl
        if (entry.imageUrl && (!variantImage || variantSameAsParent)) {
          variantImage = { sourceUrl: entry.imageUrl, altText: `${entry.productName} ${entry.colorName}` }
        }

        const categories = parent?.productCategories?.nodes ?? [
          { name: entry.category, slug: entry.category }
        ]

        variants.push({
          id: `kv-variant-${idx}`,
          databaseId: 95000 + idx,
          name: `${entry.productName} - ${entry.colorName}`,
          slug,
          featured: parent?.featured ?? false,
          price: variantPrice,
          regularPrice: variantRegularPrice,
          salePrice: variantSalePrice,
          image: variantImage || { sourceUrl: '', altText: entry.productName },
          productCategories: { nodes: categories },
          attributes: {
            nodes: [{ name: 'pa_cor', options: [entry.colorName.toLowerCase()] }]
          },
          variations: { nodes: [] },
        } as WooProduct)

        idx++
    }

    return variants
  } catch (e) {
    console.error('[getKVVariants] error:', e)
    return []
  }
}

async function _buildAllProducts(): Promise<WooProduct[]> {
  const mainProducts = await fetchAllProducts()
  const { variants: colorVariants, productsWithColorPages, parentsWithGeneratedVariants } = await getColorVariants(mainProducts)

  const mainProductsWithoutColorPages = mainProducts.filter(p => {
    if (BEST_SELLER_SLUGS.includes(p.slug)) return true
    const cleanName = p.name.replace(/\s*[\u2013\-]\s*Jaleca\s*$/i, '').trim()
    if (!productsWithColorPages.has(cleanName)) return true
    // Fallback: pai está no JSON mas nenhuma variante foi gerada (cores não bateram com WC)
    return !parentsWithGeneratedVariants.has(p.slug)
  })

  const jsonSlugs = new Set(colorVariants.map(v => v.slug))
  const kvVariants = await getKVVariantsCached(mainProducts, jsonSlugs)
  const inStockVariants = await filterOutOfStockVariants(colorVariants)

  console.log(`[getAllProducts] ${mainProducts.length} WC, ${productsWithColorPages.size} JSON cores, ${kvVariants.length} KV novas → ${inStockVariants.length} JSON instock + ${kvVariants.length} KV + ${mainProductsWithoutColorPages.length} pai`)

  return [...inStockVariants, ...kvVariants, ...mainProductsWithoutColorPages]
}

const getAllProductsFinal = unstable_cache(_buildAllProducts, ['all-products-final'], {
  revalidate: 3600,
  tags: ['products'],
})

export async function getAllProducts(): Promise<WooProduct[]> {
  try {
    return await getAllProductsFinal()
  } catch (e) {
    console.warn('[getAllProducts] Cache miss/error, tentando fetch direto...', e)
    try {
      const mainProducts = await fetchAllProducts()
      const { variants: colorVariants } = await getColorVariants(mainProducts)
      return [...colorVariants, ...mainProducts]
    } catch (e2) {
      console.error('[getAllProducts] Fetch direto também falhou:', e2)
      return []
    }
  }
}
