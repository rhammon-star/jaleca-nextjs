<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Jaleca — Next.js E-commerce

Site de uniformes médicos (jalecos, dômãs, conjuntos). Diretório: `/Users/rhammon/SiteJaleca/jaleca-nextjs`

## Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS v3.4
- WooCommerce GraphQL + REST API (`https://wp.jaleca.com.br/graphql`)
- **Cielo E-commerce 3.0** (direto, sem plugin WC) — migrado de Pagar.me em 15/04/2026
- Brevo (Sendinblue) para email transacional
- Gemini AI (gemini-2.5-flash) para blog
- Radix UI (shadcn/ui pattern) + custom components

## ⚠️ CRÍTICO — Redirect Loop Homepage (24/04/2026)

**PROBLEMA RESOLVIDO:** Rota `/` (homepage) tinha redirect loop infinito (ERR_TOO_MANY_REDIRECTS).

**SOLUÇÃO PERMANENTE:**
- Redirect criado no **Vercel Dashboard** (não no código): `/` → `/home` (307 temporário)
- Configurado em: Settings → Redirects
- Vercel Edge intercepta ANTES do Next.js processar
- Homepage real: `app/home/page.tsx`
- Homepage "fantasma": `app/page.tsx` (não renderiza, redirect intercepta)
- SEO: Canonical em `/home` aponta para `https://jaleca.com.br` (preservado)
- Sitemap: Não precisa mudanças, Google segue redirect normalmente

**CAUSA RAIZ:** Bug no Next.js 16.2.0 ou Vercel Edge com rota `/` especificamente. Todas as tentativas de fix no código falharam (redirects next.config.ts, substituir arquivo page.tsx, homepage minimalista sem dependências).

**DOCUMENTAÇÃO COMPLETA:** `SESSAO-REDIRECT-LOOP-24-04-2026.md`

**QUANDO REMOVER:** Quando Next.js/Vercel corrigir o bug da rota `/`, remover redirect do Vercel Dashboard e deletar `app/home/page.tsx`.

---

## Arquivos principais

### Checkout/Pagamentos
- `app/checkout/CheckoutClient.tsx` — tokenização + formulário
- `app/finalizar-compra/page.tsx` — página checkout (mesmo conteúdo do /checkout)
- `app/pagamento/page.tsx` — resultado PIX/Boleto/Cartão
- `app/api/payment/create/route.ts` — cria pedido WC + Pagar.me
- `app/api/payment/status/route.ts` — polling status
- `app/api/payment/webhook/route.ts` — webhooks Pagar.me
- `lib/pagarme.ts` — cliente Pagar.me v5

### Carrinho
- `components/CartDrawer.tsx` — drawer com coupon, shipping, PIX badge, barra frete grátis
- `components/ShippingCalculator.tsx` — calcula frete via ViaCEP + Melhor Envio

### Produto
- `app/produto/[slug]/page.tsx` — página de produto
- `app/produto/[slug]/ProductDetailClient.tsx` — cliente com urgência estoque, Size Advisor

### Blog
- `app/blog/page.tsx` — lista de posts (busca do WordPress), paginação bidirecional
- `app/blog/[slug]/page.tsx` — post público
- `app/blog/admin/novo-post/NovoPostClient.tsx` — criar post com IA (sem publishDirectly, botão Trocar Foto, botão Humanizar Texto)
- `app/blog/admin/posts/page.tsx` — lista com deletar (invalida cache ISR ao deletar)
- `lib/wordpress.ts` — usa `NEXT_PUBLIC_WP_URL` (wp.jaleca.com.br)
- `lib/ai-content.ts` — Gemini 2.5 flash-lite, 4 estilos de escrita, AI_BLACKLIST, isAIContent(), rewriteHumanized()


