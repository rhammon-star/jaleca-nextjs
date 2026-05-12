'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Qual tecido o jaleco Jaleca para barbeiro utiliza?", a: "Nossos jalecos para barbeiros são confeccionados em tecido tecnológico, resistente a pelos, descolorantes e produtos químicos para garantir sua durabilidade." },
  { q: "Este jaleco oferece proteção contra manchas de tintura?", a: "Sim, o tecido especial dos nossos jalecos repele a maioria das manchas de tintura e outros produtos químicos comuns em barbearias, facilitando a limpeza." },
  { q: "Como o corte do jaleco influencia no trabalho do barbeiro?", a: "Nosso corte é pensado para oferecer total liberdade de movimento, essencial para a precisão e agilidade que um barbeiro precisa em seu dia a dia." },
  { q: "É possível bordar o meu nome ou o logo da minha barbearia no jaleco?", a: "Com certeza! Oferecemos serviço de bordado personalizado para incluir seu nome, função ou o logo da sua barbearia, reforçando sua marca." },
  { q: "Este jaleco é adequado para uso em uma barbearia com alta demanda?", a: "Desenvolvido para o ambiente dinâmico da barbearia, nosso jaleco suporta a rotina intensa, mantendo a boa aparência e proteção por mais tempo." },
  { q: "Qual a durabilidade esperada para um jaleco de barbeiro Jaleca?", a: "Nossos jalecos são feitos para serem altamente duráveis, resistindo a múltiplas lavagens e ao desgaste diário, um investimento que vale a pena." },
  { q: "Quais as instruções de lavagem para manter a qualidade do tecido?", a: "Recomendamos seguir as instruções na etiqueta para uma lavagem adequada, preservando as propriedades do tecido e a vivacidade da cor do seu jaleco." },
  { q: "Que cores de jaleco estão disponíveis para barbeiros?", a: "Disponibilizamos diversas opções de cores que combinam com o estilo moderno das barbearias, permitindo que você escolha o que melhor representa seu ambiente." },
  { q: "Os tamanhos de jaleco para barbeiro vão do PP ao G3?", a: "Sim, nossa grade de tamanhos abrange do PP ao G3, garantindo um ajuste perfeito e confortável para todos os biotipos de barbeiros." },
  { q: "Os jalecos têm bolsos práticos para tesouras e pentes?", a: "Nossos jalecos são projetados com bolsos funcionais e bem distribuídos, ideais para armazenar suas ferramentas essenciais de trabalho com segurança e acesso rápido." },
  { q: "O comprimento do jaleco atrapalha o movimento na cadeira?", a: "O comprimento é cuidadosamente balanceado para não atrapalhar o movimento ao redor da cadeira, combinando proteção e praticidade." },
  { q: "O jaleco para barbeiro possui manga curta ou longa?", a: "Temos opções de manga curta e longa para o jaleco de barbeiro, permitindo escolher a que melhor se adapta ao seu conforto e necessidade." },
  { q: "O estilo slim do jaleco é confortável para o dia todo?", a: "Nosso estilo slim é desenhado para ser elegante e confortável, proporcionando uma silhueta profissional sem restringir seus movimentos durante todo o dia." },
  { q: "Os jalecos Jaleca para barbeiros são mais resistentes a descolorantes do que os da concorrência?", a: "Sim, utilizamos tecnologias de tecido superiores que oferecem maior resistência a descolorantes e manchas, superando a maioria dos produtos no mercado." },
  { q: "A partir de qual preço consigo adquirir um jaleco para barbeiro?", a: "Você pode adquirir seu jaleco profissional para barbeiro a partir de R$159, um investimento acessível em qualidade e imagem para sua carreira." },
  { q: "Qual o prazo de entrega para jalecos de barbeiro da Jaleca?", a: "O prazo de entrega para nossos jalecos é de 3 a 8 dias úteis, garantindo que você receba seu pedido com rapidez e eficiência." },
  { q: "Posso realizar a troca do jaleco se o tamanho não for o ideal?", a: "Sim, oferecemos 7 dias para troca a partir do recebimento, caso o tamanho ou modelo não atendam às suas expectativas." },
  { q: "O frete é grátis para barbeiros em SP/RJ/MG/ES?", a: "Sim, o frete é grátis para pedidos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "Os jalecos para barbeiro possuem garantia?", a: "Nossos produtos possuem garantia contra defeitos de fabricação, assegurando a qualidade e sua satisfação com a compra." },
  { q: "O tecido do jaleco para barbeiro amassa com facilidade?", a: "Escolhemos tecidos que minimizam o amassado, garantindo que você mantenha uma aparência impecável e profissional durante todo o expediente." }
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
