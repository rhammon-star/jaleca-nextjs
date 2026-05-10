import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Como Escolher o Tamanho Certo de Jaleco Feminino — Guia de Medidas',
  description: 'Tabela de medidas jaleco feminino: como medir busto, cintura e comprimento. Jaleco slim vs clássico — tamanho que fica certo sem apertar. PP ao G3.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo' },
  openGraph: {
    title: 'Como Escolher o Tamanho Certo de Jaleco Feminino',
    description: 'Guia de medidas: como medir, interpretar a tabela e escolher entre slim e clássico. PP ao G3.',
    url: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Como Escolher o Tamanho Certo de Jaleco Feminino',
  description: 'Guia completo de medidas para jaleco feminino slim e clássico — PP ao G3.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  url: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como medir para jaleco feminino?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça o busto (fita métrica na linha dos mamilos, respiração normal), a cintura (parte mais estreita do tronco) e o quadril (parte mais larga). Para jaleco slim, a medida de busto é a mais importante — escolha o tamanho pelo busto e o corte acinturado se ajusta naturalmente à cintura. Para jaleco clássico, use o quadril como referência principal.' },
    },
    {
      '@type': 'Question',
      name: 'Na dúvida entre dois tamanhos de jaleco, qual escolher?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para jaleco slim: sempre o maior. Jaleco slim no tamanho certo parece ajustado e elegante; um tamanho abaixo fica apertado e cria vincos no busto e quadril. Para jaleco clássico: pode ficar no menor se estiver em dúvida — o corte reto tem mais folga natural. Jaleco slim apertado é mais visível e mais inadequado do que jaleco clássico um número menor.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco slim PP serve até que tamanho real?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco slim PP da Jaleca serve para busto até 84cm. O elastano bidirecional permite até 4cm de variação sem perder o caimento. Se seu busto é 84cm, o PP encaixa perfeitamente. Se for 86cm, o P é a escolha certa — o slim não deve estar tenso na maior circunferência.' },
    },
    {
      '@type': 'Question',
      name: 'Qual o comprimento padrão do jaleco feminino?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco feminino da Jaleca tem comprimento de 75cm (PP-P), 77cm (M-G) e 79cm (GG-G3) — medidos do ombro à barra. Para mulheres com até 1,60m, o comprimento padrão chega abaixo do quadril. Para mulheres acima de 1,70m, o mesmo jaleco fica na linha do quadril. Nenhum dos tamanhos é "curto demais" para uso clínico.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Feminino Tamanho Certo', item: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo' },
  ],
}

const TABELA_SLIM = [
  { tamanho: 'PP', busto: 'até 84 cm', cintura: 'até 68 cm', quadril: 'até 92 cm' },
  { tamanho: 'P', busto: '85–88 cm', cintura: '69–72 cm', quadril: '93–96 cm' },
  { tamanho: 'M', busto: '89–92 cm', cintura: '73–76 cm', quadril: '97–100 cm' },
  { tamanho: 'G', busto: '93–96 cm', cintura: '77–80 cm', quadril: '101–104 cm' },
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
          <span className="text-foreground">Jaleco Feminino Tamanho Certo</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Como Escolher o Tamanho Certo de Jaleco Feminino
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A diferença entre jaleco que valoriza e jaleco que aperta está em 2 cm e em saber qual medida usar. Guia direto: como medir, como interpretar a tabela, e o que muda entre slim e clássico.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Por que o tamanho de jaleco é diferente do tamanho de roupa comum</h2>
          <p>
            Jaleco não é vestido nem blusa. Ele precisa ter liberdade de movimento nos ombros e braços, fechar confortavelmente no busto (sem esticar os botões) e ter caimento no quadril para sentar sem prender. Por isso, a medida de referência principal é o <strong>busto</strong> — não o peso nem o número de calça.
          </p>
          <p>
            Muitas profissionais erram ao escolher jaleco pelo mesmo número que usam em blazer ou casaco. Blazer tem entretela e estrutura; jaleco tem elastano e movimento. São lógicas diferentes.
          </p>

          <h2>Como medir corretamente</h2>
          <p>Use fita métrica flexível. Meça em roupa fina (sutiã sem bojo extra):</p>
          <ul>
            <li><strong>Busto:</strong> passe a fita na linha dos mamilos, horizontalmente. Respire normalmente. Não prenda a fita — ela deve repousar sem apertar.</li>
            <li><strong>Cintura:</strong> parte mais estreita do tronco, geralmente 2–3 cm acima do umbigo.</li>
            <li><strong>Quadril:</strong> parte mais larga, geralmente na linha dos trocânteres (onde a calça fica na altura do máximo volume).</li>
          </ul>

          <h2>Tabela de medidas — Jaleco Slim Jaleca</h2>
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
                {TABELA_SLIM.map((item, i) => (
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
          <p className="text-sm text-[#888]">Medidas do corpo, não do jaleco. O jaleco slim tem ~4cm de folga no busto para o elastano trabalhar.</p>

          <h2>A regra da dúvida — slim vs clássico</h2>
          <p>
            <strong>Jaleco slim:</strong> na dúvida entre dois tamanhos, escolha o maior. O slim define a silhueta — um tamanho abaixo da medida fica apertado no busto e cria vincos horizontais nos botões, o que é visualmente mais inadequado do que escolher o número acima.
          </p>
          <p>
            <strong>Jaleco clássico:</strong> na dúvida, fique no menor. O corte reto já tem folga estrutural; um tamanho acima fica caído nos ombros e sem forma.
          </p>

          <h2>O que muda entre PP e G3 além do tamanho</h2>
          <p>
            O comprimento do jaleco também aumenta com o tamanho: PP e P têm 75cm do ombro à barra; M e G têm 77cm; GG ao G3 têm 79cm. Isso significa que uma mulher de 1,55m no tamanho G terá um jaleco mais longo do que uma mulher de 1,70m no tamanho P. Se o comprimento é importante (protocolo da instituição), meça do seu ombro até onde quer que o jaleco chegue.
          </p>

          <h2>Jaleco plus size — o que muda no corte</h2>
          <p>
            Os tamanhos G1 ao G3 da Jaleca têm recortes laterais ajustados para o corpo plus size: maior amplitude no quadril, ombros levemente mais largos e manga com circunferência maior. Não é simplesmente "escalar o molde do M" — é um molde redesenhado a partir do G1.
          </p>
          <p>
            Para quem é plus size e quer o visual slim: o slim G1-G3 continua definindo a cintura. A diferença visual entre slim e clássico se mantém em todos os tamanhos.
          </p>

          <h2>Slim não vai servir se…</h2>
          <ul>
            <li>Sua diferença busto-cintura for menor que 8cm (corpo mais reto) — o clássico vai caír melhor</li>
            <li>Você precisar usar roupas mais grossas por baixo no inverno — o slim não tem essa folga</li>
            <li>Você estiver gestante — o slim não acompanha a barriga. Veja o clássico ou o <Link href="/jaleco-plus-size" className="text-[#c4a97d]">jaleco plus size</Link></li>
          </ul>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: modelos e quando usar</Link>
              <Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Como manter jaleco branco sempre imaculado</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver tabela de tamanhos e escolher seu jaleco</h3>
          <p className="text-muted-foreground mb-4">Slim e clássico — PP ao G3, em até 12 cores. Tabela de medidas na página do produto.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos →
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
  return [{ slug: 'jaleco-feminino-tamanho-certo' }]
}
