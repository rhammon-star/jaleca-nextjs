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
  title: { absolute: 'Jaleco para Dona de Casa: Praticidade e Proteção no Trabalho Doméstico | Jaleca' },
  description: 'Jaleco para dona de casa em tecido premium com elastano. Modelo prático e confortável para o trabalho doméstico. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-dona-casa' },
  openGraph: {
    title: 'Jaleco para Dona de Casa | Praticidade e Proteção — Jaleca',
    description: 'Qual jaleco usar em casa? Jaleco premium com elastano, confortável e prático para o trabalho doméstico. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-dona-casa',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Dona de Casa | Praticidade e Proteção — Jaleca',
    description: 'Jaleco premium para dona de casa. Tecido de qualidade, conforto, preço justo. Frete grátis.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qual a característica principal do tecido do jaleco Jaleca para uso doméstico?", acceptedAnswer: { '@type': 'Answer', text: "Nosso jaleco para dona de casa é feito com tecido leve e de fácil lavagem, ideal para o dia a dia, garantindo conforto e praticidade." } },
    { '@type': 'Question', name: "O jaleco para dona de casa protege contra manchas de cozinha?", acceptedAnswer: { '@type': 'Answer', text: "Sim, ele oferece uma excelente barreira contra respingos de alimentos e molhos, protegendo suas roupas de baixo de manchas e odores da cozinha." } },
    { '@type': 'Question', name: "O corte do jaleco é confortável para as atividades diárias em casa?", acceptedAnswer: { '@type': 'Answer', text: "Com um corte solto e prático, nosso jaleco permite total liberdade de movimento para cozinhar, limpar e realizar todas as tarefas domésticas com conforto." } },
    { '@type': 'Question', name: "É possível bordar um detalhe divertido ou um nome no jaleco da dona de casa?", acceptedAnswer: { '@type': 'Answer', text: "Sim! Personalize seu jaleco com um bordado do seu nome ou uma frase divertida, tornando-o único e com um toque pessoal para o seu lar." } },
    { '@type': 'Question', name: "Este jaleco é versátil para diferentes tarefas domésticas?", acceptedAnswer: { '@type': 'Answer', text: "Absolutamente. Ele é ideal para cozinhar, limpar, cuidar do jardim ou até mesmo para artesanato, oferecendo proteção e praticidade em diversas atividades." } },
    { '@type': 'Question', name: "Qual a durabilidade de um jaleco Jaleca para uso doméstico?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são feitos para durar, suportando lavagens frequentes e o uso diário, sendo um item confiável e duradouro para sua casa." } },
    { '@type': 'Question', name: "Como devo lavar o jaleco para mantê-lo sempre limpo e cheiroso?", acceptedAnswer: { '@type': 'Answer', text: "Lave-o regularmente com detergente comum. Para manchas persistentes, pré-trate antes da lavagem. Siga sempre as instruções da etiqueta para melhor conservação." } },
    { '@type': 'Question', name: "Quais cores de jaleco estão disponíveis para o uso doméstico?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos uma variedade de cores alegres e discretas que combinam com o ambiente de casa, adicionando um toque de estilo e funcionalidade ao seu dia." } },
    { '@type': 'Question', name: "Os tamanhos de jaleco para dona de casa abrangem do PP ao G3?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossa linha de tamanhos vai do PP ao G3, garantindo um caimento confortável e adequado para todas as donas de casa." } },
    { '@type': 'Question', name: "O jaleco tem bolsos práticos para guardar o celular ou anotações?", acceptedAnswer: { '@type': 'Answer', text: "Sim, ele possui bolsos convenientes para guardar seu celular, lista de compras ou outros pequenos itens, mantendo tudo sempre à mão." } },
    { '@type': 'Question', name: "O comprimento do jaleco é ideal para proteger a roupa enquanto se agacha ou se estica?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento foi projetado para oferecer boa cobertura, protegendo suas roupas enquanto você se move livremente pela casa, sem atrapalhar suas tarefas." } },
    { '@type': 'Question', name: "O jaleco para dona de casa está disponível com manga curta ou longa?", acceptedAnswer: { '@type': 'Answer', text: "Temos opções de manga curta para os dias mais quentes e manga longa para proteção adicional ou para climas mais frios, proporcionando versatilidade." } },
    { '@type': 'Question', name: "O estilo do jaleco para dona de casa é mais casual e funcional?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o estilo é pensado para ser funcional e casual, proporcionando um visual arrumado e protegido para as atividades domésticas sem perder o conforto." } },
    { '@type': 'Question', name: "Os jalecos Jaleca para dona de casa são mais práticos de lavar que os da concorrência?", acceptedAnswer: { '@type': 'Answer', text: "Nossos tecidos são selecionados para facilitar a lavagem e a secagem rápida, tornando-os mais práticos para o dia a dia do que muitos concorrentes." } },
    { '@type': 'Question', name: "Qual o preço de partida para um jaleco confortável para uso doméstico?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos para dona de casa estão disponíveis a partir de R$159, um investimento acessível em conforto e proteção para seu lar." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para meu jaleco de dona de casa?", acceptedAnswer: { '@type': 'Answer', text: "Seu jaleco será entregue em 3 a 8 dias úteis, para que você possa desfrutar rapidamente da praticidade e proteção no seu dia a dia em casa." } },
    { '@type': 'Question', name: "Posso trocar o jaleco se o tamanho não for o que eu esperava?", acceptedAnswer: { '@type': 'Answer', text: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou modelo não sejam os ideais para você." } },
    { '@type': 'Question', name: "Há frete grátis para compras de jalecos de dona de casa acima de R$499 em SP/RJ/MG/ES?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos frete grátis para pedidos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo, facilitando sua compra." } },
    { '@type': 'Question', name: "O jaleco de dona de casa possui garantia?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos jalecos vêm com garantia contra defeitos de fabricação, assegurando a sua satisfação e a qualidade do produto." } },
    { '@type': 'Question', name: "O tecido do jaleco para dona de casa é leve e respirável para o uso contínuo?", acceptedAnswer: { '@type': 'Answer', text: "Priorizamos tecidos leves e respiráveis que garantem conforto térmico, ideal para o uso contínuo em todas as estações do ano dentro de casa." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dona de Casa: Praticidade e Proteção no Trabalho Doméstico',
  description: 'Guia completo do jaleco para dona de casa: praticidade, proteção contra produtos químicos, conforto e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/jaleco-dona-casa',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Para Dona de Casa', item: 'https://jaleca.com.br/jaleco-dona-casa' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão dona-de-casa
    const slugs = PROFESSION_PRODUCT_SLUGS['dona-de-casa'] ?? []
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

export default async function JalecoDonaDeCasaPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('dona-casa') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-dona-casa', 'https://jaleca.com.br/jaleco-dona-casa'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-dona-casa', 'https://jaleca.com.br/jaleco-dona-casa'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-dona-casa', "Jalecos para dona casa"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-dona-casa'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-dona-casa', "Jaleco para dona casa", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Dona de Casa', href: null },
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
          eyebrow="Trabalho doméstico"
          h1Line1="Jaleco para"
          h1Line2="Dona de Casa"
          description="Praticidade e proteção no trabalho doméstico. Tecido premium com elastano."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
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
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção trabalho doméstico</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Donas de Casa</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('dona-casa')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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
                  Por que usar jaleco em casa
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Proteção e praticidade', anchor: '#protecao' },
                      { label: 'Modelo ideal', anchor: '#modelo' },
                      { label: 'Tecido com elastano', anchor: '#tecido' },
                      { label: 'Produtos de limpeza', anchor: '#limpeza' },
                      { label: 'Conservação e higiene', anchor: '#higiene' },
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
                    id: 'protecao',
                    title: 'Proteção e praticidade no trabalho doméstico',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Muita gente não sabe, mas o trabalho doméstico envolve exposição constante a produtos químicos agressivos, calor do fogão e gordura da cozinha.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco funciona como uma barreira de proteção que preserva a roupa everyday e reduz o contato direto com produtos de limpeza.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "Usar jaleco em casa é uma forma simples de proteger sua saúde e manter suas roupas em bom estado por mais tempo."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelo',
                    title: 'Modelo ideal para o trabalho doméstico',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O modelo com elastano é o mais indicado porque permite liberdade total de movimento durante as tarefas do dia a dia — passar pano, cozinhar, organizar.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim — Corte ajustado, visual moderno, ideal para quem quer um jaleco que não atrapalhe durante o trabalho',
                            'Profissional — Corte mais amplo, mais espaço de movimento, escolha prática para o dia a dia em casa',
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
                    id: 'tecido',
                    title: 'Tecido com elastano: liberdade de movimento',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O elastano adiciona memória ao tecido — ele retorna à forma após cada movimento. Isso faz diferença real para quem passa horas em movimento em casa.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Todos os jalecos Jaleca têm elastano. São os mais confortáveis do mercado para uso doméstico prolongado.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'limpeza',
                    title: 'Proteção contra produtos de limpeza',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Produtos de limpeza contêm химикатов que podem irritar a pele e manchar a roupa. O jaleco funciona como uma camada de proteção adicional.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para limpeza pesada com химикатов fortes, use também luvas de borracha sobre o jaleco. Essa combinação oferece proteção completa.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'higiene',
                    title: 'Conservação e higiene do jaleco doméstico',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Lave o jaleco a 60°C após cada semana de uso para garantir a remoção de bactérias e fungos que se acumulam durante o trabalho doméstico.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Use sabão neutro e alvejante sem cloro para preservar o tecido. Seque à sombra para manter a cor e a integridade do material.
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
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para dona de casa</em>
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
                  { title: 'Jaleco para trabalho doméstico', href: '/blog', tag: 'Trabalho Doméstico', excerpt: 'Por que usar jaleco em casa e como escolher o modelo ideal para o trabalho doméstico.' },
                  { title: 'Como escolher o tamanho certo', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para medir e encontrar o tamanho ideal na grade Jaleca.' },
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
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos
              </Link>
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver todos
              </Link>
            </div>
          </div>
        </section>



      </main>
    </>
  )
}
