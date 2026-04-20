import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Uniformes para Gastronomia: Jaleco e Dólmã Chef, Sushiman e Churrasqueiro | Jaleca',
  description: 'Uniformes profissionais para gastronomia: dólmã chef, jaleco cozinheiro, jaleco sushiman e churrasqueiro. Tecido resistente a manchas, calor e uso intenso.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-gastronomia' },
  openGraph: {
    title: 'Uniformes para Gastronomia: Dólmã e Jaleco Chef | Jaleca',
    description: 'Guia completo de uniformes para gastronomia: dólmã chef, jaleco churrasqueiro, sushiman e cozinheiro.',
    url: 'https://jaleca.com.br/uniformes-gastronomia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes para Gastronomia: Dólmã e Jaleco Chef | Jaleca',
    description: 'Guia completo de uniformes para gastronomia: dólmã chef, jaleco churrasqueiro, sushiman e cozinheiro.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const GASTRO_HUBS = [
  { href: '/dolma-para-cozinheiro',      titulo: 'Dólmã Cozinheiro',      desc: 'Padrão profissional · resistente a calor' },
  { href: '/dolma-para-churrasqueiro',   titulo: 'Dólmã Churrasqueiro',   desc: 'Brasa e gordura · dólmã reforçado' },
  { href: '/dolma-para-sushiman',        titulo: 'Dólmã Sushiman',        desc: 'Branco imaculado · fácil lavagem' },
  { href: '/jaleco-para-cozinheiro',     titulo: 'Jaleco Cozinheiro',     desc: 'Alternativa ao dólmã · leve e prático' },
  { href: '/jaleco-para-churrasqueiro',  titulo: 'Jaleco Churrasqueiro',  desc: 'Evento e churrascaria · estilo premium' },
  { href: '/jaleco-para-sushiman',       titulo: 'Jaleco Sushiman',       desc: 'Contemporâneo · eventos corporativos' },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Uniformes para Gastronomia',
  description: 'Guia completo de uniformes para gastronomia: dólmã chef, jaleco churrasqueiro, sushiman e cozinheiro.',
  url: 'https://jaleca.com.br/uniformes-gastronomia',
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  hasPart: GASTRO_HUBS.map(h => ({
    '@type': 'WebPage',
    name: h.titulo,
    url: `https://jaleca.com.br${h.href}`,
  })),
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)' }}>

        <nav style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Jaleca</Link>
          {' › '}
          <span>Uniformes para Gastronomia</span>
        </nav>

        <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.25rem' }}>
          Uniformes para<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Gastronomia</em>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, maxWidth: 620, marginBottom: '3rem' }}>
          Dólmã ou jaleco: cada profissional de gastronomia tem uma escolha. O dólmã é o padrão clássico de cozinha profissional — botões de pressão, manga dupla, tecido grosso que protege contra respingos e calor. O jaleco é mais leve e moderno, preferido em eventos e churrascarias ao ar livre.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {GASTRO_HUBS.map(hub => (
            <Link key={hub.href} href={hub.href} style={{ textDecoration: 'none', display: 'block', border: '1px solid #e8e4df', padding: '1.75rem 1.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia completo</div>
              <div style={{ fontSize: '1.2rem', fontFamily: "'Cormorant', Georgia, serif", color: '#1a1a1a', fontWeight: 500, marginBottom: '0.5rem' }}>{hub.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{hub.desc}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em' }}>Ver guia →</div>
            </Link>
          ))}
        </div>

        <section style={{ borderTop: '1px solid #e8e4df', paddingTop: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
            Dólmã vs Jaleco: qual escolher na gastronomia?
          </h2>
          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700 }}>
            <p>O <strong>dólmã</strong> é o padrão das cozinhas profissionais: manga dupla (proteção contra vapor e faca), botões de pressão (remoção rápida em emergência), tecido 100% algodão ou misto de 280-300 g/m². Ideal para quem trabalha em cozinha quente com exposição constante a calor e respingos.</p>
            <p>O <strong>jaleco gastronômico</strong> é mais moderno: tecido mais leve, modelagem contemporânea, melhor para eventos ao ar livre, churrascaria, serviços de buffet ou ambientes com ar condicionado. Muitos têm tratamento DWR (water repellent) para repelir molhos e gorduras.</p>
            <p>Para cozinha profissional de restaurante: dólmã. Para eventos e serviços fora da cozinha: jaleco gastronômico.</p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Outros clusters</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { href: '/uniformes-profissionais-para-saude', label: 'Saúde' },
              { href: '/uniformes-beleza', label: 'Beleza' },
              { href: '/uniformes-servicos', label: 'Serviços' },
              { href: '/uniformes-escritorio', label: 'Escritório' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid #d4cfc9', color: '#666', textDecoration: 'none' }}>
                Uniformes para {l.label} →
              </Link>
            ))}
          </div>
        </section>

        <div style={{ textAlign: 'center' }}>
          <Link href="/produtos?cat=Dólmãs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Ver todos os dólmãs e jalecos →
          </Link>
        </div>

      </main>
    </>
  )
}
