import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Feminino Acinturado | Corte Slim para Consultório',
  description: 'Jaleco feminino acinturado com corte Slim que define a cintura sem apertar. Elastex, Tradicional e Princesa do PP ao G3. 12 cores. Frete grátis Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-acinturado' },
  openGraph: {
    title: 'Jaleco Feminino Acinturado | Jaleca',
    description: 'Corte Slim que define a cintura sem apertar. PP ao G3, 12 cores.',
    url: 'https://jaleca.com.br/jaleco-feminino-acinturado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco feminino acinturado é confortável para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, especialmente o Slim Elastex — tecido com elastano bidirecional que acompanha todos os movimentos mesmo no corte acinturado. Para plantões longos, é o modelo mais indicado. O Slim Tradicional é mais estruturado, ideal para consultórios com menos movimento intenso.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco acinturado e jaleco reto?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco acinturado (Slim) tem recortes laterais que definem a cintura e acompanham a silhueta feminina. O jaleco reto tem corte tubular, sem ajuste de cintura. O acinturado transmite mais elegância; o reto oferece mais espaço para procedimentos.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado aperta com o tempo?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não, se escolher o tamanho correto. Em caso de dúvida entre dois tamanhos no modelo Slim, opte pelo maior. O corte acinturado tem menos folga por design. Após lavagens, o tecido Elastex mantém o caimento sem encolher.' },
    },
    {
      '@type': 'Question',
      name: 'Qual modelo Slim é mais indicado para médicas e dentistas?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Slim Elastex para quem precisa de muito movimento (procedimentos, plantão). O Slim Tradicional branco para consultório e atendimento. O Slim Princesa para profissionais que preferem evasê na parte inferior — nutricionistas e esteticistas adoram.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco feminino acinturado estilo blazer existe para clínica médica?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O modelo Alfaiataria Premium da Jaleca tem acabamento de blazer — estruturado, elegante e profissional. Ideal para recepção de clínica, coordenação de saúde ou qualquer profissional que queira transmitir autoridade com sofisticação.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado que não amassa durante o dia inteiro — existe?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Gabardine com elastano é o tecido mais resistente ao amassado da nossa linha — você passa 8, 10, 12 horas de expediente e o jaleco mantém o caimento sem precisar passar.' },
    },
    {
      '@type': 'Question',
      name: 'Onde comprar jaleco feminino acinturado com entrega rápida?',
      acceptedAnswer: { '@type': 'Answer', text: 'Na Jaleca enviamos em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/categoria/jalecos-femininos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino Acinturado', item: 'https://jaleca.com.br/jaleco-feminino-acinturado' },
  ],
}

const MODELOS = [
  {
    nome: 'Slim Elastex',
    perfil: 'Para movimento e conforto',
    desc: 'Elastano bidirecional. Acompanha o corpo em procedimentos, plantão e consultas longas.',
  },
  {
    nome: 'Slim Tradicional',
    perfil: 'Para consultório e atendimento',
    desc: 'Corte acinturado clássico. Tecido estruturado que mantém o visual impecável o dia todo.',
  },
  {
    nome: 'Slim Princesa',
    perfil: 'Para quem prefere fluidez',
    desc: 'Evasê na parte inferior. Leveza e elegância para nutricionistas, esteticistas e fisioterapeutas.',
  },
  {
    nome: 'Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio. Mesmo corte acinturado do PP ao G3, sem adaptações.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-medica', label: 'Jaleco para Médica' },
  { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
  { href: '/jaleco-feminino-branco', label: 'Jaleco Branco' },
  { href: '/jaleco-elegante', label: 'Jaleco Elegante' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
]

export default async function Page() {
  const placeData = await getGooglePlaceData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-feminino-acinturado', 'https://jaleca.com.br/jaleco-feminino-acinturado'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-feminino-acinturado', 'https://jaleca.com.br/jaleco-feminino-acinturado'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos Femininos', href: '/jaleco-feminino' },
              { label: 'Jaleco Acinturado', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── ① HERO COMMERCIAL ── */}
        <HeroCommercial
          eyebrow="Jaleca · Jaleco acinturado feminino"
          h1Line1="Jaleco Feminino Acinturado"
          h1Line2="Modelagem que valoriza você"
          description="Recortes laterais que seguem a silhueta. Beleza que transmite autoridade. Do PP ao G3 com elastano."
          startingPrice="R$189"
          collectionHref="#colecao"
          allHref="/jaleco-feminino-acinturado"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar
          pillars={[
            { label: 'Corte que valoriza' },
            { label: 'PP ao G3' },
            { label: 'Frete grátis SE' },
            { label: 'Troca em 7 dias' },
          ]}
        />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Profissionais"
            collectionLabel="Coleção Slim Acinturado"
            productLabel="Jalecos"
            allHref="/jaleco-feminino-acinturado"
          />
        </div>

        {/* ── ④ GOOGLE 4.9★ + DEPOIMENTOS ── */}
        <GoogleRatingCarousel rating={placeData?.rating ?? 4.9} />

        {/* ── ⑤ INSTAGRAM ── */}
        <InstagramLazy />

        {/* ── ⑥ MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Qual modelo é o seu?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Modelos Slim acinturados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: '0.75rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.25rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.2rem' }}>{m.nome}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#c8a96e', marginBottom: '0.35rem' }}>{m.perfil}</span>
                  <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ⑦ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco acinturado
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {faqSchema.mainEntity.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.name}
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
            <FabricGuideCards />
          </div>
        </section>

        {/* ── ⑧ LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Outros jalecos femininos"
          links={INTERNAL_LINKS}
        />

        {/* ── ⑨ CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Feminilidade com sofisticação
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · 12 cores · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/jaleco-feminino-acinturado"
              style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '0.75rem' }}
            >
              Ver todos os modelos →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>
      </main>
    </>
  )
}
