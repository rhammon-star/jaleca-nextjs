import type { Metadata } from 'next'
import Link from 'next/link'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import UGCSection from '@/components/UGCSection'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco com Elastano: Mobilidade Real em Plantão e Consultório | Jaleca',
  description: 'Jaleco com elastano 4-6% para liberdade de movimento em jornadas longas. Gabardine 150-200 g/m², do PP ao G3, feminino e masculino. ⭐ 4.9 no Google.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-com-elastano' },
  openGraph: {
    title: 'Jaleco com Elastano: Mobilidade Real em Plantão | Jaleca',
    description: 'Jaleco com elastano 4-6% para mobilidade total em jornadas longas. PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-com-elastano',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ = [
  { q: 'Qual a porcentagem ideal de elastano em jaleco profissional?', a: 'Entre 4% e 6% — abaixo disso o tecido fica rígido e não acompanha movimento de braço; acima disso o jaleco perde estrutura e fica com cara de moletom. Gabardine poliéster/viscose com 4-6% de elastano é o padrão da linha Jaleca.' },
  { q: 'Jaleco com elastano amassa menos?', a: 'Sim. O elastano dá memória ao tecido — após dobrar ou comprimir, a peça retorna à forma original. Gabardine sem elastano amassa em 4-5h de uso; com elastano resiste 8-12h sem precisar passar.' },
  { q: 'Jaleco com elastano encolhe na lavagem?', a: 'Não, se respeitar temperatura: 40-60°C. Acima de 60°C o elastano perde elasticidade e o jaleco pode contrair 1-2cm no comprimento. Recomendamos lavagem 40°C com sabão neutro.' },
  { q: 'Jaleco com elastano para residência médica funciona?', a: 'Sim — é justamente o uso que mais beneficia: plantões de 12-24h, RCP, palpação, movimentos amplos. Gabardine 165-200 g/m² + elastano 4-6% é a combinação mais resistente para uso intensivo.' },
  { q: 'Jaleco com elastano plus size cabe bem?', a: 'Sim. Na Jaleca o plus size (G1-G3) usa o mesmo gabardine com elastano da linha regular. O molde é refeito para cada grade — ombro, manga e busto recalculados.' },
]

export default function Page() {
  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco', item: 'https://jaleca.com.br/jaleco' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco com Elastano', item: 'https://jaleca.com.br/jaleco-com-elastano' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-com-elastano', 'https://jaleca.com.br/jaleco-com-elastano'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-com-elastano', 'https://jaleca.com.br/jaleco-com-elastano'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />
      <main style={{ fontWeight: 300 }}>
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            <li className="text-xs"><Link href="/" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Início</Link></li>
            <li className="text-xs" style={{ color: '#c8c4bc' }}>/</li>
            <li className="text-xs"><Link href="/jaleco" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Jaleco</Link></li>
            <li className="text-xs" style={{ color: '#c8c4bc' }}>/</li>
            <li className="text-xs" style={{ color: '#1a1a1a' }}>Jaleco com Elastano</li>
          </ol>
        </div>

        
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow="Uniforme profissional"
          h1Line1="Jaleco com elastano:"
          h1Line2="movimento sem trava"
          description="4-6% de elastano no gabardine. Suficiente para acompanhar palpação, RCP, exodontia e jornada de 12h. Sem rigidez, sem amasso, sem perder estrutura."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"
        />


        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>O que o elastano resolve</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Plantão de 12 horas em jaleco 100% poliéster — você sente. O tecido trava no movimento de braço, o ombro fica apertado quando você levanta a mão para examinar a garganta, a peça volta amassada da sala de procedimento. Não é desconforto pequeno: é fadiga cumulativa em jornada longa.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              O elastano (4-6% misturado ao poliéster e viscose) resolve isso em três frentes: dá <strong>elasticidade direcional</strong> (acompanha sem repuxar), <strong>memória de forma</strong> (volta ao estado original sem amassar) e <strong>conforto térmico</strong> (não cria barreira rígida sobre o corpo).
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              É por isso que <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>médicos de plantão</Link>, <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>dentistas</Link> e <Link href="/jaleco-enfermeiro" style={{ color: '#c8a96e' }}>enfermeiros</Link> trocam o jaleco antigo logo na primeira vez que provam o com elastano.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>Dúvidas frequentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', color: '#1a1a1a' }}>{item.q}</summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>Pronto pra trocar?</h2>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos" style={{ padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>Ver toda coleção</Link>
              <Link href="/jaleco" style={{ padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>Guia do jaleco</Link>
            </div>
          </div>
        </section>

        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={4.9} />

        {/* ── UGC PROFISSIONAIS ── */}
        <UGCSection />
      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />


      </main>
    </>
  )
}
