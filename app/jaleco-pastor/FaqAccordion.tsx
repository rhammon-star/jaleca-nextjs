'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Qual o melhor jaleco para pastor?', a: 'O pastor usa o jaleco em ceremonies religiosas e atividades pastorais. O modelo Profissional transmite seriedade e respeito. O branco é a cor mais tradicional para contextos religiosos.' },
  { q: 'Pastor pode usar jaleco preto?', a: 'Pode. O jaleco preto é cada vez mais aceito em contextos religiosos modernos. Transmite seriedade e elegância em ceremonies e eventos eclesiásticos.' },
  { q: 'Qual a diferença entre jaleco Slim e Profissional?', a: 'O Profissional tem corte mais amplo e estruturado — ideal para ceremonies formais. O Slim tem visual mais contemporâneo, aceito em ambientes religiosos mais informais.' },
  { q: 'O jaleco de pastor pode ter bordado?', a: 'Sim. Borda o nome e título pastoral é prática comum. Para pedidos a partir de 5 peças, oferecemos condições especiais de bordado.' },
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
