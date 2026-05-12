'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Qual a principal vantagem do tecido do jaleco para cabeleireiro?", a: "Nosso tecido premium é desenvolvido para repelir cabelos e resistir a manchas de produtos químicos e tinturas, mantendo seu jaleco limpo e apresentável." },
  { q: "Este jaleco protege contra o calor do secador e chapinha?", a: "Sim, o material do jaleco Jaleca para cabeleireiro oferece uma barreira protetora eficaz contra o calor de equipamentos térmicos, aumentando sua segurança." },
  { q: "Como o corte profissional do jaleco se adapta ao movimento constante do cabeleireiro?", a: "O corte é ergonomicamente desenhado para permitir total flexibilidade e conforto, crucial para a movimentação constante no salão sem restrições." },
  { q: "É possível personalizar o jaleco com meu nome ou o logo do salão?", a: "Claro! Oferecemos serviço de bordado de alta qualidade para seu nome, cargo ou o logo do seu salão, agregando valor à sua imagem profissional." },
  { q: "O jaleco Jaleca é ideal para o ambiente agitado de um salão de beleza?", a: "Absolutamente! Nossos jalecos são projetados para suportar o ritmo acelerado de um salão, oferecendo durabilidade e um visual sempre impecável." },
  { q: "Qual a expectativa de vida útil de um jaleco para cabeleireiro da Jaleca?", a: "Com os devidos cuidados, seu jaleco Jaleca terá uma vida útil prolongada, sendo um companheiro confiável no seu dia a dia profissional por muito tempo." },
  { q: "Como devo lavar o jaleco para evitar desbotamento da cor?", a: "Lave o jaleco separadamente ou com cores similares, utilizando água fria e sabão neutro para preservar a cor e a integridade do tecido." },
  { q: "Quais as opções de cores disponíveis para o jaleco de cabeleireiro?", a: "Contamos com uma paleta de cores modernas e elegantes, perfeitas para harmonizar com a identidade visual do seu salão e seu estilo pessoal." },
  { q: "Onde posso encontrar a tabela de tamanhos para o jaleco de cabeleireiro?", a: "A tabela de medidas completa está disponível em nosso site, ajudando você a escolher o tamanho ideal, do PP ao G3, para um caimento perfeito." },
  { q: "Os bolsos do jaleco são funcionais para ferramentas de cabeleireiro?", a: "Sim, os bolsos são estrategicamente posicionados e dimensionados para guardar pentes, grampos e outros utensílios, mantendo-os sempre à mão e organizados." },
  { q: "O comprimento do jaleco é adequado para evitar que caia cabelo nas roupas de baixo?", a: "Nosso comprimento foi cuidadosamente pensado para cobrir adequadamente suas roupas, minimizando o acúmulo de cabelo e protegendo seu uniforme pessoal." },
  { q: "Posso escolher entre manga curta ou longa para o jaleco de cabeleireiro?", a: "Sim, oferecemos opções de jalecos com manga curta ou longa, permitindo que você escolha o modelo que proporciona maior conforto e proteção no seu trabalho." },
  { q: "O estilo 'profissional' do jaleco reflete a seriedade do meu trabalho?", a: "Absolutamente. Nosso estilo profissional foi criado para transmitir confiança e seriedade, elevando a percepção da sua imagem no salão." },
  { q: "Os jalecos Jaleca para cabeleireiros oferecem melhor custo-benefício que os da concorrência?", a: "Devido à durabilidade superior e resistência a produtos químicos, nossos jalecos representam um excelente custo-benefício a longo prazo, superando a concorrência." },
  { q: "Qual o preço de partida para um jaleco de cabeleireiro na Jaleca?", a: "Nossos jalecos de alta qualidade para cabeleireiros estão disponíveis a partir de R$159, um investimento na sua imagem e proteção profissional." },
  { q: "Qual o tempo de entrega para jalecos de cabeleireiro?", a: "Com um prazo de entrega de 3 a 8 dias úteis, você receberá seu jaleco rapidamente, pronto para uso no seu salão." },
  { q: "Existe política de troca caso eu não esteja satisfeito com o jaleco?", a: "Sim, você tem até 7 dias após o recebimento para solicitar a troca do seu jaleco, garantindo sua total satisfação com a compra." },
  { q: "Há frete grátis para compras de jalecos acima de R$499 em alguns estados?", a: "Sim, oferecemos frete grátis para pedidos de jalecos acima de R$499 nos estados de SP, RJ, MG e ES, facilitando sua compra." },
  { q: "Os jalecos para cabeleireiro vêm com alguma garantia?", a: "Sim, todos os nossos jalecos vêm com garantia contra defeitos de fabricação, assegurando a qualidade e a sua confiança na marca Jaleca." },
  { q: "O tecido do jaleco para cabeleireiro é respirável para o uso diário?", a: "Priorizamos tecidos respiráveis que proporcionam conforto térmico durante todo o dia, mesmo em ambientes movimentados de salão." }
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