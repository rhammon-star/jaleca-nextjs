Data: 2026-05-01 22:30
Tarefa: Análise relatório SEO noturno + noindex toucas e faixas de cabelo (Grupo B)

Arquivos alterados:
- app/produto/[slug]/page.tsx

O que foi feito:
- Leitura relatório SEO noturno (noite_relatorio_20260501_2114.md)
- Cruzamento com dados reais GSC: "jaleco feminino" posição 22, 37 impressões, 0 cliques
- Criado plano de batalha consolidado com GPT + GSC
- Adicionado array NOINDEX_PRODUCT_SLUGS em page.tsx com 3 slugs base:
  - touca-de-elastico-jaleca (6 variações)
  - touca-de-amarrar-jaleca (7 variações)
  - faixa-de-cabelo-jaleca (10 variações)
- Total: 23 páginas de acessório receberão noindex após deploy
- Lógica: isNoindexProduct() verifica slug exato + slugs que começam com base + cor

Comandos rodados:
- nenhum (deploy pendente)

Resultado: pendente deploy

Riscos identificados:
- Baixo — noindex não remove as páginas, só tira do índice do Google
- Toucas e faixas não têm tráfego orgânico (confirmado no GSC)

Próximo passo:
- Deploy para produção (perguntar ao usuário)
- Executar ações imediatas do plano de batalha:
  A) Corrigir title duplicado "| Jaleca | Jaleca" na categoria femininos
  B) Fix redirect chains — atualizar links internos para URLs mortas
  C) Blog jaleco odontologia: inserir 3 FAQs + CTA
  D) Link interno em /categoria/jalecos → /categoria/jalecos-femininos
- Usuário precisa: publicar 6 backlinks nos sites satélite + Google Merchant Center
