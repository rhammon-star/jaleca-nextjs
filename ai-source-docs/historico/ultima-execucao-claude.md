Data: 2026-05-04 14:30
Tarefa: Fix rastreamento Google Ads — captura/persistência/envio de gclid + UTMs
Arquivos alterados:
- lib/click-ids.ts (NOVO) — captura gclid/gbraid/wbraid/fbclid + UTMs em localStorage TTL 90d
- components/ClickIdCapture.tsx (NOVO) — componente client que dispara captura no mount/route change
- app/layout.tsx — injetado <ClickIdCapture /> ao lado do <Analytics />
- app/checkout/CheckoutClient.tsx — lê clickIds do localStorage e envia em paymentData
- app/api/payment/create/route.ts — aceita clickIds, salva em WC meta (_gclid, _utm_*, _landing_page, _referrer) e repassa ao GA4 MP
- app/api/payment/webhook/route.ts — para PIX/Boleto, lê clickIds do WC meta e passa ao GA4 MP
- lib/ga4-measurement-protocol.ts — payload purchase + conversion_event_purchase agora carregam gclid/source/medium/campaign

O que foi feito:
- Diagnosticado: site nunca capturava gclid/UTM (0 ocorrências em todo o código)
- Implementada cadeia completa: URL → localStorage → checkout → API → WC meta + GA4 MP
- Atribuição funciona em ambas vias: GA4 → Google Ads import (gclid no purchase) e enhanced conversions (email)
- Janela de atribuição 90 dias (padrão Google Ads), preserva primeiro-toque com merge

Comandos rodados:
- npx tsc --noEmit → OK (sem erros)

Resultado: OK (código pronto, deploy pendente de aprovação)

Riscos identificados:
- Tocou área crítica (checkout + payment/create) — mas só adiciona campos opcionais, não muda lógica de pagamento/preço/Cielo
- Próxima compra teste deve gerar pedido WC com meta `_gclid` preenchida (se vier de anúncio com auto-tagging)

Próximo passo:
1. Usuário aprovar deploy em produção
2. Verificar GA4_MEASUREMENT_PROTOCOL_SECRET preenchido no Vercel (Production)
3. Verificar auto-tagging ativo em Google Ads → Configurações → Conta
4. Verificar conversão "purchase" em Google Ads → Conversões marcada como "Importada do GA4"
5. Após deploy, fazer compra teste clicando em anúncio Google e validar pedido WC com meta `_gclid`
