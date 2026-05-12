const faqItems = [
  { q: "Qual a importância do jaleco para os estudantes de enfermagem em laboratórios e estágios?", a: "O jaleco é essencial para a biossegurança, protegendo o estudante contra contaminação e garantindo a identificação profissional nos ambientes de prática." },
  { q: "Os jalecos para cursos de enfermagem são unissex ou há modelos específicos para homens e mulheres?", a: "Oferecemos modelos unissex que atendem bem a todos, e também cortes femininos e masculinos para quem busca um caimento mais personalizado e confortável." },
  { q: "É obrigatório o uso do jaleco branco para estudantes de enfermagem em todas as disciplinas e estágios?", a: "Sim, o jaleco branco é um padrão universal na enfermagem. Recomenda-se usá-lo em todas as aulas práticas, laboratórios e, obrigatoriamente, em estágios." },
  { q: "Como garantir que o jaleco de estudante de enfermagem dure todos os anos da graduação?", a: "Invista em um jaleco de tecido de qualidade superior e siga as instruções de lavagem para assegurar sua durabilidade e manter a boa aparência ao longo dos anos." },
  { q: "Qual o melhor tecido para um jaleco de enfermagem que precisa ser lavado e desinfetado frequentemente?", a: "Tecidos como Gabardine ou Brim são excelentes escolhas, pois são robustos, resistem a lavagens frequentes e mantêm a integridade mesmo após desinfecção." },
  { q: "É permitido bordar o nome da faculdade de enfermagem e o nome do aluno no jaleco?", a: "Sim, é uma prática comum e permitida. Oferecemos o serviço de bordado para personalizar seu jaleco com o logo da instituição e seu nome." },
  { q: "Os jalecos de enfermagem são desenhados para ter bolsos funcionais para materiais de estudo e trabalho?", a: "Sim, nossos jalecos possuem bolsos bem dimensionados para acomodar estetoscópio, esfigmomanômetro, canetas e outros itens que o estudante de enfermagem precisa ter à mão." },
  { q: "Qual a importância da manga longa no jaleco de enfermagem para a proteção e biossegurança?", a: "A manga longa é fundamental para a biossegurança, protegendo os braços do contato com agentes infecciosos e superfícies contaminadas, sendo item obrigatório." },
  { q: "O que devo considerar ao escolher o tamanho do jaleco para o curso de enfermagem?", a: "Priorize o conforto e a mobilidade. Consulte nossa tabela de medidas e, se estiver em dúvida, opte por um tamanho que ofereça um pouco mais de folga." },
  { q: "Os jalecos para estudantes de enfermagem possuem botões resistentes para a rotina diária?", a: "Nossos jalecos são equipados com botões de alta resistência, costurados de forma segura para suportar o uso e a movimentação constante durante as atividades práticas." },
  { q: "É possível adquirir um jaleco de enfermagem com desconto para compras em grande volume para turmas?", a: "Sim, oferecemos condições especiais e descontos progressivos para compras em quantidade, ideais para turmas de enfermagem. Entre em contato para mais detalhes." },
  { q: "Qual o prazo de garantia para os jalecos adquiridos para o curso de enfermagem?", a: "Nossos jalecos possuem garantia contra defeitos de fabricação. Caso identifique qualquer problema, entre em contato com nosso atendimento para avaliação e solução." },
  { q: "Há opções de jalecos de enfermagem com detalhes em cores para diferenciar especialidades?", a: "Para estudantes, o branco liso é o mais recomendado. Detalhes coloridos são mais comuns para profissionais em clínicas específicas, mas verifique sempre as regras da sua instituição." },
  { q: "Como lavar o jaleco de enfermagem para remover manchas de medicamentos ou fluidos?", a: "Trate a mancha o mais rápido possível. Utilize um sabão neutro e, se necessário, um removedor de manchas específico para tecidos brancos, sempre seguindo as instruções da etiqueta." },
  { q: "Os jalecos para enfermagem são projetados para evitar o encolhimento após a lavagem?", a: "Nossos tecidos são pré-encolhidos para minimizar qualquer alteração de tamanho após as lavagens, garantindo que o jaleco mantenha o caimento original." },
  { q: "Qual a diferença entre um jaleco com gola tradicional e um com gola padre para estudantes de enfermagem?", a: "A gola tradicional é clássica e formal. A gola padre oferece um visual mais moderno e limpo, sendo uma escolha de estilo pessoal, desde que atenda às normas da instituição." },
  { q: "Para estudantes de enfermagem que suam muito, há tecidos mais frescos e respiráveis?", a: "Sim, temos jalecos confeccionados com tecidos leves e respiráveis, que ajudam a regular a temperatura corporal e proporcionam maior conforto em ambientes quentes." },
  { q: "Qual o tempo de entrega para um jaleco de enfermagem com bordado?", a: "O tempo de entrega para jalecos com bordado pode ser ligeiramente maior que o padrão devido ao processo de personalização. Consulte as estimativas de prazo no carrinho de compras." },
  { q: "Os jalecos de enfermagem oferecem proteção UV para atividades ao ar livre (saúde da família)?", a: "Embora não sejam o foco principal, alguns tecidos densos oferecem uma proteção UV básica. Para exposições prolongadas, recomendamos buscar produtos específicos com FPU." },
  { q: "A loja oferece serviço de ajuste ou customização de jalecos para medidas especiais de estudantes de enfermagem?", a: "No momento, não oferecemos ajustes personalizados, mas nossa ampla tabela de tamanhos (do PP ao G3) e modelos diversos visam atender a uma vasta gama de medidas e biotipos." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para enfermagem
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
