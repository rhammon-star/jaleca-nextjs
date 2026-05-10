import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Fabricante de Jalecos Brasileira — Produção Própria em Londrina',
  description: 'Jaleca é fabricante de jalecos com produção própria em Londrina/PR. Atacado e varejo, do PP ao G3. Jalecos Brasil com controle de qualidade interno e entrega para todo o país.',
  keywords: 'fabricante de jalecos, jalecos brasil, jaleco brasil, fabricante jaleco, jalecos fabricante, jalecos atacado brasil, fornecedor jalecos',
  alternates: { canonical: 'https://jaleca.com.br/fabricante-de-jalecos' },
  openGraph: {
    title: 'Fabricante de Jalecos Brasileira | Jaleca — Londrina/PR',
    description: 'Fabricante de jalecos com produção própria. Atacado e varejo, do PP ao G3. Entrega para todo o Brasil.',
    url: 'https://jaleca.com.br/fabricante-de-jalecos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabricante de Jalecos — Jaleca | Londrina',
    description: 'Fabricante de jalecos com produção própria em Londrina/PR. Atacado e varejo.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'A Jaleca é fabricante de jalecos ou revendedora?',
    a: 'A Jaleca é fabricante de jalecos com produção própria em Londrina/PR. Todo o processo — do corte ao acabamento e controle de qualidade — é feito internamente. Isso garante consistência no caimento, durabilidade das peças e rastreabilidade de cada produto.',
  },
  {
    q: 'A Jaleca vende jalecos no atacado para empresas e clínicas?',
    a: 'Sim. A Jaleca atende tanto varejo (pessoa física) quanto atacado (empresas, hospitais, clínicas e uniformes corporativos). Para pedidos de atacado, entre em contato pelo WhatsApp ou pelo formulário do site para cotação personalizada por volume.',
  },
  {
    q: 'Onde a Jaleca fabrica os jalecos?',
    a: 'A Jaleca fabrica os jalecos em Londrina, Paraná — com produção 100% brasileira. O controle de qualidade é interno: cada peça passa por inspeção antes de sair da fábrica. Trabalhamos com tecidos nacionais de alta performance: Elastex, Gabardine e Oxford premium.',
  },
  {
    q: 'A Jaleca faz jalecos personalizados com logo da empresa?',
    a: 'A Jaleca não oferece bordado ou personalização como serviço padrão. Para pedidos corporativos com personalização, entre em contato pelo WhatsApp para verificar disponibilidade conforme volume e prazo do pedido.',
  },
  {
    q: 'Qual é o mínimo de peças para compra no atacado?',
    a: 'Entre em contato pelo WhatsApp para condições de atacado — o mínimo de peças e os descontos por volume variam conforme a linha e o prazo de entrega. Atendemos hospitais, redes de clínicas e uniformes corporativos em todo o Brasil.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Sobre a Jaleca', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 3, name: 'Fabricante de Jalecos', item: 'https://jaleca.com.br/fabricante-de-jalecos' },
  ],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jaleca Uniformes Profissionais',
  url: 'https://jaleca.com.br',
  logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  description: 'Fabricante de jalecos profissionais com produção própria em Londrina/PR. Atacado e varejo, do PP ao G3.',
  foundingLocation: { '@type': 'Place', name: 'Londrina, Paraná, Brasil' },
  areaServed: 'Brasil',
  knowsAbout: ['jalecos profissionais', 'uniforme médico', 'jalecos femininos', 'scrubs'],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Sobre a Jaleca', href: '/' },
              { label: 'Fabricante de Jalecos', href: null },
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
              Produção própria · Londrina/PR
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleca: fabricante de jalecos<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>100% brasileira, desde Londrina</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Produção própria com controle de qualidade interno. Corte, costura e inspeção feitos em Londrina/PR. Atendemos varejo e atacado — pessoa física, clínicas, hospitais e uniformes corporativos.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/categoria/jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todos os jalecos ↗
              </Link>
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver catálogo completo →
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
        <div style={{ background: '#1a1a1a', padding: '1.5rem clamp(1rem,4vw,3rem)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {[
            { title: 'Fabricante brasileira', sub: 'Produção própria em Londrina/PR' },
            { title: '+200 mil peças vendidas', sub: '4.9★ no Google' },
            { title: 'PP ao G3', sub: 'Grade completa, molde próprio' },
            { title: 'Atacado e varejo', sub: 'Clínicas, hospitais e PF' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem 1.25rem', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* DIFERENCIAIS */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Por que comprar direto<br />do fabricante
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1px', background: '#e5e0d8', marginBottom: '3rem' }}>
              {[
                { titulo: 'Controle de qualidade interno', texto: 'Cada peça passa por inspeção antes de sair da fábrica. Tecido, costura, botões e caimento são verificados internamente — sem intermediários entre a produção e o produto que você recebe.' },
                { titulo: 'Molde próprio por grade', texto: 'Do PP ao G3, cada tamanho tem molde próprio desenvolvido para aquele corpo — não é o P ampliado. Ombros, manga, busto e comprimento são recalculados para cada grade. É o que garante o caimento igual do PP ao G3.' },
                { titulo: 'Tecidos de alta performance', texto: 'Trabalhamos com Elastex (poliéster + elastano), Gabardine premium e Oxford. Todos testados para resistir a lavagens frequentes sem encolher, desbotar ou perder o caimento após dezenas de ciclos.' },
                { titulo: 'Atendimento atacado e varejo', texto: 'Atendemos médicas comprando uma peça e hospitais comprando 200. O preço por peça muda no atacado — entre em contato para cotação por volume. Atendemos todo o Brasil com entrega rápida.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.3rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.titulo}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.texto}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jalecos fabricados pela Jaleca
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { href: '/categoria/jalecos-femininos', label: 'Jalecos Femininos' },
                { href: '/categoria/jalecos-masculinos', label: 'Jalecos Masculinos' },
                { href: '/categoria/conjuntos-femininos', label: 'Scrubs Femininos' },
                { href: '/categoria/jalecos-manga-curta', label: 'Jalecos Manga Curta' },
                { href: '/categoria/domas-femininas', label: 'Dólmãs Femininas' },
                { href: '/jaleco-elegante', label: 'Jalecos Elegantes e Alfaiataria' },
                { href: '/jaleco-plus-size', label: 'Jalecos Plus Size' },
                { href: '/jaleco-universitario', label: 'Jalecos Universitários' },
              ].map((item) => (
                <Link key={item.href} href={item.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.5rem 1.25rem', border: '1px solid #e5e0d8', background: '#faf9f7' }}>
                  {item.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <ProfessionProductGrid
          professionKey="medica"
          professionLabel="Todos os Profissionais"
          collectionLabel="Linha Jaleca"
          productLabel="Jalecos"
          allHref="/produtos"
        />

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre comprar<br />direto do fabricante
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
              Explore o catálogo
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
                { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
                { href: '/modelo-de-jaleco', label: 'Modelos de Jaleco' },
                { href: '/jaleco-elegante', label: 'Jaleco Elegante' },
                { href: '/jaleco-branco', label: 'Jaleco Branco' },
                { href: '/jaleco-preto', label: 'Jaleco Preto' },
                { href: '/produtos', label: 'Catálogo completo' },
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
              Jalecos direto do fabricante<br />para todo o Brasil.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Varejo e atacado. Do PP ao G3. Produção 100% brasileira. Entrega rápida.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver catálogo ↗
              </Link>
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver jalecos femininos →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
