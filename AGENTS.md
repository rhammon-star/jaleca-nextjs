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
- WordPress backup: All-in-One WP Migration (arquivo .wpress) — em andamento
- DNS: após backup importado no Hostinger, apontar jaleca.com.br → Vercel

## Plugin WordPress — jaleca-api.php
- Arquivo em `/Users/rhammon/Downloads/jaleca-api.php`
- Instalar em: `/wp-content/plugins/jaleca-api/jaleca-api.php`
- Contém: dimensões padrão produtos, ordenação por estoque, campos checkout, endpoints jaleca/v1/send-email e jaleca/v1/login
- Substitui todas as funções customizadas do tema ECOMDigital (que será removido)

## Pendências
- [ ] Backup WordPress terminar → importar no Hostinger
- [ ] Instalar plugin jaleca-api.php no WordPress novo
- [ ] Apontar DNS jaleca.com.br → Vercel (após WordPress novo funcionando)
- [ ] Adicionar cartão no Vercel Pro antes do trial expirar
- [ ] Configurar GA4_ID e META_PIXEL_ID reais (após lançamento)
- [ ] Webhook Pagar.me: `https://jaleca.com.br/api/payment/webhook` ✅ já configurado
- [ ] Melhor Envio OAuth2 — pós-lançamento
