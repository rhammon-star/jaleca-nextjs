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

## Status das integrações (08/04/2026)
- WooCommerce GraphQL: ✅ `https://wp.jaleca.com.br/graphql`
- WooCommerce REST: ✅ Pedidos, customers
- Carrinho: ✅ localStorage
- Pagamentos Pagar.me: ✅ PIX ✅ Boleto ✅ Cartão de Crédito ✅ Webhook configurado
- Google Search Console: ✅ sitemap submetido
- Email transacional: ✅ via Brevo (`lib/email.ts`)
- Verificação de email: ✅ (não bloqueia checkout)
- Blog CMS com IA: ✅ (`/blog/admin`) — Gemini 2.5 flash-lite + Unsplash + 4 estilos de escrita + humanização
- Melhor Envio shipping: ⚠️ token placeholder (OAuth2 real pendente)
- GA4 + Meta Pixel + Meta CAPI: ✅
- Meta Pixel ID: ✅ `566059928254677` (Pixel de BM 01 - Jaleca.Jaleca)
- Meta CAPI token: ✅ configurado
- Meta Catálogo: ✅ 30 produtos / 559 variantes (feed: `/api/feed/google-shopping`, atualiza 1h)
- Meta Loja Instagram + Facebook: ✅ aprovada (06/04/2026)
- Meta Checkout URL: ✅ configurado (`/api/meta-checkout`) — redireciona para produto por cor ou /produtos (08/04/2026)
- Meta Catálogo: ✅ 116 produtos ativos, 0 erros (08/04/2026)
- Franqueado popup: ✅ raio 100km via geolocalização IP (Vercel headers), reset diário
- Franqueado debug: ✅ `/api/franqueado/debug`
- Google Reviews (homepage): ✅ via Places API (New) — `lib/google-places.ts`, `components/GoogleReviewsSection.tsx`
- Google Ads: ✅ conta 444-659-1621 — Merchant Center 5759143798 ✅ (106 produtos aprovados), GA4 530831994 ✅, faturamento ✅
  - Campanha Search "Jaleca - Search - Jalecos": ✅ R$70/dia, estratégia **Maximizar Cliques** (CPC máx R$2,50) — trocado de "Maximizar conversões" pois não havia histórico de conversões
  - Tag conversão AW-18072506944: ✅ verificada e funcionando — bolinha verde, origem GA4, evento `manual_event_PURCHASE`
  - Palavras-chave negativas: ✅ adicionadas (~40 termos de concorrentes: dra cherie, farcoo, coat lab, tutto bianco, etc.)
  - Campanha Shopping "Jaleca - Shopping - Produtos": ✅ publicada (R$30/dia, Maximizar cliques, CPC máx R$2,50)
  - Meta Remarketing: ✅ nova campanha "Remarketing - Carrinho Abandonado" criada sem Advantage+ (08/04/2026, em análise ~24h)
  - Campanha Performance Max: ⏳ criar no mês 2 após dados de conversão
- Tawk.to chat: ✅
- Speed Insights Vercel: ✅
- Trust badges + PIX badge + Urgência estoque: ✅
- FAQ page + FAQPage schema: ✅
- Cores produto ordenadas alfabeticamente: ✅ (`ProductDetailClient.tsx`)
- Cupom `PRIMEIRACOMPRA5JALECA`: ✅ criado no WooCommerce (06/04/2026)
- Descrições de produtos: ✅ reescritas com copywriting premium (todos os 30 produtos, 06/04/2026)
  - Estrutura: Headline → Subheadline → Parágrafo de conexão → Benefícios → Prova social → Especificações → FAQ → CTA
  - Tom: Confiante, profissional, premium, direto
  - SEO: naturalmente incluir "jaleco femenino", "jaleco premium", "jaleco para dentista", "jaleco confortável", "jaleco moderno"
  - NÃO usar emojis, linguagem genérica de marketplace, ou texto robótico

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
- A: jaleca.com.br → 216.198.79.1 (Vercel)
- A: wp.jaleca.com.br → 82.25.73.174 (Hostinger)
- CNAME: www → bc060d04fd865036.vercel-dns-017.com

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

## Pendente (prioridade)
1. **Cadastro de usuário** — ✅ RESOLVIDO (09/04/2026). Registro usa fallback WC direto se endpoint WP falhar. Busca CPF reescrita para buscar em todos customers.
2. **WooCommerce SKUs duplicados** — 4 produtos com variação com SKU = SKU do produto pai. Ver `memory/backlog_jaleca.md`. Corrigir no WooCommerce antes do próximo sync Bling.
3. **Google Ads — Verificação do anunciante** — Adm. → Configurações → Verificação do anunciante
4. **Google Ads — Em 7 dias** — checar termos novos para negativar; ao atingir 30 compras, trocar Search para "Maximizar conversões"
5. **Meta Remarketing** — se não gastar em 3 dias, expandir público de 60 para 90 dias
6. **API rastreamento** — projeto aprovado, aguardando token OAuth2 Melhor Envio
7. **Melhor Envio OAuth2 real** — token placeholder, frete usa fallback regional
8. **Imagens WordPress** — EWWW Image Optimizer (algumas imagens > 8MB bloqueavam Meta)
9. **Instagram Shopping** — aguardando sincronização Meta
10. **Vercel Pro** — verificar prazo trial
11. **Reset senha email** — confirmar funcionamento em produção
12. **Marketplaces via Bling** — próximo passo: conectar Mercado Livre (Preferências → Integrações → Central de atendimento do Mercado Livre). Ver `docs/PROJETO-MARKETPLACES-BLING.md`
13. **Google Ads — Performance Max** — criar no mês 2

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
- **`/api/auth/register`**: agora tem fallback WC nativo se endpoint WP `/wp-json/jaleca/v1/create-customer` falhar (404). Sempre cria a conta.
- **`/api/auth/cpf-lookup`**: reescrito — busca TODOS os customers e verifica `billing_cpf` em meta_data E em `billing.cpf` nativo. Não depende mais de endpoint customizado WC.
- **`/api/auth/forgot-password`**: detecta `isNewCustomer` → envia email "Sua conta Jaleca foi criada — defina sua senha" com link de 72h.
- **Checkout flow**: cliente com CPF novo → cria conta automaticamente → recebe email para definir senha → email de confirmação do pedido (PIX/Boleto).
- **`/minha-conta`**: nova aba **"Avaliar"** — lista pedidos concluídos, form com estrelas + comentário por produto → POST `/api/reviews/[productId]`.

### Email pós-compra
- `sendReviewRequest()`: email quando pedido fica `completed` → link para avaliar no produto (`#reviews`)
- Email de confirmação para PIX/Boleto agora disparado em `/api/payment/create/route.ts` (antes só cartão crédito aprovado)
- `sendWelcome()` existe em `lib/email.ts` mas ainda não é chamada no checkout (precisa adicionar)

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
