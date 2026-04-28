# Fase 5 — Indexação Google/Bing + Emails Avise-me Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Quando uma URL muda de estado (criada, sem estoque, voltou), notificar Google Indexing API e IndexNow (Bing/Yandex). Quando uma variação volta ao estoque, disparar email para inscritos via "Avise-me".

**Architecture:** `lib/google-indexing.ts` encapsula chamadas a Google Indexing API (Service Account JWT) e IndexNow. `lib/email.ts` ganha `sendBackInStock()`. Webhook handler dispara via `waitUntil` em CRIAR/SEM_ESTOQUE/VOLTOU/DESATIVAR.

**Tech Stack:** Next.js 16, `googleapis` (Service Account auth), Brevo (já configurado).

**Spec:** `docs/superpowers/specs/2026-04-27-sync-variacoes-wc-design.md` (seção "Sitemap e indexação")

**Pré-requisito:** Fases 2, 3 e 4 prontas.

---

## File Structure

**Criar:**
- `lib/google-indexing.ts` — Indexing API + IndexNow + ping fallback
- `public/<INDEXNOW_KEY>.txt` — arquivo de verificação IndexNow
- `tests/google-indexing.test.ts`

**Modificar:**
- `lib/email.ts` — adicionar `sendBackInStock()`
- `app/api/wc/variation-sync/route.ts` — disparar indexação + emails em `waitUntil()`
- `package.json` — adicionar `googleapis`

---

### Task 1: Configurar Service Account e variáveis

- [ ] **Step 1: Criar Service Account no Google Cloud**

1. https://console.cloud.google.com → Project (criar `jaleca-indexing` se não existir).
2. APIs & Services → Library → habilitar "Web Search Indexing API".
3. IAM → Service Accounts → Create → nome `indexing-bot`.
4. Adicionar role "Owner" (suficiente).
5. Keys → Add key → JSON → baixar `indexing-key.json`.

- [ ] **Step 2: Vincular ao Search Console**

1. https://search.google.com/search-console → propriedade `jaleca.com.br`.
2. Settings → Users and permissions → Add user → email do Service Account (xxx@xxx.iam.gserviceaccount.com) → Owner.

- [ ] **Step 3: Configurar variáveis no Vercel**

```
GOOGLE_INDEXING_SA_JSON=<base64 do indexing-key.json>
INDEXNOW_KEY=<32-hex-chars-aleatorios>
```

Gerar key:
```bash
openssl rand -hex 32
# ou
uuidgen | tr -d - | tr 'A-Z' 'a-z'
```

Localmente, adicionar em `.env.local`.

- [ ] **Step 4: Criar arquivo de verificação IndexNow**

```bash
echo "<INDEXNOW_KEY>" > public/<INDEXNOW_KEY>.txt
```

(Substituir `<INDEXNOW_KEY>` pelo valor real.)

- [ ] **Step 5: Commit**

```bash
git add public/*.txt
git commit -m "feat(indexing): arquivo de verificação IndexNow"
```

---

### Task 2: Implementar `lib/google-indexing.ts`

**Files:**
- Create: `lib/google-indexing.ts`
- Modify: `package.json` (instalar `googleapis`)

- [ ] **Step 1: Instalar dependência**

```bash
npm install googleapis
```

- [ ] **Step 2: Implementar**

```ts
// lib/google-indexing.ts
import { google } from 'googleapis'

type Type = 'URL_UPDATED' | 'URL_DELETED'

function loadServiceAccount() {
  const b64 = process.env.GOOGLE_INDEXING_SA_JSON
  if (!b64) throw new Error('GOOGLE_INDEXING_SA_JSON ausente')
  return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
}

export async function notifyGoogle(url: string, type: Type = 'URL_UPDATED'): Promise<boolean> {
  try {
    const sa = loadServiceAccount()
    const jwt = new google.auth.JWT(sa.client_email, undefined, sa.private_key, [
      'https://www.googleapis.com/auth/indexing',
    ])
    await jwt.authorize()
    const indexing = google.indexing({ version: 'v3', auth: jwt })
    await indexing.urlNotifications.publish({ requestBody: { url, type } })
    return true
  } catch (e) {
    console.error('[notifyGoogle]', url, e)
    return false
  }
}

export async function notifyIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return false
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'jaleca.com.br',
        key,
        keyLocation: `https://jaleca.com.br/${key}.txt`,
        urlList: urls,
      }),
    })
    return res.ok
  } catch (e) {
    console.error('[notifyIndexNow]', e)
    return false
  }
}

export async function pingSitemap(): Promise<void> {
  const sitemapUrl = encodeURIComponent('https://jaleca.com.br/sitemap.xml')
  await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {})
}

