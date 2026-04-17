/**
 * bling-create-anuncios-ml.mjs
 * Cria anúncios no Mercado Livre para todos os produtos pai (formato=V) do Bling
 * que ainda não têm anúncio ML.
 *
 * Uso:
 *   node scripts/bling-create-anuncios-ml.mjs
 *   node scripts/bling-create-anuncios-ml.mjs --dry-run
 */

import https from 'https'

const BLING_TOKEN = process.env.BLING_ACCESS_TOKEN
const DRY_RUN     = process.argv.includes('--dry-run')

// ML config
const ML_LOJA_ID     = 206034318
const ML_CATEGORIA   = 'MLB277428'   // Jalecos Escolares (única cat. de jaleco no ML BR)
const ML_CONDICAO    = 'novo'

if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN não encontrado'); process.exit(1) }

// ── HTTP ──────────────────────────────────────────────────────────────────────
function blingReq(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url  = new URL(`https://www.bling.com.br/Api/v3${path}`)
    const data = body ? JSON.stringify(body) : null
    const req  = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${BLING_TOKEN}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, res => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        return blingReq(method, res.headers.location.replace('https://www.bling.com.br/Api/v3', ''), body).then(resolve).catch(reject)
      }
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    req.on('timeout', () => req.destroy(new Error('TIMEOUT')))
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

const blingGet  = path       => blingReq('GET',  path)
const blingPost = (path, b)  => blingReq('POST', path, b)

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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function retryReq(fn, retries = 3, delayMs = 2000) {
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
  console.log(DRY_RUN ? '🔍  DRY RUN\n' : '🚀  Criando anúncios ML para todos os produtos...\n')

  // 1. Busca todos os produtos e filtra os pais pelo nome
  // Produtos pai: NÃO têm "Cor:" nem "Tamanho:" no nome
  // Produtos filhos (variações): têm "Cor:X;Tamanho:Y" no nome
  console.log('📦  Buscando produtos Bling...')
  const todos = await blingGetAll('/produtos')
  const paisList = todos.filter(p => !/Cor:/i.test(p.nome) && !/Tamanho:/i.test(p.nome))
  console.log(`   ${todos.length} total | ${paisList.length} produtos pai (sem Cor:/Tamanho: no nome)`)

  // Busca dados completos de cada pai (precisa de preco, nome completo, etc.)
  console.log('   Carregando detalhes dos produtos pai...')
  const pais = []
  for (const p of paisList) {
    const { body: full } = await retryReq(() => blingGet(`/produtos/${p.id}`))
    if (full?.data) pais.push(full.data)
    await sleep(300)
  }
  console.log(`   ${pais.length} produtos carregados\n`)

  // 2. Busca anúncios já existentes para não duplicar
  console.log('📢  Buscando anúncios ML existentes...')
  const existentes = await blingGetAll(`/anuncios?tipo=mercadolivre&idLoja=${ML_LOJA_ID}`)
  const idsComAnuncio = new Set(existentes.map(a => String(a.idProduto || a.produto?.id)).filter(Boolean))
  console.log(`   ${existentes.length} anúncios já existentes\n`)

  // 3. Cria anúncio para cada produto pai que ainda não tem
  let ok = 0, skip = 0, err = 0

  for (const prod of pais) {
    const jaExiste = idsComAnuncio.has(String(prod.id))

    if (jaExiste) {
      console.log(`  ⏩  ${prod.nome} — já tem anúncio`)
      skip++
      continue
    }

    console.log(`  → ${prod.nome}`)

    // Preço: produtos pai (formato=V) geralmente têm preco=0 — busca da primeira variação
    let preco = prod.preco || prod.precoVenda || 0
    if (!preco || preco <= 0) {
      const { body: varBody } = await retryReq(() => blingGet(`/produtos/${prod.id}/variacoes?limite=1`))
      const primeiraVar = varBody?.data?.[0]
      if (primeiraVar?.preco > 0) preco = primeiraVar.preco
      await sleep(200)
    }

    if (!preco || preco <= 0) {
      console.log(`     ⚠️  Sem preço — pulando`)
      err++
      continue
    }

    // Monta payload do anúncio
    // tipo e idLoja vão como query params na URL (não no body)
    const endpoint = `/anuncios?tipo=mercadolivre&idLoja=${ML_LOJA_ID}`
    const payload = {
      idProduto:     prod.id,
      idCategoriaMl: ML_CATEGORIA,
      titulo:        prod.nome.replace(/\s*-\s*Jaleca\s*$/i, '').trim(),
      preco,
      condicao:      ML_CONDICAO,
      garantia: {
        tipo:    'seller',
        periodo: 7,
        unidade: 'days',
      },
      frete: {
        gratis: true,
      },
    }

    if (!DRY_RUN) {
      const res = await retryReq(() => blingPost(endpoint, payload))
      if (res.status >= 200 && res.status < 300) {
        console.log(`     ✅  Criado: id=${res.body?.data?.id || '?'}`)
        ok++
      } else {
        console.log(`     ⚠️  Erro ${res.status}: ${JSON.stringify(res.body).slice(0, 400)}`)
        err++
      }
      await sleep(600)
    } else {
      console.log(`     (dry-run) payload: ${JSON.stringify(payload).slice(0, 120)}`)
      ok++
    }
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅  Criados:    ${ok}`)
  console.log(`⏩  Já tinham:  ${skip}`)
  if (err) console.log(`❌  Erros:      ${err}`)
  if (DRY_RUN) console.log('\n   (nada salvo — remova --dry-run para aplicar)')
}

main().catch(e => { console.error('❌', e); process.exit(1) })
