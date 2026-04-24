'use client'
import { useState } from 'react'

const faqItems = [
  { q: 'Dolma para churrasqueiro é diferente do jaleco comum?', a: 'Sim. A dolma tem caimento mais solto e tecido técnico resistente a gordura e umidade. É própria para ambientes de cozinha quente onde o jaleco comum seria desconfortável e difícil de limpar.' },
  { q: 'Dolma pode ser usada em churrascaria?', a: 'Sim. A dolma é amplamente usada em churrascarias e espetarias por oferecer conforto térmico, liberdade de movimento e fácil manutenção. É mais prática que o jaleco tradicional em ambientes de churrasco.' },
  { q: 'Qual o melhor tecido para dolma de churrasqueiro?', a: 'O tecido com elastano e tratamento antipeling é o mais indicado. Oferece maleabilidade para movimento, resistência a manchas de gordura e secagem rápida após lavagem.' },
  { q: 'Dolma para churrasqueiro precisa de proteção térmica?', a: 'Para exposição direta ao charcoal ou brasas, indicamos avental de couro ou algodão grosso por cima. A dolma protege contra respingos de gordura, mas não é um EPI contra calor extremo.' },
  { q: 'Como manter a dolma limpa em ambiente de churrascaria?', a: 'Lave imediatamente após o uso para evitar manchas de gordura fixadas. Use sabão neutro e água morna. O tecido técnico Jaleca seca rápido e não precisa passar. Evite alvejante.' },
  { q: 'Dolma ou jaleco: qual é melhor para churrasqueiro?', a: 'Para a área de preparo e serviço de churrascaria, a dolma é mais prática por ser mais ventilada e fácil de limpar. Para área de fuego direto (montagem da carne na grelha), o jaleco pode ser mais adequado dependendo do estilo da churrascaria.' },
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