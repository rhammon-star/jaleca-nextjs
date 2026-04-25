'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Como deve ser o jaleco de Odontologia?', a: 'O jaleco do dentista precisa aguentar muita lavagem (com cloro inclusive), ter manga longa, fechamento que cubra bem o pescoço e ser branco para refletir a iluminação do consultório. Tecido com elastano dá conforto na posição em que o profissional fica.' },
  { q: 'Qual jaleco é melhor, Oxford ou Gabardine?', a: 'Gabardine é mais grosso, formal e durável. Oxford é mais leve e respirável. Para Odontologia, recomendamos tecido tipo gabardine com elastano — combina durabilidade com conforto. Todos os jalecos Jaleca usam essa composição.' },
  { q: 'É obrigatório o jaleco ser branco?', a: 'Não é obrigatório por lei, mas o CRO recomenda fortemente o branco para Odontologia em ambiente clínico. O branco transmite limpeza e permite identificar facilmente sujeiras. Cores claras (rosa-claro, azul-claro) são aceitas em alguns consultórios.' },
  { q: 'Qual o melhor tecido para jaleco em Odontologia?', a: 'Tecido tipo gabardine 67% poliéster + 30% viscose + 3% elastano é o ideal. Aguenta lavagem em água quente (até 60°C), resiste a manchas e mantém o formato. É o tecido usado em todos os jalecos Jaleca.' },
  { q: 'O jaleco aguenta lavagem com cloro?', a: 'O jaleco Jaleca suporta lavagem com alvejante sem cloro até 60°C. Para manchas pesadas, use produtos sem cloro — o cloro amarela o tecido e enfraquece as fibras. Lavar pelo avesso preserva a cor.' },
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
