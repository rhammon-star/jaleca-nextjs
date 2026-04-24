'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Qual o melhor jaleco para esteticista?', a: 'A esteticista trabalha com produtos químicos e equipamentos. O jaleco com elastano é ideal porque permite movimento durante os procedimentos e é fácil de lavar após cada dia de trabalho.' },
  { q: 'Esteticista pode usar jaleco branco?', a: 'Pode e é o mais comum. O branco transmite limpeza e profissionalismo, combina com qualquer ambiente de clínica de estética.' },
  { q: 'Qual a diferença entre jaleco Slim e Profissional?', a: 'O Slim tem corte ajustado e moderno. O Profissional tem corte mais amplo, oferecendo mais espaço de movimento para procedimentos estéticos.' },
  { q: 'Esteticista precisa de jaleco com proteção?', a: 'O jaleco funciona como barreira contra respingos de ácidos e produtos químicos usados em procedimentos estéticos. Use sempre durante o trabalho.' },
  { q: 'Como funciona a troca de tamanho?', a: 'Aceita troca em até 30 dias após o recebimento. Produto sem uso e com etiqueta. Manda mensagem pelo WhatsApp ou e-mail.' },
  { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. O prazo varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com o CEP.' },
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
