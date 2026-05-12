import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco para Dentista Feminino: NR-32, Cores e Modelos 2026',
  description: 'Jaleco dentista feminino com manga longa NR-32. Branco clássico ou pastéis para harmonização facial. Elastano, antimicrobiano e molde próprio do PP ao G3. Frete grátis Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-dentista-feminino' },
  openGraph: {
    title: 'Jaleco para Dentista Feminino: NR-32, Cores e Modelos 2026',
    description: 'Jaleco dentista feminino com manga longa NR-32. Elastano, antimicrobiano e molde próprio do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-dentista-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco para Dentista Feminino: NR-32, Cores e Modelos 2026',
    description: 'Jaleco dentista feminino com manga longa NR-32. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco é melhor para dentista feminina?',
    a: 'Poliéster 65% + viscose 30% + elastano 5% com tratamento antimicrobiano. Resiste a respingos de sangue e aerossóis do alta-rotação, não amassa em 8h de atendimento e suporta lavagem a 60°C sem encolher. A NR-32 exige manga longa em consultório odontológico classificado como ambiente de risco biológico.',
  },
  {
    q: 'Jaleco slim acinturado funciona bem na odontologia?',
    a: 'Funciona — com elastano. O corte ajustado permite abdução dos braços em procedimentos como extração, implante e cirurgia periodontal desde que o elastano seja bidirecional (4-way stretch). Sem elastano, o Slim trava na cava durante manobras que exigem amplitude total de ombros.',
  },
  {
    q: 'Dentista pode usar jaleco colorido?',
    a: 'Pode. O CRO não define cor obrigatória. Branco é o padrão histórico na odontologia e transmite assepsia ao paciente. Dentistas de harmonização facial e odontologia estética adotaram pastéis — azul claro, verde menta, lilás — como parte do posicionamento da clínica.',
  },
  {
    q: 'Por que manga longa é exigida para dentista?',
    a: 'A NR-32 classifica o consultório odontológico como ambiente de risco biológico. O aerossol do alta-rotação contém partículas de sangue, saliva e raspas de dente que atingem os braços do profissional. A manga longa é a barreira de proteção exigida pela norma.',
  },
  {
    q: 'Jaleco dentista feminino branco fica transparente?',
    a: 'Depende do tecido e gramatura. Gabardine poliéster/viscose a partir de 170 g/m² não transparece sob luz do refletor do consultório. Tecidos finos (abaixo de 150 g/m²) ficam translúcidos — problema na foto da clínica e em luz artificial direta.',
  },
  {
    q: 'Qual a diferença entre jaleco Slim e Profissional para dentista?',
    a: 'O Slim tem corte ajustado — visual moderno para consultórios de harmonização facial e implantodontia, onde a imagem importa para o posicionamento da clínica no Instagram. O Profissional tem folga calibrada nos ombros para procedimentos que exigem amplitude total de movimento, como exodontias e cirurgias periodontais.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para consultório e harmonização',
    desc: 'Corte ajustado com elastano bidirecional. Visual moderno para clínicas de harmonização facial e odontologia estética.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para cirurgia e procedimentos',
    desc: 'Cava ampla para exodontias e implantes. Manga longa NR-32. Tecido antimicrobiano para consultórios de alto fluxo.',
  },
  {
    nome: 'Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados — não é só mais tecido. Mesmo caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-medica', label: 'Jaleco para Médica' },
  { href: '/jaleco-feminino-branco', label: 'Jaleco Branco' },
  { href: '/jaleco-feminino-acinturado', label: 'Jaleco Acinturado' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
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
    headline: 'Jaleco para Dentista Feminino: NR-32, Cores e Modelos',
    description: 'Guia de jaleco dentista feminino — tecidos, norma NR-32, CRO e como escolher entre Slim e Profissional.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-dentista-feminino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Dentista Feminino', item: 'https://jaleca.com.br/jaleco-dentista-feminino' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-dentista-feminino', 'https://jaleca.com.br/jaleco-dentista-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-dentista-feminino', 'https://jaleca.com.br/jaleco-dentista-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jaleco Feminino', href: '/jaleco-feminino' },
              { label: 'Jaleco para Dentista', href: null },
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
          eyebrow="Jaleca · Para dentistas"
          h1Line1="Jaleco para Dentista"
          h1Line2="Elegância em cada atendimento"
          description="Jaleco com modelagem slim e tecido premium. Presença profissional que encanta o paciente desde a entrada."
          startingPrice="R$189"
          collectionHref="#colecao"
          allHref="/jaleco-dentista-feminino"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar
          pillars={[
            { label: 'Manga longa NR-32' },
            { label: 'PP ao G3' },
            { label: 'Frete grátis SE' },
            { label: 'Troca em 7 dias' },
          ]}
        />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="dentista"
            professionLabel="Dentistas"
            collectionLabel="Coleção Odontologia"
            productLabel="Jalecos"
            allHref="/jaleco-dentista-feminino"
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
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Conheça cada modelo</h2>
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
              Tudo sobre jaleco para dentista
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <FabricGuideCards />
          </div>
        </section>

        {/* ── ⑧ LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS}
        />

        {/* ── ⑨ CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Sorrisos começam com estilo
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · Manga longa NR-32 · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/jaleco-dentista-feminino"
              style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '0.75rem' }}
            >
              Ver todos os modelos →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>
      <StickyMobileCTA href="#produtos" startingPrice="R

      </main>
    </>
  )
}89" label="Ver coleção" />


      </main>
    </>
  )
}
