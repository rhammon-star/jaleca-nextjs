import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import UGCSection from '@/components/UGCSection'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco: Feminino, Masculino, Slim e Profissional — PP ao G3 | Jaleca',
  description: 'Comprar jaleco profissional online — feminino e masculino, branco, preto e colorido. Para médico, dentista, enfermeiro, fisioterapeuta, esteticista. PP ao G3, elastano, frete grátis Sudeste. ⭐ 4.9 no Google.',
  keywords: 'jaleco, jaleco profissional, comprar jaleco, jaleco branco, jaleco colorido, jaleco slim, jaleco com elastano, jaleco PP ao G3, melhor jaleco',
  alternates: { canonical: 'https://jaleca.com.br/jaleco' },
  openGraph: {
    title: 'Jaleco Profissional: Feminino, Masculino, Slim e Plus Size | Jaleca',
    description: 'Catálogo completo de jaleco para profissionais da saúde, beleza e gastronomia. Feminino e masculino, PP ao G3. Frete grátis Sudeste.',
    url: 'https://jaleca.com.br/jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Profissional | Feminino, Masculino, Slim — Jaleca',
    description: 'Comprar jaleco com elastano, PP ao G3, branco e colorido. Frete grátis Sudeste.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'O que é jaleco e para que serve?',
    a: 'Jaleco é a veste profissional usada por médicos, dentistas, enfermeiros, fisioterapeutas, farmacêuticos, veterinários, esteticistas e outros profissionais. Tem três funções: barreira sanitária (proteção contra contaminantes), identificação profissional (cor + nome + registro) e imagem (transmite autoridade e confiança ao paciente). Para a área da saúde, é exigência regulamentada pelos conselhos (CFM, CRO, COFEN, CRMV).',
  },
  {
    q: 'Qual a diferença entre jaleco feminino e masculino?',
    a: 'O jaleco feminino tem molde acinturado, ombros ajustados ao biótipo feminino e cava menor. O masculino tem ombros mais amplos, corte reto e cava maior para movimento de membros superiores. Não use unissex — o caimento fica errado nos dois. Marcas sérias têm grade própria para cada gênero, do PP ao G3.',
  },
  {
    q: 'Jaleco branco é obrigatório?',
    a: 'Não. Nem CFM, CRO ou COFEN definem cor obrigatória. O branco é o padrão histórico em hospitais e clínicas conveniadas ao SUS, associado a higiene. Em consultórios privados, azul royal, preto, verde água, rosa e cinza são aceitos. Para uso hospitalar, confirme antes o protocolo da instituição.',
  },
  {
    q: 'Qual o melhor tecido para jaleco profissional?',
    a: 'Para uso diário: gabardine poliéster/viscose com elastano (4–6%), gramatura 150–200 g/m². Tem leveza, durabilidade, não amassa e suporta lavagem a 40–60°C. Para alta exposição química (laboratório): gabardine pesado 200+ g/m² ou tecido DWR (repele líquidos). Algodão puro é evitado — encolhe e perde caimento após lavagens frequentes.',
  },
  {
    q: 'Qual modelo de jaleco escolher?',
    a: 'Slim: corte ajustado, valoriza silhueta — preferido em consultório e clínica. Princesa: cava americana, leveza — bom para estética e fisio. Profissional: ombros amplos, comprimento até o joelho — ideal para plantão e hospital. Elastex: elastano bidirecional — para quem trabalha muitas horas em movimento, como dentistas e enfermeiros. Duquesa: alfaiataria premium — para gestão clínica e direção.',
  },
  {
    q: 'Jaleco tem tamanho plus size?',
    a: 'Sim — a Jaleca tem grade do PP ao G3, com molde próprio por tamanho (não é só "mais tecido no M"). Ombros, manga, busto/torso e comprimento são recalculados para cada grade. Na dúvida entre dois tamanhos, escolha o maior: o jaleco não pode apertar nos ombros nem restringir o levantamento de braços.',
  },
  {
    q: 'Quanto custa um jaleco profissional de qualidade?',
    a: 'Faixa de preço justa: R$ 159 a R$ 349 para jaleco em gabardine com elastano, dependendo do modelo e tecido. Abaixo de R$ 120 normalmente é algodão puro ou tecido leve que dura poucos meses. Acima de R$ 400 entra na faixa de alfaiataria premium e tecidos importados. A Jaleca trabalha na faixa de equilíbrio — qualidade hospitalar com preço justo.',
  },
  {
    q: 'Como lavar e conservar o jaleco?',
    a: 'Lavagem: 40–60°C com sabão neutro, vire do avesso, não use alvejante com cloro frequente (amarela o branco). Secagem: à sombra ou secadora em temperatura baixa — o sol direto degrada o tecido. Passagem: ferro morno se necessário (gabardine com elastano dispensa). Para manchas (sangue, iodo, anestésico): água fria imediata, depois lavar normal.',
  },
  {
    q: 'Onde comprar jaleco profissional online com entrega rápida?',
    a: 'Na Jaleca, especializada em jaleco para profissionais da saúde no Brasil. ⭐ 4.9 no Google, 61 avaliações. Envio em até 2 dias úteis. Frete grátis para SP, RJ, MG e ES em compras acima de R$ 499. Troca em 7 dias e garantia Jaleca de 30 dias. Acesse jaleca.com.br.',
  },
]

