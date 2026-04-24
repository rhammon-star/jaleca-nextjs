import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { graphqlClient, GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getPosts, type WPPost } from '@/lib/wordpress'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'
import { PROFESSION_PRODUCT_SLUGS } from '@/lib/product-professions'

export const metadata: Metadata = {
  title: 'Dolma para Churrasqueiro: Conforto e Durabilidade para Churrascarias | Jaleca 2026',
  description: 'Dolma para churrasqueiro em tecido técnico para cozinha profissional. Antiderrapante, fácil limpeza, maleabilidade. Frete grátis SP/RJ/MG/ES acima R$499. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/dolma-para-churrasqueiro' },
  openGraph: {
    title: 'Dolma para Churrasqueiro | Conforto e Durabilidade — Jaleca',
    description: 'Dolma profissional para churrasqueiro. Tecido técnico, antiderrapante, fácil limpeza e maleabilidade para cozinha. Frete grátis.',
    url: 'https://jaleca.com.br/dolma-para-churrasqueiro',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Dolma para Churrasqueiro | Jaleca',
    description: 'Dolma profissional para churrasqueiro. Tecido técnico para cozinha. Frete grátis.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Dolma para churrasqueiro é diferente do jaleco comum?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. A dolma tem caimento mais solto e tecido técnico resistente a gordura e umidade. É própria para ambientes de cozinha quente onde o jaleco comum seria desconfortável e difícil de limpar.' } },
    { '@type': 'Question', name: 'Dolma pode ser usada em churrascaria?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. A dolma é amplamente usada em churrascarias e espetarias por oferecer conforto térmico, liberdade de movimento e fácil manutenção. É mais prática que o jaleco tradicional em ambientes de churrasco.' } },
    { '@type': 'Question', name: 'Qual o melhor tecido para dolma de churrasqueiro?', acceptedAnswer: { '@type': 'Answer', text: 'O tecido com elastano e tratamento antipeling é o mais indicado. Oferece maleabilidade para movimento, resistência a manchas de gordura e secagem rápida após lavagem.' } },
    { '@type': 'Question', name: 'Dolma para churrasqueiro precisa de proteção térmica?', acceptedAnswer: { '@type': 'Answer', text: 'Para exposição direta ao charcoal ou brasas, indicamos avental de couro ou algodão grosso por cima. A dolma protege contra respingos de gordura, mas não é um EPI contra calor extremo.' } },
    { '@type': 'Question', name: 'Como manter a dolma limpa em ambiente de churrascaria?', acceptedAnswer: { '@type': 'Answer', text: 'Lave imediatamente após o uso para evitar manchas de gordura fixadas. Use sabão neutro e água morna. O tecido técnico Jaleca seca rápido e não precisa passar. Evite alvejante.' } },
    { '@type': 'Question', name: 'Dolma ou jaleco: qual é melhor para churrasqueiro?', acceptedAnswer: { '@type': 'Answer', text: 'Para a área de preparo e serviço de churrascaria, a dolma é mais prática por ser mais ventilada e fácil de limpar. Para área de fuego direto (montagem da carne na grelha), o jaleco pode ser mais adequado dependendo do estilo da churrascaria.' } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Dolma para Churrasqueiro: Conforto e Durabilidade para Churrascarias',
  description: 'Guia completo da dolma para churrasqueiro: tecido técnico, conforto em cozinha quente, diferença entre dolma e jaleco, e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/dolma-para-churrasqueiro',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Dolmas', item: 'https://jaleca.com.br/produtos?categoria=dolmas' },
    { '@type': 'ListItem', position: 3, name: 'Para Churrasqueiro', item: 'https://jaleca.com.br/dolma-para-churrasqueiro' },
  ],
}

async function getDolmas(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, {
      first: 50,
    })
    const churrasqueiroSlugs = PROFESSION_PRODUCT_SLUGS['churrasqueiro'] ?? []
    const products = data?.products?.nodes ?? []
    return products.filter(p => churrasqueiroSlugs.includes(p.slug) || p.slug.includes('dolma') || p.slug.includes('scrub')).slice(0, 6)
  } catch {
    return []
  }
}

async function getHeroImage(): Promise<{ src: string; alt: string } | null> {
  try {
    const data = await graphqlClient.request<{ product: { name: string; image: { sourceUrl: string; altText: string } } }>(
      GET_PRODUCT_BY_SLUG,
      { slug: 'dolma-churrasqueiro-jaleca' }
    )
    const img = data?.product?.image
    if (!img?.sourceUrl) return null
    return { src: img.sourceUrl, alt: img.altText || data.product.name }
  } catch {
    return null
  }
}

