// Posições 0-1: DESTAQUES definidos pelo dono — sempre no topo da busca e listagem
// Posições 2+: mais vendidos reais do WooCommerce (total_sales)
export const BEST_SELLER_SLUGS = [
  'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',       // DESTAQUE #1
  'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',      // DESTAQUE #2
  'jaleco-slim-princesa-feminino-varias-cores-jaleca',               // 8x vendas
  'touca-de-amarrar-jaleca',                                          // 6x
  'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',       // 5x
  'jaleco-slim-moratty-feminino-ziper-central-jaleca',               // 4x
  'jaleco-slim-duquesa-feminino-varias-cores-jaleca',                // 4x
  'jaleco-universitario-unissex-jaleca',                              // 4x
]

// Retorna true para qualquer produto na lista (para badge + ordenação na listagem)
export function isBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.includes(slug)
}

// Retorna true só para os 2 destaques principais (para destaque visual extra)
export function isFeaturedBestSeller(slug: string): boolean {
  return BEST_SELLER_SLUGS.indexOf(slug) >= 0 && BEST_SELLER_SLUGS.indexOf(slug) <= 1
}
