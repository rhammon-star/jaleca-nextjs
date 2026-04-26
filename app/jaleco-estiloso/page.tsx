import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Estiloso: Charme, Criatividade e Profissionalismo',
  description: 'Descubra jaleco estiloso para saúde e estética. Modelos diferenciados, coloridos e com cortes modernos para valorizar seu visual no trabalho.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-estiloso' },
  openGraph: {
    title: 'Jaleco Estiloso: Charme, Criatividade e Profissionalismo',
    description: 'Jaleco estiloso que combina identidade visual com qualidade técnica. Para quem se importa com o que veste no trabalho.',
    url: 'https://jaleca.com.br/jaleco-estiloso',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Estiloso: Charme, Criatividade e Profissionalismo',
    description: 'Jaleco estiloso que combina identidade visual com qualidade técnica. Para quem se importa com o que veste no trabalho.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Jaleco estiloso é aceito em clínicas e hospitais?',
    a: 'Depende da instituição. Jaleco estiloso com corte diferenciado ou cor fora do padrão branco pode ser aceito em clínicas privadas, estéticas e consultórios autônomos — onde o profissional define seu próprio protocolo de uniforme. Em hospitais públicos, clínicas conveniadas ao SUS e centros cirúrgicos, o protocolo tende a ser mais restritivo. Antes de comprar, confirme a política de uniformes da sua instituição.',
  },
  {
    q: 'O que torna um jaleco estiloso de qualidade?',
    a: 'A mesma coisa que torna qualquer jaleco de qualidade: tecido certo, molde bem cortado, costura resistente. Jaleco estiloso não é jaleco frágil — quem usa na jornada diária precisa de gabardine com elastano, costura francesa nas laterais e botões que não saem depois de 50 lavagens. Estilo sem técnica não dura a temporada.',
  },
  {
    q: 'Jaleco estiloso pode ter proteção antimicrobiana?',
    a: 'Sim. Alguns modelos combinam design diferenciado com tecido de tratamento antimicrobiano — recomendado para farmácias de manipulação, laboratórios e clínicas com alto contato com secreções. Confira a ficha técnica do produto antes de comprar para confirmar se o tratamento é incorporado na fibra (mais durável) ou superficial (perde efeito em lavagens repetidas).',
  },
  {
    q: 'Quais cores de jaleco estão em alta?',
    a: 'Fora do branco: azul royal, verde jade, rosa pêssego, rosa antigo e cinza claro têm crescido em clínicas de estética, odontologia e psicologia. Preto tem público fiel em tatuadores, barbearias e profissionais de saúde que preferem visual neutro. Cores vivas (vermelho, laranja) são menos comuns em saúde mas aparecem em cozinhas profissionais e food service.',
  },
  {
    q: 'Jaleco estiloso pode ter bordado personalizado?',
    a: 'Sim — e em muitos casos é obrigatório. COFEN, CFM e COFFITO recomendam nome e registro visível no jaleco. O bordado pode ser feito com linha colorida para combinar com o jaleco, ou no padrão branco/preto. Algumas marcas fazem bordado de logo de clínica também — bom para quem quer identidade visual completa.',
  },
  {
    q: 'Onde comprar jaleco estiloso com qualidade?',
    a: 'Em marcas especializadas em uniformes profissionais — não em lojas genéricas de roupa de trabalho. A Jaleca tem modelos estilosos em gabardine com elastano, grade PP ao G3, com entrega para todo o Brasil e devolução em 7 dias. A nota no Google é 4,9/5 com mais de 58 avaliações de profissionais da saúde e estética.',
  },
]

