import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { getPosts, type WPPost } from '@/lib/wordpress'
import { getGooglePlaceData } from '@/lib/google-places'
import HubFaqAccordion from '@/components/HubFaqAccordion'
import { getHubProfissao, getClusterLinks } from '@/lib/hub-profissoes'

// Foto do hero variada por profissão — evita repetição e mostra modelos diferentes
const HERO_SLUG: Record<string, string> = {
  podologo:           'jaleco-slim-dama-feminino-jaleca',
  biomedico:          'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  enfermeiro:         'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  fisioterapeuta:     'jaleco-slim-pala-feminino-jaleca',
  nutricionista:      'jaleco-slim-princesa-feminino-varias-cores-jaleca',
  veterinario:        'jaleco-slim-moratty-feminino-ziper-central-jaleca',
  medico:             'jaleco-slim-gold-feminino-jaleca',
  barbeiro:           'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  tatuador:           'jaleco-slim-recortes-masculino-varias-cores-jaleca',
  esteticista:        'jaleco-slim-princesa-manga-curta-feminino-jaleca',
  massagista:         'jaleco-slim-duquesa-feminino-varias-cores-jaleca',
  cabeleireiro:       'jaleco-slim-princesa-laise-feminino-jaleca',
  churrasqueiro:      'jaleco-slim-moratty-masculino-ziper-central-jaleca',
  sushiman:           'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
  cozinheiro:         'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  professor:          'jaleco-slim-gold-pala-feminino-jaleca',
  vendedor:           'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  advogado:           'jaleco-universitario-unissex-jaleca',
  pastor:             'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
  psicologa:          'jaleco-slim-gold-feminino-jaleca',
  farmaceutico:       'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  // dólmã
  'dolma-churrasqueiro': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'dolma-sushiman':      'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'dolma-cozinheiro':    'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
  // conjunto
  'conjunto-advogado':    'conjunto-executiva-feminino-jaleca',
  'conjunto-pastor':      'conjunto-puff-ziper-feminino-jaleca',
  'conjunto-psicologa':   'conjunto-laco-feminino-jaleca',
  'conjunto-farmaceutico':'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  // jaleco genérico
  'professor-uniforme':  'jaleco-slim-gold-pala-feminino-jaleca',
}

const DEFAULT_HERO = 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca'

// Configuração por tipo de produto
const PRODUTO_CONFIG: Record<string, {
  label: string
  labelPlural: string
  catFem: string
  catMasc: string
  catAll: string
  filter: (slug: string) => boolean
}> = {
  jaleco: {
    label: 'Jaleco',
    labelPlural: 'Jalecos',
    catFem: 'jalecos-femininos',
    catMasc: 'jalecos-masculinos',
    catAll: 'jalecos',
    filter: (s) => s.includes('jaleco'),
  },
  dolma: {
    label: 'Dólmã',
    labelPlural: 'Dólmãs',
    catFem: 'domas-femininas',
    catMasc: 'domas-masculinos',
    catAll: 'domas',
    filter: (s) => s.includes('dolma') || s.includes('doma'),
  },
  conjunto: {
    label: 'Conjunto',
    labelPlural: 'Conjuntos',
    catFem: 'conjuntos-femininos',
    catMasc: 'conjuntos-masculinos',
    catAll: 'conjuntos',
    filter: (s) => s.includes('conjunto'),
  },
}

async function getProdutos(produto = 'jaleco'): Promise<WooProduct[]> {
  const cfg = PRODUTO_CONFIG[produto] ?? PRODUTO_CONFIG.jaleco
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, {
      first: 12,
      category: cfg.catFem,
    })
    const all = data?.products?.nodes ?? []
    const filtered = all.filter(p => cfg.filter(p.slug ?? ''))
    return filtered.slice(0, 6)
  } catch {
    return []
  }
}

async function getHeroImage(profissao: string): Promise<{ src: string; alt: string } | null> {
  const slug = HERO_SLUG[profissao] ?? DEFAULT_HERO
  try {
    const data = await graphqlClient.request<{ product: { name: string; image: { sourceUrl: string; altText: string } } }>(
      GET_PRODUCT_BY_SLUG,
      { slug }
    )
    const img = data?.product?.image
    if (!img?.sourceUrl) return null
    return { src: img.sourceUrl, alt: img.altText || data.product.name }
  } catch {
    return null
  }
}

async function getBlogPosts(): Promise<WPPost[]> {
  try {
    const posts = await getPosts({ per_page: 3, search: 'jaleco' })
    return posts.slice(0, 3)
  } catch {
    return []
  }
}

