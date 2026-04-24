'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Qual o melhor uniforme para sushiman?', a: 'O sushiman trabalha em ambiente de alta precisão e higiene. O dólar de cozinheiro é a escolha ideal — tecido profissional que resiste a respingos de peixe e é fácil de lavar.' },
  { q: 'Sushiman pode usar jaleco em vez de dólar?', a: 'O jaleco não é ideal para a cozinha japonesa porque o tecido não tem a mesma resistência a manchas de peixe e molhos que o dólar profissional oferece.' },
  { q: 'Qual a diferença entre dólar e jaleco para sushi?', a: 'O dólar tem tecido que repele manchas de gordura e peixe, é mais ventilado e mais fácil de lavar. O jaleco é mais formal mas menos prático para a cozinha japonesa.' },
  { q: 'O uniforme de sushiman precisa de EPIs?', a: 'Sim. Luvas descartáveis para manipular peixe cru, óculos de proteção e avental impermeável são EPIs importantes na cozinha japonesa.' },
  { q: 'Como funciona a troca?', a: 'Troca em até 30 dias. Produto sem uso e com etiqueta. WhatsApp ou e-mail com número do pedido.' },
  { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Prazo de 3 a 8 dias úteis conforme região — calculado no checkout.' },
]
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)
  const half = Math.ceil(faqItems.length / 2)
  const col1 = faqItems.slice(0, half), col2 = faqItems.slice(half)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12">
      {[col1, col2].map((col, ci) => col.map((item, i) => {
        const idx = ci * half + i, isOpen = openIndex === idx
        return (
          <div key={idx} className="border-t border-[#e5e0d8] overflow-hidden">
            <button onClick={() => toggle(idx)} className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer">
              <span className="text-[0.95rem] font-[400] text-[#1a1a1a] leading-snug pr-2">{item.q}</span>
              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#e5e0d8] text-[#6b6b6b] text-base transition-all duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', background: isOpen ? '#1a1a1a' : 'transparent', color: isOpen ? '#fff' : '#6b6b6b', borderColor: isOpen ? '#1a1a1a' : '#e5e0d8' }}>+</span>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '300px' : '0px' }}>
              <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
            </div>
          </div>
        )
      }))}
    </div>
  )
}
