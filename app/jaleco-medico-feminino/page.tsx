import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco de Médico Feminino Slim — Feminino e Masculino na Jaleca' },
  description: 'Nota 4,9 no Google. Jaleco com elastano para médicas — branco, preto e colorido, PP ao G3. Frete grátis Sudeste acima de R$499. Troca em 7 dias.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-medico-feminino' },
  openGraph: {
    title: 'Jaleco para Médico Feminino — Slim, Branco e Colorido — Jaleca',
    description: 'Nota 4,9 no Google. Jaleco para médicas com elastano, modelagem slim, PP ao G3. Frete grátis Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/jaleco-medico-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco para Médico Feminino — Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Jaleco premium para médicas. Elastano, caimento perfeito, do PP ao G3. Frete grátis Sudeste.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco feminino é melhor para médica em consultório?',
    a: 'Para consultório: gabardine poliéster/viscose com elastano (170-200 g/m²), corte Slim. Fica bem na câmera de telemedicina, não amassa em 8h de atendimento e suporta lavagem a 60°C. O CFM não define cor obrigatória, mas branco é o padrão em instituições e o que o paciente espera ver.',
  },
  {
    q: 'Jaleco médico feminino precisa de manga longa?',
    a: 'Em ambientes hospitalares com risco biológico, a NR-32 indica manga longa como barreira. Para consultório particular, manga 3/4 ou curta é aceita — a escolha depende do protocolo da clínica e da especialidade. Dermatologistas e pediatras usam manga longa com mais frequência.',
  },
  {
    q: 'Médica pode usar jaleco colorido?',
    a: 'Pode. A Resolução CFM 1931/2009 exige que o jaleco contenha nome e CRM visíveis, mas não proíbe outras cores. Especialidades como medicina estética e pediatria adotaram pastéis — azul claro, verde menta, lilás — como parte do posicionamento da clínica.',
  },
  {
    q: 'Qual é a diferença entre jaleco Slim e Profissional para médica?',
    a: 'O Slim tem corte ajustado, visual moderno — popular em consultórios particulares de dermatologia, cardiologia e estética. O Profissional tem folga calibrada nos ombros e comprimento até o joelho, padrão para plantão hospitalar onde palpação e RCP exigem amplitude total de movimento.',
  },
  {
    q: 'Jaleco feminino de médica tem bolsos suficientes?',
    a: 'Os modelos Jaleca têm bolso superior esquerdo para estetoscópio, bolso frontal para receituário e bolso lateral com largura para tablet clínico. Para médicas que carregam aparelhos, o bolso lateral precisa de pelo menos 20 cm de largura.',
  },
  {
    q: 'Jaleco médico feminino plus size existe?',
    a: 'Existe, do PP ao G3. O G3 da Jaleca é molde próprio — não é o G2 com mais tecido. Ombros, manga e comprimento são calculados separadamente para cada grade, o que mantém o caimento independente do tamanho.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para consultório e telemedicina',
    desc: 'Corte ajustado que fica bem na câmera. Visual moderno para dermatologia, medicina estética e cardiologia. O tecido não amassa em 8h de atendimento.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para plantão e hospital',
    desc: 'Comprimento até o joelho, cava ampla para RCP e palpação. Padrão em UTI, emergência e clínica geral hospitalar. Suporta lavagem a 60°C.',
  },
  {
    nome: 'Jaleco Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados — não é só mais tecido. Mesmo caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-premium', label: 'Jaleco Premium' },
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
    headline: 'Jaleco Médico Feminino: Consultório, Plantão e Telemedicina',
    description: 'Guia de jaleco médico feminino — modelos, tecidos, normas CFM e como escolher pelo tipo de trabalho.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 },
    },
    url: 'https://jaleca.com.br/jaleco-medico-feminino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Médico Feminino', item: 'https://jaleca.com.br/jaleco-medico-feminino' },
    ],
  }


  const schemaSpeakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.faq-section', 'h2'],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-medico-feminino', 'https://jaleca.com.br/jaleco-medico-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-medico-feminino', 'https://jaleca.com.br/jaleco-medico-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jaleco Feminino', href: '/jaleco-feminino' },
              { label: 'Jaleco Médico Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow="Para médicas"
          h1Line1="Jaleco médico feminino:"
          h1Line2="consultório, plantão e telemedicina"
          description="Molde pensado para o corpo feminino. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        <ProfessionProductGrid
          professionKey="medica"
          professionLabel="Médicas"
          collectionLabel="Coleção Médica Feminina"
          productLabel="Jalecos"
          allHref="/categoria/jalecos-femininos"
        />

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco médico feminino que é só o masculino com tamanho diferente não funciona. O ombro fica largo, a manga longa demais, o comprimento desproporcional. E o problema aparece mais em consultório particular e telemedicina — onde a imagem importa tanto quanto a competência.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Um jaleco médico feminino bem feito começa no tecido: gabardine com elastano (170-200 g/m²) não amassa em 8h de atendimento, fica bem na câmera de telemedicina e suporta lavagem a 60°C sem encolher. O corte Slim é a tendência nos consultórios de dermatologia, cardiologia e medicina estética.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os modelos disponíveis, o que diferencia cada um e como escolher pelo tipo de trabalho.
            </p>
          </div>
        </section>

        {/* ── MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Modelos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Jaleco médico feminino:<br />qual modelo escolher
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
                  <Link href="/categoria/jalecos-femininos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>
                    Ver modelos →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NORMAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Normas e escolha de tecido
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              CFM, tecido certo<br />e cores na medicina
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {[
                { tema: 'Tecido para consultório', detalhe: 'Gabardine 170-200 g/m² com elastano', obs: 'Não amassa, fica bem na câmera de telemedicina. Suporta lavagem a 60°C sem encolher.' },
                { tema: 'Tecido para plantão', detalhe: 'Poliéster com acabamento antimicrobiano', obs: 'Reduz colonização bacteriana entre lavagens. Padrão em UTI e emergência.' },
                { tema: 'Norma CFM', detalhe: 'Resolução CFM 1931/2009 + 1973/2011', obs: 'Jaleco deve conter nome e CRM visíveis. Cor não é regulada — branco é padrão institucional, não obrigatório por lei.' },
                { tema: 'NR-32 em hospital', detalhe: 'EPI em ambientes de risco biológico', obs: 'Jaleco de uso exclusivo do setor. Proibido em supermercado ou transporte público. Troca obrigatória após procedimentos invasivos.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Contexto</span>
                    <strong style={{ fontSize: '0.88rem', fontWeight: 500, color: '#1a1a1a' }}>{item.tema}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Tecido / Norma</span>
                    <span style={{ fontSize: '0.85rem', color: '#c8a96e' }}>{item.detalhe}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.35rem' }}>Por quê</span>
                    <span style={{ fontSize: '0.82rem', color: '#4a4a4a', lineHeight: 1.65 }}>{item.obs}</span>
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
              Dúvidas sobre<br />jaleco médico feminino
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
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}
        />

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
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos femininos ↗
              </Link>
              <Link href="/jaleco-plus-size" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Plus size →
              </Link>
            </div>
          </div>
        </section>

            
        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />

    </main>
    </>
  )
}
