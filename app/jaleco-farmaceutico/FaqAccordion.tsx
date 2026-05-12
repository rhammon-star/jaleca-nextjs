const faqItems = [
  { q: "O bordado do CRF é um requisito obrigatório para o jaleco de farmacêutico masculino?", a: "Não é uma exigência legal, mas é altamente recomendado para identificação profissional e credibilidade. Oferecemos o serviço de bordado do CRF com excelência." },
  { q: "Qual o tecido mais indicado para um jaleco de farmacêutico que busca conforto e resistência?", a: "Nossos jalecos são confeccionados em gabardine de alta qualidade, que garante conforto, resistência a amassados e facilidade de limpeza para o dia a dia na farmácia." },
  { q: "Existe a possibilidade de escolher cores alternativas ao branco para o jaleco masculino de farmácia?", a: "Sim, além do clássico branco, dispomos de tons sóbrios como azul marinho e cinza claro, ideais para um visual moderno. Consulte as normas da sua instituição antes de escolher." },
  { q: "Como é o corte dos jalecos masculinos para farmacêuticos, visando elegância e mobilidade?", a: "Nossos modelos masculinos possuem um corte slim fit ou reto, que se ajusta ao corpo sem restringir os movimentos. Promove uma silhueta profissional e moderna." },
  { q: "É possível bordar o nome completo e o número de registro profissional no jaleco?", a: "Com certeza. Oferecemos o serviço de bordado personalizado para seu nome e número de CRF, garantindo uma identificação clara e permanente no seu jaleco." },
  { q: "Quais as melhores práticas para a lavagem e conservação do jaleco de farmacêutico?", a: "Recomendamos lavar em água fria ou morna, com ciclo suave, e secar à sombra para evitar o amarelamento. Siga as instruções da etiqueta para prolongar a vida útil da peça." },
  { q: "Qual a expectativa de durabilidade de um jaleco de alta qualidade para um farmacêutico?", a: "Nossos jalecos são feitos para durar. Com costuras reforçadas e tecidos premium, sua peça manterá a boa aparência e funcionalidade por anos, mesmo com uso diário." },
  { q: "Como faço para acertar no tamanho do jaleco masculino para farmacêutico?", a: "Disponibilizamos uma tabela de medidas detalhada em nosso site. Sugerimos que compare as medidas do seu corpo com as da tabela para encontrar o tamanho perfeito." },
  { q: "Há opções de comprimento para o jaleco masculino, como modelos mais curtos ou mais longos?", a: "Oferecemos o comprimento clássico, que geralmente termina na altura do quadril ou meio da coxa. Este padrão proporciona a cobertura e o profissionalismo ideais." },
  { q: "Os jalecos de farmacêutico masculino estão disponíveis com diferentes tipos de manga?", a: "Sim, temos opções com manga longa, ideal para maior proteção, e manga curta, perfeita para ambientes mais quentes ou preferência pessoal. Adapte-se ao seu conforto." },
  { q: "Quantos bolsos costumam vir nos jalecos masculinos e qual a sua funcionalidade?", a: "Nossos modelos contam com três bolsos: um superior e dois inferiores, todos estrategicamente posicionados. Eles são ideais para guardar pequenos instrumentos e objetos pessoais." },
  { q: "Qual o estilo predominante nos jalecos masculinos, para transmitir profissionalismo na farmácia?", a: "Priorizamos um estilo clássico e sofisticado, com detalhes que conferem modernidade e elegância. Nossos jalecos foram desenhados para realçar a sua imagem profissional." },
  { q: "Qual a principal diferença entre um jaleco de farmacêutico e um modelo para atendimento ao público em geral?", a: "O jaleco de farmacêutico é otimizado para a rotina específica da área, combinando tecidos mais resistentes e um corte que permite maior mobilidade. Garante durabilidade e conforto no balcão." },
  { q: "Posso obter um desconto ao comprar várias unidades de jalecos para minha equipe de farmacêuticos?", a: "Sim, oferecemos condições especiais e descontos progressivos para compras em maior volume. Entre em contato com nosso setor comercial para uma proposta personalizada." },
  { q: "Qual o preço inicial dos jalecos masculinos de farmacêutico com bordado incluído?", a: "Nossos preços para jalecos masculinos de farmacêutico iniciam a partir de R$ 120,00, com a opção de bordado personalizada disponível. Consulte as opções no site." },
  { q: "Qual o prazo estimado para a entrega de um jaleco de farmacêutico personalizado?", a: "O prazo de entrega para peças personalizadas varia de 5 a 15 dias úteis, somando o tempo de produção e o frete. Você será informado sobre cada etapa do processo." },
  { q: "Como funciona a política de troca ou devolução se o jaleco não servir corretamente?", a: "Oferecemos um prazo de 7 dias para trocas ou devoluções, desde que o jaleco esteja sem uso e com a etiqueta original. Para produtos bordados, consulte nossas condições específicas." },
  { q: "Há opções de frete expresso para quem precisa do jaleco de farmacêutico com urgência?", a: "Sim, além do frete padrão, disponibilizamos modalidades de frete expresso com prazos reduzidos. Os custos e disponibilidades são calculados no fechamento da compra." },
  { q: "Os jalecos para farmacêuticos possuem alguma garantia contra defeitos de fabricação?", a: "Absolutamente. Todos os nossos produtos possuem garantia de 90 dias contra defeitos de fabricação, assegurando sua total satisfação e a qualidade do material." },
  { q: "Este tipo de jaleco oferece resistência a produtos químicos comuns em farmácias?", a: "Nossos tecidos possuem certa resistência a respingos acidentais, mas não são projetados como EPI para proteção química intensa. São ideais para o ambiente de manipulação e dispensação." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para farmacêutico
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
