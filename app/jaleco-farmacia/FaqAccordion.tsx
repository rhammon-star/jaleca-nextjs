'use client'
import { useState } from 'react'
const faqItems = [
  { q: "O jaleco para equipe de farmácia (balconistas, atendentes) precisa de registro profissional bordado?", a: "Geralmente não é necessário um registro profissional como CRF, mas pode-se bordar o nome da farmácia ou do funcionário para identificação. Nós oferecemos esse serviço." },
  { q: "Qual o tecido mais recomendado para jalecos de funcionários de farmácia, visando conforto e praticidade?", a: "Indicamos o gabardine ou brim leve, pois são tecidos resistentes, de fácil lavagem, secagem rápida e que oferecem conforto durante o expediente, mantendo uma boa apresentação." },
  { q: "Podemos escolher uma cor específica de jaleco que combine com a identidade visual da farmácia?", a: "Sim, disponibilizamos uma ampla gama de cores para que seu jaleco se alinhe perfeitamente à sua marca. Consulte nosso catálogo para as opções de cores disponíveis." },
  { q: "Qual o corte mais funcional para jalecos usados por balconistas e atendentes de farmácia?", a: "Priorizamos cortes mais amplos e retos, que oferecem maior liberdade de movimento para as tarefas diárias, garantindo o conforto necessário ao longo do dia." },
  { q: "É possível bordar o logo da farmácia ou o nome dos colaboradores nos jalecos?", a: "Sim, oferecemos o serviço de bordado de logos e nomes personalizados. É uma excelente forma de profissionalizar sua equipe e fortalecer a identidade da sua farmácia." },
  { q: "Quais as orientações para a lavagem dos jalecos de farmácia para garantir sua longevidade?", a: "A lavagem deve ser feita com água fria e sabão neutro. Evite produtos químicos agressivos e a secagem direta ao sol para preservar as cores e o tecido por mais tempo." },
  { q: "Qual a expectativa de vida útil para um jaleco de farmácia com uso diário?", a: "Com o uso de tecidos de alta qualidade e costuras reforçadas, nossos jalecos são projetados para suportar o uso diário intenso, mantendo sua aparência e integridade por anos." },
  { q: "Como selecionar os tamanhos corretos para a equipe de uma farmácia ao fazer um pedido grande?", a: "Nossa tabela de medidas é detalhada e recomendamos que cada colaborador meça-se. Para grandes volumes, podemos oferecer assistência e dicas para um ajuste ideal." },
  { q: "Os jalecos para farmácia possuem um comprimento padrão ou há variações?", a: "Oferecemos o comprimento padrão, que geralmente chega na altura do quadril, proporcionando praticidade e um visual profissional para o atendimento ao público." },
  { q: "Estão disponíveis jalecos para farmácia com opções de manga curta para maior conforto?", a: "Sim, temos modelos com manga curta, ideais para ambientes mais quentes ou para quem prefere maior liberdade de movimento. A escolha da manga deve se adequar à sua rotina." },
  { q: "Quantos bolsos são ideais para um jaleco de farmácia e onde eles estão localizados?", a: "Nossos jalecos vêm com um bolso superior e dois bolsos inferiores, pensados para a conveniência de guardar canetas, blocos e outros pequenos itens essenciais ao atendimento." },
  { q: "Que tipo de estilo os jalecos para equipes de farmácia oferecem para padronização?", a: "Nossos jalecos são desenhados com um estilo clássico e universal, garantindo uniformidade e um aspecto profissional para toda a equipe, independentemente da função." },
  { q: "Qual a diferença entre um jaleco de farmacêutico e um jaleco para balconista de farmácia?", a: "Enquanto o jaleco de farmacêutico foca na apresentação individual e pode ter bordados específicos, o de balconista visa padronização da equipe, com ênfase em durabilidade e conforto para o atendimento diário." },
  { q: "Há um mínimo de peças para pedidos corporativos de jalecos para farmácia?", a: "Não há um mínimo fixo, mas para aproveitar nossos descontos progressivos e personalização de logo, é vantajoso para compras acima de cinco unidades. Consulte-nos para detalhes." },
  { q: "Qual o custo inicial de um jaleco genérico para funcionários de farmácia, sem bordado?", a: "Nossos jalecos para farmácia iniciam a partir de R$ 89,00, oferecendo um excelente custo-benefício para padronizar sua equipe com qualidade. Valores podem variar por modelo e tecido." },
  { q: "Qual o prazo de produção para um pedido de jalecos para toda a equipe de farmácia?", a: "O prazo de produção para pedidos de equipe com personalização varia de 10 a 20 dias úteis, mais o tempo de envio. Planeje sua compra com antecedência para evitar atrasos." },
  { q: "Como funciona a política de troca para um pedido grande de jalecos de farmácia se houver tamanhos incorretos?", a: "Para pedidos corporativos, recomendamos a verificação cuidadosa das medidas. Oferecemos suporte para trocas de peças sem uso em até 15 dias, sob consulta para bordados." },
  { q: "É possível negociar o valor do frete para grandes volumes de jalecos para farmácia?", a: "Sim, para pedidos de grande volume, podemos analisar condições especiais de frete ou até mesmo frete grátis, dependendo da região e do valor total da compra. Fale com nosso time." },
  { q: "Os jalecos para funcionários de farmácia possuem alguma garantia de qualidade?", a: "Sim, oferecemos garantia de 90 dias contra defeitos de fabricação em todos os nossos jalecos. Queremos assegurar a qualidade e a satisfação de sua equipe." },
  { q: "Os tecidos dos jalecos para farmácia são adequados para ambientes com climatização variada?", a: "Nossos tecidos são escolhidos para proporcionar conforto térmico. Gabardine e brim leve são versáteis, adequados tanto para ambientes climatizados quanto para temperaturas mais amenas." }
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
