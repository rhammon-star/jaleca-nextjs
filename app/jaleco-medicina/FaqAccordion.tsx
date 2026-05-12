const faqItems = [
  { q: "Qual o modelo de jaleco mais recomendado para estudantes de medicina no início da faculdade?", a: "Para iniciantes, um jaleco branco tradicional, de bom caimento e tecido resistente como gabardine, é ideal, pois oferece durabilidade para o uso diário em laboratórios e aulas." },
  { q: "Estudantes de medicina podem personalizar o jaleco com o logo da universidade e o nome?", a: "Sim, oferecemos o serviço de bordado para incluir o logo da sua universidade e seu nome, o que é comum e até exigido por algumas instituições." },
  { q: "Qual a importância de um jaleco de qualidade para o estudante de medicina que passará muitas horas em aulas práticas e estágios?", a: "Um jaleco de qualidade garante conforto, durabilidade e proteção adequada contra agentes químicos e biológicos, essencial para a segurança e desempenho do estudante em longas jornadas." },
  { q: "Há requisitos específicos de jaleco (cor, comprimento) para estágios em hospitais universitários?", a: "A maioria dos hospitais universitários exige jaleco branco, de manga longa e comprimento até a altura dos joelhos. Sempre consulte as normas da sua instituição." },
  { q: "Qual o tecido mais fácil de cuidar para um estudante de medicina com rotina agitada?", a: "Tecidos como gabardine ou brim leve são fáceis de lavar, secam rápido e amassam menos, sendo ideais para a rotina intensa de estudos e estágios." },
  { q: "Os jalecos para estudantes de medicina vêm com bolsos suficientes para estetoscópio e outros materiais?", a: "Sim, nossos modelos para estudantes são projetados com bolsos funcionais e espaçosos para acomodar estetoscópio, canetas e pequenos instrumentos." },
  { q: "Como escolher o tamanho ideal de jaleco para um estudante que ainda está em crescimento?", a: "Sugiro medir busto, cintura e ombros, e comparar com nossa tabela de medidas. Em caso de dúvida, um número acima pode ser uma opção para maior conforto e longevidade de uso." },
  { q: "Qual o custo-benefício de adquirir um kit de jalecos para a faculdade de medicina?", a: "Adquirir um kit é vantajoso para ter opções de troca e garantir que você sempre terá um jaleco limpo. Oferecemos pacotes com desconto para estudantes." },
  { q: "É permitido usar jalecos coloridos ou com detalhes para aulas práticas na faculdade de medicina?", a: "Geralmente, em ambientes de estudo e estágio, o jaleco branco é o padrão exigido. Detalhes coloridos podem ser restritos, consulte as normas da sua faculdade." },
  { q: "Os jalecos de medicina são resistentes a produtos químicos leves usados em laboratório?", a: "Sim, nossos jalecos são confeccionados com tecidos que oferecem boa resistência a salpicos de produtos químicos leves comuns em laboratórios, mas não são projetados para proteção contra substâncias corrosivas." },
  { q: "Qual o prazo de entrega para jalecos de medicina, considerando a urgência para o início das aulas?", a: "Nosso prazo de entrega é rápido e eficiente. Oferecemos diferentes modalidades de frete para atender a sua necessidade, inclusive opções expressas para maior urgência." },
  { q: "É possível fazer a troca de um jaleco caso o tamanho não sirva, mesmo após o bordado da faculdade?", a: "Em geral, peças bordadas não podem ser trocadas, exceto em caso de defeito de fabricação. Por isso, é crucial verificar a tabela de medidas antes de solicitar o bordado." },
  { q: "Os jalecos para medicina são unissex ou possuem cortes específicos para homens e mulheres?", a: "Oferecemos modelos unissex para a praticidade do estudante e também cortes específicos masculinos e femininos, para quem busca um caimento mais ajustado." },
  { q: "Qual a durabilidade média de um jaleco de medicina para uso acadêmico diário?", a: "Com os cuidados adequados, nossos jalecos duram vários anos, resistindo bem à rotina acadêmica e às lavagens frequentes, sendo um investimento de longo prazo." },
  { q: "Os jalecos possuem alguma indicação de lavagem específica para manter a higiene e a cor branca?", a: "Sim, acompanham etiquetas com instruções de lavagem, geralmente recomendando lavagem com água fria, sabão neutro e separadamente de roupas coloridas para manter o branco impecável." },
  { q: "Para estudantes de medicina que precisam carregar muitos livros, o jaleco é resistente o suficiente na região dos ombros?", a: "Nossos jalecos são reforçados nas costuras, especialmente nos ombros, para suportar o uso diário e a movimentação constante sem ceder, mesmo com mochilas pesadas." },
  { q: "Há opções de jalecos com gola esporte ou outros estilos para estudantes que desejam um visual mais moderno?", a: "Sim, além da gola tradicional, temos modelos com gola esporte que oferecem um visual mais descontraído e moderno, sem perder a formalidade exigida na área da saúde." },
  { q: "A loja oferece algum desconto para compra em grupo de estudantes de medicina?", a: "Sim, entre em contato conosco para conhecer nossas condições especiais e descontos para compras em grupo, ideal para turmas de faculdade." },
  { q: "Os jalecos para estudantes são adequados para uso em laboratórios de anatomia, considerando a exposição a formol?", a: "Nossos tecidos são projetados para resistir a exposição limitada a substâncias como o formol, mas sempre recomendamos seguir as normas de segurança do laboratório e usar EPIs adequados." },
  { q: "Qual a importância da manga longa no jaleco de estudante de medicina para a biossegurança?", a: "A manga longa é crucial para a biossegurança, pois protege os braços do contato direto com pacientes e superfícies contaminadas, sendo um item obrigatório na maioria dos ambientes de saúde." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para medicina
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
