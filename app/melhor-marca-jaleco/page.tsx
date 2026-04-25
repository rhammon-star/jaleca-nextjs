import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'

export const metadata: Metadata = {
  title: 'Melhor Marca de Jaleco em 2026: Qual Escolher?',
  description: 'Descubra a melhor marca de jaleco para profissionais da saúde. Veja dicas, diferenciais e recomendações para médicos, dentistas e esteticistas!',
  alternates: { canonical: 'https://jaleca.com.br/melhor-marca-jaleco' },
  openGraph: {
    title: 'Melhor Marca de Jaleco em 2026: Qual Escolher?',
    description: 'Qual a melhor marca de jaleco para profissionais da saúde? Comparativo técnico de materiais, acabamento e custo-benefício.',
    url: 'https://jaleca.com.br/melhor-marca-jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melhor Marca de Jaleco em 2026: Qual Escolher?',
    description: 'Qual a melhor marca de jaleco para profissionais da saúde? Comparativo técnico de materiais, acabamento e custo-benefício.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Como saber se uma marca de jaleco é confiável?',
    a: 'Avalie a reputação da marca, os materiais usados, o acabamento das costuras e os comentários de outros profissionais da mesma área. Marcas sérias informam a gramatura do tecido, a composição e oferecem troca sem burocracia. Desconfie de jalecos sem etiqueta técnica ou com preço muito abaixo do mercado — geralmente o tecido cede ou desbota nas primeiras lavagens.',
  },
  {
    q: 'Jaleco de marca dura mais tempo?',
    a: 'Sim, em geral. Marcas especializadas em uniformes profissionais investem em tecidos testados para lavagem frequente — o jaleco de profissional de saúde pode ir à máquina 3 a 5 vezes por semana. Um tecido de qualidade inferior perde o caimento e a cor em 30 a 60 ciclos. Marcas com histórico no segmento usam gabardine com poliéster ≥60%, que mantém estabilidade dimensional por 150+ lavagens.',
  },
  {
    q: 'Posso personalizar um jaleco de marca conhecida?',
    a: 'Sim. Bordado com nome e registro profissional é padrão nos principais conselhos de saúde — COFEN, CFM e COFFITO recomendam identificação visível no jaleco. Marcas especializadas como a Jaleca oferecem bordado personalizado direto no pedido, sem custo adicional em pedidos acima de um determinado volume.',
  },
  {
    q: 'Qual tecido é melhor num jaleco de qualidade?',
    a: 'Para uso clínico diário: gabardine poliéster/viscose com elastano (150-165 g/m²) — leve, sem amasso, lavagem a 40°C. Para laboratório e manipulação: tecido com gramatura ≥200 g/m² ou com tratamento DWR. Para farmácia: composição ≥60% poliéster que suporta lavagem a 60°C sem encolher.',
  },
  {
    q: 'Vale a pena pagar mais caro por uma marca de jaleco?',
    a: 'Depende da frequência de uso. Quem trabalha 5 dias por semana e lava o jaleco com frequência vai perceber a diferença em 3 meses. O custo por uso de um jaleco R$180 que dura 2 anos é muito menor que 3 jalecos de R$60 que precisam ser trocados em 8 meses. A conta fecha no médio prazo.',
  },
  {
    q: 'A Jaleca é uma boa marca de jaleco?',
    a: 'A Jaleca é especializada em uniformes para profissionais de saúde e estética — jalecos com gabardine de elastano, grade PP ao G3, e entrega para todo o Brasil. A nota no Google é 4,9/5, com feedback consistente sobre durabilidade e acabamento. Para quem busca custo-benefício com qualidade técnica, é uma das opções mais bem avaliadas no segmento.',
  },
]

