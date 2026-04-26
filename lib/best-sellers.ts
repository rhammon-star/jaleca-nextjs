export const BEST_SELLER_SLUGS = [
  'jaleco-slim-tradicional-feminino-jaleca',
  'jaleco-slim-tradicional-masculino-jaleca',
  'conjunto-scrub-feminino-jaleca',
]

export function isBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.includes(slug)
}

export function isFeaturedBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.includes(slug)
}
