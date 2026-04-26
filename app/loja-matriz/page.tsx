import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Phone, Mail, Users } from 'lucide-react'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nossa Loja — Ipatinga, MG',
  description: 'Conheça a loja Jaleca em Ipatinga, MG. Av. Castelo Branco, 391 - Loja B, Horto. Experimente jalecos e uniformes profissionais com atendimento especializado.',
  alternates: { canonical: 'https://jaleca.com.br/loja-matriz' },
  openGraph: {
    title: 'Nossa Loja — Jaleca',
    description: 'Conheça nossa loja em Ipatinga, MG. Av. Castelo Branco, 391 - Loja B, Horto. Atendimento personalizado e toda a coleção de jalecos.',
    url: 'https://jaleca.com.br/loja-matriz',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/loja-fachada-noite.jpg', width: 1200, height: 630, alt: 'Fachada da Loja Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nossa Loja — Jaleca | Ipatinga, MG',
    description: 'Conheça nossa loja em Ipatinga, MG. Av. Castelo Branco, 391 - Loja B, Horto.',
    images: ['https://jaleca.com.br/loja-fachada-noite.jpg'],
  },
}

const FAQ_ITEMS = [
  {
    q: 'Qual o endereço da loja Jaleca em Ipatinga?',
    a: 'Av. Castelo Branco, 391 - Loja B, Horto. Ipatinga — MG, CEP 35160-264. A loja fica no coração do bairro Horto, em ponto de fácil acesso com estacionamento nas proximidades.',
  },
  {
    q: 'Qual o horário de funcionamento da loja matriz?',
    a: 'De segunda a sexta: 09h às 18h. Sábado: 09h às 12h. Domingo e feriados: fechada. O horário de sábado pode sofrer alteração em vésperas de feriados prolongados — confirme pelo WhatsApp antes de visitar.',
  },
  {
    q: 'Como chegar na loja Jaleca?',
    a: 'A loja fica na Av. Castelo Branco, próximo ao Fórum de Ipatinga e ao Hospital Municipal. Se vier de carro, há estacionamento público na rua paralela (Rua das Palmeiras) a 2 minutos a pé. De ônibus: linhaCircular / Horto — desça no ponto da Av. Castelo Branco em frente ao fórum.',
  },
  {
    q: 'Tem estacionamento perto da loja?',
    a: 'Sim. Na rua paralela (Rua das Palmeiras) há estacionamento público gratuito. Na Av. Castelo Branco, as vagas são da via pública — respeite a sinalização. A equipe da loja pode indicar os melhores pontos de estacionamento nas proximidades.',
  },
  {
    q: 'Posso experimentar os jalecos na loja antes de comprar online?',
    a: 'Sim, e é justamente para isso que existimos. Você pode vestir, comparar tamanhos e receber orientação de atendimento personalizado. Os tamanhos disponíveis para prova são do PP ao G3, nos principais modelos da coleção.',
  },
  {
    q: 'Qual o prazo de entrega para compras feitas na loja?',
    a: 'Para clientes que visitam a loja: o pedido pode ser enviado no mesmo dia se feito até 14h (dias úteis). O prazo de entrega segue o cálculo padrão do carrinho — PAC (grátis acima de R$499 para SP, RJ, MG e ES) ou SEDEX expresso.',
  },
  {
    q: 'A loja matriz oferece serviço de bordado?',
    a: 'Sim. Na própria loja é possível solicitar bordado de nome, registro profissional (CRM, CRO, COFEN) e logo de clínica. O prazo adicional é de 3 a 5 dias úteis. Consulte valores no ato do pedido.',
  },
  {
    q: 'A Jaleca tem outras lojas físicas além da matriz?',
    a: 'A matriz em Ipatinga é a loja física principal, aberta desde 2010. Estamos em expansão com projeto de franquias para outras cidades — consulte disponibilidade pelo WhatsApp.',
  },
]

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Jaleca — Jalecos e Mimos',
  description: 'Loja especializada em jalecos e uniformes profissionais para área da saúde.',
  url: 'https://jaleca.com.br',
  telephone: '+55-31-3367-2467',
  email: 'contato@jaleca.com.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Castelo Branco, 391 - Loja B',
    addressLocality: 'Ipatinga',
    addressRegion: 'MG',
    postalCode: '35160-264',
    addressCountry: 'BR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '12:00',
    },
  ],
  image: 'https://jaleca.com.br/loja-fachada-noite.jpg',
}

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
  headline: 'Jaleca: Lojas Físicas Desde 2010 e Mais de 200 Mil Peças Vendidas',
  description: 'Conheça a Jaleca — loja especializada em jalecos e uniformes profissionais. Matriz em Ipatinga, MG, desde 2010. Mais de 200mil peças vendidas em todo o Brasil.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/loja-matriz',
  datePublished: '2026-04-01',
  dateModified: '2026-04-24',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Nossa Loja', item: 'https://jaleca.com.br/loja-matriz' },
  ],
}

