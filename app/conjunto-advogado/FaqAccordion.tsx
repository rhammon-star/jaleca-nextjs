'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Qual o tecido ideal para uniforme de advogado?', a: 'O tecido com elastano é o mais indicado por oferecer flexibilidade e memória de forma, mantendo a elegância mesmo após horas de uso intenso em audiências e escritórios.' },
  { q: 'Conjunto ou jaleco separados: qual é melhor para advogado?', a: 'O conjunto completo (calça e camisa/blazer) transmite mais formalidade e é ideal para audiências e reuniões importantes. Jalecos e gowns são mais comuns em escritórios de advocacia corporativa.' },
  { q: 'Advogado pode usar uniforme colorido no tribunal?', a: 'As cores mais tradicionais são preto, cinza e azul escuro. Cores discretas são aceitas em tribunais mais informais, mas o mais seguro é manter tons clássicos.' },
  { q: 'Conjunto com elastano desbota rápido?', a: 'Não. Os tecidos Jaleca com elastano são projetados para manter a cor mesmo após múltiplas lavagens, desde que seguidas as instruções de conservação.' },
  { q: 'Qual a diferença entre conjunto profissional e terno?', a: 'O conjunto profissional é mais prático e leve, feito para o dia a dia de trabalho. O terno é mais estruturado e indicado para eventos formais. Para advogados, o conjunto profissional substitui o terno no escritório.' },
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