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
          // Next.js internos — não indexar (JS, CSS, fontes com ?dpl= estavam sendo rastreados)
          '/_next/',
          // Variações específicas de produto (?vid=) — duplicatas das páginas de cor
          '/*?vid=',
          '/*?vid=*',
          // Querystrings legacy WordPress que ainda aparecem no índice
          '/?wc-ajax=',
          '/?add-to-cart=',
          '/*?wc-ajax=',
          '/*?add-to-cart=',
          '/*?replytocom=',
          '/*?orderby=',
          '/*?page_id=',
          '/wp-login.php',
          '/wp-register.php',
          '/wp-signup.php',
          // WordPress backend — usado apenas para backlinks, não para indexação
          '/wp-admin/',
          '/wp-login.php',
          '/wp-content/plugins/',
          '/wp-content/cache/',
          '/wp-content/uploads/',
          '/wp-content/themes/',
          // APIs internas
          '/api/',
        ],
      },
      // Bots de IA — explicitamente liberados para indexação e treino/citação
      // (GPTBot=OpenAI, ClaudeBot/anthropic-ai=Anthropic, PerplexityBot=Perplexity,
      //  Google-Extended=Bard/Gemini, CCBot=Common Crawl, Applebot-Extended=Apple Intelligence,
      //  Bytespider=ByteDance/TikTok, Amazonbot=Alexa, DuckAssistBot=DuckDuckGo)
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'DuckAssistBot', allow: '/' },
      { userAgent: 'Meta-ExternalAgent', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
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
