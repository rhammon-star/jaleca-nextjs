const FABRICS = [
  { name: 'Gabardine + elastano', desc: 'Leve, não amassa, lavagem 40°C', best: 'Uso diário · clínica' },
  { name: 'Microfibra premium', desc: 'Maciez extrema, não transparece', best: 'Consultório · estética' },
  { name: 'DWR repelente', desc: 'Repele líquidos e manchas', best: 'Procedimentos estéticos' },
  { name: 'Alfaiataria Premium', desc: 'Visual sofisticado, caimento impecável', best: 'Atendimento presencial' },
]

export default function FabricGuideCards() {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
        Guia rápido
      </div>
      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tecido certo para cada situação
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px,100%), 1fr))', gap: '0.75rem' }}>
        {FABRICS.map((f, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1rem' }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.25rem' }}>{f.name}</strong>
            <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, marginBottom: '0.4rem' }}>{f.desc}</p>
            <span style={{ fontSize: '0.72rem', color: '#c8a96e', fontWeight: 600 }}>✓ {f.best}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
