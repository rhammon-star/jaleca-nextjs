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
- Blog CMS com IA: ✅ (`/blog/admin`)
- Melhor Envio shipping: ⚠️ token placeholder (OAuth2 real pendente)
- GA4 + Meta Pixel + Meta CAPI: ✅
- Meta Pixel ID: ✅ `566059928254677` (Pixel de BM 01 - Jaleca.Jaleca)
- Meta CAPI token: ✅ configurado
- Meta Catálogo: ✅ 30 produtos / 559 variantes (feed: `/api/feed/google-shopping`, atualiza 1h)
- Meta Loja Instagram + Facebook: ✅ aprovada (06/04/2026)
- Meta Checkout URL: ✅ configurado (`/api/meta-checkout`) — redireciona para produto por cor ou /produtos (08/04/2026)
- Meta Catálogo: ✅ 116 produtos ativos, 0 erros (08/04/2026)
- Franqueado popup: ✅ reset diário (STORAGE_KEY = data YYYY-MM-DD), region fix BR-MG→MG
- Franqueado debug: ✅ `/api/franqueado/debug`
- Google Ads: ✅ conta 444-659-1621 — Merchant Center 5759143798 ✅ (106 produtos aprovados), GA4 530831994 ✅, faturamento ✅
  - Campanha Search "Jaleca - Search - Jalecos": ✅ publicada (R$49/dia)
  - Tag conversão AW-18072506944: ✅ instalada em `components/Analytics.tsx` (aguardando verificação ~24h)
  - Campanha Shopping "Jaleca - Shopping - Produtos": ✅ publicada (R$30/dia, Maximizar cliques, CPC máx R$2,50)
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
- `app/blog/page.tsx` — lista de posts (busca do WordPress)
- `app/blog/[slug]/page.tsx` — post público
- `app/blog/admin/novo-post/NovoPostClient.tsx` — criar post com IA
- `app/blog/admin/posts/page.tsx` — lista com deletar
- `lib/wordpress.ts` — usa `NEXT_PUBLIC_WP_URL` (wp.jaleca.com.br)

### Pages extras
- `app/faq/page.tsx` — FAQ com 12 perguntas + FAQPage schema JSON-LD
- `components/Footer.tsx` — link para FAQ adicionado

### API routes
- `/api/auth/*` — login, register, forgot-password, verify-email, profile, reset-password, cpf-lookup
- `/api/blog/*` — posts, categories, generate, publish, improve-seo, new-image, auth
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

### Frete grátis (04/04/2026)
- Limite: **R$499**
- Estados elegíveis: **SP, RJ, ES, MG**
- CEP salvo em `localStorage` (`jaleca-checkout-cep`, `jaleca-checkout-state`)
- Se estado não é SP/RJ/ES/MG: mostra mensagem informativa
- Se estado é SP/RJ/ES/MG e valor >= R$499: "Você ganhou frete grátis!"
- Se estado é SP/RJ/ES/MG e valor < R$599: barra de progresso

### Produtos
- Query GraphQL usa `variations(first: 100)` — limite padrão WPGraphQL é 10
- Variações sem preço não aparecem no site
- Ordem dos tamanhos: PP → P → M → G → GG → G1 → G2 → G3

### Categorias e filtros (`lib/products.ts`, `app/produtos/ProductsClient.tsx`)
- Categorias: `["Todos", "Jalecos", "Dômãs", "Conjuntos", "Acessórios"]`
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
1. **Google Ads — Campanha Shopping** — 🔄 PARADO na tela de orçamento: digitar `30` → Continuar → publicar campanha "Jaleca - Shopping - Produtos"
2. **Google Ads — Verificação do anunciante** — completar verificação de identidade (Adm. → Configurações da conta → Verificação do anunciante)
3. **Google Ads — Tag de conversão** — aguardando verificação automática (~24h). Tag AW-18072506944 já instalada.
4. **Google Ads — Performance Max** — criar no mês 2, após ter dados de conversão. R$14/dia.
5. **API rastreamento** — projeto comunicação pedidos aprovado, aguardando token OAuth2 Melhor Envio
6. **Melhor Envio OAuth2 real**
7. **Imagens WordPress** — instalar EWWW Image Optimizer, bulk optimize (algumas imagens > 8MB bloqueavam Meta)
8. **Instagram Shopping** — coleção sem produtos visíveis — aguardando sincronização Meta após configuração do checkout URL (08/04/2026)
9. **Vercel Pro** — trial em andamento, verificar prazo de expiração

## CRO implementado (08/04/2026)
- Hero subheadline atualizado: "Antes de você falar, sua imagem já foi avaliada..."
- "Mais Vendidos" adicionado ao menu desktop + mobile com badge TOP
- Bloco de confiança na página de produto: Envio rápido + Troca fácil + Compra segura

## PRDs criados (docs/)
- `PRD-GOOGLE-ADS-MASTER-JALECA-2026.md` — estratégia completa Google Ads (campanhas, keywords, copy, CRO, projeções)
- `PRD-APRESENTACAO-PROJECAO-12-MESES.md` — projeção financeira 3 cenários para Manus gerar apresentação
