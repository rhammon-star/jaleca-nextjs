Data: 2026-05-03 01:30
Tarefa: Fotos cartão postal reais para todas as 75 páginas /cidade/[slug]
Arquivos alterados:
- app/cidade/[slug]/page.tsx (75 heroUrl atualizadas — zero Unsplash restante)
O que foi feito:
- Removido getCidadeHeroImage() (Unsplash API), generateStaticParams e force-dynamic
- 75/75 cidades com foto Wikipedia/Wikimedia hardcoded — verificadas HTTP 200 antes de aplicar
- Método: Wikipedia REST API page/summary + Wikimedia imageinfo API + MediaSearch
- Commits: 07e7dc5 (26 cidades), 5cdc112 (49 cidades restantes)
- Deploy prod READY — jaleca.com.br/cidade/* HTTP 200 confirmado
Resultado: OK
Próximo passo: submeter URLs /cidade/* no GSC; continuar plano SEO (#20 /jaleco-bordado, #14/#15 títulos WP)

---

Data: 2026-05-03 00:30
Tarefa: #26 Link building — 6 novos artigos nos sites satélite
O que foi feito:
- jalecoesaltoalto.com.br (Vercel): novo post "Jaleco Feminino por Profissão" → /categoria/jalecos-femininos
- jobtech.com.br (Vercel): novo post "Jaleco Médico com Elastano" → /jaleco-medico
- maxiodonto.com (Netlify): seção "Jaleco para Dentista" adicionada ao index.html → /jaleco-dentista
- saudetodahora.com.br (Netlify): seção "Jaleco Plus Size Feminino" adicionada ao index.html → /jaleco-plus-size
- hospitalveterinariopompeia.com.br (Cloudflare Pages): novo post "Jaleco Médico para Plantão" → /jaleco-medico
- institutocariocadesaude.com.br (GitHub Pages): novo post "Jaleco Feminino por Profissão" → /categoria/jalecos-femininos
- #14: Yoast title/meta WP post 62455 "jaleco-ou-scrub" atualizado (176 impr, CTR 0%)
- #15: Yoast title/meta WP post 62808 "roupa-medica-profissional" atualizado (270 impr, CTR 0%)
Resultado: OK — todos deploys READY
Próximo passo: commit + deploy jaleca-nextjs (#21, #22); monitorar GSC em 2-4 semanas

---

Data: 2026-05-02 23:30
Tarefa: Plano 7 dias SEO — Dia 5 executado (#19, #21, #22)
Arquivos alterados:
- app/blog/jaleco-feminino-gestante-como-escolher/page.tsx (444→900+ palavras: guia por trimestre, tabela tamanhos gestante, 3 FAQs extras)
- app/jaleco-plus-size/page.tsx (856→1200+ palavras: tabela G1-G3, 3 cards de modelos, FAQ 5 perguntas, FAQPage+BreadcrumbList schema)
O que foi feito:
- #19: Cannibalização "como lavar jaleco branco" resolvida — canonical Yoast atualizado nos 2 posts WP (IDs 62454, 62559) → https://jaleca.com.br/blog/como-lavar-jaleco-branco (Next.js dona)
- #21: Post gestante expandido: intro, guia 1º/2º/3º trimestre, tabela conversão de tamanhos, seção visual profissional, 3 FAQs adicionais
- #22: Plus size expandido: tabela medidas GG-G3 (busto/cintura/quadril/comprimento), 3 cards de modelos (Slim, Elastex, Reto), FAQ 5 perguntas, FAQPage schema + BreadcrumbList schema
Resultado: OK — pendente deploy (usuário solicitou commit/deploy só quando pedir)
Próximo passo: #20 criar /jaleco-bordado, #14/#15 títulos WP, #26 artigos satélite

---

Data: 2026-05-02 22:00
Tarefa: Plano 7 dias SEO — Dias 1 a 4 executados
Arquivos alterados:
- app/produto/[slug]/page.tsx (fix título toucas/faixas noindex)
- app/jaleco-medico/page.tsx (title CTR zero)
- app/categoria/[slug]/page.tsx (title jalecos-femininos)
- app/jaleco-dentista/page.tsx (AggregateRating schema + visual stars)
- app/cidade/[slug]/page.tsx (link interno /categoria/jalecos-femininos)
- app/jaleco-feminino/page.tsx (cannibalização — title editorial)
- 51 páginas de profissão/landing (HeroStars visual só pontuação)
O que foi feito:
- Dia 1: toucas/faixas noindex agora mostram nome real (não "Produto não encontrado"); title /categoria/jalecos-femininos corrigido
- Dia 2: title/meta /jaleco-medico (330 impr, CTR 0%) + /categoria/jalecos-femininos reescritos para capturar intenção de compra
- Dia 3: AggregateRating schema em /jaleco-dentista (pos 8.2); city pages com link âncora /categoria/jalecos-femininos; 65 páginas visual HeroStars simplificado (só 4.9★, sem "61 avaliações")
- Dia 4: cannibalização jaleco feminino resolvida — /jaleco-feminino title mudado para editorial ("Guia por Especialidade"), /categoria/jalecos-femininos é a URL dona de "jaleco feminino"
Commits: f845b24, ffa0eb4, a5826e1, 03216ff, ed15373
Resultado: OK — 5 deploys prod READY
Próximo passo: Dia 5 — expandir /jaleco-plus-size (856→1200 palavras) + post jaleco gestante (444→900 palavras)

---

Data: 2026-05-02 21:00
Tarefa: Fix hero Unsplash nas páginas /cidade/[slug] — imagens não apareciam em produção
Arquivos alterados: app/cidade/[slug]/page.tsx
O que foi feito:
- Root cause: páginas geradas estaticamente no build (generateStaticParams) → getCidadeHeroImage chamada 75× simultâneas → rate limit Unsplash → heroImage = null em todas
- Fix: adicionado `export const dynamic = 'force-dynamic'` no topo do arquivo (fetch ocorre em runtime por request)
- Removido generateStaticParams (conflitava com force-dynamic)
- Commit a44fe71, deploy prod READY — jaleca.com.br/cidade/* HTTP 200
Resultado: OK — imagens devem aparecer ao acessar as páginas agora
Próximo passo: checar uma página de cidade no browser para confirmar foto aparecendo; monitorar GSC para indexação

---

Data: 2026-05-02 20:30
Tarefa: Fix título produtos noindex (toucas/faixas) — "Produto não encontrado" → nome real
Arquivos alterados: app/produto/[slug]/page.tsx
O que foi feito:
- Identificado que toucas/faixas estavam em NOINDEX_PRODUCT_SLUGS mas retornando título falso "Produto não encontrado — Jaleca"
- Corrigido: generateMetadata agora busca o produto no WooCommerce e usa o nome real, mantendo robots noindex/nofollow
- Produtos continuam ativos e vendendo, apenas sem indexação no Google
- Commit f845b24, deploy prod READY
Resultado: OK
Próximo passo: Dia 2 do plano — corrigir titles/metas CTR zero (/jaleco-medico, /categoria/jalecos-femininos, 2 posts blog)

---

Data: 2026-05-02 19:15
Tarefa: #2 Internal linking jaleco-feminino + #4 Hub page jaleco feminino
Arquivos alterados: 10 posts blog (adicionado link → /jaleco-feminino) + app/jaleco-feminino/page.tsx (INTERNAL_LINKS atualizado com 12 links para posts PAA)
O que foi feito:
- #2: 10 posts PAA receberam link "→ Jaleco feminino: guia completo por especialidade" na seção "Continue lendo", anchor text + URL /jaleco-feminino
- #4: Hub /jaleco-feminino já existia — atualizado INTERNAL_LINKS para incluir todos os 10 posts PAA (antes apontava para landings inexistentes /jaleco-medico etc)
- Cluster bidirecional: hub → spokes + spokes → hub, fortalece "jaleco feminino" pos 26.8 → alvo top 10
- Commit 373b84d, aguardando deploy
Resultado: OK — aguardando deploy prod (usuário vai confirmar)
Próximo passo: deploy prod; após indexação monitorar "jaleco feminino" no GSC em 2-4 semanas; criar páginas profissão×cidade

---

Data: 2026-05-02 18:30
Tarefa: #7 Link building satélites (9 artigos nos 6 sites) + #8 Meta catalog check + #10 GSC baseline
O que foi feito:
- #7: 9 novos artigos publicados nos 6 sites satélite linkando para os 10 posts PAA:
  Netlify saudetodahora: fisioterapeuta + enfermeira (COFEN)
  Netlify maxiodonto: esteticista
  GitHub institutocarioca: nutricionista + psicóloga
  CF hospitalveterinariopompeia: veterinária
  Vercel jalecoesaltoalto: manga curta + gestante
  Vercel jobtech: slim vs reto
- #8: Meta catalog Jaleca_Products (ID 911366368567879) — 109 produtos, NENHUMA TOUCA presente. Catálogo já limpo.
- #10: GSC baseline 02/05/2026: 616 cliques, 24.908 impressões, pos 7.9. "jaleco feminino" pos 26.8. "como lavar jaleco branco" pos 10.5 (oportunidade). "jaleco farmaceutico" pos 9.8.
Resultado: OK
Próximo passo: criar post "como lavar jaleco branco" (pos 10.5 → top 3 potencial); pages profissão×cidade; checar Best Practices com PageSpeed real

---

Data: 2026-05-02 17:30
Tarefa: 10 posts PAA blog por especialidade — fisio, nutri, médica, enfermeira, esteticista, vet, psicóloga, slim vs reto, manga curta, gestante
Arquivos alterados: 10 novos page.tsx em app/blog/jaleco-para-*/  jaleco-slim-vs-* jaleco-manga-* jaleco-feminino-gestante-*
O que foi feito:
- 10 posts Next.js com Article+FAQPage+BreadcrumbList schema, internal links, CTA /categoria/jalecos-femininos
- Posts WP correspondentes já publicados via REST API
- Commit dc60d3a, vercel --prod READY → jaleca.com.br
Resultado: OK
Próximo passo: #2 internal linking "jaleco feminino" pos22; #3 páginas profissão×cidade; #4 FAQ schema landings

