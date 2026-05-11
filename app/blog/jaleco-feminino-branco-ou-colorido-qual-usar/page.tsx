import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino Branco ou Colorido: Qual Usar no Trabalho',
  description: 'Branco é obrigatório ou o colorido já é aceito? Regras por conselho de saúde, quando cada cor faz sentido e como escolher com confiança.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino-branco-ou-colorido-qual-usar' },
  openGraph: {
    title: 'Jaleco Feminino Branco ou Colorido: Qual Usar no Trabalho',
    description: 'Branco obrigatório ou colorido aceito? Regras por especialidade e dicas para escolher a cor certa do jaleco feminino.',
    url: 'https://jaleca.com.br/jaleco-feminino-branco-ou-colorido-qual-usar',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino Branco ou Colorido: Qual Usar no Trabalho',
  description: 'Quando o branco é obrigatório e quando o colorido é aceito — guia por especialidade e conselho de saúde.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/jaleco-feminino-branco-ou-colorido-qual-usar',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Médica pode usar jaleco colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende do ambiente. Em hospitais públicos, UPAs e ambientes com protocolo de biossegurança formal, o branco geralmente é exigido. Em consultórios médicos particulares, o CFM não impõe restrição de cor — a decisão é da clínica ou do profissional. Muitas médicas de consultório particular já usam jaleco em cores neutras como cinza, bege e até azul escuro.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco preto é adequado para profissionais de saúde?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, em muitos contextos. O jaleco preto ganhou espaço em clínicas particulares de alto padrão, biomédicos, esteticistas e tatuadores. Tem visual premium, esconde respingos de produtos e é fácil de combinar. Em ambientes hospitalares formais ou onde há protocolo de identificação por cor, verificar se o preto é permitido antes de usar.' },
    },
    {
      '@type': 'Question',
      name: 'Qual cor de jaleco é mais profissional para nutricionista?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não existe uma regra única — o CFN não determina cor obrigatória. Nutricionistas costumam optar por verde (associação com saúde e natureza), azul claro (transmite calma e confiança) ou branco (neutro e clássico). O mais importante é que o jaleco esteja limpo, bem conservado e com o CRN visível. A cor deve combinar com a identidade visual da clínica ou consultório.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Branco ou Colorido', item: 'https://jaleca.com.br/jaleco-feminino-branco-ou-colorido-qual-usar' },
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
          <span className="text-foreground">Jaleco Branco ou Colorido</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino Branco ou Colorido: Qual Usar no Trabalho
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            O branco ainda é exigência em muitas instituições — mas o colorido avança. A resposta certa depende do ambiente, não da preferência.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            Uma das dúvidas mais comuns de profissionais de saúde na hora de comprar jaleco feminino é sobre a cor. O branco ainda é exigência em muitas instituições — mas o colorido avança nas clínicas privadas, consultórios de especialidade e espaços de bem-estar. A resposta certa depende do ambiente, não da preferência.
          </p>

          <h2>Quando o branco ainda é obrigatório</h2>
          <p>
            Hospitais públicos, UPAs, pronto-socorros e ambientes com protocolo de biossegurança formal geralmente exigem jaleco branco ou de cor clara. Isso acontece porque a cor clara facilita a identificação visual de contaminação — mancha visível é sinal de troca imediata. Em concursos públicos e residências médicas, o branco costuma ser padrão.
          </p>

          <h2>Onde o colorido já é aceito (e bem-vindo)</h2>
          <p>
            Consultórios de nutrição, psicologia, fisioterapia, odontologia pediátrica e espaços de estética têm adotado jalecos coloridos como parte da identidade visual da clínica. O jaleco na cor da marca transmite profissionalismo e diferencia o espaço. Nutricionistas costumam optar por verde, azul ou rosa; clínicas de estética preferem lilás ou off-white.
          </p>

          <h2>O jaleco preto existe e é muito usado</h2>
          <p>
            O preto ganhou espaço especialmente em clínicas particulares de alto padrão e em profissionais como biomédicos, tatuadores e esteticistas. Tem visual premium, esconde respingos de produtos e é fácil de combinar. A Jaleca tem o Slim Tradicional e o Slim Gold disponíveis em preto.
          </p>

          <h2>Regra prática para decidir</h2>
          <p>
            Antes de escolher a cor, verifique: seu conselho regional ou empregador tem regra explícita sobre cor de jaleco? Se sim, siga. Se não, escolha com base no que sua clínica comunica. Consultório clean e moderno pede cores neutras ou branco. Ambiente descontraído aceita cores vibrantes sem problema.
          </p>

          <h2>Cor não substitui o corte</h2>
          <p>
            A escolha da cor importa, mas o caimento é o que define o visual do dia a dia. Um jaleco colorido bem cortado tem mais impacto do que um branco genérico e largo.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o jaleco certo para cada especialidade</Link>
              <Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Como manter jaleco branco sempre impecável</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos femininos em branco, preto e 10 cores</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional, Elastex, Gold, Princesa — do PP ao G3. Escolha a cor que combina com a sua clínica.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      
          <div className="mt-6 pt-6 border-t border-border">
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm block">→ Coleção completa de jaleco feminino</Link>
          </div>
        </article>
    </>
  )
}
