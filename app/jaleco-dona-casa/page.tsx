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

export const metadata: Metadata = {
  title: 'Jaleco para Dona de Casa: Praticidade e Proteção no Trabalho Doméstico | Jaleca 2026',
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
    { '@type': 'Question', name: 'Dona de casa precisa usar jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'O jaleco para dona de casa é uma questão de praticidade e proteção. Muita gente não sabe, mas o trabalho doméstico envolve exposição a produtos químicos, calor e gordura.' } },
    { '@type': 'Question', name: 'Qual o melhor modelo para trabalho doméstico?', acceptedAnswer: { '@type': 'Answer', text: 'O modelo com elastano é ideal porque permite liberdade de movimento durante as tarefas do dia a dia. A modelo Slim ou Profissional com bolsos é prática.' } },
    { '@type': 'Question', name: 'O jaleco protege contra produtos de limpeza?', acceptedAnswer: { '@type': 'Answer', text: 'O jaleco funciona como barreira entre a roupa e os produtos de limpeza, protegendo contra respingos de химикатов.' } },
    { '@type': 'Question', name: 'Posso usar o jaleco em casa?', acceptedAnswer: { '@type': 'Answer', text: 'Pode e é recomendado. O uso do jaleco exclusivamente em casa mantém a higiene e evita que sujeiras do ambiente doméstico contaminem outros espaços.' } },
    { '@type': 'Question', name: 'Como lavar o jaleco de uso doméstico?', acceptedAnswer: { '@type': 'Answer', text: 'Lave a 60°C para garantir a remoção de bactérias e fungos que se acumulam durante o trabalho doméstico.' } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dona de Casa: Praticidade e Proteção no Trabalho Doméstico',
  description: 'Guia completo do jaleco para dona de casa: praticidade, proteção contra produtos químicos, conforto e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
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
}

async function getHeroImage(): Promise<{ src: string; alt: string } | null> {
  try {
    const heroSlug = getHeroImageSlug('dona-casa')
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

export default async function JalecoDonaDeCasaPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
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
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}
        >
          <div className="flex flex-col justify-center order-2 lg:order-1 px-4 py-8 lg:px-16 lg:py-20" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Trabalho doméstico
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
              Jaleco para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Dona de Casa</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Praticidade e proteção no trabalho doméstico. Tecido premium com elastano.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos ↗
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
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Com elastano', sub: 'Movimento sem restrição' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca em 30 dias', sub: 'Sem burocracia' },
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
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção trabalho doméstico</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Donas de Casa</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
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

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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

        {/* ── PRODUTO — Detalhamento ── */}
        <ProductDetailSection productType="jaleco" />
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para dona de casa</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
