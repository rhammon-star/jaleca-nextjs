import type { Metadata } from 'next'
import Link from 'next/link'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

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
        text: 'Você tem até 7 dias corridos após o recebimento para desistência (CDC Art. 49). Para defeito de fabricação: defeitos aparentes ou de fácil constatação têm prazo de até 90 dias para produtos duráveis, conforme o CDC. Para troca por tamanho ou cor, até 7 dias após o recebimento.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como solicitar uma troca ou devolução na Jaleca?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entre em contato pelo WhatsApp (31) 99290-1940 ou pelo e-mail contato@jaleca.com.br com o número do seu pedido. Não envie nenhuma peça sem antes confirmar com nossa equipe.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quem paga o frete de devolução?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Jaleca oferece, por liberalidade, 1 (uma) troca gratuita por pedido — o frete de devolução e o reenvio do novo produto são por nossa conta. Após a conclusão dessa troca, não serão aceitas novas solicitações de troca ou devolução por insatisfação com tamanho, cor ou modelo. Casos de defeito de fabricação continuam cobertos pela Jaleca, com frete por nossa conta.',
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
            Na Jaleca, queremos que sua experiência seja incrível do início ao fim. Por isso, nossa política de trocas e devoluções foi criada com transparência, respeito ao consumidor e alinhamento ao Código de Defesa do Consumidor.
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

          {/* 1. Direito de Arrependimento */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Direito de Arrependimento (Compras Online)</h2>
            <p className="mb-3">
              Conforme o <strong className="text-foreground font-medium">Art. 49 do Código de Defesa do Consumidor</strong>, o cliente pode solicitar a devolução do produto adquirido em nosso site no prazo de até <strong className="text-foreground font-medium">7 (sete) dias corridos</strong> após o recebimento do pedido.
            </p>
            <p className="mb-3">Para que a devolução seja aprovada, é necessário que:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>o produto esteja sem sinais de uso;</li>
              <li>esteja com etiquetas e acessórios originais;</li>
              <li>seja enviado na embalagem original ou similar que preserve o produto;</li>
              <li>acompanhe nota fiscal ou comprovante da compra.</li>
            </ul>
            <p className="mb-2">
              Após o recebimento e análise do produto em nosso centro de distribuição, o reembolso será realizado conforme a forma de pagamento utilizada na compra.
            </p>
            <p>
              O valor do frete original também será reembolsado, conforme previsto em lei.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* 2. Troca por Tamanho, Cor ou Modelo */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Troca por Tamanho, Cor ou Modelo</h2>
            <p className="mb-3">
              A Jaleca oferece, <strong className="text-foreground font-medium">por liberalidade</strong>, 1 (uma) troca gratuita por pedido para produtos sem uso.
            </p>
            <p className="mb-3">
              O prazo para solicitar a troca é de até <strong className="text-foreground font-medium">7 (sete) dias corridos</strong> após o recebimento do pedido.
            </p>
            <p className="mb-3">Para aprovação da troca, o produto deverá:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>estar sem uso;</li>
              <li>possuir etiquetas originais afixadas;</li>
              <li>não apresentar odores, manchas, lavagens ou alterações;</li>
              <li>ser enviado adequadamente embalado.</li>
            </ul>
            <p className="mb-2">
              Após a aprovação da solicitação, a Jaleca disponibilizará uma etiqueta de logística reversa para devolução do produto original.
            </p>
            <p className="mb-4">
              Recebido e aprovado o item devolvido, será realizado o envio do novo produto.
            </p>

            <div className="bg-[hsl(var(--muted))] border border-border rounded-lg px-5 py-4">
              <p className="font-semibold text-foreground text-sm mb-2">Importante</p>
              <p className="mb-2">
                Após a realização da troca por tamanho, cor ou modelo, considera-se concluída a escolha do produto pelo cliente, não sendo mais aplicável o direito de arrependimento previsto no Art. 49 do Código de Defesa do Consumidor em relação ao item originalmente adquirido.
              </p>
              <p>
                Após a conclusão da troca, não serão aceitas novas solicitações de troca ou devolução por motivo de gosto, tamanho, cor, modelagem ou insatisfação pessoal.
              </p>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* 3. Produtos Personalizados */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Produtos Personalizados</h2>
            <p className="mb-3">
              Produtos personalizados, bordados ou confeccionados sob medida não poderão ser devolvidos ou trocados por arrependimento, gosto pessoal, tamanho ou preferência estética.
            </p>
            <p className="mb-3">Trocas ou devoluções destes produtos serão aceitas apenas em casos de:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>defeito de fabricação;</li>
              <li>erro de personalização realizado pela Jaleca;</li>
              <li>divergência em relação ao pedido aprovado.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          {/* 4. Produto com Defeito */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Produto com Defeito</h2>
            <p className="mb-3">
              Caso o produto apresente defeito de fabricação, o cliente poderá solicitar análise no prazo legal de até <strong className="text-foreground font-medium">90 (noventa) dias</strong>, conforme previsto no Código de Defesa do Consumidor.
            </p>
            <p className="mb-3">Para análise, poderão ser solicitadas:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>fotos;</li>
              <li>vídeos;</li>
              <li>envio do produto para avaliação técnica.</li>
            </ul>
            <p className="mb-3">Constatado o defeito de fabricação, a Jaleca poderá, conforme o caso:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>realizar o reparo;</li>
              <li>efetuar a troca do produto;</li>
              <li>disponibilizar crédito;</li>
              <li>realizar o reembolso integral.</li>
            </ul>
            <p className="mb-2">
              <strong className="text-foreground font-medium">Não serão considerados defeitos de fabricação</strong> problemas decorrentes de mau uso, lavagem inadequada, desgaste natural ou uso indevido.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* 5. Condições Gerais */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Condições Gerais</h2>
            <p className="mb-3">
              A Jaleca se reserva o direito de recusar solicitações de troca ou devolução caso o produto:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>apresente sinais de uso;</li>
              <li>esteja sem etiqueta;</li>
              <li>tenha sido lavado ou alterado;</li>
              <li>não esteja de acordo com as condições descritas nesta política.</li>
            </ul>
            <p>
              O prazo para análise dos produtos devolvidos é de até <strong className="text-foreground font-medium">7 (sete) dias úteis</strong> após o recebimento em nosso centro de distribuição.
            </p>
          </section>

          <div className="border-t border-border" />

          {/* 6. Reembolso */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Reembolso</h2>
            <p className="mb-3">
              Após o recebimento e conferência do produto em nosso estoque, o reembolso será processado da seguinte forma:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Cartão de crédito:</strong> estorno na fatura em até 2 ciclos de cobrança, conforme a operadora.</li>
              <li><strong className="text-foreground font-medium">PIX ou boleto:</strong> transferência bancária em até 5 dias úteis após a confirmação da devolução.</li>
              <li><strong className="text-foreground font-medium">Crédito na loja:</strong> disponível imediatamente após a confirmação, podendo ser usado em novos pedidos.</li>
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
              href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
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
