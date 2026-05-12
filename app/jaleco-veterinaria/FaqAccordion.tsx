'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Médica veterinária pode usar jaleco feminino acinturado?", a: "Sim. O modelo acinturado é totalmente profissional e oferece caimento mais elegante, sem perder funcionalidade clínica." },
  { q: "Qual a cor preferida das veterinárias?", a: "Branco lidera, seguido de rosé e azul-marinho — cores que combinam com a rotina entre consultório e clínica." },
  { q: "Qual tecido é mais confortável para veterinária?", a: "Microfibra com 5% de elastano oferece elasticidade para se abaixar, agachar e atender pets sem repuxar." },
  { q: "É possível bordar CRMV e nome?", a: "Sim. Bordamos nome, profissão e CRMV no peito esquerdo sem custo extra." },
  { q: "O modelo feminino tem pences?", a: "Sim. Pences na frente e costas dão caimento ajustado à silhueta, sem apertar." },
  { q: "Qual o comprimento ideal?", a: "Comprimento até o meio da coxa é o mais escolhido — protege e mantém elegância." },
  { q: "Tem manga 3/4 para veterinária?", a: "Sim, manga 3/4 e manga longa estão disponíveis. A 3/4 facilita lavagem das mãos entre atendimentos." },
  { q: "Atende tamanhos plus size?", a: "Sim. Linha feminina vai do PP ao GG3, com modelagem que respeita o corpo plus." },
  { q: "O jaleco resiste a pelos de animais?", a: "Microfibra solta menos pelo do que algodão puro — basta passar rolinho ou lavar normalmente." },
  { q: "Como lavar para preservar a cor branca?", a: "Lave separado, água até 40 °C, sem cloro. Use alvejante sem cloro ocasionalmente para manter o branco." },
  { q: "Quanto custa um jaleco feminino veterinário?", a: "A partir de R$ 119,90, com bordado de nome + CRMV gratuito." },
  { q: "Qual o prazo de entrega com bordado?", a: "Entre 5 e 10 dias úteis após confirmação do pagamento." },
  { q: "Posso devolver se não servir?", a: "Sim, dentro de 7 dias após o recebimento, desde que o jaleco esteja sem uso e sem bordado." },
  { q: "Tem frete grátis?", a: "Sim, em compras acima do valor mínimo. Confira na página do produto." },
  { q: "Vocês fazem uniforme para clínicas inteiras?", a: "Sim. Atendemos clínicas com personalização padronizada — logo, cor e bordado uniforme para toda a equipe." },
  { q: "Modelagem repuxa quando me abaixo para atender o pet?", a: "Não. O elastano dá elasticidade e as pences acomodam o movimento de agachar." },
  { q: "Existe versão com decote V?", a: "Sim, alguns modelos femininos têm gola V; outros têm gola de padre tradicional." },
  { q: "O jaleco serve para consulta domiciliar?", a: "Sim, é leve, dobra fácil e cabe em bolsa para visitas domiciliares." },
  { q: "Qual diferença entre jaleco veterinária e enfermeira?", a: "O corte é semelhante; a diferença está no tipo de bordado (CRMV vs COREN) e no perfil de tecido escolhido." },
  { q: "Como tirar manchas de iodo do jaleco?", a: "Aplique água oxigenada 10 volumes na mancha fresca antes da lavagem; evite cloro, que amarela o tecido." }
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
