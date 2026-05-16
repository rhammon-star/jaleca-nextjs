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
import UGCSection from '@/components/UGCSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Feminino Branco | Acinturado, Premium, PP ao G3',
  description: 'Jaleco feminino branco com corte acinturado, tecido Elastex premium e elastano bidirecional. Modelos Slim Elastex, Gold, Tradicional e mais. Do PP ao G3. Frete grátis Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-branco' },
  openGraph: {
    title: 'Jaleco Feminino Branco Acinturado — Coleção Exclusiva | Jaleca',
    description: 'Jaleco feminino branco com corte acinturado, tecido premium e elastano. Para médicas, dentistas e estudantes. Do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-feminino-branco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp', width: 1200, height: 630, alt: 'Jaleco Feminino Branco Acinturado Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Feminino Branco | Jaleca',
    description: 'Jaleco feminino branco acinturado com tecido premium. Para médicas, dentistas e estudantes.',
    images: ['https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco branco feminino é obrigatório em hospitais?',
      acceptedAnswer: { '@type': 'Answer', text: 'Em muitos hospitais e faculdades de medicina e enfermagem, o jaleco branco é o padrão institucional. Em clínicas privadas e consultórios, a cor é definida pela própria instituição — jaleco colorido é aceito em muitos ambientes. O CFM não restringe a cor.' },
    },
    {
      '@type': 'Question',
      name: 'Como lavar jaleco branco feminino sem amarelecer?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lave com água fria ou morna, use sabão neutro. Para alvejamento, use água oxigenada (10 volumes) diluída — evite hipoclorito direto. O Elastex da Jaleca mantém o branco imaculado após dezenas de lavagens.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tamanho de jaleco branco feminino devo comprar?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto e consulte a tabela de medidas. No modelo Slim, em caso de dúvida entre dois tamanhos, opte pelo maior — o corte acinturado tem menos folga. Do PP ao G3 com molde redesenhado para plus size.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco Slim Tradicional e Slim Gold?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Slim Tradicional tem corte reto acinturado clássico — ideal para hospitais e consultórios. O Slim Gold tem acabamento premium com detalhes exclusivos — indicado para clínicas e profissionais que valorizam mais sofisticação visual.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco branco feminino serve para faculdade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O Slim Tradicional branco é o mais pedido por estudantes de medicina, enfermagem, odontologia e farmácia: tecido resistente, corte acinturado e preço acessível. Disponível do PP ao G3.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/jalecos-femininos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Branco Feminino', item: 'https://jaleca.com.br/jaleco-feminino-branco' },
  ],
}

const MODELOS = [
  {
    nome: 'Slim Elastex',
    perfil: 'Mais vendido em branco',
    desc: 'Elastano bidirecional. Não amassa em 12h. Branco puro que mantém a cor após dezenas de lavagens.',
  },
  {
    nome: 'Slim Gold',
    perfil: 'Premium',
    desc: 'Acabamento exclusivo. Visual sofisticado para consultórios e clínicas de alto padrão.',
  },
  {
    nome: 'Slim Tradicional',
    perfil: 'Clássico atemporal',
    desc: 'Corte reto acinturado. Ideal para hospital, faculdade e consultório. Custo-benefício excelente.',
  },
  {
    nome: 'Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Mesmo caimento e branco impecável do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-medica', label: 'Jaleco para Médica' },
  { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
  { href: '/jaleco-feminino-acinturado', label: 'Jaleco Acinturado' },
  { href: '/jaleco-universitario-feminino', label: 'Jaleco Universitária' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
]

export default async function Page() {
  const placeData = await getGooglePlaceData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-feminino-branco', 'https://jaleca.com.br/jaleco-feminino-branco'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-feminino-branco', 'https://jaleca.com.br/jaleco-feminino-branco'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos Femininos', href: '/jaleco-feminino' },
              { label: 'Jaleco Branco', href: null },
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
          eyebrow="Jaleca · Jaleco branco feminino"
          h1Line1="Jaleco Feminino Branco"
          h1Line2="Branco puro que não amarela"
          description="Tecido premium que mantém o branco impecável em 12h. Slim, Princesa e Elastex em branco. Do PP ao G3."
          startingPrice="R$189"
          collectionHref="#colecao"
          allHref="/jaleco-feminino-branco"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar
          pillars={[
            { label: 'Branco que não amarela' },
            { label: 'PP ao G3' },
            { label: 'Frete grátis SE' },
            { label: 'Troca em 7 dias' },
          ]}
        />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Saúde"
            collectionLabel="Coleção Branco"
            productLabel="Jalecos"
            allHref="/jaleco-feminino-branco"
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
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Modelos em branco</h2>
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


        <section className="py-4 px-4"><div className="container"><UGCSection /></div></section>
        {/* ── ⑦ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco branco
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {schemaFaq.mainEntity.map((item, i) => (
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
              Sua presença começa no branco
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · 5 modelos em branco · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/jaleco-feminino-branco"
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
