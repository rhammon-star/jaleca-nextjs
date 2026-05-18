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
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import UGCSection from '@/components/UGCSection'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco para Barbeiro: Estilo e Praticidade na Barbearia | Jaleca' },
  description: 'Jaleco para barbeiro em tecido premium com elastano. Modelos Slim e Profissional do PP ao G3. Frete grátis SP/RJ/MG/ES. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-barbeiro' },
  openGraph: {
    title: 'Jaleco para Barbeiro | Estilo e Praticidade — Jaleca',
    description: 'Qual jaleco usar na barbearia? Jaleco premium com elastano, caimento impecável e preço justo. Do PP ao G3. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-barbeiro',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Barbeiro | Estilo e Praticidade — Jaleca',
    description: 'Jaleco premium para barbeiro. Tecido de qualidade, caimento perfeito, preço justo. Do PP ao G3.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qual tecido o jaleco Jaleca para barbeiro utiliza?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos para barbeiros são confeccionados em tecido tecnológico, resistente a pelos, descolorantes e produtos químicos para garantir sua durabilidade." } },
    { '@type': 'Question', name: "Este jaleco oferece proteção contra manchas de tintura?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o tecido especial dos nossos jalecos repele a maioria das manchas de tintura e outros produtos químicos comuns em barbearias, facilitando a limpeza." } },
    { '@type': 'Question', name: "Como o corte do jaleco influencia no trabalho do barbeiro?", acceptedAnswer: { '@type': 'Answer', text: "Nosso corte é pensado para oferecer total liberdade de movimento, essencial para a precisão e agilidade que um barbeiro precisa em seu dia a dia." } },
    { '@type': 'Question', name: "É possível bordar o meu nome ou o logo da minha barbearia no jaleco?", acceptedAnswer: { '@type': 'Answer', text: "Com certeza! Oferecemos serviço de bordado personalizado para incluir seu nome, função ou o logo da sua barbearia, reforçando sua marca." } },
    { '@type': 'Question', name: "Este jaleco é adequado para uso em uma barbearia com alta demanda?", acceptedAnswer: { '@type': 'Answer', text: "Desenvolvido para o ambiente dinâmico da barbearia, nosso jaleco suporta a rotina intensa, mantendo a boa aparência e proteção por mais tempo." } },
    { '@type': 'Question', name: "Qual a durabilidade esperada para um jaleco de barbeiro Jaleca?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são feitos para serem altamente duráveis, resistindo a múltiplas lavagens e ao desgaste diário, um investimento que vale a pena." } },
    { '@type': 'Question', name: "Quais as instruções de lavagem para manter a qualidade do tecido?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos seguir as instruções na etiqueta para uma lavagem adequada, preservando as propriedades do tecido e a vivacidade da cor do seu jaleco." } },
    { '@type': 'Question', name: "Que cores de jaleco estão disponíveis para barbeiros?", acceptedAnswer: { '@type': 'Answer', text: "Disponibilizamos diversas opções de cores que combinam com o estilo moderno das barbearias, permitindo que você escolha o que melhor representa seu ambiente." } },
    { '@type': 'Question', name: "Os tamanhos de jaleco para barbeiro vão do PP ao G3?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossa grade de tamanhos abrange do PP ao G3, garantindo um ajuste perfeito e confortável para todos os biotipos de barbeiros." } },
    { '@type': 'Question', name: "Os jalecos têm bolsos práticos para tesouras e pentes?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são projetados com bolsos funcionais e bem distribuídos, ideais para armazenar suas ferramentas essenciais de trabalho com segurança e acesso rápido." } },
    { '@type': 'Question', name: "O comprimento do jaleco atrapalha o movimento na cadeira?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento é cuidadosamente balanceado para não atrapalhar o movimento ao redor da cadeira, combinando proteção e praticidade." } },
    { '@type': 'Question', name: "O jaleco para barbeiro possui manga curta ou longa?", acceptedAnswer: { '@type': 'Answer', text: "Temos opções de manga curta e longa para o jaleco de barbeiro, permitindo escolher a que melhor se adapta ao seu conforto e necessidade." } },
    { '@type': 'Question', name: "O estilo slim do jaleco é confortável para o dia todo?", acceptedAnswer: { '@type': 'Answer', text: "Nosso estilo slim é desenhado para ser elegante e confortável, proporcionando uma silhueta profissional sem restringir seus movimentos durante todo o dia." } },
    { '@type': 'Question', name: "Os jalecos Jaleca para barbeiros são mais resistentes a descolorantes do que os da concorrência?", acceptedAnswer: { '@type': 'Answer', text: "Sim, utilizamos tecnologias de tecido superiores que oferecem maior resistência a descolorantes e manchas, superando a maioria dos produtos no mercado." } },
    { '@type': 'Question', name: "A partir de qual preço consigo adquirir um jaleco para barbeiro?", acceptedAnswer: { '@type': 'Answer', text: "Você pode adquirir seu jaleco profissional para barbeiro a partir de R$159, um investimento acessível em qualidade e imagem para sua carreira." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para jalecos de barbeiro da Jaleca?", acceptedAnswer: { '@type': 'Answer', text: "O prazo de entrega para nossos jalecos é de 3 a 8 dias úteis, garantindo que você receba seu pedido com rapidez e eficiência." } },
    { '@type': 'Question', name: "Posso realizar a troca do jaleco se o tamanho não for o ideal?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos 7 dias para troca a partir do recebimento, caso o tamanho ou modelo não atendam às suas expectativas." } },
    { '@type': 'Question', name: "O frete é grátis para barbeiros em SP/RJ/MG/ES?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o frete é grátis para pedidos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." } },
    { '@type': 'Question', name: "Os jalecos para barbeiro possuem garantia?", acceptedAnswer: { '@type': 'Answer', text: "Nossos produtos possuem garantia contra defeitos de fabricação, assegurando a qualidade e sua satisfação com a compra." } },
    { '@type': 'Question', name: "O tecido do jaleco para barbeiro amassa com facilidade?", acceptedAnswer: { '@type': 'Answer', text: "Escolhemos tecidos que minimizam o amassado, garantindo que você mantenha uma aparência impecável e profissional durante todo o expediente." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Barbeiro: Estilo e Praticidade na Barbearia',
  description: 'Guia completo do jaleco para barbeiro: modelo ideal, tecido premium com elastano, estilo na barbearia e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-barbeiro',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Barbeiro', item: 'https://jaleca.com.br/jaleco-barbeiro' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão barbeiro
    const slugs = PROFESSION_PRODUCT_SLUGS['barbeiro'] ?? []
    const professionProducts = allProducts.filter(p => {
      // Produto mãe está na lista OU produto filho cujo pai está na lista
      if (slugs.includes(p.slug)) return true

      // Verifica se é produto filho (tem cor no slug)
      const parts = p.slug.split('-')
      const possibleColor = parts[parts.length - 1]
      const baseSlug = parts.slice(0, -1).join('-')

      return slugs.includes(baseSlug)
    })

    // Barbeiro: apenas produtos pretos (ou base slug sem variante de cor)
    const baseSlugs = new Set(slugs)
    const pretoOnly = professionProducts.filter(p =>
      p.slug.endsWith('-preto') || baseSlugs.has(p.slug)
    )

    const prioritized = prioritizeByColor(pretoOnly.length > 0 ? pretoOnly : professionProducts)

    // Retorna 6 produtos
    return prioritized.slice(0, 6)
  } catch (error) {
    console.error('[getJalecos] Error:', error)
    return []
  }
}function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  const schemaSpeakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.faq-section', 'h2'],
    },
  }

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

