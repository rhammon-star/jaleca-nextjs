Data: 2026-05-09 19:00
Tarefa: Fix GSC — "Especifique offers, review ou aggregateRating" no schema Product
Arquivos alterados:
- app/produto/[slug]/page.tsx
O que foi feito:
- Identificado segundo bloco JSON-LD `@type: "Product"` (speakableJsonLd) sem offers/aggregateRating/review — causa do erro no GSC
- Movido campo `speakable` para dentro do jsonLd principal do Product
- Removido objeto `speakableJsonLd` e o `<script>` duplicado correspondente
Comandos rodados:
- npx tsc --noEmit (OK)
Resultado: OK
Riscos identificados: nenhum — não toca preço/checkout/áreas críticas
Próximo passo: deploy em produção e revalidar GSC (Rich Results Test) após indexação
