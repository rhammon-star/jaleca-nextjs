import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import UGCSection from '@/components/UGCSection'

export const revalidate = 3600

type VariationNode = {
  image?: { sourceUrl: string }
  attributes?: { nodes: { name: string; value: string }[] }
}

async function fetchImg(slug: string): Promise<string | null> {
  try {
    const data = await graphqlClient.request<{
      product: WooProduct & {
        image?: { sourceUrl: string }
        variations?: { nodes: VariationNode[] }
      }
    }>(GET_PRODUCT_BY_SLUG, { slug })
    const p = data?.product
    if (!p) return null
    // Tenta achar a variação branca
    const variations = (p.variations?.nodes ?? []) as VariationNode[]
    const brancaVariation = variations.find(v =>
      v.attributes?.nodes?.some(a =>
        a.value?.toLowerCase().includes('branco') || a.value?.toLowerCase().includes('white')
      )
    )
    return brancaVariation?.image?.sourceUrl ?? p.image?.sourceUrl ?? null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Jaleco Feminino Branco | Acinturado, Premium, PP ao G3 — Jaleca',
  description: 'Jaleco feminino branco com corte acinturado, tecido Elastex premium e elastano bidirecional. Modelos Slim Elastex, Gold, Tradicional e mais. Do PP ao G3. Frete grátis Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-branco' },
  openGraph: {
    title: 'Jaleco Feminino Branco Acinturado — Coleção Exclusiva | Jaleca',
    description: 'Jaleco feminino branco com corte acinturado, tecido premium e elastano. Para médicas, dentistas e estudantes. Do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-feminino-branco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp', width: 1200, height: 630, alt: 'Jaleco Feminino Branco Acinturado Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Feminino Branco | Jaleca',
    description: 'Jaleco feminino branco acinturado com tecido premium. Para médicas, dentistas e estudantes.',
    images: ['https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp'],
  },
}

const PRODUTOS_BASE = [
  {
    id: 1,
    nome: 'Slim Elastex Branco',
    descricao: 'Elastano · Acinturado · Não amassa',
    preco: 'R$ 300,00',
    precoPix: 'R$ 285 no PIX',
    parcelamento: '3× de R$ 100 sem juros',
    badge: 'Mais vendido',
    badgeGold: true,
    imageAlt: 'Jaleco Slim Elastex Feminino Branco acinturado Jaleca',
    slug: '/produto/jaleco-slim-elastex-feminino-jaleca?cor=branco',
    wooSlug: 'jaleco-slim-elastex-feminino-jaleca',
  },
  {
    id: 2,
    nome: 'Slim Gold Branco',
    descricao: 'Acabamento premium · Corte exclusivo',
    preco: 'R$ 300,00',
    precoPix: 'R$ 285 no PIX',
    parcelamento: '3× de R$ 100 sem juros',
    badge: 'Premium',
    badgeGold: false,
    imageAlt: 'Jaleco Slim Gold Feminino Branco Jaleca',
    slug: '/produto/jaleco-slim-gold-feminino-jaleca?cor=branco',
    wooSlug: 'jaleco-slim-gold-feminino-jaleca',
  },
  {
    id: 3,
    nome: 'Slim Gold Pala Branco',
    descricao: 'Pala frontal · Elegância máxima',
    preco: 'R$ 320,00',
    precoPix: 'R$ 304 no PIX',
    parcelamento: '3× de R$ 106,67 sem juros',
    badge: 'Exclusivo',
    badgeGold: false,
    imageAlt: 'Jaleco Slim Gold Pala Feminino Branco Jaleca',
    slug: '/produto/jaleco-slim-gold-pala-feminino-jaleca?cor=branco',
    wooSlug: 'jaleco-slim-gold-pala-feminino-jaleca',
  },
  {
    id: 4,
    nome: 'Slim Tradicional Branco',
    descricao: 'Clássico atemporal · Poly + elastano',
    preco: 'R$ 280,00',
    precoPix: 'R$ 266 no PIX',
    parcelamento: '3× de R$ 93,33 sem juros',
    badge: null,
    badgeGold: false,
    imageAlt: 'Jaleco Slim Tradicional Feminino Branco acinturado Jaleca',
    slug: '/produto/jaleco-slim-tradicional-feminino-jaleca?cor=branco',
    wooSlug: 'jaleco-slim-tradicional-feminino-jaleca',
  },
  {
    id: 5,
    nome: 'Slim Moratty Branco',
    descricao: 'Design moderno · Bolsos funcionais',
    preco: 'R$ 280,00',
    precoPix: 'R$ 266 no PIX',
    parcelamento: '3× de R$ 93,33 sem juros',
    badge: null,
    badgeGold: false,
    imageAlt: 'Jaleco Slim Moratty Feminino Branco Jaleca',
    slug: '/produto/jaleco-slim-moratty-feminino-jaleca?cor=branco',
    wooSlug: 'jaleco-slim-moratty-feminino-jaleca',
  },
]

