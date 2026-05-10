import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Uniforme para Consultório: Jaleco Médico, Odontológico e Estético',
  description: 'Uniformes para consultório médico, odontológico, psicológico e estético. Jalecos e conjuntos com elastano, tecido premium, PP ao G3. Fabricante direto — frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/uniforme-consultorio' },
  openGraph: {
    title: 'Uniforme para Consultório: Jaleco para Médico, Dentista e Estético',
    description: 'Uniformes para consultórios médicos, odontológicos e estéticos. Jalecos com elastano, grade PP ao G3, fabricante direto.',
    url: 'https://jaleca.com.br/uniforme-consultorio',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniforme para Consultório: Jaleco para Médico, Dentista e Estético',
    description: 'Uniformes para consultórios médicos, odontológicos e estéticos. Fabricante direto, PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual o uniforme ideal para consultório médico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para consultório médico, o jaleco clínico em gabardine com elastano (150-165 g/m²) é o padrão. Manga longa ou curta dependendo da especialidade — dermatologistas e cirurgiões geralmente preferem manga longa. A cor branca é o padrão histórico, mas cinza claro e azul claro são aceitos em muitas especialidades. O jaleco deve ter bordado com nome e CRM visível ao paciente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual uniforme usar em consultório odontológico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Em consultório odontológico, a NR-32 exige jaleco de manga longa como EPI em procedimentos com risco de respingo. Muitos dentistas optam pelo scrub ou conjunto (blusa + calça) por dentro e jaleco por cima. O conjunto completo é prático para jornadas longas — permite trocar a peça interna sem sair do consultório.',
      },
    },
    {
      '@type': 'Question',
      name: 'Uniforme para consultório estético: jaleco ou avental?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Consulórios de estética geralmente usam jaleco curto (até a cintura) ou jaleco clínico em cores da identidade visual — branco, bege, rose. O jaleco identifica o profissional como especialista. Procedimentos com produtos químicos (peeling, coloração) podem exigir avental adicional sobre o jaleco para proteção.',
      },
    },
    {
      '@type': 'Question',
      name: 'Consultório de psicologia precisa de uniforme?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O CFP (Conselho Federal de Psicologia) não obriga o uso de jaleco, mas muitos psicólogos optam por ele para sinalizar o papel profissional e criar uma separação clara entre o setting terapêutico e o espaço casual. O jaleco leve em microfibra, sem excesso de formalidade, é a escolha mais comum em consultórios de psicologia.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como o uniforme impacta a percepção do paciente no consultório?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Estudos de psicologia da saúde mostram que o jaleco branco ativa expectativas de competência e autoridade no paciente — o chamado "efeito jaleco branco". Um uniforme limpo, bem passado e com identificação visível aumenta a percepção de credibilidade, o que impacta diretamente na adesão ao tratamento e na satisfação do paciente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco para consultório e jaleco hospitalar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O jaleco de consultório é geralmente em tecido mais leve (gabardine 150 g/m²), com caimento mais elegante — pensado para longas horas de atendimento ambulatorial. O jaleco hospitalar ou cirúrgico é mais funcional: tecido mais denso, fechamento seguro, bolsos estratégicos para instrumentos. Para a maioria dos consultórios privados, o jaleco clínico é o mais adequado.',
      },
    },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Uniforme para Consultório: Guia Completo por Especialidade',
  description: 'Tudo sobre uniformes para consultório médico, odontológico, estético e psicológico — tecidos, normas, e como escolher o jaleco certo para cada especialidade.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  },
  url: 'https://jaleca.com.br/uniforme-consultorio',
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uniforme para Clínica', item: 'https://jaleca.com.br/uniforme-para-clinica' },
    { '@type': 'ListItem', position: 3, name: 'Uniforme para Consultório', item: 'https://jaleca.com.br/uniforme-consultorio' },
  ],
}

