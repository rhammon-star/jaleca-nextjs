import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'
import { PROFESSION_PRODUCT_SLUGS, prioritizeByColor, getVerMaisUrl } from '@/lib/product-professions'
import { getAllProducts } from '@/lib/all-products'
import { getHeroImageSlug } from '@/lib/profession-hero-images'
import { getCachedHeroImage, getCachedBlogPosts } from '@/lib/profession-page-data'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco para Podólogo: Tecido Premium, Caimento Perfeito | Jaleca' },
  description: 'Jaleco para Podólogo em tecido premium com caimento perfeito. Modelos Slim e Profissional do PP ao G3. Frete grátis SP/RJ/MG/ES. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-podologo' },
  openGraph: {
    title: 'Jaleco para Podólogo | Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Qual jaleco usar na podologia? Jaleco premium com elastano, caimento impecável e preço justo. Do PP ao G3. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-podologo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Podólogo | Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Jaleco premium para podólogo. Tecido de qualidade, caimento perfeito, preço justo. Do PP ao G3.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "É necessário bordar algum registro profissional (como um conselho) no jaleco do podólogo?", acceptedAnswer: { '@type': 'Answer', text: "Não existe um conselho federal para podólogos com registro obrigatório em jaleco, mas o bordado do nome e especialidade confere profissionalismo. Oferecemos este serviço com qualidade." } },
    { '@type': 'Question', name: "Qual o tecido mais indicado para um jaleco de podólogo masculino, pensando em higiene e movimento?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos tecidos como gabardine ou sarja leve. São resistentes, permitem boa ventilação, fáceis de lavar e confortáveis para o trabalho que exige precisão e movimentação constante." } },
    { '@type': 'Question', name: "Posso escolher cores diferentes do branco para meu jaleco de podólogo?", acceptedAnswer: { '@type': 'Answer', text: "Sim, além do branco tradicional, temos opções em tons sóbrios como azul marinho, cinza chumbo ou verde escuro, que conferem um visual moderno e profissional. Consulte as normas do seu local de trabalho." } },
    { '@type': 'Question', name: "Qual o corte ideal para um jaleco de podólogo, que oferece liberdade de movimentos?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos masculinos para podólogos têm um corte reto e funcional, pensado para não restringir seus movimentos e garantir conforto durante os procedimentos. Praticidade e elegância." } },
    { '@type': 'Question', name: "Como posso personalizar meu jaleco de podólogo com meu nome e especialidade?", acceptedAnswer: { '@type': 'Answer', text: "Você pode solicitar o bordado do seu nome e da palavra 'Podólogo' durante a compra. Garantimos um bordado de alta qualidade, nítido e que valoriza sua identificação profissional." } },
    { '@type': 'Question', name: "Quais são as melhores dicas de lavagem para o jaleco de podólogo, mantendo a higiene?", acceptedAnswer: { '@type': 'Answer', text: "Lave o jaleco em água fria ou morna, com ciclo suave e sabão neutro. Para garantir a higiene, pode-se usar desinfetante para roupas apropriado. Seque à sombra para preservar o tecido." } },
    { '@type': 'Question', name: "Qual a durabilidade esperada para um jaleco de podólogo, considerando o uso diário e as lavagens?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são confeccionados com materiais de alta resistência e costuras reforçadas, projetados para suportar o uso frequente e as lavagens necessárias na podologia, durando anos." } },
    { '@type': 'Question', name: "Como escolher o tamanho correto do jaleco de podólogo masculino?", acceptedAnswer: { '@type': 'Answer', text: "Consulte nossa tabela de medidas detalhada e compare com suas próprias medidas de tórax e cintura. Um bom ajuste garante conforto e evita que o jaleco atrapalhe seus movimentos." } },
    { '@type': 'Question', name: "Há opções de comprimento para o jaleco de podólogo, como modelos mais curtos?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos o comprimento clássico, que geralmente cobre até a metade da coxa, proporcionando proteção adequada e não interferindo na flexibilidade necessária para o trabalho com os pés." } },
    { '@type': 'Question', name: "Estão disponíveis jalecos de podólogo com manga curta para maior conforto?", acceptedAnswer: { '@type': 'Answer', text: "Sim, temos modelos com manga longa para proteção extra e manga curta, ideais para climas mais quentes ou para maior liberdade de movimento durante os procedimentos." } },
    { '@type': 'Question', name: "Quantos bolsos são funcionais em um jaleco de podólogo e qual sua distribuição?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos vêm com um bolso superior no peito e dois bolsos frontais inferiores, pensados para guardar pequenos instrumentos, canetas e outros itens de fácil acesso durante o atendimento." } },
    { '@type': 'Question', name: "Qual o estilo dos jalecos para podólogos, transmitindo profissionalismo e higiene?", acceptedAnswer: { '@type': 'Answer', text: "Priorizamos um estilo clássico, limpo e profissional, com linhas retas e acabamento impecável. O design visa transmitir confiança e zelar pela imagem de higiene exigida na podologia." } },
    { '@type': 'Question', name: "Qual a diferença entre um jaleco de podólogo e um de enfermeiro?", acceptedAnswer: { '@type': 'Answer', text: "O jaleco de podólogo é otimizado para a especificidade do tratamento dos pés, focando em tecidos mais maleáveis e bolsos práticos. O de enfermeiro pode ter foco em maior proteção e um corte mais padrão." } },
    { '@type': 'Question', name: "Posso comprar jalecos para minha equipe de podólogos com desconto?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos condições especiais e descontos progressivos para compras em maior volume. Entre em contato com nosso departamento de vendas para uma proposta personalizada para sua clínica." } },
    { '@type': 'Question', name: "Qual o preço a partir de um jaleco de podólogo masculino com bordado?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos masculinos para podólogos iniciam a partir de R$ 118,00, com a opção de bordado personalizado incluída. Consulte nosso site para detalhes sobre modelos e tecidos." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para um jaleco de podólogo personalizado?", acceptedAnswer: { '@type': 'Answer', text: "O prazo para entrega de jalecos personalizados é de 7 a 15 dias úteis, somando o tempo de produção e envio. Você receberá um código de rastreio para acompanhar o seu pedido." } },
    { '@type': 'Question', name: "Como funciona a política de troca se o jaleco de podólogo não servir corretamente?", acceptedAnswer: { '@type': 'Answer', text: "Aceitamos trocas em até 7 dias após o recebimento, desde que o produto esteja sem uso e com as etiquetas originais. Para peças bordadas, aplicam-se condições específicas, que podem ser consultadas." } },
    { '@type': 'Question', name: "Há opções de frete mais rápidas para jalecos de podólogo urgentes?", acceptedAnswer: { '@type': 'Answer', text: "Sim, além do frete padrão, disponibilizamos modalidades de frete expresso para quem precisa do jaleco com mais rapidez. Verifique as opções e custos no momento da finalização da compra." } },
    { '@type': 'Question', name: "Os jalecos para podólogos possuem alguma garantia de qualidade?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos jalecos contam com garantia de 90 dias contra defeitos de fabricação, assegurando que você receba um produto de alta qualidade e durabilidade." } },
    { '@type': 'Question', name: "O tecido do jaleco de podólogo é fácil de desinfetar após o uso?", acceptedAnswer: { '@type': 'Answer', text: "Nossos tecidos são selecionados para facilitar a desinfecção e lavagem, sendo resistentes a ciclos de lavagem mais intensos, essenciais para manter a higiene rigorosa da podologia." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Podólogo: Tecido Premium, Caimento Perfeito',
  description: 'Guia completo do jaleco para podólogo: tecido premium, caimento perfeito, modelo Slim vs Profissional e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-podologo',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Podólogo', item: 'https://jaleca.com.br/jaleco-podologo' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão podologo
    const slugs = PROFESSION_PRODUCT_SLUGS['podologo'] ?? []
    const professionProducts = allProducts.filter(p => {
      // Produto mãe está na lista OU produto filho cujo pai está na lista
      if (slugs.includes(p.slug)) return true

      // Verifica se é produto filho (tem cor no slug)
      const parts = p.slug.split('-')
      const possibleColor = parts[parts.length - 1]
      const baseSlug = parts.slice(0, -1).join('-')

      return slugs.includes(baseSlug)
    })

    // Prioriza branco e preto primeiro (mais vendidos)
    const prioritized = prioritizeByColor(professionProducts)

    // Retorna 6 produtos
    return prioritized.slice(0, 6)
  } catch (error) {
    console.error('[getJalecos] Error:', error)
    return []
  }
}// Stars sem contagem — apenas nota
function HeroStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  const schemaSpeakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.faq-section', 'h2'],
    },
  }

  return (
    <div className="flex items-center gap-2 mt-10">
      <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>
        {'★'.repeat(full)}{half ? '½' : ''}
      </span>
      <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>
        {rating.toFixed(1)}★
      </span>
    </div>
  )
}

