const faqItems = [
  { q: "Secretária precisa usar jaleco?", a: "Em clínicas, consultórios e farmácias, o jaleco padroniza a equipe e transmite higiene. Não é obrigatório por lei, mas é padrão de mercado." },
  { q: "Qual cor para recepção de clínica?", a: "Branco harmoniza com a equipe médica; rosé, azul-marinho ou preto são opções modernas para recepção." },
  { q: "Qual tecido é mais confortável para ficar sentada?", a: "Microfibra com elastano não repuxa ao sentar e mantém caimento o dia todo." },
  { q: "Posso bordar nome e função?", a: "Sim. Bordamos nome + função (Secretária, Recepcionista) gratuitamente." },
  { q: "Qual o melhor corte?", a: "Acinturado feminino com pences valoriza a silhueta em ambiente sentado." },
  { q: "Manga 3/4 ou longa?", a: "3/4 é a mais usada por secretárias — facilita digitação e atendimento sem repuxar." },
  { q: "Atende plus size?", a: "Sim, do PP ao GG3 feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias após recebimento, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim." },
  { q: "Tem desconto para clínica com várias recepcionistas?", a: "Sim, a partir de 5 peças com bordado padronizado." },
  { q: "O jaleco amassa ao ficar sentada o dia todo?", a: "Microfibra praticamente não amassa, mesmo após 8h sentada." },
  { q: "Combina com calça jeans e tênis?", a: "Combina. O caimento moderno permite looks casuais ou formais." },
  { q: "Tem bolsos para celular?", a: "Sim, bolso superior + dois inferiores amplos." },
  { q: "Faz personalização com logo da clínica?", a: "Sim. Bordamos logo + nome de cada secretária." },
  { q: "Tem versão curta, tipo blazer?", a: "Sim. O modelo de comprimento curto fica parecido com blazer profissional — ótimo para recepcionistas." },
  { q: "Como lavar para preservar a cor?", a: "Máquina, água até 40 °C, separado de cores. Sem cloro para brancos." },
  { q: "O jaleco serve para secretária de escritório (não clínica)?", a: "Pode servir, especialmente em ambientes corporativos que adotam uniforme. Cores escuras (preto, marinho) são mais comuns aí." },
  { q: "Qual a diferença entre jaleco secretária e enfermeira?", a: "O corte pode ser igual; muda o bordado (função vs COREN) e a preferência de cor (recepção tende a cores mais variadas)." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para secretária
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
