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
  title: 'Jaleco Feminino: Modelos Elegantes para Médica, Dentista e Enfermeira',
  description: 'Jaleco feminino com corte real para o corpo: Slim, Princesa, Elegante e Elastex. Do PP ao G3, 12 cores, entrega rápida. Onde comprar jaleco feminino de qualidade.',
  keywords: 'jaleco feminino, jaleco feminino elegante, modelo de jaleco feminino, modelos de jalecos femininos, jaleco de médica, jaleco feminino onde comprar, jalecos femininos elegantes, modelo jaleco feminino',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino' },
  openGraph: {
    title: 'Jaleco Feminino: Modelos Elegantes para Médica, Dentista e Enfermeira | Jaleca',
    description: 'Jaleco feminino Slim, Princesa e Elastex. Do PP ao G3, 12 cores. Onde comprar jaleco feminino de qualidade com entrega rápida para todo o Brasil.',
    url: 'https://jaleca.com.br/jaleco-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Feminino: Modelos Elegantes | Jaleca',
    description: 'Jaleco feminino Slim, Princesa e Elastex. Do PP ao G3, 12 cores. Onde comprar com entrega rápida.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual jaleco feminino é melhor para médica?',
    a: 'Para médica em consultório ou clínica: jaleco em gabardine poliéster/viscose com elastano (150-165 g/m²), manga longa ou 3/4, com fechamento em botões e dois bolsos na altura do quadril. O elastano é essencial — jornadas de 8-12h exigem mobilidade total. O CFM não define cor obrigatória, mas branco é o padrão mais aceito nas instituições.',
  },
  {
    q: 'Jaleco feminino pode ser plus size?',
    a: 'Sim. A grade de uma boa marca de jaleco feminino vai do PP ao G3 — e G3 não é adaptação do G2 com mais tecido, é um molde próprio. Marcas sérias ajustam ombro, manga, busto e comprimento para cada grade. Se você usa entre G e G3 e o jaleco sempre fica apertado nos ombros ou curto demais, o problema é o molde, não o tamanho.',
  },
  {
    q: 'Como escolher o tecido certo para jaleco feminino?',
    a: 'Para atendimento clínico diário: gabardine com elastano (150-165 g/m²) — leve, sem amasso, lavagem a 40°C. Para procedimentos estéticos com exposição a produtos químicos: tecido DWR que repele líquidos. Para laboratório: gramatura maior (200+ g/m²). Evite algodão puro — amassa, encolhe e não mantém o caimento após lavagem frequente.',
  },
  {
    q: 'Jaleco feminino pode ter bordado com o nome?',
    a: 'A Jaleca não oferece serviço de bordado. O jaleco é vendido sem bordado. Você pode levar a peça em uma bordadeira local após receber — é uma alternativa simples e acessível. Importante: após o bordado, o jaleco não pode ser trocado.',
  },
  {
    q: 'Quais modelos de jaleco feminino são mais pedidos?',
    a: 'Os mais pedidos: jaleco reto com elástico na manga (Slim), jaleco com cava americana (Princesa), jaleco com abertura frontal em botão de pressão (Elastex). Cada modelo tem uma proposta diferente — o Slim valoriza o recorte no corpo, o Princesa tem visual mais despojado, o Elastex facilita a vestimenta rápida.',
  },
  {
    q: 'Jaleco feminino de qual cor é mais versátil?',
    a: 'Branco continua sendo o padrão universal — aceito em qualquer instituição e exige menos negociação com uniformes ou RH. Mas tonalidades como azul royal, rosa antigo e verde água têm crescido em estéticas e clínicas que querem identidade visual própria. Se for usar em hospital ou clínica conveniada ao SUS, confirme antes o protocolo da instituição.',
  },
  {
    q: 'Qual jaleco feminino que não amassa do PP ao plus size?',
    a: 'O Gabardine com elastano e a Microfibra são os tecidos que menos amassam da nossa linha — disponíveis em toda a grade, do PP ao G3. Ideais para quem não quer se preocupar com passar roupa.',
  },
  {
    q: 'Melhores marcas de jaleco feminino no Brasil — qual recomendam?',
    a: 'A Jaleca é especializada em jaleco feminino para área da saúde — corte acinturado, tecidos premium (Microfibra, Gabardine, Alfaiataria Premium) e grade completa do PP ao G3. Enviamos para todo o Brasil com frete grátis para SP, RJ, MG e ES.',
  },
  {
    q: 'Onde comprar jaleco feminino de qualidade com entrega rápida no Brasil?',
    a: 'Na Jaleca enviamos em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499. Acesse jaleca.com.br e veja os modelos disponíveis.',
  },
  {
    q: 'Qual jaleco feminino slim mais valoriza a silhueta?',
    a: 'O jaleco feminino slim da linha Jaleca usa recortes laterais e pences nas costas que ajustam o caimento sem apertar — diferente do "slim fit" masculino, que é só uma redução de medidas. O modelo Princesa e o Duquesa são os mais procurados por médicas e dentistas que querem visual elegante sem perder mobilidade. Disponível do PP ao G3.',
  },
  {
    q: 'Jaleco feminino para residência médica — o que considerar?',
    a: 'Residência exige peça resistente: lavagem 3-4x por semana, 12-24h de uso contínuo, contato com fluidos. Recomendamos gabardine 165 g/m² com elastano e DWR (repele líquidos). Manga longa com elástico, dois bolsos amplos (para celular, caneta, estetoscópio) e gola esporte. Branco continua sendo o padrão exigido pela maioria dos hospitais-escola.',
  },
  {
    q: 'Jaleco feminino plus size cabe bem ou fica largo nos ombros?',
    a: 'Na Jaleca o jaleco plus size (G1, G2, G3) é modelado de zero — não é adaptação do G. O ombro é recalculado, a manga ganha 2cm de comprimento progressivo, o busto tem alargamento sem perder cintura, e o quadril mantém proporção. Quem usa 48-54 normalmente acerta no primeiro pedido.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para quem quer corte valorizado',
    desc: 'Recortes laterais que seguem a silhueta. Visual mais elegante, sem perder funcionalidade. Ideal para consultório e atendimento presencial.',
  },
  {
    nome: 'Jaleco Princesa',
    perfil: 'Para quem prefere leveza e fluidez',
    desc: 'Cava americana, manga leve, corte mais solto. Maior liberdade de movimento, ótimo para procedimentos estéticos e fisioterapia.',
  },
  {
    nome: 'Jaleco Elastex',
    perfil: 'Para quem precisa de praticidade',
    desc: 'Fechamento em elástico — veste e tira rápido. Popular em clínicas com trocas frequentes de uniforme ao longo do plantão.',
  },
  {
    nome: 'Jaleco Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados — não é só "mais tecido" no M. Mesmo caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/blog/jaleco-para-medica-guia-completo', label: 'Jaleco para Médica' },
  { href: '/blog/jaleco-para-enfermeira-regras-cofen', label: 'Jaleco para Enfermeira' },
  { href: '/blog/jaleco-para-nutricionista-consultorio', label: 'Jaleco para Nutricionista' },
  { href: '/blog/jaleco-para-fisioterapeuta-guia', label: 'Jaleco para Fisioterapeuta' },
  { href: '/blog/jaleco-para-esteticista-guia', label: 'Jaleco para Esteticista' },
  { href: '/blog/jaleco-para-veterinaria-guia', label: 'Jaleco para Veterinária' },
  { href: '/blog/jaleco-para-psicologa-guia', label: 'Jaleco para Psicóloga' },
  { href: '/blog/jaleco-slim-vs-jaleco-reto-diferencas', label: 'Slim vs Reto' },
  { href: '/blog/jaleco-manga-curta-quando-usar-profissionais', label: 'Manga Curta' },
  { href: '/blog/jaleco-feminino-gestante-como-escolher', label: 'Jaleco Gestante' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-universitario-feminino', label: 'Jaleco Universitária' },
  { href: '/jaleco', label: 'Jaleco (visão geral)' },
  { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
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
    headline: 'Jaleco Feminino para Médica e Enfermeira — Slim, PP ao G3',
    description: 'Jaleco feminino Slim com molde real para o corpo feminino. Avaliação 4.9★. PP ao G3, 12 cores, elastano.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-feminino',
    datePublished: '2026-04-21',
    dateModified: '2026-04-30',
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
    ],
  }

  const modelosItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Modelos de Jaleco Feminino',
    url: 'https://jaleca.com.br/jaleco-feminino',
    numberOfItems: 4,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Jaleco Feminino Slim', url: 'https://jaleca.com.br/categoria/jalecos-femininos' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino Princesa', url: 'https://jaleca.com.br/categoria/jalecos-femininos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino Duquesa', url: 'https://jaleca.com.br/categoria/jalecos-femininos' },
      { '@type': 'ListItem', position: 4, name: 'Jaleco Feminino Elastex', url: 'https://jaleca.com.br/categoria/jalecos-femininos' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAggregateRating).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(modelosItemListSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-feminino', 'https://jaleca.com.br/jaleco-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-feminino', 'https://jaleca.com.br/jaleco-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Jaleco Feminino', href: null },
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
          eyebrow="Jaleca · Uniformes femininos profissionais"
          h1Line1="Jaleco Feminino"
          h1Line2="Slim, Princesa e Elastex"
          description="Com corte pensado para o corpo feminino real. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$189"
          comparePrice="R$219"
          collectionHref="#colecao"
          allHref="/categoria/jalecos-femininos"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Profissionais"
            collectionLabel="Coleção Feminina"
            productLabel="Jalecos"
            allHref="/categoria/jalecos-femininos"
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

        {/* ── ⑦ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco feminino
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

        {/* ── ⑦.5 COMO ESCOLHER ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia de compra</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Como escolher o jaleco feminino ideal
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Escolher um jaleco feminino que funcione no dia a dia exige observar três variáveis: corte, tecido e tamanho.
              Um bom jaleco feminino acompanha o movimento, não amassa entre atendimentos e mantém o caimento mesmo após
              dezenas de lavagens. Abaixo, o que considerar em cada decisão antes de comprar.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              1. Corte: acinturado, princesa ou reto
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              O corte define a silhueta. O modelo Slim usa recortes laterais e pences nas costas para valorizar a cintura sem
              apertar. O Princesa tem cava americana e caimento mais fluido — bom para procedimentos estéticos. O Duquesa,
              mais clássico, agrada quem prefere visual sóbrio de consultório. Se você nunca usou jaleco acinturado,
              comece pelo Slim — é o mais versátil entre os modelos de <Link href="/jaleco-medica" style={{ color: '#c8a96e' }}>jaleco para médica</Link> e <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>dentista</Link>.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              2. Tecido: gabardine, microfibra ou alfaiataria
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              Gabardine com elastano (150-165 g/m²) é o padrão para atendimento clínico — leve, respirável, com pouca formação
              de vinco. Microfibra é mais econômica e também não amassa. Alfaiataria premium tem caimento estruturado e é
              indicada para quem trabalha com paciente particular ou rotina exposta a câmera. Veja também o
              {' '}<Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link>, que ganhou espaço entre quem faz plantões longos.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3. Tamanho: do PP ao G3 com molde próprio
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Confira a tabela de medidas antes de pedir. Marcas que trabalham só com escala (ampliação proporcional do M)
              tendem a apertar nos ombros nas grades maiores. A linha {' '}
              <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link> da Jaleca tem molde refeito do G1 ao G3 — ombro recalculado, manga progressiva,
              busto alargado sem perder cintura. Para climas quentes, o {' '}
              <Link href="/jaleco-manga-curta-feminino" style={{ color: '#c8a96e' }}>jaleco manga curta feminino</Link> é alternativa válida em consultórios sem exigência de manga longa.
            </p>
          </div>
        </section>

        {/* ── ⑦.6 JALECO FEMININO POR PROFISSÃO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Por profissão</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Jaleco feminino por profissão
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              Cada área da saúde tem uma rotina diferente — e isso muda o tipo de jaleco feminino mais indicado. A escolha
              não é só estética: gramatura, comprimento, manga e bolso impactam o conforto ao longo do plantão.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              Para quem atua em consultório clínico, o <Link href="/jaleco-medica" style={{ color: '#c8a96e' }}>jaleco feminino para médica</Link> com gabardine
              165 g/m² e manga longa é o mais aceito. Em odontologia, o <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>jaleco para dentista</Link> com
              tecido DWR (repele líquidos) protege contra respingos durante procedimentos.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              No ambiente hospitalar, o <Link href="/jaleco-enfermeira" style={{ color: '#c8a96e' }}>jaleco para enfermeira</Link> precisa resistir a lavagens
              frequentes — veja também a página de <Link href="/jaleco-enfermagem" style={{ color: '#c8a96e' }}>jaleco de enfermagem</Link> com referências da Cofen.
              Estudantes de <Link href="/jaleco-medicina" style={{ color: '#c8a96e' }}>medicina</Link> costumam optar por modelos básicos e duráveis durante a graduação.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Já em estética, veterinária e farmácia, o jaleco feminino assume papel mais comercial: o {' '}
              <Link href="/jaleco-esteticista" style={{ color: '#c8a96e' }}>jaleco para esteticista</Link>, o {' '}
              <Link href="/jaleco-veterinaria" style={{ color: '#c8a96e' }}>jaleco para veterinária</Link> e o {' '}
              <Link href="/jaleco-farmaceutica" style={{ color: '#c8a96e' }}>jaleco para farmacêutica</Link> aceitam cores
              além do branco. Em todas essas áreas, o corte feminino com elastano segue como o mais procurado.
            </p>
          </div>
        </section>

        {/* ── ⑧ LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}
        />

        {/* ── ⑧.5 MODELOS E CATEGORIAS RELACIONADAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Explore</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem' }}>
              Modelos e categorias relacionadas
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Confira também outros modelos e categorias da loja: {' '}
              <Link href="/categoria/jalecos-femininos" style={{ color: '#c8a96e' }}>todos os jalecos femininos</Link>,{' '}
              <Link href="/jaleco-branco" style={{ color: '#c8a96e' }}>jaleco branco</Link>,{' '}
              <Link href="/jaleco-preto-feminino" style={{ color: '#c8a96e' }}>jaleco preto feminino</Link>,{' '}
              <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link>,{' '}
              <Link href="/jaleco-manga-curta-feminino" style={{ color: '#c8a96e' }}>jaleco manga curta feminino</Link>,{' '}
              <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link>,{' '}
              <Link href="/jaleco-medica" style={{ color: '#c8a96e' }}>jaleco para médica</Link>,{' '}
              <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>jaleco médico</Link>,{' '}
              <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>jaleco dentista</Link>,{' '}
              <Link href="/jaleco-enfermeira" style={{ color: '#c8a96e' }}>jaleco enfermeira</Link>,{' '}
              <Link href="/jaleco-enfermagem" style={{ color: '#c8a96e' }}>jaleco enfermagem</Link> e{' '}
              <Link href="/jaleco-medicina" style={{ color: '#c8a96e' }}>jaleco medicina</Link>.
            </p>
          </div>
        </section>

        {/* ── ⑨ CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Encontre seu jaleco ideal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · 12 cores · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/categoria/jalecos-femininos"
              style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '0.75rem' }}
            >
              Ver todos os modelos →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>
        <StickyMobileCTA href="#colecao" startingPrice="R$189" label="Ver coleção" />
      </main>
    </>
  )
}
