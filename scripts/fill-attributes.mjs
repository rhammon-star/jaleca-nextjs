/**
 * fill-attributes.mjs
 * Adiciona Marca, Modelo e Gênero como atributos em todos os produtos WooCommerce.
 *
 * Uso:
 *   node scripts/fill-attributes.mjs
 *   node scripts/fill-attributes.mjs --dry-run
 */

import https from 'https'

const _rawUrl = process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_BASE = _rawUrl.replace(/\/wc\/v3\/?$/, '')
const WC_CK   = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_CS   = process.env.WOOCOMMERCE_CONSUMER_SECRET
const DRY_RUN = process.argv.includes('--dry-run')

if (!WC_CK || !WC_CS) {
  console.error('❌  Defina WOOCOMMERCE_CONSUMER_KEY e WOOCOMMERCE_CONSUMER_SECRET')
  process.exit(1)
}

// ── Derivar Modelo do nome do produto ─────────────────────────────────────────
function derivarModelo(nome) {
  let m = nome
  m = m.replace(/\s*-\s*Jaleca\s*$/i, '')        // remove " - Jaleca"
  m = m.replace(/\s*(Feminino|Masculino|Unissex)\s*/gi, ' ') // remove gênero
  m = m.replace(/^\s*(Jaleco|Dólmã|Dolma|Conjunto|Touca de|Touca|Faixa de Cabelo|Faixa|Colete|Macacão|Avental)\s*/i, '')
  m = m.replace(/\s+/g, ' ').trim()
  // Capitalizar primeira letra
  m = m.charAt(0).toUpperCase() + m.slice(1)
  return m || nome.split(' ')[0]
}

// ── Derivar Gênero do nome do produto ─────────────────────────────────────────
function derivarGenero(nome) {
  if (/feminino/i.test(nome))  return 'Feminino'
  if (/masculino/i.test(nome)) return 'Masculino'
  return 'Unissex'
}

// ── HTTP ──────────────────────────────────────────────────────────────────────
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')
    const url  = new URL(WC_BASE + '/wc/v3' + path)
    const data = body ? JSON.stringify(body) : null

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: 'Basic ' + auth,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }

    const req = https.request(options, res => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const ru = new URL(res.headers.location)
        const ro = { ...options, hostname: ru.hostname, path: ru.pathname + ru.search }
        const req2 = https.request(ro, res2 => {
          let raw = ''
          res2.on('data', c => (raw += c))
          res2.on('end', () => { try { resolve(JSON.parse(raw)) } catch { resolve(raw) } })
        })
        req2.on('error', reject)
        if (data) req2.write(data)
        req2.end()
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

async function getAll(path) {
  const items = []
  let page = 1
  while (true) {
    const sep   = path.includes('?') ? '&' : '?'
    const batch = await request('GET', `/${path}${sep}per_page=100&page=${page}`)
    if (!Array.isArray(batch) || batch.length === 0) break
    items.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return items
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '🔍  DRY RUN\n' : '🚀  Adicionando atributos Marca / Modelo / Gênero...\n')

  const products = await getAll('products?per_page=100')
  console.log(`📦  ${products.length} produtos encontrados\n`)

  let updated = 0
  let skipped = 0

  for (const p of products) {
    const modelo = derivarModelo(p.name)
    const genero = derivarGenero(p.name)

    // Atributos já existentes no produto
    const existingNames = (p.attributes || []).map(a => a.name.toLowerCase())
    const jaTemMarca  = existingNames.includes('marca')
    const jaTemModelo = existingNames.includes('modelo')
    const jaTemGenero = existingNames.includes('gênero') || existingNames.includes('genero')

    if (jaTemMarca && jaTemModelo && jaTemGenero) {
      console.log(`  ⏩  ${p.name} — já tem os 3 atributos`)
      skipped++
      continue
    }

    // Monta lista de atributos mantendo os existentes e adicionando os novos
    const novosAttrs = [...(p.attributes || [])]

    if (!jaTemMarca)  novosAttrs.push({ name: 'Marca',  options: ['Jaleca'],  visible: true, variation: false })
    if (!jaTemModelo) novosAttrs.push({ name: 'Modelo', options: [modelo],    visible: true, variation: false })
    if (!jaTemGenero) novosAttrs.push({ name: 'Gênero', options: [genero],    visible: true, variation: false })

    console.log(`  ✏️  ${p.name}`)
    console.log(`       Marca: Jaleca | Modelo: ${modelo} | Gênero: ${genero}`)

    if (!DRY_RUN) {
      const res = await request('PUT', `/products/${p.id}`, { attributes: novosAttrs })
      if (res.id) {
        updated++
      } else {
        console.log(`       ⚠️  Erro:`, JSON.stringify(res).slice(0, 100))
      }
    } else {
      updated++
    }
  }

  console.log(`\n✅  Concluído`)
  console.log(`   Atualizados: ${updated}`)
  console.log(`   Já tinham:   ${skipped}`)
  if (DRY_RUN) console.log('\n   (nada salvo — remova --dry-run para aplicar)')
}

main().catch(err => { console.error('❌', err); process.exit(1) })
