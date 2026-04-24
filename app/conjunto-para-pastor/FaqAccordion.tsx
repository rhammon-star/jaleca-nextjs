'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Pastor pode usar qualquer cor de uniforme?', a: 'As cores mais tradicionais são preto, azul marinho e branco. Para cultos formais, preto e azul escuro transmitem seriedade. Para eventos mais informais, tons de cinza e branco são bem-vindos.' },
  { q: 'Qual o tecido ideal para uniforme de pastor?', a: 'O tecido com elastano oferece flexibilidade e memória de forma, mantendo a dignidade da vestimenta mesmo após longas horas de uso em cultos e eventos.' },
  { q: 'Conjunto ou jaleco: qual é melhor para pastor?', a: 'Para cultos formais e eventos oficiais, o conjunto completo transmite mais dignidade. Para atividades do dia a dia na igreja, o jaleco é mais prático e confortável.' },
  { q: 'O uniforme de pastor precisa ser muito formal?', a: 'O nível de formalidade depende do estilo da igreja. Igrejas tradicionais pedem mais formalidade. Igrejas contemporâneas aceitam casual mais elegante. O importante é transmitir reverência e profissionalismo.' },
  { q: 'Como manter o uniforme de pastor impecável?', a: 'Lave em água fria ou morna, evite alvejante, e passe em temperatura média. Tecidos com elastano mantêm a forma e reduzem a necessidade de passar. Guarde em cabide para evitar rugas.' },
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