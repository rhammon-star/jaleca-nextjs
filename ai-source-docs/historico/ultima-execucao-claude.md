Data: 2026-05-18 15:30
Tarefa: SEO Schema (item #4) + Sitemap lastmod (item #5)

Arquivos alterados:
- 71 páginas `app/**/page.tsx` + `components/HubProfissaoTemplate.tsx` + 3 scripts em `scripts/*.mjs` + `app/api/blog/generate/route.ts`: publisher.logo trocado de `logo-email.png` → `logo-jaleca-512.png` + width/height 512
- `app/sitemap.ts`: pós-processa entries com `getLastMod()` (preserva product/post/KV originais)
- `lib/route-lastmod.ts`: novo helper URL → Date
- `lib/route-lastmod-map.json`: novo, 174 rotas com data git
- `scripts/build-lastmod-map.mjs`: novo, roda no prebuild
- `scripts/audit-schema-urls.mjs`: novo helper de auditoria
- `package.json`: adicionado `prebuild`
- `public/logo-jaleca-{192,512,full}.png`: novos assets institucionais

O que foi feito:
- #4 SEO Schema: substituído logo de email pelo logo institucional 512×512 em todas as 95 ocorrências de publisher.logo; auditoria confirmou 0 mismatches em schemaArticle.url
- #5 Sitemap lastmod: pipeline prebuild gera mapa rota→data-git; sitemap usa data real por arquivo em vez de `new Date()` único

Comandos rodados:
- `node scripts/build-lastmod-map.mjs` → 174 rotas
- `node scripts/audit-schema-urls.mjs` → OK
- `npm run build` → sucesso (warnings WP cache não-relacionados)

Resultado: OK — não deployed ainda

Riscos identificados: baixo (schema e sitemap; não toca checkout/pagamento/preço)

Próximo passo: aguardar autorização do usuário para deploy
