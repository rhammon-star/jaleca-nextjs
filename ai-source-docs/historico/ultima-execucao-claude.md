Data: 2026-05-17 21:50
Tarefa: Checkout Complemento + edit/remover item + Carrossel reviews 5★ + fix odontologia/ImageZoom + DEPLOY produção

Arquivos alterados (11):
- app/checkout/CheckoutClient.tsx (campo Complemento; botões −/+ quantidade; link Remover por item; autofill complemento de pedido anterior)
- app/api/payment/create/route.ts (billing.complement?; meta _billing/_shipping_address_complement; Cielo Number=address_2/Complement=complement; ME complement)
- components/profession-lp/GoogleRatingCarousel.tsx (carrossel scroll-snap reviews 5★)
- app/jaleco-feminino|masculino|odontologia|dentista/page.tsx (passam reviews={placeData?.reviews})
- app/jaleco-odontologia/page.tsx (getJalecos slice 6→9)
- components/ImageZoom.tsx (remove width/height conflitando com fill — Runtime Error /produto/[slug])
- components/InstagramGallery.tsx + components/ProfessionProductGrid.tsx (já carregadas de sessão anterior, agora commitadas)

O que foi feito:
1. CHECKOUT (área crítica): novo campo "Complemento (opcional)" — propaga para Melhor Envio, Cielo (Number agora vem do address_2 real, antes 'S/N' fixo) e WC meta. Autofill recupera de pedido anterior.
2. CHECKOUT: usuários reclamaram que não conseguiam alterar/remover item duplicado — adicionados botões −/+ (mín 1) e link "Remover" no resumo do pedido.
3. LPs: carrossel horizontal scroll-snap (CSS puro) com comentários 5★ do Google abaixo do GoogleRatingCarousel nas 4 LPs profissionais.
4. /jaleco-odontologia: grid limitado a 6 produtos → 9 (alinhado às outras LPs).
5. ImageZoom: Runtime Error em /produto/[slug] (next/image com fill + width simultâneo).

Comandos rodados:
- npx tsc --noEmit -p . → OK
- git commit f0f7d56 → 11 arquivos, 311+/143-
- vercel --prod --yes → READY ✅
  - Deployment ID: dpl_HDNdBLNPccjFVZPNevhjn8V9kRTL
  - Alias: https://jaleca.com.br

Resultado: OK — deploy em produção concluído.

Riscos identificados:
- Checkout é área crítica. Mudança aditiva (campo opcional + UI extra), mas validar: 1 pedido real PIX com complemento; confirmar payload chega no Melhor Envio e no pedido WC; confirmar botões −/+ e Remover funcionam.

Próximo passo: usuário valida em produção (pedido PIX real com complemento + manipulação carrinho).

### Consumo estimado por IA nesta tarefa

| IA | Participação estimada | Papel na tarefa |
|---|---:|---|
| Claude Code | 100% | Refactor checkout completo, propagação Cielo+ME+WC, fix odontologia+ImageZoom, carrossel reviews, build, deploy |
| Gemini | 0% | Não usado |
| GPT | 0% | Não usado |
| GSC | 0% | Não usado |

Estimativa operacional, não medição financeira.
