'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Qual a característica principal do tecido do jaleco Jaleca para uso doméstico?", a: "Nosso jaleco para dona de casa é feito com tecido leve e de fácil lavagem, ideal para o dia a dia, garantindo conforto e praticidade." },
  { q: "O jaleco para dona de casa protege contra manchas de cozinha?", a: "Sim, ele oferece uma excelente barreira contra respingos de alimentos e molhos, protegendo suas roupas de baixo de manchas e odores da cozinha." },
  { q: "O corte do jaleco é confortável para as atividades diárias em casa?", a: "Com um corte solto e prático, nosso jaleco permite total liberdade de movimento para cozinhar, limpar e realizar todas as tarefas domésticas com conforto." },
  { q: "É possível bordar um detalhe divertido ou um nome no jaleco da dona de casa?", a: "Sim! Personalize seu jaleco com um bordado do seu nome ou uma frase divertida, tornando-o único e com um toque pessoal para o seu lar." },
  { q: "Este jaleco é versátil para diferentes tarefas domésticas?", a: "Absolutamente. Ele é ideal para cozinhar, limpar, cuidar do jardim ou até mesmo para artesanato, oferecendo proteção e praticidade em diversas atividades." },
  { q: "Qual a durabilidade de um jaleco Jaleca para uso doméstico?", a: "Nossos jalecos são feitos para durar, suportando lavagens frequentes e o uso diário, sendo um item confiável e duradouro para sua casa." },
  { q: "Como devo lavar o jaleco para mantê-lo sempre limpo e cheiroso?", a: "Lave-o regularmente com detergente comum. Para manchas persistentes, pré-trate antes da lavagem. Siga sempre as instruções da etiqueta para melhor conservação." },
  { q: "Quais cores de jaleco estão disponíveis para o uso doméstico?", a: "Oferecemos uma variedade de cores alegres e discretas que combinam com o ambiente de casa, adicionando um toque de estilo e funcionalidade ao seu dia." },
  { q: "Os tamanhos de jaleco para dona de casa abrangem do PP ao G3?", a: "Sim, nossa linha de tamanhos vai do PP ao G3, garantindo um caimento confortável e adequado para todas as donas de casa." },
  { q: "O jaleco tem bolsos práticos para guardar o celular ou anotações?", a: "Sim, ele possui bolsos convenientes para guardar seu celular, lista de compras ou outros pequenos itens, mantendo tudo sempre à mão." },
  { q: "O comprimento do jaleco é ideal para proteger a roupa enquanto se agacha ou se estica?", a: "O comprimento foi projetado para oferecer boa cobertura, protegendo suas roupas enquanto você se move livremente pela casa, sem atrapalhar suas tarefas." },
  { q: "O jaleco para dona de casa está disponível com manga curta ou longa?", a: "Temos opções de manga curta para os dias mais quentes e manga longa para proteção adicional ou para climas mais frios, proporcionando versatilidade." },
  { q: "O estilo do jaleco para dona de casa é mais casual e funcional?", a: "Sim, o estilo é pensado para ser funcional e casual, proporcionando um visual arrumado e protegido para as atividades domésticas sem perder o conforto." },
  { q: "Os jalecos Jaleca para dona de casa são mais práticos de lavar que os da concorrência?", a: "Nossos tecidos são selecionados para facilitar a lavagem e a secagem rápida, tornando-os mais práticos para o dia a dia do que muitos concorrentes." },
  { q: "Qual o preço de partida para um jaleco confortável para uso doméstico?", a: "Nossos jalecos para dona de casa estão disponíveis a partir de R$159, um investimento acessível em conforto e proteção para seu lar." },
  { q: "Qual o prazo de entrega para meu jaleco de dona de casa?", a: "Seu jaleco será entregue em 3 a 8 dias úteis, para que você possa desfrutar rapidamente da praticidade e proteção no seu dia a dia em casa." },
  { q: "Posso trocar o jaleco se o tamanho não for o que eu esperava?", a: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou modelo não sejam os ideais para você." },
  { q: "Há frete grátis para compras de jalecos de dona de casa acima de R$499 em SP/RJ/MG/ES?", a: "Sim, oferecemos frete grátis para pedidos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo, facilitando sua compra." },
  { q: "O jaleco de dona de casa possui garantia?", a: "Todos os nossos jalecos vêm com garantia contra defeitos de fabricação, assegurando a sua satisfação e a qualidade do produto." },
  { q: "O tecido do jaleco para dona de casa é leve e respirável para o uso contínuo?", a: "Priorizamos tecidos leves e respiráveis que garantem conforto térmico, ideal para o uso contínuo em todas as estações do ano dentro de casa." }
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
