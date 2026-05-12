import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import ProfessionProductGrid from '@/components/ProfessionProductGrid'
import { getVerMaisUrl } from '@/lib/product-professions'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: 'Jaleco para Médica: SLIM, Princesa e Elastex | Jaleca' },
  description: 'Jaleco feminino para médica com corte acinturado, tecido Elastex e modelagem própria. Branco, preto e colorido. PP ao G3. Normas do CFM. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-medica' },
  openGraph: {
    title: 'Jaleco para Médico | Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Qual jaleco usar na medicina? Jaleco premium com elastano, caimento impecável e preço justo. Do PP ao G3. Frete grátis.',
    url: 'https://jaleca.com.br/jaleco-medica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaleco para Médico | Tecido Premium, Caimento Perfeito — Jaleca',
    description: 'Jaleco premium para médico. Tecido de qualidade, caimento perfeito, preço justo. Do PP ao G3.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  mainEntity: [
    { '@type': 'Question', name: "Quais os modelos de jalecos femininos mais indicados para quem busca um caimento elegante e acinturado?", acceptedAnswer: { '@type': 'Answer', text: "Nossos modelos acinturados com pences frontais e traseiras são ideais para realçar a silhueta feminina, oferecendo um visual sofisticado e profissional." } },
    { '@type': 'Question', name: "Os jalecos femininos são desenhados para acomodar o uso de uniformes por baixo, sem adicionar volume excessivo?", acceptedAnswer: { '@type': 'Answer', text: "Sim, projetamos nossos jalecos femininos para terem um caimento perfeito sobre outros uniformes, garantindo conforto e uma aparência profissional sem ficar apertado ou volumoso." } },
    { '@type': 'Question', name: "Existe uma gama de cores para jalecos femininos além do branco que sejam aceitáveis em ambientes clínicos?", acceptedAnswer: { '@type': 'Answer', text: "Além do branco tradicional, oferecemos opções em tons pastel e cores sólidas discretas como azul claro, rosa seco ou cinza, que são aceitos em clínicas pediátricas ou estéticas, sempre verificando a política local." } },
    { '@type': 'Question', name: "Como garantir que o jaleco feminino permaneça impecável e sem amassados durante um dia de trabalho longo ou plantão?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos tecidos com elastano ou de alta tecnologia que amassam menos e possuem maior resiliência, mantendo a aparência alinhada por mais tempo." } },
    { '@type': 'Question', name: "Qual a diferença entre um jaleco slim fit e um corte tradicional para médicas?", acceptedAnswer: { '@type': 'Answer', text: "O slim fit oferece um corte mais ajustado ao corpo, ideal para um visual moderno e elegante, enquanto o corte tradicional proporciona maior folga e conforto para quem prefere mais liberdade de movimento." } },
    { '@type': 'Question', name: "É possível bordar o logo da clínica e o nome da médica no jaleco feminino?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos serviços de bordado para personalizar seu jaleco com o logo da clínica, seu nome e CRM, adicionando um toque de exclusividade e profissionalismo." } },
    { '@type': 'Question', name: "Que tipo de gola é mais popular em jalecos femininos, a clássica ou a gola padre?", acceptedAnswer: { '@type': 'Answer', text: "Ambas são populares. A gola clássica é atemporal, enquanto a gola padre oferece um toque moderno e minimalista, sendo uma questão de preferência pessoal e estilo." } },
    { '@type': 'Question', name: "Os bolsos dos jalecos femininos são desenhados para serem funcionais sem comprometer a estética?", acceptedAnswer: { '@type': 'Answer', text: "Sim, nossos bolsos são projetados para serem práticos e discretos, permitindo guardar itens essenciais sem criar volume indesejado, mantendo a linha elegante do jaleco." } },
    { '@type': 'Question', name: "Qual o comprimento de jaleco feminino mais procurado para médicas que buscam praticidade e estilo?", acceptedAnswer: { '@type': 'Answer', text: "O comprimento na altura do quadril ou levemente abaixo é bastante popular, pois oferece cobertura adequada e facilita a movimentação, sem prejudicar a agilidade." } },
    { '@type': 'Question', name: "Como escolher o tecido ideal para um jaleco feminino que seja fácil de lavar e não desbote?", acceptedAnswer: { '@type': 'Answer', text: "Opte por tecidos como Gabardine Premium ou microfibra com tratamento especial, que são resistentes ao desbotamento e fáceis de cuidar, mantendo a cor viva por mais tempo." } },
    { '@type': 'Question', name: "Há jalecos femininos com mangas ¾ para quem prefere mais liberdade nos braços ou trabalha em ambientes quentes?", acceptedAnswer: { '@type': 'Answer', text: "Sim, temos modelos com manga ¾ que são práticos e confortáveis, ideais para quem busca um meio termo entre a manga longa e a manga curta, ou trabalha em climas mais quentes." } },
    { '@type': 'Question', name: "Qual a política de garantia para jalecos femininos em caso de defeito de fabricação?", acceptedAnswer: { '@type': 'Answer', text: "Todos os nossos produtos possuem garantia contra defeitos de fabricação. Entre em contato com nosso SAC e avaliaremos seu caso para uma solução rápida e eficiente." } },
    { '@type': 'Question', name: "Os botões dos jalecos femininos são discretos e seguros para evitar abertura acidental?", acceptedAnswer: { '@type': 'Answer', text: "Utilizamos botões de alta qualidade, bem costurados e discretos, que proporcionam um fechamento seguro e complementam a estética elegante do jaleco feminino." } },
    { '@type': 'Question', name: "Há opções de jalecos femininos com zíper, para quem busca uma alternativa aos botões?", acceptedAnswer: { '@type': 'Answer', text: "Sim, oferecemos modelos com fechamento em zíper invisível ou aparente, que proporcionam um visual moderno e prático, facilitando o vestir e despir." } },
    { '@type': 'Question', name: "Como escolher o tamanho correto do jaleco feminino para uma silhueta que varia entre dois tamanhos?", acceptedAnswer: { '@type': 'Answer', text: "Recomendamos priorizar a medida do busto e ombros. Se as medidas estiverem entre dois tamanhos, opte pelo maior para garantir conforto e mobilidade." } },
    { '@type': 'Question', name: "Os jalecos femininos com detalhes coloridos são uma tendência aceita na área médica?", acceptedAnswer: { '@type': 'Answer', text: "Detalhes discretos como golas e punhos coloridos são uma tendência crescente, especialmente em clínicas particulares ou especialidades como pediatria e dermatologia, adicionando um toque de personalidade." } },
    { '@type': 'Question', name: "Qual o custo de envio para jalecos femininos para diferentes regiões do Brasil?", acceptedAnswer: { '@type': 'Answer', text: "O valor do frete é calculado no momento da compra, com base no CEP de entrega e modalidade escolhida, com opções que variam de econômicas a expressas." } },
    { '@type': 'Question', name: "Existe alguma linha de jalecos femininos que se adapta melhor a médicas gestantes?", acceptedAnswer: { '@type': 'Answer', text: "Sim, dispomos de modelos com cortes mais amplos ou com ajustes laterais que se adaptam confortavelmente à gestação, garantindo que a futura mamãe permaneça profissional e confortável." } },
    { '@type': 'Question', name: "Os tecidos dos jalecos femininos são hipoalergênicos e adequados para peles sensíveis?", acceptedAnswer: { '@type': 'Answer', text: "Priorizamos tecidos de alta qualidade, muitos deles com composição que minimiza reações alérgicas, sendo suaves ao toque e adequados para peles sensíveis." } },
    { '@type': 'Question', name: "Quais os cuidados especiais para lavar jalecos femininos com detalhes bordados ou apliques?", acceptedAnswer: { '@type': 'Answer', text: "Recomenda-se lavar à mão ou em ciclo delicado na máquina, com água fria e sabão neutro. Virar a peça do avesso antes da lavagem ajuda a proteger bordados e apliques." } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Médica: Tecido Premium, Caimento Perfeito',
  description: 'Guia completo do jaleco para médica: tecido premium, caimento perfeito, modelo Slim vs Profissional e custo-benefício.',
  inLanguage: 'pt-BR',
  author: {
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  },
  url: 'https://jaleca.com.br/jaleco-medica',
  datePublished: '2026-04-18',
  dateModified: '2026-04-21',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Médica', item: 'https://jaleca.com.br/jaleco-medica' },
  ],
}

