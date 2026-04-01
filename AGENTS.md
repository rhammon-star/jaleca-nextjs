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
- Blog admin com IA: ✅
- Melhor Envio shipping: ⚠️ token placeholder, usa fallback
- Analytics (GA4/Meta Pixel): ❌ placeholders
- Login CPF existente no checkout: ❌ JWT Auth plugin não instalado

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

## Hospedagem — plano de deploy
- cPanel tem **Setup Node.js App** — hospedar Next.js no mesmo servidor que o WordPress
- WordPress continua em jaleca.com.br/wp-* (API WooCommerce intacta)
- Next.js substitui o frontend em jaleca.com.br
- Melhor Envio: usa fallback (PAC/SEDEX estimado) — OAuth2 complexo, implementar pós-lançamento

## Deploy — Vercel Pro
- Hospedagem: Vercel Pro (Next.js) + cPanel/Hostinger (WordPress)
- GitHub repo conectado ao Vercel — deploy automático no push
- Variáveis de ambiente copiadas do .env.local para Vercel dashboard
- Trial de 14 dias ativo — adicionar cartão antes de expirar

## Pendências antes do deploy
- [ ] Remover console.log sensíveis: `lib/pagarme.ts`, `app/api/payment/create/route.ts`, `app/api/auth/login/route.ts`
- [ ] Trocar `NEXT_PUBLIC_SITE_URL=http://localhost:3000` → `https://jaleca.com.br` no .env de produção (Vercel dashboard)
- [ ] Fazer backup completo do WordPress antes de subir
- [ ] Configurar GA4_ID e META_PIXEL_ID reais (após lançamento)
- [ ] Webhook Pagar.me: `https://jaleca.com.br/api/payment/webhook` ✅ já configurado
- [ ] Apontar DNS jaleca.com.br para Vercel após backup WordPress
- [ ] Migrar WordPress para Hostinger Basic (pós-lançamento Next.js)
