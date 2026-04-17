/**
 * bling-debug-anuncios.mjs
 * Diagnóstico: descobre como os anúncios estão acessíveis na API Bling v3
 */

import https from 'https'

const BLING_TOKEN = process.env.BLING_ACCESS_TOKEN
if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN não encontrado'); process.exit(1) }

function blingGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://www.bling.com.br/Api/v3${path}`)
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      timeout: 20000,
      headers: { Authorization: `Bearer ${BLING_TOKEN}`, 'Content-Type': 'application/json' },
    }, res => {
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    req.on('timeout', () => req.destroy(new Error('TIMEOUT')))
    req.on('error', reject)
    req.end()
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('🔍  Diagnóstico anúncios — buscando idLoja e tipo\n')

  // 1. Tentativas para listar lojas/canais conectados
  const endpointsLojas = [
    '/lojas',
    '/canais/vendas',
    '/integracoes',
    '/integracoes/lojas',
    '/marketplaces',
    '/contas/contatos',
  ]
  for (const ep of endpointsLojas) {
    const r = await blingGet(`${ep}?pagina=1&limite=20`)
    if (r.status !== 404) {
      console.log(`── GET ${ep} → status ${r.status}`)
      console.log(JSON.stringify(r.body, null, 2).slice(0, 600))
      console.log()
    }
    await sleep(300)
  }

  // 2. Testa tipo=mercadolivre com idLoja 1..10 (força bruta pequena)
  console.log('── Testando tipo=mercadolivre com idLoja 1..20 ──')
  for (let id = 1; id <= 20; id++) {
    const r = await blingGet(`/anuncios?tipo=mercadolivre&idLoja=${id}&pagina=1&limite=5`)
    if (r.status !== 400 && r.status !== 404) {
      console.log(`idLoja=${id} → status ${r.status}: ${JSON.stringify(r.body).slice(0, 300)}`)
    } else {
      const msg = r.body?.error?.fields?.[0]?.msg || r.body?.error?.message || ''
      // Se não é "ID da loja não foi informado" ou "tipo não informado", é interessante
      if (!msg.includes('ID da loja') && !msg.includes('tipo de integração')) {
        console.log(`idLoja=${id} → status ${r.status}: ${msg}`)
      }
    }
    await sleep(200)
  }

  // 3. Testa tipo numérico (alguns sistemas usam números)
  console.log('\n── Testando tipo=11 (ML numérico) com idLoja 1..5 ──')
  for (let id = 1; id <= 5; id++) {
    const r = await blingGet(`/anuncios?tipo=11&idLoja=${id}&pagina=1&limite=5`)
    if (r.status < 400) {
      console.log(`tipo=11 idLoja=${id} → status ${r.status}: ${JSON.stringify(r.body).slice(0, 300)}`)
    }
    await sleep(200)
  }

  console.log('\n✅  Diagnóstico concluído')
  console.log('\n⚠️  Se todos os testes acima retornaram 400/404, vá em:')
  console.log('   Bling → Canais de Venda → Mercado Livre → e anote o ID da conta')
}

main().catch(err => { console.error('❌', err); process.exit(1) })
