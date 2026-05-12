const faqItems = [
  { q: "Qual o tecido mais resistente e adequado para o jaleco masculino de biomédico em laboratórios de análises clínicas?", a: "Gabardine de alta densidade é ideal, pois é resistente a produtos químicos leves, fácil de descontaminar e durável para o ambiente laboratorial intenso." },
  { q: "Os jalecos para biomédicos são projetados para máxima proteção e conforto durante a manipulação de amostras e reagentes?", a: "Sim, nossos modelos masculinos oferecem manga longa e punhos que protegem eficazmente, além de cortes que garantem liberdade de movimento para manipulações precisas." },
  { q: "É possível bordar o número de registro do CRBM (Conselho Regional de Biomedicina) e o nome no jaleco de biomédico?", a: "Sim, oferecemos o serviço de bordado para incluir seu nome e o número de registro no CRBM, um detalhe essencial para a identificação profissional." },
  { q: "Qual a importância dos bolsos em jalecos de biomédicos para a organização de materiais de laboratório?", a: "Nossos jalecos possuem bolsos estrategicamente posicionados e com tamanho adequado para guardar canetas, pipetas, esferográficas e pequenos cadernos, otimizando o trabalho." },
  { q: "Como escolher o jaleco ideal para um biomédico que atua em diferentes setores, como microbiologia e hematologia?", a: "Opte por um jaleco versátil, de tecido resistente e fácil de descontaminar. Considere ter mais de um, diferenciando o uso por setor, se possível." },
  { q: "Os jalecos brancos são os únicos aceitáveis para biomédicos, ou há outras cores discretas que podem ser usadas?", a: "O branco é o padrão de segurança e higiene. Em laboratórios específicos, cores claras como azul marinho ou cinza podem ser usadas, mas sempre verifique as normas internas." },
  { q: "Qual a diferença de um jaleco com fechamento em botões e um com zíper para biomédicos?", a: "Botões são clássicos e fáceis de substituir. Zíper oferece um fechamento rápido e seguro, sendo uma opção mais moderna e prática para a rotina." },
  { q: "Há jalecos masculinos com tratamentos repelentes a líquidos para proteção contra respingos de amostras?", a: "Sim, oferecemos modelos premium com tecidos que incorporam tratamentos repelentes a líquidos, oferecendo uma barreira extra contra respingos acidentais." },
  { q: "O comprimento do jaleco para biomédicos influencia na proteção e segurança em laboratório?", a: "Um comprimento médio (até os joelhos) é fundamental, pois oferece proteção adequada para o corpo e pernas contra respingos e contato com superfícies de bancada." },
  { q: "Qual a política de garantia da loja para jalecos de biomédicos em caso de defeitos de fabricação?", a: "Nossos produtos têm garantia contra defeitos de fabricação. Caso encontre alguma falha, entre em contato com nosso atendimento para acionar a garantia." },
  { q: "Existem opções de jalecos para biomédicos com painéis de ventilação para ambientes de laboratório mais quentes?", a: "Sim, dispomos de modelos com ventilação estratégica e tecidos mais leves, que proporcionam maior conforto em ambientes de laboratório com temperatura elevada." },
  { q: "Como garantir a longevidade do jaleco branco para biomédico, evitando que ele manche com reagentes?", a: "Lave imediatamente qualquer respingo, use sabão neutro e evite produtos abrasivos. Alguns tecidos têm maior resistência a manchas químicas." },
  { q: "A loja oferece jalecos com punhos elásticos ou ajustáveis para maior segurança em laboratório?", a: "Sim, nossos modelos priorizam a segurança. Oferecemos jalecos com punhos elásticos ou ajustáveis para garantir que as mangas fiquem no lugar e protejam adequadamente." },
  { q: "Qual a importância do certificado de qualidade dos tecidos para jalecos de biomédicos?", a: "Certificados garantem que os tecidos atendem a padrões de resistência, durabilidade e segurança, crucial para a proteção do biomédico em um ambiente com riscos." },
  { q: "Para biomédicos que usam luvas constantemente, o jaleco é desenhado para facilitar a colocação e retirada das luvas?", a: "Sim, as mangas e punhos são projetados para permitir que as luvas sejam calçadas e removidas facilmente, sem rasgar ou prender, otimizando a biossegurança." },
  { q: "Qual a faixa de preço dos jalecos para biomédicos e o que justifica a variação?", a: "Os preços variam conforme o tecido (Gabardine, microfibra), tecnologias (repelente, antibacteriano), design e acabamento, refletindo a qualidade e os recursos oferecidos." },
  { q: "Os jalecos masculinos são pré-encolhidos para manter o tamanho após várias lavagens em autoclave?", a: "Nossos tecidos são pré-encolhidos para minimizar alterações. Para lavagem em autoclave, consulte a ficha técnica do produto para verificar a compatibilidade." },
  { q: "A loja oferece descontos para a compra de múltiplos jalecos para equipes de biomedicina?", a: "Sim, oferecemos condições especiais e descontos progressivos para compras em quantidade, ideais para equipes de laboratório ou grandes pedidos de clínicas." },
  { q: "Os jalecos de biomédico são adequados para uso em salas limpas ou ambientes controlados?", a: "Para salas limpas, são exigidos jalecos específicos de tecidos que não soltem fiapos e sigam normas ISO. Nossos jalecos padrão são para uso geral em laboratório, não necessariamente salas limpas." },
  { q: "É possível personalizar o jaleco de biomédico com o logo da instituição ou empresa?", a: "Sim, além do nome e CRBM, oferecemos o serviço de bordado para incluir o logo da sua instituição, laboratório ou empresa, promovendo a identidade visual." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para biomédico
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
