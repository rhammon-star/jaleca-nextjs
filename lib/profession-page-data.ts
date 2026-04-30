import { unstable_cache } from 'next/cache'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import { getPosts, type WPPost } from '@/lib/wordpress'

export const getCachedHeroImage = unstable_cache(
  async (productSlug: string): Promise<{ src: string; alt: string } | null> => {
    if (!productSlug) return null
    try {
      const data = await graphqlClient.request<{
        product: { name: string; image: { sourceUrl: string; altText: string } } | null
      }>(GET_PRODUCT_BY_SLUG, { slug: productSlug })
      if (data?.product?.image?.sourceUrl) {
        return {
          src: data.product.image.sourceUrl,
          alt: data.product.image.altText || data.product.name,
        }
      }
      return null
    } catch {
      return null
    }
  },
  ['profession-hero-image'],
  { revalidate: 3600 },
)

export const getCachedBlogPosts = unstable_cache(
  async (search: string): Promise<WPPost[]> => {
    try {
      const posts = await getPosts({ per_page: 3, search })
      return posts.slice(0, 3)
    } catch {
      return []
    }
  },
  ['profession-blog-posts'],
  { revalidate: 3600 },
)
