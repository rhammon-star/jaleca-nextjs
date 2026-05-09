import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import UGCSection from '@/components/UGCSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco para Massoterapia: Leve, Confortável e Profissional | Jaleca',
  description: 'Jaleco para massoterapia com amplitude de movimento, tecido leve e corte acinturado. Modelos Slim e Elastex para massoterapeuta. Do PP ao G3, entrega rápida.',
  keywords: 'jaleco massoterapia, jaleco massoterapeuta, jaleco para massoterapia, uniforme massoterapeuta, jaleco estetica massoterapia',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-massoterapia' },
  openGraph: {
    title: 'Jaleco para Massoterapia | Jaleca',
    description: 'Jaleco leve e confortável para massoterapeuta. Amplitude de movimento, tecido premium, do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-massoterapia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco para Massoterapia | Jaleca',
    description: 'Jaleco leve e confortável para massoterapeuta. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco é mais indicado para massoterapia?',
    a: 'Para massoterapia, o jaleco ideal tem tecido leve com elastano para máxima amplitude de movimento dos braços e ombros. O Jaleco Elastex da Jaleca é o mais indicado — tecido com elastano bidirecional que cede em todas as direções, sem apertar durante os movimentos de massagem. O modelo Princesa também é muito usado por massoterapeutes que preferem manga curta ou 3/4.',
  },
  {
    q: 'Massoterapeuta precisa usar jaleco?',
    a: 'Não há exigência legal específica para massoterapeutas, mas o jaleco é recomendado em clínicas e spas como parte da apresentação profissional — transmite higiene, profissionalismo e confiança ao cliente. Em ambientes como centros de estética integrados a clínicas médicas, o jaleco pode ser obrigatório pelo protocolo da instituição.',
  },
  {
    q: 'Qual cor de jaleco usar na massoterapia?',
    a: 'As cores mais usadas na massoterapia são branco, bege, rosê e tons de azul claro — cores que transmitem tranquilidade e bem-estar, alinhadas à proposta terapêutica. Algumas clínicas de luxo optam por preto ou grafite para um visual mais sofisticado. O protocolo de cor varia por estabelecimento.',
  },
  {
    q: 'Jaleco de massoterapia pode ter manga curta?',
    a: 'Sim, e é até preferível. A manga curta oferece mais liberdade de movimento para os braços durante os movimentos de massagem e evita que a manga roze no cliente. O modelo Princesa com manga curta ou 3/4 é o mais escolhido por massoterapeutes.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos por Profissão', item: 'https://jaleca.com.br/categoria/jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Massoterapia', item: 'https://jaleca.com.br/jaleco-massoterapia' },
  ],
}

export default async function Page() {
  const [placeData, heroImg] = await Promise.all([
    getGooglePlaceData(),
    getCachedHeroImage('jaleco-slim-feminino-lateral-jaleca'),
  ])

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco Massoterapia', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}>
          <div className="flex flex-col justify-center order-2 lg:order-1" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}>
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Para massoterapeuta
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco para massoterapia:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>leve, confortável e profissional</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Amplitude de movimento para cada técnica de massagem. Tecido com elastano bidirecional que acompanha cada movimento sem restringir. Do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos ↗
              </Link>
              <Link href="/jaleco-massagista" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jaleco para massagista →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
          <div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img src={heroImg.src} alt={heroImg.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* CONTEÚDO */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              O que o jaleco de massoterapia<br />precisa ter
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e5e0d8', marginBottom: '3rem' }}>
              {[
                { titulo: 'Elastano bidirecional', texto: 'O tecido precisa ceder nos dois eixos — para frente, para os lados e acima da cabeça. Sem elastano, o jaleco puxa nos ombros durante os movimentos de massagem e cansa mais rápido.' },
                { titulo: 'Leveza', texto: 'A massoterapeuta fica em movimento constante durante horas. Tecidos pesados cansam mais. O Jaleco Elastex da Jaleca tem 140 g/m² — leve o suficiente para jornadas longas sem sobreaquecer.' },
                { titulo: 'Manga curta ou 3/4', texto: 'Manga curta elimina o atrito do tecido com o cliente durante a massagem. A manga 3/4 é uma opção intermediária para ambientes com ar-condicionado. O comprimento ideal depende do protocolo da clínica.' },
                { titulo: 'Corte feminino real', texto: 'Jaleco masculino adaptado não funciona para massoterapia — o ombro fica largo, o comprimento fica errado. Os moldes da Jaleca são desenvolvidos do zero para o corpo feminino, em cada tamanho do PP ao G3.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.3rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.titulo}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <ProfessionProductGrid
          professionKey="esteticista"
          professionLabel="Massoterapeuta"
          collectionLabel="Jalecos para Massoterapia"
          productLabel="Jalecos"
          allHref="/categoria/jalecos-femininos"
        />

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre jaleco<br />para massoterapia
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* LINKS INTERNOS */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Profissões relacionadas</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/jaleco-massagista', label: 'Jaleco para Massagista' },
                { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
                { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
                { href: '/jaleco-feminino', label: 'Jaleco Feminino — guia completo' },
                { href: '/jaleco-elegante', label: 'Jaleco Elegante' },
                { href: '/categoria/jalecos-femininos', label: 'Ver todos os jalecos' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Jaleco que acompanha<br />cada movimento.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Elastano bidirecional, leve, do PP ao G3. Entrega rápida para todo o Brasil.
            </p>
            <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver jalecos ↗
            </Link>
          </div>
        </section>

            <UGCSection />

    </main>
    </>
  )
}
