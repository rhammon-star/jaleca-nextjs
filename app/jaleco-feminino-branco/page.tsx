import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import TrustBadgeBar from '@/components/TrustBadgeBar'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Branco Feminino | Médica, Dentista e Faculdade | Jaleca',
  description: 'Jaleco branco feminino com corte acinturado, tecido Elastex e modelagem exclusiva. Para médicas, dentistas, enfermeiras e estudantes. Do PP ao G3. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-branco' },
  openGraph: {
    title: 'Jaleco Branco Feminino — Modelagem Exclusiva | Jaleca',
    description: 'Jaleco branco feminino para médicas, dentistas e faculdade. Corte acinturado, tecido premium, do PP ao G3. Frete grátis no Sudeste.',
    url: 'https://jaleca.com.br/jaleco-feminino-branco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Jaleco Branco Feminino Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Branco Feminino | Jaleca',
    description: 'Jaleco branco feminino com corte acinturado e tecido premium. Para médicas, dentistas e estudantes.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Branco Feminino: Guia Completo de Modelos e Tecidos',
  description: 'Guia completo do jaleco branco feminino: modelos Slim, Duquesa e Princesa, tecidos Elastex e gabardine, tamanhos do PP ao G3 para médicas, dentistas e estudantes.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-feminino-branco',
  datePublished: '2026-05-06',
  dateModified: '2026-05-06',
}

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
      acceptedAnswer: { '@type': 'Answer', text: 'Lave com água fria ou morna, use sabão neutro. Para alvejamento, use água oxigenada (10 volumes) diluída — evite hipoclorito direto, que pode enfraquecer o tecido. O Elastex da Jaleca mantém o branco imaculado após dezenas de lavagens quando seguidas as instruções.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tamanho de jaleco branco feminino devo comprar?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto e consulte a tabela de medidas da Jaleca. No modelo Slim, em caso de dúvida entre dois tamanhos, opte pelo maior — o corte acinturado tem menos folga. Os tamanhos vão do PP ao G3, com molde redesenhado para plus size (G1-G3).' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco Slim Tradicional e Slim Princesa?',
      acceptedAnswer: { '@type': 'Answer', text: 'O Slim Tradicional tem corte reto acinturado, ideal para uso hospitalar e clínico. O Slim Princesa tem recortes em detalhe que valorizam ainda mais a silhueta — indicado para consultórios e ambientes que permitem um visual mais sofisticado.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco branco feminino serve para faculdade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O Jaleco Slim Tradicional branco é o mais pedido por estudantes de medicina, enfermagem, odontologia e farmácia: tecido gabardine resistente, corte acinturado e preço acessível. O Jaleco Universitário Unissex é uma alternativa econômica para quem está no início do curso.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/jaleco-feminino' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Branco Feminino', item: 'https://jaleca.com.br/jaleco-feminino-branco' },
  ],
}

const HERO_IMAGE = 'https://wp.jaleca.com.br/wp-content/uploads/2026/04/JALECO-SLIM-TRADICIONAL-FEMININO-BRANCO-ACINTURADO-JALECA-91.webp'

type ProductMini = { slug: string; name: string; price: string; image?: string; galleryImage?: string }

async function fetchProduct(slug: string): Promise<ProductMini | null> {
  try {
    const data = await graphqlClient.request<{
      product: WooProduct & {
        image?: { sourceUrl: string }
        galleryImages?: { nodes: { sourceUrl: string }[] }
      }
    }>(GET_PRODUCT_BY_SLUG, { slug })
    if (!data?.product) return null
    const p = data.product
    const gallery = p.galleryImages?.nodes ?? []
    return {
      slug: p.slug,
      name: p.name,
      price: p.price ?? '',
      image: p.image?.sourceUrl,
      galleryImage: gallery[0]?.sourceUrl,
    }
  } catch {
    return null
  }
}

