'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Toda a equipe de uma clínica de nutrição precisa usar jaleco com CRN bordado?", a: "Geralmente, apenas os nutricionistas licenciados bordam o CRN. Para a equipe de apoio, é comum bordar o nome da clínica ou do colaborador, promovendo padronização e profissionalismo." },
  { q: "Qual o tecido mais adequado para os jalecos da equipe de uma clínica de nutrição?", a: "Recomendamos tecidos leves e resistentes como gabardine ou microfibra, que são fáceis de cuidar, secam rapidamente e oferecem conforto para a equipe durante o expediente." },
  { q: "Podemos personalizar os jalecos da equipe de nutrição com as cores da nossa marca?", a: "Sim, oferecemos diversas opções de cores para que os jalecos se alinhem perfeitamente à identidade visual da sua clínica de nutrição, criando um ambiente harmonioso e profissional." },
  { q: "Qual o corte ideal para jalecos de equipe de nutrição, pensando em funcionalidade e apresentação?", a: "Nossos cortes são pensados para oferecer conforto e mobilidade, com um visual clean e profissional que se adapta a diferentes biotipos, mantendo a uniformidade da equipe." },
  { q: "É possível bordar o logo da clínica de nutrição e os nomes da equipe nos jalecos?", a: "Sim, oferecemos o serviço de bordado personalizado para o logo da sua clínica e os nomes dos colaboradores. É uma excelente forma de fortalecer a marca e identificar a equipe." },
  { q: "Quais as melhores práticas para a lavagem dos jalecos da equipe de nutrição em volume?", a: "Para lavagem em volume, sugerimos ciclos delicados com água fria e sabão neutro. A secagem em cabides e à sombra ajuda a preservar a qualidade e a cor dos jalecos." },
  { q: "Qual a durabilidade esperada para os jalecos de uma equipe de nutrição com uso intenso?", a: "Nossos jalecos são fabricados com tecidos de alta qualidade e costuras reforçadas, desenvolvidos para resistir ao uso diário e às lavagens frequentes, prolongando sua vida útil." },
  { q: "Como faço para escolher os tamanhos para a equipe de nutrição em um pedido corporativo?", a: "Disponibilizamos uma tabela de medidas detalhada para auxiliar na escolha. Recomendamos que cada membro da equipe consulte-a para garantir o ajuste perfeito e evitar trocas." },
  { q: "Os jalecos para clínicas de nutrição têm comprimento padrão ou opções variadas?", a: "O comprimento padrão de nossos jalecos, geralmente na altura do quadril, oferece a versatilidade e a apresentação adequadas para a rotina em uma clínica de nutrição." },
  { q: "Há opções de manga curta ou 3/4 para os jalecos da equipe de nutrição?", a: "Sim, oferecemos modelos com manga longa e também com manga curta ou 3/4, permitindo que sua equipe escolha a opção que melhor se adapte ao conforto e ao ambiente de trabalho." },
  { q: "Quantos bolsos são úteis em um jaleco para clínica de nutrição e onde ficam?", a: "Nossos jalecos contam com três bolsos: um no peito e dois na parte inferior. São práticos para armazenar itens como canetas, blocos de anotações ou pequenos acessórios." },
  { q: "Que estilo de jaleco é mais indicado para transmitir a imagem de uma clínica de nutrição?", a: "Propomos um estilo moderno, clean e profissional, que reflete a seriedade e o cuidado da área da nutrição. O design é pensado para aprimorar a imagem da sua clínica." },
  { q: "Qual a diferença entre um jaleco individual de nutricionista e um jaleco para a equipe de nutrição?", a: "O jaleco individual foca em detalhes e personalização específica do profissional. O jaleco de equipe visa a padronização, durabilidade para uso contínuo e a representação da marca da clínica." },
  { q: "É possível obter descontos para grandes encomendas de jalecos para clínicas de nutrição?", a: "Sim, oferecemos preços especiais e descontos progressivos para compras em grande volume. Entre em contato com nosso setor comercial para um orçamento personalizado e vantagens exclusivas." },
  { q: "Qual o valor inicial de um jaleco para a equipe de uma clínica de nutrição?", a: "Nossos jalecos para equipes de nutrição têm preços a partir de R$ 98,00, sem personalização. Os valores podem variar dependendo do modelo, tecido e quantidade solicitada." },
  { q: "Qual o prazo de entrega para um pedido de jalecos para toda a equipe de nutrição com logo bordado?", a: "Para pedidos corporativos com bordado, o prazo de entrega pode variar de 10 a 20 dias úteis, adicionando o tempo de produção e envio. Recomendamos planejar a compra com antecedência." },
  { q: "Qual a política de troca para pedidos de jalecos de nutrição para equipes, se houver erros de tamanho?", a: "Para pedidos em volume, a troca de peças sem uso é avaliada em até 15 dias após o recebimento. Aconselhamos a conferência das medidas antes da finalização do pedido para evitar inconvenientes." },
  { q: "Há alguma facilidade de frete para compras em quantidade de jalecos para clínicas de nutrição?", a: "Sim, para pedidos em grande volume, podemos oferecer condições especiais de frete, incluindo a possibilidade de frete grátis, dependendo da região e do valor total. Consulte-nos para mais detalhes." },
  { q: "Os jalecos para equipes de nutrição vêm com alguma garantia de fabricação?", a: "Todos os nossos jalecos são cobertos por uma garantia de 90 dias contra defeitos de fabricação. Nosso compromisso é com a qualidade e a satisfação da sua equipe de nutrição." },
  { q: "Os tecidos dos jalecos para nutrição são antimicrobianos ou de fácil descontaminação?", a: "Nossos tecidos são de fácil lavagem e permitem alta higienização, fundamental para ambientes de saúde. Embora não sejam antimicrobianos, sua superfície lisa facilita a limpeza e descontaminação." }
]
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)
  const half = Math.ceil(faqItems.length / 2)
  const col1 = faqItems.slice(0, half), col2 = faqItems.slice(half)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12">
      {[col1, col2].map((col, ci) => col.map((item, i) => {
        const idx = ci * half + i, isOpen = openIndex === idx
        return (
          <div key={idx} className="border-t border-[#e5e0d8] overflow-hidden">
            <button onClick={() => toggle(idx)} className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer">
              <span className="text-[0.95rem] font-[400] text-[#1a1a1a] leading-snug pr-2">{item.q}</span>
              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#e5e0d8] text-[#6b6b6b] text-base transition-all duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', background: isOpen ? '#1a1a1a' : 'transparent', color: isOpen ? '#fff' : '#6b6b6b', borderColor: isOpen ? '#1a1a1a' : '#e5e0d8' }}>+</span>
            </button>
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '500px' : '0px' }}>
              <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
            </div>
          </div>
        )
      }))}
    </div>
  )
}
