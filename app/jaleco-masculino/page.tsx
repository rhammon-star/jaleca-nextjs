import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Masculino: Modelos Slim e Profissional do PP ao G3',
  description: 'Jaleco masculino com elastano do PP ao G3 — molde com ombros amplos e caimento profissional. Para médico, dentista, enfermeiro e barbeiro. Frete grátis Sudeste acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-masculino' },
  openGraph: {
    title: 'Jaleco Masculino: Modelos Slim e Profissional do PP ao G3',
    description: 'Jaleco masculino com elastano do PP ao G3. Para médico, dentista, enfermeiro e barbeiro.',
    url: 'https://jaleca.com.br/jaleco-masculino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Masculino: Modelos Slim e Profissional do PP ao G3',
    description: 'Jaleco masculino com elastano do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco masculino é melhor para médico?',
    a: 'Para consultório: gabardine poliéster/viscose com elastano (170-200 g/m²), corte Slim. Para plantão: Profissional com comprimento até o joelho e cava ampla para RCP e palpação. A Resolução CFM exige nome e CRM visíveis — branco é o padrão institucional.',
  },
  {
    q: 'Jaleco masculino precisa de tamanho diferente do feminino?',
    a: 'Sim. O molde masculino tem ombros mais amplos, cava maior e comprimento proporcional à altura masculina. Jalecos unissex ou femininos adaptados ficam curtos no torso e apertados nos ombros em homens.',
  },
  {
    q: 'Qual a diferença entre jaleco Slim e Profissional masculino?',
    a: 'O Slim tem corte ajustado — ideal para consultórios particulares e profissionais que constroem imagem no Instagram. O Profissional tem folga calibrada nos ombros para movimentos amplos: RCP, exodontia, atendimento de emergência.',
  },
  {
    q: 'Jaleco masculino branco ou preto?',
    a: 'Branco é o padrão em saúde — associado a higiene e transmite confiança ao paciente. Preto é tendência em barbearias premium e clínicas de estética masculina. Para hospital, verificar o protocolo da instituição.',
  },
  {
    q: 'Jaleco masculino aguenta lavagem hospitalar?',
    a: 'Os modelos Jaleca suportam lavagem a 60°C — temperatura padrão para higienização clínica. A composição poliéster + elastano resiste sem encolher. Algodão puro pode encolher em lavagens repetidas acima de 40°C.',
  },
  {
    q: 'Jaleco masculino tem tamanhos grandes?',
    a: 'Do PP ao G3 com molde próprio por tamanho. O G3 não é o G2 com mais tecido — ombros e manga são recalculados para cada grade. Consulte a tabela de medidas antes de pedir.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para consultório e imagem',
    desc: 'Corte ajustado com elastano. Visual moderno para dermatologia, odontologia e medicina estética. Fica bem na foto do consultório.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para plantão e hospital',
    desc: 'Ombros amplos, cava folgada para RCP e procedimentos. Comprimento até o joelho. Suporta lavagem a 60°C.',
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
  { href: '/jaleco-barbeiro', label: 'Jaleco para Barbeiro' },
  { href: '/jaleco-premium', label: 'Jaleco Premium' },
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
    headline: 'Jaleco Masculino: Modelos Slim e Profissional do PP ao G3',
    description: 'Guia de jaleco masculino — modelos, tecidos e como escolher pelo tipo de trabalho.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-masculino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Masculino', item: 'https://jaleca.com.br/jaleco-masculino' },
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
      {(() => { const s = buildHowToSchema('jaleco-masculino', 'https://jaleca.com.br/jaleco-masculino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-masculino', 'https://jaleca.com.br/jaleco-masculino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Produtos', href: '/produtos' },
              { label: 'Jaleco Masculino', href: null },
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
          eyebrow="Para profissionais"
          h1Line1="Jaleco masculino:"
          h1Line2="do consultório ao plantão"
          description="Molde com ombros amplos e caimento profissional. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        <ProfessionProductGrid
          professionKey="medico"
          professionLabel="Profissionais"
          collectionLabel="Coleção Masculina"
          productLabel="Jalecos"
          allHref="/produtos?categoria=jalecos-masculinos"
        />

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Jaleco masculino não é jaleco feminino com mais tecido. O ombro precisa ser recalculado para a estrutura masculina — mais amplo, com cava maior. O comprimento proporcional à altura masculina. Sem isso, o jaleco apertado nos ombros ou curto no torso sai da roupa antes do plantão terminar.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O tecido certo para jaleco masculino: gabardine poliéster + viscose com elastano (170-200 g/m²). Não amassa em 8h, suporta lavagem a 60°C e o elastano acompanha os movimentos do atendimento sem travar na cava.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os modelos disponíveis e como escolher pelo tipo de trabalho.
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
              Os modelos de<br />jaleco masculino
            </h2>
            <div className="grid" style={{ gap: '1.5rem' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>
                    {modelo.perfil}
                  </span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                    {modelo.nome}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/produtos?categoria=jalecos-masculinos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>
                    Ver modelos →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Perguntas frequentes
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />jaleco masculino
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
        <section style={{ background: '#fff', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Jaleco que acompanha<br />a sua jornada.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Molde masculino. Do PP ao G3. Gabardine com elastano. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos masculinos ↗
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


      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />

    </main>
    </>
  )
}
