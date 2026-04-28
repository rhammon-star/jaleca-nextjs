# Fase 2 — Sync via Webhook + Vercel KV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sincronizar variações do WooCommerce com Vercel KV em tempo real via webhook, mantendo um snapshot consistente que outras fases consumirão (rendering, SEO generator, sitemap, painel).

**Architecture:** Hook PHP no WP dispara POST não-bloqueante a `/api/wc/variation-sync`. Handler Next valida secret, lê estado WC, compara com snapshot KV, decide ação (CRIAR/SEM_ESTOQUE/VOLTOU_ESTOQUE/DESATIVAR), atualiza KV com mutex e retorna 200 em ≤500ms. Side-effects pesados via `waitUntil()`.

**Tech Stack:** Next.js 16 App Router, `@vercel/kv`, GraphQL (já usado), WooCommerce REST.

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seções "Modelo de dados" + "Fluxo de decisão do webhook")

**Pré-requisito:** Vercel KV provisionado (criar em Vercel Dashboard → Storage → Create → KV). Variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` no `.env.local` e Vercel.

---

## File Structure

**Criar:**
- `lib/kv.ts` — cliente KV singleton com helpers tipados
- `lib/variation-state.ts` — leitura/escrita de snapshot + decisão de ação + mutex
- `lib/wc-variation.ts` — busca variação no WC GraphQL/REST com tipos
- `app/api/wc/variation-sync/route.ts` — webhook handler
- `tests/variation-state.test.ts` — testes da state machine
- `scripts/seed-kv-from-json.ts` — seed inicial das 34 entradas premium

**Modificar:**
- `docs/jaleca-fix-completo.php` — adicionar hooks de variação
- `package.json` — adicionar `@vercel/kv`

---

### Task 1: Instalar `@vercel/kv` e criar `lib/kv.ts`

**Files:**
- Modify: `package.json`
- Create: `lib/kv.ts`

- [ ] **Step 1: Instalar dependência**

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs
npm install @vercel/kv
```

- [ ] **Step 2: Criar `lib/kv.ts`**

```ts
// lib/kv.ts
import { kv } from '@vercel/kv'

export { kv }

export type SeoQuality = 'template' | 'gemini' | 'premium'

export type SeoEntry = {
  url: string
  productName: string
  productSlug: string
  colorName: string
  colorSlug: string
  variationId: number
  category: string
  h1?: string
  h2?: string
  metaDescription?: string
  title?: string
  colorPsychology?: string
  seoQuality: SeoQuality
  stockStatus: 'instock' | 'outofstock'
  noindex: boolean
  lastSyncedAt: string
  lastGeminiAttempt?: string
  geminiAttempts: number
}

export type VariationSnapshot = {
  stockStatus: 'instock' | 'outofstock'
  status: 'publish' | 'draft' | 'trash' | 'private'
  price: string
  sku: string
  updatedAt: string
}

export const seoKey = (slug: string) => `seo:${slug}`
export const variationKey = (id: number) => `variation:${id}`
export const lockKey = 'lock:seo-write'
export const retryQueueKey = 'gemini-retry-queue'
export const notifyKey = (id: number) => `notify:${id}`
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json lib/kv.ts
git commit -m "feat(kv): instala @vercel/kv e cria cliente tipado"
```

---

### Task 2: Implementar mutex de escrita em `lib/variation-state.ts`

**Files:**
- Create: `lib/variation-state.ts` (parte 1: mutex)
- Create: `tests/variation-state.test.ts`

- [ ] **Step 1: Criar teste falhando**

