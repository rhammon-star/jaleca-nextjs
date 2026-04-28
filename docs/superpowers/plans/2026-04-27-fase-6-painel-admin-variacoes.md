# Fase 6 — Painel `/admin/variacoes` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Painel administrativo para listar todas variações sincronizadas, filtrar por qualidade SEO/estoque, regerar Gemini sob demanda, editar SEO premium à mão, forçar revalidate e submeter ao Google.

**Architecture:** Server Components leem KV diretamente. Server Actions executam ações (regerar Gemini, salvar premium, revalidar). Editor premium é um form simples que persiste no KV.

**Tech Stack:** Next.js 16 App Router (Server Components + Server Actions), Tailwind v3.4.

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seção "Painel `/admin` unificado")

**Pré-requisito:** Fases 1, 2 e 4 prontas (admin layout + KV + Gemini disponíveis).

---

## File Structure

**Criar:**
- `app/admin/variacoes/page.tsx` — listagem com filtros
- `app/admin/variacoes/[slug]/page.tsx` — editor de SEO
- `app/admin/variacoes/actions.ts` — Server Actions
- `app/admin/variacoes/VariacoesTable.tsx` — tabela client (filtros)
- `app/admin/variacoes/SeoEditor.tsx` — form de SEO premium
- `lib/admin-variacoes.ts` — agregador (lista todas variações + stats do dashboard)

**Modificar:**
- `app/admin/page.tsx` (dashboard) — adicionar cards de alerta (variações em template há >24h, sem estoque há >30d)

---

### Task 1: Listagem de variações

**Files:**
- Create: `lib/admin-variacoes.ts`

- [ ] **Step 1: Implementar agregador**

```ts
// lib/admin-variacoes.ts
import { kv, seoKey, type SeoEntry } from './kv'
import { getAllSeoSlugs } from './variation-seo'

export async function listAllVariations(): Promise<SeoEntry[]> {
  const slugs = await getAllSeoSlugs()
  const entries = await Promise.all(slugs.map((s) => kv.get<SeoEntry>(seoKey(s))))
  return entries.filter((e): e is SeoEntry => !!e).sort((a, b) =>
    a.productName.localeCompare(b.productName) || a.colorName.localeCompare(b.colorName),
  )
}

export type VariacoesStats = {
  total: number
  byQuality: { template: number; gemini: number; premium: number }
  outOfStock: number
  outOfStockOver30d: number
  templatePending: number
}

export async function getVariacoesStats(): Promise<VariacoesStats> {
  const all = await listAllVariations()
  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 3600 * 1000
  return {
    total: all.length,
    byQuality: {
      template: all.filter((e) => e.seoQuality === 'template').length,
      gemini: all.filter((e) => e.seoQuality === 'gemini').length,
      premium: all.filter((e) => e.seoQuality === 'premium').length,
    },
    outOfStock: all.filter((e) => e.stockStatus === 'outofstock').length,
    outOfStockOver30d: all.filter(
      (e) => e.stockStatus === 'outofstock' &&
        now - new Date(e.lastSyncedAt).getTime() > THIRTY_DAYS,
    ).length,
    templatePending: all.filter((e) => e.seoQuality === 'template').length,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/admin-variacoes.ts
git commit -m "feat(admin): listAllVariations + stats"
```

---

### Task 2: Server Actions

**Files:**
- Create: `app/admin/variacoes/actions.ts`

- [ ] **Step 1: Implementar**

