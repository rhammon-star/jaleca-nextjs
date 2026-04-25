'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor uniforme para cozinheiro?',
    a: 'O cozinheiro profissional precisa de um uniforme que suporte altas temperaturas, respingos de gordura e lavagens frequentes. A Jaleca recomenda os dólmãs de cozinheiro — desenvolvidos especificamente para a rotina pesada da cozinha.',
  },
  {
    q: 'Dólmã é melhor que jaleco para cozinha?',
    a: 'Sim. O dólmã tem corte mais reto e tecido que não absorve gordura facilmente. É mais ventilado, mais fácil de lavar e mais durável em ambiente de cozinha profissional.',
  },
  {
    q: 'Posso usar jaleco tradicional na cozinha?',
    a: 'O jaleco tradicional pode ser usado em cozinhas menos intensas, mas para a rotina pesada de uma cozinha profissional, o dólmã é a escolha mais adequada e confortável.',
  },
  {
    q: 'Como cuidar do uniforme de cozinheiro?',
    a: 'Lave a 60°C com sabão desengordurante. Nunca use alvejante com cloro — escolma o tecido. Seque à sombra para preservar a cor e a integridade do tecido.',
  },
  {
    q: 'O uniforme de cozinheiro precisa de EPIs complementares?',
    a: 'Sim. Luvas resistentes ao calor, óculos de proteção e avental impermeável são EPIs obrigatórios em cozinhas profissionais. O dólmã é o uniforme base, não substitui o EPI.',
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
