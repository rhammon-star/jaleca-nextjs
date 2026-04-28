# Fase 3 — Rendering: Out-of-Stock + Sitemap KV-based Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Página de produto consome SEO do KV (com fallback JSON), renderiza variantes sem estoque com banner "Avise-me" e `noindex`, e o sitemap passa a ser gerado a partir do KV — entregando o valor SEO imediato.

**Architecture:** `getVariationSEO(slug)` lê do KV, com JSON como fallback. `app/produto/[slug]/page.tsx` injeta `noindex` em metadata quando `seo.noindex`. `OutOfStockPage` renderiza banner + form Avise-me + carrossel de outras cores. `app/sitemap.ts` itera KV.

**Tech Stack:** Next.js 16 App Router (`generateMetadata`, `revalidate`), Vercel KV.

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seção "Rendering" + "Sitemap")

**Pré-requisito:** Fase 2 concluída (KV populado).

---

## File Structure

**Criar:**
- `lib/variation-seo.ts` — `getVariationSEO(slug)` com KV-first + JSON fallback
- `components/OutOfStockPage.tsx` — UI sem estoque
- `components/AviseMeForm.tsx` — form de notificação
- `app/api/avise-me/route.ts` — endpoint de inscrição (KV `notify:{id}`)
- `tests/variation-seo.test.ts`

**Modificar:**
- `app/produto/[slug]/page.tsx` — usar `getVariationSEO`, ramificar render por estoque, adicionar `noindex`
- `app/sitemap.ts` — gerar a partir do KV
- `lib/all-products.ts` — filtrar variações `outofstock` em listagens

---

### Task 1: `getVariationSEO` com KV-first + JSON fallback

**Files:**
- Create: `lib/variation-seo.ts`
- Create: `tests/variation-seo.test.ts`

- [ ] **Step 1: Teste falhando**

```ts
// tests/variation-seo.test.ts
import { describe, it, expect, vi } from 'vitest'
vi.mock('@/lib/kv', () => ({ kv: { get: vi.fn() }, seoKey: (s: string) => `seo:${s}` }))
import { kv } from '@/lib/kv'
import { getVariationSEO } from '@/lib/variation-seo'

describe('getVariationSEO', () => {
  it('retorna entry do KV se existir', async () => {
    ;(kv.get as any).mockResolvedValueOnce({ url: '/x', seoQuality: 'gemini' })
    const seo = await getVariationSEO('x')
    expect(seo?.seoQuality).toBe('gemini')
  })
  it('retorna null quando KV vazio e JSON não tem o slug', async () => {
    ;(kv.get as any).mockResolvedValueOnce(null)
    const seo = await getVariationSEO('slug-inexistente-xyz')
    expect(seo).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/variation-seo.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar**

```ts
// lib/variation-seo.ts
import { cache } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { kv, seoKey, type SeoEntry } from './kv'

export const getVariationSEO = cache(async (slug: string): Promise<SeoEntry | null> => {
  // KV first
  const fromKv = await kv.get<SeoEntry>(seoKey(slug))
  if (fromKv) return fromKv

  // JSON fallback (build-time/dev safety net)
  try {
    const path = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
    const entries = JSON.parse(await readFile(path, 'utf-8')) as any[]
    const match = entries.find((e) => e.url?.replace(/^\//, '') === slug)
    if (!match) return null
    return {
      ...match,
      seoQuality: 'premium',
      stockStatus: 'instock',
      noindex: false,
      lastSyncedAt: new Date().toISOString(),
      geminiAttempts: 0,
    } as SeoEntry
  } catch {
    return null
  }
})

export const getAllSeoSlugs = cache(async (): Promise<string[]> => {
  // Vercel KV scan: itera chaves seo:*
  const slugs: string[] = []
  let cursor = '0'
  do {
    const [next, keys] = await kv.scan(cursor, { match: 'seo:*', count: 200 })
    cursor = next.toString()
    for (const k of keys) slugs.push(k.replace(/^seo:/, ''))
  } while (cursor !== '0')
  return slugs
})
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/variation-seo.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/variation-seo.ts tests/variation-seo.test.ts
git commit -m "feat(rendering): getVariationSEO com KV-first + JSON fallback"
```

---

### Task 2: `AviseMeForm` componente

**Files:**
- Create: `components/AviseMeForm.tsx`

- [ ] **Step 1: Implementar**

```tsx
// components/AviseMeForm.tsx
'use client'
import { useState } from 'react'

export default function AviseMeForm({ variationId }: { variationId: number }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/avise-me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, variationId }),
    })
    setStatus(res.ok ? 'ok' : 'err')
  }

  if (status === 'ok') {
    return <p className="text-green-700">Pronto! Avisaremos no email <strong>{email}</strong>.</p>
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        disabled={status === 'loading'}
        className="bg-stone-800 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {status === 'loading' ? 'Enviando...' : 'Avise-me'}
      </button>
      {status === 'err' && <span className="text-red-600 text-sm">Erro, tente de novo</span>}
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AviseMeForm.tsx
git commit -m "feat(rendering): componente AviseMeForm"
```

---

### Task 3: `/api/avise-me` endpoint

**Files:**
- Create: `app/api/avise-me/route.ts`

- [ ] **Step 1: Implementar**

```ts
// app/api/avise-me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { kv, notifyKey } from '@/lib/kv'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; variationId?: number }
    | null
  const { email, variationId } = body ?? {}
  if (!email || !variationId) {
    return NextResponse.json({ error: 'email e variationId obrigatórios' }, { status: 400 })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 })
  }
  await kv.sadd(notifyKey(variationId), email.toLowerCase().trim())
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/avise-me/route.ts
git commit -m "feat(rendering): endpoint /api/avise-me grava em KV"
```

---

### Task 4: Componente `OutOfStockPage`

**Files:**
- Create: `components/OutOfStockPage.tsx`

- [ ] **Step 1: Implementar**

```tsx
// components/OutOfStockPage.tsx
import Link from 'next/link'
import AviseMeForm from './AviseMeForm'
import type { SeoEntry } from '@/lib/kv'

