'use client'

import { useState } from 'react'

const faqItems = [
  {
    q: 'Qual jaleco feminino comprar para a faculdade?',
    a: 'O Jaleco Padrão Aluno Feminino é o mais indicado para o início da graduação — branco, corte neutro, aceito pela maioria das IES. Quem quer visual mais moderno pode optar pelo Slim após verificar as normas da instituição.',
  },
  {
    q: 'Jaleco feminino ou unissex para a faculdade?',
    a: 'O feminino tem corte acinturado e ombros ajustados — veste melhor em mulheres. O unissex tem caimento mais neutro e pode ficar largo nos ombros. Para quem tem cintura definida, o feminino é mais confortável no dia a dia.',
  },
  {
    q: 'Posso usar jaleco slim na faculdade?',
    a: 'Depende da IES. A maioria aceita slim no estágio e em clínicas. Para laboratórios de risco, algumas instituições exigem corte mais folgado por segurança. Confirme com a coordenação antes de comprar.',
  },
  {
    q: 'O jaleco feminino pode ter bordado com nome?',
    a: 'Depende da fase do curso. A maioria das faculdades de medicina, enfermagem e odontologia libera bordado com nome e número de registro provisório a partir do terceiro ou quarto período.',
  },
  {
    q: 'Precisa de jaleco manga longa ou curta?',
    a: 'Manga longa é obrigatória em laboratórios de risco biológico ou químico (NR-6). Para clínica e estágio hospitalar, manga longa é o padrão. Cursos como nutrição e fisioterapia costumam aceitar manga curta em atividades ambulatoriais.',
  },
  {
    q: 'Quantos jalecos comprar para a faculdade?',
    a: 'O mínimo é 2: um para usar e um de reserva na lavagem. Cursos com aulas práticas diárias ou estágio hospitalar pedem 3 — principalmente para não faltar jaleco limpo em provas práticas.',
  },
  {
    q: 'Qual tamanho de jaleco feminino escolher?',
    a: 'Meça o busto e compare com a tabela Jaleca. Para usar sobre roupa, escolha um tamanho com 2 a 4 cm de folga no busto. O corte feminino já tem ajuste natural na cintura — não precisa pegar tamanho maior por isso.',
  },
  {
    q: 'Tem jaleco feminino plus size?',
    a: 'Sim. A grade Jaleca vai do PP ao G3 no corte feminino — maior que a maioria das marcas no mercado.',
  },
  {
    q: 'Qual jaleco para estudante de medicina que valorize o corpo e seja elegante?',
    a: 'O modelo Slim feminino com Gabardine ou Alfaiataria Premium é o mais elogiado por estudantes — corte acinturado, caimento elegante, sem parecer masculinizado.',
  },
  {
    q: 'Qual jaleco feminino não amassa na faculdade?',
    a: 'A Microfibra e o Gabardine com elastano são os tecidos que menos amassam — você passa o dia inteiro na faculdade e o jaleco continua com boa aparência.',
  },
  {
    q: 'Onde comprar jaleco feminino para faculdade de medicina com entrega rápida?',
    a: 'Na Jaleca enviamos em até 2 dias úteis para todo o Brasil. Frete grátis para SP, RJ, MG e ES em compras acima de R$499.',
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
