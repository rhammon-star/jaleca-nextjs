import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scrub Feminino Plus Size: Modelos que Valorizam seu Corpo',
  description: 'Guia completo de scrub feminino plus size: como escolher o modelo certo, tabela de medidas, tecidos que valorizam e onde comprar com qualidade.',
  keywords: 'scrub feminino plus size, scrub plus size saude, uniforme saude plus size, jaleco plus size, scrub tamanho grande enfermagem',
  alternates: { canonical: 'https://jaleca.com.br/blog/scrub-feminino-plus-size' },
  openGraph: {
    title: 'Scrub Feminino Plus Size: Modelos que Valorizam seu Corpo',
    description: 'Como escolher o scrub feminino plus size ideal: tecidos, modelagens e dicas.',
    url: 'https://jaleca.com.br/blog/scrub-feminino-plus-size',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Até qual tamanho vai o scrub feminino plus size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Na Jaleca, os scrubs femininos vão até o tamanho EXG (extra grande), que equivale a manequim 52-54. Para encontrar o tamanho certo, sempre compare suas medidas de busto, cintura e quadril com a tabela de medidas da peça específica.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual modelagem de scrub é melhor para plus size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scrubs com corte semi-acinturado ou com elástico na parte de trás da calça tendem a valorizar mais o corpo plus size. Evite modelos muito retos (caixas) que escondem as curvas ou modelos muito colados que podem ficar desconfortáveis.',
      },
    },
    {
      '@type': 'Question',
      name: 'O tecido two way funciona bem para plus size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, o two way (poliéster + elastano) é excelente para plus size por ser flexível e se adaptar ao corpo sem pressionar. Ele oferece conforto máximo durante longos plantões e não restringe os movimentos.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scrub Feminino Plus Size: Modelos que Valorizam seu Corpo',
  description: 'Guia completo para escolher o scrub feminino plus size ideal.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/scrub-feminino-plus-size',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80',
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
          <span className="text-foreground">Scrub Feminino Plus Size</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Scrub Feminino Plus Size: Modelos que Valorizam seu Corpo
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Encontrar scrub plus size de qualidade, com modelagem que valorize e tecido confortável para um plantão inteiro — esse guia vai te ajudar nisso.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"
            alt="Profissional de saúde com scrub feminino"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Encontrar um <Link href="/scrub-feminino">scrub feminino</Link> plus size que seja confortável, bonito e durável ainda é um desafio real para muitas profissionais de saúde. Modelos mal cortados, tecidos que puxam, números que não batem — a frustração é comum.
          </p>
          <p>
            Esse guia vai te mostrar o que realmente importa na hora de escolher um scrub plus size de qualidade.
          </p>

          <h2>O que torna um scrub plus size de qualidade?</h2>
          <p>
            Três fatores fazem toda a diferença:
          </p>
          <ul>
            <li><strong>Modelagem proporcional:</strong> Um scrub plus size de qualidade não é apenas um tamanho G maior — a proporção entre busto, cintura e quadril precisa ser pensada para corpos com mais volume.</li>
            <li><strong>Tecido com elasticidade:</strong> Tecidos que se adaptam ao corpo (two way, gabardine com elastano) são muito mais confortáveis para usar por horas a fio.</li>
            <li><strong>Costuras reforçadas:</strong> Em tamanhos maiores, as costuras trabalham mais. Peças de qualidade têm costura dupla nas regiões de maior tensão.</li>
          </ul>

          <h2>Melhor modelagem para scrub plus size</h2>

          <h3>Semi-acinturado</h3>
          <p>
            É a modelagem mais recomendada. Marca levemente a cintura sem apertar, valoriza as curvas e dá um visual mais profissional do que um corte reto. A blusa tem um leve franzido ou recorte na lateral que cria a ilusão de cintura.
          </p>

          <h3>Corte reto com elástico traseiro</h3>
          <p>
            Para quem prefere mais liberdade de movimento. A calça com elástico na parte de trás (e cordão na frente) é muito confortável para corpos mais volumosos e se ajusta melhor do que o elástico total.
          </p>

          <h3>Evite: modelos muito justos ou muito largos</h3>
          <p>
            Um scrub que aperta no busto ou na coxa vai ser insuportável depois de 4 horas. Mas um que é largo demais perde todo o profissionalismo e pode até ser um risco de segurança (ficar preso em equipamentos). O meio-termo é o caminho.
          </p>

          <h2>Melhores tecidos para scrub plus size</h2>

          <h3>Two Way (Poliéster + Elastano)</h3>
          <p>
            A melhor escolha. O elastano se adapta ao corpo, não pressiona e oferece liberdade total de movimento. É especialmente confortável durante plantões longos em que o corpo pode reter líquido e a roupa precisa ter margem de expansão.
          </p>

          <h3>Gabardine Premium</h3>
          <p>
            Ótimo para quem quer visual mais elegante e formal. Tem boa queda e dissimula bem curvas irregulares. É mais encorpado, então prefira em ambientes climatizados.
          </p>

          <h2>Como medir para comprar scrub plus size online</h2>
          <p>
            Não confie em P, M, G, GG sem checar as medidas. Cada marca tem tabela própria. Siga estes passos:
          </p>
          <ol>
            <li>Use uma fita métrica flexível (de costura, não de ferramentas)</li>
            <li>Meça o busto na parte mais larga do seio, sem apertar</li>
            <li>Meça a cintura na parte mais estreita do abdômen</li>
            <li>Meça o quadril na parte mais larga dos quadris</li>
            <li>Compare com a tabela de medidas da peça — não do tamanho geral da marca</li>
          </ol>
          <p>
            Em caso de dúvida entre dois tamanhos, prefira o maior para conforto. Um scrub folgado pode ser arrumado; um apertado não tem solução.
          </p>

          <h2>Cores que valorizam o corpo plus size</h2>
          <p>
            Cores sólidas e escuras (azul marinho, preto, vinho, verde escuro) têm efeito visualmente mais slim. Isso não quer dizer que você não possa usar cores claras ou estampas — mas se esse é um critério importante pra você, as cores escuras são o caminho.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>Até qual tamanho vai o scrub feminino plus size?</h3>
          <p>
            Na Jaleca, os scrubs femininos vão até o tamanho EXG (manequim 52-54). Sempre compare suas medidas com a tabela da peça específica para maior precisão.
          </p>

          <h3>Qual modelagem de scrub é melhor para plus size?</h3>
          <p>
            Scrubs com corte semi-acinturado ou calça com elástico traseiro tendem a valorizar mais. Evite modelos muito retos ou muito colados.
          </p>

          <h3>O tecido two way funciona bem para plus size?</h3>
          <p>
            Sim — é o tecido mais recomendado por ser flexível, se adaptar ao corpo e oferecer conforto máximo em plantões longos.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Scrubs Femininos
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
            <Link href="/blog/scrub-feminino-colorido" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Colorido
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
