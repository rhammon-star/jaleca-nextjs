'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Existe alguma regulamentação específica sobre o jaleco para esteticistas?", a: "Não há uma regulamentação de conselho profissional como nas áreas médicas, mas o uso do jaleco é fundamental para higiene e padronização visual. Foco em tecidos de fácil limpeza e desinfecção." },
  { q: "Qual o melhor tecido para um jaleco de esteticista, que combine beleza e praticidade?", a: "Recomendamos tecidos como gabardine, microfibra ou sarja leve. São resistentes a manchas, secam rapidamente, amassam pouco e proporcionam um visual sempre impecável e confortável." },
  { q: "Posso usar cores vibrantes ou diferentes do branco para o jaleco de esteticista?", a: "Sim! Na estética, há mais liberdade para cores. Oferecemos uma vasta paleta, incluindo tons pastéis, coloridos e até estampados, para que seu jaleco reflita o estilo da sua clínica." },
  { q: "Qual o corte ideal para um jaleco de esteticista, pensando em estilo e mobilidade?", a: "Nossos cortes são modernos e variados: desde o acinturado que valoriza a silhueta até modelos mais soltos, garantindo conforto e liberdade de movimentos para a execução dos procedimentos." },
  { q: "É possível personalizar o jaleco de esteticista com meu nome e o logo da clínica?", a: "Sim, oferecemos o serviço de bordado personalizado para seu nome e o logo da sua clínica ou salão. É uma excelente forma de reforçar a sua marca e profissionalismo." },
  { q: "Quais as melhores dicas de lavagem para manter o jaleco de esteticista sempre novo e limpo?", a: "Lave em água fria ou morna, com sabão neutro e evite misturar cores para não manchar. Seque à sombra e passe a ferro em temperatura média para preservar a beleza do tecido." },
  { q: "Qual a durabilidade de um jaleco de esteticista de boa qualidade com uso frequente?", a: "Nossos jalecos são confeccionados com tecidos e costuras de alta durabilidade, pensados para resistir ao uso diário e às múltiplas lavagens, mantendo a aparência profissional por mais tempo." },
  { q: "Como escolher o tamanho certo do jaleco de esteticista para um caimento perfeito?", a: "Consulte nossa tabela de medidas detalhada e compare com as suas. É essencial para garantir um jaleco confortável que não atrapalhe seus movimentos e valorize sua imagem." },
  { q: "Há diferentes comprimentos de jalecos para esteticistas?", a: "Sim, além do comprimento tradicional, que vai até a altura do quadril ou coxa, temos modelos mais curtos ou em estilo blazer, adequados para um visual mais fashion e prático na estética." },
  { q: "Estão disponíveis opções de manga diferentes para jalecos de esteticista?", a: "Temos modelos com manga longa, 3/4 e manga curta, para atender às suas necessidades e preferências. A escolha da manga pode variar conforme o tipo de procedimento e o conforto térmico." },
  { q: "Quantos bolsos um jaleco de esteticista costuma ter e quais são seus usos?", a: "Nossos jalecos geralmente possuem dois bolsos frontais inferiores, ideais para guardar itens como espátulas, lápis de maquiagem ou pequenos instrumentos de trabalho de forma acessível." },
  { q: "Qual o estilo dos jalecos para esteticistas para um visual moderno e elegante?", a: "Priorizamos designs que unem funcionalidade e as últimas tendências da moda. Modelos acinturados, com detalhes em zíper ou botões diferenciados, para um look sofisticado e atual." },
  { q: "O que diferencia um jaleco para esteticista de um jaleco de um profissional da saúde tradicional?", a: "O jaleco de esteticista pode ser mais focado em design, cores e tecidos que ofereçam mais conforto e caimento, enquanto o profissional de saúde tradicional prioriza a esterilidade e proteção." },
  { q: "Posso comprar jalecos para toda a minha equipe de esteticistas com desconto?", a: "Sim, oferecemos condições especiais e descontos progressivos para pedidos em grande volume, perfeitos para padronizar sua equipe com qualidade e estilo. Entre em contato para um orçamento." },
  { q: "Qual o preço médio de um jaleco de esteticista com estilo e personalização?", a: "Nossos jalecos de esteticista têm preços a partir de R$ 115,00, variando conforme o design, tecido e personalizações desejadas. Temos opções para todos os orçamentos." },
  { q: "Qual o prazo de entrega para jalecos de esteticista personalizados com logo e nome?", a: "O prazo de entrega para peças personalizadas é de 7 a 18 dias úteis, considerando o tempo de produção e o frete. Você receberá o código de rastreio para acompanhar seu pedido." },
  { q: "Como funciona a política de troca ou devolução se o jaleco de esteticista não servir?", a: "Aceitamos trocas em até 7 dias corridos após o recebimento, desde que o produto esteja sem uso e em perfeitas condições. Para itens personalizados, aplicam-se condições especiais." },
  { q: "Há ofertas de frete grátis para jalecos de esteticista em alguma compra?", a: "Sim, frequentemente oferecemos promoções de frete grátis para compras acima de um determinado valor ou em períodos específicos. Fique atenta às novidades em nosso site." },
  { q: "Os jalecos para esteticistas possuem garantia contra defeitos de fabricação?", a: "Absolutamente. Todos os nossos produtos possuem garantia de 60 dias contra defeitos de fabricação, assegurando sua total confiança na qualidade e durabilidade de nossos jalecos." },
  { q: "Os tecidos dos jalecos de esteticista são resistentes a manchas de produtos de beleza?", a: "Nossos tecidos, como o gabardine, são escolhidos pela sua resistência a manchas e facilidade de limpeza. Respingos acidentais podem ser removidos com facilidade, mantendo o jaleco impecável." }
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