```ts
// app/admin/variacoes/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
import { notifyAllForUrl } from '@/lib/google-indexing'
import { upsertSeo } from '@/lib/variation-state'

export async function regenerateGemini(variationId: number) {
  await requireAdmin()
  await tryGeminiOrEnqueue(variationId)
  revalidatePath('/admin/variacoes')
}

export async function forceRevalidate(slug: string) {
  await requireAdmin()
  const entry = await kv.get<SeoEntry>(seoKey(slug))
  if (entry) revalidatePath(entry.url)
  revalidatePath('/admin/variacoes')
}

export async function submitToGoogle(slug: string) {
  await requireAdmin()
  const entry = await kv.get<SeoEntry>(seoKey(slug))
  if (entry) await notifyAllForUrl(entry.url, 'URL_UPDATED')
}

export async function savePremium(slug: string, formData: FormData) {
  await requireAdmin()
  const current = await kv.get<SeoEntry>(seoKey(slug))
  if (!current) throw new Error('Entry não encontrada')

  const updated: SeoEntry = {
    ...current,
    h1: String(formData.get('h1') ?? ''),
    h2: String(formData.get('h2') ?? ''),
    title: String(formData.get('title') ?? ''),
    metaDescription: String(formData.get('metaDescription') ?? ''),
    colorPsychology: String(formData.get('colorPsychology') ?? ''),
    seoQuality: 'premium',
    lastSyncedAt: new Date().toISOString(),
  }
  await upsertSeo(updated)
  revalidatePath(updated.url)
  revalidatePath('/admin/variacoes')
}

export async function setNoindex(slug: string, noindex: boolean) {
  await requireAdmin()
  const current = await kv.get<SeoEntry>(seoKey(slug))
  if (!current) return
  await upsertSeo({ ...current, noindex, lastSyncedAt: new Date().toISOString() })
  revalidatePath(current.url)
  revalidatePath('/admin/variacoes')
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/variacoes/actions.ts
git commit -m "feat(admin): server actions de variações (regenerate/save/revalidate)"
```

---

### Task 3: Tabela com filtros

**Files:**
- Create: `app/admin/variacoes/VariacoesTable.tsx`

- [ ] **Step 1: Implementar**

