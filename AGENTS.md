<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Jaleca — Next.js E-commerce

Site de uniformes médicos (jalecos/scrubs). Diretório: `/Users/rhammon/SiteJaleca/jaleca-nextjs`

## Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS v3.4
- WooCommerce GraphQL + REST API (`https://jaleca.com.br/graphql`)
- Pagar.me v5 (direto, sem plugin WC)
- WordPress REST API (email via wp_mail)
- Gemini AI (gemini-2.5-flash) para blog

## Status das integrações
- WooCommerce GraphQL: ✅
- Carrinho: ✅ localStorage
- Pagamentos Pagar.me: ✅ PIX ✅ Boleto ✅ Cartão de Crédito (testado e funcionando)
- Email confirmação de pedido: ✅ via Brevo (lib/email.ts → sendOrderConfirmation)
- Email de senha (novo cliente): ✅ aponta para wp.jaleca.com.br/wp-login.php (via forgot-password route)
- Verificação de email: ✅ (não bloqueia checkout)
- Blog admin com IA: ✅ (geração, humanização, SEO, imagem, seletor de categoria, deletar post)
- Melhor Envio shipping: ⚠️ token placeholder, usa fallback
- Analytics (GA4/Meta Pixel): ✅ GA4 G-SHBE64GDP7 + Meta Pixel 936912792527674 configurados
- Meta Conversions API (server-side): ✅ Purchase via cartão e webhook PIX/boleto (testado e confirmado)
- Login CPF existente no checkout: ✅ endpoint jaleca/v1/login via wp_authenticate()
- Webhook Pagar.me: ✅ configurado (charge.paid + charge.payment_failed)

## Pagamentos — arquivos principais
- `lib/pagarme.ts` — cliente Pagar.me v5
- `app/api/payment/create/route.ts` — cria pedido WC + chama Pagar.me
- `app/api/payment/status/route.ts` — polling de status
- `app/api/payment/webhook/route.ts` — webhooks Pagar.me
- `app/pagamento/page.tsx` — tela de resultado (PIX/Boleto/Cartão)
- `app/checkout/CheckoutClient.tsx` — tokenização client-side + submit

## Regras críticas de implementação

### Pagar.me v5 — cartão com card_token
`billing_address` DEVE ficar dentro de `credit_card.card`, NÃO diretamente em `credit_card`:
```json
"credit_card": {
  "card_token": "token_xxx",
  "card": {
    "billing_address": { "line_1": "...", "zip_code": "...", "city": "...", "state": "...", "country": "BR" }
  }
}
```
Também enviar `billing: { name, address }` no nível do pedido.

### Imagens
- Hero: `<img>` nativa com `w-full h-auto block` — NÃO usar next/image para o hero
- Hero backup: `public/jaleco-hero-ORIGINAL.jpg`

### Header
- Tailwind flex não aplicava ao `.container` — corrigido com inline styles no inner div

### Email
- **Provedor: Brevo** (antigo Sendinblue) — envia direto do Next.js via API REST, sem depender do WordPress
- `BREVO_API_KEY` no Vercel (Production + Preview) e em `.env.local`
- Remetente: `contato@jaleca.com.br` (domínio `jaleca.com.br` autenticado no Brevo com DKIM + DMARC)
- `lib/email.ts` → `sendMail()` chama `https://api.brevo.com/v3/smtp/email` com header `api-key`
- Funções disponíveis: `sendOrderConfirmation()`, `sendOrderShipped()`, `sendWelcome()`, `sendEmailVerification()`, `sendPasswordReset()`, `sendCartRecovery()`
- Email de confirmação: template completo com logo, tabela de itens, frete, endereço
- WooCommerce "Processando pedido" desativado (WooCommerce → Configurações → Emails) — evita duplicata com o email do Next.js
- Logo no email: `https://jaleca.com.br/logo-full.jpg`
- Novo cliente no checkout → conta criada automaticamente + email de definição de senha via `app/api/auth/forgot-password/route.ts` → chama `wp.jaleca.com.br/wp-login.php?action=lostpassword`
- `NEXT_PUBLIC_WP_URL=https://wp.jaleca.com.br` no Vercel — usado em forgot-password e reset
- **ATENÇÃO**: Vercel não consegue alcançar `wp.jaleca.com.br` via HTTP (ETIMEDOUT) — NÃO usar o endpoint WordPress para email, usar sempre o Brevo