const DIFERENCIAIS = [
  {
    titulo: 'Tecido e gramatura',
    desc: 'O dado mais objetivo. Peça a composição e a gramatura (g/m²). Para clínica: 150-165 g/m². Para laboratório: 200+ g/m².',
  },
  {
    titulo: 'Costuras e acabamento',
    desc: 'Costura francesa nas laterais evita desconforto em jornadas longas. Barra dobrada ou overlock define a durabilidade do dobrado.',
  },
  {
    titulo: 'Elastano e mobilidade',
    desc: 'Mínimo 4% de elastano muda o conforto da jornada inteira. Permite agachamento, movimentos amplos e adaptação a diferentes corpos.',
  },
  {
    titulo: 'Caimento e modelagem',
    desc: 'Diferença entre marcas está no molde. Marcas premium ajustam o jaleco por corte — não pela quantidade de tecido. Ombros, mangas e comprimento.',
  },
  {
    titulo: 'Estabilidade na lavagem',
    desc: 'Boa marca usa tecido pré-encolhido. Teste: lave 3 vezes antes de usar. Se encolher mais de 2%, o tecido não foi tratado corretamente.',
  },
  {
    titulo: 'Pós-venda e troca',
    desc: 'Política de troca clara é sinal de confiança no produto. Marcas que dificultam troca de tamanho geralmente não confiam na qualidade do que vendem.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-premium', label: 'Jaleco Premium' },
  { href: '/jaleco-universitario', label: 'Jaleco Universitário' },
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
    headline: 'Melhor Marca de Jaleco em 2026: Qual Escolher?',
    description: 'Guia técnico para escolher a melhor marca de jaleco para profissionais da saúde.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/melhor-marca-jaleco',
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Melhor Marca de Jaleco', item: 'https://jaleca.com.br/melhor-marca-jaleco' },
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
              { label: 'Melhor Marca de Jaleco', href: null },
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
              Guia de compra
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
              Qual é a melhor<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>marca de jaleco?</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              A resposta depende do tecido, da sua rotina e de quanto você lava por semana. Veja o que realmente diferencia uma marca séria de jaleco de uma que não dura.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Jalecos femininos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jalecos masculinos →
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
            { title: 'Nota 4,9 no Google', sub: 'Mais de 58 avaliações reais' },
            { title: 'Gabardine com elastano', sub: 'Tecido técnico, não básico' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 30 dias', sub: 'Tamanho errado? A gente resolve' },
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
              Tem muita marca de jaleco no mercado. E a maioria parece igual na foto. O problema é que foto não mostra gramatura, não mostra como o tecido reage depois de 80 lavagens, e não mostra o que acontece com as costuras depois de 6 meses de uso intenso.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Profissionais de saúde lavam o jaleco com frequência alta — às vezes 5 vezes por semana. Isso é uma variável que pouquíssimas marcas levam a sério na hora de escolher o tecido. A diferença entre um <strong>poliéster/viscose 60/40 com elastano</strong> e um algodão básico aparece na terceira semana de uso: um amassa, o outro não. Um encolhe, o outro mantém o caimento.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os critérios técnicos reais para avaliar uma marca — sem achismo, sem lista de "10 melhores" que ninguém testou.
            </p>
          </div>
        </section>

        {/* ── DIFERENCIAIS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              O que avaliar
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              6 critérios que definem<br />uma boa marca de jaleco
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {DIFERENCIAIS.map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#1a1a1a', color: '#fff', fontSize: '0.72rem', fontWeight: 500, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <strong style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a' }}>{item.titulo}</strong>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARATIVO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Comparativo
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Jaleco barato vs.<br />jaleco de qualidade
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.08em' }}>Critério</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.08em' }}>Jaleco básico</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 400, fontSize: '0.78rem', letterSpacing: '0.08em' }}>Jaleco de marca</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Tecido', 'Algodão 100% ou poliéster sem elastano', 'Gabardine poliéster/viscose + elastano 4-6%'],
                    ['Lavagens', '30-60 ciclos antes de perder o caimento', '150+ ciclos com estabilidade dimensional'],
                    ['Costuras', 'Costura simples, barra dobrada básica', 'Costura francesa, overlock, barra reforçada'],
                    ['Modelagem', 'Corte único, poucos tamanhos', 'Grade PP ao G3/G4, molde por gênero'],
                    ['Tempo de uso', '6-8 meses com uso intenso', '2+ anos com uso e lavagem diária'],
                    ['Custo por uso', 'Mais caro no longo prazo', 'Mais barato ao longo de 2 anos'],
                  ].map(([criterio, basico, marca], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e0d8', background: i % 2 === 0 ? '#f9f7f4' : '#fff' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: '#1a1a1a' }}>{criterio}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#6b6b6b' }}>{basico}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#4a4a4a' }}>{marca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Dúvidas sobre marcas<br />de jaleco
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
              Guias relacionados
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
              Antes de você falar,<br />seu jaleco já foi avaliado.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Gabardine com elastano. Do PP ao G3. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Femininos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Masculinos →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
