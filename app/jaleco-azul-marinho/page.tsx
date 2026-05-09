import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import UGCSection from '@/components/UGCSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Azul Marinho Feminino e Scrub Azul Marinho | Jaleca',
  description: 'Jaleco azul marinho feminino e scrub feminino azul marinho para profissionais da saúde. Também em azul claro e azul royal. Do PP ao G3, entrega rápida para todo o Brasil.',
  keywords: 'jaleco azul marinho feminino, scrub feminino azul marinho, scrub azul marinho, jaleco azul marinho, jaleco azul claro, jalecos azul claro, scrub azul, jaleco azul feminino',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-azul-marinho' },
  openGraph: {
    title: 'Jaleco Azul Marinho Feminino e Scrub Azul | Jaleca',
    description: 'Jaleco e scrub feminino em azul marinho e azul claro. Do PP ao G3. Entrega rápida para todo o Brasil.',
    url: 'https://jaleca.com.br/jaleco-azul-marinho',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Azul Marinho Feminino | Jaleca',
    description: 'Jaleco e scrub feminino em azul marinho e azul claro. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Jaleco azul marinho feminino: quais profissões usam?',
    a: 'O jaleco azul marinho é muito usado por enfermeiras, fisioterapeutas, técnicas de enfermagem e profissionais de estética. Em clínicas privadas e consultórios que adotam identidade visual própria, o azul marinho é a cor mais escolhida por transmitir confiança, seriedade e profissionalismo — sem a frieza do branco puro.',
  },
  {
    q: 'Qual a diferença entre jaleco azul marinho e jaleco azul claro?',
    a: 'O azul marinho é uma tonalidade escura e formal — muito usado em ambientes hospitalares e clínicas que buscam seriedade. O azul claro tem tom mais suave e é preferido em clínicas de estética, consultórios de pediatria e ambientes que buscam um visual mais acolhedor e humanizado.',
  },
  {
    q: 'Scrub feminino azul marinho: o que é?',
    a: 'O scrub feminino azul marinho é o conjunto (blusa + calça) na cor azul marinho, muito usado por enfermeiras e técnicas em centros cirúrgicos e UTIs. O azul marinho é a cor padrão de scrub em muitas instituições hospitalares brasileiras.',
  },
  {
    q: 'Jaleco azul marinho pode ser usado em hospital?',
    a: 'Depende do protocolo da instituição. Muitos hospitais adotam código de cores por função — o azul é frequentemente associado à enfermagem. Verifique o protocolo do seu hospital ou clínica antes de escolher. Em consultórios privados, o azul marinho é amplamente aceito.',
  },
  {
    q: 'A Jaleca tem scrub azul marinho e jaleco azul marinho?',
    a: 'Sim. A Jaleca oferece jalecos e scrubs (conjuntos) em azul marinho, azul claro e azul royal. Disponíveis do PP ao G3, com entrega para todo o Brasil. Verifique os modelos disponíveis em jaleca.com.br.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Azul Marinho', item: 'https://jaleca.com.br/jaleco-azul-marinho' },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco Azul Marinho', href: null },
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
              Azul marinho · Azul claro · Azul royal
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco azul marinho feminino<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>e scrub azul para saúde</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Jalecos e scrubs femininos em azul marinho, azul claro e azul royal para profissionais da saúde. Corte feminino real, do PP ao G3, entrega para todo o Brasil.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos azul ↗
              </Link>
              <Link href="/categoria/conjuntos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver scrubs azul →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>⭐ {placeData.rating.toFixed(1)} no Google</span>
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
        <div style={{ background: '#1a3a5c', padding: '1.5rem clamp(1rem,4vw,3rem)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { title: 'Azul marinho e azul claro', sub: 'Jalecos e scrubs nas duas tonalidades' },
            { title: 'PP ao G3', sub: 'Molde feminino por tamanho' },
            { title: 'Tingimento durável', sub: 'Azul que não desbota' },
            { title: 'Entrega rápida', sub: 'Para todo o Brasil' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem 1.25rem', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* CONTEÚDO */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Jaleco e scrub em azul:<br />opções disponíveis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1px', background: '#e5e0d8', marginBottom: '3rem' }}>
              {[
                {
                  titulo: 'Jaleco azul marinho feminino',
                  desc: 'Jaleco com corte acinturado na cor azul marinho. O modelo Slim em azul marinho é o mais pedido por enfermeiras e fisioterapeutas que buscam um visual profissional elegante fora do branco. Disponível do PP ao G3.',
                  link: '/categoria/jalecos-femininos',
                  cta: 'Ver jaleco azul marinho',
                },
                {
                  titulo: 'Scrub feminino azul marinho',
                  desc: 'Conjunto (blusa + calça) em azul marinho para profissionais de saúde. O scrub azul marinho é o padrão de muitas UTIs e centros cirúrgicos brasileiros — conforto máximo com tecido de elastano bidirecional.',
                  link: '/categoria/conjuntos-femininos',
                  cta: 'Ver scrub azul marinho',
                },
                {
                  titulo: 'Jaleco azul claro feminino',
                  desc: 'Tom mais suave que o azul marinho — muito escolhido em clínicas de estética, consultórios de pediatria e ambientes que buscam visual mais acolhedor. Disponível nos modelos Slim e Princesa, do PP ao G3.',
                  link: '/categoria/jalecos-femininos',
                  cta: 'Ver jaleco azul claro',
                },
                {
                  titulo: 'Jaleco azul royal',
                  desc: 'Azul vibrante e de alto impacto visual. Muito usado em clínicas com identidade visual própria e em uniformes corporativos. O azul royal transmite confiança e dinamismo — ideal para clínicas modernas.',
                  link: '/categoria/jalecos-femininos',
                  cta: 'Ver jaleco azul royal',
                },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.3rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.titulo}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, marginBottom: '1.25rem' }}>{item.desc}</p>
                  <Link href={item.link} style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>
                    {item.cta} →
                  </Link>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Qual profissão usa jaleco azul marinho?
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#1a3a5c', color: '#fff' }}>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Profissão</th>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Cor mais comum</th>
                    <th style={{ textAlign: 'left', padding: '0.9rem 1rem' }}>Tipo</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#4a4a4a' }}>
                  {[
                    { profissao: 'Enfermeira', cor: 'Azul marinho ou azul claro', tipo: 'Jaleco ou scrub' },
                    { profissao: 'Fisioterapeuta', cor: 'Azul marinho ou verde', tipo: 'Jaleco ou scrub' },
                    { profissao: 'Técnica de enfermagem', cor: 'Azul marinho', tipo: 'Scrub (conjunto)' },
                    { profissao: 'Esteticista', cor: 'Azul claro ou rosê', tipo: 'Jaleco Slim' },
                    { profissao: 'Nutricionista', cor: 'Azul claro ou verde', tipo: 'Jaleco Princesa' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e0d8', background: i % 2 === 0 ? '#fff' : '#faf9f7' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500, color: '#1a1a1a' }}>{row.profissao}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#1a3a5c' }}>{row.cor}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{row.tipo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <ProfessionProductGrid
          professionKey="enfermeira"
          professionLabel="Enfermeiras e Fisioterapeutas"
          collectionLabel="Jalecos e Scrubs Azul"
          productLabel="Jalecos"
          allHref="/categoria/jalecos-femininos"
        />

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre jaleco<br />azul marinho
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
                { href: '/jaleco-feminino', label: 'Jaleco Feminino — todas as cores' },
                { href: '/jaleco-colorido', label: 'Jaleco Colorido' },
                { href: '/jaleco-elegante', label: 'Jaleco Elegante' },
                { href: '/jaleco-preto-feminino', label: 'Jaleco Preto Feminino' },
                { href: '/jaleco-branco', label: 'Jaleco Branco' },
                { href: '/jaleco-enfermeira', label: 'Jaleco para Enfermeira' },
                { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
                { href: '/categoria/conjuntos-femininos', label: 'Scrubs Femininos' },
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
              Jaleco azul para cada<br />profissional da saúde.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Azul marinho, azul claro e azul royal. Jaleco e scrub. Do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos azul ↗
              </Link>
              <Link href="/categoria/conjuntos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver scrubs azul →
              </Link>
            </div>
          </div>
        </section>

            <UGCSection />

    </main>
    </>
  )
}