export default function LojaMatrizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <main>

        {/* Breadcrumb */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Nossa Loja', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* Hero — fachada */}
        <section className="relative w-full overflow-hidden bg-[#1a1a1a]" style={{ height: '88vh', minHeight: 560 }}>
          <Image
            src="/loja-fachada-noite.jpg"
            alt="Fachada da Loja Jaleca — 391B"
            fill
            className="object-cover opacity-80"
            priority
            loading="eager"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <p className="text-[11px] font-semibold tracking-[0.4em] uppercase text-[#c4a97d] mb-3">
              Nossa Loja Física
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-2">
              Loja Matriz
            </h1>
            <p className="text-white/70 text-base md:text-lg">
              Venha nos visitar e experimente nossa coleção pessoalmente.
            </p>
          </div>
        </section>

        {/* Info rápida */}
        <section className="bg-[#faf9f7] border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                { icon: Clock, label: 'Seg – Sex', value: '09h às 18h' },
                { icon: Clock, label: 'Sábados', value: '09h às 12h' },
                { icon: Users, label: 'Atendimento', value: 'Especializado' },
                { icon: MapPin, label: 'Localização', value: 'Ipatinga, MG' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center justify-center py-6 px-4 text-center gap-1">
                  <item.icon size={18} className="text-[#c4a97d] mb-1" />
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galeria + Texto */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

              {/* Fotos */}
              <div className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] overflow-hidden w-full">
                  <Image
                    src="/loja-interna-2.jpg"
                    alt="Interior da Loja Jaleca com logo na parede"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden w-full">
                  <Image
                    src="/loja-fachada-noite.jpg"
                    alt="Fachada Jaleca à noite"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Texto */}
              <div>
                <p className="text-[11px] font-semibold tracking-[0.4em] uppercase text-[#c4a97d] mb-4">
                  Desde o início
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-6">
                  Um espaço pensado para você
                </h2>
                <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                  <p>
                    A Jaleca nasceu do desejo de oferecer jalecos e uniformes profissionais que unem elegância, conforto e qualidade. Nossa loja matriz é o coração da marca — um espaço acolhedor onde cada detalhe foi pensado para a experiência do profissional de saúde.
                  </p>
                  <p>
                    Aqui você encontra toda a nossa coleção disponível para experimentar, com atendimento personalizado da nossa equipe especializada.
                  </p>
                  <p>
                    Venha nos visitar e descubra o jaleco perfeito para a sua rotina clínica.
                  </p>
                </div>

                {/* Contato */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={15} className="text-[#c4a97d] flex-shrink-0" />
                    <a href="tel:+553133672467" className="hover:text-foreground transition-colors">(31) 3367-2467</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={15} className="text-[#c4a97d] flex-shrink-0" />
                    <a href="mailto:contato@jaleca.com.br" className="hover:text-foreground transition-colors">contato@jaleca.com.br</a>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={15} className="text-[#c4a97d] flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Av. Castelo Branco, 391 - Loja B, Horto<br />Ipatinga — MG, CEP 35160-264</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-[11px] font-semibold tracking-widest uppercase hover:bg-black/80 transition-colors"
                  >
                    Falar pelo WhatsApp
                  </a>
                  <Link
                    href="/produtos"
                    className="inline-flex items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 text-[11px] font-semibold tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors"
                  >
                    Ver Coleção Online
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prova Social */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>
              Números Jaleca
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', marginTop: '2.5rem' }}>
              {[
                { numero: '200.000+', label: 'peças vendidas' },
                { numero: 'Desde 2010', label: 'lojas físicas' },
                { numero: 'PP ao G3', label: 'grade completa' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1 }}>
                    {item.numero}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Dúvidas
            </div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Perguntas sobre a loja física
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

        {/* Revendedor CTA */}
        <section className="bg-[#1a1a1a] py-16 md:py-24">
          <div className="container text-center">
            <p className="text-[11px] font-semibold tracking-[0.4em] uppercase text-[#c4a97d] mb-4">
              Projeto de Expansão
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
              Seja uma revendedora licenciada Jaleca
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl mx-auto mb-8">
              A Jaleca está crescendo e buscando parceiras para expansão. Revenda nossa coleção com suporte completo da marca, modelo comprovado e uma linha exclusiva de jalecos e uniformes profissionais. Entre em contato e saiba mais.
            </p>
            <a
              href="https://wa.me/5531992901940?text=Olá!%20Tenho%20interesse%20em%20ser%20uma%20revendedora%20Jaleca."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c4a97d] text-white px-8 py-4 text-[11px] font-semibold tracking-widest uppercase hover:bg-[#a8895f] transition-colors"
            >
              Quero ser Revendedora
            </a>
          </div>
        </section>

      </main>
    </>
  )
}
