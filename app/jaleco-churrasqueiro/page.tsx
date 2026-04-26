import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getPosts, type WPPost } from '@/lib/wordpress'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'
import { PROFESSION_PRODUCT_SLUGS, prioritizeByColor, getVerMaisUrl } from '@/lib/product-professions'
import { getAllProducts } from '@/lib/all-products'
import { getHeroImageSlug } from '@/lib/profession-hero-images'

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
    { '@type': 'Question', name: 'Qual o melhor uniforme para churrasqueiro?', acceptedAnswer: { '@type': 'Answer', text: 'O churrasqueiro profissional trabalha em ambientes de alta temperatura e gordura. A Jaleca recomenda os dólares de cozinheiro — tecidos especiais que resistem a respingos de gordura.' } },
    { '@type': 'Question', name: 'Churrasqueiro pode usar jaleco comum?', acceptedAnswer: { '@type': 'Answer', text: 'O jaleco tradicional não é o mais indicado para churrasqueiro. O dólar Jaleca foi desenvolvido especificamente para a rotina da cozinha e churrascaria.' } },
    { '@type': 'Question', name: 'Dólmã é melhor que jaleco para churrasqueiro?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. O dólar tem corte mais reto, tecidos que não absorvem gordura facilmente e são mais ventilados. São a escolha padrão em cozinhas profissionais.' } },
    { '@type': 'Question', name: 'Churrasqueiro precisa de EPI?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Luvas de proteção, óculos e avental impermeável são EPIs obrigatórios. O dólar Jaleca é o uniforme base ideal para a função.' } },
    { '@type': 'Question', name: 'Como lavar o uniforme de churrasqueiro?', acceptedAnswer: { '@type': 'Answer', text: 'Lave a 60°C para remover gordura incrustada. Use sabão desengordurante. Seque à sombra para preservar o tecido.' } },
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
}

async function getHeroImage(): Promise<{ src: string; alt: string } | null> {
  try {
    const heroSlug = getHeroImageSlug('churrasqueiro')
    if (!heroSlug) return null

    const data = await graphqlClient.request<{ product: { name: string; image: { sourceUrl: string; altText: string } } | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug: heroSlug }
    )

    if (data?.product?.image?.sourceUrl) {
      return {
        src: data.product.image.sourceUrl,
        alt: data.product.image.altText || data.product.name
      }
    }
    return null
  } catch {
    return null
  }
}

async function getBlogPosts(): Promise<WPPost[]> {
  try {
    const posts = await getPosts({ per_page: 3, search: 'jaleco' })
    return posts.slice(0, 3)
  } catch {
    return []
  }
}

function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>
        {'★'.repeat(full)}{half ? '½' : ''}
      </span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>
        {rating.toFixed(1)} de 5 no Google
      </span>
    </div>
  )
}

export default async function JalecoChurrasqueiroPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getAllProducts(),
    getBlogPosts(),
    getGooglePlaceData(),
    getHeroImage(),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

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
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}
        >
          <div className="flex flex-col justify-center order-2 lg:order-1 px-4 py-8 lg:px-16 lg:py-20" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme profissional
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(3rem,5.5vw,5.2rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              Uniforme para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Churrasqueiro</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Dólmã resistente à gordura, conforto térmico e durabilidade para a rotina da churrascaria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link href="/produtos?categoria=dolmas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver dólar ↗
              </Link>
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver todos →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>

          <div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img
                src={heroImg.src}
                alt={heroImg.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0" style={{ background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'Tamanhos PP ao G3', sub: 'Grade completa, corpo real' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M12 2v8l4 4" /><circle cx="12" cy="14" r="8" /></svg>, title: 'Resistente à gordura', sub: 'Tecido profissional' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                {item.icon}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
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

        {/* ── PRODUTO — Detalhamento ── */}
        <ProductDetailSection productType="dolma" />
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

      </main>
    </>
  )
}
