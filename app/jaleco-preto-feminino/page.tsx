import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import CategoryProductGrid from '@/components/CategoryProductGrid'

export const metadata: Metadata = {
  title: 'Jaleco Preto Feminino: Esteticista, Barbeiro e Tatuador',
  description: 'Jaleco preto feminino com elastano — para esteticista, cabeleireiro e tatuador. Tecido que não retém pelos, repele produtos. Do PP ao G3. Frete grátis SE acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-preto-feminino' },
  openGraph: {
    title: 'Jaleco Preto Feminino: Esteticista, Barbeiro e Tatuador',
    description: 'Jaleco preto feminino com elastano para esteticista, cabeleireiro e tatuador. Do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-preto-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Preto Feminino: Esteticista, Barbeiro e Tatuador',
    description: 'Jaleco preto feminino com elastano. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Por que jaleco preto é popular em estética e beleza?',
    a: 'Preto combina com qualquer decoração de estúdio ou clínica, disfarça respingos de tinta, ácidos e produtos químicos leves, e tem apelo visual forte para fotos e vídeos no Instagram e TikTok. Em barbearias premium e estúdios de tatuagem virou o padrão do setor.',
  },
  {
    q: 'Jaleco preto feminino mancha com produto químico?',
    a: 'Depende do produto e do tecido. Gabardine com tratamento DWR (repelência a água) repele cremes, géis e finalizadores — o produto escorrega sem absorver. Alvejante e ácidos fortes mancham qualquer tecido escuro. Limpe o quanto antes com pano úmido.',
  },
  {
    q: 'Jaleco preto feminino é aceito em hospital ou clínica médica?',
    a: 'Depende do protocolo da instituição. Em hospitais públicos, branco ou a cor do setor é o padrão. Em clínicas particulares de estética, dermatologia e medicina estética, preto é aceito e até incentivado para reforçar a identidade visual da marca.',
  },
  {
    q: 'Qual tecido é melhor para jaleco preto feminino?',
    a: 'Gabardine calendrado (superfície laminada) para quem trabalha com pelos e tintura — os fios cortados escorregam em vez de cravar no tecido. Gabardine com DWR para esteticistas com exposição a produtos líquidos. Com elastano em ambos para mobilidade.',
  },
  {
    q: 'Jaleco preto desbota com lavagem frequente?',
    a: 'Tecidos de poliéster mantêm o preto por mais lavagens que algodão. Lavar com água fria (30°C), sabão específico para cores escuras e secar à sombra preserva a cor por mais tempo. Evite secadora — o calor acelera o desbotamento.',
  },
  {
    q: 'Jaleco preto feminino slim fica bem em fotos?',
    a: 'Sim — é um dos motivos pelo qual o preto dominou em estúdios e barbearias que criam conteúdo para redes sociais. O corte Slim ajustado valoriza a silhueta e o fundo preto reduz distração visual no vídeo. Tecido com leve acetinado fica ainda melhor em câmera.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim Preto',
    perfil: 'Para estética e conteúdo digital',
    desc: 'Corte ajustado com elastano. Visual premium para estúdios de tatuagem, clínicas de estética e barbearias que criam conteúdo para redes sociais.',
  },
  {
    nome: 'Jaleco Profissional Preto',
    perfil: 'Para jornadas longas',
    desc: 'Folga calibrada nos ombros para procedimentos. Cava ampla para movimentos de depilação, massagem e aplicação de tratamentos. Conforto em plantões longos.',
  },
  {
    nome: 'Jaleco Plus Size Preto (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Mesmo caimento slim do PP ao G3 — não é só mais tecido.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
  { href: '/jaleco-cabeleireiro', label: 'Jaleco para Cabeleireiro' },
  { href: '/jaleco-tatuador', label: 'Jaleco para Tatuador' },
  { href: '/jaleco-colorido', label: 'Jaleco Colorido' },
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
    headline: 'Jaleco Preto Feminino: Esteticista, Barbeiro e Tatuador',
    description: 'Guia de jaleco preto feminino — tecidos, cuidados e como escolher pelo tipo de trabalho.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    url: 'https://jaleca.com.br/jaleco-preto-feminino',
    datePublished: '2026-04-22',
    dateModified: '2026-04-22',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Preto Feminino', item: 'https://jaleca.com.br/jaleco-preto-feminino' },
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
              { label: 'Jaleco Preto Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              Para beleza e estética
              <span style={{ display: 'inline-block', width: 32, height: 1, background: 'rgba(255,255,255,0.2)' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff', marginBottom: '1.5rem' }}>
              Jaleco preto feminino:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#c8a96e' }}>estética, beleza e identidade</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Tecido que não retém pelos. Repele produtos e finalizadores. Elastano para mobilidade. Do PP ao G3 com molde feminino.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?cor=preto&categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#c8a96e', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos pretos ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                Todas as cores →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
        </section>

        <div className="grid" style={{ background: '#111', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Não retém pelos', sub: 'Superfície calendrada' },
            { title: 'Repele produtos', sub: 'Tratamento DWR disponível' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'PP ao G3', sub: 'Molde feminino próprio' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.08)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        <CategoryProductGrid
          categorySlug="jalecos-femininos"
          color="preto"
          professionLabel="Profissionais de Beleza e Estética"
          collectionLabel="Jalecos Pretos"
          productLabel="Jalecos"
          allHref="/produtos?categoria=jalecos-femininos&cor=preto"
          limit={12}
        />

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco preto virou o padrão em barbearias premium, estúdios de tatuagem e clínicas de estética por um motivo prático: disfarça respingos de tinta, produtos químicos e finalizadores que no branco seriam imediatamente visíveis. E fica melhor em câmera — esteticistas e tatuadores que criam conteúdo para redes sociais descobriram isso cedo.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O tecido certo para jaleco preto feminino é gabardine calendrado com elastano — a superfície laminada não retém pelos cortados nem absorve produtos com facilidade. Com tratamento DWR, repele cremes e géis antes de absorver.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Modelos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Jaleco preto feminino:<br />qual modelo escolher
            </h2>
            <div className="grid" style={{ gap: '1.5rem' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>{modelo.perfil}</span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{modelo.nome}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/produtos?cor=preto&categoria=jalecos-femininos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>Ver modelos →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />jaleco preto feminino
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

        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
              Antes de você entrar,<br />seu jaleco já foi avaliado.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', lineHeight: 1.8 }}>
              Molde feminino. Do PP ao G3. Preto com caimento perfeito. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <Link href="/produtos?cor=preto&categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#c8a96e', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver jalecos pretos ↗
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
