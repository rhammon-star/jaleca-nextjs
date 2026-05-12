const faqItems = [
  { q: "Qual tecido o jaleco Jaleca para barbeiro utiliza?", a: "Nossos jalecos para barbeiros são confeccionados em tecido tecnológico, resistente a pelos, descolorantes e produtos químicos para garantir sua durabilidade." },
  { q: "Este jaleco oferece proteção contra manchas de tintura?", a: "Sim, o tecido especial dos nossos jalecos repele a maioria das manchas de tintura e outros produtos químicos comuns em barbearias, facilitando a limpeza." },
  { q: "Como o corte do jaleco influencia no trabalho do barbeiro?", a: "Nosso corte é pensado para oferecer total liberdade de movimento, essencial para a precisão e agilidade que um barbeiro precisa em seu dia a dia." },
  { q: "É possível bordar o meu nome ou o logo da minha barbearia no jaleco?", a: "Com certeza! Oferecemos serviço de bordado personalizado para incluir seu nome, função ou o logo da sua barbearia, reforçando sua marca." },
  { q: "Este jaleco é adequado para uso em uma barbearia com alta demanda?", a: "Desenvolvido para o ambiente dinâmico da barbearia, nosso jaleco suporta a rotina intensa, mantendo a boa aparência e proteção por mais tempo." },
  { q: "Qual a durabilidade esperada para um jaleco de barbeiro Jaleca?", a: "Nossos jalecos são feitos para serem altamente duráveis, resistindo a múltiplas lavagens e ao desgaste diário, um investimento que vale a pena." },
  { q: "Quais as instruções de lavagem para manter a qualidade do tecido?", a: "Recomendamos seguir as instruções na etiqueta para uma lavagem adequada, preservando as propriedades do tecido e a vivacidade da cor do seu jaleco." },
  { q: "Que cores de jaleco estão disponíveis para barbeiros?", a: "Disponibilizamos diversas opções de cores que combinam com o estilo moderno das barbearias, permitindo que você escolha o que melhor representa seu ambiente." },
  { q: "Os tamanhos de jaleco para barbeiro vão do PP ao G3?", a: "Sim, nossa grade de tamanhos abrange do PP ao G3, garantindo um ajuste perfeito e confortável para todos os biotipos de barbeiros." },
  { q: "Os jalecos têm bolsos práticos para tesouras e pentes?", a: "Nossos jalecos são projetados com bolsos funcionais e bem distribuídos, ideais para armazenar suas ferramentas essenciais de trabalho com segurança e acesso rápido." },
  { q: "O comprimento do jaleco atrapalha o movimento na cadeira?", a: "O comprimento é cuidadosamente balanceado para não atrapalhar o movimento ao redor da cadeira, combinando proteção e praticidade." },
  { q: "O jaleco para barbeiro possui manga curta ou longa?", a: "Temos opções de manga curta e longa para o jaleco de barbeiro, permitindo escolher a que melhor se adapta ao seu conforto e necessidade." },
  { q: "O estilo slim do jaleco é confortável para o dia todo?", a: "Nosso estilo slim é desenhado para ser elegante e confortável, proporcionando uma silhueta profissional sem restringir seus movimentos durante todo o dia." },
  { q: "Os jalecos Jaleca para barbeiros são mais resistentes a descolorantes do que os da concorrência?", a: "Sim, utilizamos tecnologias de tecido superiores que oferecem maior resistência a descolorantes e manchas, superando a maioria dos produtos no mercado." },
  { q: "A partir de qual preço consigo adquirir um jaleco para barbeiro?", a: "Você pode adquirir seu jaleco profissional para barbeiro a partir de R$159, um investimento acessível em qualidade e imagem para sua carreira." },
  { q: "Qual o prazo de entrega para jalecos de barbeiro da Jaleca?", a: "O prazo de entrega para nossos jalecos é de 3 a 8 dias úteis, garantindo que você receba seu pedido com rapidez e eficiência." },
  { q: "Posso realizar a troca do jaleco se o tamanho não for o ideal?", a: "Sim, oferecemos 7 dias para troca a partir do recebimento, caso o tamanho ou modelo não atendam às suas expectativas." },
  { q: "O frete é grátis para barbeiros em SP/RJ/MG/ES?", a: "Sim, o frete é grátis para pedidos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "Os jalecos para barbeiro possuem garantia?", a: "Nossos produtos possuem garantia contra defeitos de fabricação, assegurando a qualidade e sua satisfação com a compra." },
  { q: "O tecido do jaleco para barbeiro amassa com facilidade?", a: "Escolhemos tecidos que minimizam o amassado, garantindo que você mantenha uma aparência impecável e profissional durante todo o expediente." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para barbeiro
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