### WooCommerce
- Checkout slug: `finalizar-compra` (não `checkout`)
- `wp-config.php` tem permissão 0600 — definir constantes em `functions.php`

## Login de usuário (CPF existente)
- Endpoint WordPress customizado: `POST /wp-json/jaleca/v1/login`
- Definido em functions.php (jaleca_login_handler) — usa wp_authenticate()
- Next.js chama via `/api/auth/login` → sem JWT Auth plugin (não precisar instalar)
- Token retornado: wp_hash(user_id + email + AUTH_KEY) — não-expirável, aceito em /api/orders

## Blog admin — arquivos principais
- `app/blog/admin/novo-post/NovoPostClient.tsx` — criação de post com IA + seletor de categoria
- `app/blog/admin/posts/page.tsx` — lista de posts com botão de deletar (client component)
- `app/blog/[slug]/page.tsx` — página pública do post (usa @tailwindcss/typography para prose)
- `app/api/blog/categories/route.ts` — GET categorias do WordPress
- `app/api/blog/posts/[id]/route.ts` — DELETE post do WordPress
- `app/api/blog/publish/route.ts` — publica/rascunho no WordPress (aceita `categories`)
- `lib/ai-content.ts` — geração, humanização, SEO via Gemini. `stripMarkdownCodeBlock()` remove wrapper ```html da resposta
- Categorias devem existir no WordPress Admin → Posts → Categorias antes de aparecerem no seletor

## Hospedagem — decisão final
- **Next.js:** Vercel Pro — deploy automático via GitHub, trial 14 dias (adicionar cartão)
- **WordPress:** Hostinger Basic (Hospedagem de Sites) — só para API/WooCommerce
- **Domínio:** registro.br — titular é o usuário (jaleca.com.br)
- WordPress backup: All-in-One WP Migration — arquivo `.wpress` (3.06 GB) gerado e enviado ao servidor
- DNS: após backup importado no Hostinger, apontar jaleca.com.br → Vercel

## Migração WordPress → Hostinger (concluída ✅)
- WordPress instalado em: `~/domains/wp.jaleca.com.br/public_html/`
- Domínio WordPress: `https://wp.jaleca.com.br` (wp-admin: wp.jaleca.com.br/wp-admin, usuário admin: Ana Luiza)
- SSH: `ssh -p 65002 u537333031@82.25.73.174` (senha SSH separada da conta Hostinger)
- WP-CLI disponível no servidor (`wp --info` funciona)
- Migração feita com **Migrate Guru** (gratuito, sem limite de tamanho) — direto site-a-site
- Plugin "All In One WP Security" desativado (bloqueava wp-login.php) — deixar desativado
- Banco de dados: `u537333031_MJ3tY`, usuário: `u537333031_UKhGC`, host: `127.0.0.1`
- PHP memory_limit: 512M (definido em .user.ini)

## Plugin WordPress — jaleca-api.php
- Arquivo em `/Users/rhammon/Downloads/jaleca-api.php`
- Instalado em: `~/domains/wp.jaleca.com.br/public_html/wp-content/plugins/jaleca-api/jaleca-api.php`
- Contém: dimensões padrão produtos, ordenação por estoque, campos checkout, endpoints jaleca/v1/send-email, jaleca/v1/login, wc/v3/jaleca-cpf-lookup
- CPF lookup usa query direta no $wpdb (rápido, sem get_users)
- WPGraphQL campo customizado `jalecaGalleryImages` em `ProductVariation` — lê meta `_woo_variation_gallery_images` e retorna sourceUrl/altText
- Frontend do WordPress redireciona para jaleca.com.br (301) — wp-admin, REST e GraphQL continuam funcionando
- Webhook `woocommerce_new_product` chama `jaleca.com.br/api/revalidate` para atualizar /produtos em tempo real ao cadastrar produto novo
- Requer variável de ambiente `REVALIDATE_SECRET` no Vercel E no servidor WordPress (como env var do sistema)

