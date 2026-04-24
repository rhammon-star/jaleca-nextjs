'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor jaleco para barbeiro?',
    a: 'O jaleco para barbeiro deve ser prático e resistente. A Jaleca recomenda modelos com elastano para facilitar os movimentos durante o corte. O modelo Slim ou Profissional com bolsos laterais reforçados é ideal para a rotina da barbearia.',
  },
  {
    q: 'Barbeiro pode usar jaleco preto?',
    a: 'Pode e é uma escolha cada vez mais popular. O jaleco preto transmite modernidade e estilo, combinando com a estética de barbearias contemporâneas. A Jaleca oferece todos os modelos em preto.',
  },
  {
    q: 'Jaleco de barbeiro precisa de bolsos?',
    a: 'Sim. O bolso no peito é útil para canetas e equipamentos pequenos. Os bolsos laterais são ideais para tesouras e pentes. Todos os jalecos Jaleca têm essa configuração.',
  },
  {
    q: 'Como lavar o jaleco de barbeiro?',
    a: 'A lavaじゃん a 60°C é suficiente para remover gordura e produtos capilares. Evite alvejante com cloro. Seque à sombra para preservar a cor, especialmente em jalecos pretos.',
  },
  {
    q: 'Jaleco de barbeiro pode ter bordado?',
    a: 'Sim, bordar o nome da barbearia ou nome do barbeiro é muito comum. Para pedidos a partir de 5 peças, a Jaleca oferece condições especiais de bordado. Entre em contato pelo e-mail.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com o CEP. Capitais do Sudeste geralmente recebem em 3 a 5 dias.',
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
