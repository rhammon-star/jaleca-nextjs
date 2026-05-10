import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino: Como Descobrir o Tamanho Certo Sem Errar',
  description: 'Como medir busto, cintura e quadril para jaleco feminino Slim. Tabela de tamanhos, o que fazer entre dois tamanhos e por que o ombro é o ponto crítico.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo-como-medir' },
  openGraph: {
    title: 'Jaleco Feminino: Como Descobrir o Tamanho Certo Sem Errar',
    description: 'Guia de medidas para jaleco feminino Slim: busto, cintura, quadril e como escolher entre dois tamanhos.',
    url: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo-como-medir',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino: Como Descobrir o Tamanho Certo Sem Errar',
  description: 'Guia completo de medidas para jaleco feminino: como medir, o que fazer entre dois tamanhos e por que o ombro é decisivo.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo-como-medir',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como saber o tamanho do jaleco feminino?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Para jaleco Slim acinturado, as três medidas importam — não apenas o busto. Compare com a tabela de medidas do modelo escolhido. Em caso de dúvida entre dois tamanhos, sempre opte pelo maior: o corte acinturado tem menos folga por design.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco feminino PP serve em quem?',
      acceptedAnswer: { '@type': 'Answer', text: 'O PP da Jaleca serve para busto até 84cm, cintura até 68cm e quadril até 92cm. É indicado para pessoas de porte pequeno, geralmente com altura entre 1,55m e 1,62m. Para altura acima de 1,65m, o P ou M costuma ter comprimento mais proporcional.' },
    },
    {
      '@type': 'Question',
      name: 'O que fazer se o jaleco fica apertado no ombro?',
      acceptedAnswer: { '@type': 'Answer', text: 'Se o ombro aperta, o tamanho está pequeno — não adianta tentar ajustar por costureira, pois a estrutura do ombro não permite ampliação fácil. A solução é trocar por um tamanho maior. O ombro é o ponto mais crítico no ajuste de jaleco: deve cair exatamente no final do ombro, nem no braço nem no pescoço.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Tamanho Jaleco Feminino', item: 'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo-como-medir' },
  ],
}

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
          <span className="text-foreground">Tamanho Jaleco Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino: Como Descobrir o Tamanho Certo Sem Errar
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Guia direto para medir corretamente e acertar o tamanho do jaleco feminino Slim na primeira compra.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            Escolher o tamanho errado do jaleco feminino é um dos erros mais comuns na hora da compra online. O resultado: jaleco apertado nos ombros, largo demais na cintura ou comprimento desproporcional. Um guia direto para medir corretamente e acertar de primeira.
          </p>

          <h2>As medidas que realmente importam</h2>
          <p>
            Para jaleco feminino com corte acinturado (Slim), as medidas determinantes são três: <strong>busto</strong>, <strong>cintura</strong> e <strong>quadril</strong>. Diferente do jaleco reto, onde o busto resolve, o Slim acompanha a silhueta — então as três precisam estar dentro da faixa do tamanho escolhido.
          </p>

          <h2>Como medir corretamente</h2>
          <p>
            <strong>Busto:</strong> fita métrica passando pela parte mais larga do peito, paralela ao chão. Não apertar.<br />
            <strong>Cintura:</strong> na parte mais estreita do tronco, geralmente 2 dedos acima do umbigo.<br />
            <strong>Quadril:</strong> na parte mais larga dos quadris, geralmente 20 cm abaixo da cintura.
          </p>

          <h2>O que fazer quando estou entre dois tamanhos</h2>
          <p>
            Para jaleco Slim, a regra é: <strong>opte sempre pelo maior</strong>. O corte acinturado tem menos margem de folga por design. Um tamanho a mais ainda vai valorizar a silhueta — um tamanho a menos vai apertar nos movimentos e nas costuras.
          </p>

          <h2>Ombro é o ponto crítico</h2>
          <p>
            A costura do ombro precisa cair exatamente no final do ombro — nem cair para o braço, nem subir para o pescoço. Se o ombro não encaixa, não adianta ajustar o resto. Diferente de cintura e quadril, o ombro não tem como ser alterado facilmente por costureira.
          </p>

          <h2>Comprimento: o que cada altura pede</h2>
          <p>
            O jaleco Jaleca tem comprimento proporcional ao tamanho: nos tamanhos PP e P, o comprimento é menor; nos tamanhos G e G2, é proporcionalmente maior. Para quem tem altura acima de 1,70m, os tamanhos maiores já entregam um comprimento mais adequado sem precisar de ajuste.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o modelo certo para cada especialidade</Link>
              <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido: qual usar no trabalho</Link>
              <Link href="/medidas" className="text-[#c4a97d] hover:underline text-sm">→ Tabela de medidas completa da Jaleca</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver tabela de medidas por modelo</h3>
          <p className="text-muted-foreground mb-4">Do PP ao G3 — cada modelo tem tabela detalhada com busto, cintura, quadril e comprimento.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
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
