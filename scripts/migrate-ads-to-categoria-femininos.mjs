#!/usr/bin/env node
// Migrate Google Ads keyword final_urls: /jaleco-feminino → /categoria/jalecos-femininos
//
// Limitação: ad.final_urls é IMMUTABLE em RSA. Mudança do RSA = manual no painel.
// Este script só toca KEYWORDS (URL override) — operação in-place real, sem recreate.
//
// Uso:
//   node scripts/migrate-ads-to-categoria-femininos.mjs            (dry-run)
//   node scripts/migrate-ads-to-categoria-femininos.mjs --execute  (aplica)
//   node scripts/migrate-ads-to-categoria-femininos.mjs --rollback (reverte)

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPTS_DIR = __dirname

const FROM_URL = 'https://jaleca.com.br/jaleco-feminino'
const TO_URL = 'https://jaleca.com.br/categoria/jalecos-femininos'

const TARGET_KEYWORDS = [
  { critId: '304017459993', adGroupId: '197682819002', kw: 'jaleco feminino [EXACT]' },
  { critId: '820690612680', adGroupId: '197682819002', kw: 'jaleco slim feminino' },
  { critId: '851564550945', adGroupId: '197682819002', kw: 'jaleco feminino hospitalar' },
  { critId: '1530518832371', adGroupId: '197682819002', kw: 'jaleco feminino slim' },
]

const args = new Set(process.argv.slice(2))
const isExecute = args.has('--execute')
const isRollback = args.has('--rollback')

const config = JSON.parse(readFileSync(`${process.env.HOME}/.claude/google-ads-config.json`, 'utf-8'))
const clientId = config.credentials.client_customer_id_numeric
const managerId = config.credentials.manager_customer_id.replace(/-/g, '')
const devToken = config.credentials.developer_token
const token = execSync(`bash ${process.env.HOME}/.claude/scripts/google-ads-get-token.sh`, { encoding: 'utf-8' })
  .trim().split('\n').pop()

const apiBase = `https://googleads.googleapis.com/v23/customers/${clientId}`
const headers = {
  Authorization: `Bearer ${token}`,
  'developer-token': devToken,
  'login-customer-id': managerId,
  'Content-Type': 'application/json',
}

async function setKeywordUrl(adGroupId, critId, urls) {
  const res = await fetch(`${apiBase}/adGroupCriteria:mutate`, {
    method: 'POST', headers,
    body: JSON.stringify({
      operations: [{
        update: { resourceName: `customers/${clientId}/adGroupCriteria/${adGroupId}~${critId}`, finalUrls: urls },
        updateMask: 'final_urls',
      }],
    }),
  })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(JSON.stringify(json.error ?? json, null, 2))
}

// ── ROLLBACK ──────────────────────────────────────────────────────────────────
if (isRollback) {
  const backups = readdirSync(SCRIPTS_DIR).filter(f => f.startsWith('_ads-backup-')).sort()
  if (!backups.length) { console.error('🚨 Nenhum backup encontrado'); process.exit(1) }
  const latest = backups.pop()
  const data = JSON.parse(readFileSync(join(SCRIPTS_DIR, latest), 'utf-8'))
  console.log(`📦 Restaurando: ${latest}\n`)
  for (const kw of data.keywords ?? []) {
    console.log(`  ⏪ ${kw.kw} → ${kw.urls.join(',')}`)
    await setKeywordUrl(kw.adGroupId, kw.critId, kw.urls)
  }
  console.log('\n✅ Rollback concluído')
  process.exit(0)
}

// ── DRY-RUN / EXECUTE ─────────────────────────────────────────────────────────
console.log(`\n${isExecute ? '🚀 EXECUTANDO' : '🔍 DRY-RUN (use --execute para aplicar)'}\n`)
console.log(`De:   ${FROM_URL}`)
console.log(`Para: ${TO_URL}\n`)

const backup = { ts: new Date().toISOString(), from: FROM_URL, to: TO_URL, keywords: [] }

console.log('— Keywords (URL override in-place) —')
for (const kw of TARGET_KEYWORDS) {
  console.log(`  • ${kw.kw} (id ${kw.critId})`)
  backup.keywords.push({ ...kw, urls: [FROM_URL] })
  if (isExecute) {
    await setKeywordUrl(kw.adGroupId, kw.critId, [TO_URL])
    console.log(`    ✅ mutado`)
  }
}

if (isExecute) {
  const f = join(SCRIPTS_DIR, `_ads-backup-${Date.now()}.json`)
  writeFileSync(f, JSON.stringify(backup, null, 2))
  console.log(`\n📦 Backup: ${f}`)
  console.log(`\n✅ ${TARGET_KEYWORDS.length} keywords migradas`)
  console.log(`\n⚠️  Ad RSA NÃO mudado (URL imutável via API).`)
  console.log(`    Faça manualmente: Google Ads → Campanha "Jaleca — Search — Jaleco Feminino"`)
  console.log(`    → Ad Group "Jaleco Feminino" → Editar Ad (id 808579521767)`)
  console.log(`    → Final URL: ${FROM_URL} → ${TO_URL}`)
  console.log(`\n💡 Rollback keywords: node scripts/migrate-ads-to-categoria-femininos.mjs --rollback`)
} else {
  console.log(`\nℹ️  Nada foi mudado. Use --execute para aplicar.`)
  console.log(`\n⚠️  Lembrete: ad RSA precisa ser mudado manualmente no painel`)
  console.log(`    (URL é imutável via API).`)
}
