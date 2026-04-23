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
          // Next.js build assets - não precisam ser rastreados
          '/_next/static/chunks/',
          '/_next/static/media/',
          '/_next/data/',
          '/_next/image/',
          // WordPress backend — usado apenas para backlinks, não para indexação
          '/wp-admin/',
          '/wp-login.php',
          '/wp-content/plugins/',
          '/wp-content/cache/',
          '/wp-content/uploads/',
          // APIs internas
          '/api/',
        ],
      },
      {
        // Bloqueia Googlebot de rastrear páginas de busca com parâmetros
        userAgent: 'Googlebot',
        disallow: [
          '/produtos?*sale=*',
          '/produtos?*novidades=*',
          // Bloquear TODAS combinações de filtro — são variações da página canônica
          '/produtos?*per_page=*',
          '/produtos?*shop_view=*',
          '/produtos?*sort=*',
          '/produtos?*filter_*=*',
          '/produtos?*categoria=*',
          '/produtos?*genero=*',
          '/produtos?*cat=*',
          // Páginas de cor/color — são filtragem, não páginas canônicas
          '/color/',
          '/color/*',
          // Query params de trailing slash em páginas de produto/blog
          '/*/.*\\?',  // URLs com ? após o path
        ],
      },
    ],
    sitemap: 'https://jaleca.com.br/sitemap.xml',
    host: 'https://jaleca.com.br',
  }
}
