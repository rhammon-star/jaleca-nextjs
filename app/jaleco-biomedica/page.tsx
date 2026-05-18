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
  title: { absolute: 'Jaleco para Biomédica: Tecido Premium, Caimento Perfeito | Jaleca' },
  description: 'Jaleco para biomédico em tecido premium com elastano. Modelos Profissional e Slim do PP ao G3. Frete grátis SP/RJ/MG/ES. Jaleca — fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-biomedica' },
  openGraph: {
    title: 'Jaleco para Biomédico | Norma ANVISA e Conforto — Jaleca',
    description: 'Qual jaleco usar no laboratório biomédico? Jaleco premium com elastano, caimento impecável e conformidade com normas. Do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-biomedica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Biomédico | Norma ANVISA e Conforto — Jaleca',
    description: 'Jaleco premium para biomédico. Tecido de qualidade, caimento perfeito, conformidade com normas do CFM e ANVISA.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Quais os modelos de jalecos femininos mais indicados para biomédicas que buscam aliar proteção e estilo em laboratório?", acceptedAnswer: { '@type': 'Answer', text: "Nossos modelos acinturados ou slim fit combinam elegância com funcionalidade, oferecendo proteção e um visual moderno para a biomédica." } },
    { '@type': 'Question', name: "Como escolher um jaleco feminino que suporte a rotina de laboratório e a lavagem frequente sem perder a cor e o caimento?", acceptedAnswer: { '@type': 'Answer', text: "Opte por tecidos de Gabardine Premium ou microfibra de alta densidade, que são resistentes ao desbotamento, fáceis de cuidar e mantêm a forma mesmo após muitas lavagens." } },
    { '@type': 'Question', name: "É possível bordar o nome da biomédica e o número do CRBM no jaleco feminino?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos o serviço de bordado para personalizar seu jaleco com seu nome e o número de registro no CRBM, um toque profissional e de identificação." } },
    { '@type': 'Question', name: "Os bolsos dos jalecos femininos de biomedicina são projetados para serem práticos e discretos?", acceptedAnswer: { '@type': 'Answer', text: "Nossos modelos femininos possuem bolsos funcionais, estrategicamente posicionados para não comprometer a silhueta, permitindo guardar itens essenciais de forma discreta." } },
    { '@type': 'Question', name: "Qual a importância da proteção da manga longa e dos punhos em um jaleco feminino para biomédicas?", acceptedAnswer: { '@type': 'Answer', text: "A manga longa e os punhos justos são cruciais para a biossegurança, protegendo os braços do contato com reagentes e amostras, além de evitar que a manga atrapalhe a manipulação." } },
    { '@type': 'Question', name: "Há opções de jalecos femininos com detalhes coloridos discretos que são aceitos em laboratórios de biomedicina?", acceptedAnswer: { '@type': 'Answer', text: "Em geral, o branco é o padrão. Detalhes discretos podem ser aceitos em áreas menos críticas, mas a segurança e as normas do laboratório devem sempre prevalecer." } },
    { '@type': 'Question', name: "Como garantir que o jaleco feminino de biomédica não fique transparente após várias lavagens?", acceptedAnswer: { '@type': 'Answer', text: "Utilizamos tecidos de gramatura adequada e alta qualidade, que minimizam a transparência e mantêm a discrição e profissionalismo mesmo após ciclos repetidos de lavagem." } },
    { '@type': 'Question', name: "Quais cuidados especiais para lavar jalecos femininos que entraram em contato com reagentes químicos?", acceptedAnswer: { '@type': 'Answer', text: "Lave a peça separadamente, imediatamente após o contato, com água fria e sabão neutro. Se o reagente for perigoso, descarte ou siga protocolos de descontaminação específicos do laboratório." } },
    { '@type': 'Question', name: "O que devo considerar ao escolher o comprimento do jaleco feminino para uma biomédica?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento na altura dos joelhos é o mais comum, oferecendo proteção adequada contra respingos e contato com bancadas, sem limitar a movimentação em laboratório." } },
    { '@type': 'Question', name: "A loja oferece jalecos femininos com gola padre para um visual mais moderno e clean em laboratório?", acceptedAnswer: { '@type': 'Answer', text: "Sim, temos modelos com gola padre que proporcionam um visual contemporâneo e minimalista, combinando bem com a formalidade e higiene do ambiente laboratorial." } },
    { '@type': 'Question', name: "Qual a política de devolução e troca para jalecos femininos de biomédica, sem bordado?", acceptedAnswer: { '@type': 'Answer', text: "Você pode devolver ou trocar jalecos sem bordado dentro do prazo especificado, desde que estejam sem uso e com etiquetas. Consulte nossa política completa no site." } },
    { '@type': 'Question', name: "Os jalecos femininos são desenhados para não restringir movimentos ao trabalhar com microscópios ou equipamentos?", acceptedAnswer: { '@type': 'Answer', text: "Nossos cortes são pensados para oferecer liberdade de movimento nos ombros e braços, essenciais para manipulações precisas e o uso prolongado de microscópios." } },
    { '@type': 'Question', name: "Para biomédicas que usam luvas constantemente, o jaleco tem punhos que facilitam o encaixe das luvas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, os punhos são desenhados para permitir que as luvas sejam facilmente calçadas por cima, garantindo a proteção e integridade do EPI." } },
    { '@type': 'Question', name: "Qual a durabilidade esperada de um jaleco feminino de biomedicina com uso diário e lavagem frequente?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são feitos para alta durabilidade. Com os cuidados recomendados, eles mantêm a qualidade e aparência por anos, mesmo com a rotina intensa de laboratório." } },
    { '@type': 'Question', name: "Existe alguma linha de jalecos femininos com tecnologia antiestática para biomédicas que trabalham com eletrônicos sensíveis?", acceptedAnswer: { '@type': 'Answer', text: "Embora não seja o foco principal, alguns tecidos com alta porcentagem de fibras naturais podem reduzir a estática. Para ambientes específicos, busque jalecos certificados com propriedades antiestáticas." } },
    { '@type': 'Question', name: "Os jalecos femininos com fechamento em zíper são mais práticos para biomédicas do que os de botão?", acceptedAnswer: { '@type': 'Answer', text: "Modelos com zíper oferecem um fechamento rápido e seguro, sendo uma opção prática e moderna para biomédicas, especialmente em situações de necessidade de vestir/despir rápido." } },
    { '@type': 'Question', name: "Qual a faixa de preços dos jalecos femininos para biomédicas e o que justifica a variação?", acceptedAnswer: { '@type': 'Answer', text: "A faixa de preços varia conforme o tecido, o design (corte acinturado, detalhes), a presença de tecnologias (repelência, antibacteriano) e o acabamento geral do produto." } },
    { '@type': 'Question', name: "Os jalecos femininos são adaptáveis para biomédicas gestantes, oferecendo conforto extra?", acceptedAnswer: { '@type': 'Answer', text: "Temos opções com cortes mais soltos e tecidos com elastano que proporcionam maior conforto e se adaptam melhor ao corpo de biomédicas gestantes." } },
    { '@type': 'Question', name: "Como escolher o tamanho do jaleco feminino para biomédica, se as medidas estão entre dois tamanhos?", acceptedAnswer: { '@type': 'Answer', text: "Para garantir conforto e liberdade de movimento no laboratório, especialmente ao manipular equipamentos, é aconselhável escolher o tamanho maior se suas medidas estiverem no limite." } },
    { '@type': 'Question', name: "Qual o custo do bordado de nome e CRBM no jaleco feminino de biomédica?", acceptedAnswer: { '@type': 'Answer', text: "O custo do bordado é calculado durante o processo de compra, variando conforme o número de linhas e a complexidade. Verifique nossa tabela de serviços de personalização para detalhes." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Biomédica: Tecido Premium, Caimento Perfeito',
  description: 'Guia completo do jaleco para biomédico: normas da ANVISA e CFM, tecido premium com elastano, modelo ideal e custo-benefício.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/jaleco-biomedica',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Biomédica', item: 'https://jaleca.com.br/jaleco-biomedica' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão biomedico
    const slugs = PROFESSION_PRODUCT_SLUGS['biomedica'] ?? []
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

export default async function JalecoBiomedicoPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('biomedica') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-biomedica', 'https://jaleca.com.br/jaleco-biomedica'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-biomedica', 'https://jaleca.com.br/jaleco-biomedica'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-biomedica', "Jalecos para biomedica"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-biomedica'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-biomedica', "Jaleco para biomedica", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Biomédica', href: null },
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
          h1Line2="Biomédica"
          description="Conforto e conformidade com as normas ANVISA para o ambiente laboratorial."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
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
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção biomédica</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Biomédicas</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('biomedica')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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
                  Como escolher o jaleco ideal para biomedicina
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Normas ANVISA e CFM', anchor: '#normas' },
                      { label: 'Modelo e modelagem', anchor: '#modelagem' },
                      { label: 'Tecido e composição', anchor: '#tecido' },
                      { label: 'Higiene e conservação', anchor: '#higiene' },
                      { label: 'Bordado e identificação', anchor: '#bordado' },
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
                    id: 'normas',
                    title: 'Normas ANVISA e CFM para jaleco de biomédico',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O biomédico deve seguir as diretrizes da ANVISA e do CFM quanto ao vestuário profissional. O jaleco deve ser de manga longa, tecido liso e fechamento frontal.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco funciona como EPI complementar em laboratório, protegendo contra respingos de reagentes químicos e materiais biológicos. Deve ser usado exclusivamente no ambiente de trabalho.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco correto não é só uma questão de imagem — é uma barreira de proteção fundamental entre o profissional e os riscos do ambiente laboratorial."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelagem',
                    title: 'Modelo e modelagem para laboratório',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O modelo Profissional é o mais indicado para o ambiente laboratorial por oferecer mais espaço de movimento e maior cobertura. O corte estruturado transmite autoridade profissional.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Profissional — Corte amplo e estruturado, ideal para longas horas em laboratório, transmite formalidade e conformidade com normas',
                            'Slim — Corte ajustado, visual moderno, pode ser usado em laboratórios de análises clínicas mais modernos',
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
                    id: 'tecido',
                    title: 'Tecido e composição ideal',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco para biomédico precisa aguentar lavagens frequentes em alta temperatura para garantir a desinfecção. Os jalecos Jaleca têm elastano que dá memória ao tecido.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A composição com elastano (3-8%) permite que o tecido retorne à forma após cada movimento — essencial para quem passa horas inclinado sobre bancadas e equipamentos.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'higiene',
                    title: 'Higiene e conservação do jaleco',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco de biomédico deve ser lavado após cada dia de trabalho. Lavagem a 60°C é suficiente para eliminar a maioria dos contaminantes em ambiente laboratorial.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Não guarde o jaleco sujo. Sempre pendure para secar à sombra. O acúmulo de resíduos químicos e biológicos deteriora o tecido prematuramente.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'bordado',
                    title: 'Identificação profissional no jaleco',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Bordar o nome e número do CRB no jaleco é prática comum e recomendada — facilita a identificação e transmite credibilidade. A Jaleca não oferece serviço de bordado. O jaleco é vendido sem bordado. Você pode levar a peça em uma bordadeira local após receber.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Importante: após o bordado, o jaleco não pode ser trocado.
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
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para biomédico</em>
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
                  { title: 'Como lavar e conservar seu jaleco profissional', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o amarelamento e encurtam a vida do jaleco. Veja o guia completo.' },
                  { title: 'Jaleco branco: tradição e higiene no laboratório', href: '/blog', tag: 'Biomedicina', excerpt: 'Por que o jaleco branco continua sendo a escolha número um em laboratórios e o que a ANVISA recomenda.' },
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
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Outros uniformes profissionais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissões de saúde</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Médico', href: '/jaleco-medico', desc: 'Guia completo' },
                { label: 'Dentista', href: '/jaleco-dentista', desc: 'Guia completo' },
                { label: 'Enfermeiro', href: '/jaleco-enfermeiro', desc: 'Guia completo' },
                { label: 'Farmacêutico', href: '/jaleco-farmaceutico', desc: 'Guia completo' },
                { label: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Guia completo' },
                { label: 'Veterinário', href: '/jaleco-veterinario', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
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
