<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Jaleca — Next.js E-commerce

Site de uniformes médicos (jalecos, dômãs, conjuntos). Diretório: `/Users/rhammon/SiteJaleca/jaleca-nextjs`

## Stack
- Next.js 16, React 19, TypeScript, Tailwind CSS v3.4
- WooCommerce GraphQL + REST API (`https://wp.jaleca.com.br/graphql`)
- Pagar.me v5 (direto, sem plugin WC)
- Brevo (Sendinblue) para email transacional
- Gemini AI (gemini-2.5-flash) para blog
- Radix UI (shadcn/ui pattern) + custom components

## Status das integrações (13/04/2026)
- WooCommerce GraphQL: ✅ `https://wp.jaleca.com.br/graphql`
- WooCommerce REST: ✅ Pedidos, customers
- Carrinho: ✅ localStorage
- Pagamentos Pagar.me: ✅ PIX ✅ Boleto ✅ Cartão de Crédito ✅ Webhook configurado
- Google Search Console: ✅ sitemap submetido
- Email transacional: ✅ via Brevo (`lib/email.ts`)
- Verificação de email: ✅ (não bloqueia checkout)
- **Reset de senha (13/04/2026)**: ✅ CORRIGIDO — token salvo via `/wp-json/jaleca/v1/save-token` (user_meta WordPress), não mais via WC API. Plugin jaleca-fix v2.1 instalado com endpoints save/get/clear-token + change-password.
- **Variações sem preço (13/04/2026)**: ✅ CORRIGIDO — 3 camadas: (1) WordPress hook desativa variação sem preço ao salvar, (2) frontend filtra da seleção, (3) API bloqueia pedido com price≤0.
- **CPF duplicado no checkout (13/04/2026)**: ✅ CORRIGIDO — clientes criados via endpoint WP não apareciam na WC REST API. Novo endpoint `/wp-json/jaleca/v1/lookup-cpf` busca por `user_meta billing_cpf`. `cpf-lookup/route.ts` tenta plugin primeiro, depois WC API.
- Blog CMS com IA: ✅ (`/blog/admin`) — Gemini 2.5 flash-lite + Unsplash + 4 estilos de escrita + humanização
- Melhor Envio shipping: ✅ token real configurado, CNPJ `30379063000161`, renovação automática mensal
- Frete: ✅ PAC/SEDEX/Jadlog via Melhor Envio, surcharge R$0 removido (12/04/2026)
- GA4 + Meta Pixel + Meta CAPI: ✅
  - ⚠️ Meta CAPI erro 400 — pixel `566059928254677` token precisa ser regenerado no Meta Events Manager
- **Rastreamento de compra browser**: ✅ `trackPurchase()` chamado em `app/pagamento/page.tsx` ao confirmar pagamento
- Meta Pixel ID: ✅ `566059928254677`
- Meta CAPI token: ⚠️ precisa regenerar (token atual é de Página Facebook, não serve para CAPI)
- Meta Catálogo: ✅ 30 produtos / 559 variantes (feed: `/api/feed/google-shopping`, atualiza 1h)
- Meta Loja Instagram + Facebook: ✅ aprovada (06/04/2026)
- Meta Checkout URL: ✅ configurado (`/api/meta-checkout`)
- Meta Remarketing: ✅ campanha "Remarketing - Carrinho Abandonado" — públicos 60 dias (09/04/2026, em análise)
- Google Reviews (homepage): ✅ via Places API (New) — rating 4.9/58, cache 24h
- Google Reviews (página de produto): ✅ badge 4.9/58 Google com 3 reviews na aba "Avaliações" (10/04/2026)
- aggregateRating no Product schema: ✅ usa nota Google (4.9) como fallback quando sem reviews WooCommerce
- Alt text imagens: ✅ bulk fix via SQL (674 imagens, 11/04/2026) + plugin `jaleca-auto-alt` para novos produtos
- Google Ads: ✅ conta 444-659-1621 — Merchant Center 5759143798 ✅, GA4 530831994 ✅, faturamento ✅
  - Campanha Search "Jaleca - Search - Jalecos": ✅ R$70/dia, Maximizar Cliques (CPC máx R$2,50)
  - Campanha Shopping "Jaleca - Shopping - Produtos": ✅ R$30/dia, Maximizar Cliques, CPC máx R$2,50
  - Tag conversão AW-18072506944: ✅ funcionando
  - Palavras-chave negativas: ✅ ~40 termos de concorrentes negativados
  - Verificação do anunciante: ⏳ em andamento (1-10 dias)
  - Ao atingir 30 compras: trocar Search para "Maximizar conversões"
  - Mês 2: criar Performance Max
