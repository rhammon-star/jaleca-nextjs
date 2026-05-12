# PRD Layout LP v2 — Jaleca

**Data:** 2026-05-12
**Status:** Em execução
**Autor:** Claude Code + GPT + Gemini (party de crítica)

## Contexto

Site institucional demais, pouco comercial. 90% tráfego mobile. Cliente demora a ver grade de produto no mobile, perde interesse.

## Escopo

Redesenhar layout de:
- **Grupo A:** páginas de profissão + modelo (60 URLs) — `/jaleco-medico`, `/jaleco-feminino` etc.
- **Grupo B:** páginas de cidade (75 URLs) — `/cidade/jaleco-belo-horizonte` etc.

**Excluídas:** Blog, Home, Produtos.

## Premissas

1. **Não remover dado** — só realocar.
2. **Não perder SEO/IEO/AEO/GEO** — só somar.
3. **Mobile-first** (90% tráfego).
4. **Nunca remover URL** sem autorização explícita do usuário.

## Layout A — Profissão/Modelo (ordem final)

1. Hero compacto (<60vh mobile) — H1 + preço "a partir de" + CTA
2. **Grade de produtos** (subiu — visível em 1 scroll mobile)
3. Sticky CTA mobile ativo a partir daqui
4. USPs curtos (4 selos: elastano · troca 7d · frete Sudeste · 200k vendidos)
5. Nota Google 4.9 + carrossel depoimentos (mobile auto-play)
6. UGC (componente atual mantido)
7. Descritivo dos modelos
8. Guia rápido (mantido)
9. Instagram (stories + marcações + 6-9 posts)
10. FAQ — atuais + 20 perguntas geradas para LLMs
11. Links internos blog
12. CTA final

## Layout B — Cidade

1. H1 forte "Jaleco em [Cidade]"
2. Parágrafo curto "Jalecos da Jaleca em [Cidade]" — contexto local
3. Grade de produtos (atual, mantida)
4. Carrossel UGC + Google rating
5. Instagram
6. FAQ 20 perguntas tema-cidade (com schema)
7. Blog
8. Reforçar H1/H2/H3
9. Sticky CTA mobile

## Schemas (consolidação)

| Schema | Onde | Status |
|---|---|---|
| FAQPage | A + B | já existe |
| Article | A | já existe |
| BreadcrumbList | A + B | já existe |
| HowTo | A | ✅ deployado |
| Occupation/MedicalAudience | A | ✅ deployado |
| Product + Offer | A (cards grade) | pendente |
| Review (5 do Google) | A + B | pendente |
| AggregateRating standalone | A + B | ✅ B feito (rating real) |
| LocalBusiness + areaServed | B | ✅ enriquecido |
| Store + OnlineStore | B | ✅ |
| ItemList | A | pendente |
| SpeakableSpecification | A + B | já existe |
| ai-content-declaration meta | A | ✅ deployado |

## Decisões trancadas

- **4 URLs médico** mantidas com conteúdo diferenciado por intent (não consolidar)
- **Sticky CTA mobile** aprovado
- **LocalBusiness areaServed** aprovado nas 75 cidades
- **OG branded dinâmico** PDPs ✅ deployado (resolve IG/WhatsApp preview)
- **Discordância GPT vs Gemini sobre links blog:** manter, mas só 3 cards no mobile
- **Páginas colete/conjunto** mudam "a partir de R$XXX" pra preço mínimo do colete (a definir slugs)

## Fases de execução

- **Fase 0** — PRD ✅
- **Fase 1** — Piloto Layout A em `jaleco-medico`
- **Fase 2** — Replicar Layout A em 59 outras LPs
- **Fase 3** — Layout B em 75 cidades + FAQ +20 LLM (batch Gemini)
- **Fase 4** — Deploy único do bundle

## Pendências dependentes do usuário

- Lista de slugs de colete/conjunto
- 14 imagens do docx (referências visuais carrossel, guia rápido)

## Anti-patterns evitados

- AR/try-on (caro, fora de escopo)
- Assinatura sazonal (muda modelo de negócio)
- Consolidação médico→médica via 301 (canibalização real, mas usuário quer manter)
