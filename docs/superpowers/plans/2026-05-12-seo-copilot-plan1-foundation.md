# SEO Copilot — Plan 1: Foundation (Novo Projeto + DB + Layout)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o repositório `jaleca-seo-copilot` do zero no GitHub, configurar MySQL Hostinger, DataForSEO client, auth e o layout base (sidebar dark, 8 seções) rodando no Hostinger Node.js.

**Architecture:** Next.js 15 App Router + TypeScript, hospedado no Hostinger Node.js via GitHub deploy. MySQL Hostinger como banco (driver `mysql2` com pool). DataForSEO client copiado e adaptado do jaleca-nextjs. Auth por env var secret em middleware.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, mysql2, Recharts, DataForSEO REST API (Basic Auth), Hostinger Node.js hosting.

**Pré-requisito:** Antes de começar, você precisa das credenciais MySQL do Hostinger:
- `DB_HOST` (geralmente `localhost` no Hostinger)
- `DB_NAME` = `jaleca_seo_copilot`
- `DB_USER`
- `DB_PASSWORD`
- `SEO_COPILOT_SECRET` (string aleatória para auth do painel)

---

## Planos subsequentes (após este)

- **Plan 2:** Rank Tracking UI + DB persistence (gráficos de posição × tempo)
- **Plan 3:** Competitive Intelligence + Keyword Gap (novos libs + tabelas)
- **Plan 4:** Keyword Research + SERP Intelligence + Google Shopping
- **Plan 5:** Site Audit + Keyword Cannibalization detection
- **Plan 6:** AI Insights (Claude streaming) + Content Engine

---

## File Map

```
jaleca-seo-copilot/
├── app/
│   ├── layout.tsx                    # Root layout (fontes, providers)
│   ├── (copilot)/
│   │   ├── layout.tsx                # Sidebar + auth guard
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── rank-tracking/page.tsx    # Placeholder
│   │   ├── competitors/page.tsx      # Placeholder
│   │   ├── keyword-gap/page.tsx      # Placeholder
│   │   ├── keywords/page.tsx         # Placeholder
│   │   ├── backlinks/page.tsx        # Placeholder
│   │   ├── site-audit/page.tsx       # Placeholder
│   │   └── ai-insights/page.tsx      # Placeholder
│   ├── login/page.tsx                # Login com secret
│   └── api/
│       └── auth/route.ts             # POST /api/auth — valida secret, seta cookie
├── lib/
│   ├── db.ts                         # Pool mysql2 + query helper
│   ├── db-schema.ts                  # SQL CREATE TABLE statements
│   ├── dataforseo/
│   │   └── client.ts                 # HTTP client DataForSEO (Basic Auth)
│   └── auth.ts                       # Verifica cookie de sessão
├── middleware.ts                      # Protege rotas (copilot) com cookie
├── components/
│   ├── Sidebar.tsx                   # Nav lateral com 8 seções
│   ├── MetricCard.tsx                # Card de métrica (número + label + trend)
│   └── PageHeader.tsx                # Header de página com título
├── .env.local                        # Credenciais (não commitar)
├── .env.example                      # Template público
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Task 1: Criar projeto Next.js e repositório GitHub

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

- [ ] **Step 1: Criar o projeto Next.js**

```bash
npx create-next-app@latest jaleca-seo-copilot \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-git
cd jaleca-seo-copilot
```

- [ ] **Step 2: Instalar dependências**

```bash
npm install mysql2 recharts
npm install -D @types/node
```

- [ ] **Step 3: Criar .env.example**

```bash
cat > .env.example << 'EOF'
# MySQL Hostinger
DB_HOST=localhost
DB_NAME=jaleca_seo_copilot
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# DataForSEO
DATAFORSEO_LOGIN=seu_login
DATAFORSEO_PASSWORD=sua_senha

# Auth do painel
SEO_COPILOT_SECRET=string_aleatoria_segura
EOF
```

- [ ] **Step 4: Criar .env.local com credenciais reais**

```bash
cp .env.example .env.local
# Edite .env.local com os valores reais do Hostinger e DataForSEO
```

- [ ] **Step 5: Criar .gitignore correto**

```bash
cat >> .gitignore << 'EOF'
.env.local
.env.*.local
EOF
```

- [ ] **Step 6: Criar repo no GitHub e fazer primeiro commit**

```bash
git init
git add .
git commit -m "chore: init Next.js 15 + TypeScript + Tailwind"
# Crie o repo no GitHub: github.com/new → jaleca-seo-copilot
git remote add origin https://github.com/SEU_USUARIO/jaleca-seo-copilot.git
git push -u origin main
```

---

## Task 2: Database — Pool MySQL + Schema

**Files:**
- Create: `lib/db.ts`
- Create: `lib/db-schema.ts`

- [ ] **Step 1: Criar pool de conexão MySQL**

Crie `lib/db.ts`:

```typescript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

