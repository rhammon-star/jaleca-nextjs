/**
 * bling-test-post-anuncio.mjs — fase 3
 * Tenta descobrir o campo correto para "tipo de integração"
 */
import https from 'https'

const BLING_TOKEN = process.env.BLING_ACCESS_TOKEN
const ML_LOJA_ID  = 206034318
const TEST_ID     = 16631806174

if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN'); process.exit(1) }

function req(method, urlStr, body = null) {
  return new Promise((resolve, reject) => {
    const url  = new URL(urlStr)
    const data = body ? JSON.stringify(body) : null
    const r = https.request({
      hostname: url.hostname, port: 443,
      path: url.pathname + url.search,
      method, timeout: 10000,
      headers: {
        Authorization: `Bearer ${BLING_TOKEN}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, res => {
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    r.on('timeout', () => r.destroy(new Error('TIMEOUT')))
    r.on('error', reject)
    if (data) r.write(data)
    r.end()
  })
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function result(label, r) {
  const codes = r.body?.error?.fields?.map(f => `[${f.code}]`).join('') || ''
  const s = r.status
  if (s >= 200 && s < 300) console.log(`✅  ${label} → ${s}: ${JSON.stringify(r.body).slice(0,200)}`)
  else if (codes === '[2]') console.log(`🔶  ${label} → ${s} ${codes}  (idLoja OK, só falta tipo)`)
  else console.log(`❌  ${label} → ${s} ${codes}`)
}

const BASE = 'https://www.bling.com.br/Api/v3'
const BASE_BODY = { idProduto: TEST_ID, idCategoriaMl: 'MLB277428', titulo: 'Teste Jaleco', preco: 280, condicao: 'novo' }

async function post(label, body) {
  await sleep(300)
  result(label, await req('POST', `${BASE}/anuncios`, body))
}
async function get(label, path) {
  await sleep(300)
  result(label, await req('GET', `${BASE}${path}`))
}

async function main() {
  console.log('🔬  Fase 3: campo tipo dentro de loja + outros nomes\n')

  // Testa sem tipo algum (só loja.id) — ver se erro muda
  await post('loja:{id} sem tipo', { ...BASE_BODY, loja: { id: ML_LOJA_ID } })

  // Nomes alternativos do campo tipo dentro de loja
  for (const k of ['tipoIntegracao', 'canal', 'marketplace', 'plataforma', 'nome', 'sigla', 'codigo', 'slug']) {
    await post(`loja:{id, ${k}:"mercadolivre"}`, { ...BASE_BODY, loja: { id: ML_LOJA_ID, [k]: 'mercadolivre' } })
    await post(`loja:{id, ${k}:"MercadoLivre"}`, { ...BASE_BODY, loja: { id: ML_LOJA_ID, [k]: 'MercadoLivre' } })
  }

  // Top-level com loja.id + nome alternativo para tipo
  console.log('\n── Top-level field names para tipo ────────────────')
  for (const k of ['tipoIntegracao', 'canal', 'marketplace', 'plataforma', 'idMarketplace', 'idCanal', 'nomeIntegracao']) {
    await post(`loja:{id} + ${k}:"mercadolivre"`, { ...BASE_BODY, loja: { id: ML_LOJA_ID }, [k]: 'mercadolivre' })
  }

  // Endpoints alternativos
  console.log('\n── Endpoints alternativos ──────────────────────────')
  await sleep(300); result('POST /anuncios/mercadolivre', await req('POST', `${BASE}/anuncios/mercadolivre`, { ...BASE_BODY, idLoja: ML_LOJA_ID }))
  await sleep(300); result(`POST /lojas/${ML_LOJA_ID}/anuncios`, await req('POST', `${BASE}/lojas/${ML_LOJA_ID}/anuncios`, BASE_BODY))
  await sleep(300); result('GET /lojas', await req('GET', `${BASE}/lojas?pagina=1&limite=10`))
  await sleep(300); result('GET /integracoes', await req('GET', `${BASE}/integracoes?pagina=1&limite=10`))

  // Swagger / docs
  console.log('\n── Documentação ────────────────────────────────────')
  await sleep(300); result('GET /swagger.json', await req('GET', `${BASE}/swagger.json`))
  await sleep(300); result('GET /api-docs', await req('GET', `${BASE}/api-docs`))

  console.log('\n✅  Concluído')
}
main().catch(e => { console.error('❌', e); process.exit(1) })
