'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual a diferença entre scrub e pijama hospitalar?',
    a: 'O scrub tem corte mais justo e profissional, tecido mais durável com elastano para mobilidade. O pijama hospitalar é mais largo e confortável, usado em procedimentos de longa duração. O scrub é mais versátil — pode usar na clínica e no hospital.',
  },
  {
    q: 'Scrub é indicado para quais profissões de saúde?',
    a: 'Scrub é usado por enfermeiros, médicos, técnicos de enfermería, biomédicos, fisioterapeutas, dentistas e vários profissionais de saúde. Na Jaleca, temos scrubs femininos e masculinos para todas essas profissões.',
  },
  {
    q: 'Qual o melhor tecido para scrub feminino?',
    a: 'O melhor tecido é gabardine com elastano — resistente, respirável e que não amassa. Na Jaleca, scrubs femininos têm 67% poliéster, 33% algodão e 3-8% elastano. Suporta lavagem constante e mantém a cor.',
  },
  {
    q: 'Scrub feminino pode ir na máquina de lavar?',
    a: 'Sim. Jalecas scrubs suportam lavagem na máquina a 60°C. Use sabão neutro e evite alvejante com cloro. Não use secadora — seque ao ar para preservar o elastano e a forma do scrub.',
  },
  {
    q: 'Qual a diferença entre scrub e jaleco?',
    a: 'Scrub é o conjunto de calça e blusa (conjunto), geralmente usado em hospital. Jaleco é a peça única sobre a roupa. Scrub oferece mais mobilidade e é mais prático para procedimentos. Jaleco é mais formal e pode ser usado sobre a roupa de rua.',
  },
  {
    q: 'Scrub feminino fica largo ou justo?',
    a: 'Na Jaleca, scrubs femininos têm corte levemente ajustado — valoriza sem apertar. O elastano permite movimento sem restrição. Se preferir mais largo, pode escolher tamanho maior.',
  },
  {
    q: 'Posso usar scrub fora do trabalho?',
    a: 'Não recomendamos. EPIs devem ser usados apenas no ambiente de trabalho segundo normas da ANVISA. Scrub contaminado pode carregar agentes патогенicos. Guarde limpo e use apenas durante o turno.',
  },
  {
    q: 'Qual o prazo de entrega do scrub feminino?',
    a: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis conforme sua região. Frete grátis para compras acima de R$499 no Sudeste.',
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