import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import CategoryProductGrid from '@/components/CategoryProductGrid'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco para Pediatra: Colorido, Acolhedor e Profissional',
  description: 'Jaleco para pediatra em cores alegres que acalmam crianças. Modelos femininos e masculinos, Slim e Profissional, PP ao G3. Tecido macio e lavável. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-pediatra' },
  openGraph: {
    title: 'Jaleco para Pediatra: Colorido, Acolhedor e Profissional | Jaleca',
    description: 'Jaleco para pediatra em cores que acalmam crianças. Feminino e masculino, PP ao G3. Frete grátis Sudeste.',
    url: 'https://jaleca.com.br/jaleco-pediatra',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco para Pediatra | Jaleca',
    description: 'Jaleco para pediatra colorido e profissional. PP ao G3. Frete grátis Sudeste.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual cor de jaleco é melhor para pediatra?',
    a: 'Cores suaves e alegres — azul claro, verde, lilás, rosa antigo e amarelo — são as mais indicadas para pediatras. Estudos de psicologia infantil mostram que cores vibrantes e não ameaçadoras reduzem a ansiedade de crianças em consultas. O branco tradicional pode ser associado a dor e procedimentos desconfortáveis.',
  },
  {
    q: 'Pediatra pode usar jaleco colorido?',
    a: 'Sim. O CFM não restringe a cor do jaleco. Em pediatria, o jaleco colorido é uma escolha estratégica — profissionais que usam cores alegres relatam crianças mais tranquilas e consultas mais fáceis. Hospitais pediátricos modernos incentivam ativamente o uso de cores.',
  },
  {
    q: 'Qual modelo de jaleco é melhor para pediatra?',
    a: 'O Slim é o modelo mais escolhido por pediatras que atendem em consultório particular — visual moderno e acolhedor. Para plantões em pronto-socorro pediátrico, o Profissional oferece mais conforto em jornadas longas. Ambos disponíveis em cores variadas na Jaleca.',
  },
  {
    q: 'Jaleco de pediatra precisa ser diferente do de médico clínico?',
    a: 'Não existe exigência formal de jaleco específico para pediatria. A diferença é prática: pediatras preferem cores não ameaçadoras, tecido macio e modelagem que permita agachar e se movimentar com facilidade ao examinar crianças pequenas.',
  },
  {
    q: 'Qual o comprimento ideal do jaleco para pediatra?',
    a: 'O jaleco médio (até o quadril) é o mais usado em pediatria — permite mais liberdade de movimento ao se abaixar para examinar crianças. O longo é mais formal e aceito, mas pode dificultar a mobilidade em atendimentos com bebês e crianças pequenas.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim Colorido',
    perfil: 'Para consultório pediátrico',
    desc: 'Corte acinturado e moderno em cores que acalmam crianças. Disponível em azul claro, verde, rosa antigo e outras 12 cores. Tecido Elastex com elastano para mobilidade em consultas.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para plantões e pronto-socorro',
    desc: 'Corte mais amplo e estruturado para jornadas longas. Bolsos funcionais para estetoscópio e materiais. Disponível em branco e cores. PP ao G3.',
  },
  {
    nome: 'Jaleco Plus Size (até G3)',
    perfil: 'Para todos os biótipos',
    desc: 'Molde próprio para grades maiores — não é só mais tecido. Mesmo caimento e qualidade do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-medica', label: 'Jaleco para Médica' },
  { href: '/jaleco-colorido', label: 'Jaleco Colorido' },
  { href: '/jaleco-medicina', label: 'Jaleco para Medicina' },
  { href: '/categoria/jalecos-femininos', label: 'Jalecos Femininos' },
  { href: '/categoria/jalecos-masculinos', label: 'Jalecos Masculinos' },
]

export default async function Page() {
  const placeData = await getGooglePlaceData()

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Jaleco para Pediatra: Colorido, Acolhedor e Profissional',
    description: 'Guia de jaleco para pediatra — cores ideais, modelos e como escolher o jaleco certo para atendimento infantil.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    url: 'https://jaleca.com.br/jaleco-pediatra',
    datePublished: '2026-04-30',
    dateModified: '2026-04-30',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco para Pediatra', item: 'https://jaleca.com.br/jaleco-pediatra' },
    ],
  }


  const schemaSpeakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.faq-section', 'h2'],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-pediatra', 'https://jaleca.com.br/jaleco-pediatra'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-pediatra', 'https://jaleca.com.br/jaleco-pediatra'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco para Pediatra', href: null },
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
          h1Line1="Jaleco para pediatra:"
          h1Line2="cores que acolhem"
          description="Em pediatria, a cor do jaleco importa. Azul claro, verde e lilás deixam crianças mais tranquilas. Tecido com elastano para a mobilidade que o atendimento infantil exige."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos-femininos"
          googleRating={placeData?.rating}
        />


        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ background: '#1a1a1a' }}>
          {[
            { title: '12 cores disponíveis', sub: 'Incluindo azul, verde e lilás' },
            { title: 'Tecido com elastano', sub: 'Mobilidade em consultas' },
            { title: 'PP ao G3', sub: 'Molde feminino e masculino' },
            { title: 'Frete grátis Sudeste', sub: 'SP · RJ · MG · ES acima R$499' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        <CategoryProductGrid
          categorySlug="jalecos"
          professionLabel="Pediatras"
          collectionLabel="Jalecos para Pediatra"
          productLabel="Jalecos"
          allHref="/categoria/jalecos"
          limit={12}
        />

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco do pediatra é uma ferramenta de atendimento, não só um uniforme. Crianças reagem de forma diferente a profissionais de saúde dependendo da aparência — e a cor do jaleco é um dos fatores mais estudados em psicologia pediátrica. Jalecos coloridos em tons suaves reduzem a ansiedade infantil e facilitam a construção de vínculo entre o médico e a criança.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Na prática, pediatras que atendem em consultório particular tendem ao modelo <Link href="/jaleco-colorido" style={{ color: '#c8a96e', textDecoration: 'none' }}>Slim colorido</Link> — visual moderno e acolhedor. Já quem faz plantão em pronto-socorro pediátrico ou UTI neonatal prefere o Profissional pela maior mobilidade e conforto em jornadas longas.
            </p>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Modelos</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Qual jaleco escolher<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para pediatria</em>
            </h2>
            <div className="grid md:grid-cols-3" style={{ gap: '1.5rem' }}>
              {MODELOS.map((modelo, i) => (
                <div key={i} style={{ background: '#f9f7f4', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>{modelo.perfil}</span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{modelo.nome}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: '0 0 1.25rem' }}>{modelo.desc}</p>
                  <Link href="/categoria/jalecos" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e', textDecoration: 'none' }}>Ver modelos →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre<br />jaleco para pediatra
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>Veja também</p>
            <div className="flex flex-wrap gap-2">
              {INTERNAL_LINKS.map(link => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.8rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', display: 'inline-block' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

            
        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />

        {/* ── INSTAGRAM ── */}
        <InstagramLazy />

    </main>
    </>
  )
}
