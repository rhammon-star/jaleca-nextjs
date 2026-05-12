import type { MetadataRoute } from 'next'
import { graphqlClient } from '@/lib/graphql'
import { getAllSeoSlugs, getVariationSEO } from '@/lib/variation-seo'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { parseColorSlug } from '@/lib/product-colors'
import { getKnownColorSlugs } from '@/lib/kv-colors'

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

async function getKvColorPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const slugs = await getAllSeoSlugs()
    const entries: MetadataRoute.Sitemap = []
    for (const slug of slugs) {
      const e = await kv.get<SeoEntry>(seoKey(slug))
      if (!e || e.noindex) continue
      entries.push({
        url: `${SITE_URL}${e.url}`,
        lastModified: e.lastSyncedAt,
        changeFrequency: 'daily',
        priority: 0.8,
      })
    }
    return entries
  } catch {
    // KV não disponível — fallback para JSON
    try {
      const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
      const jsonContent = await readFile(jsonPath, 'utf-8')
      const colorPages: { url: string }[] = JSON.parse(jsonContent)
      return colorPages.map((page) => ({
        url: `${SITE_URL}${page.url}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    } catch {
      return []
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const legalDate = now
  const [products, posts, colorProductPages] = await Promise.allSettled([
    getAllProductSlugs(),
    getAllPosts(),
    getKvColorPages(),
  ])

  const productNodes = products.status === 'fulfilled' ? products.value : []
  const postNodes = posts.status === 'fulfilled' ? posts.value : []
  const kvColorPages = colorProductPages.status === 'fulfilled' ? colorProductPages.value : []

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/produtos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/como-escolher-jaleco-feminino-guia-completo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/guia-jaleco-dentista-modelos-cores-como-escolher`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/comprar-jaleco-online-e-seguro`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lookbook`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/nossas-lojas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/medidas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/trocas-e-devolucoes`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: legalDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: legalDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // SEO Keyword Clusters — PRD SEO Jaleca (21/04/2026)
    { url: `${SITE_URL}/melhor-marca-jaleco`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/jaleco-premium`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-estiloso`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // Topical Authority Hubs — Pillar pages clusters
    { url: `${SITE_URL}/uniformes-beleza`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-gastronomia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-servicos`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/uniformes-escritorio`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Pillar page saúde
    {
      url: `${SITE_URL}/uniformes-profissionais-saude`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/jaleco-dentista`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Cluster Saúde — Masculino
    { url: `${SITE_URL}/jaleco-medico`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-enfermeiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-podologo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-biomedico`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-fisioterapeuta`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-nutricionista`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-veterinario`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Cluster Saúde — Feminino
    { url: `${SITE_URL}/jaleco-medica`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-enfermeira`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-farmaceutica`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-veterinaria`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-biomedica`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-podologa`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-cabeleireira`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Novas landings (25/04/2026) — DataForSEO descobriu volume
    { url: `${SITE_URL}/jaleco-medicina`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-fisioterapia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-odontologia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-nutricao`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-farmacia`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/scrub-enfermagem`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Pivot 04/26 — URLs de campanhas Google Ads (adicionadas 26/04/2026)
    { url: `${SITE_URL}/jaleco-enfermagem`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/scrub-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Topical Authority Hub — Scrub Feminino (30/04/2026)
    { url: `${SITE_URL}/blog/scrub-feminino-guia-completo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog/scrub-feminino-acinturado`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/melhores-tecidos-scrub-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/como-cuidar-scrub-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/scrub-feminino-colorido`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/scrub-feminino-plus-size`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/scrub-feminino-gravidas`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/onde-comprar-scrub-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/tabela-medidas-scrub-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Topical Authority Hub — Jaleco Feminino (30/04/2026)
    { url: `${SITE_URL}/blog/jaleco-slim-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog/jaleco-branco-profissional`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/jaleco-colorido-clinica`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/jaleco-feminino-tamanho-certo`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/blog/jaleco-para-formatura-medicina`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // PAA Posts — Jaleco (01/05/2026)
    { url: `${SITE_URL}/blog/jaleco-manga-curta-clinica`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog/jaleco-ou-scrub-consultorio`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog/jaleco-elastano-vale-a-pena`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog/jaleco-plus-size-feminino-guia`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-preto-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/pijama-cirurgico-feminino`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/jaleco-plus-size`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // Cluster Beleza
    { url: `${SITE_URL}/jaleco-barbeiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-tatuador`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-esteticista`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-massagista`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-cabeleireiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia
    { url: `${SITE_URL}/jaleco-churrasqueiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-sushiman`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços
    { url: `${SITE_URL}/jaleco-professor`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-vendedor`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório
    { url: `${SITE_URL}/jaleco-advogado`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-advogada`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-pastor`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-psicologa`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-farmaceutico`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Gastronomia — Dólmã
    { url: `${SITE_URL}/dolma-churrasqueiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-sushiman`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dolma-cozinheiro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Conjunto
    { url: `${SITE_URL}/conjunto-advogado`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-psicologa`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/conjunto-farmaceutico`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Jaleco genérico professor
    { url: `${SITE_URL}/uniforme-professor`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Escritório — Secretária
    { url: `${SITE_URL}/jaleco-secretaria`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Cluster Serviços — Universitário e Dona de Casa
    { url: `${SITE_URL}/jaleco-universitario`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/jaleco-dona-casa`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  // Filtrar produtos-filho (cor) cuja canonical aponta para o pai —
  // mantém só self-canonical no sitemap (cores com SEO próprio entram via kvColorPages).
  const knownColors = await getKnownColorSlugs().catch(() => new Set<string>())
  const productPagesRaw = await Promise.all(
    productNodes.map(async (product) => {
      const parsed = parseColorSlug(product.slug, knownColors)
      if (parsed.hasColor) {
        const kvSeo = await getVariationSEO(`produto/${product.slug}`).catch(() => null)
        if (!kvSeo) return null
      }
      return {
        url: `${SITE_URL}/produto/${product.slug}`,
        lastModified: product.modified ? new Date(product.modified) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
  )
  const productPages: MetadataRoute.Sitemap = productPagesRaw.filter((p): p is NonNullable<typeof p> => p !== null)

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
    lastModified: now,
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
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...cidadePages, ...productPages, ...kvColorPages, ...postPages]
}