export async function notifyAllForUrl(url: string, type: Type = 'URL_UPDATED'): Promise<void> {
  const fullUrl = url.startsWith('http') ? url : `https://jaleca.com.br${url}`
  await Promise.all([notifyGoogle(fullUrl, type), notifyIndexNow([fullUrl])])
}
```

- [ ] **Step 3: Smoke test local**

```bash
npx tsx -e "
import { notifyAllForUrl } from './lib/google-indexing';
await notifyAllForUrl('/jaleco-medico-azul-marinho');
console.log('OK');
"
```

Expected: `OK` (sem throw). Se falhar, conferir SA permissions no Search Console.

- [ ] **Step 4: Commit**

```bash
git add lib/google-indexing.ts package.json package-lock.json
git commit -m "feat(indexing): Google Indexing API + IndexNow + ping fallback"
```

---

### Task 3: Disparar indexação no webhook

**Files:**
- Modify: `app/api/wc/variation-sync/route.ts`

- [ ] **Step 1: Importar e chamar via `waitUntil`**

No topo:
```ts
import { notifyAllForUrl } from '@/lib/google-indexing'
```

Após o `withLock` no handler, expandir o bloco de side-effects:

```ts
const fullUrl = `https://jaleca.com.br${seo.url}`
if (action === 'CRIAR' || action === 'VOLTOU_ESTOQUE') {
  waitUntil(notifyAllForUrl(seo.url, 'URL_UPDATED'))
}
if (action === 'SEM_ESTOQUE' || action === 'DESATIVAR') {
  waitUntil(notifyAllForUrl(seo.url, 'URL_DELETED'))
}
```

(Ajustar para extrair `seo` do escopo do `withLock` — refatorar para retornar a entrada atualizada do bloco.)

- [ ] **Step 2: Commit**

```bash
git add app/api/wc/variation-sync/route.ts
git commit -m "feat(indexing): webhook notifica Google/IndexNow conforme ação"
```

---

### Task 4: Email "voltou ao estoque"

**Files:**
- Modify: `lib/email.ts`

- [ ] **Step 1: Adicionar função**

Append em `lib/email.ts`:

```ts
export async function sendBackInStock(args: {
  to: string
  productName: string
  colorName: string
  url: string
  imageUrl?: string
}): Promise<void> {
  const { to, productName, colorName, url, imageUrl } = args
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto">
      <h1 style="color:#7a5d3a">Voltou ao estoque! 🎉</h1>
      <p>O <strong>${productName}</strong> na cor <strong>${colorName}</strong> que você queria já está disponível.</p>
      ${imageUrl ? `<img src="${imageUrl}" alt="${productName}" style="width:100%;border-radius:8px"/>` : ''}
      <p style="margin-top:24px">
        <a href="https://jaleca.com.br${url}" style="background:#7a5d3a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">Comprar agora</a>
      </p>
      <p style="font-size:12px;color:#888;margin-top:32px">
        Você recebeu este email porque pediu para ser avisado quando este produto voltasse.
      </p>
    </div>
  `
  await sendMail({
    to,
    subject: `${productName} ${colorName} voltou ao estoque!`,
    html,
  })
}
```

(Usa `sendMail` que já existe em `lib/email.ts`.)

- [ ] **Step 2: Commit**

```bash
git add lib/email.ts
git commit -m "feat(email): adiciona sendBackInStock"
```

---

### Task 5: Disparar emails ao VOLTOU_ESTOQUE

**Files:**
- Modify: `app/api/wc/variation-sync/route.ts`

- [ ] **Step 1: Implementar drenagem da lista de inscritos**

No topo:
```ts
import { kv, notifyKey } from '@/lib/kv'
import { sendBackInStock } from '@/lib/email'
```

Adicionar helper:

```ts
async function drainAndNotify(seo: SeoEntry) {
  const emails = (await kv.smembers(notifyKey(seo.variationId))) as string[]
  if (!emails.length) return
  for (const email of emails) {
    await sendBackInStock({
      to: email,
      productName: seo.productName,
      colorName: seo.colorName,
      url: seo.url,
    }).catch((e) => console.error('[backinstock email]', email, e))
  }
  await kv.del(notifyKey(seo.variationId))
}
```

No bloco de side-effects:
```ts
if (action === 'VOLTOU_ESTOQUE') {
  waitUntil(drainAndNotify(seo))
}
```

- [ ] **Step 2: E2E**

1. Forçar variação `outofstock`.
2. Inscrever 2 emails via form.
3. Conferir KV `notify:{id}` tem 2 emails.
4. Mudar variação para `instock` no WP.
5. Em ~30s, ambos emails recebidos.
6. KV `notify:{id}` foi removido.

- [ ] **Step 3: Commit**

```bash
git add app/api/wc/variation-sync/route.ts
git commit -m "feat(email): dispara back-in-stock + limpa lista de inscritos"
```

---

### Task 6: Ping de sitemap após mudanças em batch

**Files:**
- Modify: `app/api/cron/regen-seo-pendente/route.ts`

- [ ] **Step 1: Adicionar ping no fim do cron**

```ts
import { pingSitemap } from '@/lib/google-indexing'

// no fim do handler GET:
if (results.length > 0) {
  await pingSitemap()
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/cron/regen-seo-pendente/route.ts
git commit -m "feat(indexing): ping sitemap após cron de regen"
```

---

### Task 7: Documentar setup no AGENTS.md

- [ ] **Step 1: Adicionar bloco**

Em `AGENTS.md`:

```markdown
## Indexação Google/Bing
- Service Account: `indexing-bot@<project>.iam.gserviceaccount.com` (Search Console: Owner)
- Env: `GOOGLE_INDEXING_SA_JSON` (JSON base64), `INDEXNOW_KEY` (32 hex)
- Verificação IndexNow: `public/<INDEXNOW_KEY>.txt`
- Disparo: webhook `/api/wc/variation-sync` em CRIAR/VOLTOU/SEM_ESTOQUE/DESATIVAR
- Cron: `/api/cron/regen-seo-pendente` faz ping no sitemap
```

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs(indexing): documenta setup Search Console + IndexNow"
```

---

## Self-Review

- [x] Spec coverage: Indexing API, IndexNow, ping fallback, emails Avise-me
- [x] `notifyAllForUrl` em Task 2 = usado em Task 3
- [x] `sendBackInStock` em Task 4 = usado em Task 5
- [x] Lista de inscritos é limpa após drenar (evita duplicatas em próximo VOLTOU_ESTOQUE)
- [x] Sem placeholders
