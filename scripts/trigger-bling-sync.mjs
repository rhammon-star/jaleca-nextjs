/**
 * trigger-bling-sync.mjs
 * Faz um PUT mínimo em cada produto WooCommerce para disparar o webhook → Bling.
 * Não altera nenhum dado do produto.
 *
 * Uso:
 *   node scripts/trigger-bling-sync.mjs
 *   node scripts/trigger-bling-sync.mjs --dry-run
 */

import https from 'https'
import http from 'http'

const _rawUrl = process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_BASE = _rawUrl.replace(/\/wc\/v3\/?$/, '')
const WC_CK   = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_CS   = process.env.WOOCOMMERCE_CONSUMER_SECRET
const DRY_RUN = process.argv.includes('--dry-run')

if (!WC_CK || !WC_CS) {
  console.error('❌  Defina WOOCOMMERCE_CONSUMER_KEY e WOOCOMMERCE_CONSUMER_SECRET')
  process.exit(1)
}

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
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const ru  = new URL(res.headers.location)
        const rl  = ru.protocol === 'https:' ? https : http
        const ro  = { hostname: ru.hostname, port: ru.port || (ru.protocol === 'https:' ? 443 : 80), path: ru.pathname + ru.search, method, headers: options.headers }
        const r2  = rl.request(ro, res2 => {
          let raw = ''
          res2.on('data', c => (raw += c))
          res2.on('end', () => { try { resolve(JSON.parse(raw)) } catch { resolve(raw) } })
        })
        r2.on('error', reject)
        if (data) r2.write(data)
        r2.end()
        return
      }
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => { try { resolve(JSON.parse(raw)) } catch { resolve(raw) } })
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
    const sep   = endpoint.includes('?') ? '&' : '?'
    const batch = await request('GET', `/${endpoint}${sep}per_page=100&page=${page}`)
    if (!Array.isArray(batch) || batch.length === 0) break
    items.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return items
}

// Pausa entre requisições para não sobrecarregar
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  console.log(DRY_RUN ? '🔍  DRY RUN — nenhum PUT será feito\n' : '🚀  Disparando sync WooCommerce → Bling...\n')

  const products = await getAll('products?per_page=100')
  console.log(`📦  ${products.length} produtos encontrados\n`)

  let ok = 0
  let err = 0

  for (const p of products) {
    console.log(`  → ${p.name} (id: ${p.id})`)

    if (!DRY_RUN) {
      // PUT com o próprio nome do produto — não muda nada, só dispara o webhook
      const res = await request('PUT', `/products/${p.id}`, { name: p.name })
      if (res.id) {
        ok++
      } else {
        console.log(`     ⚠️  Erro: ${JSON.stringify(res).slice(0, 80)}`)
        err++
      }
      await sleep(300) // 300ms entre cada produto
    } else {
      ok++
    }
  }

  console.log(`\n✅  Concluído`)
  console.log(`   Enviados: ${ok}`)
  if (err) console.log(`   Erros:    ${err}`)
  if (DRY_RUN) console.log('\n   (nada foi enviado — remova --dry-run para aplicar)')
}

main().catch(err => { console.error('❌', err); process.exit(1) })
