'use client'

import { useState } from 'react'

const faqItems = [
  { q: "Qual o tecido mais recomendado para o jaleco masculino de dentista, considerando a rotina de consultório e a necessidade de assepsia?", a: "Gabardine de alta qualidade é excelente. É resistente, fácil de limpar e suporta lavagens frequentes, ideal para manter a higiene em consultórios odontológicos." },
  { q: "Os jalecos para dentistas são projetados para oferecer conforto e liberdade de movimento durante procedimentos delicados?", a: "Sim, nossos jalecos masculinos têm cortes que permitem ampla movimentação dos braços e tronco, essenciais para a precisão dos procedimentos odontológicos." },
  { q: "É possível bordar o CRO (Conselho Regional de Odontologia) e o nome no jaleco de dentista?", a: "Certamente. Oferecemos o serviço de bordado para incluir seu nome e o número de registro do CRO, um padrão de identificação profissional." },
  { q: "Qual a importância dos bolsos nos jalecos de dentistas para a organização de instrumentais?", a: "Nossos jalecos possuem bolsos estrategicamente dimensionados para guardar canetas, sondas periodontais, espelho bucal e outros instrumentos de forma prática e segura." },
  { q: "Como escolher o jaleco ideal para um dentista que trabalha com cirurgias orais frequentes?", a: "Para cirurgias, priorize jalecos com tecidos que permitam fácil desinfecção, boa barreira a fluidos e conforto para longas horas de trabalho, além de mangas que possam ser ajustadas." },
  { q: "Os jalecos brancos são os únicos aceitáveis para dentistas, ou há outras cores que podem ser usadas em consultório?", a: "O branco é o mais tradicional e exigido. No entanto, em algumas clínicas, cores claras e discretas como azul claro ou verde água podem ser permitidas, desde que discretas." },
  { q: "Qual a diferença entre um jaleco com gola tradicional e um com gola padre para dentistas?", a: "A gola tradicional é clássica e formal. A gola padre oferece um visual moderno e limpo, uma questão de preferência pessoal que mantém a profissionalidade." },
  { q: "Há jalecos masculinos com tratamentos antimicrobianos para maior proteção em ambientes odontológicos?", a: "Sim, oferecemos modelos com tecidos que incorporam tecnologia antimicrobiana, que ajuda a inibir o crescimento de bactérias e fungos, elevando o nível de higiene." },
  { q: "O comprimento do jaleco para dentistas influencia na proteção contra respingos?", a: "Um comprimento médio (próximo aos joelhos) é ideal, pois oferece boa proteção contra respingos de fluidos e materiais dentários sem atrapalhar a movimentação." },
  { q: "Qual a política de higienização recomendada para jalecos de dentistas para controle de infecção cruzada?", a: "Recomenda-se lavar separadamente, em alta temperatura (se o tecido permitir), com detergente bactericida. A autoclave é ideal para desinfecção profunda de jalecos específicos." },
  { q: "Existem opções de jalecos para dentistas com tecidos que minimizam o acúmulo de cabelos e pelos?", a: "Sim, alguns de nossos tecidos têm acabamento especial que minimiza a aderência de cabelos e pelos, facilitando a limpeza e manutenção da higiene." },
  { q: "Como garantir a durabilidade do jaleco branco de dentista, evitando que ele desbote ou amarele?", a: "Lave com água fria, sabão neutro, separadamente de outras cores. Evite alvejantes com cloro frequentes e seque à sombra para preservar o branco." },
  { q: "A loja oferece jalecos com fechamento em zíper ou botões de pressão para dentistas?", a: "Sim, dispomos de modelos com fechamento em zíper ou botões de pressão, que são práticos, seguros e ideais para a rotina do dentista, permitindo um fechamento rápido." },
  { q: "Qual a importância do caimento do jaleco para a imagem profissional do dentista?", a: "Um bom caimento transmite profissionalismo e confiança. Nossos jalecos são modelados para vestir bem, valorizando a imagem do dentista no consultório." },
  { q: "Para dentistas que usam lupas ou óculos de proteção, o jaleco deve ter alguma característica especial?", a: "O jaleco deve ter uma gola que não interfira no ajuste da lupa ou óculos. Modelos com gola padre ou mais abertos podem ser mais confortáveis." },
  { q: "Qual a faixa de preço dos jalecos para dentistas e o que justifica modelos mais caros?", a: "Os preços variam de acordo com o tecido, tecnologias (antibacteriano, repelente), design e acabamento. Modelos mais caros oferecem maior durabilidade e conforto." },
  { q: "Os jalecos masculinos são resistentes ao atrito constante com a cadeira odontológica?", a: "Nossos tecidos são escolhidos pela sua resistência à abrasão, garantindo que o jaleco suporte o atrito constante com a cadeira e equipamentos sem desgastar prematuramente." },
  { q: "A loja oferece jalecos com bordado em cores para dentistas que trabalham em clínicas infantis?", a: "Sim, podemos personalizar com bordados coloridos discretos, ideais para clínicas infantis, que ajudam a criar um ambiente mais acolhedor para os pequenos pacientes." },
  { q: "Existe a possibilidade de comprar um jaleco avulso para dentistas, ou são vendidos em kits?", a: "Você pode comprar jalecos avulsos para ter exatamente o que precisa, ou aproveitar nossos kits com desconto para ter múltiplas opções." },
  { q: "Os jalecos de dentista são pré-encolhidos para garantir que o tamanho não mude após a lavagem?", a: "Sim, nossos tecidos são pré-encolhidos para minimizar o encolhimento e garantir que o tamanho e o caimento do jaleco permaneçam consistentes após as lavagens." }
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  const half = Math.ceil(faqItems.length / 2)
  const col1 = faqItems.slice(0, half)
  const col2 = faqItems.slice(half)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12">
      {[col1, col2].map((col, ci) =>
        col.map((item, i) => {
          const idx = ci * half + i
          const isOpen = openIndex === idx
          return (
            <div key={idx} className="border-t border-[#e5e0d8] overflow-hidden">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
              >
                <span className="text-[0.95rem] font-[400] text-[#1a1a1a] leading-snug pr-2">{item.q}</span>
                <span
                  className="w-6 h-6 shrink-0 flex items-center justify-center border border-[#e5e0d8] text-[#6b6b6b] text-base transition-all duration-300"
                  style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    background: isOpen ? '#1a1a1a' : 'transparent',
                    color: isOpen ? '#fff' : '#6b6b6b',
                    borderColor: isOpen ? '#1a1a1a' : '#e5e0d8',
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? '300px' : '0px' }}
              >
                <p className="text-[0.9rem] text-[#6b6b6b] leading-[1.8] pb-5 font-light">{item.a}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
