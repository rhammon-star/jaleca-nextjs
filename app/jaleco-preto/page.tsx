import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import PretoProductGrid from '@/components/PretoProductGrid'

export const metadata: Metadata = {
  title: 'Jaleco Preto Profissional — Estética, Barbeiro e Chef | Jaleca',
  description: 'Jaleco preto para esteticistas, cabeleireiros, tatuadores e chefs. Tecido que não desbota, confortável para o dia todo. PP ao G3. Frete grátis SP, RJ, MG e ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-preto' },
  openGraph: {
    title: 'Jaleco Preto Profissional — Estética, Barbeiro e Chef | Jaleca',
    description: 'Jaleco preto para esteticistas, cabeleireiros, tatuadores e chefs. Tecido que não desbota, confortável.',
    url: 'https://jaleca.com.br/jaleco-preto',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    q: 'O jaleco preto desbota com lavagem frequente?',
    a: 'Não, se você seguir as instruções: água fria ou morna (máx. 30°C), sem alvejante, secar à sombra. O tecido gabardine com elastano preto mantém a cor por muito mais tempo que algodão puro. O que desbota jaleco preto é água quente e amaciante — os dois atacam o corante do tecido.',
  },
  {
    q: 'Jaleco preto é permitido em clínicas e hospitais?',
    a: 'Depende do protocolo da instituição. Em clínicas privadas e estúdios de estética, beleza e gastronomia: sem restrição, preto é padrão nesses setores. Em hospitais e UBSs conveniados ao SUS, pode haver exigência de branco ou da cor do setor. Verifique com a chefia ou RH antes de usar jaleco preto em ambiente hospitalar.',
  },
  {
    q: 'Jaleco preto é mais quente que o branco?',
    a: 'Em teoria sim — preto absorve mais calor. Na prática, com tecido gabardine de 150-165 g/m² e elastano, a diferença é mínima no ambiente interno de clínicas e salões. O que mais influencia é a gramatura e a ventilação do local, não a cor.',
  },
  {
    q: 'Como tirar manchas de tinta de cabelo do jaleco preto?',
    a: 'Aja rápido — tinta de cabelo seca cola no tecido. Aplique removedor de manchas diretamente no ponto, deixe agir 5 minutos e enxague com água fria. Se já secou, use removedor específico para tinta têxtil e lave normalmente em seguida. Evite esfregar — danifica a trama do tecido.',
  },
  {
    q: 'Tem jaleco preto masculino e feminino?',
    a: 'Sim. O jaleco preto feminino tem corte ajustado com elastano bidirecional, opções Slim e Princesa, do PP ao G3. O masculino tem modelagem clássica com manga longa e botões frontais. Ambos estão disponíveis em branco, preto e outras cores.',
  },
]

const PROFISSOES = [
  { href: '/jaleco-para-esteticista', label: 'Esteticista', desc: 'Repele produtos estéticos, lava fácil' },
  { href: '/jaleco-para-cabeleireiro', label: 'Cabeleireiro', desc: 'Não retém fios, resiste a tinturas' },
  { href: '/jaleco-para-barbeiro', label: 'Barbeiro', desc: 'Corte limpo, visual moderno' },
  { href: '/jaleco-para-tatuador', label: 'Tatuador', desc: 'Preto padrão em estúdios' },
  { href: '/jaleco-para-cozinheiro', label: 'Chef / Cozinheiro', desc: 'Disfarça respingos, lavagem industrial' },
  { href: '/jaleco-para-massagista', label: 'Massagista', desc: 'Conforto para movimentos longos' },
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Preto', item: 'https://jaleca.com.br/jaleco-preto' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco Preto', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              Para profissionais
              <span style={{ display: 'inline-block', width: 32, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff', marginBottom: '1.5rem' }}>
              Jaleco preto:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.7)' }}>elegância que não desbota</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.55)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Para esteticistas, cabeleireiros, tatuadores e chefs. Preto intenso, tecido que aguenta lavagem frequente e não perde o caimento.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/jaleco-preto-feminino" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Jaleco Preto Feminino →
              </Link>
              <Link href="/categoria/jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem', background: 'transparent', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                Ver Masculinos →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
        </section>

        {/* ── PRODUTOS — Above the Fold ── */}
        <PretoProductGrid />

        {/* ── PROFISSÕES ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por profissão
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Quem usa jaleco preto
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px,100%), 1fr))', gap: '1rem' }}>
              {PROFISSOES.map((p, i) => (
                <Link key={i} href={p.href} style={{ display: 'block', border: '1px solid #e5e0d8', padding: '1.5rem', textDecoration: 'none' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.4rem' }}>{p.label}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{p.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTEÚDO SEO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco preto ganhou espaço por um motivo prático: em estética, beleza e gastronomia, o branco fica marcado rápido. Respingo de tinta de cabelo, produto de limpeza de pele ou molho do mise en place — o preto disfarça o cotidiano de quem trabalha com as mãos.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Além da praticidade, o jaleco preto tem apelo visual forte. Em barbearias modernas, estúdios de tatuagem e clínicas de estética premium, preto virou padrão visual do setor — aparece nas fotos, combina com a decoração e transmite um visual de seriedade diferente do branco tradicional.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              O ponto crítico é a qualidade do tecido. Jaleco preto barato desbota após 5-10 lavagens e vira um cinza sem graça. O gabardine com elastano da Jaleca mantém o preto intenso com lavagem em temperatura baixa e sem alvejante — as mesmas condições que você já usa para qualquer peça escura de qualidade.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Dúvidas
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Perguntas sobre jaleco preto
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.q}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROVA SOCIAL ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Confiança
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Jalecos pretos que não perdem a cor
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginTop: '2.5rem' }}>
              {[
                { numero: '200.000+', label: 'peças vendidas de jalecos escuros' },
                { numero: 'PP ao G3', label: 'grade completa' },
                { numero: 'Desde 2010', label: 'lojas físicas' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1 }}>
                    {item.numero}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b6b6b', marginTop: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
              Escolha seu jaleco preto
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Feminino e masculino disponíveis. Entrega para todo o Brasil.
            </p>
            <Link href="/jaleco-preto-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver jaleco preto feminino →
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
