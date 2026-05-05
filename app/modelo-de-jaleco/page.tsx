import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Modelos de Jaleco Feminino: Slim, Princesa, Duquesa e Elastex | Jaleca',
  description: 'Conheça todos os modelos de jaleco feminino: Slim acinturado, Princesa evasê, Duquesa manga longa e Elastex. Guia completo para escolher o modelo certo para sua profissão.',
  keywords: 'modelo de jaleco, modelo de jaleco feminino, modelos de jaleco feminino, modelos de jalecos femininos, modelos de jalecos feminino, modelo jaleco feminino, modelo de jalecos femininos, tipos de jaleco feminino',
  alternates: { canonical: 'https://jaleca.com.br/modelo-de-jaleco' },
  openGraph: {
    title: 'Modelos de Jaleco Feminino: Slim, Princesa e Elastex | Jaleca',
    description: 'Todos os modelos de jaleco feminino explicados: Slim, Princesa, Duquesa e Elastex. Escolha o modelo certo para médica, dentista ou enfermeira.',
    url: 'https://jaleca.com.br/modelo-de-jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modelos de Jaleco Feminino | Jaleca',
    description: 'Slim, Princesa, Duquesa e Elastex — guia completo de modelos de jaleco feminino.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    subtitulo: 'O modelo mais pedido por médicas e dentistas',
    desc: 'Corte acinturado com recortes laterais que seguem a silhueta sem apertar. O Slim é o modelo de jaleco feminino mais escolhido em consultórios e clínicas — visual elegante, tecido que não amassa e liberdade de movimento para jornadas longas.',
    indicado: ['Médicas e dentistas em consultório', 'Profissionais que recebem pacientes presencialmente', 'Ambientes clínicos que exigem visual formal'],
    cor: '#c8a96e',
  },
  {
    nome: 'Jaleco Princesa',
    subtitulo: 'Leveza com personalidade',
    desc: 'Modelagem levemente evasê na parte inferior, bordado delicado no bolso. O Princesa tem visual mais humanizado e despojado — muito escolhido por nutricionistas, psicólogas, profissionais de estética e fisioterapeutas que preferem um modelo menos estruturado.',
    indicado: ['Nutricionistas e psicólogas', 'Profissionais de estética e bem-estar', 'Quem prefere mais liberdade de movimento'],
    cor: '#b8a090',
  },
  {
    nome: 'Jaleco Duquesa',
    subtitulo: 'Formalidade e sofisticação',
    desc: 'Manga longa com punho trabalhado, acabamento em alfaiataria premium. O Duquesa é o modelo de jaleco feminino mais formal da linha — ideal para quem precisa transmitir autoridade máxima no ambiente clínico ou em bancas e apresentações acadêmicas.',
    indicado: ['Médicas em hospital ou direção clínica', 'Professoras e pesquisadoras', 'Ambientes formais que exigem jaleco manga longa'],
    cor: '#6b7a8d',
  },
  {
    nome: 'Jaleco Elastex',
    subtitulo: 'Mobilidade para plantões longos',
    desc: 'Tecido com elastano bidirecional — cede em x e y, não só em um eixo. O Elastex garante amplitude total de movimento sem perder o caimento. Indicado para fisioterapeutas, enfermeiras em plantão e qualquer profissional que fica em movimento constante.',
    indicado: ['Fisioterapeutas e enfermeiras', 'Profissionais de plantão (12h+)', 'Quem precisa de máxima mobilidade'],
    cor: '#4a7c59',
  },
  {
    nome: 'Jaleco Plus Size (G1 ao G3)',
    subtitulo: 'Molde próprio para todos os corpos',
    desc: 'Os tamanhos plus size da Jaleca têm molde redesenhado — não é o G ampliado com mais tecido. Ombros, manga, busto e comprimento são recalculados para cada grade. O mesmo caimento do PP aparece do G1 ao G3.',
    indicado: ['Profissionais nos tamanhos G1, G2 e G3', 'Quem nunca encontrou jaleco com caimento adequado', 'Tamanhos com molde exclusivo, não adaptado'],
    cor: '#8b6b8b',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Qual é o modelo de jaleco feminino mais vendido?',
    a: 'O Jaleco Slim é o modelo de jaleco feminino mais vendido — corte acinturado com recortes laterais, tecido em gabardine com elastano. É o preferido de médicas e dentistas de consultório por unir elegância com conforto para jornadas longas.',
  },
  {
    q: 'Qual a diferença entre jaleco Slim e jaleco Princesa?',
    a: 'O Slim tem corte acinturado bem definido, com recortes laterais que seguem a silhueta. O Princesa tem modelagem mais solta na parte inferior (levemente evasê), visual mais despojado. O Slim é mais formal; o Princesa é mais leve e confortável para movimento.',
  },
  {
    q: 'Modelo de jaleco feminino para médica: qual escolher?',
    a: 'Para médica em consultório: Jaleco Slim (elegante, acinturado). Para médica em plantão ou UTI: Jaleco Elastex (máxima mobilidade). Para médica que quer formalidade: Jaleco Duquesa manga longa com punho trabalhado.',
  },
  {
    q: 'Existe modelo de jaleco feminino para plus size?',
    a: 'Sim. A Jaleca tem grade do PP ao G3, e os tamanhos G1, G2 e G3 têm molde próprio — não é adaptação do G. Ombros, manga e comprimento são recalculados para cada grade plus size.',
  },
  {
    q: 'Modelos de jaleco feminino elegante: quais são?',
    a: 'Os modelos mais elegantes são o Jaleco Slim (corte acinturado e sofisticado) e o Jaleco Duquesa (manga longa, acabamento premium em alfaiataria). Para ambientes que pedem máxima elegância, o Duquesa é a escolha certa.',
  },
  {
    q: 'Qual modelo de jaleco não amassa?',
    a: 'Os modelos em Gabardine com elastano e Microfibra são os que menos amassam — disponíveis em toda a grade. Ideais para quem não quer se preocupar com passar roupa antes do plantão.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Modelos de Jaleco Feminino', item: 'https://jaleca.com.br/modelo-de-jaleco' },
  ],
}

