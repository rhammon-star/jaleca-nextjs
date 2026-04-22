import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'

export const metadata: Metadata = {
  title: 'Jaleco Feminino: Estilo e Proteção para Profissionais | Jaleca',
  description: 'Veja opções de jaleco feminino para saúde. Modelos modernos, confortáveis e estilosos para médicas, dentistas e esteticistas. Frete grátis SE.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino' },
  openGraph: {
    title: 'Jaleco Feminino: Estilo e Proteção para Profissionais | Jaleca',
    description: 'Jaleco feminino com corte pensado para o corpo real. Elastano, caimento e modelos do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Feminino: Estilo e Proteção para Profissionais | Jaleca',
    description: 'Jaleco feminino com corte pensado para o corpo real. Elastano, caimento e modelos do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco feminino é melhor para médica?',
    a: 'Para médica em consultório ou clínica: jaleco em gabardine poliéster/viscose com elastano (150-165 g/m²), manga longa ou 3/4, com fechamento em botões e dois bolsos na altura do quadril. O elastano é essencial — jornadas de 8-12h exigem mobilidade total. O CFM não define cor obrigatória, mas branco é o padrão mais aceito nas instituições.',
  },
  {
    q: 'Jaleco feminino pode ser plus size?',
    a: 'Sim. A grade de uma boa marca de jaleco feminino vai do PP ao G3 — e G3 não é adaptação do G2 com mais tecido, é um molde próprio. Marcas sérias ajustam ombro, manga, busto e comprimento para cada grade. Se você usa entre G e G3 e o jaleco sempre fica apertado nos ombros ou curto demais, o problema é o molde, não o tamanho.',
  },
  {
    q: 'Como escolher o tecido certo para jaleco feminino?',
    a: 'Para atendimento clínico diário: gabardine com elastano (150-165 g/m²) — leve, sem amasso, lavagem a 40°C. Para procedimentos estéticos com exposição a produtos químicos: tecido DWR que repele líquidos. Para laboratório: gramatura maior (200+ g/m²). Evite algodão puro — amassa, encolhe e não mantém o caimento após lavagem frequente.',
  },
  {
    q: 'Jaleco feminino pode ser personalizado?',
    a: 'Sim. Bordado com nome e registro profissional é recomendado pelos principais conselhos — COFEN, CFM, COFFITO. Além do bordado de identificação, algumas marcas oferecem personalização de cor de vivo, botões e bolsos. Pergunte antes do pedido sobre prazo adicional para personalização.',
  },
  {
    q: 'Quais modelos de jaleco feminino são mais pedidos?',
    a: 'Os mais pedidos: jaleco reto com elástico na manga (Slim), jaleco com cava americana (Princesa), jaleco com abertura frontal em botão de pressão (Elastex). Cada modelo tem uma proposta diferente — o Slim valoriza o recorte no corpo, o Princesa tem visual mais despojado, o Elastex facilita a vestimenta rápida.',
  },
  {
    q: 'Jaleco feminino de qual cor é mais versátil?',
    a: 'Branco continua sendo o padrão universal — aceito em qualquer instituição e exige menos negociação com uniformes ou RH. Mas tonalidades como azul royal, rosa antigo e verde água têm crescido em estéticas e clínicas que querem identidade visual própria. Se for usar em hospital ou clínica conveniada ao SUS, confirme antes o protocolo da instituição.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para quem quer corte valorizado',
    desc: 'Recortes laterais que seguem a silhueta. Visual mais elegante, sem perder funcionalidade. Ideal para consultório e atendimento presencial.',
  },
  {
    nome: 'Jaleco Princesa',
    perfil: 'Para quem prefere leveza e fluidez',
    desc: 'Cava americana, manga leve, corte mais solto. Maior liberdade de movimento, ótimo para procedimentos estéticos e fisioterapia.',
  },
  {
    nome: 'Jaleco Elastex',
    perfil: 'Para quem precisa de praticidade',
    desc: 'Fechamento em elástico — veste e tira rápido. Popular em clínicas com trocas frequentes de uniforme ao longo do plantão.',
  },
  {
    nome: 'Jaleco Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados — não é só "mais tecido" no M. Mesmo caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-para-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-para-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-para-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-para-esteticista', label: 'Jaleco para Esteticista' },
  { href: '/jaleco-para-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-premium', label: 'Jaleco Premium' },
  { href: '/jaleco-estiloso', label: 'Jaleco Estiloso' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
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
    headline: 'Jaleco Feminino: Estilo e Proteção para Profissionais',
    description: 'Guia de jaleco feminino para profissionais da saúde e estética — modelos, tecidos e como escolher.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-feminino',
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
    ],
  }

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
              { label: 'Jaleco Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Para profissionais
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(2.4rem,5.5vw,4.8rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              Jaleco feminino:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>modelos modernos e confortáveis</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Com corte pensado para o corpo feminino real. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos femininos ↗
              </Link>
              <Link href="/jaleco-plus-size" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Plus size →
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

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Molde feminino real', sub: 'Não é o masculino adaptado' },
            { title: 'PP ao G3', sub: 'Grade completa, corpo real' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 30 dias', sub: 'Sem burocracia' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Jaleco feminino que é só o masculino com tamanho diferente não funciona. O ombro fica largo, a manga fica longa, o comprimento fica desproporcional. E o problema piora nos tamanhos maiores — o G3 de jaleco básico é literalmente mais tecido num molde que não foi pensado para aquele corpo.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Um jaleco feminino bem feito começa no molde: ombro ajustado ao ombro feminino, cava com amplitude certa, comprimento proporcional à altura real das profissionais que vão usar. O elastano no tecido resolve o resto — movimento de braço, agachamento, postura longa em atendimento.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os modelos, o que diferencia cada um e como escolher pelo tipo de trabalho.
            </p>
          </div>
        </section>

        {/* ── MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Modelos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Os principais modelos<br />de jaleco feminino
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>
                    {modelo.perfil}
                  </span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                    {modelo.nome}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/produtos?categoria=jalecos-femininos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>
                    Ver modelos →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Guia de tecidos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Qual tecido escolher<br />para jaleco feminino
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {[
                { uso: 'Consultório médico / odontológico', tecido: 'Gabardine poliéster/viscose + elastano 4-6%, 150-165 g/m²', porque: 'Leveza e mobilidade para jornadas longas. Sem amasso, lavagem a 40°C.' },
                { uso: 'Estética / procedimentos com produtos', tecido: 'Gabardine DWR (Durable Water Repellency)', porque: 'Repele líquidos e produtos químicos leves. A superfície resiste a respingos.' },
                { uso: 'Farmácia / laboratório', tecido: 'Gabardine pesado 200-240 g/m² ou antimicrobiano', porque: 'Barreira mecânica mais densa. Suporta lavagem a 60°C sem encolher.' },
                { uso: 'Fisioterapia / nutrição', tecido: 'Microfibra com elastano 120-140 g/m²', porque: 'A opção mais leve. Ideal para quem fica em movimento constante ou em cadeira durante atendimentos longos.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Uso</span>
                    <strong style={{ fontSize: '0.88rem', fontWeight: 500, color: '#1a1a1a' }}>{item.uso}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Tecido</span>
                    <span style={{ fontSize: '0.85rem', color: '#c8a96e' }}>{item.tecido}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Por quê</span>
                    <span style={{ fontSize: '0.82rem', color: '#4a4a4a', lineHeight: 1.65 }}>{item.porque}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Perguntas frequentes
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />jaleco feminino
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

        {/* ── LINKS INTERNOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>
              Guias por profissão
            </p>
            <div className="flex flex-wrap gap-3">
              {INTERNAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Jaleco que acompanha<br />a sua jornada.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Molde feminino. Do PP ao G3. Gabardine com elastano. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos femininos ↗
              </Link>
              <Link href="/jaleco-plus-size" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Plus size →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
