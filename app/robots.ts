import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
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
      ],
    },
    sitemap: 'https://jaleca.com.br/sitemap.xml',
  }
}
