# Fase 4 — SEO Generator (Template + Gemini + Retry) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Variação nova nasce com SEO template em milissegundos; Gemini melhora em background; cron diário recupera falhas. Página nunca fica sem SEO mínimo.

**Architecture:** `lib/variation-seo-generator.ts` expõe `generateSeoForVariation()` (Gemini call com retry). Webhook handler dispara via `waitUntil()` ao detectar CRIAR. Cron 03h processa fila de retry.

**Tech Stack:** Next.js 16, `@google/generative-ai` (já no projeto), Vercel Cron.

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seção "Fallback Gemini")

**Pré-requisito:** Fases 2 e 3 prontas.

---

## File Structure

**Criar:**
- `lib/variation-seo-generator.ts` — Gemini call + parser
- `lib/seo-retry-queue.ts` — fila KV de retry
- `app/api/cron/regen-seo-pendente/route.ts` — cron 03h
- `tests/variation-seo-generator.test.ts`

**Modificar:**
- `app/api/wc/variation-sync/route.ts` — disparar Gemini em `waitUntil()` quando CRIAR
- `vercel.json` — registrar cron

---

### Task 1: Prompt e parser do Gemini

**Files:**
- Create: `lib/variation-seo-generator.ts`
- Create: `tests/variation-seo-generator.test.ts`

- [ ] **Step 1: Teste do parser**

```ts
// tests/variation-seo-generator.test.ts
import { describe, it, expect } from 'vitest'
import { parseGeminiResponse } from '@/lib/variation-seo-generator'

describe('parseGeminiResponse', () => {
  it('extrai campos do JSON', () => {
    const raw = '```json\n{"h1":"Jaleco Médico Azul","h2":"O preferido","metaDescription":"desc","title":"t","colorPsychology":"calma"}\n```'
    const out = parseGeminiResponse(raw)
    expect(out?.h1).toBe('Jaleco Médico Azul')
    expect(out?.colorPsychology).toBe('calma')
  })
  it('aceita JSON puro sem fences', () => {
    const raw = '{"h1":"X","h2":"Y","metaDescription":"D","title":"T","colorPsychology":"P"}'
    expect(parseGeminiResponse(raw)?.h1).toBe('X')
  })
  it('retorna null se faltar campo obrigatório', () => {
    expect(parseGeminiResponse('{"h1":"x"}')).toBeNull()
  })
  it('retorna null se JSON inválido', () => {
    expect(parseGeminiResponse('not json')).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/variation-seo-generator.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

```ts
// lib/variation-seo-generator.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { SeoEntry } from './kv'

const REQUIRED = ['h1', 'h2', 'metaDescription', 'title', 'colorPsychology'] as const
type GeminiSeo = Record<typeof REQUIRED[number], string>

export function parseGeminiResponse(raw: string): GeminiSeo | null {
  let body = raw.trim()
  const fence = body.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) body = fence[1].trim()
  try {
    const parsed = JSON.parse(body)
    for (const k of REQUIRED) {
      if (typeof parsed[k] !== 'string' || !parsed[k].trim()) return null
    }
    return parsed as GeminiSeo
  } catch {
    return null
  }
}

const PROMPT = (productName: string, colorName: string, category: string) => `
Você é especialista em SEO para e-commerce de uniformes profissionais (jalecos médicos no Brasil).
Gere SEO para a página de variação: produto "${productName}", cor "${colorName}", categoria "${category}".

Responda APENAS um JSON com os campos:
- "h1": título da página (50-65 chars), com produto + cor + benefício
- "h2": subtítulo (60-90 chars), foco em quem usa e por quê
- "title": meta title (55-60 chars), com "| Jaleca" no fim
- "metaDescription": meta description (140-160 chars), CTA + diferencial
- "colorPsychology": 1 frase (80-120 chars) sobre o que essa cor transmite no contexto profissional

Não use clichês. Português brasileiro. Sem emoji.
`

