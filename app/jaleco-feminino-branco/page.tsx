import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jaleco Feminino Branco | Para Médicas, Dentistas e Faculdade | Jaleca',
  description: 'Jaleco feminino branco com modelagem exclusiva para médicas, dentistas e estudantes. Corte acinturado, tecido durável, do PP ao G3. Frete grátis no Sudeste.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-branco' },
  openGraph: {
    title: 'Jaleco Feminino Branco | Jaleca',
    description: 'Jaleco feminino branco para médicas, dentistas e faculdade. Modelagem exclusiva, do PP ao G3.',
    url: 'https://jaleca.com.br/jaleco-feminino-branco',
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
      name: 'Jaleco feminino branco é obrigatório em hospitais?',
      acceptedAnswer: { '@type': 'Answer', text: 'Em muitos hospitais e faculdades de medicina e enfermagem, o jaleco branco é o padrão institucional. Em clínicas privadas e consultórios, a cor é definida pela própria instituição — jaleco colorido é aceito em muitos ambientes.' },
    },
    {
      '@type': 'Question',
      name: 'Como lavar jaleco feminino branco sem amarelecer?',
      acceptedAnswer: { '@type': 'Answer', text: 'Lave com água fria ou morna, use sabão neutro ou detergente para roupas delicadas. Para alvejamento, use água oxigenada (10 volumes) diluída — evite hipoclorito direto, que pode enfraquecer o tecido. O tecido Elastex da Jaleca mantém o branco após dezenas de lavagens quando seguidas as instruções.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tamanho de jaleco feminino branco devo comprar?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto e consulte a tabela de medidas da Jaleca. No modelo Slim, em caso de dúvida entre dois tamanhos, opte pelo maior — o corte acinturado tem menos folga. Os tamanhos vão do PP ao G3, com molde redesenhado para plus size (G1-G3).' },
    },
  ],
}

export default function JalecoFemininoBrancoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />

      <main className="container py-10 max-w-3xl">
        <nav className="text-xs text-muted-foreground mb-6 flex gap-1">
          <Link href="/" className="hover:underline">Início</Link>
          <span>/</span>
          <Link href="/categoria/jalecos-femininos" className="hover:underline">Jalecos Femininos</Link>
          <span>/</span>
          <span>Jaleco Feminino Branco</span>
        </nav>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">Jaleco Feminino Branco</h1>

        <p className="text-muted-foreground leading-relaxed mb-8">
          O jaleco feminino branco é o uniforme mais usado por médicas, dentistas, estudantes de saúde e profissionais que trabalham em hospitais e faculdades. Mais do que tradição, o branco transmite higiene, autoridade e profissionalismo em qualquer ambiente clínico. Os{' '}
          <Link href="/categoria/jalecos-femininos" className="underline underline-offset-2 hover:text-foreground transition-colors">jalecos femininos da Jaleca</Link>{' '}
          são fabricados com modelagem exclusiva — corte acinturado, manga calibrada e tecido de alta durabilidade que mantém o branco imaculado mesmo após dezenas de lavagens.
        </p>

        <div className="space-y-8 mb-10">
          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Jaleco branco para médica e hospital</h2>
            <p className="text-muted-foreground leading-relaxed">
              Em ambientes hospitalares e consultórios médicos, o jaleco branco é o padrão mais aceito. O modelo Slim branco da Jaleca atende as exigências de biossegurança com tecido de fácil higienização, enquanto o corte acinturado mantém o visual elegante durante longos plantões. Disponível com manga longa (Duquesa) ou modelagem mais leve para climas quentes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Jaleco branco para faculdade e estudantes</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para a faculdade, o jaleco feminino branco precisa equilibrar custo-benefício e durabilidade. O Jaleco Slim Tradicional branco é o mais pedido por estudantes de medicina, enfermagem, odontologia e farmácia: tecido gabardine resistente, corte acinturado e preço acessível. O Jaleco Universitário Unissex é uma alternativa econômica para quem está no início do curso.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Tecido e durabilidade do jaleco branco</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os jalecos brancos da Jaleca são produzidos em <strong>Elastex</strong> (poliéster com elastano bidirecional) ou <strong>gabardine premium</strong>. O tingimento de alta fixação garante que o branco não amarelece com o uso frequente. Todos passam por controle de qualidade e são testados para resistir a múltiplas lavagens sem perder caimento ou encolher.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold mb-2">Tamanhos e modelos disponíveis</h2>
            <p className="text-muted-foreground leading-relaxed">
              O jaleco feminino branco está disponível do <strong>PP ao G3</strong>. Os tamanhos plus size (G1 ao G3) têm molde redesenhado — não é o G ampliado, mas um molde com maior amplitude no quadril e ombro proporcional. Modelos disponíveis: Slim Tradicional, Slim Elastex, Slim Princesa, Duquesa e Gold.
            </p>
          </section>
        </div>

        <div className="bg-secondary/20 border border-border p-6 mb-10">
          <h2 className="font-display text-lg font-semibold mb-3">FAQ — Jaleco Feminino Branco</h2>
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
          <p className="text-sm text-muted-foreground mb-3">Ver todos os modelos de jaleco feminino branco:</p>
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