export default async function JalecoDentistaPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('podologo') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-podologo', 'https://jaleca.com.br/jaleco-podologo'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-podologo', 'https://jaleca.com.br/jaleco-podologo'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-podologo', "Jalecos para podologo"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-podologo'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-podologo', "Jaleco para podologo", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Podólogo', href: null },
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
          eyebrow="Uniforme profissional"
          h1Line1="Jaleco para"
          h1Line2="Podólogo"
          description="Tecido premium, caimento perfeito, preço justo."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── PRODUTOS — Above the Fold (subiu pra após Hero, mobile) ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção podologia</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Podólogos</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('podologo')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver mais →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST BAR — desceu pra depois da grade ── */}
        <CompactTrustBar />

        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />


        {/* ── DESCRITIVO MODELOS — subiu pra antes do Guia ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco ideal para podologia
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Tecido e composição', anchor: '#tecido' },
                      { label: 'Modelagem Slim ou Profissional', anchor: '#modelagem' },
                      { label: 'Jaleco branco ou colorido', anchor: '#cores' },
                      { label: 'Bolsos e funcionalidade', anchor: '#bolsos' },
                      { label: 'Normas do CREFITO', anchor: '#crefito' },
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
                    id: 'tecido',
                    title: 'Tecido e composição: o que realmente importa',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Jaleco de podólogo aguenta muita lavagem e mancha. Precisa ser confortável por horas.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Na Jaleca, todos têm elastano. Faz a diferença para quem fica com os braços levantados.
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
                    id: 'modelagem',
                    title: 'Modelagem Slim ou Profissional: qual escolher?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A Jaleca tem duas modelagens principais. A escolha certa depende do ambiente da clínica e do seu estilo profissional.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim — Corte ajustado ao corpo, valoriza a silhueta, ideal para quem quer visual moderno e elegante em consultórios premium',
                            'Profissional — Corte mais amplo e estruturado, maior liberdade de movimento, escolha clássica para qualquer rotina clínica',
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
                    id: 'cores',
                    title: 'Jaleco branco ou colorido: o que o CREFITO diz',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O branco é o clássico, claro. Mas o CREFITO não restringe cores.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Tons pastel e discretos são aceitos. Em clínicas pediátricas, cores amigáveis acalmam as crianças. Temos 12 cores disponíveis, em todos os modelos.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'bolsos',
                    title: 'Bolsos e funcionalidade clínica',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O bolso no peito precisa guardar a caneta sem ela cair quando você se inclina.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Bolsos laterais reforçados duram mais e são ótimos para os instrumentos do dia a dia.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'cro',
                    title: 'Normas do CREFITO sobre vestimenta profissional',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O CREFITO, junto com a ANVISA, exige: use o jaleco só no trabalho. Nunca em transporte ou fora da clínica. A peça precisa estar sempre limpa e em bom estado.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          EPIs são obrigatórios: jaleco, luvas, máscara, óculos e touca. O jaleco protege sua roupa e forma uma barreira contra sangue, saliva e químicos.
                        </p>
                      </>
                    ),
                  },
                ].map((sec) => (
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

        {/* ── INSTAGRAM — desceu pra antes do FAQ ── */}
        <InstagramLazy />

        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para podólogo</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG (reais do WordPress) ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
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
                // Fallback: artigos fixos relevantes para o cluster
                [
                  { title: 'Como lavar e conservar seu jaleco profissional', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o amarelamento e encurtam a vida do jaleco. Veja o guia completo.' },
                  { title: 'Jaleco branco: tradição e protocolos em podologia', href: '/blog', tag: 'Podologia', excerpt: 'Por que o branco é tão usado em podologia e o que recomendam sobre cores e vestimenta.' },
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

        {/* ── TOPICAL AUTHORITY — Outros profissionais de saúde ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de saúde</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Podólogo', href: '/jaleco-podologo', desc: 'Guia completo' },
                { label: 'Biomédico', href: '/jaleco-biomedico', desc: 'Guia completo' },
                { label: 'Enfermeiro', href: '/jaleco-enfermeiro', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
                { label: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Guia completo' },
                { label: 'Veterinário', href: '/jaleco-veterinario', desc: 'Guia completo' },
                { label: 'Médico', href: '/jaleco-medico', desc: 'Guia completo' },
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
              Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste para compras acima de R$499.
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

    </main>
    </>
  )
}
