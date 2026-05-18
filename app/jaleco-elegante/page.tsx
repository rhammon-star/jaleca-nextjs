import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import { getCachedHeroImage } from '@/lib/profession-page-data'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import { buildHowToSchema, buildOccupationSchema } from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco Elegante com Caimento Premium — Jaleca' },
  description: 'Nota 4,9 no Google. Jaleco elegante com elastano bidirecional, modelagem slim, PP ao G3. Frete grátis Sudeste acima de R$499. Troca em 7 dias.',
  keywords: 'jaleco elegante, jaleco feminino elegante, jalecos femininos elegantes, jalecos alfaiataria, jalecos luxo, jaleco premium, jaleco sofisticado, jaleco médica elegante',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-elegante' },
  openGraph: {
    title: 'Jaleco Elegante — Caimento Premium e Elastano — Jaleca',
    description: 'Nota 4,9 no Google. Jaleco elegante — modelagem slim, elastano, PP ao G3. Frete grátis Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/jaleco-elegante',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Elegante — Caimento Premium — Jaleca',
    description: 'Jaleco elegante. Elastano, modelagem slim, do PP ao G3. Frete grátis Sudeste.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'O que faz um jaleco feminino ser elegante?',
    a: 'Um jaleco feminino elegante tem três características principais: (1) tecido premium com boa gramatura que mantém o caimento — gabardine ou alfaiataria, sem parecer amassado após horas de uso; (2) corte acinturado que acompanha a silhueta sem apertar; (3) acabamentos trabalhados — botões de qualidade, recortes precisos, sem costuras aparentes. O jaleco Slim Duquesa da Jaleca reúne essas três características.',
  },
  {
    q: 'Jaleco de alfaiataria: o que é?',
    a: 'Jaleco de alfaiataria é produzido com tecido de alta gramatura (200-240 g/m²), geralmente gabardine pesado ou Oxford premium, com corte estruturado e acabamentos mais elaborados — costura interna escondida, botões sobressalentes, recortes precisos. É o padrão mais formal e sofisticado de jaleco, muito escolhido por médicas chefes, professoras universitárias e profissionais em ambientes de alto padrão.',
  },
  {
    q: 'Jaleco elegante pode ser colorido?',
    a: 'Sim. Jalecos elegantes não precisam ser necessariamente brancos. As tonalidades que mais transmitem elegância e sofisticação são azul marinho, preto, marsala e cinza grafite. O tecido e o corte determinam a elegância — não só a cor.',
  },
  {
    q: 'Jalecos femininos elegantes diferem dos masculinos?',
    a: 'Sim. O jaleco elegante feminino tem corte acinturado, manga calibrada para o biótipo feminino e comprimento proporcional à altura. O masculino tem corte reto e estrutura mais larga. A Jaleca desenvolve moldes exclusivos para cada gênero — não é adaptação.',
  },
  {
    q: 'Jaleco de luxo: vale o investimento?',
    a: 'Para profissionais que recebem pacientes diariamente, o jaleco é parte da imagem profissional — e o retorno do investimento vem na percepção de qualidade pelo paciente. Um jaleco premium dura muito mais do que os básicos de menor gramatura e mantém o caimento após dezenas de lavagens. Para ambientes de alto padrão, vale o investimento.',
  },
  {
    q: 'Onde comprar jaleco feminino elegante de qualidade?',
    a: 'A Jaleca é especialista em jalecos femininos premium para profissionais da saúde. Os modelos Slim e Duquesa são os mais sofisticados da linha, disponíveis em tecidos de alfaiataria e gabardine premium. Acesse jaleca.com.br — entrega rápida para todo o Brasil.',
  },
]

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Elegante', item: 'https://jaleca.com.br/jaleco-elegante' },
  ],
}

