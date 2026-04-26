import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const metadata: Metadata = {
  title: 'Jaleco Colorido: 12 Cores para Saúde e Estética',
  description: 'Jaleco colorido para nutricionista, fisioterapeuta, esteticista e pediatra. 12 cores: rosa, lilás, verde, azul, areia e mais. Do PP ao G3 com elastano. Frete grátis SE.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-colorido' },
  openGraph: {
    title: 'Jaleco Colorido: 12 Cores para Saúde e Estética',
    description: 'Jaleco colorido para nutricionista, fisioterapeuta, esteticista e pediatra. 12 cores do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-colorido',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Colorido: 12 Cores para Saúde e Estética',
    description: 'Jaleco colorido 12 cores do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const CORES = [
  { cor: 'Rosa', profissao: 'Nutricionista, obstétrica', hex: '#f4a7b9' },
  { cor: 'Lilás', profissao: 'Psicóloga, harmonização facial', hex: '#c8a9d4' },
  { cor: 'Verde menta', profissao: 'Fisioterapeuta, pediatria', hex: '#a8d5b5' },
  { cor: 'Azul royal', profissao: 'UTI, clínica geral', hex: '#4a90d9' },
  { cor: 'Areia', profissao: 'Estética, spa', hex: '#d4b896' },
  { cor: 'Roxo', profissao: 'Clínica estética, medicina estética', hex: '#9b72b0' },
]

const FAQ_ITEMS = [
  {
    q: 'Jaleco colorido é aceito em hospital e clínica?',
    a: 'Depende da instituição. Em hospitais públicos, a cor geralmente segue protocolo do setor. Em clínicas particulares, consultórios e spas, jaleco colorido é aceito e incentivado — reforça a identidade visual da marca e cria diferenciação.',
  },
  {
    q: 'Qual cor de jaleco é melhor para nutricionista?',
    a: 'Rosa e verde são as cores mais associadas à nutrição — transmitem saúde, leveza e bem-estar. Lilás e areia também são populares em consultórios de nutrição clínica e funcional. A escolha depende da identidade visual do consultório.',
  },
  {
    q: 'Jaleco colorido desbota com lavagem?',
    a: 'Tecidos de poliéster mantêm as cores por mais lavagens que algodão. Para preservar mais: lavar com água fria (30°C), sabão para cores vivas, secar à sombra. Evite alvejante e secadora — ambos aceleram o desbotamento em tecidos coloridos.',
  },
  {
    q: 'Qual cor de jaleco usar para criar identidade visual da clínica?',
    a: 'A cor do jaleco deve seguir a paleta da marca da clínica. Clínicas de estética optam por tons neutros (areia, bege, rosê) para transmitir sofisticação. Clínicas de saúde infantil usam cores vibrantes. Consultórios de terapias holísticas preferem lilás e verde.',
  },
  {
    q: 'Jaleco colorido pode ser personalizado com bordado?',
    a: 'Sim. Bordado com nome e registro profissional é recomendado pelos conselhos (COFEN, COFFITO, CRN). O bordado em jaleco colorido fica bem com linhas na cor do próprio jaleco ou em branco/dourado para destacar.',
  },
  {
    q: 'Jaleco colorido tem as mesmas opções de tamanho que o branco?',
    a: 'Sim. Todos os modelos coloridos estão disponíveis do PP ao G3 com o mesmo molde. A cor não afeta a grade — cada tamanho tem molde próprio do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-preto-feminino', label: 'Jaleco Preto Feminino' },
  { href: '/jaleco-nutricionista', label: 'Jaleco para Nutricionista' },
  { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
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
    headline: 'Jaleco Colorido: 12 Cores para Saúde e Estética',
    description: 'Guia de jaleco colorido — cores por profissão, cuidados e como escolher para identidade visual da clínica.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    url: 'https://jaleca.com.br/jaleco-colorido',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Colorido', item: 'https://jaleca.com.br/jaleco-colorido' },
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
              { label: 'Jaleco Feminino', href: '/jaleco-feminino' },
              { label: 'Jaleco Colorido', href: null },
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
              12 cores disponíveis
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco colorido:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>identidade visual da sua clínica</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Rosa, lilás, verde, azul, areia, roxo e mais. Elastano, gabardine premium e molde feminino do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todas as cores ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Guia jaleco feminino →
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

        <div className="grid" style={{ background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: '12 cores', sub: 'Rosa, lilás, verde, azul e mais' },
            { title: 'PP ao G3', sub: 'Molde feminino próprio' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 30 dias', sub: 'Sem burocracia' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        <ProfessionProductGrid
          professionKey="esteticista"
          professionLabel="Esteticistas e Profissionais de Beleza"
          collectionLabel="Jalecos Coloridos"
          productLabel="Jalecos"
          allHref="/produtos?categoria=jalecos-femininos"
        />

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco branco ainda é o padrão em hospital — mas em consultórios particulares, clínicas de estética e nutrição, a cor do jaleco virou parte da identidade visual da marca. Paciente que entra numa clínica com todos de lilás lembra. Paciente que entra numa com todos de branco não diferencia de nenhuma outra.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              A Jaleca tem 12 cores em gabardine com elastano — todas com o mesmo molde feminino, do PP ao G3, com o mesmo caimento independente da cor escolhida.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Cores por profissão</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Qual cor combina<br />com a sua profissão
            </h2>
            <div className="grid" style={{ gap: '1rem' }}>
              {CORES.map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: item.hex, border: '1px solid rgba(0,0,0,0.08)' }} />
                  <strong style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{item.cor}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#6b6b6b', lineHeight: 1.5 }}>{item.profissao}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todas as cores ↗
              </Link>
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />jaleco colorido
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

        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Sua cor, seu jaleco,<br />sua identidade.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              12 cores. Molde feminino do PP ao G3. Elastano e gabardine premium. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todas as cores ↗
              </Link>
              <Link href="/jaleco-plus-size" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Plus size →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
