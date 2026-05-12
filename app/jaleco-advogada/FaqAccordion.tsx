const faqItems = [
  { q: "Advogada pode usar jaleco no exercício profissional?", a: "Pode, em contextos técnicos (perícia, visita hospitalar, advocacia em saúde). Em audiências, o código de ética da OAB exige traje social." },
  { q: "Qual a melhor cor para advogada?", a: "Branco em ambiente hospitalar; preto e azul-marinho para escritórios formais ou perícias." },
  { q: "Tem modelo acinturado feminino?", a: "Sim. Modelagem feminina com pences valoriza a silhueta e mantém formalidade." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano: leve, não amassa e mantém o caimento formal." },
  { q: "Posso bordar OAB e nome?", a: "Sim. Bordamos nome + OAB + seccional sem custo." },
  { q: "Qual comprimento favorece o look formal?", a: "Meio da coxa é o mais versátil — combina com calça social, saia lápis ou vestido." },
  { q: "Manga longa ou 3/4?", a: "Longa transmite mais formalidade. 3/4 é alternativa elegante para climas quentes." },
  { q: "Atende plus size?", a: "Sim, do PP ao GG3 com modelagem que respeita o corpo feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome + OAB grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar o tamanho?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, para todo o território nacional." },
  { q: "Tem desconto para escritório?", a: "Sim, a partir de 5 peças há desconto progressivo." },
  { q: "Combina com salto e calça social?", a: "Sim. O caimento foi pensado para harmonizar com look social profissional." },
  { q: "O jaleco amarrota?", a: "Microfibra praticamente não amarrota — chega pronto para vestir." },
  { q: "Faz personalização com logo do escritório?", a: "Sim. Bordamos logo + nome individual da advogada." },
  { q: "Tem gola V ou gola padre?", a: "Os dois modelos. Gola padre transmite mais formalidade; gola V é mais moderna." },
  { q: "Posso usar em audiência?", a: "Não. Audiência exige traje social. Use o jaleco em perícia, diligência e advocacia em saúde." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, separado de cores. Dispensa ferro." },
  { q: "Qual a diferença entre jaleco advogada e médica?", a: "O corte pode ser igual; muda o bordado (OAB vs CRM) e geralmente a escolha por tecidos mais formais e cores escuras." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para advogada
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
