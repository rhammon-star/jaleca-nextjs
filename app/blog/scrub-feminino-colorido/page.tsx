import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scrub Feminino Colorido: Tendências e Significado das Cores',
  description: 'Qual cor de scrub usar? Descubra o significado das cores no ambiente de saúde, tendências 2026 e como montar looks profissionais com scrubs coloridos.',
  keywords: 'scrub feminino colorido, cores scrub saude, scrub rosa feminino, scrub azul marinho, tendencias scrub 2026, significado cores uniforme saude',
  alternates: { canonical: 'https://jaleca.com.br/blog/scrub-feminino-colorido' },
  openGraph: {
    title: 'Scrub Feminino Colorido: Tendências e Significado das Cores',
    description: 'Cores, tendências e como escolher o scrub feminino certo para sua profissão.',
    url: 'https://jaleca.com.br/blog/scrub-feminino-colorido',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual a cor de scrub mais usada pelas enfermeiras?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Azul e branco são as cores mais tradicionais para enfermagem. Atualmente, azul marinho e verde militar também são muito populares por combinarem profissionalismo com discrição e esconderem manchas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso usar scrub colorido em hospital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende do protocolo da instituição. Muitos hospitais têm normas específicas por cor e área (ex: verde para cirurgia, azul para enfermagem). Sempre verifique o regulamento interno antes de escolher a cor.',
      },
    },
    {
      '@type': 'Question',
      name: 'Scrub rosa é adequado para ambiente profissional?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, desde que a instituição permita. O rosa claro e o rosê são muito usados em consultórios de estética, pediatria e clínicas privadas. Em hospitais com uniforme padronizado, é preciso verificar o protocolo.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scrub Feminino Colorido: Tendências e Significado das Cores',
  description: 'Guia completo sobre cores de scrub feminino: significados, tendências e dicas para cada profissão.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/blog/scrub-feminino-colorido',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
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
          <span className="text-foreground">Scrub Feminino Colorido</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Scrub Feminino Colorido: Tendências e Significado das Cores
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A cor do seu scrub diz mais do que você imagina. Entenda o que cada cor representa no ambiente de saúde e descubra as tendências de 2026.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
            alt="Profissionais de saúde com scrubs coloridos"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Você sabia que a cor do <Link href="/scrub-feminino">scrub feminino</Link> pode indicar sua área de atuação, nível hierárquico e até o tipo de instituição onde você trabalha? Em muitos hospitais, as cores seguem um protocolo rigoroso. Em clínicas privadas, há muito mais liberdade.
          </p>
          <p>
            Seja por obrigação ou por escolha, entender o significado e as tendências de cores vai te ajudar a fazer escolhas mais certeiras.
          </p>

          <h2>O significado tradicional das cores no ambiente de saúde</h2>

          <h3>Verde</h3>
          <p>
            A cor histórica dos centros cirúrgicos. O verde foi escolhido ainda no século XX por oferecer um contraste visual confortável com o vermelho do sangue, reduzindo a fadiga ocular dos cirurgiões em cirurgias longas. Hoje é muito associado a salas de cirurgia, instrumentadores e enfermagem cirúrgica.
          </p>

          <h3>Azul</h3>
          <p>
            O azul é a cor mais versátil e popular nos uniformes de saúde. Azul claro é muito usado em enfermagem e atendimento geral. Azul marinho transmite autoridade e é muito escolhido por médicos e coordenadores. Esconde bem manchas e combina com qualquer ambiente.
          </p>

          <h3>Branco</h3>
          <p>
            Clássico dos jalecos e muito presente ainda em farmácias, laboratórios e ambientes que querem transmitir higiene e pureza. Em scrubs, o branco puro está cedendo espaço para o off-white e o creme, que são mais práticos.
          </p>

          <h3>Rosa e Lilás</h3>
          <p>
            Muito comuns em consultórios de pediatria, clínicas de estética, nutrição e odontologia. Transmitem acolhimento e cuidado. Em hospitais públicos, é menos comum por conta de protocolos padronizados.
          </p>

          <h3>Preto e Cinza</h3>
          <p>
            A grande tendência dos últimos anos. Preto esconde manchas com eficiência máxima e dá um aspecto muito moderno e sofisticado ao uniforme. Muito usado em clínicas privadas premium, estética e medicina integrativa.
          </p>

          <h2>Tendências de cores para scrub feminino em 2026</h2>
          <p>
            O mercado de uniformes de saúde está se aproximando cada vez mais da moda. As tendências de 2026 apontam para:
          </p>
          <ul>
            <li><strong>Tons terrosos:</strong> Caramelo, terracota e nude — elegantes e diferentes do padrão hospitalar</li>
            <li><strong>Azul petróleo e teal:</strong> Uma versão mais moderna e sofisticada do azul tradicional</li>
            <li><strong>Verde oliva e sage:</strong> Verde mais terroso, que fugiu do verde cirúrgico tradicional</li>
            <li><strong>Lavanda e lilás suave:</strong> Feminino sem ser óbvio, ótimo para clínicas de saúde da mulher</li>
            <li><strong>Preto sólido:</strong> Consolidado como clássico moderno — não vai perder força</li>
          </ul>

          <h2>Cores por área de atuação: guia rápido</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Área</th>
                  <th className="border border-[#ddd] p-3 text-left">Cores mais usadas</th>
                  <th className="border border-[#ddd] p-3 text-left">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3">Centro cirúrgico</td>
                  <td className="border border-[#ddd] p-3">Verde, azul</td>
                  <td className="border border-[#ddd] p-3">Protocolo obrigatório na maioria dos hospitais</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">Enfermagem geral</td>
                  <td className="border border-[#ddd] p-3">Azul claro, branco, verde</td>
                  <td className="border border-[#ddd] p-3">Varia por instituição</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3">Consultório / clínica privada</td>
                  <td className="border border-[#ddd] p-3">Preto, azul marinho, tons neutros</td>
                  <td className="border border-[#ddd] p-3">Mais liberdade de escolha</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">Pediatria</td>
                  <td className="border border-[#ddd] p-3">Rosa, lilás, estampados</td>
                  <td className="border border-[#ddd] p-3">Ambiente lúdico e acolhedor</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3">Estética e nutrição</td>
                  <td className="border border-[#ddd] p-3">Rosa, lavanda, branco, terrosos</td>
                  <td className="border border-[#ddd] p-3">Livre escolha, alinhada à identidade da clínica</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Dicas para montar looks com scrub colorido</h2>
          <p>
            Mesmo dentro de um uniforme, dá pra expressar personalidade. Algumas dicas:
          </p>
          <ul>
            <li>Combine blusa e calça na mesma cor para visual mais elegante e profissional</li>
            <li>Contrast pop funciona: calça preta com blusa azul petróleo, por exemplo</li>
            <li>Acessórios discretos (relógio, brincos pequenos) complementam bem scrubs coloridos</li>
            <li>Tênis de trabalho na cor neutra (branco, preto) combinam com qualquer cor de scrub</li>
          </ul>

          <h2>Dúvidas frequentes</h2>

          <h3>Qual a cor de scrub mais usada pelas enfermeiras?</h3>
          <p>
            Azul e branco são os mais tradicionais. Azul marinho e verde militar também são muito populares por combinarem profissionalismo com discrição.
          </p>

          <h3>Posso usar scrub colorido em hospital?</h3>
          <p>
            Depende do protocolo da instituição. Muitos hospitais têm normas específicas por cor e área. Sempre verifique o regulamento interno antes de escolher.
          </p>

          <h3>Scrub rosa é adequado para ambiente profissional?</h3>
          <p>
            Sim, especialmente em consultórios de estética, pediatria e clínicas privadas. Em hospitais com uniforme padronizado, verifique o protocolo primeiro.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Scrubs Femininos
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
            <Link href="/blog/scrub-feminino-plus-size" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Plus Size
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
