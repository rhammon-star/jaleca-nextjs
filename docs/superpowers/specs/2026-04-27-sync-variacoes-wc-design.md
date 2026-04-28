# Sync de Variações WooCommerce + Painel Admin Unificado

**Data:** 2026-04-27
**Status:** Design aprovado, aguardando plano de implementação

---

## Problema

O site Jaleca cria uma página individual por variação de produto (cor) para reforçar SEO e dar sensação de catálogo amplo. Hoje:

- A lista de páginas de variação vive em `docs/SEO-PRODUTOS-CORES.json` (34 entradas curadas à mão).
- Quando uma variação é cadastrada/ativada/recebe estoque no WooCommerce, **a página dela não é criada automaticamente**.
- Quando uma variação fica sem estoque, **a página continua online indexada como se estivesse vendendo**.
- Toda mudança no WC exige edição manual do JSON + commit + deploy — isso não escala e gera incidentes (fora de estoque indexado, variação nova invisível, SEO ausente).

## Objetivo

Sincronizar automaticamente as páginas de variação com o estado real do WooCommerce (estoque + status), gerando SEO inicial via IA quando faltar e mantendo URLs preservadas para não perder ranking.

---

## Decisões de design (confirmadas)

| # | Decisão | Justificativa |
|---|---|---|
| 1 | Modelo **Híbrido** (C): WC define existência das páginas; JSON é override para SEO premium curado à mão | Resolve o problema na raiz sem descartar as 34 entradas curadas |
| 2 | Gatilho via **webhook do WC em tempo real** (não cron) | Variação reativada vira página em segundos |
| 3 | Sem estoque → **`noindex` + banner "Avise-me"** | Preserva URL e backlinks; sai do índice em ~7 dias; volta ao indexar quando voltar estoque |
| 4 | SEO de variação nova → **template fixo imediato + Gemini em background** | Página nunca fica sem SEO mínimo; IA falhar não quebra fluxo |
| 5 | Fonte de verdade runtime → **Vercel KV** (filesystem do Vercel é read-only em runtime) | Único caminho viável em produção; JSON Git vira seed/backup |
| 6 | Painel admin → **rota `/admin` unificada** (não site novo) | Reaproveita auth existente; consolida `/blog/admin/*` → `/admin/blog/*` |

---

## Arquitetura

```
WooCommerce (variação muda)
   │ hook PHP (jaleca-fix-completo.php)
   ▼
POST /api/wc/variation-sync   (Next.js, X-Jaleca-Secret)
   │
   ├─ Lê estado WC via GraphQL/REST
   ├─ Compara com snapshot KV (variation:{id})
   ├─ Decide ação: CRIAR | SEM_ESTOQUE | VOLTOU_ESTOQUE | DESATIVAR
   ├─ Atualiza KV (snapshot + entrada SEO)
   ├─ Retorna 200 (≤500ms)
   │
   └─ waitUntil() → side-effects assíncronos:
        ├─ revalidatePath('/produto/{slug}')
        ├─ Gemini SEO (se variação nova) → atualiza KV
        ├─ Sitemap (regenera próxima request)
        ├─ Google Indexing API + IndexNow
        └─ Email "voltou estoque" para inscritos em Avise-me
```

### Componentes novos

- `app/api/wc/variation-sync/route.ts` — webhook handler
- `lib/variation-state.ts` — leitura/escrita KV + decisão de ação + lock por mutex
- `lib/variation-seo-generator.ts` — Gemini para SEO inicial (com fallback de template)
- `lib/google-indexing.ts` — Google Indexing API + IndexNow
- `app/api/cron/regen-seo-pendente/route.ts` — cron 03h, retry de Gemini falho
- `app/api/avise-me/route.ts` — inscrição "avise-me quando voltar"
- `components/OutOfStockPage.tsx` — banner + form Avise-me + carrossel "outras cores"
- `app/admin/layout.tsx` — sidebar + auth guard
- `app/admin/page.tsx` — dashboard
- `app/admin/variacoes/page.tsx` — gestão de variações
- `app/admin/blog/posts/` e `app/admin/blog/novo-post/` — migrados de `/blog/admin/*`

### Componentes alterados

- `app/produto/[slug]/page.tsx` — lê SEO do KV (com JSON fallback); detecta out_of_stock; renderiza `OutOfStockPage` quando aplicável; injeta `noindex` em metadata.
- `app/sitemap.ts` — fonte passa a ser KV; exclui entradas com `noindex: true`.
- `lib/all-products.ts` — filtra variações `outofstock` da listagem (mas URLs continuam acessíveis).
- `docs/jaleca-fix-completo.php` — adiciona hooks `woocommerce_update_product_variation`, `woocommerce_save_product_variation`, `woocommerce_variation_set_stock_status` que disparam webhook não-bloqueante.

### Componentes movidos (migração `/admin`)

