import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock, Phone, Mail, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato — Fale Conosco',
  description: 'Entre em contato com a Jaleca. WhatsApp, e-mail ou visite nossa loja em Ipatinga, MG. Atendimento de segunda a sábado para jalecos e uniformes profissionais.',
  alternates: { canonical: 'https://jaleca.com.br/contato' },
  openGraph: {
    title: 'Contato — Jaleca | Fale Conosco',
    description: 'Entre em contato com a Jaleca. WhatsApp, e-mail ou visite nossa loja em Ipatinga, MG.',
    url: 'https://jaleca.com.br/contato',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contato — Jaleca | Fale Conosco',
    description: 'Entre em contato com a Jaleca. WhatsApp, e-mail ou visite nossa loja em Ipatinga, MG.',
  },
}

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contato — Jaleca',
  description: 'Página de contato da Jaleca — jalecos e uniformes profissionais',
  url: 'https://jaleca.com.br/contato',
  mainEntity: {
    '@type': 'Organization',
    name: 'Jaleca',
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
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o canal mais rápido para falar com a Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'O WhatsApp é o canal mais rápido: (31) 3367-2467. A resposta costuma ser em poucos minutos, de segunda a sexta.' } },
    { '@type': 'Question', name: 'Em quanto tempo a Jaleca responde por e-mail?', acceptedAnswer: { '@type': 'Answer', text: 'Respondemos e-mails em até 1 dia útil. Para respostas mais rápidas, utilize o WhatsApp.' } },
    { '@type': 'Question', name: 'Posso visitar a loja física sem agendar?', acceptedAnswer: { '@type': 'Answer', text: 'Sim! Nossa loja em Ipatinga funciona de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Você pode ir diretamente ou combinar um horário pelo WhatsApp.' } },
    { '@type': 'Question', name: 'A Jaleca atende por telefone?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Ligue para (31) 3367-2467 de segunda a sexta, das 9h às 18h, e sábado das 9h às 12h.' } },
    { '@type': 'Question', name: 'Como funciona o atendimento pelo WhatsApp?', acceptedAnswer: { '@type': 'Answer', text: 'Basta clicar no link do WhatsApp ou enviar uma mensagem para (31) 3367-2467. Nossa equipe ajuda com尺寸, estoque, dúvidas sobre produtos e acompanhamento de pedidos.' } },
    { '@type': 'Question', name: 'A Jaleca tem atendimento no fim de semana?', acceptedAnswer: { '@type': 'Answer', text: 'Sim! Pelo WhatsApp você pode interagir a qualquer momento. Na loja física, funcionamos aos sábados das 9h às 12h.' } },
  ],
}

export default function ContatoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <main className="py-12 md:py-20">
        <div className="container max-w-3xl">

          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Atendimento
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
              Contato Jaleca — Fale Conosco
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Estamos aqui para ajudar! Entre em contato pelos canais abaixo ou visite nossa loja em Ipatinga, MG. Respondemos em minutos pelo WhatsApp.
            </p>
          </div>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">Perguntas Frequentes</h2>
            <div className="space-y-3">
              {[
                { q: 'Qual o canal mais rápido para falar com a Jaleca?', a: 'O WhatsApp é o mais rápido: (31) 3367-2467. Respondemos em minutos, de seg a sex.' },
                { q: 'Em quanto tempo a Jaleca responde por e-mail?', a: 'Respondemos em até 1 dia útil. Para respostas mais rápidas, use o WhatsApp.' },
                { q: 'Posso visitar a loja física sem agendar?', a: 'Sim! Funcionamos de segunda a sexta, 9h às 18h, e sábado, 9h às 12h. Vá direto ou combine pelo WhatsApp.' },
                { q: 'A Jaleca atende por telefone?', a: 'Sim: (31) 3367-2467, de seg a sex das 9h às 18h e sábado das 9h às 12h.' },
                { q: 'Como funciona o atendimento pelo WhatsApp?', a: 'Clique no link ou mande mensagem para (31) 3367-2467. A equipe ajuda com tamanho, estoque e pedidos.' },
                { q: 'A Jaleca tem atendimento no fim de semana?', a: 'Pelo WhatsApp você pode interagir a qualquer momento. Na loja, funcionamos aos sábados das 9h às 12h.' },
              ].map((item, i) => (
                <details key={i} className="group border border-border rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-foreground hover:bg-secondary/10 transition-colors list-none">
                    {item.q}
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-[hsl(var(--muted)/0.3)]">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Contact channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <a
              href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border rounded-lg px-6 py-5 hover:border-foreground hover:bg-secondary/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle size={18} className="text-[#c4a97d]" />
                <p className="font-semibold text-foreground text-sm group-hover:underline">WhatsApp</p>
              </div>
              <p className="text-sm text-muted-foreground">(31) 3367-2467</p>
              <p className="text-xs text-muted-foreground mt-1">Canal mais rápido — resposta em minutos</p>
            </a>

            <a
              href="mailto:contato@jaleca.com.br"
              className="block border border-border rounded-lg px-6 py-5 hover:border-foreground hover:bg-secondary/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-[#c4a97d]" />
                <p className="font-semibold text-foreground text-sm group-hover:underline">E-mail</p>
              </div>
              <p className="text-sm text-muted-foreground">contato@jaleca.com.br</p>
              <p className="text-xs text-muted-foreground mt-1">Respondemos em até 1 dia útil</p>
            </a>

            <a
              href="tel:+553133672467"
              className="block border border-border rounded-lg px-6 py-5 hover:border-foreground hover:bg-secondary/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Phone size={18} className="text-[#c4a97d]" />
                <p className="font-semibold text-foreground text-sm group-hover:underline">Telefone</p>
              </div>
              <p className="text-sm text-muted-foreground">(31) 3367-2467</p>
              <p className="text-xs text-muted-foreground mt-1">Seg–Sex: 9h às 18h | Sáb: 9h às 12h</p>
            </a>

            <div className="block border border-border rounded-lg px-6 py-5">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-[#c4a97d]" />
                <p className="font-semibold text-foreground text-sm">Horário de Atendimento</p>
              </div>
              <p className="text-sm text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
              <p className="text-sm text-muted-foreground">Sábado: 9h às 12h</p>
            </div>
          </div>

          {/* Physical store */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">Nossa Loja Física</h2>
            <div className="flex items-start gap-3 text-sm mb-4">
              <MapPin size={16} className="text-[#c4a97d] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-medium">Av. Castelo Branco, 391 - Loja B, Horto</p>
                <p className="text-muted-foreground">Ipatinga — MG, CEP 35160-264</p>
              </div>
            </div>
            <Link
              href="/loja-matriz"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-foreground border border-border px-5 py-3 hover:bg-secondary/20 transition-colors"
            >
              Ver detalhes da loja →
            </Link>
          </section>

          {/* FAQ quick links */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">Dúvidas Frequentes</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Como escolher o tamanho certo?', href: '/medidas' },
                { label: 'Política de trocas e devoluções', href: '/trocas-e-devolucoes' },
                { label: 'Política de Privacidade', href: '/privacidade' },
                { label: 'Termos de Uso', href: '/termos' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between border border-border rounded-lg px-5 py-3.5 hover:border-foreground hover:bg-secondary/10 transition-all duration-200 group"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                  <span className="text-muted-foreground">→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
