Data: 2026-05-12 20:50
Tarefa: Fix og:image (miniatura compartilhamento) + preço maior em produto pai variável
Arquivos alterados: app/produto/[slug]/opengraph-image.tsx
O que foi feito:
- Query GraphQL local com galleryImages + variations { image, price, regularPrice }
- pickImage com fallback: image → galleryImages[0] → primeira variação com imagem
- lowestPrice: Math.min de price/regularPrice das variações; fallback ao parsePrice do pai
- parsePrice agora pega o MENOR de todos os matches (antes pegava o último → maior)
Comandos rodados: npx tsc --noEmit -p . (OK)
Resultado: OK — aguardando deploy
Riscos identificados: nenhum (afeta só imagem OG, não toca em schema/checkout/SEO indexável)
Próximo passo: usuário aprovar deploy → após deploy, validar share no Instagram com produto variável
