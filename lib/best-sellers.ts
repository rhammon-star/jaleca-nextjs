export const BEST_SELLER_SLUGS = [
  'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
]

export function isBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.includes(slug)
}

export function isFeaturedBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.includes(slug)
}
