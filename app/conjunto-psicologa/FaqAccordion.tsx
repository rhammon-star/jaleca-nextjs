'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Psicóloga pode usar qualquer cor de uniforme?', a: 'As cores mais recomendadas são tons suaves e acolhedores como azul claro, verde suave, bege e cinza claro. Cores que transmitem calma e confiança são ideais para consultório.' },
  { q: 'Qual o tecido ideal para uniforme de psicóloga?', a: 'O tecido com elastano oferece flexibilidade e memória de forma, mantendo a aparência profissional mesmo após longas horas de atendimento.' },
  { q: 'Conjunto ou jaleco: qual é melhor para psicóloga?', a: 'O jaleco transmite mais profissionalismo no contexto clínico. O conjunto completo é ideal para consultórios mais informais ou para uso fora do ambiente de trabalho.' },
  { q: 'O uniforme de psicóloga influencia na percepção do paciente?', a: 'Sim. Estudos mostram que a vestimenta profissional transmite credibilidade e confiança. Um uniforme bem apresentável ajuda o paciente a se sentir mais seguro no processo terapêutico.' },
  { q: 'Como manter o uniforme impecável para o consultório?', a: 'Lave em água fria ou morna, evite alvejante, e passe em temperatura média. Tecidos com elastano mantêm a forma e reduzem a necessidade de passar. Guarde em cabide.' },
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