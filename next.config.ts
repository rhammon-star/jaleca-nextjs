import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
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
// Consolidar trailing slashes — antes de todos os redirects específicos
      { source: '/produto/:slug/', destination: '/produto/:slug', permanent: true },
      { source: '/blog/:slug/', destination: '/blog/:slug', permanent: true },
      { source: '/categoria/:slug/', destination: '/categoria/:slug', permanent: true },
      { source: '/cidade/:slug/', destination: '/cidade/:slug', permanent: true },
      { source: '/dia-das-maes/:slug/', destination: '/dia-das-maes/:slug', permanent: true },
      // Trailing slash catch-all genérico para qualquer outra rota
      // TESTE 24/04/2026 — COMENTADO (suspeita de causar loop em /)
      // { source: '/:path*/', destination: '/:path*', permanent: true },
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
      { source: '/categoria/calcas', destination: '/produtos', permanent: true },
      { source: '/categoria/scrub', destination: '/categoria/conjuntos', permanent: true },
      // Correções de produto/profissão (26/04/2026)
      { source: '/conjunto-pastor', destination: '/jaleco-pastor', permanent: true },
      { source: '/jaleco-cozinheiro', destination: '/dolma-cozinheiro', permanent: true },
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
      { source: '/jalecos', destination: '/categoria/jalecos', permanent: true },
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
      { source: '/categoria/:parent/:slug/', destination: '/categoria/:slug', permanent: true },
      { source: '/categoria/:parent/:slug', destination: '/categoria/:slug', permanent: true },
      // Slugs antigos do WooCommerce que não existem no Next.js → /produtos
      { source: '/categoria/dolmas', destination: '/categoria/domas', permanent: true },
      { source: '/categoria/dolmas-femininas', destination: '/categoria/domas-femininas', permanent: true },
      { source: '/categoria/dolmas-masculinas', destination: '/categoria/domas-masculinas', permanent: true },
      { source: '/categoria/scrubs', destination: '/categoria/conjuntos', permanent: true },
      // Blog posts com slug errado → slug correto (404 detectado no Screaming Frog)
      { source: '/blog/como-escolher-o-jaleco-ideal-para-sua-especialidade-medica', destination: '/blog/como-escolher-jaleco-ideal-especialidade-medica-2', permanent: true },
      { source: '/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica-2', destination: '/blog', permanent: true },
      // Redirects artigos deletados (duplicados removidos 17/04/2026) → versão canônica
      { source: '/blog/como-lavar-jaleco-branco-na-maquina', destination: '/blog/como-lavar-jaleco-profissional-guia-completo', permanent: true },
      { source: '/blog/como-lavar-jaleco-branco', destination: '/blog/como-lavar-jaleco-profissional-guia-completo', permanent: true },
      { source: '/blog/como-lavar-e-conservar-seu-jaleco-profissional-2', destination: '/blog/como-lavar-jaleco-profissional-guia-completo', permanent: true },
      { source: '/blog/jaleco-slim-ou-classico-qual-escolher', destination: '/blog/jaleco-slim-vs-jaleco-classico-qual-escolher', permanent: true },
      { source: '/blog/jaleco-slim-vs-tradicional-qual-escolher', destination: '/blog/jaleco-slim-vs-jaleco-classico-qual-escolher', permanent: true },
      { source: '/blog/como-escolher-tamanho-jaleco-feminino', destination: '/blog/como-escolher-tamanho-jaleco-feminino-guia-medidas', permanent: true },
      { source: '/blog/guia-completo-tamanhos-jaleco-como-medir-corretamente-2', destination: '/blog/como-escolher-tamanho-jaleco-feminino-guia-medidas', permanent: true },
      { source: '/blog/dolma-ou-jaleco-diferenca', destination: '/blog/dolma-vs-jaleco-diferenca-quando-usar', permanent: true },
      { source: '/blog/jaleco-dentista-o-que-usar', destination: '/blog/jaleco-dentista-modelos-cores-como-escolher', permanent: true },
      { source: '/blog/jaleco-dentista-estilo-praticidade-consultorio-2', destination: '/blog/jaleco-dentista-modelos-cores-como-escolher', permanent: true },
      { source: '/blog/jaleco-feminino-premium-como-escolher', destination: '/blog/como-escolher-jaleco-feminino-guia-profissionais', permanent: true },
      { source: '/blog/jaleco-feminino-slim-estilo-e-conforto', destination: '/blog/jaleco-slim-feminino-favorito-medicas', permanent: true },
      { source: '/blog/como-escolher-jaleco-ideal-especialidade-medica-2', destination: '/blog/como-escolher-jaleco-feminino-guia-profissionais', permanent: true },
      { source: '/blog/jaleco-slim-padrao-clinicas', destination: '/blog/jaleco-slim-feminino-favorito-medicas', permanent: true },
      { source: '/blog/guia-jaleco-dentista-modelos-cores-como-escolher', destination: '/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher', permanent: true },
      { source: '/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica', destination: '/blog', permanent: true },
      // Páginas 404 detectadas na análise (19/04/2026)
      { source: '/dolma', destination: '/categoria/domas', permanent: true },
      { source: '/conjunto', destination: '/categoria/conjuntos', permanent: true },
      { source: '/uniformes-profissionais', destination: '/uniformes-profissionais-saude', permanent: true },
      { source: '/conjunto-pijama-cirurgico', destination: '/categoria/conjuntos', permanent: true },
      // Domínios satélite — 301 para jaleca.com.br (21/04/2026)
      { source: '/:path*', has: [{ type: 'host', value: 'lojadejaleco.com.br' }], destination: 'https://jaleca.com.br/loja-jaleco', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.lojadejaleco.com.br' }], destination: 'https://jaleca.com.br/loja-jaleco', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'comprarjaleco.com.br' }], destination: 'https://jaleca.com.br/comprar-jaleco-online', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.comprarjaleco.com.br' }], destination: 'https://jaleca.com.br/comprar-jaleco-online', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecouniversitario.com.br' }], destination: 'https://jaleca.com.br/jaleco-universitario', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecouniversitario.com.br' }], destination: 'https://jaleca.com.br/jaleco-universitario', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecoluxo.com.br' }], destination: 'https://jaleca.com.br/jaleco-premium', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecoluxo.com.br' }], destination: 'https://jaleca.com.br/jaleco-premium', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecomedico.com.br' }], destination: 'https://jaleca.com.br/jaleco-medico', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecomedico.com.br' }], destination: 'https://jaleca.com.br/jaleco-medico', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecopremium.com.br' }], destination: 'https://jaleca.com.br/jaleco-premium', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecopremium.com.br' }], destination: 'https://jaleca.com.br/jaleco-premium', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecopreto.com.br' }], destination: 'https://jaleca.com.br/jaleco-preto', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecopreto.com.br' }], destination: 'https://jaleca.com.br/jaleco-preto', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecoprincesa.com.br' }], destination: 'https://jaleca.com.br/jaleco-feminino', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecoprincesa.com.br' }], destination: 'https://jaleca.com.br/jaleco-feminino', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecoslim.com.br' }], destination: 'https://jaleca.com.br/jaleco-feminino', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecoslim.com.br' }], destination: 'https://jaleca.com.br/jaleco-feminino', permanent: true },
      // Jaleco slim — redireciona para página feminina (principal usuário do slim)
      { source: '/jaleco-slim', destination: '/jaleco-feminino', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'jalecomasculino.com.br' }], destination: 'https://jaleca.com.br/jaleco-masculino', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'www.jalecomasculino.com.br' }], destination: 'https://jaleca.com.br/jaleco-masculino', permanent: true },
      // Trailing slash consolidation
      { source: '/produtos/', destination: '/produtos', permanent: true },
      { source: '/nossas-lojas/', destination: '/nossas-lojas', permanent: true },
      // /produtos/{categoria} → /produtos?categoria=X
      { source: '/produtos/jalecos', destination: '/produtos?categoria=Jalecos', permanent: true },
      { source: '/produtos/conjuntos', destination: '/produtos?categoria=Conjuntos', permanent: true },
      { source: '/produtos/dolmas', destination: '/produtos?categoria=D%C3%B3lm%C3%A3s', permanent: true },
      { source: '/produtos/domas', destination: '/produtos?categoria=D%C3%B3lm%C3%A3s', permanent: true },
      { source: '/produtos/acessorios', destination: '/produtos?categoria=Acess%C3%B3rios', permanent: true },
      // URLs antigas do WordPress
      { source: '/loja-matriz', destination: '/nossas-lojas', permanent: true },
      { source: '/color/:slug*', destination: '/produtos', permanent: true },
      { source: '/tag/:slug*', destination: '/produtos', permanent: true },
      { source: '/politica-de-privacidade/', destination: '/privacidade', permanent: true },
      { source: '/cart', destination: '/produtos', permanent: true },
      { source: '/checkout', destination: '/finalizar-compra', permanent: true },
      { source: '/my-account/:path*', destination: '/minha-conta', permanent: true },
      { source: '/sobre-nos', destination: '/sobre', permanent: true },
      { source: '/contato-nos', destination: '/contato', permanent: true },
      { source: '/politica-de-privacidade', destination: '/privacidade', permanent: true },
      { source: '/politica-de-trocas', destination: '/trocas-e-devolucoes', permanent: true },
      // ── 36 URL renames (25/04/2026) — remove 'de'/'para' for SEO ─────────
      { source: '/jaleco-para-advogado', destination: '/jaleco-advogado', permanent: true },
      { source: '/jaleco-para-barbeiro', destination: '/jaleco-barbeiro', permanent: true },
      { source: '/jaleco-para-biomedico', destination: '/jaleco-biomedico', permanent: true },
      { source: '/jaleco-para-cabeleireiro', destination: '/jaleco-cabeleireiro', permanent: true },
      { source: '/jaleco-para-churrasqueiro', destination: '/jaleco-churrasqueiro', permanent: true },
      { source: '/jaleco-para-cozinheiro', destination: '/jaleco-cozinheiro', permanent: true },
      { source: '/jaleco-para-dentista', destination: '/jaleco-dentista', permanent: true },
      { source: '/jaleco-para-dona-de-casa', destination: '/jaleco-dona-casa', permanent: true },
      { source: '/jaleco-para-enfermagem', destination: '/jaleco-enfermagem', permanent: true },
      { source: '/jaleco-para-enfermeiro', destination: '/jaleco-enfermeiro', permanent: true },
      { source: '/jaleco-para-esteticista', destination: '/jaleco-esteticista', permanent: true },
      { source: '/jaleco-para-farmaceutico', destination: '/jaleco-farmaceutico', permanent: true },
      { source: '/jaleco-para-fisioterapeuta', destination: '/jaleco-fisioterapeuta', permanent: true },
      { source: '/jaleco-para-massagista', destination: '/jaleco-massagista', permanent: true },
      { source: '/jaleco-para-medico', destination: '/jaleco-medico', permanent: true },
      { source: '/jaleco-para-nutricionista', destination: '/jaleco-nutricionista', permanent: true },
      { source: '/jaleco-para-pastor', destination: '/jaleco-pastor', permanent: true },
      { source: '/jaleco-para-podologo', destination: '/jaleco-podologo', permanent: true },
      { source: '/jaleco-para-professor', destination: '/jaleco-professor', permanent: true },
      { source: '/jaleco-para-psicologa', destination: '/jaleco-psicologa', permanent: true },
      { source: '/jaleco-para-secretaria', destination: '/jaleco-secretaria', permanent: true },
      { source: '/jaleco-para-sushiman', destination: '/jaleco-sushiman', permanent: true },
      { source: '/jaleco-para-tatuador', destination: '/jaleco-tatuador', permanent: true },
      { source: '/jaleco-para-vendedor', destination: '/jaleco-vendedor', permanent: true },
      { source: '/jaleco-para-veterinario', destination: '/jaleco-veterinario', permanent: true },
      { source: '/conjunto-para-advogado', destination: '/conjunto-advogado', permanent: true },
      { source: '/conjunto-para-farmaceutico', destination: '/conjunto-farmaceutico', permanent: true },
      { source: '/conjunto-para-pastor', destination: '/conjunto-pastor', permanent: true },
      { source: '/conjunto-para-psicologa', destination: '/conjunto-psicologa', permanent: true },
      { source: '/dolma-para-churrasqueiro', destination: '/dolma-churrasqueiro', permanent: true },
      { source: '/dolma-para-cozinheiro', destination: '/dolma-cozinheiro', permanent: true },
      { source: '/dolma-para-sushiman', destination: '/dolma-sushiman', permanent: true },
      { source: '/uniforme-para-professor', destination: '/uniforme-professor', permanent: true },
      { source: '/loja-de-jaleco', destination: '/loja-jaleco', permanent: true },
      { source: '/melhor-marca-de-jaleco', destination: '/melhor-marca-jaleco', permanent: true },
      { source: '/uniformes-profissionais-para-saude', destination: '/uniformes-profissionais-saude', permanent: true },

    // Correção de slugs restantes (26/04/2026)
    {
      source: '/produto/jaleco-slim-recortes-masculino-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-recortes-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-princesa-feminino-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-princesa-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-moratty-masculino-ziper-central-jaleca',
      destination: '/produto/jaleco-slim-moratty-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-moratty-feminino-ziper-central-jaleca',
      destination: '/produto/jaleco-slim-moratty-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-elastex-feminino-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-elastex-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-duquesa-feminino-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-duquesa-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
      destination: '/produto/jaleco-padrao-aluno-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
      destination: '/produto/jaleco-padrao-aluno-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
      destination: '/produto/conjunto-dolma-cozinheiro-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
      destination: '/produto/conjunto-dolma-cozinheiro-feminino-jaleca',
      permanent: true,
    },

    // Correção de slugs (26/04/2026)
    {
      source: '/produto/jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-tradicional-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-feminino-lateral-jaleca',
      permanent: true,
    },
    {
      source: '/produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
      destination: '/produto/jaleco-slim-tradicional-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
      destination: '/produto/conjunto-scrub-masculino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
      destination: '/produto/conjunto-scrub-feminino-jaleca',
      permanent: true,
    },
    {
      source: '/produto/conjunto-pijama-cirurgico-princesa-scrub-feminino-varias-cores-jaleca',
      destination: '/produto/conjunto-princesa-nobre-feminino-jaleca',
      permanent: true,
    },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://embed.tawk.to https://t.contentsquare.net https://www.gstatic.com https://googleads.g.doubleclick.net https://bat.bing.net https://bat.bing.com https://www.clarity.ms https://*.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://wp.jaleca.com.br https://lh3.googleusercontent.com https://www.facebook.com https:; connect-src 'self' https://wp.jaleca.com.br https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://api.brevo.com https://api.pagar.me https://t.contentsquare.net https://c.ba.contentsquare.net https://tcvsapi.contentsquare.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://conversionsapigateway.com https://*.conversionsapigateway.com https://*.a.run.app https://bat.bing.net https://bat.bing.com https://www.clarity.ms https://*.clarity.ms; worker-src 'self' blob:; frame-src https://www.google.com https://bid.g.doubleclick.net; object-src 'none';" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
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
