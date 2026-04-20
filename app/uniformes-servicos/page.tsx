import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Uniformes para Serviços: Jaleco Professor, Vendedor, Secretária | Jaleca',
  description: 'Uniformes profissionais para serviços: jaleco professor, jaleco vendedor, conjunto secretária e jaleco universitário. Conforto e profissionalismo para o dia a dia.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-servicos' },
  openGraph: {
    title: 'Uniformes para Serviços: Jaleco Professor, Vendedor e Mais | Jaleca',
    description: 'Guia completo de uniformes para profissionais de serviços: professor, vendedor, secretária e universitário.',
    url: 'https://jaleca.com.br/uniformes-servicos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes para Serviços: Jaleco Professor, Vendedor e Mais',
    description: 'Guia completo de uniformes para profissionais de serviços: professor, vendedor, secretária e universitário.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const SERVICOS_HUBS = [
  { href: '/jaleco-para-professor',    titulo: 'Professor',    desc: 'Conforto em sala · durabilidade · cores neutras' },
  { href: '/uniforme-para-professor',  titulo: 'Uniforme Professor', desc: 'Guia completo de uniformes escolares' },
  { href: '/jaleco-para-vendedor',     titulo: 'Vendedor',     desc: 'Imagem profissional · loja e varejo' },
  { href: '/jaleco-para-secretaria',   titulo: 'Secretária',   desc: 'Conjunto executivo · elegância corporativa' },
  { href: '/jaleco-universitario',     titulo: 'Universitário', desc: 'Jaleco aluno · prático e acessível' },
  { href: '/jaleco-para-dona-de-casa', titulo: 'Dona de Casa', desc: 'Jaleco prático · bolsos amplos' },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Uniformes para Profissionais de Serviços',
  description: 'Guia completo de uniformes para serviços: professor, vendedor, secretária e universitário.',
  url: 'https://jaleca.com.br/uniformes-servicos',
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  hasPart: SERVICOS_HUBS.map(h => ({
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
          <span>Uniformes para Serviços</span>
        </nav>

        <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.25rem' }}>
          Uniformes para<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Serviços</em>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, maxWidth: 620, marginBottom: '3rem' }}>
          Profissionais de serviços precisam de uniformes que transmitam organização e profissionalismo sem abrir mão do conforto para longas jornadas. Do jaleco professor ao conjunto secretária, cada profissão tem um modelo ideal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {SERVICOS_HUBS.map(hub => (
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
            Qual jaleco usar em serviços?
          </h2>
          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700 }}>
            <p><strong>Professor:</strong> jaleco leve em gabardine ou tricoline, bolso lateral fundo para caneta e marcador. Conforto em sala de aula com mobilidade para escrever no quadro. Cores neutras ou da instituição.</p>
            <p><strong>Vendedor:</strong> jaleco slim que projeta organização e confiança. Logotipo discreto da empresa, tecido antimanchas para longos turnos de loja. Modelagem que permite movimento natural ao atender clientes.</p>
            <p><strong>Secretária:</strong> conjunto (jaleco curto + calça ou saia) em cores sóbrias — preto, cinza, marinho. Tecido com caimento elegante que suporta expediente de 8h sentada sem amassar.</p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Outros clusters</div>
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
        </section>

        <div style={{ textAlign: 'center' }}>
          <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Ver todos os uniformes →
          </Link>
        </div>

      </main>
    </>
  )
}
