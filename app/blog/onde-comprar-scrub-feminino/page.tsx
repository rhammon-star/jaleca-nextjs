import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Onde Comprar Scrub Feminino Barato e de Qualidade Online',
  description: 'Guia completo para comprar scrub feminino online com segurança: o que verificar antes de comprar, como avaliar qualidade e onde encontrar os melhores preços.',
  keywords: 'onde comprar scrub feminino, scrub feminino barato qualidade, comprar scrub online, scrub feminino loja online, melhor loja scrub feminino',
  alternates: { canonical: 'https://jaleca.com.br/blog/onde-comprar-scrub-feminino' },
  openGraph: {
    title: 'Onde Comprar Scrub Feminino Barato e de Qualidade Online',
    description: 'Como comprar scrub feminino online com segurança e qualidade garantida.',
    url: 'https://jaleca.com.br/blog/onde-comprar-scrub-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'É seguro comprar scrub feminino online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, desde que você compre em lojas especializadas em uniformes de saúde, que ofereçam tabela de medidas detalhada, política de troca clara e avaliações de outros compradores. Lojas genéticas tendem a ter qualidade mais incerta.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como saber se o scrub online tem qualidade antes de comprar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Verifique a composição do tecido (precisa estar na descrição), se a loja tem tabela de medidas detalhada por peça, avaliações de clientes com fotos, política de troca e prazo, e se a loja é especializada em uniformes de saúde.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual o preço médio de um bom scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Um scrub feminino de qualidade (blusa + calça) custa entre R$ 120 e R$ 250, dependendo do tecido e da marca. Scrubs muito baratos (abaixo de R$ 80 o conjunto) geralmente usam tecidos de qualidade inferior que não duram.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Onde Comprar Scrub Feminino Barato e de Qualidade Online',
  description: 'Guia completo para comprar scrub feminino online com segurança.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/onde-comprar-scrub-feminino',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
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
          <span className="text-foreground">Onde Comprar Scrub Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Onde Comprar Scrub Feminino Barato e de Qualidade Online
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Comprar scrub online pode sair muito barato — ou pode virar um pesadelo se você não souber o que olhar antes de clicar em &quot;comprar&quot;.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
            alt="Compras online de uniformes de saúde"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            O mercado de <Link href="/scrub-feminino">scrubs femininos</Link> online cresceu muito. Hoje você encontra opções de R$ 60 a R$ 300 — e a diferença entre elas vai muito além do preço.
          </p>
          <p>
            Nesse guia, vamos te mostrar o que verificar antes de comprar, como avaliar qualidade à distância e o que torna uma loja confiável para uniformes de saúde.
          </p>

          <h2>O que verificar antes de comprar scrub online</h2>

          <h3>1. Composição do tecido</h3>
          <p>
            A descrição do produto precisa informar a composição (ex: 97% poliéster, 3% elastano). Se não tiver essa informação, não compre. Você não tem como saber o que vai receber.
          </p>

          <h3>2. Tabela de medidas por peça</h3>
          <p>
            Cada scrub tem medidas próprias. Uma boa loja oferece tabela com busto, cintura, quadril e comprimento para cada peça individualmente — não só o tamanho geral da marca.
          </p>

          <h3>3. Política de troca clara</h3>
          <p>
            Uniforme tem especificidade de tamanho. Antes de comprar, verifique: a loja troca se não servir? Quem paga o frete de devolução? Qual o prazo? Lojas sérias têm essa política bem explicada.
          </p>

          <h3>4. Avaliações com fotos</h3>
          <p>
            Foto de cliente usando a peça diz muito mais do que a foto do produto. Procure avaliações com imagens reais — cores, caimento e espessura do tecido raramente enganam nessas fotos.
          </p>

          <h3>5. Especialização em uniformes de saúde</h3>
          <p>
            Prefira lojas especializadas em uniformes de saúde a lojas genéricas. Uma loja que vende scrubs há anos sabe sobre tecidos técnicos, resistência a lavagens frequentes e modelagens adequadas — uma loja de moda geral, não necessariamente.
          </p>

          <h2>Sinais de alerta ao comprar scrub online</h2>
          <ul>
            <li>Preço muito abaixo do mercado (scrub bom custa a partir de R$ 120 o conjunto)</li>
            <li>Sem informação de composição do tecido</li>
            <li>Sem tabela de medidas ou tabela genérica</li>
            <li>Sem política de troca informada</li>
            <li>Fotos apenas do produto sem uso (foto de catálogo)</li>
            <li>Sem CNPJ ou informações da empresa na página</li>
          </ul>

          <h2>Qual o preço justo de um scrub feminino de qualidade?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Faixa de preço (conjunto)</th>
                  <th className="border border-[#ddd] p-3 text-left">O que esperar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3">Abaixo de R$ 80</td>
                  <td className="border border-[#ddd] p-3">Tecido de baixa qualidade, desbota rápido, costuras fracas</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">R$ 80 – R$ 120</td>
                  <td className="border border-[#ddd] p-3">Qualidade mediana — pode funcionar para uso ocasional</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3">R$ 120 – R$ 200</td>
                  <td className="border border-[#ddd] p-3">Boa qualidade para uso diário — tecidos técnicos, durabilidade ok</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">Acima de R$ 200</td>
                  <td className="border border-[#ddd] p-3">Alta qualidade — tecidos premium, costuras reforçadas, longa durabilidade</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Onde comprar scrub feminino de qualidade</h2>
          <p>
            A Jaleca é uma loja especializada em uniformes para profissionais de saúde. Todos os scrubs têm descrição detalhada de tecido, tabela de medidas por peça e política de troca. Nossa coleção de <Link href="/scrub-feminino">scrub feminino</Link> inclui modelos em gabardine, two way e oxfordine, com modelagens desenvolvidas para o corpo feminino.
          </p>
          <p>
            Se você está buscando um <Link href="/scrub-feminino">scrub feminino</Link> para uso diário, com qualidade comprovada e entrega para todo o Brasil, vale conferir.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>É seguro comprar scrub feminino online?</h3>
          <p>
            Sim, desde que você compre em lojas especializadas com tabela de medidas, política de troca clara e avaliações reais de clientes.
          </p>

          <h3>Como saber se o scrub tem qualidade antes de comprar?</h3>
          <p>
            Verifique a composição do tecido, tabela de medidas por peça, avaliações com fotos e política de troca. Loja que não informa composição do tecido é sinal de alerta.
          </p>

          <h3>Qual o preço médio de um bom scrub feminino?</h3>
          <p>
            Entre R$ 120 e R$ 250 para um conjunto (blusa + calça) de qualidade para uso diário. Abaixo de R$ 80, a qualidade geralmente não sustenta o uso intenso da rotina de saúde.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Scrubs Femininos na Jaleca
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
            <Link href="/blog/como-cuidar-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Como Cuidar do Seu Scrub
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
