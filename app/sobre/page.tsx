import type { Metadata } from 'next'
import Link from 'next/link'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sobre a Jaleca — Nossa História e Compromisso com Profissionais',
  description: 'Conheça a Jaleca: marca brasileira especializada em jalecos e uniformes profissionais para a área da saúde. Nossa história, missão e valores. +200mil peças desde 2010.',
  alternates: { canonical: 'https://jaleca.com.br/sobre' },
  openGraph: {
    title: 'Sobre a Jaleca — Nossa História e Compromisso com Profissionais',
    description: 'Conheça a Jaleca: marca brasileira especializada em jalecos e uniformes profissionais para a área da saúde. +200mil peças vendidas.',
    url: 'https://jaleca.com.br/sobre',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/loja-fachada-noite.jpg', width: 1200, height: 630, alt: 'Loja Jaleca — Ipatinga, MG' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre a Jaleca — Nossa História e Compromisso com Profissionais',
    description: 'Conheça a Jaleca: marca brasileira especializada em jalecos e uniformes profissionais. +200mil peças.',
    images: ['https://jaleca.com.br/loja-fachada-noite.jpg'],
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jaleca',
  legalName: 'Jaleca — Jalecos e Mimos',
  url: 'https://jaleca.com.br',
  logo: 'https://jaleca.com.br/logo.svg',
  description: 'Marca brasileira especializada em jalecos e uniformes profissionais para profissionais da saúde. Mais de 200 mil peças vendidas desde 2010.',
  foundingDate: '2010',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ipatinga',
      addressRegion: 'MG',
      addressCountry: 'BR',
    },
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+55-31-3367-2467',
    contactType: 'customer service',
    availableLanguage: 'Portuguese',
    email: 'contato@jaleca.com.br',
  },
  sameAs: [
    'https://www.instagram.com/jaleca.oficial/',
    'https://www.facebook.com/jalecaoficial',
  ],
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Desde quando existe a Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'A Jaleca nasceu em 2010 em Ipatinga, Minas Gerais. Desde então, já comercializou mais de 200 mil peças de jalecos e uniformes profissionais em todo o Brasil.' } },
    { '@type': 'Question', name: 'A Jaleca tem loja física?', acceptedAnswer: { '@type': 'Answer', text: 'Sim! Nossa loja matriz fica em Ipatinga, MG, na Av. Castelo Branco, 391 - Loja B, Horto. Além da matriz, temos outras 5 lojas franqueadas em MG, ES e PR.' } },
    { '@type': 'Question', name: 'A Jaleca envia para todo o Brasil?', acceptedAnswer: { '@type': 'Answer', text: 'Sim, enviamos para todo o Brasil via Correios e transportadoras. Clientes de SP, RJ, MG e ES têm frete grátis para compras acima de R$499.' } },
    { '@type': 'Question', name: 'Qual o prazo de entrega da Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'O prazo varia de 5 a 15 dias úteis dependendo da região. Em Ipatinga e cidades próximas, a entrega pode ser ainda mais rápida.' } },
    { '@type': 'Question', name: 'A Jaleca oferece garantia nos produtos?', acceptedAnswer: { '@type': 'Answer', text: 'Arrependimento: 7 dias após o recebimento (CDC Art. 49). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Assistimos pós-venda para defeitos identificados.' } },
    { '@type': 'Question', name: 'Como posso falar com a Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'Você pode entrar em contato pelo WhatsApp (31) 3367-2467, por e-mail em contato@jaleca.com.br, ou visitar nossa loja física em Ipatinga.' } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sobre a Jaleca — Nossa História e Compromisso com Profissionais',
  description: 'Conheça a história da Jaleca: mais de 200 mil jalecos vendidos desde 2010, missão, valores e compromisso com profissionais da saúde.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/sobre',
  datePublished: '2024-01-15',
  dateModified: '2026-04-24',
}

export default function SobrePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <main className="py-12 md:py-20">
        <div className="container max-w-3xl">

          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Institucional
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
              Sobre a Jaleca
            </h1>
            <p className="text-muted-foreground leading-relaxed text-base">
              Uma marca nascida do cuidado com quem cuida. Desde 2010, mais de 200 mil peças vestiram profissionais da saúde pelo Brasil.
            </p>
          </div>

          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Nossa História</h2>
              <p>
                A <strong className="text-foreground font-semibold">Jaleca</strong> nasceu em Ipatinga, Minas Gerais, com uma missão clara: oferecer jalecos e uniformes profissionais que unam elegância, conforto e qualidade para os profissionais da saúde.
              </p>
              <p className="mt-3">
                Entendemos que quem dedica a vida ao cuidado das pessoas merece se sentir bem e confiante no próprio uniforme. Por isso, desenvolvemos cada peça com atenção aos detalhes: tecidos de alta qualidade, modelagens que favorecem todos os corpos e cores que transmitem profissionalismo.
              </p>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Nossa Missão</h2>
              <p>
                Vestir com elegância e funcionalidade os profissionais que cuidam de vidas. Acreditamos que o uniforme certo aumenta a autoestima, transmite confiança aos pacientes e contribui para uma prática profissional mais positiva.
              </p>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Nossos Valores</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground font-medium">Qualidade:</strong> tecidos premium com durabilidade e conforto, aprovados pelo uso clínico diário.</li>
                <li><strong className="text-foreground font-medium">Inclusão:</strong> tamanhos do PP ao G3, para que todos os profissionais encontrem o jaleco ideal.</li>
                <li><strong className="text-foreground font-medium">Elegância:</strong> design moderno que combina moda e funcionalidade profissional.</li>
                <li><strong className="text-foreground font-medium">Cuidado:</strong> atendimento personalizado e suporte pós-venda para cada cliente.</li>
                <li><strong className="text-foreground font-medium">Responsabilidade:</strong> comprometimento com práticas comerciais éticas e sustentáveis.</li>
              </ul>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Nossa Loja</h2>
              <p>
                Nossa loja física está localizada no coração de Ipatinga, MG, onde você pode experimentar toda a nossa coleção com atendimento especializado. Também atendemos clientes em todo o Brasil pelo nosso e-commerce com frete rápido.
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <p><strong className="text-foreground font-medium">Endereço:</strong> Av. Castelo Branco, 391 - Loja B, Horto — Ipatinga, MG, CEP 35160-264</p>
                <p><strong className="text-foreground font-medium">Horário:</strong> Seg–Sex: 9h às 18h | Sáb: 9h às 13h</p>
                <p><strong className="text-foreground font-medium">Telefone:</strong>{' '}
                  <a href="tel:+553133672467" className="text-foreground hover:underline">(31) 3367-2467</a>
                </p>
                <p><strong className="text-foreground font-medium">E-mail:</strong>{' '}
                  <a href="mailto:contato@jaleca.com.br" className="text-foreground hover:underline">contato@jaleca.com.br</a>
                </p>
              </div>
            </section>

          </div>

          {/* Prova social */}
          <div className="bg-[hsl(var(--muted))] border border-border rounded-lg px-6 py-5 mt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-medium">Jaleca em números:</strong> mais de <strong className="text-foreground font-semibold">200 mil peças</strong> vendidas desde 2010, distribuídos em 6 lojas físicas em MG, ES e PR, com atendimento a clientes em todo o Brasil.
            </p>
          </div>

          {/* FAQ */}
          <section className="mt-14">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">Perguntas Frequentes</h2>
            <div className="space-y-3">
              {[
                { q: 'Desde quando existe a Jaleca?', a: 'A Jaleca nasceu em 2010 em Ipatinga, Minas Gerais. Desde então, já comercializou mais de 200 mil peças de jalecos e uniformes profissionais.' },
                { q: 'A Jaleca tem loja física?', a: 'Sim! Nossa loja matriz fica em Ipatinga, MG. Além da matriz, temos mais 5 lojas franqueadas em Minas Gerais, Espírito Santo e Paraná.' },
                { q: 'A Jaleca envia para todo o Brasil?', a: 'Sim, enviamos para todo o Brasil. Clientes de SP, RJ, MG e ES têm frete grátis para compras acima de R$499.' },
                { q: 'Qual o prazo de entrega?', a: 'O prazo varia de 5 a 15 dias úteis dependendo da região. Em Ipatinga e região, a entrega pode ser ainda mais rápida.' },
                { q: 'A Jaleca oferece garantia?', a: 'Arrependimento: 7 dias após o recebimento (CDC). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta.' },
                { q: 'Como posso falar com a Jaleca?', a: 'WhatsApp: (31) 3367-2467 | E-mail: contato@jaleca.com.br | Loja física: Av. Castelo Branco, 391 - Loja B, Ipatinga, MG.' },
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

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors"
            >
              Ver Coleção
            </Link>
            <Link
              href="/loja-matriz"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-secondary/20 transition-colors"
            >
              Visitar Loja
            </Link>
            <a
              href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-secondary/20 transition-colors"
            >
              Falar pelo WhatsApp
            </a>
          </div>

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