## DNS — registro.br (configurado ✅)
Registros configurados em registro.br (modo avançado):
- A: jaleca.com.br → 216.198.79.1 (Vercel)
- A: wp.jaleca.com.br → 82.25.73.174 (Hostinger WordPress)
- CNAME: www.jaleca.com.br → bc060d04fd865036.vercel-dns-017.com
- MX 1: aspmx.l.google.com
- MX 5: alt1.aspmx.l.google.com, alt2.aspmx.l.google.com
- MX 10: alt3.aspmx.l.google.com, alt4.aspmx.l.google.com

## Cache — arquitetura atual
- `unstable_cache` REMOVIDO de `app/produto/[slug]/page.tsx` e `app/page.tsx` — causava conflito com `revalidatePath`
- `revalidate = 0` na página de produto (busca dados frescos a cada request) — pode ser aumentado para 300 quando estável
- `vercel.json` configura `buildCommand: "next build && node scripts/warm-cache.mjs"` — aquece cache automaticamente após cada deploy
- `app/api/revalidate/route.ts` — endpoint seguro para revalidar paths (requer header `x-revalidate-secret: jaleca-revalidate-2024`)
- `REVALIDATE_SECRET=jaleca-revalidate-2024` configurado no Vercel E hardcoded em `jaleca-api.php`
- `app/api/products-by-slugs/route.ts` — proxy server-side para RecentlyViewed (evita chamada cross-origin ao WordPress)
- warm-cache manual: `npm run warm-cache`
- **ATENÇÃO Next.js 16**: `revalidateTag` requer 2 argumentos nessa versão — NÃO usar sem verificar a assinatura. Usar `revalidatePath` em vez disso.

## Produtos — regras críticas
- Query GraphQL usa `variations(first: 100)` — WPGraphQL tem limite padrão de 10, produtos com mais de 10 variações precisam desse parâmetro
- Variações sem preço no WooCommerce NÃO aparecem no site (WPGraphQL não as retorna)
- Ordem dos tamanhos: PP → P → M → G → GG → G1 → G2 → G3 (definido em `ProductDetailClient.tsx`)
- Ao adicionar novos tamanhos/cores no WC: criar as variações em Dados do produto → Variações → "Gerar variações"
- Revalidação automática: jaleca-api.php dispara `woocommerce_update_product` → chama `jaleca.com.br/api/revalidate`
- Revalidação manual: `node -e "fetch('https://jaleca.com.br/api/revalidate',{method:'POST',headers:{'Content-Type':'application/json','x-revalidate-secret':'jaleca-revalidate-2024'},body:JSON.stringify({paths:['/produtos','/produto/SLUG']})}).then(r=>r.json()).then(console.log)"`

## SEO — estado atual (2026-04-04)
- PageSpeed celular: 69 / desktop: 83 (SEO 100, Práticas 100, Acessibilidade 95)
- Hero image otimizada: WebP responsivo — mobile 21 KB, desktop 72 KB (era 583 KB JPG)
  - `public/jaleco-hero-mobile.webp` (800px) — `public/jaleco-hero-desktop.webp` (1600px)
  - `<picture>` com `media` queries no `app/page.tsx`
  - Preload no `app/layout.tsx` com `media` attribute