export default async function JalecoFemininoBrancoPage() {
  const [p1, p2, p3, p4, p5] = await Promise.all([
    fetchProduct('jaleco-slim-tradicional-feminino-jaleca'),
    fetchProduct('jaleco-slim-princesa-feminino-jaleca'),
    fetchProduct('jaleco-slim-duquesa-feminino-jaleca'),
    fetchProduct('jaleco-slim-elastex-feminino-jaleca'),
    fetchProduct('jaleco-slim-princesa-manga-curta-feminino-jaleca'),
  ])

  const featured = p1 ?? { slug: 'jaleco-slim-tradicional-feminino-jaleca', name: 'Jaleco Slim Tradicional Feminino Branco', price: '', image: HERO_IMAGE }
  const others = [p2, p3, p4, p5].filter(Boolean) as ProductMini[]

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;600&display=swap" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <style>{`
        :root {
          --gold: #d4af37;
          --gold-light: #f4d58d;
          --cream: #faf8f3;
          --black: #0D0D0D;
          --accent: #c9a961;
        }

        .jfb-wrap { font-family: 'Space Grotesk', sans-serif; background: #fff; }

        /* Hero */
        .jfb-hero {
          background: var(--black);
          min-height: 70svh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        .jfb-hero-img {
          position: relative;
          overflow: hidden;
        }

        .jfb-hero-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 25%;
          opacity: 0.85;
          transition: transform 8s ease;
        }

        .jfb-hero:hover .jfb-hero-img img { transform: scale(1.04); }

        .jfb-hero-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(2.5rem, 6vw, 6rem) clamp(2rem, 5vw, 5rem);
        }

        .jfb-hero-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .jfb-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          line-height: 0.88;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .jfb-hero-desc {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 2rem;
        }

        .jfb-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 1rem 2rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          text-decoration: none;
          transition: box-shadow 0.3s, transform 0.3s;
          width: fit-content;
        }

        .jfb-hero-cta:hover {
          box-shadow: 0 6px 24px rgba(212,175,55,0.5);
          transform: translateY(-2px);
        }

        /* Badges */
        .jfb-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .jfb-badge {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.8rem;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
        }

        /* Produtos */
        .jfb-produtos {
          padding: clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem);
          background: var(--cream);
        }

        .jfb-section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .jfb-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 0.9;
          color: var(--black);
          margin-bottom: 2.5rem;
        }

        .jfb-featured {
          background: var(--black);
          color: #fff;
          border: 2px solid var(--gold);
          box-shadow: 0 0 24px rgba(212,175,55,0.2);
          text-decoration: none;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          position: relative;
          transition: box-shadow 0.4s;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .jfb-featured:hover { box-shadow: 0 0 40px rgba(212,175,55,0.45); }

        .jfb-featured::before {
          content: '★ MAIS VENDIDO';
          position: absolute;
          top: -0.7rem; right: 1.5rem;
          background: var(--black);
          padding: 0 0.75rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          z-index: 2;
        }

        .jfb-feat-img {
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .jfb-feat-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 40%;
          filter: grayscale(15%);
          transition: filter 0.5s, transform 0.8s;
        }

        .jfb-featured:hover .jfb-feat-img img {
          filter: grayscale(0%);
          transform: scale(1.04);
        }

        .jfb-feat-body {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
        }

        .jfb-feat-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          line-height: 0.95;
          color: #fff;
        }

        .jfb-feat-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          color: var(--gold);
          font-weight: 600;
        }

        .jfb-feat-btn {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 0.9rem 1.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
          text-align: center;
          transition: box-shadow 0.3s, transform 0.3s;
        }

        .jfb-featured:hover .jfb-feat-btn {
          box-shadow: 0 4px 16px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }

        .jfb-card {
          background: #fff;
          border: 1px solid rgba(212,175,55,0.25);
          padding: 1rem 1.25rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          margin-bottom: 0.5rem;
        }

        .jfb-card:hover {
          background: rgba(212,175,55,0.06);
          border-color: var(--gold);
          transform: translateX(4px);
        }

        .jfb-card-name {
          font-size: 0.9rem;
          font-weight: 600;
          flex: 1;
          color: var(--black);
        }

        .jfb-card-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent);
          margin-left: 1rem;
          white-space: nowrap;
        }

        /* Conteúdo SEO */
        .jfb-content {
          padding: clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem);
          max-width: 900px;
          margin: 0 auto;
        }

        .jfb-content h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          line-height: 0.95;
          color: var(--black);
          margin: 2.5rem 0 1rem;
        }

        .jfb-content p {
          font-size: 1rem;
          line-height: 1.75;
          color: #444;
          margin-bottom: 1rem;
        }

        /* FAQ */
        .jfb-faq {
          background: var(--cream);
          padding: clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem);
        }

        .jfb-faq-inner { max-width: 800px; margin: 0 auto; }

        .jfb-faq-item {
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding: 1.5rem 0;
        }

        .jfb-faq-q {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--black);
          margin-bottom: 0.75rem;
        }

        .jfb-faq-a {
          font-size: 0.9rem;
          line-height: 1.7;
          color: #555;
        }

        /* Final CTA */
        .jfb-final {
          background: var(--black);
          padding: 5rem 2rem;
          text-align: center;
        }

        .jfb-final-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          line-height: 0.88;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }

        .jfb-final-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          max-width: 500px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        .jfb-final-cta {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 1.2rem 3.5rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          display: inline-block;
          transition: all 0.4s;
          box-shadow: 0 6px 24px rgba(212,175,55,0.35);
        }

        .jfb-final-cta:hover {
          box-shadow: 0 10px 36px rgba(212,175,55,0.55);
          transform: translateY(-2px);
        }

        /* Mobile */
        @media (max-width: 767px) {
          .jfb-hero {
            grid-template-columns: 1fr;
            min-height: unset;
          }

          .jfb-hero-img { height: 90vw; }

          .jfb-featured {
            grid-template-columns: 1fr;
          }

          .jfb-feat-img { aspect-ratio: 3/4; }
        }
      `}</style>

      <TrustBadgeBar />
      <div className="jfb-wrap">
        {/* Breadcrumb */}
        <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: '#888', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }} className="hover:underline">Início</Link>
          <span>/</span>
          <Link href="/jaleco-feminino" style={{ color: '#888', textDecoration: 'none' }} className="hover:underline">Jalecos Femininos</Link>
          <span>/</span>
          <span style={{ color: '#333' }}>Jaleco Branco Feminino</span>
        </div>

        {/* Hero */}
        <section className="jfb-hero">
          <div className="jfb-hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Jaleco branco feminino com corte acinturado — Jaleca"
              loading="eager"
            />
          </div>
          <div className="jfb-hero-body">
            <div className="jfb-hero-tag">/// Uniformes Profissionais Femininos</div>
            <h1 className="jfb-hero-title">JALECO<br />BRANCO<br />FEMININO</h1>
            <div className="jfb-badges">
              <span className="jfb-badge">PP ao G3</span>
              <span className="jfb-badge">Elastex Premium</span>
              <span className="jfb-badge">Frete Grátis Sudeste</span>
              <span className="jfb-badge">Modelagem Exclusiva</span>
            </div>
            <p className="jfb-hero-desc">
              O jaleco branco feminino mais bem avaliado do Brasil. Corte acinturado, tecido de alta durabilidade e branco que não amarelece. Para médicas, dentistas, enfermeiras e estudantes de saúde.
            </p>
            <Link href="/categoria/jalecos-femininos" className="jfb-hero-cta">
              Ver todos os modelos →
            </Link>
            <p style={{ marginTop: '1rem', fontSize: '0.7rem', letterSpacing: '0.1em', color: '#9b9690' }}>
              Sudeste grátis · PIX 5% OFF · Troca em 7 dias
            </p>
          </div>
        </section>

        {/* Autoridade */}
        <section style={{ background: '#faf8f3', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: '#1a1a1a', color: '#c4a97d', padding: '0.55rem 1rem', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.85rem' }}>🏆</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Uma das marcas que mais vende jalecos no Brasil</span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.9rem,3.5vw,3.2rem)', fontWeight: 400, lineHeight: 1.18, color: '#1a1a1a', marginBottom: '1rem' }}>
              Mais de 200 mil peças vendidas para médicas, dentistas e profissionais da saúde.
            </h2>
            <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.8, marginBottom: '1.5rem', fontWeight: 300 }}>
              Antes de você falar, sua imagem já foi avaliada. Conforto, caimento impecável e a presença que eleva sua autoridade profissional.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#c4a97d', fontSize: '1.15rem', letterSpacing: 2 }}>★★★★★</span>
              <p style={{ fontSize: '0.95rem', color: '#555', margin: 0 }}>
                <strong style={{ color: '#1a1a1a' }}>4.9/5 no Google</strong> — clientes satisfeitos em todo o Brasil
              </p>
            </div>
          </div>
        </section>

        {/* Produtos */}
        <section className="jfb-produtos">
          <div className="jfb-section-label">/// Seleção Curada</div>
          <h2 className="jfb-section-title">MODELOS EM<br />BRANCO FEMININO</h2>

          <Link href={`/produto/${featured.slug}`} className="jfb-featured">
            <div className="jfb-feat-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.galleryImage || featured.image || HERO_IMAGE} alt={featured.name} />
            </div>
            <div className="jfb-feat-body">
              <div className="jfb-feat-name">{featured.name}</div>
              {featured.price && (
                <div className="jfb-feat-price" dangerouslySetInnerHTML={{ __html: featured.price }} />
              )}
              <span className="jfb-feat-btn">Ver Produto →</span>
            </div>
          </Link>

          {others.map(p => (
            <Link key={p.slug} href={`/produto/${p.slug}`} className="jfb-card">
              <span className="jfb-card-name">{p.name}</span>
              {p.price && <span className="jfb-card-price" dangerouslySetInnerHTML={{ __html: p.price }} />}
            </Link>
          ))}
        </section>

        {/* Conteúdo SEO */}
        <section className="jfb-content">
          <h2>Jaleco branco feminino para médica e hospital</h2>
          <p>
            Em ambientes hospitalares e consultórios médicos, o jaleco branco feminino é o padrão mais aceito. O modelo Slim Tradicional branco da Jaleca atende exigências de biossegurança com tecido de fácil higienização, enquanto o corte acinturado mantém o visual elegante durante longos plantões. Disponível também com manga longa no modelo Duquesa — ideal para climas frios e UTIs.
          </p>

          <h2>Jaleco branco para dentista e odontologia</h2>
          <p>
            Para dentistas, o jaleco branco feminino precisa unir praticidade a um visual profissional e moderno. O <strong>Slim Princesa</strong> da Jaleca é o modelo mais pedido na odontologia: recortes que valorizam a silhueta, manga calibrada para liberdade de movimentos e tecido Elastex bidirecional que não amassa mesmo em longas jornadas de atendimento.
          </p>

          <h2>Jaleco branco para faculdade e estudantes de saúde</h2>
          <p>
            Para a faculdade, o jaleco branco feminino precisa equilibrar custo-benefício e durabilidade. O <strong>Slim Tradicional</strong> branco é o mais pedido por estudantes de medicina, enfermagem, odontologia e farmácia: tecido gabardine resistente, corte acinturado e preço acessível. Do PP ao G3 com tabela de medidas detalhada para acertar o tamanho na primeira compra.
          </p>

          <h2>Tecido e durabilidade: Elastex vs Gabardine</h2>
          <p>
            Os jalecos brancos da Jaleca são produzidos em <strong>Elastex</strong> (poliéster com elastano bidirecional) — que acompanha o movimento sem perder a forma — ou <strong>gabardine premium</strong>, mais estruturado e encorpado. O tingimento de alta fixação garante que o branco não amarelece com o uso frequente. Todos passam por controle de qualidade e são testados para resistir a múltiplas lavagens sem encolher ou deformar.
          </p>

          <h2>Tamanhos do PP ao G3 — incluindo plus size</h2>
          <p>
            O jaleco branco feminino Jaleca está disponível do <strong>PP ao G3</strong>. Os tamanhos plus size (G1 ao G3) têm molde redesenhado — não é o tamanho base ampliado, mas um molde com maior amplitude no quadril e ombro proporcional, mantendo o caimento acinturado em todos os tamanhos.
          </p>
        </section>

        {/* FAQ */}
        <section className="jfb-faq">
          <div className="jfb-faq-inner">
            <div className="jfb-section-label">/// Dúvidas Frequentes</div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '0.9', color: 'var(--black)', marginBottom: '2rem' }}>
              FAQ — JALECO<br />BRANCO FEMININO
            </div>
            {schemaFaq.mainEntity.map((item) => (
              <div key={item.name} className="jfb-faq-item">
                <p className="jfb-faq-q">{item.name}</p>
                <p className="jfb-faq-a">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="jfb-final">
          <h2 className="jfb-final-title">VER TODOS OS<br />JALECOS FEMININOS</h2>
          <p className="jfb-final-sub">
            Mais de 20 modelos femininos em branco, preto e colorido. Encontre o jaleco certo para a sua profissão.
          </p>
          <Link href="/categoria/jalecos-femininos" className="jfb-final-cta">
            VER COLEÇÃO COMPLETA
          </Link>
        </section>
      </div>
    </>
  )
}
