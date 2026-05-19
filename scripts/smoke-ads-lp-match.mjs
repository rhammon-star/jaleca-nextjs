#!/usr/bin/env node
// Smoke Ads-LP match — valida que keywords com URL override apontam pra LPs vivas.
// Roda local (requer creds Google Ads). NÃO roda em CI público.
//
// Uso: node scripts/smoke-ads-lp-match.mjs

import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const config = JSON.parse(readFileSync(`${process.env.HOME}/.claude/google-ads-config.json`, 'utf-8'))
const clientId = config.credentials.client_customer_id_numeric
const managerId = config.credentials.manager_customer_id.replace(/-/g, '')
const devToken = config.credentials.developer_token
const token = execSync(`bash ${process.env.HOME}/.claude/scripts/google-ads-get-token.sh`, { encoding: 'utf-8' })
  .trim().split('\n').pop()

const headers = {
  Authorization: `Bearer ${token}`,
  'developer-token': devToken,
  'login-customer-id': managerId,
  'Content-Type': 'application/json',
}

const query = `SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.final_urls FROM keyword_view WHERE campaign.status = ENABLED AND ad_group_criterion.status = ENABLED`

const res = await fetch(`https://googleads.googleapis.com/v23/customers/${clientId}/googleAds:searchStream`, {
  method: 'POST', headers, body: JSON.stringify({ query }),
})
const data = await res.json()

const rows = (data[0]?.results ?? [])
  .map(r => ({
    camp: r.campaign.name,
    group: r.adGroup.name,
    kw: r.adGroupCriterion.keyword.text,
    urls: r.adGroupCriterion.finalUrls ?? [],
  }))
  .filter(r => r.urls.length > 0)

console.log(`🔍 ${rows.length} keywords com URL override\n`)
let failed = 0

for (const r of rows) {
  for (const url of r.urls) {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (!res.ok) {
      console.error(`❌ [${r.group}] "${r.kw}" → ${url} (HTTP ${res.status})`)
      failed++
    }
  }
}

if (failed) { console.error(`\n🚨 ${failed} URLs quebradas em ads`); process.exit(1) }
console.log(`✅ Todas as ${rows.length} URLs de keywords retornam 200`)
