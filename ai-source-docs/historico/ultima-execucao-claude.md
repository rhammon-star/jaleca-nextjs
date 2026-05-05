Data: 2026-05-04 23:30
Tarefa: LLM SEO — FAQs em 7 páginas + 4 posts blog agendados no WordPress
Arquivos alterados:
  - app/jaleco-enfermeira/FaqAccordion.tsx + page.tsx
  - app/jaleco-fisioterapeuta/FaqAccordion.tsx + page.tsx
  - app/jaleco-veterinaria/FaqAccordion.tsx + page.tsx
  - app/jaleco-universitario-feminino/FaqAccordion.tsx
  - app/jaleco-plus-size/page.tsx
  - app/jaleco-feminino-acinturado/page.tsx
  - app/jaleco-feminino/page.tsx
O que foi feito:
  - 3-4 perguntas LLM SEO adicionadas em cada uma das 7 páginas (tecido, conforto, entrega, comparação)
  - Schema JSON-LD FAQPage atualizado em todas as páginas
  - 4 posts WordPress agendados (1/dia, 05-08/05/2026):
    ID 62951: "Jaleco que não amassa" → 05/05
    ID 62952: "Alternativa ao Dr. Jaleco" → 06/05
    ID 62953: "Jaleca vs Casa do Jaleco" → 07/05
    ID 62954: "Melhores sites jaleco feminino" → 08/05
  - Tecidos: Microfibra, Brim, Gabardine, Gabardine c/ elastano, Alfaiataria Premium (sem Oxford, sem bordado)
  - TypeScript: 0 erros
Resultado: OK — aguardando deploy
Riscos identificados: nenhum
Próximo passo: deploy para produção; monitorar GSC em 2 semanas para queries genéricas
O que foi feito:
- H2 "Por Que Jaleca?" → "Jalecos Profissionais com Qualidade Premium" (keyword semântica)
- H2 "Inspire-se — @jaleca.oficial" → "Inspiração — Jalecos no Instagram" (remove handle de rede social)
- Schema JSON-LD: adicionado legalName e taxID (CNPJ) no ClothingStore — sinal E-E-A-T
- Nova seção "Dicas e Guias para Profissionais" com 6 links internos para posts do blog + link /blog
- Nova seção "Entregamos para todo o Brasil" com 10 links para páginas de cidade (antes órfãs sem PageRank)
- TypeScript: sem erros (tsc --noEmit limpo)
Comandos rodados: npx tsc --noEmit
Resultado: OK — aguardando deploy
Riscos identificados: baixo — sem toque em checkout, tracking, canonical ou schema de produto
Próximo passo: Deploy para produção. Monitorar CTR no GSC em 7-14 dias. Avaliar item 3 (autoria blog) e item 6 (vídeos mobile) na próxima sessão.
