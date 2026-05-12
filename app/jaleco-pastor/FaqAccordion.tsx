'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Pastor pode usar jaleco?", a: "Pode, especialmente em hospitais (capelania), visitação a doentes e contextos onde o pastor atua junto a equipes médicas." },
  { q: "Qual cor é mais apropriada?", a: "Branco para capelania hospitalar; preto para pastoreio formal em algumas denominações." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano: leve, formal, não amassa em visitas longas." },
  { q: "Posso bordar nome e função (Pastor / Capelão)?", a: "Sim. Bordamos nome + função (Pastor, Capelão Hospitalar, Reverendo) gratuitamente." },
  { q: "Qual corte transmite mais sobriedade?", a: "Corte reto masculino tradicional, gola padre, comprimento meio da coxa." },
  { q: "Manga longa ou curta?", a: "Longa para capelania hospitalar (protocolo). Curta para visitas em climas muito quentes." },
  { q: "Tem plus size?", a: "Sim, do P ao GG3." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, atendemos todo o território nacional." },
  { q: "Tem desconto para igreja com vários pastores?", a: "Sim, a partir de 5 peças. Bordado padronizado disponível." },
  { q: "O jaleco serve para evangelismo em hospital?", a: "Sim — o jaleco facilita acesso a UTIs e quartos hospitalares onde se exige aparência profissional." },
  { q: "Combina com camisa social por baixo?", a: "Combina. A maioria dos pastores usa camisa social + jaleco em capelania." },
  { q: "Tem bolsos para Bíblia pequena?", a: "Sim, bolsos amplos suportam Bíblia de bolso, celular e caneta." },
  { q: "O jaleco amassa em visitas longas?", a: "Microfibra mantém o caimento mesmo em dias longos de visita." },
  { q: "Faz personalização com logo da igreja?", a: "Sim. Bordamos logo da igreja + nome do pastor." },
  { q: "Posso usar em culto?", a: "Tradicionalmente o jaleco é para capelania e visitação, não para culto, mas algumas denominações adotam jaleco preto curto em culto." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, separado de cores. Dispensa ferro." },
  { q: "Qual a diferença entre jaleco pastor e médico?", a: "Visualmente similares; muda o bordado (função pastoral vs CRM). Pastores costumam preferir tecidos formais." }
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
