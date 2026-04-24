import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Clock, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comprar Jaleco Online: É Seguro? | Jaleca',
  description: 'Descubra se comprar jaleco online é seguro. Saiba como encontrar lojas confiáveis, escolher o modelo ideal e garantir uma compra tranquila para profissionais de saúde.',
  keywords: 'comprar jaleco online, jaleco pela internet, loja jaleco confiavel, jaleco online seguro, jaleco comprar online, uniforme profissional online',
  alternates: { canonical: 'https://jaleca.com.br/blog/comprar-jaleco-online-e-seguro' },
  openGraph: {
    title: 'Comprar Jaleco Online: É Seguro? | Jaleca',
    description: 'Descubra como comprar jaleco online com segurança. Dicas para identificar lojas confiáveis e garantir a melhor compra.',
    url: 'https://jaleca.com.br/blog/comprar-jaleco-online-e-seguro',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Comprar Jaleco Online: É Seguro?',
  description: 'Descubra se comprar jaleco online é seguro e como encontrar lojas confiáveis para adquirir seu uniforme profissional.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-23',
  dateModified: '2026-04-23',
  image: 'https://jaleca.com.br/og-home.jpg',
  url: 'https://jaleca.com.br/blog/comprar-jaleco-online-e-seguro',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'É seguro comprar jaleco pela internet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, é seguro comprar jaleco online quando você escolhe lojas estabelecidas, com avaliações positivas de clientes e políticas claras de troca. A Jaleca, por exemplo, oferece 30 dias para troca, frete grátis no Sudeste acima de R$499 e checkout seguro.'
      }
    },
    {
      '@type': 'Question',
      name: 'Como saber se uma loja de jaleco online é confiável?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Verifique se a loja tem avaliações no Google, se oferece canais de contato reais (telefone, WhatsApp), se tem política de troca clara e se o site possui certificado de segurança (HTTPS). A Jaleca tem 4.9/5 de avaliação no Google com mais de 50 reviews.'
      }
    },
    {
      '@type': 'Question',
      name: 'Posso trocar o jaleco se não servir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, na Jaleca você pode trocar em até 30 dias após o recebimento. A loja oferece orientação de medidas online para ajudar você a escolher o tamanho certo antes de comprar.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo demora para o jaleco chegar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O prazo de entrega varia conforme a sua localização. Para o Sudeste, o prazo é de 3 a 7 dias úteis após confirmação do pagamento. O frete é grátis para compras acima de R$499.'
      }
    }
  ]
}

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />

      <article className="container py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Comprar Jaleco Online</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              23 de Abril de 2026
            </span>
            <span className="flex items-center gap-1">
              <User size={14} />
              Jaleca
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              6 min de leitura
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Comprar Jaleco Online: É Seguro?
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Descubra como comprar jaleco online com segurança. Dicas práticas para identificar lojas confiáveis e garantir a melhor compra para sua rotina profissional.
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative w-full h-[300px] md:h-[400px] mb-10 rounded-lg overflow-hidden bg-[#f5f5f5]">
          <Image
            src="/hero-jaleca-v2.jpg"
            alt="Profissional de saúde vestindo jaleco Jaleca"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>A Rotina que Te Define</h2>
          <p>
            O alarme toca, a luz fria do amanhecer mal rompe a janela, e você já está imerso no turbilhão familiar da sua profissão. Aquele ritual matinal, o café apressado, a lista mental de pacientes, cirurgias ou procedimentos. No centro de tudo isso, uma peça de roupa que é mais do que um uniforme: o jaleco. Ele é seu escudo, seu símbolo de confiança, a segunda pele que te acompanha em cada diagnóstico, em cada sorriso de alívio, em cada momento de aprendizado.
          </p>
          <p>
            Mas, e quando a necessidade de renovar essa peça-chave bate, e a correria do dia a dia te impede de ir até a loja física? A ideia de <strong>comprar jaleco online</strong> surge como uma solução, mas uma dúvida paira no ar: <em>é seguro?</em>
          </p>

          <h2>Segurança e Confiança na Tela do Computador</h2>
          <p>
            Lembro-me da primeira vez que precisei de um novo jaleco e a única opção era o <strong>jaleco pela internet</strong>. Havia uma apreensão inicial. Será que o tecido seria bom? A cor seria fiel à imagem? E, o mais importante, a compra seria segura?
          </p>
          <p>
            A preocupação é genuína, afinal, lidamos com a nossa imagem profissional e, muitas vezes, com itens essenciais para o nosso trabalho. No entanto, o cenário das compras online evoluiu imensamente. Hoje, encontrar uma <strong>loja jaleco confiável</strong> é mais acessível do que parece.
          </p>
          <p>
            Sites especializados oferecem descrições detalhadas de materiais, guias de medidas precisos para que você escolha o tamanho ideal, e fotos de alta qualidade que revelam cada detalhe da peça. A segurança da transação, garantida por certificados digitais e diversas opções de pagamento, também é um ponto crucial que tranquiliza o consumidor.
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            <div className="flex flex-col items-center text-center p-4 bg-[#faf9f7] border border-[#e8e0d5] rounded-lg">
              <ShieldCheck size={28} className="text-[#c4a97d] mb-2" />
              <span className="text-sm font-medium">Compra Segura</span>
              <span className="text-xs text-muted-foreground">SSL 256 bits</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-[#faf9f7] border border-[#e8e0d5] rounded-lg">
              <RotateCcw size={28} className="text-[#c4a97d] mb-2" />
              <span className="text-sm font-medium">30 Dias Troca</span>
              <span className="text-xs text-muted-foreground">Devolução grátis</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-[#faf9f7] border border-[#e8e0d5] rounded-lg">
              <Truck size={28} className="text-[#c4a97d] mb-2" />
              <span className="text-sm font-medium">Frete Grátis</span>
              <span className="text-xs text-muted-foreground">Sul/Sudeste +R$499</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-[#faf9f7] border border-[#e8e0d5] rounded-lg">
              <CreditCard size={28} className="text-[#c4a97d] mb-2" />
              <span className="text-sm font-medium">Pague em até 6x</span>
              <span className="text-xs text-muted-foreground">Sem juros</span>
            </div>
          </div>

          <h2>O Jaleco Ideal ao Seu Alcance</h2>
          <p>
            A comodidade de <strong>comprar jaleco online seguro</strong> vai além da simples conveniência. É a possibilidade de explorar um leque muito maior de opções do que encontraria em uma única loja física. Quer um jaleco com corte slim, gola padre, zíper discreto ou botões clássicos? Prefere tecidos tecnológicos que repelem líquidos ou que oferecem maior respirabilidade? A internet te entrega isso tudo.
          </p>
          <p>
            Para os homens, o <Link href="/produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca" className="text-[#c4a97d] hover:underline">jaleco slim masculino de zíper</Link> é uma escolha moderna e elegante. Para as mulheres, o <Link href="/produto/jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca" className="text-[#c4a97d] hover:underline">jaleco slim feminino de zíper</Link> oferece praticidade e sofisticação. E se você busca algo ainda mais específico, como um <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline">jaleco personalizado</Link>, a experiência online se torna ainda mais enriquecedora, permitindo que você crie uma peça única.
          </p>

          <h2>Dicas para um Jaleco Comprar Online Tranquilo</h2>
          <p>
            Para garantir que sua experiência de <strong>comprar jaleco online</strong> seja impecável, algumas dicas podem ser valiosas:
          </p>
          <ol>
            <li><strong>Pesquise a reputação da loja.</strong> Verifique avaliações de outros clientes no Google e procure por selos de segurança no site.</li>
            <li><strong>Confira a política de troca e devolução.</strong> Uma empresa confiável terá um processo claro e justo nesse sentido.</li>
            <li><strong>Utilize os guias de tamanho.</strong> Eles são seus melhores amigos para evitar frustrações. <Link href="/medida" className="text-[#c4a97d] hover:underline">Acesse nosso guia de medidas</Link>.</li>
            <li><strong>Prefira lojas com diferentes métodos de pagamento.</strong> Isso inclui cartão, PIX e boleto.</li>
          </ol>
          <p>
            Com essas precauções, o ato de <strong>comprar jaleco online</strong> se torna não apenas seguro, mas também uma forma eficiente e prazerosa de adquirir o seu novo uniforme. Seja um <Link href="/produto/jaleco-universitario-unissex-jaleca" className="text-[#c4a97d] hover:underline">jaleco universitário</Link> para os estudos ou um <Link href="/categoria/conjuntos" className="text-[#c4a97d] hover:underline">scrub</Link> para o dia a dia, a segurança e a variedade estão a um clique de distância.
          </p>

          {/* Product showcase */}
          <div className="my-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <h3 className="font-display text-lg font-semibold mb-4">Jalecos mais vendidos online</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/produto/jaleco-slim-elastex-feminino-varias-cores-jaleca" className="flex items-center gap-3 p-3 bg-white border border-[#e8e0d5] hover:border-[#c4a97d] transition-colors">
                <div className="w-16 h-16 bg-[#e8e0d5] rounded relative overflow-hidden">
                  <Image src="/product-1.jpg" alt="Jaleco Slim Elastex" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm">Jaleco Slim Elastex</p>
                  <p className="text-xs text-muted-foreground">Feminino • Premium</p>
                </div>
              </Link>
              <Link href="/produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca" className="flex items-center gap-3 p-3 bg-white border border-[#e8e0d5] hover:border-[#c4a97d] transition-colors">
                <div className="w-16 h-16 bg-[#e8e0d5] rounded relative overflow-hidden">
                  <Image src="/product-2.jpg" alt="Jaleco Slim Masculino" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm">Jaleco Slim Masculino</p>
                  <p className="text-xs text-muted-foreground">Zíper Central</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-[#1a1a1a] text-white">
          <h3 className="font-display text-xl font-semibold mb-2">Pronto para comprar seu jaleco online?</h3>
          <p className="text-[#aaa] mb-4">
            Na Jaleca você compra com segurança: 30 dias de troca, frete grátis acima de R$499 e atendimento via WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 bg-[#c4a97d] text-[#1a1a1a] px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#d4b98d]"
            >
              Ver Coleção
            </Link>
            <Link
              href="/medida"
              className="inline-flex items-center gap-2 border border-[#555] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:border-white"
            >
              Guia de Medidas
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-8 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: 'comprar-jaleco-online-e-seguro' }]
}