```tsx
// app/admin/variacoes/VariacoesTable.tsx
'use client'
import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import type { SeoEntry } from '@/lib/kv'
import { regenerateGemini, forceRevalidate, submitToGoogle } from './actions'

const QUALITY_BADGE: Record<string, string> = {
  template: 'bg-yellow-100 text-yellow-800',
  gemini: 'bg-blue-100 text-blue-800',
  premium: 'bg-green-100 text-green-800',
}

export default function VariacoesTable({ entries }: { entries: SeoEntry[] }) {
  const [filterQuality, setFilterQuality] = useState<string>('all')
  const [filterStock, setFilterStock] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterQuality !== 'all' && e.seoQuality !== filterQuality) return false
      if (filterStock !== 'all' && e.stockStatus !== filterStock) return false
      if (search && !`${e.productName} ${e.colorName}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [entries, filterQuality, filterStock, search])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Buscar produto ou cor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-64"
        />
        <select value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)} className="border rounded px-3 py-2">
          <option value="all">Todas qualidades</option>
          <option value="template">Template</option>
          <option value="gemini">Gemini</option>
          <option value="premium">Premium</option>
        </select>
        <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="border rounded px-3 py-2">
          <option value="all">Todos estoques</option>
          <option value="instock">Em estoque</option>
          <option value="outofstock">Sem estoque</option>
        </select>
      </div>

      <p className="text-sm text-stone-600 mb-2">{filtered.length} de {entries.length}</p>

      <table className="w-full text-sm border">
        <thead className="bg-stone-50">
          <tr>
            <th className="text-left p-2">Produto / Cor</th>
            <th className="text-left p-2">SEO</th>
            <th className="text-left p-2">Estoque</th>
            <th className="text-left p-2">Indexada</th>
            <th className="text-left p-2">Última sync</th>
            <th className="text-left p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e.url} className="border-t">
              <td className="p-2">
                <Link href={`/admin/variacoes/${e.url.replace(/^\//, '')}`} className="font-semibold hover:underline">
                  {e.productName} — {e.colorName}
                </Link>
                <div className="text-xs text-stone-500">{e.url}</div>
              </td>
              <td className="p-2">
                <span className={`px-2 py-0.5 rounded text-xs ${QUALITY_BADGE[e.seoQuality]}`}>
                  {e.seoQuality}
                </span>
              </td>
              <td className="p-2">{e.stockStatus === 'instock' ? '✅' : '❌'}</td>
              <td className="p-2">{e.noindex ? '❌' : '✅'}</td>
              <td className="p-2 text-xs">{new Date(e.lastSyncedAt).toLocaleString('pt-BR')}</td>
              <td className="p-2 flex gap-1 flex-wrap">
                <button
                  disabled={pending || e.seoQuality === 'premium'}
                  onClick={() => startTransition(() => regenerateGemini(e.variationId))}
                  className="text-xs bg-blue-100 px-2 py-1 rounded disabled:opacity-50"
                  title={e.seoQuality === 'premium' ? 'Premium não é sobrescrito' : 'Roda Gemini de novo'}
                >
                  Regerar
                </button>
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => forceRevalidate(e.url.replace(/^\//, '')))}
                  className="text-xs bg-stone-100 px-2 py-1 rounded disabled:opacity-50"
                >
                  Revalidar
                </button>
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => submitToGoogle(e.url.replace(/^\//, '')))}
                  className="text-xs bg-stone-100 px-2 py-1 rounded disabled:opacity-50"
                >
                  Submeter Google
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/variacoes/VariacoesTable.tsx
git commit -m "feat(admin): tabela de variações com filtros e ações"
```

---

### Task 4: Página `/admin/variacoes`

**Files:**
- Create: `app/admin/variacoes/page.tsx`

- [ ] **Step 1: Implementar**

```tsx
// app/admin/variacoes/page.tsx
import { listAllVariations, getVariacoesStats } from '@/lib/admin-variacoes'
import VariacoesTable from './VariacoesTable'

export const dynamic = 'force-dynamic'

export default async function VariacoesPage() {
  const [entries, stats] = await Promise.all([listAllVariations(), getVariacoesStats()])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Variações</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Total" value={stats.total} />
        <Card label="Premium" value={stats.byQuality.premium} color="green" />
        <Card label="Gemini" value={stats.byQuality.gemini} color="blue" />
        <Card label="Template" value={stats.byQuality.template} color="yellow" />
        <Card label="Sem estoque" value={stats.outOfStock} color="red" />
        <Card label="Sem estoque +30d" value={stats.outOfStockOver30d} color="red" />
      </div>

      <VariacoesTable entries={entries} />
    </div>
  )
}

function Card({ label, value, color }: { label: string; value: number; color?: string }) {
  const bg = color === 'green' ? 'bg-green-50' :
             color === 'blue' ? 'bg-blue-50' :
             color === 'yellow' ? 'bg-yellow-50' :
             color === 'red' ? 'bg-red-50' : 'bg-stone-50'
  return (
    <div className={`${bg} border rounded p-4`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-stone-600">{label}</div>
    </div>
  )
}
```

- [ ] **Step 2: Smoke test**

Run: `npm run dev`. Acessar `/admin/variacoes` (logado como admin). Esperado: tabela com 34+ entradas, cards com contagem.

- [ ] **Step 3: Commit**

```bash
git add app/admin/variacoes/page.tsx
git commit -m "feat(admin): página /admin/variacoes com stats"
```

---

### Task 5: Editor de SEO premium

**Files:**
- Create: `app/admin/variacoes/SeoEditor.tsx`
- Create: `app/admin/variacoes/[slug]/page.tsx`

- [ ] **Step 1: Editor (Server Action via form)**

```tsx
// app/admin/variacoes/SeoEditor.tsx
import type { SeoEntry } from '@/lib/kv'
import { savePremium, setNoindex } from './actions'

export default function SeoEditor({ entry }: { entry: SeoEntry }) {
  const slug = entry.url.replace(/^\//, '')
  return (
    <form action={savePremium.bind(null, slug)} className="space-y-4 max-w-2xl">
      <Field name="h1" label="H1" defaultValue={entry.h1 ?? ''} />
      <Field name="h2" label="H2" defaultValue={entry.h2 ?? ''} />
      <Field name="title" label="Meta Title" defaultValue={entry.title ?? ''} />
      <TextArea name="metaDescription" label="Meta Description" defaultValue={entry.metaDescription ?? ''} />
      <TextArea name="colorPsychology" label="Color Psychology" defaultValue={entry.colorPsychology ?? ''} />
      <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded">
        Salvar como Premium
      </button>
      <span className="ml-3 text-sm text-stone-600">
        (Salvar marca seoQuality=premium e impede Gemini de sobrescrever)
      </span>
    </form>
  )
}

function Field({ name, label, defaultValue }: any) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={defaultValue} className="mt-1 w-full border rounded px-3 py-2" />
    </label>
  )
}

function TextArea({ name, label, defaultValue }: any) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={3} className="mt-1 w-full border rounded px-3 py-2" />
    </label>
  )
}
```

- [ ] **Step 2: Página detalhe**

```tsx
// app/admin/variacoes/[slug]/page.tsx
import { kv, seoKey } from '@/lib/kv'
import { notFound } from 'next/navigation'
import SeoEditor from '../SeoEditor'
import { setNoindex } from '../actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VariacaoDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = await kv.get(seoKey(slug)) as any
  if (!entry) notFound()

  return (
    <div>
      <Link href="/admin/variacoes" className="text-sm text-blue-700">← Voltar</Link>
      <h1 className="text-2xl font-bold mt-2 mb-2">{entry.productName} — {entry.colorName}</h1>
      <p className="text-stone-600 mb-6">
        URL: <code>{entry.url}</code> · Estoque: {entry.stockStatus} · SEO: {entry.seoQuality}
      </p>

      <div className="mb-6">
        <form action={setNoindex.bind(null, slug, !entry.noindex)}>
          <button className="text-sm bg-stone-100 px-3 py-1 rounded">
            {entry.noindex ? 'Tirar noindex' : 'Marcar como noindex'}
          </button>
        </form>
      </div>

      <SeoEditor entry={entry} />
    </div>
  )
}
```

- [ ] **Step 3: Smoke test**

Acessar `/admin/variacoes/jaleco-medico-azul-marinho` → editar H1, salvar → KV reflete + página de produto atualiza.

- [ ] **Step 4: Commit**

```bash
git add app/admin/variacoes/SeoEditor.tsx 'app/admin/variacoes/[slug]/page.tsx'
git commit -m "feat(admin): editor de SEO premium por variação"
```

---

### Task 6: Cards de alerta no dashboard

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Adicionar alertas**

```tsx
// app/admin/page.tsx
import Link from 'next/link'
import { getVariacoesStats } from '@/lib/admin-variacoes'

