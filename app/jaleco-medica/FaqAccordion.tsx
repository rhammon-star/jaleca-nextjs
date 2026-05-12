'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Quais os modelos de jalecos femininos mais indicados para quem busca um caimento elegante e acinturado?", a: "Nossos modelos acinturados com pences frontais e traseiras são ideais para realçar a silhueta feminina, oferecendo um visual sofisticado e profissional." },
  { q: "Os jalecos femininos são desenhados para acomodar o uso de uniformes por baixo, sem adicionar volume excessivo?", a: "Sim, projetamos nossos jalecos femininos para terem um caimento perfeito sobre outros uniformes, garantindo conforto e uma aparência profissional sem ficar apertado ou volumoso." },
  { q: "Existe uma gama de cores para jalecos femininos além do branco que sejam aceitáveis em ambientes clínicos?", a: "Além do branco tradicional, oferecemos opções em tons pastel e cores sólidas discretas como azul claro, rosa seco ou cinza, que são aceitos em clínicas pediátricas ou estéticas, sempre verificando a política local." },
  { q: "Como garantir que o jaleco feminino permaneça impecável e sem amassados durante um dia de trabalho longo ou plantão?", a: "Recomendamos tecidos com elastano ou de alta tecnologia que amassam menos e possuem maior resiliência, mantendo a aparência alinhada por mais tempo." },
  { q: "Qual a diferença entre um jaleco slim fit e um corte tradicional para médicas?", a: "O slim fit oferece um corte mais ajustado ao corpo, ideal para um visual moderno e elegante, enquanto o corte tradicional proporciona maior folga e conforto para quem prefere mais liberdade de movimento." },
  { q: "É possível bordar o logo da clínica e o nome da médica no jaleco feminino?", a: "Sim, oferecemos serviços de bordado para personalizar seu jaleco com o logo da clínica, seu nome e CRM, adicionando um toque de exclusividade e profissionalismo." },
  { q: "Que tipo de gola é mais popular em jalecos femininos, a clássica ou a gola padre?", a: "Ambas são populares. A gola clássica é atemporal, enquanto a gola padre oferece um toque moderno e minimalista, sendo uma questão de preferência pessoal e estilo." },
  { q: "Os bolsos dos jalecos femininos são desenhados para serem funcionais sem comprometer a estética?", a: "Sim, nossos bolsos são projetados para serem práticos e discretos, permitindo guardar itens essenciais sem criar volume indesejado, mantendo a linha elegante do jaleco." },
  { q: "Qual o comprimento de jaleco feminino mais procurado para médicas que buscam praticidade e estilo?", a: "O comprimento na altura do quadril ou levemente abaixo é bastante popular, pois oferece cobertura adequada e facilita a movimentação, sem prejudicar a agilidade." },
  { q: "Como escolher o tecido ideal para um jaleco feminino que seja fácil de lavar e não desbote?", a: "Opte por tecidos como Gabardine Premium ou microfibra com tratamento especial, que são resistentes ao desbotamento e fáceis de cuidar, mantendo a cor viva por mais tempo." },
  { q: "Há jalecos femininos com mangas ¾ para quem prefere mais liberdade nos braços ou trabalha em ambientes quentes?", a: "Sim, temos modelos com manga ¾ que são práticos e confortáveis, ideais para quem busca um meio termo entre a manga longa e a manga curta, ou trabalha em climas mais quentes." },
  { q: "Qual a política de garantia para jalecos femininos em caso de defeito de fabricação?", a: "Todos os nossos produtos possuem garantia contra defeitos de fabricação. Entre em contato com nosso SAC e avaliaremos seu caso para uma solução rápida e eficiente." },
  { q: "Os botões dos jalecos femininos são discretos e seguros para evitar abertura acidental?", a: "Utilizamos botões de alta qualidade, bem costurados e discretos, que proporcionam um fechamento seguro e complementam a estética elegante do jaleco feminino." },
  { q: "Há opções de jalecos femininos com zíper, para quem busca uma alternativa aos botões?", a: "Sim, oferecemos modelos com fechamento em zíper invisível ou aparente, que proporcionam um visual moderno e prático, facilitando o vestir e despir." },
  { q: "Como escolher o tamanho correto do jaleco feminino para uma silhueta que varia entre dois tamanhos?", a: "Recomendamos priorizar a medida do busto e ombros. Se as medidas estiverem entre dois tamanhos, opte pelo maior para garantir conforto e mobilidade." },
  { q: "Os jalecos femininos com detalhes coloridos são uma tendência aceita na área médica?", a: "Detalhes discretos como golas e punhos coloridos são uma tendência crescente, especialmente em clínicas particulares ou especialidades como pediatria e dermatologia, adicionando um toque de personalidade." },
  { q: "Qual o custo de envio para jalecos femininos para diferentes regiões do Brasil?", a: "O valor do frete é calculado no momento da compra, com base no CEP de entrega e modalidade escolhida, com opções que variam de econômicas a expressas." },
  { q: "Existe alguma linha de jalecos femininos que se adapta melhor a médicas gestantes?", a: "Sim, dispomos de modelos com cortes mais amplos ou com ajustes laterais que se adaptam confortavelmente à gestação, garantindo que a futura mamãe permaneça profissional e confortável." },
  { q: "Os tecidos dos jalecos femininos são hipoalergênicos e adequados para peles sensíveis?", a: "Priorizamos tecidos de alta qualidade, muitos deles com composição que minimiza reações alérgicas, sendo suaves ao toque e adequados para peles sensíveis." },
  { q: "Quais os cuidados especiais para lavar jalecos femininos com detalhes bordados ou apliques?", a: "Recomenda-se lavar à mão ou em ciclo delicado na máquina, com água fria e sabão neutro. Virar a peça do avesso antes da lavagem ajuda a proteger bordados e apliques." }
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