async function getBlogPosts(): Promise<WPPost[]> {
  try {
    const posts = await getPosts({ per_page: 3, search: 'churrasco cozinha' })
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

export default async function DolmaChurrasqueiroPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getDolmas(),
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
              { label: 'Dolmas', href: '/produtos?categoria=dolmas' },
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
        <section
          className="grid"
          style={{ gridTemplateColumns: '1fr 1fr', minHeight: '88vh', padding: 0 }}
        >
          <div
            className="flex flex-col justify-center"
            style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Roupa profissional
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
              Dolma para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Churrasqueiro</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Conforto e durabilidade para a cozinha da churrascaria.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos?categoria=dolmas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Dolmas →
              </Link>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>

          <div className="relative" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
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
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'Tamanhos PP ao G3', sub: 'Grade completa, corpo real' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Tecido técnico', sub: 'Resistente a gordura' },
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
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção churrascaria</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Dolmas para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Churrasqueiros</em>
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
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher a dolma ideal para churrascaria
                </h2>
                <nav>
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Tecido e composição', anchor: '#tecido' },
                      { label: 'Dolma vs Jaleco', anchor: '#diferenca' },
                      { label: 'Conforto em cozinha quente', anchor: '#calor' },
                      { label: 'Limpeza e manutenção', anchor: '#limpeza' },
                      { label: 'Segurança na cozinha', anchor: '#seguranca' },
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
                          Churrasqueiro trabalha em ambiente quente e graxo. O tecido da dolma precisa ser resistente a manchas, permitir ventilação e ser fácil de lavar.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Na Jaleca, as dolmas têm elastano e tratamento antipeling, o que significa que resistem a manchas de gordura e mantêm a aparência mesmo após múltiplas lavagens.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "A dolma certa não atrapalha no calor da grelha — ela acompanha o churrasqueiro sem prender."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'diferenca',
                    title: 'Dolma vs Jaleco: qual escolher para churrascaria?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A dolma tem caimento mais solto e é mais ventilada que o jaleco tradicional. É ideal para serviço de churrascaria onde o churrasqueiro precisa de liberdade de movimento.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Dolma — caimento solto, mais ventilada, ideal para serviço e preparo',
                            'Jaleco — caimento mais ajustado, mais formal, ideal para área de atendimento',
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
                    id: 'calor',
                    title: 'Conforto em cozinha quente',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A dolma Jaleca é mais ventilada que o jaleco tradicional. O tecido técnico permite que o ar circule melhor, reduzindo o calor acumulado durante o serviço.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para exposição direta ao calor extremo da grelha, indicamos usar um avental por cima da dolma para proteção adicional.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'limpeza',
                    title: 'Limpeza e manutenção',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A dolma mancha menos que o jaleco porque o tecido técnico Jaleca tem tratamento que repele líquidos e facilita a remoção de manchas de gordura.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Lave imediatamente após o uso com sabão neutro e água morna. O tecido seca rápido e não precisa passar. Evite alvejante para preservar o tratamento.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'seguranca',
                    title: 'Segurança na cozinha',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A dolma não é um EPI contra calor extremo ou fogo. Para trabalho direta com brasas, useEquipment de proteção adequado como avental de couro.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A dolma Jaleca protege contra respingos de gordura e sujeira do dia a dia da churrascaria, mas não substitui EPIs específicos para alta temperatura.
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

        {/* ── DETALHAMENTO ── */}
        <ProductDetailSection productType="dolma" />
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre dolma<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para churrasqueiro</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── BLOG ── */}
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
                  { title: 'Como lavar e conservar sua dolma profissional', href: '/blog/como-lavar-dolma', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o desgaste da dolma. Veja o guia completo.' },
                  { title: 'Dolma vs Jaleco: qual escolher para sua cozinha', href: '/blog/dolma-vs-jaleco', tag: 'Gastronomia', excerpt: 'Comparativo entre dolma e jaleco para profissionais de cozinha.' },
                  { title: 'Como escolher o tamanho certo da dolma', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para medir e encontrar o tamanho ideal na grade Jaleca.' },
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
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Dolmas para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de cozinha</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Cozinheiro', href: '/dolma-para-cozinheiro', desc: 'Guia completo' },
                { label: 'Sushiman', href: '/dolma-para-sushiman', desc: 'Guia completo' },
                { label: 'Ver todos', href: '/produtos?categoria=dolmas', desc: 'Loja completa' },
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
              A dolma certa<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para sua cozinha</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do PP ao G3. Tecido técnico resistente a gordura. Secagem rápida. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?categoria=dolmas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Completa
              </Link>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}