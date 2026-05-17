Data: 2026-05-17 18:30
Tarefa: Padronizar layout /jaleco-feminino, /jaleco-masculino, /jaleco-odontologia + reduzir Instagram gigante + filtrar marcações off-topic

Arquivos alterados:
- components/InstagramGallery.tsx (rewrite — filtro por keyword + grid menor + reordenação)
- app/jaleco-feminino/page.tsx (reordem seções)
- app/jaleco-masculino/page.tsx (reestruturação + schemas AggregateRating + ItemList)
- app/jaleco-odontologia/page.tsx (reordem seções, remove Instagram duplicado)

O que foi feito:
- InstagramGallery: filtra posts cuja caption tem keywords jaleco/jaleca/scrub/profissões. Exclui sem caption (corta off-topic: café, decoração, presentes). Ordem nova: Stories → Feed → Marcaram. Grid 3 cols mobile / 6 cols desktop. Aspect 4/5. max-width 1100. Resultado: ~1/3 do tamanho antigo.
- Feminino: ordem nova abaixo do grid → UGCSection (Profissionais BR) → GoogleRatingCarousel → InstagramLazy → Modelos → FAQ.
- Masculino: removida UGC+Google do fim (estavam órfãos). Adicionados InstagramLazy, schemaAggregateRating e modelosItemListSchema.
- Odontologia: trocada ordem UGC ↔ Google, Instagram movido pra cima (após Google), removida duplicata.

Comandos rodados:
- npx next build → OK (warnings antigos de WP cache, nada relacionado)

Resultado: OK — build verde, layout padronizado nas 3 LPs.

Riscos identificados:
- Filtro por keyword pode esconder fotos legítimas se caption não mencionar jaleco. Trade-off aceitável vs poluição visual atual.
- Deploy ainda não feito — aguardando autorização do usuário.

Próximo passo: validação visual do usuário em dev local (npm run dev) antes de deploy.

### Consumo estimado por IA nesta tarefa

| IA | Participação estimada | Papel na tarefa |
|---|---:|---|
| Claude Code | 92% | Mapeamento real do repo, refactor InstagramGallery, reordenação 3 LPs, schemas masculino, build |
| Gemini | 5% | Tentativa de mapa do projeto (não conseguiu, retornou só inferências) |
| GPT | 0% | Não usado |
| GSC | 0% | Não usado |
| Usuário | 3% | Confirmações visuais (screenshots) e decisões de escopo |

Estimativa operacional, não medição financeira.
