import { unstable_cache } from 'next/cache'
import { graphqlClient } from '@/lib/graphql'
import ProductCard, { type WooProduct } from '@/components/ProductCard'
import Link from 'next/link'

const GET_ALL_JALECOS = `
  query GetAllJalecos($first: Int) {
    products(where: { category: "jalecos", status: "publish" }, first: $first) {
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

const fetchAllJalecos = unstable_cache(
  async (): Promise<WooProduct[]> => {
    try {
      const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
        GET_ALL_JALECOS,
        { first: 30 }
      )
      return data.products.nodes
    } catch {
      return []
    }
  },
  ['loja-jalecos'],
  { revalidate: 3600, tags: ['products'] }
)

type Props = {
  collectionLabel?: string
  productLabel?: string
  allHref?: string
}

export default async function LojaProductGrid({
  collectionLabel = 'Nossos jalecos',
  productLabel = 'para profissionais',
  allHref = '/produtos',
}: Props) {
  const produtos = await fetchAllJalecos()

  if (produtos.length === 0) return null

  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            {collectionLabel && (
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
                {collectionLabel}
              </div>
            )}
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}