const ESTILOS = [
  {
    estilo: 'Recortes e corte slim',
    para: 'Médica, dentista, psicóloga',
    desc: 'Jaleco com recortes laterais que valorizam a silhueta. Visual contemporâneo sem abrir mão da funcionalidade clínica.',
  },
  {
    estilo: 'Cores além do branco',
    para: 'Esteticista, nutricionista, fisioterapeuta',
    desc: 'Azul royal, verde jade, rosa antigo. Identidade visual própria para profissionais que constroem marca pessoal.',
  },
  {
    estilo: 'Detalhes em vivo colorido',
    para: 'Qualquer profissional',
    desc: 'Jaleco branco com acabamento em vivo colorido (botões, zíper, detalhe na manga). Diferenciação sutil que chama atenção sem destoar.',
  },
  {
    estilo: 'Jaleco preto',
    para: 'Tatuador, barbeiro, estética dark',
    desc: 'Clássico e marcante. Esconde manchas de tinta, produto e pigmento. Muito usado em estúdios de tatuagem e barbearias premium.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-premium', label: 'Jaleco Premium' },
  { href: '/melhor-marca-jaleco', label: 'Melhor Marca de Jaleco' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-tatuador', label: 'Jaleco para Tatuador' },
  { href: '/jaleco-universitario', label: 'Jaleco Universitário' },
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
    headline: 'Jaleco Estiloso: Charme, Criatividade e Profissionalismo',
    description: 'Como combinar estilo e qualidade técnica no jaleco profissional.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    },
    url: 'https://jaleca.com.br/jaleco-estiloso',
    datePublished: '2026-04-21',
    dateModified: '2026-04-21',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Estiloso', item: 'https://jaleca.com.br/jaleco-estiloso' },
    ],
  }

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
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Jaleco Estiloso', href: null },
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
              Para quem se importa com o que veste
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
              Jaleco estiloso:<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>charme e profissionalismo</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Antes de você falar, seu jaleco já comunicou algo. A questão é: o que você quer que ele diga?
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Jalecos femininos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jalecos masculinos →
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

        {/* ── TRUST BAR ── */}
        <div className="grid" style={{ background: '#1a1a1a', padding: '1.5rem clamp(1.5rem,5vw,4rem)' }}>
          {[
            { title: 'Estilo sem abrir mão', sub: 'Gabardine com elastano em todos' },
            { title: 'Modelos exclusivos', sub: 'Cortes pensados por designers' },
            { title: 'Frete grátis SE', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── PRODUTOS — Above the Fold ── */}
        <ProfessionProductGrid
          professionKey="estiloso"
          professionLabel="estilo"
          collectionLabel="Nossa coleção"
          productLabel="Jalecos estilosos"
          allHref="/produtos?categoria=jalecos-femininos"
        />

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Jaleco estiloso não é frescura. É estratégia de imagem. Num consultório de estética onde o ambiente é cuidado até nos detalhes da decoração, um jaleco básico e sem corte destoa — e o paciente percebe, mesmo sem verbalizar.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              A questão prática é: estilo e qualidade técnica precisam andar juntos. Um jaleco bonito que desbota em 3 meses, que amassa na primeira lavagem ou que abre costura no segundo mês não serve — independente de quantas fotos boas ele gerou.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Abaixo, os estilos, as cores que funcionam e o que observar antes de comprar.
            </p>
          </div>
        </section>

        {/* ── ESTILOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Estilos em destaque
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Os estilos mais buscados<br />por profissionais
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {ESTILOS.map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '2rem' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.5rem' }}>
                    {item.para}
                  </span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.4rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.75rem' }}>
                    {item.estilo}
                  </strong>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REGRA DO ESTILO ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              A regra que não muda
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '2rem' }}>
              Estilo é detalhe.<br />Qualidade é base.
            </h2>
            <div className="grid" style={{ gap: '1.5rem' }}>
              {[
                { titulo: 'Tecido primeiro', desc: 'Jaleco estiloso em algodão puro amassa na segunda lavagem. Gabardine com elastano mantém o visual por centenas de ciclos.' },
                { titulo: 'Molde define tudo', desc: 'Cor e detalhe não salvam um jaleco com ombro largo, manga comprida demais ou comprimento desproporcional.' },
                { titulo: 'Costura é garantia', desc: 'Costura francesa nas laterais, overlock na barra e botões presos com fio duplo — isso é o que diferencia jaleco bonito de jaleco durável.' },
                { titulo: 'Lavagem é o teste final', desc: 'Peça informação de gramatura antes de comprar. Jaleco estiloso que desbota ou deforma em 30 lavagens foi uma compra ruim, independente do preço.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: 400, color: '#fff', marginBottom: '0.5rem' }}>{item.titulo}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
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
              Dúvidas sobre<br />jaleco estiloso
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

        {/* ── LINKS INTERNOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '1rem' }}>
              Guias relacionados
            </p>
            <div className="flex flex-wrap gap-3">
              {INTERNAL_LINKS.map((link) => (
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
              Vista o que você<br />quer comunicar.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Estilo e qualidade técnica no mesmo jaleco. 3x sem juros. Frete grátis para SP, RJ, MG e ES acima de R$499.
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
