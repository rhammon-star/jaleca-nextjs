import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import UGCSection from '@/components/UGCSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Profissional: Feminino e Masculino, Slim, Branco e Colorido | Jaleca',
  description: 'Compre jaleco profissional online. Feminino e masculino, Slim, Princesa, Elastex, Duquesa. Branco, preto e colorido. PP ao G3 com elastano. Médico, dentista, enfermeiro, fisioterapeuta. ⭐ 4.9 Google.',
  keywords: 'jaleco, jaleco profissional, comprar jaleco, jaleco feminino, jaleco masculino, jaleco branco, jaleco slim, jaleco com elastano, jaleco PP ao G3, jaleco médico, jaleco dentista',
  alternates: { canonical: 'https://jaleca.com.br/jaleco' },
  openGraph: {
    title: 'Jaleco Profissional: Feminino e Masculino, Slim e Plus Size | Jaleca',
    description: 'Jaleco feminino e masculino para profissionais da saúde. Slim, Princesa, Elastex e Duquesa. PP ao G3, 12 cores. Frete grátis Sudeste.',
    url: 'https://jaleca.com.br/jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco Profissional Feminino e Masculino | Jaleca',
    description: 'Jaleco com elastano, PP ao G3, branco e colorido. Frete grátis Sudeste.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'O que é jaleco e para que serve?',
    a: 'Jaleco é a veste profissional usada por médicos, dentistas, enfermeiros, fisioterapeutas, farmacêuticos, veterinários e esteticistas. Tem três funções: barreira sanitária (proteção contra contaminantes), identificação profissional (cor + nome + registro) e imagem (transmite autoridade ao paciente). Para a área da saúde, é exigência dos conselhos (CFM, CRO, COFEN, CRMV).',
  },
  {
    q: 'Qual a diferença entre jaleco feminino e masculino?',
    a: 'O jaleco feminino tem molde acinturado, ombros ajustados ao biótipo feminino e cava menor. O masculino tem ombros mais amplos, corte reto e cava maior para movimento de membros superiores. Marcas sérias têm grade e molde próprios para cada gênero — do PP ao G3 para feminino e do P ao G2 para masculino.',
  },
  {
    q: 'Jaleco branco é obrigatório para médicos e dentistas?',
    a: 'Não. Nem CFM, CRO nem COFEN definem cor obrigatória. O branco é o padrão histórico em hospitais e clínicas SUS, associado a higiene. Em consultórios privados, azul royal, preto, verde água, rosa e cinza são amplamente aceitos. Para uso hospitalar, confirme o protocolo da instituição antes de comprar.',
  },
  {
    q: 'Qual o melhor tecido para jaleco profissional que não amassa?',
    a: 'Gabardine poliéster/viscose com 4–6% de elastano (150–200 g/m²) é o padrão para uso clínico: leve, respirável, não amassa e suporta lavagem a 40–60°C por anos. Microfibra é mais econômica com resultado similar. Algodão puro é evitado — encolhe e perde caimento após lavagens frequentes. Para laboratório com exposição química, prefira gabardine 200+ g/m² ou tecido DWR.',
  },
  {
    q: 'Como escolher o modelo de jaleco certo para minha profissão?',
    a: 'Slim: corte ajustado com elastano, para consultório e clínica. Princesa: cava americana, leveza, bom para estética e fisioterapia. Profissional: ombros amplos, comprimento até o joelho, ideal para plantão e hospital. Elastex: elastano bidirecional, para quem trabalha 12h ou mais em movimento. Duquesa: alfaiataria premium para gestão clínica. Cada modelo existe em versão feminina e masculina.',
  },
  {
    q: 'Jaleco tem tamanho plus size até G3?',
    a: 'Sim. A Jaleca tem grade completa do PP ao G3 para feminino, com molde próprio por tamanho — não é só "mais tecido no M". Ombros, manga, busto e comprimento são recalculados para cada grade. Em dúvida entre dois tamanhos, escolha o maior: o jaleco não pode apertar nos ombros nem restringir o levantamento dos braços.',
  },
  {
    q: 'Quanto custa um jaleco profissional de qualidade?',
    a: 'Faixa justa: R$159 a R$349 para jaleco em gabardine com elastano, dependendo do modelo e tecido. Abaixo de R$120 normalmente é algodão puro ou tecido leve que dura poucos meses. Acima de R$400 entra alfaiataria premium. A Jaleca opera na faixa de equilíbrio — qualidade hospitalar com preço acessível.',
  },
  {
    q: 'Como lavar jaleco profissional para durar mais?',
    a: 'Lave a 40–60°C com sabão neutro, vire do avesso antes. Evite alvejante com cloro frequente (amarela o branco). Seque à sombra ou na secadora em temperatura baixa. Passe ferro morno se necessário — gabardine com elastano dispensa passagem na maioria dos casos. Para manchas de sangue ou iodo: água fria imediata antes de lavar.',
  },
  {
    q: 'Qual jaleco usar em residência médica ou plantão de 12h?',
    a: 'Residência exige peça resistente: lavagem 3–4x por semana, 12–24h de uso contínuo, contato com fluidos. Recomenda-se gabardine 165 g/m² com elastano e DWR (repele líquidos). Manga longa com elástico, dois bolsos amplos (celular, caneta, estetoscópio) e gola esporte. A maioria dos hospitais-escola exige jaleco branco.',
  },
  {
    q: 'Jaleco para dentista: qual modelo e tecido escolher?',
    a: 'Dentistas ficam curvados sobre a cadeira por horas, por isso elastano é indispensável. O modelo Slim ou Elastex com cava mais larga permite movimento dos ombros sem tensionar o tecido. Tecido DWR protege contra respingos de anestésico, água e sangue. Comprimento: curto (até o quadril) para maior mobilidade ou longo (até o joelho) para padrão clínico formal.',
  },
  {
    q: 'O que considerar na hora de comprar jaleco online?',
    a: 'Verifique: (1) grade completa com molde por gênero — não unissex; (2) composição do tecido — poliéster/viscose com elastano é o padrão; (3) política de troca — bons lojistas aceitam troca em até 7 dias; (4) avaliações reais no Google, não só no próprio site; (5) prazo de entrega — acima de 10 dias úteis é alto para Brasil. A Jaleca tem ⭐ 4.9 no Google e entrega em até 2 dias úteis.',
  },
  {
    q: 'Jaleco pode ser personalizado com nome bordado?',
    a: 'A Jaleca não oferece bordado — vende o jaleco sem personalização. Para bordar nome ou logotipo, leve a peça a uma bordadeira local após receber. É uma alternativa simples e acessível. Atenção: após o bordado, o jaleco não pode ser trocado.',
  },
  {
    q: 'Qual a diferença entre jaleco curto e longo?',
    a: 'Jaleco curto vai até o quadril — mais prático para procedimentos estéticos, fisioterapia e atendimentos que exigem agachamento. Jaleco longo vai até o joelho ou mais — padrão clínico formal, mais aceito em hospitais, consultórios médicos e odontológicos. Para plantão, o longo oferece mais proteção. Para estética e fisio, o curto dá mais mobilidade.',
  },
  {
    q: 'Jaleco com elastano faz diferença no dia a dia?',
    a: 'Faz diferença real. Jornadas de 8–12h em pé, curvado, subindo braços ou agachando exigem tecido que acompanha o movimento. O elastano (4–6% na composição) mantém o caimento depois que você se movimenta — sem puxar costura, sem apertar axila, sem vinco permanente. Para quem trabalha mais de 6h por dia, é indispensável.',
  },
  {
    q: 'Jaleco feminino pode ser usado por estudante de medicina?',
    a: 'Sim. Para estudantes, o recomendado é o modelo Slim básico em gabardine — durável, de preço justo e aceito nas faculdades. A maioria das faculdades exige jaleco branco, manga longa, comprimento até o joelho. Evite modelos muito "fashion" ou coloridos para aulas práticas e estágio hospitalar.',
  },
  {
    q: 'Quais são as cores de jaleco aceitas em hospitais?',
    a: 'A maioria dos hospitais públicos e conveniados ao SUS exige branco ou determina cor por categoria (ex.: azul para técnicos, verde para cirurgiões). Em hospitais privados a política varia — confirme com o RH ou chefia de serviço antes de comprar. Em consultório particular, há liberdade total de cor.',
  },
  {
    q: 'Como tirar as medidas para comprar jaleco no tamanho certo?',
    a: 'Meça: (1) Busto — fita passando pela parte mais larga do peito e costas; (2) Cintura — parte mais estreita do tronco; (3) Quadril — parte mais larga abaixo da cintura; (4) Comprimento de ombro a punho — com braço estendido. Compare com a tabela de medidas da marca. Em dúvida entre dois tamanhos, escolha o maior — o jaleco não pode apertar nos ombros.',
  },
  {
    q: 'Jaleco masculino tem os mesmos modelos que o feminino?',
    a: 'Os modelos existem em versão masculina e feminina, mas com moldes completamente diferentes. O jaleco masculino tem ombros mais amplos, tórax com corte reto, cava maior e comprimento proporcional à estatura masculina. Modelos como Slim, Profissional e Elastex existem para os dois gêneros — mas nunca compre o feminino para usar como masculino (e vice-versa) esperando que "fique bom".',
  },
  {
    q: 'Jaleco pode ser lavado na máquina?',
    a: 'Sim. Jaleco em gabardine poliéster/viscose com elastano pode ser lavado na máquina em ciclo delicado a 40–60°C. Vire do avesso antes de lavar para proteger a cor. Não use centrífuga em velocidade alta — deforma o elástico. Não use secadora em temperatura alta — contrai o tecido. Estenda imediatamente ao retirar da máquina para evitar vincos.',
  },
  {
    q: 'Onde comprar jaleco profissional com frete rápido e entrega garantida?',
    a: 'Na Jaleca, especializada em uniformes profissionais para saúde no Brasil. ⭐ 4.9 no Google, mais de 200 mil peças vendidas. Envio em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499. Troca em 7 dias por arrependimento (CDC). Acesse jaleca.com.br.',
  },
]

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Consultório / clínica',
    desc: 'Corte acinturado com elastano. Valoriza a silhueta sem apertar. Versão feminina com recortes laterais e pences; masculina com corte reto ajustado.',
  },
  {
    nome: 'Jaleco Princesa',
    perfil: 'Estética / fisioterapia',
    desc: 'Cava americana, manga leve, corte mais solto. Movimento amplo para procedimentos que exigem elevação dos braços.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Plantão / hospital',
    desc: 'Ombros estruturados, comprimento até o joelho. Cava folgada para RCP, exames e procedimentos longos.',
  },
  {
    nome: 'Jaleco Elastex',
    perfil: 'Trabalho intenso / plantão 12h',
    desc: 'Elastano bidirecional em todo o tecido — não amassa, seca rápido, acompanha qualquer movimento.',
  },
  {
    nome: 'Jaleco Duquesa',
    perfil: 'Gestão clínica / diretoria',
    desc: 'Alfaiataria premium com caimento estruturado. Para quem precisa transmitir autoridade sem abrir mão do conforto.',
  },
  {
    nome: 'Jaleco Plus Size',
    perfil: 'Grade até G3',
    desc: 'Molde próprio para grades maiores. Ombros recalculados, manga progressiva — não é só mais tecido no M.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
  { href: '/jaleco-branco', label: 'Jaleco Branco' },
  { href: '/jaleco-preto', label: 'Jaleco Preto' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-com-elastano', label: 'Jaleco com Elastano' },
  { href: '/jaleco-manga-curta-feminino', label: 'Jaleco Manga Curta' },
  { href: '/jaleco-medica', label: 'Jaleco para Médica' },
  { href: '/jaleco-medico', label: 'Jaleco para Médico' },
  { href: '/jaleco-dentista', label: 'Jaleco para Dentista' },
  { href: '/jaleco-enfermeira', label: 'Jaleco para Enfermeira' },
  { href: '/jaleco-enfermeiro', label: 'Jaleco para Enfermeiro' },
  { href: '/jaleco-fisioterapeuta', label: 'Jaleco para Fisioterapeuta' },
  { href: '/jaleco-esteticista', label: 'Jaleco para Esteticista' },
  { href: '/jaleco-nutricionista', label: 'Jaleco para Nutricionista' },
  { href: '/jaleco-farmaceutica', label: 'Jaleco para Farmacêutica' },
  { href: '/blog/jaleco-estudante-medicina', label: 'Jaleco para Estudante de Medicina' },
  { href: '/jaleco-universitario-feminino', label: 'Jaleco Universitário Feminino' },
  { href: '/blog/jaleco-slim-vs-jaleco-reto-diferencas', label: 'Slim vs Reto — diferenças' },
  { href: '/blog/jaleco-manga-curta-quando-usar-profissionais', label: 'Quando usar manga curta' },
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
    headline: 'Jaleco Profissional: Guia Completo — Feminino, Masculino, Slim, Branco e Colorido',
    description: 'Tudo sobre jaleco profissional: tecidos, modelos, tamanhos, cores e qual escolher para cada profissão da saúde.',
    author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
    publisher: {
      '@type': 'Organization',
      name: 'Jaleca',
      logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 },
    },
    url: 'https://jaleca.com.br/jaleco',
    datePublished: '2026-05-16',
    dateModified: '2026-05-16',
  }

  const schemaAggregateRating = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '64',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco', item: 'https://jaleca.com.br/jaleco' },
    ],
  }

  const modelosItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Modelos de Jaleco Profissional',
    url: 'https://jaleca.com.br/jaleco',
    numberOfItems: 6,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Jaleco Slim Feminino', url: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Slim Masculino', url: 'https://jaleca.com.br/jaleco-masculino' },
      { '@type': 'ListItem', position: 3, name: 'Jaleco Princesa', url: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 4, name: 'Jaleco Elastex', url: 'https://jaleca.com.br/jaleco-com-elastano' },
      { '@type': 'ListItem', position: 5, name: 'Jaleco Duquesa', url: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 6, name: 'Jaleco Plus Size', url: 'https://jaleca.com.br/jaleco-plus-size' },
    ],
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como escolher o jaleco profissional ideal',
    description: 'Guia passo a passo para escolher jaleco por gênero, modelo, tecido e tamanho.',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Defina o gênero', text: 'Escolha jaleco feminino (molde acinturado, PP ao G3) ou masculino (corte reto amplo). Nunca use unissex.' },
      { '@type': 'HowToStep', position: 2, name: 'Escolha o modelo', text: 'Slim para consultório, Profissional para plantão, Elastex para jornadas longas, Duquesa para gestão.' },
      { '@type': 'HowToStep', position: 3, name: 'Selecione o tecido', text: 'Gabardine com elastano 150-165 g/m² para uso clínico diário. DWR para exposição a líquidos.' },
      { '@type': 'HowToStep', position: 4, name: 'Confirme o tamanho', text: 'Meça busto, cintura e quadril. Compare com a tabela da marca. Em dúvida, escolha o maior.' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAggregateRating).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(modelosItemListSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Produtos', href: '/produtos' },
              { label: 'Jaleco', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── ① HERO COMMERCIAL ── */}
        <HeroCommercial
          eyebrow="Jaleca · Uniformes profissionais femininos e masculinos"
          h1Line1="Jaleco Profissional"
          h1Line2="Feminino e Masculino"
          description="Slim, Princesa, Elastex e Duquesa. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio — feminino e masculino com cortes distintos."
          startingPrice="R$159"
          comparePrice="R$199"
          collectionHref="#colecao"
          allHref="/produtos"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── ③ PRODUTOS FEMININOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Profissionais"
            collectionLabel="Coleção Feminina"
            productLabel="Jalecos Femininos"
            allHref="/jaleco-feminino"
          />
        </div>

        {/* ── ④ PRODUTOS MASCULINOS ── */}
        <div style={{ borderTop: '1px solid #f0ece5' }}>
          <ProfessionProductGrid
            professionKey="medico"
            professionLabel="Profissionais"
            collectionLabel="Coleção Masculina"
            productLabel="Jalecos Masculinos"
            allHref="/jaleco-masculino"
          />
        </div>

        {/* ── ⑤ GOOGLE 4.9★ ── */}
        <GoogleRatingCarousel rating={placeData?.rating ?? 4.9} />

        {/* ── ⑥ MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Qual modelo é o seu?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Modelos de jaleco — quando usar cada um</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))', gap: '0.75rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.5rem' }}>
                  <span style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '0.4rem' }}>{m.perfil}</span>
                  <strong style={{ display: 'block', fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.4rem' }}>{m.nome}</strong>
                  <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ⑦ UGC CAROUSEL ── */}
        <section className="py-4 px-4"><div className="container"><UGCSection /></div></section>

        {/* ── ⑧ FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco profissional
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <FabricGuideCards />
          </div>
        </section>

        {/* ── ⑨ COMO ESCOLHER ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Guia de compra</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Como escolher o jaleco ideal
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Um bom jaleco profissional começa pelo molde: feminino e masculino têm cortes totalmente diferentes e nunca devem ser intercambiados.
              Depois vêm modelo, tecido e tamanho — cada variável impacta o conforto, a durabilidade e a adequação à rotina de trabalho.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              1. Gênero: moldes distintos fazem toda a diferença
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              O <Link href="/jaleco-feminino" style={{ color: '#c8a96e' }}>jaleco feminino</Link> tem ombros estreitos, cava ajustada e corte acinturado — em modelos como o Slim, pences nas costas criam caimento próximo ao corpo.
              O <Link href="/jaleco-masculino" style={{ color: '#c8a96e' }}>jaleco masculino</Link> tem ombros estruturados, tórax reto e cava mais ampla para movimento dos braços.
              Usar o molde errado para o gênero gera desconforto imediato no ombro e na axila.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              2. Modelo: para cada rotina, um jaleco diferente
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              O Slim funciona em consultório com atendimentos sentado ou em pé — valoriza a silhueta sem restringir.
              Para quem fica muito curvado (dentistas, fisioterapeutas), o Elastex com elastano bidirecional elimina a tensão no dorso.
              Em plantão de hospital, o modelo Profissional com comprimento até o joelho é o mais aceito.
              Para gestores e diretores clínicos, o Duquesa em alfaiataria premium transmite autoridade.
              Veja também o <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link> para entender as variações de composição.
            </p>

            <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              3. Tecido e tamanho: os dois fatores mais decisivos
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Para uso clínico diário, gabardine poliéster/viscose com 4–6% de elastano (150–165 g/m²) é o padrão: não amassa, não encolhe, lava bem.
              Para laboratório ou procedimentos com respingos, prefira DWR ou gramatura maior (200+ g/m²).
              Para tamanho: o <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link> da Jaleca vai do G1 ao G3 com molde próprio — ombro recalculado, manga progressiva.
              Em clima quente, o <Link href="/jaleco-manga-curta-feminino" style={{ color: '#c8a96e' }}>jaleco manga curta</Link> é alternativa válida onde não há exigência de manga longa.
            </p>
          </div>
        </section>

        {/* ── ⑩ JALECO POR PROFISSÃO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Por profissão</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Jaleco para cada profissão
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '1rem' }}>
              Cada área da saúde tem uma rotina diferente — e isso muda diretamente o jaleco mais adequado.
              Gramatura, comprimento, manga e tipo de elastano impactam o conforto ao longo de uma jornada de 8 a 12 horas.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              Em consultório médico, o <Link href="/jaleco-medica" style={{ color: '#c8a96e' }}>jaleco para médica</Link> e o <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>jaleco para médico</Link> em gabardine 165 g/m² com manga longa são os mais aceitos pelo CFM e pelas instituições. Para residência médica, adicione tecido DWR para resistir a fluidos.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              Em odontologia, o <Link href="/jaleco-dentista" style={{ color: '#c8a96e' }}>jaleco para dentista</Link> exige elastano amplo na cava — o profissional passa horas em posição curvada. Tecido DWR protege contra respingos.
              Para enfermagem, o <Link href="/jaleco-enfermeira" style={{ color: '#c8a96e' }}>jaleco para enfermeira</Link> e o <Link href="/jaleco-enfermeiro" style={{ color: '#c8a96e' }}>jaleco para enfermeiro</Link> precisam resistir a lavagens a 60°C frequentes conforme as normas Cofen.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Em estética, veterinária e farmácia, o jaleco assume papel mais comercial e aceita cores além do branco.
              O <Link href="/jaleco-esteticista" style={{ color: '#c8a96e' }}>jaleco para esteticista</Link> com DWR, o <Link href="/jaleco-veterinaria" style={{ color: '#c8a96e' }}>jaleco para veterinária</Link> resistente e o
              {' '}<Link href="/jaleco-farmaceutica" style={{ color: '#c8a96e' }}>jaleco para farmacêutica</Link> têm características próprias — veja cada guia.
            </p>
          </div>
        </section>

        {/* ── ⑪ LINKS INTERNOS ── */}
        <ProfessionLinksNeutral
          title="Explore por profissão ou modelo"
          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}
        />

        {/* ── ⑫ CATEGORIAS RELACIONADAS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Explore mais</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1rem' }}>
              Modelos e categorias relacionadas
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#4a4a4a', lineHeight: 1.8, marginBottom: 0 }}>
              Veja também:{' '}
              <Link href="/jaleco-feminino" style={{ color: '#c8a96e' }}>jaleco feminino</Link>,{' '}
              <Link href="/jaleco-masculino" style={{ color: '#c8a96e' }}>jaleco masculino</Link>,{' '}
              <Link href="/jaleco-branco" style={{ color: '#c8a96e' }}>jaleco branco</Link>,{' '}
              <Link href="/jaleco-preto" style={{ color: '#c8a96e' }}>jaleco preto</Link>,{' '}
              <Link href="/jaleco-azul-marinho" style={{ color: '#c8a96e' }}>jaleco azul marinho</Link>,{' '}
              <Link href="/jaleco-colorido" style={{ color: '#c8a96e' }}>jaleco colorido</Link>,{' '}
              <Link href="/jaleco-plus-size" style={{ color: '#c8a96e' }}>jaleco plus size</Link>,{' '}
              <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>jaleco com elastano</Link>,{' '}
              <Link href="/jaleco-manga-curta-feminino" style={{ color: '#c8a96e' }}>jaleco manga curta feminino</Link>,{' '}
              <Link href="/jaleco-universitario-feminino" style={{ color: '#c8a96e' }}>jaleco universitário feminino</Link>,{' '}
              <Link href="/jaleco-premium" style={{ color: '#c8a96e' }}>jaleco premium</Link>,{' '}
              <Link href="/jalecos-femininos" style={{ color: '#c8a96e' }}>jalecos femininos</Link>,{' '}
              <Link href="/jaleco-elegante" style={{ color: '#c8a96e' }}>jaleco elegante</Link> e{' '}
              <Link href="/jaleco-estiloso" style={{ color: '#c8a96e' }}>jaleco estiloso</Link>.
            </p>
          </div>
        </section>

        {/* ── ⑬ CTA FINAL DARK ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Encontre seu jaleco ideal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · Feminino e masculino · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/jaleco-feminino"
                style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                Jaleco feminino →
              </Link>
              <Link
                href="/jaleco-masculino"
                style={{ display: 'inline-block', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '1rem 2.25rem', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
              >
                Jaleco masculino →
              </Link>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '1.25rem' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>

      </main>
    </>
  )
}
