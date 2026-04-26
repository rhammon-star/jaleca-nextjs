import type { Metadata } from 'next'
import Image from 'next/image'
import { MapPin, Instagram } from 'lucide-react'
import { franqueados } from '@/lib/franqueados'
import StoreMapClient from '@/components/StoreMapClient'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Lojas Jaleca — Jalecos em Ipatinga, BH, Colatina, Contagem e Mais',
  description: '6 lojas físicas Jaleca em MG e ES: experimente jalecos, dólmãs e conjuntos antes de comprar. Ipatinga, Caratinga, Contagem, Colatina, Teófilo Otoni e Guarapuava. Atendimento personalizado e estoque completo.',
  alternates: { canonical: 'https://jaleca.com.br/nossas-lojas' },
  openGraph: {
    title: 'Lojas Jaleca — Jalecos em Ipatinga, BH, Colatina, Contagem e Mais',
    description: '6 lojas físicas Jaleca em MG e ES: experimente jalecos, dólmãs e conjuntos antes de comprar. Ipatinga, Caratinga, Contagem, Colatina, Teófilo Otoni e Guarapuava.',
    url: 'https://jaleca.com.br/nossas-lojas',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Lojas Jaleca' }],
  },
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Quais cidades têm loja Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'Temos 6 lojas físicas: Ipatinga (matriz), Caratinga e Contagem em MG; Colatina no ES; Teófilo Otoni em MG; e Guarapuava no Paraná. Use o mapa para encontrar a mais próxima.' } },
    { '@type': 'Question', name: 'Qual o horário de funcionamento das lojas?', acceptedAnswer: { '@type': 'Answer', text: 'O horário varia por loja. Em geral, funcionamos de segunda a sexta das 9h às 18h e sábado das 9h às 12h. Confira os horários específicos ao lado de cada loja no mapa.' } },
    { '@type': 'Question', name: 'Posso comprar na loja física e retirar?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Você pode comprar no site e retirar na loja física mais próxima, sem custo de frete. O prazo de separação é de até 2 dias úteis após a confirmação do pedido.' } },
    { '@type': 'Question', name: 'As lojas têm estoque completo?', acceptedAnswer: { '@type': 'Answer', text: 'Cada loja tem seu próprio estoque. Nem todos os produtos estão disponíveis em todas as lojas. Para garantir a peça desejada, entre em contato com a loja pelo WhatsApp antes de ir.' } },
    { '@type': 'Question', name: 'Como chegar na loja matriz de Ipatinga?', acceptedAnswer: { '@type': 'Answer', text: 'Estamos na Av. Castelo Branco, 391 - Loja B, Horto, Ipatinga, MG, CEP 35160-264. Do lado do Supermercado Economia. Estacionamento nas proximidades.' } },
    { '@type': 'Question', name: 'A loja matriz tem atendimento diferenciado?', acceptedAnswer: { '@type': 'Answer', text: 'Sim! Na matriz você encontra a coleção completa, atendimento personalizado e possibilidade deprovar diversas peças antes de comprar. Também temos atendimento por WhatsApp para auxiliar na escolha.' } },
  ],
}

