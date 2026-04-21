/**
 * Jaleca Dashboard — busca todos os dados do dia para análise interativa no Claude Code.
 * Uso: node scripts/dashboard.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Lê .env.local
function loadEnv() {
  const path = resolve(process.cwd(), '.env.local')
  if (!existsSync(path)) throw new Error('.env.local não encontrado')
  const env = {}
  for (const line of readFileSync(path, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '')
  }
  return env
}

const env = loadEnv()
const CRON_SECRET = env.CRON_SECRET
const BASE_URL = 'https://jaleca.com.br'

// Lê DataForSEO positions locais
function loadSeoPositions() {
  const path = resolve(process.cwd(), 'data/seo-tracking/positions.json')
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

async function main() {
  console.error('🔄 Buscando dados do dia...')

  if (!CRON_SECRET) {
    console.error('❌ CRON_SECRET não encontrado no .env.local')
    process.exit(1)
  }

  // Busca daily-report sem email
  const res = await fetch(`${BASE_URL}/api/daily-report?json=1`, {
    headers: { authorization: `Bearer ${CRON_SECRET}` },
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    console.error(`❌ daily-report retornou ${res.status}:`, await res.text())
    process.exit(1)
  }

  const data = await res.json()

  // Adiciona DataForSEO positions
  const seoPositions = loadSeoPositions()
  if (seoPositions) {
    data.dataForSeo = {
      updatedAt: seoPositions.updatedAt,
      positions: seoPositions.records
        .filter(r => r.position !== null)
        .sort((a, b) => a.position - b.position)
        .map(r => ({ keyword: r.keyword, position: r.position, url: r.url?.replace('https://jaleca.com.br', '') || '/' })),
      notRanking: seoPositions.records
        .filter(r => r.position === null)
        .map(r => r.keyword),
    }
  }

  console.error('✅ Dados coletados com sucesso')
  console.log(JSON.stringify(data, null, 2))
}

main().catch(e => { console.error('Erro:', e.message); process.exit(1) })
