const faqItems = [
  { q: "Pastor pode usar jaleco?", a: "Pode, especialmente em hospitais (capelania), visitação a doentes e contextos onde o pastor atua junto a equipes médicas." },
  { q: "Qual cor é mais apropriada?", a: "Branco para capelania hospitalar; preto para pastoreio formal em algumas denominações." },
  { q: "Qual tecido escolher?", a: "Microfibra com elastano: leve, formal, não amassa em visitas longas." },
  { q: "Posso bordar nome e função (Pastor / Capelão)?", a: "Sim. Bordamos nome + função (Pastor, Capelão Hospitalar, Reverendo) gratuitamente." },
  { q: "Qual corte transmite mais sobriedade?", a: "Corte reto masculino tradicional, gola padre, comprimento meio da coxa." },
  { q: "Manga longa ou curta?", a: "Longa para capelania hospitalar (protocolo). Curta para visitas em climas muito quentes." },
  { q: "Tem plus size?", a: "Sim, do P ao GG3." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias, sem uso e sem bordado." },
  { q: "Envia para todo o Brasil?", a: "Sim, atendemos todo o território nacional." },
  { q: "Tem desconto para igreja com vários pastores?", a: "Sim, a partir de 5 peças. Bordado padronizado disponível." },
  { q: "O jaleco serve para evangelismo em hospital?", a: "Sim — o jaleco facilita acesso a UTIs e quartos hospitalares onde se exige aparência profissional." },
  { q: "Combina com camisa social por baixo?", a: "Combina. A maioria dos pastores usa camisa social + jaleco em capelania." },
  { q: "Tem bolsos para Bíblia pequena?", a: "Sim, bolsos amplos suportam Bíblia de bolso, celular e caneta." },
  { q: "O jaleco amassa em visitas longas?", a: "Microfibra mantém o caimento mesmo em dias longos de visita." },
  { q: "Faz personalização com logo da igreja?", a: "Sim. Bordamos logo da igreja + nome do pastor." },
  { q: "Posso usar em culto?", a: "Tradicionalmente o jaleco é para capelania e visitação, não para culto, mas algumas denominações adotam jaleco preto curto em culto." },
  { q: "Como lavar?", a: "Máquina, água até 40 °C, separado de cores. Dispensa ferro." },
  { q: "Qual a diferença entre jaleco pastor e médico?", a: "Visualmente similares; muda o bordado (função pastoral vs CRM). Pastores costumam preferir tecidos formais." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para pastor
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
