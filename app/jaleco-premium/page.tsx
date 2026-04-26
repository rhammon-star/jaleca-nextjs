import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'

export const metadata: Metadata = {
  title: 'Jaleco Premium: Elegância e Qualidade para Profissionais',
  description: 'Encontre jaleco premium para medicina, estética e odontologia. Alta costura, conforto superior e exclusividade para seu dia a dia profissional.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-premium' },
  openGraph: {
    title: 'Jaleco Premium: Elegância e Qualidade para Profissionais',
    description: 'O que define um jaleco premium? Tecido, acabamento e corte que fazem diferença na jornada toda.',
    url: 'https://jaleca.com.br/jaleco-premium',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Premium: Elegância e Qualidade para Profissionais',
    description: 'O que define um jaleco premium? Tecido, acabamento e corte que fazem diferença na jornada toda.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'O que diferencia um jaleco premium de um jaleco comum?',
    a: 'Tecido, acabamento e modelagem. Um jaleco premium usa gabardine com elastano (mínimo 4%) em gramatura certa para lavagem frequente. O acabamento tem costura francesa nas laterais, barra overlock, botões reforçados e molde por gênero — não o mesmo corte para todos os tamanhos. A diferença fica óbvia depois de 30 lavagens: o premium mantém o caimento, o comum perde.',
  },
  {
    q: 'Vale a pena investir em um jaleco premium?',
    a: 'Para quem usa o jaleco 5 dias por semana: sim, a conta fecha. Um jaleco de R$180-250 bem feito dura 2 anos com uso intenso. Dois ou três jalecos básicos de R$60-80, no mesmo período, somam mais e saem com visual comprometido em 6 meses. O custo por dia de uso é menor no premium.',
  },
  {
    q: 'Posso lavar jaleco premium na máquina?',
    a: 'Sim, desde que respeite a etiqueta. Jalecos premium em gabardine poliéster/viscose suportam máquina a 40°C em ciclo delicado. Use sachê de sabão neutro, sem alvejante clorado. Não seque na secadora — o calor encolhe o poliéster. Deixe estendido na horizontal ou pendurado em cabide largo.',
  },
  {
    q: 'Jaleco premium tem bordado de nome incluso?',
    a: 'Depende da marca. Algumas cobram à parte, outras incluem no pedido. O bordado com nome e registro profissional é recomendado pelos principais conselhos de saúde — CFM, COFEN, COFFITO. Pergunte antes de comprar se a personalização está inclusa ou qual é o prazo adicional.',
  },
  {
    q: 'Quais profissionais usam jaleco premium?',
    a: 'Médicos, dentistas, psicólogos, esteticistas, nutricionistas e fisioterapeutas são os perfis mais comuns. São profissionais que atendem pacientes diariamente, têm contato visual constante com o público e entendem que a aparência profissional comunica competência antes de qualquer palavra.',
  },
  {
    q: 'Jaleco premium precisa de cuidado especial?',
    a: 'Não mais do que um jaleco comum — o premium é construído para facilitar a rotina. Lavar a 40°C, não usar alvejante, secar à sombra. A diferença é que o tecido mantém a forma sem precisar passar. Gabardine com elastano seca em poucas horas e dispensa ferro na maioria das vezes.',
  },
]

const ATRIBUTOS = [
  {
    label: 'Tecido técnico',
    detalhe: 'Gabardine poliéster/viscose com 4-6% elastano. Gramatura 150-165 g/m² — o equilíbrio entre leveza e resistência.',
  },
  {
    label: 'Corte por gênero',
    detalhe: 'Molde feminino e masculino diferentes. Ombros, mangas e cava ajustados para cada silhueta — não o mesmo jaleco em tamanhos diferentes.',
  },
  {
    label: 'Costura francesa',
    detalhe: 'Laterais com costura interna dupla. Elimina atrito na pele e garante que a costura não abra em movimentos amplos.',
  },
  {
    label: 'Botões reforçados',
    detalhe: 'Botões presos por reforço de fio duplo. Não saem depois de 50 lavagens — problema frequente em jalecos básicos.',
  },
  {
    label: 'Barra overlock',
    detalhe: 'Acabamento interno da barra com overlock colado. Sem fiapos, sem desfiamento após lavagem intensa.',
  },
  {
    label: 'Estabilidade dimensional',
    detalhe: 'Tecido pré-encolhido na produção. O jaleco comprado no M ainda vai caber no M depois de 100 lavagens.',
  },
]

