'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Quais os cortes de jalecos femininos mais adequados para enfermeiras que buscam conforto e um visual moderno?", a: "Nossos modelos slim fit e acinturados, com ou sem zíper, oferecem um visual moderno e conforto essencial para a rotina dinâmica da enfermeira." },
  { q: "Como escolher um jaleco feminino que suporte a rotina intensa da enfermagem sem perder a elegância?", a: "Opte por tecidos como o Gabardine Premium ou misturas com elastano. Eles oferecem durabilidade, amassam menos e mantêm a elegância mesmo após horas de trabalho." },
  { q: "É possível personalizar o jaleco feminino de enfermeira com o logo da instituição e o número de COFEN?", a: "Sim, disponibilizamos o serviço de bordado para que você possa adicionar o logo da sua instituição, seu nome e o número de registro no COFEN, com acabamento impecável." },
  { q: "Os jalecos femininos de enfermagem são projetados para facilitar o acesso aos bolsos sem restringir o movimento?", a: "Nossos modelos possuem bolsos estrategicamente posicionados, que permitem acesso fácil e rápido a materiais sem limitar a agilidade da enfermeira durante as tarefas." },
  { q: "Qual a importância da respirabilidade do tecido em um jaleco feminino para enfermeiras que trabalham em ambientes quentes?", a: "A alta respirabilidade é crucial para manter o conforto térmico, evitando o superaquecimento e a transpiração excessiva, especialmente em ambientes hospitalares mais quentes." },
  { q: "Há opções de jalecos femininos com detalhes coloridos discretos que são aceitos na enfermagem?", a: "Sim, oferecemos jalecos com detalhes discretos em cores como azul claro ou verde menta nos punhos ou gola, que podem ser aceitos em algumas clínicas e especialidades, como a pediatria." },
  { q: "Como garantir que o jaleco feminino de enfermeira não fique transparente após várias lavagens?", a: "Nossos tecidos são de gramatura adequada e alta qualidade, minimizando a transparência e mantendo a discrição mesmo após ciclos repetidos de lavagem." },
  { q: "Quais cuidados especiais para lavar jalecos femininos que contêm sangue ou outros fluidos corporais?", a: "Lave imediatamente em água fria para remover o excesso, use detergente enzimático ou tira-manchas e, se permitido, utilize água sanitária ou peróxido para desinfecção." },
  { q: "O que devo considerar ao escolher o comprimento do jaleco feminino para uma enfermeira?", a: "O comprimento na altura dos joelhos é o mais comum, oferecendo proteção e profissionalismo. Modelos mais curtos podem ser práticos, mas verifique as normas da instituição." },
  { q: "A loja oferece jalecos femininos com gola padre para um visual mais moderno e clean?", a: "Sim, temos modelos com gola padre que proporcionam um visual contemporâneo e minimalista, ideal para enfermeiras que buscam um toque de modernidade." },
  { q: "Qual a política de devolução e troca para jalecos femininos sem bordado?", a: "Você pode devolver ou trocar jalecos sem bordado dentro do prazo especificado, desde que estejam sem uso e com etiquetas. Consulte nossa política completa no site." },
  { q: "Os jalecos femininos são desenhados para não marcar a roupa de baixo?", a: "Nossos tecidos e cortes são pensados para oferecer caimento suave e não marcar a roupa de baixo, garantindo uma aparência profissional e elegante." },
  { q: "Para enfermeiras que usam muitos acessórios, o jaleco tem bolsos internos ou secretos?", a: "Alguns de nossos modelos possuem bolsos internos ou compartimentos secretos, ideais para guardar itens pessoais com segurança e discrição durante o turno." },
  { q: "Qual a durabilidade esperada de um jaleco feminino de enfermagem com uso diário e lavagem frequente?", a: "Nossos jalecos são feitos para durar. Com os cuidados recomendados, eles mantêm a qualidade e aparência por anos, mesmo com uso e lavagens diárias." },
  { q: "Existe alguma linha de jalecos femininos com tecnologia anti-bacteriana para enfermeiras?", a: "Sim, oferecemos modelos com tecidos que incorporam tecnologia anti-bacteriana, que ajuda a inibir o crescimento de microrganismos, aumentando a higiene e segurança." },
  { q: "Os jalecos femininos com mangas bufantes ou detalhes nos ombros são permitidos em hospitais?", a: "Em geral, detalhes exagerados como mangas bufantes não são práticos ou permitidos em ambientes hospitalares, que priorizam a funcionalidade e higiene. Opte por designs mais clean." },
  { q: "Qual a faixa de preços dos jalecos femininos para enfermeiras e o que justifica a variação?", a: "A faixa de preços varia conforme o tecido, corte, design e tecnologias agregadas. Modelos premium oferecem maior durabilidade, conforto e recursos como anti-amassado." },
  { q: "Os jalecos femininos são adaptáveis para enfermeiras gestantes, oferecendo conforto extra?", a: "Temos opções com cortes mais soltos e tecidos com elastano, que proporcionam maior conforto e se adaptam melhor ao corpo de enfermeiras gestantes." },
  { q: "Como escolher o tamanho do jaleco feminino para enfermeira, se as medidas estão entre dois tamanhos?", a: "Para maior conforto e liberdade de movimento, especialmente em uma profissão ativa, é sempre aconselhável escolher o tamanho maior se suas medidas estiverem no limite entre dois." },
  { q: "Qual o custo do bordado de nome e COFEN no jaleco feminino de enfermeira?", a: "O custo do bordado é informado durante o processo de compra e pode variar de acordo com o número de linhas e complexidade. Verifique nossa tabela de serviços de personalização." }
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
