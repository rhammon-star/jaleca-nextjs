Data: 2026-05-13 (sessão tarde — múltiplas tarefas)
Tarefa: Fix PIX 5% + limpeza Pagar.me + número ME + tokens ME re-autorizados

Arquivos alterados (resumo):
- app/checkout/CheckoutClient.tsx (PIX 5% sobre subtotal cheio)
- app/api/payment/create/route.ts (PIX server-side + número p/ ME + comentários Cielo)
- app/faq/page.tsx (Pagar.me → Cielo no JSON-LD + texto visível)
- lib/email.ts (param pagarmeOrderId → cieloPaymentId)
- app/api/orders/route.ts (PAGARME_METHODS → CIELO_METHODS)
- next.config.ts (CSP sem api.pagar.me)
- lib/pagarme.ts (DELETADO)
- lib/melhor-envio.ts (campo `number` no payload ME)

Env vars Vercel (production):
- MELHOR_ENVIO_TOKEN regravado (1587 chars, válido)
- MELHOR_ENVIO_REFRESH_TOKEN regravado (1620 chars)

Causa raiz dos problemas relatados:
- Tokens ME estavam VAZIOS em prod há ~7h → calculateShipping caía no fallback regional → cliente pagava valor diferente do real ME na geração de etiqueta.
- Sem token, addShipmentToMECart retornava null → pedidos ME criados manualmente sem tag wc-order-X → cron tracking não casava → sem emails automáticos.

Resultados validados pós-fix:
- /api/shipping com CEP SP: PAC 32,71 / Jadlog 24,70 / SEDEX 56,46 — valores REAIS ME, não fallback.
- /api/tracking/check-all: HTTP 200, sem erro.

Pendência:
- Pedidos antigos no ME sem tag wc-order-X não serão casados automaticamente. Usuário decidiu NÃO implementar fallback (C). Daqui pra frente, novas vendas criam tag corretamente.
- Cron renova tokens dia 1 e 21 — recomendado monitorar logs do refresh.

Próximo passo: monitorar 1ª venda nova → ver carrinho aparecer no painel ME com tag wc-order-X → ao gerar etiqueta, email automático cliente.

---
Adendo (mesma sessão): Implementado fallback C — match por CPF
- lib/melhor-envio.ts: extendido tipo MEShippedOrder (to.document, to.postal_code, to.name, self_tracking) + nova função getRecentShippedMEOrders()
- app/api/tracking/check-all/route.ts: Step 0 agora tenta tag wc-order-X primeiro; se falhar, casa por billing_cpf (digits only). Log indica origem do match (via=tag|cpf) e adiciona nota WC com origem.
- Risco baixo: CPF é único; remove do pool após uso pra evitar duplo match na mesma rodada.
