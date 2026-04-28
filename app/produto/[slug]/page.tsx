import { notFound, redirect, permanentRedirect } from 'next/navigation'
import { headers } from 'next/headers'
import { cache } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { graphqlClient, GET_PRODUCT_BY_SLUG, GET_RELATED_PRODUCTS } from '@/lib/graphql'
import ProductDetailClient from './ProductDetailClient'
import { getProductReviews, type WCReview } from '@/lib/woocommerce'
import { getGooglePlaceData, type PlaceData } from '@/lib/google-places'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { sendMetaViewContent } from '@/lib/meta-conversions'
import { parseColorSlug, findVariationByColor } from '@/lib/product-colors'
import { generateColorMetaDescription } from '@/lib/product-seo-generator'
import { getVariationSEO, getInStockSiblings } from '@/lib/variation-seo'
import OutOfStockPage from '@/components/OutOfStockPage'

export const revalidate = 3600

type ColorSEOData = {
  url: string
  productName: string
  colorName: string
  category: string
  h1?: string
  h2?: string
  metaDescription?: string
  title?: string
  colorPsychology?: string
}

// Mapeia cores → URLs + dados SEO do JSON
async function getColorDataForProduct(productName: string): Promise<{
  urls: Record<string, string>
  seoData: Record<string, ColorSEOData>
}> {
  try {
    const jsonPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const jsonContent = await readFile(jsonPath, 'utf-8')
    const colorPages: ColorSEOData[] = JSON.parse(jsonContent)

    const colorUrls: Record<string, string> = {}
    const seoData: Record<string, ColorSEOData> = {}

    for (const page of colorPages) {
      if (page.productName === productName) {
        // Normaliza nome da cor para usar como chave (ex: "Pink" → "pink")
        const normalizedColor = page.colorName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
        colorUrls[normalizedColor] = page.url
        seoData[normalizedColor] = page
      }
    }
    return { urls: colorUrls, seoData }
  } catch (e) {
    console.error('[getColorDataForProduct] Error:', e)
    return { urls: {}, seoData: {} }
  }
}

type ProductData = Record<string, unknown> & {
  name?: string
  description?: string
  shortDescription?: string
  sku?: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl: string; altText: string }
  stockStatus?: string
}

const getProduct = cache(async (slug: string): Promise<ProductData | null> => {
  try {
    const data = await graphqlClient.request<{ product: ProductData | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    return data.product
  } catch {
    return null
  }
})

async function getRelated(categorySlugs: string[], productId: string): Promise<WooProduct[]> {
  for (const categorySlug of categorySlugs) {
    try {
      const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
        GET_RELATED_PRODUCTS,
        { categorySlug, first: 8 }
      )
      const results = data.products.nodes.filter(p => p.id !== productId).slice(0, 4)
      if (results.length > 0) return results
    } catch {
      // try next category
    }
  }
  return []
}

