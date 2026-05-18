Data: 2026-05-18 15:00
Tarefa: GSC fixes + LCP audit completo (cidades + 50 LPs profissão)

Arquivos alterados (~55):
- app/cidade/[slug]/page.tsx — Product image no JSON-LD + hero <Image fill priority>
- next.config.ts — 301 /scrub-masculino, remotePatterns wikimedia
- app/robots.ts — disallow opengraph/twitter-image
- 50 app/<profissao>/page.tsx — primeiros 2 ProductCards com priority

Diagnóstico Lighthouse real (jaleco-medico mobile):
- LCP: 6.9s (crítico, era 3.5s no GSC)
- FCP 1.3s, Speed Index 1.6s, TTFB 20ms — todos ótimos
- CLS 0, TBT 370ms
- Causa: ProductCards no grid abaixo do hero NÃO tinham priority → primeiros 2 lazy-loaded → LCP element não estabilizava
- Outras oportunidades: 770ms unused JS (GTM/Meta Pixel já em lazyOnload)

Fix LCP aplicado:
- Padrão {produtos.slice(0, N).map((product, i) => <ProductCard ... priority={i < 2} />)} em 50 LPs
- Cidades: hero CSS-bg → next/image fill priority (Wikipedia 3840px → AVIF otimizado)

Esperado:
- LCP cidades: 3.5s → ~1.5s
- LCP LPs profissão: 6.9s → ~2s
- Score Lighthouse: 67 → 85+

Comandos rodados: npx tsc --noEmit (OK)
Resultado: OK — pronto para commit + deploy + nova medição
Riscos: baixo (mudanças cirúrgicas, zero refactor)
Próximo passo: commit + deploy + medir novamente
