'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Qual o melhor jaleco para veterinário?', a: 'O veterinário trabalha com animais e produtos químicos. O modelo com elastano é ideal porque aguenta lavagens frequentes e permite movimento durante procedimentos.' },
  { q: 'Veterinário pode usar jaleco colorido?', a: 'Pode. Cores como azul e verde são populares em clínicas veterinárias. O branco transmite higiene e é a escolha mais tradicional.' },
  { q: 'Qual a diferença entre jaleco Slim e Profissional?', a: 'O Slim tem corte ajustado e visual moderno. O Profissional tem corte mais amplo, transmitindo mais formalidade para o ambiente clínico.' },
  { q: 'Veterinário precisa de jaleco com proteção?', a: 'Sim. O jaleco funciona como barreira contra pelos, fluidos animais e produtos químicos. Deve ser usado exclusivamente durante o trabalho.' },
  { q: 'Como funciona a troca?', a: 'Arrependimento: até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. WhatsApp ou e-mail com número do pedido.' },
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