async function getCachedReviews(databaseId: number): Promise<WCReview[]> {
  try {
    return await getProductReviews(databaseId)
  } catch {
    return []
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { baseSlug, colorName, hasColor } = parseColorSlug(slug)

  // Busca produto mãe se slug tiver cor, senão busca o próprio slug
  const productSlug = hasColor ? baseSlug : slug
  const product = await getProduct(productSlug)

  if (!product) {
    console.warn(`[404] Produto não encontrado: /produto/${slug}`)
    return { title: 'Produto não encontrado — Jaleca', robots: { index: false } }
  }

  let productName = String(product.name || '').replace(/ - Jaleca$/i, '')
  let name = productName
  const galleryImages = (product as any).galleryImages?.nodes || []
  let imageUrl: string | undefined = product.image?.sourceUrl || galleryImages[0]?.sourceUrl
  let actualSlug = slug
  let description: string
  let metaTitle: string
  let hasColorSEO = false

  // Se URL tem cor, busca dados da variação específica + dados SEO
  if (hasColor && colorName) {
    const variations = (product as any).variations?.nodes || []
    const variation = findVariationByColor(variations, colorName)

    if (variation) {
      name = `${productName} ${colorName}`
      const jalecaGallery = (variation as any).jalecaGalleryImages || []
      imageUrl = variation.image?.sourceUrl || jalecaGallery[0]?.sourceUrl || imageUrl

      // Buscar dados SEO do JSON
      const { seoData } = await getColorDataForProduct(productName)
      const normalizedColor = colorName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
      const colorSEO = seoData[normalizedColor]

      if (colorSEO) {
        hasColorSEO = true
        // Usa dados SEO personalizados do JSON
        metaTitle = colorSEO.title || `${name} | Jaleca`
        description = colorSEO.metaDescription || `${name} na Jaleca. Uniforme profissional premium.`
      } else {
        // Fallback: gera descrição automaticamente
        const categories = (product as any).productCategories?.nodes || []
        const categorySlug = categories[0]?.slug || 'outros'
        let category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros' = 'outros'

        if (categorySlug.includes('jaleco')) category = 'jalecos'
        else if (categorySlug.includes('conjunto')) category = 'conjuntos'
        else if (categorySlug.includes('dolma') || categorySlug.includes('doma')) category = 'dolmas'
        else if (categorySlug.includes('acessorio')) category = 'acessorios'

        metaTitle = name
        description = generateColorMetaDescription(productName, colorName, Number(product.databaseId), category)
      }
    } else {
      // Cor não existe, retorna 404
      console.warn(`[404] Variação de cor não encontrada: ${slug}`)
      return { title: 'Produto não encontrado — Jaleca', robots: { index: false } }
    }
  } else {
    // Página mãe: usa descrição padrão
    const shortDesc = product.shortDescription
      ? stripHtml(String(product.shortDescription)).slice(0, 160)
      : null
    const longDesc = product.description
      ? stripHtml(String(product.description)).slice(0, 160)
      : null
    metaTitle = name
    description = shortDesc || longDesc || `Compre ${name} na Jaleca. Uniformes profissionais premium.`
  }

  // Canonical: páginas filhas com SEO próprio (no JSON SEO-PRODUTOS-CORES) são self-canonical
  // — têm H1/H2/metaDescription únicos, são páginas distintas para o Google.
  // Páginas filhas SEM SEO próprio apontam para o produto mãe (consolida duplicate content).
  const canonical = hasColor && !hasColorSEO
    ? `https://jaleca.com.br/produto/${baseSlug}`
    : `https://jaleca.com.br/produto/${slug}`

  // KV noindex override (variação sem estoque)
  const kvSeo = await getVariationSEO(`produto/${slug}`)
  const noindex = kvSeo?.noindex ?? false

  return {
    title: name,
    description,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical },
    openGraph: {
      title: name,
      description,
      url: `https://jaleca.com.br/produto/${actualSlug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      images: [{ url: imageUrl || 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 1200, alt: name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: [imageUrl || 'https://jaleca.com.br/og-home.jpg'],
    },
  }
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Se KV marca como outofstock, renderiza página sem estoque
  const kvSeo = await getVariationSEO(`produto/${slug}`)
  if (kvSeo?.stockStatus === 'outofstock') {
    const otherColors = await getInStockSiblings(kvSeo.productSlug, kvSeo.variationId)
    return <OutOfStockPage seo={kvSeo} otherColors={otherColors} />
  }

  const { baseSlug, colorName, hasColor } = parseColorSlug(slug)

  // Busca produto mãe se slug tiver cor
  const productSlug = hasColor ? baseSlug : slug
  const product = await getProduct(productSlug)

  if (!product) {
    // Produto deletado do WC — redireciona 308 para categoria mais próxima
    const s = productSlug.toLowerCase()
    if (s.includes('conjunto') || s.includes('scrub') || s.includes('puff') || s.includes('laco') || s.includes('executiva')) {
      permanentRedirect('/produtos?categoria=conjuntos')
    }
    if (s.includes('dolma') || s.includes('doma') || s.includes('churras') || s.includes('cozinheir')) {
      permanentRedirect('/produtos?categoria=dolmas')
    }
    if (s.includes('touca') || s.includes('acessorio')) {
      permanentRedirect('/produtos?categoria=acessorios')
    }
    permanentRedirect('/produtos')
  }

  let name = String(product.name || '').replace(/ - Jaleca$/i, '')
  let selectedVariation = null

  // Buscar mapa de cores → URLs + dados SEO do JSON
  const { urls: colorUrls, seoData } = await getColorDataForProduct(name)

  // Extrair dados SEO da cor atual (se houver)
  let seoH1: string | undefined
  let seoH2: string | undefined
  let seoColorPsychology: string | undefined

  // Se URL tem cor, busca variação específica
  if (hasColor && colorName) {
    const variations = (product as any).variations?.nodes || []
    selectedVariation = findVariationByColor(variations, colorName)

    if (!selectedVariation) {
      // Cor do JSON não existe como variação WC — redireciona pra página mãe
      redirect(`/produto/${baseSlug}`)
    }

    name = `${name} - ${colorName}`

    // Extrair dados SEO da cor atual
    const normalizedColor = colorName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
    const colorSEO = seoData[normalizedColor]
    if (colorSEO) {
      seoH1 = colorSEO.h1
      seoH2 = colorSEO.h2
      seoColorPsychology = colorSEO.colorPsychology
    }
  }

  const shortDesc = product.shortDescription
    ? stripHtml(String(product.shortDescription)).slice(0, 200)
    : null
  const longDesc = product.description
    ? stripHtml(String(product.description)).slice(0, 200)
    : null
  const description = shortDesc || longDesc || `Uniforme profissional premium da Jaleca.`

  const databaseId = Number(product.databaseId)

  // CAPI ViewContent — server-side, sem bloquear o render
  const reqHeaders = await headers()
  const clientIp = reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? reqHeaders.get('x-real-ip') ?? undefined
  const clientUserAgent = reqHeaders.get('user-agent') ?? undefined
  sendMetaViewContent(
    { clientIp, clientUserAgent },
    {
      id: String(databaseId),
      name,
      value: parseFloat(String(product.price ?? '').replace(/[^0-9,]/g, '').replace(',', '.')) || undefined,
    },
    `https://jaleca.com.br/produto/${slug}`
  ).catch(() => {})

  // Fetch reviews and related products in parallel — all cached persistently
  const categorySlugs: string[] = ((product as any).productCategories?.nodes ?? []).map((n: { slug: string }) => n.slug).filter(Boolean)
  const [resolvedReviews, relatedNodes, googlePlace] = await Promise.all([
    databaseId ? getCachedReviews(databaseId) : Promise.resolve([] as WCReview[]),
    categorySlugs.length > 0 ? getRelated(categorySlugs, String(product.id)) : Promise.resolve([] as WooProduct[]),
    getGooglePlaceData(),
  ])

  const avgRating =
    resolvedReviews.length > 0
      ? resolvedReviews.reduce((sum, r) => sum + r.rating, 0) / resolvedReviews.length
      : (googlePlace && googlePlace.reviewCount > 0 ? googlePlace.rating : null)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      ...(hasColor
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: name.replace(` - ${colorName}`, ''),
              item: `https://jaleca.com.br/produto/${baseSlug}`,
            },
            { '@type': 'ListItem', position: 4, name, item: `https://jaleca.com.br/produto/${slug}` },
          ]
        : [{ '@type': 'ListItem', position: 3, name, item: `https://jaleca.com.br/produto/${slug}` }]),
    ],
  }

  // Extrair cores e tamanhos dos atributos do produto
  const attrs: Array<{ name: string; options?: string[] }> =
    (product as any).attributes?.nodes ?? []
  const colorAttr = attrs.find((a) => /cor/i.test(a.name))
  const sizeAttr = attrs.find((a) => /tamanho|size/i.test(a.name))

  // Se é página filha (com cor), usa dados da variação no schema
  const schemaImage = selectedVariation?.image?.sourceUrl || product.image?.sourceUrl
  const schemaSku = selectedVariation?.sku || product.sku
  const schemaColor = hasColor && colorName ? colorName : (colorAttr?.options?.length ? colorAttr.options.join(', ') : undefined)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: schemaImage,
    sku: schemaSku,
    brand: { '@type': 'Brand', name: 'Jaleca' },
    manufacturer: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
    condition: 'https://schema.org/NewCondition',
    category: 'Uniformes Profissionais para Saúde',
    ...(schemaColor && { color: schemaColor }),
    ...(sizeAttr?.options?.length && { size: sizeAttr.options.join(', ') }),
    offers: (() => {
      // Parse BRL price string "280,00" or "1.280,00" → 280.00 / 1280.00
      // Handles WC returning concatenated values like "280,00330,00"
      const parsePrice = (raw: string | null | undefined): number | undefined => {
        if (!raw) return undefined
        const match = String(raw).match(/[\d][\d.,]*/)
        if (!match) return undefined
        let token = match[0]
        // BRL format: comma = decimal separator, periods = thousands separators
        if (token.includes(',')) {
          token = token.replace(/\./g, '').replace(',', '.')
        }
        const num = parseFloat(token)
        return isNaN(num) || num <= 0 ? undefined : num
      }

      // Se é página filha (com cor), usa oferta única da variação
      if (selectedVariation) {
        const siblingPrices = ((product as any).variations?.nodes ?? [])
          .flatMap((v: any) => [parsePrice(v.price), parsePrice(v.regularPrice)])
          .filter((p: number | undefined): p is number => p !== undefined)
        const fallbackPrice = siblingPrices.length ? Math.min(...siblingPrices) : parsePrice(product.regularPrice) ?? parsePrice(product.price)
        const varPrice = parsePrice(selectedVariation.price) ?? parsePrice(selectedVariation.regularPrice) ?? fallbackPrice
        const pixPrice = varPrice !== undefined ? Math.round(varPrice * 0.95 * 100) / 100 : undefined

        if (varPrice === undefined) return null

        return {
          '@type': 'Offer',
          price: varPrice.toFixed(2),
          priceCurrency: 'BRL',
          availability:
            selectedVariation.stockStatus === 'OUT_OF_STOCK'
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          url: `https://jaleca.com.br/produto/${slug}`,
          seller: { '@type': 'Organization', name: 'Jaleca' },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'BR',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: 0,
              currency: 'BRL',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'BR',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 3,
                maxValue: 10,
                unitCode: 'DAY',
              },
            },
          },
          ...(varPrice !== undefined && pixPrice !== undefined && {
            priceSpecification: [
              {
                '@type': 'UnitPriceSpecification',
                price: varPrice.toFixed(2),
                priceCurrency: 'BRL',
                name: 'Preço padrão',
              },
              {
                '@type': 'UnitPriceSpecification',
                price: pixPrice.toFixed(2),
                priceCurrency: 'BRL',
                name: 'PIX (5% de desconto)',
              },
            ],
          }),
        }
      }

      // Para produtos variáveis (página mãe), extrair preço das variações
      const variations: Array<{ price?: string; regularPrice?: string }> =
        (product as any).variations?.nodes ?? []
      const variationPrices = variations
        .flatMap((v) => [parsePrice(v.regularPrice), parsePrice(v.price)])
        .filter((p): p is number => p !== undefined)

      const hasVariations = variationPrices.length > 0
      const basePrice = hasVariations
        ? Math.min(...variationPrices)
        : parsePrice(product.regularPrice) ?? parsePrice(product.price)

      if (hasVariations && basePrice === undefined) return null

      const pixPrice = basePrice !== undefined ? Math.round(basePrice * 0.95 * 100) / 100 : undefined

      // Produtos variáveis usam AggregateOffer com lowPrice/highPrice
      if (hasVariations) {
        const highPrice = Math.max(...variationPrices)
        return {
          '@type': 'AggregateOffer',
          lowPrice: (basePrice as number).toFixed(2),
          highPrice: highPrice.toFixed(2),
          priceCurrency: 'BRL',
          offerCount: variationPrices.length,
          availability:
            product.stockStatus === 'OUT_OF_STOCK'
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          url: `https://jaleca.com.br/produto/${slug}`,
          seller: { '@type': 'Organization', name: 'Jaleca' },
        }
      }

      if (basePrice === undefined) return null

      return {
        '@type': 'Offer',
        price: basePrice.toFixed(2),
        priceCurrency: 'BRL',
        availability:
          product.stockStatus === 'OUT_OF_STOCK'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
        url: `https://jaleca.com.br/produto/${slug}`,
        seller: { '@type': 'Organization', name: 'Jaleca' },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'BR',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: 0,
            currency: 'BRL',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'BR',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 3,
              maxValue: 10,
              unitCode: 'DAY',
            },
          },
        },
        ...(basePrice !== undefined && pixPrice !== undefined && {
          priceSpecification: [
            {
              '@type': 'UnitPriceSpecification',
              price: basePrice.toFixed(2),
              priceCurrency: 'BRL',
              name: 'Preço padrão',
            },
            {
              '@type': 'UnitPriceSpecification',
              price: pixPrice.toFixed(2),
              priceCurrency: 'BRL',
              name: 'PIX (5% de desconto)',
            },
          ],
        }),
      }
    })(),
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: resolvedReviews.length > 0 ? resolvedReviews.length : (googlePlace?.reviewCount ?? 0),
        bestRating: '5',
        worstRating: '1',
      },
      ...(resolvedReviews.length > 0 ? {
        review: resolvedReviews.slice(0, 5).map(r => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5', worstRating: '1' },
          reviewBody: r.review.replace(/<[^>]*>/g, '').slice(0, 500),
          author: { '@type': 'Person', name: r.reviewer },
          datePublished: r.date_created.split('T')[0],
        })),
      } : {}),
    }),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Pode lavar jaleco na máquina de lavar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! A maioria dos jalecos suporta lavagem em máquina doméstica. Use água fria ou morna, ciclo delicado ou roupas brancas, e detergente líquido neutro. Evite alvejante com cloro para não amarelar o tecido.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como evitar que o jaleco branco amarelar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evite alvejante com cloro (causa amarelamento em poliéster), lave logo após o uso, seque à sombra e não use ferro em temperatura muito alta. Use bicarbonato de sódio no sabão para intensificar a brancura.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como escolher o tamanho certo do jaleco?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Meça o busto, cintura e quadril e consulte a tabela de medidas da Jaleca. Os modelos slim ficam mais ajustados ao corpo; os clássicos têm corte mais reto. Em caso de dúvida entre dois tamanhos, escolha o maior para maior conforto.',
        },
      },
      {
        '@type': 'Question',
        name: 'Os jalecos da Jaleca têm elastano?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alguns modelos possuem elastano na composição do tecido, oferecendo maior mobilidade e conforto para quem trabalha em movimento. Confira a descrição de cada produto para detalhes sobre a composição do tecido.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qual a diferença entre jaleco de gabardine e oxford?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'O gabardine é mais leve, fresco e resistente a amassados — ideal para quem trabalha em ambientes quentes. O oxford é mais encorpado e resistente, com acabamento diferenciado. Ambos são duráveis e de fácil lavagem.',
        },
      },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'],
    },
  }

  // Speakable schema — assistentes de voz e IAs (Copilot, Google Assistant, ChatGPT)
  const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: shortDesc || longDesc || name,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]', '.product-description'],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetailClient
        product={product as Parameters<typeof ProductDetailClient>[0]['product']}
        initialReviews={resolvedReviews}
        relatedProducts={relatedNodes}
        googlePlace={googlePlace ?? undefined}
        initialColor={hasColor ? colorName : null}
        colorUrls={colorUrls}
        seoH1={seoH1}
        seoH2={seoH2}
        seoColorPsychology={seoColorPsychology}
      />
    </>
  )
}
