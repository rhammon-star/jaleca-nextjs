import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Onde Comprar Jaleco Online com Segurança e Frete Grátis | Jaleca',
  description: 'Saiba onde comprar jaleco online com qualidade, segurança e frete grátis. Guia com critérios para escolher a melhor loja de jaleco do Brasil — e não errar no tamanho nem no tecido.',
  keywords: 'onde comprar jaleco online, melhor loja jaleco online, comprar jaleco online, loja jaleco confiável, jaleco com frete grátis, onde comprar jaleco feminino online',
  alternates: { canonical: 'https://jaleca.com.br/blog/onde-comprar-jaleco-online' },
  openGraph: {
    title: 'Onde Comprar Jaleco Online: Guia para Não Errar na Compra',
    description: 'Critérios para escolher a melhor loja de jaleco online. Segurança, frete grátis, tamanhos e garantia.',
    url: 'https://jaleca.com.br/blog/onde-comprar-jaleco-online',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Onde Comprar Jaleco Online: Guia para Não Errar na Compra',
  description: 'Guia com critérios para escolher a melhor loja de jaleco online com segurança e frete grátis.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/og-home.jpg' } },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/onde-comprar-jaleco-online',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'É seguro comprar jaleco online?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim, desde que você compre em lojas com CNPJ visível no rodapé, checkout com SSL (cadeado no navegador), política de troca e devolução publicada e avaliações verificadas no Google ou Reclame Aqui. Lojas especializadas em jaleco têm consultores treinados para dúvidas de tamanho — o que reduz muito o risco de escolher errado.' },
    },
    {
      '@type': 'Question',
      name: 'Como sei o tamanho certo de jaleco pelo site?',
      acceptedAnswer: { '@type': 'Answer', text: 'Use a tabela de medidas publicada no site. Meça busto e cintura com fita métrica e compare com os números da tabela. Em lojas sérias, a tabela é específica para cada modelo — slim, clássico e plus size têm medidas diferentes. Na dúvida, escolha o tamanho maior: jaleco largo tem melhor caimento do que jaleco apertado.' },
    },
    {
      '@type': 'Question',
      name: 'Existe loja de jaleco com frete grátis para todo o Brasil?',
      acceptedAnswer: { '@type': 'Answer', text: 'A maioria das lojas especializadas oferece frete grátis acima de um valor mínimo de compra, geralmente para o Sudeste. Frete grátis para todo o Brasil em qualquer valor é raro — desconfie se a promessa for ampla demais sem condições claras. A Jaleca oferece frete grátis no Sudeste para pedidos acima de R$499.' },
    },
    {
      '@type': 'Question',
      name: 'Qual o prazo de entrega de jaleco online?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende da distância e modalidade de frete. Para Sudeste, lojas com estoque próprio entregam em 2 a 5 dias úteis. Para Norte e Nordeste, 7 a 12 dias úteis são o padrão. Lojas que produzem por encomenda podem ter prazo de 15 a 30 dias — verifique se o produto é de pronta entrega ou sob encomenda.' },
    },
    {
      '@type': 'Question',
      name: 'Como devolver jaleco comprado online?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pelo Código de Defesa do Consumidor, você tem 7 dias para desistir de qualquer compra online, sem precisar justificar. O produto deve estar sem uso e com etiqueta. Após esse prazo, a política de troca varia por loja — algumas aceitam troca por tamanho em até 30 dias. Leia a política de troca antes de comprar.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Onde Comprar Jaleco Online', item: 'https://jaleca.com.br/blog/onde-comprar-jaleco-online' },
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
          <span className="text-foreground">Onde Comprar Jaleco Online</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />5 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Onde Comprar Jaleco Online: Guia para Não Errar na Compra
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Critérios práticos para escolher uma loja de jaleco confiável, entender frete grátis real e chegar no tamanho certo sem precisar devolver.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O que avaliar antes de comprar jaleco online</h2>
          <p>
            A principal dificuldade de comprar jaleco online é não poder sentir o tecido nem experimentar o caimento. Por isso, a escolha da loja importa tanto quanto a escolha do modelo. Uma loja séria resolve esses problemas com tabela de medidas detalhada, foto de modelo com altura informada, descrição técnica do tecido e política de troca sem burocracia.
          </p>
          <p>
            Antes de finalizar a compra, verifique: CNPJ visível no rodapé do site, checkout com cadeado SSL, avaliações no Google ou Reclame Aqui e política de troca publicada com prazos claros.
          </p>

          <h2>Vantagens de comprar direto do fabricante</h2>
          <p>
            Lojas que vendem diretamente do fabricante — sem intermediários — oferecem preço mais competitivo e conhecimento técnico real sobre o produto. Se você liga para o SAC e a atendente não sabe a diferença entre gabardine e elastex, ou não consegue explicar o caimento do modelo, é um sinal de que a loja revende sem dominar o que vende.
          </p>
          <p>
            Fabricantes próprios também conseguem manter grade completa (PP ao G3), algo que revendedores raramente têm em estoque. E, em caso de defeito, a resolução é mais rápida — sem necessidade de acionar um intermediário.
          </p>

          <h2>Cuidados com lojas desconhecidas</h2>
          <p>
            Preço muito abaixo da média é um sinal de alerta. Jaleco de qualidade — gabardine com elastano, costuras reforçadas, botões de qualidade — tem custo de produção que não permite preços de atacado em unidades avulsas. Tecidos muito baratos amassam rápido, desbotam e perdem o caimento após poucas lavagens.
          </p>
          <p>
            Verifique também se o site tem fotos reais do produto (não apenas renders) e se as avaliações dos clientes mencionam detalhes específicos como caimento, tecido e prazo de entrega — avaliações genéricas podem ser fabricadas.
          </p>

          <h2>Frete grátis: quando vale a pena</h2>
          <p>
            Frete grátis para todo o Brasil em qualquer valor de pedido é raro e geralmente tem compensação no preço do produto. O mais comum é frete grátis a partir de um valor mínimo para determinadas regiões — Sudeste primeiro, depois restante do Brasil.
          </p>
          <p>
            Para quem precisa de um único jaleco, vale calcular o custo total (produto + frete) antes de comparar lojas. Às vezes uma loja com frete pago mas produto melhor e política de troca mais simples é a escolha mais econômica no longo prazo.
          </p>

          <h2>Por que escolher a Jaleca</h2>
          <p>
            A Jaleca é especialista em jalecos profissionais para a área da saúde há mais de uma década. Produção própria, grade do PP ao G3, nota 4.9/5 no Google com mais de 50 avaliações verificadas e política de devolução em até 7 dias sem burocracia.
          </p>
          <ul>
            <li>Frete grátis no Sudeste para pedidos acima de R$499</li>
            <li>Tabela de medidas detalhada por modelo</li>
            <li>Checkout seguro com SSL</li>
            <li>Troca por tamanho em até 30 dias</li>
            <li>Atendimento por profissionais da área de saúde</li>
          </ul>
          <p>
            Para saber o tamanho certo antes de comprar, leia nosso <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#1a6fa8] hover:underline">guia de medidas de jaleco feminino</Link>.
          </p>
        </div>

        <div className="mt-10 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Aprofunde-se no tema:</p>
          <div className="flex flex-col gap-2">
            <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Como escolher jaleco feminino: guia completo</Link>
            <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#c4a97d] hover:underline text-sm">→ Guia de medidas: como saber o tamanho certo</Link>
            <Link href="/blog/comprar-jaleco-online-e-seguro" className="text-[#c4a97d] hover:underline text-sm">→ Comprar jaleco online é seguro?</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Compre com segurança na Jaleca</h3>
          <p className="text-muted-foreground mb-4">
            Fabricante direto, nota 4.9 no Google, frete grátis no Sudeste e troca em até 30 dias.
          </p>
          <Link
            href="/"
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
