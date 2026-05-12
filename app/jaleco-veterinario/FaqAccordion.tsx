'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Veterinário precisa de jaleco específico?", a: "Sim. Embora o CRMV não exija modelo padronizado, o jaleco branco é praxe profissional e ajuda a identificar o médico veterinário em clínicas e consultórios." },
  { q: "Qual a melhor cor de jaleco para veterinário?", a: "Branco é o tradicional, mas azul-marinho e cinza estão crescendo entre veterinários por sujar menos com pelos e fluidos animais." },
  { q: "Qual tecido aguenta o dia a dia em clínica veterinária?", a: "Microfibra com elastano é a escolha ideal: resiste a pelos, arranhões leves de patas e suporta lavagem frequente em água quente." },
  { q: "O jaleco resiste a arranhões de gato?", a: "Nossos jalecos em microfibra são densos e resistem bem a arranhões superficiais, embora nenhum tecido seja 100% à prova de unhas." },
  { q: "Posso bordar CRMV e nome no jaleco?", a: "Sim. Bordamos nome completo, profissão e número do CRMV no peito esquerdo sem custo adicional." },
  { q: "Qual o corte mais usado por veterinários?", a: "Corte reto tradicional masculino, com bolsos amplos para guardar termômetro, caneta e estetoscópio veterinário." },
  { q: "Qual o comprimento ideal do jaleco veterinário?", a: "Comprimento no meio da coxa é o mais funcional — protege a roupa sem atrapalhar ao abaixar para atender animais." },
  { q: "Manga longa ou curta para clínica veterinária?", a: "Manga longa é mais usada por proteger antebraços de mordidas e arranhões; manga curta serve para procedimentos cirúrgicos." },
  { q: "Tem tamanho plus size para veterinário?", a: "Sim. Atendemos do P ao GG3 (equivalente ao 56) no modelo masculino." },
  { q: "O jaleco encolhe na lavagem?", a: "Não. Nossos tecidos são pré-encolhidos. Lave em água até 40 °C e seque à sombra para preservar o caimento." },
  { q: "Quanto custa um jaleco veterinário?", a: "A partir de R$ 119,90 no modelo padrão. Bordado de nome + CRMV é gratuito." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado personalizado: 5 a 10 dias úteis após confirmação do pedido." },
  { q: "Posso trocar o tamanho se não servir?", a: "Sim. Você tem 7 dias após o recebimento para solicitar troca, desde que o jaleco esteja sem uso e sem bordado personalizado." },
  { q: "Vocês entregam em todo o Brasil?", a: "Sim, enviamos via Correios e transportadoras para todo o território nacional, incluindo zonas rurais." },
  { q: "Tem desconto para clínica veterinária com vários funcionários?", a: "Sim. Para 5 jalecos ou mais oferecemos desconto progressivo. Solicite orçamento pelo WhatsApp." },
  { q: "Qual a diferença entre jaleco veterinário e médico?", a: "Funcionalmente o corte é o mesmo, mas o veterinário costuma escolher tecidos mais resistentes a pelos e fluidos animais." },
  { q: "O jaleco serve para cirurgia veterinária?", a: "Para cirurgias usamos jaleco com manga curta ou avental cirúrgico — peça à parte. O jaleco padrão é para consulta e clínica." },
  { q: "Tem bolso para guardar estetoscópio?", a: "Sim. Todos têm bolso superior + dois inferiores amplos, com profundidade suficiente para estetoscópio veterinário." },
  { q: "Posso usar o jaleco em atendimento domiciliar (home vet)?", a: "Sim. O tecido leve e o caimento ajustado tornam o jaleco confortável para visitas domiciliares de longa duração." },
  { q: "O jaleco amarela com o tempo?", a: "Com lavagem correta (sem alvejante cloro direto), o branco mantém-se por mais de 2 anos de uso diário." }
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
