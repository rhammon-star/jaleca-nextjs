import type { MetadataRoute } from 'next'
import { graphqlClient } from '@/lib/graphql'

const GET_PRODUCTS_FOR_SITEMAP = `
  query GetProductsForSitemap($first: Int) {
    products(first: $first) {
      nodes {
        slug
        modified
      }
    }
  }
`
import { getPostsWithMeta } from '@/lib/wordpress'
import type { WPPost } from '@/lib/wordpress'
import { readFile } from 'fs/promises'
import { join } from 'path'

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
    const data = await graphqlClient.request<ProductsResponse>(GET_PRODUCTS_FOR_SITEMAP, { first: 100 })
    return data.products.nodes
  } catch {
    return []
  }
}

async function getAllPosts(): Promise<WPPost[]> {
  try {
    const perPage = 100
    const { posts: firstPage, totalPages } = await getPostsWithMeta({ per_page: perPage })
    if (totalPages <= 1) return firstPage
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        getPostsWithMeta({ per_page: perPage, page: i + 2 }).then(r => r.posts)
      )
    )
    return [...firstPage, ...rest.flat()]
  } catch {
    return []
  }
}

type ColorPageData = {
  url: string
}

async function getColorPages(): Promise<ColorPageData[]> {
  try {
    const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const colorPages: ColorPageData[] = JSON.parse(jsonContent)
    return colorPages
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, colorPages] = await Promise.allSettled([
    getAllProductSlugs(),
    getAllPosts(),
    getColorPages(),
  ])

  const productNodes = products.status === 'fulfilled' ? products.value : []
  const postNodes = posts.status === 'fulfilled' ? posts.value : []
  const colorPagesData = colorPages.status === 'fulfilled' ? colorPages.value : []

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/produtos`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/como-escolher-jaleco-feminino-guia-completo`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/guia-jaleco-dentista-modelos-cores-como-escolher`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/comprar-jaleco-online-e-seguro`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lookbook`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/nossas-lojas`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/medidas`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/trocas-e-devolucoes`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: new Date('2025-03-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // SEO Keyword Clusters — PRD SEO Jaleca (21/04/2026)
    { url: `${SITE_URL}/melhor-marca-jaleco`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/jaleco-premium`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-feminino`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-estiloso`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.85 },
    // Topical Authority Hubs — Pillar pages clusters
    { url: `${SITE_URL}/uniformes-beleza`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-gastronomia`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-servicos`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-escritorio`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    // Pillar page saúde
    {
      url: `${SITE_URL}/uniformes-profissionais-saude`,
      lastModified: new Date('2025-04-01'),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/jaleco-dentista`,
      lastModified: new Date('2025-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Cluster Saúde — Masculino
    { url: `${SITE_URL}/jaleco-medico`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-enfermeiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-podologo`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-biomedico`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-fisioterapeuta`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-nutricionista`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-veterinario`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    // Cluster Saúde — Feminino
    { url: `${SITE_URL}/jaleco-medica`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-enfermeira`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-farmaceutica`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-veterinaria`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-biomedica`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-podologa`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-cabeleireira`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Novas landings (25/04/2026) — DataForSEO descobriu volume
    { url: `${SITE_URL}/jaleco-medicina`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-fisioterapia`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-odontologia`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-nutricao`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-farmacia`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/scrub-enfermagem`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    // Pivot 04/26 — URLs de campanhas Google Ads (adicionadas 26/04/2026)
    { url: `${SITE_URL}/jaleco-enfermagem`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/scrub-feminino`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-preto-feminino`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/pijama-cirurgico-feminino`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-plus-size`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.85 },
    // Cluster Beleza
    { url: `${SITE_URL}/jaleco-barbeiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-tatuador`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-esteticista`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-massagista`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-cabeleireiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia
    { url: `${SITE_URL}/jaleco-churrasqueiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-sushiman`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços
    { url: `${SITE_URL}/jaleco-professor`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-vendedor`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório
    { url: `${SITE_URL}/jaleco-advogado`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-advogada`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-pastor`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-psicologa`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-farmaceutico`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia — Dólmã
    { url: `${SITE_URL}/dolma-churrasqueiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-sushiman`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-cozinheiro`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Conjunto
    { url: `${SITE_URL}/conjunto-advogado`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-psicologa`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-farmaceutico`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Jaleco genérico professor
    { url: `${SITE_URL}/uniforme-professor`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Secretária
    { url: `${SITE_URL}/jaleco-secretaria`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Universitário e Dona de Casa
    { url: `${SITE_URL}/jaleco-universitario`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-dona-casa`, lastModified: new Date('2025-04-01'), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const productPages: MetadataRoute.Sitemap = productNodes.map(product => ({
    url: `${SITE_URL}/produto/${product.slug}`,
    lastModified: product.modified ? new Date(product.modified) : new Date(),
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
    lastModified: new Date('2025-04-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const cidadeSlugs = [
    // Sudeste
    'jaleco-sao-paulo', 'jaleco-rio-de-janeiro', 'jaleco-belo-horizonte',
    'jaleco-campinas', 'jaleco-ribeirao-preto', 'jaleco-sao-jose-dos-campos',
    'jaleco-guarulhos', 'jaleco-contagem', 'jaleco-uberlandia',
    'jaleco-uberaba', 'jaleco-montes-claros', 'jaleco-governador-valadares',
    'jaleco-vitoria', 'jaleco-vila-velha', 'jaleco-serra', 'jaleco-cachoeiro-de-itapemirim',
    'jaleco-colatina', 'jaleco-barra-da-tijuca',
    // Sul
    'jaleco-curitiba', 'jaleco-porto-alegre', 'jaleco-florianopolis', 'jaleco-londrina',
    // Centro-Oeste
    'jaleco-brasilia', 'jaleco-goiania', 'jaleco-campo-grande',
    // Nordeste
    'jaleco-salvador', 'jaleco-fortaleza', 'jaleco-recife', 'jaleco-natal',
    'jaleco-joao-pessoa', 'jaleco-sao-luis', 'jaleco-maceio', 'jaleco-teresina',
    'jaleco-vitoria-da-conquista', 'jaleco-teixeira-de-freitas',
    // Norte
    'jaleco-manaus', 'jaleco-belem',
    // MG interior + ex-franquia
    'jaleco-ipatinga',
    'jaleco-juiz-de-fora', 'jaleco-betim', 'jaleco-sete-lagoas', 'jaleco-divinopolis',
    'jaleco-pocos-de-caldas', 'jaleco-patos-de-minas', 'jaleco-pouso-alegre',
    'jaleco-varginha', 'jaleco-barbacena',
    'jaleco-muriae', 'jaleco-marilia', 'jaleco-itabira', 'jaleco-joao-monlevade',
    'jaleco-lagoa-santa',
    // Capitais restantes
    'jaleco-cuiaba', 'jaleco-aracaju', 'jaleco-porto-velho', 'jaleco-macapa',
    'jaleco-boa-vista', 'jaleco-rio-branco', 'jaleco-palmas',
    // SP interior
    'jaleco-sorocaba', 'jaleco-sao-jose-do-rio-preto', 'jaleco-santos',
    'jaleco-jundiai', 'jaleco-bauru',
    // Sul
    'jaleco-joinville', 'jaleco-caxias-do-sul', 'jaleco-maringa',
    'jaleco-ponta-grossa', 'jaleco-blumenau',
    // RJ interior
    'jaleco-niteroi', 'jaleco-campos-dos-goytacazes',
    // Nordeste interior
    'jaleco-feira-de-santana', 'jaleco-campina-grande', 'jaleco-mossoro',
    // GO interior
    'jaleco-anapolis',
  ]

  const cidadePages: MetadataRoute.Sitemap = cidadeSlugs.map(slug => ({
    url: `${SITE_URL}/cidade/${slug}`,
    lastModified: new Date('2025-04-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 141 páginas de produto por cor (SEO-PRODUTOS-CORES.json)
  // Priority 0.8 para páginas filhas (conforme PRD Jaleca-Cores)
  const colorProductPages: MetadataRoute.Sitemap = colorPagesData.map(page => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date('2025-04-15'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...cidadePages, ...productPages, ...colorProductPages, ...postPages]
}
