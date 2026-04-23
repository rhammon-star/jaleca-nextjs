import { unstable_cache } from 'next/cache'
import { graphqlClient } from '@/lib/graphql'
import { getPretoProductSlugs } from '@/lib/product-professions'
import ProductCard, { type WooProduct } from '@/components/ProductCard'
import Link from 'next/link'

const GET_PRODUCTS_BY_SLUGS = `
  query GetProductsBySlugsPreto($slugs: [String]) {
    products(where: { slugIn: $slugs }, first: 30) {
      nodes {
        id
        databaseId
        name
        slug
        productCategories { nodes { name slug } }
        ... on SimpleProduct {
          price regularPrice salePrice stockStatus
          image { sourceUrl altText }
          attributes { nodes { name options } }
        }
        ... on VariableProduct {
          price regularPrice salePrice
          image { sourceUrl altText }
          attributes { nodes { name options } }
          variations(first: 100) {
            nodes {
              id databaseId name stockStatus price regularPrice salePrice
              image { sourceUrl altText }
              attributes { nodes { name value } }
            }
          }
        }
      }
    }
  }
`

const fetchPretoProducts = unstable_cache(
  async (): Promise<WooProduct[]> => {
    const slugs = getPretoProductSlugs()
    if (slugs.length === 0) return []
    try {
      const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
        GET_PRODUCTS_BY_SLUGS,
        { slugs }
      )
      // preserve order from our mapping
      const ordered = slugs
        .map(s => data.products.nodes.find(p => p.slug === s))
        .filter(Boolean) as WooProduct[]
      return ordered
    } catch {
      return []
    }
  },
  ['preto-products'],
  { revalidate: 3600, tags: ['products'] }
)

type Props = {
  productLabel?: string
  allHref?: string
}

export default async function PretoProductGrid({
  productLabel = 'Jalecos pretos',
  allHref = '/produtos?cor=preto',
}: Props) {
  const produtos = await fetchPretoProducts()

  if (produtos.length === 0) return null

  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Cor preta
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              {productLabel}
            </h2>
          </div>
          <Link
            href={allHref}
            style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a', whiteSpace: 'nowrap' }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produtos.map(product => (
            <ProductCard key={product.id} product={product} colorFilter="Preto" />
          ))}
        </div>

      </div>
    </section>
  )
}