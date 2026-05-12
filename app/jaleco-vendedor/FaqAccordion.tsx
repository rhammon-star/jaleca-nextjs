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
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para vendedor
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
