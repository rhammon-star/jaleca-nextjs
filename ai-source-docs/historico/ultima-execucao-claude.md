Data: 2026-05-12 (sessão tarde-noite)
Tarefa: Fase 4 Layout Redesign — FAQ +20 por slug + ItemList schema + cidade FAQ expandido

Arquivos alterados:
- lib/profession-faq-data.json (NOVO — 40 slugs × 20 Q/A = 800 FAQs)
- lib/profession-schemas.ts (adicionado buildItemListSchema)
- 40× app/jaleco-*/FaqAccordion.tsx (faqItems reescrito com 20 entradas)
- 40× app/jaleco-*/page.tsx (schemaFaq.mainEntity expandido para 20 + ItemList schema injetado)
- app/cidade/[slug]/page.tsx (FAQ_TEMPLATE de 5 → 20 Q/A, assinatura recebe uf agora)

O que foi feito:
- Gemini gerou 800 Q/A únicos por profissão em 4 batches paralelos (10 slugs cada)
- Gemini gerou 15 Q/A novas para template cidade (totalizando 20)
- Merge batches → lib/profession-faq-data.json
- Patch script reescreveu faqItems em 40 FaqAccordion.tsx
- Patch script reescreveu schemaFaq.mainEntity em 39 page.tsx (jaleco-branco usa FAQ_ITEMS.map() — patch direto)
- Adicionado buildItemListSchema em lib/profession-schemas.ts
- Patch script injetou <script ItemList> em 40 LPs após schema Occupation
- Cidade FAQ_TEMPLATE expandido com 15 entradas usando ${nome}/${estado}/${uf}

Comandos rodados:
- node /tmp/patch-faq.mjs (40 patched)
- node /tmp/patch-faq-schema.mjs (39 patched + jaleco-branco manual)
- node /tmp/patch-itemlist.mjs (40 patched)
- npx tsc --noEmit (verde)

Bug encontrado e corrigido:
- replace() interpretou "R$159" como backreference $1 → string mangle nos arquivos.
  Fix: usar callback function em .replace() para escapar $ corretamente.
- jaleco-branco e jaleco-medica não têm variável `produtos` no escopo da page →
  passado [] em buildItemListSchema (retorna null, safe).

Resultado: OK — typecheck verde, 40 LPs com 20 FAQs + ItemList, cidade template com 20 Q/A.

Riscos identificados:
- Deploy ainda não feito (aguardando OK usuário).
- Validação visual mobile pendente.
- Re-scrape Facebook Sharing Debugger é ação manual do usuário.

Próximo passo:
- Aguardar OK do usuário para commit + deploy.
- Schemas pendentes (Product+Offer, Review 5★) — escopo maior, deixar para próxima sessão.
