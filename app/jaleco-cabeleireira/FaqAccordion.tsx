'use client'
import { useState } from 'react'
const faqItems = [
  { q: "O tecido do jaleco Jaleca para cabeleireira é resistente a produtos de alisamento?", a: "Sim, nosso tecido foi especialmente selecionado para resistir à ação de produtos químicos agressivos como os de alisamento, mantendo a integridade do jaleco." },
  { q: "O jaleco protege a roupa contra respingos de tintura de cabelo?", a: "Absolutamente. O tecido possui acabamento que minimiza a absorção de tinturas, protegendo sua roupa de baixo e mantendo uma aparência profissional." },
  { q: "O corte do jaleco feminino é mais ajustado ao corpo?", a: "Sim, o corte feminino é levemente acinturado, valorizando a silhueta da cabeleireira sem comprometer a liberdade de movimento no salão." },
  { q: "Posso bordar meu nome e o contato do meu salão no jaleco?", a: "Claro! Personalize seu jaleco com seu nome e as informações de contato do seu salão, fortalecendo sua imagem e facilitando a identificação." },
  { q: "Este jaleco é apropriado para cabeleireiras que trabalham com penteados elaborados?", a: "Sim, ele foi desenhado para acompanhar seus movimentos durante a criação de penteados complexos, garantindo conforto e proteção em cada detalhe." },
  { q: "A durabilidade do jaleco compensa o investimento para uma cabeleireira autônoma?", a: "Com certeza. Nossos jalecos são feitos para durar, sendo um investimento inteligente para a cabeleireira autônoma que busca qualidade e profissionalismo duradouros." },
  { q: "Existe alguma recomendação especial de lavagem para o jaleco feminino?", a: "Para manter a forma e cor do seu jaleco feminino, recomendamos lavá-lo em ciclo delicado e secá-lo à sombra, seguindo as instruções da etiqueta." },
  { q: "Quais as opções de cores de jalecos para cabeleireiras?", a: "Oferecemos uma variedade de cores elegantes e modernas, permitindo que cada cabeleireira escolha o jaleco que melhor expressa sua personalidade e o estilo do salão." },
  { q: "Há tamanhos específicos para o biotipo feminino, do PP ao G3?", a: "Nossa grade de tamanhos, do PP ao G3, inclui modelagens pensadas para o biotipo feminino, garantindo um ajuste perfeito e elegante para todas as cabeleireiras." },
  { q: "Os bolsos são práticos para armazenar acessórios de cabelo?", a: "Sim, os bolsos são convenientemente localizados e dimensionados para armazenar prendedores, elásticos e outros pequenos acessórios, otimizando seu trabalho." },
  { q: "O comprimento do jaleco feminino é adequado para não restringir o movimento?", a: "O comprimento foi ajustado para oferecer cobertura e proteção sem restringir seus movimentos ao cortar ou estilizar cabelos, ideal para a cabeleireira moderna." },
  { q: "As opções de manga do jaleco feminino atendem a diferentes preferências?", a: "Sim, você pode escolher entre manga curta, 3/4 ou longa, adaptando o jaleco à sua preferência e ao clima, sem perder o estilo." },
  { q: "O estilo slim do jaleco feminino é elegante e confortável ao mesmo tempo?", a: "Nosso estilo slim combina elegância e conforto, proporcionando uma silhueta profissional e moderna, perfeita para a cabeleireira que valoriza a imagem." },
  { q: "Como os jalecos Jaleca se diferenciam dos concorrentes em termos de resistência a produtos de salão?", a: "Nossos jalecos usam tecidos com tratamentos avançados que superam a resistência dos concorrentes a tinturas e produtos químicos, garantindo maior durabilidade e proteção." },
  { q: "Qual o preço inicial para um jaleco de cabeleireira de qualidade?", a: "Invista na sua imagem profissional com nossos jalecos de cabeleireira de alta qualidade a partir de R$159, um valor justo pela excelência." },
  { q: "Qual o prazo de entrega para jalecos femininos?", a: "Entregamos seu jaleco feminino em 3 a 8 dias úteis, garantindo que você o receba rapidamente para usar em seu salão." },
  { q: "Posso solicitar a troca do jaleco se o modelo ou tamanho não me agradar?", a: "Claro, oferecemos 7 dias para você realizar a troca do seu jaleco, caso ele não atenda perfeitamente às suas expectativas." },
  { q: "Pedidos de jalecos femininos acima de R$499 têm frete grátis para alguns estados?", a: "Sim, para as cabeleireiras de SP, RJ, MG e ES, o frete é grátis em compras de jalecos femininos acima de R$499." },
  { q: "O jaleco feminino possui garantia contra defeitos?", a: "Todos os jalecos femininos da Jaleca contam com garantia contra defeitos de fabricação, assegurando a sua compra com total tranquilidade." },
  { q: "O tecido do jaleco para cabeleireira permite a respirabilidade em dias quentes?", a: "Sim, priorizamos tecidos leves e respiráveis que mantêm você fresca e confortável, mesmo durante longas horas de trabalho no salão." }
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