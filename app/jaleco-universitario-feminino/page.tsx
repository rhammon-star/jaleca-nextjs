import type { Metadata } from 'next'
import Link from 'next/link'
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

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco Universitário Feminino — Medicina, Enfermagem e Odontologia | Jaleca' },
  description: 'Jaleco feminino para estudantes de medicina, enfermagem, odontologia, fisioterapia e biomedicina. Corte acinturado, tecido premium com elastano. PP ao G3. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-universitario-feminino' },
  openGraph: {
    title: 'Jaleco Universitário Feminino — Medicina, Enfermagem e Odontologia | Jaleca',
    description: 'Jaleco feminino para caloura e estudante de saúde. Corte acinturado, tecido com elastano, do PP ao G3. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-universitario-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Universitário Feminino | Jaleca',
    description: 'Jaleco feminino para estudantes de medicina, enfermagem, odontologia e mais. PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: "Qual o tecido mais recomendado para o primeiro jaleco feminino universitário?", acceptedAnswer: { '@type': 'Answer', text: "Sugerimos tecidos como gabardine premium, que oferecem um caimento mais feminino e são resistentes para o dia a dia acadêmico, além de serem fáceis de manter." } },
    { '@type': 'Question', name: "Este jaleco é indicado para futuras médicas, dentistas ou enfermeiras?", acceptedAnswer: { '@type': 'Answer', text: "Sim, o jaleco é perfeito para estudantes de medicina, odontologia, enfermagem e farmácia, combinando elegância, conforto e a seriedade exigida pelas profissões." } },
    { '@type': 'Question', name: "Como o corte feminino do jaleco universitário se adapta à mobilidade em laboratórios?", acceptedAnswer: { '@type': 'Answer', text: "O corte acinturado e pensado para a mulher oferece total mobilidade, sendo ideal para a rotina intensa de aulas práticas e laboratórios universitários." } },
    { '@type': 'Question', name: "É possível bordar meu nome, curso e futuras credenciais como CRM/CRO/COFEN?", acceptedAnswer: { '@type': 'Answer', text: "Com certeza! Oferecemos bordados personalizados para seu nome, o nome do seu curso e, futuramente, suas credenciais profissionais, um toque essencial para sua carreira." } },
    { '@type': 'Question', name: "O jaleco Jaleca ajuda a transmitir uma imagem profissional desde o início da faculdade?", acceptedAnswer: { '@type': 'Answer', text: "Absolutamente! Nosso jaleco feminino foi desenhado para projetar uma imagem de profissionalismo e dedicação desde o primeiro dia de faculdade, destacando você." } },
    { '@type': 'Question', name: "Qual a expectativa de durabilidade de um jaleco universitário feminino?", acceptedAnswer: { '@type': 'Answer', text: "Projetamos nossos jalecos para serem altamente duráveis, resistindo ao uso intenso e às muitas lavagens, acompanhando você durante toda a sua jornada acadêmica." } },
    { '@type': 'Question', name: "Como devo lavar o jaleco para preservar sua cor e modelagem feminina?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos lavar em ciclo delicado com água fria, sem misturar com outras cores, e secar à sombra para manter a cor, o tecido e a modelagem feminina intactos." } },
    { '@type': 'Question', name: "Este jaleco atende às exigências de regulamentação para o uso em ambientes de saúde?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos jalecos são projetados para cumprir as regulamentações de vestuário e higiene exigidas em ambientes clínicos e hospitalares, dando-lhe segurança." } },
    { '@type': 'Question', name: "Os tamanhos de jaleco universitário feminino abrangem do PP ao G3?", acceptedAnswer: { '@type': 'Answer', text: "Nossa ampla grade de tamanhos, do PP ao G3, garante que cada estudante encontre o jaleco feminino com o caimento perfeito, valorizando a silhueta e o conforto." } },
    { '@type': 'Question', name: "Os bolsos do jaleco feminino são práticos para itens essenciais do estudante?", acceptedAnswer: { '@type': 'Answer', text: "Sim, os bolsos são funcionais e discretos, ideais para organizar canetas, estetoscópio ou pequenos cadernos, mantendo seus materiais sempre acessíveis." } },
    { '@type': 'Question', name: "O comprimento do jaleco feminino é adequado para não atrapalhar a mobilidade nas aulas?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento foi balanceado para oferecer cobertura e elegância, sem restringir a mobilidade necessária para aulas práticas e estágios na universidade." } },
    { '@type': 'Question', name: "O jaleco universitário feminino está disponível com opções de manga?", acceptedAnswer: { '@type': 'Answer', text: "Oferecemos principalmente manga longa, que é o padrão exigido na maioria dos cursos da área da saúde, garantindo a conformidade e proteção." } },
    { '@type': 'Question', name: "O estilo slim do jaleco feminino oferece um visual mais moderno e empoderado?", acceptedAnswer: { '@type': 'Answer', text: "Nosso estilo slim feminino é moderno, elegante e empoderador, perfeito para a estudante que busca um visual profissional e confiante para sua trajetória." } },
    { '@type': 'Question', name: "Os jalecos Jaleca se destacam em design e qualidade para estudantes femininas em comparação aos concorrentes?", acceptedAnswer: { '@type': 'Answer', text: "Nosso design exclusivo e a qualidade superior dos tecidos oferecem um jaleco que valoriza a figura feminina, diferenciando-se dos modelos básicos da concorrência." } },
    { '@type': 'Question', name: "Qual o preço inicial para um jaleco universitário feminino de alta qualidade?", acceptedAnswer: { '@type': 'Answer', text: "Você pode adquirir seu jaleco universitário feminino de alta qualidade a partir de R$159, um investimento essencial em sua jornada acadêmica e profissional." } },
    { '@type': 'Question', name: "Qual o prazo de entrega para jalecos universitários femininos?", acceptedAnswer: { '@type': 'Answer', text: "Garantimos a entrega do seu jaleco feminino em 3 a 8 dias úteis, para que você possa iniciar sua vida acadêmica com estilo e profissionalismo." } },
    { '@type': 'Question', name: "Posso trocar o jaleco se o tamanho não estiver ideal para o meu corpo?", acceptedAnswer: { '@type': 'Answer', text: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou modelo não atendam perfeitamente ao seu biotipo." } },
    { '@type': 'Question', name: "Há frete grátis para compras de jalecos universitários femininos acima de R$499 em SP/RJ/MG/ES?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos frete grátis para pedidos de jalecos universitários femininos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." } },
    { '@type': 'Question', name: "O jaleco feminino universitário possui garantia de fabricação?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e a sua total confiança na sua compra." } },
    { '@type': 'Question', name: "É um bom investimento para usar na cerimônia de formatura?", acceptedAnswer: { '@type': 'Answer', text: "Com seu design elegante e acabamento impecável, nosso jaleco é perfeito para a cerimônia de formatura, sendo uma peça que marca a conquista da sua graduação." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Universitário Feminino — Guia para Estudantes de Saúde',
  description: 'Guia completo do jaleco feminino para estudantes: qual modelo comprar, normas das IES, tamanhos e cuidados.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-universitario-feminino',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos Femininos', item: 'https://jaleca.com.br/categoria/jalecos-femininos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Universitário Feminino', item: 'https://jaleca.com.br/jaleco-universitario-feminino' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    const allProducts = await getAllProducts()
    const slugs = PROFESSION_PRODUCT_SLUGS['universitario'] ?? []

    // Produtos universitários femininos (destaque)
    const professionProducts = allProducts.filter(p => {
      const isFeminino = p.slug.includes('feminino') || p.slug.includes('aluno-feminino')
      if (!isFeminino) return false
      if (slugs.includes(p.slug)) return true
      const baseSlug = p.slug.split('-').slice(0, -1).join('-')
      return slugs.includes(baseSlug)
    })
    const prioritized = prioritizeByColor(professionProducts)

    // Se tiver menos de 6, preenche com femininos brancos
    if (prioritized.length < 6) {
      const usedSlugs = new Set(prioritized.map(p => p.slug))
      const fillers = allProducts.filter(p =>
        !usedSlugs.has(p.slug) &&
        p.slug.includes('feminino') &&
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
}

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

export default async function JalecoUniversitarioFemininoPage() {
  const [produtos, posts, placeData, heroImg] = await Promise.all([
    getJalecos(),
    getCachedBlogPosts('jaleco'),
    getGooglePlaceData(),
    getCachedHeroImage(getHeroImageSlug('professora') ?? ''),
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-universitario-feminino', 'https://jaleca.com.br/jaleco-universitario-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-universitario-feminino', 'https://jaleca.com.br/jaleco-universitario-feminino'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema(produtos, 'https://jaleca.com.br/jaleco-universitario-feminino', "Jalecos para universitario feminino"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema(produtos, 'https://jaleca.com.br/jaleco-universitario-feminino'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-universitario-feminino', "Jaleco para universitario feminino", produtos); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Jalecos Femininos', href: '/categoria/jalecos-femininos' },
              { label: 'Universitário Feminino', href: null },
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
          eyebrow="Uniforme feminino universitário"
          h1Line1="Jaleco"
          h1Line2="Universitário Feminino"
          description="Para calouras e estudantes de medicina, enfermagem, odontologia, fisioterapia, biomedicina e veterinária."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="mb-10">
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção feminina universitária</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                  Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Estudantes</em>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.slice(0, 6).map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 2} />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
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


        {/* ── CURSOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Por área de estudo</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '3rem' }}>
              Jaleco certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para cada curso</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1px', background: '#e5e0d8' }}>
              {[
                { curso: 'Medicina', desc: 'Jaleco branco, manga longa, corte neutro ou slim. O Padrão Aluno Feminino é aceito em quase todas as faculdades de medicina do país.', link: '/jaleco-medica' },
                { curso: 'Enfermagem', desc: 'Jaleco branco ou conjunto scrub. Muitas escolas de enfermagem aceitam calça e casaco scrub como alternativa ao jaleco tradicional.', link: '/jaleco-enfermeira' },
                { curso: 'Odontologia', desc: 'Jaleco branco obrigatório nas aulas clínicas desde o início do curso. Slim ou Padrão — confirme com a coordenação.', link: '/jaleco-dentista' },
                { curso: 'Fisioterapia', desc: 'Jaleco leve com elastano é ideal para atendimento. O modelo Princesa Feminino é o mais usado por fisioterapeutas em formação.', link: '/jaleco-fisioterapeuta' },
                { curso: 'Biomedicina', desc: 'Manga longa obrigatória no laboratório. Jaleco Padrão Aluno Feminino é a escolha mais segura para cumprir as normas da NR-6.', link: '/jaleco-biomedica' },
                { curso: 'Veterinária', desc: 'Jaleco resistente para aulas práticas com animais. Opte por tecido com elastano para maior liberdade de movimento no campo.', link: '/jaleco-veterinaria' },
              ].map((item) => (
                <Link key={item.curso} href={item.link} style={{ background: '#fff', padding: '2rem', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.4rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.curso}</div>
                  <p style={{ fontSize: '0.88rem', color: '#6b6b6b', lineHeight: 1.75, fontWeight: 300, marginBottom: '1rem' }}>{item.desc}</p>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ver jaleco →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIA ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco feminino para a graduação
                </h2>
                <nav className="hidden lg:block">
                  <ul style={{ listStyle: 'none' }}>
                    {[
                      { label: 'Feminino ou unissex', anchor: '#feminino-unissex' },
                      { label: 'Modelo Padrão ou Slim', anchor: '#modelo' },
                      { label: 'Normas da faculdade', anchor: '#normas' },
                      { label: 'Como escolher o tamanho', anchor: '#tamanho' },
                      { label: 'Primeiro jaleco: o que comprar', anchor: '#primeiro' },
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
                    id: 'feminino-unissex',
                    title: 'Jaleco feminino ou unissex para a faculdade?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco feminino tem corte acinturado, ombros ajustados ao corpo feminino e cava mais estreita. Para mulheres, veste melhor e é mais confortável no dia a dia de aulas práticas — não apertando nos ombros nem ficando largo na cintura.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O unissex tem caimento neutro — ideal para quem prefere volume maior ou está entre tamanhos. A maioria das IES aceita os dois modelos sem restrição.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco feminino com elastano é a escolha mais confortável para quem passa 4 a 8 horas por dia em aulas práticas."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelo',
                    title: 'Jaleco Padrão Aluno ou Slim: qual comprar?',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para o início da graduação, o Padrão Aluno Feminino é a escolha mais segura — aceito pela esmagadora maioria das IES, sem risco de questionamento nas aulas práticas ou estágios.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O Slim é ideal para quem já está em estágio clínico ou consultório — visual mais moderno, mas algumas faculdades restringem uso em laboratórios de risco. Confirme com a coordenação antes de comprar.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Padrão Aluno Feminino — Corte neutro-feminino, branco, aceito em todas as IES, ideal para 1° ao 4° período',
                            'Slim Feminino — Corte ajustado, visual moderno, recomendado para estágio e clínica',
                            'Princesa Feminino — Corte com detalhe exclusivo, ideal para fisioterapia e odontologia',
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
                    id: 'normas',
                    title: 'Normas da faculdade: o que a IES pode exigir',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A maioria das faculdades de saúde exige jaleco branco, manga longa, sem estampas. Em laboratórios de risco biológico ou químico, a manga longa é obrigatória pela NR-6 — norma de segurança do trabalho que vale para estudantes em aulas práticas.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Bordado com nome e número de registro provisório (CRM, COREN, CRO etc.) é liberado na maioria das IES a partir do terceiro ou quarto período. Verifique o regulamento da sua instituição antes de encomendar personalização.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'tamanho',
                    title: 'Como escolher o tamanho do jaleco feminino',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Meça o busto (parte mais larga do peito) e compare com a tabela Jaleca. O corte feminino já tem ajuste na cintura — não precisa pegar tamanho maior por isso. Para usar sobre roupa, adicione 2 a 4 cm ao busto medido.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Em caso de dúvida entre dois tamanhos, prefira o maior — jaleco apertado nos ombros restringe movimento e fica desconfortável em aulas longas. A grade Jaleca vai do PP ao G3.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: 'primeiro',
                    title: 'Primeiro jaleco: o que comprar na entrada da faculdade',
                    body: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Para o primeiro jaleco, compre pelo menos 2 unidades do Padrão Aluno Feminino branco. Um para usar, um para lavar. Com aulas práticas diárias ou estágio hospitalar, 3 jalecos evitam imprevistos.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Evite comprar jaleco de segunda mão ou de qualidade desconhecida — tecido que não aguenta lavagem frequente a 40°C descola, amarela e perde a forma em poucos meses. O jaleco Jaleca é fabricado para higienização clínica intensiva.
                        </p>
                        <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', marginTop: '0.5rem' }}>
                          Ver jalecos femininos →
                        </Link>
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

        {/* ── PRODUTO DETAIL ── */}
        <ProductDetailSection productType="jaleco" />

        {/* ── FAQ ── */}
        {/* ── INSTAGRAM — desceu pra antes do FAQ ── */}
        <InstagramLazy />

        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>feminino universitário</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── BLOG ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Blog Jaleca</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: 0 }}>
              Leitura para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>estudantes</em>
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
                  { title: 'Como lavar e conservar seu jaleco profissional', href: '/blog/como-lavar-jaleco', tag: 'Cuidados', excerpt: 'Erros simples de lavagem aceleram o amarelamento. Veja o guia completo.' },
                  { title: 'Jaleco branco: tradição e cuidados essenciais', href: '/blog', tag: 'Guia', excerpt: 'Por que o branco domina e como manter o jaleco com aspecto profissional.' },
                  { title: 'Como escolher o tamanho certo do jaleco', href: '/medidas', tag: 'Guia de Tamanhos', excerpt: 'Passo a passo para encontrar o tamanho ideal na grade Jaleca.' },
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

        {/* ── LINKS INTERNOS — outros cursos ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Jalecos femininos por profissão</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, lineHeight: 1.15, color: '#fff', marginBottom: '2.5rem' }}>
              Jaleco para cada<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissional de saúde</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Médica', href: '/jaleco-medica', desc: 'Guia completo' },
                { label: 'Enfermeira', href: '/jaleco-enfermeira', desc: 'Guia completo' },
                { label: 'Dentista', href: '/jaleco-dentista', desc: 'Guia completo' },
                { label: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Guia completo' },
                { label: 'Biomédica', href: '/jaleco-biomedica', desc: 'Guia completo' },
                { label: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Guia completo' },
                { label: 'Veterinária', href: '/jaleco-veterinaria', desc: 'Guia completo' },
                { label: 'Universitário Unissex', href: '/jaleco-universitario', desc: 'Para todos os cursos' },
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
              Seu primeiro jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>merece ser o certo</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Corte feminino, tecido com elastano, do PP ao G3. Frete grátis no Sudeste para compras acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href="/jaleco-universitario" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Unissex
              </Link>
            </div>
          </div>
        </section>

    </main>
    </>
  )
}