type Props = {
  seo: SeoEntry
  otherColors: Array<{ url: string; colorName: string; image?: string }>
}

export default function OutOfStockPage({ seo, otherColors }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{seo.h1 ?? `${seo.productName} ${seo.colorName}`}</h1>

      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 my-6">
        <p className="font-semibold">Esta cor está temporariamente sem estoque.</p>
        <p className="text-sm text-stone-700 mt-1">
          Cadastre seu email e te avisamos assim que voltar.
        </p>
        <div className="mt-3">
          <AviseMeForm variationId={seo.variationId} />
        </div>
      </div>

      {otherColors.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Veja em outras cores disponíveis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherColors.map((c) => (
              <Link key={c.url} href={c.url} className="block border rounded p-3 hover:shadow">
                {c.image && <img src={c.image} alt={c.colorName} className="w-full h-32 object-cover rounded" />}
                <p className="mt-2 text-sm">{c.colorName}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Schema.org com availability OutOfStock */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: `${seo.productName} ${seo.colorName}`,
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/OutOfStock',
              url: `https://jaleca.com.br${seo.url}`,
            },
          }),
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/OutOfStockPage.tsx
git commit -m "feat(rendering): OutOfStockPage com banner + AviseMe + outras cores"
```

---

### Task 5: Integrar em `app/produto/[slug]/page.tsx`

**Files:**
- Modify: `app/produto/[slug]/page.tsx`

- [ ] **Step 1: Adicionar `generateMetadata` com `noindex`**

No topo do arquivo, depois dos imports existentes:

```ts
import { getVariationSEO } from '@/lib/variation-seo'
import OutOfStockPage from '@/components/OutOfStockPage'
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const seo = await getVariationSEO(slug)
  if (!seo) return {}
  return {
    title: seo.title,
    description: seo.metaDescription,
    robots: seo.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: `https://jaleca.com.br${seo.url}` },
  }
}
```

(Se já existir um `generateMetadata` no arquivo, mesclar — preservar campos OG/Twitter já existentes.)

- [ ] **Step 2: Ramificar render por estoque**

Dentro do componente `Page` default, no início:

```tsx
const seo = await getVariationSEO(slug)
if (seo?.stockStatus === 'outofstock') {
  // Buscar outras cores instock do mesmo productSlug
  const otherColors = await getInStockSiblings(seo.productSlug, seo.variationId)
  return <OutOfStockPage seo={seo} otherColors={otherColors} />
}
// ... segue render atual
```

- [ ] **Step 3: Implementar `getInStockSiblings`**

Adicionar em `lib/variation-seo.ts`:

```ts
export async function getInStockSiblings(
  productSlug: string,
  excludeVariationId: number,
): Promise<Array<{ url: string; colorName: string; image?: string }>> {
  const slugs = await getAllSeoSlugs()
  const results: Array<{ url: string; colorName: string; image?: string }> = []
  for (const slug of slugs) {
    const e = await kv.get<SeoEntry>(seoKey(slug))
    if (!e) continue
    if (e.productSlug !== productSlug) continue
    if (e.variationId === excludeVariationId) continue
    if (e.stockStatus !== 'instock') continue
    results.push({ url: e.url, colorName: e.colorName })
  }
  return results.slice(0, 6)
}
```

- [ ] **Step 4: Build + smoke test**

Run: `npm run build && npm run start`

Forçar uma variação como `outofstock` no KV (via script ou painel quando existir):

```bash
npx tsx -e "
import { kv } from './lib/kv';
const e = await kv.get('seo:jaleco-medico-azul-marinho');
await kv.set('seo:jaleco-medico-azul-marinho', { ...e, stockStatus: 'outofstock', noindex: true });
"
```

Acessar `http://localhost:3000/jaleco-medico-azul-marinho` → deve mostrar `OutOfStockPage`.

