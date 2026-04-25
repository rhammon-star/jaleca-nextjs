import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const metadata: Metadata = {
  title: 'Pijama Cirúrgico Feminino: Scrub para Saúde do PP ao G3',
  description: 'Pijama cirúrgico feminino com elastano — scrub para médicas, enfermeiras e centro cirúrgico. Tecido antimicrobiano, lavagem a 60°C, do PP ao G3. Frete grátis SE acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/pijama-cirurgico-feminino' },
  openGraph: {
    title: 'Pijama Cirúrgico Feminino: Scrub para Saúde do PP ao G3',
    description: 'Pijama cirúrgico feminino com elastano para médicas, enfermeiras e centro cirúrgico. Do PP ao G3.',
    url: 'https://jaleca.com.br/pijama-cirurgico-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pijama Cirúrgico Feminino: Scrub para Saúde do PP ao G3',
    description: 'Pijama cirúrgico feminino com elastano. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual a diferença entre pijama cirúrgico e scrub?',
    a: 'São o mesmo produto — nomes diferentes para o conjunto calça + blusa usado em ambientes hospitalares. "Scrub" é o termo americano que caiu no uso no Brasil. "Pijama cirúrgico" é o nome técnico mais usado em UTI, centro cirúrgico e emergência.',
  },
  {
    q: 'Pijama cirúrgico feminino precisa de tecido específico?',
    a: 'Para uso hospitalar: poliéster com acabamento antimicrobiano que suporta lavagem a 60°C. O antimicrobiano (prata iônica) reduz colonização bacteriana entre lavagens — importante em UTI e centro cirúrgico. Para clínica ou ambulatório: poliéster + elastano já resolve, com mais conforto.',
  },
  {
    q: 'Qual cor de pijama cirúrgico é obrigatória?',
    a: 'Nenhuma cor é definida por lei federal, mas instituições têm protocolos próprios: verde é o padrão histórico em centro cirúrgico, azul em UTI, rosê em obstetrícia. Em clínicas particulares, a escolha é livre — a identidade visual da clínica define a cor.',
  },
  {
    q: 'Pijama cirúrgico feminino pode ser usado fora do hospital?',
    a: 'A Resolução COFEN 375/2011 proíbe roupa de trabalho hospitalar fora da instituição. O risco de contaminação cruzada é real — o scrub sai do centro cirúrgico carregando patógenos hospitalares para ambientes externos.',
  },
  {
    q: 'Qual diferença entre pijama cirúrgico e jaleco para médica?',
    a: 'O pijama cirúrgico (scrub) é conjunto calça + blusa — substitui a roupa de baixo em ambientes como UTI, CC e emergência onde o profissional não pode usar roupa pessoal. O jaleco vai por cima da roupa em consultório e ambulatório. Muitas médicas usam os dois dependendo do setor.',
  },
  {
    q: 'Pijama cirúrgico feminino tem tamanho grande?',
    a: 'Do PP ao G3 com molde próprio por tamanho. A calça tem elástico na cintura e cordão de ajuste — se adapta a diferentes proporções dentro da mesma grade. Consulte a tabela de medidas antes de pedir.',
  },
]

const MODELOS = [
  {
    nome: 'Scrub Clássico',
    perfil: 'Para hospital e plantão',
    desc: 'Blusa gola V com bolso no peito, calça reta com elástico. Padrão em UTI, CC e emergência. Tecido antimicrobiano, lavagem a 60°C.',
  },
  {
    nome: 'Conjunto Scrub Premium',
    perfil: 'Para clínica e consultório',
    desc: 'Corte mais ajustado com elastano bidirecional. Visual moderno para clínicas particulares que querem identidade visual própria.',
  },
  {
    nome: 'Scrub Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Calça com elástico e cordão. Blusa com corte feminino em todas as grades do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-medico-feminino', label: 'Jaleco Médico Feminino' },
  { href: '/jaleco-enfermagem-feminino', label: 'Jaleco Enfermagem Feminino' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-enfermeiro', label: 'Jaleco para Enfermeiro' },
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
    headline: 'Pijama Cirúrgico Feminino: Scrub para Saúde do PP ao G3',
    description: 'Guia de pijama cirúrgico feminino — tecidos, normas COFEN e como escolher pelo setor de trabalho.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/pijama-cirurgico-feminino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Uniformes para Saúde', item: 'https://jaleca.com.br/uniformes-profissionais-saude' },
      { '@type': 'ListItem', position: 3, name: 'Pijama Cirúrgico Feminino', item: 'https://jaleca.com.br/pijama-cirurgico-feminino' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Uniformes para Saúde', href: '/uniformes-profissionais-saude' },
              { label: 'Pijama Cirúrgico Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Scrub profissional
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Pijama cirúrgico feminino:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>conforto para UTI, CC e plantão</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Conjunto calça + blusa com elastano. Tecido antimicrobiano que aguenta lavagem a 60°C. Do PP ao G3 com molde feminino.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos femininos ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver jalecos →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
        </section>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Antimicrobiano', sub: 'Prata iônica entre lavagens' },
            { title: 'Lavagem a 60°C', sub: 'Biossegurança hospitalar' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'PP ao G3', sub: 'Molde feminino próprio' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        <ProfessionProductGrid
          professionKey="cirurgico-feminino"
          professionLabel="Pijama Cirúrgico Feminino"
          collectionLabel="Scrubs & Pijamas Cirúrgicos"
          productLabel="Conjuntos"
          allHref="/produtos?categoria=conjuntos-femininos"
        />

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Pijama cirúrgico e scrub são o mesmo produto — dois nomes para o conjunto calça + blusa que substitui a roupa pessoal em ambientes de alto risco biológico. UTI, centro cirúrgico e emergência exigem que o profissional troque completamente a roupa ao entrar no setor.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O tecido certo para pijama cirúrgico feminino: poliéster com acabamento antimicrobiano, lavagem a 60°C sem deformar, elastano para mobilidade no plantão de 12h. O molde feminino tem cava e cintura calibrados — não é a versão masculina com menos tecido.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os modelos disponíveis e como escolher pelo setor de trabalho.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Modelos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Pijama cirúrgico feminino:<br />qual modelo escolher
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>{modelo.perfil}</span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{modelo.nome}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/produtos?categoria=conjuntos-femininos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>Ver modelos →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />pijama cirúrgico feminino
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Guias relacionados</p>
            <div className="flex flex-wrap gap-3">
              {INTERNAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}>{link.label}</Link>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Conforto para<br />o plantão inteiro.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Molde feminino. Do PP ao G3. Antimicrobiano e lavagem a 60°C. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos femininos ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver jalecos →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
