'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'O que é scrub em enfermagem?', a: 'Scrub é o conjunto pijama cirúrgico (blusa + calça) usado por profissionais de enfermagem em ambiente hospitalar. Mais leve e prático que o jaleco tradicional, foi adaptado dos uniformes cirúrgicos. Tecido respirável e modelagem que permite movimento amplo.' },
  { q: 'Scrub substitui jaleco?', a: 'Em alguns ambientes (UTI, centro cirúrgico, pronto-socorro) o scrub substitui completamente o jaleco. Em outros (consultório, ambulatório, atendimento administrativo) o jaleco continua sendo usado. Muitos profissionais têm os dois e alternam conforme o turno.' },
  { q: 'O que é o scrub do hospital?', a: 'É o pijama cirúrgico fornecido pelos hospitais para profissionais de áreas críticas (cirurgia, UTI). Geralmente em verde ou azul claro. O profissional troca antes de entrar e sai do uniforme próprio.' },
  { q: 'Qual a diferença entre scrubs e pijama cirúrgico?', a: 'Tecnicamente é o mesmo: blusa + calça em tecido leve usado em ambiente hospitalar. "Scrub" é o termo internacional (vem do inglês "to scrub" — esfregar/lavar antes de cirurgia). "Pijama cirúrgico" é a tradução literal.' },
  { q: 'Qual o melhor scrub para enfermagem?', a: 'Procure tecido com elastano para movimento, gola V que não aperta, calça com elástico ajustável e bolsos amplos. O scrub Jaleca cumpre todos esses requisitos, vai do PP ao G3 em 12 cores.' },
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
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '500px' : '0px' }}>
              <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
            </div>
          </div>
        )
      }))}
    </div>
  )
}
