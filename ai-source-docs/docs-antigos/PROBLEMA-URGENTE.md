# PROBLEMA URGENTE - Rastreamento Google Ads

## 🚨 PROBLEMA PRINCIPAL

**WooCommerce:** Vendas acontecendo normalmente  
**Google Ads:** 0 conversões registradas (últimos 7 dias)  
**Gap:** 100% das vendas NÃO chegam no Google Ads

## 📊 DADOS CONCRETOS

- **Últimos 7 dias:** 1 venda WooCommerce (R$16,77 cartão aprovado 24/04)
- **Google Ads conversões:** 0 (zero)
- **Pedido teste:** #62823 com cartão aprovado - conversão NÃO apareceu

## 🔧 O QUE JÁ FOI TENTADO

1. ✅ Verificado código `trackPurchase()` - está correto
2. ✅ Verificado GA4 Measurement Protocol server-side - configurado
3. ✅ Verificado `GA4_MEASUREMENT_PROTOCOL_SECRET` - existe no Vercel
4. ✅ Verificado filtro `/interno` - estava desativado durante teste
5. ✅ Verificado importação GA4→Google Ads - 2 ações de conversão ativas
6. ❌ Tentado adicionar Enhanced Conversions - deploy falhou

## 🛑 PROBLEMA SECUNDÁRIO - DEPLOYS FALHANDO

**Todos os deploys desde 21h dão erro:**

```
Error: Turbopack build failed with 3 errors:
./app/medidas/page.tsx:229:1
./app/nossas-lojas/page.tsx:231:1
./app/termos/page.tsx:211:1
Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
```

- Erro em 3 arquivos específicos (não modificados por mim)
- Erro persiste mesmo desabilitando Turbopack (`--no-turbo`)
- Código revertido para commit `ea2d157` que funcionava antes

## 🎯 HIPÓTESES

**Rastreamento:**
1. Eventos não estão sendo disparados pelo frontend
2. GA4 não está recebendo os eventos
3. Importação GA4→Ads está quebrada (apesar de parecer configurada)

**Deploy:**
1. Bug no Turbopack/Next.js 16.2.4 com esses 3 arquivos
2. Caractere invisível ou encoding nos arquivos
3. Conflito de dependências

## 📁 ARQUIVOS IMPORTANTES

- `components/Analytics.tsx` - rastreamento frontend
- `lib/ga4-measurement-protocol.ts` - rastreamento server-side
- `app/api/payment/webhook/route.ts` - webhook que dispara GA4 MP
- `app/pagamento/page.tsx` - dispara trackPurchase() no frontend

## ✅ SOLUÇÃO CRIADA

Página de teste: `public/test-tracking.html`  
URL: `https://jaleca.com.br/test-tracking.html`

Permite testar se GA4/Google Ads recebe eventos sem depender do código React.

## 🆘 NECESSÁRIO

1. Corrigir erro de deploy (3 arquivos problemáticos)
2. Identificar por que conversões não chegam no Google Ads
3. Validar rastreamento end-to-end
