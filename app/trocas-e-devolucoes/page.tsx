import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Trocas e Devoluções — Jaleca',
  description: 'Saiba como solicitar trocas e devoluções na Jaleca. Prazo de 7 dias para compras online, conforme o Código de Defesa do Consumidor.',
  alternates: { canonical: 'https://jaleca.com.br/trocas-e-devolucoes' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Trocas e Devoluções — Jaleca',
    description: 'Saiba como solicitar trocas e devoluções na Jaleca. Prazo de 7 dias para compras online conforme o CDC.',
    url: 'https://jaleca.com.br/trocas-e-devolucoes',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Trocas e Devoluções — Jaleca',
    description: 'Saiba como solicitar trocas e devoluções na Jaleca. Prazo de 7 dias conforme o CDC.',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual é o prazo para solicitar troca ou devolução?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Você tem até 7 dias corridos após o recebimento para desistência (CDC Art. 49). Para defeito de fabricação, o prazo é de 30 dias (não duráveis) ou 90 dias (duráveis). Para troca por tamanho ou cor, até 7 dias após o recebimento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como solicitar uma troca ou devolução na Jaleca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entre em contato pelo WhatsApp (31) 3367-2467 ou pelo e-mail contato@jaleca.com.br com o número do seu pedido. Não envie nenhuma peça sem antes confirmar com nossa equipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quem paga o frete de devolução?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Em caso de defeito de fabricação ou arrependimento dentro do prazo de 7 dias (CDC), o frete de devolução é por nossa conta. Para trocas por tamanho ou cor sem defeito, o frete de devolução é por conta do cliente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Em quanto tempo recebo o reembolso?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para cartão de crédito, o estorno ocorre em até 2 ciclos de cobrança. Para PIX ou boleto, a transferência é feita em até 5 dias úteis após a confirmação da devolução.',
      },
    },
    {
      '@type': 'Question',
      name: 'O produto precisa estar em quais condições para troca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O produto deve estar sem sinais de uso, lavagem ou alteração, com todas as etiquetas originais intactas, na embalagem original e acompanhado do comprovante de compra.',
      },
    },
  ],
}

