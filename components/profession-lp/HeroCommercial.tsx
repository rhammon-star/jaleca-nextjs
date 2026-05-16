import Link from 'next/link'

type Props = {
  eyebrow: string
  h1Line1: string
  h1Line2: string
  description: string
  startingPrice: string
  comparePrice?: string
  collectionHref: string
  allHref: string
  googleRating?: number
}

export default function HeroCommercial({
  eyebrow, h1Line1, h1Line2, description, startingPrice, comparePrice,
  collectionHref, allHref, googleRating,
}: Props) {
  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,6vw,5rem) clamp(1.5rem,5vw,4rem) clamp(2rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '0.75rem' }}>
          {eyebrow}
        </div>
        <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', fontWeight: 400, lineHeight: 1.05, color: '#1a1a1a', marginBottom: '0.75rem' }}>
          {h1Line1}<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{h1Line2}</em>
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#4a4a4a', maxWidth: 560, lineHeight: 1.75, marginBottom: '1rem' }}>
          {description}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b6b6b' }}>A partir de</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>{startingPrice}</strong>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#1a7a1a', fontWeight: 600, marginBottom: '1.5rem' }}>
          ✓ PIX com 5% off &nbsp;·&nbsp; 3x sem juros
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <a
            href={collectionHref}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 1.75rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Ver modelos e comprar ↓
          </a>
          <Link
            href={allHref}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 1.75rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}
          >
            Ver toda a coleção →
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: '#6b6b6b' }}>
          {googleRating && <span>★ {googleRating.toFixed(1)} Google</span>}
          <span>✓ PP ao G3</span>
          <span>✓ Frete grátis SE</span>
          <span>✓ Troca 7 dias</span>
        </div>
      </div>
    </section>
  )
}
