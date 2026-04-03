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
- Email confirmação de pedido: ✅ template completo com logo, produtos, frete, endereço
- Email de senha (novo cliente): ✅ aponta para wp.jaleca.com.br/wp-login.php
- Verificação de email: ✅ (não bloqueia checkout)
- Blog admin com IA: ✅ (geração, humanização, SEO, imagem, seletor de categoria, deletar post)
- Melhor Envio shipping: ⚠️ token placeholder, usa fallback
- Analytics (GA4/Meta Pixel): ❌ placeholders
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
- Roteado via WordPress: `wp-json/jaleca/v1/send-email` com header `X-Jaleca-Key`
- `WP_EMAIL_KEY` em `.env.local` e `functions.php`
- `NEXT_PUBLIC_WP_URL=https://wp.jaleca.com.br` no Vercel — usado em forgot-password e reset
- Email de confirmação: `lib/email.ts` → `sendOrderConfirmation()` — template completo com logo, tabela de itens, frete, endereço
- WooCommerce "Processando pedido" desativado (WooCommerce → Configurações → Emails) — evita duplicata
- Logo no email: `https://jaleca.com.br/logo-full.jpg`
- Novo cliente no checkout → conta criada automaticamente + email de definição de senha via `app/api/auth/forgot-password/route.ts` → chama `wp.jaleca.com.br/wp-login.php?action=lostpassword`

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
- `unstable_cache` em todas as fetches de produto, home, reviews, relacionados — persiste entre deploys
- `revalidate = 3600` em todas as páginas de produto e home
- `vercel.json` configura `buildCommand: "next build && node scripts/warm-cache.mjs"` — aquece cache automaticamente após cada deploy
- `app/api/revalidate/route.ts` — endpoint seguro para revalidar paths via webhook (requer header `x-revalidate-secret`)
- `app/api/products-by-slugs/route.ts` — proxy server-side para RecentlyViewed (evita chamada cross-origin ao WordPress)
- warm-cache manual: `npm run warm-cache`

## Analytics — estado atual
- GA4: variável `NEXT_PUBLIC_GA4_ID` com valor `G-PLACEHOLDER` → substituir pelo ID real
- Meta Pixel: variável `NEXT_PUBLIC_META_PIXEL_ID` com valor placeholder → substituir pelo ID real
- Eventos implementados no código: PageView, ViewContent, AddToCart, Purchase
- Arquivo: `components/Analytics.tsx`
- Speed Insights Vercel: instalado e ativo

## PLANO COMPLETO — O QUE FALTA

### FASE 1 — Lançamento (urgente)
- [x] Testar cartão de crédito com compra real no Pagar.me ✅
- [x] Configurar Webhook Pagar.me → `jaleca.com.br/api/payment/webhook` ✅ (charge.paid + charge.payment_failed)
- [x] WooCommerce atualiza para "Processando" imediatamente após cartão aprovado ✅
- [x] Email de confirmação chegando ao cliente ✅ (template completo com logo)
- [x] Email duplicado do WooCommerce desativado ✅
- [ ] Testar boleto com compra real no Pagar.me
- [ ] WordPress Settings → General → Site Address → `https://jaleca.com.br` (emails WC mostram wp.jaleca ainda)
- [ ] Verificar pedidos aparecendo no WooCommerce após pagamento PIX
- [ ] Substituir `G-PLACEHOLDER` pelo ID real do GA4 (Vercel env vars)
- [ ] Substituir placeholder pelo ID real do Meta Pixel (Vercel env vars)
- [ ] Google Search Console — verificar domínio + enviar sitemap
- [ ] Verificar `jaleca.com.br/sitemap.xml` inclui todos os produtos

### FASE 2 — Operacional (próximas 2 semanas)
- [ ] Melhor Envio OAuth2 — substituir token placeholder pelo real
- [ ] Testar cálculo de frete no checkout com CEP real
- [ ] Frete grátis progressivo — "faltam R$X para frete grátis" no carrinho
- [ ] Página de Política de Entrega e Prazos
- [ ] Página de Política de Troca e Devolução
- [ ] Página Sobre a Jaleca
- [ ] FAQ — tamanho, material, lavagem, troca
- [ ] Completar cadastro de todos os produtos com fotos de todas as variações
- [ ] Configurar REVALIDATE_SECRET no Vercel + WordPress (produto novo → site em tempo real)
- [ ] Tabela de medidas completa por modelo

### FASE 3 — Marketing (primeiros 30 dias)
- [ ] Google Merchant Center — produtos no Google Shopping gratuito
- [ ] Primeira campanha Meta Ads com catálogo dinâmico
- [ ] Remarketing — reimpactar visitantes que não compraram
- [ ] Google Ads — palavras-chave: "jaleco feminino premium", "jaleco enfermagem"
- [ ] Recuperação de carrinho abandonado — email automático (1h, 24h, 72h)
- [ ] Cupom de primeira compra funcional no popup
- [ ] Instagram Shopping — vincular catálogo WooCommerce
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