const PUBLICOS = [
  { titulo: 'Médico e médica', href: '/jaleco-medico', desc: 'Slim e Profissional para consultório e plantão. CFM permite cores além do branco.' },
  { titulo: 'Dentista', href: '/jaleco-dentista', desc: 'Curto ou longo com elastano para movimento ao redor da cadeira. ⭐ 4.9★.' },
  { titulo: 'Enfermeiro e enfermeira', href: '/jaleco-enfermeiro', desc: 'Resistente a lavagem a 60°C. Cores conforme protocolo COFEN.' },
  { titulo: 'Fisioterapeuta', href: '/jaleco-fisioterapeuta', desc: 'Movimento amplo, tecido leve. Ideal para atendimento manual.' },
  { titulo: 'Farmacêutico e farmácia', href: '/jaleco-farmacia', desc: 'Gabardine 200+ g/m² para drogaria e manipulação.' },
  { titulo: 'Veterinário e veterinária', href: '/jaleco-veterinario', desc: 'Tecido resistente a pelos, mordidas e arranhões.' },
  { titulo: 'Esteticista', href: '/jaleco-esteticista', desc: 'Tecido DWR repele óleos, ceras e produtos químicos.' },
  { titulo: 'Nutricionista', href: '/jaleco-nutricionista', desc: 'Caimento elegante para consultório, leveza para hospital.' },
  { titulo: 'Estudante de medicina', href: '/blog/jaleco-estudante-medicina', desc: 'Modelo Slim com preço justo para faculdade e residência.' },
  { titulo: 'Barbeiro', href: '/jaleco-barbeiro', desc: 'Preto premium para barbearia. Resistente a cabelos cortados.' },
  { titulo: 'Sushiman e chef', href: '/jaleco-sushiman', desc: 'Dólmãs e jalecos de gastronomia profissional.' },
  { titulo: 'Advogado e advogada', href: '/jaleco-advogado', desc: 'Alfaiataria premium para escritório e audiência.' },
]

const MODELOS = [
  { nome: 'Jaleco Slim', perfil: 'Consultório / clínica', desc: 'Corte acinturado com elastano. Valoriza silhueta sem apertar. Versão masculina tem corte reto ajustado.' },
  { nome: 'Jaleco Princesa', perfil: 'Estética / fisio', desc: 'Cava americana, manga leve, corte solto. Movimento amplo para procedimentos.' },
  { nome: 'Jaleco Profissional', perfil: 'Plantão / hospital', desc: 'Ombros amplos, comprimento até o joelho. Cava folgada para RCP, exames e procedimentos.' },
  { nome: 'Jaleco Elastex', perfil: 'Trabalho longo em movimento', desc: 'Tecido com elastano bidirecional — não amassa, seca rápido. Ideal para plantão de 12h.' },
  { nome: 'Jaleco Duquesa', perfil: 'Direção clínica / gestão', desc: 'Alfaiataria premium, caimento estruturado. Para quem precisa transmitir autoridade.' },
  { nome: 'Jaleco Plus Size', perfil: 'Grade até G3', desc: 'Molde próprio para cada tamanho. Ombros e manga recalculados, não só "mais tecido".' },
]

