'use client'
import { useState } from 'react'
const faqItems = [
  { q: "É necessário bordar o número do CRF no jaleco feminino de farmacêutica?", a: "Embora não seja uma imposição legal, o bordado do CRF em seu jaleco reforça sua identificação profissional. Oferecemos este serviço com um acabamento impecável." },
  { q: "Qual o tipo de tecido mais adequado para o jaleco feminino, combinando conforto e caimento?", a: "Priorizamos tecidos como o gabardine ou o crepe, que proporcionam um excelente caimento, são de fácil manutenção e oferecem conforto durante todo o dia de trabalho." },
  { q: "Além do branco, quais cores estão disponíveis para jalecos femininos de farmacêutica?", a: "Disponibilizamos opções elegantes em tons pastéis, como rosa claro, azul serenity e lilás, que trazem um toque de modernidade sem perder a seriedade profissional." },
  { q: "Como são os cortes dos jalecos femininos, buscando um visual mais acinturado e elegante?", a: "Nossos modelos femininos são projetados com cortes acinturados e pences estratégicas, valorizando a silhueta e proporcionando um visual sofisticado e profissional." },
  { q: "Como posso personalizar meu jaleco com nome e registro profissional (CRF)?", a: "Você pode especificar seu nome completo e número de CRF no momento da compra. Realizamos o bordado com alta precisão, conferindo um toque exclusivo ao seu jaleco." },
  { q: "Quais são as instruções ideais para a lavagem do jaleco feminino de farmacêutica?", a: "Recomendamos lavar em máquina no ciclo delicado, com água fria e sabão neutro. Evite o uso de alvejantes para preservar a cor e a integridade do tecido." },
  { q: "Um jaleco feminino de qualidade superior para farmacêuticas pode durar por muitos anos?", a: "Sim, nossos jalecos são produzidos com materiais de alta durabilidade e costura reforçada. Com os cuidados corretos, eles mantêm a elegância e funcionalidade por muito tempo." },
  { q: "Qual a melhor forma de escolher o tamanho certo para o jaleco feminino?", a: "Consulte nossa tabela de medidas detalhada e meça seu busto, cintura e quadril. Se houver dúvidas, nossa equipe de suporte está à disposição para auxiliar na escolha perfeita." },
  { q: "Há diferentes opções de comprimento para o jaleco feminino de farmacêutica?", a: "Oferecemos o comprimento clássico, que geralmente alcança a altura do quadril ou meio da coxa, garantindo elegância e funcionalidade em seu ambiente de trabalho." },
  { q: "Quais tipos de manga estão disponíveis para os jalecos femininos de farmacêutica?", a: "Temos modelos com manga longa, que oferece maior proteção, e opções com manga ¾ ou curta, ideais para climas mais quentes ou preferência de estilo." },
  { q: "Quantos bolsos o jaleco feminino de farmacêutica costuma ter e qual seu layout?", a: "Nossos jalecos femininos geralmente possuem três bolsos: um no peito e dois frontais na parte inferior. São práticos para organizar pequenos itens e canetas." },
  { q: "Qual o estilo dos jalecos femininos de farmacêutica para um visual contemporâneo?", a: "Desenvolvemos modelos que aliam a tradição da profissão com toques modernos, como golas diferenciadas e detalhes sutis. Nosso objetivo é um visual elegante e atual." },
  { q: "Como o jaleco de farmacêutica se diferencia de um modelo genérico de jaleco de saúde?", a: "Nosso jaleco para farmacêuticas é desenhado pensando nas especificidades da profissão, oferecendo um corte mais elegante e tecidos que suportam a rotina de manipulação e atendimento." },
  { q: "Posso incluir o logo da minha farmácia no jaleco feminino que eu comprar?", a: "Sim, para pedidos corporativos, oferecemos o serviço de bordado do logo da sua farmácia. Entre em contato para discutir as opções e condições para personalizar a sua equipe." },
  { q: "Qual o preço base para um jaleco feminino de farmacêutica personalizado?", a: "Nossos jalecos femininos de farmacêutica têm preços a partir de R$ 130,00, dependendo do modelo e das personalizações. Consulte nosso site para detalhes e promoções." },
  { q: "Qual o tempo médio de produção e entrega para jalecos femininos com bordado?", a: "O prazo para jalecos femininos personalizados é de 7 a 18 dias úteis, incluindo o tempo de bordado e envio. Fornecemos um código de rastreio para acompanhar seu pedido." },
  { q: "Qual a política de troca para um jaleco feminino que não serviu?", a: "Aceitamos trocas em até 7 dias corridos após o recebimento, desde que o produto esteja em perfeitas condições, sem uso. Para itens bordados, aplicam-se condições especiais." },
  { q: "Há alguma condição para obter frete grátis na compra de jalecos femininos?", a: "Sim, ocasionalmente oferecemos frete grátis para compras acima de um determinado valor ou em promoções sazonais. Verifique as condições atuais em nosso site." },
  { q: "Os jalecos femininos para farmacêuticas vêm com garantia de qualidade?", a: "Com certeza. Todos os nossos jalecos possuem garantia de 60 dias contra defeitos de fabricação, reforçando nosso compromisso com a qualidade e durabilidade de nossos produtos." },
  { q: "Este jaleco é adequado para uso em ambientes de manipulação de medicamentos?", a: "Sim, é confeccionado com tecidos que oferecem proteção básica para o ambiente de manipulação de medicamentos. É uma peça essencial para a segurança e higiene profissional." }
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
