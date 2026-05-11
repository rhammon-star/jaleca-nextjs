import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Formatura de Medicina: Bordado, Slim e Protocolo',
  description: 'Jaleco para formatura de medicina e enfermagem: bordado com nome e CRM, corte slim ou clássico, cores permitidas. O que a turma precisa saber antes de encomendar.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-para-formatura-medicina' },
  openGraph: {
    title: 'Jaleco para Formatura de Medicina: Bordado, Slim e Protocolo',
    description: 'Guia completo para encomenda de jaleco de formatura — bordado, tamanho, prazo e protocolo por profissão.',
    url: 'https://jaleca.com.br/blog/jaleco-para-formatura-medicina',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Formatura de Medicina: Bordado, Slim e Protocolo',
  description: 'Tudo o que a turma precisa saber para encomendar jaleco de formatura de medicina e enfermagem.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  url: 'https://jaleca.com.br/blog/jaleco-para-formatura-medicina',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual jaleco usar na formatura de medicina?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco de formatura de medicina é geralmente branco, com bordado do nome completo, CRM provisório (se já emitido) e nome da instituição. O corte slim feminino é o mais escolhido pelas formandas — valoriza a silhueta nas fotos e é o modelo que elas usarão no consultório. O jaleco clássico é escolhido por quem prefere o visual mais tradicional ou por conveniência de grupo.' },
    },
    {
      '@type': 'Question',
      name: 'Com quanto de antecedência encomendar jaleco de formatura?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para turmas de até 30 formandas: mínimo 45 dias de antecedência. Para turmas maiores (30–100 pessoas): 60 a 90 dias. Pedidos com bordado personalizado têm prazo de produção adicional de 15 a 20 dias em relação ao jaleco sem bordado. Evite encomendas com menos de 30 dias — o risco de atraso aumenta significativamente.' },
    },
    {
      '@type': 'Question',
      name: 'O bordado no jaleco de formatura vai no lado esquerdo ou direito?',
      acceptedAnswer: { '@type': 'Answer', text: 'O padrão clínico é lado esquerdo do peito (sobre o coração), tanto para nome quanto para logo da instituição. Algumas turmas optam por logo no lado esquerdo e nome no bolso do jaleco — essa combinação é válida. Nunca no meio do peito (interfere com os botões) nem em posição que dificulte a leitura durante o atendimento.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco de formatura de enfermagem pode ser colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O COFEN não restringe cor. Turmas de enfermagem frequentemente escolhem jalecos em azul royal, verde água ou marsala para diferenciar a cerimônia. A cor também pode ser a cor institucional da faculdade. Após a formatura, o jaleco colorido pode ser usado em clínicas privadas — apenas hospitais públicos têm protocolos internos que exigem branco.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Formatura de Medicina', item: 'https://jaleca.com.br/blog/jaleco-para-formatura-medicina' },
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
          <span className="text-foreground">Jaleco para Formatura de Medicina</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Formatura de Medicina: Bordado, Slim e Protocolo
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            O jaleco de formatura é o primeiro que você vai usar com seu nome e CRM. Guia completo para a turma encomendar certo — modelo, bordado, prazo e o que cada profissão costuma escolher.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O jaleco de formatura é diferente dos outros</h2>
          <p>
            O jaleco que você usa durante a faculdade é genérico — em geral, branco, reto, sem bordado, comprado às pressas no começo do semestre. O jaleco de formatura é o primeiro com seu nome. É o que aparece nas fotos da colação, nas primeiras semanas de residência ou de consultório.
          </p>
          <p>
            Por isso, a decisão merece atenção: modelo, bordado, prazo de entrega, tamanho e — para turmas — padronização ou liberdade individual. Cada um desses pontos tem implicação prática.
          </p>

          <h2>Modelo: slim ou clássico para formatura?</h2>
          <p>
            Para formandas de medicina e odontologia, o <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d]">jaleco slim</Link> é o modelo mais escolhido nos últimos 5 anos. Razões práticas:
          </p>
          <ul>
            <li>Valoriza a silhueta nas fotos da cerimônia (o jaleco clássico reto tende a "engolir" o corpo)</li>
            <li>É o modelo que a médica ou dentista vai usar no consultório — comprar para formatura e continuar usando no dia a dia</li>
            <li>Disponível em branco, que é o padrão de formatura de medicina no Brasil</li>
          </ul>
          <p>
            O jaleco clássico continua sendo escolhido por turmas que optam por uma estética mais tradicional ou por formandas que preferem mais espaço interno.
          </p>
          <p>
            Para formatura de enfermagem, a divisão é diferente: muitas turmas escolhem o jaleco no <strong>padrão da especialidade</strong> — scrub ou jaleco curto, dependendo da área de atuação predominante da turma.
          </p>

          <h2>Bordado: o que colocar e onde</h2>
          <p>
            O bordado do jaleco de formatura geralmente inclui:
          </p>
          <ul>
            <li><strong>Nome completo</strong> — ou nome social. Confirme com cada formanda antes de encomendar.</li>
            <li><strong>CRM, CRO, COREN ou número provisório</strong> — se já emitido pela colação. Se ainda não saiu, não coloque número nenhum: é infração colocar número de outro profissional ou fictício.</li>
            <li><strong>Nome da instituição</strong> — em fonte menor, abaixo do nome. Opcional, mas comum.</li>
            <li><strong>Especialidade ou curso</strong> — "Medicina", "Odontologia", "Enfermagem" — confirma a identidade do jaleco.</li>
          </ul>
          <p>
            <strong>Posição padrão:</strong> lado esquerdo do peito (sobre o coração). Esta é a posição clínica universal — facilita a leitura durante o atendimento. Logo da instituição no mesmo lado ou no bolso são variações válidas.
          </p>

          <h2>Prazos — o erro mais comum das turmas</h2>
          <p>
            Turmas deixam para encomendar os jalecos com 3 semanas de antecedência. Isso é curto demais para pedidos com bordado personalizado. Os prazos reais:
          </p>
          <ul>
            <li><strong>Jaleco sem bordado:</strong> 10–15 dias úteis para entrega</li>
            <li><strong>Jaleco com bordado simples (nome):</strong> 20–25 dias úteis</li>
            <li><strong>Turma de 30+ pessoas com bordado individual:</strong> 40–60 dias — cada jaleco tem um bordado diferente, o que exige configuração individual por peça</li>
          </ul>
          <p>
            O momento certo para encomendar é <strong>3 meses antes da formatura</strong>. Isso dá tempo para revisar os bordados, corrigir erros de nome e refazer peças com problema sem estresse.
          </p>

          <h2>Cor do jaleco de formatura por profissão</h2>
          <ul>
            <li><strong>Medicina:</strong> branco é o padrão absoluto. Turmas que optam por outra cor são exceção.</li>
            <li><strong>Odontologia:</strong> branco é majoritário, mas algumas turmas usam azul royal ou verde água — especialmente em faculdades com identidade visual forte.</li>
            <li><strong>Enfermagem:</strong> maior variação. Branco, azul marinho, verde e até marsala são comuns. O COFEN não restringe.</li>
            <li><strong>Fisioterapia:</strong> azul, verde e branco dividem preferência. O jaleco colorido é bem aceito na profissão.</li>
            <li><strong>Nutrição:</strong> verde (associação à saúde), rosê (humanização) e branco são as três escolhas mais comuns.</li>
          </ul>

          <h2>Como organizar o pedido para a turma</h2>
          <ol>
            <li><strong>Defina modelo e cor</strong> — votação simples ou decisão da comissão de formatura.</li>
            <li><strong>Colete medidas individuais</strong> — cada formanda mede busto e informa o tamanho. Não confie em "mesmo tamanho que uso no dia a dia" — jalecos têm tabelas próprias.</li>
            <li><strong>Confirme os dados de bordado</strong> — nome completo exato, número de registro (se já disponível). Erros de bordado demoram para corrigir.</li>
            <li><strong>Calcule o prazo de entrega</strong> — defina a data da colação e subtraia 15 dias de margem para imprevistos.</li>
            <li><strong>Confirme a entrega por nome</strong> — em pedidos de turma, cada jaleco deve ter etiqueta com o nome da formanda para evitar confusão na entrega.</li>
          </ol>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: qual modelo escolher</Link>
              <Link href="/blog/jaleco-feminino-tamanho-certo" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o tamanho certo de jaleco feminino</Link>
              <Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido: o que cada conselho de saúde permite</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
              <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Coleção completa de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jaleco de formatura Jaleca</h3>
          <p className="text-muted-foreground mb-4">Slim e clássico em branco, com bordado personalizado. PP ao G3. Atendimento para turmas.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos →
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
  return [{ slug: 'jaleco-para-formatura-medicina' }]
}
