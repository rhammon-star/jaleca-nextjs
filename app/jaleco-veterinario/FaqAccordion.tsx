const faqItems = [
  { q: "Veterinário precisa de jaleco específico?", a: "Sim. Embora o CRMV não exija modelo padronizado, o jaleco branco é praxe profissional e ajuda a identificar o médico veterinário em clínicas e consultórios." },
  { q: "Qual a melhor cor de jaleco para veterinário?", a: "Branco é o tradicional, mas azul-marinho e cinza estão crescendo entre veterinários por sujar menos com pelos e fluidos animais." },
  { q: "Qual tecido aguenta o dia a dia em clínica veterinária?", a: "Microfibra com elastano é a escolha ideal: resiste a pelos, arranhões leves de patas e suporta lavagem frequente em água quente." },
  { q: "O jaleco resiste a arranhões de gato?", a: "Nossos jalecos em microfibra são densos e resistem bem a arranhões superficiais, embora nenhum tecido seja 100% à prova de unhas." },
  { q: "Posso bordar CRMV e nome no jaleco?", a: "Sim. Bordamos nome completo, profissão e número do CRMV no peito esquerdo sem custo adicional." },
  { q: "Qual o corte mais usado por veterinários?", a: "Corte reto tradicional masculino, com bolsos amplos para guardar termômetro, caneta e estetoscópio veterinário." },
  { q: "Qual o comprimento ideal do jaleco veterinário?", a: "Comprimento no meio da coxa é o mais funcional — protege a roupa sem atrapalhar ao abaixar para atender animais." },
  { q: "Manga longa ou curta para clínica veterinária?", a: "Manga longa é mais usada por proteger antebraços de mordidas e arranhões; manga curta serve para procedimentos cirúrgicos." },
  { q: "Tem tamanho plus size para veterinário?", a: "Sim. Atendemos do P ao GG3 (equivalente ao 56) no modelo masculino." },
  { q: "O jaleco encolhe na lavagem?", a: "Não. Nossos tecidos são pré-encolhidos. Lave em água até 40 °C e seque à sombra para preservar o caimento." },
  { q: "Quanto custa um jaleco veterinário?", a: "A partir de R$ 119,90 no modelo padrão. Bordado de nome + CRMV é gratuito." },
  { q: "Qual o prazo de entrega?", a: "Sem bordado: 1 a 5 dias úteis. Com bordado personalizado: 5 a 10 dias úteis após confirmação do pedido." },
  { q: "Posso trocar o tamanho se não servir?", a: "Sim. Você tem 7 dias após o recebimento para solicitar troca, desde que o jaleco esteja sem uso e sem bordado personalizado." },
  { q: "Vocês entregam em todo o Brasil?", a: "Sim, enviamos via Correios e transportadoras para todo o território nacional, incluindo zonas rurais." },
  { q: "Tem desconto para clínica veterinária com vários funcionários?", a: "Sim. Para 5 jalecos ou mais oferecemos desconto progressivo. Solicite orçamento pelo WhatsApp." },
  { q: "Qual a diferença entre jaleco veterinário e médico?", a: "Funcionalmente o corte é o mesmo, mas o veterinário costuma escolher tecidos mais resistentes a pelos e fluidos animais." },
  { q: "O jaleco serve para cirurgia veterinária?", a: "Para cirurgias usamos jaleco com manga curta ou avental cirúrgico — peça à parte. O jaleco padrão é para consulta e clínica." },
  { q: "Tem bolso para guardar estetoscópio?", a: "Sim. Todos têm bolso superior + dois inferiores amplos, com profundidade suficiente para estetoscópio veterinário." },
  { q: "Posso usar o jaleco em atendimento domiciliar (home vet)?", a: "Sim. O tecido leve e o caimento ajustado tornam o jaleco confortável para visitas domiciliares de longa duração." },
  { q: "O jaleco amarela com o tempo?", a: "Com lavagem correta (sem alvejante cloro direto), o branco mantém-se por mais de 2 anos de uso diário." }
]
export default function FaqAccordion() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
      <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tudo sobre jaleco para veterinário
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
