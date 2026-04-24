'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual jaleco comprar para a faculdade?',
    a: 'O Jaleco Padrão Aluno é o mais indicado — cor branca, corte neutro, aceito pela maioria das IES. Verifique o modelo específico exigido pelo seu curso antes de comprar.',
  },
  {
    q: 'O jaleco universitário pode ter bordado?',
    a: 'Depende da instituição. A maioria das faculdades de saúde permite bordado com nome a partir de determinado semestre. Confirme com a coordenação.',
  },
  {
    q: 'Jaleco unissex ou masculino/feminino?',
    a: 'A Jaleca tem jaleco universitário unissex, feminino e masculino. O unissex tem caimento mais neutro. Feminino tem corte mais ajustado; masculino tem ombros mais amplos.',
  },
  {
    q: 'Precisa de manga longa ou curta?',
    a: 'Para laboratórios de risco biológico ou químico: manga longa é obrigatória pela NR-6. Para clínica e estágio hospitalar: manga longa é o padrão. Verifique a exigência do curso.',
  },
  {
    q: 'Quantos jalecos comprar?',
    a: 'O mínimo é 2: um para usar e um para lavar. Cursos com aulas práticas diárias pedem 3 ou mais — principalmente para não faltar jaleco limpo em provas práticas.',
  },
  {
    q: 'O jaleco da Jaleca é aceito nas faculdades?',
    a: 'Sim. Nossos jalecos seguem o padrão exigido pela maioria das IES. Em caso de dúvida sobre modelo específico, entre em contato.',
  },
  {
    q: 'Tem tamanho para quem é plus size?',
    a: 'Sim. A grade Jaleca vai do PP ao G3 — maior que a maioria das marcas no mercado.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.',
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