export async function queryOne<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

export default pool
```

- [ ] **Step 2: Criar schema SQL**

Crie `lib/db-schema.ts`:

```typescript
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS rankings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  position SMALLINT,
  url VARCHAR(500),
  title VARCHAR(500),
  device VARCHAR(20) DEFAULT 'desktop',
  recorded_at DATETIME NOT NULL,
  INDEX idx_keyword_date (keyword, recorded_at)
);

CREATE TABLE IF NOT EXISTS competitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  overlap_pct FLOAT,
  shared_keywords INT,
  traffic_estimate INT,
  authority_score SMALLINT,
  recorded_at DATETIME NOT NULL,
  INDEX idx_domain (domain),
  INDEX idx_date (recorded_at)
);

CREATE TABLE IF NOT EXISTS keyword_gap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  volume INT,
  kd SMALLINT,
  cpc FLOAT,
  intent VARCHAR(50),
  competitor_domains JSON,
  opportunity_score FLOAT,
  recorded_at DATETIME NOT NULL,
  INDEX idx_score (opportunity_score DESC),
  INDEX idx_date (recorded_at)
);

CREATE TABLE IF NOT EXISTS audit_issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(500),
  issue_type VARCHAR(100),
  severity ENUM('critical','warning','info') NOT NULL,
  description TEXT,
  audit_date DATETIME NOT NULL,
  INDEX idx_severity (severity),
  INDEX idx_date (audit_date)
);

CREATE TABLE IF NOT EXISTS backlink_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backlinks INT,
  referring_domains INT,
  spam_score FLOAT,
  new_backlinks INT DEFAULT 0,
  lost_backlinks INT DEFAULT 0,
  recorded_at DATETIME NOT NULL,
  INDEX idx_date (recorded_at)
);

CREATE TABLE IF NOT EXISTS serp_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  feature_type VARCHAR(100) NOT NULL,
  is_jaleca BOOLEAN DEFAULT FALSE,
  recorded_at DATETIME NOT NULL,
  INDEX idx_keyword (keyword),
  INDEX idx_date (recorded_at)
);

CREATE TABLE IF NOT EXISTS keyword_research_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seed_keyword VARCHAR(255) NOT NULL UNIQUE,
  results JSON NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  INDEX idx_seed (seed_keyword),
  INDEX idx_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS cannibalization (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  urls JSON NOT NULL,
  detected_at DATETIME NOT NULL,
  INDEX idx_keyword (keyword)
);
`
```

- [ ] **Step 3: Criar script de migration**

Crie `scripts/migrate.ts`:

```typescript
import { SCHEMA_SQL } from '../lib/db-schema'
import pool from '../lib/db'

async function migrate() {
  const statements = SCHEMA_SQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const sql of statements) {
    await pool.execute(sql)
    console.log('✓', sql.slice(0, 60) + '...')
  }

  console.log('Migration completa.')
  await pool.end()
}

migrate().catch(console.error)
```

- [ ] **Step 4: Adicionar script no package.json**

Em `package.json`, adicione na seção `scripts`:

```json
"migrate": "npx tsx scripts/migrate.ts"
```

- [ ] **Step 5: Rodar a migration**

```bash
npm run migrate
```

Esperado: 8 linhas "✓ CREATE TABLE IF NOT EXISTS..." + "Migration completa."

- [ ] **Step 6: Commit**

```bash
git add lib/db.ts lib/db-schema.ts scripts/migrate.ts package.json
git commit -m "feat(db): MySQL pool + schema 8 tabelas"
```

---

## Task 3: DataForSEO Client

**Files:**
- Create: `lib/dataforseo/client.ts`

- [ ] **Step 1: Criar cliente HTTP DataForSEO**

Crie `lib/dataforseo/client.ts`:

```typescript
const BASE_URL = 'https://api.dataforseo.com/v3'

export interface DataForSeoResponse<T = unknown> {
  status_code: number
  status_message: string
  tasks: Array<{
    id: string
    status_code: number
    status_message: string
    result: T[]
  }>
}

export async function dfsRequest<T = unknown>(
  endpoint: string,
  payload: object[]
): Promise<DataForSeoResponse<T>> {
  const login = process.env.DATAFORSEO_LOGIN
  const password = process.env.DATAFORSEO_PASSWORD

  if (!login || !password) {
    throw new Error('DATAFORSEO_LOGIN e DATAFORSEO_PASSWORD não configurados')
  }

  const credentials = Buffer.from(`${login}:${password}`).toString('base64')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`DataForSEO HTTP ${response.status}: ${await response.text()}`)
  }

  const data: DataForSeoResponse<T> = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error ${data.status_code}: ${data.status_message}`)
  }

  return data
}

