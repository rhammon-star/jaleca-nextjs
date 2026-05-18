import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'
import { PROFESSION_PRODUCT_SLUGS, prioritizeByColor, getVerMaisUrl } from '@/lib/product-professions'
import { getAllProducts } from '@/lib/all-products'
import { getHeroImageSlug } from '@/lib/profession-hero-images'
import { getCachedHeroImage, getCachedBlogPosts } from '@/lib/profession-page-data'
import UGCSection from '@/components/UGCSection'
import EATBlock from '@/components/EATBlock'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco Dentista: Curto ou Longo? Elastano para a Cadeira — 4.9★' },
  description: '⭐ 4.9★ · 61 avaliações reais · usado por +500 dentistas. Curto ou longo, com elastano para liberdade ao redor da cadeira. Branco e colorido, PP ao G3. O que o CRO permite. Frete grátis Sudeste · troca em 7 dias.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-dentista' },
  openGraph: {
    title: 'Jaleco para Dentista: Curto, Slim e com Elastano | Jaleca',
    description: 'Jaleco para dentista curto ou longo, com elastano para movimento ao redor da cadeira. O que o CRO permite. PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-dentista',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Dentista | Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Jaleco premium para dentista. Tecido de qualidade, caimento perfeito, preço justo. Do PP ao G3.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'] },
  mainEntity: [
    { '@type': 'Question', name: "Qual o tecido mais recomendado para o jaleco masculino de dentista, considerando a rotina de consultório e a necessidade de assepsia?", acceptedAnswer: { '@type': 'Answer', text: "Gabardine de alta qualidade é excelente. É resistente, fácil de limpar e suporta lavagens frequentes, ideal para manter a higiene em consultórios odontológicos." } },
    { '@type': 'Question', name: "Os jalecos para dentistas são projetados para oferecer conforto e liberdade de movimento durante procedimentos delicados?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos masculinos têm cortes que permitem ampla movimentação dos braços e tronco, essenciais para a precisão dos procedimentos odontológicos." } },
    { '@type': 'Question', name: "É possível bordar o CRO (Conselho Regional de Odontologia) e o nome no jaleco de dentista?", acceptedAnswer: { '@type': 'Answer', text: "Certamente. Oferecemos o serviço de bordado para incluir seu nome e o número de registro do CRO, um padrão de identificação profissional." } },
    { '@type': 'Question', name: "Qual a importância dos bolsos nos jalecos de dentistas para a organização de instrumentais?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos possuem bolsos estrategicamente dimensionados para guardar canetas, sondas periodontais, espelho bucal e outros instrumentos de forma prática e segura." } },
    { '@type': 'Question', name: "Como escolher o jaleco ideal para um dentista que trabalha com cirurgias orais frequentes?", acceptedAnswer: { '@type': 'Answer', text: "Para cirurgias, priorize jalecos com tecidos que permitam fácil desinfecção, boa barreira a fluidos e conforto para longas horas de trabalho, além de mangas que possam ser ajustadas." } },
    { '@type': 'Question', name: "Os jalecos brancos são os únicos aceitáveis para dentistas, ou há outras cores que podem ser usadas em consultório?", acceptedAnswer: { '@type': 'Answer', text: "O branco é o mais tradicional e exigido. No entanto, em algumas clínicas, cores claras e discretas como azul claro ou verde água podem ser permitidas, desde que discretas." } },
    { '@type': 'Question', name: "Qual a diferença entre um jaleco com gola tradicional e um com gola padre para dentistas?", acceptedAnswer: { '@type': 'Answer', text: "A gola tradicional é clássica e formal. A gola padre oferece um visual moderno e limpo, uma questão de preferência pessoal que mantém a profissionalidade." } },
    { '@type': 'Question', name: "Há jalecos masculinos com tratamentos antimicrobianos para maior proteção em ambientes odontológicos?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos modelos com tecidos que incorporam tecnologia antimicrobiana, que ajuda a inibir o crescimento de bactérias e fungos, elevando o nível de higiene." } },
    { '@type': 'Question', name: "O comprimento do jaleco para dentistas influencia na proteção contra respingos?", acceptedAnswer: { '@type': 'Answer', text: "Um comprimento médio (próximo aos joelhos) é ideal, pois oferece boa proteção contra respingos de fluidos e materiais dentários sem atrapalhar a movimentação." } },
    { '@type': 'Question', name: "Qual a política de higienização recomendada para jalecos de dentistas para controle de infecção cruzada?", acceptedAnswer: { '@type': 'Answer', text: "Recomenda-se lavar separadamente, em alta temperatura (se o tecido permitir), com detergente bactericida. A autoclave é ideal para desinfecção profunda de jalecos específicos." } },
    { '@type': 'Question', name: "Existem opções de jalecos para dentistas com tecidos que minimizam o acúmulo de cabelos e pelos?", acceptedAnswer: { '@type': 'Answer', text: "Sim, alguns de nossos tecidos têm acabamento especial que minimiza a aderência de cabelos e pelos, facilitando a limpeza e manutenção da higiene." } },
    { '@type': 'Question', name: "Como garantir a durabilidade do jaleco branco de dentista, evitando que ele desbote ou amarele?", acceptedAnswer: { '@type': 'Answer', text: "Lave com água fria, sabão neutro, separadamente de outras cores. Evite alvejantes com cloro frequentes e seque à sombra para preservar o branco." } },
    { '@type': 'Question', name: "A loja oferece jalecos com fechamento em zíper ou botões de pressão para dentistas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, dispomos de modelos com fechamento em zíper ou botões de pressão, que são práticos, seguros e ideais para a rotina do dentista, permitindo um fechamento rápido." } },
    { '@type': 'Question', name: "Qual a importância do caimento do jaleco para a imagem profissional do dentista?", acceptedAnswer: { '@type': 'Answer', text: "Um bom caimento transmite profissionalismo e confiança. Nossos jalecos são modelados para vestir bem, valorizando a imagem do dentista no consultório." } },
    { '@type': 'Question', name: "Para dentistas que usam lupas ou óculos de proteção, o jaleco deve ter alguma característica especial?", acceptedAnswer: { '@type': 'Answer', text: "O jaleco deve ter uma gola que não interfira no ajuste da lupa ou óculos. Modelos com gola padre ou mais abertos podem ser mais confortáveis." } },
    { '@type': 'Question', name: "Qual a faixa de preço dos jalecos para dentistas e o que justifica modelos mais caros?", acceptedAnswer: { '@type': 'Answer', text: "Os preços variam de acordo com o tecido, tecnologias (antibacteriano, repelente), design e acabamento. Modelos mais caros oferecem maior durabilidade e conforto." } },
    { '@type': 'Question', name: "Os jalecos masculinos são resistentes ao atrito constante com a cadeira odontológica?", acceptedAnswer: { '@type': 'Answer', text: "Nossos tecidos são escolhidos pela sua resistência à abrasão, garantindo que o jaleco suporte o atrito constante com a cadeira e equipamentos sem desgastar prematuramente." } },
    { '@type': 'Question', name: "A loja oferece jalecos com bordado em cores para dentistas que trabalham em clínicas infantis?", acceptedAnswer: { '@type': 'Answer', text: "Sim, podemos personalizar com bordados coloridos discretos, ideais para clínicas infantis, que ajudam a criar um ambiente mais acolhedor para os pequenos pacientes." } },
    { '@type': 'Question', name: "Existe a possibilidade de comprar um jaleco avulso para dentistas, ou são vendidos em kits?", acceptedAnswer: { '@type': 'Answer', text: "Você pode comprar jalecos avulsos para ter exatamente o que precisa, ou aproveitar nossos kits com desconto para ter múltiplas opções." } },
    { '@type': 'Question', name: "Os jalecos de dentista são pré-encolhidos para garantir que o tamanho não mude após a lavagem?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos tecidos são pré-encolhidos para minimizar o encolhimento e garantir que o tamanho e o caimento do jaleco permaneçam consistentes após as lavagens." } },
  ],
}

const schemaProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Jaleco para Dentista',
  brand: { '@type': 'Brand', name: 'Jaleca' },
  description: 'Jaleco para dentista curto ou longo com elastano para movimento ao redor da cadeira. PP ao G3, branco e colorido.',
  image: 'https://jaleca.com.br/og-home.jpg',
  category: 'Uniformes Profissionais para Saúde',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '61',
    bestRating: '5',
    worstRating: '1',
  },
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '149.00',
    highPrice: '289.00',
    priceCurrency: 'BRL',
    offerCount: 6,
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    availability: 'https://schema.org/InStock',
    url: 'https://jaleca.com.br/jaleco-dentista',
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
      shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'BRL' },
      shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BR' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 10, unitCode: 'DAY' },
      },
    },
  },
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dentista: Curto, Slim e com Elastano — Guia Completo',
  description: 'Jaleco para dentista curto ou longo, com elastano para movimento ao redor da cadeira. O que o CRO permite, PP ao G3.',
  inLanguage: 'pt-BR',
  audience: { '@type': 'Audience', audienceType: 'Dentistas e profissionais da odontologia' },
  author: {
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
    sameAs: ['https://www.instagram.com/jalecaa/', 'https://www.facebook.com/jalecaa/'],
  },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    sameAs: ['https://www.instagram.com/jalecaa/', 'https://www.facebook.com/jalecaa/'],
  },
  url: 'https://jaleca.com.br/jaleco-dentista',
  mainEntityOfPage: 'https://jaleca.com.br/jaleco-dentista',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Dentista', item: 'https://jaleca.com.br/jaleco-dentista' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão dentista
    const slugs = PROFESSION_PRODUCT_SLUGS['dentista'] ?? []
    const professionProducts = allProducts.filter(p => {
      // Produto mãe está na lista OU produto filho cujo pai está na lista
      if (slugs.includes(p.slug)) return true

      // Verifica se é produto filho (tem cor no slug)
      const parts = p.slug.split('-')
      const possibleColor = parts[parts.length - 1]
      const baseSlug = parts.slice(0, -1).join('-')

      return slugs.includes(baseSlug)
    })

    // Prioriza branco e preto primeiro (mais vendidos)
    const prioritized = prioritizeByColor(professionProducts)

    // Mix: 7 femininos + 2 masculinos
    const femininos = prioritized.filter(p => /feminin/i.test(p.slug)).slice(0, 7)
    const masculinos = prioritized.filter(p => /masculin/i.test(p.slug)).slice(0, 2)
    return [...femininos, ...masculinos]
  } catch (error) {
    console.error('[getJalecos] Error:', error)
    return []
  }
}// Stars sem contagem — apenas nota
function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>
        {'★'.repeat(full)}{half ? '½' : ''}
      </span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>
        {rating.toFixed(1)}★
      </span>
    </div>
  )
}

