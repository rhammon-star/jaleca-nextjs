import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const metadata: Metadata = {
  title: 'Scrub Médico: Pijama Cirúrgico para Saúde do PP ao G3 | Jaleca',
  description: 'Scrub médico com elastano para UTI, CC e emergência. Conjunto calça + blusa antimicrobiano, lavagem a 60°C. Feminino e masculino do PP ao G3. Frete grátis SE acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/scrub-medico' },
  openGraph: {
    title: 'Scrub Médico: Pijama Cirúrgico para Saúde do PP ao G3 | Jaleca',
    description: 'Scrub médico com elastano para UTI, CC e emergência. Feminino e masculino do PP ao G3.',
    url: 'https://jaleca.com.br/scrub-medico',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scrub Médico: Pijama Cirúrgico para Saúde do PP ao G3 | Jaleca',
    description: 'Scrub médico com elastano. Feminino e masculino do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Scrub médico e pijama cirúrgico são a mesma coisa?',
    a: 'Sim — nomes diferentes para o mesmo produto. "Scrub" é o termo americano adotado no Brasil. "Pijama cirúrgico" é o nome técnico mais usado em protocolos hospitalares. Os dois se referem ao conjunto calça + blusa de uso exclusivo em ambiente hospitalar.',
  },
  {
    q: 'Qual tecido é melhor para scrub médico?',
    a: 'Poliéster com acabamento antimicrobiano para ambientes de alto risco (UTI, CC, emergência) — suporta lavagem a 60°C e reduz colonização bacteriana entre lavagens. Com elastano bidirecional para plantões longos — acompanha os movimentos sem fadiga do tecido.',
  },
  {
    q: 'Scrub médico pode substituir o jaleco no consultório?',
    a: 'Pode em clínicas e consultórios que adotaram o modelo americano. O scrub está em crescimento acelerado em hospitais brasileiros como substituto do jaleco em UTI, CC e emergência. Em consultório particular, o jaleco ainda é o padrão mais aceito pelo paciente.',
  },
  {
    q: 'Qual cor de scrub médico é padrão no Brasil?',
    a: 'Verde é o padrão histórico em centro cirúrgico. Azul em UTI. Rosê em obstetrícia. Branco em clínica geral. Em hospitais modernos, a cor indica o setor — facilita a identificação da equipe em emergências. Clínicas particulares têm liberdade de escolha.',
  },
  {
    q: 'Scrub médico feminino tem molde diferente do masculino?',
    a: 'Tem. O feminino tem cava menor, cintura mais definida e comprimento de blusa proporcional à altura feminina. O masculino tem ombros mais amplos e blusa mais reta. Usar o masculino em mulher resulta em ombro largo e comprimento errado.',
  },
  {
    q: 'Scrub médico pode ser lavado em casa?',
    a: 'Para uso hospitalar, a NR-32 recomenda que o scrub seja lavado na instituição para evitar contaminação cruzada. Para clínicas particulares e consultórios de baixo risco, lavagem doméstica a 60°C com sabão comum é aceita. Nunca leve o scrub hospitalar para casa.',
  },
]

const MODELOS = [
  {
    nome: 'Scrub Clássico',
    perfil: 'Para hospital e plantão',
    desc: 'Blusa gola V + calça reta com elástico. Padrão em UTI, CC e emergência. Antimicrobiano, lavagem a 60°C. Feminino e masculino.',
  },
  {
    nome: 'Scrub Premium',
    perfil: 'Para clínica particular',
    desc: 'Corte mais ajustado com elastano bidirecional. Visual moderno para clínicas particulares que querem identidade visual própria com conforto para o dia inteiro.',
  },
  {
    nome: 'Scrub Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio por tamanho — não é só mais tecido. Calça com elástico e cordão. Blusa com corte proporcional ao corpo real.',
  },
]

const INTERNAL_LINKS = [
  { href: '/pijama-cirurgico-feminino', label: 'Pijama Cirúrgico Feminino' },
  { href: '/jaleco-medico-feminino', label: 'Jaleco Médico Feminino' },
  { href: '/jaleco-enfermagem-feminino', label: 'Jaleco Enfermagem Feminino' },
  { href: '/jaleco-para-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-para-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/uniformes-profissionais-para-saude', label: 'Uniformes para Saúde' },
]

export default async function Page() {
  const placeData = await getGooglePlaceData()

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Scrub Médico: Pijama Cirúrgico para Saúde do PP ao G3',
    description: 'Guia de scrub médico — tecidos, normas hospitalares e como escolher pelo setor.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    url: 'https://jaleca.com.br/scrub-medico',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Uniformes para Saúde', item: 'https://jaleca.com.br/uniformes-profissionais-para-saude' },
      { '@type': 'ListItem', position: 3, name: 'Scrub Médico', item: 'https://jaleca.com.br/scrub-medico' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Uniformes para Saúde', href: '/uniformes-profissionais-para-saude' },
              { label: 'Scrub Médico', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Pijama cirúrgico
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Scrub médico:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>UTI, centro cirúrgico e plantão</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Conjunto calça + blusa com elastano bidirecional. Antimicrobiano, lavagem a 60°C. Feminino e masculino do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos ↗
              </Link>
              <Link href="/pijama-cirurgico-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Feminino →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
        </section>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Antimicrobiano', sub: 'Prata iônica entre lavagens' },
            { title: 'Lavagem a 60°C', sub: 'Protocolo hospitalar' },
            { title: 'Feminino e masculino', sub: 'Molde próprio por gênero' },
            { title: 'PP ao G3', sub: 'Grade completa' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        <ProfessionProductGrid
          professionKey="cirurgico"
          professionLabel="Médicos e Enfermeiros"
          collectionLabel="Scrubs Médicos"
          productLabel="Scrubs"
          allHref="/produtos?categoria=conjuntos"
        />

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O scrub médico chegou aos hospitais brasileiros como tendência americana e ficou. Em UTI, centro cirúrgico e emergência, o conjunto calça + blusa substituiu o jaleco — o profissional troca completamente a roupa ao entrar no setor, sem levar contaminação externa para dentro.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O tecido certo para scrub médico: poliéster antimicrobiano com elastano bidirecional. Aguenta lavagem a 60°C sem deformar, o antimicrobiano reduz colonização bacteriana entre lavagens e o elastano acompanha os movimentos de um plantão de 12h sem travar.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Modelos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Scrub médico:<br />qual modelo escolher
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>{modelo.perfil}</span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{modelo.nome}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/produtos?categoria=conjuntos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>Ver modelos →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />scrub médico
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Guias relacionados</p>
            <div className="flex flex-wrap gap-3">
              {INTERNAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}>{link.label}</Link>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Conforto para<br />o plantão inteiro.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Feminino e masculino. Do PP ao G3. Antimicrobiano e elastano. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos ↗
              </Link>
              <Link href="/pijama-cirurgico-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Feminino →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
