import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Colorido é Permitido no Hospital? O Que Cada Conselho Diz',
  description: 'CFM, COFEN, CFO, CFN e COFFITO — o que cada conselho de saúde regulamenta sobre cor de jaleco. Quando o branco é obrigatório e onde o colorido já é padrão.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-colorido-permitido-hospital-regras' },
  openGraph: {
    title: 'Jaleco Colorido é Permitido no Hospital? O Que Cada Conselho Diz',
    description: 'O que CFM, COFEN, CFO e outros conselhos dizem sobre cor de jaleco. Quando o branco é obrigatório e onde o colorido é aceito.',
    url: 'https://jaleca.com.br/blog/jaleco-colorido-permitido-hospital-regras',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Colorido é Permitido no Hospital? O Que Cada Conselho Diz',
  description: 'Guia sobre regulamentação de cor de jaleco por conselho profissional de saúde no Brasil.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-colorido-permitido-hospital-regras',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Médico pode usar jaleco colorido no hospital?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende do hospital. O CFM não impõe cor obrigatória de jaleco. A decisão é da instituição. Hospitais públicos e UPAs geralmente exigem branco por política interna de biossegurança. Em consultórios médicos particulares, o colorido é aceito sem restrição.' },
    },
    {
      '@type': 'Question',
      name: 'Enfermeira pode usar jaleco colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'O COFEN não proíbe jaleco colorido em sua resolução de uniformes (COFEN 358/2009). Porém, alguns CORENs estaduais têm diretrizes próprias. Em hospitais, a política interna define a cor. Em clínicas e consultórios particulares, o colorido geralmente é permitido.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco preto pode ser usado na área da saúde?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, em muitos contextos. Nenhum conselho federal de saúde proíbe o jaleco preto. Ele é comum em clínicas particulares de alto padrão, esteticistas, biomédicos e tatuadores. Em hospitais com código de vestimenta, verifique a política interna antes de usar.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Colorido Hospital', item: 'https://jaleca.com.br/blog/jaleco-colorido-permitido-hospital-regras' },
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
          <span className="text-foreground">Jaleco Colorido no Hospital</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Colorido é Permitido no Hospital? O Que Cada Conselho Diz
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            CFM, COFEN, CFO, CFN — o que cada conselho regulamenta sobre cor de jaleco e quando o branco é realmente obrigatório.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            Uma das dúvidas mais buscadas por profissionais de saúde: jaleco colorido pode ser usado no hospital? A resposta depende do tipo de instituição, do conselho regional e da política interna de cada serviço.
          </p>

          <h2>Não existe lei federal que proíbe o jaleco colorido</h2>
          <p>
            No Brasil, não há legislação federal que determine a cor obrigatória do jaleco para profissionais de saúde. O que existem são resoluções de conselhos profissionais, normas internas de instituições e protocolos de biossegurança — que variam por área e ambiente.
          </p>

          <h2>O que cada conselho diz</h2>
          <p>
            <strong>CFM (Medicina):</strong> não há resolução que exija jaleco branco. A cor fica a critério da instituição.<br />
            <strong>CFO (Odontologia):</strong> não regulamenta cor de jaleco. Consultórios particulares têm liberdade total.<br />
            <strong>COFEN (Enfermagem):</strong> a resolução COFEN 358/2009 trata do uso do uniforme, mas não impõe cor específica — cada COREN estadual pode ter diretrizes próprias.<br />
            <strong>CFN (Nutrição):</strong> não determina cor obrigatória.<br />
            <strong>COFFITO (Fisioterapia):</strong> não regulamenta cor.
          </p>

          <h2>Quando o branco é realmente obrigatório</h2>
          <p>
            O branco geralmente é exigido por <strong>política interna</strong> de hospitais públicos, UPAs e pronto-socorros — não por lei. A justificativa é prática: tecido claro facilita identificação visual de contaminação. Em concursos públicos e residências médicas, o branco costuma ser padrão por regulamento do concurso ou programa.
          </p>

          <h2>Onde o colorido já é padrão</h2>
          <p>
            Clínicas particulares, consultórios de nutrição, fisioterapia, psicologia, odontologia e estética já adotam jaleco colorido como parte da identidade visual. Em pediatria, cores vibrantes são frequentemente preferidas para criar ambiente menos intimidador para crianças.
          </p>

          <h2>Como verificar a regra do seu ambiente</h2>
          <p>
            Antes de comprar um jaleco colorido para uso hospitalar: (1) consulte o manual de normas da instituição, (2) verifique se há resolução do COREN do seu estado, (3) pergunte à chefia de enfermagem ou coordenação médica. Na dúvida, o branco é sempre aceito em qualquer ambiente.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-feminino-branco-ou-colorido-qual-usar" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco ou colorido: qual usar no trabalho</Link>
              <Link href="/blog/jaleco-feminino-como-escolher-modelo-certo-especialidade" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o modelo certo para cada especialidade</Link>
              <Link href="/jaleco-colorido" className="text-[#c4a97d] hover:underline text-sm">→ Ver jalecos coloridos disponíveis</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos em branco, preto e 10 cores</h3>
          <p className="text-muted-foreground mb-4">Escolha a cor que combina com o seu ambiente de trabalho. Do PP ao G3.</p>
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
