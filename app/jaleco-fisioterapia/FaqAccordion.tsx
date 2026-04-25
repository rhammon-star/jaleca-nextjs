'use client'
import { useState } from 'react'
const faqItems = [
  { q: 'Como tem que ser o jaleco de fisioterapia?', a: 'O jaleco do fisioterapeuta precisa permitir liberdade de movimento — você fica em posições variadas atendendo o paciente. Tecido respirável com elastano, modelagem que acompanha o corpo e mangas com corte que não restringe a articulação do ombro. Comprimento médio funciona melhor.' },
  { q: 'Pode colocar DR no jaleco de fisioterapia?', a: 'O fisioterapeuta com graduação completa pode usar "Dr." ou "Dra." conforme o CREFITO permite. Bordado com nome + "Fisioterapeuta CREFITO XXXXX" é o mais comum e respeita as normas profissionais.' },
  { q: 'Qual a cor do jaleco do fisioterapeuta?', a: 'Não há restrição rígida. O branco é o clássico e mais formal. Em clínicas modernas e atendimento desportivo, cores como azul-marinho, preto e bordô estão em alta. A Jaleca tem 12 cores em todos os modelos.' },
  { q: 'O que não é permitido ao fisioterapeuta?', a: 'O Código de Ética do CREFITO proíbe diagnóstico médico, prescrição de medicamentos e procedimentos cirúrgicos. Quanto ao uniforme, é proibido usar fora do trabalho e em estado sujo ou danificado.' },
  { q: 'Qual modelo de jaleco é melhor para fisioterapia?', a: 'O Slim é o mais escolhido — corte ajustado dá liberdade sem volume excessivo. Recomendamos modelo manga curta para ambientes mais ativos, ou manga longa para clínicas formais.' },
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
