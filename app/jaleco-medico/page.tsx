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
import EATBlock from '@/components/EATBlock'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco de Médico Slim — Feminino e Masculino na Jaleca' },
  description: 'Nota 4,9 no Google. Jaleco com elastano para médicos — branco, preto e colorido, PP ao G3. Frete grátis Sudeste acima de R$499. Troca em 7 dias.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-medico' },
  openGraph: {
    title: 'Jaleco para Médico — Slim, Branco e Colorido — Jaleca',
    description: 'Nota 4,9 no Google. Jaleco para médicos com elastano, modelagem slim, PP ao G3. Frete grátis Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/jaleco-medico',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco para Médico — Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Jaleco premium para médicos. Elastano, caimento perfeito, do PP ao G3. Frete grátis Sudeste.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'] },
  mainEntity: [
    { '@type': 'Question', name: "Qual o tecido mais recomendado para jalecos masculinos que precisam de alta durabilidade e resistência a lavagens frequentes?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos tecidos como Gabardine ou Sarja, que oferecem excelente resistência, durabilidade e mantêm a boa aparência mesmo após múltiplas lavagens, ideal para a rotina intensa do médico." } },
    { '@type': 'Question', name: "Os jalecos para médicos possuem cortes específicos que proporcionam maior liberdade de movimento durante procedimentos cirúrgicos?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos masculinos são projetados com cortes que priorizam a ergonomia e a amplitude de movimento, especialmente nas costas e braços, essenciais para a performance em cirurgias." } },
    { '@type': 'Question', name: "É possível personalizar o jaleco masculino com o nome e o número de registro profissional (CRM)?", acceptedAnswer: { '@type': 'Answer', text: "Certamente. Oferecemos o serviço de bordado para incluir seu nome e número de CRM no peito ou na manga, garantindo profissionalismo e identificação." } },
    { '@type': 'Question', name: "Qual a importância dos bolsos nos jalecos masculinos para a prática médica diária?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos contam com bolsos estrategicamente posicionados e de tamanho adequado para guardar estetoscópio, canetas e outros instrumentos essenciais, otimizando a rotina do médico." } },
    { '@type': 'Question', name: "Como escolher o tamanho ideal de jaleco para um médico com estrutura corporal mais robusta?", acceptedAnswer: { '@type': 'Answer', text: "Sugerimos consultar nossa tabela de medidas detalhada, que inclui opções até o G3, e considerar um corte mais reto ou tradicional para maior conforto em biotipos robustos." } },
    { '@type': 'Question', name: "Os jalecos brancos são os únicos permitidos para médicos em ambientes hospitalares, ou há outras cores discretas aceitáveis?", acceptedAnswer: { '@type': 'Answer', text: "O branco é o padrão predominante, mas algumas especialidades ou clínicas permitem cores neutras como cinza claro ou azul petróleo. Verifique as diretrizes do seu local de trabalho." } },
    { '@type': 'Question', name: "Qual o diferencial dos seus jalecos masculinos em termos de conforto para longos plantões?", acceptedAnswer: { '@type': 'Answer', text: "Priorizamos tecidos com boa respirabilidade e caimento que não restringem os movimentos, além de modelos com ventilação estratégica para garantir conforto prolongado durante plantões exaustivos." } },
    { '@type': 'Question', name: "Os punhos de malha nos jalecos masculinos são adequados para uso em ambientes que exigem rigoroso controle de infecção?", acceptedAnswer: { '@type': 'Answer', text: "Sim, os punhos de malha são confortáveis e permitem a movimentação, mas para ambientes com controle de infecção mais rigoroso, punhos elásticos ou com botão podem ser mais práticos para higienização." } },
    { '@type': 'Question', name: "O que devo considerar ao escolher um jaleco para uso em consultório médico versus hospital?", acceptedAnswer: { '@type': 'Answer', text: "Para consultório, há mais liberdade para estilos e cores. Para hospital, priorize tecidos de fácil assepsia, corte funcional e o branco padrão exigido." } },
    { '@type': 'Question', name: "Se eu precisar trocar o jaleco por um tamanho diferente, qual o procedimento e prazo?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos política de troca clara. Entre em contato com nosso atendimento ao cliente dentro do prazo estipulado e siga as instruções para troca por tamanho ou modelo." } },
    { '@type': 'Question', name: "Os jalecos possuem alguma tecnologia que ajuda a repelir líquidos ou minimizar manchas?", acceptedAnswer: { '@type': 'Answer', text: "Alguns de nossos modelos premium incorporam tratamentos que conferem resistência a líquidos e facilitam a remoção de manchas, protegendo o tecido e prolongando a vida útil do jaleco." } },
    { '@type': 'Question', name: "Qual a importância do comprimento do jaleco masculino para a funcionalidade do médico?", acceptedAnswer: { '@type': 'Answer', text: "Um comprimento médio é ideal, oferecendo proteção adequada e liberdade para sentar e movimentar-se sem prender. Jalecos mais longos são comuns em algumas especialidades." } },
    { '@type': 'Question', name: "Há opções de jalecos masculinos com gola social para um visual mais formal?", acceptedAnswer: { '@type': 'Answer', text: "Sim, dispomos de modelos com gola social clássica que conferem um visual mais elegante e profissional, perfeitos para médicos que buscam um toque de formalidade." } },
    { '@type': 'Question', name: "Qual o custo-benefício de investir em um jaleco de maior qualidade em vez de opções mais baratas?", acceptedAnswer: { '@type': 'Answer', text: "Jalecos de maior qualidade oferecem durabilidade superior, melhor caimento, mais conforto e resistência a desgastes, representando um investimento que se paga ao longo do tempo pela menor necessidade de substituição." } },
    { '@type': 'Question', name: "Como garantir que o bordado do CRM e nome não desfie após várias lavagens?", acceptedAnswer: { '@type': 'Answer', text: "Utilizamos técnicas de bordado de alta qualidade com fios resistentes que garantem a integridade e durabilidade do bordado, mesmo após inúmeras lavagens industriais ou domésticas." } },
    { '@type': 'Question', name: "Existe algum modelo de jaleco masculino mais adequado para médicos que usam muitas ferramentas nos bolsos?", acceptedAnswer: { '@type': 'Answer', text: "Sim, temos modelos com múltiplos bolsos, incluindo bolsos internos e divisórias, projetados para otimizar o armazenamento e a organização de instrumentos sem comprometer o conforto ou a estética." } },
    { '@type': 'Question', name: "Para médicos que trabalham em ambientes quentes, há opções de jalecos com tecidos mais leves e ventilados?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos jalecos confeccionados com tecidos mais leves e tecnologias de ventilação, como painéis de malha respirável, ideais para climas quentes ou ambientes com alta temperatura." } },
    { '@type': 'Question', name: "Qual o prazo médio de entrega para jalecos masculinos com personalização de bordado?", acceptedAnswer: { '@type': 'Answer', text: "O prazo varia conforme a demanda, mas geralmente adiciona alguns dias ao prazo de entrega padrão para processamento do bordado. Consulte nosso site para estimativas atuais." } },
    { '@type': 'Question', name: "Os botões dos jalecos masculinos são resistentes e de fácil substituição, caso necessário?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos utilizam botões de alta resistência, costurados de forma segura. Em caso de necessidade, são botões padrão que podem ser substituídos facilmente." } },
    { '@type': 'Question', name: "Os jalecos masculinos são pré-encolhidos para evitar surpresas no tamanho após a primeira lavagem?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos tecidos passam por um processo de pré-encolhimento para minimizar qualquer variação de tamanho após as primeiras lavagens, garantindo que o ajuste permaneça fiel à nossa tabela." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Médico: Slim, Branco e Colorido — Guia Completo',
  description: 'Jaleco médico Slim para consultório e plantão. Branco ou colorido, manga longa ou curta, PP ao G3. O que o CFM permite e como escolher.',
  inLanguage: 'pt-BR',
  audience: { '@type': 'Audience', audienceType: 'Médicos e profissionais da saúde' },
  author: {
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
    sameAs: ['https://www.instagram.com/jalecaa/', 'https://www.facebook.com/jalecaa/'],
  },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 },
    sameAs: ['https://www.instagram.com/jalecaa/', 'https://www.facebook.com/jalecaa/'],
  },
  url: 'https://jaleca.com.br/jaleco-medico',
  mainEntityOfPage: 'https://jaleca.com.br/jaleco-medico',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '[data-speakable]'] },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Médico', item: 'https://jaleca.com.br/jaleco-medico' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão medico
    const slugs = PROFESSION_PRODUCT_SLUGS['medico'] ?? []
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
    getCachedHeroImage(getHeroImageSlug('medico') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-medico', 'https://jaleca.com.br/jaleco-medico'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-medico', 'https://jaleca.com.br/jaleco-medico'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-medico', "Jalecos para medico"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-medico'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-medico', "Jaleco para medico", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Médico', href: null },
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
          h1Line2="Médico"
          description="Tecido premium, caimento perfeito, preço justo."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── PRODUTOS — subiu pra ficar logo após Hero (above the fold mobile) ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção medicina</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Médicos</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('medico')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver mais →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST BAR — desceu pra depois da grade (USPs reforçam decisão) ── */}
        <CompactTrustBar />

        {/* ── GOOGLE RATING + DEPOIMENTOS ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />

        {/* ── DESCRITIVO DOS MODELOS — subiu pra antes do Guia ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── GUIA ── */}
        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco ideal para medicina
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Tecido e composição', anchor: '#tecido' },
                      { label: 'Modelagem Slim ou Profissional', anchor: '#modelagem' },
                      { label: 'Jaleco branco ou colorido', anchor: '#cores' },
                      { label: 'Bolsos e funcionalidade', anchor: '#bolsos' },
                      { label: 'Normas do CRM', anchor: '#crm' },
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
                          Jaleco de médico aguenta muita lavagem e mancha. Precisa ser confortável por horas.
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
                    title: 'Jaleco branco ou colorido: o que o CRM diz',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O branco é o clássico, claro. Mas o CRM não restringe cores.
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
                    title: 'Normas do CRM sobre vestimenta profissional',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O CRM, junto com a ANVISA, exige: use o jaleco só no trabalho. Nunca em transporte ou fora da clínica. A peça precisa estar sempre limpa e em bom estado.
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

        {/* ── INSTAGRAM — desceu pra antes do FAQ (evita distração no meio) ── */}
        <InstagramLazy />

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para médico</em>
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
              {([
                { title: 'Pijama Cirúrgico: Guia Completo para Profissionais de Saúde', href: '/blog/pijama-cirurgico-guia-completo', tag: 'Uniforme', excerpt: 'Tudo sobre scrub hospitalar: tecidos, modelagens e como escolher o uniforme cirúrgico ideal pra sua rotina.', img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80' },
                ...(posts.length > 0
                  ? posts.slice(0, 2).map(p => ({ title: p.title.rendered.replace(/<[^>]+>/g, ''), href: `/blog/${p.slug}`, tag: 'Blog', excerpt: p.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '…', img: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null }))
                  : [
                      { title: 'Jaleco com elastano vale a pena para médico?', href: '/blog/jaleco-elastano-vale-a-pena', tag: 'Tecidos', excerpt: 'O elastano mantém o caimento durante plantões longos e procedimentos. Saiba o que faz diferença no jaleco médico.', img: null },
                      { title: 'Jaleco colorido em consultório: o que o CFM permite', href: '/blog/jaleco-colorido-clinica', tag: 'Protocolos', excerpt: 'O CFM não proíbe jaleco colorido. Entenda as normas de vestimenta médica por tipo de ambiente.', img: null },
                    ]
                ),
              ] as { title: string; href: string; tag: string; excerpt: string; img: string | null | undefined }[]).map(post => (
                <Link key={post.href} href={post.href} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ aspectRatio: '16/10', background: '#e5e0d8', overflow: 'hidden', position: 'relative' }}>
                    {post.img ? (
                      <img src={post.img} alt={post.title} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.85rem', fontStyle: 'italic', color: '#c8c4bc' }}>Jaleca</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', background: '#fff' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>{post.tag}</span>
                    <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{post.excerpt}</p>
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                  </div>
                </Link>
              ))}
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
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
            </div>
          </div>
        </section>

            <EATBlock profession="medico" />

    </main>
    </>
  )
}