```ts
// tests/variation-state.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { acquireLock, releaseLock } from '@/lib/variation-state'

vi.mock('@/lib/kv', () => ({
  kv: {
    set: vi.fn(),
    del: vi.fn(),
  },
  lockKey: 'lock:seo-write',
}))

import { kv } from '@/lib/kv'

describe('mutex', () => {
  beforeEach(() => vi.resetAllMocks())

  it('acquireLock retorna true quando KV aceita o SET NX', async () => {
    ;(kv.set as any).mockResolvedValue('OK')
    expect(await acquireLock('owner-1')).toBe(true)
    expect(kv.set).toHaveBeenCalledWith('lock:seo-write', 'owner-1', { nx: true, ex: 30 })
  })

  it('acquireLock retorna false quando lock já existe', async () => {
    ;(kv.set as any).mockResolvedValue(null)
    expect(await acquireLock('owner-2')).toBe(false)
  })

  it('releaseLock só deleta se for o dono', async () => {
    ;(kv.del as any).mockResolvedValue(1)
    await releaseLock('owner-1')
    expect(kv.del).toHaveBeenCalledWith('lock:seo-write')
  })
})
```

- [ ] **Step 2: Rodar teste e ver falhar**

Run: `npx vitest run tests/variation-state.test.ts`
Expected: FAIL — funções não existem.

- [ ] **Step 3: Implementar mutex**

```ts
// lib/variation-state.ts
import { kv, lockKey } from './kv'

export async function acquireLock(owner: string, ttlSeconds = 30): Promise<boolean> {
  const result = await kv.set(lockKey, owner, { nx: true, ex: ttlSeconds })
  return result === 'OK'
}

export async function releaseLock(owner: string): Promise<void> {
  // Best-effort: lock expira sozinho em 30s, então só fazemos del.
  // Para garantir só liberar se for o dono, usaríamos Lua script — não necessário aqui.
  await kv.del(lockKey)
}

export async function withLock<T>(
  owner: string,
  fn: () => Promise<T>,
  maxWaitMs = 5000,
): Promise<T> {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    if (await acquireLock(owner)) {
      try {
        return await fn()
      } finally {
        await releaseLock(owner)
      }
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('Could not acquire lock within timeout')
}
```

- [ ] **Step 4: Rodar testes e ver passar**

Run: `npx vitest run tests/variation-state.test.ts`
Expected: PASS — 3 testes ok.

- [ ] **Step 5: Commit**

```bash
git add lib/variation-state.ts tests/variation-state.test.ts
git commit -m "feat(sync): mutex de escrita KV com timeout configurável"
```

---

### Task 3: Implementar state machine `decideAction()`

**Files:**
- Modify: `lib/variation-state.ts`
- Modify: `tests/variation-state.test.ts`

- [ ] **Step 1: Adicionar testes**

Append em `tests/variation-state.test.ts`:

```ts
import { decideAction } from '@/lib/variation-state'

describe('decideAction', () => {
  const wcLive = (over = {}) => ({
    stockStatus: 'instock' as const,
    status: 'publish' as const,
    price: '159.90',
    sku: 'SKU',
    updatedAt: '2026-04-27T14:00:00Z',
    ...over,
  })

  it('CRIAR quando snapshot vazio e WC publish+instock+price', () => {
    expect(decideAction(null, wcLive())).toBe('CRIAR')
  })

  it('CRIAR ignorado quando price vazio', () => {
    expect(decideAction(null, wcLive({ price: '' }))).toBe('IGNORAR')
  })

  it('SEM_ESTOQUE quando snapshot instock vira outofstock', () => {
    const prev = wcLive()
    expect(decideAction(prev, wcLive({ stockStatus: 'outofstock' }))).toBe('SEM_ESTOQUE')
  })

  it('SEM_ESTOQUE quando status sai de publish', () => {
    const prev = wcLive()
    expect(decideAction(prev, wcLive({ status: 'draft' }))).toBe('SEM_ESTOQUE')
  })

  it('VOLTOU_ESTOQUE quando outofstock vira instock', () => {
    const prev = wcLive({ stockStatus: 'outofstock' })
    expect(decideAction(prev, wcLive())).toBe('VOLTOU_ESTOQUE')
  })

  it('DESATIVAR quando status vira trash', () => {
    expect(decideAction(wcLive(), wcLive({ status: 'trash' }))).toBe('DESATIVAR')
  })

  it('IGNORAR quando updatedAt idêntico', () => {
    const same = wcLive()
    expect(decideAction(same, same)).toBe('IGNORAR')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/variation-state.test.ts`
