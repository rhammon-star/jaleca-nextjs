import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jaleca.com.br",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "wp.jaleca.com.br",
        pathname: "/wp-content/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // WordPress password reset
      {
        source: '/minha-conta/lost-password',
        has: [
          { type: 'query', key: 'key', value: '(?<key>.+)' },
          { type: 'query', key: 'login', value: '(?<login>.+)' },
        ],
        destination: '/redefinir-senha?key=:key&login=:login',
        permanent: false,
      },
      // Categorias inexistentes geradas por IA → páginas reais
      { source: '/categoria/jalecos-personalizados', destination: '/produtos', permanent: true },
      { source: '/categoria/scrub', destination: '/categoria/conjuntos', permanent: true },
      { source: '/categoria/calcados', destination: '/produtos', permanent: true },
      { source: '/categoria/uniformes', destination: '/produtos', permanent: true },
      { source: '/categoria/estilo-clinico', destination: '/produtos', permanent: true },
      { source: '/categoria/vestuario-medico', destination: '/produtos', permanent: true },
      { source: '/categoria/moda-profissional-saude', destination: '/produtos', permanent: true },
      { source: '/medida', destination: '/faq', permanent: true },
      // Páginas antigas do WordPress → novas
      { source: '/shop', destination: '/produtos', permanent: true },
      { source: '/loja', destination: '/produtos', permanent: true },
      { source: '/jalecos-femininos', destination: '/categoria/jalecos-femininos', permanent: true },
      { source: '/jalecos-masculinos', destination: '/categoria/jalecos-masculinos', permanent: true },
      { source: '/jalecos', destination: '/produtos', permanent: true },
      { source: '/scrubs', destination: '/categoria/conjuntos', permanent: true },
      { source: '/product/:slug', destination: '/produto/:slug', permanent: true },
      // Slugs sem sufixo -jaleca → versão com sufixo (produtos antigos do WordPress)
      { source: '/produto/jaleco-slim-duquesa-feminino-varias-cores', destination: '/produto/jaleco-slim-duquesa-feminino-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-feminino-de-ziper-central-varias-cores', destination: '/produto/jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-feminino-de-ziper-lateral-varias-cores', destination: '/produto/jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-princesa-feminino-varias-cores', destination: '/produto/jaleco-slim-princesa-feminino-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-recortes-masculino-varias-cores', destination: '/produto/jaleco-slim-recortes-masculino-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-masculino-de-ziper-central-varias-cores', destination: '/produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-padrao-aluno-feminino-de-botao-varias-cores', destination: '/produto/jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-padrao-aluno-masculino-de-botao-varias-cores', destination: '/produto/jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca', permanent: true },
      { source: '/produto/conjunto-pijama-cirurgico-scrub-feminino-varias-cores', destination: '/produto/conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca', permanent: true },
      { source: '/produto/conjunto-pijama-cirurgico-scrub-masculino-varias-cores', destination: '/produto/conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-elastex-feminino-varias-cores', destination: '/produto/jaleco-slim-elastex-feminino-varias-cores-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-moratty-feminino-ziper-central', destination: '/produto/jaleco-slim-moratty-feminino-ziper-central-jaleca', permanent: true },
      { source: '/produto/jaleco-slim-moratty-masculino-ziper-central', destination: '/produto/jaleco-slim-moratty-masculino-ziper-central-jaleca', permanent: true },
      { source: '/produto/jaleco-universitario-unissex', destination: '/produto/jaleco-universitario-unissex-jaleca', permanent: true },
      { source: '/produto/macacao-paris-feminino', destination: '/produto/macacao-paris-feminino-jaleca', permanent: true },
      { source: '/produto-category/:slug*', destination: '/categoria/:slug*', permanent: true },
      { source: '/product-category/:slug*', destination: '/produtos', permanent: true },
      // Categorias aninhadas do site antigo → categoria simples (ex: /categoria/jalecos/jalecos-masculinos → /categoria/jalecos-masculinos)
      { source: '/categoria/:parent/:slug', destination: '/produtos', permanent: true },
      { source: '/categoria/:slug', destination: '/produtos', permanent: true },
      { source: '/cart', destination: '/produtos', permanent: true },
      { source: '/checkout', destination: '/finalizar-compra', permanent: true },
      { source: '/my-account/:path*', destination: '/minha-conta', permanent: true },
      { source: '/sobre-nos', destination: '/sobre', permanent: true },
      { source: '/contato-nos', destination: '/contato', permanent: true },
      { source: '/politica-de-privacidade', destination: '/privacidade', permanent: true },
      { source: '/politica-de-trocas', destination: '/trocas-e-devolucoes', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://embed.tawk.to; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://wp.jaleca.com.br https://lh3.googleusercontent.com https://www.facebook.com https://og:image https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://api.brevo.com; frame-src 'none'; object-src 'none';" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|mp4|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
