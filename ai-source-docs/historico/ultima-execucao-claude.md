Data: 2026-05-17 19:40
Tarefa: Checkout — campo Complemento (apto/bloco) + propagação para Melhor Envio, Cielo e WooCommerce

Arquivos alterados:
- app/checkout/CheckoutClient.tsx (novo campo `complement` no AddressForm, input UI entre Número e Bairro, autofill de pedido anterior, envio no billingData)
- app/api/payment/create/route.ts (billing.complement?: string; meta_data _billing/_shipping_address_complement; Cielo Number=address_2 / Complement=complement; ME addShipmentToMECart.complement = complement)
- app/jaleco-odontologia/page.tsx (getJalecos slice(0,6) → slice(0,9))
- components/profession-lp/GoogleRatingCarousel.tsx (carrossel comentários 5★)
- app/jaleco-feminino|masculino|odontologia|dentista/page.tsx (passam reviews={placeData?.reviews})

O que foi feito:
- Antes: address_2 era usado simultaneamente como "número" e mandado pra Cielo como Complement (errado). ME recebia complement='' hardcoded.
- Agora: address_2 = NÚMERO, novo campo complement = COMPLEMENTO. Cielo recebe Number=address_2 + Complement=complement. ME recebe complement separado. WC salva em _billing_address_complement e _shipping_address_complement (autofill recupera).
- Campo opcional, sem alterar validação obrigatória nem cálculo de frete.
- Odontologia: agora retorna 9 jalecos no grid (era 6).
- Carrossel 5★ Google scroll-snap CSS abaixo do GoogleRatingCarousel nas 4 LPs.

Comandos rodados:
- npx tsc --noEmit -p . → OK (sem erros)
- npm run dev rodando em :3000

Resultado: OK — aguardando validação visual + autorização para deploy.

Riscos identificados:
- Checkout é área crítica. Mudanças aditivas (campo opcional), mas testar fluxo completo: PIX, cartão, autofill com pedido antigo.
- Cielo Number agora vem do address_2 do cliente (antes era 'S/N' fixo). Se address_2 vier vazio cai em 'S/N'. Não muda o atual (já era exigido).

Próximo passo: usuário valida em dev (carrinho → checkout → preencher endereço + complemento → confirmar payload no console / pedido no WC).

### Consumo estimado por IA nesta tarefa

| IA | Participação estimada | Papel na tarefa |
|---|---:|---|
| Claude Code | 100% | Refactor checkout, propagação Cielo+ME+WC, fix odontologia, carrossel reviews |
| Gemini | 0% | Não usado |
| GPT | 0% | Não usado |
| GSC | 0% | Não usado |

Estimativa operacional, não medição financeira.
