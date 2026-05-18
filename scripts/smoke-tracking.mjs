#!/usr/bin/env node
// Smoke test — valida que tracking crítico está no código.
// Falha = remoção/regressão dos snippets de GA4 / linker / pixel / Google Ads.
// Rodar em CI a cada PR + cron diário (defesa contra regressão silenciosa).

import { readFileSync } from 'fs'
import { join } from 'path'

const REPO = process.cwd()
const ANALYTICS = readFileSync(join(REPO, 'components/Analytics.tsx'), 'utf-8')

const CHECKS = [
  {
    name: 'GA4 init script tag',
    pattern: /googletagmanager\.com\/gtag\/js\?id=\$\{GA4_ID\}/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'GA4 config call',
    pattern: /gtag\('config',\s*'\$\{GA4_ID\}'/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'Cross-domain linker (jaleca + wp.jaleca) no GA4',
    pattern: /linker:\s*\{[^}]*domains:\s*\[\s*['"]jaleca\.com\.br['"]\s*,\s*['"]wp\.jaleca\.com\.br['"]/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'Google Ads conversion ID (AW-18072506944)',
    pattern: /AW-18072506944/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'Meta Pixel init',
    pattern: /fbq\('init',\s*'\$\{META_PIXEL_ID\}'/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'trackPurchase dispara gtag purchase',
    pattern: /gtag\?\.\('event',\s*'purchase'/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
  {
    name: 'trackPurchase dispara fbq Purchase',
    pattern: /fbq\?\.\('track',\s*'Purchase'/,
    file: 'components/Analytics.tsx',
    body: ANALYTICS,
  },
]

let failed = 0
for (const c of CHECKS) {
  if (c.pattern.test(c.body)) {
    console.log(`✅ ${c.name}`)
  } else {
    console.error(`❌ FALTA em ${c.file}: ${c.name}`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n🚨 ${failed}/${CHECKS.length} checks falharam — tracking regrediu`)
  process.exit(1)
}
console.log(`\n✅ Todos os ${CHECKS.length} checks de tracking OK`)
