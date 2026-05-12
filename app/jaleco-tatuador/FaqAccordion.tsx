const faqItems = [
  { q: "O tecido do jaleco para tatuador é resistente a tintas de tatuagem?", a: "Sim, nosso tecido é especialmente tratado para ser resistente a tintas de tatuagem, minimizando manchas e facilitando a limpeza pós-sessão." },
  { q: "O jaleco oferece proteção contra respingos de sangue ou outros fluidos corporais?", a: "Ele atua como uma barreira protetora eficaz, minimizando o contato com fluidos corporais e contribuindo para um ambiente de trabalho mais higiênico e seguro." },
  { q: "O corte do jaleco para tatuador permite liberdade de movimento e precisão?", a: "Com um corte inteligente, o jaleco garante liberdade total para seus braços e corpo, essencial para a precisão e detalhes minuciosos de uma tatuagem." },
  { q: "Posso bordar meu nome artístico ou o logo do meu estúdio de tatuagem no jaleco?", a: "Absolutamente! Personalize seu jaleco com seu nome artístico ou o logo do seu estúdio, reforçando sua marca e estilo único como tatuador." },
  { q: "Este jaleco é apropriado para o ambiente de um estúdio de tatuagem profissional?", a: "Sim, ele é desenhado para atender às exigências de higiene e estilo de um estúdio de tatuagem profissional, garantindo uma imagem impecável." },
  { q: "Qual a durabilidade de um jaleco Jaleca para tatuadores em um estúdio movimentado?", a: "Nossos jalecos são feitos para durar, resistindo ao uso intenso, lavagens frequentes e aos desafios de um estúdio de tatuagem com grande fluxo de clientes." },
  { q: "Qual a melhor forma de lavar o jaleco para remover manchas de tinta?", a: "Recomendamos pré-tratar as manchas de tinta e seguir as instruções da etiqueta para uma lavagem eficiente, preservando o tecido e a cor do seu jaleco." },
  { q: "Que opções de cores de jaleco estão disponíveis para tatuadores?", a: "Oferecemos uma seleção de cores que vão do clássico preto ao cinza, cores que combinam com o estilo moderno e arrojado do universo da tatuagem." },
  { q: "Os tamanhos de jaleco para tatuador abrangem do PP ao G3?", a: "Sim, nossa grade de tamanhos, do PP ao G3, garante que todos os tatuadores encontrem um jaleco com o ajuste perfeito para máximo conforto e estilo." },
  { q: "Os bolsos do jaleco são úteis para guardar equipamentos pequenos de tatuagem?", a: "Nossos bolsos são projetados para serem práticos e discretos, ideais para guardar luvas, biqueiras descartáveis ou outros pequenos acessórios de forma organizada." },
  { q: "O comprimento do jaleco para tatuador interfere na postura durante a tatuagem?", a: "O comprimento é cuidadosamente ajustado para não restringir sua postura ou movimentos, permitindo que você se concentre totalmente na arte sem desconforto." },
  { q: "Posso escolher entre manga curta ou longa para o jaleco de tatuador?", a: "Sim, oferecemos opções de manga curta para maior ventilação e manga longa para proteção extra, adaptando-se à sua preferência pessoal e ao clima." },
  { q: "O estilo slim do jaleco de tatuador é moderno e profissional?", a: "Nosso estilo slim é sinônimo de modernidade e profissionalismo, proporcionando um visual contemporâneo que complementa a estética de um estúdio de tatuagem atual." },
  { q: "Os jalecos Jaleca para tatuadores são mais duráveis e resistentes a tintas que os da concorrência?", a: "Sim, nossa escolha de tecidos e tratamentos confere aos nossos jalecos uma resistência superior a tintas e maior durabilidade em comparação com outros no mercado." },
  { q: "Qual o preço de partida para um jaleco profissional para tatuador?", a: "Nossos jalecos de alta qualidade para tatuadores estão disponíveis a partir de R$159, um investimento essencial em imagem, higiene e proteção para sua arte." },
  { q: "Qual o prazo de entrega para jalecos de tatuador?", a: "Garantimos a entrega do seu jaleco de tatuador em um prazo de 3 a 8 dias úteis, para que você possa elevar o nível do seu estúdio rapidamente." },
  { q: "Se o tamanho estiver incorreto, posso trocar o jaleco de tatuador?", a: "Sim, você tem até 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou o ajuste não sejam perfeitos." },
  { q: "O frete é grátis para pedidos de jalecos de tatuador acima de R$499 em SP/RJ/MG/ES?", a: "Sim, para pedidos de jalecos de tatuador acima de R$499, o frete é grátis para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "Os jalecos para tatuador possuem garantia?", a: "Todos os jalecos da Jaleca contam com garantia contra defeitos de fabricação, assegurando a qualidade e sua total confiança na compra." },
  { q: "O tecido do jaleco para tatuador é confortável para sessões longas?", a: "Priorizamos tecidos que oferecem conforto térmico e respirabilidade, mantendo você confortável e focado durante longas e intensas sessões de tatuagem." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para tatuador
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