- `width={3155} height={3871}` na img hero para evitar CLS
- Redirects de URLs antigas do WordPress → `next.config.ts` (redirects permanentes 301)
  - `/shop` → `/produtos`, `/jalecos-femininos` → `/categoria/jalecos-femininos`, etc.
  - `/categoria/:parent/:slug` → `/categoria/:slug` (URLs aninhadas antigas)
- Schema JSON-LD implementados:
  - `Organization` + `WebSite` (SearchAction) + `ClothingStore` (LocalBusiness) — home
  - `Product` com `manufacturer`, `color`, `size`, `aggregateRating`, `review` — produto
  - `BreadcrumbList` — categoria e produto
  - `CollectionPage` — categoria
  - `Blog` + `BlogPosting` — /blog
  - `Article` — /blog/[slug]
  - `FAQPage` — /trocas-e-devolucoes
  - `ContactPage` — /contato
- Descrições de categoria enriquecidas com keywords secundárias (jaleco enfermagem, scrub cirúrgico, etc.)
- Sitemap processado pelo Google (30 páginas, 03/04/2026)
- **SEO pendente de alta prioridade:**
  - Criar página `/faq` com FAQPage schema (aparece como resposta destacada no Google)
  - Adicionar H2 dinâmico em `/produtos` quando filtro ativo
  - Blog: 10 artigos otimizados para palavras-chave de alto interesse

## Analytics — estado atual
- GA4: `NEXT_PUBLIC_GA4_ID=G-SHBE64GDP7` ✅ configurado no Vercel
- Meta Pixel: `NEXT_PUBLIC_META_PIXEL_ID=936912792527674` ✅ configurado no Vercel
- Meta Conversions API token: `META_CONVERSIONS_API_TOKEN` ✅ configurado no Vercel
- Eventos browser Pixel: PageView, ViewContent, AddToCart, Purchase — arquivo `components/Analytics.tsx`
- Eventos server-side CAPI: Purchase (cartão em `payment/create`, PIX/boleto via webhook) — arquivo `lib/meta-conversions.ts`
- Deduplicação: `event_id: purchase_${orderId}` igual no browser e no servidor
- Dados do usuário: hasheados SHA-256 (email, telefone, nome, cidade, estado, CEP, país)
- Cookies `_fbc` / `_fbp` capturados do browser para atribuição de anúncios
- Speed Insights Vercel: instalado e ativo

## PLANO COMPLETO — O QUE FALTA

### FASE 1 — Lançamento (urgente)
- [x] Testar cartão de crédito com compra real no Pagar.me ✅
- [x] Configurar Webhook Pagar.me → `jaleca.com.br/api/payment/webhook` ✅ (charge.paid + charge.payment_failed)
- [x] WooCommerce atualiza para "Processando" imediatamente após cartão aprovado ✅
- [x] Email de confirmação via Brevo ✅ (lib/email.ts → sendOrderConfirmation, direto do Vercel)
- [x] Email novo cliente — "defina sua senha" via Brevo ✅ (app/api/auth/forgot-password/route.ts)
- [x] Migrar envio de email para Brevo ✅ (domínio jaleca.com.br autenticado, BREVO_API_KEY no Vercel)
- [x] GA4 G-SHBE64GDP7 configurado (Vercel env vars) ✅
- [x] Meta Pixel 936912792527674 + Conversions API server-side ✅ (Purchase via Servidor testado e confirmado)
- [x] Variações de produto (G1, G2, G3) aparecendo ✅ — `variations(first: 100)` no GraphQL
- [x] Ordem dos tamanhos PP→P→M→G→GG→G1→G2→G3 ✅ — sizeOrder em ProductDetailClient.tsx
- [x] Revalidação de produto em tempo real ✅ — jaleca-api.php dispara woocommerce_update_product
- [ ] Testar boleto com compra real no Pagar.me
- [ ] Verificar pedidos aparecendo no WooCommerce após pagamento PIX
- [ ] Remover META_TEST_EVENT_CODE do Vercel (após testes concluídos)
- [x] Google Search Console — sitemap `jaleca.com.br/sitemap.xml` processado ✅ (30 páginas, 03/04/2026)
- [x] Sitemap inclui produtos e posts do blog ✅

