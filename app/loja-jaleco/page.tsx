import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import LojaProductGrid from '@/components/LojaProductGrid'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Loja de Jaleco Online — Jalecos para Profissionais',
  description: 'Loja de jaleco com modelos para saúde, beleza e gastronomia. Tecidos premium, corte feminino real, grade PP ao G3. Frete grátis SP, RJ, MG e ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/loja-jaleco' },
  openGraph: {
    title: 'Loja de Jaleco Online — Jalecos para Profissionais',
    description: 'Loja de jaleco com modelos para saúde, beleza e gastronomia. Tecidos premium e corte feminino real.',
    url: 'https://jaleca.com.br/loja-jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    q: 'Como escolher o tamanho certo do jaleco?',
    a: 'Meça seu busto, cintura e quadril e compare com nossa tabela de medidas disponível no site. Nossos jalecos femininos vão do PP ao G3 com molde próprio para cada grade — o G3 não é o M com mais tecido, é um molde recalculado. Se estiver na dúvida entre dois tamanhos, prefira o maior.',
  },
  {
    q: 'Quais tecidos são usados nos jalecos da Jaleca?',
    a: 'Trabalhamos com gabardine com elastano (150-165 g/m²) para o dia a dia clínico — leve, sem amasso, fácil de lavar. Os modelos slim têm elastano bidirecional que acompanha o movimento de agachamento e extensão de braço. Todos os tecidos passam por lavagem industrial sem perder o caimento.',
  },
  {
    q: 'Posso personalizar o jaleco com bordado?',
    a: 'Sim. Nome e especialidade bordados são padrão COFEN e CFM. Aceitamos pedidos com bordado de nome, cargo, CRM, CRO e logo da clínica. Consulte prazo adicional antes de finalizar o pedido — bordado costuma adicionar 3-5 dias úteis.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Depende do CEP. Para SP, RJ, MG e ES: 3-7 dias úteis via PAC (grátis acima de R$499) ou 1-3 dias via SEDEX. Para outras regiões: 7-15 dias via PAC ou 3-5 dias via SEDEX. Calculamos o frete exato no carrinho antes de você finalizar a compra.',
  },
  {
    q: 'Posso trocar o jaleco se o tamanho não servir?',
    a: 'Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. O custo do frete de devolução é por conta do cliente. Mais detalhes em /trocas-e-devolucoes.',
  },
]

const CATEGORIAS = [
  { href: '/categoria/jalecos-femininos', label: 'Jalecos Femininos', sub: 'Slim, Princesa, Elastex — PP ao G3' },
  { href: '/categoria/jalecos-masculinos', label: 'Jalecos Masculinos', sub: 'Corte clássico e slim masculino' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico', sub: 'Gabardine, manga longa, bolsos laterais' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista', sub: 'Com fechamento adequado e mobilidade' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista', sub: 'Cores, tecidos específicos para estética' },
  { href: '/jaleco-cabeleireiro', label: 'Jaleco para Cabeleireiro', sub: 'Repele fios, lavagem frequente' },
  { href: '/jaleco-universitario', label: 'Jaleco Universitário', sub: 'Padrão de curso, bordado de faculdade' },
  { href: '/jaleco-premium', label: 'Jaleco Premium', sub: 'Tecidos diferenciados, acabamento superior' },
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: 'Loja de Jaleco', item: 'https://jaleca.com.br/loja-jaleco' },
    ],
  }

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Loja de Jaleco Online — Jalecos para Profissionais de Saúde e Beleza',
    description: 'Guia da loja de jaleco online. Tecidos premium, corte feminino real, grade do PP ao G3. Frete grátis SP, RJ, MG e ES acima de R$499.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    url: 'https://jaleca.com.br/loja-jaleco',
    datePublished: '2026-04-10',
    dateModified: '2026-04-24',
  }

  const socialProofSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaleca',
    description: 'Mais de 200.000 peças vendidas desde 2010. Loja especializada em jalecos e uniformes profissionais.',
    url: 'https://jaleca.com.br',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(socialProofSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Produtos', href: '/produtos' },
              { label: 'Loja de Jaleco', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Jaleca
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Loja de jaleco<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>para profissionais de verdade</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Modelos para saúde, beleza e gastronomia. Tecidos que aguentam turno longo, lavagem frequente e ainda mantêm o caimento. Grade completa do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver todos os modelos →
              </Link>
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Femininos →
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

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Molde próprio por tamanho', sub: 'Não é o padrão aumentado' },
            { title: 'PP ao G3', sub: 'Grade completa, todos os corpos' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── PRODUTOS — Above the Fold ── */}
        <LojaProductGrid />

        {/* ── CATEGORIAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Categorias
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Jalecos por profissão e estilo
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: '1rem' }}>
              {CATEGORIAS.map((cat, i) => (
                <Link key={i} href={cat.href} style={{ display: 'block', border: '1px solid #e5e0d8', padding: '1.5rem', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.4rem' }}>{cat.label}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{cat.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTEÚDO SEO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Quando você busca uma loja de jaleco, provavelmente já sabe o que precisa: uma peça que aguenta o dia todo sem perder o caimento, que lava bem e que não fica apertada nas costas depois de duas horas de atendimento. Esse é o ponto de partida da Jaleca.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Nossos jalecos são feitos com gabardine com elastano — o tecido que combina estrutura visual com mobilidade real. Sem esse elastano, o jaleco fica bonito no cabide mas aperta na manga quando você levanta o braço. Com ele, o jaleco acompanha o movimento sem puxar nem destorcer.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              A grade vai do PP ao G3 com molde próprio para cada tamanho. Isso significa que o G2 não é o M com mais tecido — é um molde com ombro, manga e comprimento recalculados. Resultado: o jaleco caiu bem em PP e cai bem em G3.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Dúvidas
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Perguntas frequentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.q}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
              Pronta para escolher?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Mais de 30 modelos disponíveis. Entrega para todo o Brasil.
            </p>
            <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver todos os jalecos →
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
