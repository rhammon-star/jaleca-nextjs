import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Phone, Mail, Users } from 'lucide-react'

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

export default function LojaMatrizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }}
      />
      <main>

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