export default async function JalecoDentistaPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('dentista') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-dentista', 'https://jaleca.com.br/jaleco-dentista'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-dentista', 'https://jaleca.com.br/jaleco-dentista'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-dentista', "Jalecos para dentista"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-dentista'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-dentista', "Jaleco para dentista", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Dentista', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow="Uniforme profissional"
          h1Line1="Jaleco para"
          h1Line2="Dentista"
          description="Tecido premium, caimento perfeito, preço justo."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── PRODUTOS — Above the Fold (subiu pra após Hero, mobile) ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção odontologia</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Dentistas</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 9).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('dentista')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver mais →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── PROFISSIONAIS DE TODO O BRASIL (UGC carrossel) ── */}
        <section className="py-4 px-4"><div className="container"><UGCSection /></div></section>

        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} reviews={placeData?.reviews} />

        {/* ── INSTAGRAM (Stories → Feed → Marcaram) ── */}
        <InstagramLazy />

        {/* ── DESCRITIVO MODELOS ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco ideal para odontologia
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Tecido e composição', anchor: '#tecido' },
                      { label: 'Modelagem Slim ou Profissional', anchor: '#modelagem' },
                      { label: 'Jaleco branco ou colorido', anchor: '#cores' },
                      { label: 'Bolsos e funcionalidade', anchor: '#bolsos' },
                      { label: 'Normas do CRO', anchor: '#cro' },
                    ].map(item => (
                      <li key={item.anchor} style={{ marginBottom: '0.5rem' }}>
                        <a href={item.anchor} style={{ fontSize: '0.82rem', color: '#6b6b6b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ display: 'inline-block', width: 16, height: 1, background: '#c8c4bc', flexShrink: 0 }} />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <article>
                {[
                  {
                    id: 'tecido',
                    title: 'Tecido e composição: o que realmente importa',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Jaleco de dentista aguenta muita lavagem e mancha. Precisa ser confortável por horas.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Na Jaleca, todos têm elastano. Faz a diferença para quem fica com os braços levantados.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco ideal? Aquele que você nem sente que está vestindo. O tecido te acompanha, sem atrapalhar."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelagem',
                    title: 'Modelagem Slim ou Profissional: qual escolher?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A Jaleca tem duas modelagens principais. A escolha certa depende do ambiente da clínica e do seu estilo profissional.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim — Corte ajustado ao corpo, valoriza a silhueta, ideal para quem quer visual moderno e elegante em consultórios premium',
                            'Profissional — Corte mais amplo e estruturado, maior liberdade de movimento, escolha clássica para qualquer rotina clínica',
                          ].map(item => (
                            <li key={item} style={{ fontSize: '0.95rem', color: '#444', padding: '0.6rem 0 0.6rem 1.5rem', position: 'relative', borderBottom: '1px solid #e5e0d8', fontWeight: 300 }}>
                              <span style={{ position: 'absolute', left: 0, color: '#c8c4bc' }}>→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    ),
                  },
                  {
                    id: 'cores',
                    title: 'Jaleco branco ou colorido: o que o CRO diz',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O branco é o clássico, claro. Mas o CRO não restringe cores.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Tons pastel e discretos são aceitos. Em clínicas pediátricas, cores amigáveis acalmam as crianças. Temos 12 cores disponíveis, em todos os modelos.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'bolsos',
                    title: 'Bolsos e funcionalidade clínica',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O bolso no peito precisa guardar a caneta sem ela cair quando você se inclina.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Bolsos laterais reforçados duram mais e são ótimos para os instrumentos do dia a dia.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'cro',
                    title: 'Normas do CRO sobre vestimenta profissional',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O CRO, junto com a ANVISA, exige: use o jaleco só no trabalho. Nunca em transporte ou fora da clínica. A peça precisa estar sempre limpa e em bom estado.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          EPIs são obrigatórios: jaleco, luvas, máscara, óculos e touca. O jaleco protege sua roupa e forma uma barreira contra sangue, saliva e químicos.
                        </p>
                      </>
                    ),
                  },
                ].map((sec) => (
                  <div key={sec.id} id={sec.id} style={{ borderTop: '1px solid #e5e0d8', paddingTop: '2rem', marginTop: '2.5rem' }}>
                    <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, marginBottom: '1rem', color: '#1a1a1a' }}>
                      {sec.title}
                    </h2>
                    {sec.body}
                  </div>
                ))}
              </article>
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para dentista</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG (reais do WordPress) ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Blog Jaleca</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: 0 }}>
              Leitura para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissionais</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2px', background: '#e5e0d8', marginTop: '3rem' }}>
              {posts.length > 0 ? posts.map(post => {
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
                const title = post.title.rendered.replace(/<[^>]+>/g, '')
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ aspectRatio: '16/10', background: '#e5e0d8', overflow: 'hidden', position: 'relative' }}>
                      {img ? (
                        <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.85rem', fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>Blog</span>
                      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{excerpt}</p>
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                    </div>
                  </Link>
                )
              }) : (
                // Fallback: artigos fixos relevantes para o cluster
                [
                  { title: 'Jaleco para dentista: modelos, cores e como escolher', href: '/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher', tag: 'Odontologia', excerpt: 'Guia completo sobre jaleco odontológico: modelo Slim vs Profissional, NR-32 e cores aceitas pelo CRO.' },
                  { title: 'Jaleco manga curta em consultório: quando usar', href: '/blog/jaleco-manga-curta-clinica', tag: 'Protocolos', excerpt: 'Manga curta facilita o trabalho na cadeira odontológica. Saiba quando é aceita e quando exige manga longa.' },
                  { title: 'Jaleco ou scrub: qual usar no consultório?', href: '/blog/jaleco-ou-scrub-consultorio', tag: 'Guia', excerpt: 'Dentistas usam jaleco ou scrub? Entenda a diferença e quando cada um é o mais indicado.' },
                ].map(post => (
                  <Link key={post.href} href={post.href} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>{post.tag}</span>
                      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{post.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{post.excerpt}</p>
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/blog" style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6b6b', textDecoration: 'none' }}>
                Ver todos os artigos →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TOPICAL AUTHORITY — Outros profissionais de saúde ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de saúde</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Podólogo', href: '/jaleco-podologo', desc: 'Guia completo' },
                { label: 'Biomédico', href: '/jaleco-biomedico', desc: 'Guia completo' },
                { label: 'Enfermeiro', href: '/jaleco-enfermeiro', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
                { label: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Guia completo' },
                { label: 'Veterinário', href: '/jaleco-veterinario', desc: 'Guia completo' },
                { label: 'Médico', href: '/jaleco-medico', desc: 'Guia completo' },
                { label: 'Ver todos', href: '/produtos?categoria=jalecos', desc: 'Loja completa' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="block hover:bg-white/5 transition-colors duration-200" style={{ padding: '1.5rem', textDecoration: 'none' }}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#fff', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{item.desc} →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300, color: 'rgba(26,26,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
            JALECA
          </span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>200.000+ peças vendidas</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              O jaleco certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferença</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
            </div>
          </div>
        </section>

            <EATBlock profession="dentista" />

    </main>
    </>
  )
}