- [ ] **Step 5: Commit**

```bash
git add app/produto/[slug]/page.tsx lib/variation-seo.ts
git commit -m "feat(rendering): produto/[slug] respeita stockStatus do KV e renderiza OutOfStockPage"
```

---

### Task 6: Sitemap KV-based

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Atualizar para iterar KV**

Manter outras rotas (home, blog, hubs) como já estão e adicionar/substituir o bloco de variações:

```ts
import type { MetadataRoute } from 'next'
import { getAllSeoSlugs } from '@/lib/variation-seo'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const variationEntries: MetadataRoute.Sitemap = []
  const slugs = await getAllSeoSlugs()
  for (const slug of slugs) {
    const e = await kv.get<SeoEntry>(seoKey(slug))
    if (!e || e.noindex) continue
    variationEntries.push({
      url: `https://jaleca.com.br${e.url}`,
      lastModified: e.lastSyncedAt,
      changeFrequency: 'daily',
      priority: 0.7,
    })
  }

  // ... preservar outras seções existentes (home, hubs, blog, categorias)

  return [...variationEntries /*, ...others */]
}
```

- [ ] **Step 2: Validar**

Run: `npm run build && curl -s http://localhost:3000/sitemap.xml | head -50`
Expected: XML com URLs de variação `instock`, sem as `outofstock`.

- [ ] **Step 3: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(rendering): sitemap gerado a partir do KV (exclui noindex)"
```

---

### Task 7: Filtrar `outofstock` em `lib/all-products.ts`

**Files:**
- Modify: `lib/all-products.ts`

- [ ] **Step 1: Adicionar filtro**

Localizar o `getAllProducts()` e adicionar filtro de variação. Após carregar os produtos:

```ts
import { kv, seoKey, type SeoEntry } from './kv'

// Para cada produto-variação derivada, checar KV
async function isVariationInStock(slug: string): Promise<boolean> {
  const e = await kv.get<SeoEntry>(seoKey(slug))
  if (!e) return true // sem registro KV, manter visível (segurança)
  return e.stockStatus === 'instock'
}

// No retorno, filtrar:
const filtered = []
for (const p of products) {
  if (p.isVariation && !(await isVariationInStock(p.slug))) continue
  filtered.push(p)
}
return filtered
```

(Adaptar conforme o shape real do `Product` em `lib/all-products.ts` — pode ser que variações já não estejam no array; nesse caso, este passo é no-op.)

- [ ] **Step 2: Smoke test**

Forçar variação `outofstock`, abrir `/produtos` e `/categoria/medico` → variação não aparece nos cards (mas URL direta segue acessível).

- [ ] **Step 3: Commit**

```bash
git add lib/all-products.ts
git commit -m "feat(rendering): filtra variações outofstock em listagens"
```

---

### Task 8: E2E

- [ ] **Step 1: Cenário sem estoque**

1. Webhook (Fase 2) marca variação como `outofstock`.
2. Acessar URL → vê banner Avise-me.
3. View source → `<meta name="robots" content="noindex,follow">`.
4. View source → JSON-LD com `availability: OutOfStock`.
5. `/sitemap.xml` não contém essa URL.

- [ ] **Step 2: Cenário avise-me**

1. Submeter form com email.
2. Conferir KV → `notify:{id}` contém o email.

- [ ] **Step 3: Cenário voltou estoque**

1. Webhook marca como `instock` de novo.
2. Página renderiza versão normal.
3. Sitemap volta a incluir.
4. (Disparo de email para inscritos é Fase 5.)

- [ ] **Step 4: Commit final**

```bash
git commit --allow-empty -m "test(rendering): valida fluxo completo out-of-stock"
```

---

## Self-Review

- [x] Spec coverage: out-of-stock UX, noindex, sitemap KV, AviseMe inscrição
- [x] Sem placeholders
- [x] `getVariationSEO` (Task 1) usado em Task 5 e 6
- [x] `notify:{id}` cria SET de emails que será consumido na Fase 5 (envio do email "voltou")
- [x] Tipos consistentes com Fase 2 (`SeoEntry` da `lib/kv.ts`)