### API routes
- `/api/auth/*` — login, register, forgot-password, verify-email, profile, reset-password, cpf-lookup
- `/api/blog/*` — posts, categories, generate, publish, improve-seo, new-image, rewrite, auth
- `/api/orders/*` — pedidos do cliente logado; `notify` (emails por status); `payment-reminder` (cron 12h)
- `/api/shipping/*` — cálculo de frete
- `/api/coupon/*` — validação de cupom
- `/api/leads/*` — newsletter
- `/api/feed/*` — Google Shopping XML
  - ⚠️ ATENÇÃO: O feed inclui todas as variações `status=publish` e `stock_status=instock` mesmo se `stock_quantity=0`. Isso causa erro "Missing quantity" no Meta. Se variação não tem estoque, mudar status pra `outofstock` no WooCommerce.
  - ⚠️ Imagens > 8MB causam erro "image file is larger than 8 MB" no Meta. Solução: plugin EWWW Image Optimizer no WP (bulk optimize todas as fotos). Feed não faz resize — usa URL original do WooCommerce.
- `/api/loyalty/*` — programa de pontos
- `/api/reviews/*` — avaliações
- `/api/cart-recovery/*` — recuperação de carrinho
- `/api/revalidate/*` — revalidação de cache
- `/api/tracking/*` — rastreamento:
  - `check-all` — cron a cada 2h: detecta novas etiquetas ME + verifica movimentações (in_transit, out_for_delivery, delivered)
  - `melhor-envio-webhook` — webhook ME (POST): recebe evento de status, registra rastreio, envia email "Enviado" na primeira vez
  - `status` — consulta status de rastreio de um pedido
- `/api/orders/notify` — webhook WC: mapeia status WC → envia email correspondente (análise, faturado, separação, cancelado, reembolsado, review request). "enviado" não mapeado aqui — email com código de rastreio vem do check-all/ME webhook.
- `/api/orders/review-request` — cron diário 13h: envia pedido de avaliação para pedidos concluídos
- `/api/orders/payment-reminder` — cron horário: lembrete de pagamento pendente

## Regras críticas de implementação


### Imagens
- Hero: `<img>` nativa com `w-full h-auto block` — NÃO usar next/image
- Hero backup: `public/jaleco-hero-ORIGINAL.jpg`

### Email (Brevo)
- `lib/email.ts` → `sendMail()` chama `https://api.brevo.com/v3/smtp/email`
- Funções de status de pedido: `sendOrderUnderReview()`, `sendOrderInvoiced()`, `sendOrderPacking()`, `sendOrderCancelled()`, `sendOrderRefunded()`, `sendReviewRequest()`
- Funções de rastreamento: `sendOrderShippedWithTracking()`, `sendOrderInTransit()`, `sendOrderOutForDelivery()`, `sendOrderDelivered()`
- Funções gerais: `sendOrderConfirmation()`, `sendBoletoEmail()`, `sendWelcome()`, `sendEmailVerification()`, `sendSetPasswordEmail()`, `sendCartRecovery()`, `sendPaymentReminder()`
- **ATENÇÃO**: Vercel não alcança wp.jaleca.com.br via HTTP — usar Brevo, não WordPress

### WooCommerce
- Checkout slug: `finalizar-compra` (não `checkout`)
- Página `/finalizar-compra` criada (mesmo conteúdo de `/checkout`)
- Link do carrinho: `/finalizar-compra`


## Credenciais
- **Pagar.me Secret:** `sk_zpn8wrBIZ3tKwBL6`
- **Pagar.me Public:** `pk_YvOwdngub4hoq3e5`
- **WP App Password:** usar `WP_ADMIN_APP_PASSWORD` do Vercel (o valor `vdzLXcaqEc5mM8EPU1oJVk` está DESATUALIZADO)
- **WP Admin:** `wp.jaleca.com.br/wp-admin` — Ana Luiza

## Hospedagem
- **Next.js:** Vercel Pro — `jaleca.com.br`
- **WordPress:** Hostinger — `wp.jaleca.com.br` ( só API )
- **Domínio:** registro.br
- SSH WordPress: `ssh -p 65002 u537333031@82.25.73.174`