const MODELOS = [
  {
    nome: 'Jaleco Slim',
    perfil: 'Para quem quer corte valorizado',
    desc: 'Recortes laterais que seguem a silhueta. Visual elegante sem perder mobilidade em 12h de plantão.',
  },
  {
    nome: 'Jaleco Profissional',
    perfil: 'Para quem prefere mais amplitude',
    desc: 'Corte mais amplo e estruturado. Maior liberdade de movimento. Escolha clássica para qualquer rotina clínica.',
  },
  {
    nome: 'Jaleco Elastex',
    perfil: 'Para quem precisa de praticidade',
    desc: 'Fechamento em elástico — veste e tira rápido. Popular em clínicas com trocas frequentes no plantão.',
  },
  {
    nome: 'Plus Size (até G3)',
    perfil: 'Para todos os corpos',
    desc: 'Molde próprio para grades maiores. Ombros e manga recalculados para manter o caimento do PP ao G3.',
  },
]

const INTERNAL_LINKS = [
  { href: '/jaleco-feminino', label: 'Jaleco Feminino' },
  { href: '/jaleco-dentista-feminino', label: 'Jaleco para Dentista' },
  { href: '/jaleco-feminino-branco', label: 'Jaleco Branco' },
  { href: '/jaleco-feminino-acinturado', label: 'Jaleco Acinturado' },
  { href: '/blog/jaleco-para-medica-guia-completo', label: 'Guia Jaleco Médica' },
  { href: '/blog/jaleco-para-enfermeira-regras-cofen', label: 'Jaleco para Enfermeira' },
  { href: '/jaleco-plus-size', label: 'Jaleco Plus Size' },
  { href: '/jaleco-masculino', label: 'Jaleco Masculino' },
]

