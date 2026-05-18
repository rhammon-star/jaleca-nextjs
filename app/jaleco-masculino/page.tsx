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
  {
    q: 'Jaleco masculino pode ter bordado com o nome?',
    a: 'A Jaleca não oferece serviço de bordado. O jaleco é vendido sem bordado. Você pode levar a peça em uma bordadeira local após receber. Importante: após o bordado, o jaleco não pode ser trocado.',
  },
  {
    q: 'Qual tecido de jaleco masculino não amassa?',
    a: 'Gabardine com elastano e Microfibra são os tecidos que menos amassam — disponíveis em toda a grade, do PP ao G3. Ideais para quem tem jornadas longas e não quer se preocupar com passar roupa.',
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
  { href: '/jaleco', label: 'Jaleco (visão geral)' },
  { href: '/blog', label: 'Blog' },
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
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 },
    },
    url: 'https://jaleca.com.br/jaleco-masculino',
    datePublished: '2026-04-22',
    dateModified: '2026-05-17',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Masculino', item: 'https://jaleca.com.br/jaleco-masculino' },
    ],
  }

  const schemaAggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '61',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const modelosItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Modelos de Jaleco Masculino',
    url: 'https://jaleca.com.br/jaleco-masculino',
    numberOfItems: MODELOS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: MODELOS.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.nome,
      url: 'https://jaleca.com.br/categoria/jalecos-masculinos',
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAggregateRating).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(modelosItemListSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-masculino', 'https://jaleca.com.br/jaleco-masculino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-masculino', 'https://jaleca.com.br/jaleco-masculino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Jaleco Masculino', href: null },
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
          eyebrow="Jaleca · Uniformes masculinos profissionais"
          h1Line1="Jaleco Masculino"
          h1Line2="Slim e Profissional"
          description="Molde com ombros amplos e caimento profissional. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$220"
          collectionHref="#colecao"
          allHref="/categoria/jalecos-masculinos"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medico"
            professionLabel="Profissionais"
            collectionLabel="Coleção Masculina"
            productLabel="Jalecos"
            allHref="/categoria/jalecos-masculinos"
          />
        </div>

        {/* ── ④ PROFISSIONAIS DE TODO O BRASIL (UGC carrossel) ── */}
        <section className="py-4 px-4"><div className="container"><UGCSection /></div></section>

        {/* ── ⑤ GOOGLE 4.9★ + DEPOIMENTOS ── */}
        <GoogleRatingCarousel rating={placeData?.rating ?? 4.9} reviews={placeData?.reviews} />

        {/* ── ⑥ INSTAGRAM ── */}
        <InstagramLazy />

        {/* ── ⑦ MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Qual modelo é o seu?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Conheça cada modelo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: '0.75rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.2rem' }}>{m.nome}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#c8a96e', marginBottom: '0.35rem' }}>{m.perfil}</span>
                    <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ⑧ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco masculino
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

        {/* ── COMO ESCOLHER ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia de compra</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Como escolher o jaleco masculino ideal
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Jaleco masculino não é jaleco feminino com mais tecido. O molde precisa levar em conta a estrutura do corpo masculino:
              ombros mais amplos, cava maior e comprimento proporcional à altura. As três variáveis que definem a escolha certa: corte, tecido e tamanho.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              1. Corte: Slim ou Profissional
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              O Slim tem corte ajustado com elastano — ideal para consultórios particulares, dermatologia e odontologia, onde a apresentação visual importa.
              O Profissional tem cava folgada e ombros amplos — feito para plantão, emergência e procedimentos que exigem mobilidade total, como RCP e exodontia.
              Se você atende paciente particular em consultório próprio, comece pelo Slim. Se faz plantão em hospital, o Profissional aguenta o ritmo.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              2. Tecido: gabardine com elastano
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              Para jaleco masculino em uso clínico diário: gabardine com elastano (170-200 g/m²) — mais pesado que o feminino, não amassa em 8-12h, suporta lavagem a 60°C.
              O elastano evita que o jaleco "trave" na cava durante atendimento. Evite algodão puro: encolhe, amassa e não mantém caimento após lavagens frequentes.
              Veja também o <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link> para quem prioriza mobilidade em plantões longos.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3. Tamanho: do PP ao G3 com molde próprio
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Confira a tabela de medidas antes de pedir. No jaleco masculino o ponto crítico é o ombro: marcas que só ampliam proporcionalmente o M resultam em ombro apertado no G e G2.
              A linha <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link> da Jaleca tem molde refeito do G1 ao G3 — ombro e manga recalculados, sem perder o caimento.
            </p>
          </div>
        </section>

        {/* ── JALECO MASCULINO POR PROFISSÃO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Por profissão</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Jaleco masculino por profissão
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              Cada área tem uma rotina diferente — e isso muda o modelo mais indicado. Gramatura, comprimento, manga e bolso impactam o conforto ao longo do plantão.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              Para quem atua em consultório clínico, o <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>jaleco para médico</Link> com gabardine
              200 g/m² e manga longa é o mais aceito institucionalmente. A Resolução CFM exige nome e CRM visíveis — branco é o padrão.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              Em odontologia, o <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>jaleco para dentista</Link> com tecido DWR protege contra respingos.
              Para quem atua em UTI ou pronto-socorro, o <Link href="/jaleco-enfermeiro" style={{ color: '#c8a96e' }}>jaleco para enfermeiro</Link> precisa resistir a lavagens a 60°C com frequência diária.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Em estética e barbearia, o jaleco assume papel comercial — cores além do branco são aceitas e o corte Slim valoriza a imagem do profissional.
              Veja a página de <Link href="/jaleco-barbeiro" style={{ color: '#c8a96e' }}>jaleco para barbeiro</Link> para referências específicas da categoria.
            </p>
          </div>
        </section>

        {/* ── LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}
        />

        {/* ── MODELOS E CATEGORIAS RELACIONADAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Explore</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem' }}>
              Modelos e categorias relacionadas
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Confira também:{' '}
              <Link href="/categoria/jalecos-masculinos" style={{ color: '#c8a96e' }}>todos os jalecos masculinos</Link>,{' '}
              <Link href="/jaleco-branco" style={{ color: '#c8a96e' }}>jaleco branco</Link>,{' '}
              <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link>,{' '}
              <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link>,{' '}
              <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>jaleco médico</Link>,{' '}
              <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>jaleco dentista</Link>,{' '}
              <Link href="/jaleco-enfermeiro" style={{ color: '#c8a96e' }}>jaleco enfermeiro</Link> e{' '}
              <Link href="/jaleco-feminino" style={{ color: '#c8a96e' }}>jaleco feminino</Link>.
            </p>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Encontre seu jaleco ideal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · Gabardine com elastano · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/categoria/jalecos-masculinos"
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
