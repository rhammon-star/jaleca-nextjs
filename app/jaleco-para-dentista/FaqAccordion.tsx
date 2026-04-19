'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual comprimento de jaleco é mais indicado para dentistas?',
    a: 'Para odontologia, o jaleco curto (até o quadril) é mais popular por facilitar o movimento ao redor da cadeira odontológica. O longo (abaixo do joelho) é mais usado em procedimentos cirúrgicos. Ambos estão disponíveis na Jaleca.',
  },
  {
    q: 'O jaleco pode ser lavado com água quente e alvejante?',
    a: 'Os jalecos Jaleca suportam lavagem a 60°C, temperatura suficiente para higienização clínica. O uso de alvejante clorado deve ser feito com moderação — recomendamos alvejante sem cloro para preservar o tecido e a cor.',
  },
  {
    q: 'Tenho um consultório e quero personalizar com bordado. É possível?',
    a: 'Sim! Para pedidos corporativos acima de 5 peças, entre em contato pelo e-mail contato@jaleca.com.br para condições especiais de personalização com nome, CRO e logo do consultório.',
  },
  {
    q: 'Como funciona a troca de tamanho?',
    a: 'Aceitamos troca em até 30 dias após o recebimento, com o produto sem uso e com etiqueta. Basta entrar em contato pelo WhatsApp ou e-mail com o número do pedido — simples assim.',
  },
  {
    q: 'Qual a diferença entre jaleco com e sem elastano?',
    a: 'O elastano (entre 3% e 8%) adiciona memória ao tecido: ele retorna à forma após o movimento. Para dentistas que passam horas com os braços elevados, a diferença no conforto é significativa. Todos os jalecos Jaleca têm elastano.',
  },
  {
    q: 'O jaleco branco amarela com o tempo?',
    a: 'Com os cuidados corretos — lavar sempre, não deixar sujo guardado, usar sabão neutro — o jaleco mantém a brancura por muito mais tempo. Usamos branqueadores ópticos de alta durabilidade no processo de fabricação.',
  },
  {
    q: 'Posso usar o jaleco Jaleca em consultórios com normas de biossegurança?',
    a: 'Sim. Nossos jalecos atendem às recomendações do CFO para vestimenta clínica: manga longa, tecido liso, fechamento frontal. Para procedimentos de maior risco, recomendamos o uso sobre avental descartável.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis dependendo da região, calculado no checkout com seu CEP. Para capitais do Sudeste, geralmente 3 a 5 dias.',
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