## DNS
- A: jaleca.com.br → 216.198.79.1 (Vercel) — domínio primário (Production)
- A: wp.jaleca.com.br → 82.25.73.174 (Hostinger)
- CNAME: www → bc060d04fd865036.vercel-dns-017.com
- www.jaleca.com.br → 308 redirect → jaleca.com.br (configurado no Vercel Domains, 09/04/2026)

## Variáveis de ambiente (Vercel)
- `NEXT_PUBLIC_WP_URL=https://wp.jaleca.com.br` ⚠️ CRÍTICO para blog funcionar
- `BREVO_API_KEY`
- `NEXT_PUBLIC_GA4_ID=G-SHBE64GDP7`
- `NEXT_PUBLIC_META_PIXEL_ID=936912792527674`
- `META_CONVERSIONS_API_TOKEN`
- `REVALIDATE_SECRET=jaleca-revalidate-2024`


Ciclo completo implementado via 3 componentes:
1. **`/api/orders/notify`** — webhook WC (status-change): análise, faturado, separação, cancelado, reembolsado, review request
2. **`/api/tracking/check-all`** (cron 2h) — detecta novas etiquetas ME + verifica in_transit/out_for_delivery/delivered → auto-complete
3. **`/api/tracking/melhor-envio-webhook`** — webhook ME: registra rastreio na primeira etiqueta gerada

Meta-data WC usados pelo rastreamento:
- `jaleca_tracking_code` — código de rastreio
- `jaleca_tracking_carrier` — transportadora
- `jaleca_me_tag` — ID do pedido no Melhor Envio
- `jaleca_me_cart_id` — ID do carrinho ME (vinculado na criação do pedido)
- `jaleca_tracking_active` — `1` quando rastreio ativo
- `jaleca_tracking_status` — status atual (posted, in_transit, out_for_delivery, delivered)
- `jaleca_notified_statuses` — lista CSV de emails já enviados (evita duplicatas)

**Ação externa necessária:** Configurar URL do webhook ME no dashboard Melhor Envio:
`https://jaleca.com.br/api/tracking/melhor-envio-webhook` (Preferências → Notificações)

## Plugin WordPress "Jaleca Fix" v2.2 (13/04/2026)
Arquivo: `docs/jaleca-fix-completo.php` — instalar via Hostinger File Manager.
Endpoints ativos em `/wp-json/jaleca/v1/`:
- `POST /create-customer` — cria usuário WP com role customer (autenticação por header X-Jaleca-Secret)
- `POST /save-token` — salva token reset senha em user_meta
- `POST /get-token` — lê token reset senha de user_meta
- `POST /change-password` — atualiza senha via wp_set_password()
- `POST /clear-token` — limpa token após uso + marca email_verified=1
- `GET  /lookup-cpf` — busca usuário por billing_cpf em user_meta (fix CPF duplicado)
Secret: `jaleca-register-secret-2026` (env var `JALECA_PLUGIN_SECRET` no Vercel)
Hook ativo: `jaleca_desativa_variacao_sem_preco` — auto-desativa variação sem preço ao salvar

## CRÍTICO — Clientes WP vs WooCommerce REST API
Clientes criados via `/wp-json/jaleca/v1/create-customer` EXISTEM no WordPress mas NÃO aparecem
no WooCommerce REST API (`/wc/v3/customers/{id}` retorna 404) e podem não estar na `wc_customer_lookup`.
Por isso TODOS os endpoints que buscam/salvam dados desses clientes devem usar o plugin Jaleca:
- Token de senha: `/wp-json/jaleca/v1/save-token` + `get-token` + `clear-token`
- Busca por CPF: `/wp-json/jaleca/v1/lookup-cpf`
- Atualização de senha: `/wp-json/jaleca/v1/change-password`
NÃO usar WC REST API para essas operações (fallback apenas).

**Dados extras do cliente (birthdate/gender)** — salvos como WC `meta_data` com chaves `billing_birthdate` e `billing_sex`. Coletados no perfil `/minha-conta` (aba Meus Dados). Não são coletados no checkout para não interromper o fluxo de compra. Disponíveis via `GET /api/auth/profile` retornando `meta_data` junto com o customer WC.