// Helper para extrair items do primeiro resultado
export function extractItems<T>(data: DataForSeoResponse<unknown>): T[] {
  return (data.tasks?.[0]?.result?.[0] as { items?: T[] })?.items ?? []
}

// Helper para extrair o primeiro resultado
export function extractResult<T>(data: DataForSeoResponse<T>): T | null {
  return data.tasks?.[0]?.result?.[0] ?? null
}
```

- [ ] **Step 2: Testar conexão com DataForSEO**

Crie `scripts/test-dfs.ts`:

```typescript
import { dfsRequest } from '../lib/dataforseo/client'

async function test() {
  const data = await dfsRequest('/keywords_data/google/search_volume/live', [
    { keywords: ['jaleco feminino'], location_code: 1001767, language_code: 'pt' }
  ])
  console.log('DataForSEO OK:', JSON.stringify(data.tasks?.[0]?.result, null, 2))
}

test().catch(console.error)
```

```bash
npx tsx scripts/test-dfs.ts
```

Esperado: JSON com `search_volume` para "jaleco feminino".

- [ ] **Step 3: Commit**

```bash
git add lib/dataforseo/client.ts scripts/test-dfs.ts
git commit -m "feat(dataforseo): client HTTP com Basic Auth + helpers"
```

---

## Task 4: Auth — Login por Secret

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/route.ts`
- Create: `app/login/page.tsx`
- Create: `middleware.ts`

- [ ] **Step 1: Criar helper de auth**

Crie `lib/auth.ts`:

```typescript
import { cookies } from 'next/headers'

const COOKIE_NAME = 'seo_copilot_session'
const SECRET = process.env.SEO_COPILOT_SECRET!

export function isValidSecret(input: string): boolean {
  return input === SECRET
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value === SECRET
}

export function setSessionCookie(response: Response): void {
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${SECRET}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
  )
}
```

- [ ] **Step 2: Criar API route de login**

Crie `app/api/auth/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { isValidSecret } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (!isValidSecret(secret)) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('seo_copilot_session', process.env.SEO_COPILOT_SECRET!, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })
  return res
}
```

- [ ] **Step 3: Criar página de login**

Crie `app/login/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      setError('Senha incorreta')
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1923] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-[#1A2535] p-8 rounded-xl w-80 space-y-4">
        <h1 className="text-white text-2xl font-bold text-center">SEO Copilot</h1>
        <p className="text-gray-400 text-sm text-center">jaleca.com.br</p>
        <input
          type="password"
          placeholder="Senha de acesso"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          className="w-full bg-[#0F1923] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Criar middleware de proteção**

Crie `middleware.ts` na raiz:

```typescript
import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.SEO_COPILOT_SECRET!
const PUBLIC_PATHS = ['/login', '/api/auth']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const session = req.cookies.get('seo_copilot_session')?.value
  if (session !== SECRET) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts app/api/auth/route.ts app/login/page.tsx middleware.ts
git commit -m "feat(auth): login por secret + middleware de proteção"
```

---

## Task 5: Layout Base — Sidebar Dark + 8 Seções

**Files:**
- Create: `components/Sidebar.tsx`
- Create: `components/MetricCard.tsx`
- Create: `components/PageHeader.tsx`
- Modify: `app/layout.tsx`
- Create: `app/(copilot)/layout.tsx`

- [ ] **Step 1: Criar componente Sidebar**

Crie `components/Sidebar.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/rank-tracking', label: 'Rank Tracking', icon: '📈' },
  { href: '/competitors', label: 'Concorrentes', icon: '🏆' },
  { href: '/keyword-gap', label: 'Keyword Gap', icon: '🔍' },
  { href: '/keywords', label: 'Keyword Magic', icon: '✨' },
  { href: '/backlinks', label: 'Backlinks', icon: '🔗' },
  { href: '/site-audit', label: 'Site Audit', icon: '🛠️' },
  { href: '/ai-insights', label: 'AI Insights', icon: '🤖' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-[#1A2535] min-h-screen flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <p className="text-orange-500 font-bold text-lg">SEO Copilot</p>
        <p className="text-gray-500 text-xs">jaleca.com.br</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-orange-500/10 text-orange-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 2: Criar MetricCard**

Crie `components/MetricCard.tsx`:

```tsx
interface MetricCardProps {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  sub?: string
}

export default function MetricCard({ label, value, trend, trendUp, sub }: MetricCardProps) {
  return (
    <div className="bg-[#1A2535] border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {trend && (
        <p className={`text-xs mt-1 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trendUp ? '▲' : '▼'} {trend}
        </p>
      )}
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Criar PageHeader**

