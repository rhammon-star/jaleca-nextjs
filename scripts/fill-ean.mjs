/**
 * fill-ean.mjs
 * Gera e preenche EAN-13 em todas as variações WooCommerce que estão sem GTIN.
 *
 * Uso:
 *   node scripts/fill-ean.mjs
 *   node scripts/fill-ean.mjs --dry-run   (só lista, não salva)
 */

import https from 'https'
import http from 'http'

// WOOCOMMERCE_API_URL = https://wp.jaleca.com.br/wp-json/wc/v3
// O script adiciona apenas /<endpoint> depois disso
const _rawUrl = process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_BASE = _rawUrl.replace(/\/wc\/v3\/?$/, '') // remove /wc/v3 se vier na env
const WC_CK   = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_CS   = process.env.WOOCOMMERCE_CONSUMER_SECRET
const DRY_RUN = process.argv.includes('--dry-run')

if (!WC_CK || !WC_CS) {
  console.error('❌  Defina WOOCOMMERCE_CONSUMER_KEY e WOOCOMMERCE_CONSUMER_SECRET no .env.local ou como variáveis de ambiente.')
  process.exit(1)
}

// ── EAN-13 ────────────────────────────────────────────────────────────────────
// Prefixo 789 = GS1 Brasil
// Formato: 789 + SKU numérico com 9 dígitos + dígito verificador
function calcEan13(base12) {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const d = parseInt(base12[i], 10)
    sum += i % 2 === 0 ? d : d * 3
  }
  const check = (10 - (sum % 10)) % 10
  return base12 + check
}

function generateEan(sku) {
  // Extrai apenas dígitos do SKU e usa os últimos 9
  const numeric = sku.replace(/\D/g, '').slice(-9).padStart(9, '0')
  const base12  = '789' + numeric
  return calcEan13(base12)
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const auth    = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')
    const url     = new URL(WC_BASE + '/wc/v3' + path)
    const isHttps = url.protocol === 'https:'
    const lib     = isHttps ? https : http
    const data    = body ? JSON.stringify(body) : null

    const options = {
      hostname: url.hostname,
      port:     url.port || (isHttps ? 443 : 80),
      path:     url.pathname + url.search,
      method,
      headers: {
        Authorization:  'Basic ' + auth,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }

    const req = lib.request(options, res => {
      // Segue redirect 301/302
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const redirectUrl = new URL(res.headers.location)
        const redirectLib = redirectUrl.protocol === 'https:' ? https : http
        const redirectOpts = {
          hostname: redirectUrl.hostname,
          port:     redirectUrl.port || (redirectUrl.protocol === 'https:' ? 443 : 80),
          path:     redirectUrl.pathname + redirectUrl.search,
          method,
          headers: options.headers,
        }
        const req2 = redirectLib.request(redirectOpts, res2 => {
          let raw = ''
          res2.on('data', c => (raw += c))
          res2.on('end', () => {
            try { resolve(JSON.parse(raw)) } catch { resolve(raw) }
          })
        })
        req2.on('error', reject)
        if (data) req2.write(data)
        req2.end()
        return
      }
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch { resolve(raw) }
      })
    })

    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

async function getAll(endpoint) {
  const items = []
  let page = 1
  while (true) {
    const batch = await request('GET', `/${endpoint}${endpoint.includes('?') ? '&' : '?'}per_page=100&page=${page}`)
    if (!Array.isArray(batch) || batch.length === 0) break
    items.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return items
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '🔍  DRY RUN — nenhuma alteração será salva\n' : '🚀  Preenchendo EAN-13 nas variações...\n')

  const products = await getAll('products?type=variable')
  console.log(`📦  ${products.length} produtos variáveis encontrados`)

  let total = 0
  let updated = 0
  let skipped = 0

  for (const product of products) {
    const variations = await getAll(`products/${product.id}/variations`)

    for (const v of variations) {
      total++
      const existing = v.global_unique_id || ''

      if (existing) {
        skipped++
        continue
      }

      const sku = v.sku || String(v.id)
      const ean = generateEan(sku)

      console.log(`  ✏️  ${product.name} — ${v.id} | SKU: ${sku} → EAN: ${ean}`)

      if (!DRY_RUN) {
        await request('PUT', `/products/${product.id}/variations/${v.id}`, {
          global_unique_id: ean,
        })
      }

      updated++
    }
  }

  console.log(`\n✅  Concluído`)
  console.log(`   Total de variações: ${total}`)
  console.log(`   Atualizadas:        ${updated}`)
  console.log(`   Já tinham EAN:      ${skipped}`)
  if (DRY_RUN) console.log('\n   (nada foi salvo — remova --dry-run para aplicar)')
}

main().catch(err => { console.error('❌', err); process.exit(1) })
