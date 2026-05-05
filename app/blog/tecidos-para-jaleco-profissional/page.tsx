import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tecidos para Jaleco: Qual é o Melhor para Cada Profissional? | Jaleca',
  description: 'Guia completo dos tecidos de jaleco profissional: gabardine, elastex com elastano, Oxford premium e antimicrobiano. Qual escolher para plantão, consultório ou faculdade.',
  keywords: 'tecido para jaleco, jaleco tecido antimicrobiano, jaleco com elastano, jaleco que não amassa, qual tecido jaleco médico, tecido jaleco profissional, jaleco stretch',
  alternates: { canonical: 'https://jaleca.com.br/blog/tecidos-para-jaleco-profissional' },
  openGraph: {
    title: 'Tecidos para Jaleco: Guia Completo para Escolher o Certo',
    description: 'Gabardine, elastex, Oxford e antimicrobiano: qual tecido de jaleco escolher para cada situação?',
    url: 'https://jaleca.com.br/blog/tecidos-para-jaleco-profissional',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tecidos para Jaleco: Guia Completo para Escolher o Certo',
  description: 'Guia completo dos tecidos de jaleco profissional: gabardine, elastex, Oxford e antimicrobiano.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/og-home.jpg' } },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/tecidos-para-jaleco-profissional',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual tecido de jaleco não amassa?',
      acceptedAnswer: { '@type': 'Answer', text: 'Gabardine com composição de 65% poliéster ou mais é o mais resistente ao amassado. O poliéster tem memória de forma — volta ao estado original sem precisar de ferro após a lavagem. Tecidos com alto teor de viscose ou algodão amassam muito mais e exigem passagem frequente.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco com elastano é melhor para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O elastano (lycra) adiciona stretch ao tecido — geralmente 3 a 5% na composição já fazem diferença para quem fica 8 a 12 horas em pé, agacha, inclina e realiza procedimentos. O elastano não compromete a aparência profissional e melhora significativamente o conforto em jornadas longas.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco antimicrobiano vale a pena?',
      acceptedAnswer: { '@type': 'Answer', text: 'O tratamento antimicrobiano inibe a proliferação de bactérias no tecido — útil para quem tem contato frequente com pacientes infecciosos. A eficácia diminui com as lavagens (geralmente dura 30 a 50 ciclos). Para uso cotidiano em consultório sem exposição de alto risco, o gabardine comum é suficiente e mais econômico.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco com tecido fino ou grosso?',
      acceptedAnswer: { '@type': 'Answer', text: 'Gramatura (g/m²) define a espessura. Para consultório com ar condicionado: 150-165 g/m² é confortável e com bom caimento. Para ambientes externos ou sem climatização: 200+ g/m² mantém melhor a estrutura. Tecidos muito finos (abaixo de 130 g/m²) ficam transparentes e perdem o caimento rápido.' },
    },
    {
      '@type': 'Question',
      name: 'Como saber a gramatura do tecido do jaleco?',
      acceptedAnswer: { '@type': 'Answer', text: 'A gramatura deve estar informada na descrição do produto. Se não estiver, é um sinal de que a loja não conhece bem o que vende. Bons fabricantes informam a composição (% de poliéster, viscose, elastano) e a gramatura (g/m²) de cada modelo. Essas informações são essenciais para comparar qualidade entre modelos.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Tecidos para Jaleco Profissional', item: 'https://jaleca.com.br/blog/tecidos-para-jaleco-profissional' },
  ],
}