function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>
        {'★'.repeat(full)}{half ? '½' : ''}
      </span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>
        {rating.toFixed(1)} de 5 no Google
      </span>
    </div>
  )
}

const CLUSTER_LABELS: Record<string, string> = {
  saude: 'profissões de saúde',
  beleza: 'profissões de beleza',
  gastronomia: 'gastronomia',
  servicos: 'serviços',
  escritorio: 'profissões liberais',
}

export default async function HubProfissaoTemplate({ profissao }: { profissao: string }) {
  const hub = getHubProfissao(profissao)
  if (!hub) return null

  const produtoConfig = PRODUTO_CONFIG[hub.produto ?? 'jaleco'] ?? PRODUTO_CONFIG.jaleco
  const pageUrl = hub.urlSlug ?? `jaleco-para-${profissao}`

  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getProdutos(hub.produto ?? 'jaleco'),
    getBlogPosts(),
    getGooglePlaceData(),
    getHeroImage(profissao),
  ])

  const clusterLinks = getClusterLinks(hub.cluster, profissao)

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hub.faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: hub.metadata.title,
    description: hub.metadata.description,
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: `https://jaleca.com.br/${pageUrl}`,
    datePublished: '2026-04-18',
    dateModified: '2026-04-18',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: produtoConfig.labelPlural, item: `https://jaleca.com.br/produtos?categoria=${produtoConfig.catAll}` },
      { '@type': 'ListItem', position: 3, name: `${produtoConfig.label} para ${hub.titulo}`, item: `https://jaleca.com.br/${pageUrl}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              ...(hub.cluster === 'saude' ? [{ label: 'Uniformes para Saúde', href: '/uniformes-profissionais-para-saude' }] : [{ label: produtoConfig.labelPlural, href: `/produtos?categoria=${produtoConfig.catAll}` }]),
              { label: `Para ${hub.titulo}`, href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section className="grid" style={{ gridTemplateColumns: '1fr 1fr', minHeight: '88vh', padding: 0 }}>
          <div
            className="flex flex-col justify-center"
            style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme profissional
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(3rem,5.5vw,5.2rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              {produtoConfig.label} para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{hub.titulo}</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              {hub.hero.subtitulo}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href={`/produtos?categoria=${produtoConfig.catFem}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Feminino ↗
              </Link>
              <Link href={`/produtos?categoria=${produtoConfig.catMasc}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Masculino →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>

          <div className="relative" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img
                src={heroImg.src}
                alt={heroImg.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'Tamanhos PP ao G3', sub: 'Grade completa, corpo real' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Com elastano', sub: 'Movimento sem restrição' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca em 30 dias', sub: 'Sem burocracia' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                {item.icon}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── GUIA ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  {hub.guia.tituloSidebar}
                </h2>
                <nav>
                  <ul style={{ listStyle: 'none' }}>
                    {hub.guia.secoes.map(sec => (
                      <li key={sec.id} style={{ marginBottom: '0.5rem' }}>
                        <a href={`#${sec.id}`} style={{ fontSize: '0.82rem', color: '#6b6b6b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ display: 'inline-block', width: 16, height: 1, background: '#c8c4bc', flexShrink: 0 }} />
                          {sec.titulo}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <article>
                {hub.guia.secoes.map((sec, idx) => (
                  <div key={sec.id} id={sec.id} style={{ borderTop: idx === 0 ? 'none' : '1px solid #e5e0d8', paddingTop: idx === 0 ? 0 : '2rem', marginTop: idx === 0 ? 0 : '2.5rem' }}>
                    <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, marginBottom: '1rem', color: '#1a1a1a' }}>
                      {sec.titulo}
                    </h2>
                    {sec.paragrafos.map((p, pi) => (
                      <p key={pi} style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                        {p}
                      </p>
                    ))}
                    {idx === 0 && (
                      <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                          "O jaleco ideal? Aquele que você nem sente que está vestindo. O tecido te acompanha, sem atrapalhar."
                        </p>
                      </div>
                    )}
                    {idx === 1 && (
                      <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                        {[
                          `Slim — ${hub.comparacao.slimIdeal}`,
                          `Profissional — ${hub.comparacao.profissionalIdeal}`,
                        ].map(item => (
                          <li key={item} style={{ fontSize: '0.95rem', color: '#444', padding: '0.6rem 0 0.6rem 1.5rem', position: 'relative', borderBottom: '1px solid #e5e0d8', fontWeight: 300 }}>
                            <span style={{ position: 'absolute', left: 0, color: '#c8c4bc' }}>→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </article>
            </div>
          </div>
        </section>

        {/* ── TABELA COMPARATIVA ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Comparativo de modelagens</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Slim ou Profissional:<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>qual é a certa para você?</em>
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1.5rem 1.5rem 1rem', textAlign: 'left', borderBottom: '2px solid #1a1a1a', width: 200 }} />
                    {[{ label: 'Slim', featured: false }, { label: 'Profissional', featured: true }].map(({ label, featured }) => (
                      <th key={label} style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, padding: '1.5rem 1.5rem 1rem', textAlign: 'left', borderBottom: '2px solid #1a1a1a', background: featured ? '#1a1a1a' : 'transparent', color: featured ? '#fff' : '#1a1a1a', position: 'relative' }}>
                        {featured && (
                          <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', letterSpacing: '0.15em', background: '#1a1a1a', color: '#c8c4bc', padding: '0.3rem 1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                            MAIS VENDIDO
                          </span>
                        )}
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Silhueta', 'Ajustada ao corpo', 'Estruturada, mais ampla'],
                    ['Ideal para', hub.comparacao.slimIdeal, hub.comparacao.profissionalIdeal],
                    ['Elastano', '✓ Presente', '✓ Presente'],
                    ['Bolsos', '2 bolsos', '3 bolsos'],
                    ['Comprimento', 'Curto ou longo', 'Curto ou longo'],
                    ['Cores disponíveis', '12 cores', '12 cores'],
                    ['Tamanhos', 'PP ao G3', 'PP ao G3'],
                  ].map(([label, slim, prof]) => (
                    <tr key={label}>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b6b6b', fontWeight: 400 }}>{label}</td>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', color: '#1a1a1a' }}>{slim}</td>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', color: '#1a1a1a', background: '#f9f7f4' }}>{prof}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td />
                    <td style={{ padding: '1.5rem' }}>
                      <Link href={`/produtos?categoria=${produtoConfig.catFem}`} style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                        Ver Slim →
                      </Link>
                    </td>
                    <td style={{ padding: '1.5rem', background: '#f9f7f4' }}>
                      <Link href={`/produtos?categoria=${produtoConfig.catAll}`} style={{ display: 'flex', justifyContent: 'center', padding: '0.85rem', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', background: '#1a1a1a', color: '#fff' }}>
                        Ver Profissional →
                      </Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Nossa coleção</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                  {produtoConfig.labelPlural} para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>{hub.titulo}s</em>
                </h2>
              </div>
              <Link href={`/produtos?categoria=${produtoConfig.catAll}`} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              {produtos.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre {produtoConfig.label.toLowerCase()}<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para {hub.titulo.toLowerCase()}</em>
            </h2>
            <HubFaqAccordion items={hub.faq} />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Blog Jaleca</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: 0 }}>
              Leitura para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissionais</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2px', background: '#e5e0d8', marginTop: '3rem' }}>
              {posts.length > 0 ? posts.map(post => {
                const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
                const title = post.title.rendered.replace(/<[^>]+>/g, '')
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ aspectRatio: '16/10', background: '#e5e0d8', overflow: 'hidden', position: 'relative' }}>
                      {img ? (
                        <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.85rem', fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>Blog</span>
                      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{excerpt}</p>
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                    </div>
                  </Link>
                )
              }) : (
                [
                  { title: 'Como lavar e conservar seu jaleco profissional', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o amarelamento e encurtam a vida do jaleco. Veja o guia completo.' },
                  { title: 'Jaleco branco: tradição e protocolos profissionais', href: '/blog', tag: 'Guia', excerpt: 'Por que o branco domina as profissões de saúde e o que as normas recomendam sobre cores e vestimenta.' },
                  { title: 'Como escolher o tamanho certo do jaleco', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para medir busto, cintura e quadril e encontrar o tamanho ideal na grade Jaleca.' },
                ].map(post => (
                  <Link key={post.href} href={post.href} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                      <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>{post.tag}</span>
                      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{post.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{post.excerpt}</p>
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/blog" style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6b6b', textDecoration: 'none' }}>
                Ver todos os artigos →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TOPICAL AUTHORITY ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>{CLUSTER_LABELS[hub.cluster] ?? 'profissões'}</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                ...clusterLinks,
                { label: 'Ver todos', href: '/produtos?categoria=jalecos', desc: 'Loja completa' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="block hover:bg-white/5 transition-colors duration-200" style={{ padding: '1.5rem', textDecoration: 'none' }}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#fff', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{item.desc} →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300, color: 'rgba(26,26,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
            JALECA
          </span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>200.000+ peças vendidas</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              O jaleco certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferença</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              {hub.cta.descricao}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href={`/produtos?categoria=${produtoConfig.catFem}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href={`/produtos?categoria=${produtoConfig.catMasc}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
