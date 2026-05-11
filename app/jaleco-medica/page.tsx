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
    { '@type': 'Question', name: 'Qual comprimento de jaleco é mais indicado para médicas?', acceptedAnswer: { '@type': 'Answer', text: 'Para medicina, o jaleco médio a longo — hospitais e consultórios preferem modelos mais longos para maior cobertura.' } },
    { '@type': 'Question', name: 'O jaleco pode ser lavado com água quente?', acceptedAnswer: { '@type': 'Answer', text: 'Os jalecos Jaleca suportam lavagem até 60°C, temperatura suficiente para higienização clínica. Use alvejante sem cloro para preservar o tecido.' } },
    { '@type': 'Question', name: 'Jaleco com elastano é bom para médica?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. O elastano adiciona memória ao tecido, retornando à forma após o movimento — essencial para quem passa horas em atendimento.' } },
    { '@type': 'Question', name: 'Jaleco de médica precisa ser branco?', acceptedAnswer: { '@type': 'Answer', text: 'Não é obrigação. O branco é o clássico, mas tons pastel e cores discretas são bem aceitos. O CRM não restringe a cor.' } },
    { '@type': 'Question', name: 'Qual a diferença entre jaleco Slim e Profissional?', acceptedAnswer: { '@type': 'Answer', text: 'O Slim tem corte ajustado ao corpo, ideal para quem quer visual mais moderno. O Profissional tem corte mais amplo e estruturado, com mais espaço para movimento.' } },
    { '@type': 'Question', name: 'A Jaleca borda o nome e CRM no jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'Não. A Jaleca não oferece serviço de bordado. O jaleco é vendido sem bordado. Você pode levar a peça a uma bordadeira local após o recebimento. Importante: após o bordado, o jaleco não pode mais ser trocado.' } },
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
