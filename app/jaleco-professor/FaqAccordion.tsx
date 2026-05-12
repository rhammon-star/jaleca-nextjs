'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Professor precisa de jaleco?", a: "Em laboratórios de química, biologia e física, sim — por norma de segurança. Em sala comum, é opcional e usado por identidade profissional." },
  { q: "Qual cor para laboratório?", a: "Branco é praticamente padrão em laboratórios de ciências, por permitir identificar respingos de reagentes rapidamente." },
  { q: "Qual tecido aguenta laboratório?", a: "Microfibra com tratamento antichama leve ou algodão denso. Evite tecidos finos demais para ambiente de bancada." },
  { q: "Posso bordar nome e instituição?", a: "Sim. Bordamos nome do professor + instituição/disciplina gratuitamente." },
  { q: "Qual corte é mais usado?", a: "Corte reto masculino, manga longa, comprimento meio da coxa — padrão laboratorial." },
  { q: "Manga longa é obrigatória em laboratório?", a: "Sim. Manga longa protege braços de respingos de reagentes — regra de segurança em quase toda universidade." },
  { q: "Tem plus size?", a: "Sim, do P ao GG3 masculino e PP ao GG3 feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias, sem uso e sem bordado." },
  { q: "Frete para todo Brasil?", a: "Sim, atendemos todo o território nacional." },
  { q: "Tem desconto para escola/universidade?", a: "Sim, a partir de 5 peças. Bordado padronizado para corpo docente disponível." },
  { q: "O jaleco serve para professor de educação física?", a: "Geralmente não — professor de educação física usa uniforme esportivo. O jaleco é mais usado por professores de exatas e biológicas." },
  { q: "Resiste a respingos químicos?", a: "Resiste a respingos leves; para reagentes corrosivos é necessário EPI específico além do jaleco." },
  { q: "Tem bolsos para canetas e calculadora?", a: "Sim: bolso superior + dois inferiores." },
  { q: "Como lavar manchas de tinta de quadro?", a: "Aplique álcool isopropílico na mancha fresca, esfregue suavemente e lave normalmente." },
  { q: "Posso usar fora do laboratório, em sala?", a: "Sim. Muitos professores universitários adotam jaleco como identidade profissional em sala de aula." },
  { q: "O jaleco amassa?", a: "Microfibra praticamente não amassa, mesmo entre aulas e deslocamentos." },
  { q: "Tem versão feminina?", a: "Sim, com modelagem acinturada feminina específica." },
  { q: "Qual a diferença entre jaleco professor e médico?", a: "Funcionalmente idênticos; muda o bordado (instituição/disciplina vs CRM) e às vezes o tecido conforme uso laboratorial." }
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