- Tawk.to chat: ✅
- Speed Insights Vercel: ✅
- Trust badges + PIX badge + Urgência estoque: ✅
- FAQ page + FAQPage schema: ✅
- Cores produto ordenadas alfabeticamente: ✅
- Cupom `PRIMEIRACOMPRA5JALECA`: ✅ criado no WooCommerce
- Descrições de produtos: ✅ copywriting premium (todos os 30 produtos, 06/04/2026)
- SEO (11/04/2026): ✅ `middleware.ts` redirect admin.jaleca.com.br, página Nossas Lojas metadata melhorado, GBP site + descrição corrigidos

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

### Pages extras
- `app/faq/page.tsx` — FAQ com 12 perguntas + FAQPage schema JSON-LD
- `components/Footer.tsx` — link para FAQ adicionado
- `components/GoogleReviewsSection.tsx` — avaliações Google na homepage
- `lib/google-places.ts` — busca rating + reviews via Places API (New), cache 24h

### Franqueado
- `lib/franqueados.ts` — tipo Franqueado com lat/lng, haversineKm(), findFranqueadoByRadius(lat, lng, 100)
- `app/api/franqueado/route.ts` — usa x-vercel-ip-latitude/longitude para busca por raio
- `components/FranqueadoBanner.tsx` — mostra distância em km, reset diário

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
- `/api/tracking/*` — rastreamento: `register` (webhook WC), `status` (consulta), `check-all` (cron diário)

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
- Hero: `<img>` nativa com `w-full h-auto block` — NÃO usar next/image
- Hero backup: `public/jaleco-hero-ORIGINAL.jpg`

### Email (Brevo)
- `lib/email.ts` → `sendMail()` chama `https://api.brevo.com/v3/smtp/email`
- Funções: `sendOrderConfirmation()`, `sendOrderShipped()`, `sendWelcome()`, `sendEmailVerification()`, `sendPasswordReset()`, `sendCartRecovery()`
- **ATENÇÃO**: Vercel não alcança wp.jaleca.com.br via HTTP — usar Brevo, não WordPress

### WooCommerce
- Checkout slug: `finalizar-compra` (não `checkout`)
- Página `/finalizar-compra` criada (mesmo conteúdo de `/checkout`)
- Link do carrinho: `/finalizar-compra`

### Frete grátis (09/04/2026)
- Limite: **R$499**
- Estados elegíveis (PAC grátis): **SP, RJ, ES, MG**
- CEP salvo em `localStorage` (`jaleca-checkout-cep`, `jaleca-checkout-state`)
- Se estado não é SP/RJ/ES/MG: mostra mensagem informativa
- Se estado é SP/RJ/ES/MG e valor >= R$499: PAC custo=0 (aplicado direto no `calculateShipping`)
- Se estado é SP/RJ/ES/MG e valor < R$499: barra de progresso
- Subtotal passado ao ShippingCalculator → `/api/shipping` → `calculateShipping(cep, weight, items, subtotal)`
- SEDEX e Jadlog sempre pagos (Jadlog adicionado em 09/04/2026)
- Cubagem: 4×31×41 cm base, +4cm largura por peça adicional (`lib/melhor-envio.ts`)

