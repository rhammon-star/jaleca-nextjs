import type { Metadata } from 'next'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import LookbookClient from './LookbookClient'

export const metadata: Metadata = {
  title: 'Lookbook Jaleca 2026 — Uniformes Profissionais Premium',
  description: 'Experiência editorial de moda profissional. Jalecos femininos, masculinos, scrub e dólmã — descubra o uniforme que reflete sua excelência.',
  alternates: { canonical: 'https://jaleca.com.br/lookbook' },
  openGraph: {
    title: 'Lookbook Jaleca 2026 — Uniformes Profissionais Premium',
    description: 'Experiência editorial de moda profissional. Jalecos femininos, masculinos, scrub e dólmã.',
    url: 'https://jaleca.com.br/lookbook',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Lookbook Jaleca 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lookbook Jaleca 2026',
    description: 'Experiência editorial de moda profissional Jaleca.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

export const revalidate = 3600

const schemaCollection = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Lookbook Jaleca 2026 — Uniformes Profissionais Premium',
  description: 'Experiência editorial de moda profissional. Jalecos femininos, masculinos, scrub e dólmã.',
  url: 'https://jaleca.com.br/lookbook',
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
}

type ProductMini = { slug: string; name: string; price: string; image?: string }

async function fetchProduct(slug: string): Promise<ProductMini | null> {
  try {
    const data = await graphqlClient.request<{ product: WooProduct & { image?: { sourceUrl: string } } }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    if (!data?.product) return null
    const p = data.product
    return {
      slug: p.slug,
      name: p.name,
      price: p.price ?? '',
      image: p.image?.sourceUrl,
    }
  } catch {
    return null
  }
}

// Imagens editoriais reais do WP para cada look
const LOOK_IMAGES = {
  feminino: 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp',
  masculino: 'https://wp.jaleca.com.br/wp-content/uploads/2022/07/Slim-Masc-Branco-Frente.jpg',
  scrub: 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-05-at-01.46.32-e1775365394298.jpeg',
  dolma: 'https://wp.jaleca.com.br/wp-content/uploads/2022/07/Dolma-Fem-BrancoPreto-Bolsos.jpg',
}

export default async function LookbookPage() {
  // Buscar todos os produtos em paralelo
  const [
    feminino1, feminino2, feminino3,
    masculino1, masculino2, masculino3,
    scrub1, scrub2, scrub3,
    dolma1, dolma2,
  ] = await Promise.all([
    fetchProduct('jaleco-slim-tradicional-feminino-jaleca'),
    fetchProduct('jaleco-slim-duquesa-feminino-jaleca'),
    fetchProduct('jaleco-slim-princesa-feminino-jaleca'),
    fetchProduct('jaleco-slim-tradicional-masculino-jaleca'),
    fetchProduct('jaleco-slim-recortes-masculino-jaleca'),
    fetchProduct('jaleco-slim-moratty-masculino-jaleca'),
    fetchProduct('conjunto-scrub-feminino-jaleca'),
    fetchProduct('conjunto-scrub-masculino-jaleca'),
    fetchProduct('conjunto-princesa-nobre-feminino-jaleca'),
    fetchProduct('conjunto-dolma-cozinheiro-feminino-jaleca'),
    fetchProduct('conjunto-dolma-cozinheiro-masculino-jaleca'),
  ])

  const looks = [
    {
      number: '01',
      category: 'Essencial Feminino',
      title: 'JALECO FEMININO',
      description: 'Corte arquitetônico. Tecido inteligente. Performance que desafia convenções. O jaleco reimaginado para a profissional que lidera a transformação.',
      heroImage: LOOK_IMAGES.feminino,
      heroImageAlt: 'Jaleco Feminino Premium Jaleca',
      featured: feminino1 ?? { slug: 'jaleco-slim-tradicional-feminino-jaleca', name: 'Jaleco Slim Tradicional Feminino', price: '', image: LOOK_IMAGES.feminino },
      others: [feminino2, feminino3].filter(Boolean) as ProductMini[],
    },
    {
      number: '02',
      category: 'Essencial Masculino',
      title: 'JALECO MASCULINO',
      description: 'Estrutura. Autoridade. Movimento. Design pensado para quem não aceita compromissos. Performance profissional em cada detalhe.',
      heroImage: LOOK_IMAGES.masculino,
      heroImageAlt: 'Jaleco Masculino Premium Jaleca',
      featured: masculino1 ?? { slug: 'jaleco-slim-tradicional-masculino-jaleca', name: 'Jaleco Slim Tradicional Masculino', price: '', image: LOOK_IMAGES.masculino },
      others: [masculino2, masculino3].filter(Boolean) as ProductMini[],
    },
    {
      number: '03',
      category: 'Performance Cirúrgica',
      title: 'SCRUB PREMIUM',
      description: 'Zero limites. Máxima mobilidade. Conforto absoluto. O conjunto scrub para quem vive jornadas intensas sem perder o estilo.',
      heroImage: LOOK_IMAGES.scrub,
      heroImageAlt: 'Conjunto Scrub Premium Jaleca',
      featured: scrub1 ?? { slug: 'conjunto-scrub-feminino-jaleca', name: 'Conjunto Scrub Feminino', price: '', image: LOOK_IMAGES.scrub },
      others: [scrub2, scrub3].filter(Boolean) as ProductMini[],
    },
    {
      number: '04',
      category: 'Gastronomia Premium',
      title: 'DÓLMÃ CHEF',
      description: 'Tradição reinventada. Ventilação estratégica. Identidade profissional. Design que une herança culinária com inovação contemporânea.',
      heroImage: LOOK_IMAGES.dolma,
      heroImageAlt: 'Dólmã Chef Profissional Jaleca',
      featured: dolma1 ?? { slug: 'conjunto-dolma-cozinheiro-feminino-jaleca', name: 'Conjunto Dólmã Cozinheiro Feminino', price: '', image: LOOK_IMAGES.dolma },
      others: [dolma2].filter(Boolean) as ProductMini[],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollection).replace(/</g, '\\u003c') }}
      />
      <LookbookClient looks={looks} />
    </>
  )
}
