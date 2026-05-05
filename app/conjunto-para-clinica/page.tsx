import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Conjunto para Clínica: Jaleco + Calça para Equipe de Saúde | Jaleca',
  description: 'Conjunto profissional para clínica — jaleco + calça ou scrub completo para médicos, enfermeiros, dentistas e equipe. Tecido premium com elastano, PP ao G3. Fabricante direto.',
  alternates: { canonical: 'https://jaleca.com.br/conjunto-para-clinica' },
  openGraph: {
    title: 'Conjunto para Clínica: Jaleco + Calça para Equipe de Saúde',
    description: 'Conjunto profissional completo para clínicas. Jaleco + calça ou scrub — tecido premium, elastano, grade PP ao G3.',
    url: 'https://jaleca.com.br/conjunto-para-clinica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conjunto para Clínica: Jaleco + Calça para Equipe de Saúde',
    description: 'Conjunto profissional completo para clínicas. Tecido premium, elastano, grade PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual conjunto é melhor para clínica: scrub ou jaleco com calça?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende da função. Scrub (blusa + calça em microfibra técnica) é o padrão para enfermagem, técnicos e quem fica em área interna de procedimentos — maior mobilidade e fácil higienização. Jaleco com calça social é ideal para médicos, dentistas e farmacêuticos que alternam consultório com sala de espera — aparência mais formal com praticidade de troca.',
      },
    },
    {
      '@type': 'Question',
      name: 'Conjunto para clínica pode ser personalizado com logo da empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O bordado com nome do profissional e/ou logo da clínica pode ser adicionado aos conjuntos. Muitas clínicas optam pelo bordado no jaleco com nome e registro do profissional — o que também atende exigências de conselhos como COFEN e CREFITO que pedem identificação visível.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual cor de conjunto usar em clínica médica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Branco é o padrão histórico e aceito em todos os contextos. Cores claras (azul claro, verde claro, cinza) são amplamente usadas em enfermagem e técnicos para diferenciação de funções. Cores específicas por setor ajudam na identificação rápida da equipe pelo paciente — prática comum em clínicas maiores e hospitais.',
      },
    },
    {
      '@type': 'Question',
      name: 'Conjunto para clínica precisa de elastano?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, especialmente para profissionais com movimentação intensa — enfermagem, fisioterapia, técnicos de radiologia. O elastano (4-8% na composição) garante que a peça acompanhe o movimento sem rasgar ou perder o caimento. Sem elastano, jalecos e calças tendem a prender nos movimentos e deformar rapidamente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como lavar conjunto de clínica para manter a qualidade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lavar separado de roupas pessoais a 40-60°C conforme o tecido. Evitar alvejante que degrada o elastano. Centrifugação moderada. Secar longe do sol direto para preservar a cor. Conjuntos de gabardine com elastano mantêm a qualidade por 80+ lavagens se respeitadas as instruções do fabricante.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quantos conjuntos por profissional a clínica deve fornecer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A NR-32 exige que o empregador forneça uniformes em quantidade suficiente para a jornada. O mínimo recomendado é 3 peças por profissional — 1 em uso, 1 na lavagem, 1 de reserva. Clínicas com lavanderia própria ou diária podem trabalhar com 2 peças.',
      },
    },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Conjunto para Clínica: Jaleco + Calça para Equipe de Saúde',
  description: 'Guia completo de conjuntos profissionais para clínicas — scrub, jaleco com calça, tecidos, cores e como escolher por função.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  },
  url: 'https://jaleca.com.br/conjunto-para-clinica',
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uniforme para Clínica', item: 'https://jaleca.com.br/uniforme-para-clinica' },
    { '@type': 'ListItem', position: 3, name: 'Conjunto para Clínica', item: 'https://jaleca.com.br/conjunto-para-clinica' },
  ],
}

const CONJUNTOS_LINKS = [
  { href: '/conjunto-farmaceutico', label: 'Conjunto para Farmacêutico' },
  { href: '/conjunto-psicologa',    label: 'Conjunto para Psicóloga' },
  { href: '/conjunto-advogado',     label: 'Conjunto para Advogado' },
  { href: '/uniforme-para-clinica', label: 'Uniforme para Clínica' },
  { href: '/uniforme-consultorio',  label: 'Uniforme para Consultório' },
  { href: '/jaleco-enfermeira',     label: 'Jaleco para Enfermeira' },
  { href: '/jaleco-dentista',       label: 'Jaleco para Dentista' },
  { href: '/jaleco-medico',         label: 'Jaleco para Médico' },
]

async function getConjuntos(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 50 })
    const products = data?.products?.nodes ?? []
    return products.filter(p => p.slug.includes('conjunto') || p.slug.includes('scrub')).slice(0, 6)
  } catch {
    return []
  }
}

