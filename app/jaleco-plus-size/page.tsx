import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Jaleco plus size tem o mesmo caimento que os tamanhos comuns?', acceptedAnswer: { '@type': 'Answer', text: 'Na Jaleca sim. Os moldes plus size são desenvolvidos separadamente — não são apenas ampliações do tamanho P. Ombro, busto, cintura e quadril têm proporções específicas para cada tamanho da grade GG ao G3.' } },
    { '@type': 'Question', name: 'Como saber se devo pedir GG ou G1?', acceptedAnswer: { '@type': 'Answer', text: 'Meça seu busto (a parte mais larga), cintura e quadril com fita métrica e compare com a tabela de medidas. Em caso de dúvida entre dois tamanhos, prefira o maior.' } },
    { '@type': 'Question', name: 'Jaleco plus size com elastano encolhe na lavagem?', acceptedAnswer: { '@type': 'Answer', text: 'Não, se lavado corretamente. Use temperatura entre 30°C e 40°C, sem alvejante clorado e sem secadora em temperatura alta. O elastano se preserva bem nessas condições.' } },
    { '@type': 'Question', name: 'Qual o prazo de entrega para plus size?', acceptedAnswer: { '@type': 'Answer', text: '3 a 5 dias úteis para o Sudeste com frete grátis em compras acima de R$499. Todos os tamanhos da grade plus size estão em estoque próprio.' } },
    { '@type': 'Question', name: 'Jaleco plus size feminino em Microfibra existe?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Trabalhamos Microfibra, Gabardine com elastano e Alfaiataria Premium em toda a grade plus size — do GG ao G3. Tecidos leves, que não apertam e não amassam.' } },
    { '@type': 'Question', name: 'Qual jaleco plus size valoriza o corpo sem apertar?', acceptedAnswer: { '@type': 'Answer', text: 'O Gabardine com elastano é o favorito entre clientes plus size — o elastano bidirecional acompanha o corpo sem criar pontos de pressão, mantendo o caimento elegante durante todo o plantão ou expediente.' } },
    { '@type': 'Question', name: 'Onde comprar jaleco plus size feminino com entrega rápida no Brasil?', acceptedAnswer: { '@type': 'Answer', text: 'Na Jaleca enviamos em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499. Toda a grade plus size fica em estoque próprio.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos' },
    { '@type': 'ListItem', position: 3, name: 'Plus Size', item: 'https://jaleca.com.br/jaleco-plus-size' },
  ],
}

