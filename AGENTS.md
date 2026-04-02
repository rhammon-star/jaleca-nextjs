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
- Pagamentos Pagar.me: ✅ PIX ✅ Boleto ✅ Cartão de Crédito
- Email (via WordPress wp_mail): ✅
- Verificação de email: ✅ (não bloqueia checkout)
- Blog admin com IA: ✅ (geração, humanização, SEO, imagem, seletor de categoria, deletar post)
- Melhor Envio shipping: ⚠️ token placeholder, usa fallback
- Analytics (GA4/Meta Pixel): ❌ placeholders
- Login CPF existente no checkout: ✅ endpoint jaleca/v1/login via wp_authenticate()

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

## DNS — registro.br (configurado ✅)
Registros configurados em registro.br (modo avançado):
- A: jaleca.com.br → 216.198.79.1 (Vercel)
- A: wp.jaleca.com.br → 82.25.73.174 (Hostinger WordPress)
- CNAME: www.jaleca.com.br → bc060d04fd865036.vercel-dns-017.com
- MX 1: aspmx.l.google.com
- MX 5: alt1.aspmx.l.google.com, alt2.aspmx.l.google.com
- MX 10: alt3.aspmx.l.google.com, alt4.aspmx.l.google.com

## Pendências
- [x] Backup WordPress terminar → importar no Hostinger (feito via Migrate Guru)
- [x] Instalar plugin jaleca-api.php no WordPress novo
- [x] Apontar DNS jaleca.com.br → Vercel (registros configurados, propagando ~02:30 de 02/04/2026)
- [x] Adicionar cartão no Vercel Pro antes do trial expirar
- [x] Remover menções a frete grátis (AnnouncementBar + CartDrawer)
- [x] Atualizar tagline hero: "Jalecos e uniformes profissionais com acabamento refinado, para quem não se contenta com o básico."
- [x] Verificar jaleca.com.br após propagação DNS — site no ar ✅
- [x] Conectar admin.jaleca.com.br no Hostinger ✅
- [x] WordPress URL configurado para https://wp.jaleca.com.br ✅
- [x] Variáveis Vercel atualizadas → NEXT_PUBLIC_WC_URL, WOOCOMMERCE_API_URL, NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL → wp.jaleca.com.br
- [x] Plugin jaleca-api.php instalado e ativo no WordPress novo (Hostinger)
- [x] Produtos aparecem na home ✅
- [x] Login de cliente funcionando ✅
- [x] CPF lookup no checkout funcionando (rápido com $wpdb direto) ✅
- [x] WordPress acessível em wp.jaleca.com.br/wp-admin ✅
- [x] PHP memory_limit aumentado: WP_MEMORY_LIMIT=512M, WP_MAX_MEMORY_LIMIT=512M em wp-config.php ✅
- [x] galleryImages e variations removidos de GET_PRODUCTS (reduz memória) ✅
- [x] GET_PRODUCTS usa product-level attributes para filtros de cor/tamanho ✅
- [x] Página /produtos carregando produtos ✅
- [x] Filtros de cor e tamanho funcionando ✅
- [x] PA_COLOR renomeado para "Cor" na página de produto ✅
- [x] Imagem muda ao selecionar cor (mesmo sem tamanho selecionado) ✅
- [ ] Configurar Webhook Pagar.me: https://jaleca.com.br/api/payment/webhook
- [ ] Configurar GA4_ID e META_PIXEL_ID reais (após lançamento)
- [ ] Melhor Envio OAuth2 — pós-lançamento
