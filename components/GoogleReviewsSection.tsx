import type { PlaceData } from '@/lib/google-places'

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const cls   = size === 'lg' ? 'text-2xl' : 'text-sm'

  return (
    <span className={`text-amber-400 leading-none ${cls}`} aria-label={`${rating} de 5 estrelas`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

// Ícone do Google SVG inline (sem dependência externa)
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.8 13.4 17.9 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.4z"/>
      <path fill="#FBBC05" d="M10.9 28.6A14.7 14.7 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.4 10.6l8.5-6z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2 1.4-4.6 2.2-7.6 2.2-6.1 0-11.2-3.9-13.1-9.4l-7.9 6.1C6.9 42.6 14.8 48 24 48z"/>
    </svg>
  )
}

export default function GoogleReviewsSection({ place }: { place: PlaceData }) {
  const { rating, reviewCount, reviews, mapsUrl } = place

  return (
    <section className="py-16 md:py-20 bg-[#faf9f7] border-t border-border">
      <div className="container">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-[13px] md:text-[11px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Avaliações verificadas
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#1a1a1a]">
              O que os clientes dizem
            </h2>
          </div>

          {/* Badge Google */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 bg-white border border-border px-8 py-5 hover:shadow-md transition-shadow duration-200 shrink-0"
            aria-label={`Ver avaliações no Google — ${rating} de 5 estrelas`}
          >
            <GoogleIcon />
            <div className="text-3xl font-bold text-[#1a1a1a] leading-none">{rating.toFixed(1)}</div>
            <StarRating rating={rating} size="sm" />
          </a>
        </div>

        {/* Cards de avaliação */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white border border-border p-6 flex flex-col gap-3"
              >
                {/* Header do review */}
                <div className="flex items-center gap-3">
                  {review.photoUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.photoUri}
                      alt={review.authorName}
                      className="w-9 h-9 rounded-full object-cover"
                      width={36}
                      height={36}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#c4a97d]/20 flex items-center justify-center text-sm font-semibold text-[#c4a97d]">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">{review.authorName}</p>
                    <p className="text-[13px] md:text-[11px] text-muted-foreground">{review.relativeTime}</p>
                  </div>
                </div>

                {/* Estrelas */}
                <StarRating rating={review.rating} size="sm" />

                {/* Texto */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Google logo pequeno */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border/60">
                  <GoogleIcon />
                  <span className="text-[12px] md:text-[10px] text-muted-foreground">Avaliação no Google</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] border border-[#1a1a1a] px-6 py-2.5 hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
          >
            Ver todas as avaliações no Google
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
