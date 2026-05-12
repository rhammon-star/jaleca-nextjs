'use client'
import { useState } from 'react'
const faqItems = [
  { q: "Vendedor de farmácia ou loja de cosméticos usa jaleco?", a: "Sim, é prática comum em farmácias, perfumarias, lojas de produtos naturais e ópticas — transmite higiene e padroniza a equipe." },
  { q: "Qual a melhor cor de jaleco para vendedor?", a: "Branco é tradicional em farmácia; cores corporativas (cor da marca) são comuns em perfumarias e ópticas." },
  { q: "Qual tecido aguenta o dia em pé?", a: "Microfibra com elastano é leve, respira e não repuxa em jornada de 8h em pé." },
  { q: "Posso bordar nome e loja?", a: "Sim. Bordamos nome + logo/nome da loja gratuitamente." },
  { q: "Qual corte é mais usado?", a: "Corte reto masculino ou acinturado feminino, comprimento meio da coxa." },
  { q: "Manga curta ou longa?", a: "Manga curta predomina no varejo (mais leve no calor); manga longa em farmácias mais formais." },
  { q: "Atende plus size?", a: "Sim, do P ao GG3 masculino e PP ao GG3 feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, Correios e transportadoras." },
  { q: "Tem desconto para loja com vários vendedores?", a: "Sim, a partir de 5 peças com bordado padronizado. Solicite orçamento." },
  { q: "Faz uniforme com cor da minha marca?", a: "Sim. Trabalhamos com várias cores; consulte disponibilidade para a cor desejada." },
  { q: "Tem bolsos para etiqueta de preço e leitor?", a: "Sim. Bolsos amplos suportam celular, caneta, etiquetas e leitor portátil." },
  { q: "O jaleco aguenta lavagens frequentes?", a: "Sim. Microfibra suporta lavagem diária por anos sem perder caimento." },
  { q: "Como lavar para preservar a cor?", a: "Máquina, água até 40 °C, separado de cores. Sem cloro para brancos." },
  { q: "Combina com camiseta por baixo?", a: "Combina perfeitamente. Camiseta neutra ou camisa polo da loja por baixo é o padrão." },
  { q: "Faz personalização com logo bordado?", a: "Sim. Bordamos logo da loja no peito ou nas costas." },
  { q: "O jaleco amarrota durante o expediente?", a: "Microfibra praticamente não amarrota — mantém apresentação ao longo do dia." },
  { q: "Qual a diferença entre jaleco vendedor e farmacêutico?", a: "O corte é o mesmo; muda o bordado (nome da loja vs CRF) e o tipo de personalização (logo corporativo)." }
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
