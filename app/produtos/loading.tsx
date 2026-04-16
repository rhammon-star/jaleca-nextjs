export default function ProdutosLoading() {
  return (
    <main className="bg-background min-h-screen">
      {/* Logo + indicador de carregamento */}
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Jaleca" width={140} height={70} style={{ height: '70px', width: 'auto', opacity: 0.7 }} />
        <div className="flex items-center gap-2 text-muted-foreground text-xs tracking-widest uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-1">Carregando produtos</span>
        </div>
      </div>

      <div className="container pb-16">
        {/* Filtros de categoria skeleton */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[70, 90, 80, 100, 85, 95].map((w, i) => (
            <div key={i} className="h-8 rounded-full bg-secondary/40 animate-pulse" style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Filtros de cor skeleton */}
        <div className="flex gap-2 mb-8">
          {[75, 75, 90].map((w, i) => (
            <div key={i} className="h-8 rounded-full bg-secondary/40 animate-pulse" style={{ width: `${w}px` }} />
          ))}
        </div>

        {/* Grid de produtos skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[3/4] bg-secondary/40 animate-pulse" />
              <div className="h-3 w-3/4 bg-secondary/40 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-secondary/40 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-secondary/40 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