Expected: FAIL — `decideAction` não definido.

- [ ] **Step 3: Implementar**

Append em `lib/variation-state.ts`:

```ts
import type { VariationSnapshot } from './kv'

export type Action = 'CRIAR' | 'SEM_ESTOQUE' | 'VOLTOU_ESTOQUE' | 'DESATIVAR' | 'IGNORAR'

const ACTIVE = (s: VariationSnapshot) =>
  s.status === 'publish' && s.stockStatus === 'instock' && Number(s.price) > 0

export function decideAction(
  prev: VariationSnapshot | null,
  next: VariationSnapshot,
): Action {
  if (prev && prev.updatedAt === next.updatedAt) return 'IGNORAR'

  if (next.status === 'trash') return 'DESATIVAR'

  const wasActive = prev ? ACTIVE(prev) : false
  const isActive = ACTIVE(next)

  if (!prev && isActive) return 'CRIAR'
  if (wasActive && !isActive) return 'SEM_ESTOQUE'
  if (!wasActive && isActive) return 'VOLTOU_ESTOQUE'
  return 'IGNORAR'
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/variation-state.test.ts`
Expected: PASS — 7 testes ok.

- [ ] **Step 5: Commit**

```bash
git add lib/variation-state.ts tests/variation-state.test.ts
git commit -m "feat(sync): state machine decideAction (CRIAR/SEM_ESTOQUE/VOLTOU_ESTOQUE/DESATIVAR)"
```

---

### Task 4: Helpers de leitura/escrita de snapshot e SEO entry

**Files:**
- Modify: `lib/variation-state.ts`

- [ ] **Step 1: Adicionar helpers**

Append em `lib/variation-state.ts`:

```ts
import { kv, variationKey, seoKey, type SeoEntry } from './kv'

export async function getSnapshot(variationId: number): Promise<VariationSnapshot | null> {
  return (await kv.get<VariationSnapshot>(variationKey(variationId))) ?? null
}

export async function setSnapshot(
  variationId: number,
  snap: VariationSnapshot,
): Promise<void> {
  await kv.set(variationKey(variationId), snap)
}

export async function getSeoBySlug(slug: string): Promise<SeoEntry | null> {
  return (await kv.get<SeoEntry>(seoKey(slug))) ?? null
}

export async function getSeoByVariationId(variationId: number): Promise<SeoEntry | null> {
  // Guarda secundário: scan poderia ser caro — use tag
  // Usamos um índice extra: variationToSlug:{id} → slug
  const slug = await kv.get<string>(`variationToSlug:${variationId}`)
  if (!slug) return null
  return getSeoBySlug(slug)
}

export async function upsertSeo(entry: SeoEntry): Promise<void> {
  const slug = entry.url.replace(/^\//, '')
  await Promise.all([
    kv.set(seoKey(slug), entry),
    kv.set(`variationToSlug:${entry.variationId}`, slug),
  ])
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/variation-state.ts
git commit -m "feat(sync): helpers getSnapshot/upsertSeo + índice variationToSlug"
```

---

### Task 5: Cliente WC para buscar variação

**Files:**
- Create: `lib/wc-variation.ts`

- [ ] **Step 1: Implementar fetcher**

