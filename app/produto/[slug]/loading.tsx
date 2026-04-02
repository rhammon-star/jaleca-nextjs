export default function ProductLoading() {
  return (
    <main className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-3 w-10 bg-secondary/40 rounded animate-pulse" />
          <div className="h-3 w-3 bg-secondary/40 rounded animate-pulse" />
          <div className="h-3 w-16 bg-secondary/40 rounded animate-pulse" />
          <div className="h-3 w-3 bg-secondary/40 rounded animate-pulse" />
          <div className="h-3 w-40 bg-secondary/40 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-8 md:gap-16 lg:gap-20 items-start">
          {/* Image skeleton */}
          <div className="flex flex-col gap-3">
            <div className="aspect-[3/4] rounded-[28px] bg-secondary/40 animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-20 rounded-md bg-secondary/40 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-4 md:pt-4">
            <div className="h-3 w-12 bg-secondary/40 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-3/4 bg-secondary/40 rounded animate-pulse" />
              <div className="h-10 w-1/2 bg-secondary/40 rounded animate-pulse" />
            </div>
            <div className="h-3 w-24 bg-secondary/40 rounded animate-pulse" />
            <div className="h-8 w-32 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-48 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-40 bg-secondary/40 rounded animate-pulse" />

            <div className="h-px bg-secondary/40 my-2" />

            {/* Color selector skeleton */}
            <div>
              <div className="h-3 w-8 bg-secondary/40 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-secondary/40 rounded animate-pulse" />
                ))}
              </div>
            </div>

            {/* Size selector skeleton */}
            <div>
              <div className="h-3 w-16 bg-secondary/40 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-10 bg-secondary/40 rounded animate-pulse" />
                ))}
              </div>
            </div>

            <div className="h-px bg-secondary/40 my-2" />

            {/* Add to cart button skeleton */}
            <div className="h-14 w-full bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-56 bg-secondary/40 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </main>
  )
}
