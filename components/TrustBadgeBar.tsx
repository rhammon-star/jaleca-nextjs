const badges = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
        <rect x="9" y="11" width="14" height="10" rx="2"/>
        <circle cx="12" cy="16" r="1"/>
        <circle cx="20" cy="16" r="1"/>
      </svg>
    ),
    text: 'Frete grátis para o Sudeste',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    text: 'Compra 100% Segura',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    text: 'PIX 5% de desconto',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
        <line x1="6" y1="15" x2="10" y2="15"/>
      </svg>
    ),
    text: '3x sem juros',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    text: '8 Anos no Mercado',
  },
]

export default function TrustBadgeBar() {
  return (
    <div className="bg-secondary/30 border-b border-border py-2.5">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[13px] md:text-[11px] text-muted-foreground">
          {badges.map(({ icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true" className="text-foreground/50">{icon}</span>
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
