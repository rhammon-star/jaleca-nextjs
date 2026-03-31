'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { graphqlClient } from '@/lib/graphql'

const LS_KEY = 'jaleca-recently-viewed'

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
          image {
            sourceUrl
            altText
          }
        }
        ... on VariableProduct {
          price
          regularPrice
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`

type RecentProduct = {
  id: string
  databaseId: number
  name: string
  slug: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl: string; altText: string }
}

type Props = {
  excludeSlug?: string
}

export default function RecentlyViewed({ excludeSlug }: Props) {
  const [products, setProducts] = useState<RecentProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
      const slugs = stored.filter(s => s !== excludeSlug).slice(0, 8)
      if (slugs.length === 0) {
        setLoading(false)
        return
      }
      graphqlClient
        .request<{ products: { nodes: RecentProduct[] } }>(GET_PRODUCTS_BY_SLUGS, { slugs })
        .then(data => {
          // Preserve the localStorage order (most recent first)
          const bySlug = new Map(data.products.nodes.map(p => [p.slug, p]))
          const ordered = slugs.map(s => bySlug.get(s)).filter(Boolean) as RecentProduct[]
          setProducts(ordered)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } catch {
      setLoading(false)
    }
  }, [excludeSlug])

  if (loading || products.length === 0) return null

  return (
    <div className="mt-8 md:mt-16">
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">Vistos recentemente</h2>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
        {products.map(product => {
          const displayName = product.name.replace(/ - Jaleca$/i, '')
          return (
            <Link
              key={product.id}
              href={`/produto/${product.slug}`}
              className="flex-shrink-0 w-40 group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary/20 mb-2">
                {product.image?.sourceUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image.sourceUrl}
                    alt={product.image.altText || displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <p className="text-xs font-medium leading-snug line-clamp-2">{displayName}</p>
              {product.price && (
                <p className="text-xs text-muted-foreground mt-0.5">{product.price}</p>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
