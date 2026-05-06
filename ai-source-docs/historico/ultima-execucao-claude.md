Data: 2026-05-06 15:00
Tarefa: Fix cron cart-recovery — getAbandonedContacts retornava 0 contatos

Arquivos alterados:
  - lib/brevo-cart.ts (1 linha)

O que foi feito:
- Diagnosticado: cron rodava mas processed=0 sempre
- Causa raiz: parâmetro `modifiedSince=` vazio na URL do Brevo causava HTTP 400
- O código fazia `if (!res.ok) return []` silenciosamente
- Fix: removido `modifiedSince=` da query string
- Confirmado: endpoint sem o parâmetro retorna os 3 contatos com atributos corretos

Comandos rodados:
  - curl teste direto na API Brevo → confirmou 400 com modifiedSince= vazio
  - npx tsc --noEmit → OK

Resultado: OK — aguarda deploy
Riscos identificados: Após deploy, o cron vai disparar emails para cavalieri1301@hotmail.com e tanashyfava@gmail.com (etapa 0, abandonaram há dias — email de 1h será enviado na próxima execução do cron)
Próximo passo: Deploy + monitorar se emails são disparados
