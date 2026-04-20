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
    // Topical Authority Hubs — Pillar page saúde
    {
      url: `${SITE_URL}/uniformes-profissionais-para-saude`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/jaleco-para-dentista`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Cluster Saúde
    { url: `${SITE_URL}/jaleco-para-podologo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-biomedico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-enfermeiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-fisioterapeuta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-nutricionista`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-veterinario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-para-medico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // Cluster Beleza
    { url: `${SITE_URL}/jaleco-para-barbeiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-tatuador`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-esteticista`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-massagista`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-cabeleireiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia
    { url: `${SITE_URL}/jaleco-para-churrasqueiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-sushiman`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-cozinheiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços
    { url: `${SITE_URL}/jaleco-para-professor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-vendedor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório
    { url: `${SITE_URL}/jaleco-para-advogado`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-pastor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-psicologa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-farmaceutico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia — Dólmã
    { url: `${SITE_URL}/dolma-para-churrasqueiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-para-sushiman`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-para-cozinheiro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Conjunto
    { url: `${SITE_URL}/conjunto-para-advogado`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-para-pastor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-para-psicologa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-para-farmaceutico`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Jaleco genérico professor
    { url: `${SITE_URL}/uniforme-para-professor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Secretária
    { url: `${SITE_URL}/jaleco-para-secretaria`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Universitário e Dona de Casa
    { url: `${SITE_URL}/jaleco-universitario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-para-dona-de-casa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
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
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const diasDasMaesSlugs = [
    'saude', 'estetica', 'veterinaria', 'nutricao', 'farmacia', 'laboratorio', 'ti',
  ]

  const diasDasMaesPages: MetadataRoute.Sitemap = diasDasMaesSlugs.map(slug => ({
    url: `${SITE_URL}/dia-das-maes/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...cidadePages, ...diasDasMaesPages, ...productPages, ...postPages]
}
