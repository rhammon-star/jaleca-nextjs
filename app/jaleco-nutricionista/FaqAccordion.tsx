'use client'
import { useState } from 'react'
const faqItems = [
  { q: "É obrigatório bordar o número do CRN no jaleco feminino de nutricionista?", a: "Não é uma exigência legal, mas o bordado do seu número de CRN no jaleco é uma forma de identificação e valorização profissional. Oferecemos este serviço com a melhor qualidade." },
  { q: "Qual o tecido ideal para um jaleco de nutricionista que preza por higiene e bom caimento?", a: "Recomendamos tecidos como gabardine ou microfibra. São leves, têm bom caimento, são fáceis de lavar, secam rápido e mantêm a peça impecável durante todo o dia no consultório." },
  { q: "Posso escolher outras cores além do branco para meu jaleco feminino de nutricionista?", a: "Sim, temos opções em tons suaves como bege, azul claro ou cinza, que trazem um toque de personalidade sem perder a elegância. Verifique as diretrizes do seu ambiente de trabalho." },
  { q: "Como é o corte dos jalecos femininos para nutricionistas, buscando um visual moderno e elegante?", a: "Nossos modelos femininos possuem cortes acinturados e pences que valorizam a silhueta, proporcionando um visual profissional, sofisticado e confortável para o dia a dia." },
  { q: "Consigo adicionar meu nome e número de CRN no jaleco que comprar?", a: "Sim, oferecemos o serviço de bordado personalizado para seu nome e número de CRN. Basta informar os dados no momento da compra, e garantimos um acabamento perfeito." },
  { q: "Quais as instruções de lavagem para manter o jaleco de nutricionista sempre higienizado e bonito?", a: "Lave em água fria com sabão neutro e evite misturar com outras cores. Seque à sombra para preservar a cor e a estrutura do tecido, garantindo a longevidade da peça." },
  { q: "Qual a durabilidade média de um jaleco de nutricionista de alta qualidade?", a: "Nossos jalecos são feitos com tecidos resistentes e costura reforçada, projetados para durar por vários anos com uso frequente e os cuidados de lavagem adequados." },
  { q: "Como escolher o tamanho correto para o jaleco feminino de nutricionista?", a: "Consulte nossa tabela de medidas e compare com suas próprias medidas de busto, cintura e quadril. Um tamanho adequado garante conforto e um visual mais profissional." },
  { q: "Há variações de comprimento para os jalecos femininos de nutricionista?", a: "Nosso comprimento padrão para jalecos femininos geralmente vai até a altura do quadril ou meio da coxa, oferecendo elegância e praticidade para sua rotina no consultório." },
  { q: "Existem opções de jalecos de nutricionista com manga ¾ ou curta?", a: "Sim, além da manga longa tradicional, dispomos de modelos com manga ¾ ou curta, ideais para maior conforto em ambientes mais quentes ou preferência pessoal no atendimento." },
  { q: "Quantos bolsos um jaleco de nutricionista normalmente possui e qual sua utilidade?", a: "Nossos modelos vêm com um bolso superior no peito e dois bolsos inferiores, estrategicamente posicionados para carregar canetas, bloquinhos ou pequenos itens essenciais." },
  { q: "Qual o estilo dos jalecos para nutricionistas para transmitir credibilidade e cuidado?", a: "Nossos jalecos combinam um estilo clássico com toques modernos, como golas diferenciadas, transmitindo profissionalismo, confiança e uma imagem de cuidado e bem-estar." },
  { q: "Qual a diferença de um jaleco de nutricionista para um jaleco de esteticista?", a: "O jaleco de nutricionista prioriza um visual mais formal e clínico, enquanto o de esteticista pode ter mais detalhes de moda, como cores e recortes, e foco na praticidade para o atendimento estético." },
  { q: "Posso encomendar jalecos para minha equipe de nutricionistas com descontos?", a: "Sim, oferecemos condições especiais e descontos progressivos para compras em volume. Entre em contato com nossa equipe de vendas para obter um orçamento personalizado." },
  { q: "Qual o preço inicial de um jaleco feminino de nutricionista com bordado?", a: "Nossos jalecos femininos de nutricionista iniciam a partir de R$ 125,00, já com a opção de bordado personalizado incluída. Visite nosso site para conhecer todos os modelos." },
  { q: "Qual o prazo de entrega para jalecos de nutricionista personalizados com meu CRN?", a: "O prazo de entrega para jalecos personalizados varia de 7 a 18 dias úteis, considerando a produção e o transporte. Você será notificado a cada etapa do processo." },
  { q: "Como funciona a política de troca em caso de tamanho incorreto do jaleco de nutricionista?", a: "Aceitamos trocas em até 7 dias corridos após o recebimento, desde que o produto esteja sem uso e em sua embalagem original. Para itens bordados, aplicam-se condições específicas." },
  { q: "Oferecem frete grátis em compras de jalecos para nutricionistas em alguma ocasião?", a: "Sim, ocasionalmente disponibilizamos frete grátis para compras acima de um determinado valor ou durante promoções específicas. Acompanhe nossas novidades no site." },
  { q: "Os jalecos para nutricionistas possuem alguma garantia de qualidade e durabilidade?", a: "Absolutamente. Todos os nossos jalecos contam com garantia de 60 dias contra defeitos de fabricação, assegurando a sua total satisfação e a excelência do produto." },
  { q: "O tecido do jaleco para nutricionista é confortável para usar durante o dia todo?", a: "Sim, selecionamos tecidos leves e respiráveis que garantem conforto excepcional, permitindo que você se mova livremente e mantenha o foco no atendimento aos seus pacientes." }
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
            <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '300px' : '0px' }}>
              <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
            </div>
          </div>
        )
      }))}
    </div>
  )
}
