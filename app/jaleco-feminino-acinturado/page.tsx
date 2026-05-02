import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jaleco Feminino Acinturado | Slim para Consultório e Clínica | Jaleca',
  description: 'Jaleco feminino acinturado com corte Slim exclusivo para consultório, clínica e hospital. Elegância e conforto do PP ao G3. Frete grátis no Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-acinturado' },
  openGraph: {
    title: 'Jaleco Feminino Acinturado | Jaleca',
    description: 'Jaleco feminino acinturado Slim para consultório e clínica. Do PP ao G3, 12 cores.',
    url: 'https://jaleca.com.br/jaleco-feminino-acinturado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco feminino acinturado é confortável para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende do modelo. O Slim Elastex tem tecido com elastano bidirecional que permite liberdade total de movimento mesmo no corte acinturado — é o modelo mais indicado para plantões longos. O Slim Tradicional é mais estruturado, ideal para consultórios com menos movimento intenso.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco acinturado e jaleco reto?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco acinturado (Slim) tem recortes laterais que definem a cintura e acompanham a silhueta feminina. O jaleco reto tem corte tubular, sem ajuste de cintura. O acinturado transmite mais elegância e profissionalismo; o reto oferece mais espaço e é comum em ambientes de procedimentos.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco acinturado aperta com o tempo?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não, se escolher o tamanho correto. A Jaleca recomenda: em caso de dúvida entre dois tamanhos no modelo Slim, opte pelo maior. O corte acinturado tem menos folga por design. Após lavagens, o tecido Elastex mantém o caimento sem encolher.' },
    },
  ],
}

export default function JalecoFemininoAcinturadoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />

      <main className="container py-10 max-w-3xl">
        <nav className="text-xs text-muted-foreground mb-6 flex gap-1">
          <Link href="/" className="hover:underline">Início</Link>
          <span>/</span>
          <Link href="/categoria/jalecos-femininos" className="hover:underline">Jalecos Femininos</Link>
          <span>/</span>
          <span>Jaleco Feminino Acinturado</span>
        </nav>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">Jaleco Feminino Acinturado</h1>

        <p className="text-muted-foreground leading-relaxed mb-8">
          O jaleco feminino acinturado é o modelo mais escolhido por médicas, dentistas e profissionais de saúde que querem aliar elegância e profissionalismo no consultório. Com recortes laterais que definem a cintura sem apertar, o corte Slim da Jaleca oferece caimento impecável durante toda a jornada de trabalho. Explore a coleção completa de{' '}
          <Link href="/categoria/jalecos-femininos" className="underline underline-offset-2 hover:text-foreground transition-colors">jalecos femininos com corte acinturado</Link>{' '}
          em 12 cores, do PP ao G3.
        </p>

        <div className="space-y-8 mb-10">
          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Por que o corte acinturado faz diferença</h2>
            <p className="text-muted-foreground leading-relaxed">
              Jalecos com corte reto tendem a deixar o visual mais largo e informal. O corte acinturado (Slim) foi desenvolvido pela Jaleca especificamente para o corpo feminino: os recortes laterais definem a silhueta, a manga é calibrada para o biótipo feminino e o comprimento é proporcional à altura média. O resultado é um jaleco que veste bem na primeira vez, sem ajustes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Modelos acinturados disponíveis</h2>
            <p className="text-muted-foreground leading-relaxed">
              A linha acinturada da Jaleca tem quatro modelos principais: <strong>Slim Tradicional</strong> (gabardine estruturado, ideal para consultório), <strong>Slim Elastex</strong> (elastano para plantões e procedimentos), <strong>Slim Princesa</strong> (evasê na parte inferior, para nutricionistas e estética) e <strong>Slim Gold</strong> (linha premium com acabamentos diferenciados). Todos com corte acinturado e disponíveis em branco, preto e colorido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Jaleco acinturado para consultório</h2>
            <p className="text-muted-foreground leading-relaxed">
              Em consultórios médicos, odontológicos e de saúde em geral, o jaleco acinturado transmite autoridade e cuidado com a imagem profissional. Pacientes percebem a diferença: um jaleco bem ajustado passa mais confiança do que um modelo largo e informal. O Slim Tradicional branco é o mais pedido por médicas e dentistas para uso diário em consultórios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Conforto sem abrir mão do caimento</h2>
            <p className="text-muted-foreground leading-relaxed">
              O corte acinturado não significa desconforto. O modelo Slim Elastex combina o corte ajustado com tecido de elastano bidirecional — cede em todos os sentidos, permitindo agachar, levantar os braços e se movimentar com naturalidade. Indicado para quem precisa de conforto em longas jornadas sem perder o visual elegante.
            </p>
          </section>
        </div>

        <div className="bg-secondary/20 border border-border p-6 mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">FAQ — Jaleco Feminino Acinturado</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name}>
                <p className="text-sm font-medium mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-3">Ver todos os modelos acinturados:</p>
          <Link
            href="/categoria/jalecos-femininos"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#333] transition-colors"
          >
            Ver jalecos femininos →
          </Link>
        </div>
      </main>
    </>
  )
}
