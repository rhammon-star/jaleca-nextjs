Data: 2026-05-02 11:30
Tarefa: Fix produtos em destaque aparecerem primeiros em /categoria/jalecos-femininos

Arquivos alterados:
- lib/all-products.ts — pais featured sempre incluídos no array final
- app/produtos/ProductsClient.tsx — sort: best-seller > pai featured > variante featured > resto

O que foi feito:
- Diagnóstico: variantes de cor de produtos featured (Princesa, Gold, Elastex) inundavam rank 1, empurrando Slim Duquesa e Slim Dama para página 2 (43 restantes)
- Fix 1 (commit f996376): incluir pai como fallback quando variantes JSON não casam com cores WC (Verde Garrafa, Azul Pastel)
- Fix 2 (commit f314b76): pais featured sempre incluídos + nova hierarquia de sort que dá rank 1 (prioridade) para o pai como card único, antes das variantes de cor (rank 2)
- Resultado validado via curl: ordem agora é Slim Tradicional → Princesa Laise → Princesa → Gold → Elastex → Duquesa → Dama → variantes de cor

Comandos rodados:
- git push (2 commits: f996376, f314b76)
- vercel --prod (2 deploys)
- POST /api/revalidate com tag products + paths

Resultado: OK — todos os 7 produtos featured do home aparecem primeiros em /categoria/jalecos-femininos como cards únicos

Riscos identificados: nenhum — mudança isolada na lógica de ordenação

Próximo passo: monitorar GSC nos próximos 30 dias para "jaleco feminino" (item #10 do backlog)

### Consumo estimado por IA nesta tarefa

| IA | Participação estimada | Papel na tarefa |
|---|---:|---|
| Claude Code | 100% | Diagnóstico, fix em 2 etapas, deploy, validação |
| Gemini | 0% | Não acionado |
| GPT | 0% | Não acionado |
| GSC | 0% | Não acionado |
