import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Como Lavar Jaleco Branco Sem Amarelado: Guia Completo | Jaleca',
  description: 'Como lavar jaleco branco sem amarelado: temperatura certa, sabão ideal, como tirar manchas de sangue, caneta e iodo. Guia completo para durar mais.',
  alternates: { canonical: 'https://jaleca.com.br/blog/como-lavar-jaleco-branco' },
  openGraph: {
    title: 'Como Lavar Jaleco Branco Sem Amarelado: Guia Completo',
    description: 'Temperatura certa, sabão ideal, manchas de sangue/caneta/iodo — tudo que você precisa saber para manter o jaleco branco.',
    url: 'https://jaleca.com.br/blog/como-lavar-jaleco-branco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Como Lavar Jaleco Branco Sem Amarelado: Guia Completo',
  description: 'Temperatura certa, sabão ideal e como tirar manchas de sangue, caneta e iodo do jaleco branco.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/como-lavar-jaleco-branco',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual a temperatura certa para lavar jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Entre 30°C e 40°C. Temperatura acima de 40°C amarela tecidos de poliéster e tergal, e encolhe os de algodão. Para jalecos com elastano, 30°C é o ideal para preservar a elasticidade.' },
    },
    {
      '@type': 'Question',
      name: 'Pode usar água sanitária para lavar jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não. O alvejante clorado (água sanitária) enfraquece as fibras e deixa o tecido amarelado com o tempo — o contrário do efeito desejado. Use alvejante óptico (não clorado) uma vez por mês para manter o branco.' },
    },
    {
      '@type': 'Question',
      name: 'Como tirar mancha de sangue do jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Agua fria imediatamente — nunca quente. A água quente coagula a proteína do sangue e fixa a mancha definitivamente. Esfregue com sabão neutro em água fria antes de lavar normalmente.' },
    },
    {
      '@type': 'Question',
      name: 'Como tirar o amarelado do jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Molho de 30 minutos com bicarbonato de sódio (2 colheres) + detergente líquido antes da lavagem normal. Para amarelado intenso, use alvejante óptico (não clorado) diluído em água morna por 1 hora.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Como Lavar Jaleco Branco', item: 'https://jaleca.com.br/blog/como-lavar-jaleco-branco' },
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
          <span className="text-foreground">Como Lavar Jaleco Branco</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Como Lavar Jaleco Branco Sem Amarelado: Guia Completo
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Temperatura certa, sabão ideal e como tirar manchas de sangue, caneta e iodo — tudo para manter o jaleco branco durando mais.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            O jaleco branco é indispensável — mas manter ele branco é outra história. Manchas de medicamento, amarelamento após lavagens e odores são os problemas mais comuns. Um guia direto para lavar corretamente e preservar o branco original.
          </p>

          <h2>O que nunca fazer com jaleco branco</h2>
          <p>
            <strong>Água quente acima de 40°C</strong> amarela o tecido de poliéster e encolhe o algodão.<br />
            <strong>Alvejante clorado (água sanitária)</strong> enfraquece as fibras e deixa o tecido amarelado com o tempo — o contrário do efeito esperado.<br />
            <strong>Secadora em temperatura alta</strong> amassa e deforma o caimento do jaleco slim.<br />
            <strong>Amaciante</strong> cria película que retém manchas e odores com o uso contínuo.
          </p>

          <h2>Temperatura certa: 30°C a 40°C</h2>
          <p>
            Para jalecos de tergal (poliéster/viscose) e tecidos com elastano, a temperatura ideal é 30°C a 40°C. Acima disso, o tecido perde elasticidade e a cor branca começa a ceder para um amarelo-creme irreversível.
          </p>

          <h2>Sabão ou detergente: qual usar</h2>
          <p>
            Sabão em pó convencional funciona bem para algodão puro. Para tergal e elastano, prefira sabão líquido — dissolve melhor em água fria e não deixa resíduo branco. Evite amaciante: ele cria uma película que retém manchas e odores com o tempo.
          </p>

          <h2>Como tirar manchas específicas do jaleco branco</h2>
          <p>
            <strong>Manchas de sangue:</strong> água fria imediatamente — nunca quente. Água quente coagula a proteína e fixa a mancha definitivamente. Esfregue com sabão neutro em água fria antes de lavar.<br />
            <strong>Manchas de caneta/esferográfica:</strong> álcool isopropílico ou removedor de esmalte sem acetona em pano limpo. Dab (pressionar) — nunca esfregar, para não espalhara mancha.<br />
            <strong>Manchas de medicamento/iodo:</strong> hipoclorito de sódio diluído (1:10 em água) em aplicação pontual com cotonete, nunca na peça inteira.<br />
            <strong>Amarelado geral:</strong> molho de 30 minutos com 2 colheres de bicarbonato de sódio + detergente líquido antes da lavagem normal.
          </p>

          <h2>Secagem: sem sol direto</h2>
          <p>
            Sol direto amarela e enfraquece tecidos brancos. Seque à sombra em cabide — isso também preserva o caimento. Para jalecos slim, nunca estenda deitado (deforma o corte).
          </p>

          <h2>Como manter o branco original por mais tempo</h2>
          <p>
            Lavar após cada uso (não acumular sujeira). Virar ao avesso na lavagem (preserva a superfície do tecido). Guardar em local arejado, longe de plástico. Usar alvejante óptico — não clorado — uma vez por mês como manutenção preventiva.
          </p>

          <h2>Jaleco com bordado: cuidado extra</h2>
          <p>
            Jalecos com bordado de nome ou logotipo devem ser lavados ao avesso e com temperatura mais baixa (30°C). O calor do ferro ou secadora pode derreter o backing do bordado e manchar o tecido ao redor.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido: qual usar no trabalho</Link>
              <Link href="/blog/jaleco-colorido-permitido-hospital-regras" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido é permitido no hospital? O que cada conselho diz</Link>
              <Link href="/jaleco-branco" className="text-[#c4a97d] hover:underline text-sm">→ Ver jalecos brancos disponíveis</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos brancos que mantêm o caimento</h3>
          <p className="text-muted-foreground mb-4">Tecidos premium que lavam bem e duram mais. Do PP ao G3.</p>
          <Link href="/jaleco-branco" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Brancos →
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
