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
      // Páginas antigas do WordPress → novas
      { source: '/shop', destination: '/produtos', permanent: true },
      { source: '/loja', destination: '/produtos', permanent: true },
      { source: '/jalecos-femininos', destination: '/categoria/jalecos-femininos', permanent: true },
      { source: '/jalecos-masculinos', destination: '/categoria/jalecos-masculinos', permanent: true },
      { source: '/jalecos', destination: '/produtos', permanent: true },
      { source: '/scrubs', destination: '/categoria/conjuntos', permanent: true },
      { source: '/product/:slug', destination: '/produto/:slug', permanent: true },
      { source: '/produto-category/:slug*', destination: '/categoria/:slug*', permanent: true },
      { source: '/product-category/:slug*', destination: '/categoria/:slug*', permanent: true },
      // Categorias aninhadas do site antigo → categoria simples (ex: /categoria/jalecos/jalecos-masculinos → /categoria/jalecos-masculinos)
      { source: '/categoria/:parent/:slug', destination: '/categoria/:slug', permanent: true },
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
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/(.*)\\.jpg|/(.*)\\.jpeg|/(.*)\\.png|/(.*)\\.gif|/(.*)\\.ico|/(.*)\\.svg|/(.*)\\.webp|/(.*)\\.avif",
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
