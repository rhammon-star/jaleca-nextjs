/**
 * bling-fill-products.mjs
 * Atualiza todos os produtos e anúncios no Bling com:
 *   - Marca = Jaleca
 *   - Modelo (derivado do nome)
 *   - Gênero (Feminino/Masculino/Unissex)
 *   - Dimensões de envio (31×4×41cm, 600g)
 *   - Descrição longa do WooCommerce
 *   - GTIN/EAN nas variações (via WooCommerce API)
 *   - Produtos pai (formato=V): atualizados mantendo variacoes
 *   - Anúncio ML: categoria Jalecos Escolares, garantia vendedor 7 dias, frete grátis
 *
 * Uso:
 *   node scripts/bling-fill-products.mjs
 *   node scripts/bling-fill-products.mjs --dry-run
 *   node scripts/bling-fill-products.mjs --skip-ean      (pula sync EAN)
 *   node scripts/bling-fill-products.mjs --skip-anuncios (pula update anúncios)
 *   node scripts/bling-fill-products.mjs --only-pais     (atualiza só produtos pai)
 */

import https from 'https'
import http from 'http'

// ── Config ────────────────────────────────────────────────────────────────────
const BLING_TOKEN  = process.env.BLING_ACCESS_TOKEN
const WC_BASE      = (process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3').replace(/\/wc\/v3\/?$/, '')
const WC_CK        = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_CS        = process.env.WOOCOMMERCE_CONSUMER_SECRET
const DRY_RUN      = process.argv.includes('--dry-run')
const SKIP_EAN     = process.argv.includes('--skip-ean')
const SKIP_ADS     = process.argv.includes('--skip-anuncios')
const ONLY_PAIS    = process.argv.includes('--only-pais')

const ML_CATEGORIA_ID = 'MLB277428'
const ML_LOJA_ID      = 206034318

// Dimensões de envio
const DIMS = { largura: 4, altura: 31, profundidade: 41, pesoBruto: 0.6, pesoLiquido: 0.6 }

if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN não encontrado'); process.exit(1) }
if (!WC_CK || !WC_CS) { console.error('❌  WooCommerce credentials não encontradas'); process.exit(1) }

// ── Derivar campos do nome ────────────────────────────────────────────────────
function derivarModelo(nome) {
  let m = nome
  m = m.replace(/\s+Cor:[^;,]+(?:;Tamanho:\S+)?/gi, '')
  m = m.replace(/\s+Tamanho:\S+/gi, '')
  m = m.replace(/\s*-\s*Jaleca\s*$/i, '')
  m = m.replace(/\s*(Feminino|Masculino|Unissex)\s*/gi, ' ')
  m = m.replace(/^\s*(Jaleco|Dólmã|Dolma|Conjunto|Touca de|Touca|Faixa de Cabelo|Faixa|Colete|Macacão|Avental)\s*/i, '')
  m = m.replace(/\s+/g, ' ').trim()
  m = m.charAt(0).toUpperCase() + m.slice(1)
  return m || nome.split(' ')[0]
}

function derivarGenero(nome) {
  if (/feminino/i.test(nome))  return 'Feminino'
  if (/masculino/i.test(nome)) return 'Masculino'
  return 'Unissex'
}

// ── Strip HTML e shortcodes WPBakery ─────────────────────────────────────────
function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/\[\/?\w[^\]]*\]/g, ' ')   // shortcodes [vc_row] etc
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── HTTP helper genérico ──────────────────────────────────────────────────────
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

// ── Bling API v3 ──────────────────────────────────────────────────────────────
function blingGet(path) {
  return httpReq('GET', `https://www.bling.com.br/Api/v3${path}`, { Authorization: `Bearer ${BLING_TOKEN}` })
}

function blingPut(path, body) {
  return httpReq('PUT', `https://www.bling.com.br/Api/v3${path}`, { Authorization: `Bearer ${BLING_TOKEN}` }, body)
}

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

