import type { MetadataRoute } from 'next'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import { getPosts } from '@/lib/wordpress'
import type { WPPost } from '@/lib/wordpress'

type ProductNode = {
  slug: string
  modified?: string
}

type ProductsResponse = {
  products: {
    nodes: ProductNode[]
  }
}

const SITE_URL = 'https://jaleca.com.br'

async function getAllProductSlugs(): Promise<ProductNode[]> {
  try {
    const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS, { first: 100 })
    return data.products.nodes
  } catch {
    return []
  }
}

async function getAllPosts(): Promise<WPPost[]> {
  try {
    const posts = await getPosts({ per_page: 100 })
    return posts
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.allSettled([
    getAllProductSlugs(),
    getAllPosts(),
  ])

  const productNodes = products.status === 'fulfilled' ? products.value : []
  const postNodes = posts.status === 'fulfilled' ? posts.value : []

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lookbook`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/nossas-lojas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/medidas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/trocas-e-devolucoes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const productPages: MetadataRoute.Sitemap = productNodes.map(product => ({
    url: `${SITE_URL}/produto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const postPages: MetadataRoute.Sitemap = postNodes.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const categorySlugs = [
    'jalecos', 'jalecos-femininos', 'jalecos-masculinos',
    'domas', 'domas-femininas', 'domas-masculinas',
    'conjuntos', 'conjuntos-femininos', 'conjuntos-masculinos',
    'acessorios',
  ]

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map(slug => ({
    url: `${SITE_URL}/categoria/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const cidadeSlugs = [
    'jaleco-belo-horizonte', 'jaleco-campo-grande', 'jaleco-vitoria',
    'jaleco-barra-da-tijuca', 'jaleco-muriae', 'jaleco-marilia',
    'jaleco-itabira', 'jaleco-joao-monlevade', 'jaleco-lagoa-santa',
    'jaleco-teixeira-de-freitas', 'jaleco-curitiba', 'jaleco-londrina',
    'jaleco-governador-valadares', 'jaleco-uberaba', 'jaleco-montes-claros',
    'jaleco-vila-velha', 'jaleco-cachoeiro-de-itapemirim', 'jaleco-serra',
    'jaleco-vitoria-da-conquista', 'jaleco-colatina',
    'jaleco-caratinga', 'jaleco-contagem', 'jaleco-sao-paulo',
    'jaleco-rio-de-janeiro', 'jaleco-campinas',
  ]

  const cidadePages: MetadataRoute.Sitemap = cidadeSlugs.map(slug => ({
    url: `${SITE_URL}/cidade/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...cidadePages, ...productPages, ...postPages]
}
