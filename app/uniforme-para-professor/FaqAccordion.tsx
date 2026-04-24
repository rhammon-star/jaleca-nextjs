'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Professor pode usar qualquer tipo de uniforme?', a: 'Na maioria das escolas e universidades, há um dress code definido. College wear (blazer, calça social, camisa) é o mais comum. Em escolas mais casuais, camisa e calça chinos são aceitos. Verifique sempre o manual da instituição.' },
  { q: 'Qual o tecido ideal para uniforme de professor?', a: 'O tecido com elastano é o mais indicado por oferecer flexibilidade e memória de forma, mantendo a elegância mesmo após longas horas de aula. Tecidos que não amassam facilitam a rotina.' },
  { q: 'Uniforme de professor precisa ser muito formal?', a: 'Depende da instituição. Escolas tradicionais pedem mais formalidade (blazer, gravata). Escolas modernas aceitam casual mais elegante. O importante é transmitir profissionalismo e credibilidade.' },
  { q: 'O elastano desbota rápido no uniforme?', a: 'Não. Os tecidos Jaleca com elastano são projetados para manter a cor e a forma mesmo após múltiplas lavagens, desde que seguidas as instruções de conservação.' },
  { q: 'Como manter o uniforme de professor impecável?', a: 'Lave em água fria ou morna, evite alvejante, e passe em temperatura média. Tecidos com elastano mantêm a forma e reduzem a necessidade de passar. Guarde em cabide para evitar rugas.' },
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