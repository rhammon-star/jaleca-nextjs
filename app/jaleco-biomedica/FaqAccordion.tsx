'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor jaleco para biomédico?',
    a: 'O jaleco para biomédico deve seguir as normas da ANVISA e do CFM. Recomendamos o modelo Profissional com manga longa e tecido com elastano para conforto durante longas horas em laboratório.',
  },
  {
    q: 'Biomédico precisa de jaleco com proteção?',
    a: 'Sim. Em laboratórios, o jaleco funciona como EPI complementar, protegendo contra respingos de reagentes químicos e materiais biológicos. Deve ser usado exclusivamente no ambiente de trabalho.',
  },
  {
    q: 'Qual a cor apropriada para jaleco de biomédico?',
    a: 'O branco é o mais tradicional e higiênico. Algumas instituições permitem cores claras, mas o branco facilita a visualização de contaminação e é widely aceito em laboratórios clínicos.',
  },
  {
    q: 'O jaleco pode ser lavado em alta temperatura?',
    a: 'Sim. Os jalecos Jaleca suportam lavagem até 60°C, temperatura suficiente para desinfecção em ambiente laboratorial. Use alvejante sem cloro para preservar o tecido.',
  },
  {
    q: 'Biomédico pode ter jaleco com bordado?',
    a: 'Sim, bordar o nome e número do CRB é prática comum. Para pedidos a partir de 5 peças com bordado corporativo, a Jaleca oferece condições especiais. Entre em contato pelo e-mail.',
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