export default function TrocasEDevolucoesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    <main className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Atendimento
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Trocas e Devoluções
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A sua satisfação é nossa prioridade. Confira abaixo tudo o que você precisa saber sobre como solicitar uma troca ou devolução.
          </p>
        </div>

        {/* Highlight box */}
        <div className="bg-[hsl(var(--muted))] border border-border rounded-lg px-6 py-5 mb-10 flex gap-4 items-start">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-display font-semibold text-lg">
            7
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm mb-1">7 dias para desistência em compras online</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              De acordo com o <strong className="text-foreground font-medium">Código de Defesa do Consumidor (Art. 49)</strong>, você tem até <strong className="text-foreground font-medium">7 dias corridos</strong> a partir do recebimento do produto para solicitar a devolução de uma compra feita pela internet, sem necessidade de justificativa.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Prazo para Solicitação</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Arrependimento (CDC Art. 49):</strong> até 7 dias corridos após o recebimento do produto. O reembolso é integral, incluindo o frete pago.</li>
              <li><strong className="text-foreground font-medium">Troca por defeito de fabricação:</strong> até 30 dias após o recebimento (produtos não duráveis) ou 90 dias (produtos duráveis, como peças de vestuário).</li>
              <li><strong className="text-foreground font-medium">Troca por tamanho ou cor:</strong> até 7 dias corridos após o recebimento, sujeita às condições do produto descritas abaixo.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Como Solicitar</h2>
            <p className="mb-4">
              Para iniciar uma troca ou devolução, entre em contato com nossa equipe por um dos canais abaixo. Tenha em mãos o número do seu pedido.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="https://wa.me/553133672467"
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg px-5 py-4 hover:border-foreground hover:bg-[hsl(var(--muted))] transition-all duration-200 group"
              >
                <p className="font-semibold text-foreground text-sm mb-1 group-hover:underline">WhatsApp</p>
                <p className="text-xs text-muted-foreground">(31) 3367-2467</p>
                <p className="text-xs text-muted-foreground mt-1">Seg–Sex: 8h às 18h | Sáb: 8h às 12h</p>
              </a>
              <a
                href="mailto:contato@jaleca.com.br"
                className="block border border-border rounded-lg px-5 py-4 hover:border-foreground hover:bg-[hsl(var(--muted))] transition-all duration-200 group"
              >
                <p className="font-semibold text-foreground text-sm mb-1 group-hover:underline">E-mail</p>
                <p className="text-xs text-muted-foreground">contato@jaleca.com.br</p>
                <p className="text-xs text-muted-foreground mt-1">Respondemos em até 1 dia útil</p>
              </a>
            </div>

            <p className="mt-4">
              Nossa equipe irá orientar você sobre o envio do produto e os próximos passos. Não envie nenhuma peça sem antes confirmar com a gente.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Condições do Produto</h2>
            <p className="mb-3">
              Para que a troca ou devolução seja aceita, o produto deve ser devolvido nas seguintes condições:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Sem sinais de uso, lavagem ou alteração;</li>
              <li>Com todas as etiquetas originais intactas;</li>
              <li>Na embalagem original ou em embalagem adequada para envio;</li>
              <li>Acompanhado do comprovante de compra (nota fiscal ou número do pedido).</li>
            </ul>
            <p className="mt-3">
              Produtos com sinais de uso, sem etiqueta ou em condições diferentes das originais não serão aceitos para troca ou devolução, exceto em casos de defeito de fabricação comprovado.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Reembolso</h2>
            <p className="mb-3">
              Após o recebimento e conferência do produto em nosso estoque, o reembolso será processado da seguinte forma:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Cartão de crédito:</strong> estorno na fatura em até 2 ciclos de cobrança, conforme a operadora.</li>
              <li><strong className="text-foreground font-medium">PIX ou boleto:</strong> transferência bancária em até 5 dias úteis após a confirmação da devolução.</li>
              <li><strong className="text-foreground font-medium">Crédito na loja:</strong> disponível imediatamente após a confirmação, podendo ser usado em novos pedidos.</li>
            </ul>
            <p className="mt-3">
              Em casos de desistência dentro do prazo de 7 dias (CDC Art. 49), o reembolso inclui o valor do frete pago na compra.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Frete de Devolução</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Defeito de fabricação:</strong> o frete de devolução é por nossa conta. Enviaremos uma etiqueta pré-paga após a solicitação.</li>
              <li><strong className="text-foreground font-medium">Troca por tamanho ou cor (sem defeito):</strong> o frete de devolução é por conta do cliente. O frete do reenvio do novo produto é por nossa conta.</li>
              <li><strong className="text-foreground font-medium">Arrependimento (CDC Art. 49):</strong> o frete de devolução é por nossa conta. O reembolso do frete original também será realizado.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Exceções</h2>
            <p className="mb-3">Não aceitamos trocas ou devoluções nos seguintes casos:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Produtos personalizados ou feitos sob medida a pedido do cliente;</li>
              <li>Produtos com sinais de uso, lavagem, perfume ou alteração;</li>
              <li>Solicitações fora dos prazos estabelecidos acima.</li>
            </ul>
          </section>

        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-[hsl(var(--muted))] rounded-lg text-center">
          <p className="font-display text-lg font-semibold text-foreground mb-2">Precisa de ajuda?</p>
          <p className="text-sm text-muted-foreground mb-5">
            Nossa equipe está pronta para atender você de segunda a sábado.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/553133672467"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors"
            >
              Falar pelo WhatsApp
            </a>
            <a
              href="mailto:contato@jaleca.com.br"
              className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Enviar E-mail
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-border">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
    </>
  )
}
