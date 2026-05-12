const faqItems = [
  { q: "É obrigatório bordar algum registro no jaleco feminino de podóloga?", a: "Não há uma exigência de conselho para o bordado de registro em jalecos de podólogas. No entanto, bordar seu nome e 'Podóloga' confere um toque profissional e de confiança. Oferecemos este serviço." },
  { q: "Qual o tecido mais adequado para um jaleco de podóloga que busca conforto e elegância?", a: "Recomendamos tecidos como gabardine com elastano ou microfibra, que oferecem excelente caimento, são maleáveis, de fácil manutenção e muito confortáveis para a rotina de trabalho." },
  { q: "Posso escolher cores diferenciadas para o jaleco feminino de podóloga, além do branco?", a: "Sim, disponibilizamos cores suaves e modernas como rosa quartz, azul serenity ou verde água, que trazem um toque delicado e atual, sem comprometer a imagem profissional. Verifique as políticas do seu consultório." },
  { q: "Como é o corte dos jalecos femininos de podóloga, pensando na feminilidade e mobilidade?", a: "Nossos modelos femininos são projetados com cortes acinturados e pences, valorizando a silhueta sem restringir os movimentos. Oferecemos um visual elegante e funcional para a podologia." },
  { q: "É possível personalizar meu jaleco com meu nome e a palavra 'Podóloga'?", a: "Sim, você pode solicitar o bordado do seu nome e da sua especialidade no momento da compra. Garantimos um bordado de alta qualidade que realça sua identificação profissional." },
  { q: "Quais as melhores práticas para lavar o jaleco feminino de podóloga para máxima higiene?", a: "Lave em água fria ou morna, com sabão neutro e utilize produtos que garantam a desinfecção, se necessário. Seque à sombra e separe por cores para manter a qualidade e evitar manchas." },
  { q: "Um jaleco feminino de podóloga de boa qualidade tem durabilidade garantida?", a: "Nossos jalecos são feitos com tecidos duráveis e costuras reforçadas, desenvolvidos para suportar o uso diário e as rigorosas lavagens exigidas na podologia, mantendo a peça bonita por anos." },
  { q: "Como escolher o tamanho perfeito para o jaleco feminino de podóloga?", a: "Recomendamos consultar nossa tabela de medidas e tirar suas medidas de busto, cintura e quadril. Um jaleco com caimento ideal é fundamental para o conforto e a imagem profissional." },
  { q: "Há opções de comprimentos variados para o jaleco feminino de podóloga?", a: "O comprimento clássico, que geralmente termina na altura do quadril ou meio da coxa, é o mais adequado. Ele oferece a cobertura necessária e não atrapalha os movimentos durante o atendimento." },
  { q: "Estão disponíveis jalecos de podóloga com manga 3/4 ou manga curta?", a: "Sim, além da tradicional manga longa, temos modelos com manga 3/4 ou manga curta, ideais para maior conforto e liberdade de movimento, adaptando-se às suas preferências e ao ambiente." },
  { q: "Quantos bolsos um jaleco de podóloga possui e qual sua finalidade?", a: "Nossos jalecos femininos para podólogas vêm com um bolso superior e dois bolsos inferiores, pensados para a praticidade de guardar pequenos instrumentos, canetas e outros itens essenciais." },
  { q: "Qual o estilo dos jalecos femininos de podóloga para um visual elegante e cuidadoso?", a: "Priorizamos um estilo moderno e feminino, com detalhes que valorizam a profissional. Nossos designs buscam transmitir confiança, delicadeza e a atenção aos detalhes inerente à podologia." },
  { q: "O que distingue um jaleco de podóloga de um jaleco de esteticista?", a: "O jaleco de podóloga é desenhado com foco na praticidade e higiene para tratamentos específicos dos pés, enquanto o de esteticista pode ter mais elementos de moda e adaptabilidade a diferentes procedimentos corporais e faciais." },
  { q: "É possível conseguir um preço melhor ao comprar vários jalecos para a equipe de podólogas?", a: "Sim, oferecemos descontos para pedidos em volume, ideais para padronizar sua equipe de podólogas com peças de alta qualidade. Contate nosso setor de vendas para uma cotação personalizada." },
  { q: "Qual o preço inicial de um jaleco feminino de podóloga com bordado?", a: "Nossos jalecos femininos de podóloga têm preços a partir de R$ 122,00, com a opção de bordado personalizado já inclusa. Consulte nosso site para detalhes de modelos e tecidos." },
  { q: "Qual o prazo de entrega para jalecos de podóloga personalizados com nome?", a: "O prazo de entrega para jalecos personalizados é de 7 a 18 dias úteis, incluindo o tempo de produção e envio. Você receberá um código de rastreio para acompanhar o seu pedido online." },
  { q: "Como proceder em caso de necessidade de troca do jaleco de podóloga por tamanho?", a: "Aceitamos trocas em até 7 dias corridos após o recebimento, desde que o jaleco esteja sem uso. Para peças com bordado personalizado, aplicam-se condições especiais, por favor, consulte-nos." },
  { q: "Há alguma oferta de frete grátis para a compra de jalecos de podóloga?", a: "Sim, periodicamente realizamos promoções de frete grátis para compras acima de um valor determinado ou para regiões específicas. Fique atenta às nossas ofertas em nosso site." },
  { q: "Os jalecos femininos para podólogas vêm com alguma garantia?", a: "Com certeza. Todos os nossos jalecos possuem garantia de 60 dias contra defeitos de fabricação, assegurando a qualidade e a sua total satisfação com o produto." },
  { q: "O tecido do jaleco de podóloga é respirável para longas horas de uso?", a: "Selecionamos tecidos leves e respiráveis que garantem conforto térmico durante toda a jornada de trabalho, essencial para o ambiente da podologia, onde a atenção e o conforto são primordiais." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para podóloga
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
