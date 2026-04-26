import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'

export const metadata: Metadata = {
  title: 'Uniformes Profissionais para Saúde: Guia Completo 2026',
  description: 'Guia completo de uniformes para saúde: jaleco para médico, dentista, enfermeiro, farmacêutico, fisioterapeuta, nutricionista e muito mais. Tecido certo, normas e modelos.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-profissionais-saude' },
  openGraph: {
    title: 'Uniformes Profissionais para Saúde: Guia Completo 2026',
    description: 'Guia completo de uniformes para profissionais de saúde — do jaleco ao scrub. Tecido, normas e modelos para cada área clínica.',
    url: 'https://jaleca.com.br/uniformes-profissionais-saude',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes Profissionais para Saúde: Guia Completo 2026',
    description: 'Guia completo de uniformes para profissionais de saúde — do jaleco ao scrub. Tecido, normas e modelos para cada área clínica.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const SAUDE_HUBS = [
  { href: '/jaleco-medico',          titulo: 'Médico',          desc: 'CFM 1931/2009 · manga longa · NR-32' },
  { href: '/jaleco-dentista',        titulo: 'Dentista',        desc: 'NR-32 · antimicrobiano · scrub' },
  { href: '/jaleco-enfermeiro',      titulo: 'Enfermeiro',      desc: 'COFEN 375/2011 · elastano · scrub' },
  { href: '/jaleco-farmaceutico',    titulo: 'Farmacêutico',    desc: 'RDC 44/2009 · antimicrobiano · manga longa' },
  { href: '/jaleco-fisioterapeuta',  titulo: 'Fisioterapeuta',  desc: 'COFFITO 424/2013 · stretch · ergonomia' },
  { href: '/jaleco-nutricionista',   titulo: 'Nutricionista',   desc: 'CFN 380/2005 · toque neutro · clínica' },
  { href: '/jaleco-biomedico',       titulo: 'Biomédico',       desc: 'CRBio · DWR · laboratório' },
  { href: '/jaleco-veterinario',     titulo: 'Veterinário',     desc: 'CFMV 1138/2016 · funcional · clínica' },
  { href: '/jaleco-podologo',        titulo: 'Podólogo',        desc: 'CFFa · elastano · postura sentada' },
  { href: '/jaleco-psicologa',       titulo: 'Psicólogo',       desc: 'CFP · neutros · setting terapêutico' },
]

