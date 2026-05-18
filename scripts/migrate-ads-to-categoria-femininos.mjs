#!/usr/bin/env node
// Migrate Google Ads final_urls: /jaleco-feminino → /categoria/jalecos-femininos
// Estratégia: Opção B (validada GPT+Gemini) — Ads aponta pra categoria transacional.
//
// Uso:
//   node scripts/migrate-ads-to-categoria-femininos.mjs            (dry-run, default)
//   node scripts/migrate-ads-to-categoria-femininos.mjs --execute  (aplica de verdade)
//   node scripts/migrate-ads-to-categoria-femininos.mjs --rollback (reverte usando backup)
//
// Backup automático em: scripts/_ads-backup-<timestamp>.json

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPTS_DIR = __dirname

const FROM_URL = 'https://jaleca.com.br/jaleco-feminino'
const TO_URL = 'https://jaleca.com.br/categoria/jalecos-femininos'

// IDs alvo (do levantamento — anote sempre quando o backlog mudar)
const TARGET_ADS = [
  { adId: '808579521767', adGroupId: '197682819002', label: 'RSA Jaleco Feminino' },
]

const TARGET_KEYWORDS = [
  { critId: '304017459993', adGroupId: '197682819002', kw: 'jaleco feminino [EXACT]' },
  { critId: '820690612680', adGroupId: '197682819002', kw: 'jaleco slim feminino' },
  { critId: '851564550945', adGroupId: '197682819002', kw: 'jaleco feminino hospitalar' },
  { critId: '1530518832371', adGroupId: '197682819002', kw: 'jaleco feminino slim' },
]

const args = new Set(process.argv.slice(2))
const isExecute = args.has('--execute')
const isRollback = args.has('--rollback')

// ── creds ─────────────────────────────────────────────────────────────────────
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

async function mutate(endpoint, body) {
  const res = await fetch(`${apiBase}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(body) })
  const json = await res.json()
  if (!res.ok || json.error) throw new Error(JSON.stringify(json.error ?? json, null, 2))
  return json
}

// ── ROLLBACK ──────────────────────────────────────────────────────────────────
if (isRollback) {
  const backups = readdirSync(SCRIPTS_DIR).filter(f => f.startsWith('_ads-backup-')).sort()
  if (backups.length === 0) {
    console.error('🚨 Nenhum backup encontrado em scripts/_ads-backup-*.json')
    process.exit(1)
  }
  const latest = backups.pop()
  console.log(`📦 Restaurando backup: ${latest}`)
  const data = JSON.parse(readFileSync(join(SCRIPTS_DIR, latest), 'utf-8'))

  for (const ad of data.ads) {
    console.log(`  ⏪ Ad ${ad.adId} → ${ad.urls.join(', ')}`)
    await mutate('/adGroupAds:mutate', {
      operations: [{
        update: { resourceName: `customers/${clientId}/adGroupAds/${ad.adGroupId}~${ad.adId}`, ad: { id: ad.adId, finalUrls: ad.urls } },
        updateMask: 'ad.final_urls',
      }],
    })
  }
  for (const kw of data.keywords) {
    console.log(`  ⏪ Keyword ${kw.kw} → ${kw.urls.join(', ')}`)
    await mutate('/adGroupCriteria:mutate', {
      operations: [{
        update: { resourceName: `customers/${clientId}/adGroupCriteria/${kw.adGroupId}~${kw.critId}`, finalUrls: kw.urls },
        updateMask: 'final_urls',
      }],
    })
  }
  console.log('✅ Rollback concluído')
  process.exit(0)
}

// ── DRY-RUN ou EXECUTE ────────────────────────────────────────────────────────
console.log(`\n${isExecute ? '🚀 EXECUTANDO' : '🔍 DRY-RUN (use --execute para aplicar)'}\n`)
console.log(`De:   ${FROM_URL}`)
console.log(`Para: ${TO_URL}\n`)

const backup = { ts: new Date().toISOString(), from: FROM_URL, to: TO_URL, ads: [], keywords: [] }

console.log('— Ads (RSA) —')
for (const ad of TARGET_ADS) {
  console.log(`  • ${ad.label} (id ${ad.adId})`)
  backup.ads.push({ ...ad, urls: [FROM_URL] })
  if (isExecute) {
    await mutate('/adGroupAds:mutate', {
      operations: [{
        update: { resourceName: `customers/${clientId}/adGroupAds/${ad.adGroupId}~${ad.adId}`, ad: { id: ad.adId, finalUrls: [TO_URL] } },
        updateMask: 'ad.final_urls',
      }],
    })
    console.log(`    ✅ mutado`)
  }
}

console.log('\n— Keywords (URL override) —')
for (const kw of TARGET_KEYWORDS) {
  console.log(`  • ${kw.kw} (id ${kw.critId})`)
  backup.keywords.push({ ...kw, urls: [FROM_URL] })
  if (isExecute) {
    await mutate('/adGroupCriteria:mutate', {
      operations: [{
        update: { resourceName: `customers/${clientId}/adGroupCriteria/${kw.adGroupId}~${kw.critId}`, finalUrls: [TO_URL] },
        updateMask: 'final_urls',
      }],
    })
    console.log(`    ✅ mutado`)
  }
}

if (isExecute) {
  const backupFile = join(SCRIPTS_DIR, `_ads-backup-${Date.now()}.json`)
  writeFileSync(backupFile, JSON.stringify(backup, null, 2))
  console.log(`\n📦 Backup salvo: ${backupFile}`)
  console.log(`\n✅ Total: ${TARGET_ADS.length} ads + ${TARGET_KEYWORDS.length} keywords migradas`)
  console.log(`💡 Rollback: node scripts/migrate-ads-to-categoria-femininos.mjs --rollback`)
} else {
  console.log(`\nℹ️  Nada foi mudado. Use --execute para aplicar.`)
}
