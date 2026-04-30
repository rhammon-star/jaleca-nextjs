import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Melhores Tecidos para Scrub Feminino: Conforto e Durabilidade',
  description: 'Gabardine, two way, oxfordine ou algodão? Descubra qual tecido de scrub feminino combina com sua rotina, seu biotipo e o clima do seu estado.',
  keywords: 'tecido scrub feminino, melhor tecido scrub, scrub feminino gabardine, scrub feminino elastano, scrub feminino algodão',
  alternates: { canonical: 'https://jaleca.com.br/blog/melhores-tecidos-scrub-feminino' },
  openGraph: {
    title: 'Melhores Tecidos para Scrub Feminino: Conforto e Durabilidade',
    description: 'Qual tecido de scrub feminino é o ideal para você? Comparativo completo.',
    url: 'https://jaleca.com.br/blog/melhores-tecidos-scrub-feminino',
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
      name: 'Qual o melhor tecido para scrub feminino em clima quente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para climas quentes, o oxfordine e o tricoline (algodão) são as melhores opções. São leves, respiráveis e secam rápido. O two way com elastano também é uma boa escolha por ser fino e flexível.',
      },
    },
    {
      '@type': 'Question',
      name: 'Scrub com elastano deforma com o uso?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende do percentual de elastano e do cuidado na lavagem. Scrubs com até 5% de elastano em poliéster (two way) mantêm o formato por muito tempo se lavados corretamente — sem amaciante e sem torcer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Gabardine é bom para scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O gabardine é um dos tecidos mais nobres para scrubs: não amassa, tem ótima queda e aparência muito profissional. É ideal para quem atua em consultórios e ambientes mais formais. Por ser mais encorpado, pode ser menos indicado para climas muito quentes.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Melhores Tecidos para Scrub Feminino: Conforto e Durabilidade',
  description: 'Guia completo sobre os melhores tecidos para scrub feminino.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/melhores-tecidos-scrub-feminino',
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
          <span className="text-foreground">Tecidos para Scrub Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Melhores Tecidos para Scrub Feminino: Conforto e Durabilidade
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Gabardine, two way, oxfordine, algodão — qual tecido aguenta sua rotina e ainda te deixa confortável no fim de um plantão de 12 horas?
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
            alt="Profissional de saúde usando scrub feminino em ambiente clínico"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            A escolha do tecido é a decisão mais importante na hora de comprar um <Link href="/scrub-feminino">scrub feminino</Link>. O modelo mais bonito do mundo vai te decepcionar se o tecido não suportar lavagens diárias, esquentar demais ou encolher depois de três usos.
          </p>
          <p>
            A gente vai te mostrar os quatro tecidos mais usados em scrubs femininos de qualidade, com os prós e contras de cada um — sem enrolação.
          </p>

          <h2>Gabardine: o tecido mais elegante</h2>
          <p>
            O gabardine é o clássico dos uniformes profissionais. Encorpado, de ótima queda e praticamente não amassa. Quem trabalha em consultório médico, clínica de estética ou odontologia tende a preferir o gabardine justamente pelo aspecto impecável ao longo do dia.
          </p>
          <ul>
            <li><strong>Prós:</strong> Resistente, não amassa, visual muito profissional, durável</li>
            <li><strong>Contras:</strong> Mais pesado, pode aquecer em climas quentes</li>
            <li><strong>Ideal para:</strong> Consultórios, clínicas, ambientes climatizados</li>
          </ul>

          <h2>Two Way (Poliéster + Elastano): o favorito do movimento</h2>
          <p>
            O two way — tecido de poliéster com elastano — é o queridinho de quem precisa de mobilidade total. Ele estica nos quatro sentidos, o que significa que você se agacha, se estica e corre sem sentir a roupa te prender em momento nenhum.
          </p>
          <p>
            É o tecido mais recomendado para enfermeiras, fisioterapeutas e profissionais de saúde que ficam em movimento constante.
          </p>
          <ul>
            <li><strong>Prós:</strong> Levíssimo, máxima liberdade de movimento, seca rápido</li>
            <li><strong>Contras:</strong> Requer cuidado especial (sem amaciante, não torcer)</li>
            <li><strong>Ideal para:</strong> UTI, pronto-socorro, fisioterapia, rotinas agitadas</li>
          </ul>

          <h2>Oxfordine: o custo-benefício imbatível</h2>
          <p>
            100% poliéster, leve e resistente. O oxfordine é o tecido de entrada que não decepciona: seca rápido, não amassa fácil e agrega muito bem ao longo do tempo. Ótimo para estudantes de saúde e profissionais que precisam de vários scrubs na rotação semanal sem pesar no bolso.
          </p>
          <ul>
            <li><strong>Prós:</strong> Preço acessível, leve, seca rápido, fácil manutenção</li>
            <li><strong>Contras:</strong> Toque menos suave ao pele, visual menos premium</li>
            <li><strong>Ideal para:</strong> Estudantes, volume de uso alto, quem tem várias trocas por semana</li>
          </ul>

          <h2>Tricoline (100% Algodão): o mais natural</h2>
          <p>
            Para quem não abre mão do toque de algodão, o tricoline é a escolha. Ele é super respirável — ótimo para quem mora em regiões quentes — e tem uma sensação de conforto que sintéticos não entregam. O ponto de atenção é que amassa mais e precisa de cuidado na hora de lavar.
          </p>
          <ul>
            <li><strong>Prós:</strong> Respirável, toque suave, hipoalergênico</li>
            <li><strong>Contras:</strong> Amassa, pode encolher se lavado em temperatura alta</li>
            <li><strong>Ideal para:</strong> Climas quentes, peles sensíveis, quem prefere fibras naturais</li>
          </ul>

          <h2>Tabela comparativa de tecidos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Tecido</th>
                  <th className="border border-[#ddd] p-3 text-left">Conforto</th>
                  <th className="border border-[#ddd] p-3 text-left">Durabilidade</th>
                  <th className="border border-[#ddd] p-3 text-left">Ideal para</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3"><strong>Gabardine</strong></td>
                  <td className="border border-[#ddd] p-3">Alto</td>
                  <td className="border border-[#ddd] p-3">Muito alta</td>
                  <td className="border border-[#ddd] p-3">Consultórios, clínicas</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3"><strong>Two Way</strong></td>
                  <td className="border border-[#ddd] p-3">Muito alto</td>
                  <td className="border border-[#ddd] p-3">Alta</td>
                  <td className="border border-[#ddd] p-3">UTI, PS, rotinas agitadas</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3"><strong>Oxfordine</strong></td>
                  <td className="border border-[#ddd] p-3">Bom</td>
                  <td className="border border-[#ddd] p-3">Alta</td>
                  <td className="border border-[#ddd] p-3">Estudantes, uso intenso</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3"><strong>Tricoline</strong></td>
                  <td className="border border-[#ddd] p-3">Muito alto</td>
                  <td className="border border-[#ddd] p-3">Média</td>
                  <td className="border border-[#ddd] p-3">Climas quentes, pele sensível</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>E a modelagem? Também importa</h2>
          <p>
            O tecido certo com a modelagem errada ainda vai te decepcionar. Um scrub feminino bem feito tem diferença de modelagem entre busto, cintura e quadril — não é apenas uma blusa reta. Fique de olho na tabela de medidas antes de comprar online e prefira marcas que oferecem medidas detalhadas.
          </p>
          <p>
            Quer entender mais sobre como escolher o tamanho certo? Veja nosso guia completo de <Link href="/scrub-feminino">scrub feminino</Link>.
          </p>

          <h2>Dúvidas frequentes sobre tecidos de scrub</h2>

          <h3>Qual o melhor tecido para scrub feminino em clima quente?</h3>
          <p>
            Para climas quentes, o oxfordine e o tricoline (algodão) são as melhores opções por serem mais leves e respiráveis. O two way também funciona bem por ser fino.
          </p>

          <h3>Scrub com elastano deforma com o uso?</h3>
          <p>
            Depende do percentual de elastano e do cuidado na lavagem. Scrubs com poliéster + elastano (two way) mantêm bem o formato se você evitar amaciante e não torcer a peça.
          </p>

          <h3>Gabardine é bom para scrub feminino?</h3>
          <p>
            Sim — é um dos melhores tecidos para quem busca visual profissional e durabilidade. Mais indicado para ambientes climatizados por ser mais encorpado.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Jaleca
            </Link>
            <Link href="/blog/como-cuidar-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Como Cuidar do Seu Scrub
            </Link>
            <Link href="/blog/scrub-feminino-acinturado" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Acinturado
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
