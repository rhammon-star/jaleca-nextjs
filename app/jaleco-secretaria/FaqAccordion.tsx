'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Secretária precisa usar jaleco?", a: "Em clínicas, consultórios e farmácias, o jaleco padroniza a equipe e transmite higiene. Não é obrigatório por lei, mas é padrão de mercado." },
  { q: "Qual cor para recepção de clínica?", a: "Branco harmoniza com a equipe médica; rosé, azul-marinho ou preto são opções modernas para recepção." },
  { q: "Qual tecido é mais confortável para ficar sentada?", a: "Microfibra com elastano não repuxa ao sentar e mantém caimento o dia todo." },
  { q: "Posso bordar nome e função?", a: "Sim. Bordamos nome + função (Secretária, Recepcionista) gratuitamente." },
  { q: "Qual o melhor corte?", a: "Acinturado feminino com pences valoriza a silhueta em ambiente sentado." },
  { q: "Manga 3/4 ou longa?", a: "3/4 é a mais usada por secretárias — facilita digitação e atendimento sem repuxar." },
  { q: "Atende plus size?", a: "Sim, do PP ao GG3 feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias após recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim." },
  { q: "Tem desconto para clínica com várias recepcionistas?", a: "Sim, a partir de 5 peças com bordado padronizado." },
  { q: "O jaleco amassa ao ficar sentada o dia todo?", a: "Microfibra praticamente não amassa, mesmo após 8h sentada." },
  { q: "Combina com calça jeans e tênis?", a: "Combina. O caimento moderno permite looks casuais ou formais." },
  { q: "Tem bolsos para celular?", a: "Sim, bolso superior + dois inferiores amplos." },
  { q: "Faz personalização com logo da clínica?", a: "Sim. Bordamos logo + nome de cada secretária." },
  { q: "Tem versão curta, tipo blazer?", a: "Sim. O modelo de comprimento curto fica parecido com blazer profissional — ótimo para recepcionistas." },
  { q: "Como lavar para preservar a cor?", a: "Máquina, água até 40 °C, separado de cores. Sem cloro para brancos." },
  { q: "O jaleco serve para secretária de escritório (não clínica)?", a: "Pode servir, especialmente em ambientes corporativos que adotam uniforme. Cores escuras (preto, marinho) são mais comuns aí." },
  { q: "Qual a diferença entre jaleco secretária e enfermeira?", a: "O corte pode ser igual; muda o bordado (função vs COREN) e a preferência de cor (recepção tende a cores mais variadas)." }
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
