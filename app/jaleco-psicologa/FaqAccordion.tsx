const faqItems = [
  { q: "Psicóloga precisa usar jaleco no consultório?", a: "Não é obrigatório pelo CRP, mas muitas profissionais escolhem usar para reforçar identidade profissional, especialmente em clínicas multidisciplinares." },
  { q: "Qual cor de jaleco é mais usada por psicólogas?", a: "Branco e rosé são os mais procurados; preto e azul-marinho também aparecem em consultórios mais sóbrios." },
  { q: "Qual tecido é mais agradável para atendimento sentado?", a: "Microfibra com elastano é leve, não amassa fácil e mantém o caimento durante sessões longas sentadas." },
  { q: "Posso bordar CRP e nome?", a: "Sim. Bordamos nome completo + CRP no peito esquerdo, sem custo adicional." },
  { q: "Qual o melhor corte para psicóloga?", a: "Acinturado com pences — transmite cuidado e profissionalismo sem o ar excessivamente clínico do jaleco médico." },
  { q: "Manga longa ou 3/4 para consultório?", a: "Manga longa transmite mais formalidade; 3/4 é mais leve no verão. As duas funcionam no consultório de psicologia." },
  { q: "Qual comprimento favorece?", a: "Comprimento no meio da coxa harmoniza com calça social, jeans ou vestido — o mais versátil." },
  { q: "Tem jaleco preto para psicóloga?", a: "Sim. O preto é especialmente procurado por psicólogas que querem um ar mais sóbrio e moderno." },
  { q: "Atende plus size?", a: "Sim. Modelagem feminina vai do PP ao GG3, com ajuste real para corpos curvilíneos." },
  { q: "Quanto custa o jaleco para psicóloga?", a: "A partir de R$ 119,90 com bordado de nome + CRP grátis." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar se a numeração não servir?", a: "Sim, em até 7 dias após o recebimento, sem uso e sem bordado personalizado." },
  { q: "Frete grátis para todo Brasil?", a: "Frete grátis acima do valor mínimo da loja. Confira no checkout." },
  { q: "O jaleco amarrota muito?", a: "Microfibra praticamente não amarrota — sai da máquina pronta para vestir." },
  { q: "Posso passar a ferro?", a: "Pode, em temperatura média. Mas o tecido geralmente dispensa ferro." },
  { q: "Tem modelo curto, tipo blazer?", a: "Sim. Temos modelo de comprimento curto que se parece com blazer profissional — muito usado por psicólogas em consultórios modernos." },
  { q: "Combina com calça social e tênis?", a: "Combina perfeitamente. O caimento moderno permite looks formais ou casuais." },
  { q: "Faz personalização para clínicas de psicologia?", a: "Sim. Personalizamos com logo da clínica + nome de cada profissional, com desconto a partir de 5 peças." },
  { q: "Qual a diferença entre jaleco psicóloga e médica?", a: "Visualmente o corte é semelhante; psicólogas costumam preferir cores e cortes mais modernos e menos hospitalares." },
  { q: "Posso usar em atendimento online?", a: "Sim. Muitas psicólogas usam jaleco em sessões online para reforçar identidade profissional na câmera." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para psicóloga
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
