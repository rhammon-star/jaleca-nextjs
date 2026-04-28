# Fase 1 — Admin Unificado (`/admin`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mover `/blog/admin/*` para `/admin/blog/*` e criar layout/sidebar unificada que servirá de casa para todos os módulos admin futuros (variações, pedidos, produtos, SEO).

**Architecture:** Reaproveita auth existente (`auth.ts` + JWT). Cria `app/admin/layout.tsx` com sidebar e auth guard único. Move arquivos do blog preservando histórico. Adiciona redirect 301 para preservar bookmarks.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v3.4, JWT existente.

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seção "Painel `/admin` unificado" + "Migração `/blog/admin` → `/admin/blog`")

---

## File Structure

**Criar:**
- `app/admin/layout.tsx` — sidebar + header + auth guard (whitelist via `ADMIN_EMAILS`)
- `app/admin/page.tsx` — dashboard inicial (cards: posts, variações, alertas)
- `app/admin/AdminSidebar.tsx` — componente de navegação client
- `lib/admin-auth.ts` — `requireAdmin()` lê JWT e checa whitelist
- `tests/admin/admin-auth.test.ts` — Vitest para `requireAdmin()`

**Mover (git mv):**
- `app/blog/admin/posts/` → `app/admin/blog/posts/`
- `app/blog/admin/novo-post/` → `app/admin/blog/novo-post/`
- `app/blog/admin/usuarios/` → `app/admin/blog/usuarios/`
- `app/blog/admin/dashboard/` → `app/admin/blog/dashboard/`
- `app/blog/admin/LogoutButton.tsx` → `app/admin/LogoutButton.tsx`

**Modificar:**
- `next.config.ts` — adicionar redirect 301 `/blog/admin/:path*` → `/admin/blog/:path*`
- `app/blog/admin/layout.tsx` — DELETAR (substituído pelo `/admin/layout.tsx`)
- Todos os `<Link href="/blog/admin/...">` no código (grep-replace)

---

### Task 1: Criar `lib/admin-auth.ts` com whitelist

**Files:**
- Create: `lib/admin-auth.ts`
- Test: `tests/admin-auth.test.ts`

- [ ] **Step 1: Criar teste falhando**

```ts
// tests/admin-auth.test.ts
import { describe, it, expect, vi } from 'vitest'
import { isAdminEmail } from '@/lib/admin-auth'

describe('isAdminEmail', () => {
  it('retorna true para emails na whitelist', () => {
    process.env.ADMIN_EMAILS = 'a@x.com,b@y.com'
    expect(isAdminEmail('a@x.com')).toBe(true)
    expect(isAdminEmail('b@y.com')).toBe(true)
  })
  it('é case-insensitive e ignora espaços', () => {
    process.env.ADMIN_EMAILS = ' A@X.com , b@y.com '
    expect(isAdminEmail('a@x.com')).toBe(true)
  })
  it('retorna false fora da whitelist', () => {
    process.env.ADMIN_EMAILS = 'a@x.com'
    expect(isAdminEmail('z@z.com')).toBe(false)
  })
  it('retorna false se whitelist vazia', () => {
    process.env.ADMIN_EMAILS = ''
    expect(isAdminEmail('a@x.com')).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar teste e ver falhar**

Run: `npx vitest run tests/admin-auth.test.ts`
Expected: FAIL — `isAdminEmail is not a function`.

- [ ] **Step 3: Implementar `lib/admin-auth.ts`**

```ts
// lib/admin-auth.ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyCustomerToken } from '@/auth'

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(email.trim().toLowerCase())
}

export async function requireAdmin(): Promise<{ email: string; userId: number }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('jaleca_token')?.value
  if (!token) redirect('/login?from=/admin')
  const claims = await verifyCustomerToken(token)
  if (!claims?.email || !isAdminEmail(claims.email)) {
    redirect('/login?from=/admin&forbidden=1')
  }
  return { email: claims.email, userId: claims.userId }
}
```

- [ ] **Step 4: Rodar teste e ver passar**

Run: `npx vitest run tests/admin-auth.test.ts`
Expected: PASS — 4 testes ok.

- [ ] **Step 5: Commit**

```bash
git add lib/admin-auth.ts tests/admin-auth.test.ts
git commit -m "feat(admin): adiciona requireAdmin() com whitelist ADMIN_EMAILS"
```

---

### Task 2: Criar `app/admin/AdminSidebar.tsx`

**Files:**
- Create: `app/admin/AdminSidebar.tsx`

- [ ] **Step 1: Implementar sidebar**

```tsx
// app/admin/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/blog/posts', label: 'Posts do Blog', icon: '📝' },
  { href: '/admin/blog/novo-post', label: 'Novo Post', icon: '✏️' },
  { href: '/admin/blog/usuarios', label: 'Usuários', icon: '👥' },
  { href: '/admin/variacoes', label: 'Variações', icon: '🎨' },
]

