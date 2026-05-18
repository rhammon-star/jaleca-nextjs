import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scrub Feminino: Guia Completo para Escolher o Ideal',
  description: 'Tudo sobre scrub feminino: tipos, tecidos, modelagens, cores e como escolher o uniforme ideal para sua profissão. O guia mais completo da internet.',
  keywords: 'scrub feminino, guia scrub feminino, como escolher scrub feminino, scrub feminino enfermagem, scrub feminino medica, uniforme saude feminino',
  alternates: { canonical: 'https://jaleca.com.br/blog/scrub-feminino-guia-completo' },
  openGraph: {
    title: 'Scrub Feminino: Guia Completo para Escolher o Ideal',
    description: 'O guia mais completo sobre scrub feminino: tecidos, modelagens, cores e onde comprar.',
    url: 'https://jaleca.com.br/blog/scrub-feminino-guia-completo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scrub feminino é o uniforme de trabalho usado por profissionais de saúde — médicas, enfermeiras, fisioterapeutas, dentistas e outras. É composto por blusa e calça com design funcional, pensado para conforto, mobilidade e higiene durante longas jornadas de trabalho.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual o melhor scrub feminino para enfermeira?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para enfermeiras, o scrub em tecido two way (poliéster com elastano) é o mais indicado por oferecer máxima mobilidade. Modelos com corte reto ou semi-acinturado, calça com elástico e bolsos funcionais são os preferidos para a rotina agitada de enfermagem.',
      },
    },
    {
      '@type': 'Question',
      name: 'Scrub feminino e pijama cirúrgico são a mesma coisa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, na prática são termos para o mesmo uniforme. "Scrub" é o termo em inglês, mais usado no mercado atual. "Pijama cirúrgico" é o nome tradicional no Brasil. Ambos se referem ao conjunto blusa + calça usado por profissionais de saúde.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como lavar scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lave em água fria ou morna (até 30°C para sintéticos). Evite amaciante, especialmente em tecidos com elastano. Não torça — esprema suavemente. Seque na sombra. Para manchas de sangue, use água fria imediatamente — água quente fixa a mancha.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scrub Feminino: Guia Completo para Escolher o Ideal',
  description: 'Guia completo sobre scrub feminino: tecidos, modelagens, cores e como escolher.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/blog/scrub-feminino-guia-completo',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
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
          <span className="text-foreground">Scrub Feminino Guia Completo</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 10 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Scrub Feminino: Guia Completo para Escolher o Ideal
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Tecidos, modelagens, cores, tamanhos, cuidados e onde comprar. Tudo que você precisa saber sobre scrub feminino em um só lugar.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
            alt="Profissional de saúde com scrub feminino azul em ambiente clínico"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            O <Link href="/scrub-feminino">scrub feminino</Link> é hoje o uniforme preferido das profissionais de saúde no Brasil. Médicas, enfermeiras, fisioterapeutas, dentistas, nutricionistas — todas migraram (ou estão migrando) do jaleco tradicional para o scrub como uniforme principal de trabalho.
          </p>
          <p>
            Por quê? Conforto, praticidade, durabilidade e um visual muito mais moderno. Mas com tantas opções no mercado, como escolher o certo? Esse guia responde tudo.
          </p>

          <h2>O que é scrub feminino?</h2>
          <p>
            Scrub é o uniforme de trabalho de profissionais de saúde. O nome vem do inglês <em>to scrub</em> (esfregar), referência ao ritual de higienização das mãos antes de cirurgias. No Brasil, também é chamado de pijama cirúrgico, conjunto cirúrgico ou uniforme hospitalar.
          </p>
          <p>
            É composto por blusa e calça com design funcional: tecidos técnicos, bolsos estratégicos, modelagem que permite movimento livre e fácil manutenção após lavagens frequentes.
          </p>

          <h2>Tipos de scrub feminino</h2>

          <h3>Por modelagem</h3>
          <ul>
            <li><strong>Reto:</strong> A modelagem clássica — mesma largura do busto ao quadril. Máxima liberdade de movimento. Ideal para UTI, pronto-socorro, cirurgia.</li>
            <li><strong><Link href="/blog/scrub-feminino-acinturado">Acinturado:</Link></strong> Recorte lateral que cria entrada na cintura. Mais elegante. Ideal para consultórios e clínicas.</li>
            <li><strong>Jogger / Slim:</strong> Calça mais justa com punho na barra. Visual moderno, muito popular em clínicas privadas.</li>
          </ul>

          <h3>Por tecido</h3>
          <p>
            Cada tecido tem vantagens diferentes. Veja o comparativo completo no nosso guia de <Link href="/blog/melhores-tecidos-scrub-feminino">melhores tecidos para scrub feminino</Link>.
          </p>
          <ul>
            <li><strong>Gabardine:</strong> Elegante, resistente, não amassa. Ideal para consultórios.</li>
            <li><strong>Two Way (Poliéster + Elastano):</strong> Máxima flexibilidade. Ideal para rotinas agitadas.</li>
            <li><strong>Oxfordine:</strong> Leve, acessível, seca rápido. Ótimo para estudantes.</li>
            <li><strong>Tricoline (Algodão):</strong> Respirável, toque suave. Ideal para climas quentes.</li>
          </ul>

          <h2>Como escolher o tamanho certo online</h2>
          <p>
            Nunca confie apenas em P, M, G ou GG. Cada marca tem tabela própria. O correto é:
          </p>
          <ol>
            <li>Medir busto, cintura e quadril com fita métrica</li>
            <li>Comparar com a tabela de medidas da peça específica (não da marca em geral)</li>
            <li>Em dúvida entre dois tamanhos, opte pelo maior — conforto é prioridade</li>
          </ol>

          <h2>Cores: o que saber antes de escolher</h2>
          <p>
            A cor do scrub pode ser livre ou seguir protocolo da instituição. Guia completo em <Link href="/blog/scrub-feminino-colorido">scrub feminino colorido: tendências e significado das cores</Link>.
          </p>
          <ul>
            <li><strong>Verde e azul:</strong> Cores tradicionais de centro cirúrgico e enfermagem</li>
            <li><strong>Preto e azul marinho:</strong> Tendência atual — elegante e esconde manchas</li>
            <li><strong>Rosa e lilás:</strong> Muito usado em consultórios de estética e pediatria</li>
            <li><strong>Tons terrosos:</strong> Tendência 2026 em clínicas privadas</li>
          </ul>

          <h2>Cuidados com o scrub</h2>
          <p>
            Lavar corretamente faz toda a diferença na durabilidade. As principais regras:
          </p>
          <ul>
            <li>Água fria ou morna (até 30°C para sintéticos)</li>
            <li>Sem amaciante (danifica elastano)</li>
            <li>Não torcer — espremer suavemente</li>
            <li>Secar na sombra</li>
          </ul>
          <p>
            Guia detalhado por tipo de tecido: <Link href="/blog/como-cuidar-scrub-feminino">como cuidar do seu scrub feminino</Link>.
          </p>

          <h2>Scrub feminino para situações específicas</h2>
          <ul>
            <li><strong>Plus size:</strong> Veja nosso guia de <Link href="/blog/scrub-feminino-plus-size">scrub feminino plus size</Link> — modelagens e tecidos que valorizam.</li>
            <li><strong>Gestantes:</strong> Dicas por trimestre em <Link href="/blog/scrub-feminino-gravidas">scrub feminino para grávidas</Link>.</li>
          </ul>

          <h2>Por que o scrub substituiu o jaleco como uniforme principal?</h2>
          <p>
            O jaleco ainda tem seu lugar — como proteção por cima do uniforme em consultórios e laboratórios. Mas como uniforme principal de trabalho, o scrub ganhou por três motivos:
          </p>
          <ul>
            <li><strong>Conforto:</strong> Tecidos técnicos e modelagem ergonômica aguentam 12 horas de plantão</li>
            <li><strong>Praticidade:</strong> Fácil manutenção, lava e usa</li>
            <li><strong>Identidade visual:</strong> Visual moderno e profissional que representa bem a área de saúde</li>
          </ul>

          <h2>Onde comprar scrub feminino de qualidade</h2>
          <p>
            Veja o que verificar antes de comprar e quais são os sinais de qualidade no guia <Link href="/blog/onde-comprar-scrub-feminino">onde comprar scrub feminino barato e de qualidade online</Link>.
          </p>
          <p>
            A Jaleca é especializada em uniformes para profissionais de saúde. Nossa coleção de <Link href="/scrub-feminino">scrub feminino</Link> inclui modelos em diferentes tecidos e modelagens, com tabela de medidas detalhada e política de troca clara.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>O que é scrub feminino?</h3>
          <p>
            É o uniforme de trabalho de profissionais de saúde — conjunto blusa + calça com design funcional pensado para conforto, mobilidade e higiene.
          </p>

          <h3>Qual o melhor scrub feminino para enfermeira?</h3>
          <p>
            Tecido two way (máxima mobilidade), corte reto ou semi-acinturado, calça com elástico e bolsos funcionais. Ideal para a rotina agitada de enfermagem.
          </p>

          <h3>Scrub feminino e pijama cirúrgico são a mesma coisa?</h3>
          <p>
            Sim — são termos diferentes para o mesmo uniforme. &quot;Scrub&quot; é o termo atual em inglês; &quot;pijama cirúrgico&quot; é o nome tradicional no Brasil.
          </p>

          <h3>Como lavar scrub feminino?</h3>
          <p>
            Água fria ou morna, sem amaciante, sem torcer, secar na sombra. Para manchas de sangue, água fria imediatamente — água quente fixa.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Aprofunde o tema:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Melhores Tecidos para Scrub Feminino</Link>
            <Link href="/blog/scrub-feminino-acinturado" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Scrub Feminino Acinturado</Link>
            <Link href="/blog/como-cuidar-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Como Cuidar do Seu Scrub</Link>
            <Link href="/blog/scrub-feminino-colorido" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Scrub Feminino Colorido: Cores e Tendências</Link>
            <Link href="/blog/scrub-feminino-plus-size" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Scrub Feminino Plus Size</Link>
            <Link href="/blog/scrub-feminino-gravidas" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Scrub para Grávidas</Link>
            <Link href="/blog/onde-comprar-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Onde Comprar Scrub Feminino</Link>
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">→ Ver Scrubs Femininos na Jaleca</Link>
          </div>
        </div>
      </article>
    </>
  )
}
