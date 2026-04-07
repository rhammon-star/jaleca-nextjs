import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Truck, RotateCcw, CreditCard, Ruler, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Perguntas Frequentes',
  description: 'Tire suas dúvidas sobre jalecos, medidas, entrega, troca e pagamento. Encontre respostas rápidas para as perguntas mais comuns dos clientes Jaleca.',
  alternates: { canonical: 'https://jaleca.com.br/faq' },
  openGraph: {
    title: 'Perguntas Frequentes | Jaleca',
    description: 'Tire suas dúvidas sobre jalecos, medidas, entrega, troca e pagamento.',
    url: 'https://jaleca.com.br/faq',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como escolher o tamanho certo do jaleco?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Meça com uma fita métrica a parte mais larga do busto, a cintura e o quadril. Depois, consulte a tabela de medidas na página do produto. Se dúvida, use nosso consultor de tamanho disponível em cada página de produto — ele indica o tamanho ideal com base nas suas medidas."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a diferença entre Jaleco Feminino e Masculino?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O jaleco feminino tem caimento ajustado ao corpo feminino, com cintura marcada e amplitude diferenciada no quadril. O jaleco masculino tem corte reto, ombros mais largos e caimento mais alinhado ao corpo masculino. Os tecidos e acabamentos são os mesmos em ambos."
      }
    },
    {
      "@type": "Question",
      "name": "Como funciona o pagamento via PIX?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O PIX é aprovado na hora. Após escolher essa forma de pagamento, você recebe um QR Code para scanned com o app do banco. O pedido é liberado automaticamente após a confirmação do pagamento. Comprando via PIX, você ganha 5% de desconto sobre o valor total do pedido."
      }
    },
    {
      "@type": "Question",
      "name": "Posso parcelar no cartão sem juros?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Você pode parcelar em até 3x sem juros. O parcelamento está disponível para todos os cartões Visa, Mastercard, Elo e Amex. A análise de crédito é feita pela plataforma Pagar.me."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o prazo de entrega?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O prazo varia de 5 a 15 dias úteis conforme a região. Para Sudeste, o prazo médio é de 5 a 8 dias úteis. Para Sul, Centro-Oeste e Nordeste, de 8 a 12 dias úteis. Para Norte, de 10 a 15 dias úteis. O rastreamento é enviado por e-mail após a postagem."
      }
    },
    {
      "@type": "Question",
      "name": "Como funciona a troca ou devolução?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você tem até 7 dias após o recebimento para solicitar a troca ou devolução. O produto deve estar sem uso e com a etiqueta original. Para iniciar, envie um e-mail para contato@jaleca.com.br com o número do pedido. O frete de troca é por conta do cliente; em caso de defeito, arcamos com o custo."
      }
    },
    {
      "@type": "Question",
      "name": "Envia para todo o Brasil?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Fazemos entrega para todos os estados do Brasil. O frete é calculado automaticamente no checkout com base no CEP e peso dos itens. Para algumas regiões, oferecemos frete grátis em pedidos acima de um determinado valor — verificado automaticamente durante o pedido."
      }
    },
    {
      "@type": "Question",
      "name": "Como posso acompanhar meu pedido?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Após a postagem, você recebe um código de rastreamento por e-mail. Pode acompanhar diretamente nos sites dos Correios ou da transportadora. También puede acompanhar o status do seu pedido na página 'Minha Conta' se tiver login no site."
      }
    },
    {
      "@type": "Question",
      "name": "Ojaleco desbota ou encolhe após a lavagem?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não. Utilizamos tecidos de alta qualidade com tratamento anti-degradação. O jaleco mantém a cor e o caimento mesmo após múltiplas lavagens, desde que seguidas as instruções da etiqueta: lavar em água fria, não usar alvejante e secar à sombra."
      }
    },
    {
      "@type": "Question",
      "name": "Tem loja física?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Nossa loja matriz fica em Ipatinga, MG. Endereço: Av. Itaú, 123 —Centro. Atendimento de segunda a sexta das 9h às 18h e sábado das 9h às 13h. Você pode visitar para provar e comprar diretamente.拜訪を歓迎します!"
      }
    }
  ]
}

