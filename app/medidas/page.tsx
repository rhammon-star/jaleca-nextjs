import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guia de Medidas e Tabela de Tamanhos — Jaleca',
  description: 'Encontre o seu tamanho ideal com o guia de medidas Jaleca. Tabela completa com busto, cintura e quadril para jalecos femininos, masculinos e scrubs.',
  alternates: { canonical: 'https://jaleca.com.br/medidas' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Guia de Medidas e Tabela de Tamanhos — Jaleca',
    description: 'Encontre o seu tamanho ideal com o guia de medidas Jaleca. Tabela completa com busto, cintura e quadril para jalecos e uniformes.',
    url: 'https://jaleca.com.br/medidas',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia de Medidas e Tabela de Tamanhos — Jaleca',
    description: 'Encontre o seu tamanho ideal com o guia de medidas Jaleca.',
  },
}

const sizes = [
  { size: 'PP', busto: '80–84', cintura: '62–66', quadril: '88–92' },
  { size: 'P',  busto: '84–88', cintura: '66–70', quadril: '92–96' },
  { size: 'M',  busto: '88–92', cintura: '70–74', quadril: '96–100' },
  { size: 'G',  busto: '92–96', cintura: '74–78', quadril: '100–104' },
  { size: 'GG', busto: '96–102', cintura: '78–84', quadril: '104–110' },
]

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Como me medir para escolher o tamanho certo?', acceptedAnswer: { '@type': 'Answer', text: 'Use uma fita métrica flexível. Meça o busto na parte mais larga, a cintura na parte mais estreita e o quadril na parte mais larga. Mantenha a fita paralela ao chão e não aperte.' } },
    { '@type': 'Question', name: 'O que fazer se minhas medidas ficarem entre dois tamanhos?', acceptedAnswer: { '@type': 'Answer', text: 'Recomendamos optar pelo tamanho maior para maior conforto de movimento — especialmente importante em jalecos de trabalho que exigem mobilidade o dia inteiro.' } },
    { '@type': 'Question', name: 'As medidas da tabela são do corpo ou da roupa?', acceptedAnswer: { '@type': 'Answer', text: 'Todas as medidas da tabela são参考 do corpo, não da peça. Cada jaleco tem uma margem de folga já incluída no caimento.' } },
    { '@type': 'Question', name: 'Como saber se o jaleco vai servir bem?', acceptedAnswer: { '@type': 'Answer', text: 'Veja a descrição do produto para saber a modelagem (Slim ou Profissional). Em caso de dúvida, nossa equipe do WhatsApp pode ajudar a escolher o tamanho ideal para você.' } },
    { '@type': 'Question', name: 'Posso trocar o tamanho se não servir?', acceptedAnswer: { '@type': 'Answer', text: 'Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Basta entrar em contato pelo WhatsApp.' } },
    { '@type': 'Question', name: 'Jalecos com elastano têm caimento diferente?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. O elastano adiciona memória ao tecido, retornando à forma original após o movimento. Isso significa que o jaleco mantém o caimento impecável mesmo após horas de uso e múltiplas lavagens.' } },
  ],
}

const measureSteps = [
  {
    label: 'Busto',
    description:
      'Passe a fita métrica ao redor da parte mais larga do seu peito, mantendo-a paralela ao chão e sem apertar. Respire normalmente.',
  },
  {
    label: 'Cintura',
    description:
      'Meça a parte mais estreita do seu tronco, geralmente alguns centímetros acima do umbigo. A fita deve ficar justa, mas sem comprimir.',
  },
  {
    label: 'Quadril',
    description:
      'Passe a fita na parte mais larga do seu quadril e glúteos, mantendo-a paralela ao chão. Junte os pés ao medir.',
  },
]

