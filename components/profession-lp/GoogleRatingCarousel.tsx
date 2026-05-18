import type { GoogleReview } from '@/lib/google-places'

type Props = {
  rating?: number
  reviews?: GoogleReview[]
}

export default function GoogleRatingCarousel({ rating = 4.9, reviews = [] }: Props) {
  const fiveStar = reviews.filter(r => r.rating >= 5)

  return (
    <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '3px solid #c8a96e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
          <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
          <path fill="#FBBC05" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
          <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
        <strong style={{ fontSize: '2.6rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{rating.toFixed(1)}</strong>
        <div style={{ color: '#fbbc04', fontSize: '1.2rem', letterSpacing: 3 }}>★★★★★</div>
        <span style={{ fontSize: '0.82rem', color: '#666' }}>Avaliações verificadas no Google</span>
      </div>

      {fiveStar.length > 0 && (
        <div
          style={{
            maxWidth: 1200,
            margin: '2.5rem auto 0',
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '0.75rem',
            WebkitOverflowScrolling: 'touch',
          }}
          aria-label="Comentários 5 estrelas do Google"
        >
          {fiveStar.map((r, i) => (
            <article
              key={i}
              style={{
                flex: '0 0 85%',
                maxWidth: 360,
                scrollSnapAlign: 'start',
                background: '#faf9f7',
                border: '1px solid #ecead8',
                padding: '1.25rem 1.25rem 1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {r.photoUri ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photoUri} alt={r.authorName} width={36} height={36} loading="lazy" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8dec6', color: '#8a6b2f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {r.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>{r.authorName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>{r.relativeTime}</div>
                </div>
              </div>
              <div style={{ color: '#fbbc04', fontSize: '0.95rem', letterSpacing: 2, textAlign: 'left' }}>★★★★★</div>
              <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.5, textAlign: 'left', margin: 0, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                “{r.text}”
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