const ESPECIALIDADES = [
  { href: '/jaleco-medico',         titulo: 'Consultório Médico',         desc: 'Clínica geral, pediatria, cardiologia — gabardine branco, CFM' },
  { href: '/jaleco-medica',         titulo: 'Consultório Médica',         desc: 'Modelagem feminina acinturada — conforto e elegância no atendimento' },
  { href: '/jaleco-dentista',       titulo: 'Consultório Odontológico',   desc: 'NR-32 · manga longa · proteção contra respingos' },
  { href: '/jaleco-psicologa',      titulo: 'Consultório de Psicologia',  desc: 'CFP · tecido leve · setting terapêutico sem formalidade excessiva' },
  { href: '/jaleco-nutricionista',  titulo: 'Consultório de Nutrição',    desc: 'CFN 380/2005 · toque neutro · atendimento clínico' },
  { href: '/jaleco-fisioterapeuta', titulo: 'Consultório de Fisioterapia',desc: 'COFFITO 424/2013 · elastano · movimento irrestrito' },
  { href: '/jaleco-esteticista',    titulo: 'Consultório Estético',       desc: 'Jaleco curto ou longo · identidade visual · proteção química' },
  { href: '/jaleco-veterinario',    titulo: 'Consultório Veterinário',    desc: 'CFMV 1138/2016 · funcional · DWR' },
]

const SUB_PILAR_LINKS = [
  { href: '/uniforme-para-clinica',         label: 'Uniforme para Clínica' },
  { href: '/conjunto-para-clinica',         label: 'Conjunto para Clínica' },
  { href: '/uniformes-profissionais-saude', label: 'Uniformes para Saúde' },
  { href: '/jaleco-medico',                 label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista',               label: 'Jaleco para Dentista' },
  { href: '/jaleco-psicologa',              label: 'Jaleco para Psicólogo' },
  { href: '/jaleco-nutricionista',          label: 'Jaleco para Nutricionista' },
  { href: '/jaleco-fisioterapeuta',         label: 'Jaleco para Fisioterapeuta' },
]

export default async function UniformeConsultorioPage() {
  const placeData = await getGooglePlaceData()

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
              { label: 'Uniforme para Consultório', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Guia por especialidade
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(2.4rem,5.5vw,4.8rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              Uniforme para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>consultório</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
              Médico, dentista, psicólogo, nutricionista, esteticista — cada especialidade tem exigências específicas de uniforme. Guia completo por área.
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 300, color: '#8a8782', maxWidth: 540, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              O jaleco certo transmite autoridade ao paciente, respeita as normas do conselho regulador e dura a jornada inteira sem amassar.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver jalecos ↗
              </Link>
              <Link href="/conjunto-para-clinica" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver conjuntos →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google</span>
              </div>
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Fabricante direto', sub: 'Sem intermediários, preço justo' },
            { title: 'PP ao G3', sub: 'Grade completa para todos os corpos' },
            { title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor garantido' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── PRODUTOS ── */}
        <ProfessionProductGrid
          professionKey="secretaria"
          professionLabel="Consultório"
          collectionLabel="Conjuntos para Consultório"
          productLabel="Conjuntos"
          allHref="/categoria/conjuntos-femininos"
        />

        {/* ── POR ESPECIALIDADE ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por especialidade
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Uniforme certo para<br />cada tipo de consultório
            </h2>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1.5rem' }}
            >
              {ESPECIALIDADES.map((esp) => (
                <Link
                  key={esp.href}
                  href={esp.href}
                  style={{ textDecoration: 'none', display: 'block', background: '#f9f7f4', border: '1px solid #e5e0d8', padding: '1.75rem' }}
                >
                  <strong style={{ display: 'block', fontSize: '1.2rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: "'Cormorant', Georgia, serif" }}>
                    {esp.titulo}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#8a8782', lineHeight: 1.6 }}>{esp.desc}</span>
                  <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e' }}>
                    Ver modelo →
                  </span>
                </Link>
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
              Dúvidas sobre uniformes<br />para consultório
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
              Guias relacionados
            </p>
            <div className="flex flex-wrap gap-3">
              {SUB_PILAR_LINKS.map((link) => (
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
              Escolha o jaleco<br />ideal para seu consultório
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Do PP ao G3. Jalecos com elastano para todas as especialidades. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Femininos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Masculinos →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
