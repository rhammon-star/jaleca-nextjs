'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor jaleco para enfermeiro?',
    a: 'O enfermeiro precisa de um jaleco que permita movimento constante e que aguente lavagens frequentes. O modelo com elastano é ideal — oferece conforto durante longas jornadas e é fácil de lavar.',
  },
  {
    q: 'Enfermeiro pode usar jaleco colorido?',
    a: 'A cor do jaleco para enfermeiro varia conforme o hospital ou clínica. Muitos estabelecimentos permitem cores como azul, verde e rosa, além do branco tradicional. Verifique as normas do seu local de trabalho.',
  },
  {
    q: 'Qual a diferença entre jaleco Slim e Profissional para enfermagem?',
    a: 'O Slim tem corte mais ajustado e moderno, ideal para ambientes de trabalho mais dinâmicos. O Profissional tem corte mais amplo, oferecendo mais espaço de movimento para procedimentos.',
  },
  {
    q: 'Enfermeiro precisa de jaleco com bolsos?',
    a: 'Sim. O bolso no peito é útil para canetas e equipamentos pequenos. Os bolsos laterais são ideais para ter tesouras, estetoscópio e outros instrumentos do dia a dia.',
  },
  {
    q: 'Como funciona a troca de tamanho?',
    a: 'Arrependimento em até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Manda uma mensagem pelo WhatsApp com o número do pedido.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com o CEP.',
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
