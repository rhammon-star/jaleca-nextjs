import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProducts } from '@/lib/all-products'
import { prioritizeByColor } from '@/lib/product-professions'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedBlogPosts } from '@/lib/profession-page-data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Feminino Acinturado | Corte Slim para Consultório | Jaleca',
  description: 'Jaleco feminino acinturado com corte Slim que define a cintura sem apertar. Elastex, Tradicional e Princesa do PP ao G3. 12 cores. Frete grátis Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-acinturado' },
  openGraph: {
    title: 'Jaleco Feminino Acinturado | Jaleca',
    description: 'Corte Slim que define a cintura sem apertar. PP ao G3, 12 cores.',
    url: 'https://jaleca.com.br/jaleco-feminino-acinturado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco feminino acinturado é confortável para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, especialmente o Slim Elastex — tecido com elastano bidirecional que acompanha todos os movimentos mesmo no corte acinturado. Para plantões longos, é o modelo mais indicado. O Slim Tradicional é mais estruturado, ideal para consultórios com menos movimento intenso.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco acinturado e jaleco reto?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco acinturado (Slim) tem recortes laterais que definem a cintura e acompanham a silhueta feminina. O jaleco reto tem corte tubular, sem ajuste de cintura. O acinturado transmite mais elegância; o reto oferece mais espaço para procedimentos.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado aperta com o tempo?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não, se escolher o tamanho correto. Em caso de dúvida entre dois tamanhos no modelo Slim, opte pelo maior. O corte acinturado tem menos folga por design. Após lavagens, o tecido Elastex mantém o caimento sem encolher.' },
    },
    {
      '@type': 'Question',
      name: 'Qual modelo Slim é mais indicado para médicas e dentistas?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Slim Elastex para quem precisa de muito movimento (procedimentos, plantão). O Slim Tradicional branco para consultório e atendimento. O Slim Princesa para profissionais que preferem evasê na parte inferior — nutricionistas e esteticistas adoram.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco feminino acinturado estilo blazer existe para clínica médica?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O modelo Alfaiataria Premium da Jaleca tem acabamento de blazer — estruturado, elegante e profissional. Ideal para recepção de clínica, coordenação de saúde ou qualquer profissional que queira transmitir autoridade com sofisticação.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado que não amassa durante o dia inteiro — existe?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Gabardine com elastano é o tecido mais resistente ao amassado da nossa linha — você passa 8, 10, 12 horas de expediente e o jaleco mantém o caimento sem precisar passar.' },
    },
    {
      '@type': 'Question',
      name: 'Onde comprar jaleco feminino acinturado com entrega rápida?',
      acceptedAnswer: { '@type': 'Answer', text: 'Na Jaleca enviamos em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/categoria/jalecos-femininos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino Acinturado', item: 'https://jaleca.com.br/jaleco-feminino-acinturado' },
  ],
}

const SLIM_SLUGS = [
  'jaleco-slim-elastex-feminino-jaleca',
  'jaleco-slim-tradicional-feminino-jaleca',
  'jaleco-slim-princesa-feminino-jaleca',
  'jaleco-slim-gold-feminino-jaleca',
  'jaleco-slim-pala-feminino-jaleca',
  'jaleco-slim-duquesa-feminino-jaleca',
]

async function getSlimProducts() {
  try {
    const all = await getAllProducts()
    const slim = all.filter(p => {
      if (SLIM_SLUGS.includes(p.slug)) return true
      const base = p.slug.split('-').slice(0, -1).join('-')
      return SLIM_SLUGS.includes(base)
    })
    return prioritizeByColor(slim).slice(0, 6)
  } catch {
    return []
  }
}

function HeroStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>{'★'.repeat(Math.floor(rating))}</span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{rating.toFixed(1)}★</span>
    </div>
  )
}