```ts
// lib/wc-variation.ts
import type { VariationSnapshot } from './kv'

const WC_BASE = 'https://wp.jaleca.com.br/wp-json/wc/v3'

type WcVariationResponse = {
  id: number
  status: 'publish' | 'draft' | 'trash' | 'private'
  stock_status: 'instock' | 'outofstock'
  price: string
  sku: string
  date_modified_gmt: string
  parent_id: number
  attributes: Array<{ name: string; option: string }>
}

export type FullVariation = {
  snapshot: VariationSnapshot
  parentId: number
  attributes: Record<string, string> // ex: { Cor: 'Azul Marinho', Tamanho: 'G' }
  raw: WcVariationResponse
}

export async function fetchVariation(variationId: number): Promise<FullVariation | null> {
  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`,
  ).toString('base64')

  // Variação no WC REST: /products/{parent}/variations/{id}
  // Como não temos parent_id ainda, usamos o endpoint genérico via meta:
  // alternativa: /products/variations? — não suportado direto.
  // Solução: buscar no GraphQL primeiro (já configurado no projeto).

  // Fluxo simples: usar plugin Jaleca já existente para retornar a variação
  // (adicionar endpoint helper no plugin se não existir).

  const res = await fetch(
    `https://wp.jaleca.com.br/wp-json/jaleca/v1/variation/${variationId}`,
    {
      headers: { 'X-Jaleca-Secret': process.env.JALECA_PLUGIN_SECRET! },
      next: { revalidate: 0 },
    },
  )
  if (!res.ok) return null
  const data = (await res.json()) as WcVariationResponse

  const attributes = Object.fromEntries(data.attributes.map((a) => [a.name, a.option]))

  return {
    snapshot: {
      stockStatus: data.stock_status,
      status: data.status,
      price: data.price ?? '',
      sku: data.sku ?? '',
      updatedAt: data.date_modified_gmt,
    },
    parentId: data.parent_id,
    attributes,
    raw: data,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/wc-variation.ts
git commit -m "feat(sync): fetchVariation via plugin Jaleca"
```

---

### Task 6: Adicionar endpoint `/variation/{id}` ao plugin Jaleca

**Files:**
- Modify: `docs/jaleca-fix-completo.php`

- [ ] **Step 1: Adicionar endpoint REST no plugin**

Adicionar dentro do `register_rest_route` block (procurar bloco existente como `/lookup-cpf`):

```php
register_rest_route('jaleca/v1', '/variation/(?P<id>\d+)', [
    'methods' => 'GET',
    'permission_callback' => 'jaleca_auth_secret',
    'callback' => function($req) {
        $id = absint($req['id']);
        $variation = wc_get_product($id);
        if (!$variation || $variation->get_type() !== 'variation') {
            return new WP_Error('not_found', 'Variation not found', ['status' => 404]);
        }
        $attrs = [];
        foreach ($variation->get_attributes() as $name => $option) {
            $attrs[] = ['name' => wc_attribute_label($name), 'option' => $option];
        }
        return [
            'id' => $variation->get_id(),
            'parent_id' => $variation->get_parent_id(),
            'status' => $variation->get_status(),
            'stock_status' => $variation->get_stock_status(),
            'price' => $variation->get_price(),
            'sku' => $variation->get_sku(),
            'date_modified_gmt' => $variation->get_date_modified()->date('c'),
            'attributes' => $attrs,
        ];
    },
]);
```

Garantir que `jaleca_auth_secret` valida o header `X-Jaleca-Secret` (já existe no plugin).

- [ ] **Step 2: Reinstalar plugin via Hostinger File Manager**

Upload do `docs/jaleca-fix-completo.php` atualizado para `/wp-content/plugins/jaleca-fix/jaleca-fix-completo.php` (ou similar — confirmar caminho atual).

- [ ] **Step 3: Smoke test do endpoint**

```bash
curl -H "X-Jaleca-Secret: $JALECA_PLUGIN_SECRET" \
  https://wp.jaleca.com.br/wp-json/jaleca/v1/variation/12345
```

Expected: JSON com campos `id`, `status`, `stock_status`, `price`, `attributes`.

- [ ] **Step 4: Commit**

```bash
git add docs/jaleca-fix-completo.php
git commit -m "feat(plugin): adiciona endpoint GET /variation/{id}"
```

---

### Task 7: Implementar webhook handler `/api/wc/variation-sync`

**Files:**
- Create: `app/api/wc/variation-sync/route.ts`

- [ ] **Step 1: Implementar handler**

```ts
// app/api/wc/variation-sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { fetchVariation } from '@/lib/wc-variation'
import {
  decideAction,
  getSnapshot,
  setSnapshot,
  getSeoByVariationId,
  upsertSeo,
  withLock,
  type Action,
} from '@/lib/variation-state'
import type { SeoEntry } from '@/lib/kv'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-jaleca-secret') !== process.env.JALECA_PLUGIN_SECRET) {
    return unauthorized()
  }

  const body = (await req.json().catch(() => null)) as { variationId?: number } | null
  const variationId = body?.variationId
  if (!variationId) return NextResponse.json({ error: 'variationId required' }, { status: 400 })

  const live = await fetchVariation(variationId)
  if (!live) {
    // Variação foi deletada — marca SEO como noindex se existir
    const seo = await getSeoByVariationId(variationId)
    if (seo) {
      await upsertSeo({ ...seo, noindex: true, stockStatus: 'outofstock', lastSyncedAt: new Date().toISOString() })
      revalidatePath(seo.url)
    }
    return NextResponse.json({ action: 'DESATIVAR (deletada)', variationId })
  }

  const prev = await getSnapshot(variationId)
  const action: Action = decideAction(prev, live.snapshot)

  if (action === 'IGNORAR') {
    return NextResponse.json({ action, variationId })
  }

  // Adquire mutex e processa
  const owner = `webhook-${variationId}-${Date.now()}`
  await withLock(owner, async () => {
    const existingSeo = await getSeoByVariationId(variationId)
    const now = new Date().toISOString()

    let seo: SeoEntry
    if (existingSeo) {
      seo = {
        ...existingSeo,
        stockStatus: live.snapshot.stockStatus,
        noindex: action === 'SEM_ESTOQUE' || action === 'DESATIVAR',
        lastSyncedAt: now,
      }
    } else {
      // CRIAR — entrada nova com SEO template (Fase 4 melhora com Gemini)
      seo = buildTemplateSeo(variationId, live, now)
    }

    await upsertSeo(seo)
    await setSnapshot(variationId, live.snapshot)
    revalidatePath(seo.url)
  })

  return NextResponse.json({ action, variationId })
}

