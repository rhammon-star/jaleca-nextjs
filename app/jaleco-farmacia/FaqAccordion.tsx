'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'É obrigatório usar jaleco na Farmácia?', a: 'Sim. A ANVISA (RDC 44/2009) exige uso de uniforme/jaleco em farmácias e drogarias para identificar o profissional e proteger contra contaminação. O CFF (Conselho Federal de Farmácia) reforça essa exigência.' },
  { q: 'Qual a cor do jaleco da Farmácia?', a: 'O branco é o padrão. Algumas redes de farmácia adotam cores corporativas (azul, verde) com bordado da empresa. Para farmacêuticos autônomos e em farmácias de manipulação, branco é o mais aceito.' },
  { q: 'Quem faz faculdade de Farmácia usa jaleco?', a: 'Sim. Estudantes de Farmácia usam jaleco branco em aulas práticas, estágio em farmácias e laboratórios. O modelo Slim Aluno (universitário) com manga longa e bolsos é o mais usado.' },
  { q: 'Como funciona a cerimônia do jaleco de Farmácia?', a: 'É um marco simbólico no início do estágio profissional ou da carreira. O estudante recebe o jaleco branco em cerimônia, marcando a transição para a prática profissional. Bordado com nome e profissão é comum.' },
  { q: 'O jaleco resiste a químicos da Farmácia?', a: 'O tecido gabardine da Jaleca tem boa resistência a respingos químicos comuns em manipulação. Para farmácia de manipulação com químicos pesados, recomenda-se EPI específico além do jaleco.' },
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
