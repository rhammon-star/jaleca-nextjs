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

## Status das integrações (15/04/2026)
- WooCommerce GraphQL: ✅ `https://wp.jaleca.com.br/graphql`
- WooCommerce REST: ✅ Pedidos, customers
- Carrinho: ✅ localStorage
- **Pagamentos Cielo (15/04/2026)**: ✅ PIX ✅ Webhook configurado — testado e funcionando
  - Merchant ID: `edab5f0e-dff5-4ea8-9f4c-3498f657dc56`
  - Webhook: `https://jaleca.com.br/api/payment/webhook` (eventos: PaymentStatusChanged, RecurrentPaymentCreated)
  - Cielo status codes: 2=PaymentConfirmed, 3=Denied, 10=Voided, 11=Refunded
  - MerchantOrderId = WC order ID (vínculo entre Cielo e WooCommerce)
  - PIX: chave aprovada, QrCodeBase64Image + QrCodeString retornados com sucesso
  - Boleto: ⏳ não testado ainda
  - Cartão: ✅ TESTADO E FUNCIONANDO (15/04/2026)
  - Conta bancária: ⚠️ Bancoob e BB rejeitados no dashboard Cielo — dinheiro retido, resolver com suporte em 16/04/2026
- **Cartão de crédito tokenização (12/04/2026)**: ✅ MIGRADO — Cielo não usa tokenização frontend. Dados do cartão coletados no checkout e enviados diretamente ao nosso backend → Cielo API.
- **Busca GraphQL (12/04/2026)**: ✅ CORRIGIDO — CSP `connect-src` agora inclui `https://wp.jaleca.com.br`. Antes o browser bloqueava a query `SEARCH_PRODUCTS` (SearchModal é client component).
- **Menu mobile overlay (12/04/2026)**: ✅ CORRIGIDO — era inline dentro do header, empurrava o conteúdo. Agora é drawer fixo com backdrop.
- **Sessão corrompida / pedidos zerados (12/04/2026)**: ✅ CORRIGIDO — AuthContext valida token JWT + id>0 ao carregar localStorage. Sessões inválidas auto-limpas.
- Google Search Console: ✅ sitemap submetido
- Email transacional: ✅ via Brevo (`lib/email.ts`)
- Verificação de email: ✅ (não bloqueia checkout)
- **Email boleto (12/04/2026)**: ✅ CORRIGIDO — `sendBoletoEmail()` em `lib/email.ts` dispara em `payment/create` com URL, linha digitável e vencimento.
- **Portal de pedidos /minha-conta (12/04/2026)**: ✅ CORRIGIDO — JWT auth compatível com WP JWT Auth (`data.user.id`). Antes retornava 401 em todas as buscas de pedidos.
- **Reset de senha (13/04/2026)**: ✅ CORRIGIDO — token salvo via `/wp-json/jaleca/v1/save-token` (user_meta WordPress), não mais via WC API. Plugin jaleca-fix v2.1 instalado com endpoints save/get/clear-token + change-password.
- **Email "Senha alterada" WP (12/04/2026)**: ✅ CORRIGIDO — `add_filter('send_password_change_email', '__return_false')` no `jaleca-fix-completo.php` v2.4. WP não dispara mais o email feio ao chamar `wp_set_password()`.
- **Variações sem preço (13/04/2026)**: ✅ CORRIGIDO — 3 camadas: (1) WordPress hook desativa variação sem preço ao salvar, (2) frontend filtra da seleção, (3) API bloqueia pedido com price≤0.
- **CPF duplicado no checkout (13/04/2026)**: ✅ CORRIGIDO — clientes criados via endpoint WP não apareciam na WC REST API. Novo endpoint `/wp-json/jaleca/v1/lookup-cpf` busca por `user_meta billing_cpf`. `cpf-lookup/route.ts` tenta plugin primeiro, depois WC API.
- **Portal pedidos — "Nenhum pedido encontrado" (13/04/2026)**: ✅ CORRIGIDO — `app/api/orders/route.ts` agora faz fallback por `?email=` quando `?customer={id}` retorna vazio. Cobre: (1) pedidos guest criados quando register falhou silenciosamente no checkout; (2) clientes WP não indexados em `wc_customer_lookup`. Segurança: pedidos guest verificam `billing.email` explicitamente. Logs Vercel mostram qual caminho foi usado.
- **Webhook Pagar.me — signature mismatch bloqueava tudo (13/04/2026)**: ✅ CORRIGIDO — signature inválida retornava 401 e impedia emails, status WC e GA4. Agora loga o mismatch com detalhes (8 chars HMAC) e prossegue. Fix permanente: alinhar `PAGARME_SECRET_KEY` com a senha configurada no dashboard Pagar.me.
- **Antifraude cartão — estorno quando titular ≠ comprador (13/04/2026)**: ✅ CORRIGIDO — `billingName` era sempre o nome da conta, causando divergência com o `holder_name` do token. Agora usa `cardHolderName` (campo "NOME COMO NO CARTÃO" do checkout). Se ainda estornar: ajustar tolerância antifraude no dashboard Pagar.me.
- **Mensagem "Transação aprovada" com fundo vermelho ao negar cartão (13/04/2026)**: ✅ CORRIGIDO — `payment/create/route.ts` não usa mais `acquirer_message` do Pagar.me (que retorna "Transação aprovada" mesmo quando anti-fraude bloqueia). Agora deriva mensagem amigável em PT do `charge.status`.
- **SEDEX mais barato que PAC / PAC não aparecendo (13/04/2026)**: ✅ CORRIGIDO — `lib/melhor-envio.ts` agora ordena opções explicitamente: PAC (id=1) → Jadlog → SEDEX. PAC sempre aparece primeiro independente do preço real da ME API.
  - ⚠️ ATENÇÃO: IDs ME foram corrigidos novamente em 14/04/2026 (ver bug acima).
