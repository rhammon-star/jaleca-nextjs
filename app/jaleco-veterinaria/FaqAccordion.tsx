const faqItems = [
  { q: "Médica veterinária pode usar jaleco feminino acinturado?", a: "Sim. O modelo acinturado é totalmente profissional e oferece caimento mais elegante, sem perder funcionalidade clínica." },
  { q: "Qual a cor preferida das veterinárias?", a: "Branco lidera, seguido de rosé e azul-marinho — cores que combinam com a rotina entre consultório e clínica." },
  { q: "Qual tecido é mais confortável para veterinária?", a: "Microfibra com 5% de elastano oferece elasticidade para se abaixar, agachar e atender pets sem repuxar." },
  { q: "É possível bordar CRMV e nome?", a: "Sim. Bordamos nome, profissão e CRMV no peito esquerdo sem custo extra." },
  { q: "O modelo feminino tem pences?", a: "Sim. Pences na frente e costas dão caimento ajustado à silhueta, sem apertar." },
  { q: "Qual o comprimento ideal?", a: "Comprimento até o meio da coxa é o mais escolhido — protege e mantém elegância." },
  { q: "Tem manga 3/4 para veterinária?", a: "Sim, manga 3/4 e manga longa estão disponíveis. A 3/4 facilita lavagem das mãos entre atendimentos." },
  { q: "Atende tamanhos plus size?", a: "Sim. Linha feminina vai do PP ao GG3, com modelagem que respeita o corpo plus." },
  { q: "O jaleco resiste a pelos de animais?", a: "Microfibra solta menos pelo do que algodão puro — basta passar rolinho ou lavar normalmente." },
  { q: "Como lavar para preservar a cor branca?", a: "Lave separado, água até 40 °C, sem cloro. Use alvejante sem cloro ocasionalmente para manter o branco." },
  { q: "Quanto custa um jaleco feminino veterinário?", a: "A partir de R$ 119,90, com bordado de nome + CRMV gratuito." },
  { q: "Qual o prazo de entrega com bordado?", a: "Entre 5 e 10 dias úteis após confirmação do pagamento." },
  { q: "Posso devolver se não servir?", a: "Sim, dentro de 7 dias após o recebimento, desde que o jaleco esteja sem uso e sem bordado." },
  { q: "Tem frete grátis?", a: "Sim, em compras acima do valor mínimo. Confira na página do produto." },
  { q: "Vocês fazem uniforme para clínicas inteiras?", a: "Sim. Atendemos clínicas com personalização padronizada — logo, cor e bordado uniforme para toda a equipe." },
  { q: "Modelagem repuxa quando me abaixo para atender o pet?", a: "Não. O elastano dá elasticidade e as pences acomodam o movimento de agachar." },
  { q: "Existe versão com decote V?", a: "Sim, alguns modelos femininos têm gola V; outros têm gola de padre tradicional." },
  { q: "O jaleco serve para consulta domiciliar?", a: "Sim, é leve, dobra fácil e cabe em bolsa para visitas domiciliares." },
  { q: "Qual diferença entre jaleco veterinária e enfermeira?", a: "O corte é semelhante; a diferença está no tipo de bordado (CRMV vs COREN) e no perfil de tecido escolhido." },
  { q: "Como tirar manchas de iodo do jaleco?", a: "Aplique água oxigenada 10 volumes na mancha fresca antes da lavagem; evite cloro, que amarela o tecido." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para veterinária
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