const CORES = [
  { nome: 'Branco', href: '/jaleco-branco', desc: 'Padrão hospitalar histórico, neutralidade clínica.' },
  { nome: 'Preto', href: '/jaleco-preto', desc: 'Tendência em estética, barbearia e dermatologia.' },
  { nome: 'Azul marinho', href: '/jaleco-azul-marinho', desc: 'Sobriedade institucional, aceito em consultório.' },
  { nome: 'Colorido', href: '/jaleco-colorido', desc: 'Identidade visual em clínicas e estéticas.' },
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
    headline: 'Jaleco: Guia Completo — Feminino, Masculino, Slim, Branco e Colorido',
    description: 'Tudo sobre jaleco profissional: tecidos, modelos, tamanhos, cores e qual escolher para cada profissão da saúde.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco',
    datePublished: '2026-05-11',
    dateModified: '2026-05-11',
  }

  const schemaAggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '61',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco', item: 'https://jaleca.com.br/jaleco' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAggregateRating).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>
        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jaleco', href: null },
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
              Catálogo completo
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
            </div>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.8rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco profissional:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>feminino, masculino e plus size</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 680, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Para médicos, dentistas, enfermeiros, fisioterapeutas, esteticistas e mais. Slim, Princesa, Profissional, Elastex e Duquesa. Branco, preto e colorido. Do PP ao G3, com elastano que acompanha o movimento.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Jaleco feminino →
              </Link>
              <Link href="/jaleco-masculino" style={{ display: 'inline-flex', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jaleco masculino →
              </Link>
              <Link href="/produtos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #e5e0d8' }}>
                Ver catálogo
              </Link>
            </div>
            {placeData && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
                <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>⭐ {placeData.rating.toFixed(1)} no Google · +5.000 profissionais</span>
              </div>
            )}
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {[
            { title: 'Feminino e masculino', sub: 'Moldes próprios por gênero' },
            { title: 'PP ao G3', sub: 'Grade completa por molde' },
            { title: 'Elastano em todos', sub: 'Movimento sem restrição' },
            { title: 'Frete grátis Sudeste', sub: 'SP · RJ · MG · ES R$499+' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── INTRO EDITORIAL ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              O que torna um jaleco realmente bom
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Jaleco não é roupa decorativa — é vestuário profissional usado 8 a 12 horas por dia em ambiente que exige higiene, mobilidade e identificação. A diferença entre um jaleco bom e um ruim aparece já na terceira lavagem: o ruim encolhe, perde caimento e amarela. O bom mantém a forma, o tom e o conforto por dois ou três anos de uso intenso.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Três fatores definem qualidade: <strong>tecido</strong> (gabardine com 4–6% de elastano, 150–200 g/m² para uso clínico padrão), <strong>molde</strong> (próprio por gênero e por grade, não adaptado) e <strong>acabamento</strong> (costura reforçada nos pontos de tensão, botões resistentes a lavagem hospitalar, etiqueta interna que não irrita a pele).
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              A Jaleca trabalha com essas três variáveis para cada peça do catálogo. Abaixo, como escolher o jaleco certo para sua profissão, modelo e tamanho.
            </p>
          </div>
        </section>

        {/* ── PÚBLICOS / PROFISSÕES ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por profissão
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Jaleco para cada profissão
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
              {PUBLICOS.map((p) => (
                <Link key={p.href} href={p.href} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    {p.titulo}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                  <span style={{ display: 'block', marginTop: '0.85rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e' }}>Ver guia →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── MODELOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Modelos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Modelos de jaleco<br />e quando usar cada um
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#f9f7f4', border: '1px solid #e5e0d8', padding: '1.75rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>
                    {m.perfil}
                  </span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                    {m.nome}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORES ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Cores: branco, preto e colorido
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: '#4a4a4a', marginBottom: '2rem' }}>
              Nenhum conselho profissional (CFM, CRO, COFEN, CRMV) define cor obrigatória. O branco é o padrão histórico em ambiente hospitalar e conveniado ao SUS. Em consultórios e clínicas privadas, cores neutras e até preto e colorido têm crescido.
            </p>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: '1rem' }}>
              {CORES.map((c) => (
                <Link key={c.href} href={c.href} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.5rem', textDecoration: 'none', display: 'block' }}>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    Jaleco {c.nome}
                  </strong>
                  <p style={{ fontSize: '0.82rem', color: '#4a4a4a', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Perguntas frequentes
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Tudo sobre jaleco
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

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.2 }}>
              O jaleco certo<br />para sua jornada.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Feminino e masculino. Slim, Princesa, Profissional, Elastex e Duquesa. PP ao G3. Frete grátis SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver catálogo completo ↗
              </Link>
              <Link href="/jaleco-feminino" style={{ display: 'inline-flex', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jaleco feminino →
              </Link>
            </div>
          </div>
        </section>

        <UGCSection />
      </main>
    </>
  )
}