export const metadata: Metadata = {
  title: { absolute: 'Jaleco Plus Size | Tecidos Premium do GG ao G3 — Jaleca' },
  description: 'Jalecos plus size em tecido premium com caimento perfeito. Tamanhos do GG ao G3. Frete grátis SP/RJ/MG/ES. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-plus-size' },
  openGraph: {
    title: 'Jaleco Plus Size | Tecidos Premium do GG ao G3 — Jaleca',
    description: 'Jalecos plus size em tecido premium com caimento perfeito. Tamanhos do GG ao G3. Frete grátis SP/RJ/MG/ES.',
    url: 'https://jaleca.com.br/jaleco-plus-size',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const PLUS_SIZE_SIZES = new Set(['GG', 'G1', 'G2', 'G3', 'XGG', 'EGG'])

function hasPlusSizeVariation(product: WooProduct): boolean {
  const variations = product.variations?.nodes ?? []

  if (variations.length > 0) {
    return variations.some(v => {
      const sizeAttr = v.attributes.nodes.find(a =>
        a.name.toLowerCase().includes('tamanho') ||
        a.name.toLowerCase().includes('talle') ||
        a.name.toLowerCase().includes('size')
      )
      if (!sizeAttr) return false
      const sizeVal = sizeAttr.value.toUpperCase()
      return Array.from(PLUS_SIZE_SIZES).some(s => sizeVal.includes(s))
    })
  }

  const sizeAttr = product.attributes?.nodes.find(a =>
    a.name.toLowerCase().includes('tamanho') ||
    a.name.toLowerCase().includes('talle') ||
    a.name.toLowerCase().includes('size')
  )
  if (!sizeAttr) return false
  return sizeAttr.options.some(opt =>
    Array.from(PLUS_SIZE_SIZES).some(s => opt.toUpperCase().includes(s))
  )
}

async function getPlusSizeProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, {
      first: 100,
    })
    const products = data?.products?.nodes ?? []
    return products.filter(hasPlusSizeVariation)
  } catch {
    return []
  }
}
export default async function JalecoPlusSizePage() {
  const [produtos, heroImg] = await Promise.all([
    getPlusSizeProducts(),
    getCachedHeroImage('jaleco-slim-tradicional-feminino-jaleca'),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-plus-size', 'https://jaleca.com.br/jaleco-plus-size'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-plus-size', 'https://jaleca.com.br/jaleco-plus-size'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />
      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Plus Size', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow="Tamanhos especiais"
          h1Line1="Jaleco"
          h1Line2="Plus Size"
          description="Tecido premium, caimento perfeito, preço justo."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* ── GRID DE PRODUTOS PLUS SIZE ── */}
        <section id="produtos" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Exclusivo plus size</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                  Jalecos do GG<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>ao G3</em>
                </h2>
              </div>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                Ver todos →
              </Link>
            </div>

            {produtos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                {produtos.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', border: '1px solid #e5e0d8', marginTop: '2rem' }}>
                <p style={{ fontSize: '0.97rem', color: '#6b6b6b', fontWeight: 300 }}>
                  Em breve novos modelos plus size. Continue acompanhando!
                </p>
                <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', marginTop: '1.5rem', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver todos os jalecos →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── GUIA DE TAMANHOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia de tamanhos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: 1.15 }}>
              Como escolher o tamanho certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>no jaleco plus size</em>
            </h2>
            <p style={{ color: '#6b6b6b', fontWeight: 300, lineHeight: 1.8, marginBottom: '2rem', maxWidth: 680 }}>
              A grade plus size da Jaleca vai do GG ao G3, com corte desenvolvido para corpos reais — não apenas versões ampliadas do P. Cada tamanho tem encaixe de ombro, comprimento de manga e largura de quadril calibrados separadamente.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: '#1a1a1a' }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', color: '#fff' }}>
                    {['Tamanho', 'Busto (cm)', 'Cintura (cm)', 'Quadril (cm)', 'Comprimento (cm)'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 400, letterSpacing: '0.06em', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['GG', '108–112', '96–100', '114–118', '82'],
                    ['G1', '112–116', '100–104', '118–122', '83'],
                    ['G2', '116–120', '104–108', '122–126', '84'],
                    ['G3', '120–126', '108–114', '126–132', '85'],
                  ].map(([size, bust, waist, hip, length], i) => (
                    <tr key={size} style={{ background: i % 2 === 0 ? '#f9f7f4' : '#fff', borderBottom: '1px solid #e5e0d8' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{size}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 300 }}>{bust}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 300 }}>{waist}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 300 }}>{hip}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 300 }}>{length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#9a9690', marginTop: '0.75rem', fontWeight: 300 }}>
              Medidas em centímetros. Para dúvidas, consulte nossa equipe pelo WhatsApp.
            </p>
          </div>
        </section>

        {/* ── TECIDOS E MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Modelos disponíveis</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: 1.15 }}>
              Slim, Reto e Elastex<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>em tamanhos plus size</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {[
                { model: 'Slim Tradicional', desc: 'Corte que valoriza a silhueta. Tergal premium com encaixe de ombro e quadril calibrados para GG ao G3. Ideal para quem quer caimento sem folga excessiva.', badge: 'Mais vendido' },
                { model: 'Slim Elastex', desc: 'Composição com elastano para maior liberdade de movimento. Tecido se adapta ao corpo durante o turno inteiro. Ótimo para profissionais que ficam muito tempo em pé.', badge: 'Com elastano' },
                { model: 'Jaleco Reto', desc: 'Corte clássico com mais espaço na região do busto e quadril. Preferido por quem trabalha em ambientes que exigem movimentação intensa ou uso de EPI por baixo.', badge: 'Clássico' },
              ].map(({ model, desc, badge }) => (
                <div key={model} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.75rem' }}>
                  <span style={{ display: 'inline-block', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c4a97d', marginBottom: '0.75rem', fontWeight: 400 }}>{badge}</span>
                  <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{model}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#6b6b6b', fontWeight: 300, lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem', lineHeight: 1.15 }}>
              Perguntas sobre<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>jalecos plus size</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { q: 'Jaleco plus size tem o mesmo caimento que os tamanhos comuns?', a: 'Na Jaleca sim. Os moldes plus size são desenvolvidos separadamente — não são apenas ampliações do tamanho P. Ombro, busto, cintura e quadril têm proporções específicas para cada tamanho da grade GG ao G3.' },
                { q: 'Como saber se devo pedir GG ou G1?', a: 'Meça seu busto (a parte mais larga), cintura e quadril com fita métrica e compare com a tabela acima. Em caso de dúvida entre dois tamanhos, prefira o maior — jaleco folgado no busto é menos confortável mas mais fácil de usar do que um que aperta.' },
                { q: 'Jaleco plus size com elastano encolhe na lavagem?', a: 'Não, se lavado corretamente. Use temperatura entre 30°C e 40°C, sem alvejante clorado e sem secadora em temperatura alta. O elastano se preserva bem nessas condições.' },
                { q: 'Posso personalizar jaleco plus size com bordado?', a: 'Sim. Todos os modelos da grade GG ao G3 aceitam bordado de nome, especialidade ou logotipo. Entre em contato via WhatsApp para orçamento de bordado em pedidos individuais ou corporativos.' },
                { q: 'Qual o prazo de entrega para plus size?', a: 'O prazo é o mesmo da grade regular: 3 a 5 dias úteis para o Sudeste com frete grátis em compras acima de R$499, e 5 a 10 dias úteis para demais regiões. Todos os tamanhos da grade plus size estão em estoque próprio.' },
              ].map(({ q, a }, i, arr) => (
                <div key={i} style={{ padding: '1.5rem 0', borderBottom: i < arr.length - 1 ? '1px solid #e5e0d8' : 'none' }}>
                  <h3 style={{ fontSize: '0.97rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.5rem', lineHeight: 1.4 }}>{q}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#6b6b6b', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUTO — Detalhamento ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300, color: 'rgba(26,26,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
            JALECA
          </span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>200.000+ peças vendidas</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              Caimento perfeito<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para todos os corpos</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do GG ao G3. Tecido com elastano que se adapta ao seu movimento. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
            </div>
          </div>
        </section>

            
        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={4.9} />

        <UGCSection />

        {/* ── INSTAGRAM ── */}
        <InstagramLazy />

    </main>
    </>
  )
}