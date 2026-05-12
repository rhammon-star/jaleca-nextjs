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
  title: 'Jaleco de Enfermagem Feminino: Plantão, COFEN e Lavagem 60°C',
  description: 'Jaleco enfermagem feminino com elastano para plantão. Aguenta lavagem a 60°C, cumpre COFEN 375/2011 e tem molde próprio do PP ao G3. Frete grátis Sudeste acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-enfermagem' },
  openGraph: {
    title: 'Jaleco de Enfermagem Feminino: Plantão, COFEN e Lavagem 60°C',
    description: 'Jaleco enfermagem feminino com elastano para plantão. Aguenta lavagem a 60°C e tem molde próprio do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-enfermagem-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco de Enfermagem Feminino: Plantão, COFEN e Lavagem 60°C',
    description: 'Jaleco enfermagem feminino com elastano para plantão. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual tecido é melhor para jaleco de enfermagem feminino?',
    a: 'Poliéster 67% + viscose 29% + elastano 4%. O poliéster suporta lavagem a 60°C sem encolher — exigência de biossegurança hospitalar. A viscose regula a temperatura no plantão de 12h. O elastano acompanha os 150 a 200 movimentos de alcance e flexão que a enfermeira faz por plantão.',
  },
  {
    q: 'Jaleco branco é obrigatório para enfermeira?',
    a: 'Não por lei, mas branco é o padrão histórico hospitalar. Em hospitais modernos, a cor indica setor: azul para UTI, verde para centro cirúrgico, rosê para obstetrícia, branco para clínica geral. A codificação por cor facilita a identificação da equipe em emergências.',
  },
  {
    q: 'Manga longa ou manga curta para jaleco de enfermagem?',
    a: 'A NR-32 classifica o jaleco como EPI em ambientes de risco biológico — manga longa é a indicação geral para procedimentos com exposição a fluidos biológicos. Em ambulatórios de baixo risco, manga curta é aceita, mas verificar o protocolo da instituição antes.',
  },
  {
    q: 'Enfermeira pode usar jaleco fora do hospital?',
    a: 'Não. A Resolução COFEN 375/2011 proíbe o jaleco fora da instituição de trabalho. A contaminação cruzada é o risco principal — supermercado, transporte público e qualquer ambiente fora da clínica são proibidos com o jaleco de trabalho.',
  },
  {
    q: 'Qual diferença entre jaleco Slim e Profissional para enfermeira?',
    a: 'O Slim tem corte estruturado — ideal para ambulatórios e clínicas com visual moderno. O Profissional tem abertura de cava ampla essencial para os movimentos de cuidado direto: higienização do paciente, posicionamento no leito, mobilização e RCP.',
  },
  {
    q: 'Jaleco de enfermagem feminino tem bolsos suficientes?',
    a: 'Os modelos Jaleca têm bolso lateral esquerdo para estetoscópio dobrado, bolso peito direito para caneta e termômetro, bolso lateral direito para luvas de procedimento — posicionamento que evita flexão lombar repetida para buscar materiais.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para ambulatório e clínica',
    desc: 'Corte estruturado que não frouxa no plantão. Não enrola durante curativos e cateterismo. Visual moderno para clínicas particulares.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para plantão hospitalar',
    desc: 'Cava ampla para AVDs do cuidado direto: higienização, posicionamento, mobilização e RCP. Suporta lavagem a 60°C. Padrão em UTI e emergência.',
  },
  {
    nome: 'Jaleco Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados — não é só mais tecido. Mesmo caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-nutricionista', label: 'Jaleco para Nutricionista' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/uniformes-profissionais-saude', label: 'Uniformes para Saúde' },
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
    headline: 'Jaleco de Enfermagem Feminino: Plantão, COFEN e Lavagem 60°C',
    description: 'Guia de jaleco de enfermagem feminino — tecidos, normas COFEN, NR-32 e como escolher pelo tipo de trabalho.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-enfermagem-feminino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Enfermagem Feminino', item: 'https://jaleca.com.br/jaleco-enfermagem-feminino' },
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
      {(() => { const s = buildHowToSchema('jaleco-enfermagem-feminino', 'https://jaleca.com.br/jaleco-enfermagem-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-enfermagem-feminino', 'https://jaleca.com.br/jaleco-enfermagem-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jaleco Feminino', href: '/jaleco-feminino' },
              { label: 'Jaleco Enfermagem Feminino', href: null },
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
          eyebrow="Para enfermeiras"
          h1Line1="Jaleco de enfermagem feminino:"
          h1Line2="conforto para o plantão inteiro"
          description="Elastano que acompanha os movimentos do plantão. Lavagem a 60°C sem encolher. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        <ProfessionProductGrid
          professionKey="enfermeira"
          professionLabel="Enfermeiras"
          collectionLabel="Coleção Enfermagem"
          productLabel="Jalecos"
          allHref="/produtos?categoria=jalecos-femininos"
        />

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco de enfermagem feminino com molde masculino adaptado trava na hora errada. A cava estreita limita a abdução de ombros na mobilização do paciente. O comprimento desproporcional enrola durante curativo. E o tecido sem elastano não acompanha os 150 a 200 movimentos de alcance e flexão que a enfermeira faz por plantão.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco certo começa no tecido: poliéster + viscose + elastano suporta lavagem a 60°C sem encolher, regula a temperatura no plantão de 12h e tem bolsos posicionados para estetoscópio, termômetro e luvas sem forçar flexão lombar.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os modelos disponíveis e o que diferencia cada um pelo tipo de trabalho.
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
              Jaleco de enfermagem feminino:<br />qual modelo escolher
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
                  <Link href="/produtos?categoria=jalecos-femininos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>
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
              Normas e tecido
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              COFEN, NR-32 e<br />tecido para enfermagem
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {[
                { tema: 'Tecido padrão', detalhe: 'Poliéster + viscose + elastano', obs: 'Aguenta lavagem a 60°C sem encolher. A viscose regula a temperatura no plantão longo. O elastano acompanha os movimentos do cuidado direto.' },
                { tema: 'Tecido para UTI', detalhe: 'Com acabamento antimicrobiano', obs: 'Prata iônica reduz colonização bacteriana na superfície entre lavagens. Recomendado em ambientes de isolamento e UTI.' },
                { tema: 'COFEN 375/2011', detalhe: 'Uso exclusivo da instituição', obs: 'Jaleco proibido fora do ambiente de trabalho — supermercado, transporte público, qualquer local externo. Contaminação cruzada é o risco.' },
                { tema: 'NR-32', detalhe: 'EPI em ambientes de risco biológico', obs: 'Manga longa recomendada para procedimentos com exposição a fluidos. Empregador é responsável por fornecer e manter o jaleco.' },
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
              Dúvidas sobre jaleco<br />de enfermagem feminino
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
              Jaleco que aguenta<br />o plantão inteiro.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Molde feminino. Do PP ao G3. Elastano e lavagem a 60°C. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
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


      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />

    </main>
    </>
  )
}
