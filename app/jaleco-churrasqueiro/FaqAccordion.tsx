const faqItems = [
  { q: "O tecido do jaleco Jaleca para churrasqueiro é resistente ao calor?", a: "Nosso jaleco para churrasqueiro é feito com tecido robusto e resistente a altas temperaturas, oferecendo proteção extra contra o calor da brasa." },
  { q: "Este jaleco oferece proteção contra respingos de gordura e molhos?", a: "Com certeza! O tecido do nosso jaleco possui um tratamento que repele respingos de gordura e molhos, facilitando a limpeza e protegendo suas roupas." },
  { q: "O corte do jaleco de churrasqueiro permite movimentos amplos ao manusear a carne?", a: "O corte é especialmente desenhado para garantir total liberdade de movimento, essencial para virar a carne, cortar e manusear os utensílios com conforto e segurança." },
  { q: "É possível bordar o meu nome ou o logo do meu negócio de churrasco no jaleco?", a: "Sim, personalizamos seu jaleco com bordado do seu nome ou o logo da sua churrascaria, agregando profissionalismo e estilo à sua marca." },
  { q: "O jaleco Jaleca é adequado para um ambiente de churrascaria profissional?", a: "Perfeitamente! Nosso jaleco foi pensado para o ambiente exigente de uma churrascaria, unindo proteção, durabilidade e um visual imponente." },
  { q: "Qual a durabilidade de um jaleco de churrasqueiro da Jaleca?", a: "Projetamos nossos jalecos para churrasqueiros para serem extremamente duráveis, resistindo ao uso constante e às condições do ambiente da churrasqueira." },
  { q: "Quais são as melhores práticas de lavagem para o jaleco de churrasqueiro?", a: "Para remover gordura e odores, recomendamos lavagem com água quente e sabão desengordurante, seguindo as instruções da etiqueta para manter a qualidade." },
  { q: "Quais cores de jaleco estão disponíveis para churrasqueiros?", a: "Oferecemos cores que disfarçam melhor as manchas e realçam a sua presença, como tons terrosos e escuros, ideais para o churrasqueiro." },
  { q: "Vocês possuem tamanhos grandes para churrasqueiros, como G3?", a: "Sim, nossa grade de tamanhos vai do PP ao G3, garantindo que todo churrasqueiro encontre um jaleco que vista perfeitamente e com conforto." },
  { q: "O jaleco tem bolsos funcionais para utensílios de churrasco?", a: "Nossos jalecos possuem bolsos robustos e acessíveis, perfeitos para guardar termômetro de carne, pegador pequeno ou isqueiro, sempre à mão." },
  { q: "O comprimento do jaleco é ideal para proteger a parte superior das pernas?", a: "Sim, o comprimento é cuidadosamente projetado para oferecer proteção estendida, cobrindo a parte superior das pernas contra respingos e calor." },
  { q: "O jaleco de churrasqueiro possui opções de manga para diferentes necessidades?", a: "Disponibilizamos jalecos com manga longa para máxima proteção ou manga curta para maior conforto em climas quentes, adaptando-se ao seu estilo." },
  { q: "O estilo profissional do jaleco realça a imagem do churrasqueiro?", a: "Com um design imponente e profissional, nosso jaleco eleva a imagem do churrasqueiro, transmitindo paixão e maestria pela arte da brasa." },
  { q: "Os jalecos Jaleca para churrasqueiros são mais resistentes a fogo e chamas do que os concorrentes?", a: "Utilizamos tecidos com maior gramatura e tratamento que confere uma resistência superior a chamas e faíscas comparado a outros no mercado." },
  { q: "Qual o investimento inicial para um jaleco de churrasqueiro de alta performance?", a: "Nossos jalecos de churrasqueiro começam a partir de R$159, um valor que reflete a qualidade e a segurança que você merece ao lado da brasa." },
  { q: "Qual o prazo de entrega para meu jaleco de churrasqueiro?", a: "Seu jaleco chegará em suas mãos com rapidez, em um prazo de 3 a 8 dias úteis, para que você possa brilhar na sua próxima churrascada." },
  { q: "É possível realizar a troca do jaleco se ele não servir bem?", a: "Sim, você tem até 7 dias para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não sejam os ideais para você." },
  { q: "O frete é grátis para pedidos de jalecos de churrasqueiro acima de R$499 em alguns estados?", a: "Sim, oferecemos frete grátis para compras acima de R$499 nos estados de SP, RJ, MG e ES, uma comodidade para os amantes do churrasco." },
  { q: "O jaleco de churrasqueiro possui garantia de fabricação?", a: "Todos os nossos jalecos vêm com garantia contra defeitos de fabricação, assegurando que você receba um produto de alta qualidade." },
  { q: "O tecido do jaleco para churrasqueiro ajuda a diminuir odores de fumaça?", a: "Embora não elimine odores completamente, o tecido de alta densidade e de fácil limpeza ajuda a minimizar a impregnação de fumaça, facilitando a higiene." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para churrasqueiro
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