export default async function AdminDashboard() {
  const stats = await getVariacoesStats()
  const alerts = []
  if (stats.templatePending > 0) {
    alerts.push({ msg: `${stats.templatePending} variação(ões) com SEO template pendente`, href: '/admin/variacoes?quality=template' })
  }
  if (stats.outOfStockOver30d > 0) {
    alerts.push({ msg: `${stats.outOfStockOver30d} variação(ões) sem estoque há mais de 30 dias`, href: '/admin/variacoes?stock=outofstock' })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((a, i) => (
            <Link key={i} href={a.href} className="block bg-yellow-50 border-yellow-300 border rounded p-3 hover:bg-yellow-100">
              ⚠️ {a.msg}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/blog/posts" className="block border rounded p-4 hover:shadow">
          <h2 className="font-semibold mb-1">Blog</h2>
          <p className="text-sm text-stone-600">Posts e novo post</p>
        </Link>
        <Link href="/admin/variacoes" className="block border rounded p-4 hover:shadow">
          <h2 className="font-semibold mb-1">Variações</h2>
          <p className="text-sm text-stone-600">{stats.total} sincronizadas</p>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat(admin): dashboard exibe alertas de SEO template + estoque parado"
```

---

### Task 7: E2E

- [ ] **Step 1: Cenário regenerate**

1. Acessar `/admin/variacoes`, filtrar por `template`.
2. Clicar "Regerar" em uma linha.
3. Aguardar revalidação automática (~2s).
4. Linha agora mostra `gemini` e novo `lastSyncedAt`.

- [ ] **Step 2: Cenário promote to premium**

1. Clicar nome de uma variação `gemini`.
2. Editar H1, H2, salvar.
3. Voltar à listagem → linha agora `premium`.
4. Acessar a página pública → metadata reflete novo H1.

- [ ] **Step 3: Cenário noindex toggle**

1. No detalhe, clicar "Marcar como noindex".
2. Recarregar página pública → `<meta robots="noindex,follow">`.
3. Sitemap não inclui mais.

- [ ] **Step 4: Cenário submit Google**

1. Clicar "Submeter Google" em uma linha.
2. Vercel logs mostram chamada bem-sucedida ao Indexing API.

- [ ] **Step 5: Commit final**

```bash
git commit --allow-empty -m "test(admin): valida regenerate/promote/noindex/submit"
```

---

## Self-Review

- [x] Spec coverage: tabela com filtros, ações (regenerate/save/revalidate/submit), editor premium, alertas
- [x] Server Actions usam `requireAdmin()` (Fase 1) — guardadas
- [x] `tryGeminiOrEnqueue` (Fase 4) chamado em `regenerateGemini`
- [x] `notifyAllForUrl` (Fase 5) chamado em `submitToGoogle`
- [x] Premium não é sobrescrito (botão "Regerar" desabilitado para premium)
- [x] Sem placeholders
