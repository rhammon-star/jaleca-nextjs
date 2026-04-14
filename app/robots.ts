import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/blog/admin/',
          '/api/',
          '/finalizar-compra',
          '/minha-conta',
          '/pedido-confirmado/',
          '/redefinir-senha',
          '/wishlist',
          '/comparar',
          '/checkout',
          '/pagamento',
        ],
      },
      {
        // Bloqueia Googlebot de rastrear páginas de busca com parâmetros
        userAgent: 'Googlebot',
        disallow: [
          '/produtos?*sale=*',
          '/produtos?*novidades=*',
        ],
      },
    ],
    sitemap: 'https://jaleca.com.br/sitemap.xml',
    host: 'https://jaleca.com.br',
  }
}
