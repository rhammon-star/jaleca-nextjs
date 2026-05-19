Data: 2026-05-18 (sessão tarde/noite)
Tarefa: Automação completa de emails transacionais — PIX, status WC, envio Melhor Envio

Arquivos alterados:
- app/api/payment/webhook/route.ts — fix gate de duplicate email + chama sendInternalOrderNotification no PIX/boleto pago
- app/api/payment/create/route.ts — passa shipping.method_title para sendInternalOrderNotification
- app/api/tracking/check-all/route.ts — novo step: pedidos marcados "enviado" no WP sem rastreio ME disparam sendOrderShippedManual
- lib/melhor-envio.ts — log do status bruto do ME para diagnosticar por que in_transit/delivered não disparam
- lib/email.ts — (já tinha) shippingMethod + subjectPrefix em sendInternalOrderNotification + sendOrderShippedManual

WC webhook ativado via REST:
- id=10, order.updated → https://www.jaleca.com.br/api/orders/notify (estava disabled, agora active)
- Dispara emails automáticos para: on-hold, faturado, em-separacao, cancelled, refunded, completed

O que foi feito:
- Auditoria: 25 pedidos desde 01/05. 5 receberam email "despachado", 3 marcados enviado sem email, 0 receberam in_transit/out_for_delivery/delivered
- Bug 1 (PIX confirmado): webhook tinha gate `current.status !== 'pending'` → para PIX o status já era on-hold antes da confirmação, bloqueava email do cliente. Corrigido para só pular se já em processing/completed/enviado
- Bug 2 (admin não recebia PIX pago): webhook nunca chamava sendInternalOrderNotification. Adicionado com subject "Pagamento confirmado"
- Bug 3 (frete sumido em "Nova venda"): sendInternalOrderNotification não recebia shipping. Agora recebe e renderiza
- Gap envio manual: cron check-all agora detecta pedidos marcados "enviado" no painel WP sem código ME e dispara email do cliente
- Bloco C (status WC manuais): WC webhook id=10 ativado — não precisou de código novo

Comandos rodados:
- npx tsc --noEmit (OK)
- curl PUT /wp-json/wc/v3/webhooks/10 status=active (OK)

Resultado: parcial. Deploy pendente. Garantido após deploy:
- Pagamento PIX/boleto/cartão confirmado: cliente + admin recebem email com frete
- Mudança de status no WP (em análise, faturado, em separação, cancelado, reembolsado, concluído): cliente recebe email
- Pedido marcado "enviado" no WP (com ou sem rastreio ME): cliente recebe email

Riscos identificados:
- in_transit/out_for_delivery/delivered NÃO funcionam — Melhor Envio não retorna esses eventos (só "postado"). Log adicionado para confirmar via dados reais.

Próximo passo:
- Backlog: integrar 17track (free, 100 trackings/mês) OU Correios SRO oficial + Jadlog API (usuário vai pegar credenciais amanhã) para fechar in_transit/out_for_delivery/delivered