export default async function JalecoFemininoAcinturadoPage() {
  const [produtos, posts, placeData] = await Promise.all([
    getSlimProducts(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos Femininos', href: '/categoria/jalecos-femininos' },
              { label: 'Acinturado', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '80vh' }}>
          <div className="flex flex-col justify-center order-2 lg:order-1" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}>
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Corte exclusivo feminino
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(3rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco Feminino<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Acinturado</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Corte Slim que define a cintura sem apertar. Elegância real para consultório, clínica e plantão.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver coleção ↗
              </Link>
              <Link href="/jaleco-plus-size" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Plus size →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>

          <div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 400, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #d4cfc6 0%, #bfbab2 100%)', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(4rem,10vw,8rem)', fontWeight: 300, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>Slim</span>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0" style={{ background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Corte Slim exclusivo', sub: 'Define cintura sem apertar' },
            { title: 'Elastano no tecido', sub: 'Movimento sem restrição' },
            { title: 'PP ao G3', sub: 'Grade completa, corpo real' },
            { title: 'Frete grátis Sudeste', sub: 'Acima de R$499' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── GRID DE PRODUTOS ── */}
        {produtos.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Corte acinturado</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
                Modelos<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Slim Jaleca</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver todos os modelos →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── GUIA ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Por que o corte acinturado faz diferença
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Acinturado vs reto', anchor: '#acinturado-vs-reto' },
                      { label: 'Modelos disponíveis', anchor: '#modelos' },
                      { label: 'Para consultório e plantão', anchor: '#consultorio' },
                      { label: 'Como escolher o tamanho', anchor: '#tamanho' },
                    ].map(item => (
                      <li key={item.anchor} style={{ marginBottom: '0.5rem' }}>
                        <a href={item.anchor} style={{ fontSize: '0.82rem', color: '#6b6b6b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ display: 'inline-block', width: 16, height: 1, background: '#c8c4bc', flexShrink: 0 }} />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              <article>
                {[
                  {
                    id: 'acinturado-vs-reto',
                    title: 'Acinturado vs reto: qual a diferença real?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Jaleco reto tem corte tubular — não acompanha a silhueta feminina. O resultado é um volume que disfarça as formas e deixa o visual mais informal, independente da qualidade do tecido.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O corte acinturado (Slim) tem recortes laterais que definem a cintura. O jaleco segue o contorno do corpo sem apertar — a diferença entre "usar jaleco" e "vestir jaleco".
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco ideal? Aquele que você nem sente que está vestindo. O tecido te acompanha, sem atrapalhar."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelos',
                    title: 'Modelos Slim disponíveis',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Todos os modelos Slim têm corte acinturado. A diferença está no tecido e no acabamento:
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim Elastex — elastano bidirecional, máximo conforto em procedimentos e plantões',
                            'Slim Tradicional — gabardine estruturado, ideal para consultório e atendimento',
                            'Slim Princesa — evasê na parte inferior, preferido por nutricionistas e esteticistas',
                            'Slim Gold — linha premium com acabamentos diferenciados para clínicas de alto padrão',
                          ].map(item => (
                            <li key={item} style={{ fontSize: '0.95rem', color: '#444', padding: '0.6rem 0 0.6rem 1.5rem', position: 'relative', borderBottom: '1px solid #e5e0d8', fontWeight: 300 }}>
                              <span style={{ position: 'absolute', left: 0, color: '#c8c4bc' }}>→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    ),
                  },
                  {
                    id: 'consultorio',
                    title: 'Para consultório e plantão',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          No consultório, o jaleco acinturado transmite autoridade e cuidado com a imagem. Médicas, dentistas e fisioterapeutas relatam que pacientes percebem a diferença — um jaleco bem ajustado passa mais confiança.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para plantões e procedimentos longos, o Slim Elastex é a escolha certa: cede em todos os sentidos, permite agachar, levantar os braços e se movimentar com naturalidade, sem perder o caimento elegante.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'tamanho',
                    title: 'Como escolher o tamanho certo',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O corte acinturado tem menos folga por design — é assim que funciona. Em caso de dúvida entre dois tamanhos, escolha o maior. O Elastex tem boa margem de adaptação pelo tecido.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, fontWeight: 300 }}>
                          Grade completa do PP ao G3. Para tamanhos GG, G1, G2 e G3, veja a linha{' '}
                          <Link href="/jaleco-plus-size" style={{ color: '#1a1a1a', textDecoration: 'underline', textUnderlineOffset: 3 }}>Jaleco Plus Size</Link>
                          {' '}— mesmos modelos Slim com grade ampliada.
                        </p>
                      </>
                    ),
                  },
                ].map(sec => (
                  <div key={sec.id} id={sec.id} style={{ borderTop: '1px solid #e5e0d8', paddingTop: '2rem', marginTop: '2.5rem' }}>
                    <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, marginBottom: '1rem', color: '#1a1a1a' }}>
                      {sec.title}
                    </h2>
                    {sec.body}
                  </div>
                ))}
              </article>
            </div>
          </div>
        </section>

        {/* ── PRODUTO DETALHE ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Perguntas sobre<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>jaleco acinturado</em>
            </h2>
            <div style={{ maxWidth: 760 }}>
              {faqSchema.mainEntity.map(item => (
                <div key={item.name} style={{ borderTop: '1px solid #e5e0d8', padding: '1.5rem 0' }}>
                  <p style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.1rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.name}</p>
                  <p style={{ fontSize: '0.92rem', color: '#6b6b6b', lineHeight: 1.8, fontWeight: 300 }}>{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BLOG ── */}
        {posts.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Blog Jaleca</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '3rem' }}>
                Leitura para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissionais</em>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2px', background: '#e5e0d8' }}>
                {posts.slice(0, 3).map(post => {
                  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '…'
                  const title = post.title.rendered.replace(/<[^>]+>/g, '')
                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                      <div style={{ aspectRatio: '16/10', background: '#e5e0d8', overflow: 'hidden' }}>
                        {img ? (
                          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.85rem', fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{title}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{excerpt}</p>
                        <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── LINKS RELACIONADOS ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Explore mais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Outros jalecos<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>femininos</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Jaleco Médica', href: '/jaleco-medica', desc: 'Para medicina' },
                { label: 'Jaleco Dentista', href: '/jaleco-dentista', desc: 'Para odontologia' },
                { label: 'Jaleco Enfermeira', href: '/jaleco-enfermeira', desc: 'Para enfermagem' },
                { label: 'Jaleco Plus Size', href: '/jaleco-plus-size', desc: 'Grade GG ao G3' },
                { label: 'Jaleco Preto', href: '/jaleco-preto', desc: 'Em preto' },
                { label: 'Jaleco Branco', href: '/jaleco-branco', desc: 'Em branco clássico' },
                { label: 'Jaleco Manga Curta', href: '/blog/jaleco-feminino-manga-curta', desc: 'Manga curta' },
                { label: 'Ver coleção', href: '/categoria/jalecos-femininos', desc: 'Todos os modelos' },
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
            SLIM
          </span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Corte que veste de verdade</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              Do PP ao G3,<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>12 cores disponíveis</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Corte acinturado Slim, elastano para conforto, frete grátis no Sudeste acima de R$499.
            </p>
            <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
              Ver Coleção Feminina
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