Crie `components/PageHeader.tsx`:

```tsx
interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-white text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
```

- [ ] **Step 4: Atualizar root layout**

Substitua o conteúdo de `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEO Copilot — jaleca.com.br',
  description: 'Painel SEO interno jaleca',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#0F1923] text-white`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Criar layout do grupo (copilot)**

Crie `app/(copilot)/layout.tsx`:

```tsx
import Sidebar from '@/components/Sidebar'

export default function CopilotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 6: Renomear pages para o grupo (copilot)**

Mova `app/page.tsx` para `app/(copilot)/page.tsx` e substitua o conteúdo:

```tsx
import MetricCard from '@/components/MetricCard'
import PageHeader from '@/components/PageHeader'

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="jaleca.com.br — visão geral SEO"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Organic Keywords" value="—" sub="carregando..." />
        <MetricCard label="Backlinks" value="—" sub="carregando..." />
        <MetricCard label="Ref. Domains" value="—" sub="carregando..." />
        <MetricCard label="Posição Média" value="—" sub="carregando..." />
      </div>
      <p className="text-gray-500 text-sm">
        Configure os módulos nos itens do menu para ver os dados.
      </p>
    </>
  )
}
```

- [ ] **Step 7: Criar placeholders para as outras seções**

```bash
for page in rank-tracking competitors keyword-gap keywords backlinks site-audit ai-insights; do
  mkdir -p "app/(copilot)/$page"
  echo "export default function Page() { return <p className='text-gray-400'>Em construção: $page</p> }" > "app/(copilot)/$page/page.tsx"
done
```

- [ ] **Step 8: Testar localmente**

```bash
npm run dev
```

Abra `http://localhost:3000`. Esperado:
- Redirecionado para `/login`
- Login com o secret do `.env.local` → vai para dashboard
- Sidebar visível com 8 itens, fundo escuro, accent laranja

- [ ] **Step 9: Commit**

```bash
git add components/ app/
git commit -m "feat(ui): layout dark + sidebar + 8 placeholders + dashboard skeleton"
```

---

## Task 6: Deploy no Hostinger Node.js

**Files:**
- Create: `next.config.ts` (atualizar para standalone)

- [ ] **Step 1: Configurar Next.js para output standalone**

Atualize `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
}

export default config
```

- [ ] **Step 2: Criar arquivo de start para Hostinger**

Crie `start.sh` na raiz:

```bash
#!/bin/bash
node .next/standalone/server.js
```

```bash
chmod +x start.sh
```

- [ ] **Step 3: Commit e push**

```bash
git add next.config.ts start.sh
git commit -m "feat(deploy): next.js standalone output para Hostinger Node.js"
git push
```

- [ ] **Step 4: Configurar no Hostinger**

No hPanel Hostinger, ao criar o Web App Node.js:
- **Repositório:** `jaleca-seo-copilot` (conectar GitHub)
- **Branch:** `main`
- **Build command:** `npm run build`
- **Start command:** `node .next/standalone/server.js`
- **Node version:** 20.x
- **Porta:** 3000 (ou a que Hostinger definir)

- [ ] **Step 5: Configurar variáveis de ambiente no Hostinger**

No painel do app Node.js no Hostinger, adicione as env vars:
```
DB_HOST=localhost
DB_NAME=jaleca_seo_copilot
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DATAFORSEO_LOGIN=rhammon@objetivasolucao.com.br
DATAFORSEO_PASSWORD=82d240431788fc07
SEO_COPILOT_SECRET=sua_string_secreta
```

- [ ] **Step 6: Rodar migration no servidor**

Via SSH no Hostinger ou pelo terminal do hPanel:
```bash
cd jaleca-seo-copilot
npm run migrate
```

- [ ] **Step 7: Verificar app rodando**

Acesse o domínio configurado (ex: `seo.jaleca.com.br`). Esperado: página de login.

---

## Definition of Done — Plan 1

- [ ] Repo `jaleca-seo-copilot` no GitHub com código commitado
- [ ] MySQL `jaleca_seo_copilot` criado no Hostinger com 8 tabelas
- [ ] DataForSEO client testado (resposta com search_volume)
- [ ] Login funcionando (secret → cookie → dashboard)
- [ ] Sidebar com 8 seções, fundo `#0F1923`, accent laranja `#FF6B35`
- [ ] App rodando no Hostinger Node.js (ou localhost para testes)
- [ ] `npm run dev` → `/login` → dashboard sem erros no console

Após concluir este plano → iniciar **Plan 2: Rank Tracking UI + Charts**.