const FALLBACK_IMG = 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp'

const DEPOIMENTOS = [
  {
    texto: 'O caimento é perfeito. Valoriza a silhueta sem perder o aspecto profissional. Minha segunda compra.',
    nome: 'Dra. Camila Souza',
    role: 'Clínica Geral · Belo Horizonte',
  },
  {
    texto: 'Mesmo após várias lavagens, o branco continua impecável. Qualidade muito superior às lojas comuns.',
    nome: 'Dra. Fernanda Lima',
    role: 'Dermatologista · São Paulo',
  },
  {
    texto: 'Comprei o Slim Elastex e não troco por nada. Recomendo para todas as colegas de profissão.',
    nome: 'Dra. Mariana Costa',
    role: 'Pediatra · Rio de Janeiro',
  },
]


const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco branco feminino é obrigatório em hospitais?',
      acceptedAnswer: { '@type': 'Answer', text: 'Em muitos hospitais e faculdades de medicina e enfermagem, o jaleco branco é o padrão institucional. Em clínicas privadas e consultórios, a cor é definida pela própria instituição — jaleco colorido é aceito em muitos ambientes. O CFM não restringe a cor.' },
    },
    {
      '@type': 'Question',
      name: 'Como lavar jaleco branco feminino sem amarelecer?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lave com água fria ou morna, use sabão neutro. Para alvejamento, use água oxigenada (10 volumes) diluída — evite hipoclorito direto. O Elastex da Jaleca mantém o branco imaculado após dezenas de lavagens.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tamanho de jaleco branco feminino devo comprar?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto e consulte a tabela de medidas. No modelo Slim, em caso de dúvida entre dois tamanhos, opte pelo maior — o corte acinturado tem menos folga. Do PP ao G3 com molde redesenhado para plus size.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco Slim Tradicional e Slim Gold?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Slim Tradicional tem corte reto acinturado clássico — ideal para hospitais e consultórios. O Slim Gold tem acabamento premium com detalhes exclusivos — indicado para clínicas e profissionais que valorizam mais sofisticação visual.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco branco feminino serve para faculdade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O Slim Tradicional branco é o mais pedido por estudantes de medicina, enfermagem, odontologia e farmácia: tecido resistente, corte acinturado e preço acessível. Disponível do PP ao G3.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/jalecos-femininos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Branco Feminino', item: 'https://jaleca.com.br/jaleco-feminino-branco' },
  ],
}

