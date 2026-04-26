'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Advogada precisa usar jaleco no tribunal?',
    a: 'Não é obrigatório. O traje forense exige toga e vestes talares, não jaleco. O conjunto é usado em audiências de custódia, defensorias públicas e atendimentos de jurídica popular onde há contato direto com clientes.',
  },
  {
    q: 'Qual o melhor conjunto para advogada?',
    a: 'O Conjunto Executiva transmite autoridade e sofisticação — ideal para audiências e escritórios. O Conjunto Puff Zíper é mais moderno, aceito em departamentos jurídicos de empresas. Ambos em tecido premium com elastano.',
  },
  {
    q: 'Conjunto para advogada pode ter bordado?',
    a: 'Sim. É muito comum bordar o nome da advogada e o número da OAB. Para pedidos acima de 5 peças, a Jaleca oferece condições especiais de bordado corporativo. Entre em contato pelo e-mail contato@jaleca.com.br.',
  },
  {
    q: 'Qual cor é mais indicada para advogada?',
    a: 'O preto transmite autoridade e é a escolha clássica no meio jurídico. O branco passa credibilidade e higiene. Ambas as cores são amplamente aceitas — não há restrição da OAB quanto à cor do uniforme.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com o CEP. Capitais do Sudeste geralmente recebem em 3 a 5 dias.',
  },
  {
    q: 'Como funciona a troca de tamanho?',
    a: 'Arrependimento em até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Manda uma mensagem pelo WhatsApp com o número do pedido.',
  },
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  const half = Math.ceil(faqItems.length / 2)
  const col1 = faqItems.slice(0, half)
  const col2 = faqItems.slice(half)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12">
      {[col1, col2].map((col, ci) =>
        col.map((item, i) => {
          const idx = ci * half + i
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="border-t border-[#e5e0d8] overflow-hidden">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
              >
                <span className="text-[0.95rem] font-[400] text-[#1a1a1a] leading-snug pr-2">{item.q}</span>
                <span
                  className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#e5e0d8] text-[#6b6b6b] text-base transition-all duration-300"
                  style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    background: isOpen ? '#1a1a1a' : 'transparent',
                    color: isOpen ? '#fff' : '#6b6b6b',
                    borderColor: isOpen ? '#1a1a1a' : '#e5e0d8',
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? '300px' : '0px' }}
              >
                <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
