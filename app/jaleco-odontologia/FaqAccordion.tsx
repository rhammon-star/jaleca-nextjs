const faqItems = [
  { q: "Qual o jaleco mais indicado para estudantes de odontologia no primeiro ano da faculdade?", a: "Um jaleco branco básico de Gabardine, com manga longa e corte confortável, é perfeito para os primeiros anos, oferecendo durabilidade e praticidade para aulas e laboratórios." },
  { q: "Estudantes de odontologia podem bordar o nome da faculdade e o seu nome no jaleco?", a: "Sim, é comum e recomendado. Oferecemos o serviço de bordado para incluir o logo da sua instituição e seu nome no jaleco." },
  { q: "Qual a importância do jaleco de qualidade para o estudante de odontologia, considerando os materiais e equipamentos?", a: "Um bom jaleco protege contra respingos de materiais dentários, desinfetantes e fluidos, sendo essencial para a biossegurança e a durabilidade durante a formação acadêmica." },
  { q: "Há regulamentações específicas do CRO para jalecos de estudantes de odontologia em clínicas universitárias?", a: "O CRO orienta que jalecos sejam brancos, de manga longa, e estejam sempre limpos. As clínicas universitárias geralmente seguem essas diretrizes." },
  { q: "Qual o tecido de jaleco mais fácil de manter limpo para estudantes de odontologia?", a: "Tecidos como Gabardine ou Microfibra são fáceis de lavar, secam rapidamente e são mais resistentes a manchas, ideais para a rotina de laboratórios e clínicas." },
  { q: "Os jalecos para odontologia possuem bolsos adaptados para instrumentos odontológicos?", a: "Sim, nossos modelos para estudantes e profissionais têm bolsos projetados para acomodar instrumentos, canetas e outros itens necessários durante as práticas clínicas." },
  { q: "Como escolher o tamanho correto de jaleco para o estudante de odontologia que precisa de liberdade de movimento?", a: "Consulte nossa tabela de medidas e priorize um tamanho que permita amplitude de movimento nos braços e ombros, essencial para o manuseio de instrumentais." },
  { q: "Os jalecos de odontologia são unissex ou existem modelos masculinos e femininos?", a: "Oferecemos modelos unissex para a praticidade da compra e também opções com cortes específicos femininos e masculinos para um caimento mais ajustado." },
  { q: "Qual a durabilidade média de um jaleco de odontologia para uso acadêmico intensivo?", a: "Com os cuidados de lavagem adequados, um jaleco de boa qualidade pode durar por toda a graduação e até mesmo no início da carreira profissional." },
  { q: "Os jalecos de odontologia são resistentes a manchas de produtos como resina ou amálgama?", a: "Nossos tecidos oferecem boa resistência a manchas, mas recomendamos limpar qualquer respingo de resina ou amálgama imediatamente para evitar a fixação permanente." },
  { q: "É possível adquirir jalecos com botões de pressão para estudantes de odontologia?", a: "Sim, dispomos de modelos com botões de pressão, que são práticos para o fechamento e abertura rápida, muito úteis na rotina agitada." },
  { q: "Qual o custo-benefício de comprar um kit de jalecos para o curso de odontologia?", a: "Um kit é vantajoso para garantir que você sempre terá um jaleco limpo e disponível para as atividades, além de geralmente ter um preço mais acessível por peça." },
  { q: "Há opções de jalecos com gola esporte ou outros estilos para estudantes de odontologia?", a: "Sim, temos jalecos com gola esporte para um visual mais moderno e descontraído, desde que a instituição permita, complementando a tradicional gola clássica." },
  { q: "Qual a importância da manga longa no jaleco de odontologia para a biossegurança em procedimentos?", a: "A manga longa é crucial, pois protege os braços contra respingos de saliva, sangue, materiais e produtos químicos, além de reduzir o risco de contaminação cruzada." },
  { q: "Como lavar o jaleco de odontologia para garantir a desinfecção sem danificar o tecido?", a: "Lave separadamente com água fria e detergente neutro. Para desinfecção, use produtos recomendados para tecidos brancos ou siga as orientações da sua clínica/faculdade." },
  { q: "Os jalecos para odontologia são pré-encolhidos para evitar surpresas no tamanho após a lavagem?", a: "Sim, nossos tecidos passam por um processo de pré-encolhimento para que o tamanho e o caimento se mantenham consistentes após as lavagens." },
  { q: "A loja oferece descontos para compras em grupo de estudantes de odontologia?", a: "Sim, oferecemos condições especiais e descontos para compras em grande volume, ideais para turmas de odontologia. Entre em contato conosco para saber mais." },
  { q: "Qual o prazo de entrega para jalecos de odontologia com personalização de bordado?", a: "O prazo para jalecos com bordado pode ser um pouco maior que o padrão. Consulte as informações de entrega no momento da compra para uma estimativa precisa." },
  { q: "Os jalecos de odontologia são confortáveis para quem usa óculos de proteção ou lupas?", a: "Sim, nossos modelos são desenhados para não interferir com o uso de óculos de proteção ou lupas, garantindo conforto e segurança durante os procedimentos." },
  { q: "É possível escolher o tipo de bordado (cor, fonte) para o nome no jaleco de odontologia?", a: "Sim, oferecemos opções de cores de linha e fontes para o bordado, permitindo que você personalize ainda mais o seu jaleco de acordo com sua preferência ou padrão da instituição." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para odontologia
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