const INTERNAL_LINKS = [
  { href: '/melhor-marca-jaleco', label: 'Melhor Marca de Jaleco' },
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-estiloso', label: 'Jaleco Estiloso' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
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
    headline: 'Jaleco Premium: Elegância e Qualidade para Profissionais',
    description: 'O que define um jaleco premium e por que vale a pena investir.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-premium',
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Premium', item: 'https://jaleca.com.br/jaleco-premium' },
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
              { label: 'Jaleco Premium', href: null },
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
              Para quem não abre mão
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
              Jaleco premium:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>conforto e sofisticação</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Um jaleco premium não é sobre preço — é sobre o que resiste à sua rotina. Tecido certo, costura que não abre, caimento que dura.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos femininos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver jalecos masculinos →
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
        <div className="grid" style={{ background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Gabardine com elastano', sub: 'Tecido técnico para jornada longa' },
            { title: 'Grade PP ao G3', sub: 'Tamanho real, não apenas "M e G"' },
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
              Premium não é uma categoria de preço. É uma categoria de desempenho. Um jaleco premium precisa aguentar 5 lavagens por semana, 50 semanas por ano — sem perder o caimento, sem desbotamento visível, sem costura abrindo nos ombros depois do segundo mês.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Profissionais de saúde e estética sabem disso na prática. O jaleco que parece bonito na foto e chega murcho em 3 meses sai caro — tanto no bolso quanto na imagem diante dos pacientes.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Os atributos abaixo são os que realmente definem se um jaleco é premium ou só caro.
            </p>
          </div>
        </section>

        {/* ── ATRIBUTOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              O que faz a diferença
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              6 atributos de um<br />jaleco realmente premium
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                gap: '1px',
                background: '#e5e0d8',
              }}
            >
              {ATRIBUTOS.map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.5rem' }}>{item.label}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA QUEM ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              Perfil de uso
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '2rem' }}>
              Quem usa jaleco premium
            </h2>
            <div className="grid" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { profissao: 'Médica/Médico', motivo: 'Imagem de autoridade antes de qualquer fala. Jaleco como extensão da competência clínica.' },
                { profissao: 'Dentista', motivo: 'Consultório com identidade visual definida. Jaleco premium fecha o conjunto visual da marca pessoal.' },
                { profissao: 'Esteticista', motivo: 'Ambiente premium exige uniforme no mesmo nível. Cliente paga mais e percebe cada detalhe.' },
                { profissao: 'Psicólogo/a', motivo: 'Setting terapêutico importa. Jaleco neutro, bem cortado, sem elementos que dispersem a atenção do paciente.' },
                { profissao: 'Fisioterapeuta', motivo: 'Movimento amplo na jornada toda. O elastano no tecido é obrigação, não diferencial.' },
                { profissao: 'Nutricionista', motivo: 'Atendimento presencial diário. Jaleco que mantém o caimento sinaliza organização e cuidado com detalhes.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', background: '#1a1a1a' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 400, color: '#fff', marginBottom: '0.35rem' }}>{item.profissao}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{item.motivo}</span>
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
              Dúvidas sobre<br />jaleco premium
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
              Vista o que<br />você merece.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Gabardine com elastano. Grade PP ao G3. 3x sem juros. Frete grátis para SP, RJ, MG e ES acima de R$499.
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
