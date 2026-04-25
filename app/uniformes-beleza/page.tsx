import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductCard from '@/components/ProductCard'
import type { WooProduct } from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'Uniformes para Beleza: Jaleco Cabeleireiro, Esteticista e Mais | Jaleca',
  description: 'Uniformes profissionais para área de beleza: jaleco para cabeleireiro, esteticista, massagista, tatuador e barbeiro. Tecido certo, modelos e cores para cada profissão.',
  alternates: { canonical: 'https://jaleca.com.br/uniformes-beleza' },
  openGraph: {
    title: 'Uniformes para Beleza: Jaleco Cabeleireiro, Esteticista e Mais | Jaleca',
    description: 'Guia completo de uniformes para profissionais de beleza — jaleco cabeleireiro, esteticista, massagista, tatuador e barbeiro.',
    url: 'https://jaleca.com.br/uniformes-beleza',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniformes para Beleza: Jaleco Cabeleireiro, Esteticista e Mais',
    description: 'Guia completo de uniformes para profissionais de beleza — jaleco cabeleireiro, esteticista, massagista, tatuador e barbeiro.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const BELEZA_HUBS = [
  { href: '/jaleco-para-cabeleireiro', titulo: 'Cabeleireiro', desc: 'Tecido fluido · repele tinta · cores vibrantes' },
  { href: '/jaleco-para-esteticista',  titulo: 'Esteticista',  desc: 'Microfibra · antimicrobiano · modelagem slim' },
  { href: '/jaleco-para-massagista',   titulo: 'Massagista',   desc: 'Elastano · movimento amplo · lavável' },
  { href: '/jaleco-para-tatuador',     titulo: 'Tatuador',     desc: 'Cores escuras · não mancha · visual urbano' },
  { href: '/jaleco-para-barbeiro',     titulo: 'Barbeiro',     desc: 'Gabardine · não retém pelo · estilo premium' },
]

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o melhor tecido para uniforme de estética?', acceptedAnswer: { '@type': 'Answer', text: 'O melhor tecido para estética é microfibra com elastano — tem baixo atrito, seca rápido e aguenta lavagens frequentes. A Jaleca usa composição com elastano para permitir movimento sem restrição.' } },
    { '@type': 'Question', name: 'Dolma ou jaleco: qual escolher para profissional de beleza?', acceptedAnswer: { '@type': 'Answer', text: 'Dolma é ideal para quem prefere peça mais curta e despojada. Jaleco tem caimento mais formal. A escolha depende do ambiente — clínicas de estética aceitam ambos, salões de beleza tendem a preferir dolmã por conforto.' } },
    { '@type': 'Question', name: 'Como escolher o uniforme certo para área de beleza?', acceptedAnswer: { '@type': 'Answer', text: 'Considere três fatores: (1) tipo de produtos que manipula — cores escuras disfarçam respingos; (2) amplitude de movimento necessária — elastano é essencial para massagistas e esteticistas; (3) frequência de lavagem — tecidos técnicos duram mais.' } },
  ],
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Uniformes para Profissionais de Beleza',
  description: 'Guia completo de uniformes para área de beleza: cabeleireiro, esteticista, massagista, tatuador e barbeiro.',
  url: 'https://jaleca.com.br/uniformes-beleza',
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  hasPart: BELEZA_HUBS.map(h => ({
    '@type': 'WebPage',
    name: `Jaleco para ${h.titulo}`,
    url: `https://jaleca.com.br${h.href}`,
  })),
}

async function getBelezaProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 50 })
    const products = data?.products?.nodes ?? []
    return products.filter(p => {
      const cat = (p.productCategories?.nodes ?? []).map(c => c.name.toLowerCase()).join(' ')
      return cat.includes('beleza') || cat.includes('estetica') || cat.includes('cabeleireiro') || cat.includes('barbeiro') || cat.includes('tatuador') || cat.includes('massagista')
    }).slice(0, 6)
  } catch {
    return []
  }
}

