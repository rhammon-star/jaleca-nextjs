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
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para massagista
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
