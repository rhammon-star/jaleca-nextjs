import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Uniformes para Gastronomia — Conforto e Praticidade para Cozinha Profissional | Jaleca 2026',
  description: 'Uniformes profissionais para gastronomia: nómã chef, jaleco cozinheiro, jaleco sushiman e churrasqueiro. Tecido resistente a manchas, calor e uso intenso. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-gastronomia' },
  openGraph: {
    title: 'Uniformes para Gastronomia — Conforto e Praticidade',
    description: 'Guia completo de uniformes para gastronomia: nómã chef, jaleco churrasqueiro, sushiman e cozinheiro.',
    url: 'https://jaleca.com.br/uniformes-gastronomia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes para Gastronomia — Conforto e Praticidade',
    description: 'Guia completo de uniformes para gastronomia: nómã chef, jaleco churrasqueiro, sushiman e cozinheiro.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o melhor tecido para uniforme de cozinha profissional?', acceptedAnswer: { '@type': 'Answer', text: 'O tecido com elastano (3–8%) e tratamento antipeling é o mais indicado para cozinhas profissionais. Oferece maleabilidade para movimento, resistência a manchas de gordura e secagem rápida. Na Jaleca, usamos gabardine técnica com toque suave e alta durabilidade.' } },
    { '@type': 'Question', name: 'Como manter o jaleco ou dolma limpo em cozinha profissional?', acceptedAnswer: { '@type': 'Answer', text: 'Lave imediatamente após o uso para evitar manchas de gordura fixadas. Use sabão neutro e água morna. O tecido Jaleca seca rápido e não precisa passar. Evite alvejante clorado — prefira alvejante sem cloro para preservar o tecido e a cor.' } },
    { '@type': 'Question', name: 'Qual a diferença entre dolma e jaleco para gastronomia?', acceptedAnswer: { '@type': 'Answer', text: 'A dolma tem caimento mais solto e tecido próprio para ambientes de cozinha quente — mais ventilada e fácil de limpar. O jaleco é mais moderno e leve, preferido em eventos, churrascarias e serviços de buffet. Para cozinha profissional de restaurante: dolma. Para eventos: jaleco gastronômico.' } },
    { '@type': 'Question', name: 'Como escolher o tamanho certo de jaleco ou dolma?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Na Jaleca, a tabela de medidas está na página de cada produto. O corte Slim é mais ajustado; o Profissional é mais amplo. Se estiver entre dois tamanhos, escolha o maior para liberdade de movimento em cozinha.' } },
  ],
}

const GASTRO_HUBS = [
  { href: '/dolma-cozinheiro',      titulo: 'Dólmã Cozinheiro',      desc: 'Padrão profissional · resistente a calor' },
  { href: '/dolma-churrasqueiro',   titulo: 'Dólmã Churrasqueiro',   desc: 'Brasa e gordura · dolma reforçado' },
  { href: '/dolma-sushiman',        titulo: 'Dólmã Sushiman',        desc: 'Branco imaculado · fácil lavagem' },
  { href: '/jaleco-cozinheiro',     titulo: 'Jaleco Cozinheiro',     desc: 'Alternativa ao dolma · leve e prático' },
  { href: '/jaleco-churrasqueiro',  titulo: 'Jaleco Churrasqueiro',  desc: 'Evento e churrascaria · estilo premium' },
  { href: '/jaleco-sushiman',       titulo: 'Jaleco Sushiman',       desc: 'Contemporâneo · eventos corporativos' },
]

async function getGastronomiaProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 50 })
    const slugs = ['churrasqueiro', 'churrasqueira', 'cozinheiro', 'cozinheira', 'sushiman', 'buffet', 'confeiteira', 'confeiteiro']
    const allProducts = data?.products?.nodes ?? []
    return allProducts.filter(p =>
      p.slug.includes('dolma') || p.slug.includes('scrub') ||
      slugs.some(s => p.slug.includes(s))
    ).slice(0, 6)
  } catch {
    return []
  }
}

function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>{'★'.repeat(full)}{half ? '½' : ''}</span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{rating.toFixed(1)} de 5 no Google</span>
    </div>
  )
}

export default async function Page() {
  const [produtos, placeData] = await Promise.all([
    getGastronomiaProducts(),
    getGooglePlaceData(),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Uniformes', href: '/produtos' },
              { label: 'Gastronomia', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section className="grid" style={{ gridTemplateColumns: '1fr 1fr', minHeight: '70vh', padding: 0 }}>
          <div className="flex flex-col justify-center" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}>
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme profissional
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(3rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Uniformes para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Gastronomia</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Conforto e praticidade para cozinha profissional.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos?cat=Dólmãs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Dólmãs →
              </Link>
              <Link href="/produtos?cat=Jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jalecos gastronômicos →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>
          <div className="relative" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'PP ao G3', sub: 'Grade completa' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Com elastano', sub: 'Movimento sem restrição' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>{item.icon}</div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── HUB LINKS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guias completos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '3rem' }}>
              Cada profissional<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>um modelo ideal</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {GASTRO_HUBS.map(hub => (
                <Link key={hub.href} href={hub.href} style={{ textDecoration: 'none', display: 'block', border: '1px solid #e8e4df', padding: '1.75rem 1.5rem', background: '#fff' }}>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia completo</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: "'Cormorant', Georgia, serif", color: '#1a1a1a', fontWeight: 500, marginBottom: '0.5rem' }}>{hub.titulo}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{hub.desc}</div>
                  <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em' }}>Ver guia →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção gastronomia</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
                Dólmãs e jalecos<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para cozinha</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link href="/produtos?cat=Dólmãs" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver todos →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre uniformes<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para gastronomia</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── OUTROS CLUSTERS ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Outros clusters</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {[
                { href: '/uniformes-profissionais-saude', label: 'Saúde' },
                { href: '/uniformes-beleza', label: 'Beleza' },
                { href: '/uniformes-servicos', label: 'Serviços' },
                { href: '/uniformes-escritorio', label: 'Escritório' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid #d4cfc9', color: '#666', textDecoration: 'none' }}>
                  Uniformes para {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, color: '#1a1a1a', marginBottom: '1rem' }}>
              O uniforme certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferença</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Dólmã ou jaleco. Do PP ao G3. Com elastano para total conforto. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?cat=Dólmãs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Dólmãs
              </Link>
              <Link href="/produtos?cat=Jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
