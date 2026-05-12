'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Psicóloga precisa usar jaleco no consultório?", a: "Não é obrigatório pelo CRP, mas muitas profissionais escolhem usar para reforçar identidade profissional, especialmente em clínicas multidisciplinares." },
  { q: "Qual cor de jaleco é mais usada por psicólogas?", a: "Branco e rosé são os mais procurados; preto e azul-marinho também aparecem em consultórios mais sóbrios." },
  { q: "Qual tecido é mais agradável para atendimento sentado?", a: "Microfibra com elastano é leve, não amassa fácil e mantém o caimento durante sessões longas sentadas." },
  { q: "Posso bordar CRP e nome?", a: "Sim. Bordamos nome completo + CRP no peito esquerdo, sem custo adicional." },
  { q: "Qual o melhor corte para psicóloga?", a: "Acinturado com pences — transmite cuidado e profissionalismo sem o ar excessivamente clínico do jaleco médico." },
  { q: "Manga longa ou 3/4 para consultório?", a: "Manga longa transmite mais formalidade; 3/4 é mais leve no verão. As duas funcionam no consultório de psicologia." },
  { q: "Qual comprimento favorece?", a: "Comprimento no meio da coxa harmoniza com calça social, jeans ou vestido — o mais versátil." },
  { q: "Tem jaleco preto para psicóloga?", a: "Sim. O preto é especialmente procurado por psicólogas que querem um ar mais sóbrio e moderno." },
  { q: "Atende plus size?", a: "Sim. Modelagem feminina vai do PP ao GG3, com ajuste real para corpos curvilíneos." },
  { q: "Quanto custa o jaleco para psicóloga?", a: "A partir de R$ 119,90 com bordado de nome + CRP grátis." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar se a numeração não servir?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado personalizado." },
  { q: "Frete grátis para todo Brasil?", a: "Frete grátis acima do valor mínimo da loja. Confira no checkout." },
  { q: "O jaleco amarrota muito?", a: "Microfibra praticamente não amarrota — sai da máquina pronta para vestir." },
  { q: "Posso passar a ferro?", a: "Pode, em temperatura média. Mas o tecido geralmente dispensa ferro." },
  { q: "Tem modelo curto, tipo blazer?", a: "Sim. Temos modelo de comprimento curto que se parece com blazer profissional — muito usado por psicólogas em consultórios modernos." },
  { q: "Combina com calça social e tênis?", a: "Combina perfeitamente. O caimento moderno permite looks formais ou casuais." },
  { q: "Faz personalização para clínicas de psicologia?", a: "Sim. Personalizamos com logo da clínica + nome de cada profissional, com desconto a partir de 5 peças." },
  { q: "Qual a diferença entre jaleco psicóloga e médica?", a: "Visualmente o corte é semelhante; psicólogas costumam preferir cores e cortes mais modernos e menos hospitalares." },
  { q: "Posso usar em atendimento online?", a: "Sim. Muitas psicólogas usam jaleco em sessões online para reforçar identidade profissional na câmera." }
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
