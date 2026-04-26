'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual o melhor tecido para jaleco de enfermagem?',
    a: 'O melhor tecido é gabardine com elastano — resistente, respirável e que não amassa. Na Jaleca, jalecos para enfermagem têm 67% poliéster, 33% algodão e 3-8% elastano. Suporta lavagens constantes e mantém a forma.',
  },
  {
    q: 'Jaleco com elastano é bom para quem trabalha em hospital?',
    a: 'Sim. O elastano adiciona memória ao tecido — ele volta ao formato após cada movimento. Isso é essencial para enfermeiros que passam horas em pé, correndo entre quartos e fazendo procedimentos.',
  },
  {
    q: 'Qual o prazo de entrega do jaleco para enfermagem?',
    a: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis conforme sua região. Capitais do Sudeste geralmente recebem em 3 a 5 dias. Frete grátis para compras acima de R$499.',
  },
  {
    q: 'Como funciona a troca de tamanho?',
    a: 'Arrependimento em até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Manda uma mensagem pelo WhatsApp com o número do pedido.',
  },
  {
    q: 'Jaleco de enfermagem precisa ter bolsos?',
    a: 'Bolsos são essenciais para enfermeiros — guardam canetas, tesouras, luvas e outros itens de trabalho. Na Jaleca, jalecos para enfermagem têm bolso no peito e bolsos laterais reforçados.',
  },
  {
    q: 'Posso usar jaleco de enfermagem no plantão noturno?',
    a: 'Sim. Jalecos Jaleca são desenvolvidos para longas jornadas — elastano permite movimento sem restrição, tecido respira bem e não amassa. Confortável para plantões de 12 horas.',
  },
  {
    q: 'Jaleco de enfermagem pode ser lavado na máquina?',
    a: 'Sim. Jalecos Jaleca suportam lavagem a 60°C na máquina. Use sabão neutro e evite alvejante com cloro. Seque ao ar para preservar o elastano e a forma do jaleco.',
  },
  {
    q: 'Qual a diferença entre jaleco de enfermagem e jaleco médico?',
    a: 'Ambos usam tecido e composição similares. A diferença está no corte — jaleco de enfermagem tende a ter mais Bolsos e mais funcional. Jaleco médico pode ser mais estruturado dependendo da especialidade.',
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