### Produtos
- Query GraphQL usa `variations(first: 100)` — limite padrão WPGraphQL é 10
- Variações sem preço não aparecem no site
- Ordem dos tamanhos: PP → P → M → G → GG → G1 → G2 → G3

### Categorias e filtros (`lib/products.ts`, `app/produtos/ProductsClient.tsx`)
- Categorias: `["Todos", "Jalecos", "Dólmãs", "Conjuntos", "Acessórios"]`
- O filtro usa **categorias reais do WooCommerce** (`productCategories` via GraphQL), não o nome do produto
- Slugs WooCommerce esperados: `jalecos`, `domas`, `conjuntos`, `acessorios`
- Subcategorias por gênero: `jalecos-femininos`, `jalecos-masculinos`, `domas-femininas`, `domas-masculinas`, `conjuntos-femininos`, `conjuntos-masculinos`
- Filtro de cor: apenas 3 opções — **Branco** (attr contém "branco"), **Preto** (attr contém "preto"), **Colorido** (qualquer outra cor)
- Atributo de cor no WooCommerce deve se chamar `Cor` ou `color`
- Calças foi removida das categorias

## Credenciais
- **Pagar.me Secret:** `sk_zpn8wrBIZ3tKwBL6`
- **Pagar.me Public:** `pk_YvOwdngub4hoq3e5`
- **WP App Password:** `vdzLXcaqEc5mM8EPU1oJVk`
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

## Quick wins implementados (04/04/2026)
- [x] Título duplo `| Jaleca | Jaleca` — corrigido
- [x] Página FAQ + FAQPage schema (12 perguntas)
- [x] Trust badges (frete, PIX 5%, troca, compra segura)
- [x] Barra progresso frete grátis (R$599, SP/RJ/ES/MG)
- [x] Badge PIX 5% no carrinho
- [x] PIX 5% no resumo checkout
- [x] Urgência estoque (últimas unidades)
- [x] Size Advisor: grid 3 colunas
- [x] Carrinho vazio com sugestões
- [x] Link checkout corrigido (`/finalizar-compra`)
- [x] Blog: WP_URL configurável via env var
- [x] Link FAQ no footer

## Projeto em andamento: Comunicação Automática de Pedidos
Documento: `docs/PROJETO-RASTREAMENTO-APROVACAO.md`

10 emails automáticos cobrindo todo ciclo do pedido:
- Lembrete pagamento pendente (12h sem pagar)
- Mudanças de status: Análise, Faturado, Em separação, Cancelado, Reembolsado
- Rastreamento: Enviado, Em trânsito, Saiu para entrega, Entregue (+ auto-Concluído)

**Pendência:** confirmar se etiquetas são geradas pelo Melhor Envio (define qual API de rastreamento usar).
- Se sim → Melhor Envio API (gratuita, OAuth2 já previsto no projeto)
- Se não → APIs diretas: SeuRastreio (Correios) + Jadlog + Braspress

Novos arquivos a criar: `app/api/tracking/*`, `app/api/orders/notify`, `app/api/orders/payment-reminder`, `lib/tracking.ts`
Modificar: `lib/email.ts` (+10 funções), `vercel.json` (+2 crons), `functions.php` WP (+campos rastreio + hooks)

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
no WooCommerce REST API (`/wc/v3/customers/{id}` retorna 404).
Por isso TODOS os endpoints que buscam/salvam dados desses clientes devem usar o plugin Jaleca:
- Token de senha: `/wp-json/jaleca/v1/save-token` + `get-token` + `clear-token`
- Busca por CPF: `/wp-json/jaleca/v1/lookup-cpf`
- Atualização de senha: `/wp-json/jaleca/v1/change-password`
NÃO usar WC REST API para essas operações (fallback apenas).