export default async function JalecoFemininoBrancoPage() {
  const imgs = await Promise.all(PRODUTOS_BASE.map(p => fetchImg(p.wooSlug)))
  // Filtra produtos sem imagem real para evitar repetição com fallback genérico
  const PRODUTOS = PRODUTOS_BASE
    .map((p, i) => ({ ...p, imagem: imgs[i] }))
    .filter((p, i, arr) => {
      if (!p.imagem) return false
      // Remove duplicatas de imagem
      return arr.findIndex(a => a.imagem === p.imagem) === i
    })
    .map(p => ({ ...p, imagem: p.imagem! }))

  const schemaItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jalecos Femininos Brancos — Coleção Jaleca',
    url: 'https://jaleca.com.br/jaleco-feminino-branco',
    numberOfItems: PRODUTOS.length,
    itemListElement: PRODUTOS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.nome,
        image: p.imagem,
        url: `https://jaleca.com.br${p.slug}`,
        description: p.descricao,
        offers: { '@type': 'Offer', priceCurrency: 'BRL', price: p.preco.replace('R$ ', '').replace(',00', ''), availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'Jaleca' } },
      },
    })),
  }
  return (
    <>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItemList).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <style>{`
        .jfb2-cream { background: #faf8f5; }
        .jfb2-gold { color: #b8936a; }
        .jfb2-btn-primary {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 1rem 2rem; background: #1a1a1a; color: #fff;
          font-size: 0.78rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; text-decoration: none; border: 1px solid #1a1a1a;
          width: 100%;
        }
        .jfb2-btn-secondary {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 1rem 2rem; background: transparent; color: #1a1a1a;
          font-size: 0.78rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; text-decoration: none; border: 1px solid #1a1a1a;
          width: 100%;
        }
        @media (min-width: 640px) {
          .jfb2-btn-primary, .jfb2-btn-secondary { width: auto; }
        }
        .jfb2-card-h {
          display: flex; gap: 0; background: #fff; border: 1px solid #e8e3db;
          text-decoration: none; color: inherit; overflow: hidden;
        }
        .jfb2-card-h-img { width: 140px; min-width: 140px; position: relative; }
        .jfb2-card-h-img img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .jfb2-card-h-body { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.35rem; }
        @media (min-width: 768px) {
          .jfb2-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
          .jfb2-card-h { flex-direction: column; }
          .jfb2-card-h-img { width: 100%; min-width: unset; aspect-ratio: 3/4; }
          .jfb2-card-h-body { padding: 1.25rem; }
        }
        .jfb2-badge-gold { background: #b8936a; color: #fff; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.2rem 0.5rem; display: inline-block; }
        .jfb2-badge-dark { background: #1a1a1a; color: #fff; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.2rem 0.5rem; display: inline-block; }
        .jfb2-sizes { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
        .jfb2-size-pill { font-size: 0.65rem; font-weight: 500; padding: 0.2rem 0.45rem; border: 1px solid #d5cfc6; color: #555; }
        .jfb2-comprar-btn {
          margin-top: auto; padding: 0.65rem 1rem; background: transparent; color: #1a1a1a;
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; border: 1px solid #1a1a1a; text-align: center; display: block;
        }
        .jfb2-comprar-btn:hover { background: #1a1a1a; color: #fff; }
      `}</style>

      <main style={{ fontFamily: "var(--font-body), system-ui, sans-serif", fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos Femininos', href: '/jalecos-femininos' },
              { label: 'Jaleco Branco Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* HERO */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', minHeight: '90vh' }} className="md:grid-cols-2">
          {/* Imagem — aparece primeiro no mobile */}
          <div style={{ position: 'relative', minHeight: 380, background: '#e5e0d8', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp"
              alt="Jaleco feminino branco acinturado modelo Slim Tradicional Jaleca"
              fetchPriority="high"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', display: 'block', position: 'absolute', inset: 0 }}
            />
            {/* Badge flutuante */}
            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'rgba(26,26,26,0.85)', color: '#fff', padding: '0.5rem 0.85rem', backdropFilter: 'blur(4px)' }}>
              <span style={{ color: '#b8936a', fontSize: '0.75rem' }}>★★★★★</span>
              <span style={{ fontSize: '0.72rem', marginLeft: '0.4rem', letterSpacing: '0.05em' }}>4.9 · Google</span>
            </div>
          </div>

          {/* Texto */}
          <div className="flex flex-col justify-center" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#faf8f5' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8936a', marginBottom: '1rem' }}>
              Coleção Exclusiva — Jaleca
            </div>
            <h1 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(3rem,5.5vw,5.2rem)', fontWeight: 300, lineHeight: 1.05, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco Feminino<br /><em style={{ fontStyle: 'italic' }}>Branco</em>
            </h1>
            <blockquote style={{ borderLeft: '3px solid #b8936a', paddingLeft: '1rem', margin: '0 0 2rem', fontStyle: 'italic', fontSize: '1rem', color: '#555', lineHeight: 1.7 }}>
              "Antes de você falar, sua imagem já foi avaliada."
            </blockquote>

            {/* Trust bar 3 colunas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '2.5rem', borderTop: '1px solid #e5e0d8', borderBottom: '1px solid #e5e0d8', padding: '1.25rem 0' }}>
              {[['200k+', 'Peças vendidas'], ['4.9★', 'Avaliação'], ['PP–G3', 'Grade completa']].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#1a1a1a' }}>{v}</div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginTop: '0.2rem' }}>{l}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/produtos?cat=Jalecos&cor=branco" className="jfb2-btn-primary">
                Ver coleção completa ↗
              </Link>
              <Link href="#produtos" className="jfb2-btn-secondary">
                Explorar modelos ↓
              </Link>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.68rem', letterSpacing: '0.1em', color: '#9b9690' }}>
              Sudeste grátis · PIX 5% OFF · Troca em 7 dias
            </p>
          </div>
        </section>

        {/* URGENCY BAR */}
        <div style={{ background: '#b8936a', color: '#fff', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }} className="md:flex-row md:justify-center md:gap-8">
            {['● Estoque limitado P e M', '● Entrega em até 2 dias úteis', '● Frete grátis acima de R$499'].map(t => (
              <span key={t} style={{ fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* PRODUTOS */}
        <section id="produtos" style={{ background: '#faf8f5', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8936a', marginBottom: '0.4rem' }}>Coleção Branca</div>
                <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#1a1a1a', margin: 0 }}>
                  Modelos Exclusivos
                </h2>
              </div>
              <Link href="/produtos?cat=Jalecos&cor=branco" style={{ fontSize: '0.78rem', color: '#1a1a1a', textDecoration: 'none', letterSpacing: '0.08em', borderBottom: '1px solid currentColor' }}>
                Ver todos →
              </Link>
            </div>

            <div className="jfb2-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {PRODUTOS.map(p => (
                <Link key={p.id} href={p.slug} className="jfb2-card-h">
                  <div className="jfb2-card-h-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagem} alt={p.imageAlt} loading="lazy" />
                  </div>
                  <div className="jfb2-card-h-body">
                    {p.badge && (
                      <span className={p.badgeGold ? 'jfb2-badge-gold' : 'jfb2-badge-dark'}>{p.badge}</span>
                    )}
                    <div style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.2 }}>{p.nome}</div>
                    <div style={{ fontSize: '0.75rem', color: '#777' }}>{p.descricao}</div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 500, color: '#1a1a1a' }}>{p.preco}</div>
                      <div style={{ fontSize: '0.72rem', color: '#b8936a', fontWeight: 500 }}>{p.precoPix}</div>
                      <div style={{ fontSize: '0.68rem', color: '#888' }}>{p.parcelamento}</div>
                    </div>
                    <div className="jfb2-sizes">
                      {['PP', 'P', 'M', 'G', 'G2', 'G3'].map(t => (
                        <span key={t} className="jfb2-size-pill">{t}</span>
                      ))}
                    </div>
                    <span className="jfb2-comprar-btn">Comprar agora</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE BANNER */}
        <section style={{ background: '#1a1a1a', color: '#fff', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr' }} className="md:grid-cols-2">
            {/* Imagem */}
            <div style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PRODUTOS[1]?.imagem ?? FALLBACK_IMG}
                alt="Jaleco Slim Gold Feminino Branco — diferenciais de qualidade Jaleca"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0, opacity: 0.65 }}
              />
            </div>
            {/* Texto */}
            <div style={{ padding: 'clamp(3rem,6vw,5rem) clamp(2rem,5vw,4rem)' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8936a', marginBottom: '1rem' }}>Por que Jaleca</div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '2rem' }}>
                Feito para quem <em style={{ fontStyle: 'italic' }}>cuida de vidas</em> com estilo
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                {[
                  'Polyester 65% + Viscose 30% + Elastano 5%',
                  'Antimicrobiano · lavagem até 60°C',
                  'Não amassa durante o expediente',
                  'Grade PP ao G3 · todos os tipos de corpo',
                  'Fabricação própria · entrega imediata',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#d5cfc6' }}>
                    <span style={{ color: '#b8936a', fontSize: '0.7rem' }}>✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/produtos?cat=Jalecos&cor=branco" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver coleção branca ↗
              </Link>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8936a', marginBottom: '0.75rem' }}>Avaliações</div>
              <div style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                O que dizem nossas clientes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#b8936a', fontSize: '1rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.85rem', color: '#555' }}>4.9 · Google Reviews</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="md:grid-cols-3">
              {DEPOIMENTOS.map(d => (
                <div key={d.nome} style={{ background: '#faf8f5', padding: '2rem', borderTop: '3px solid #b8936a' }}>
                  <div style={{ color: '#b8936a', fontSize: '0.85rem', letterSpacing: 2, marginBottom: '1rem' }}>★★★★★</div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#444', lineHeight: 1.75, marginBottom: '1.5rem' }}>"{d.texto}"</p>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1a1a1a' }}>{d.nome}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>{d.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO — H2 com palavras-chave relevantes */}
        <section style={{ background: '#faf8f5', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                Jaleco branco feminino para médica e hospital
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#555' }}>
                Em ambientes hospitalares, o jaleco branco feminino é o padrão mais aceito. O modelo <Link href="/produto/jaleco-slim-tradicional-feminino-jaleca-branco" style={{ color: '#1a1a1a', fontWeight: 500 }}>Slim Tradicional branco</Link> atende exigências de biossegurança com tecido de fácil higienização, enquanto o corte acinturado mantém o visual elegante durante longos plantões. Veja também o <Link href="/jaleco-medica" style={{ color: '#1a1a1a', fontWeight: 500 }}>jaleco para médica</Link> com guia completo de modelos.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                Jaleco branco para dentista — NR-32 e estética clínica
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#555' }}>
                Para dentistas, o jaleco branco feminino precisa unir praticidade a um visual profissional. O <Link href="/produto/jaleco-slim-elastex-feminino-jaleca-branco" style={{ color: '#1a1a1a', fontWeight: 500 }}>Slim Elastex branco</Link> é ideal para odontologia: elastano bidirecional para liberdade de movimentos e tecido antimicrobiano que resiste à NR-32. Confira o guia de <Link href="/jaleco-dentista-feminino" style={{ color: '#1a1a1a', fontWeight: 500 }}>jaleco para dentista feminino</Link>.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                Jaleco branco para faculdade — PP ao G3
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#555' }}>
                Para estudantes de medicina, enfermagem, odontologia e farmácia, o <Link href="/produto/jaleco-slim-tradicional-feminino-jaleca-branco" style={{ color: '#1a1a1a', fontWeight: 500 }}>Slim Tradicional branco</Link> equilibra custo-benefício e durabilidade. Grade completa do PP ao G3, com molde redesenhado para plus size (G1–G3). Veja todos os <Link href="/jalecos-femininos" style={{ color: '#1a1a1a', fontWeight: 500 }}>jalecos femininos</Link>.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                Tecido e durabilidade: Elastex vs Gabardine
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#555' }}>
                Os jalecos brancos da Jaleca são produzidos em <strong>Elastex</strong> (poliéster com elastano bidirecional) ou <strong>gabardine premium</strong>. O tingimento de alta fixação garante que o branco não amarelece com o uso frequente — todos resistem a múltiplas lavagens sem encolher. Compare com nossos <Link href="/jaleco-feminino-acinturado" style={{ color: '#1a1a1a', fontWeight: 500 }}>jalecos acinturados coloridos</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8936a', marginBottom: '0.5rem' }}>Dúvidas frequentes</div>
              <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a' }}>
                FAQ — Jaleco Branco Feminino
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {schemaFaq.mainEntity.map(item => (
                <details key={item.name} style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1.25rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.name}
                    <span style={{ color: '#b8936a', fontSize: '1.2rem', flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: 1.8, color: '#555' }}>
                    {item.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div style={{ background: '#f0e8dc', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="md:grid-cols-4">
            {[
              ['🚚', 'Frete grátis', 'Sudeste acima de R$499'],
              ['🔄', 'Troca em 7 dias', 'Sem burocracia'],
              ['🔒', 'Compra segura', 'Site protegido'],
              ['✂️', 'Fab. própria', 'Qualidade garantida'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1a1a1a' }}>{title}</div>
                <div style={{ fontSize: '0.7rem', color: '#777', marginTop: '0.2rem' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <section style={{ background: '#1a1a1a', color: '#fff', padding: 'clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '1rem' }}>
              Sua imagem começa pelo jaleco certo
            </h2>
            <p style={{ fontSize: '1rem', color: '#b8936a', fontWeight: 500, marginBottom: '0.4rem' }}>
              A partir de R$ 280 &nbsp;|&nbsp; R$ 266 no PIX · 3× sem juros
            </p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '2.5rem' }}>Frete grátis Sudeste · PP ao G3 · Entrega imediata</p>
            <Link
              href="/produtos?cat=Jalecos&cor=branco"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#b8936a', color: '#fff', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              Comprar agora →
            </Link>
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #2e2e2e', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
              {[
                { href: '/jaleco-medica', label: 'Jaleco para Médica' },
                { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
                { href: '/jaleco-feminino-acinturado', label: 'Jaleco Acinturado' },
                { href: '/jalecos-femininos', label: 'Todos os Femininos' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize: '0.72rem', color: '#888', textDecoration: 'none', letterSpacing: '0.08em', borderBottom: '1px solid #444' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

            <UGCSection />

    </main>
    </>
  )
}
