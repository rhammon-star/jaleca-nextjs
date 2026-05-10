Data: 2026-05-10
Tarefa: Schema AEO/IA (FAQPage + speakable + Article enriquecido) em 6 alvos: /jaleco-medica, /jaleco-medico, /jaleco-dentista, /categoria/[slug], /cidade/[slug]. Constraint: política de devolução intocada + deixar claro que Jaleca NÃO faz bordado.

Arquivos alterados:
- app/jaleco-medica/FaqAccordion.tsx
- app/jaleco-medica/page.tsx
- app/jaleco-medico/FaqAccordion.tsx
- app/jaleco-medico/page.tsx
- app/jaleco-dentista/page.tsx
- app/cidade/[slug]/page.tsx
- app/categoria/[slug]/page.tsx

O que foi feito:
- Reescrita FAQ visível "bordado" em /jaleco-medica e /jaleco-medico (antes diziam "oferecemos bordado corporativo" — agora dizem "Jaleca não oferece serviço de bordado").
- /jaleco-dentista já estava correto sobre bordado (apenas adicionada Q&A no schema).
- Adicionada pergunta "A Jaleca borda?" ao schemaFaq das 3 profissões.
- schemaArticle das 3 profissões enriquecido: inLanguage pt-BR, audience, author.sameAs (instagram/facebook), publisher.sameAs, mainEntityOfPage, speakable.
- schemaFaq das 3 profissões: inLanguage + speakable.
- cidade/[slug]: FAQ_TEMPLATE recebeu 5ª pergunta sobre bordado (afeta 60+ cidades).
- categoria/[slug]: SHARED_FAQ com bordado é mesclado ao CAT_FAQ[slug] (afeta todas categorias) + inLanguage no schema.
- Política de devolução não foi alterada (nem copy nem schema).

Comandos rodados: npx tsc --noEmit (passou)

Resultado: OK

Riscos identificados: nenhum (apenas adição de JSON-LD + correção de copy alinhada à regra de negócio do usuário). Não toca em checkout/preço/canonical/sitemap.

Próximo passo: deploy quando o usuário autorizar; validar em Rich Results Test as 6 URLs após deploy.