## Pendente (prioridade)
1. **Cadastro de usuário** — ✅ RESOLVIDO (09/04/2026).
2. **Melhor Envio** — ✅ RESOLVIDO (09/04/2026). Token real configurado, integração automática ME cart, renovação mensal automática via cron.
3. **Rastreamento de compra** — ✅ RESOLVIDO (09/04/2026). `trackPurchase()` chamado no `/pagamento` ao confirmar pagamento.
4. **Canônico www** — ✅ RESOLVIDO (09/04/2026). www.jaleca.com.br → 308 → jaleca.com.br (configurado no Vercel).
5. **Reset de senha** — ✅ RESOLVIDO (13/04/2026). Plugin Jaleca Fix v2.2 com endpoints token.
6. **CPF duplicado no checkout** — ✅ RESOLVIDO (13/04/2026). Plugin lookup-cpf + cpf-lookup/route.ts atualizado.
7. **Variações sem preço** — ✅ RESOLVIDO (13/04/2026). Hook WP + filtro frontend + bloqueio API.
8. **Tela /minha-conta — histórico de pedidos** — ⏳ AMANHÃ. Ver todos os pedidos de compras anteriores.
9. **WooCommerce SKUs duplicados** — 4 produtos afetados. Corrigir antes do próximo sync Bling.
10. **Google Ads — Verificação do anunciante** — Adm. → Configurações → Verificação do anunciante
11. **Google Ads — Em 7 dias** — checar termos novos para negativar; ao atingir 30 compras, trocar Search para "Maximizar conversões"
12. **Meta Remarketing** — ✅ anúncio criado + públicos configurados (09/04/2026). Se não gastar em 3 dias, expandir público para 90 dias.
13. **Imagens WordPress** — EWWW Image Optimizer (algumas imagens > 8MB bloqueavam Meta)
14. **Instagram Shopping** — aguardando sincronização Meta
15. **Vercel Pro** — verificar prazo trial
16. **Marketplaces via Bling** — próximo passo: conectar Mercado Livre. Ver `docs/PROJETO-MARKETPLACES-BLING.md`
17. **Google Ads — Performance Max** — criar no mês 2
18. **Investigar "Produto não encontrado"** — 24 sessões em 404, verificar quais URLs estão quebrando
19. **admin.jaleca.com.br** — bloquear indexação no Google via WordPress → Configurações → Leitura → desmarcar indexação

## Performance (09/04/2026)
- Cache headers corrigidos no `next.config.ts` (regex estava quebrado — assets sem cache)
- Preconnect adicionado: Facebook, Google Tag Manager, wp.jaleca.com.br
- DNS-prefetch: embed.tawk.to
- Hero image: `loading="eager"`, `decoding="sync"`, `sizes="(max-width: 767px) 100vw, 58vw"`
- Vídeos dos cards comprimidos com ffmpeg (12MB → 3.3MB, 73% menor)
- Vídeos carregam via IntersectionObserver (lazy-load — zero impacto no PageSpeed)
- PageSpeed antes: FCP 2.7s | LCP 7.7s | TBT 160ms | CLS 0 | SI 4.3s

## CRO implementado (08/04/2026)
- Hero subheadline atualizado: "Antes de você falar, sua imagem já foi avaliada..."
- "Mais Vendidos" adicionado ao menu desktop + mobile com badge TOP
- Bloco de confiança na página de produto: Envio rápido + Troca fácil + Compra segura
- Google Reviews seção na homepage (Places API New, rating + 3 reviews, cache 24h)
- **Google Reviews na página de produto (10/04/2026)**: quando não há avaliações WooCommerce, exibe rating 4.9/5.0 do Google com badge verde e 3 reviews na aba "Avaliações" — prova social disponível desde o primeiro acesso
- Cards de categoria com vídeo hover (Jalecos, Conjuntos, Dólmãs) — `components/CategoryCard.tsx`
- Barra de confiança com ícones SVG (substituiu emojis) — `components/TrustBadgeBar.tsx`
- Campo "Ref:" (SKU) removido da página de produto
- "Novidades" renomeado para "Dólmãs" nos cards da home

