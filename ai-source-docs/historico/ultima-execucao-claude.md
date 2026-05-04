Data: 2026-05-03 22:30
Tarefa: Instagram Graph API — integração galeria de posts @jaleca.oficial
Arquivos alterados:
  - app/api/instagram/route.ts (novo) — endpoint que busca posts via API, cache 1h
  - components/InstagramGallery.tsx (novo) — galeria async server component com 6-12 posts
  - app/clientes/page.tsx (novo) — página /clientes com galeria Instagram + CTA
  - .env.local — INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_BUSINESS_ID adicionados
O que foi feito:
  - Token de acesso gerado via app "Jaleca Comunicação" + conta @jaleca.oficial como Testador
  - Token válido confirmado: retornou 6 posts reais do Instagram
  - Rota /api/instagram criada com revalidate 1h (ISR)
  - InstagramGallery: server component async, filtra só IMAGE/CAROUSEL, hover com ícone IG
  - Página /clientes criada com SEO metadata + galeria + CTA "marque @jaleca.oficial"
Resultado: OK — tsc sem erros
Riscos identificados:
  - Token de teste expira em 60 dias — precisa trocar por token de longa duração (Long-lived token)
  - Para produção: adicionar INSTAGRAM_ACCESS_TOKEN no Vercel env vars
Próximo passo:
  - Deploy para produção + adicionar env vars no Vercel
  - Converter token para long-lived token (validade 60 dias → renováveis)
  - Adicionar InstagramGallery nas páginas hub (jaleco-medico, jaleco-dentista etc.)

---

Data: 2026-05-03 22:00
Tarefa: SEO Jaleca 2026 — Brainstorming + Execução completa (branch SEOIA)
Arquivos alterados:
  - app/jaleco-medico/page.tsx + FaqAccordion.tsx
  - app/jaleco-dentista/page.tsx + FaqAccordion.tsx
  - app/jaleco-enfermeiro/page.tsx + FaqAccordion.tsx
  - app/jaleco-professor/page.tsx + FaqAccordion.tsx
  - app/jaleco-esteticista/page.tsx + FaqAccordion.tsx
  - components/UGCGallery.tsx (novo)
  - data/ugc.ts (novo)
  - docs/seo/monitoramento-quinzenal.md (novo)
O que foi feito:
  - Party brainstorming multi-IA baseado em Google Search Central Live Toronto Abr/2026
  - FAQ Schema + FaqAccordion atualizados em 5 hubs com dados proprietários de tecido e tamanho
  - Componente UGCGallery criado para fotos de clientes do Instagram
  - 5 artigos com dados proprietários publicados no WordPress (IDs 62942-62946)
    incluindo case real Dr. Luiz Ronaldo — hospital em Ipatinga MG
Resultado: OK — branch SEOIA pronta para deploy
Próximo passo:
  - Deploy da branch SEOIA para produção (pedir aprovação ao usuário)
  - Coletar UGC do Instagram e popular data/ugc.ts
  - Monitorar GSC em 15 dias: meta +20% impressões, +15% cliques

---

Data: 2026-05-03 11:30
Tarefa: Correção de cobertura GSC — redirects 404 + robots.ts
Arquivos alterados:
  - next.config.ts
  - app/robots.ts

O que foi feito:
- Analisados 11 relatórios CSV do GSC Coverage Drilldown
- 652 URLs "rastreadas não indexadas" são arquivos /_next/static/ — já bloqueados no robots.ts, vão sumir com re-crawl
- Adicionado wildcard /categoria/:parent/:slug/:rest* para cobrir moratty-fem e variantes de filtro com 3+ níveis
- Adicionado redirect /?page_id=* → / para URLs WP legadas
- Adicionado bloqueio no robots.ts: /?page_id=, /wp-login.php, /wp-register.php, /wp-signup.php
- Confirmado que demais redirects (blog posts, .html, dia-das-maes, /color/, /estampas/) já existiam

Resultado: OK — tsc sem erros

Riscos identificados: nenhum — apenas redirects 301 e regras robots

Próximo passo:
- Deploy para produção
- Request Indexing manual no GSC para as 15 URLs "detectadas não indexadas":
  /blog/jaleco-professor-diferenca-sala-aula, /blog/jaleco-slim-padrao-clinicas,
  /categoria/conjuntos-femininos, /categoria/conjuntos-masculinos,
  /categoria/domas-femininas, /categoria/domas-masculinas,
  /cidade/jaleco-aracaju, /jaleco-pastor, /pijama-cirurgico-feminino,
  /uniformes-beleza, /uniformes-escritorio, /uniformes-gastronomia,
  /uniformes-servicos, /contato, /produto/jaleco-slim-feminino-lateral-jaleca-branco
