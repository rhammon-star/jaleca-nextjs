'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Qual o tecido mais recomendado para jalecos masculinos que precisam de alta durabilidade e resistência a lavagens frequentes?", a: "Recomendamos tecidos como Gabardine ou Sarja, que oferecem excelente resistência, durabilidade e mantêm a boa aparência mesmo após múltiplas lavagens, ideal para a rotina intensa do médico." },
  { q: "Os jalecos para médicos possuem cortes específicos que proporcionam maior liberdade de movimento durante procedimentos cirúrgicos?", a: "Sim, nossos jalecos masculinos são projetados com cortes que priorizam a ergonomia e a amplitude de movimento, especialmente nas costas e braços, essenciais para a performance em cirurgias." },
  { q: "É possível personalizar o jaleco masculino com o nome e o número de registro profissional (CRM)?", a: "Certamente. Oferecemos o serviço de bordado para incluir seu nome e número de CRM no peito ou na manga, garantindo profissionalismo e identificação." },
  { q: "Qual a importância dos bolsos nos jalecos masculinos para a prática médica diária?", a: "Nossos jalecos contam com bolsos estrategicamente posicionados e de tamanho adequado para guardar estetoscópio, canetas e outros instrumentos essenciais, otimizando a rotina do médico." },
  { q: "Como escolher o tamanho ideal de jaleco para um médico com estrutura corporal mais robusta?", a: "Sugerimos consultar nossa tabela de medidas detalhada, que inclui opções até o G3, e considerar um corte mais reto ou tradicional para maior conforto em biotipos robustos." },
  { q: "Os jalecos brancos são os únicos permitidos para médicos em ambientes hospitalares, ou há outras cores discretas aceitáveis?", a: "O branco é o padrão predominante, mas algumas especialidades ou clínicas permitem cores neutras como cinza claro ou azul petróleo. Verifique as diretrizes do seu local de trabalho." },
  { q: "Qual o diferencial dos seus jalecos masculinos em termos de conforto para longos plantões?", a: "Priorizamos tecidos com boa respirabilidade e caimento que não restringem os movimentos, além de modelos com ventilação estratégica para garantir conforto prolongado durante plantões exaustivos." },
  { q: "Os punhos de malha nos jalecos masculinos são adequados para uso em ambientes que exigem rigoroso controle de infecção?", a: "Sim, os punhos de malha são confortáveis e permitem a movimentação, mas para ambientes com controle de infecção mais rigoroso, punhos elásticos ou com botão podem ser mais práticos para higienização." },
  { q: "O que devo considerar ao escolher um jaleco para uso em consultório médico versus hospital?", a: "Para consultório, há mais liberdade para estilos e cores. Para hospital, priorize tecidos de fácil assepsia, corte funcional e o branco padrão exigido." },
  { q: "Se eu precisar trocar o jaleco por um tamanho diferente, qual o procedimento e prazo?", a: "Oferecemos política de troca clara. Entre em contato com nosso atendimento ao cliente dentro do prazo estipulado e siga as instruções para troca por tamanho ou modelo." },
  { q: "Os jalecos possuem alguma tecnologia que ajuda a repelir líquidos ou minimizar manchas?", a: "Alguns de nossos modelos premium incorporam tratamentos que conferem resistência a líquidos e facilitam a remoção de manchas, protegendo o tecido e prolongando a vida útil do jaleco." },
  { q: "Qual a importância do comprimento do jaleco masculino para a funcionalidade do médico?", a: "Um comprimento médio é ideal, oferecendo proteção adequada e liberdade para sentar e movimentar-se sem prender. Jalecos mais longos são comuns em algumas especialidades." },
  { q: "Há opções de jalecos masculinos com gola social para um visual mais formal?", a: "Sim, dispomos de modelos com gola social clássica que conferem um visual mais elegante e profissional, perfeitos para médicos que buscam um toque de formalidade." },
  { q: "Qual o custo-benefício de investir em um jaleco de maior qualidade em vez de opções mais baratas?", a: "Jalecos de maior qualidade oferecem durabilidade superior, melhor caimento, mais conforto e resistência a desgastes, representando um investimento que se paga ao longo do tempo pela menor necessidade de substituição." },
  { q: "Como garantir que o bordado do CRM e nome não desfie após várias lavagens?", a: "Utilizamos técnicas de bordado de alta qualidade com fios resistentes que garantem a integridade e durabilidade do bordado, mesmo após inúmeras lavagens industriais ou domésticas." },
  { q: "Existe algum modelo de jaleco masculino mais adequado para médicos que usam muitas ferramentas nos bolsos?", a: "Sim, temos modelos com múltiplos bolsos, incluindo bolsos internos e divisórias, projetados para otimizar o armazenamento e a organização de instrumentos sem comprometer o conforto ou a estética." },
  { q: "Para médicos que trabalham em ambientes quentes, há opções de jalecos com tecidos mais leves e ventilados?", a: "Sim, oferecemos jalecos confeccionados com tecidos mais leves e tecnologias de ventilação, como painéis de malha respirável, ideais para climas quentes ou ambientes com alta temperatura." },
  { q: "Qual o prazo médio de entrega para jalecos masculinos com personalização de bordado?", a: "O prazo varia conforme a demanda, mas geralmente adiciona alguns dias ao prazo de entrega padrão para processamento do bordado. Consulte nosso site para estimativas atuais." },
  { q: "Os botões dos jalecos masculinos são resistentes e de fácil substituição, caso necessário?", a: "Nossos jalecos utilizam botões de alta resistência, costurados de forma segura. Em caso de necessidade, são botões padrão que podem ser substituídos facilmente." },
  { q: "Os jalecos masculinos são pré-encolhidos para evitar surpresas no tamanho após a primeira lavagem?", a: "Sim, nossos tecidos passam por um processo de pré-encolhimento para minimizar qualquer variação de tamanho após as primeiras lavagens, garantindo que o ajuste permaneça fiel à nossa tabela." }
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
