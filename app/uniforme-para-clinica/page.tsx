import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { getGooglePlaceData } from '@/lib/google-places'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Uniforme para Clínica: Conjuntos e Jalecos para Equipe Completa | Jaleca',
  description: 'Uniformes para clínica médica, odontológica e estética. Conjuntos e jalecos para toda a equipe — do PP ao G3. Tecido premium com elastano, frete grátis SP/RJ/MG/ES. Fabricante com estoque próprio.',
  alternates: { canonical: 'https://jaleca.com.br/uniforme-para-clinica' },
  openGraph: {
    title: 'Uniforme para Clínica: Conjuntos e Jalecos para Equipe Completa',
    description: 'Uniformes para clínicas — jalecos e conjuntos para médicos, enfermeiros, dentistas e toda a equipe. Tecido premium, grade completa PP ao G3.',
    url: 'https://jaleca.com.br/uniforme-para-clinica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniforme para Clínica: Conjuntos e Jalecos para Equipe Completa',
    description: 'Uniformes para clínicas — jalecos e conjuntos para toda a equipe. Tecido premium, grade completa PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual o melhor uniforme para clínica que ofereça conforto e durabilidade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O melhor uniforme para clínica combina gabardine com elastano (150-165 g/m²) para jalecos e scrub de microfibra para conjuntos internos. O elastano garante mobilidade em jornadas longas, e a gabardine mantém o caimento sem amassar. Para recepção e atendimento administrativo, conjuntos sociais em crepe de poliéster são mais adequados. O padrão mínimo recomendado é lavagem a 40°C sem deformação após 50 ciclos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Uniformes para clínica com tecidos antibacterianos são necessários?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para áreas de contato direto com pacientes — sala de procedimentos, coleta, curativos — o tratamento antimicrobiano ativo é recomendado. Ele reduz a proliferação bacteriana entre lavagens. Para recepção e áreas administrativas, o gabardine convencional é suficiente. Em farmácias de manipulação e laboratórios, a RDC 67/2007 e NR-32 estabelecem requisitos adicionais de barreira.',
      },
    },
    {
      '@type': 'Question',
      name: 'Onde comprar uniformes para clínica de alta qualidade no Brasil?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Jaleca é fabricante brasileiro especializado em uniformes para saúde e clínicas. Oferece jalecos e conjuntos do PP ao G3, com elastano, entrega para todo o Brasil e frete grátis para SP, RJ, MG e ES acima de R$499. Por ser fabricante direto — sem intermediários — a qualidade é controlada internamente e o preço é mais competitivo que representantes e distribuidores.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso padronizar uniformes para toda a equipe da clínica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A Jaleca atende pedidos para equipes completas — médicos, enfermeiros, técnicos, recepcionistas e administrativo. É possível escolher cores e modelos diferentes por função para facilitar a identificação visual da equipe. A grade vai do PP ao G3 para incluir todos os corpos. Para pedidos corporativos, entre em contato para orçamento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco e conjunto para clínica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O jaleco é uma sobreposta usada sobre a roupa — padrão para médicos, dentistas e farmacêuticos em atendimento clínico. O conjunto (jaleco + calça ou blusa + calça) é o uniforme completo, ideal para equipes de enfermagem, técnicos e recepcionistas, onde se deseja padronização total da aparência. O conjunto também é mais prático em jornadas longas pois elimina a variação de roupa pessoal por baixo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quantos uniformes cada profissional da clínica precisa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O mínimo recomendado é 3 peças por profissional: 1 em uso, 1 na lavagem, 1 de reserva. Para jornadas acima de 6 horas ou turnos duplos, 4 a 5 peças garantem que o uniforme está sempre limpo. Para clínicas com lavanderia própria ou terceirizada, 2 peças podem ser suficientes se a rotatividade de lavagem for diária.',
      },
    },
    {
      '@type': 'Question',
      name: 'A NR-32 exige algum padrão específico para uniformes de clínica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A NR-32 (Segurança e Saúde no Trabalho em Serviços de Saúde) exige que o empregador forneça e custeie os uniformes, que os uniformes sejam mantidos limpos e em boas condições, e que não circulem fora do ambiente de trabalho. O tipo de uniforme (jaleco, scrub, avental) varia conforme a função e o risco biológico da área. Clínicas devem ter política documentada de uso e higienização.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como lavar uniformes de clínica para garantir higiene adequada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A NR-32 recomenda que uniformes de saúde sejam lavados separadamente das roupas pessoais, de preferência pelo empregador ou em lavanderia especializada. Em casa: lavar separado a 40-60°C conforme o tecido, guardar em saco plástico fechado ao sair do trabalho. Uniformes com contaminação visível devem ser trocados imediatamente e lavados antes do próximo uso.',
      },
    },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Uniforme para Clínica: Guia Completo de Conjuntos e Jalecos para Equipe',
  description: 'Tudo sobre uniformes para clínica médica, odontológica e estética — tecidos, normas NR-32, como escolher por função e onde comprar com qualidade.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  },
  url: 'https://jaleca.com.br/uniforme-para-clinica',
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uniformes Saúde', item: 'https://jaleca.com.br/uniformes-profissionais-saude' },
    { '@type': 'ListItem', position: 3, name: 'Uniforme para Clínica', item: 'https://jaleca.com.br/uniforme-para-clinica' },
  ],
}