**Busca de pedidos** — `GET /orders?customer={id}` pode retornar vazio para clientes WP (não indexados
em `wc_customer_lookup`). O `app/api/orders/route.ts` faz fallback automático por `?email=` com
dupla verificação de `billing.email` para pedidos guest. NÃO remover esse fallback.

**Login / JWT** — `jaleca/v1/login` (jaleca-api.php no WP) retorna `user_id` mas SEM JWT válido.
`JWT_AUTH_SECRET_KEY` não está configurado no wp-config.php do Hostinger.
`app/api/auth/login/route.ts` resolve criando JWT próprio assinado com `JALECA_PLUGIN_SECRET`.
`auth.ts:verifyCustomerToken()` valida via HMAC-SHA256 com esse mesmo secret. NÃO configurar
jwt-auth/v1/token como dependência — o sistema funciona sem ele.

### Tradução de erros WooCommerce
- **Cupom em inglês (12/04/2026)**: `app/api/payment/create/route.ts` — mensagens de erro WooCommerce em inglês traduzidas para português por regex no catch: "coupon usage limit", "already been used", "not applicable", "expired", "minimum spend", "invalid coupon".

### Sistema de rastreamento completo
- **`app/api/tracking/check-all/route.ts`**: detecta novas etiquetas ME + rastreia movimentações + auto-complete ao entregar. Cron mudou de diário para **a cada 2h** (`vercel.json`)
- **`app/api/tracking/melhor-envio-webhook/route.ts`**: endpoint POST para webhook ME — registra rastreio na primeira etiqueta, atualiza status WC para "enviado", envia email com código de rastreio
- **WC status "enviado"**: ao detectar nova etiqueta (em ambos check-all e ME webhook), o status do pedido WC agora é atualizado automaticamente via PUT na REST API
- **`components/ProductCard.tsx`**: layout De/Por em duas linhas para itens em promoção
- **`components/Footer.tsx`**: link contato corrigido para `/nossas-lojas`

## PRDs criados (docs/)
- `PRD-PROTOCOLO-OTIMIZACAO-ADS-2026.md` — protocolo geral Meta + Google Ads + SEO (Gemini, 15/04/2026)
- `PRD-ESTRATEGIA-KEYWORDS-JALECO-2026.md` — arquitetura de lances: "jaleco" só Shopping, cauda longa na Search
- `PRD-META-ADS-PERFORMANCE-2026.md` — diretrizes Meta Ads: guardrails, remarketing, aquisição
- `PRD-CAMPANHA-AQUISICAO-META-2026.md` — estrutura campanha público frio: vídeo Reels 9:16 (prioridade) ou carrossel
- `PRD-GOOGLE-ADS-MASTER-JALECA-2026.md` — estratégia completa Google Ads (campanhas, keywords, copy, CRO, projeções)
- `PRD-APRESENTACAO-PROJECAO-12-MESES.md` — projeção financeira 3 cenários para Manus gerar apresentação
- `PRD-BLOG-IA-HUMANIZADA.md` — blacklist de palavras de IA + regras para conteúdo humano


### Assets (17/04/2026)
- `public/icon-flower.png` — logo flor circular 512×512 bege/branco fundo transparente
- `public/icon-flower.svg` — versão SVG anterior (mantida como fallback)
- `manifest.json` — ícones PWA atualizados: `icon-flower.png` com `purpose: maskable any`

---
### Arquivos Modificados
- `lib/all-products.ts` — criado (lógica compartilhada)
- `app/produtos/page.tsx` — usa `getAllProducts()` de `lib/all-products`
- `app/categoria/[slug]/page.tsx` — usa `getAllProducts()` de `lib/all-products`
- `app/produto/[slug]/page.tsx` — redirect órfãos via `redirect()`
- `lib/product-colors.ts` — termos base adicionados
- `docs/SEO-PRODUTOS-CORES.json` — 34 entradas limpas

### Impacto SEO
**Nenhum** — páginas de cor não foram submetidas ao sitemap ainda. URLs finais desde o início (limpeza pré-indexação).

---
