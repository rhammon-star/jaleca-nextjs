'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Qual o tecido mais adequado para o jaleco masculino de enfermeiro, considerando a necessidade de desinfecção frequente?", a: "Tecidos como o Gabardine de alta qualidade são ideais, pois suportam lavagens em alta temperatura e processos de desinfecção sem perder a estrutura ou a cor." },
  { q: "Os jalecos para enfermeiros são projetados para oferecer conforto e mobilidade durante o turno de trabalho intenso?", a: "Sim, nossos modelos masculinos priorizam o conforto ergonômico e a liberdade de movimento, essenciais para as atividades dinâmicas da enfermagem, como movimentação de pacientes." },
  { q: "É possível bordar o número de registro do COFEN e o nome no jaleco de enfermeiro?", a: "Sim, oferecemos o serviço de bordado para incluir seu nome e o número de inscrição no COFEN, garantindo a identificação profissional de forma clara e duradoura." },
  { q: "Qual o papel dos bolsos nos jalecos de enfermeiros para a organização de materiais de trabalho?", a: "Nossos jalecos possuem bolsos estrategicamente distribuídos e de bom tamanho, facilitando o acesso rápido a canetas, tesouras, luvas e outros materiais essenciais da rotina." },
  { q: "Como escolher o jaleco ideal para um enfermeiro que trabalha em UTI ou emergência?", a: "Para UTI/emergência, priorize tecidos de alta resistência, que permitam fácil assepsia e que ofereçam conforto para longos plantões, além de um corte que não restrinja movimentos." },
  { q: "Os jalecos brancos são os únicos aceitáveis para enfermeiros, ou há outras cores discretas que podem ser usadas?", a: "O branco é o padrão predominante. Em algumas instituições ou especialidades (pediatria, geriatria), cores claras e discretas podem ser permitidas, mas sempre consulte as normas do seu local de trabalho." },
  { q: "Qual a diferença entre um jaleco com punho de malha e um com punho elástico para enfermeiros?", a: "O punho de malha oferece conforto e um toque mais casual. O punho elástico proporciona maior ajuste e segurança para evitar o contato da manga com superfícies." },
  { q: "Há jalecos masculinos que sejam mais resistentes a rasgos e abrasão, comuns na rotina da enfermagem?", a: "Sim, nossos jalecos confeccionados em Sarja ou Gabardine de gramatura mais alta oferecem maior resistência a rasgos e ao desgaste do uso diário intenso." },
  { q: "O comprimento do jaleco para enfermeiros influencia na proteção e na praticidade?", a: "Um comprimento na altura do quadril ou joelho é ideal, oferecendo boa proteção sem atrapalhar a movimentação, facilitando agachamentos e outras atividades." },
  { q: "Qual a política de privacidade da loja para dados pessoais e de bordado de enfermeiros?", a: "Nossas políticas de privacidade são rigorosas, garantindo a proteção de todos os seus dados pessoais e informações de bordado. Suas informações são confidenciais e usadas apenas para processar seu pedido." },
  { q: "Existem opções de jalecos para enfermeiros com painéis de ventilação para ambientes de trabalho quentes?", a: "Sim, alguns de nossos modelos incorporam painéis de malha ou tecidos mais leves em áreas estratégicas para melhorar a ventilação e o conforto em ambientes de trabalho com altas temperaturas." },
  { q: "Como garantir a longevidade do jaleco branco para enfermeiro, evitando que ele amarele com o tempo?", a: "Lave-o separadamente, com água fria, sabão neutro e, se necessário, use alvejante sem cloro específico para roupas brancas, evitando a exposição prolongada ao sol para secar." },
  { q: "A loja oferece jalecos com fechamento em zíper, para uma alternativa mais prática aos botões?", a: "Sim, temos modelos com fechamento em zíper, que proporcionam um visual moderno e agilizam o processo de vestir e despir, ideal para a rotina dinâmica do enfermeiro." },
  { q: "Qual a importância do reforço nas costuras dos jalecos de enfermeiros?", a: "Costuras reforçadas são cruciais para a durabilidade do jaleco, especialmente em pontos de maior tensão como ombros e bolsos, suportando o uso contínuo e a carga dos itens nos bolsos." },
  { q: "É possível devolver um jaleco de enfermeiro se ele não atender às expectativas de conforto?", a: "Sim, aceitamos devoluções dentro de um prazo específico, desde que o produto esteja sem uso, com etiquetas originais e sem bordados personalizados. Consulte nossa política de devolução." },
  { q: "Os jalecos para enfermeiros são compatíveis com o uso de EPIs como luvas e máscaras?", a: "Sim, nossos jalecos são projetados para serem usados confortavelmente com outros EPIs, permitindo total proteção e funcionalidade sem comprometer a segurança." },
  { q: "Há opções de jalecos masculinos com bolso para celular ou rádio comunicador?", a: "Alguns de nossos modelos possuem bolsos específicos com compartimentos para celular ou rádios comunicadores, garantindo que estejam acessíveis e seguros durante o plantão." },
  { q: "Qual a diferença de preço entre um jaleco básico e um modelo premium para enfermeiros?", a: "Modelos premium geralmente justificam o preço com tecidos de maior tecnologia, cortes mais elaborados, maior durabilidade e tratamentos especiais como anti-amassado ou repelência a líquidos." },
  { q: "Os jalecos masculinos são pré-lavados para evitar encolhimento?", a: "Nossos tecidos passam por tratamentos de pré-encolhimento para minimizar a alteração de tamanho após as primeiras lavagens, garantindo que o jaleco mantenha seu caimento original." },
  { q: "A loja oferece descontos para a compra de múltiplos jalecos para enfermeiros?", a: "Sim, oferecemos condições especiais para compras em quantidade, ideais para equipes de enfermagem ou profissionais que precisam de vários jalecos para a semana." }
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
