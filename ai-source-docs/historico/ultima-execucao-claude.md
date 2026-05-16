Data: 2026-05-16 03:15
Tarefa: Prova social nas páginas de produto — substituir aba "Clientes" por bloco com tabs (Profissionais + Clientes usando Jaleca) posicionado entre o seletor de cor/tamanho e o grid de dados técnicos
Arquivos alterados:
- app/produto/[slug]/ProductSocialProof.tsx (novo)
- app/produto/[slug]/ProductDetailClient.tsx
O que foi feito:
- Criado componente ProductSocialProof com 2 abas: "Profissionais de todo o Brasil" (carrossel @/components/UGCSection — logos correndo) e "Clientes usando Jaleca" (grid UGC ./UGCSection — fotos/vídeos reais)
- Inserido <ProductSocialProof /> em ProductDetailClient.tsx logo após o bloco do botão "Adicionar à sacola" e antes do bloco de Content tabs
- Removida aba "Clientes" das tabs inferiores
- Removido o bloco condicional {activeTab === 'clientes' && <UGCSection />}
- Atualizado tipo ActiveTab para remover 'clientes'
- Trocado import: @/components/UGCSection → ./ProductSocialProof
- Decisão UX: ao invés de 4 carrosséis empilhados, consolidado em 1 bloco com 2 abas. Stories IG e Postagens descartados a pedido do usuário.
Comandos rodados: npx tsc --noEmit (0 erros)
Resultado: OK — pendente teste manual em produção
Riscos identificados: nenhum (cobre produto pai e filho automaticamente pela mesma rota /produto/[slug])
Próximo passo: aguardar autorização do usuário para deploy