export default async function Page() {
  const [placeData, heroImg] = await Promise.all([
    getGooglePlaceData(),
    getCachedHeroImage('jaleco-slim-tradicional-feminino-jaleca'),
  ])

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
    headline: 'Modelos de Jaleco Feminino: Slim, Princesa, Duquesa e Elastex',
    description: 'Guia completo dos modelos de jaleco feminino disponíveis na Jaleca. Slim, Princesa, Duquesa e Elastex — qual escolher para sua profissão.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/modelo-de-jaleco',
    datePublished: '2026-05-04',
    dateModified: '2026-05-04',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Modelos de Jaleco Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}>
          <div className="flex flex-col justify-center order-2 lg:order-1" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}>
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Guia completo
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Modelos de jaleco feminino:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>qual escolher para sua profissão</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Slim acinturado, Princesa evasê, Duquesa manga longa ou Elastex para plantões. Cada modelo tem uma proposta diferente — aqui você encontra qual é o certo para você.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todos os modelos ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Guia jaleco feminino →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
          <div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img src={heroImg.src} alt={heroImg.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* TRUST BAR */}
        <div style={{ background: '#1a1a1a', padding: '1.5rem clamp(1rem,4vw,3rem)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { title: '5 modelos disponíveis', sub: 'Slim, Princesa, Duquesa, Elastex e Plus Size' },
            { title: 'PP ao G3', sub: 'Molde próprio por tamanho' },
            { title: '12 cores', sub: 'Branco, preto e coloridos' },
            { title: 'Frete grátis SE', sub: 'Acima de R$499 no Sudeste' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem 1.25rem', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* MODELOS */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Todos os modelos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Os 5 modelos de jaleco feminino
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
                  <div>
                    <span style={{ display: 'block', width: 32, height: 3, background: modelo.cor, marginBottom: '1rem' }} />
                    <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.6rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                      {modelo.nome}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: '#6b6b6b', fontStyle: 'italic' }}>{modelo.subtitulo}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1.25rem' }}>{modelo.desc}</p>
                    <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Indicado para</p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {modelo.indicado.map((item, j) => (
                        <li key={j} style={{ fontSize: '0.78rem', color: '#4a4a4a', padding: '0.3rem 0.75rem', border: '1px solid #e5e0d8', background: '#faf9f7' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todos os modelos disponíveis ↗
              </Link>
            </div>
          </div>
        </section>

        {/* GRADE DE DECISÃO */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Qual modelo de jaleco escolher
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Profissão / situação</th>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Modelo indicado</th>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Motivo</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#4a4a4a' }}>
                  {[
                    { situacao: 'Médica ou dentista em consultório', modelo: 'Slim', motivo: 'Elegância e corte acinturado para atendimento presencial' },
                    { situacao: 'Enfermeira em plantão longo', modelo: 'Elastex', motivo: 'Elastano bidirecional para mobilidade total' },
                    { situacao: 'Nutricionista ou psicóloga', modelo: 'Princesa', motivo: 'Visual humanizado, menos formal, mais leve' },
                    { situacao: 'Diretora clínica ou acadêmica', modelo: 'Duquesa', motivo: 'Manga longa, punho trabalhado, máxima formalidade' },
                    { situacao: 'Fisioterapeuta', modelo: 'Elastex ou Princesa', motivo: 'Amplitude de movimento para procedimentos' },
                    { situacao: 'Tamanho G1 ao G3', modelo: 'Slim ou Clássico Plus', motivo: 'Molde redesenhado, não adaptado do G' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e0d8', background: i % 2 === 0 ? '#fff' : '#faf9f7' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: '#1a1a1a' }}>{row.situacao}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#c8a96e' }}>{row.modelo}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{row.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <ProfessionProductGrid
          professionKey="medica"
          professionLabel="Profissionais"
          collectionLabel="Modelos Femininos"
          productLabel="Jalecos"
          allHref="/categoria/jalecos-femininos"
        />

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Perguntas frequentes
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre modelos<br />de jaleco feminino
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

        {/* LINKS INTERNOS */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>
              Explore mais
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/jaleco-feminino', label: 'Jaleco Feminino — guia completo' },
                { href: '/jaleco-elegante', label: 'Jaleco Elegante e Alfaiataria' },
                { href: '/jaleco-azul-marinho', label: 'Jaleco Azul Marinho' },
                { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
                { href: '/jaleco-universitario-feminino', label: 'Jaleco Universitário Feminino' },
                { href: '/jaleco-medica', label: 'Jaleco para Médica' },
                { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
                { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
                { href: '/categoria/jalecos-femininos', label: 'Ver todos os jalecos femininos' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Escolha o modelo certo<br />para a sua rotina.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Slim, Princesa, Duquesa ou Elastex — todos com molde feminino real, do PP ao G3, em 12 cores.
            </p>
            <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver modelos disponíveis ↗
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