| De | Para |
|---|---|
| `app/blog/admin/posts/` | `app/admin/blog/posts/` |
| `app/blog/admin/novo-post/` | `app/admin/blog/novo-post/` |

Adicionar redirects 301 em `next.config.ts` para preservar bookmarks: `/blog/admin/:path*` → `/admin/blog/:path*`.

---

## Modelo de dados

### Vercel KV — entrada SEO por variação

**Chave:** `seo:{slug}` (ex: `seo:jaleco-medico-azul-marinho`)

```json
{
  "url": "/jaleco-medico-azul-marinho",
  "productName": "Jaleco Médico",
  "productSlug": "jaleco-medico",
  "colorName": "Azul Marinho",
  "colorSlug": "azul-marinho",
  "variationId": 12345,
  "category": "medico",
  "h1": "...",
  "h2": "...",
  "metaDescription": "...",
  "title": "...",
  "colorPsychology": "...",
  "seoQuality": "premium" | "gemini" | "template",
  "stockStatus": "instock" | "outofstock",
  "noindex": false,
  "lastSyncedAt": "2026-04-27T14:30:00Z",
  "lastGeminiAttempt": "2026-04-27T14:30:00Z",
  "geminiAttempts": 0
}
```

### Vercel KV — snapshot de estado WC

**Chave:** `variation:{variationId}`

```json
{
  "stockStatus": "instock",
  "status": "publish",
  "price": "159.90",
  "sku": "JLM-AZM-G",
  "updatedAt": "2026-04-27T14:30:00Z"
}
```

Usado pelo webhook para detectar mudanças e idempotência.

### Vercel KV — fila de retry Gemini

**Chave:** `gemini-retry-queue` (lista)

```json
[{ "variationId": 12345, "attempts": 1, "nextRetryAt": "2026-04-28T03:00:00Z" }]
```

### Vercel KV — inscrições "Avise-me"

**Chave:** `notify:{variationId}` (set de emails)

### Lock de escrita

**Chave:** `lock:seo-write` — `SET key value NX EX 30` como mutex global. Webhook adquire antes de escrever; libera após. Se não pegar lock em 5s, devolve 503 → WC reenfileira automaticamente.

### JSON Git como seed/backup

`docs/SEO-PRODUTOS-CORES.json` continua versionado. Função `seedKvFromJson()` roda no build/deploy se KV estiver vazio. Painel admin tem botão "exportar premium → JSON" que gera commit das entradas curadas.

---

## Fluxo de decisão do webhook

```
Estado anterior (KV)        Estado atual (WC)              Ação
─────────────────────────────────────────────────────────────────────
ausente                     publish + instock + price>0    CRIAR
instock                     outofstock OU status≠publish   SEM_ESTOQUE
outofstock                  instock + status=publish       VOLTOU_ESTOQUE
qualquer                    trash/draft                    DESATIVAR
mesmo updatedAt             —                              ignorar (idempotência)
```

### Side-effects por ação

| Ação | Side-effects |
|---|---|
| **CRIAR** | KV `seo:{slug}` com template; dispara Gemini em background; `revalidatePath`; sitemap dirty; Google Indexing API + IndexNow |
| **SEM_ESTOQUE** | KV: `noindex=true, stockStatus=outofstock`; `revalidatePath`; sitemap dirty (remove) |
| **VOLTOU_ESTOQUE** | KV: `noindex=false, stockStatus=instock`; `revalidatePath`; sitemap dirty (adiciona); resubmete Indexing API; **dispara emails Avise-me** |
| **DESATIVAR** | KV: `noindex=true`; sitemap dirty (remove). Após 30 dias sem retorno, retornar 410 Gone (job separado) |

---

## Fallback Gemini (camadas)

```
1. Template fixo entra IMEDIATAMENTE no KV (página vai ao ar)
   └─ flag seoQuality: "template"

2. Gemini disparado em background (waitUntil)
   ├─ Sucesso  → atualiza KV com SEO rico, flag "gemini", revalida
   └─ Falha    → entra na fila gemini-retry-queue

3. Cron diário 03h (/api/cron/regen-seo-pendente)
   - Pega entradas seoQuality="template" há >1h
   - Tenta Gemini novamente, até 3 attempts com backoff
   - Após 3 falhas: mantém template + alerta no painel admin

4. Painel admin /admin/variacoes
   - Filtro "SEO template" mostra pendências
   - Botão "Regerar Gemini" força nova tentativa
   - Botão "Promover para premium" abre editor manual
```

Nível de qualidade SEO em camadas: `template` (fallback automático) < `gemini` (auto IA) < `premium` (curado à mão).

---

## Rendering da página de produto

```tsx
export const revalidate = 3600

export async function generateMetadata({ params }) {
  const seo = await getVariationSEO(params.slug) // KV first, JSON fallback
  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: seo.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: `https://jaleca.com.br${seo.url}` },
  }
}

