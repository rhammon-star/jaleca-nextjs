## SEO — Análise Competitiva (30/04/2026)
> Fonte: DataForSEO + GSC. Jaleca: 50 keywords vs Dra. Cherie 4.976. Gap principal = conteúdo, não backlinks.

### ✅ Feito (30/04)
- Corrigido description de `/jaleco-medica` (dizia "Médico")
- Corrigido description de `/jaleco-enfermeira` (dizia "Enfermeiro")
- Corrigido `publisher.logo.url` no schema Article de `/jaleco-medica` e `/jaleco-enfermeira`
- Corrigido `schemaArticle.url` de `/jaleco-medica` (apontava `/jaleco-medico`) e `/jaleco-enfermeira` (apontava `/jaleco-enfermeiro`)
- Removido auto-link de `/jaleco-medico` → agora linka `/jaleco-medica`

### 🔴 Semana 1 — Schema e técnico
- **SEO-SCHEMA**: Verificar e corrigir mesmo padrão de bug (`publisher.logo.url` e `schemaArticle.url`) nas demais páginas de profissão: `/jaleco-biomedico`, `/jaleco-fisioterapeuta`, `/jaleco-nutricionista`, `/jaleco-veterinario`, `/jaleco-podologo`, `/jaleco-pastor`, etc.
- **SEO-SITEMAP**: Corrigir `lastmod` idêntico no sitemap

### 🟠 Semana 2 — Páginas de cor (alto volume, sem presença)
- **SEO-COR**: Criar `/jaleco-branco-feminino` — 3.600 buscas/mês, Dra. Cherie #1, Jaleca ausente
- **SEO-COR**: Criar `/jaleco-preto` — 1.900 buscas/mês, Dra. Charm #1, Jaleca ausente
- **SEO-COR**: Criar `/jaleco-azul-marinho` — 1.300 buscas/mês, Dra. Cherie #2, Jaleca ausente

### 🟠 Semana 3 — Cluster e interligação
- **SEO-CLUSTER**: Adicionar `/jaleco-enfermeira` e `/jaleco-enfermeiro` ao Topical Authority de `/jaleco-enfermagem` (e vice-versa)
- **SEO-CLUSTER**: Criar hubs `/jaleco-feminino` e `/jaleco-masculino` — competem para 81.000 buscas/mês combinadas
- **SEO**: Criar rotas gender-split com redirect 301; adicionar links internos para `/cidade/[slug]`

### 🟡 Semana 4 — Conteúdo editorial
- **BLOG**: Artigo "como lavar jaleco branco" — 82 impressões, 1 clique, pos. 10.7 no GSC
- **BLOG**: Artigo "jaleco de enfermagem obrigatório" — keyword informacional, zero concorrência forte
- **BLOG**: Artigo "diferença jaleco slim e profissional" — keyword transacional

---

## Outros itens

- **RASTREAMENTO**: Validar Google Ads end-to-end (`trackPurchase`, GA4 MP, webhook, `public/test-tracking.html`); corrigir `GA4_SERVICE_ACCOUNT_JSON` com caracteres de controle em `.env.google-ads` que impedem parsing do script de relatório.
- **TESTES**: Corrigir 4 falhas em `tests/variation-sync-route.test.ts`.
- **SEO**: Corrigir `lastmod` idêntico no sitemap; criar rotas gender-split (`/categoria/jaleco-feminino` etc.) com redirect 301; adicionar links internos para `/cidade/[slug]` na homepage e produtos; verificar sitemap inclui URLs de cidade.
- **CRO**: Adicionar trust badges na homepage; guarantee badge próximo ao CTA; reviews visíveis com estrelas; urgência/escassez real; empty cart com recomendações.
- **GOOGLE ADS BUDGET**: Reduzir para Marca R$5/dia + Shopping R$10/dia, pausar demais campanhas; adicionar `SEOFORDATA_API_KEY` ao env; agendar relatório semanal automático (Vercel Cron, segundas) via `scripts/relatorio-3-meses.mjs`.
- **META ADS**: Atualizar texto Remarketing Carrinho Abandonado para: *"Seu jaleco ainda está esperando. Volte agora e aproveite desconto especial na primeira compra + 5% extra no PIX. Frete grátis para SP, RJ, MG e ES acima de R$499."*
- **MICROSOFT ADS**: Ajustar budgets das 5 campanhas para totalizar R$40/dia (Branded R$2,50 · Saúde TIER 1 R$20 · TIER 1B R$10 · Comerciais R$5 · WhatsApp R$2,50); aguardar 24-48h de dados reais para confirmar split; trocar cartão de pagamento automático (recarga recusada 28/04).
- **KV VARIANTES**: Debug miniatura exibindo foto do produto pai — verificar `refreshAllImages`, `revalidateTag('products')`, retorno `image.src` do plugin WP.
- **SIZE ADVISOR**: Corrigir alinhamento modal `components/SizeAdvisorModal.tsx`.
- **CARRINHO RECOVERY**: Migrar de JSON file para Vercel KV/Redis.
- **FAQ / CRO**: Criar página `/faq` própria com FAQPage schema; implementar email capture popup first-visit com cupom primeira compra.
