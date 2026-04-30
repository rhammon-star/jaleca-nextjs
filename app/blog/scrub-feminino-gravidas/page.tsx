import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scrub Feminino para Grávidas: Conforto e Praticidade na Gestação',
  description: 'Como escolher o scrub feminino ideal durante a gravidez: tecidos, modelagens, dicas de conforto e quando fazer a troca de tamanho.',
  keywords: 'scrub feminino gravida, uniforme saude gestante, scrub gestante enfermagem, uniforme gestante medica, roupa trabalho gravida saude',
  alternates: { canonical: 'https://jaleca.com.br/blog/scrub-feminino-gravidas' },
  openGraph: {
    title: 'Scrub Feminino para Grávidas: Conforto e Praticidade na Gestação',
    description: 'Guia completo de scrub feminino para gestantes: conforto, tecidos e modelagens.',
    url: 'https://jaleca.com.br/blog/scrub-feminino-gravidas',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quando devo trocar para scrub maior durante a gravidez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Geralmente entre o 4º e 5º mês de gestação, quando a barriga começa a crescer mais visivelmente. Mas cada corpo é diferente — o sinal mais claro é quando o scrub atual começa a apertar no abdômen ou dificultar o movimento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual tecido de scrub é melhor para grávidas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O two way (poliéster com elastano) é o mais indicado por se adaptar ao crescimento da barriga ao longo da gestação. O algodão (tricoline) também é uma boa opção para quem tem calor excessivo durante a gravidez.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso usar scrub normal durante a gravidez?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, especialmente no primeiro trimestre. A partir do segundo trimestre, você vai precisar de um tamanho maior. Opte por modelos com elástico no cós e tecido com elastano para maior adaptação ao crescimento da barriga.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scrub Feminino para Grávidas: Conforto e Praticidade na Gestação',
  description: 'Como escolher o scrub feminino ideal durante a gravidez.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/scrub-feminino-gravidas',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80',
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
          <span className="text-foreground">Scrub para Grávidas</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Scrub Feminino para Grávidas: Conforto e Praticidade na Gestação
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Trabalhar na área da saúde durante a gestação exige uniforme que acompanhe o corpo em cada fase. Veja como escolher o scrub certo para cada trimestre.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80"
            alt="Profissional de saúde grávida em ambiente clínico"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Muitas profissionais de saúde continuam trabalhando com <Link href="/scrub-feminino">scrub feminino</Link> durante toda a gestação. Com as escolhas certas de modelagem e tecido, é completamente possível manter o conforto e a segurança do primeiro ao terceiro trimestre.
          </p>

          <h2>1º Trimestre: scrub normal ainda funciona</h2>
          <p>
            No primeiro trimestre, as mudanças físicas ainda são discretas para a maioria das gestantes. Seu scrub atual provavelmente ainda cabe bem. O que pode começar a incomodar é:
          </p>
          <ul>
            <li>Elástico no cós apertando no abdômen</li>
            <li>Calor excessivo (náuseas e variações hormonais aumentam a sensação térmica)</li>
            <li>Sensibilidade ao toque em tecidos mais rígidos</li>
          </ul>
          <p>
            Dica: se o seu scrub tem elástico completo na calça, ele provavelmente vai durar o primeiro trimestre sem problema. Se tiver botão ou zíper fixo, pode apertar antes.
          </p>

          <h2>2º Trimestre: hora de pensar no tamanho maior</h2>
          <p>
            Entre o 4º e 5º mês, a barriga começa a crescer de forma mais evidente. É nesse momento que a maioria das profissionais precisa migrar para um tamanho maior.
          </p>
          <p>
            <strong>Recomendação:</strong> suba um tamanho para a blusa e possivelmente dois para a calça, dependendo do biotipo. Prefira calças com elástico completo — muito mais confortáveis à medida que a barriga cresce.
          </p>

          <h2>3º Trimestre: conforto acima de tudo</h2>
          <p>
            No terceiro trimestre, o foco é 100% no conforto. A barriga está no seu maior volume, os movimentos são mais limitados e o calor corporal tende a ser maior.
          </p>
          <p>
            Nessa fase, muitas gestantes sobem mais um tamanho ou optam por blusas um pouco maiores para cobrir bem o abdômen sem apertar.
          </p>

          <h2>Qual tecido escolher durante a gravidez?</h2>

          <h3>Two Way (melhor opção)</h3>
          <p>
            O poliéster com elastano é o tecido mais indicado para gestantes. Ele se expande junto com o crescimento da barriga, não pressiona e permite movimento total. Um scrub two way num tamanho maior pode acompanhar a gestação por mais semanas do que um tecido rígido.
          </p>

          <h3>Tricoline (para quem tem muito calor)</h3>
          <p>
            Se você sofre muito com calor durante a gravidez, o tricoline (100% algodão) é uma opção confortável. É mais respirável que o poliéster — mas lembre que não tem elasticidade.
          </p>

          <h3>Evite tecidos muito rígidos</h3>
          <p>
            Gabardine pesado e tecidos sem elastano ficam desconfortáveis rapidamente à medida que a barriga cresce. Reserve-os para o primeiro trimestre ou para peças que têm folga natural na modelagem.
          </p>

          <h2>Modelagem ideal para gestantes</h2>
          <ul>
            <li><strong>Calça com elástico total:</strong> Muito mais confortável que elástico só na parte traseira. Não pressiona a barriga.</li>
            <li><strong>Blusa com corte mais reto ou A-line:</strong> Dá mais espaço para a barriga sem ficar enorme no restante do corpo.</li>
            <li><strong>Evite:</strong> cintura marcada demais ou faixas que cruzam o abdômen.</li>
          </ul>

          <h2>Dica prática: invista em 2 scrubs de gestante</h2>
          <p>
            Em vez de comprar vários scrubs ao longo da gestação, uma estratégia econômica é comprar 2 scrubs dois tamanhos acima do seu tamanho pré-gestação. Eles geralmente cabem do segundo ao terceiro trimestre e muitas vezes ainda servem logo após o parto.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>Quando devo trocar para scrub maior durante a gravidez?</h3>
          <p>
            Geralmente entre o 4º e 5º mês. O sinal é quando o scrub atual começa a apertar no abdômen ou dificultar o movimento.
          </p>

          <h3>Qual tecido de scrub é melhor para grávidas?</h3>
          <p>
            O two way (poliéster com elastano) — se adapta ao crescimento. Algodão (tricoline) é boa opção para quem tem calor excessivo.
          </p>

          <h3>Posso usar scrub normal durante a gravidez?</h3>
          <p>
            Sim, especialmente no primeiro trimestre. A partir do segundo, você vai precisar de tamanho maior — prefira modelos com elástico no cós e tecido com elastano.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Scrubs Femininos
            </Link>
            <Link href="/blog/scrub-feminino-plus-size" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Plus Size
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
