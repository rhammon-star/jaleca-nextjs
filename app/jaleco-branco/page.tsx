import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import CategoryProductGrid from '@/components/CategoryProductGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco Branco Profissional — Médico, Enfermeiro e Clínica | Jaleca' },
  description: 'Jaleco branco profissional com elastano. Para médicos, enfermeiros, dentistas e profissionais de saúde. Tecido que não amarela, caimento impecável. PP ao G3. Frete grátis SP, RJ, MG e ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-branco' },
  openGraph: {
    title: 'Jaleco Branco Profissional — Médico, Enfermeiro e Clínica',
    description: 'Jaleco branco profissional com elastano. Para médicos, enfermeiros, dentistas. Tecido que não amarela.',
    url: 'https://jaleca.com.br/jaleco-branco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ_ITEMS = [
  {
    q: 'Jaleco branco amarela com o tempo?',
    a: 'Pode amarelar se lavado com água quente, guardado úmido ou exposto ao sol diretamente. Com água fria ou morna (até 40°C), sabão neutro e secagem à sombra, o jaleco branco da Jaleca mantém a cor por muito mais tempo. Se já amarelou, molho em água fria com vinagre branco por 30 minutos antes de lavar normal ajuda.',
  },
  {
    q: 'Qual o melhor tecido para jaleco branco profissional?',
    a: 'Gabardine com elastano é o ideal — resistente, não amassa fácil, não desbota e tem memória de forma. Os jalecos Jaleca têm 67% poliéster, 33% algodão e 3-8% elastano. Essa composição aguenta lavagem frequente sem perder caimento.',
  },
  {
    q: 'Jaleco branco feminino e masculino têm corte diferente?',
    a: 'Sim. O feminino tem busto estruturado, cintura levemente marcada e quadril com espaço. O masculino tem ombros mais largos e corte reto. Ambos têm elastano para acompanhar movimento sem apertar.',
  },
  {
    q: 'Jaleco com elastano desbota mais rápido?',
    a: 'Não. O elastano em si não causa desbotamento — o problema é temperatura alta na lavagem. Com água até 40°C e sem alvejante com cloro, o jaleco mantém cor e forma normalmente.',
  },
  {
    q: 'Como tirar mancha de sangue do jaleco branco?',
    a: 'Água fria + sabão neutro imediatamente — nunca use água quente, ela fixa a proteína do sangue no tecido. Se já secou, deixe de molho em água fria com água oxigenada 10 volumes por 15 minutos antes de lavar.',
  },
]

const PROFISSOES = [
  { href: '/jaleco-medico', label: 'Médico', desc: 'Tradicional, branco obrigatório em muitos hospitais' },
  { href: '/jaleco-enfermeiro', label: 'Enfermeiro', desc: 'Conforto para plantões longos' },
  { href: '/jaleco-dentista', label: 'Dentista', desc: 'Manga longa, resiste a produtos clínicos' },
  { href: '/jaleco-veterinario', label: 'Veterinário', desc: 'Lavagem industrial, tecido resistente' },
  { href: '/jaleco-farmaceutico', label: 'Farmacêutico', desc: 'Visual profissional no balcão' },
  { href: '/jaleco-biomedico', label: 'Biomédico', desc: 'Tecido que aguenta produtos de lab' },
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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/categoria/jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Branco', item: 'https://jaleca.com.br/jaleco-branco' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/categoria/jalecos' },
              { label: 'Jaleco Branco', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)', borderBottom: '1px solid #e5e0d8' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Para profissionais de saúde
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco branco:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#6b6b6b' }}>impecável no primeiro dia, e no centésimo</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Para médicos, enfermeiros, dentistas e todos que usam branco como padrão. Tecido que aguenta lavagem frequente sem amarelar, com elastano para não apertar no plantão.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/jaleco-medico" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Jaleco Branco Feminino →
              </Link>
              <Link href="/categoria/jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Masculinos →
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{placeData.rating.toFixed(1)} de 5 no Google · {placeData.reviewCount} avaliações</span>
              </div>
            )}
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        <CategoryProductGrid
          categorySlug="jalecos"
          color="branco"
          professionLabel="profissionais de saúde"
          collectionLabel="Coleção branco"
          productLabel="Jalecos brancos"
          allHref="/produtos?cor=branco"
          limit={9}
        />

        {/* ── PROFISSÕES ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por profissão
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Quem usa jaleco branco
            </h2>
            <div className="grid" style={{ gap: '1rem' }}>
              {PROFISSOES.map((p, i) => (
                <Link key={i} href={p.href} style={{ display: 'block', border: '1px solid #e5e0d8', padding: '1.5rem', textDecoration: 'none' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.4rem' }}>{p.label}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>{p.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTEÚDO SEO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O jaleco branco é padrão em hospitais, clínicas e UBSs porque facilita a identificação de sujeira e transmite higiene ao paciente. Em muitos protocolos institucionais, branco é obrigatório — especialmente para médicos e enfermeiros que trabalham em UTI e centro cirúrgico.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              O desafio do branco é a manutenção. Jaleco barato amarela rápido, estica ou perde o caimento após algumas lavagens. O gabardine com elastano da Jaleca resolve os dois problemas: tecido encorpado que não deforma, composição que não retém amarelamento com lavagem correta.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Para quem trabalha em ambiente clínico, o jaleco precisa passar lavagem frequente — às vezes diária. O segredo é temperatura: nunca acima de 40°C e sem alvejante com cloro. Com esses dois cuidados, o branco fica branco por anos.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Dúvidas
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Perguntas sobre jaleco branco
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>{item.q}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROVA SOCIAL ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Confiança
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Jalecos brancos que não amarelam
            </h2>
            <div className="grid" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
              {[
                { numero: '200.000+', label: 'peças vendidas de jalecos profissionais' },
                { numero: 'PP ao G3', label: 'grade completa' },
                { numero: 'Desde 2010', label: 'lojas físicas' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1 }}>
                    {item.numero}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b6b6b', marginTop: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
              Escolha seu jaleco branco
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Feminino e masculino disponíveis. Entrega para todo o Brasil.
            </p>
            <Link href="/produtos?cor=branco" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Ver todos os jalecos brancos →
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
