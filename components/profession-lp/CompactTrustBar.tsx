type Pillar = { label: string }

type Props = {
  pillars?: Pillar[]
}

const DEFAULT_PILLARS: Pillar[] = [
  { label: 'Molde feminino real' },
  { label: 'PP ao G3' },
  { label: 'Frete grátis SE' },
  { label: 'Troca em 7 dias' },
]

export default function CompactTrustBar({ pillars = DEFAULT_PILLARS }: Props) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        padding: '0.45rem clamp(1.5rem,5vw,4rem)',
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {pillars.map((p, i) => (
        <div
          key={i}
          style={{
            padding: '0.3rem 0.9rem',
            borderRight: i < pillars.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <strong style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>{p.label}</strong>
        </div>
      ))}
    </div>
  )
}