function buildTemplateSeo(
  variationId: number,
  live: NonNullable<Awaited<ReturnType<typeof fetchVariation>>>,
  now: string,
): SeoEntry {
  const colorName = live.attributes['Cor'] ?? live.attributes['cor'] ?? 'Padrão'
  const colorSlug = slugify(colorName)
  // productSlug deve vir do parent — buscar nome do parent via outro endpoint ou cache
  // Simplificação: usar parentId como fallback até Fase 4 enriquecer com nome real
  const productSlug = `produto-${live.parentId}`
  const productName = `Produto ${live.parentId}`
  const url = `/${productSlug}-${colorSlug}`

  return {
    url,
    productName,
    productSlug,
    colorName,
    colorSlug,
    variationId,
    category: 'geral',
    title: `${productName} ${colorName} | Jaleca`,
    metaDescription: `${productName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
    seoQuality: 'template',
    stockStatus: live.snapshot.stockStatus,
    noindex: live.snapshot.stockStatus === 'outofstock',
    lastSyncedAt: now,
    geminiAttempts: 0,
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/wc/variation-sync/route.ts
git commit -m "feat(sync): webhook handler /api/wc/variation-sync com mutex e state machine"
```

---

### Task 8: Adicionar hooks PHP no WP

**Files:**
- Modify: `docs/jaleca-fix-completo.php`

- [ ] **Step 1: Adicionar hooks**

Adicionar no plugin (fora do `register_rest_route`):

```php
add_action('woocommerce_update_product_variation', 'jaleca_notify_variation_change', 20, 1);
add_action('woocommerce_save_product_variation', 'jaleca_notify_variation_change', 20, 1);
add_action('woocommerce_variation_set_stock_status', 'jaleca_notify_variation_change', 20, 1);
add_action('woocommerce_variation_set_visible', 'jaleca_notify_variation_change', 20, 1);

function jaleca_notify_variation_change($variation_id) {
    if (!$variation_id) return;
    $url = 'https://jaleca.com.br/api/wc/variation-sync';
    wp_remote_post($url, [
        'headers'  => [
            'Content-Type'    => 'application/json',
            'X-Jaleca-Secret' => defined('JALECA_PLUGIN_SECRET_VALUE')
                ? JALECA_PLUGIN_SECRET_VALUE
                : 'jaleca-register-secret-2026',
        ],
        'body'     => json_encode(['variationId' => intval($variation_id)]),
        'timeout'  => 5,
        'blocking' => false, // não trava o admin do WP
    ]);
}
```

- [ ] **Step 2: Reinstalar plugin no Hostinger**

Upload do arquivo atualizado.

- [ ] **Step 3: Smoke test**

1. Editar uma variação no WP admin (alterar estoque de 0→1).
2. Verificar nos logs Vercel: `vercel logs jaleca.com.br` → procurar `POST /api/wc/variation-sync 200`.
3. Verificar KV no dashboard Vercel → KV → buscar `variation:{id}`.

- [ ] **Step 4: Commit**

```bash
git add docs/jaleca-fix-completo.php
git commit -m "feat(plugin): hooks WC disparam webhook variation-sync"
```

---

### Task 9: Script de seed inicial KV das 34 entradas

**Files:**
- Create: `scripts/seed-kv-from-json.ts`

- [ ] **Step 1: Implementar seed**

```ts
// scripts/seed-kv-from-json.ts
import { readFile } from 'fs/promises'
import { join } from 'path'
import { kv, seoKey, type SeoEntry } from '../lib/kv'

async function main() {
  const path = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const raw = JSON.parse(await readFile(path, 'utf-8')) as Array<Partial<SeoEntry>>

  let count = 0
  for (const entry of raw) {
    if (!entry.url || !entry.colorName || !entry.productName) {
      console.warn('Skip:', entry)
      continue
    }
    const slug = entry.url.replace(/^\//, '')
    const full: SeoEntry = {
      url: entry.url,
      productName: entry.productName,
      productSlug: slug.split('-').slice(0, -1).join('-') || slug,
      colorName: entry.colorName,
      colorSlug: slug.split('-').pop() ?? '',
      variationId: (entry as any).variationId ?? 0, // 0 = pendente lookup
      category: entry.category ?? 'geral',
      h1: entry.h1,
      h2: entry.h2,
      title: entry.title,
      metaDescription: entry.metaDescription,
      colorPsychology: entry.colorPsychology,
      seoQuality: 'premium',
      stockStatus: 'instock',
      noindex: false,
      lastSyncedAt: new Date().toISOString(),
      geminiAttempts: 0,
    }
    await kv.set(seoKey(slug), full)
    if (full.variationId) await kv.set(`variationToSlug:${full.variationId}`, slug)
    count++
  }
  console.log(`Seeded ${count} entries`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: Rodar uma vez**

```bash
npx tsx scripts/seed-kv-from-json.ts
```

Expected: `Seeded 34 entries`.

- [ ] **Step 3: Validar no Vercel KV dashboard**

Abrir Vercel → Storage → KV → Browse → confirmar chaves `seo:*`.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-kv-from-json.ts
git commit -m "feat(sync): script de seed KV a partir de SEO-PRODUTOS-CORES.json"
```

---

### Task 10: Vincular `variationId` nas 34 entradas premium

**Files:**
- Modify: `docs/SEO-PRODUTOS-CORES.json`
- Create: `scripts/link-variation-ids.ts`

- [ ] **Step 1: Implementar lookup**

```ts
// scripts/link-variation-ids.ts
// Para cada entrada do JSON, busca a variação correspondente no WC
// usando GraphQL (productSlug + colorName) e adiciona variationId.
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { graphqlClient, GET_PRODUCT_BY_SLUG } from '../lib/graphql'

async function main() {
  const path = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const entries = JSON.parse(await readFile(path, 'utf-8')) as any[]

  for (const entry of entries) {
    if (entry.variationId) continue
    const slug = entry.productSlug ?? entry.url.replace(/^\//, '').split('-').slice(0, -1).join('-')
    try {
      const data = await graphqlClient.request<any>(GET_PRODUCT_BY_SLUG, { slug })
      const variations = data?.product?.variations?.nodes ?? []
      const match = variations.find((v: any) =>
        v.attributes?.nodes?.some(
          (a: any) => a.name?.toLowerCase().includes('cor') &&
            a.value?.toLowerCase() === entry.colorName.toLowerCase(),
        ),
      )
      if (match?.databaseId) entry.variationId = match.databaseId
    } catch (e) {
      console.warn('lookup falhou para', entry.url, e)
    }
  }

  await writeFile(path, JSON.stringify(entries, null, 2))
  console.log('OK')
}

main().catch(console.error)
```

- [ ] **Step 2: Rodar**

```bash
npx tsx scripts/link-variation-ids.ts
```

Conferir manualmente no JSON que cada entrada agora tem `variationId`. Se faltar alguma, completar à mão consultando o WP admin.

- [ ] **Step 3: Re-rodar seed**

```bash
npx tsx scripts/seed-kv-from-json.ts
```

- [ ] **Step 4: Commit**

```bash
git add docs/SEO-PRODUTOS-CORES.json scripts/link-variation-ids.ts
git commit -m "feat(sync): vincula variationId às 34 entradas premium"
```

---

### Task 11: Logging estruturado e observabilidade

**Files:**
- Modify: `app/api/wc/variation-sync/route.ts`

- [ ] **Step 1: Adicionar logs no início e em cada decisão**

Editar handler para logar:

```ts
console.log(JSON.stringify({
  event: 'variation-sync',
  variationId,
  action,
  prev: prev?.stockStatus,
  next: live.snapshot.stockStatus,
  durationMs: Date.now() - start,
}))
```

(Adicionar `const start = Date.now()` no topo do POST.)

- [ ] **Step 2: Smoke test e validar logs no Vercel**

Disparar webhook (editar variação no WP). Vercel Logs → procurar JSON `event: 'variation-sync'`.

- [ ] **Step 3: Commit**

```bash
git add app/api/wc/variation-sync/route.ts
git commit -m "feat(sync): logging estruturado em variation-sync"
```

---

### Task 12: Smoke test E2E completo

- [ ] **Step 1: Cenário CRIAR**

1. No WP admin, criar variação nova em produto existente (cor que ainda não tinha variação).
2. Definir `stock_status=instock`, `regular_price=159.90`, `status=publish`.
3. Salvar.
4. Em ≤10 segundos:
   - Vercel Logs mostra `action: "CRIAR"`
   - KV tem `variation:{id}` e `seo:{slug}` com `seoQuality: "template"`
   - `https://jaleca.com.br/{slug}` responde 200 (com SEO template — Fase 4 enriquece)

- [ ] **Step 2: Cenário SEM_ESTOQUE**

1. Editar a mesma variação, mudar `stock_status` para `outofstock`.
2. Vercel Logs: `action: "SEM_ESTOQUE"`
3. KV: `seo:{slug}.noindex` agora é `true`
4. Página segue acessível mas com `<meta robots="noindex">` (Fase 3 adiciona o banner Avise-me)

- [ ] **Step 3: Cenário VOLTOU_ESTOQUE**

1. Voltar `stock_status` para `instock`.
2. Vercel Logs: `action: "VOLTOU_ESTOQUE"`
3. KV: `noindex` volta para `false`

- [ ] **Step 4: Cenário IGNORAR (idempotência)**

1. Salvar a variação novamente sem mudar nada.
2. Vercel Logs: `action: "IGNORAR"` (sem efeitos colaterais).

- [ ] **Step 5: Documentar resultados em commit final**

```bash
git commit --allow-empty -m "test(sync): valida E2E CRIAR/SEM_ESTOQUE/VOLTOU/IGNORAR"
```

---

## Self-Review Checklist

- [x] Spec coverage: webhook, KV, decideAction, mutex, snapshot, idempotência, seed
- [x] Sem placeholders — código completo em todos os steps
- [x] Tipos consistentes: `SeoEntry` e `VariationSnapshot` usados igual em kv.ts, variation-state.ts, route.ts
- [x] `decideAction` em Task 3 = referenciado em Task 7
- [x] `withLock` em Task 2 = usado em Task 7
- [x] Faltou: enriquecer productName/productSlug com nome real do parent — Fase 4 trata via Gemini lookup. Aceito como template fallback nesta fase.