export default async function Page({ params }) {
  const seo = await getVariationSEO(params.slug)
  if (!seo) notFound()

  const variation = await getVariation(seo.variationId)

  if (seo.stockStatus === 'outofstock') {
    return <OutOfStockPage seo={seo} variation={variation} />
  }
  return <ProductDetailClient seo={seo} variation={variation} />
}
```

### `<OutOfStockPage>`
- Banner amarelo: "Esta cor está temporariamente sem estoque"
- Form "Avise-me" (email) → `POST /api/avise-me` → KV `notify:{variationId}`
- Carrossel "Veja em outras cores" (variações instock do mesmo produto pai)
- Schema.org `Product` com `availability: OutOfStock`
- `<meta name="robots" content="noindex,follow">` (sai do índice em ~7 dias, sem perder o domínio da URL)

---

## Sitemap e indexação

### `app/sitemap.ts`
- Itera `KV.scan('seo:*')` (com cache de 1h)
- Inclui apenas entradas com `noindex: false`
- `lastModified: lastSyncedAt`

### `lib/google-indexing.ts`
- **Google Indexing API**: requer credencial Service Account no Search Console (escopo `indexing`). POST `https://indexing.googleapis.com/v3/urlNotifications:publish` com `{ url, type: URL_UPDATED | URL_DELETED }`.
- **IndexNow** (Bing/Yandex): POST `https://api.indexnow.org/indexnow` com chave + URL.
- **Fallback**: ping `https://www.google.com/ping?sitemap=https://jaleca.com.br/sitemap.xml`.

---

## Painel `/admin` unificado

### Estrutura

```
app/admin/
├── layout.tsx              # sidebar + header + auth guard
├── page.tsx                # dashboard (resumo)
├── blog/
│   ├── posts/              # movido de /blog/admin/posts
│   └── novo-post/          # movido de /blog/admin/novo-post
├── variacoes/              # NOVO
│   ├── page.tsx            # tabela com filtros
│   └── [slug]/page.tsx     # editor de SEO premium
├── pedidos/                # placeholder futuro
├── produtos/               # placeholder futuro
└── seo/                    # placeholder futuro
```

### Auth guard (`app/admin/layout.tsx`)
- Usa `auth.ts:verifyCustomerToken()` existente
- Redireciona para `/login?from=...` se não logado
- Whitelist de emails admin via env `ADMIN_EMAILS` (CSV)

### `/admin/variacoes` — colunas da tabela
| Produto | Cor | Status WC | SEO | Indexada | Última sync | Ações |
|---|---|---|---|---|---|---|
| Jaleco Médico | Azul Marinho | publish/outofstock/trash | template/gemini/premium | ✅/❌ | timestamp | Regerar / Editar / Revalidar / Submeter |

Filtros: `seoQuality=template` (pendências), `stockStatus=outofstock + lastSyncedAt > 30d` (candidatos a 410 Gone).

---

## Variáveis de ambiente novas

```
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
GOOGLE_INDEXING_SA_JSON=<service account JSON, base64>
INDEXNOW_KEY=<chave>
ADMIN_EMAILS=rhammon.liberate@gmail.com,ana@jaleca.com.br
GEMINI_API_KEY=<já existe>
```

---

## Migração `/blog/admin` → `/admin/blog`

1. Mover arquivos preservando histórico (`git mv`).
2. Atualizar imports relativos quebrados.
3. Atualizar todos os `<Link href="/blog/admin/...">` para `/admin/blog/...`.
4. Adicionar redirect em `next.config.ts`:
   ```ts
   redirects: async () => ([
     { source: '/blog/admin/:path*', destination: '/admin/blog/:path*', permanent: true },
   ])
   ```
5. Smoke test: criar post novo, deletar post, navegar pelo admin.

---

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Webhook WC dispara em rajada (concorrência) | Mutex KV `lock:seo-write` + WC retry nativo |
| Filesystem Vercel read-only em runtime | KV é fonte de verdade; JSON Git é seed |
| Gemini fora do ar / quota batida | Template fixo + fila de retry + cron 03h |
| Página fica `noindex` por engano | Painel admin mostra todas com `noindex`; alerta no dashboard |
| Perda de ranking de URL existente | URLs nunca são deletadas — só `noindex` quando sem estoque, voltam ao indexar quando voltar |
| Race entre webhook e ISR (dados velhos) | `revalidatePath` + `revalidateTag` invalidam cache imediatamente |
| Custo Gemini explodir | Apenas 1 chamada por variação nova; retry máximo 3x; ~R$0,001/variação |

---

## Fora de escopo (futuro)

- 410 Gone automático após 30 dias sem estoque (job separado)
- A/B testing de SEO template vs gemini
- Migração de pedidos/produtos para `/admin` (placeholders por ora)
- Integração com Google Search Console direto no painel
- Histórico de mudanças por variação (audit log)
