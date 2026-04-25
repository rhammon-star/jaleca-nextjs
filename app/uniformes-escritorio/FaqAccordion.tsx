'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Qual o melhor tecido para uniforme de escritório?', a: 'Crepe acetinado, bengaline e gabardine leve são os mais usados em uniformes de escritório. Todos têm boa queda, resistência a amassados e podem ser lavados em casa. O crepe é o mais versátil — não precisa passar e seca rápido. Para quem trabalha sentado o dia todo, o bengaline oferece mais estrutura e elegância.' },
  { q: 'O que é casual corporativo e como usar?', a: 'Casual corporativo é um dress code que permite mais conforto sem perder a formalidade. Significa usar tecidos de qualidade, cores sóbrias (preto, cinza, marinho, bege) e modelagem bem ajustada. Jalecos, conjuntos executivos e calças de corte reto são peças-chave. Na Jaleca, você monta o uniforme por categoria ou pode usar jaleco por cima da roupa do dia.' },
  { q: 'Como escolher entre jaleco e conjunto para escritório?', a: 'O jaleco é uma sobreposição: você veste por cima da roupa do dia, identifica o profissional e pode remover facilmente. Ideal para advogados, farmacêuticos e psicólogos que alternam entre diferentes ambientes. O conjunto (jaleco + calça/saia) transmite mais formalidade e identidade visual forte. Escolha conjunto para recepcionistas, secretárias e ambientes que exigem uniformização completa.' },
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
