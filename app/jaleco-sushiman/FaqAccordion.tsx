const faqItems = [
  { q: "Qual a composição do tecido ideal para um jaleco de sushiman?", a: "Nosso jaleco para sushiman é confeccionado em tecido leve e de fácil higienização, essencial para o ambiente de manipulação de alimentos frescos." },
  { q: "O jaleco ajuda a manter a higiene no preparo de sushi?", a: "Sim, ele atua como uma barreira protetora eficaz, minimizando a contaminação cruzada e assegurando a higiene necessária para o preparo de sushi." },
  { q: "O corte do jaleco de sushiman permite movimentos precisos e delicados?", a: "O corte é otimizado para não restringir os movimentos finos e precisos exigidos na arte de fazer sushi, garantindo conforto e agilidade." },
  { q: "Posso bordar o nome do meu restaurante japonês no jaleco?", a: "Com certeza! Personalizamos seu jaleco com o nome do sushiman ou o logo do seu restaurante, fortalecendo a identidade visual e o profissionalismo." },
  { q: "Este jaleco é adequado para um sushibar de alto padrão?", a: "Absolutamente. O design elegante e a qualidade do nosso jaleco complementam a sofisticação de um sushibar de alto padrão, impressionando seus clientes." },
  { q: "Qual a durabilidade de um jaleco Jaleca para sushiman em uso diário?", a: "Nossos jalecos são projetados para suportar o uso diário e lavagens frequentes, mantendo a aparência impecável e a higiene por um longo período." },
  { q: "Como devo lavar o jaleco de sushiman para garantir a máxima higiene?", a: "Lave o jaleco em água fria ou morna com detergente neutro. Evite alvejantes para preservar o tecido, secando em local arejado para manter a frescura." },
  { q: "Há opções de cores de jaleco para sushiman além do branco tradicional?", a: "Sim, além do branco clássico, oferecemos outras cores discretas e elegantes que podem complementar a estética do seu sushibar, mantendo a sobriedade." },
  { q: "Os tamanhos disponíveis para sushiman são abrangentes (PP-G3)?", a: "Sim, nossa linha de tamanhos vai do PP ao G3, garantindo um caimento perfeito e confortável para cada sushiman, independentemente do biotipo." },
  { q: "Os bolsos do jaleco são funcionais para as necessidades de um sushiman?", a: "Os bolsos são discretos e práticos, ideais para guardar um pano de limpeza ou pequenos utensílios, sem comprometer a higiene ou a estética." },
  { q: "O comprimento do jaleco de sushiman é apropriado para a postura de trabalho?", a: "O comprimento foi cuidadosamente balanceado para não atrapalhar a postura curvada ou os movimentos rápidos, essencial para o preparo de sushi." },
  { q: "O jaleco para sushiman está disponível em manga curta ou longa?", a: "Oferecemos opções de manga curta para maior conforto e frescor, ou manga longa para quem prefere proteção adicional, adaptando-se à sua preferência." },
  { q: "O estilo slim do jaleco de sushiman é elegante para um ambiente de alta gastronomia?", a: "Nosso estilo slim confere uma imagem de elegância e profissionalismo, perfeitamente alinhada com a alta gastronomia japonesa e a apresentação impecável." },
  { q: "Os jalecos Jaleca para sushiman oferecem uma qualidade de tecido superior à da concorrência?", a: "Sim, selecionamos tecidos que combinam leveza, resistência e facilidade de higienização, superando os padrões da concorrência para o ambiente alimentar." },
  { q: "Qual o valor inicial de um jaleco para sushiman?", a: "Você pode adquirir um jaleco de alta qualidade para sushiman a partir de R$159, um investimento essencial na sua imagem e higiene profissional." },
  { q: "Qual o prazo de entrega para jalecos de sushiman?", a: "Garantimos a entrega do seu jaleco de sushiman em um prazo de 3 a 8 dias úteis, para que você possa iniciar seu trabalho com estilo e higiene." },
  { q: "Posso trocar o jaleco se ele não atender às minhas expectativas de tamanho ou modelo?", a: "Sim, você tem um prazo de 7 dias após o recebimento para solicitar a troca do seu jaleco, caso precise de outro tamanho ou modelo." },
  { q: "Há frete grátis para pedidos de jalecos de sushiman acima de R$499 em SP/RJ/MG/ES?", a: "Sim, para pedidos de jalecos de sushiman acima de R$499, o frete é grátis para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "O jaleco de sushiman da Jaleca possui garantia?", a: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e a sua satisfação com o produto." },
  { q: "O tecido do jaleco de sushiman é confortável para longas horas de trabalho?", a: "Sim, priorizamos tecidos leves e que proporcionam excelente conforto térmico, ideal para longas jornadas de trabalho em cozinhas e balcões de sushibar." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para sushiman
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
