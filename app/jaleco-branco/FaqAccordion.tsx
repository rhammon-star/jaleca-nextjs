const faqItems = [
  { q: "Qual o tecido mais indicado para um jaleco branco que não amarela?", a: "Para manter o branco impecável, recomendamos tecidos de gabardine ou microfibra de alta qualidade, que são resistentes ao amarelamento e fáceis de branquear." },
  { q: "O jaleco branco é exigido por regulamentação em alguma profissão?", a: "Sim, para médicos, o Conselho Federal de Medicina (CFM) exige o uso do jaleco branco em ambientes clínicos e hospitalares, sendo um padrão de higiene e ética." },
  { q: "O corte do jaleco branco é adaptável a diferentes tipos de corpo e profissões?", a: "Nosso corte clássico é versátil, adaptando-se confortavelmente a diferentes biotipos e permitindo a mobilidade necessária para diversas profissões da saúde e além." },
  { q: "Posso bordar meu nome e a especialidade no jaleco branco?", a: "Com certeza! O bordado do seu nome e da sua especialidade no jaleco branco é um toque de profissionalismo essencial, reforçando sua identificação no ambiente de trabalho." },
  { q: "Este jaleco branco é adequado para múltiplas profissões, além da área da saúde?", a: "Sim, o jaleco branco é sinônimo de higiene e profissionalismo, sendo ideal para laboratórios, clínicas de estética, gastronomia e diversas outras áreas que exigem asseio." },
  { q: "Qual a durabilidade esperada para um jaleco branco Jaleca, considerando as lavagens?", a: "Nossos jalecos brancos são feitos para serem altamente duráveis, suportando as frequentes lavagens necessárias para manter a higiene sem perder a qualidade do tecido." },
  { q: "Como manter o branco impecável do jaleco?", a: "Lave-o separadamente com água fria e sabão para roupas brancas. Use alvejante sem cloro se necessário e seque à sombra para evitar o amarelamento." },
  { q: "O jaleco branco oferece a mesma versatilidade que um jaleco colorido?", a: "Em termos de aplicação profissional, o jaleco branco é incomparável em sua versatilidade e reconhecimento, sendo o padrão de higiene e seriedade em diversas áreas." },
  { q: "Os tamanhos de jaleco branco abrangem do PP ao G3?", a: "Sim, nossa grade de tamanhos, do PP ao G3, garante que todos encontrem um jaleco branco com o ajuste perfeito, proporcionando conforto e um visual impecável." },
  { q: "Os bolsos do jaleco branco são práticos para o dia a dia profissional?", a: "Sim, ele possui bolsos estrategicamente posicionados, ideais para guardar instrumentos, canetas ou outros itens essenciais, mantendo tudo organizado e acessível." },
  { q: "O comprimento do jaleco branco é padrão e atende às exigências profissionais?", a: "O comprimento clássico do nosso jaleco branco atende às normas da maioria das profissões, oferecendo cobertura e autoridade adequadas ao ambiente de trabalho." },
  { q: "O jaleco branco está disponível apenas em manga longa?", a: "Priorizamos a manga longa, que é o padrão exigido e mais protetor em ambientes profissionais, mas também oferecemos opções de manga ¾ para maior versatilidade." },
  { q: "O estilo profissional do jaleco branco transmite autoridade e seriedade?", a: "Com um estilo clássico e elegante, nosso jaleco branco transmite autoridade, seriedade e confiança, características valorizadas em qualquer ambiente profissional." },
  { q: "Os jalecos brancos Jaleca são mais fáceis de manter limpos e brancos do que os da concorrência?", a: "Nossos tecidos de alta qualidade são tratados para facilitar a remoção de manchas e manter o branco por mais tempo, superando a maioria dos produtos no mercado." },
  { q: "Qual o preço de partida para um jaleco branco de qualidade?", a: "Você pode adquirir um jaleco branco profissional de alta qualidade a partir de R$159, um investimento essencial em sua imagem e credibilidade." },
  { q: "Qual o prazo de entrega para jalecos brancos?", a: "Seu jaleco branco será entregue em 3 a 8 dias úteis, para que você possa iniciar seu trabalho com profissionalismo e higiene rapidamente." },
  { q: "Posso trocar o jaleco branco se ele não servir corretamente?", a: "Sim, você tem 7 dias após o recebimento para solicitar a troca do seu jaleco, caso o tamanho ou ajuste não estejam perfeitos para você." },
  { q: "Há frete grátis para compras de jalecos brancos acima de R$499 em SP/RJ/MG/ES?", a: "Sim, oferecemos frete grátis para pedidos de jalecos brancos acima de R$499 para os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo." },
  { q: "Os jalecos brancos da Jaleca possuem garantia?", a: "Todos os nossos jalecos são cobertos por garantia contra defeitos de fabricação, assegurando a qualidade e a sua total confiança na compra." },
  { q: "O tecido do jaleco branco é confortável para o uso durante todo o dia?", a: "Sim, priorizamos tecidos leves e respiráveis que garantem conforto térmico, mantendo você fresco e confortável, mesmo durante longas horas de trabalho." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco branco
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
