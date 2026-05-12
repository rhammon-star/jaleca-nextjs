'use client'
import { useState } from 'react'
const faqItems = [
  { q: "O número do CREFITO deve ser bordado no jaleco do fisioterapeuta?", a: "Embora não seja uma imposição do conselho, muitos profissionais optam por bordar o CREFITO para identificação. Oferecemos um serviço de bordado preciso e de alta qualidade." },
  { q: "Qual o tecido ideal para um jaleco de fisioterapeuta que exige flexibilidade e higiene?", a: "Indicamos tecidos como o gabardine com elastano ou o brim leve, que proporcionam flexibilidade, são fáceis de higienizar e mantêm a apresentação impecável durante o dia." },
  { q: "Existem opções de cores modernas para o jaleco do fisioterapeuta além do branco?", a: "Sim, oferecemos opções em tons claros e neutros como azul claro, cinza ou verde menta, que trazem um toque de modernidade sem comprometer a seriedade profissional. Verifique as normas da sua clínica." },
  { q: "Como é o corte dos jalecos para fisioterapeutas, pensando na liberdade de movimento?", a: "Nossos jalecos possuem cortes ergonômicos e ligeiramente ajustados, permitindo total liberdade de movimento para as diversas técnicas e exercícios da fisioterapia. Conforto e funcionalidade são essenciais." },
  { q: "Como faço para personalizar meu jaleco com nome e registro do CREFITO?", a: "Basta informar seu nome e número de CREFITO no momento da compra. Realizamos o bordado com atenção aos detalhes, garantindo uma identificação clara e duradoura." },
  { q: "Qual a melhor forma de lavar o jaleco de fisioterapeuta para mantê-lo sempre limpo e higienizado?", a: "Lave em água fria com sabão neutro, separadamente de outras roupas. A secagem deve ser feita à sombra para evitar o desgaste do tecido e a perda da cor. A higiene é crucial." },
  { q: "Qual a durabilidade esperada para um jaleco de fisioterapeuta, considerando o uso intenso?", a: "Produzimos jalecos com materiais de alta resistência e costura reforçada, desenhados para suportar o uso diário e as frequentes lavagens sem perder a forma ou a cor." },
  { q: "Como escolher o tamanho ideal do jaleco para fisioterapeuta, garantindo conforto e caimento?", a: "Consulte nossa tabela de medidas e tire suas próprias medidas cuidadosamente. Um jaleco bem ajustado garante conforto e uma aparência profissional durante o atendimento." },
  { q: "Há diferentes opções de comprimento para o jaleco de fisioterapeuta, pensando na mobilidade?", a: "Oferecemos o comprimento clássico, que geralmente vai até a metade da coxa, proporcionando cobertura adequada e não interferindo nos movimentos durante as sessões de tratamento." },
  { q: "Estão disponíveis modelos de jaleco de fisioterapeuta com manga 3/4 ou curta?", a: "Sim, temos opções de manga longa para maior proteção e manga 3/4 ou curta para maior liberdade e conforto em ambientes mais quentes. Escolha o modelo que melhor se adapta à sua rotina." },
  { q: "Quantos bolsos são práticos em um jaleco de fisioterapeuta e qual a sua distribuição?", a: "Nossos jalecos contam com três bolsos: um superior e dois frontais inferiores. São ideais para carregar canetas, olografos ou pequenos acessórios essenciais ao atendimento." },
  { q: "Qual o estilo dos jalecos para fisioterapeutas para um visual moderno e acolhedor?", a: "Priorizamos um estilo contemporâneo e humanizado, com linhas limpas e detalhes que transmitem profissionalismo e confiança, sem abrir mão da praticidade e do conforto." },
  { q: "Qual a principal diferença entre um jaleco de fisioterapeuta e um jaleco médico tradicional?", a: "O jaleco de fisioterapeuta é projetado com ênfase em mobilidade e flexibilidade do tecido, ideal para movimentos corporais durante os exercícios. O jaleco médico foca mais em proteção e formalidade." },
  { q: "É possível personalizar os jalecos com o logo da minha clínica de fisioterapia?", a: "Sim, oferecemos o serviço de bordado do logo da sua clínica para pedidos corporativos. É uma excelente forma de padronizar sua equipe e fortalecer a identidade da sua marca." },
  { q: "Qual o preço médio de um jaleco de fisioterapeuta com personalização?", a: "Nossos jalecos de fisioterapeuta iniciam a partir de R$ 110,00, com a opção de bordado incluída. Os valores podem variar conforme o modelo e tecido escolhido." },
  { q: "Qual o prazo de entrega para jalecos de fisioterapeuta com bordado do nome e CREFITO?", a: "O prazo de entrega para jalecos personalizados é de 7 a 15 dias úteis, contabilizando o tempo de produção e o frete. Você receberá atualizações sobre o status do seu pedido." },
  { q: "Como funciona a política de troca caso o jaleco de fisioterapeuta não vista bem?", a: "Aceitamos trocas em até 7 dias após o recebimento, desde que o jaleco esteja sem uso. Para produtos com bordado personalizado, aplicam-se condições específicas, consulte-nos." },
  { q: "Há ofertas de frete grátis para jalecos de fisioterapeuta em alguma situação?", a: "Sim, periodicamente lançamos promoções de frete grátis para compras acima de determinado valor ou para regiões específicas. Fique atento aos nossos anúncios no site." },
  { q: "Os jalecos de fisioterapeuta possuem alguma garantia de satisfação ou contra defeitos?", a: "Todos os nossos jalecos vêm com uma garantia de 90 dias contra defeitos de fabricação. Sua satisfação e a qualidade de nossos produtos são a nossa prioridade." },
  { q: "Os tecidos utilizados nos jalecos de fisioterapeuta são fáceis de passar e manter?", a: "Sim, selecionamos tecidos que amassam pouco, facilitando a manutenção e garantindo que seu jaleco esteja sempre impecável com o mínimo de esforço. Praticidade para o dia a dia." }
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