export default async function Page() {
  const products = await getBelezaProducts()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Jaleca</Link>
          {' › '}
          <span>Uniformes para Beleza</span>
        </nav>

        {/* Hero */}
        <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 400, lineHeight: 1.1, color: '#1a1a1a', marginBottom: '1.25rem' }}>
          Uniformes para Beleza —<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Profissionais de Estética com Elegância</em>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: 1.7, maxWidth: 620, marginBottom: '3rem' }}>
          Da barbearia ao salão de estética: cada profissional de beleza precisa de um uniforme que combine com o ambiente, aguente produtos químicos e passe confiança para a clientela. Guias completos por profissão abaixo.
        </p>

        {/* Grid de profissões */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {BELEZA_HUBS.map(hub => (
            <Link key={hub.href} href={hub.href} style={{ textDecoration: 'none', display: 'block', border: '1px solid #e8e4df', padding: '1.75rem 1.5rem', transition: 'border-color .2s' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia completo</div>
              <div style={{ fontSize: '1.2rem', fontFamily: "'Cormorant', Georgia, serif", color: '#1a1a1a', fontWeight: 500, marginBottom: '0.5rem' }}>{hub.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{hub.desc}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em' }}>Ver guia →</div>
            </Link>
          ))}
        </div>

        {/* Conteúdo editorial */}
        <section style={{ borderTop: '1px solid #e8e4df', paddingTop: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
            O que muda de um jaleco de beleza para outro?
          </h2>
          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 700 }}>
            <p>Ao contrário da área de saúde — onde o jaleco branco e manga longa é quase obrigatório — os profissionais de beleza têm liberdade para escolher cor, modelagem e estilo. O que importa é o tecido certo para cada função.</p>
            <p><strong>Cabeleireiro e barbeiro</strong> precisam de tecido que não retenha pelos cortados: gabardine calendrado ou sarja com acabamento laminado são os melhores. Cores escuras são preferidas.</p>
            <p><strong>Esteticista e massagista</strong> precisam de amplitude de movimento: elastano ≥5% é essencial para quem passa horas fazendo movimentos repetitivos com os braços.</p>
            <p><strong>Tatuador</strong> tem contato com tinta e precisa de cor que disfarce respingos — preto e grafite dominam o setor.</p>
          </div>
        </section>

        {/* Produtos em destaque */}
        {products.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem)', marginBottom: '3rem', marginLeft: 'clamp(-1.5rem,-4vw,-3rem)', marginRight: 'clamp(-1.5rem,-4vw,-3rem)', paddingLeft: 'clamp(1.5rem,4vw,3rem)', paddingRight: 'clamp(1.5rem,4vw,3rem)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção beleza</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2rem' }}>
                Uniformes para beleza
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href="/produtos?categoria=jalecos-femininos" style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6b6b', textDecoration: 'none' }}>
                  Ver todos →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Links internos */}
        <section style={{ background: '#f9f7f4', padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Outros clusters</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { href: '/uniformes-profissionais-para-saude', label: 'Saúde' },
              { href: '/uniformes-gastronomia', label: 'Gastronomia' },
              { href: '/uniformes-servicos', label: 'Serviços' },
              { href: '/uniformes-escritorio', label: 'Escritório' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid #d4cfc9', color: '#666', textDecoration: 'none' }}>
                Uniformes para {l.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ borderTop: '1px solid #e8e4df', paddingTop: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '0.75rem' }}>
            Perguntas sobre uniformes de beleza
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 3rem', marginTop: '2.5rem' }}>
            {schemaFaq.mainEntity.map((item, i) => (
              <div key={i} style={{ borderTop: '1px solid #e5e0d8' }}>
                <div style={{ padding: '1.25rem 0 0.5rem', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{item.name}</div>
                <div style={{ paddingBottom: '1.25rem', fontSize: '0.88rem', color: '#6b6b6b', lineHeight: 1.8, fontWeight: 300 }}>{item.acceptedAnswer.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
          <Link
            href="/produtos?categoria=jalecos-femininos"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Ver todos os uniformes →
          </Link>
        </div>

      </main>
    </>
  )
}