export async function generateSeoForVariation(
  productName: string,
  colorName: string,
  category: string,
): Promise<GeminiSeo | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY ausente')
  const ai = new GoogleGenerativeAI(apiKey)
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const result = await model.generateContent(PROMPT(productName, colorName, category))
  const text = result.response.text()
  return parseGeminiResponse(text)
}

export function applyGeminiToEntry(entry: SeoEntry, gen: GeminiSeo): SeoEntry {
  return {
    ...entry,
    h1: gen.h1,
    h2: gen.h2,
    title: gen.title,
    metaDescription: gen.metaDescription,
    colorPsychology: gen.colorPsychology,
    seoQuality: 'gemini',
    lastGeminiAttempt: new Date().toISOString(),
    geminiAttempts: (entry.geminiAttempts ?? 0) + 1,
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/variation-seo-generator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/variation-seo-generator.ts tests/variation-seo-generator.test.ts
git commit -m "feat(seo-gen): generateSeoForVariation + parser robusto"
```

---

### Task 2: Fila de retry no KV

**Files:**
- Create: `lib/seo-retry-queue.ts`

- [ ] **Step 1: Implementar**

```ts
// lib/seo-retry-queue.ts
import { kv, retryQueueKey } from './kv'

export type RetryItem = {
  variationId: number
  attempts: number
  nextRetryAt: string
  lastError?: string
}

export async function enqueueRetry(item: RetryItem): Promise<void> {
  await kv.lpush(retryQueueKey, JSON.stringify(item))
}

export async function drainRetries(maxAttempts = 3): Promise<RetryItem[]> {
  const all: RetryItem[] = []
  while (true) {
    const raw = await kv.rpop<string>(retryQueueKey)
    if (!raw) break
    try {
      const item = JSON.parse(raw) as RetryItem
      if (item.attempts >= maxAttempts) continue // descartado
      if (new Date(item.nextRetryAt) > new Date()) {
        // ainda não é hora — recoloca e para
        await kv.lpush(retryQueueKey, raw)
        break
      }
      all.push(item)
    } catch {
      // item corrompido — descarta
    }
  }
  return all
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/seo-retry-queue.ts
git commit -m "feat(seo-gen): fila de retry KV (drainRetries com backoff)"
```

---

### Task 3: Função orchestrator `tryGeminiOrEnqueue()`

**Files:**
- Modify: `lib/variation-seo-generator.ts`

- [ ] **Step 1: Adicionar**

Append em `lib/variation-seo-generator.ts`:

```ts
import { upsertSeo, getSeoByVariationId } from './variation-state'
import { enqueueRetry } from './seo-retry-queue'

export async function tryGeminiOrEnqueue(variationId: number): Promise<void> {
  const seo = await getSeoByVariationId(variationId)
  if (!seo) return
  if (seo.seoQuality === 'premium') return // não sobrescrever curado

  try {
    const gen = await generateSeoForVariation(seo.productName, seo.colorName, seo.category)
    if (!gen) throw new Error('Gemini retornou JSON inválido')
    const updated = applyGeminiToEntry(seo, gen)
    await upsertSeo(updated)
  } catch (err) {
    const attempts = (seo.geminiAttempts ?? 0) + 1
    const backoffHours = Math.min(24, 2 ** attempts) // 2h, 4h, 8h, 16h, 24h max
    await upsertSeo({
      ...seo,
      lastGeminiAttempt: new Date().toISOString(),
      geminiAttempts: attempts,
    })
    if (attempts < 3) {
      await enqueueRetry({
        variationId,
        attempts,
        nextRetryAt: new Date(Date.now() + backoffHours * 3600 * 1000).toISOString(),
        lastError: String(err).slice(0, 200),
      })
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/variation-seo-generator.ts
git commit -m "feat(seo-gen): tryGeminiOrEnqueue com backoff exponencial"
```

---

### Task 4: Disparar Gemini no webhook ao CRIAR

**Files:**
- Modify: `app/api/wc/variation-sync/route.ts`

- [ ] **Step 1: Importar e disparar via `waitUntil`**

No topo:
```ts
import { waitUntil } from '@vercel/functions'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
```

(Se `@vercel/functions` não está instalado: `npm install @vercel/functions`.)

Dentro do handler, após `await withLock(...)`:

```ts
if (action === 'CRIAR') {
  waitUntil(tryGeminiOrEnqueue(variationId))
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/wc/variation-sync/route.ts package.json package-lock.json
git commit -m "feat(seo-gen): webhook dispara Gemini em background ao CRIAR variação"
```

---

### Task 5: Enriquecer template com nome real do produto pai

**Files:**
- Modify: `lib/wc-variation.ts` (adicionar `fetchParentProduct`)
- Modify: `app/api/wc/variation-sync/route.ts` (usar nome real)

- [ ] **Step 1: Adicionar fetch do parent**

Append em `lib/wc-variation.ts`:

```ts
export type ParentProduct = {
  id: number
  name: string
  slug: string
  categories: string[]
}

export async function fetchParentProduct(parentId: number): Promise<ParentProduct | null> {
  const res = await fetch(
    `https://wp.jaleca.com.br/wp-json/jaleca/v1/product/${parentId}`,
    {
      headers: { 'X-Jaleca-Secret': process.env.JALECA_PLUGIN_SECRET! },
      next: { revalidate: 3600 },
    },
  )
  if (!res.ok) return null
  return (await res.json()) as ParentProduct
}
```

- [ ] **Step 2: Adicionar endpoint `/product/{id}` no plugin Jaleca**

Em `docs/jaleca-fix-completo.php`:

```php
register_rest_route('jaleca/v1', '/product/(?P<id>\d+)', [
    'methods' => 'GET',
    'permission_callback' => 'jaleca_auth_secret',
    'callback' => function($req) {
        $id = absint($req['id']);
        $product = wc_get_product($id);
        if (!$product) return new WP_Error('not_found', 'Not found', ['status' => 404]);
        $cats = wp_get_post_terms($id, 'product_cat', ['fields' => 'slugs']);
        return [
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'categories' => is_array($cats) ? $cats : [],
        ];
    },
]);
```

Reinstalar plugin no Hostinger.

- [ ] **Step 3: Usar no `buildTemplateSeo`**

Em `app/api/wc/variation-sync/route.ts`, substituir `buildTemplateSeo` para receber o parent:

```ts
async function buildTemplateSeo(variationId, live, now): Promise<SeoEntry> {
  const parent = await fetchParentProduct(live.parentId)
  const productName = parent?.name ?? `Produto ${live.parentId}`
  const productSlug = parent?.slug ?? `produto-${live.parentId}`
  const category = parent?.categories?.[0] ?? 'geral'
  const colorName = live.attributes['Cor'] ?? 'Padrão'
  const colorSlug = slugify(colorName)
  const url = `/${productSlug}-${colorSlug}`
  return {
    url, productName, productSlug, colorName, colorSlug,
    variationId, category,
    title: `${productName} ${colorName} | Jaleca`,
    metaDescription: `${productName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
    seoQuality: 'template',
    stockStatus: live.snapshot.stockStatus,
    noindex: live.snapshot.stockStatus === 'outofstock',
    lastSyncedAt: now,
    geminiAttempts: 0,
  }
}
```

(Tornar a função `async` e adicionar `await` no chamador.)

- [ ] **Step 4: Commit**

```bash
git add lib/wc-variation.ts app/api/wc/variation-sync/route.ts docs/jaleca-fix-completo.php
git commit -m "feat(seo-gen): template usa nome real do produto pai via plugin"
```

---

### Task 6: Cron 03h `/api/cron/regen-seo-pendente`

**Files:**
- Create: `app/api/cron/regen-seo-pendente/route.ts`
- Modify: `vercel.json`

- [ ] **Step 1: Implementar handler**

```ts
// app/api/cron/regen-seo-pendente/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { drainRetries } from '@/lib/seo-retry-queue'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
import { getAllSeoSlugs } from '@/lib/variation-seo'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const results: any[] = []

  // 1) Drena fila de retry
  const retries = await drainRetries(3)
  for (const r of retries) {
    await tryGeminiOrEnqueue(r.variationId)
    results.push({ from: 'queue', variationId: r.variationId })
  }

  // 2) Varre todas as entradas seoQuality="template" há > 1h sem tentativa recente
  const slugs = await getAllSeoSlugs()
  const ONE_HOUR = 3600 * 1000
  for (const slug of slugs) {
    const e = await kv.get<SeoEntry>(seoKey(slug))
    if (!e || e.seoQuality !== 'template') continue
    if (e.geminiAttempts >= 3) continue
    const lastAttempt = e.lastGeminiAttempt ? new Date(e.lastGeminiAttempt).getTime() : 0
    if (Date.now() - lastAttempt < ONE_HOUR) continue
    await tryGeminiOrEnqueue(e.variationId)
    results.push({ from: 'scan', variationId: e.variationId })
  }

  return NextResponse.json({ processed: results.length, results })
}
```

- [ ] **Step 2: Registrar cron**

Editar `vercel.json` (criar se não existir):

```json
{
  "crons": [
    { "path": "/api/cron/regen-seo-pendente", "schedule": "0 6 * * *" }
  ]
}
```

(`0 6 * * *` UTC = 03h Brasília. Se já existem outros crons, adicionar à lista existente.)

- [ ] **Step 3: Configurar `CRON_SECRET`**

Vercel Dashboard → Env Vars → adicionar `CRON_SECRET=<random-32-chars>`.

- [ ] **Step 4: Smoke test**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://jaleca.com.br/api/cron/regen-seo-pendente
```

Expected: JSON com `processed: N`.

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/regen-seo-pendente/route.ts vercel.json
git commit -m "feat(seo-gen): cron 03h drena fila + varre templates pendentes"
```

---

### Task 7: E2E Gemini

- [ ] **Step 1: Cenário sucesso**

1. Criar variação nova no WP (cor inédita).
2. ≤2s: KV tem entrada com `seoQuality: "template"`.
3. ≤30s: KV atualiza para `seoQuality: "gemini"` com h1/h2/colorPsychology preenchidos.
4. Recarregar a página → metadata com novo title/description.

- [ ] **Step 2: Cenário falha simulada**

1. Temporariamente setar `GEMINI_API_KEY=invalid` no `.env.local`.
2. Criar variação nova.
3. KV: `seoQuality` permanece `template`, `geminiAttempts=1`, `lastGeminiAttempt` recente.
4. Conferir KV → `gemini-retry-queue` tem item.
5. Reverter API key, rodar cron manualmente → `seoQuality` vira `gemini`.

- [ ] **Step 3: Premium não é sobrescrito**

1. Forçar uma das 34 entradas com `seoQuality: "premium"` para `template` no KV.
2. Após cron, verificar que **continua** premium (skip por design no `tryGeminiOrEnqueue`).

Mais correto: testar que entrada premium **não é tocada** pelo gerador. Reverter para premium ao final.

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "test(seo-gen): valida cenários sucesso/falha/premium-protegido"
```

---

## Self-Review

- [x] Spec coverage: template imediato, Gemini background, retry com backoff, cron diário, premium protegido
- [x] `tryGeminiOrEnqueue` em Task 3 = chamado em Task 4 e Task 6
- [x] `applyGeminiToEntry` em Task 1 = usado dentro de `tryGeminiOrEnqueue`
- [x] Backoff exponencial 2^N horas, max 3 tentativas, depois descarta da fila
- [x] Sem placeholders
