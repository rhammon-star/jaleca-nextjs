const faqItems = [
  { q: "Advogado usa jaleco?", a: "É raro, mas advogados de empresas de saúde, perícia médica e direito veterinário às vezes usam jaleco em visitas técnicas a clínicas e hospitais." },
  { q: "OAB exige jaleco em algum momento?", a: "Não. A OAB exige terno e gravata em audiências, mas jaleco pode ser usado em contextos técnicos específicos (perícia, ambiente hospitalar)." },
  { q: "Qual a melhor cor de jaleco para advogado?", a: "Branco para ambiente hospitalar; preto ou azul-marinho para escritórios de perícia que querem ar mais formal." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano é leve, formal e não amassa entre reuniões e diligências." },
  { q: "Posso bordar OAB e nome?", a: "Sim. Bordamos nome + número da OAB e seccional gratuitamente." },
  { q: "Qual corte transmite mais formalidade?", a: "Corte reto masculino tradicional, comprimento meio da coxa, gola padre — equivalente ao blazer." },
  { q: "Manga longa ou curta?", a: "Manga longa é praticamente regra para advogado — transmite formalidade." },
  { q: "Tem tamanho plus size?", a: "Sim. Modelos masculinos vão do P ao GG3." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome + OAB grátis." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, Correios e transportadoras cobrem todo o território nacional." },
  { q: "Tem desconto para escritório de advocacia?", a: "Sim, a partir de 5 peças com personalização padronizada." },
  { q: "Posso usar em audiência?", a: "Não recomendado. Audiência exige terno e gravata. O jaleco serve para perícia, diligência hospitalar e contextos técnicos." },
  { q: "Tem bolsos para celular e caneta?", a: "Sim, bolso superior + dois inferiores amplos." },
  { q: "O jaleco amassa em viagem?", a: "Microfibra praticamente não amassa — ideal para advogados que viajam para diligências." },
  { q: "Faz personalização com logo do escritório?", a: "Sim. Bordamos logo do escritório + nome de cada advogado." },
  { q: "Combina com terno por baixo?", a: "Combina. Muitos advogados usam o jaleco por cima da camisa social, retirando o paletó." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, sem cloro. Microfibra dispensa ferro." },
  { q: "O jaleco encolhe?", a: "Não, tecidos são pré-encolhidos." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para advogado
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
        {faqItems.map((item, i) => (
          <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
            <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              {item.q}
              <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
            </summary>
            <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
