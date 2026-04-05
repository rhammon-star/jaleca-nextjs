const badges = [
  { emoji: '🛡️', text: 'Compra 100% Segura' },
  { emoji: '💰', text: 'PIX 5% de desconto' },
  { emoji: '💳', text: '3x sem juros' },
  { emoji: '🏅', text: '8 Anos no Mercado' },
]

export default function TrustBadgeBar() {
  return (
    <div className="bg-secondary/30 border-b border-border py-2.5">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
          {badges.map(({ emoji, text }, i) => (
            <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">{emoji}</span>
              <span>{text}</span>
              {i < badges.length - 1 && (
                <span className="ml-3 text-border hidden sm:inline" aria-hidden="true">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
