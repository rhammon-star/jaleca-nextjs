import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino Plus Size: Como Escolher do G1 ao G3',
  description: 'Jaleco feminino plus size: como medir, qual modelo valoriza mais, diferença entre G1, G2 e G3. Slim plus size existe? Guia completo para tamanhos maiores.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-plus-size-feminino-guia' },
  openGraph: {
    title: 'Jaleco Feminino Plus Size: Como Escolher do G1 ao G3',
    description: 'Guia completo de jaleco plus size: tabela de medidas, slim vs clássico, como o corte funciona nos tamanhos G1 ao G3.',
    url: 'https://jaleca.com.br/blog/jaleco-plus-size-feminino-guia',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino Plus Size: Como Escolher do G1 ao G3',
  description: 'Guia de jaleco plus size: tabela de medidas, slim vs clássico, e como o corte funciona nos tamanhos maiores.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  url: 'https://jaleca.com.br/blog/jaleco-plus-size-feminino-guia',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco slim existe em tamanho plus size?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O jaleco slim da Jaleca vai do PP ao G3. Os tamanhos G1, G2 e G3 têm molde redesenhado — não é apenas o G ampliado, mas um molde específico para o corpo plus size com maior amplitude no quadril, ombros proporcionais e manga com circunferência adequada. O slim plus size mantém os recortes laterais que definem a cintura, funcionando no corpo plus size da mesma forma que no PP.' },
    },
    {
      '@type': 'Question',
      name: 'Como medir para jaleco plus size?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto (na linha dos mamilos), a cintura (parte mais estreita) e o quadril (parte mais larga). Para o slim plus size, o busto é a medida principal — escolha o tamanho pelo busto e o corte se ajusta. Para o clássico plus size, o quadril é a referência — o corte reto precisa passar pelo quadril sem prender. Na dúvida entre dois tamanhos no slim, sempre escolha o maior.' },
    },
    {
      '@type': 'Question',
      name: 'Qual modelo de jaleco fica melhor em corpo plus size?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende da silhueta. Para corpos com diferença busto-cintura marcada (silhueta ampulheta ou pêra): o slim define a cintura e valoriza a silhueta. Para corpos mais retos (diferença busto-cintura menor que 8cm): o clássico cai melhor — o slim pode criar vincos horizontais. Para quem tem quadril mais largo que o busto: o slim G1-G3 tem quadril amplo e cintura marcada — é o modelo que mais valoriza essa silhueta.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco plus size tem manga proporcional?',
      acceptedAnswer: { '@type': 'Answer', text: 'No jaleco plus size da Jaleca, sim. Os tamanhos G1 ao G3 têm manga com circunferência maior (adequada para braço mais volumoso) e comprimento proporcional ao ombro. Um erro comum em outras marcas é usar o mesmo molde de manga do G e apenas ampliar o corpo — resulta em manga que aperta no braço superior. O molde plus size correto redesenha a manga junto com o corpo.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Plus Size Feminino', item: 'https://jaleca.com.br/blog/jaleco-plus-size-feminino-guia' },
  ],
}

const TABELA = [
  { tamanho: 'GG', busto: '97–102 cm', cintura: '81–86 cm', quadril: '105–110 cm' },
  { tamanho: 'G1', busto: '103–108 cm', cintura: '87–92 cm', quadril: '111–116 cm' },
  { tamanho: 'G2', busto: '109–114 cm', cintura: '93–98 cm', quadril: '117–122 cm' },
  { tamanho: 'G3', busto: '115–120 cm', cintura: '99–104 cm', quadril: '123–128 cm' },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Jaleco Plus Size Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />1 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino Plus Size: Como Escolher do G1 ao G3
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            O jaleco slim existe em tamanho plus size — e funciona. A diferença está no molde: G1 ao G3 têm recortes redesenhados para o corpo plus size, não apenas o molde do G ampliado.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O problema com jaleco plus size no mercado</h2>
          <p>
            A maioria das marcas faz plus size da forma errada: pega o molde do G e escala proporcionalmente. O resultado é um jaleco com ombros enormes, manga com largura errada e sem caimento. A profissional plus size acaba comprando o clássico enorme para "ter espaço" — e fica com o jaleco afogando o corpo.
          </p>
          <p>
            O jaleco plus size bem feito tem molde específico: busto e quadril ampliados, cintura marcada nos recortes laterais, ombro proporcional à estrutura óssea real e manga com circunferência adequada para o braço.
          </p>

          <h2>Tabela de medidas — G1 ao G3</h2>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="text-left p-3">Tamanho</th>
                  <th className="text-left p-3">Busto</th>
                  <th className="text-left p-3">Cintura</th>
                  <th className="text-left p-3">Quadril</th>
                </tr>
              </thead>
              <tbody>
                {TABELA.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-white'}>
                    <td className="p-3 font-semibold">{item.tamanho}</td>
                    <td className="p-3">{item.busto}</td>
                    <td className="p-3">{item.cintura}</td>
                    <td className="p-3">{item.quadril}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[#888]">Medidas do corpo, não do jaleco. O slim tem ~4cm de folga no busto.</p>

          <h2>Slim plus size: funciona de verdade?</h2>
          <p>
            Sim — quando o molde é correto e o tecido tem elastano bidirecional. O recorte lateral do slim define a cintura no corpo plus size da mesma forma que no corpo menor: ele acompanha a curva entre o busto e o quadril, criando a marcação sem apertar.
          </p>
          <p>
            A condição é o elastano: sem ele, o slim plus size aperta no busto e prende o movimento. Com elastano bidirecional, o tecido cede onde precisa e o caimento funciona.
          </p>

          <h2>Slim ou clássico plus size: como decidir</h2>
          <ul>
            <li><strong>Diferença busto-cintura maior que 8cm:</strong> o slim vai funcionar e valorizar a silhueta</li>
            <li><strong>Diferença busto-cintura menor que 8cm (corpo mais reto):</strong> o clássico cai melhor — o slim pode criar volume nos recortes laterais</li>
            <li><strong>Quadril mais largo que o busto:</strong> o slim G1-G3 tem quadril amplo com cintura marcada — é o modelo que mais valoriza essa silhueta</li>
            <li><strong>Preferência por mais espaço interno:</strong> o clássico tem mais folga — ideal para quem usa roupa mais grossa por baixo ou prefere o jaleco mais solto</li>
          </ul>

          <h2>Como medir para acertar o tamanho</h2>
          <p>
            Use fita métrica flexível. As três medidas:
          </p>
          <ol>
            <li><strong>Busto:</strong> fita na linha dos mamilos, respiração normal, sem apertar</li>
            <li><strong>Cintura:</strong> parte mais estreita do tronco</li>
            <li><strong>Quadril:</strong> parte mais larga — geralmente na linha dos trocânteres</li>
          </ol>
          <p>
            Para o slim: escolha pelo busto. Na dúvida entre dois tamanhos, vá para o maior — jaleco slim apertado é mais visível do que jaleco slim um número acima.
          </p>
          <p>
            Para o clássico: escolha pelo quadril — o jaleco precisa passar pelo quadril sem prender os botões.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-tamanho-certo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de medidas para jaleco feminino</Link>
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: modelos e quando usar</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jaleco plus size Jaleca — G1 ao G3</h3>
          <p className="text-muted-foreground mb-4">Slim e clássico em tamanhos G1, G2 e G3 — molde redesenhado, não escalonado.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Plus Size →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: 'jaleco-plus-size-feminino-guia' }]
}
