import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco com Elastano Vale a Pena? Diferença Real para Quem Usa o Dia Todo',
  description: 'Jaleco com elastano vale a pena pagar mais? Compare tecido com e sem elastano: conforto, durabilidade, caimento e para quem cada opção faz sentido.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-elastano-vale-a-pena' },
  openGraph: {
    title: 'Jaleco com Elastano Vale a Pena?',
    description: 'Comparação técnica: jaleco com e sem elastano. Para quem o elastano faz diferença real e para quem não faz.',
    url: 'https://jaleca.com.br/blog/jaleco-elastano-vale-a-pena',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco com Elastano Vale a Pena?',
  description: 'Comparação técnica entre jaleco com e sem elastano. Conforto, durabilidade e para quem faz sentido.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  url: 'https://jaleca.com.br/blog/jaleco-elastano-vale-a-pena',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco com elastano dura menos que sem elastano?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não necessariamente — depende do cuidado na lavagem. O elastano degrada com calor excessivo (acima de 60°C), centrifugação em alta rotação e uso de cloro. Com lavagem a 40°C, alvejante sem cloro e secagem à sombra, um jaleco de poliéster/elastano dura tanto ou mais que o equivalente sem elastano. O erro mais comum é lavar a 60°C achando que higieniza melhor — destrói o elastano em poucas lavagens.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a porcentagem ideal de elastano no jaleco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Entre 3% e 8% de elastano é o ponto ideal para jaleco profissional. Abaixo de 3%, o stretch é mínimo — o tecido cede pouco. Acima de 8%, o jaleco começa a parecer "de lycra" e perde o caimento estruturado. O jaleco slim tradicional da Jaleca usa poliéster/viscose com 5% de elastano — suficiente para conforto sem comprometer o visual profissional.' },
    },
    {
      '@type': 'Question',
      name: 'Elastano unidirecional ou bidirecional: qual é melhor para jaleco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Bidirecional. Elastano unidirecional cede apenas em um eixo (horizontal ou vertical). O bidirecional cede nos dois — o que significa que o jaleco acompanha tanto o movimento de levantar o braço (eixo vertical) quanto o de girar o tronco (eixo horizontal). Para profissionais de saúde, o bidirecional é o mínimo recomendado. O Jaleco Elastex da Jaleca usa elastano bidirecional de maior gramatura — o melhor para plantões e procedimentos.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco de algodão é melhor que jaleco de poliéster com elastano?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende do uso. Algodão é melhor para: autoclave (suporta esterilização a vapor), ambientes muito quentes sem ar-condicionado (respira mais) e quem tem sensibilidade a sintéticos. Poliéster com elastano é melhor para: caimento duradouro (não amassa, não estica permanente), lavagem rápida com secagem rápida, visual profissional ao longo de um dia inteiro. A maioria das profissionais de consultório prefere poliéster/elastano pela praticidade.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco com Elastano Vale a Pena', item: 'https://jaleca.com.br/blog/jaleco-elastano-vale-a-pena' },
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
          <span className="text-foreground">Jaleco com Elastano Vale a Pena</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />1 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco com Elastano Vale a Pena?
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Para quem usa jaleco mais de 6 horas por dia: sim, faz diferença real. Para quem usa esporadicamente: o custo adicional pode não compensar. Entenda a diferença técnica.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O que o elastano realmente faz no jaleco</h2>
          <p>
            Elastano (também chamado de lycra ou spandex) é uma fibra sintética que volta à forma original após ser esticada. No jaleco, ele está presente em pequena quantidade — entre 3% e 8% da composição — mas muda completamente o comportamento do tecido.
          </p>
          <p>
            Sem elastano, o tecido cede mas não volta: depois de um dia de uso, o jaleco começa a perder o caimento. Com elastano bidirecional, o tecido cede nas duas direções e retorna à forma — o jaleco do fim do dia parece o do começo.
          </p>

          <h2>Para quem o elastano faz diferença real</h2>
          <ul>
            <li><strong>Jornadas acima de 6 horas:</strong> o acúmulo de movimentos sem elastano resulta em jaleco "puxado" e descaído até o meio do dia</li>
            <li><strong>Profissionais com movimento constante:</strong> fisioterapeutas, enfermeiras de plantão, dentistas — quem agacha, alcança e gira o tronco percebe a diferença imediatamente</li>
            <li><strong>Jaleco slim:</strong> o corte acinturado sem elastano aperta em qualquer movimento maior. Com elastano, o slim funciona — sem ele, o slim prende</li>
            <li><strong>Procedimentos que exigem amplitude:</strong> alcançar acima da cabeça, levantar pacientes, demonstrar exercícios</li>
          </ul>

          <h2>Para quem o elastano não muda muito</h2>
          <ul>
            <li>Jaleco de uso eventual (eventos, apresentações, fotos profissionais)</li>
            <li>Jaleco clássico com muito espaço interno — já tem folga suficiente sem precisar de stretch</li>
            <li>Quem precisa de autoclave — o elastano não suporta esterilização a vapor; use algodão nesses casos</li>
          </ul>

          <h2>Elastano unidirecional vs bidirecional</h2>
          <p>
            <strong>Unidirecional:</strong> cede apenas horizontalmente (ao redor do corpo). Ajuda na cintura e no busto, mas não ajuda no movimento de levantar o braço.
          </p>
          <p>
            <strong>Bidirecional:</strong> cede horizontal e verticalmente. O braço levantado não puxa o ombro do jaleco. O agachamento não estica a costura lateral. É o tipo correto para jaleco profissional de uso intensivo.
          </p>
          <p>
            O Jaleco Elastex da Jaleca usa elastano bidirecional de maior gramatura — desenvolvido especificamente para plantões e procedimentos que exigem amplitude máxima.
          </p>

          <h2>Cuidado que o elastano exige</h2>
          <p>O elastano é sensível a três coisas:</p>
          <ul>
            <li><strong>Temperatura:</strong> máximo 40°C na lavagem. Acima disso, as fibras começam a degradar.</li>
            <li><strong>Cloro:</strong> água sanitária e produtos com hipoclorito destroem o elastano em poucas lavagens. Use apenas alvejante sem cloro (oxigênio ativo).</li>
            <li><strong>Centrifugação alta:</strong> acima de 800 rpm distorce as costuras laterais do slim. Use velocidade baixa ou centrifugação curta.</li>
          </ul>
          <p>Com essas três regras, o jaleco com elastano dura tanto quanto — ou mais que — o equivalente sem elastano.</p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Como lavar jaleco com elastano sem estragar</Link>
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: qual modelo tem mais elastano</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
              <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Coleção completa de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jaleco Elastex — o máximo em elastano bidirecional</h3>
          <p className="text-muted-foreground mb-4">Slim com elastano bidirecional de alta gramatura — PP ao G3, em 12 cores.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jaleco Elastex →
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
  return [{ slug: 'jaleco-elastano-vale-a-pena' }]
}
