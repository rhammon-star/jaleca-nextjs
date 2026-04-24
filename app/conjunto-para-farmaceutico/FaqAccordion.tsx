'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Farmacêutico pode usar qualquer cor de uniforme?', a: 'O CRF recomenda branco ou cores claras para farmácias. Em ambientes hospitalares, existem protocolos específicos de cor. Na dúvida, o branco é sempre a escolha segura.' },
  { q: 'Qual o tecido ideal para uniforme de farmacêutico?', a: 'O tecido com elastano é o mais indicado porque oferece flexibilidade, memória de forma e é mais fácil de lavar — essencial para quem trabalha em ambiente com exposição a produtos químicos.' },
  { q: 'Conjunto ou jaleco: qual é melhor para farmácia?', a: 'O jaleco é mais comum em farmácias de manipulação e hospitalar. O conjunto completo é ideal para farmácias comerciais e laboratórios onde há mais interação com clientes.' },
  { q: 'O uniforme de farmacêutico precisa de identificação?', a: 'Sim. O CRF exige que o farmacêutico use crachá de identificação com nome e número do registro profissional. O uniforme branco com bordado do nome transmite mais credibilidade.' },
  { q: 'Como manter o uniforme branco sem manchas?', a: 'Evite contato direto com produtos químicos. Lave imediatamente em caso de respingos. Use sabão neutro e evite alvejante. A Jaleca oferece tecidos que mantêm o branco por mais tempo.' },
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