const CLINICA_HUBS = [
  { href: '/jaleco-medico',         titulo: 'Médicos',          desc: 'Jaleco clínico · manga longa · CFM 1931/2009' },
  { href: '/jaleco-dentista',       titulo: 'Dentistas',        desc: 'NR-32 · antimicrobiano · scrub odonto' },
  { href: '/jaleco-enfermeira',     titulo: 'Enfermagem',       desc: 'COFEN 375/2011 · elastano · plantão' },
  { href: '/jaleco-farmaceutico',   titulo: 'Farmacêuticos',    desc: 'RDC 44/2009 · manga longa · manipulação' },
  { href: '/jaleco-fisioterapeuta', titulo: 'Fisioterapeutas',  desc: 'COFFITO 424/2013 · stretch · ergonomia' },
  { href: '/jaleco-nutricionista',  titulo: 'Nutricionistas',   desc: 'CFN 380/2005 · toque neutro · atendimento' },
  { href: '/jaleco-biomedico',      titulo: 'Biomédicos',       desc: 'CRBio · DWR · laboratório' },
  { href: '/jaleco-psicologa',      titulo: 'Psicólogos',       desc: 'CFP · neutros · setting terapêutico' },
  { href: '/conjunto-para-clinica', titulo: 'Conjuntos Completos', desc: 'Jaleco + calça · equipe padronizada' },
  { href: '/uniforme-consultorio',  titulo: 'Consultórios',     desc: 'Médico · odontológico · estético' },
]

const SUB_PILAR_LINKS = [
  { href: '/uniformes-profissionais-saude', label: 'Uniformes para Saúde' },
  { href: '/conjunto-para-clinica',         label: 'Conjunto para Clínica' },
  { href: '/uniforme-consultorio',          label: 'Uniforme para Consultório' },
  { href: '/jaleco-medico',                 label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista',               label: 'Jaleco para Dentista' },
  { href: '/jaleco-enfermeira',             label: 'Jaleco para Enfermeira' },
  { href: '/jaleco-farmaceutico',           label: 'Jaleco para Farmacêutico' },
  { href: '/jaleco-fisioterapeuta',         label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-nutricionista',          label: 'Jaleco para Nutricionista' },
]

async function getProdutos(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 50 })
    const products = data?.products?.nodes ?? []
    return products
      .filter(p => p.slug.includes('conjunto') || p.slug.includes('jaleco') || p.slug.includes('scrub'))
      .slice(0, 6)
  } catch {
    return []
  }
}

