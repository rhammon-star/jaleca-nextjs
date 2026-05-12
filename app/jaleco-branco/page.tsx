import type { Metadata } from 'next'
import Link from 'next/link'
import { getGooglePlaceData } from '@/lib/google-places'
import CategoryProductGrid from '@/components/CategoryProductGrid'
import UGCSection from '@/components/UGCSection'
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import StickyMobileCTA from '@/components/profession-lp/StickyMobileCTA'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import { buildHowToSchema, buildOccupationSchema, buildItemListSchema, buildProductListSchema, buildReviewSchema} from '@/lib/profession-schemas'

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
    q: "Qual o tecido mais indicado para um jaleco branco que não amarela?",
    a: "Para manter o branco impecável, recomendamos tecidos de gabardine ou microfibra de alta qualidade, que são resistentes ao amarelamento e fáceis de branquear.",
  },
  {
    q: "O jaleco branco é exigido por regulamentação em alguma profissão?",
    a: "Sim, para médicos, o Conselho Federal de Medicina (CFM) exige o uso do jaleco branco em ambientes clínicos e hospitalares, sendo um padrão de higiene e ética.",
  },
  {
    q: "O corte do jaleco branco é adaptável a diferentes tipos de corpo e profissões?",
    a: "Nosso corte clássico é versátil, adaptando-se confortavelmente a diferentes biotipos e permitindo a mobilidade necessária para diversas profissões da saúde e além.",
  },
  {
    q: "Posso bordar meu nome e a especialidade no jaleco branco?",
    a: "Com certeza! O bordado do seu nome e da sua especialidade no jaleco branco é um toque de profissionalismo essencial, reforçando sua identificação no ambiente de trabalho.",
  },
  {
    q: "Este jaleco branco é adequado para múltiplas profissões, além da área da saúde?",
    a: "Sim, o jaleco branco é sinônimo de higiene e profissionalismo, sendo ideal para laboratórios, clínicas de estética, gastronomia e diversas outras áreas que exigem asseio.",
  },
  {
    q: "Qual a durabilidade esperada para um jaleco branco Jaleca, considerando as lavagens?",
    a: "Nossos jalecos brancos são feitos para serem altamente duráveis, suportando as frequentes lavagens necessárias para manter a higiene sem perder a qualidade do tecido.",
  },
  {
    q: "Como manter o branco impecável do jaleco?",
    a: "Lave-o separadamente com água fria e sabão para roupas brancas. Use alvejante sem cloro se necessário e seque à sombra para evitar o amarelamento.",
  },
  {
    q: "O jaleco branco oferece a mesma versatilidade que um jaleco colorido?",
    a: "Em termos de aplicação profissional, o jaleco branco é incomparável em sua versatilidade e reconhecimento, sendo o padrão de higiene e seriedade em diversas áreas.",
  },
  {
    q: "Os tamanhos de jaleco branco abrangem do PP ao G3?",
    a: "Sim, nossa grade de tamanhos, do PP ao G3, garante que todos encontrem um jaleco branco com o ajuste perfeito, proporcionando conforto e um visual impecável.",
  },
  {
    q: "Os bolsos do jaleco branco são práticos para o dia a dia profissional?",
    a: "Sim, ele possui bolsos estrategicamente posicionados, ideais para guardar instrumentos, canetas ou outros itens essenciais, mantendo tudo organizado e acessível.",
  },
  {
    q: "O comprimento do jaleco branco é padrão e atende às exigências profissionais?",
    a: "O comprimento clássico do nosso jaleco branco atende às normas da maioria das profissões, oferecendo cobertura e autoridade adequadas ao ambiente de trabalho.",
  },
  {
    q: "O jaleco branco está disponível apenas em manga longa?",
    a: "Priorizamos a manga longa, que é o padrão exigido e mais protetor em ambientes profissionais, mas também oferecemos opções de manga ¾ para maior versatilidade.",
  },
  {
    q: "O estilo profissional do jaleco branco transmite autoridade e seriedade?",
    a: "Com um estilo clássico e elegante, nosso jaleco branco transmite autoridade, seriedade e confiança, características valorizadas em qualquer ambiente profissional.",
  },
  {
    q: "Os jalecos brancos Jaleca são mais fáceis de manter limpos e brancos do que os da concorrência?",
    a: "Nossos tecidos de alta qualidade são tratados para facilitar a remoção de manchas e manter o branco por mais tempo, superando a maioria dos produtos no mercado.",
  },
  {
    q: "Qual o preço de partida para um jaleco branco de qualidade?",
    a: "Você pode adquirir um jaleco branco profissional de alta qualidade a partir de R$159, um investimento essencial em sua imagem e credibilidade.",
  },
  {
    q: "Qual o prazo de entrega para jalecos brancos?",
    a: "Seu jaleco branco será entregue em 3 a 8 dias úteis, para que você possa iniciar seu trabalho com profissionalismo e higiene rapidamente.",
  },
  {
    q: "Posso trocar o jaleco branco se ele não servir corretamente?",
    a: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não estejam perfeitos para você.",
  },
  {
    q: "Há frete grátis para compras de jalecos brancos acima de R$499 em SP/RJ/MG/ES?",
    a: "Sim, oferecemos frete grátis para pedidos de jalecos brancos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo.",
  },
  {
    q: "Os jalecos brancos da Jaleca possuem garantia?",
    a: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e a sua total confiança na compra.",
  },
  {
    q: "O tecido do jaleco branco é confortável para o uso durante todo o dia?",
    a: "Sim, priorizamos tecidos leves e respiráveis que garantem conforto térmico, mantendo você fresco e confortável, mesmo durante longas horas de trabalho.",
  }
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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'],
    },
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
      {(() => { const s = buildHowToSchema('jaleco-branco', 'https://jaleca.com.br/jaleco-branco'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildOccupationSchema('jaleco-branco', 'https://jaleca.com.br/jaleco-branco'); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const s = buildItemListSchema([], 'https://jaleca.com.br/jaleco-branco', "Jalecos para branco"); return s ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} /> : null })()}
      {(() => { const arr = buildProductListSchema([], 'https://jaleca.com.br/jaleco-branco'); return arr ? arr.map((s, i) => <script key={'p'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      {(() => { const arr = buildReviewSchema(placeData?.reviews, 'https://jaleca.com.br/jaleco-branco', "Jaleco para branco"); return arr ? arr.map((s, i) => <script key={'r'+i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s).replace(/</g, '\\u003c') }} />) : null })()}
      <meta name="ai-content-declaration" content="human-authored-with-ai-assistance" />

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
        <HeroCommercial
          eyebrow="Para profissionais de saúde"
          h1Line1="Jaleco branco:"
          h1Line2="impecável no primeiro dia, e no centésimo"
          description="Para médicos, enfermeiros, dentistas e todos que usam branco como padrão. Tecido que aguenta lavagem frequente sem amarelar, com elastano para não apertar no plantão."
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"
          googleRating={placeData?.rating}
        />


        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />
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

            
        {/* ── GOOGLE RATING ── */}
        <GoogleRatingCarousel rating={placeData?.rating} />

        <UGCSection />


      <StickyMobileCTA href="#produtos" startingPrice="R$220" label="Ver coleção" />

    </main>
    </>
  )
}
