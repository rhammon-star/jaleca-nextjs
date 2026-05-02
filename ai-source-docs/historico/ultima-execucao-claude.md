Data: 2026-05-02 10:30
Tarefa: Diagnóstico completo GA4 + Meta Ads + Google Ads — rastreamento e campanhas

Arquivos alterados:
- app/api/feed/google-shopping/route.ts — filtro de 13 produtos no feed Shopping
- .gitignore — adicionado .venv/

O que foi feito:
- Confirmado: GA4 funcionando — 11 compras / R$2.526 nos últimos 4 dias ✅
- Confirmado: Google Ads mostra 0 conversões — causa identificada: compradores NÃO vieram de cliques pagos
- GA4 canal data: Paid Search e Paid Shopping = 0 conversões; Direct + Orgânico = 15 vendas; Unassigned/server-side = 19 vendas
- Conversão Google Ads é importada do GA4 (não tem tag send_to) — rastreamento está correto, campanha é que não converte
- Meta Ads 14 dias: R$1.296 gastos, 7 compras — só Remarketing Carrinho Abandonado funciona (CPA R$116)
- Google Ads 14 dias: R$1.029 gastos, 0 conversões — campanhas Pivot Saúde são o problema
- Feed Google Shopping filtrado para 13 produtos selecionados pelo usuário
- Deploy feito com o filtro do feed

Resultado: OK — feed deployado, diagnóstico completo entregue

Próximo passo (campanhas — usuário vai executar):
GOOGLE ADS — fazer no painel:
  - Reativar Shopping - Produtos (budget R$70/dia)
  - Manter Branded (budget R$20/dia)  
  - Pausar Pivot Saúde TIER 1, TIER 1B e Comerciais
META ADS — fazer no painel:
  - Remarketing Carrinho Abandonado → R$40/dia
  - Pausar: Remarketing Dinâmico, Novas Páginas, Prospecção Lookalike, Prospecção Saúde e Beleza
Budget total: R$130/dia

Riscos identificados:
- Feed Shopping: aguardar Merchant Center sincronizar (1h)
- Campanhas Pivot pausadas liberam ~R$80/dia que devem ir para Shopping
- Endpoint /api/all-campaigns ainda deployado — remover na próxima sessão

Backlog atualizado:
- #CAMPS: reconstruir campanhas Search Google com palavras-chave de alta intenção (semana que vem)
- #8 Meta Ads — excluir toucas do catálogo
- #10 GSC monitoring jun/2026
