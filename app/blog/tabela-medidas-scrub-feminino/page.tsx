import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tabela de Medidas Scrub Feminino — Como Medir e Escolher o Tamanho Certo',
  description: 'Tabela completa de medidas para scrub feminino: como medir busto, cintura e quadril, equivalência PP ao G3 e dicas para acertar o tamanho na compra online.',
  keywords: 'tabela medidas scrub feminino, tamanho scrub feminino, medidas uniforme saude feminino, tamanho PP G GG scrub, como medir scrub feminino',
  alternates: { canonical: 'https://jaleca.com.br/blog/tabela-medidas-scrub-feminino' },
  openGraph: {
    title: 'Tabela de Medidas Scrub Feminino — Como Medir e Escolher o Tamanho Certo',
    description: 'Tabela completa de medidas para scrub feminino com guia passo a passo.',
    url: 'https://jaleca.com.br/blog/tabela-medidas-scrub-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como medir para comprar scrub feminino online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use uma fita métrica flexível. Meça: (1) Busto — na parte mais larga do seio, sem apertar; (2) Cintura — na parte mais estreita do abdômen; (3) Quadril — na parte mais larga. Compare os três valores com a tabela de medidas da peça específica, não apenas com o número do tamanho.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tamanho G de scrub feminino é o mesmo que G de jaleco?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não necessariamente. Cada marca tem tabela própria. Um G de scrub pode equivaler a um GG de jaleco dependendo da modelagem. Sempre compare suas medidas reais (busto, cintura, quadril) com a tabela da peça que você vai comprar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Devo comprar scrub maior ou menor quando estou na dúvida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sempre prefira o maior. Um scrub folgado permite movimento livre e pode ser ajustado por costureira. Um scrub apertado vai incomodar durante o plantão inteiro e pode forçar as costuras.',
      },
    },
    {
      '@type': 'Question',
      name: 'Scrub feminino plus size tem tabela de medidas diferente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. As proporções entre busto, cintura e quadril nos tamanhos G1, G2 e G3 são recalculadas para corpos com mais volume — não é apenas ampliar o tamanho G. Por isso é ainda mais importante comparar suas medidas com a tabela específica do modelo.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tabela de Medidas Scrub Feminino — Como Medir e Escolher o Tamanho Certo',
  description: 'Tabela completa de medidas para scrub feminino e guia de como medir.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/tabela-medidas-scrub-feminino',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://jaleca.com.br/og-home.jpg',
}

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Tabela de Medidas Scrub Feminino</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Tabela de Medidas Scrub Feminino: Como Medir e Escolher o Tamanho Certo
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Errar o tamanho é o motivo número 1 de troca em compras de scrub online. Use essa tabela e o guia de medição abaixo para acertar na primeira vez.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">

          <h2>Como medir corretamente — passo a passo</h2>
          <p>
            Use uma <strong>fita métrica flexível</strong> (de costura, não de ferramentas). Fique de roupa leve ou lingerie. Não prenda a respiração nem afunde o abdômen — postura natural.
          </p>

          <h3>1. Busto</h3>
          <p>Passe a fita na parte mais larga do seio, horizontalmente, sem apertar. A fita deve estar paralela ao chão.</p>

          <h3>2. Cintura</h3>
          <p>Meça na parte mais estreita do tronco (normalmente 2–3 cm acima do umbigo). Não puxe a fita — apenas encosta.</p>

          <h3>3. Quadril</h3>
          <p>Meça na parte mais larga dos quadris e glúteos, com os pés juntos. Normalmente fica cerca de 20 cm abaixo da cintura.</p>

          <h3>4. Compare com a tabela</h3>
          <p>Use os três valores e compare com a tabela da <strong>peça específica</strong> que você quer comprar — não com o tamanho geral da marca. Se os valores não baterem exatamente, use a medida maior como referência de tamanho.</p>

          <h2>Tabela de medidas — Scrub Feminino Jaleca</h2>
          <p className="text-sm text-muted-foreground">Medidas em centímetros. Use como referência; cada modelo pode ter variações de até 1–2 cm.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="border border-[#333] p-3 text-left">Tamanho</th>
                  <th className="border border-[#333] p-3 text-center">Busto (cm)</th>
                  <th className="border border-[#333] p-3 text-center">Cintura (cm)</th>
                  <th className="border border-[#333] p-3 text-center">Quadril (cm)</th>
                  <th className="border border-[#333] p-3 text-center">Equiv. Manequim</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3 font-semibold">PP</td>
                  <td className="border border-[#ddd] p-3 text-center">80–84</td>
                  <td className="border border-[#ddd] p-3 text-center">62–66</td>
                  <td className="border border-[#ddd] p-3 text-center">88–92</td>
                  <td className="border border-[#ddd] p-3 text-center">36–38</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3 font-semibold">P</td>
                  <td className="border border-[#ddd] p-3 text-center">84–88</td>
                  <td className="border border-[#ddd] p-3 text-center">66–70</td>
                  <td className="border border-[#ddd] p-3 text-center">92–96</td>
                  <td className="border border-[#ddd] p-3 text-center">38–40</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3 font-semibold">M</td>
                  <td className="border border-[#ddd] p-3 text-center">88–94</td>
                  <td className="border border-[#ddd] p-3 text-center">70–76</td>
                  <td className="border border-[#ddd] p-3 text-center">96–102</td>
                  <td className="border border-[#ddd] p-3 text-center">40–42</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3 font-semibold">G</td>
                  <td className="border border-[#ddd] p-3 text-center">94–100</td>
                  <td className="border border-[#ddd] p-3 text-center">76–82</td>
                  <td className="border border-[#ddd] p-3 text-center">102–108</td>
                  <td className="border border-[#ddd] p-3 text-center">44–46</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3 font-semibold">GG</td>
                  <td className="border border-[#ddd] p-3 text-center">100–106</td>
                  <td className="border border-[#ddd] p-3 text-center">82–88</td>
                  <td className="border border-[#ddd] p-3 text-center">108–114</td>
                  <td className="border border-[#ddd] p-3 text-center">46–48</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3 font-semibold">G1 (XG)</td>
                  <td className="border border-[#ddd] p-3 text-center">106–112</td>
                  <td className="border border-[#ddd] p-3 text-center">88–94</td>
                  <td className="border border-[#ddd] p-3 text-center">114–120</td>
                  <td className="border border-[#ddd] p-3 text-center">48–50</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3 font-semibold">G2 (EXG)</td>
                  <td className="border border-[#ddd] p-3 text-center">112–118</td>
                  <td className="border border-[#ddd] p-3 text-center">94–100</td>
                  <td className="border border-[#ddd] p-3 text-center">120–126</td>
                  <td className="border border-[#ddd] p-3 text-center">50–52</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3 font-semibold">G3</td>
                  <td className="border border-[#ddd] p-3 text-center">118–124</td>
                  <td className="border border-[#ddd] p-3 text-center">100–106</td>
                  <td className="border border-[#ddd] p-3 text-center">126–132</td>
                  <td className="border border-[#ddd] p-3 text-center">52–54</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Tabela de referência Jaleca — versão 2026. Valores aproximados; consulte a tabela da peça específica no momento da compra.</p>

          <h2>Regra prática: o que fazer quando estiver na dúvida</h2>
          <ul>
            <li><strong>Entre dois tamanhos → escolha o maior.</strong> Scrub folgado é confortável; scrub apertado é insuportável depois de 4 horas de trabalho.</li>
            <li><strong>Busto e quadril com tamanhos diferentes →</strong> use o maior dos dois como referência principal.</li>
            <li><strong>Tecido com elastano (two way):</strong> pode comprar o tamanho exato — a elasticidade dá margem de 2–3 cm.</li>
            <li><strong>Tecido sem elastano (gabardine, oxfordine):</strong> suba um tamanho se estiver na fronteira da tabela.</li>
          </ul>

          <h2>Tabela de comprimento — blusa e calça</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Tamanho</th>
                  <th className="border border-[#ddd] p-3 text-center">Comprimento blusa (cm)</th>
                  <th className="border border-[#ddd] p-3 text-center">Comprimento calça (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3">PP / P</td>
                  <td className="border border-[#ddd] p-3 text-center">62–64</td>
                  <td className="border border-[#ddd] p-3 text-center">96–98</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">M / G</td>
                  <td className="border border-[#ddd] p-3 text-center">64–66</td>
                  <td className="border border-[#ddd] p-3 text-center">98–100</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3">GG / G1</td>
                  <td className="border border-[#ddd] p-3 text-center">66–68</td>
                  <td className="border border-[#ddd] p-3 text-center">100–102</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">G2 / G3</td>
                  <td className="border border-[#ddd] p-3 text-center">68–70</td>
                  <td className="border border-[#ddd] p-3 text-center">102–104</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Quer aprofundar?</h2>
          <p>
            Com o tamanho na mão, o próximo passo é escolher o tecido e o modelo certos para sua rotina. Veja nosso <Link href="/blog/scrub-feminino-guia-completo">guia completo de scrub feminino</Link> ou acesse diretamente:
          </p>
          <ul>
            <li><Link href="/blog/melhores-tecidos-scrub-feminino">Melhores tecidos para scrub feminino</Link></li>
            <li><Link href="/blog/scrub-feminino-acinturado">Scrub feminino acinturado: elegância e conforto</Link></li>
            <li><Link href="/blog/scrub-feminino-plus-size">Scrub feminino plus size: modelos que valorizam</Link></li>
            <li><Link href="/blog/scrub-feminino-gravidas">Scrub feminino para grávidas</Link></li>
          </ul>

          <h2>Dúvidas frequentes</h2>

          <h3>Como medir para comprar scrub feminino online?</h3>
          <p>Meça busto (parte mais larga do seio), cintura (parte mais estreita) e quadril (parte mais larga). Compare os três valores com a tabela da peça específica.</p>

          <h3>Tamanho G de scrub é o mesmo que G de jaleco?</h3>
          <p>Não necessariamente — cada marca tem tabela própria. Sempre compare suas medidas reais com a tabela da peça.</p>

          <h3>Devo comprar maior ou menor quando estou em dúvida?</h3>
          <p>Sempre o maior. Scrub folgado permite movimento livre; scrub apertado incomoda durante todo o plantão.</p>

          <h3>Scrub plus size tem tabela diferente?</h3>
          <p>Sim. As proporções entre busto, cintura e quadril nos tamanhos G1, G2 e G3 são recalculadas — não é só ampliar o tamanho G. Compare sempre com a tabela da peça.</p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Ver scrubs femininos na Jaleca:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Coleção Scrub Feminino
            </Link>
            <Link href="/blog/scrub-feminino-guia-completo" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Guia Completo Scrub Feminino
            </Link>
            <Link href="/medidas" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Tabela de Medidas Jaleca
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
