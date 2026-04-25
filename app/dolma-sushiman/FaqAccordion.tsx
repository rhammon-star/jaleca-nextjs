'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Dolma para sushiman é diferente do jaleco comum?', a: 'Sim. A dolma tem caimento mais solto e tecido técnico resistente a manchas e umidade. É própria para ambientes de cozinha japonesa onde a precisão no movimento é essencial.' },
  { q: 'Qual o melhor tecido para dolma de sushiman?', a: 'O tecido com elastano e tratamento antipeling é o mais indicado. Oferece maleabilidade para movimentos precisos, resistência a manchas de peixe e secagem rápida após lavagem.' },
  { q: 'Dolma pode ser usada em restaurante japonês?', a: 'Sim. A dolma é amplamente usada em restaurantes japoneses, rodízios de sushi, kombinis e cozinhas de alta gastronomia por oferecer conforto, liberdade de movimento e fácil manutenção.' },
  { q: 'Dolma branca é obrigatória para sushiman?', a: 'A cor branca é tradição na cozinha japonesa por questões de higiene e representatividade. Porém, a Jaleca oferece dolmas em diversas cores que mantêm a profissionalidade e são aceitas na maioria dos restaurantes.' },
  { q: 'Como manter a dolma limpa em cozinha japonesa?', a: 'Lave imediatamente após o uso para evitar manchas de peixe. Use sabão neutro e água morna. O tecido técnico Jaleca seca rápido e não precisa passar. Evite alvejante.' },
  { q: 'Dolma ou jaleco: qual é melhor para sushiman?', a: 'A dolma é mais adequada para o trabalho de sushiman por permitir mais liberdade de movimento ao cortar e montar peças. O jaleco pode ser mais formal para área de atendimento ao cliente.' },
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