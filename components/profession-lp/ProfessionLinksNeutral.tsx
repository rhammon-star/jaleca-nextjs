import Link from 'next/link'

type ProfLink = { href: string; label: string }

type Props = {
  links: ProfLink[]
  title?: string
}

export default function ProfessionLinksNeutral({ links, title = 'Jaleco para sua profissão' }: Props) {
  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>
          Outras páginas
        </div>
        <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
          {title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px,100%), 1fr))', gap: '0.4rem' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ display: 'block', background: '#fff', border: '1px solid #e5e0d8', padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#444', textDecoration: 'none', fontWeight: 400 }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
