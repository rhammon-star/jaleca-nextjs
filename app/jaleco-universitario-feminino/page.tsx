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
    { '@type': 'Question', name: 'Qual jaleco feminino comprar para a faculdade?', acceptedAnswer: { '@type': 'Answer', text: 'O Jaleco Padrão Aluno Feminino é o mais indicado para o início da graduação — branco, corte neutro, aceito pela maioria das IES.' } },
    { '@type': 'Question', name: 'Jaleco feminino ou unissex para a faculdade?', acceptedAnswer: { '@type': 'Answer', text: 'O feminino tem corte acinturado e veste melhor em mulheres. O unissex pode ficar largo nos ombros. Para quem tem cintura definida, o feminino é mais confortável no dia a dia.' } },
    { '@type': 'Question', name: 'Posso usar jaleco slim na faculdade?', acceptedAnswer: { '@type': 'Answer', text: 'Depende da IES. A maioria aceita slim no estágio e em clínicas. Confirme com a coordenação antes de comprar.' } },
    { '@type': 'Question', name: 'O jaleco feminino pode ter bordado com nome?', acceptedAnswer: { '@type': 'Answer', text: 'Depende da fase do curso. A maioria das faculdades libera bordado com nome e número de registro provisório a partir do terceiro ou quarto período.' } },
    { '@type': 'Question', name: 'Quantos jalecos comprar para a faculdade?', acceptedAnswer: { '@type': 'Answer', text: 'O mínimo é 2: um para usar e um de reserva na lavagem. Cursos com estágio hospitalar pedem 3 ou mais.' } },
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
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}>
          <div className="flex flex-col justify-center order-2 lg:order-1" style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}>
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme feminino universitário
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(3rem,5.5vw,5.2rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Universitário Feminino</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '1rem', lineHeight: 1.8 }}>
              Para calouras e estudantes de medicina, enfermagem, odontologia, fisioterapia, biomedicina e veterinária.
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Corte acinturado, tecido com elastano, do PP ao G3.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção ↗
              </Link>
              <Link href="/jaleco-universitario" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Unissex →
              </Link>
            </div>
            {placeData && <HeroStars rating={placeData.rating} />}
          </div>

          <div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img src={heroImg.src} alt={heroImg.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0" style={{ background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'Corte Feminino', sub: 'Acinturado, veste o corpo real' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Com elastano', sub: 'Movimento sem restrição' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'PP ao G3', sub: 'Grade completa, plus size incluso' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                {item.icon}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

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
                {produtos.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
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
