Data: 2026-05-08 14:11
Tarefa: EMERGÊNCIA — site quebrado em todas páginas /produto/* (clientes não conseguiam comprar)

Causa raiz identificada via Vercel logs:
- Upstash Redis (KV) plano Free atingiu limite de 500.000 comandos/mês
- generateMetadata em /produto/[slug] chamava `smembers color-slugs` → UpstashError → 500 em toda navegação
- Não era DNS/Hostinger (wp.jaleca.com.br já estava OK no IP novo 76.13.90.209)

Ação imediata (usuário no console Vercel):
- Upgrade Upstash Free → Fixed 250 MB ($10/mês) via Vercel Marketplace > Integrations > Upstash > jaleca-kv > Settings
- Database: jaleca-kv (ID 76941c3b-d6fc-431c-afd8-66b00b8f5314, endpoint poetic-leopard-66713)
- Páginas voltaram (HTTP 200 confirmado em 3 produtos), zero erros UpstashError em logs

Patch defensivo (aplicado local, NÃO deployado ainda — vai no próximo deploy):
Arquivos alterados:
- lib/kv-colors.ts

O que foi feito:
- try/catch em kv.smembers — falha agora retorna Set vazio em vez de derrubar página
- TTL cache em memória: 5min → 30min em sucesso (redução >90% das chamadas Redis)
- Em falha: cache de 1min para retry rápido sem martelar Redis
- registerColorSlug também envolto em try/catch
- Type-check (tsc --noEmit) passou clean

Comandos rodados:
- vercel logs jaleca.com.br (diagnóstico)
- npx tsc --noEmit (validação)

Resultado: OK — site operacional, vendas liberadas, patch pronto para próximo deploy.

Riscos identificados:
- Custo Fixed $10/mês pode ser overkill (Pay-as-You-Go ~$1-3/mês com tráfego atual)
- Backlog salvo em memory/backlog_upstash_revisao.md — revisar consumo em 2026-06-08

Próximo passo:
- Próximo deploy levará patch defensivo automaticamente
- 2026-06-08: verificar consumo real Upstash e avaliar troca para Pay-as-You-Go
