'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Qual o melhor jaleco para médico?', a: 'O médico precisa de um jaleco que transmita autoridade e seja confortável para longas jornadas. O modelo Profissional com elastano é o mais indicado — estruturado, formal e confortável.' },
  { q: 'Médico pode usar jaleco colorido?', a: 'O CFM exige jaleco branco para médicos em ambiente hospitalar. Cores podem ser aceitas em consultórios particulares, mas o branco transmite mais autoridade e é mandatory em hospitais.' },
  { q: 'Qual a diferença entre jaleco Slim e Profissional?', a: 'O Profissional tem corte mais amplo e estruturado, transmitindo mais formalidade — ideal para hospitais e consultórios. O Slim tem corte ajustado e visual mais moderno.' },
  { q: 'Médico pode ter jaleco com bordado?', a: 'Sim. Borda o nome e CRM é prática comum e recomendada. Para pedidos a partir de 5 peças, oferecemos condições especiais de bordado corporativo.' },
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