export default async function UniformeParaClinicaPage() {
  const [produtos, placeData] = await Promise.all([getProdutos(), getGooglePlaceData()])

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
              { label: 'Uniformes Saúde', href: '/uniformes-profissionais-saude' },
              { label: 'Uniforme para Clínica', href: null },
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
              Uniformes corporativos para saúde
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
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>clínica</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 620, margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
              Jalecos e conjuntos para toda a equipe — médicos, enfermeiros, técnicos, recepcionistas. Tecido premium com elastano, grade do PP ao G3, fabricante direto.
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 300, color: '#8a8782', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Uniforme padronizado transmite credibilidade ao paciente, facilita a identificação da equipe e atende às exigências da NR-32 para serviços de saúde.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver conjuntos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver jalecos →
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
            { title: 'Tamanhos PP ao G3', sub: 'Grade completa para toda a equipe' },
            { title: 'Frete grátis', sub: 'SP · RJ · MG · ES acima R$499' },
            { title: 'Troca em 7 dias', sub: 'Direito do consumidor garantido' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0.75rem 1.5rem', borderRight: (i % 2 === 0) ? '1px solid rgba(255,255,255,0.12)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{item.sub}</span>
            </div>
          ))}
        </div>

        {/* ── INTRO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              Clínicas que investem em uniforme padronizado para a equipe têm retorno direto em credibilidade: o paciente percebe organização, confia mais no atendimento e tende a retornar e indicar. Além disso, a <strong>NR-32</strong> exige que serviços de saúde forneçam uniformes adequados e garantam que não circulem fora do ambiente de trabalho.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.5rem' }}>
              A escolha do uniforme certo depende da função: médicos e dentistas usam <strong>jaleco clínico</strong> sobre a roupa; equipes de enfermagem e técnicos preferem <strong>conjunto completo</strong> (jaleco + calça ou scrub); recepcionistas e administrativo ficam bem com <strong>conjunto social</strong> em cores da identidade visual da clínica.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Por ser fabricante direto, a Jaleca atende pedidos corporativos para equipes inteiras — com grade completa do PP ao G3 e possibilidade de padronização por cor conforme a função de cada profissional.
            </p>
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        {produtos.length > 0 && (
          <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
            <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
              <div className="flex justify-between items-end flex-wrap gap-4 mb-10">
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção clínica</div>
                  <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                    Jalecos e conjuntos<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para sua equipe</em>
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

        {/* ── HUBS POR PROFISSÃO ── */}
        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Por função na clínica
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Uniforme certo para<br />cada profissional
            </h2>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1.5rem' }}
            >
              {CLINICA_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  style={{ textDecoration: 'none', display: 'block', background: '#f9f7f4', border: '1px solid #e5e0d8', padding: '1.75rem' }}
                >
                  <strong style={{ display: 'block', fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: "'Cormorant', Georgia, serif" }}>
                    {hub.titulo}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#8a8782', lineHeight: 1.6 }}>{hub.desc}</span>
                  <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a96e' }}>
                    Ver uniforme →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIA DE TECIDOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Guia de tecidos
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>
              Qual tecido escolher<br />para cada área da clínica
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
              {[
                {
                  tipo: 'Gabardine com elastano (150-165 g/m²)',
                  para: 'Consultório, triagem, ambulatório',
                  detalhe: 'O padrão para jalecos clínicos. Caimento limpo, repele vincos, lavagem a 40°C. Ideal para médicos, dentistas e farmacêuticos em atendimento.',
                },
                {
                  tipo: 'Microfibra com elastano (120-140 g/m²)',
                  para: 'Fisioterapia, psicologia, nutrição',
                  detalhe: 'A opção mais leve. Regula a temperatura em jornadas longas. Ideal para profissionais em atendimento sentado ou com movimentação constante.',
                },
                {
                  tipo: 'Scrub (microfibra técnica)',
                  para: 'Enfermagem, técnicos, procedimentos',
                  detalhe: 'Conjunto completo (blusa + calça) para uso interno. Movimento irrestrito, lavagem a 60°C, identifica a função pelo modelo e cor.',
                },
                {
                  tipo: 'Crepe de poliéster',
                  para: 'Recepção, administrativo, coordenação',
                  detalhe: 'Aparência social e profissional. Combina com identidade visual da clínica. Disponível em cores variadas para diferenciar funções.',
                },
                {
                  tipo: 'Gabardine DWR (150-180 g/m²)',
                  para: 'Laboratório, biomedicina, veterinário',
                  detalhe: 'Tratamento repelente à água. Respingos deslizam sem penetrar — jaleco limpo por mais tempo em áreas de maior exposição.',
                },
              ].map((card, i) => (
                <div key={i} style={{ border: '1px solid #e5e0d8', padding: '1.75rem', background: '#fff' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.35rem' }}>{card.tipo}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.75rem' }}>{card.para}</span>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.7, margin: 0 }}>{card.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NR-32 DESTAQUE ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              Conformidade regulatória
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '2rem' }}>
              O que a NR-32 exige<br />para clínicas
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1px', background: 'rgba(255,255,255,0.08)' }}>
              {[
                { titulo: 'Fornecimento pelo empregador', detalhe: 'A clínica deve fornecer e custear os uniformes — o profissional não pode ser cobrado pela peça.' },
                { titulo: 'Proibição de sair do trabalho', detalhe: 'O uniforme não pode circular fora do ambiente de trabalho. O risco de contaminação ambiental é documentado.' },
                { titulo: 'Higienização adequada', detalhe: 'A clínica deve garantir lavagem correta — separada de roupas pessoais e com temperatura suficiente para inativação de agentes biológicos.' },
                { titulo: 'Troca imediata em caso de contaminação', detalhe: 'Uniforme com contaminação visível (sangue, secreções) deve ser substituído imediatamente por peça limpa.' },
                { titulo: 'Peças em bom estado', detalhe: 'Uniformes com desgaste, rasgos ou manchas permanentes devem ser substituídos — a apresentação do profissional faz parte do protocolo de segurança.' },
                { titulo: 'EPI complementar', detalhe: 'O jaleco/conjunto não substitui EPIs obrigatórios (luvas, máscara, óculos). São camadas complementares de proteção.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', background: '#1a1a1a' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', fontWeight: 400, color: '#c8a96e', marginBottom: '0.5rem' }}>{item.titulo}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{item.detalhe}</span>
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
              Dúvidas sobre uniformes<br />para clínica
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
              Pronto para uniformizar<br />sua equipe?
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6b6b6b', marginBottom: '2rem', lineHeight: 1.8 }}>
              Do PP ao G3. Jalecos e conjuntos com elastano para toda a equipe da clínica. Frete grátis para SP, RJ, MG e ES acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=conjuntos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Conjuntos ↗
              </Link>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Jalecos →
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