export default async function Page() {
  const placeData = await getGooglePlaceData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      {(() => { const s = buildHowToSchema('jaleco-medica', 'https://jaleca.com.br/jaleco-medica'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-medica', 'https://jaleca.com.br/jaleco-medica'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema([], 'https://jaleca.com.br/jaleco-medica', "Jalecos para medica"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema([], 'https://jaleca.com.br/jaleco-medica'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-medica', "Jaleco para medica"); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Para Médica', href: null },
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
          eyebrow="Jaleca · Para médicas"
          h1Line1="Jaleco para Médica"
          h1Line2="Presença que inspira confiança"
          description="Modelagem slim com elastano para jornadas de 12h. Conforto e autoridade desde o primeiro olhar. Do PP ao G3."
          startingPrice="R$189"
          collectionHref="#colecao"
          allHref={getVerMaisUrl('medica')}
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── ③ PRODUTOS ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Médicas"
            collectionLabel="Coleção Médica"
            productLabel="Jalecos"
            allHref={getVerMaisUrl('medica')}
          />
        </div>

        {/* ── ④ GOOGLE 4.9★ + DEPOIMENTOS ── */}
        <GoogleRatingCarousel rating={placeData?.rating ?? 4.9} />

        {/* ── ⑤ INSTAGRAM ── */}
        <InstagramLazy />

        {/* ── ⑥ MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Qual modelo é o seu?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Conheça cada modelo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: '0.75rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.25rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.2rem' }}>{m.nome}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#c8a96e', marginBottom: '0.35rem' }}>{m.perfil}</span>
                  <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ⑦ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco para médica
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {schemaFaq.mainEntity.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.name}
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
            <FabricGuideCards />
          </div>
        </section>

        {/* ── ⑧ LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS}
        />

        {/* ── ⑨ CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              12h de plantão sem desconforto
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · Elastano · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href={getVerMaisUrl('medica')}
              style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '0.75rem' }}
            >
              Ver todos os modelos →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>
      </main>
    </>
  )
}
