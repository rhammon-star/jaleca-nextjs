'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual comprimento de jaleco é mais indicado para dentistas?',
    a: 'Jaleco curto (até o quadril) é o mais comum na odontologia — facilita o movimento ao redor da cadeira. O longo (abaixo do joelho) fica mais para cirurgias. Ambos disponíveis na Jaleca.',
  },
  {
    q: 'O jaleco pode ser lavado com água quente e alvejante?',
    a: 'Nossos jalecos aguentam lavagem a 60°C para higienização clínica. Use alvejante clorado com moderação. Recomendamos alvejante sem cloro para preservar o tecido e a cor.',
  },
  {
    q: 'Tenho um consultório e quero personalizar com bordado. É possível?',
    a: 'Sim. Para pedidos corporativos acima de 5 peças, fala com a gente pelo contato@jaleca.com.br. Temos condições especiais para bordado com nome, CRO e logo do consultório.',
  },
  {
    q: 'Como funciona a troca de tamanho?',
    a: 'Aceita troca em até 30 dias após o recebimento. Produto sem uso e com etiqueta. Manda uma mensagem pelo WhatsApp ou e-mail com o número do pedido — só isso.',
  },
  {
    q: 'Qual a diferença entre jaleco com e sem elastano?',
    a: 'O elastano (3–8%) dá memória ao tecido: ele volta ao formato depois de cada movimento. Faz diferença real para quem trabalha horas com os braços levantados. Todos os jalecos Jaleca têm elastano.',
  },
  {
    q: 'O jaleco branco amarela com o tempo?',
    a: 'Com os cuidados certos — lavar sempre, não guardar sujo, usar sabão neutro — a brancura dura muito mais. Usamos branqueadores ópticos de alta durabilidade na fabricação.',
  },
  {
    q: 'Posso usar o jaleco Jaleca em consultórios com normas de biossegurança?',
    a: 'Sim. Nossos jalecos seguem as recomendações do CFO: manga longa, tecido liso, fechamento frontal. Para procedimentos de maior risco, use por cima de um avental descartável.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com o CEP. Capitais do Sudeste geralmente recebem em 3 a 5 dias.',
  },
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