export default async function JalecoBarbeiroPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('barbeiro') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-barbeiro', 'https://jaleca.com.br/jaleco-barbeiro'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-barbeiro', 'https://jaleca.com.br/jaleco-barbeiro'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-barbeiro', "Jalecos para barbeiro"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-barbeiro'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-barbeiro', "Jaleco para barbeiro", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Barbeiro', href: null },
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
          h1Line2="Barbeiro"
          description="Estilo e praticidade para a barbearia moderna. Tecido premium com elastano."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção barbearia</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Barbeiros</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('barbeiro')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver mais →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST BAR — desceu pra depois da grade ── */}
        <CompactTrustBar />

        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        {/* ── UGC PROFISSIONAIS ── */}
        <UGCSection />


        {/* ── DESCRITIVO MODELOS — subiu pra antes do Guia ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco ideal para barbearia
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Estilo e imagem', anchor: '#estilo' },
                      { label: 'Modelo Slim ou Profissional', anchor: '#modelagem' },
                      { label: 'Cores para barbearia', anchor: '#cores' },
                      { label: 'Funcionalidade e bolsos', anchor: '#bolsos' },
                      { label: 'Cuidados e conservação', anchor: '#cuidados' },
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
                    id: 'estilo',
                    title: 'Estilo e imagem do barbeiro',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco do barbeiro comunica estilo tanto quanto funcionalidade. A barbearia moderna exige uma peça que transmita profissionalismo sem parecer antiquada.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco preto é a escolha mais popular entre barbeiros contemporâneos. Combina com a estética minimalista e sofisticada das barbearias modernas.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco certo transforma a presença do barbeiro. É a primeira coisa que o cliente nota antes de sentar na cadeira."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelagem',
                    title: 'Modelo Slim ou Profissional para barba e cabelo',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para a rotina agitada da barbearia, o modelo Slim oferece visual moderno e corte ajustado que não atrapalha durante o trabalho com tesoura e máquina.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim — Corte ajustado, visual moderno, ideal para barbearias com estética contemporânea e atendimento premium',
                            'Profissional — Corte mais amplo, mais espaço de movimento, escolha segura para qualquer estilo de barbearia',
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
                    title: 'Cores para barbearia moderna',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O preto domina as barbearias contemporâneas, mas o branco permanece como opção clássica e higiênica. A Jaleca oferece 12 cores em todos os modelos.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Tons discretos como marinho e cinza chumbo são alternativas sofisticadas que combinam com a paleta visual das barbearias modernas.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'bolsos',
                    title: 'Bolsos e funcionalidade no dia a dia',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O barbeiro precisa de jaleco com bolso no peito para canetas e ferramentas pequenas. Bolsos laterais reforçados são ideais para tesouras e pentes de corte.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Todos os jalecos Jaleca têm configuração de bolsos adequada para a rotina da barbearia — o bolso lateral não desplasta com o uso de tesouras.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'cuidados',
                    title: 'Cuidados e conservação do jaleco',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco de barbeiro acumula mais produtos capilares e gordura que a maioria. Lave a 60°C para remover resíduos de pomadas, géis e óleos.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para jalecos pretos, use sabão neutro e evite alvejante. Seque à sombra para preservar a cor. Com esses cuidados, a peça dura anos.
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

        {/* ── INSTAGRAM — desceu pra antes do FAQ ── */}
        <InstagramLazy />

        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para barbeiro</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG ── */}
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
                [
                  { title: 'Como lavar e conservar seu jaleco profissional', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o amarelamento e encurtam a vida do jaleco. Veja o guia completo.' },
                  { title: 'Jaleco preto: elegância na barbearia moderna', href: '/blog', tag: 'Barbearia', excerpt: 'Por que o jaleco preto é a escolha número um das barbearias contemporâneas e como escolher o modelo certo.' },
                  { title: 'Como escolher o tamanho certo do jaleco', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para medir busto, cintura e quadril e encontrar o tamanho ideal na grade Jaleca.' },
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

        {/* ── TOPICAL AUTHORITY ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de beleza</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Cabeleireiro', href: '/jaleco-cabeleireiro', desc: 'Guia completo' },
                { label: 'Esteticista', href: '/jaleco-esteticista', desc: 'Guia completo' },
                { label: 'Tatuador', href: '/jaleco-tatuador', desc: 'Guia completo' },
                { label: 'Massagista', href: '/jaleco-massagista', desc: 'Guia completo' },
                { label: 'Podólogo', href: '/jaleco-podologo', desc: 'Guia completo' },
                { label: 'Médico', href: '/jaleco-medico', desc: 'Guia completo' },
                { label: 'Dentista', href: '/jaleco-dentista', desc: 'Guia completo' },
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
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
              <Link href={getVerMaisUrl('barbeiro')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver mais
              </Link>
            </div>
          </div>
        </section>



      </main>
    </>
  )
}
