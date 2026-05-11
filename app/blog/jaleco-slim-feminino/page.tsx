import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Slim Feminino: Por que é o Favorito das Médicas',
  description: 'Jaleco slim feminino: corte acinturado, elastano bidirecional e caimento que não amassa. Por que médicas, dentistas e nutricionistas escolhem o slim. Guia completo com modelos e tamanhos.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-slim-feminino' },
  openGraph: {
    title: 'Jaleco Slim Feminino: Por que é o Favorito das Médicas',
    description: 'Jaleco slim feminino com elastano. Por que médicas, dentistas e nutricionistas escolhem o slim. Guia completo.',
    url: 'https://jaleca.com.br/blog/jaleco-slim-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Slim Feminino: Por que é o Favorito das Médicas',
  description: 'Jaleco slim feminino com elastano. Corte acinturado que valoriza sem apertar. Guia para médicas, dentistas e nutricionistas.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  url: 'https://jaleca.com.br/blog/jaleco-slim-feminino',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é jaleco slim feminino?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jaleco slim feminino é um modelo com corte acinturado que acompanha a silhueta do corpo feminino. Diferente do jaleco clássico (reto), o slim tem recortes laterais que definem a cintura sem apertar, geralmente em tecido com elastano para garantir liberdade de movimento.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco slim é indicado para plantão?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, desde que o tecido tenha elastano bidirecional. O corte acinturado do slim não limita movimento — o elastano compensa. Para plantões de 12 horas, o Jaleco Elastex da Jaleca é a versão mais indicada: mesmo corte slim, com maior amplitude de stretch.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco slim e jaleco clássico?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jaleco clássico: corte reto, sem recortes laterais, cai igual em todos os tipos de corpo. Jaleco slim: recortes laterais que seguem a silhueta, efeito de cintura marcada, visual mais elegante. O slim é mais favorável ao corpo feminino; o clássico tem mais espaço interno para procedimentos que exigem amplitude bruta.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco slim pode ser usado em hospital?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O modelo slim não é restrito a nenhum ambiente. Hospitais e instituições regulam cor, comprimento e identificação — não o corte. Médicas, enfermeiras e fisioterapeutas usam jaleco slim em UTI, centro cirúrgico e pronto-socorro sem qualquer impedimento institucional.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Slim Feminino', item: 'https://jaleca.com.br/blog/jaleco-slim-feminino' },
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
          <span className="text-foreground">Jaleco Slim Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />7 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Slim Feminino: Por que é o Favorito das Médicas
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Corte acinturado, elastano que não limita e caimento que dura 12 horas de plantão. Entenda o que torna o slim o modelo mais pedido — e quando ele não é a melhor escolha.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O que diferencia o jaleco slim de todos os outros</h2>
          <p>
            O jaleco feminino clássico foi criado com base no molde masculino. Resultado: ombro largo, manga longa demais, cintura reta que não acompanha nenhum corpo. O jaleco slim surgiu como resposta direta a esse problema: recortes laterais que definem a silhueta sem apertar, comprimento proporcional à altura feminina real e tecido com elastano que se move com o corpo.
          </p>
          <p>
            A diferença não é só estética. Em procedimentos longos — consultas, cirurgias ambulatoriais, plantões —  um jaleco que prende o movimento cansa mais. O slim bem feito distribui o tecido onde ele precisa estar: espaço nos ombros e braços, definição na cintura, abertura no quadril para sentar e levantar sem esforço.
          </p>

          <h2>Por que médicas escolhem o slim acima de tudo</h2>
          <p>
            Em consultório, o jaleco é a primeira coisa que o paciente vê. Antes de você falar, antes de mostrar qualquer competência técnica, o jaleco já comunicou algo. O slim transmite cuidado com a apresentação — e isso tem impacto real na percepção de autoridade clínica.
          </p>
          <p>
            Além do visual, médicas de consultório (clínica geral, pediatria, dermatologia, ginecologia) costumam passar a maioria do dia sentadas ou em pé, com pouco movimento brusco. O slim funciona perfeitamente nesse contexto. Para médicas de pronto-socorro ou UTI — onde agachamento, alcance e movimento constante são a rotina — o <Link href="/blog/jaleco-feminino-tamanho-certo" className="text-[#c4a97d]">jaleco Elastex</Link> entrega mais amplitude.
          </p>

          <h2>Modelos slim da Jaleca — qual escolher</h2>

          <h3>Jaleco Slim Tradicional</h3>
          <p>
            O modelo base. Recortes laterais clássicos, manga longa com punho, dois bolsos no quadril, fechamento em botões frontais. Tecido gabardine poliéster/viscose com elastano (150 g/m²). É o ponto de entrada do slim — elegante, sem exageros, funciona em qualquer especialidade.
          </p>

          <h3>Jaleco Slim Gold</h3>
          <p>
            Versão premium com detalhes dourados nos botões e na gravata. Mesmo corte do Tradicional, acabamento superior. Muito pedido por médicas que trabalham em clínicas de alto padrão ou consultórios próprios onde a identidade visual importa.
          </p>

          <h3>Jaleco Slim Elastex</h3>
          <p>
            Mesmo corte slim, tecido com elastano bidirecional de maior gramatura. A diferença é sentida nos movimentos que exigem amplitude: alcançar algo acima da cabeça, agachar, girar o tronco. Para médicas de pronto-socorro ou fisioterapeutas que querem o visual slim sem abrir mão do stretch, este é o modelo.
          </p>

          <h3>Jaleco Slim Princesa</h3>
          <p>
            Variação com bordado delicado no bolso e cava americana. Caimento levemente mais solto que o Tradicional, visual mais humanizado. Preferido por nutricionistas, psicólogas e profissionais que querem transmitir acolhimento junto com autoridade.
          </p>

          <h2>Como o slim se comporta no dia a dia</h2>
          <p>
            O maior medo de quem compra slim pela primeira vez é o caimento. "Vai apertar quando eu levantar o braço?" — não, se o tecido tiver elastano bidirecional (stretch em x e y, não só em um eixo). "Vai marcar a barriga após o almoço?" — depende do tamanho. Na dúvida entre dois tamanhos, vá para o maior: jaleco slim com tamanho certo parece ajustado; apertado, parece informal.
          </p>
          <p>
            Após lavagem a 40°C e secagem à sombra, o slim mantém o caimento sem precisar de ferro. O gabardine com elastano tem memória — volta à forma original. O que destrói o caimento é calor excessivo na secagem (degrada o elastano) e centrifugação em velocidade alta (distorce a costura lateral).
          </p>

          <h2>Slim não é para todo mundo — quando escolher outro modelo</h2>
          <p>
            O slim pressupõe que você quer um jaleco que acompanha o corpo. Se a preferência é por mais espaço interno — para usar roupa mais grossa por baixo, para se sentir mais "à vontade" ou para profissões com muito movimento — o jaleco clássico ou o Elastex com corte mais amplo são melhores escolhas.
          </p>
          <p>
            Para grávidas ou profissionais que estão gestantes: o slim não acompanha a barriga em crescimento. Veja nosso guia de <Link href="/blog/scrub-feminino-gravidas" className="text-[#c4a97d]">uniformes para grávidas</Link> ou escolha o jaleco clássico com tamanho acima do habitual.
          </p>

          <h2>Slim, Elastex ou Princesa — tabela de decisão</h2>
          <table>
            <thead>
              <tr>
                <th>Situação</th>
                <th>Modelo indicado</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Consultório, clínica, atendimento presencial</td><td>Slim Tradicional ou Gold</td></tr>
              <tr><td>Plantão 12h, pronto-socorro, UTI</td><td>Slim Elastex</td></tr>
              <tr><td>Estética, nutrição, psicologia</td><td>Slim Princesa</td></tr>
              <tr><td>Procedimentos com muito alcance</td><td>Slim Elastex ou Clássico</td></tr>
              <tr><td>Gestação</td><td>Clássico (tamanho maior)</td></tr>
            </tbody>
          </table>

          <h2>Perguntas frequentes</h2>

          <h3>Jaleco slim marca o corpo?</h3>
          <p>
            O slim define a silhueta — não aperta. A diferença entre "definir" e "apertar" está no tamanho correto e no elastano. Com tamanho certo e tecido com stretch, o jaleco acompanha o movimento. Apertado, prende e cria vincos indesejados.
          </p>

          <h3>Jaleco slim pode ser branco?</h3>
          <p>
            Sim. O modelo slim existe em branco, que é a cor padrão em hospitais e clínicas. A Jaleca oferece slim em 12 cores, incluindo branco, preto, marsala, verde musgo, azul marinho e rosê.
          </p>

          <h3>Como medir para jaleco slim?</h3>
          <p>
            Meça busto (na altura dos mamilos) e cintura (parte mais estreita). Compare com a <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d]">tabela de medidas da Jaleca</Link>. Para o slim, a medida de busto é mais determinante — escolha o tamanho pelo busto e o jaleco vai casar com a cintura.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-1">Leia também no guia de jaleco feminino:</p>
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/blog/jaleco-slim-padrao-clinicas" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim ou padrão: qual é o certo para cada clínica?</Link>
              <Link href="/blog/jaleco-feminino-tamanho-certo" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher o tamanho certo de jaleco feminino</Link>
              <Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco branco: como manter sempre imaculado</Link>
              <Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido na clínica: o que cada conselho permite</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
              <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Coleção completa de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos slim feminino</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional, Gold, Elastex e Princesa — do PP ao G3, em até 12 cores.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Slim →
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
  return [{ slug: 'jaleco-slim-feminino' }]
}
