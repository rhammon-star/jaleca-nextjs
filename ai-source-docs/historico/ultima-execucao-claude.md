Data: 2026-05-04 22:30
Tarefa: Auditoria SEO homepage — 4 correções adicionais
Arquivos alterados: app/page.tsx
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
