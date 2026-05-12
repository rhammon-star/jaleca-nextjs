'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Advogado usa jaleco?", a: "É raro, mas advogados de empresas de saúde, perícia médica e direito veterinário às vezes usam jaleco em visitas técnicas a clínicas e hospitais." },
  { q: "OAB exige jaleco em algum momento?", a: "Não. A OAB exige terno e gravata em audiências, mas jaleco pode ser usado em contextos técnicos específicos (perícia, ambiente hospitalar)." },
  { q: "Qual a melhor cor de jaleco para advogado?", a: "Branco para ambiente hospitalar; preto ou azul-marinho para escritórios de perícia que querem ar mais formal." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano é leve, formal e não amassa entre reuniões e diligências." },
  { q: "Posso bordar OAB e nome?", a: "Sim. Bordamos nome + número da OAB e seccional gratuitamente." },
  { q: "Qual corte transmite mais formalidade?", a: "Corte reto masculino tradicional, comprimento meio da coxa, gola padre — equivalente ao blazer." },
  { q: "Manga longa ou curta?", a: "Manga longa é praticamente regra para advogado — transmite formalidade." },
  { q: "Tem tamanho plus size?", a: "Sim. Modelos masculinos vão do P ao GG3." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome + OAB grátis." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, Correios e transportadoras cobrem todo o território nacional." },
  { q: "Tem desconto para escritório de advocacia?", a: "Sim, a partir de 5 peças com personalização padronizada." },
  { q: "Posso usar em audiência?", a: "Não recomendado. Audiência exige terno e gravata. O jaleco serve para perícia, diligência hospitalar e contextos técnicos." },
  { q: "Tem bolsos para celular e caneta?", a: "Sim, bolso superior + dois inferiores amplos." },
  { q: "O jaleco amassa em viagem?", a: "Microfibra praticamente não amassa — ideal para advogados que viajam para diligências." },
  { q: "Faz personalização com logo do escritório?", a: "Sim. Bordamos logo do escritório + nome de cada advogado." },
  { q: "Combina com terno por baixo?", a: "Combina. Muitos advogados usam o jaleco por cima da camisa social, retirando o paletó." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, sem cloro. Microfibra dispensa ferro." },
  { q: "O jaleco encolhe?", a: "Não, tecidos são pré-encolhidos." }
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  const half = Math.ceil(faqItems.length / 2)
  const col1 = faqItems.slice(0, half)
  const col2 = faqItems.slice(half)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12">
      {[col1, col2].map((col, ci) =>
        col.map((item, i) => {
          const idx = ci * half + i
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="border-t border-[#e5e0d8] overflow-hidden">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
              >
                <span className="text-[0.95rem] font-[400] text-[#1a1a1a] leading-snug pr-2">{item.q}</span>
                <span
                  className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#e5e0d8] text-[#6b6b6b] text-base transition-all duration-300"
                  style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    background: isOpen ? '#1a1a1a' : 'transparent',
                    color: isOpen ? '#fff' : '#6b6b6b',
                    borderColor: isOpen ? '#1a1a1a' : '#e5e0d8',
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? '300px' : '0px' }}
              >
                <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
