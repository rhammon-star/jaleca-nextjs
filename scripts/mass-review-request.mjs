#!/usr/bin/env node
// Mass review request — campanha one-shot pra TODOS os clientes históricos.
// Envia e-mail (mesmo template do cron diário) pedindo review no Google.
//
// Marca cada pedido como `jaleca_review_request_sent=1` para o cron diário
// 7-8d não duplicar.
//
// Uso:
//   node scripts/mass-review-request.mjs              (dry-run, mostra preview)
//   node scripts/mass-review-request.mjs --limit 5    (testa com 5 envios reais)
//   node scripts/mass-review-request.mjs --execute    (envia todos)

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

const WC_BASE = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_AUTH = `Basic ${Buffer.from('contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q').toString('base64')}`

// Status que indicam pedido pago/entregue (cliente recebeu produto e pode avaliar)
const ELIGIBLE_STATUSES = ['completed', 'enviado']

const args = process.argv.slice(2)
const isExecute = args.includes('--execute')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : null
const isDryRun = !isExecute && limit === null

// Endpoint próprio do site que dispara o e-mail via Brevo (reusa template + marca pedido)
const TRIGGER_ENDPOINT = 'https://jaleca.com.br/api/orders/review-request-single'
const CRON_SECRET = 'jaleca-cron-2026'

async function fetchAllOrders(status) {
  const all = []
  let page = 1
  while (true) {
    const res = await fetch(`${WC_BASE}/orders?status=${status}&per_page=100&page=${page}&_fields=id,number,billing,date_completed,line_items,meta_data`, {
      headers: { Authorization: WC_AUTH },
    })
    if (!res.ok) throw new Error(`WC ${status} page ${page}: HTTP ${res.status}`)
    const batch = await res.json()
    if (batch.length === 0) break
    all.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return all
}

console.log(`\n📥 Buscando pedidos...`)
const allOrders = []
for (const status of ELIGIBLE_STATUSES) {
  const orders = await fetchAllOrders(status)
  console.log(`  ${status}: ${orders.length} pedidos`)
  allOrders.push(...orders)
}
console.log(`Total bruto: ${allOrders.length}`)

// Filtra: precisa de e-mail
let valid = allOrders.filter(o => o.billing?.email && o.line_items?.length > 0)
console.log(`Com e-mail e itens: ${valid.length}`)

// Pula já enviados
valid = valid.filter(o => {
  const sent = o.meta_data?.find(m => m.key === 'jaleca_review_request_sent')?.value
  return sent !== '1'
})
console.log(`Não-enviados ainda: ${valid.length}`)

// Dedup por e-mail — mantém pedido MAIS RECENTE por e-mail
const byEmail = new Map()
for (const o of valid) {
  const email = o.billing.email.toLowerCase().trim()
  const existing = byEmail.get(email)
  if (!existing) byEmail.set(email, o)
  else {
    const newer = new Date(o.date_completed || 0) > new Date(existing.date_completed || 0)
    if (newer) byEmail.set(email, o)
  }
}
const deduped = [...byEmail.values()]
console.log(`Após dedup por e-mail: ${deduped.length} clientes únicos`)

// Aplica limit se setado
const toSend = limit ? deduped.slice(0, limit) : deduped

console.log(`\n${isDryRun ? '🔍 DRY-RUN' : '🚀 EXECUTANDO'} — vou enviar ${toSend.length} e-mails`)
console.log(`Modo: ${isDryRun ? 'preview' : (limit ? `LIMIT ${limit}` : 'TODOS')}\n`)

if (isDryRun) {
  console.log('Preview (top 10):')
  for (const o of toSend.slice(0, 10)) {
    console.log(`  • #${o.number} ${o.billing.first_name} ${o.billing.email}`)
  }
  console.log(`\nℹ️  Nada enviado. Use --limit 5 pra testar com 5 envios reais, ou --execute pra mandar todos.`)
  process.exit(0)
}

// Pra executar: chama o endpoint do próprio site (passa orderId)
// que reutiliza sendReviewRequest + markReviewRequestSent
let sent = 0
let failed = 0
const log = []

for (const o of toSend) {
  const products = o.line_items.map(i => ({ id: i.product_id, name: i.name }))
  try {
    const res = await fetch(TRIGGER_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${CRON_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: o.id }),
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok) {
      sent++
      log.push({ orderId: o.id, email: o.billing.email, status: 'sent' })
      console.log(`  ✅ #${o.number} → ${o.billing.email}`)
    } else {
      failed++
      log.push({ orderId: o.id, email: o.billing.email, status: 'error', error: json })
      console.error(`  ❌ #${o.number} → ${o.billing.email} (${res.status})`)
    }
  } catch (e) {
    failed++
    log.push({ orderId: o.id, email: o.billing.email, status: 'error', error: String(e) })
    console.error(`  ❌ #${o.number} → ${o.billing.email} (${e.message})`)
  }
  // Throttle: 6s entre envios = 10/min (seguro pra Brevo)
  await new Promise(r => setTimeout(r, 6000))
}

const logFile = `scripts/_mass-review-${Date.now()}.json`
writeFileSync(logFile, JSON.stringify(log, null, 2))
console.log(`\n📦 Log: ${logFile}`)
console.log(`✅ ${sent} enviados | ❌ ${failed} falhas`)
