import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Masculino: Modelos, Tamanhos e Como Escolher',
  description: 'Guia completo de jaleco masculino para médicos, dentistas e estudantes de medicina. Modelos clássico, slim e manga curta — do PP ao G2, entrega rápida para todo o Brasil.',
  keywords: 'jaleco masculino, jaleco masculino médico, jaleco masculino slim, jaleco para médico, jaleco dentista masculino, jaleco estudante medicina masculino',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-masculino-guia-completo' },
  openGraph: {
    title: 'Jaleco Masculino: Guia Completo para Profissionais da Saúde',
    description: 'Jaleco masculino para médicos, dentistas e estudantes. Modelos clássico, slim e manga curta. Do PP ao G2.',
    url: 'https://jaleca.com.br/blog/jaleco-masculino-guia-completo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Masculino: Guia Completo para Profissionais da Saúde',
  description: 'Guia completo de jaleco masculino: modelos, tamanhos e como escolher para cada especialidade.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/og-home.jpg' } },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/jaleco-masculino-guia-completo',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é jaleco masculino?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jaleco masculino é um avental profissional de comprimento variável (joelho ou abaixo) desenvolvido com corte específico para o biótipo masculino — ombros mais largos, cintura mais reta, manga com amplitude maior. Diferente de adaptações do modelo feminino, o jaleco masculino de qualidade tem molde próprio para cada tamanho da grade.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tamanho de jaleco masculino devo comprar?',
      acceptedAnswer: { '@type': 'Answer', text: 'Meça busto e cintura com fita métrica. Para jaleco masculino, o busto é a medida principal. Confira a tabela do fabricante: PP (busto 88-92 cm), P (92-96), M (96-100), G (100-104), G2 (104-110). Na dúvida entre dois tamanhos, o maior costuma ter melhor caimento — jaleco apertado nos ombros restringe movimento e amassa mais rápido.' },
    },
    {
      '@type': 'Question',
      name: 'Existe jaleco masculino slim?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O jaleco slim masculino tem recortes laterais que definem levemente a silhueta sem ser apertado. É mais elegante que o modelo clássico reto e indicado para médicos e dentistas que trabalham em consultório particular. Para plantões de 12 horas, o modelo clássico com tecido de elastano é mais confortável.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco masculino e feminino?',
      acceptedAnswer: { '@type': 'Answer', text: 'As diferenças são estruturais: ombro (masculino mais largo), manga (circunferência maior), abertura do tórax (mais ampla), cintura (reta no masculino, acinturada no feminino) e comprimento proporcional à altura média de cada gênero. Um jaleco feminino adaptado para o masculino amassa nos ombros, fica curto e aperta na cava.' },
    },
    {
      '@type': 'Question',
      name: 'Médico pode usar jaleco colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'O CFM não regulamenta cor de jaleco — essa definição cabe a cada instituição. Em hospitais públicos e UTIs, o branco é padrão histórico e geralmente obrigatório por regimento interno. Em consultórios particulares e clínicas privadas, jalecos em azul marinho, cinza e preto são aceitos e cada vez mais comuns.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Masculino: Guia Completo', item: 'https://jaleca.com.br/blog/jaleco-masculino-guia-completo' },
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
          <span className="text-foreground">Jaleco Masculino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />5 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />7 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Masculino: Guia Completo para Profissionais da Saúde
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Tudo que você precisa saber para escolher o jaleco masculino certo — modelo, tamanho, tecido e cor para cada especialidade.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Diferença entre jaleco masculino e feminino</h2>
          <p>
            Um jaleco masculino de qualidade não é uma adaptação do modelo feminino com tamanho maior. As diferenças são estruturais: ombros mais largos, manga com circunferência maior, abertura de tórax mais ampla e cintura reta — sem recortes laterais que caracterizam os modelos femininos.
          </p>
          <p>
            Usar um jaleco feminino em tamanho grande resulta em um produto que aperta nos ombros, fica curto no tronco e amassa nos braços. O molde importa tanto quanto o tamanho.
          </p>

          <h2>Modelos de jaleco masculino</h2>

          <h3>Jaleco Clássico — O padrão hospitalar</h3>
          <p>
            O jaleco clássico masculino tem corte reto, manga longa, abertura frontal com botões e dois bolsos. É o modelo aceito em qualquer instituição de saúde — hospitais, prontos-socorros, UTIs e centros cirúrgicos. Produzido em gabardine com gramatura entre 150 e 200 g/m², mantém o caimento mesmo após dezenas de lavagens.
          </p>
          <p><strong>Indicado para:</strong> médicos hospitalares, residentes, estudantes de medicina, farmacêuticos.</p>

          <h3>Jaleco Slim Masculino — Elegância no consultório</h3>
          <p>
            O modelo slim masculino tem recortes laterais sutis que definem levemente a silhueta sem apertar. É mais elegante que o clássico e indicado para quem recebe pacientes em consultório particular — a apresentação importa tanto quanto a competência.
          </p>
          <p><strong>Indicado para:</strong> médicos de consultório, dentistas, dermatologistas, cardiologistas.</p>

          <h3>Jaleco Manga Curta</h3>
          <p>
            O jaleco masculino manga curta é uma opção para climas quentes ou especialidades em que a manga longa interfere nos procedimentos. Importante: em ambientes com risco biológico (NR-32), a manga longa é obrigatória como EPI. Verifique as normas da sua instituição antes de optar pela manga curta.
          </p>
          <p><strong>Indicado para:</strong> dermatologistas, oftalmologistas, profissionais em regiões de clima quente sem exposição a fluidos.</p>

          <h2>Como escolher o tamanho certo</h2>
          <p>
            A medida principal para jaleco masculino é o busto. Meça com uma fita métrica na parte mais larga do tórax, passando pelos ombros. Compare com a tabela do fabricante:
          </p>
          <ul>
            <li>PP: busto 88–92 cm</li>
            <li>P: busto 92–96 cm</li>
            <li>M: busto 96–100 cm</li>
            <li>G: busto 100–104 cm</li>
            <li>G2: busto 104–110 cm</li>
          </ul>
          <p>
            Na dúvida entre dois tamanhos, escolha o maior — jaleco folgado tem melhor caimento do que jaleco apertado nos ombros, que restringe o movimento e amassa mais rápido.
          </p>

          <h2>Jaleco masculino para cada especialidade</h2>

          <h3>Médico</h3>
          <p>
            Para médicos de consultório, o jaleco slim em gabardine com elastano é a melhor combinação: elegante, confortável em jornadas longas e com visual que transmite autoridade. Para ambiente hospitalar, o clássico é o mais adequado. <Link href="/jaleco-medica" className="text-[#1a6fa8] hover:underline">Veja também a linha de jalecos para médica →</Link>
          </p>

          <h3>Dentista</h3>
          <p>
            Dentistas precisam de jaleco com manga longa (NR-32 exige como EPI em procedimentos com risco de respingo) e tecido que não amasse mesmo em longas sessões de trabalho sentado. O gabardine com elastano é a escolha mais comum — permite mobilidade de braços sem apertar.
          </p>

          <h3>Estudante de Medicina</h3>
          <p>
            Para estudantes, o jaleco clássico branco com bordado do nome e nome da faculdade é o padrão nas universidades brasileiras. Priorize durabilidade — o jaleco de faculdade lava muito e precisa manter o branco intacto. Tecidos com alto teor de poliéster resistem melhor ao amarelamento.
          </p>

          <h2>Cuidados com o jaleco masculino</h2>
          <p>
            Lave em água fria ou morna (máximo 40°C) com sabão neutro. Evite alvejante no dia a dia — use apenas em manchas específicas. Seque à sombra: sol direto amarela o tecido branco e danifica as fibras com elastano. Passe com ferro na temperatura indicada na etiqueta. Veja o guia completo: <Link href="/blog/como-lavar-jaleco-branco" className="text-[#1a6fa8] hover:underline">como lavar jaleco branco sem amarelado</Link>.
          </p>

          <h2>Perguntas frequentes</h2>

          {[
            { q: 'Jaleco masculino slim existe?', a: 'Sim. O slim masculino tem recortes laterais que definem levemente a silhueta. É mais elegante que o clássico reto e indicado para consultório.' },
            { q: 'Médico pode usar jaleco colorido?', a: 'O CFM não define cor obrigatória. Em hospitais públicos, branco é o padrão. Em consultórios particulares, azul marinho, cinza e preto são cada vez mais aceitos.' },
            { q: 'Qual tamanho de jaleco masculino para busto de 100 cm?', a: 'Tamanho G (busto 100–104 cm). Se você fica na divisa entre M e G, opte pelo G — jaleco folgado tem melhor caimento e mais conforto.' },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Aprofunde-se no tema:</p>
          <div className="flex flex-col gap-2">
            <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher jaleco feminino: guia completo</Link>
            <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim: modelos e diferenças</Link>
            <Link href="/blog/tecidos-para-jaleco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Tecidos para jaleco: qual é o melhor?</Link>
            <Link href="/blog/como-lavar-jaleco-branco" className="text-[#c4a97d] hover:underline text-sm">→ Como lavar jaleco branco sem amarelado</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Encontre seu jaleco masculino</h3>
          <p className="text-muted-foreground mb-4">
            Modelos clássico e slim em gabardine premium, do PP ao G2. Entrega rápida para todo o Brasil.
          </p>
          <Link
            href="/categoria/jalecos"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]"
          >
            Ver Jalecos Masculinos
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      
          <div className="mt-6 pt-6 border-t border-border">
            <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm block">→ Coleção completa de jaleco feminino</Link>
            <Link href="/jaleco-masculino" className="text-[#c4a97d] hover:underline text-sm block">→ Coleção completa de jaleco masculino</Link>
          </div>
        </article>
    </>
  )
}