export default function MedidasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
    <main className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Ajuda
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Guia de Medidas — Como Escolher o Tamanho Ideal
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Para garantir o melhor caimento, meça-se antes de comprar e compare com a tabela abaixo. As medidas estão em centímetros (cm).
          </p>
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {[
              { q: 'Como me medir para escolher o tamanho certo?', a: 'Use fita métrica flexível. Meça busto (parte mais larga), cintura (parte mais estreita) e quadril (parte mais larga). Fita paralela ao chão, sem apertar.' },
              { q: 'E se minhas medidas ficarem entre dois tamanhos?', a: 'Opte pelo tamanho maior para mais conforto de movimento — importante para quem passa o dia inteiro com o jaleco.' },
              { q: 'As medidas são do corpo ou da roupa?', a: 'São do corpo. Cada jaleco já tem margem de folga incluída no caimento.' },
              { q: 'Como saber se o jaleco vai servir bem?', a: 'Veja a modelagem na descrição do produto (Slim ou Profissional). Dúvidas? Nossa equipe do WhatsApp ajuda a escolher.' },
              { q: 'Posso trocar se não servir?', a: 'Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta. Entre em contato pelo WhatsApp.' },
              { q: 'Jaleco com elastano tem caimento diferente?', a: 'Sim. O elastano dá memória ao tecido, mantendo o caimento impecável mesmo após horas de uso e múltiplas lavagens.' },
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

        {/* How to measure */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Como se medir</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Use uma fita métrica flexível (aquelas usadas para costura). Meça sempre sobre roupas leves ou sem roupa para obter resultados mais precisos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {measureSteps.map((step, idx) => (
              <div key={step.label} className="border border-border rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">{step.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Size table */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Tabela de Tamanhos</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Todas as medidas abaixo são do <strong className="text-foreground font-medium">corpo</strong>, não da peça.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full border border-border text-sm">
                <thead>
                  <tr className="bg-[hsl(var(--muted))]">
                    <th className="text-left px-5 py-3.5 font-semibold text-foreground font-display tracking-wide border-b border-border">
                      Tamanho
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-foreground font-display tracking-wide border-b border-border">
                      Busto (cm)
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-foreground font-display tracking-wide border-b border-border">
                      Cintura (cm)
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-foreground font-display tracking-wide border-b border-border">
                      Quadril (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((row, idx) => (
                    <tr
                      key={row.size}
                      className={idx % 2 === 0 ? 'bg-background' : 'bg-[hsl(var(--muted)/0.4)]'}
                    >
                      <td className="px-5 py-3.5 font-display font-semibold text-foreground border-b border-border">
                        {row.size}
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground border-b border-border">
                        {row.busto}
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground border-b border-border">
                        {row.cintura}
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground border-b border-border">
                        {row.quadril}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            * As medidas podem variar em até 2 cm dependendo do modelo, tecido e caimento da peça.
          </p>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-5">Dicas para Escolher seu Tamanho</h2>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
            <li>Se suas medidas ficarem entre dois tamanhos, recomendamos optar pelo <strong className="text-foreground font-medium">maior</strong> para maior conforto de movimento — especialmente importante em jalecos de trabalho.</li>
            <li>Jalecos com modelagem mais ajustada tendem a ter menos folga. Verifique a descrição de cada produto para orientações específicas de modelagem.</li>
            <li>Para scrubs e uniformes cirúrgicos, prefira um tamanho com mais liberdade para os movimentos do dia a dia clínico.</li>
            <li>Em caso de dúvida, nossa equipe está disponível pelo WhatsApp para te ajudar a escolher o tamanho ideal.</li>
          </ul>
        </section>

        {/* Note */}
        <div className="bg-[hsl(var(--muted))] border border-border rounded-lg px-6 py-5 mb-10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-medium">Importante:</strong> As medidas desta tabela são referências baseadas nos tamanhos padrão da indústria têxtil brasileira. Cada peça pode ter variações de caimento e folga. Consulte sempre a descrição individual do produto para informações específicas.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors"
          >
            Ver Todos os Produtos
          </Link>
          <a
            href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[hsl(var(--muted))] transition-colors"
          >
            Tirar Dúvidas no WhatsApp
          </a>
        </div>

        {/* Back link */}
        <div className="pt-8 border-t border-border">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
    </>
  )
}