export default function AdminSidebar() {
  const path = usePathname()
  return (
    <nav className="w-64 bg-stone-50 border-r min-h-screen p-4">
      <h1 className="font-bold text-lg mb-6">Admin Jaleca</h1>
      <ul className="space-y-1">
        {ITEMS.map((it) => {
          const active = path === it.href || (it.href !== '/admin' && path.startsWith(it.href))
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  active ? 'bg-stone-200 font-semibold' : 'hover:bg-stone-100'
                }`}
              >
                <span>{it.icon}</span> {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/AdminSidebar.tsx
git commit -m "feat(admin): cria AdminSidebar com navegação unificada"
```

---

### Task 3: Criar `app/admin/layout.tsx`

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Implementar layout com auth guard**

```tsx
// app/admin/layout.tsx
import AdminSidebar from './AdminSidebar'
import LogoutButton from './LogoutButton'
import { requireAdmin } from '@/lib/admin-auth'

export const metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin()
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1">
        <header className="border-b px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-stone-600">Logado como <strong>{email}</strong></span>
          <LogoutButton />
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat(admin): adiciona layout com auth guard via requireAdmin"
```

---

### Task 4: Mover `LogoutButton` e arquivos do blog admin

**Files:**
- Move: `app/blog/admin/LogoutButton.tsx` → `app/admin/LogoutButton.tsx`
- Move: `app/blog/admin/dashboard/` → `app/admin/blog/dashboard/`
- Move: `app/blog/admin/posts/` → `app/admin/blog/posts/`
- Move: `app/blog/admin/novo-post/` → `app/admin/blog/novo-post/`
- Move: `app/blog/admin/usuarios/` → `app/admin/blog/usuarios/`
- Delete: `app/blog/admin/layout.tsx` e `app/blog/admin/page.tsx`

- [ ] **Step 1: Mover arquivos preservando histórico**

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs
mkdir -p app/admin/blog
git mv app/blog/admin/LogoutButton.tsx app/admin/LogoutButton.tsx
git mv app/blog/admin/dashboard app/admin/blog/dashboard
git mv app/blog/admin/posts app/admin/blog/posts
git mv app/blog/admin/novo-post app/admin/blog/novo-post
git mv app/blog/admin/usuarios app/admin/blog/usuarios
git rm app/blog/admin/layout.tsx app/blog/admin/page.tsx 2>/dev/null || true
rmdir app/blog/admin 2>/dev/null || true
```

- [ ] **Step 2: Corrigir imports em todos os arquivos movidos**

Run grep para encontrar imports quebrados:
```bash
grep -rn "from '@/app/blog/admin/" app/admin/ || true
grep -rn "from '../LogoutButton'" app/admin/blog/ || true
```

Para cada match, atualizar o caminho. `LogoutButton` no admin/blog passa a ser `from '../../LogoutButton'` (subiu 2 níveis até `app/admin/`).

- [ ] **Step 3: Build local pra validar**

Run: `npm run build`
Expected: build sucesso, sem erros de import.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(admin): move blog/admin para admin/blog (preserva histórico)"
```

---

### Task 5: Atualizar links internos `/blog/admin/*` → `/admin/blog/*`

**Files:**
- Modify: todos os arquivos `.tsx` que referenciam `/blog/admin/*`

- [ ] **Step 1: Encontrar todas as ocorrências**

```bash
grep -rn '"/blog/admin' app/ components/ lib/ --include='*.tsx' --include='*.ts' || true
```

- [ ] **Step 2: Substituir cada uma**

Para cada arquivo encontrado, fazer Edit substituindo `"/blog/admin` por `"/admin/blog` (cuidado com `<Link href="/blog/admin/posts">` virar `<Link href="/admin/blog/posts">`). Verificar manualmente — alguns podem ser strings em texto, não rotas.

- [ ] **Step 3: Build local**

Run: `npm run build`
Expected: sem warnings de link quebrado.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(admin): atualiza referências internas para /admin/blog"
```

---

### Task 6: Adicionar redirect 301 em `next.config.ts`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Adicionar redirect**

Localizar o array `redirects` em `next.config.ts` e adicionar (antes do `// WordPress password reset`):

```ts
{ source: '/blog/admin', destination: '/admin', permanent: true },
{ source: '/blog/admin/:path*', destination: '/admin/blog/:path*', permanent: true },
```

- [ ] **Step 2: Build local**

Run: `npm run build`
Expected: sucesso.

- [ ] **Step 3: Smoke test em dev**

Run: `npm run dev` em outra aba.
Abrir `http://localhost:3000/blog/admin/posts` → deve redirecionar para `/admin/blog/posts`.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat(admin): adiciona redirect 301 /blog/admin/* → /admin/blog/*"
```

---

### Task 7: Criar `app/admin/page.tsx` (dashboard)

**Files:**
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Implementar dashboard inicial**

```tsx
// app/admin/page.tsx
import Link from 'next/link'

export default function AdminDashboard() {
  const cards = [
    { href: '/admin/blog/posts', title: 'Blog', desc: 'Gerenciar posts e novo post' },
    { href: '/admin/blog/usuarios', title: 'Usuários', desc: 'Cadastros e clientes' },
    { href: '/admin/variacoes', title: 'Variações', desc: 'Sync WC + SEO automático' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="block border rounded p-4 hover:shadow">
            <h2 className="font-semibold mb-1">{c.title}</h2>
            <p className="text-sm text-stone-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat(admin): adiciona dashboard inicial"
```

---

### Task 8: Configurar `ADMIN_EMAILS` e smoke test E2E

- [ ] **Step 1: Adicionar variável de ambiente**

No Vercel Dashboard → Settings → Environment Variables, adicionar:
- Nome: `ADMIN_EMAILS`
- Valor: `rhammon.liberate@gmail.com,ana@jaleca.com.br` (ajustar conforme necessário)
- Aplicar em: Production, Preview, Development

Localmente, adicionar em `.env.local`:
```
ADMIN_EMAILS=rhammon.liberate@gmail.com
```

- [ ] **Step 2: Smoke test local**

Run: `npm run dev`
1. Abrir `http://localhost:3000/admin` deslogado → deve redirecionar para `/login?from=/admin`
2. Logar com email NÃO-admin → deve voltar para `/login?from=/admin&forbidden=1`
3. Logar com email da whitelist → deve mostrar dashboard com sidebar
4. Clicar em "Posts do Blog" → deve abrir `/admin/blog/posts` funcional
5. Acessar `/blog/admin/posts` → deve redirecionar 301 para `/admin/blog/posts`

- [ ] **Step 3: Deploy preview e validar em produção**

```bash
git push origin HEAD
```

Aguardar deploy preview. Validar em `<preview-url>/admin` o mesmo fluxo do step 2.

- [ ] **Step 4: Documentar no AGENTS.md**

Adicionar bloco em `AGENTS.md`:

```markdown
## Admin Unificado (`/admin`)
- Layout único: `app/admin/layout.tsx` (auth via `requireAdmin()`)
- Whitelist: env `ADMIN_EMAILS` (CSV)
- Sidebar: `app/admin/AdminSidebar.tsx`
- Rotas legadas `/blog/admin/*` redirecionam 301 para `/admin/blog/*`
```

```bash
git add AGENTS.md
git commit -m "docs(admin): documenta nova estrutura /admin"
```

---

## Self-Review Checklist

- [x] Todas as seções do spec sobre `/admin` cobertas (layout, auth, migração, redirects)
- [x] Sem placeholders
- [x] Cada task tem código completo
- [x] `requireAdmin` usado no layout (Task 3) é o que foi definido em Task 1
- [x] Redirect inclui rota raiz `/blog/admin` → `/admin` (não só `/blog/admin/:path*`)
