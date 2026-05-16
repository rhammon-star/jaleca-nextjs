# Diagnóstico — GCLID e Conversões Google Ads
**Data:** 2026-05-04
**Status:** Problema identificado, solução pendente

---

## O Problema

Google Ads gastou **R$1.517,43** em 90 dias com **0 conversões registradas**.

Compra teste realizada em 04/05/2026 às 11:25 (Pedido #62949, PIX, R$4,27):
- `UTM source`: **vazio**
- `GCLID`: **nenhum**

O clique no anúncio do Google não está sendo capturado e associado ao pedido no WooCommerce.

---

## Como deveria funcionar

1. Usuário clica no anúncio → Google adiciona `?gclid=XXXX` na URL
2. GA4 (`gtag.js`) captura o `gclid` e armazena no cookie `_gcl_aw`
3. No checkout, o `gclid` é lido e enviado junto com o evento `purchase`
4. Google Ads recebe a conversão via:
   - **GA4 → Google Ads** (importação de metas do GA4), OU
   - **Measurement Protocol** (`GA4_MEASUREMENT_PROTOCOL_SECRET`)

---

## O que foi investigado

### ✅ Confirmado funcionando
- Cielo em produção (não sandbox)
- Checkout retorna 200 OK
- Pedido criado corretamente no WooCommerce
- `GA4_MEASUREMENT_PROTOCOL_SECRET` corrigido em 29/04/2026

### ❌ Confirmado quebrado
- `UTM source` não está sendo salvo nos pedidos WooCommerce
- `GCLID` não chega ao pedido — se perde antes ou durante o checkout
- Nenhum dos últimos 5 pedidos tem UTM ou GCLID preenchido

### ⚠️ Não verificado ainda
- Se o `gtag.js` está capturando o `gclid` corretamente na landing page
- Se o parâmetro `gclid` está sendo preservado durante navegação interna (produto → carrinho → checkout)
- Se o `GA4_MEASUREMENT_PROTOCOL_SECRET` está preenchido em produção (estava vazio no `.env.local`)
- Se a meta de conversão no Google Ads está importando do GA4 ou usando tag própria
- Se o `auto-tagging` está ativado no Google Ads

---

## Arquivos a investigar

| Arquivo | O que verificar |
|---|---|
| `app/checkout/CheckoutClient.tsx` | Como o GCLID é lido e enviado no `handleSubmit` |
| `app/api/payment/create/route.ts` | Se o GCLID é passado na chamada e enviado ao GA4 MP |
| `components/Analytics.tsx` | Se o `trackPurchase` envia o `gclid` corretamente |
| `.env` (Vercel produção) | Se `GA4_MEASUREMENT_PROTOCOL_SECRET` está preenchido |
| Google Ads → Configurações → Auto-tagging | Se está ativado |
| Google Ads → Conversões | Qual a origem: GA4 importada ou tag própria |

---

## Suspeitas prioritárias (ordem de investigação)

1. **`GA4_MEASUREMENT_PROTOCOL_SECRET` vazio em produção** — estava vazio no `.env.local`. Se estiver vazio no Vercel, nenhum evento de compra chega ao GA4.
2. **GCLID não preservado entre páginas** — o parâmetro `?gclid=` some quando o usuário navega do anúncio → produto → checkout.
3. **Auto-tagging desativado no Google Ads** — sem auto-tagging, o Google não adiciona o `?gclid=` nas URLs.
4. **Meta de conversão no Google Ads** — pode estar configurada para "tag do site" mas a tag não está disparando o evento correto.

---

## Impacto financeiro

- R$1.517,43 gastos sem otimização (algoritmo do Google não aprende sem dados de conversão)
- O algoritmo de lance automático está "cego" — não sabe quais cliques convertem
- Cada dia sem conversão piora o aprendizado das campanhas

---

## Próximos passos (quando retomar)

1. Verificar `GA4_MEASUREMENT_PROTOCOL_SECRET` no Vercel Dashboard → Environment Variables
2. Verificar se auto-tagging está ativo: Google Ads → Configurações → Conta → Auto-tagging
3. Verificar `components/Analytics.tsx` — função `trackPurchase` — se envia `gclid`
4. Verificar `app/checkout/CheckoutClient.tsx` — se captura e passa `gclid` para a API
5. Fazer nova compra teste após correções e verificar pedido WC com GCLID preenchido
