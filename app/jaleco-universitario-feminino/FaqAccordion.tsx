const faqItems = [
  { q: "Qual o tecido mais recomendado para o primeiro jaleco feminino universitário?", a: "Sugerimos tecidos como gabardine premium, que oferecem um caimento mais feminino e são resistentes para o dia a dia acadêmico, além de serem fáceis de manter." },
  { q: "Este jaleco é indicado para futuras médicas, dentistas ou enfermeiras?", a: "Sim, o jaleco é perfeito para estudantes de medicina, odontologia, enfermagem e farmácia, combinando elegância, conforto e a seriedade exigida pelas profissões." },
  { q: "Como o corte feminino do jaleco universitário se adapta à mobilidade em laboratórios?", a: "O corte acinturado e pensado para a mulher oferece total mobilidade, sendo ideal para a rotina intensa de aulas práticas e laboratórios universitários." },
  { q: "É possível bordar meu nome, curso e futuras credenciais como CRM/CRO/COFEN?", a: "Com certeza! Oferecemos bordados personalizados para seu nome, o nome do seu curso e, futuramente, suas credenciais profissionais, um toque essencial para sua carreira." },
  { q: "O jaleco Jaleca ajuda a transmitir uma imagem profissional desde o início da faculdade?", a: "Absolutamente! Nosso jaleco feminino foi desenhado para projetar uma imagem de profissionalismo e dedicação desde o primeiro dia de faculdade, destacando você." },
  { q: "Qual a expectativa de durabilidade de um jaleco universitário feminino?", a: "Projetamos nossos jalecos para serem altamente duráveis, resistindo ao uso intenso e às muitas lavagens, acompanhando você durante toda a sua jornada acadêmica." },
  { q: "Como devo lavar o jaleco para preservar sua cor e modelagem feminina?", a: "Recomendamos lavar em ciclo delicado com água fria, sem misturar com outras cores, e secar à sombra para manter a cor, o tecido e a modelagem feminina intactos." },
  { q: "Este jaleco atende às exigências de regulamentação para o uso em ambientes de saúde?", a: "Sim, nossos jalecos são projetados para cumprir as regulamentações de vestuário e higiene exigidas em ambientes clínicos e hospitalares, dando-lhe segurança." },
  { q: "Os tamanhos de jaleco universitário feminino abrangem do PP ao G3?", a: "Nossa ampla grade de tamanhos, do PP ao G3, garante que cada estudante encontre o jaleco feminino com o caimento perfeito, valorizando a silhueta e o conforto." },
  { q: "Os bolsos do jaleco feminino são práticos para itens essenciais do estudante?", a: "Sim, os bolsos são funcionais e discretos, ideais para organizar canetas, estetoscópio ou pequenos cadernos, mantendo seus materiais sempre acessíveis." },
  { q: "O comprimento do jaleco feminino é adequado para não atrapalhar a mobilidade nas aulas?", a: "O comprimento foi balanceado para oferecer cobertura e elegância, sem restringir a mobilidade necessária para aulas práticas e estágios na universidade." },
  { q: "O jaleco universitário feminino está disponível com opções de manga?", a: "Oferecemos principalmente manga longa, que é o padrão exigido na maioria dos cursos da área da saúde, garantindo a conformidade e proteção." },
  { q: "O estilo slim do jaleco feminino oferece um visual mais moderno e empoderado?", a: "Nosso estilo slim feminino é moderno, elegante e empoderador, perfeito para a estudante que busca um visual profissional e confiante para sua trajetória." },
  { q: "Os jalecos Jaleca se destacam em design e qualidade para estudantes femininas em comparação aos concorrentes?", a: "Nosso design exclusivo e a qualidade superior dos tecidos oferecem um jaleco que valoriza a figura feminina, diferenciando-se dos modelos básicos da concorrência." },
  { q: "Qual o preço inicial para um jaleco universitário feminino de alta qualidade?", a: "Você pode adquirir seu jaleco universitário feminino de alta qualidade a partir de R$159, um investimento essencial em sua jornada acadêmica e profissional." },
  { q: "Qual o prazo de entrega para jalecos universitários femininos?", a: "Garantimos a entrega do seu jaleco feminino em 3 a 8 dias úteis, para que você possa iniciar sua vida acadêmica com estilo e profissionalismo." },
  { q: "Posso trocar o jaleco se o tamanho não estiver ideal para o meu corpo?", a: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou modelo não atendam perfeitamente ao seu biotipo." },
  { q: "Há frete grátis para compras de jalecos universitários femininos acima de R$499 em SP/RJ/MG/ES?", a: "Sim, oferecemos frete grátis para pedidos de jalecos universitários femininos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "O jaleco feminino universitário possui garantia de fabricação?", a: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e a sua total confiança na sua compra." },
  { q: "É um bom investimento para usar na cerimônia de formatura?", a: "Com seu design elegante e acabamento impecável, nosso jaleco é perfeito para a cerimônia de formatura, sendo uma peça que marca a conquista da sua graduação." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco universitário feminino
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
