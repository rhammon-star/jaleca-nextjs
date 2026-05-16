Data: 2026-05-16
Tarefa: Substituir Instagram Gallery por carrossel UGCSection "Profissionais de todo o Brasil" em páginas de produto, cidade e LPs

Arquivos alterados:
- app/produto/[slug]/ProductSocialProof.tsx
- app/jaleco-esteticista/page.tsx
- app/jaleco-dentista/page.tsx
- app/jaleco-enfermeiro/page.tsx
- app/jaleco-professor/page.tsx
- app/page.tsx (home)
- app/cidade/[slug]/page.tsx

O que foi feito:
- ProductSocialProof: removido title="Clientes usando Jaleca", usa default "Profissionais de todo o Brasil"
- 4 LPs (esteticista, dentista, enfermeiro, professor): trocado InstagramGallery por UGCSection
- Home (page.tsx): removido import InstagramGallery, trocado por UGCSection
- Cidade: adicionado UGCSection antes do bloco FAQ (import já existia)

Resultado: OK — TypeScript sem erros
Próximo passo: deploy para produção
