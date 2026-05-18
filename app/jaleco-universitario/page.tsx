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
  title: { absolute: 'Jaleco Universitario — Conforto e Profissionalismo para a Vida Academica | Jaleca' },
  description: 'Jaleco universitario em tecido premium com caimento perfeito. Modelos do PP ao G3. Frete gratis SP/RJ/MG/ES. Jaleca — fabricante com estoque proprio.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-universitario' },
  openGraph: {
    title: 'Jaleco Universitario — Conforto e Profissionalismo para a Vida Academica — Jaleca',
    description: 'Qual jaleco comprar para a faculdade? Tecido premium com elastano, caimento impecavel e preco justo. Do PP ao G3. Frete gratis.',
    url: 'https://jaleca.com.br/jaleco-universitario',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: 'Jaleco Universitario — Conforto e Profissionalismo para a Vida Academica — Jaleca',
    description: 'Jaleco universitario premium. Tecido de qualidade, caimento perfeito, preco justo. Do PP ao G3.',
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qual tecido é mais indicado para o primeiro jaleco universitário?", acceptedAnswer: { '@type': 'Answer', text: "Para o primeiro jaleco universitário, indicamos tecidos de gabardine ou microfibra, que são resistentes, fáceis de cuidar e têm excelente caimento." } },
    { '@type': 'Question', name: "Este jaleco é adequado para estudantes de medicina e odontologia?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos são ideais para futuros médicos e dentistas, cumprindo as exigências de higiene e apresentando um visual profissional para a faculdade." } },
    { '@type': 'Question', name: "Como o corte do jaleco universitário se adapta à rotina de estudos e estágios?", acceptedAnswer: { '@type': 'Answer', text: "Nosso corte é pensado para oferecer conforto e mobilidade, essencial para as longas horas de estudo e os estágios práticos na universidade." } },
    { '@type': 'Question', name: "Posso bordar meu nome e a identificação do curso no jaleco?", acceptedAnswer: { '@type': 'Answer', text: "Com certeza! Oferecemos bordado personalizado com seu nome e o símbolo ou nome do seu curso (Medicina, Odonto, Enfermagem, Farmácia), um toque essencial para o seu primeiro jaleco." } },
    { '@type': 'Question', name: "O jaleco Jaleca é uma boa escolha para meu primeiro contato com o ambiente clínico?", acceptedAnswer: { '@type': 'Answer', text: "É a escolha perfeita! Nossos jalecos garantem uma imagem profissional e asseio desde o seu primeiro dia no ambiente clínico, elevando sua confiança." } },
    { '@type': 'Question', name: "Qual a durabilidade de um jaleco universitário, considerando o uso frequente?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos são projetados para alta durabilidade, resistindo ao uso diário e às frequentes lavagens necessárias na vida universitária." } },
    { '@type': 'Question', name: "Como devo lavar o jaleco para mantê-lo branco e sem manchas?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos lavagem com água fria e sabão neutro, separadamente de outras roupas. Para manter o branco, use alvejante sem cloro e seque à sombra." } },
    { '@type': 'Question', name: "Este jaleco cumpre as regulamentações de uso em hospitais e clínicas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos são desenvolvidos seguindo as normas e padrões de higiene e vestuário exigidos para o uso em ambientes de saúde, como hospitais e clínicas." } },
    { '@type': 'Question', name: "Os tamanhos de jaleco universitário abrangem do PP ao G3?", acceptedAnswer: { '@type': 'Answer', text: "Nossa grade de tamanhos, do PP ao G3, garante que todo estudante encontre um jaleco com o ajuste ideal, proporcionando conforto e uma aparência alinhada." } },
    { '@type': 'Question', name: "Os bolsos do jaleco são funcionais para guardar canetas e outros itens de estudo?", acceptedAnswer: { '@type': 'Answer', text: "Sim, os bolsos são projetados para serem práticos e espaçosos, ideais para guardar canetas, cadernetas e outros pequenos acessórios essenciais para os estudos." } },
    { '@type': 'Question', name: "O comprimento do jaleco é adequado para futuros profissionais da saúde?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento é cuidadosamente balanceado para conferir autoridade e proteção, sem atrapalhar a mobilidade necessária para procedimentos e exames." } },
    { '@type': 'Question', name: "O jaleco universitário está disponível em manga longa ou curta?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos opções de manga longa, padrão para a maioria das áreas da saúde, garantindo proteção e conformidade com as exigências acadêmicas e profissionais." } },
    { '@type': 'Question', name: "O estilo slim do jaleco universitário transmite profissionalismo?", acceptedAnswer: { '@type': 'Answer', text: "Nosso estilo slim confere uma imagem moderna e profissional, preparando você para a transição do ambiente acadêmico para o mercado de trabalho." } },
    { '@type': 'Question', name: "Os jalecos Jaleca são mais duráveis e representativos do que os de outras marcas para estudantes?", acceptedAnswer: { '@type': 'Answer', text: "Sim, a qualidade superior de nossos tecidos e acabamento garante um jaleco mais resistente e com melhor apresentação, destacando você da concorrência universitária." } },
    { '@type': 'Question', name: "A partir de qual preço consigo adquirir um jaleco universitário de qualidade?", acceptedAnswer: { '@type': 'Answer', text: "Nossos jalecos universitários de alta qualidade começam a partir de R$159, um investimento essencial para sua jornada acadêmica e profissional." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para jalecos universitários?", acceptedAnswer: { '@type': 'Answer', text: "Seu jaleco será entregue em 3 a 8 dias úteis, para que você possa começar seus estudos e estágios com o equipamento certo e no tempo adequado." } },
    { '@type': 'Question', name: "Posso trocar o jaleco se o tamanho não estiver correto para minhas aulas?", acceptedAnswer: { '@type': 'Answer', text: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não sejam os ideais para seu conforto nos estudos." } },
    { '@type': 'Question', name: "Há frete grátis para compras de jalecos universitários acima de R$499 em SP/RJ/MG/ES?", acceptedAnswer: { '@type': 'Answer', text: "Sim, para pedidos de jalecos universitários acima de R$499, o frete é grátis para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." } },
    { '@type': 'Question', name: "Os jalecos universitários possuem garantia?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e sua total confiança na sua compra acadêmica." } },
    { '@type': 'Question', name: "O jaleco é adequado para a cerimônia de formatura?", acceptedAnswer: { '@type': 'Answer', text: "Absolutamente! Nossos jalecos são elegantes e de alta qualidade, ideais para serem usados na sua cerimônia de formatura, marcando sua transição para a vida profissional." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Universitario — Conforto e Profissionalismo para a Vida Academica',
  description: 'Guia completo do jaleco universitario: tecido premium, caimento perfeito, modelo Padrao vs Slim, normas da IES e custo-beneficio.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/jaleco-universitario',
  datePublished: '2026-04-24',
  dateModified: '2026-04-24',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Universitario', item: 'https://jaleca.com.br/jaleco-universitario' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    const allProducts = await getAllProducts()
    const slugs = PROFESSION_PRODUCT_SLUGS['universitario'] ?? []

    // Produtos universitários (destaque)
    const professionProducts = allProducts.filter(p => {
      if (slugs.includes(p.slug)) return true
      const baseSlug = p.slug.split('-').slice(0, -1).join('-')
      return slugs.includes(baseSlug)
    })
    const prioritized = prioritizeByColor(professionProducts)

    // Se tiver menos de 6, preenche com masculinos brancos
    if (prioritized.length < 6) {
      const usedSlugs = new Set(prioritized.map(p => p.slug))
      const fillers = allProducts.filter(p =>
        !usedSlugs.has(p.slug) &&
        p.slug.includes('masculino') &&
        (p.slug.includes('branco') || p.name.toLowerCase().includes('branco'))
      )
      const prioritizedFillers = prioritizeByColor(fillers)
      prioritized.push(...prioritizedFillers.slice(0, 6 - prioritized.length))
    }

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

export default async function JalecoUniversitarioPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('universitario') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-universitario', 'https://jaleca.com.br/jaleco-universitario'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-universitario', 'https://jaleca.com.br/jaleco-universitario'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-universitario', "Jalecos para universitario"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-universitario'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-universitario', "Jaleco para universitario", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Universitário', href: null },
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
          h1Line1="Jaleco"
          h1Line2="Universitario"
          description="Conforto e profissionalismo para a vida academica."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-masculinos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* ── PRODUTOS — Above the Fold ── */}
        {produtos.length > 0 && (
          <section id="produtos" className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Colecao universitario</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Estudantes</em>
                  </h2>
                </div>
                </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href={getVerMaisUrl('universitario')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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
                  Como escolher o jaleco ideal para a vida academica
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Cursos que exigem jaleco', anchor: '#curso' },
                      { label: 'Modelo Padrao ou Slim', anchor: '#modelo' },
                      { label: 'Bordado com nome', anchor: '#bordado' },
                      { label: 'Como escolher o tamanho', anchor: '#tamanho' },
                      { label: 'Cuidados e conservacao', anchor: '#cuidados' },
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
                    id: 'curso',
                    title: 'Quais cursos exigem jaleco universitario?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Medicina, enfermagem, farmacia, fisioterapia, biomedicina, nutricao, odontologia e veterinaria sao os cursos onde o jaleco e obrigatorio desde o primeiro periodo. Em biologia, Quimica e engenharia Quimica, o jaleco e exigido nas aulas de laboratorio.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A IES (instituicao de ensino) costuma definir o modelo, a cor e se pode ter bordado. A maioria exige jaleco branco simples, sem detalhes, para manter a padronizacao na turma.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco certo evita problemas na admissao da residencia ou estagio. Modelo branco, sem detalhes, e o padrao mais aceito."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelo',
                    title: 'Jaleco Padrao ou Slim: qual comprar?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O Jaleco Padrao Aluno e o mais indicado: corte neutro, branco, sem detalhes que possam conflitar com exigencias da faculdade. E o que a maioria das instituicoes aceita sem questionamento.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O Slim funciona para quem ja concluiu o periodo de identificacao com a turma e quer um visual mais ajustado. Verifique com a coordenacao antes — algumas IES proibem cortes muito ajustados nas aulas praticas.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Padrao Aluno — Corte neutro, branco, aceito pela maioria das IES, ideal para quem esta no inicio da graduacao',
                            'Slim — Corte mais ajustado, visual moderno, recomendado para quem ja passou do periodo de adaptacao da turma',
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
                    id: 'bordado',
                    title: 'Jaleco pode ter bordado com nome?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Depende da instituicao. A maioria das faculdades de medicina, enfermagem e farmacia permite bordado com nome e CRM/COREN provisorio a partir de determinado semestre.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O bordado ajuda muito na identificacao em estagio hospitalar — pacientes e equipe sabem com quem estao falando. A Jaleca oferece personalizacao com bordado.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'tamanho',
                    title: 'Como escolher o tamanho certo do jaleco',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Mede o busto e compare com a tabela da Jaleca. Para estudante que usa jaleco sobre roupa comum, um tamanho com folga nos ombros e o melhor — nao aperta ao movimentar os braços.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco universitario precisa de espaco para dobrar e carregar. Um tamanho com 2 a 4cm de folga no busto e o ideal para rotina academica.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'cuidados',
                    title: 'Como lavar e conservar o jaleco da faculdade',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Lave a 40°C para higienizacao adequada — temperatura suficiente para eliminar contaminantes de laboratorio sem danificar o tecido.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Separe o jaleco das roupas comuns na lavagem. Para tirar manchas de laboratorio: pre-tratamento com detergente enzimatico antes da lavagem. Nao use cloro — amarela o tecido com o tempo.
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

        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Duvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para universitario</em>
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
                  { title: 'Jaleco branco: tradicao e cuidados essenciais', href: '/blog', tag: 'Guia', excerpt: 'Por que o branco domina e o que fazer para manter o jaleco com aspecto profissional por mais tempo.' },
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
              Jaleco para outras<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissoes</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Universitário Feminino', href: '/jaleco-universitario-feminino', desc: 'Guia completo' },
                { label: 'Professor', href: '/jaleco-professor', desc: 'Guia completo' },
                { label: 'Enfermeiro', href: '/jaleco-enfermeiro', desc: 'Guia completo' },
                { label: 'Biomedico', href: '/jaleco-biomedico', desc: 'Guia completo' },
                { label: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
                { label: 'Veterinario', href: '/jaleco-veterinario', desc: 'Guia completo' },
                { label: 'Medico', href: '/jaleco-medico', desc: 'Guia completo' },
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
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>200.000+ pecas vendidas</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              O jaleco certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferenca</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do PP ao G3. Elastano para total conforto. 12 cores. Frete gratis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Colecao Feminina
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Colecao Masculina
              </Link>
            </div>
          </div>
        </section>

    </main>
    </>
  )
}