const SUB_PILAR_LINKS = [
  { href: '/jaleco-dentista',       label: 'Jaleco para Dentista' },
  { href: '/jaleco-medico',         label: 'Jaleco para Médico' },
  { href: '/jaleco-enfermeiro',     label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-farmaceutico',   label: 'Jaleco para Farmacêutico' },
  { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-nutricionista',  label: 'Jaleco para Nutricionista' },
  { href: '/jaleco-biomedico',      label: 'Jaleco para Biomédico' },
  { href: '/jaleco-veterinario',    label: 'Jaleco para Veterinário' },
  { href: '/jaleco-podologo',       label: 'Jaleco para Podólogo' },
  { href: '/jaleco-psicologa',      label: 'Jaleco para Psicólogo' },
]

const FAQ_ITEMS = [
  {
    q: 'Qual é a diferença entre jaleco e scrub?',
    a: 'O jaleco é uma sobreposta aberta ou fechada, geralmente branca, usada sobre a roupa do profissional. O scrub é um conjunto (calça + blusa) de uso interno em ambiente hospitalar — substituiu a roupa pessoal. Em muitas profissões de saúde, os dois são usados em momentos diferentes: jaleco na triagem ou consultório, scrub dentro do centro cirúrgico ou UTI.',
  },
  {
    q: 'A NR-32 exige jaleco específico para profissionais de saúde?',
    a: 'A NR-32 (Segurança e Saúde no Trabalho em Serviços de Saúde) define que os EPIs e uniformes de trabalho em saúde devem ser fornecidos pelo empregador, mantidos limpos e em boas condições, e não devem sair do ambiente de trabalho. O tipo específico de jaleco varia por área: o conselho regulador de cada profissão define as normas de vestimenta.',
  },
  {
    q: 'O uniforme de saúde pode sair do trabalho?',
    a: 'Não. A NR-32 proíbe explicitamente que uniformes de trabalho em serviços de saúde saiam do ambiente laboral — o risco de contaminação ambiental é real. O profissional deve trocar o uniforme ao entrar e sair do serviço.',
  },
  {
    q: 'Qual tecido é melhor para profissionais de saúde?',
    a: 'Para clínicas ambulatoriais: microfibra ou gabardine com elastano (150-165 g/m²) — leveza, flexibilidade e lavagem a 40°C. Para áreas de alto risco biológico (laboratório, cirurgia): tecidos com tratamento antimicrobiano ativo ou DWR, 200 g/m². Para farmácia de manipulação: poliéster ≥60% que suporta lavagem a 60°C sem encolher.',
  },
  {
    q: 'Jaleco branco é obrigatório na saúde?',
    a: 'Depende da profissão e da instituição. O branco é o padrão histórico e a cor mais aceita em todos os contextos. Porém, vários conselhos profissionais permitem outras cores — o que varia é o protocolo de cada hospital ou clínica. O COFEN (enfermagem) e o CFM (medicina) não definem cor obrigatória; a instituição define.',
  },
  {
    q: 'Quantos jalecos um profissional de saúde precisa?',
    a: 'O mínimo recomendado é 3 peças em rotação: 1 em uso, 1 na lavagem, 1 de reserva. Para quem trabalha em mais de uma clínica ou tem jornada maior que 6 horas, 5 peças garantem que o jaleco está sempre limpo e seco na troca.',
  },
  {
    q: 'Jaleco de saúde pode ser lavado junto com roupas pessoais?',
    a: 'Não recomendado. A NR-32 orienta que uniformes de saúde sejam lavados separadamente das roupas pessoais — de preferência pelo empregador ou em serviço de lavanderia específico. Em casa: lavar separado, a 40-60°C conforme o tecido, e guardar em saco plástico fechado separado do restante do guarda-roupa.',
  },
  {
    q: 'A Jaleca tem jalecos antimicrobianos?',
    a: 'Sim. Alguns modelos têm tratamento antimicrobiano na fibra — indicados especialmente para farmácia de manipulação, laboratório e procedimentos com alto contato com secreções. Consulte a ficha técnica de cada produto para confirmar o tratamento.',
  },
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
    headline: 'Uniformes Profissionais para Saúde: Guia Completo 2026',
    description: 'Guia completo de uniformes para profissionais de saúde — do jaleco ao scrub.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/uniformes-profissionais-saude',
    datePublished: '2026-04-19',
    dateModified: '2026-04-19',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Uniformes para Saúde', item: 'https://jaleca.com.br/uniformes-profissionais-saude' },
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
              { label: 'Uniformes para Saúde', href: null },
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
              Guia completo
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
              Uniformes para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissionais de saúde</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Do jaleco clínico ao scrub hospitalar: tudo que você precisa saber sobre tecido, normas regulatórias e como escolher o uniforme certo para cada área da saúde.
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
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google</span>
              </div>
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Tamanhos PP ao G3', sub: 'Grade completa, corpo real' },
            { title: 'Com elastano', sub: 'Movimento sem restrição' },
            { title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
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
              O uniforme na saúde não é só uma questão de imagem. É barreira biológica, identificação profissional e cumprimento de normas regulatórias. A NR-32 define que profissionais de saúde não devem sair do ambiente de trabalho com o uniforme — e cada conselho regulador tem orientações específicas sobre tecido, cor e modelo adequados para cada área.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              A diferença entre um jaleco de <strong>gabardine 150 g/m²</strong> e um de <strong>brim 240 g/m²</strong> não é estética — é funcional. O primeiro é leve e respirável, ideal para consultórios; o segundo tem trama densa que age como barreira contra respingos, indicado para laboratório e manipulação. Escolher errado compromete o conforto em jornadas longas e pode criar não-conformidades com as normas da vigilância sanitária.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Este guia reúne as informações técnicas por profissão — tecido certo, normas aplicáveis e como escolher o modelo que vai durar a jornada inteira sem perder caimento.
            </p>
          </div>
        </section>

        {/* ── HUBS GRID ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por profissão
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Uniformes para cada<br />área da saúde
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {SAUDE_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid #e5e0d8', padding: '1.75rem', transition: 'border-color 0.2s' }}
                >
                  <strong style={{ display: 'block', fontSize: '1.35rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: "'Cormorant', Georgia, serif" }}>
                    {hub.titulo}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#8a8782', lineHeight: 1.6 }}>{hub.desc}</span>
                  <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e' }}>
                    Guia completo →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── DIFERENÇAS TÉCNICAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Guia de tecidos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Como o tecido define<br />o jaleco certo
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '1.5rem' }}>
              {[
                {
                  tipo: 'Gabardine leve (150-165 g/m²)',
                  para: 'Consultório, ambulatório, clínica',
                  detalhe: 'Poliéster/viscose com elastano 4-6%. Caimento limpo, lavagem a 40°C, repele vincos. O padrão para jornadas de consultório.',
                },
                {
                  tipo: 'Microfibra com elastano (120-140 g/m²)',
                  para: 'Psicólogo, nutricionista, fisioterapeuta',
                  detalhe: 'A opção mais leve. Ideal para profissionais que ficam sentados em atendimento longo. Toque suave, temperatura regulada.',
                },
                {
                  tipo: 'Gabardine DWR (150-180 g/m²)',
                  para: 'Biomédico, veterinário, sushiman, laboratório',
                  detalhe: 'Tratamento Durable Water Repellency na superfície. Respingos deslizam sem penetrar — jaleco limpo mais rápido.',
                },
                {
                  tipo: 'Brim ou gabardine pesado (200-240 g/m²)',
                  para: 'Farmácia de manipulação, laborátorio industrial',
                  detalhe: 'Trama densa como barreira mecânica. Suporta lavagem a 60°C sem encolher. Mais pesado — reservar para ambientes de risco.',
                },
                {
                  tipo: 'Antimicrobiano ativo',
                  para: 'Farmácia de manipulação, hospital, laboratório',
                  detalhe: 'Tratamento incorporado na fibra — reduz proliferação bacteriana entre lavagens. RDC ANVISA 302/2005 e RDC 67/2007 para referência.',
                },
              ].map((card, i) => (
                <div key={i} style={{ border: '1px solid #e5e0d8', padding: '1.75rem', background: '#f9f7f4' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.35rem' }}>{card.tipo}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.75rem' }}>{card.para}</span>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.7, margin: 0 }}>{card.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NORMAS ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              Normas e conselhos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '2rem' }}>
              Referências regulatórias<br />por área
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { profissao: 'Médico',         norma: 'CFM Res. 1931/2009', detalhe: 'Jaleco como símbolo profissional — uso fora da clínica permite no exercício da profissão' },
                { profissao: 'Enfermeiro',      norma: 'COFEN Res. 375/2011', detalhe: 'Jaleco branco com insígnia do COREN obrigatório em serviços de saúde' },
                { profissao: 'Dentista',        norma: 'NR-32 + CFO',         detalhe: 'EPI obrigatório: jaleco de manga longa, óculos, máscara e luva' },
                { profissao: 'Fisioterapeuta',  norma: 'COFFITO Res. 424/2013', detalhe: 'Jaleco branco com nome e registro CREFITO visível ao paciente' },
                { profissao: 'Nutricionista',   norma: 'CFN Res. 380/2005',   detalhe: 'Jaleco é recomendado como identificação profissional em todos os contextos de atendimento' },
                { profissao: 'Farmacêutico',    norma: 'RDC ANVISA 44/2009 + RDC 67/2007', detalhe: 'Uniforme limpo obrigatório em farmácias; manga longa em manipulação' },
                { profissao: 'Biomédico',       norma: 'CRBio + NR-32',       detalhe: 'Biossegurança em laboratório: jaleco de manga longa e fechamento frontal' },
                { profissao: 'Veterinário',     norma: 'CFMV Res. 1138/2016', detalhe: 'Jaleco exclusivo de trabalho, não circulado fora do ambiente clínico/cirúrgico' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', background: '#1a1a1a' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 400, color: '#fff', marginBottom: '0.25rem' }}>{item.profissao}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#c8a96e', marginBottom: '0.5rem' }}>{item.norma}</span>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.detalhe}</span>
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
              Dúvidas sobre uniformes<br />para a saúde
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
              {SUB_PILAR_LINKS.map((link) => (
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
              Pronto para escolher<br />o seu?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Do PP ao G3. Jalecos com elastano para todas as áreas da saúde. Frete grátis para SP, RJ, MG e ES acima de R$499.
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
