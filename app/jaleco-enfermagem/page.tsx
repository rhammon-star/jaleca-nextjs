import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { graphqlClient, GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import ProductDetailSection from '@/components/ProductDetailSection'
import { getGooglePlaceData } from '@/lib/google-places'
import FaqAccordion from './FaqAccordion'
import { getAllProducts } from '@/lib/all-products'
import { PROFESSION_PRODUCT_SLUGS, prioritizeByColor, getVerMaisUrl } from '@/lib/product-professions'
import { getHeroImageSlug } from '@/lib/profession-hero-images'
import { getCachedHeroImage, getCachedBlogPosts } from '@/lib/profession-page-data'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco para Enfermagem — Conforto e Mobilidade para a Rotina Hospitalar | Jaleca' },
  description: 'Jaleco para enfermagem em tecido premium com elastano. Bolsos funcionais, mobility total. Modelos do PP ao G3. Frete grátis SP/RJ/MG/ES acima R$499. Jaleca — fabricante.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-enfermagem' },
  openGraph: {
    title: 'Jaleco para Enfermagem — Conforto e Mobilidade',
    description: 'Jaleco para enfermagem com elastano, bolsos funcionais e mobility total. Do PP ao G3. Frete grátis no Sudeste.',
    url: 'https://jaleca.com.br/jaleco-enfermagem',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Enfermagem — Conforto e Mobilidade',
    description: 'Jaleco para enfermagem em tecido premium. Elastano, bolsos funcionais, mobility total. Frete grátis acima R$499.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qual a importância do jaleco para os estudantes de enfermagem em laboratórios e estágios?", acceptedAnswer: { '@type': 'Answer', text: "O jaleco é essencial para a biossegurança, protegendo o estudante contra contaminação e garantindo a identificação profissional nos ambientes de prática." } },
    { '@type': 'Question', name: "Os jalecos para cursos de enfermagem são unissex ou há modelos específicos para homens e mulheres?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos modelos unissex que atendem bem a todos, e também cortes femininos e masculinos para quem busca um caimento mais personalizado e confortável." } },
    { '@type': 'Question', name: "É obrigatório o uso do jaleco branco para estudantes de enfermagem em todas as disciplinas e estágios?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o jaleco branco é um padrão universal na enfermagem. Recomenda-se usá-lo em todas as aulas práticas, laboratórios e, obrigatoriamente, em estágios." } },
    { '@type': 'Question', name: "Como garantir que o jaleco de estudante de enfermagem dure todos os anos da graduação?", acceptedAnswer: { '@type': 'Answer', text: "Invista em um jaleco de tecido de qualidade superior e siga as instruções de lavagem para assegurar sua durabilidade e manter a boa aparência ao longo dos anos." } },
    { '@type': 'Question', name: "Qual o melhor tecido para um jaleco de enfermagem que precisa ser lavado e desinfetado frequentemente?", acceptedAnswer: { '@type': 'Answer', text: "Tecidos como Gabardine ou Brim são excelentes escolhas, pois são robustos, resistem a lavagens frequentes e mantêm a integridade mesmo após desinfecção." } },
    { '@type': 'Question', name: "É permitido bordar o nome da faculdade de enfermagem e o nome do aluno no jaleco?", acceptedAnswer: { '@type': 'Answer', text: "Sim, é uma prática comum e permitida. Oferecemos o serviço de bordado para personalizar seu jaleco com o logo da instituição e seu nome." } },
    { '@type': 'Question', name: "Os jalecos de enfermagem são desenhados para ter bolsos funcionais para materiais de estudo e trabalho?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos possuem bolsos bem dimensionados para acomodar estetoscópio, esfigmomanômetro, canetas e outros itens que o estudante de enfermagem precisa ter à mão." } },
    { '@type': 'Question', name: "Qual a importância da manga longa no jaleco de enfermagem para a proteção e biossegurança?", acceptedAnswer: { '@type': 'Answer', text: "A manga longa é fundamental para a biossegurança, protegendo os braços do contato com agentes infecciosos e superfícies contaminadas, sendo item obrigatório." } },
    { '@type': 'Question', name: "O que devo considerar ao escolher o tamanho do jaleco para o curso de enfermagem?", acceptedAnswer: { '@type': 'Answer', text: "Priorize o conforto e a mobilidade. Consulte nossa tabela de medidas e, se estiver em dúvida, opte por um tamanho que ofereça um pouco mais de folga." } },
    { '@type': 'Question', name: "Os jalecos para estudantes de enfermagem possuem botões resistentes para a rotina diária?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são equipados com botões de alta resistência, costurados de forma segura para suportar o uso e a movimentação constante durante as atividades práticas." } },
    { '@type': 'Question', name: "É possível adquirir um jaleco de enfermagem com desconto para compras em grande volume para turmas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos condições especiais e descontos progressivos para compras em quantidade, ideais para turmas de enfermagem. Entre em contato para mais detalhes." } },
    { '@type': 'Question', name: "Qual o prazo de garantia para os jalecos adquiridos para o curso de enfermagem?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos possuem garantia contra defeitos de fabricação. Caso identifique qualquer problema, entre em contato com nosso atendimento para avaliação e solução." } },
    { '@type': 'Question', name: "Há opções de jalecos de enfermagem com detalhes em cores para diferenciar especialidades?", acceptedAnswer: { '@type': 'Answer', text: "Para estudantes, o branco liso é o mais recomendado. Detalhes coloridos são mais comuns para profissionais em clínicas específicas, mas verifique sempre as regras da sua instituição." } },
    { '@type': 'Question', name: "Como lavar o jaleco de enfermagem para remover manchas de medicamentos ou fluidos?", acceptedAnswer: { '@type': 'Answer', text: "Trate a mancha o mais rápido possível. Utilize um sabão neutro e, se necessário, um removedor de manchas específico para tecidos brancos, sempre seguindo as instruções da etiqueta." } },
    { '@type': 'Question', name: "Os jalecos para enfermagem são projetados para evitar o encolhimento após a lavagem?", acceptedAnswer: { '@type': 'Answer', text: "Nossos tecidos são pré-encolhidos para minimizar qualquer alteração de tamanho após as lavagens, garantindo que o jaleco mantenha o caimento original." } },
    { '@type': 'Question', name: "Qual a diferença entre um jaleco com gola tradicional e um com gola padre para estudantes de enfermagem?", acceptedAnswer: { '@type': 'Answer', text: "A gola tradicional é clássica e formal. A gola padre oferece um visual mais moderno e limpo, sendo uma escolha de estilo pessoal, desde que atenda às normas da instituição." } },
    { '@type': 'Question', name: "Para estudantes de enfermagem que suam muito, há tecidos mais frescos e respiráveis?", acceptedAnswer: { '@type': 'Answer', text: "Sim, temos jalecos confeccionados com tecidos leves e respiráveis, que ajudam a regular a temperatura corporal e proporcionam maior conforto em ambientes quentes." } },
    { '@type': 'Question', name: "Qual o tempo de entrega para um jaleco de enfermagem com bordado?", acceptedAnswer: { '@type': 'Answer', text: "O tempo de entrega para jalecos com bordado pode ser ligeiramente maior que o padrão devido ao processo de personalização. Consulte as estimativas de prazo no carrinho de compras." } },
    { '@type': 'Question', name: "Os jalecos de enfermagem oferecem proteção UV para atividades ao ar livre (saúde da família)?", acceptedAnswer: { '@type': 'Answer', text: "Embora não sejam o foco principal, alguns tecidos densos oferecem uma proteção UV básica. Para exposições prolongadas, recomendamos buscar produtos específicos com FPU." } },
    { '@type': 'Question', name: "A loja oferece serviço de ajuste ou customização de jalecos para medidas especiais de estudantes de enfermagem?", acceptedAnswer: { '@type': 'Answer', text: "No momento, não oferecemos ajustes personalizados, mas nossa ampla tabela de tamanhos (do PP ao G3) e modelos diversos visam atender a uma vasta gama de medidas e biotipos." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Enfermagem — Conforto e Mobilidade para a Rotina Hospitalar',
  description: 'Guia completo do jaleco para enfermagem: melhor tecido, elastano, Bolsos funcionais, mobilidade e como escolher o modelo ideal.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-enfermagem',
  datePublished: '2026-04-24',
  dateModified: '2026-04-24',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Enfermagem', item: 'https://jaleca.com.br/jaleco-enfermagem' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão enfermagem
    const slugs = PROFESSION_PRODUCT_SLUGS['enfermagem'] ?? []
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
}function HeroStars({ rating }: { rating: number }) {
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

export default async function JalecoEnfermagemPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('enfermagem'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('enfermagem') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-enfermagem', 'https://jaleca.com.br/jaleco-enfermagem'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-enfermagem', 'https://jaleca.com.br/jaleco-enfermagem'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-enfermagem', "Jalecos para enfermagem"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Enfermagem', href: null },
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
          h1Line2="Enfermagem"
          description="Conforto e mobilidade para a rotina hospitalar. Tecido premium com elastano, Bolsos funcionais."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção enfermagem</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Enfermagem</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('enfermagem')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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
                  Como escolher o jaleco para enfermagem
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Tecido e elastano', anchor: '#tecido' },
                      { label: 'Bolsos e funcionalidade', anchor: '#bolsos' },
                      { label: 'Mobilidade e caimento', anchor: '#mobilidade' },
                      { label: 'Lavagem e conservação', anchor: '#lavagem' },
                      { label: 'Normas e regulamentação', anchor: '#normas' },
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
                    title: 'Tecido e elastano: o que realmente importa',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Jaleco de enfermagem precisa suportar lavagens constantes e manter a forma durante toda a jornada. Por isso a composição do tecido faz toda a diferença.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Na Jaleca, jalecos para enfermagem têm gabardine com elastano — 67% poliéster, 33% algodão e 3-8% elastano. Isso garante resistência, conforto e memória do tecido.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco certo para enfermagem? Aquele que você nem sente que está vestindo, mas que protege e permite movimento total."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'bolsos',
                    title: 'Bolsos e funcionalidade para enfermeiros',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Bolsos são essenciais para enfermeiros — guardam canetas, tesouras, luvas, termômetro e outros itens de trabalho. Um jaleco sem bolsos adequados atrapalha o fluxo.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Na Jaleca, jalecos para enfermagem têm bolso no peito (para canetas e pequenos itens) e bolsos laterais reforçados (para instrumentos maiores). Bolsos com profundidade adequada não perdem conteúdo ao se inclinar.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'mobilidade',
                    title: 'Mobilidade e caimento para plantão',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Enfermagem exige mobilidade total — você corre, se inclina, levanta pacientes, administra medicamentos. O jaleco precisa acompanhar cada movimento sem apertar ou restrict.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O elastano faz diferença real. Ele adiciona memória ao tecido — o jaleco volta ao formato original após cada movimento. Isso significa mais conforto em longos plantões e menos necessidade de trocar de roupa.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'lavagem',
                    title: 'Lavagem e conservação do jaleco',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Jalecos Jaleca suportam lavagem a 60°C na máquina. Use sabão neutro e evite alvejante com cloro. Seque ao ar — nunca use secadora, pois o calor danifica o elastano.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Guarde sempre limpo e seco. Nunca guarde o jaleco sujo — isso acelera o desgaste e pode causar contaminação. Se o jaleco começar a acumular manchas difíceis, use alvejante sem cloro.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'normas',
                    title: 'Normas e regulamentação para jaleco de enfermagem',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O COREN não exige cor específica para jaleco de enfermagem — apenas exige visual limpo, profissional e em bom estado. Branco é o mais tradicional, mas cores discretas também são aceitas.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A ANVISA exige que EPIs (incluindo jaleco) sejam usados apenas no ambiente de trabalho. Nunca use o jaleco no transporte público ou fora do hospital — isso pode carregar contaminantes para casa.
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
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para enfermagem</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── ARTIGOS DO BLOG ── */}
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
                [
                  { title: 'Jaleco de enfermeiro: semana da saúde e normas do COREN', href: '/blog/jaleco-enfermeiro-semana-saude', tag: 'Enfermagem', excerpt: 'O que o COREN regulamenta sobre vestimenta de enfermagem e como escolher o jaleco certo para plantão.' },
                  { title: 'Jaleco com elastano vale a pena para plantão?', href: '/blog/jaleco-elastano-vale-a-pena', tag: 'Tecidos', excerpt: 'O elastano é essencial para quem trabalha 12h. Veja como o tecido certo faz diferença no plantão hospitalar.' },
                  { title: 'Jaleco ou scrub: qual usar no hospital?', href: '/blog/jaleco-ou-scrub-consultorio', tag: 'Guia', excerpt: 'Enfermeiros usam jaleco ou scrub? Entenda quando cada uniforme é o mais adequado para o ambiente hospitalar.' },
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
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Outros jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de saúde</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Dentista', href: '/jaleco-dentista', desc: 'Guia completo' },
                { label: 'Médico', href: '/jaleco-medico', desc: 'Guia completo' },
                { label: 'Biomédico', href: '/jaleco-biomedico', desc: 'Guia completo' },
                { label: 'Veterinário', href: '/jaleco-veterinario', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
                { label: 'Podólogo', href: '/jaleco-podologo', desc: 'Guia completo' },
                { label: 'Jaleco Branco', href: '/jaleco-branco', desc: 'Guia completo' },
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
              Do PP ao G3. Elastano para total conforto. Bolsos funcionais. Frete grátis no Sudeste para compras acima de R$499.
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

            

      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />

    </main>
    </>
  )
}