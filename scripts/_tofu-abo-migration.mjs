#!/usr/bin/env node
// Migração CBO → ABO da campanha TOFU (one-shot, idempotente).
// Agendado para 2026-05-20 00:05 BRT via launchd local.
// Seguro re-executar: se já migrou, detecta e não duplica.

import { execSync } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const META_TOKEN = 'EAASQD9N7C3EBRbqaaZCWi37m5P0lspk5tUcaTmo7VPlTpvEtRlQCry5DGFmTiCYyjeopsXmuFyDGl6QBmjIvopAwobpqbtCZCMCIm9ccKL8DF5YFZAA3gSo9Gm4DVydrnumuu2OrfvjpZBEhaRFZATR5HVMSmrTGbfeA4zo6QzxZAFHQEApowYsDIC2z6ePQZDZD'
const CAMP_ID = '120245125571490396'
// Nota 19/05: A2 e A5 foram extraídos pra campanhas próprias (Jaleca —
// Dentistas LAL Mulheres camp 120245782630780396 + Jaleca — LAL 1%
// Compradores camp 120245782633100396). TOFU agora tem só A1 e A4 ativos.
const ADSETS = [
  { id: '120245126384400396', name: 'A1 Público Aberto Mulheres 25-45', budgetBRL: 30 },
  { id: '120245692889320396', name: 'A4 Dentistas LAL Homens', budgetBRL: 10 },
]

const BACKUP_DIR = join(import.meta.dirname || './scripts', '_meta-backup')
mkdirSync(BACKUP_DIR, { recursive: true })
const LOG_FILE = join(BACKUP_DIR, `tofu-abo-fired-${new Date().toISOString().replace(/[:.]/g, '-')}.log`)

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`
  console.log(line)
  try { writeFileSync(LOG_FILE, line + '\n', { flag: 'a' }) } catch {}
}

async function api(method, path, body) {
  const url = `https://graph.facebook.com/v20.0/${path}`
  const opts = { method, headers: {} }
  if (body) {
    opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    opts.body = new URLSearchParams({ ...body, access_token: META_TOKEN }).toString()
  } else {
    const u = new URL(url)
    u.searchParams.set('access_token', META_TOKEN)
    return fetch(u).then(r => r.json())
  }
  const r = await fetch(url, opts)
  return r.json()
}

log('🚀 TOFU CBO→ABO migration started')

// 1) Check current state
const camp = await api('GET', `${CAMP_ID}?fields=name,daily_budget,bid_strategy`)
log(`Campanha: ${camp.name} | daily_budget atual: R$${(parseInt(camp.daily_budget || 0) / 100).toFixed(2)}`)

// Idempotency check: if campaign budget = 0/null AND any ad set has budget > 0, migration already done
const adsetCheck = await api('GET', `${CAMP_ID}/adsets?fields=id,name,daily_budget`)
const anyAdsetHasBudget = (adsetCheck.data || []).some(a => parseInt(a.daily_budget || 0) > 0)
if (parseInt(camp.daily_budget || 0) === 0 && anyAdsetHasBudget) {
  log('✅ Migração já feita anteriormente. Saindo (idempotente).')
  process.exit(0)
}

// 2) Backup
const fullBackup = { campaign: camp, adsets: adsetCheck.data }
writeFileSync(join(BACKUP_DIR, `tofu-pre-migration-${Date.now()}.json`), JSON.stringify(fullBackup, null, 2))
log('📦 Backup salvo')

// 3) Zerar daily_budget da campanha (desliga CBO)
log('— Passo 1/2: removendo daily_budget da campanha (desliga CBO)')
const offCbo = await api('POST', CAMP_ID, { daily_budget: '0' })
if (offCbo.error) {
  log(`❌ Erro ao desligar CBO: ${JSON.stringify(offCbo.error)}`)
  process.exit(1)
}
log('✅ CBO desligado')

// 4) Setar budget em cada ad set
log('— Passo 2/2: setando daily_budget nos ad sets')
let allOk = true
for (const a of ADSETS) {
  const r = await api('POST', a.id, { daily_budget: String(a.budgetBRL * 100) })
  if (r.error) {
    log(`❌ ${a.name}: ${JSON.stringify(r.error)}`)
    allOk = false
  } else {
    log(`✅ ${a.name} → R$ ${a.budgetBRL}`)
  }
}

// 5) Validação final
log('— Validação final')
const final = await api('GET', `${CAMP_ID}/adsets?fields=name,daily_budget,effective_status`)
for (const a of (final.data || [])) {
  const bRBL = (parseInt(a.daily_budget || 0) / 100).toFixed(2)
  log(`  ${a.name} → R$ ${bRBL}/dia [${a.effective_status}]`)
}

if (allOk) log('🎯 Migração concluída com sucesso')
else log('⚠️ Migração com erros — verificar log + Ads Manager')
log(`📄 Log completo: ${LOG_FILE}`)
