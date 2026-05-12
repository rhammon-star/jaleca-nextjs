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
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Uniforme para Churrasqueiro: Dólmã Resistente à Gordura | Jaleca' },
  description: 'Uniforme profissional para churrasqueiro. Dólmã de cozinheiro resistente à gordura, conforto térmico e durabilidade. Frete grátis SP/RJ/MG/ES. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-churrasqueiro' },
  openGraph: {
    title: 'Uniforme para Churrasqueiro | Dólmã Resistente — Jaleca',
    description: 'Qual uniforme usar na churrascaria? Dólmã profissional resistente à gordura, conforto térmico e preço justo. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-churrasqueiro',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Uniforme para Churrasqueiro | Dólmã Resistente — Jaleca',
    description: 'Dólmã profissional para churrasqueiro. Tecido resistente, conforto térmico, preço justo. Frete grátis.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "O tecido do jaleco Jaleca para churrasqueiro é resistente ao calor?", acceptedAnswer: { '@type': 'Answer', text: "Nosso jaleco para churrasqueiro é feito com tecido robusto e resistente a altas temperaturas, oferecendo proteção extra contra o calor da brasa." } },
    { '@type': 'Question', name: "Este jaleco oferece proteção contra respingos de gordura e molhos?", acceptedAnswer: { '@type': 'Answer', text: "Com certeza! O tecido do nosso jaleco possui um tratamento que repele respingos de gordura e molhos, facilitando a limpeza e protegendo suas roupas." } },
    { '@type': 'Question', name: "O corte do jaleco de churrasqueiro permite movimentos amplos ao manusear a carne?", acceptedAnswer: { '@type': 'Answer', text: "O corte é especialmente desenhado para garantir total liberdade de movimento, essencial para virar a carne, cortar e manusear os utensílios com conforto e segurança." } },
    { '@type': 'Question', name: "É possível bordar o meu nome ou o logo do meu negócio de churrasco no jaleco?", acceptedAnswer: { '@type': 'Answer', text: "Sim, personalizamos seu jaleco com bordado do seu nome ou o logo da sua churrascaria, agregando profissionalismo e estilo à sua marca." } },
    { '@type': 'Question', name: "O jaleco Jaleca é adequado para um ambiente de churrascaria profissional?", acceptedAnswer: { '@type': 'Answer', text: "Perfeitamente! Nosso jaleco foi pensado para o ambiente exigente de uma churrascaria, unindo proteção, durabilidade e um visual imponente." } },
    { '@type': 'Question', name: "Qual a durabilidade de um jaleco de churrasqueiro da Jaleca?", acceptedAnswer: { '@type': 'Answer', text: "Projetamos nossos jalecos para churrasqueiros para serem extremamente duráveis, resistindo ao uso constante e às condições do ambiente da churrasqueira." } },
    { '@type': 'Question', name: "Quais são as melhores práticas de lavagem para o jaleco de churrasqueiro?", acceptedAnswer: { '@type': 'Answer', text: "Para remover gordura e odores, recomendamos lavagem com água quente e sabão desengordurante, seguindo as instruções da etiqueta para manter a qualidade." } },
    { '@type': 'Question', name: "Quais cores de jaleco estão disponíveis para churrasqueiros?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos cores que disfarçam melhor as manchas e realçam a sua presença, como tons terrosos e escuros, ideais para o churrasqueiro." } },
    { '@type': 'Question', name: "Vocês possuem tamanhos grandes para churrasqueiros, como G3?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossa grade de tamanhos vai do PP ao G3, garantindo que todo churrasqueiro encontre um jaleco que vista perfeitamente e com conforto." } },
    { '@type': 'Question', name: "O jaleco tem bolsos funcionais para utensílios de churrasco?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos possuem bolsos robustos e acessíveis, perfeitos para guardar termômetro de carne, pegador pequeno ou isqueiro, sempre à mão." } },
    { '@type': 'Question', name: "O comprimento do jaleco é ideal para proteger a parte superior das pernas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o comprimento é cuidadosamente projetado para oferecer proteção estendida, cobrindo a parte superior das pernas contra respingos e calor." } },
    { '@type': 'Question', name: "O jaleco de churrasqueiro possui opções de manga para diferentes necessidades?", acceptedAnswer: { '@type': 'Answer', text: "Disponibilizamos jalecos com manga longa para máxima proteção ou manga curta para maior conforto em climas quentes, adaptando-se ao seu estilo." } },
    { '@type': 'Question', name: "O estilo profissional do jaleco realça a imagem do churrasqueiro?", acceptedAnswer: { '@type': 'Answer', text: "Com um design imponente e profissional, nosso jaleco eleva a imagem do churrasqueiro, transmitindo paixão e maestria pela arte da brasa." } },
    { '@type': 'Question', name: "Os jalecos Jaleca para churrasqueiros são mais resistentes a fogo e chamas do que os concorrentes?", acceptedAnswer: { '@type': 'Answer', text: "Utilizamos tecidos com maior gramatura e tratamento que confere uma resistência superior a chamas e faíscas comparado a outros no mercado." } },
    { '@type': 'Question', name: "Qual o investimento inicial para um jaleco de churrasqueiro de alta performance?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos de churrasqueiro começam a partir de R$159, um valor que reflete a qualidade e a segurança que você merece ao lado da brasa." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para meu jaleco de churrasqueiro?", acceptedAnswer: { '@type': 'Answer', text: "Seu jaleco chegará em suas mãos com rapidez, em um prazo de 3 a 8 dias úteis, para que você possa brilhar na sua próxima churrascada." } },
    { '@type': 'Question', name: "É possível realizar a troca do jaleco se ele não servir bem?", acceptedAnswer: { '@type': 'Answer', text: "Sim, você tem até 7 dias para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não sejam os ideais para você." } },
    { '@type': 'Question', name: "O frete é grátis para pedidos de jalecos de churrasqueiro acima de R$499 em alguns estados?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos frete grátis para compras acima de R$499 nos estados de SP, RJ, MG e ES, uma comodidade para os amantes do churrasco." } },
    { '@type': 'Question', name: "O jaleco de churrasqueiro possui garantia de fabricação?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos jalecos vêm com garantia contra defeitos de fabricação, assegurando que você receba um produto de alta qualidade." } },
    { '@type': 'Question', name: "O tecido do jaleco para churrasqueiro ajuda a diminuir odores de fumaça?", acceptedAnswer: { '@type': 'Answer', text: "Embora não elimine odores completamente, o tecido de alta densidade e de fácil limpeza ajuda a minimizar a impregnação de fumaça, facilitando a higiene." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Uniforme para Churrasqueiro: Dólmã Resistente à Gordura',
  description: 'Guia completo do uniforme para churrasqueiro: dólar profissional, resistência à gordura, conforto térmico e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-churrasqueiro',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
    { '@type': 'ListItem', position: 3, name: 'Para Churrasqueiro', item: 'https://jaleca.com.br/jaleco-churrasqueiro' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão churrasqueiro
    const slugs = PROFESSION_PRODUCT_SLUGS['churrasqueiro'] ?? []
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

export default async function JalecoChurrasqueiroPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getAllProducts(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('churrasqueiro') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-churrasqueiro', 'https://jaleca.com.br/jaleco-churrasqueiro'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-churrasqueiro', 'https://jaleca.com.br/jaleco-churrasqueiro'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-churrasqueiro', "Jalecos para churrasqueiro"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Produtos', href: '/produtos' },
              { label: 'Para Churrasqueiro', href: null },
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
          h1Line1="Uniforme para"
          h1Line2="Churrasqueiro"
          description="Dólmã resistente à gordura, conforto térmico e durabilidade para a rotina da churrascaria."
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
              <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção churrascaria</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Dólmãs para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Churrasqueiros</em>
                  </h2>
                </div>
                <Link href="/produtos?categoria=dolmas" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
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
        <ProductDetailSection productType="dolma" />

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o uniforme ideal para churrascaria
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Dólmã vs Jaleco', anchor: '#dolma' },
                      { label: 'Resistência à gordura', anchor: '#gordura' },
                      { label: 'Conforto térmico', anchor: '#termico' },
                      { label: 'EPIs obrigatórios', anchor: '#epis' },
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
                    id: 'dolma',
                    title: 'Dólmã vs Jaleco: qual é melhor para churrasqueiro',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O dólar é o uniforme padrão em cozinhas profissionais e churrascarias. Diferente do jaleco, o dólar tem um corte mais reto e é feito com tecidos que não absorvem gordura facilmente.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O dollar é mais ventilado, mais fácil de lavar e mais durável em ambiente de alta temperatura e gordura. Para o churrasqueiro profissional, é a escolha óbvia.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "Na churrascaria, o dólar não é só uma questão de estética — é uma ferramenta de trabalho que precisa resistir ao ambiente mais hostil da cozinha."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'gordura',
                    title: 'Resistência à gordura: por que o tecido importa',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O churrasqueiro está exposto a respingos constantes de gordura. Um tecido que absorve gordura fica manchado permanentemente e começa a feder — um problema higiênico e de imagem.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Os dólares Jaleca são feitos com tecidos profissionais que repelem gordura e são fáceis de lavar. A diferença é sentida já na primeira lavagem.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'termico',
                    title: 'Conforto térmico na churrascaria',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Trabalhar perto da brasa é quente. O dólar Jaleca tem estrutura de tecido que permite maior circulação de ar, mantendo o churrasqueiro mais fresco durante o serviço.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O elastano nos dollars Jaleca adiciona flexibilidade ao movimento sem sacrificar a ventilação. É a combinação ideal de conforto e funcionalidade.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'epis',
                    title: 'EPIs obrigatórios para churrasqueiro',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O dólar Jaleca é o uniforme base, mas não substitui os EPIs. Luvas resistentes ao calor são obrigatórias para manipular a carne na brasa. Óculos de proteção protegem contra respingos de gordura.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O avental impermeável é essencial para proteger a pernas e o tronco contra respingos. Com o uniforme certo e os EPIs adequados, o churrasqueiro trabalha com segurança.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'cuidados',
                    title: 'Cuidados e conservação do dólar',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Lave o dólar a 60°C com sabão desengordurante para remover a gordura incrustada. Nunca use alvejante com cloro — isso danifica o tecido e remove a proteção.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Seque à sombra para preservar a cor e a integridade do tecido. Com os cuidados certos, um dólar Jaleca dura anos mesmo em uso intensivo de churrascaria.
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
              Perguntas sobre uniforme<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para churrasqueiro</em>
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
                  { title: 'Como lavar e conservar seu dólar de cozinheiro', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem danificam o tecido profissional. Veja como conservar seu dólar por mais tempo.' },
                  { title: 'Dólmã vs Jaleco: qual o melhor para cozinha', href: '/blog', tag: 'Gastronomia', excerpt: 'Entenda a diferença entre dólar e jaleco e qual é a escolha certa para cada tipo de cozinha.' },
                  { title: 'Como escolher o tamanho certo do dólar', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para medir e encontrar o tamanho ideal na grade Jaleca.' },
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
              Dólmã para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de gastronomia</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Cozinheiro', href: '/jaleco-cozinheiro', desc: 'Guia completo' },
                { label: 'Sushiman', href: '/jaleco-sushiman', desc: 'Guia completo' },
                { label: 'Confeiteiro', href: '/produtos', desc: 'Ver produtos' },
                { label: 'Bar', href: '/produtos', desc: 'Ver produtos' },
                { label: 'Cabeleireiro', href: '/jaleco-cabeleireiro', desc: 'Guia completo' },
                { label: 'Esteticista', href: '/jaleco-esteticista', desc: 'Guia completo' },
                { label: 'Podólogo', href: '/jaleco-podologo', desc: 'Guia completo' },
                { label: 'Ver todos', href: '/produtos', desc: 'Loja completa' },
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
              O dólar certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferença</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do PP ao G3. Tecido profissional. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?categoria=dolmas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Dólmãs
              </Link>
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver todos
              </Link>
            </div>
          </div>
        </section>
      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />



      </main>
    </>
  )
}
