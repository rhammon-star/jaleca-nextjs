'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Como evitar manchas no jaleco branco?',
    a: 'Apply sabão neutro imediatamente quando sujar. Nunca use alvejante com cloro diretamente — prefira alvejante sem cloro ou água oxigenada 10 volumes. Seque à sombra para evitar amarelamento. Guarde sempre limpo e seco.',
  },
  {
    q: 'Qual o melhor tecido para jaleco branco profissional?',
    a: 'O melhor tecido é gabardine com elastano — resistente, não amassa fácil e não desbota. Na Jaleca, usamos 67% poliéster, 33% algodão e 3-8% elastano. Suporta lavagem a 60°C e mantém a brancura com os cuidados certos.',
  },
  {
    q: 'Jaleco branco feminino e masculino têm corte diferente?',
    a: 'Sim. O jaleco feminino tem busto estruturado, cintura levemente marcada e quadril com espaço. O masculino tem ombros mais largos, peito mais amplo e corte reto. Ambos com elastano para conforto o dia todo.',
  },
  {
    q: 'Jaleco com elastano desbota mais rápido?',
    a: 'Não. O elastano em si não causa desbotamento — o problema é o excesso de temperatura na lavagem ou secadora. Jalecos Jaleca com elastano mantêm cor e forma por muito tempo seguindo as instruções de lavagem: 60°C máximo, sem secadora.',
  },
  {
    q: 'Posso usar jaleco branco em consultório odontológico?',
    a: 'Sim. O jaleco branco é o mais tradicional e aceito em odontologia, medicina e demais profissões de saúde. O CRO não exige branco — apenas exige visual limpo e profissional. Tons pastel discretos também são permitidos.',
  },
  {
    q: 'O jaleco branco amarela com o tempo?',
    a: 'Pode amarelar se guardado sujo, exposto ao sol diretament ou lavado com água muito quente. Jalecos Jaleca usam branqueadores ópticos de alta durabilidade. Se começar a amarelar, deixe de molho em água fria com vinagre branco por 30 minutos.',
  },
  {
    q: 'Como saber qual tamanho escolher?',
    a: 'Meça busto (parte mais cheia), cintura e quadril com fita métrica. Compare com a tabela de medidas Jaleca. Se estiver entre dois tamanhos, escolha o maior — o elastano permite ajuste. Em caso de dúvida, fale no WhatsApp.',
  },
  {
    q: 'Qual o prazo de entrega do jaleco branco?',
    a: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis conforme sua região. Capitais do Sudeste geralmente recebem em 3 a 5 dias. Frete grátis para compras acima de R$499.',
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