export default function NossasLojasPage() {
  const porEstado = franqueados.reduce<Record<string, typeof franqueados>>((acc, f) => {
    if (!acc[f.estado]) acc[f.estado] = []
    acc[f.estado].push(f)
    return acc
  }, {})

  const estadoNomes: Record<string, string> = {
    MG: 'Minas Gerais',
    ES: 'Espírito Santo',
    PR: 'Paraná',
    SP: 'São Paulo',
    RJ: 'Rio de Janeiro',
  }

  const estados = Object.keys(porEstado).sort()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
    <main>
      {/* Hero com foto da loja */}
      <section className="relative w-full overflow-hidden bg-[#1a1a1a]" style={{ height: '52vh', minHeight: 320 }}>
        <Image
          src="/loja-fachada-noite.jpg"
          alt="Loja Jaleca Ipatinga"
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <p className="text-[11px] font-semibold tracking-[0.4em] uppercase text-[#c4a97d] mb-3">
            Jaleca — presença nacional
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-2">
            Nossas Lojas — Visite a Jaleca
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            {franqueados.length} lojas físicas. Clique no mapa para encontrar a mais próxima de você.
          </p>
        </div>
      </section>

      {/* Mapa interativo */}
      <section className="w-full border-b border-border" style={{ height: '520px' }}>
        <StoreMapClient />
      </section>

      {/* Contador visual */}
      <section className="bg-secondary/20 border-b border-border py-8">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <div>
              <p className="font-display text-4xl font-semibold text-foreground">{franqueados.length}</p>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mt-1">Lojas físicas</p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold text-foreground">{Object.keys(porEstado).length}</p>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mt-1">Estados</p>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold text-foreground">+</p>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mt-1">Em expansão</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-14 md:py-16">
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Perguntas Frequentes</h2>
        <div className="max-w-3xl space-y-3">
          {[
            { q: 'Quais cidades têm loja Jaleca?', a: 'Temos 6 lojas: Ipatinga (matriz) e Caratinga e Contagem em MG; Colatina no ES; Teófilo Otoni em MG; e Guarapuava no PR. Use o mapa para encontrar a mais próxima.' },
            { q: 'Qual o horário de funcionamento?', a: 'Geralmente seg a sex das 9h às 18h e sábado das 9h às 12h. Confira o horário específico de cada loja ao lado do card.' },
            { q: 'Posso comprar no site e retirar na loja?', a: 'Sim! Retire na loja mais próxima sem custo de frete. A separação demora até 2 dias úteis após confirmação do pedido.' },
            { q: 'As lojas têm estoque completo?', a: 'Cada loja tem seu próprio estoque. Para garantir a peça desejada,entre em contato com a loja pelo WhatsApp antes de ir.' },
            { q: 'Como chegar na loja matriz?', a: 'Av. Castelo Branco, 391 - Loja B, Horto, Ipatinga, MG, CEP 35160-264. Ao lado do Supermercado Economia.' },
            { q: 'A matriz tem atendimento diferenciado?', a: 'Sim! Na matriz você encontra a coleção completa e pode provar diversas peças antes de comprar. Atendimento WhatsApp também disponível.' },
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

      {/* Cards por estado */}
      <section className="container py-14 md:py-20">
        {estados.map(estado => (
          <div key={estado} className="mb-14 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground">
                <MapPin size={12} />
                {estadoNomes[estado] ?? estado}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {porEstado[estado].map(loja => {
                const waNumber = loja.whatsapp.replace(/\D/g, '')
                const waLink = `https://wa.me/${waNumber}?text=Olá!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informações%20sobre%20a%20loja%20de%20${encodeURIComponent(loja.cidade)}.`
                const igHandle = loja.instagram.replace('@', '')
                const igLink = `https://instagram.com/${igHandle}`

                return (
                  <div
                    key={loja.id}
                    className="group border border-border bg-background hover:border-foreground/20 hover:shadow-sm transition-all duration-300 p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="font-display text-xl font-semibold text-foreground leading-tight">
                        {loja.cidade}
                      </h2>
                      <span className="text-[10px] font-semibold tracking-widest uppercase border border-border text-muted-foreground px-2 py-0.5 shrink-0">
                        {estado}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                      {loja.nome_loja}
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {loja.endereco}
                    </p>

                    <div className="flex flex-col gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-semibold tracking-wide uppercase py-2.5 px-4 hover:bg-[#1ebe5d] transition-colors duration-200"
                      >
                        <WhatsAppIcon />
                        Falar no WhatsApp
                      </a>
                      <a
                        href={igLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-border text-foreground text-xs font-semibold tracking-wide uppercase py-2.5 px-4 hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <Instagram size={13} />
                        {loja.instagram}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Franquia */}
      <section className="border-t border-border bg-[#1a1a1a] py-14 md:py-16">
        <div className="container text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-[#c4a97d] mb-3">
            Quer ter sua própria loja?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            Seja um franqueado Jaleca
          </h2>
          <p className="text-white/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Faça parte da maior rede de uniformes premium para profissionais da saúde do Brasil.
          </p>
          <a
            href="https://wa.me/5531992901940?text=Olá!%20Tenho%20interesse%20em%20ser%20um%20franqueado%20Jaleca."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c4a97d] text-white text-xs font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-[#a8895f] transition-colors duration-200"
          >
            Quero ser uma revenda
          </a>
        </div>
      </section>
    </main>
    </>
  )
}