// ── WooCommerce API ───────────────────────────────────────────────────────────
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

async function retryRequest(fn, retries = 4, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (i === retries - 1) return { status: 0, body: { error: e.message } }
      console.log(`     ⟳  Retry ${i + 1}/${retries} após erro: ${e.code || e.message}`)
      await sleep(delayMs * (i + 1))
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '🔍  DRY RUN\n' : '🚀  Atualizando produtos Bling...\n')

  // ── 1. Busca produtos Bling ────────────────────────────────────────────────
  console.log('📦  Buscando produtos no Bling...')
  const blingProducts = await blingGetAll('/produtos')
  console.log(`   ${blingProducts.length} produtos encontrados\n`)

  // ── 2. Busca produtos WooCommerce (descrição + EAN) ────────────────────────
  let wcEanMap  = {} // { skuVariacao: ean }
  let wcDescMap = {} // { skuProdutoPai: descricaoLonga }

  console.log('🔄  Buscando produtos WooCommerce (descrição + EAN)...')
  const wcProducts = await wcGetAll('products?type=variable')
  for (const p of wcProducts) {
    // Descrição longa → mapa por SKU
    if (p.sku) {
      wcDescMap[p.sku] = stripHtml(p.description || '')
    }
    // EAN das variações
    if (!SKIP_EAN) {
      const vars = await wcGetAll(`products/${p.id}/variations`)
      for (const v of vars) {
        if (v.sku && v.global_unique_id) {
          wcEanMap[v.sku] = v.global_unique_id
        }
      }
    }
  }
  // Também busca produtos simples (acessórios: toucas, faixas, coletes)
  const wcSimples = await wcGetAll('products?type=simple')
  for (const p of wcSimples) {
    if (p.sku) wcDescMap[p.sku] = stripHtml(p.description || '')
  }

  console.log(`   ${Object.keys(wcDescMap).length} descrições mapeadas`)
  console.log(`   ${Object.keys(wcEanMap).length} EANs mapeados\n`)

  // ── 3. Atualiza cada produto Bling ─────────────────────────────────────────
  console.log('✏️   Atualizando produtos...')
  let prodOk = 0, prodErr = 0

  for (const p of blingProducts) {
    const nome   = p.nome || ''
    const modelo = derivarModelo(nome)
    const genero = derivarGenero(nome)

    // Filtra somente produtos pai se --only-pais
    const isPai = !/Cor:/i.test(nome) && !/Tamanho:/i.test(nome)
    if (ONLY_PAIS && !isPai) continue

    console.log(`  → ${nome}`)

    if (!DRY_RUN) {
      // GET produto completo para não perder campos obrigatórios
      const { body: full } = await retryRequest(() => blingGet(`/produtos/${p.id}`))
      const current = full?.data || {}
      await sleep(300)

      const isPaiFormato = current.formato === 'V'

      const payload = {
        ...current,
        marca:       'Jaleca',
        pesoBruto:   DIMS.pesoBruto,
        pesoLiquido: DIMS.pesoLiquido,
        dimensoes: {
          ...(current.dimensoes || {}),
          largura:      DIMS.largura,
          altura:       DIMS.altura,
          profundidade: DIMS.profundidade,
        },
      }

      // Descrição longa do WooCommerce → descricaoCurta (é o campo que o Bling usa no anúncio ML)
      if (isPai) {
        const sku  = current.codigo || ''
        const desc = wcDescMap[sku]
        if (desc) {
          payload.descricaoCurta = desc
          console.log(`     Descrição: ${desc.slice(0, 80).replace(/\n/g,' ')}…`)
        } else {
          console.log(`     ⚠️  Sem descrição WC para SKU "${current.codigo}"`)
        }
      }
      // Modelo derivado → guardado em observacoes para referência (Bling não tem campo modelo/genero)
      if (isPai) {
        const obs = `Modelo: ${modelo} | Gênero: ${genero}`
        payload.observacoes = obs
        console.log(`     ${obs}`)
      }

      // Remove campos que a API não aceita no PUT
      delete payload.id
      delete payload.dataCriacao
      delete payload.dataAlteracao
      delete payload.estrutura
      // Produtos pai (formato=V) precisam manter variacoes no payload
      if (!isPaiFormato) delete payload.variacoes
      delete payload.midia
      delete payload.anexos

      // Para produtos pai: envia variacoes completas do GET, só remove campos de auditoria
      if (isPaiFormato && Array.isArray(payload.variacoes)) {
        payload.variacoes = payload.variacoes.map(v => {
          const vv = { ...v }
          delete vv.dataCriacao
          delete vv.dataAlteracao
          delete vv.produto   // referência circular
          delete vv.imagens
          delete vv.anexos
          return vv
        })
      }

      const res = await retryRequest(() => blingPut(`/produtos/${p.id}`, payload))
      if (res.status >= 200 && res.status < 300) {
        prodOk++
      } else {
        console.log(`     ⚠️  Erro ${res.status}: ${JSON.stringify(res.body).slice(0, 400)}`)
        prodErr++
      }
      await sleep(500)
    } else {
      const sku  = p.codigo || ''
      const desc = wcDescMap[sku]
      if (isPai && desc) console.log(`     descricaoCurta (ML desc): ${desc.slice(0,80).replace(/\n/g,' ')}…`)
      if (isPai) console.log(`     Modelo: ${modelo} | Gênero: ${genero}`)
      prodOk++
    }

    // ── 3b. EAN nas variações ──────────────────────────────────────────────
    if (!SKIP_EAN) {
      const varRes = await retryRequest(() => blingGet(`/produtos/${p.id}/variacoes?limite=100`))
      const vars = varRes?.body?.data || []

      for (const v of vars) {
        const sku = v.codigo || ''
        const ean = wcEanMap[sku]
        if (!ean) continue
        if (v.codigosBarras?.length > 0) continue

        console.log(`     EAN SKU ${sku}: ${ean}`)
        if (!DRY_RUN) {
          await retryRequest(() => blingPut(`/produtos/${p.id}/variacoes/${v.id}`, { codigosBarras: [{ codigo: ean, tipo: 'EAN13', principal: true }] }))
          await sleep(400)
        }
      }
    }
  }

  console.log(`\n   Produtos: ${prodOk} ok, ${prodErr} erros\n`)

  // ── 4. Atualiza anúncios ───────────────────────────────────────────────────
  if (!SKIP_ADS) {
    console.log('📢  Buscando anúncios ML...')
    const anuncios = await blingGetAll(`/anuncios?tipo=mercadolivre&idLoja=${ML_LOJA_ID}`)
    console.log(`   ${anuncios.length} anúncios encontrados`)

    let adsOk = 0, adsErr = 0

    for (const a of anuncios) {
      const payload = {
        idCategoriaMl: ML_CATEGORIA_ID,
        garantia: { tipo: 'seller', periodo: 7, unidade: 'days' },
        frete: { gratis: true },
      }

      console.log(`  → ${a.titulo || a.id}`)

      if (!DRY_RUN) {
        const res = await retryRequest(() => blingPut(`/anuncios/${a.id}`, payload))
        if (res.status >= 200 && res.status < 300) {
          adsOk++
        } else {
          console.log(`     ⚠️  Erro ${res.status}: ${JSON.stringify(res.body).slice(0, 400)}`)
          adsErr++
        }
        await sleep(500)
      } else {
        adsOk++
      }
    }

    console.log(`\n   Anúncios: ${adsOk} ok, ${adsErr} erros`)
  }

  console.log('\n✅  Concluído')
  if (DRY_RUN) console.log('   (nada foi salvo — remova --dry-run para aplicar)')
}

main().catch(err => { console.error('❌', err); process.exit(1) })
