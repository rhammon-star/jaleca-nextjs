import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getLooks } from '@/lib/lookbook-data'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'

export const metadata: Metadata = {
  title: 'Lookbook Jaleca — Inspirações de Estilo para Profissionais | 2026',
  description: 'Inspiração editorial para profissionais da saúde: veja como usar nossos jalecos e uniformes com estilo. Looks completos para a rotina clínica. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/lookbook' },
  openGraph: {
    title: 'Lookbook Jaleca — Inspirações de Estilo para Profissionais | 2026',
    description: 'Inspiração editorial para profissionais da saúde: veja como usar nossos jalecos e uniformes com estilo.',
    url: 'https://jaleca.com.br/lookbook',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Lookbook Jaleca 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lookbook Jaleca — Inspirações de Estilo para Profissionais',
    description: 'Inspiração editorial para profissionais da saúde: veja como usar nossos jalecos e uniformes com estilo.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaCollection = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Lookbook Jaleca 2026 — Inspirações de Estilo para Profissionais',
  description: 'Inspiração editorial para profissionais da saúde: veja como usar nossos jalecos e uniformes com estilo.',
  url: 'https://jaleca.com.br/lookbook',
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Como usar jaleco com estilo no dia a dia?', acceptedAnswer: { '@type': 'Answer', text: 'Combine jalecos slim com calças sociais escuras para um visual moderno. Acessórios discretos como relógio e sapato fechado complementam o look profissional sem perder a identidade.' } },
    { '@type': 'Question', name: 'Jaleco branco combina com sapato de qualquer cor?', acceptedAnswer: { '@type': 'Answer', text: 'Com jaleco branco, opte por sapatos em tons neutros ou escuros para manter a elegância. Tênis branco é aceito em ambientes mais casuais, mas sapato social fecha melhor o visual clínico.' } },
    { '@type': 'Question', name: 'Qual jaleco para quem trabalha em hospital e clínica?', acceptedAnswer: { '@type': 'Answer', text: 'Para ambiente hospitalar, prefira jaleco branco manga longa com tecido que soporte lavagem alta temperatura. A modelagem Profissional oferece mais liberdade de movimento durante procedimentos longos.' } },
    { '@type': 'Question', name: 'Lookbook serve para inspiração de uniformes corporativos?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. O lookbook Jaleca mostra combinações que funcionam tanto em clínicas quanto em consultórios e ambientes corporativos onde a imagem profissional é valorizada.' } },
    { '@type': 'Question', name: 'Posso comprar os produtos do lookbook diretamente?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Cada look tem links para os produtos usados. Você pode comprar cada peça separadamente ou montar seu kit com os itens que mais gostar.' } },
  ],
}

export const revalidate = 0

async function getFeaturedProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 6 })
    return data?.products?.nodes?.slice(0, 6) ?? []
  } catch {
    return []
  }
}

export default async function LookbookPage() {
  const looks = getLooks()
  const produtos = await getFeaturedProducts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCollection).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Jaleca</Link>
          {' › '}
          <span>Lookbook</span>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,4rem)' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
            Editorial
          </p>
          <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem', color: '#1a1a1a' }}>
            Lookbook Jaleca — Inspirações de Estilo para Profissionais
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b6b6b', maxWidth: 560, margin: '0 auto', fontWeight: 300, lineHeight: 1.8 }}>
            Cada peça conta uma história. Descubra como o uniforme certo transforma a sua presença profissional.
          </p>
        </div>

        {looks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '4rem 0' }}>Nenhum look publicado ainda.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, background: '#e5e0d8' }}>
            {looks.map((look, idx) => (
              <div
                key={look.id}
                className={`group ${idx === 0 ? 'md:col-span-2' : ''}`}
                style={{ background: '#fff' }}
              >
                {/* Image */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    aspectRatio: idx % 3 === 0 ? '3/4' : '1/1',
                    background: '#f9f7f4',
                  }}
                >
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx === 0}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', groupHover: 'rgba(0,0,0,0.1)', transition: 'background 0.3s' }} />
                </div>

                {/* Info */}
                <div style={{ padding: '0 1.5rem 1.5rem' }}>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem', color: '#1a1a1a' }}>{look.title}</h2>
                  <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{look.description}</p>

                  {look.products?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
                        Shop the look
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {look.products.map(product => (
                          <Link
                            key={product.slug}
                            href={`/produto/${product.slug}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#1a1a1a', textDecoration: 'none', padding: '0.4rem 0', borderBottom: '1px solid #f0ede8' }}
                          >
                            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{product.name}</span>
                            <span style={{ color: '#6b6b6b', fontSize: '0.8rem' }}>{product.price}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Produtos em destaque */}
        {produtos.length > 0 && (
          <section style={{ marginTop: 'clamp(4rem,8vw,7rem)', background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem)', marginLeft: 'clamp(-1.5rem,-4vw,-3rem)', marginRight: 'clamp(-1.5rem,-4vw,-3rem)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Destaques da coleção</div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2rem' }}>
                Produtos mais vendidos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link href="/produtos" style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6b6b', textDecoration: 'none' }}>
                  Ver todos os produtos →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={{ borderTop: '1px solid #e5e0d8', paddingTop: '3rem', marginTop: 'clamp(4rem,8vw,7rem)' }}>
          <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '0.75rem' }}>
            Perguntas sobre o lookbook
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
        <div style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
          <Link
            href="/produtos"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#1a1a1a', color: '#fff', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            Ver toda a coleção
          </Link>
        </div>
      </main>
    </>
  )
}