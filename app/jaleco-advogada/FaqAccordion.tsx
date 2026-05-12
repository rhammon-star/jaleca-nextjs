'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Advogada pode usar jaleco no exercício profissional?", a: "Pode, em contextos técnicos (perícia, visita hospitalar, advocacia em saúde). Em audiências, o código de ética da OAB exige traje social." },
  { q: "Qual a melhor cor para advogada?", a: "Branco em ambiente hospitalar; preto e azul-marinho para escritórios formais ou perícias." },
  { q: "Tem modelo acinturado feminino?", a: "Sim. Modelagem feminina com pences valoriza a silhueta e mantém formalidade." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano: leve, não amassa e mantém o caimento formal." },
  { q: "Posso bordar OAB e nome?", a: "Sim. Bordamos nome + OAB + seccional sem custo." },
  { q: "Qual comprimento favorece o look formal?", a: "Meio da coxa é o mais versátil — combina com calça social, saia lápis ou vestido." },
  { q: "Manga longa ou 3/4?", a: "Longa transmite mais formalidade. 3/4 é alternativa elegante para climas quentes." },
  { q: "Atende plus size?", a: "Sim, do PP ao GG3 com modelagem que respeita o corpo feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome + OAB grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar o tamanho?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, para todo o território nacional." },
  { q: "Tem desconto para escritório?", a: "Sim, a partir de 5 peças há desconto progressivo." },
  { q: "Combina com salto e calça social?", a: "Sim. O caimento foi pensado para harmonizar com look social profissional." },
  { q: "O jaleco amarrota?", a: "Microfibra praticamente não amarrota — chega pronto para vestir." },
  { q: "Faz personalização com logo do escritório?", a: "Sim. Bordamos logo + nome individual da advogada." },
  { q: "Tem gola V ou gola padre?", a: "Os dois modelos. Gola padre transmite mais formalidade; gola V é mais moderna." },
  { q: "Posso usar em audiência?", a: "Não. Audiência exige traje social. Use o jaleco em perícia, diligência e advocacia em saúde." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, separado de cores. Dispensa ferro." },
  { q: "Qual a diferença entre jaleco advogada e médica?", a: "O corte pode ser igual; muda o bordado (OAB vs CRM) e geralmente a escolha por tecidos mais formais e cores escuras." }
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
