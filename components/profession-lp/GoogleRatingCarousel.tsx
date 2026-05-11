'use client'

const DEPOIMENTOS = [
  { initial: 'F', name: 'Dra. Fernanda M.', role: 'Médica · São Paulo', text: '"Caimento perfeito. Tecido não amassa em 12h de plantão."' },
  { initial: 'J', name: 'Juliana R.', role: 'Dentista · BH', text: '"Chegou em 2 dias. O Slim ficou exatamente como esperava."' },
  { initial: 'A', name: 'Ana C.', role: 'Enfermeira · RJ', text: '"Plus size G2 que cabe nos ombros. Finalmente molde correto."' },
  { initial: 'M', name: 'Maria P.', role: 'Nutricionista · SP', text: '"Elastex não amassa e troca rápido no consultório."' },
  { initial: 'C', name: 'Carolina S.', role: 'Psicóloga · Curitiba', text: '"Qualidade surpreendente para o preço. Já pedi o segundo."' },
]

type Props = {
  rating?: number
}

export default function GoogleRatingCarousel({ rating = 4.9 }: Props) {
  return (
    <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '3px solid #c8a96e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0ece5', marginBottom: '1.5rem' }}>
          <div style={{ width: 40, height: 40, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#4285f4', flexShrink: 0 }}>G</div>
          <div>
            <strong style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{rating.toFixed(1)}</strong>
            <div style={{ color: '#fbbc04', fontSize: '0.9rem', margin: '2px 0' }}>★★★★★</div>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>Avaliações verificadas no Google</span>
          </div>
        </div>

        <div
          style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {DEPOIMENTOS.map((d, i) => (
            <div
              key={i}
              style={{ minWidth: 240, maxWidth: 260, background: '#f9f7f4', borderRadius: 6, padding: '1rem', scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0dbd3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#888', flexShrink: 0 }}>
                  {d.initial}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a' }}>{d.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>{d.role}</div>
                </div>
              </div>
              <div style={{ color: '#fbbc04', fontSize: '0.78rem', marginBottom: '0.35rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5, margin: 0 }}>{d.text}</p>
              <div style={{ fontSize: '0.65rem', color: '#1a7a1a', fontWeight: 600, marginTop: '0.35rem' }}>✓ Compra verificada</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
