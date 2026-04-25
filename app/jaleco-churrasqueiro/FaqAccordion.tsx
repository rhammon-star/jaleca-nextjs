'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor uniforme para churrasqueiro?',
    a: 'O churrasqueiro profissional trabalha em ambientes de alta temperatura e gordura. A Jaleca recomenda os dólmãs de cozinheiro — tecidos especiais que resistem a respingos de gordura e são confortáveis mesmo perto da brasa.',
  },
  {
    q: 'Churrasqueiro pode usar jaleco comum?',
    a: 'O jaleco tradicional não é o mais indicado para churrasqueiro, pois o tecido não tem a mesma resistência a gordura que o dólmã. O dólmã Jaleca foi desenvolvido especificamente para a rotina da cozinha e churrascaria.',
  },
  {
    q: 'Dólmã é melhor que jaleco para churrasqueiro?',
    a: 'Sim. O dólmã tem corte mais reto, tecidos que não absorvem gordura facilmente e são mais ventilados. São a escolha padrão em cozinhas profissionais e churrascarias.',
  },
  {
    q: 'Churrasqueiro precisa de EPI?',
    a: 'Sim. Luvas de proteção, óculos e avental impermeável são EPIs obrigatórios. O dólmã Jaleca não substitui o EPI, mas é o uniforme base ideal para a função.',
  },
  {
    q: 'Como lavar o uniforme de churrasqueiro?',
    a: 'Lave a 60°C para remover gordura incrustada. Use sabão desengordurante. Seque à sombra para preservar o tecido. Evite alvejante com cloro — use alvejante sem cloro.',
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
