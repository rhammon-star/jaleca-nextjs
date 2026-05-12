'use client'
import { useState } from 'react'
const faqItems = [
  { q: "É necessário bordar algum registro profissional (como um conselho) no jaleco do podólogo?", a: "Não existe um conselho federal para podólogos com registro obrigatório em jaleco, mas o bordado do nome e especialidade confere profissionalismo. Oferecemos este serviço com qualidade." },
  { q: "Qual o tecido mais indicado para um jaleco de podólogo masculino, pensando em higiene e movimento?", a: "Recomendamos tecidos como gabardine ou sarja leve. São resistentes, permitem boa ventilação, fáceis de lavar e confortáveis para o trabalho que exige precisão e movimentação constante." },
  { q: "Posso escolher cores diferentes do branco para meu jaleco de podólogo?", a: "Sim, além do branco tradicional, temos opções em tons sóbrios como azul marinho, cinza chumbo ou verde escuro, que conferem um visual moderno e profissional. Consulte as normas do seu local de trabalho." },
  { q: "Qual o corte ideal para um jaleco de podólogo, que oferece liberdade de movimentos?", a: "Nossos jalecos masculinos para podólogos têm um corte reto e funcional, pensado para não restringir seus movimentos e garantir conforto durante os procedimentos. Praticidade e elegância." },
  { q: "Como posso personalizar meu jaleco de podólogo com meu nome e especialidade?", a: "Você pode solicitar o bordado do seu nome e da palavra 'Podólogo' durante a compra. Garantimos um bordado de alta qualidade, nítido e que valoriza sua identificação profissional." },
  { q: "Quais são as melhores dicas de lavagem para o jaleco de podólogo, mantendo a higiene?", a: "Lave o jaleco em água fria ou morna, com ciclo suave e sabão neutro. Para garantir a higiene, pode-se usar desinfetante para roupas apropriado. Seque à sombra para preservar o tecido." },
  { q: "Qual a durabilidade esperada para um jaleco de podólogo, considerando o uso diário e as lavagens?", a: "Nossos jalecos são confeccionados com materiais de alta resistência e costuras reforçadas, projetados para suportar o uso frequente e as lavagens necessárias na podologia, durando anos." },
  { q: "Como escolher o tamanho correto do jaleco de podólogo masculino?", a: "Consulte nossa tabela de medidas detalhada e compare com suas próprias medidas de tórax e cintura. Um bom ajuste garante conforto e evita que o jaleco atrapalhe seus movimentos." },
  { q: "Há opções de comprimento para o jaleco de podólogo, como modelos mais curtos?", a: "Oferecemos o comprimento clássico, que geralmente cobre até a metade da coxa, proporcionando proteção adequada e não interferindo na flexibilidade necessária para o trabalho com os pés." },
  { q: "Estão disponíveis jalecos de podólogo com manga curta para maior conforto?", a: "Sim, temos modelos com manga longa para proteção extra e manga curta, ideais para climas mais quentes ou para maior liberdade de movimento durante os procedimentos." },
  { q: "Quantos bolsos são funcionais em um jaleco de podólogo e qual sua distribuição?", a: "Nossos jalecos vêm com um bolso superior no peito e dois bolsos frontais inferiores, pensados para guardar pequenos instrumentos, canetas e outros itens de fácil acesso durante o atendimento." },
  { q: "Qual o estilo dos jalecos para podólogos, transmitindo profissionalismo e higiene?", a: "Priorizamos um estilo clássico, limpo e profissional, com linhas retas e acabamento impecável. O design visa transmitir confiança e zelar pela imagem de higiene exigida na podologia." },
  { q: "Qual a diferença entre um jaleco de podólogo e um de enfermeiro?", a: "O jaleco de podólogo é otimizado para a especificidade do tratamento dos pés, focando em tecidos mais maleáveis e bolsos práticos. O de enfermeiro pode ter foco em maior proteção e um corte mais padrão." },
  { q: "Posso comprar jalecos para minha equipe de podólogos com desconto?", a: "Sim, oferecemos condições especiais e descontos progressivos para compras em maior volume. Entre em contato com nosso departamento de vendas para uma proposta personalizada para sua clínica." },
  { q: "Qual o preço a partir de um jaleco de podólogo masculino com bordado?", a: "Nossos jalecos masculinos para podólogos iniciam a partir de R$ 118,00, com a opção de bordado personalizado incluída. Consulte nosso site para detalhes sobre modelos e tecidos." },
  { q: "Qual o prazo de entrega para um jaleco de podólogo personalizado?", a: "O prazo para entrega de jalecos personalizados é de 7 a 15 dias úteis, somando o tempo de produção e envio. Você receberá um código de rastreio para acompanhar o seu pedido." },
  { q: "Como funciona a política de troca se o jaleco de podólogo não servir corretamente?", a: "Aceitamos trocas em até 7 dias após o recebimento, desde que o produto esteja sem uso e com as etiquetas originais. Para peças bordadas, aplicam-se condições específicas, que podem ser consultadas." },
  { q: "Há opções de frete mais rápidas para jalecos de podólogo urgentes?", a: "Sim, além do frete padrão, disponibilizamos modalidades de frete expresso para quem precisa do jaleco com mais rapidez. Verifique as opções e custos no momento da finalização da compra." },
  { q: "Os jalecos para podólogos possuem alguma garantia de qualidade?", a: "Todos os nossos jalecos contam com garantia de 90 dias contra defeitos de fabricação, assegurando que você receba um produto de alta qualidade e durabilidade." },
  { q: "O tecido do jaleco de podólogo é fácil de desinfetar após o uso?", a: "Nossos tecidos são selecionados para facilitar a desinfecção e lavagem, sendo resistentes a ciclos de lavagem mais intensos, essenciais para manter a higiene rigorosa da podologia." }
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
