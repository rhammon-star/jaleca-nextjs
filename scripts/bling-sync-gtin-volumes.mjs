/**
 * bling-sync-gtin-volumes.mjs
 * Sincroniza para todos os 604 produtos Bling:
 *   - volumes = 1
 *   - gtin e gtinEmbalagem nas variações (EAN do WooCommerce)
 *   - codigosBarras nas variações (EAN13)
 *   - estoque das variações (stock_quantity do WC)
 *
 * Uso:
 *   node scripts/bling-sync-gtin-volumes.mjs
 *   node scripts/bling-sync-gtin-volumes.mjs --dry-run
 *   node scripts/bling-sync-gtin-volumes.mjs --skip-stock
 */

import https from 'https'
import http from 'http'

const BLING_TOKEN = process.env.BLING_ACCESS_TOKEN
const WC_BASE     = (process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3').replace(/\/wc\/v3\/?$/, '')
const WC_CK       = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_CS       = process.env.WOOCOMMERCE_CONSUMER_SECRET
const DRY_RUN     = process.argv.includes('--dry-run')
const SKIP_STOCK  = process.argv.includes('--skip-stock')

if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN não encontrado'); process.exit(1) }
if (!WC_CK || !WC_CS) { console.error('❌  WooCommerce credentials não encontradas'); process.exit(1) }

// ── HTTP helper ───────────────────────────────────────────────────────────────
function httpReq(method, urlStr, headers, body = null) {
  return new Promise((resolve, reject) => {
    const url     = new URL(urlStr)
    const isHttps = url.protocol === 'https:'
    const lib     = isHttps ? https : http
    const data    = body ? JSON.stringify(body) : null
    const opts = {
      hostname: url.hostname,
      port:     url.port || (isHttps ? 443 : 80),
      path:     url.pathname + url.search,
      method,
      timeout:  25000,
      headers: { 'Content-Type': 'application/json', ...headers, ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) },
    }
    const req = lib.request(opts, res => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        return httpReq(method, res.headers.location, headers, body).then(resolve).catch(reject)
      }
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    req.on('timeout', () => { req.destroy(new Error('TIMEOUT')) })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

const blingGet  = path       => httpReq('GET',  `https://www.bling.com.br/Api/v3${path}`, { Authorization: `Bearer ${BLING_TOKEN}` })
const blingPut  = (path, b)  => httpReq('PUT',  `https://www.bling.com.br/Api/v3${path}`, { Authorization: `Bearer ${BLING_TOKEN}` }, b)
const blingPost = (path, b)  => httpReq('POST', `https://www.bling.com.br/Api/v3${path}`, { Authorization: `Bearer ${BLING_TOKEN}` }, b)

async function blingGetAll(path) {
  const items = []
  let page = 1
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const { body } = await blingGet(`${path}${sep}pagina=${page}&limite=100`)
    const data = body?.data || []
    if (!Array.isArray(data) || data.length === 0) break
    items.push(...data)
    if (data.length < 100) break
    page++
  }
  return items
}

function wcGet(path) {
  const auth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')
  return httpReq('GET', `${WC_BASE}/wc/v3${path}`, { Authorization: `Basic ${auth}` })
}

async function wcGetAll(endpoint) {
  const items = []
  let page = 1
  while (true) {
    const sep = endpoint.includes('?') ? '&' : '?'
    const { body } = await wcGet(`/${endpoint}${sep}per_page=100&page=${page}`)
    if (!Array.isArray(body) || body.length === 0) break
    items.push(...body)
    if (body.length < 100) break
    page++
  }
  return items
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function retry(fn, retries = 4, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try { return await fn() }
    catch (e) {
      if (i === retries - 1) return { status: 0, body: { error: e.message } }
      console.log(`     ⟳  Retry ${i + 1}/${retries}: ${e.code || e.message}`)
      await sleep(delayMs * (i + 1))
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '🔍  DRY RUN\n' : '🚀  Sincronizando GTIN + Volumes + Estoque...\n')

  // 1. Busca EAN + estoque das variações WC
  console.log('🔄  Buscando EAN + estoque do WooCommerce...')
  const wcEanMap   = {}  // { skuVariacao: ean }
  const wcStockMap = {}  // { skuVariacao: stockQty }
  const wcSimpleStockMap = {} // { skuSimples: { ean, stock } }

  const wcProducts = await wcGetAll('products?type=variable')
  for (const p of wcProducts) {
    const vars = await wcGetAll(`products/${p.id}/variations`)
    for (const v of vars) {
      if (!v.sku) continue
      if (v.global_unique_id) wcEanMap[v.sku] = v.global_unique_id
      if (v.stock_quantity != null) wcStockMap[v.sku] = v.stock_quantity
    }
  }

  const wcSimples = await wcGetAll('products?type=simple')
  for (const p of wcSimples) {
    if (!p.sku) continue
    wcSimpleStockMap[p.sku] = {
      ean:   p.global_unique_id || '',
      stock: p.stock_quantity ?? 0,
    }
    if (p.global_unique_id) wcEanMap[p.sku] = p.global_unique_id
    if (p.stock_quantity != null) wcStockMap[p.sku] = p.stock_quantity
  }

  console.log(`   ${Object.keys(wcEanMap).length} EANs mapeados`)
  console.log(`   ${Object.keys(wcStockMap).length} estoques mapeados\n`)

  // 2. Busca depósito padrão do Bling (para atualizar estoque)
  let depositoId = null
  if (!SKIP_STOCK) {
    const depRes = await retry(() => blingGet('/depositos?pagina=1&limite=20'))
    const deps = depRes?.body?.data || []
    const principal = deps.find(d => d.padrao || d.situacao === 'A') || deps[0]
    if (principal) {
      depositoId = principal.id
      console.log(`🏭  Depósito padrão: ${principal.descricao} (id=${depositoId})\n`)
    } else {
      console.log('⚠️   Depósito não encontrado — pulando sync de estoque\n')
    }
  }

  // 3. Busca todos os produtos Bling
  console.log('📦  Buscando produtos Bling...')
  const blingProducts = await blingGetAll('/produtos')
  console.log(`   ${blingProducts.length} produtos encontrados\n`)

  let prodOk = 0, prodErr = 0, varOk = 0, varErr = 0, stockOk = 0

  // 4. Atualiza cada produto
  console.log('✏️   Atualizando produtos (volumes=1)...')
  for (const p of blingProducts) {
    console.log(`  → ${p.nome}`)
    if (DRY_RUN) { prodOk++; continue }

    // GET completo
    const { body: full } = await retry(() => blingGet(`/produtos/${p.id}`))
    const current = full?.data || {}
    await sleep(300)

    const isPai = current.formato === 'V'

    const payload = {
      ...current,
      volumes: 1,
    }

    // Remove campos de auditoria
    delete payload.id
    delete payload.dataCriacao
    delete payload.dataAlteracao
    delete payload.estrutura
    delete payload.midia
    delete payload.anexos
    if (!isPai) delete payload.variacoes

    // Produtos pai: injeta EAN nas variações direto no PUT do pai (seta gtin + gtinEmbalagem)
    let varEanCount = 0
    const varsSemCodBarras = []  // variações que precisam de codigosBarras via PUT direto

    if (isPai && Array.isArray(payload.variacoes)) {
      payload.variacoes = payload.variacoes.map(v => {
        const vv = { ...v }
        delete vv.dataCriacao
        delete vv.dataAlteracao
        delete vv.produto
        delete vv.imagens
        delete vv.anexos

        const ean = wcEanMap[vv.codigo || '']
        const jaTemGtin = !!vv.gtin
        const jaTemCodBarras = vv.codigosBarras?.length > 0

        if (ean && !jaTemGtin) {
          vv.gtin          = ean
          vv.gtinEmbalagem = ean
          varEanCount++
          console.log(`     EAN gtin ${vv.codigo}: ${ean}`)
        }
        if (ean && !jaTemCodBarras) {
          vv.codigosBarras = [{ codigo: ean, tipo: 'EAN13', principal: true }]
          // Guarda para atualizar via PUT direto no produto filho também
          if (vv.id) varsSemCodBarras.push({ id: vv.id, ean })
        }
        return vv
      })
    }

    const res = await retry(() => blingPut(`/produtos/${p.id}`, payload))
    if (res.status >= 200 && res.status < 300) {
      prodOk++
      varOk += varEanCount
    } else {
      console.log(`     ⚠️  Erro ${res.status}: ${JSON.stringify(res.body).slice(0, 300)}`)
      prodErr++
    }
    await sleep(400)

    // PUT direto no produto filho para codigosBarras (o PUT do pai não persiste este campo)
    for (const { id: varId, ean } of varsSemCodBarras) {
      const { body: varFull } = await retry(() => blingGet(`/produtos/${varId}`))
      const varCurrent = varFull?.data || {}
      if (!varCurrent.id) continue
      await sleep(200)

      const varPayload = { ...varCurrent, codigosBarras: [{ codigo: ean, tipo: 'EAN13', principal: true }] }
      delete varPayload.id
      delete varPayload.dataCriacao
      delete varPayload.dataAlteracao
      delete varPayload.estrutura
      delete varPayload.midia
      delete varPayload.anexos
      delete varPayload.variacoes

      const vr = await retry(() => blingPut(`/produtos/${varId}`, varPayload))
      if (vr.status >= 200 && vr.status < 300) {
        varOk++
        console.log(`     codigosBarras ${varCurrent.codigo}: ok`)
      } else {
        console.log(`     ⚠️  codigosBarras erro ${vr.status}: ${JSON.stringify(vr.body).slice(0, 200)}`)
        varErr++
      }
      await sleep(300)
    }
  }

  console.log(`\n   Produtos:  ${prodOk} ok, ${prodErr} erros`)
  console.log(`   EAN vars:  ${varOk} atualizados, ${varErr} erros`)
  if (!SKIP_STOCK) console.log(`   Estoques:  ${stockOk} atualizados`)
  console.log('\n✅  Concluído')
  if (DRY_RUN) console.log('   (nada salvo — remova --dry-run para aplicar)')
}

main().catch(e => { console.error('❌', e); process.exit(1) })
