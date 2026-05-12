const faqItems = [
  { q: "Professor precisa de jaleco?", a: "Em laboratórios de química, biologia e física, sim — por norma de segurança. Em sala comum, é opcional e usado por identidade profissional." },
  { q: "Qual cor para laboratório?", a: "Branco é praticamente padrão em laboratórios de ciências, por permitir identificar respingos de reagentes rapidamente." },
  { q: "Qual tecido aguenta laboratório?", a: "Microfibra com tratamento antichama leve ou algodão denso. Evite tecidos finos demais para ambiente de bancada." },
  { q: "Posso bordar nome e instituição?", a: "Sim. Bordamos nome do professor + instituição/disciplina gratuitamente." },
  { q: "Qual corte é mais usado?", a: "Corte reto masculino, manga longa, comprimento meio da coxa — padrão laboratorial." },
  { q: "Manga longa é obrigatória em laboratório?", a: "Sim. Manga longa protege braços de respingos de reagentes — regra de segurança em quase toda universidade." },
  { q: "Tem plus size?", a: "Sim, do P ao GG3 masculino e PP ao GG3 feminino." },
  { q: "Quanto custa?", a: "A partir de R$ 119,90, com bordado de nome grátis." },
  { q: "Prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado: 5 a 10 dias úteis." },
  { q: "Posso trocar tamanho?", a: "Sim, em até 7 dias, sem uso e sem bordado." },
  { q: "Frete para todo Brasil?", a: "Sim, atendemos todo o território nacional." },
  { q: "Tem desconto para escola/universidade?", a: "Sim, a partir de 5 peças. Bordado padronizado para corpo docente disponível." },
  { q: "O jaleco serve para professor de educação física?", a: "Geralmente não — professor de educação física usa uniforme esportivo. O jaleco é mais usado por professores de exatas e biológicas." },
  { q: "Resiste a respingos químicos?", a: "Resiste a respingos leves; para reagentes corrosivos é necessário EPI específico além do jaleco." },
  { q: "Tem bolsos para canetas e calculadora?", a: "Sim: bolso superior + dois inferiores." },
  { q: "Como lavar manchas de tinta de quadro?", a: "Aplique álcool isopropílico na mancha fresca, esfregue suavemente e lave normalmente." },
  { q: "Posso usar fora do laboratório, em sala?", a: "Sim. Muitos professores universitários adotam jaleco como identidade profissional em sala de aula." },
  { q: "O jaleco amassa?", a: "Microfibra praticamente não amassa, mesmo entre aulas e deslocamentos." },
  { q: "Tem versão feminina?", a: "Sim, com modelagem acinturada feminina específica." },
  { q: "Qual a diferença entre jaleco professor e médico?", a: "Funcionalmente idênticos; muda o bordado (instituição/disciplina vs CRM) e às vezes o tecido conforme uso laboratorial." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para professor
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
