const faqItems = [
  { q: "Qual tecido é mais indicado para o primeiro jaleco universitário?", a: "Para o primeiro jaleco universitário, indicamos tecidos de gabardine ou microfibra, que são resistentes, fáceis de cuidar e têm excelente caimento." },
  { q: "Este jaleco é adequado para estudantes de medicina e odontologia?", a: "Sim, nossos jalecos são ideais para futuros médicos e dentistas, cumprindo as exigências de higiene e apresentando um visual profissional para a faculdade." },
  { q: "Como o corte do jaleco universitário se adapta à rotina de estudos e estágios?", a: "Nosso corte é pensado para oferecer conforto e mobilidade, essencial para as longas horas de estudo e os estágios práticos na universidade." },
  { q: "Posso bordar meu nome e a identificação do curso no jaleco?", a: "Com certeza! Oferecemos bordado personalizado com seu nome e o símbolo ou nome do seu curso (Medicina, Odonto, Enfermagem, Farmácia), um toque essencial para o seu primeiro jaleco." },
  { q: "O jaleco Jaleca é uma boa escolha para meu primeiro contato com o ambiente clínico?", a: "É a escolha perfeita! Nossos jalecos garantem uma imagem profissional e asseio desde o seu primeiro dia no ambiente clínico, elevando sua confiança." },
  { q: "Qual a durabilidade de um jaleco universitário, considerando o uso frequente?", a: "Nossos jalecos são projetados para alta durabilidade, resistindo ao uso diário e às frequentes lavagens necessárias na vida universitária." },
  { q: "Como devo lavar o jaleco para mantê-lo branco e sem manchas?", a: "Recomendamos lavagem com água fria e sabão neutro, separadamente de outras roupas. Para manter o branco, use alvejante sem cloro e seque à sombra." },
  { q: "Este jaleco cumpre as regulamentações de uso em hospitais e clínicas?", a: "Sim, nossos jalecos são desenvolvidos seguindo as normas e padrões de higiene e vestuário exigidos para o uso em ambientes de saúde, como hospitais e clínicas." },
  { q: "Os tamanhos de jaleco universitário abrangem do PP ao G3?", a: "Nossa grade de tamanhos, do PP ao G3, garante que todo estudante encontre um jaleco com o ajuste ideal, proporcionando conforto e uma aparência alinhada." },
  { q: "Os bolsos do jaleco são funcionais para guardar canetas e outros itens de estudo?", a: "Sim, os bolsos são projetados para serem práticos e espaçosos, ideais para guardar canetas, cadernetas e outros pequenos acessórios essenciais para os estudos." },
  { q: "O comprimento do jaleco é adequado para futuros profissionais da saúde?", a: "O comprimento é cuidadosamente balanceado para conferir autoridade e proteção, sem atrapalhar a mobilidade necessária para procedimentos e exames." },
  { q: "O jaleco universitário está disponível em manga longa ou curta?", a: "Oferecemos opções de manga longa, padrão para a maioria das áreas da saúde, garantindo proteção e conformidade com as exigências acadêmicas e profissionais." },
  { q: "O estilo slim do jaleco universitário transmite profissionalismo?", a: "Nosso estilo slim confere uma imagem moderna e profissional, preparando você para a transição do ambiente acadêmico para o mercado de trabalho." },
  { q: "Os jalecos Jaleca são mais duráveis e representativos do que os de outras marcas para estudantes?", a: "Sim, a qualidade superior de nossos tecidos e acabamento garante um jaleco mais resistente e com melhor apresentação, destacando você da concorrência universitária." },
  { q: "A partir de qual preço consigo adquirir um jaleco universitário de qualidade?", a: "Nossos jalecos universitários de alta qualidade começam a partir de R$159, um investimento essencial para sua jornada acadêmica e profissional." },
  { q: "Qual o prazo de entrega para jalecos universitários?", a: "Seu jaleco será entregue em 3 a 8 dias úteis, para que você possa começar seus estudos e estágios com o equipamento certo e no tempo adequado." },
  { q: "Posso trocar o jaleco se o tamanho não estiver correto para minhas aulas?", a: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não sejam os ideais para seu conforto nos estudos." },
  { q: "Há frete grátis para compras de jalecos universitários acima de R$499 em SP/RJ/MG/ES?", a: "Sim, para pedidos de jalecos universitários acima de R$499, o frete é grátis para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "Os jalecos universitários possuem garantia?", a: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e sua total confiança na sua compra acadêmica." },
  { q: "O jaleco é adequado para a cerimônia de formatura?", a: "Absolutamente! Nossos jalecos são elegantes e de alta qualidade, ideais para serem usados na sua cerimônia de formatura, marcando sua transição para a vida profissional." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco universitário
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