## Implementado (09/04/2026)
- **Página Nossas Lojas** (`/nossas-lojas`) — cards por estado das 6 franquias com WhatsApp individual e Instagram. Substituiu `/loja-matriz` no menu.
- **Menu**: "Loja" → "Nossas Lojas" (desktop + mobile)
- **Ortografia**: "Dômãs" → "Dólmãs" em todo o site (Header, products.ts, ProductsClient, categoria, page.tsx)
- **Trust badge**: "Frete para Todo Brasil" → "Frete Grátis no Sudeste — SP · RJ · MG · ES acima de R$499"
- **Horário sábado**: corrigido para 09:00–12:00 em contato, loja-matriz, page.tsx, faq
- **Botão revenda**: `loja-matriz` agora abre WhatsApp 5531992901940
- **Frete**: PAC grátis automático para SE acima de R$499 + Jadlog adicionado + cubagem correta
- **Cadastro (#11)**: causa raiz — chave WooCommerce no Vercel diferente da "Jaleca Next.js". Solução: atualizar credenciais no Vercel.

### Cadastro e Checkout (09/04/2026)
- **`/api/auth/register`**: fallback WC nativo se endpoint WP `/wp-json/jaleca/v1/create-customer` falhar. Sempre cria a conta.
- **`/api/auth/cpf-lookup`**: busca TODOS os customers e verifica `billing_cpf` em meta_data E em `billing.cpf` nativo.
- **`/api/auth/forgot-password`**: auth corrigida para usar `WOOCOMMERCE_CONSUMER_KEY/SECRET` (WP_ADMIN_USER não existe no Vercel). Detecta `isNewCustomer` → envia "Bem-vinda à Jaleca! Defina sua senha".
- **Checkout flow**: cliente com CPF novo → cria conta automaticamente → email "defina sua senha" → email de confirmação (PIX/Boleto).
- **`/minha-conta`**: aba **"Avaliar"** — pedidos concluídos, form estrelas + comentário → POST `/api/reviews/[productId]`.

### Email pós-compra
- Email de confirmação para PIX/Boleto: `/api/payment/create/route.ts`
- Email "Bem-vinda + Defina sua senha": via `forgot-password?isNewCustomer=true` após auto-create no checkout
- Email interno `financeiro@jaleca.com.br`: disparado a cada nova venda com cliente, forma de pagamento, itens e link para o pedido no WP Admin

### Frete e Melhor Envio (09/04/2026)
- PAC + SEDEX + Jadlog sempre exibidos — se API retornar < 2 opções, usa fallback regional
- Fallback: PAC R$18,90 / Jadlog R$22,90 / SEDEX R$35,90 (Sul/Sudeste); PAC grátis acima R$499 para SP/RJ/MG/ES
- **Token real ME configurado** — expira ~30 dias, renovação automática via cron (dia 1 de cada mês, `app/api/melhor-envio/refresh/route.ts`)
- **ME cart automático**: pedido pago → `addShipmentToMECart()` em `lib/melhor-envio.ts` → aparece no carrinho ME com serviço correto (PAC=1, SEDEX=2, Jadlog=7)
- `ME_SERVICE_MAP`: mapa de IDs de serviço exportado de `lib/melhor-envio.ts`
- **WordPress SMTP**: WP Mail SMTP configurado com Brevo (smtp-relay.brevo.com:587) → notas de pedido WC chegam no email do cliente
- **Variáveis ME no Vercel**: `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_REFRESH_TOKEN`, `MELHOR_ENVIO_CLIENT_ID` (23800), `MELHOR_ENVIO_CLIENT_SECRET`, `VERCEL_API_TOKEN`

### Reset de senha (09/04/2026)
- `reset-password/route.ts`: auth corrigida para usar WC consumer key (antes usava WP_ADMIN_USER inexistente → retornava "link expirado" incorretamente)

## Implementado (09/04/2026) — Rastreamento e SEO
- **`trackPurchase()` em `/pagamento`**: `app/pagamento/page.tsx` importa `trackPurchase` de `components/Analytics` e dispara ao confirmar pagamento (PIX/Boleto via polling `paid=true`, cartão via `cardStatus=paid`). Usa `trackFiredRef` para garantir disparo único.
- **`orderValue` + `orderItems`** adicionados à resposta de `app/api/payment/create/route.ts` e ao `PaymentData` type — necessários para o `trackPurchase`.
- **CAPI logging**: `.catch(() => {})` substituído por `.catch(err => console.error(...))` em `payment/create` e `payment/webhook` — erros CAPI agora aparecem nos logs Vercel.
- **www canônico**: configurado no Vercel Domains — `www.jaleca.com.br` → 308 permanent → `jaleca.com.br`. NÃO usar redirect em `next.config.ts` (causaria loop com a config Vercel).
- **WC Webhook**: configurado em WP Admin → URL `https://jaleca.com.br/api/orders/notify`, secret = `jaleca-hook-2026`, topic = "Pedido atualizado". Valida HMAC-SHA256.
- **JALECA_WEBHOOK_SECRET**: valor `jaleca-hook-2026` definido no Vercel.
- **Email template**: `wrapHtml()` em `lib/email.ts` usa header branco com logo `/logo-cropped.jpg` — padrão para todos os emails.
- **Email "defina sua senha"**: `sendSetPasswordEmail()` em `lib/email.ts` — chamada em `/api/auth/register` (novos clientes) e `/api/auth/forgot-password`. Token 72h salvo em WC meta.
- **CNPJ Melhor Envio**: `lib/melhor-envio.ts` → `from.document: '30379063000161'` (era placeholder `00000000000000`).

## PRDs criados (docs/)
- `PRD-GOOGLE-ADS-MASTER-JALECA-2026.md` — estratégia completa Google Ads (campanhas, keywords, copy, CRO, projeções)
- `PRD-APRESENTACAO-PROJECAO-12-MESES.md` — projeção financeira 3 cenários para Manus gerar apresentação
- `PRD-BLOG-IA-HUMANIZADA.md` — blacklist de palavras de IA + regras para conteúdo humano

## Blog — Regras de Conteúdo com IA

**PRD:** `docs/PRD-BLOG-IA-HUMANIZADA.md`

O blog da Jaleca usa IA para gerar e reescrever conteúdo. Todas as saídas de IA devem evitar palavras da blacklist para soar como brasileiro real.

### Blacklist principal (resumo)
- Conectivos robóticos: Primeiramente, Ademais, Outrossim, Não obstante, Em síntese, No que diz respeito, etc.
- Verbos pomposos: Potencializar, Maximizar, Otimizar, Ressignificar, Consolidar, Estruturar, etc.
- Substantivos abstratos: Robustez, Paradigma, Ecosystem, Expertise, Know-how, etc.
- Locuções: "É importante ressaltar que", "Deixe-me explicar", "Podemos notar que", etc.
- Frases iniciais robóticas: "Bem-vindo a este artigo", "Você sabia que", etc.

### Tom correto
- Brasileiro real, conversacional
- Usar contrações: "vc", "pra", "né", "tipo", "na verdade"
- Frases curtas e diretas, parágrafos curtos
- Sem encadeamento excessivo de frases
- Pular linhas entre parágrafos

### Validação
- `isAIContent(text)` em `lib/ai-content.ts` retorna `{ flagged, found[] }`
- Botão "Humanizar texto" no admin chama `/api/blog/rewrite` → `rewriteHumanized()` → reescreve HTML com tom humano
- Geração usa 1 de 4 estilos aleatórios: especialista-pratico, colega-de-profissao, narrativo-envolvente, analitico-confiante