---

Data: 2026-05-02 16:30
Tarefa: Criação da página /jaleco-universitario-feminino + deploy produção

Arquivos criados/alterados:
- app/jaleco-universitario-feminino/page.tsx (novo)
- app/jaleco-universitario-feminino/FaqAccordion.tsx (novo)
- app/jaleco-universitario/page.tsx (link interno adicionado)

O que foi feito:
- Criada landing page SEO /jaleco-universitario-feminino
  - Foco: medicina, enfermagem, odontologia, fisioterapia, biomedicina, veterinária
  - Seção por curso com 6 cards linkando para profissões femininas
  - Guia: feminino vs unissex, Padrão vs Slim, normas IES, tamanho, primeiro jaleco
  - FAQ schema (5 perguntas) + FaqAccordion (8 perguntas interativas)
  - Links internos: categoria/jalecos-femininos, jaleco-universitario, profissões femininas
- /jaleco-universitario atualizado com link para nova página
- Deploy produção: READY em 5min, HTTP 200 confirmado

Resultado: OK — página no ar em jaleca.com.br/jaleco-universitario-feminino

Próximo passo:
- Submeter URL no GSC para indexação
- Monitorar posições em 2-4 semanas
- Monitorar alcance Público Frio (targeting atualizado hoje) em 48h
- Aguardar 1ª conversão Google Ads → libera R$700 crédito
