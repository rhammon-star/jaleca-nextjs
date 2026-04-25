'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Qual o melhor tecido para uniforme de cozinha profissional?', a: 'O tecido com elastano (3–8%) e tratamento antipeling é o mais indicado para cozinhas profissionais. Oferece maleabilidade para movimento, resistência a manchas de gordura e secagem rápida. Na Jaleca, usamos gabardine técnica com toque suave e alta durabilidade.' },
  { q: 'Como manter o jaleco ou dolma limpo em cozinha profissional?', a: 'Lave imediatamente após o uso para evitar manchas de gordura fixadas. Use sabão neutro e água morna. O tecido Jaleca seca rápido e não precisa passar. Evite alvejante clorado — prefira alvejante sem cloro para preservar o tecido e a cor.' },
  { q: 'Qual a diferença entre dolma e jaleco para gastronomia?', a: 'A dolma tem caimento mais solto e tecido próprio para ambientes de cozinha quente — mais ventilada e fácil de limpar. O jaleco é mais moderno e leve, preferido em eventos, churrascarias e serviços de buffet. Para cozinha profissional de restaurante: dolma. Para eventos: jaleco gastronômico.' },
  { q: 'Como escolher o tamanho certo de jaleco ou dolma?', a: 'Meça busto, cintura e quadril com fita métrica. Na Jaleca, a tabela de medidas está na página de cada produto. O corte Slim é mais ajustado; o Profissional é mais amplo. Se estiver entre dois tamanhos, escolha o maior para liberdade de movimento em cozinha.' },
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
