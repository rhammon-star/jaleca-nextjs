'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Como deve ser o jaleco do estudante de Medicina?', a: 'O jaleco do estudante de Medicina deve ter manga longa, comprimento médio e tecido respirável com elastano. O modelo Slim acompanha o corpo sem apertar e tem caimento moderno; o Profissional é mais estruturado. Branco é o padrão; bordado com nome é comum em algumas faculdades.' },
  { q: 'Como se chama o jaleco do médico?', a: 'No Brasil é chamado de "jaleco" ou "guarda-pó". Internamente nos hospitais, profissionais usam também o "scrub" (pijama cirúrgico). Na Jaleca o jaleco profissional vem nas modelagens Slim, Profissional, Princesa e Tradicional.' },
  { q: 'Qual o preço médio de um jaleco?', a: 'Jaleco profissional de boa qualidade custa entre R$200 e R$350. Versões com tecido premium e elastano (caso da Jaleca) ficam na faixa de R$280-R$320. Pagando no PIX, 5% de desconto.' },
  { q: 'O que significa "scrubs"?', a: 'Scrub é o conjunto de blusa + calça (pijama cirúrgico) usado em ambiente hospitalar. Tecido respirável, mais leve que o jaleco tradicional. A Jaleca tem scrubs femininos e masculinos do PP ao G3.' },
  { q: 'Qual a diferença entre jaleco Slim e Profissional?', a: 'O Slim tem corte ajustado ao corpo, ideal para visual moderno. O Profissional tem corte mais amplo e estruturado, transmitindo formalidade. Ambos com elastano para conforto durante longas jornadas.' },
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
