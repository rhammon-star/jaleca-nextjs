'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Dona de casa precisa usar jaleco?',
    a: 'O jaleco para dona de casa é uma questão de praticidade e proteção. Muita gente não sabe, mas o trabalho doméstico envolve exposição a produtos químicos, calor e gordura que justificam um uniforme adequado.',
  },
  {
    q: 'Qual o melhor modelo para trabalho doméstico?',
    a: 'O modelo com elastano é ideal porque permite liberdade de movimento durante as tarefas do dia a dia. A modelo Slim ou Profissional com bolsos é prática para guardar utensílios pequenos.',
  },
  {
    q: 'O jaleco protege contra produtos de limpeza?',
    a: 'O jaleco funciona como barreira entre a roupa e os produtos de limpeza, protegendo contra respingos de химикатов. Para limpeza pesada, use também luvas de borracha sobre o jaleco.',
  },
  {
    q: 'Posso usar o jaleco em casa?',
    a: 'Pode e é recomendado. O uso do jaleco exclusivamente em casa mantém a higiene e evita que sujeiras do ambiente doméstico contaminem outros espaços.',
  },
  {
    q: 'Como lavar o jaleco de uso doméstico?',
    a: 'Lave a 60°C para garantir a remoção de bactérias e fungos que se acumulam durante o trabalho doméstico. Use sabão neutro e alvejante sem cloro para preservar o tecido.',
  },
  {
    q: 'Dona de casa pode bordar o jaleco?',
    a: 'Sim! Borda o nome ou um apelido carinhoso no jaleco é uma forma de personalizar o uniforme. Para pedidos a partir de 5 peças, oferecemos condições especiais de bordado.',
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
