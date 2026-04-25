import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Uniformes Profissionais para Serviços — Elegância e Conforto | Jaleca 2026',
  description: 'Uniformes profissionais para serviços: jaleco professor, vendedor, conjunt professor, vendedor e secretary. Conforto e profissionalismo para o dia a dia.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-servicos' },
  openGraph: {
    title: 'Uniformes para Serviços — Elegância e Conforto | Jaleca',
    description: 'Guia completo de uniformes para profissionais de serviços: professor, vendedor, secretary e universitário.',
    url: 'https://jaleca.com.br/uniformes-servicos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes para Serviços — Elegância e Conforto | Jaleca',
    description: 'Guia completo de uniformes para profissionais de serviços: professor, vendedor, secretary e universitário.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual tecido é mais resistente para uniforme de serviços?', acceptedAnswer: { '@type': 'Answer', text: 'Gabardine e crepe são os mais usados em uniformes de serviços por sua resistência a amassados e facilidade de lavagem. Tecidos com elastano adicionam conforto e memória de forma. Para quem fica muito tempo sentado, o crepe acetinado oferece melhor queda e não marca.' } },
    { '@type': 'Question', name: 'Como escolher o uniforme ideal para cada tipo de serviço?', acceptedAnswer: { '@type': 'Answer', text: 'Considere três fatores: (1) movimento necessário — quem anda muito precisa de tecido respirável; (2) formalidade do ambiente — escritório exige tecido mais estruturado; (3) tempo de uso — para longas jornadas, priorize conforto e tecido fácil de lavar. A Jaleca tem modelagem Slim (moderna) e Profissional (mais ampla).' } },
    { '@type': 'Question', name: 'Qual o prazo de entrega dos uniformes?', acceptedAnswer: { '@type': 'Answer', text: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme região — calculado no checkout com o CEP. Capitais do Sudeste geralmente recebem em 3 a 5 dias. Frete grátis para compras acima de R$499 em SP, RJ, MG e ES.' } },
    { '@type': 'Question', name: 'Como funciona a troca de tamanho?', acceptedAnswer: { '@type': 'Answer', text: 'Aceita troca em até 30 dias após o recebimento. Produto sem uso e com etiqueta. Manda mensagem pelo WhatsApp ou e-mail com o número do pedido — só isso. Não tem burocracia: é só entrar em contato e we envie a peça no tamanho certo.' } },
  ],
}

const SERVICOS_HUBS = [
  { href: '/jaleco-para-professor',    titulo: 'Professor',    desc: 'Conforto em sala · durabilidade · cores neutras' },
  { href: '/uniforme-para-professor',  titulo: 'Uniforme Professor', desc: 'Guia completo de uniformes escolares' },
  { href: '/jaleco-para-vendedor',     titulo: 'Vendedor',     desc: 'Imagem profissional · loja e varejo' },
  { href: '/jaleco-para-secretaria',   titulo: 'Secretária',   desc: 'Conjunto executivo · elegância corporativa' },
  { href: '/jaleco-universitario',     titulo: 'Universitário', desc: 'Jaleco aluno · prático e acessível' },
  { href: '/jaleco-para-dona-de-casa', titulo: 'Dona de Casa', desc: 'Jaleco prático · bolsos amplos' },
]

async function getServicosProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 50 })
    const slugs = ['professor', 'vendedor', 'secretaria', 'aluno', 'universitario', 'estudante', 'dona-de-casa']
    const allProducts = data?.products?.nodes ?? []
    return allProducts.filter(p => slugs.some(s => p.slug.includes(s))).slice(0, 6)
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
    getServicosProducts(),
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
              { label: 'Serviços', href: null },
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
              Uniformes Profissionais<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>para Serviços</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Elegância e conforto para o dia a dia.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos?cat=Jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jalecos →
              </Link>
              <Link href="/produtos?cat=Conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Conjuntos →
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
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca em 30 dias', sub: 'Sem burocracia' },
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
              {SERVICOS_HUBS.map(hub => (
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
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção serviços</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
                Jalecos e conjuntos<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para profissionais</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <Link href="/produtos?cat=Jalecos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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
              Perguntas sobre uniformes<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para serviços</em>
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
                { href: '/uniformes-profissionais-para-saude', label: 'Saúde' },
                { href: '/uniformes-beleza', label: 'Beleza' },
                { href: '/uniformes-gastronomia', label: 'Gastronomia' },
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
              Do PP ao G3. Elastano para total conforto. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?cat=Jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Jalecos
              </Link>
              <Link href="/produtos?cat=Conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Conjuntos
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