export default function BlogPost() {
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
          <span className="text-foreground">Tecidos para Jaleco</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />5 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />7 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Tecidos para Jaleco: Guia Completo para Escolher o Certo
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Gabardine, elastex, Oxford ou antimicrobiano — entenda o que cada tecido entrega e qual se encaixa na sua rotina profissional.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Por que o tecido é tão importante</h2>
          <p>
            O tecido determina três coisas que impactam diretamente sua jornada: conforto durante horas de uso, aparência profissional ao longo do dia e durabilidade após dezenas de lavagens. Dois jalecos com o mesmo modelo e preço parecido podem ter desempenhos completamente diferentes se os tecidos forem distintos.
          </p>
          <p>
            Antes de comprar, verifique a composição (% de poliéster, viscose, elastano) e a gramatura (g/m²). Essas informações são o cartão de visitas técnico do tecido — um bom fabricante sempre as informa.
          </p>

          <h2>Gabardine: o clássico profissional</h2>
          <p>
            O gabardine é o tecido mais usado em jalecos profissionais brasileiros. Composição típica: 65% poliéster + 35% viscose, com gramatura entre 150 e 200 g/m². O poliéster garante resistência ao amassado e durabilidade na cor; a viscose dá leveza e melhora o caimento.
          </p>
          <p>
            <strong>Vantagens:</strong> não amassa, mantém o branco após muitas lavagens, seca rápido, fácil de lavar em casa. <strong>Desvantagens:</strong> sem elastano, pode ser restritivo para movimentos muito amplos em jornadas longas.
          </p>
          <p><strong>Indicado para:</strong> consultório, ambulatório, faculdade, laboratório.</p>

          <h2>Elastex com elastano: conforto para plantão</h2>
          <p>
            O Elastex é um gabardine com adição de elastano (lycra) — geralmente 3 a 5% na composição. Esse pequeno percentual transforma completamente a experiência: o tecido acompanha o movimento do corpo em todas as direções sem restringir.
          </p>
          <p>
            Para quem fica 8 a 12 horas em pé, agacha em procedimentos ou faz movimentos repetitivos, o elastano faz diferença real. O caimento permanece impecável mesmo após horas de uso. <Link href="/blog/jaleco-slim-feminino" className="text-[#1a6fa8] hover:underline">O jaleco slim feminino</Link> da Jaleca usa exatamente essa composição.
          </p>
          <p><strong>Indicado para:</strong> plantão, pronto-socorro, UTI, cirurgia ambulatorial.</p>

          <h2>Oxford premium: elegância e durabilidade</h2>
          <p>
            O Oxford é um tecido de trama mais encorpada, com gramatura geralmente entre 200 e 240 g/m². Tem textura levemente estruturada que confere aparência mais formal e sofisticada — próxima de um jaleco de alfaiataria. Mantém a forma melhor do que o gabardine em situações de uso intenso.
          </p>
          <p>
            <strong>Vantagens:</strong> aparência premium, alta durabilidade, estrutura que não cede com o tempo. <strong>Desvantagens:</strong> mais pesado, pode ser mais quente em climas tropicais, preço mais alto.
          </p>
          <p><strong>Indicado para:</strong> consultório particular de alto padrão, professores universitários, gestores de saúde.</p>

          <h2>Tecido antimicrobiano: quando vale a pena</h2>
          <p>
            O tratamento antimicrobiano é aplicado sobre o tecido base (geralmente gabardine) e inibe a proliferação de bactérias, fungos e odores. A eficácia varia conforme o fabricante — tratamentos de qualidade resistem entre 30 e 50 ciclos de lavagem.
          </p>
          <p>
            Para a maioria dos profissionais que lavam o jaleco regularmente, o tratamento antimicrobiano agrega valor limitado — a lavagem já elimina os microrganismos. A indicação mais clara é para quem trabalha em ambientes de alto risco microbiológico (UTI, infectologia, microbiologia laboratorial) ou tem contato muito frequente com pacientes infecciosos.
          </p>
          <p><strong>Indicado para:</strong> infectologistas, microbiologistas, enfermeiras de UTI, profissionais de biossegurança.</p>

          <h2>Comparativo: qual tecido para cada situação</h2>
          <table>
            <thead>
              <tr>
                <th>Situação</th>
                <th>Tecido recomendado</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Consultório climatizado</td><td>Gabardine 150-165 g/m²</td></tr>
              <tr><td>Plantão 12h em pé</td><td>Elastex com elastano</td></tr>
              <tr><td>Consultório premium</td><td>Oxford 200+ g/m²</td></tr>
              <tr><td>Faculdade / uso intenso</td><td>Gabardine 60%+ poliéster</td></tr>
              <tr><td>Alto risco microbiológico</td><td>Antimicrobiano + gabardine</td></tr>
              <tr><td>Clima quente / tropical</td><td>Gabardine leve com viscose</td></tr>
            </tbody>
          </table>

          <p>
            Para cuidados com o tecido após a compra, veja: <Link href="/blog/como-lavar-jaleco-branco" className="text-[#1a6fa8] hover:underline">como lavar jaleco branco sem amarelado</Link>.
          </p>
        </div>

        <div className="mt-10 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Aprofunde-se no tema:</p>
          <div className="flex flex-col gap-2">
            <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: o modelo com elastano</Link>
            <Link href="/blog/como-lavar-jaleco-branco" className="text-[#c4a97d] hover:underline text-sm">→ Como lavar jaleco branco sem amarelado</Link>
            <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher jaleco feminino: guia completo</Link>
            <Link href="/blog/jaleco-ou-scrub-consultorio" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco ou scrub: qual usar no consultório?</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Escolha o jaleco com o tecido certo</h3>
          <p className="text-muted-foreground mb-4">
            Gabardine clássico, Elastex com elastano e Oxford premium — com composição e gramatura informadas em cada modelo.
          </p>
          <Link
            href="/categoria/jalecos"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]"
          >
            Ver Jalecos
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