export default async function ConjuntoParaClinicaPage() {
  const [produtos, placeData, heroImg] = await Promise.all([
    getConjuntos(),
    getGooglePlaceData(),
    getCachedHeroImage('conjunto-profissional-clinica-jaleca'),
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
              { label: 'Início', href: '/' },
              { label: 'Uniforme para Clínica', href: '/uniforme-para-clinica' },
              { label: 'Conjunto para Clínica', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section className="grid md:grid-cols-2" style={{ minHeight: '88vh', padding: 0 }}>
          <div
            className="flex flex-col justify-center"
            style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme completo
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(3rem,5.5vw,5.2rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              Conjunto<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>para clínica</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Jaleco + calça ou scrub completo — uniforme padronizado para toda a equipe da clínica. Do PP ao G3.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Conjuntos →
              </Link>
              <Link href="/uniforme-para-clinica" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Guia completo →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google</span>
              </div>
            )}
          </div>

          <div className="relative" style={{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' }}>
            {heroImg ? (
              <img
                src={heroImg.src}
                alt={heroImg.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', position: 'absolute', inset: 0 }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', position: 'absolute', inset: 0 }} />
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1rem,4vw,3rem)' }}>
          {[
            { title: 'Fabricante direto', sub: 'Sem intermediários' },
            { title: 'PP ao G3', sub: 'Grade completa' },
            { title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1rem 1.25rem', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção clínica</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Conjuntos e scrubs<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para sua equipe</em>
                  </h2>
                </div>
                <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                  Ver todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {produtos.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── QUANDO USAR CADA TIPO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por função na equipe
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Qual conjunto escolher<br />para cada profissional
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e5e0d8' }}>
              {[
                {
                  funcao: 'Médico / Dentista',
                  tipo: 'Jaleco clínico (sem calça)',
                  detalhe: 'O médico e o dentista costumam usar roupa própria embaixo. O jaleco identifica o profissional no atendimento. Para consultório: gabardine 150 g/m² com elastano.',
                  link: '/jaleco-medico',
                },
                {
                  funcao: 'Enfermeiro / Técnico de Enfermagem',
                  tipo: 'Scrub completo (blusa + calça)',
                  detalhe: 'Equipe de enfermagem usa conjunto completo — elimina a variação de roupa pessoal e padroniza a aparência em toda a equipe de plantão.',
                  link: '/jaleco-enfermeira',
                },
                {
                  funcao: 'Fisioterapeuta / Massoterapeuta',
                  tipo: 'Conjunto com calça elástica',
                  detalhe: 'Profissional com alta movimentação. Conjunto em microfibra leve com elastano — liberdade de movimento sem comprometer a apresentação.',
                  link: '/jaleco-fisioterapeuta',
                },
                {
                  funcao: 'Recepcionista / Administrativo',
                  tipo: 'Conjunto social (jaleco + calça/saia)',
                  detalhe: 'Área de recepção exige aparência mais formal. Conjunto em crepe ou gabardine nas cores da identidade visual da clínica.',
                  link: '/jaleco-secretaria',
                },
                {
                  funcao: 'Farmacêutico / Biomédico',
                  tipo: 'Jaleco manga longa ou conjunto com avental',
                  detalhe: 'Ambientes com exposição química exigem manga longa e, em alguns casos, avental adicional de proteção sobre o jaleco.',
                  link: '/conjunto-farmaceutico',
                },
                {
                  funcao: 'Psicólogo / Nutricionista',
                  tipo: 'Jaleco leve ou conjunto casual profissional',
                  detalhe: 'Atendimento em setting de consultório — o jaleco sinaliza o papel profissional sem criar distância excessiva com o paciente. Tecido leve, toque suave.',
                  link: '/jaleco-psicologa',
                },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '1.75rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.25rem' }}>{item.funcao}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.75rem' }}>{item.tipo}</span>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.7, margin: '0 0 1rem' }}>{item.detalhe}</p>
                  <Link href={item.link} style={{ fontSize: '0.72rem', color: '#1a1a1a', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #e5e0d8', paddingBottom: '0.1rem' }}>
                    Ver modelo →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Perguntas frequentes
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre conjuntos<br />para clínica
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {schemaFaq.mainEntity.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.name}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>
              Outros conjuntos e uniformes
            </p>
            <div className="flex flex-wrap gap-3">
              {CONJUNTOS_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Monte o conjunto<br />ideal para sua equipe
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Conjuntos e scrubs do PP ao G3, com elastano, para toda a equipe da clínica. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos ↗
              </Link>
              <Link href="/uniforme-para-clinica" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Guia completo →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