export default async function Page() {
  const [placeData, heroImg] = await Promise.all([
    getGooglePlaceData(),
    getCachedHeroImage('jaleco-slim-tradicional-feminino-jaleca'),
  ])

  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-elegante', 'https://jaleca.com.br/jaleco-elegante'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-elegante', 'https://jaleca.com.br/jaleco-elegante'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* BREADCRUMB */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco Elegante', href: null },
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
          eyebrow="Alfaiataria premium"
          h1Line1="Jaleco feminino elegante:"
          h1Line2="alfaiataria e sofisticação para profissionais"
          description="Para médicas, dentistas e profissionais que precisam unir autoridade visual com conforto real em jornadas longas. Tecidos de alfaiataria premium, corte acinturado, acabamentos trabalhados."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"
          googleRating={placeData?.rating}
        />



        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
        {/* CONTEÚDO EDITORIAL */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              O que faz a diferença
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              O que define um jaleco<br />feminino realmente elegante
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e5e0d8', marginBottom: '3rem' }}>
              {[
                { titulo: 'Tecido de alfaiataria', texto: 'Gabardine pesado (200-240 g/m²) ou Oxford premium — cai melhor, não amassa, mantém a estrutura após lavagens frequentes. A gramatura densa é o que diferencia o jaleco elegante do jaleco básico.' },
                { titulo: 'Corte acinturado real', texto: 'Recortes laterais que seguem a silhueta sem apertar. O corte acinturado bem executado define a cintura sem comprometer o movimento — essencial para jornadas longas em consultório.' },
                { titulo: 'Acabamentos trabalhados', texto: 'Botões de qualidade, costuras internas escondidas, punho trabalhado (no modelo Duquesa). Detalhes que o paciente percebe mesmo sem saber nomear.' },
                { titulo: 'Coloração durável', texto: 'Tingimento de alta durabilidade que mantém o branco sempre branco e o colorido sempre vibrante — mesmo após dezenas de lavagens com alvejante.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '2rem' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.3rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.titulo}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.texto}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Modelos elegantes da linha Jaleca
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {[
                { nome: 'Jaleco Slim', desc: 'O modelo de jaleco feminino mais elegante para consultório. Corte acinturado com recortes laterais que definem a silhueta. Tecido gabardine com elastano — o elastano garante conforto sem perder o caimento estruturado.', ideal: 'Médicas e dentistas em atendimento presencial' },
                { nome: 'Jaleco Duquesa', desc: 'Manga longa com punho trabalhado, acabamento em alfaiataria premium. O modelo mais formal da linha Jaleca. Para quem precisa transmitir autoridade máxima — diretoras clínicas, professoras, médicas em ambiente hospitalar formal.', ideal: 'Ambientes que exigem máxima formalidade' },
                { nome: 'Jaleco Gold (linha premium)', desc: 'Acabamentos diferenciados, tecido de gramatura superior, detalhes exclusivos. A linha Gold é a mais sofisticada do catálogo Jaleca — para profissionais que querem o melhor sem concessões.', ideal: 'Quem exige o máximo em qualidade e acabamento' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', padding: '1.75rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <strong style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a' }}>{item.nome}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#c8a96e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.ideal}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.8, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUTOS */}
        <ProfessionProductGrid
          professionKey="medica"
          professionLabel="Médicas e Dentistas"
          collectionLabel="Jalecos Elegantes"
          productLabel="Jalecos"
          allHref="/categoria/jalecos-femininos"
        />

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Dúvidas sobre jaleco<br />feminino elegante
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.2rem', color: '#c8c4bc', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* LINKS INTERNOS */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>
              Explore mais
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: '/jaleco-feminino', label: 'Jaleco Feminino — guia completo' },
                { href: '/modelo-de-jaleco', label: 'Todos os modelos de jaleco' },
                { href: '/jaleco-azul-marinho', label: 'Jaleco Azul Marinho' },
                { href: '/jaleco-premium', label: 'Jaleco Premium' },
                { href: '/jaleco-medica', label: 'Jaleco para Médica' },
                { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
                { href: '/categoria/jalecos-femininos', label: 'Ver todos os jalecos femininos' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '0.82rem', color: '#4a4a4a', textDecoration: 'none', padding: '0.4rem 1rem', border: '1px solid #e5e0d8', whiteSpace: 'nowrap' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              Elegância que acompanha<br />cada atendimento.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Alfaiataria premium, corte acinturado, do PP ao G3. Entrega rápida para todo o Brasil.
            </p>
            <Link href="/categoria/jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver jalecos elegantes ↗
            </Link>
          </div>
        </section>

            
        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />

    </main>
    </>
  )
}
