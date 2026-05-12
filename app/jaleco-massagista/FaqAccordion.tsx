'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Massagista precisa usar jaleco?", a: "Não é obrigatório, mas o jaleco transmite profissionalismo e higiene, especialmente em SPAs e clínicas de massoterapia." },
  { q: "Qual a melhor cor para jaleco de massagista?", a: "Branco é o tradicional; bege, areia e branco-off transmitem aconchego e combinam com ambiente de SPA." },
  { q: "Qual tecido é mais confortável para trabalhar com óleos?", a: "Microfibra com elastano resiste melhor a manchas de óleos essenciais e cremes do que algodão puro." },
  { q: "Como tirar manchas de óleo do jaleco?", a: "Polvilhe amido de milho na mancha, deixe 1h, escove e depois lave normalmente. Evite água quente antes de remover o óleo." },
  { q: "Qual corte é melhor para movimentos amplos de massagem?", a: "Corte com elastano e abertura nas laterais (fendas) permite movimentos amplos de braço sem repuxar." },
  { q: "Manga curta ou 3/4 para massoterapia?", a: "Manga curta é a preferência — facilita os movimentos e evita contato da manga com o óleo aplicado no cliente." },
  { q: "Posso bordar nome e especialidade?", a: "Sim. Bordamos nome + especialidade (massoterapeuta, quiropraxista) gratuitamente." },
  { q: "Qual comprimento é mais funcional?", a: "Comprimento no meio da coxa não atrapalha ao se inclinar sobre a maca." },
  { q: "Tem jaleco unissex para massagista?", a: "Sim. Modelos com corte reto servem para massagistas homens e mulheres." },
  { q: "Atende tamanhos plus size?", a: "Sim, do PP ao GG3 nos modelos femininos e P ao GG3 nos masculinos." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome grátis." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar de tamanho?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado personalizado." },
  { q: "Frete para todo o Brasil?", a: "Sim, enviamos via Correios e transportadoras para todo o país." },
  { q: "Tem desconto para SPA com vários massagistas?", a: "Sim, a partir de 5 peças há desconto progressivo. Solicite orçamento." },
  { q: "O jaleco aguenta lavagens frequentes?", a: "Sim. Microfibra suporta lavagem diária por anos sem perder caimento." },
  { q: "Tecido transpira no calor?", a: "Sim, microfibra é leve e respirável — ideal para SPAs com ambiente aquecido." },
  { q: "Posso usar jaleco preto?", a: "Pode. O preto disfarça manchas de óleo e está cada vez mais comum em SPAs urbanos modernos." },
  { q: "Tem bolsos para guardar óleos pequenos?", a: "Sim. Todos os modelos têm bolsos amplos suficientes para frascos de óleo essencial e celular." },
  { q: "Qual a diferença entre jaleco massagista e esteticista?", a: "Funcionalmente são iguais; varia o nome bordado. Ambos priorizam leveza, conforto e resistência a manchas." }
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