const categories = [
  {
    icon: Ruler,
    title: 'Tamanhos e Medidas',
    questions: [
      { q: 'Como escolher o tamanho certo do jaleco?', anchor: 'tamanho' },
      { q: 'Qual a diferença entre Jaleco Feminino e Masculino?', anchor: 'diferenca' },
      { q: 'O jaleco desbota ou encolhe após a lavagem?', anchor: 'lavagem' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Pagamento',
    questions: [
      { q: 'Como funciona o pagamento via PIX?', anchor: 'pix' },
      { q: 'Posso parcelar no cartão sem juros?', anchor: 'parcelamento' },
      { q: 'Tem desconto para pagamento à vista?', anchor: 'desconto-vista' },
    ],
  },
  {
    icon: Truck,
    title: 'Entrega e Frete',
    questions: [
      { q: 'Qual o prazo de entrega?', anchor: 'prazo' },
      { q: 'Envia para todo o Brasil?', anchor: 'brasil' },
      { q: 'Como posso acompanhar meu pedido?', anchor: 'rastreamento' },
    ],
  },
  {
    icon: RotateCcw,
    title: 'Troca e Devolução',
    questions: [
      { q: 'Como funciona a troca ou devolução?', anchor: 'troca' },
      { q: 'O jaleco tem garantia?', anchor: 'garantia' },
    ],
  },
  {
    icon: MessageCircle,
    title: 'Outros',
    questions: [
      { q: 'Tem loja física?', anchor: 'loja-fisica' },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData).replace(/</g, '\\u003c'),
        }}
      />
      <main className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">Tire suas dúvidas</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">Perguntas Frequentes</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Encontre respostas rápidas sobre medidas, pagamento, entrega e troca. Não encontrou? Fale conosco pelo WhatsApp.
            </p>
          </div>

          {/* WhatsApp CTA */}
          <div className="flex justify-center mb-12">
            <a
              href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-green-700 transition-colors active:scale-[0.98]"
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </div>

          {/* Categories */}
          <div className="space-y-10">
            {categories.map(cat => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-4">
                  <cat.icon size={16} className="text-primary" />
                  <h2 className="font-display text-xl font-semibold">{cat.title}</h2>
                </div>
                <div className="space-y-3">
                  {cat.questions.map(item => (
                    <details
                      key={item.anchor}
                      className="group border border-border"
                    >
                      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-medium text-foreground hover:bg-muted/30 transition-colors">
                        {item.q}
                        <span className="text-muted-foreground text-xs group-open:rotate-45 transition-transform duration-200 shrink-0">+</span>
                      </summary>
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                        {item.q.includes('Como escolher o tamanho') && (
                          <>
                            <p>Meça com uma fita métrica a parte mais larga de cada região do corpo:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              <li><strong>Busto:</strong> passe a fita pela parte mais larga do busto</li>
                              <li><strong>Cintura:</strong> passe pela parte mais estreita da cintura</li>
                              <li><strong>Quadril:</strong> passe pela parte mais larga dos quadris</li>
                            </ul>
                            <p className="mt-2">Depois, use o <Link href="/produtos" className="text-primary underline">consultor de tamanho</Link> disponível em cada página de produto para encontrar a medida ideal.</p>
                          </>
                        )}
                        {item.q.includes('diferença entre Jaleco Feminino') && (
                          <p>O jaleco feminino tem caimento ajustado ao corpo feminino, com cintura marcada e amplitude diferenciada no quadril. O jaleco masculino tem corte reto, ombros mais largos e caimento mais alinhado ao corpo masculino. Os tecidos e acabamentos são os mesmos em ambos.</p>
                        )}
                        {item.q.includes('pagamento via PIX') && (
                          <p>O PIX é aprovado na hora. Após escolher essa forma de pagamento, você recebe um QR Code para escanear com o app do banco. O pedido é liberado automaticamente após a confirmação. <strong>Comprando via PIX, você ganha 5% de desconto!</strong></p>
                        )}
                        {item.q.includes('parcelar') && (
                          <p>Sim! Você pode parcelar em até 3x sem juros. Disponível para todos os cartões Visa, Mastercard, Elo e Amex. A análise de crédito é feita pela plataforma Pagar.me.</p>
                        )}
                        {item.q.includes('desconto para pagamento à vista') && (
                          <p>Sim! Pagamento via PIX tem <strong>5% de desconto</strong> sobre o valor total do pedido. O desconto é aplicado automaticamente na tela de pagamento.</p>
                        )}
                        {item.q.includes('prazo de entrega') && (
                          <>
                            <p>O prazo varia conforme a região:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              <li><strong>Sudeste:</strong> 5 a 8 dias úteis</li>
                              <li><strong>Sul / Centro-Oeste / Nordeste:</strong> 8 a 12 dias úteis</li>
                              <li><strong>Norte:</strong> 10 a 15 dias úteis</li>
                            </ul>
                            <p className="mt-2">O rastreamento é enviado por e-mail após a postagem.</p>
                          </>
                        )}
                        {item.q.includes('todo o Brasil') && (
                          <p>Sim! Fazemos entrega para todos os estados do Brasil. O frete é calculado automaticamente no checkout com base no CEP e peso dos itens.</p>
                        )}
                        {item.q.includes('acompanhar meu pedido') && (
                          <p>Após a postagem, você recebe um código de rastreamento por e-mail. Pode acompanhar diretamente nos sites dos Correios ou da transportadora. También puede acompanhar o status na página "Minha Conta".</p>
                        )}
                        {item.q.includes('troca ou devolução') && (
                          <p>Você tem até <strong>7 dias após o recebimento</strong> para solicitar a troca ou devolução. O produto deve estar sem uso e com a etiqueta original. Para iniciar, envie um e-mail para <a href="mailto:contato@jaleca.com.br" className="text-primary underline">contato@jaleca.com.br</a> com o número do pedido.</p>
                        )}
                        {item.q.includes('garantia') && (
                          <p>Todos os nossos produtos têm garantia contra defeito de fabricação de <strong>90 dias</strong>, conforme o Código de Defesa do Consumidor. A garantia não cobre defeitos por mau uso, produtos que tenham sido <strong>modificados</strong> ou que não possuam a <strong>etiqueta original</strong>.</p>
                        )}
                        {item.q.includes('loja física') && (
                          <>
                            <p>Sim! Nossa loja matriz fica em Ipatinga, MG.</p>
                            <p className="mt-2"><strong>Endereço:</strong> Av. Itaú, 123 — Centro, Ipatinga MG</p>
                            <p><strong>Horário:</strong> Seg a Sex: 9h às 18h | Sáb: 9h às 13h</p>
                            <p className="mt-2">Visite para provar e comprar diretamente!</p>
                          </>
                        )}
                        {item.q.includes('desbota ou encolhe') && (
                          <p>Não. Utilizamos tecidos de alta qualidade com tratamento anti-degradação. O jaleco mantém a cor e o caimento mesmo após múltiplas lavagens, desde que seguidas as instruções da etiqueta: lavar em água fria, não usar alvejante e secar à sombra.</p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center border border-border p-8">
            <Shield size={24} className="mx-auto mb-3 text-primary" />
            <h3 className="font-display text-xl font-semibold mb-2">Não encontrou sua resposta?</h3>
            <p className="text-muted-foreground text-sm mb-4">Estamos aqui para ajudar. Entre em contato pelo canal de sua preferência.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a
                href="mailto:contato@jaleca.com.br"
                className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-muted transition-colors"
              >
                E-mail
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
