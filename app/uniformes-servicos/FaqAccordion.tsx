'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Qual tecido é mais resistente para uniforme de serviços?', a: 'Gabardine e crepe são os mais usados em uniformes de serviços por sua resistência a amassados e facilidade de lavagem. Tecidos com elastano adicionam conforto e memória de forma. Para quem fica muito tempo sentado, o crepe acetinado oferece melhor queda e não marca.' },
  { q: 'Como escolher o uniforme ideal para cada tipo de serviço?', a: 'Considere três fatores: (1) movimento necessário — quem anda muito precisa de tecido respirável; (2) formalidade do ambiente — escritório exige tecido mais estruturado; (3) tempo de uso — para longas jornadas, priorize conforto e tecido fácil de lavar. A Jaleca tem modelagem Slim (moderna) e Profissional (mais ampla).' },
  { q: 'Qual o prazo de entrega dos uniformes?', a: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo varia de 3 a 8 dias úteis conforme região — calculado no checkout com o CEP. Capitais do Sudeste geralmente recebem em 3 a 5 dias. Frete grátis para compras acima de R$499 em SP, RJ, MG e ES.' },
  { q: 'Como funciona a troca de tamanho?', a: 'Arrependimento: até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Manda mensagem pelo WhatsApp com o número do pedido.' },
]

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginTop: '2.5rem' }}>
      {faqItems.map((item, i) => (
        <div key={i} style={{ background: '#fff' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', background: 'none', border: 'none', padding: '1.5rem 2rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', textAlign: 'left', gap: '1rem',
            }}
          >
            <span style={{ flex: 1, lineHeight: 1.5 }}>{item.q}</span>
            <span style={{ fontSize: '1.2rem', color: '#c8a96e', fontWeight: 300, flexShrink: 0 }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <p style={{ fontSize: '0.88rem', color: '#6b6b6b', lineHeight: 1.85, padding: '0 2rem 1.5rem', margin: 0, borderTop: '1px solid #f0ece5' }}>
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
