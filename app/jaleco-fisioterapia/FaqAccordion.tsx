'use client'
import { useState } from 'react'
const faqItems = [
  { q: "O bordado do CREFITO é padrão para toda a equipe de uma clínica de fisioterapia?", a: "Normalmente, apenas os fisioterapeutas licenciados bordam o CREFITO. Para a equipe de apoio, é comum bordar apenas o nome ou o logo da clínica, o que também oferecemos." },
  { q: "Que tipo de tecido é recomendado para jalecos de uma clínica de fisioterapia, pensando em durabilidade e conforto?", a: "Sugerimos gabardine ou tecidos mistos com algodão e poliéster, que aliam resistência, boa ventilação e são adequados para a intensa rotina de clínicas." },
  { q: "Podemos escolher cores que harmonizem com a decoração da clínica para os jalecos de fisioterapia?", a: "Com certeza. Dispomos de uma paleta de cores variada para que os jalecos de sua equipe se integrem perfeitamente à identidade visual e ao ambiente da sua clínica." },
  { q: "Qual o corte mais indicado para jalecos de fisioterapia que precisam de ampla movimentação?", a: "Priorizamos cortes mais soltos e anatômicos, que permitem liberdade total de movimento, essencial para acompanhar os pacientes em exercícios e terapias manuais." },
  { q: "Como faço para bordar o nome dos funcionários e o logo da clínica nos jalecos?", a: "Oferecemos personalização completa. Basta enviar o arquivo do logo e a lista de nomes. Nossa equipe de bordado garante um acabamento profissional e duradouro em todas as peças." },
  { q: "Quais são as melhores práticas para a lavagem dos jalecos da equipe de fisioterapia?", a: "Lave em água fria e ciclo suave, utilizando sabão neutro. A secagem deve ser preferencialmente ao ar livre para preservar a qualidade do tecido e evitar o desgaste prematuro." },
  { q: "Qual a vida útil esperada para jalecos de fisioterapia em ambientes de uso contínuo?", a: "Com a escolha de tecidos robustos e costuras de alta resistência, nossos jalecos são feitos para suportar a rotina exigente das clínicas por um longo período, mantendo a boa aparência." },
  { q: "Como podemos garantir o tamanho certo para todos os membros da equipe de fisioterapia?", a: "Disponibilizamos uma guia de tamanhos detalhada. Para pedidos em volume, sugerimos que cada membro da equipe consulte a tabela para uma escolha precisa, ou podemos auxiliar." },
  { q: "Os jalecos para clínicas de fisioterapia vêm em comprimentos variados?", a: "O comprimento padrão é o mais utilizado, geralmente na altura do quadril, pois oferece um equilíbrio ideal entre proteção e mobilidade, essencial na prática da fisioterapia." },
  { q: "Há opções de jalecos de fisioterapia com manga curta ou outras variações para a equipe?", a: "Sim, temos modelos com manga longa e também com manga curta, para se adequar às preferências individuais e às condições climáticas do ambiente de trabalho da sua clínica." },
  { q: "Quantos bolsos são funcionais em jalecos para uma clínica de fisioterapia?", a: "Nossos jalecos para clínicas possuem dois bolsos inferiores e um superior, ideais para guardar pequenos instrumentos, canetas e prontuários de forma prática e segura." },
  { q: "Que estilo de jaleco se adapta melhor à imagem de uma clínica de fisioterapia?", a: "Adotamos um estilo limpo e funcional, que transmite profissionalismo e higiene. O design é pensado para ser moderno, confortável e adequado ao ambiente de cuidado e recuperação." },
  { q: "Existe diferença entre um jaleco para fisioterapeuta e um para recepcionista de fisioterapia?", a: "Sim, o jaleco do fisioterapeuta prioriza mobilidade e tecidos específicos, enquanto o da recepcionista pode focar mais em estilo e apresentação, com tecidos de menor resistência ao atrito." },
  { q: "Qual o desconto oferecido para compras em volume de jalecos para clínicas de fisioterapia?", a: "Oferecemos descontos significativos para pedidos em grande quantidade. Entre em contato com nosso departamento comercial para solicitar um orçamento personalizado para sua clínica." },
  { q: "Qual o custo inicial de um jaleco para equipe de fisioterapia sem personalização?", a: "Os preços dos nossos jalecos para equipe de fisioterapia partem de R$ 95,00, variando conforme o modelo, tecido e a quantidade. É um investimento na imagem e conforto da sua equipe." },
  { q: "Qual o tempo estimado para a entrega de um pedido grande de jalecos de fisioterapia personalizados?", a: "Para pedidos em volume e com personalização, o prazo pode variar de 10 a 25 dias úteis, dependendo da complexidade e da quantidade. Recomendamos planejamento antecipado." },
  { q: "Como proceder com a troca de jalecos de fisioterapia em caso de erro no pedido corporativo?", a: "Em casos de pedidos corporativos, a troca de peças sem uso é possível em até 15 dias, mediante análise e seguindo nossa política. É importante verificar as medidas antes da produção." },
  { q: "É possível obter frete grátis para grandes pedidos de jalecos para clínicas de fisioterapia?", a: "Sim, para compras em grande volume, frequentemente oferecemos condições especiais de frete, incluindo a possibilidade de frete grátis para certas localidades. Consulte nosso atendimento." },
  { q: "Os jalecos de fisioterapia têm garantia para toda a equipe?", a: "Sim, garantimos 90 dias contra defeitos de fabricação para todos os jalecos adquiridos por sua clínica, assegurando a qualidade e a durabilidade para sua equipe." },
  { q: "O tecido do jaleco para fisioterapia oferece boa ventilação durante o uso?", a: "Nossos tecidos são selecionados para oferecer excelente ventilação, evitando o acúmulo de calor e garantindo o conforto térmico, mesmo durante as atividades mais intensas da fisioterapia." }
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