### FASE 2 — Operacional (próximas 2 semanas)
- [ ] Melhor Envio OAuth2 — substituir token placeholder pelo real
- [ ] Testar cálculo de frete no checkout com CEP real
- [ ] Frete grátis progressivo — "faltam R$X para frete grátis" no carrinho
- [ ] Página de Política de Entrega e Prazos
- [ ] Página de Política de Troca e Devolução
- [ ] Página Sobre a Jaleca
- [ ] FAQ — tamanho, material, lavagem, troca
- [ ] Completar cadastro de todos os produtos com fotos de todas as variações
- [x] REVALIDATE_SECRET configurado ✅ (hardcoded em jaleca-api.php + Vercel)
- [ ] Tabela de medidas completa por modelo

### FASE 3 — Marketing (primeiros 30 dias)
- [x] Feed Google Shopping criado ✅ — `app/api/feed/google-shopping/route.ts`, URL: `jaleca.com.br/api/feed/google-shopping`
- [x] Produtos da home filtrados por destaque ✅ — GET_PRODUCTS usa `where: { featured: true }` (marcar ⭐ em Produtos no WC admin)
- [~] Google Merchant Center — feed registrado, aguardando processamento. Verificar se já atualizou.
  - Se ainda mostrar 0 produtos: deletar e re-registrar como tipo XML explícito
- [x] Meta Commerce Manager — 273 produtos importados via feed ✅ (catálogo "Jaleca_Products")
- [ ] Instagram Shopping — **BLOQUEADO**: Página Jaleca (ID: 302241233666850) é propriedade de "BM 01 - Jaleca.Jaleca" (possível agência antiga). Solicitação de transferência enviada mas aguarda aprovação do BM proprietário.
  - Opção 1: Tentar pelo app Instagram → Configurações → Empresa → Shopping
  - Opção 2: Contatar Meta support em facebook.com/help/contact para reclamar a Página
  - Opção 3: Localizar a agência antiga e pedir para liberar o BM
- [ ] Primeira campanha Meta Ads com catálogo dinâmico
- [ ] Remarketing — reimpactar visitantes que não compraram
- [ ] Google Ads — palavras-chave: "jaleco feminino premium", "jaleco enfermagem"
- [ ] Recuperação de carrinho abandonado — email automático (1h, 24h, 72h)
- [ ] Cupom de primeira compra funcional no popup
- [ ] Calendário de conteúdo mensal (fotos, Reels, stories)
- [ ] Vídeo 15s do jaleco sendo vestido para Reels/TikTok
- [ ] Email marketing — escolher plataforma (Klaviyo/Mailchimp/RD Station)
- [ ] Conectar captura de leads do popup à plataforma de email
- [ ] Fluxo de boas-vindas para novos cadastros
- [ ] WhatsApp Business com catálogo integrado

### FASE 4 — Crescimento (30 a 90 dias)
- [ ] Blog SEO — 10 artigos otimizados (estrutura já existe)
- [ ] Parceria com 5 influenciadores da saúde (micro, 10k-100k seguidores)
- [ ] Avaliações com foto — incentivar clientes
- [ ] Depoimentos em vídeo de clientes reais
- [ ] Programa de indicação — "indique um colega, ganhe R$30"
- [ ] Cashback ou programa de pontos
- [ ] Email pós-venda automático 30 dias após compra
- [ ] Lista de espera para esgotados com email automático
- [ ] Parcerias com sites de faculdades de medicina/enfermagem

### FASE 5 — Escala (90+ dias)
- [ ] TikTok Shop
- [ ] Marketplace — Mercado Livre, Shopee
- [ ] Coleção B2B — venda para clínicas/hospitais em volume
- [ ] Personalização — bordado do nome/CRM no jaleco