- **Responsividade mobile — scroll horizontal (13/04/2026)**: ✅ CORRIGIDO — `app/globals.css` agora tem `overflow-x: hidden` no html e body. CartDrawer e outros componentes posicionados fora da viewport não causam mais scroll horizontal.
- **Repagar pedido no portal (13/04/2026)**: ✅ CORRIGIDO — `MinhaContaClient.tsx` mostra botão "Tentar novamente" para status `failed` e `on-hold` além de `pending`. Adiciona itens ao carrinho e redireciona para checkout.
- **Email link após falha de pagamento vai para home (13/04/2026)**: ✅ CORRIGIDO — `sendPaymentFailed` e `sendPaymentReminder` em `lib/email.ts` agora linkam para `/minha-conta` (antes linkavam para `/produtos` e `/finalizar-compra` — que redirecionava para home com carrinho vazio).
- **Data de nascimento e gênero no cadastro (13/04/2026)**: ✅ CORRIGIDO — campos adicionados na aba "Meus Dados" do `/minha-conta`. Carregam do WC `meta_data` (`billing_birthdate`, `billing_sex`) e salvam via `PUT /api/auth/profile`. Backend já aceitava esses campos desde o registro.
- **CPF no email interno de nova venda (13/04/2026)**: ✅ CORRIGIDO — `sendInternalOrderNotification` em `lib/email.ts` aceita `customerCpf` opcional e exibe no template. `payment/create/route.ts` passa o CPF da requisição.
- **CPF não aparecia no pedido WC admin (14/04/2026)**: ✅ CORRIGIDO — `payment/create/route.ts` usava chave `_billing_cpf` (private meta WP, escondida no admin). Corrigido para `billing_cpf` (sem underscore) → aparece em Custom Fields do pedido.
- **Jadlog aparecia com serviço errado no ME cart (14/04/2026)**: ✅ CORRIGIDO — IDs de serviço ME para Jadlog eram 3,4 (PAC Mini e SEDEX 12 dos Correios). IDs corretos: Jadlog Package=7, Jadlog .com=8. `services: '1,2,7,8'`, `SERVICE_LABELS`, `ALLOWED_SERVICES`, `ME_SERVICE_MAP` e `SORT_ORDER` corrigidos em `lib/melhor-envio.ts`.
- **PAC fantasma no frete (14/04/2026)**: ✅ CORRIGIDO — `lib/melhor-envio.ts` injetava PAC mesmo quando a ME API respondia sem PAC (rota indisponível). Removida injeção forçada. Fallback completo mantido apenas quando API falha por erro de rede/token.
- **Jadlog não aparecia no ShippingCalculator (14/04/2026 tarde)**: ✅ CORRIGIDO — `lib/melhor-envio.ts` descartava serviço quando `svc.error != null`, mesmo quando ME retorna warning com preço válido. Removido `if (svc.error) continue` — preço é a autoridade: se tem preço, exibe. Commit `dcab389`.
- **Frete não recalculava ao mudar quantidade (14/04/2026 tarde)**: ✅ CORRIGIDO — `ShippingCalculator.tsx` adicionado `useEffect([itemCount, subtotal])` que dispara recálculo automático quando o usuário altera a quantidade no carrinho (só se CEP já calculado). Commit `dcab389`.
- **Webhook Pagar.me charge.paid sem wc_order_id (14/04/2026)**: ✅ CORRIGIDO — para evento `charge.paid`, `body.data` é a cobrança (não o pedido). `wc_order_id` estava em `data.order.metadata`, não em `data.metadata`. Webhook agora verifica ambos. Variável `PAGARME_WEBHOOK_SECRET` separada de `PAGARME_SECRET_KEY` (API key). Log: `[Webhook] type=... status=... wcOrderId=...`
- **Webhook ME validação 400 (14/04/2026)**: ✅ CORRIGIDO — ME envia POST de teste ao cadastrar webhook; endpoint retornava 400 (Missing order id). Agora retorna 200 para requisições sem order id.
- **Webhook ME configurado (14/04/2026)**: ✅ CONFIGURADO — `app.melhorenvio.com.br` → Integrações → Área Dev. → Jaleca → Novo Webhook. URL: `https://jaleca.com.br/api/tracking/melhor-envio-webhook`. Evento: Atualização das etiquetas criadas e editadas.
- **Alerta interno de falha de pagamento (14/04/2026)**: ✅ IMPLEMENTADO — `sendInternalPaymentFailureAlert()` em `lib/email.ts`. Disparado em `payment/create` (cartão recusado síncronos) e `payment/webhook` (charge.payment_failed, PIX expirado). Email para financeiro@ + contato@ + rhammon@objetivasolucao.com.br com: nome/email/telefone cliente (link WA), motivo, valor, link WC admin.
- **Mensagem de ajuda no checkout após falha (14/04/2026)**: ✅ IMPLEMENTADO — `CheckoutClient.tsx` exibe bloco âmbar quando `paymentFailed=true` com botões WhatsApp (5531992901940) e email (contato@jaleca.com.br). Só aparece em erros de pagamento, não em validações de formulário.
- **Frete ME — dimensões, peso e quantidade (14/04/2026)**: ✅ CORRIGIDO — `lib/melhor-envio.ts` tinha height e width trocados. Padrão correto: Largura=4cm (width, escala ×N), Altura=31cm (height, fixo), Comprimento=41cm (length, fixo), Peso=0.6kg/item. `ShippingCalculator` agora recebe prop `itemCount` e passa ao `/api/shipping`. `CartDrawer` e `CheckoutClient` passam quantidade real do carrinho. `payment/create` também usa 0.6kg/item para ME cart.
- **Alerta interno nova venda — destinatários (14/04/2026)**: ✅ CORRIGIDO — `sendInternalOrderNotification` em `lib/email.ts` enviava apenas para `financeiro@` e `contato@` (rhammon@ havia sido removido em sessão anterior). Restaurado: financeiro@ + contato@ + rhammon@objetivasolucao.com.br. Logging do `.catch` também melhorado (antes `.catch(() => {})` silencioso; agora loga o erro nos logs Vercel).
- **Pedidos não apareciam após definir senha (14/04/2026)**: ✅ CORRIGIDO — `redefinir-senha/page.tsx` não fazia login automático após salvar a senha. Agora chama `authLogin(email, newPassword)` antes de redirecionar para `/minha-conta`. Usuário chega autenticado e pedidos carregam imediatamente.
- **"Ver meu pedido" no email abria conta sem sessão (14/04/2026)**: ✅ CORRIGIDO — `MinhaContaClient.tsx` ao detectar usuário não logado, salva flag `jaleca-open-login` em `sessionStorage` e redireciona para `/`. `Header.tsx` detecta a flag e abre `AuthModal` automaticamente para o usuário logar.
- **SEO cidades (14/04/2026)**: ✅ — **51 páginas /cidade/** no total. `/cidade/` desbloqueado do robots.txt (estava no disallow mas no sitemap — contradição corrigida). Caratinga removida (franquia). **⚠️ REGRA: NÃO criar /cidade/ onde há franquia** — cidades bloqueadas: Caratinga, Ipatinga, Teófilo Otoni, Guarapuava (Contagem e Colatina têm franquia mas mantêm página por decisão do dono). Novas adicionadas: Porto Alegre, Goiânia, Florianópolis + top 30 Brasil (Brasília, Salvador, Fortaleza, Recife, Manaus, Belém, Guarulhos, São Luís, Maceió, Natal, Teresina, João Pessoa, Ribeirão Preto, São José dos Campos, Uberlândia) + 9 MG (Juiz de Fora, Betim, Sete Lagoas, Divinópolis, Poços de Caldas, Patos de Minas, Pouso Alegre, Varginha, Barbacena). Blog: título truncado em 55 chars + `robots index:true`. Sitemap resubmetido ao GSC.
- **Login 401 em todas as rotas autenticadas (13/04/2026)**: ✅ CORRIGIDO — `jaleca/v1/login` retornava `user_id` sem JWT válido (`jaleca-api.php` no fallback). `app/api/auth/login/route.ts` agora: (1) usa token do plugin se for JWT válido, (2) cria JWT próprio assinado com `JALECA_PLUGIN_SECRET` caso contrário. `auth.ts` já verifica HMAC com esse secret. Sem latência extra.
- **Produto mobile — fotos antes das variantes (13/04/2026)**: ✅ CORRIGIDO — `ProductDetailClient.tsx` trocou `order-1/order-2` entre galeria e info. Fotos sempre primeiro em qualquer iPhone.
- **Cupom PT — "Usage limit...has been reached" (13/04/2026)**: ✅ CORRIGIDO — regex em `payment/create/route.ts` atualizado para casar o formato atual do WC: `usage limit for coupon|has been reached`. Traduz para "Este cupom já atingiu o limite de uso."
- **Cubagem ME — largura base errada (13/04/2026)**: ✅ CORRIGIDO — `lib/melhor-envio.ts` usava `4 + 4*(items-1)` em vez de `31 + 4*(items-1)`. Largura base de 1 jaleco era 4cm em vez de 31cm, subestimando frete.
- **Sistema de rastreamento automático (12/04/2026)**: ✅ IMPLEMENTADO — ciclo completo: geração de etiqueta ME → status WC "enviado" + email "Enviado" → in_transit/out_for_delivery/delivered com emails individuais → auto-complete ao entregar. Cron a cada 2h + ME webhook.
- **Emails automáticos de status (12/04/2026)**: ✅ IMPLEMENTADO — on-hold, faturado, em-separacao, cancelled, refunded, completed (review request). Via webhook WC → `/api/orders/notify`.
- Blog CMS com IA: ✅ (`/blog/admin`) — Gemini 2.5 flash-lite + Unsplash + 4 estilos de escrita + humanização
- Melhor Envio shipping: ✅ token real configurado, CNPJ `30379063000161`, renovação automática mensal
- Frete: ✅ PAC/SEDEX/Jadlog via Melhor Envio, surcharge R$0 removido (12/04/2026)
- GA4 + Meta Pixel + Meta CAPI: ✅
  - ⚠️ Meta CAPI erro 400 — pixel `566059928254677` token precisa ser regenerado no Meta Events Manager
- **Relatório diário automatizado (13/04/2026)**: ✅ IMPLEMENTADO — `app/api/daily-report/route.ts` — Vercel cron 22h UTC (19h BRT). Dados: GSC + Pagar.me + WooCommerce + GA4 + Meta Ads + Google Ads API. Análise Gemini (SEO) + GPT-4.1 (CRO). Envia para rhammon@ + contato@jaleca.com.br.
- **Meta Ads API (13/04/2026)**: ✅ INTEGRADO — App "Jaleca Comunicação" (Business, ID: `1284297553808241`). Token 60 dias em `META_ADS_TOKEN`. Conta `act_2098470580937214` em `META_ADS_ACCOUNT_ID`. ⚠️ Token expira 13/06/2026 — renovar via Graph API Explorer + exchange.
- **Google Ads API (13/04/2026 madrugada)**: ✅ INTEGRADO — API v20. Manager `607-786-7298`. Customer `4446591621`. Developer Token em `GOOGLE_ADS_DEVELOPER_TOKEN`. OAuth2 Web client `890837860803-3kpdvca406q8u4djm7ljldqrf37op9dl`. Variáveis Vercel: `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`. Dados: custo, cliques, impressões, CPC, conversões, ROAS por campanha (7 dias + ontem).
- **Meta CAPI token (13/04/2026 madrugada)**: ✅ CORRIGIDO — token anterior era de Página Facebook (inválido). Novo token gerado em Events Manager → "Configurar sem Dataset Quality API". Pixel `566059928254677`. Salvo como `META_CONVERSIONS_API_TOKEN` no Vercel.
- **Rastreamento de compra browser**: ✅ `trackPurchase()` chamado em `app/pagamento/page.tsx` ao confirmar pagamento
- **Google Ads conversão direta (15/04/2026)**: ✅ CORRIGIDO — `components/Analytics.tsx` — 3 camadas de rastreamento em cada compra: (1) GA4 `purchase` → importação Google Ads, (2) GA4 `manual_event_PURCHASE` → importação Google Ads, (3) `conversion_event_purchase` → Google Ads direto independente de GA4. Antes havia `send_to: 'AW-18072506944'` sem label de conversão (código morto — não rastreava nada). Commits: `d592c18` + `d7bb8be`.
- **Meta Ads reestruturação (15/04/2026)**: ✅ via API — Awareness pausada (ROAS 0,83x), Remarketing reativada (ROAS 4,9x, orçamento R$20/dia), Lookalike mantida pausada (ROAS 0,85x). Campanha pública frio aguardando criativo (vídeo Reels 9:16 ou carrossel).
- **Google Ads keywords (15/04/2026)**: ✅ via API — negativos [jaleco] e [jalecos] (correspondência exata) adicionados na campanha Search. Keywords auditadas: sem broad puro, tudo frase/exato.
- **PRDs ADS criados (15/04/2026)**: docs/PRD-PROTOCOLO-OTIMIZACAO-ADS-2026.md + docs/PRD-ESTRATEGIA-KEYWORDS-JALECO-2026.md + docs/PRD-META-ADS-PERFORMANCE-2026.md + docs/PRD-CAMPANHA-AQUISICAO-META-2026.md
- Meta Pixel ID: ✅ `566059928254677`
- Meta CAPI token: ✅ corrigido (madrugada 13/04/2026)
- **Meta Pixel EMQ — qualidade de eventos (13/04/2026 noite)**: ✅ MELHORADO — commits 21ecfee + 2eb671c:
  - `Purchase`: removido `order_id` não-padrão, adicionado `num_items`
  - `ViewContent`: adicionado `content_category` (causa do score 3.0/10) + `email` quando logado
  - `AddPaymentInfo`: implementado (estava parado há 14 dias) — dispara ao selecionar PIX/Boleto/Cartão
  - `fbc` (Meta Click ID): adicionado em todos os eventos via cookie `_fbc` — recomendação #1 Meta (+100% conversões reportadas)
- **ContentSquare (13/04/2026 noite)**: ✅ INSTALADO — `app/layout.tsx` — gravação de sessão + heatmaps. Script: `https://t.contentsquare.net/uxa/d63ab31369d59.js` Project ID 741528. Revisar dados no fds 18-19/04.
- **SEO — H1 duplo no blog (13/04/2026 noite)**: ✅ CORRIGIDO — `app/blog/[slug]/page.tsx` — função `demoteH1()` converte `<h1>` do conteúdo WordPress para `<h2>` antes de renderizar.
- **SEO — redirect 404 blog (13/04/2026 noite)**: ✅ CORRIGIDO — `next.config.ts` — redirect 301 do slug errado para slug correto detectado no Screaming Frog.
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
- `/api/tracking/*` — rastreamento:
  - `check-all` — cron a cada 2h: detecta novas etiquetas ME + verifica movimentações (in_transit, out_for_delivery, delivered)
  - `melhor-envio-webhook` — webhook ME (POST): recebe evento de status, registra rastreio, envia email "Enviado" na primeira vez
  - `status` — consulta status de rastreio de um pedido
- `/api/orders/notify` — webhook WC: mapeia status WC → envia email correspondente (análise, faturado, separação, cancelado, reembolsado, review request). "enviado" não mapeado aqui — email com código de rastreio vem do check-all/ME webhook.
- `/api/orders/review-request` — cron diário 13h: envia pedido de avaliação para pedidos concluídos
- `/api/orders/payment-reminder` — cron horário: lembrete de pagamento pendente

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
- Funções de status de pedido: `sendOrderUnderReview()`, `sendOrderInvoiced()`, `sendOrderPacking()`, `sendOrderCancelled()`, `sendOrderRefunded()`, `sendReviewRequest()`
- Funções de rastreamento: `sendOrderShippedWithTracking()`, `sendOrderInTransit()`, `sendOrderOutForDelivery()`, `sendOrderDelivered()`
- Funções gerais: `sendOrderConfirmation()`, `sendBoletoEmail()`, `sendWelcome()`, `sendEmailVerification()`, `sendSetPasswordEmail()`, `sendCartRecovery()`, `sendPaymentReminder()`
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
- Embalagem padrão ME (14/04/2026 — CORRIGIDO): `height=31, width=4×N, length=41, weight=0.6×N` — `lib/melhor-envio.ts`. Width e height estavam trocados antes.
- `ShippingCalculator` recebe prop `itemCount` (de `CartDrawer` e `CheckoutClient`) e envia ao `/api/shipping` para cubagem correta por quantidade

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

## ✅ Comunicação Automática de Pedidos — IMPLEMENTADO (12/04/2026)
Documento: `docs/PROJETO-RASTREAMENTO-APROVACAO.md`

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

## Pendente (prioridade)
1. **Cadastro de usuário** — ✅ RESOLVIDO (09/04/2026).
2. **Melhor Envio** — ✅ RESOLVIDO (09/04/2026). Token real configurado, integração automática ME cart, renovação mensal automática via cron.
3. **Rastreamento de compra browser** — ✅ RESOLVIDO (09/04/2026). `trackPurchase()` chamado no `/pagamento`.
4. **Canônico www** — ✅ RESOLVIDO (09/04/2026). www.jaleca.com.br → 308 → jaleca.com.br.
5. **Reset de senha** — ✅ RESOLVIDO (13/04/2026). Plugin Jaleca Fix v2.2 com endpoints token.
6. **CPF duplicado no checkout** — ✅ RESOLVIDO (13/04/2026). Plugin lookup-cpf + cpf-lookup/route.ts atualizado.
7. **Variações sem preço** — ✅ RESOLVIDO (13/04/2026). Hook WP + filtro frontend + bloqueio API.
8. **Cartão de crédito "load Failed"** — ✅ RESOLVIDO (12/04/2026). CSP `connect-src` + `api.pagar.me`.
9. **Portal pedidos (/minha-conta) 401** — ✅ RESOLVIDO (13/04/2026). `login/route.ts` emite JWT próprio quando `jaleca-api.php` não retorna token válido.
10. **Email boleto** — ✅ RESOLVIDO (12/04/2026). `sendBoletoEmail()` em payment/create.
11. **Sistema rastreamento automático** — ✅ RESOLVIDO (12/04/2026). Ciclo completo implementado.
12. **Configurar webhook ME** — ✅ RESOLVIDO (14/04/2026). Configurado em app.melhorenvio.com.br → Integrações → Área Dev. → Jaleca → Novo Webhook.
13. **Boleto DDA mostrando "Pagar.me"** — ⏳ AÇÃO MANUAL. Contatar suporte Pagar.me para configurar sub-merchant/recebedor com conta bancária da Jaleca. Não é problema de código.
13b. **Relatório diário — migrar Pagar.me → Cielo (16/04/2026)**: ✅ FEITO — `fetchPagarme()` substituído por `fetchCielo()` em `app/api/daily-report/route.ts`. Usa Cielo Query API (`/1/sales?StartDate&EndDate`). Status: 2=pago, 3/13=falha, 1/12=pendente. Commit `3559700`.
14. **WooCommerce SKUs duplicados** — 4 produtos afetados (TESTE, Jaleco Slim Princesa Laise, Macacão Paris Feminino, Conjunto Executiva Feminino). Corrigir antes do próximo sync Bling.
15. **Google Ads — Verificação do anunciante** — Adm. → Configurações → Verificação do anunciante
16. **Google Ads — Ao atingir 30 compras** — trocar Search para "Maximizar conversões". Checar termos novos para negativar.
17. **Meta Remarketing** — ✅ anúncio criado + públicos configurados (09/04/2026). Se não gastar em 3 dias, expandir público para 90 dias.
18. **Meta CAPI token** — ⚠️ regenerar no Meta Events Manager (token atual de Página Facebook não serve)
19. **Imagens WordPress** — EWWW Image Optimizer (imagens > 8MB bloqueavam Meta Catálogo)
20. **Instagram Shopping** — aguardando sincronização Meta
21. **Vercel Pro** — verificar prazo trial
22. **Marketplaces via Bling** — próximo passo: conectar Mercado Livre. Ver `docs/PROJETO-MARKETPLACES-BLING.md`
23. **Google Ads — Performance Max** — criar no mês 2
24. **Investigar "Produto não encontrado"** — 24 sessões em 404, verificar quais URLs estão quebrando
25. **admin.jaleca.com.br** — ✅ RESOLVIDO (15/04/2026) — X-Robots-Tag: noindex adicionado no middleware (commit 0423a91) + URL removida via GSC → Remoção de URLs.
26. **⚠️ Meta Ads — Anúncios de vídeo PENDENTES (17/04/2026)** — Campanhas e ad sets criados via API, mas criativo de vídeo precisa ser adicionado MANUALMENTE no Meta Ads Manager. Ver instruções completas abaixo.

## Mobile First — Fase 1-4 (17/04/2026) — commit aeb8665

- **Tipografia mobile** — ✅ IMPLEMENTADO — 15 arquivos corrigidos. Padrão `text-[12px] md:text-[10px]`: mobile legível, desktop idêntico ao anterior. globals.css: iOS Safari zoom prevention (`font-size: 16px` em inputs no mobile).
- **Touch targets WCAG AA** — ✅ IMPLEMENTADO — 32 elementos abaixo de 44px corrigidos. Header ícones: `min-h-[44px] min-w-[44px]`. CartDrawer: botões +/- `w-11 h-11`, lixeira `min-44px`. ProductCard: wishlist/compare `w-11→w-8` responsivo.
- **Sticky Add-to-Cart produto** — ✅ IMPLEMENTADO — `ProductDetailClient.tsx`: IntersectionObserver detecta quando botão sai da viewport → sticky bar aparece na base com nome + preço + botão 48px. `pb-[env(safe-area-inset-bottom)]` para iPhone. `md:hidden`.
- **PWA** — ✅ IMPLEMENTADO — `public/manifest.json` criado (standalone, theme #1a1a1a, pt-BR). `layout.tsx`: `<link rel="manifest">` + `theme-color` + `apple-mobile-web-app-capable` + `apple-mobile-web-app-status-bar-style`.
- **Regra**: mudanças são mobile-only com `md:` fallback — notebook/desktop sem impacto visual.
- **Fase 5 pendente**: reduzir HTML de 850KB (RSC streaming payload) — requer auditoria de quais dados estão sendo serializados na homepage.

## SEO — Otimizações (16/04/2026)
- **Meta titles categorias** — ✅ RESOLVIDO (16/04/2026) — Commit `3e8ec21`. CATEGORY_MAP agora tem campo `title` por categoria. `jalecos-femininos`: inclui modelos (Slim, Princesa, Elastex) + frete grátis estados. `conjuntos`: inclui Scrub + Pijamas Cirúrgicos. `dólmãs`: título descritivo com intent.
- **Meta title /produtos** — ✅ RESOLVIDO (16/04/2026) — Commit `3e8ec21`. Title agora começa com "Jalecos" (keyword genérica, 89 impressões, pos 36). Description inclui toda a linha de produtos + keywords.
- **HowTo + FAQPage schema automático no blog** — ✅ IMPLEMENTADO (16/04/2026) — Commit `b67634e`. `app/blog/[slug]/page.tsx`: `extractHowToSteps()` gera HowTo schema para posts "Como..." com `<ol>`. `extractFaqItems()` gera FAQPage schema de H2/H3+parágrafo. Afeta todos os posts automaticamente.
- **Blog "Como Lavar Jaleco" otimizado para Featured Snippet** — ✅ RESOLVIDO (16/04/2026). Post ID 62454 reescrito com: resposta direta 50 palavras no topo, H2 "Como Lavar Jaleco: Passo a Passo" + lista numerada 6 passos, 7 seções FAQ, links internos para categorias. 3 fotos adicionadas (IDs WP: 62524, 62525, 62526). Posição atual: 8.1 — Featured Snippet esperado em 3-14 dias.
- **Credenciais WP Admin** — `contato@jaleca.com.br` + App Password via `WP_ADMIN_APP_PASSWORD` (Vercel Production). `WP_APP_PASS` (antigo) está inválido — não usar.

## Performance (09/04/2026)
- Cache headers corrigidos no `next.config.ts` (regex estava quebrado — assets sem cache)
- Preconnect adicionado: Facebook, Google Tag Manager, wp.jaleca.com.br
- DNS-prefetch: embed.tawk.to
- Hero image: `loading="eager"`, `decoding="sync"`, `sizes="(max-width: 767px) 100vw, 58vw"`
- Vídeos dos cards comprimidos com ffmpeg (12MB → 3.3MB, 73% menor)
- Vídeos carregam via IntersectionObserver (lazy-load — zero impacto no PageSpeed)
- PageSpeed antes: FCP 2.7s | LCP 7.7s | TBT 160ms | CLS 0 | SI 4.3s

## Performance Mobile — segunda rodada (16/04/2026) — commit d9236a2
- Score mobile era 64 (70% dos clientes acessam via mobile)
- **ContentSquare movido do `<head>` para `<Script strategy="lazyOnload">`** — tirado do caminho crítico, não concorre mais com hero por banda no mobile
- **CookieConsent**: delay 3s adicionado (commit anterior) — antes era LCP element causando 9.7s
- **FranqueadoBanner**: delay 4s no fetch `/api/franqueado` (commit anterior) — tirado do caminho crítico
- **Fontes reduzidas**: DM Sans 5→3 pesos (removidos 300 e 600), Cormorant 4→3 pesos (removido 500) — 3 requisições a menos no mobile
- **ScrollReveal**: removido `filter: blur(4px)` — blur na GPU do mobile contribuía para TBT. Mantido opacity + translateY
- **GoogleMerchantBadge**: `afterInteractive` → `lazyOnload` — script do Google Merchant não bloqueia mais interação
- **warm-cache.mjs**: homepage + 5 categorias adicionadas ao aquecimento pós-deploy
- Score estimado após deploy: 64 → ~72–78

## Meta Ads — Campanhas Prospecção Vídeo Abr 2026 (17/04/2026)

### ⚠️ PENDENTE: Criar anúncios de vídeo manualmente no Meta Ads Manager

As 3 campanhas e ad sets foram criados via API. O vídeo está na Business Creative Library (não acessível via Marketing API token). O anúncio precisa ser criado manualmente.

**Estrutura criada (17/04/2026):**
| Campanha | Ad Set | Status |
|---|---|---|
| Prospecção - Lookalike - Vídeo Abr 2026 | Lookalike 1% BR - Mulheres 22-50 | Ativo, sem anúncio |
| Prospecção - Saúde e Beleza - Vídeo Abr 2026 | Saúde - Profissionais Saude BR | Ativo, sem anúncio |
| Prospecção - Saúde e Beleza - Vídeo Abr 2026 | Beleza - Manicure Salao Cosmetologia | Ativo, sem anúncio |

**Como criar o anúncio (repetir para cada ad set):**
1. Meta Ads Manager → campanha correspondente → ad set → aba **Anúncios** → **+ Criar**
2. Formato: **Vídeo único**
3. Vídeo: `Jaleco-Jaleca-Slim-branco.MP4` (ID: `1694667288205376`, está na Business Creative Library)
4. Texto: `Antes de você se apresentar, seu jaleco já foi avaliado.\nVista o que você merece.\n3x sem juros · Frete Grátis SP, RJ, MG, ES`
5. Título: `Jalecos Jaleca — Compre Agora`
6. Botão CTA: **Comprar agora**
7. URL destino: `https://jaleca.com.br/produtos?categoria=jalecos-femininos`
8. Publicar → repetir para os outros 2 ad sets
9. Após os 3: clicar **Revisar e publicar** para resolver "Edições não publicadas"
10. Deletar ad set rascunho "Novo conjunto de anúncios de Vendas" (criado por acidente)

**Por que a API não consegue:** vídeo está em Business Creative Library (`act_2098470580937214`), não na Ad Account. Token de Marketing API não tem `pages_read_engagement`. Solução definitiva: usar token de Página com esse escopo.

**Conta Meta:** `act_2098470580937214` | Token expira: 13/06/2026 (`META_ADS_TOKEN`)

---

## Best-sellers e Busca (17/04/2026)
- **Best-sellers list** (`lib/best-sellers.ts`): APENAS 2 produtos definidos pelo dono — Slim Tradicional Fem + Masc. NÃO adicionar outros sem autorização. NÃO integrar com total_sales WooCommerce.
- **Busca com best-sellers no topo (17/04/2026)**: ✅ CORRIGIDO — `SearchModal.tsx` agora busca 20 resultados (era 8), ordena pelo rank em `BEST_SELLER_SLUGS` e mostra top 10. Os 2 destaques sempre aparecem primeiro.
- **Cache de produtos nunca mais vazio (17/04/2026)**: ✅ CORRIGIDO — `unstable_cache` em `app/produtos/page.tsx` e `app/categoria/[slug]/page.tsx` agora faz `throw` quando retorna 0 produtos (impede cache de `[]`). Fallback busca direto sem cache. Antes: se WooCommerce falhasse durante deploy, o site ficava sem produtos por 1h.
- **URL param ?categoria= (17/04/2026)**: ✅ IMPLEMENTADO — `CATEGORIA_MAP` em `app/produtos/page.tsx` mapeia slugs de anúncios Meta (ex: `?categoria=jalecos-femininos`) para filtros internos (cat=Jalecos, genero=Feminino). Links de ads abrem com filtros corretos.
- **`.vercelignore` (17/04/2026)**: ✅ — exclui `docs/` do deploy CLI. `scripts/` NÃO pode ser excluído pois `warm-cache.mjs` é necessário no build command.

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
- Email de confirmação PIX/Boleto: `/api/payment/create/route.ts`
- **Email boleto com URL + linha digitável**: `sendBoletoEmail()` em `lib/email.ts` — disparado em `payment/create` para pagamentos boleto
- Email "Bem-vinda + Defina sua senha": via `forgot-password?isNewCustomer=true` após auto-create no checkout
- Email interno `financeiro@jaleca.com.br`: disparado a cada nova venda com cliente, forma de pagamento, itens e link para o pedido no WP Admin

### Frete e Melhor Envio (09/04/2026)
- PAC + SEDEX + Jadlog sempre exibidos — se API retornar < 2 opções, usa fallback regional
- Fallback: PAC R$18,90 / Jadlog R$22,90 / SEDEX R$35,90 (Sul/Sudeste); PAC grátis acima R$499 para SP/RJ/MG/ES
- **Token real ME configurado** — expira ~30 dias, renovação automática via cron (dia 1 de cada mês, `app/api/melhor-envio/refresh/route.ts`)
- **ME cart automático**: pedido pago → `addShipmentToMECart()` em `lib/melhor-envio.ts` → aparece no carrinho ME com serviço correto
- **IDs corretos ME (confirmado 14/04/2026)**: PAC=1, SEDEX=2, Jadlog Package=7, Jadlog .com=8. IDs 3,4 são PAC Mini e SEDEX 12 (Correios) — NÃO são Jadlog.
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

## Implementado (12/04/2026) — Mobile UX + Sessão + Tradução

### UX Mobile — correções críticas
- **Menu mobile overlay (12/04/2026)**: `components/Header.tsx` — menu era inline dentro do `<header>`, empurrava todo o conteúdo para baixo. Agora é drawer fixo (`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] z-[200]`) com backdrop semitransparente. Auto-fecha ao navegar via `usePathname` + `useEffect`. Body scroll bloqueado quando aberto.
- **Página de produto mobile (12/04/2026)**: `ProductDetailClient.tsx` — informações (nome/preço/CTA) aparecem antes das fotos no mobile via CSS `order-1`/`order-2`. Desktop mantém layout lado a lado.
- **Checkout mobile layout (12/04/2026)**: `CheckoutClient.tsx` — resumo do pedido (`<aside order-2>`) aparece antes do botão Finalizar (`<div order-3>`) no mobile. Botão é 3º item do grid com `order-3 lg:col-start-1`. Upsell section oculta no mobile (`hidden lg:block`).
- **CartDrawer "Continuar Comprando" (12/04/2026)**: `components/CartDrawer.tsx` — botão adicionado entre "Finalizar Compra" e "Limpar sacola", chama `closeCart()`.

### Sessão e autenticação
- **AuthContext — validação de sessão (12/04/2026)**: `contexts/AuthContext.tsx` — ao carregar do localStorage, valida que `token` tem 3 partes (JWT válido) e `id > 0`. Sessões corrompidas (de antes do fix JWT) são auto-limpas. Fix para: nome estranho no login, pedidos sempre mostrando 0.
- **MinhaContaClient — estados de erro (12/04/2026)**: `app/minha-conta/MinhaContaClient.tsx` — estados `expired` e `error` para busca de pedidos. 401/403 mostra "Sua sessão expirou. Faça login novamente." com botão. Erros genéricos mostram "Tentar novamente".

### Tradução de erros WooCommerce
- **Cupom em inglês (12/04/2026)**: `app/api/payment/create/route.ts` — mensagens de erro WooCommerce em inglês traduzidas para português por regex no catch: "coupon usage limit", "already been used", "not applicable", "expired", "minimum spend", "invalid coupon".

## Implementado (12/04/2026) — Correções e Rastreamento

### Correções críticas
- **Cartão de crédito**: CSP `connect-src` em `next.config.ts` agora inclui `https://api.pagar.me` — browser bloqueava tokenização
- **Portal pedidos**: `lib/auth.ts` → `verifyCustomerToken()` extrai user ID de `data.user.id` (WP JWT Auth) além do `sub` padrão. Tokens com issuer `jaleca.com.br` são confiados mesmo se HMAC falhar.
- **Email boleto**: `sendBoletoEmail()` adicionada em `lib/email.ts`, disparada em `payment/create` para boleto
- **Email redefinição de senha personalizado**: `sendSetPasswordEmail()` agora recebe `customerName` e saúda por nome
- **Erro email duplicado no cadastro**: `register/route.ts` detecta `rest_cannot_create` + mensagem contendo "permissão" como email duplicado
- **Parcelas por valor**: `CheckoutClient.tsx` — 1x abaixo R$100, até 2x entre R$100–R$149, até 3x acima R$150
- **Campos obrigatórios checkout**: telefone e bairro adicionados como required no `CheckoutClient.tsx`
- **Checkout mobile layout (12/04/2026)**: `CheckoutClient.tsx` — resumo do pedido (`<aside order-2>`) aparece antes do botão Finalizar (`<div order-3>`) no mobile. Botão é 3º item do grid com `order-3 lg:col-start-1`.
- **Login JWT (12/04/2026)**: `app/api/auth/login/route.ts` — `extractUserIdFromToken()` decodifica payload JWT base64url e extrai `data.user.id` (WP JWT Auth) ou `sub`. `user.id` nunca mais será null após login.
- **Endereço pré-preenchido no checkout**: ao abrir o checkout logado, busca último pedido via `/api/orders` e preenche endereço/telefone automaticamente.
- **Email notificações internas**: `lib/email.ts` — removido `rhammon@objetivasolucao.com.br` da lista de destinatários internos de nova venda. Mantém apenas `financeiro@jaleca.com.br` e `contato@jaleca.com.br`.

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

## Mobile First — Fase 5 + UX Fixes (17/04/2026) — commits 1546ae7, 91d5de7, 3aade7f, 601de61

### Phase 5 — Redução de payload RSC
- **`lib/graphql.ts`**: novo `GET_PRODUCTS_LISTING` — remove `id`, `name`, `stockStatus`, `price` das variações. ProductCard só usa `regularPrice`, `salePrice`, `image`, `attributes` nas listagens.
- **`app/produtos/page.tsx`** + **`app/categoria/[slug]/page.tsx`**: trocam `GET_PRODUCTS` por `GET_PRODUCTS_LISTING` — ~40% menos dados por variação (600+ nós afetados).
- **`app/page.tsx` — `GET_FEATURED_PRODUCTS`**: variações da homepage reduzidas a só `regularPrice` + `salePrice` (sem image/attributes — homepage não tem filtro por cor).
- **`components/GoogleReviewsServer.tsx`**: novo componente servidor assíncrono — reviews do Google carregam via `<Suspense>` streaming, fora do HTML inicial da homepage.
- **Resultado**: /produtos ~850KB → ~500KB HTML (uncompressed). Reviews do Google não bloqueiam mais o HTML inicial.

### Menu mobile — redesign (17/04/2026)
- **Drawer dark**: fundo `#1a1a1a`, backdrop com `backdrop-blur-sm`, texto `text-white/70`
- **Logo**: apenas a flor circular `public/icon-flower.png` (40×40px) — não mais o logo completo
- **Fecha ao clicar**: `onClick={() => setMobileOpen(false)}` em todos os links — antes não fechava quando pathname não mudava (ex: /produtos?cat=Jalecos)
- **Rodapé drawer**: "Jaleca — Jalecos e mimos."
- **`public/icon-flower.png`**: logo circular 512×512 oficial salvo em public + manifest.json atualizado para PWA

### UX fixes (17/04/2026)
- **AnnouncementBar**: `truncate` no texto + `shrink-0` no CTA → "Ver novidades" / "Saiba mais" não some mais pela borda direita no mobile
- **Facebook URL**: corrigido de `jalecaoficial` → `jalecaa/` em `Footer.tsx` e `layout.tsx` (schema sameAs)
- **Contagem reviews produto**: removida — `ProductDetailClient.tsx` mostra só a nota (ex: "4.9") sem "(58 avaliações)"
- **iOS zoom fix**: `globals.css:208` — `font-size: 16px !important` em inputs no mobile — JÁ ESTAVA IMPLEMENTADO desde Mobile First Fase 1-4. Auditores que reportam "0 ocorrências" analisam classes Tailwind inline, não o CSS global — ignorar essa crítica.

### Assets (17/04/2026)
- `public/icon-flower.png` — logo flor circular 512×512 bege/branco fundo transparente
- `public/icon-flower.svg` — versão SVG anterior (mantida como fallback)
- `manifest.json` — ícones PWA atualizados: `icon-flower.png` com `purpose: maskable any`
