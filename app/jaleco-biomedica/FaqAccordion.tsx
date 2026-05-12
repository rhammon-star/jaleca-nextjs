'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Quais os modelos de jalecos femininos mais indicados para biomédicas que buscam aliar proteção e estilo em laboratório?", a: "Nossos modelos acinturados ou slim fit combinam elegância com funcionalidade, oferecendo proteção e um visual moderno para a biomédica." },
  { q: "Como escolher um jaleco feminino que suporte a rotina de laboratório e a lavagem frequente sem perder a cor e o caimento?", a: "Opte por tecidos de Gabardine Premium ou microfibra de alta densidade, que são resistentes ao desbotamento, fáceis de cuidar e mantêm a forma mesmo após muitas lavagens." },
  { q: "É possível bordar o nome da biomédica e o número do CRBM no jaleco feminino?", a: "Sim, oferecemos o serviço de bordado para personalizar seu jaleco com seu nome e o número de registro no CRBM, um toque profissional e de identificação." },
  { q: "Os bolsos dos jalecos femininos de biomedicina são projetados para serem práticos e discretos?", a: "Nossos modelos femininos possuem bolsos funcionais, estrategicamente posicionados para não comprometer a silhueta, permitindo guardar itens essenciais de forma discreta." },
  { q: "Qual a importância da proteção da manga longa e dos punhos em um jaleco feminino para biomédicas?", a: "A manga longa e os punhos justos são cruciais para a biossegurança, protegendo os braços do contato com reagentes e amostras, além de evitar que a manga atrapalhe a manipulação." },
  { q: "Há opções de jalecos femininos com detalhes coloridos discretos que são aceitos em laboratórios de biomedicina?", a: "Em geral, o branco é o padrão. Detalhes discretos podem ser aceitos em áreas menos críticas, mas a segurança e as normas do laboratório devem sempre prevalecer." },
  { q: "Como garantir que o jaleco feminino de biomédica não fique transparente após várias lavagens?", a: "Utilizamos tecidos de gramatura adequada e alta qualidade, que minimizam a transparência e mantêm a discrição e profissionalismo mesmo após ciclos repetidos de lavagem." },
  { q: "Quais cuidados especiais para lavar jalecos femininos que entraram em contato com reagentes químicos?", a: "Lave a peça separadamente, imediatamente após o contato, com água fria e sabão neutro. Se o reagente for perigoso, descarte ou siga protocolos de descontaminação específicos do laboratório." },
  { q: "O que devo considerar ao escolher o comprimento do jaleco feminino para uma biomédica?", a: "O comprimento na altura dos joelhos é o mais comum, oferecendo proteção adequada contra respingos e contato com bancadas, sem limitar a movimentação em laboratório." },
  { q: "A loja oferece jalecos femininos com gola padre para um visual mais moderno e clean em laboratório?", a: "Sim, temos modelos com gola padre que proporcionam um visual contemporâneo e minimalista, combinando bem com a formalidade e higiene do ambiente laboratorial." },
  { q: "Qual a política de devolução e troca para jalecos femininos de biomédica, sem bordado?", a: "Você pode devolver ou trocar jalecos sem bordado dentro do prazo especificado, desde que estejam sem uso e com etiquetas. Consulte nossa política completa no site." },
  { q: "Os jalecos femininos são desenhados para não restringir movimentos ao trabalhar com microscópios ou equipamentos?", a: "Nossos cortes são pensados para oferecer liberdade de movimento nos ombros e braços, essenciais para manipulações precisas e o uso prolongado de microscópios." },
  { q: "Para biomédicas que usam luvas constantemente, o jaleco tem punhos que facilitam o encaixe das luvas?", a: "Sim, os punhos são desenhados para permitir que as luvas sejam facilmente calçadas por cima, garantindo a proteção e integridade do EPI." },
  { q: "Qual a durabilidade esperada de um jaleco feminino de biomedicina com uso diário e lavagem frequente?", a: "Nossos jalecos são feitos para alta durabilidade. Com os cuidados recomendados, eles mantêm a qualidade e aparência por anos, mesmo com a rotina intensa de laboratório." },
  { q: "Existe alguma linha de jalecos femininos com tecnologia antiestática para biomédicas que trabalham com eletrônicos sensíveis?", a: "Embora não seja o foco principal, alguns tecidos com alta porcentagem de fibras naturais podem reduzir a estática. Para ambientes específicos, busque jalecos certificados com propriedades antiestáticas." },
  { q: "Os jalecos femininos com fechamento em zíper são mais práticos para biomédicas do que os de botão?", a: "Modelos com zíper oferecem um fechamento rápido e seguro, sendo uma opção prática e moderna para biomédicas, especialmente em situações de necessidade de vestir/despir rápido." },
  { q: "Qual a faixa de preços dos jalecos femininos para biomédicas e o que justifica a variação?", a: "A faixa de preços varia conforme o tecido, o design (corte acinturado, detalhes), a presença de tecnologias (repelência, antibacteriano) e o acabamento geral do produto." },
  { q: "Os jalecos femininos são adaptáveis para biomédicas gestantes, oferecendo conforto extra?", a: "Temos opções com cortes mais soltos e tecidos com elastano que proporcionam maior conforto e se adaptam melhor ao corpo de biomédicas gestantes." },
  { q: "Como escolher o tamanho do jaleco feminino para biomédica, se as medidas estão entre dois tamanhos?", a: "Para garantir conforto e liberdade de movimento no laboratório, especialmente ao manipular equipamentos, é aconselhável escolher o tamanho maior se suas medidas estiverem no limite." },
  { q: "Qual o custo do bordado de nome e CRBM no jaleco feminino de biomédica?", a: "O custo do bordado é calculado durante o processo de compra, variando conforme o número de linhas e a complexidade. Verifique nossa tabela de serviços de personalização para detalhes." }
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
