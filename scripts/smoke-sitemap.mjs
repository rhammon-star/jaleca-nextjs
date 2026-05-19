#!/usr/bin/env node
// Smoke sitemap — valida estrutura, lastmod variado, e amostra HTTP 200.

const BASE = process.env.SMOKE_BASE_URL || 'https://jaleca.com.br'
const MIN_URLS = 50
const SAMPLE_SIZE = 5

const res = await fetch(`${BASE}/sitemap.xml`, { headers: { 'User-Agent': 'JalecaSmoke/1.0' } })
if (!res.ok) { console.error(`❌ /sitemap.xml HTTP ${res.status}`); process.exit(1) }
const xml = await res.text()

const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1])

console.log(`📄 URLs no sitemap: ${urls.length}`)
console.log(`📅 Lastmods: ${lastmods.length} (únicos: ${new Set(lastmods).size})`)

let failed = 0

if (urls.length < MIN_URLS) {
  console.error(`❌ URLs (${urls.length}) < mínimo (${MIN_URLS})`)
  failed++
}

const uniqueLastmods = new Set(lastmods).size
if (lastmods.length > 10 && uniqueLastmods < 3) {
  console.error(`❌ Lastmods quase todos iguais (${uniqueLastmods} único de ${lastmods.length}) — getLastMod quebrou`)
  failed++
}

// Amostra: 5 URLs aleatórias devem retornar 200
const sample = [...urls].sort(() => Math.random() - 0.5).slice(0, SAMPLE_SIZE)
console.log(`\n🔍 Validando amostra de ${SAMPLE_SIZE} URLs...`)
for (const u of sample) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'follow' })
    if (!r.ok) { console.error(`  ❌ ${u} → HTTP ${r.status}`); failed++ }
    else console.log(`  ✅ ${u}`)
  } catch (e) { console.error(`  ❌ ${u} → ${e.message}`); failed++ }
}

if (failed) { console.error(`\n🚨 ${failed} falhas no sitemap`); process.exit(1) }
console.log(`\n✅ Sitemap OK: ${urls.length} URLs, ${uniqueLastmods} lastmods únicos, amostra 200`)
