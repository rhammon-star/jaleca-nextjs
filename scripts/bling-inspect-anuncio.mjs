/**
 * bling-inspect-anuncio.mjs
 * Inspeciona um produto pai e seu anúncio ML existente para entender
 * a estrutura de atributos (modelo, gênero, garantia, tabela de medidas).
 */
import https from 'https'

const BLING_TOKEN = process.env.BLING_ACCESS_TOKEN
const ML_LOJA_ID  = 206034318

if (!BLING_TOKEN) { console.error('❌  BLING_ACCESS_TOKEN'); process.exit(1) }

function blingGet(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://www.bling.com.br/Api/v3${path}`)
    const req = https.request({
      hostname: url.hostname, port: 443,
      path: url.pathname + url.search,
      method: 'GET', timeout: 20000,
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

function blingPut(path, body) {
  return new Promise((resolve, reject) => {
    const url  = new URL(`https://www.bling.com.br/Api/v3${path}`)
    const data = JSON.stringify(body)
    const req  = https.request({
      hostname: url.hostname, port: 443,
      path: url.pathname + url.search,
      method: 'PUT', timeout: 20000,
      headers: {
        Authorization: `Bearer ${BLING_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
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
    req.write(data)
    req.end()
  })
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  // 1. Pega primeiro produto pai
  console.log('📦  Buscando produtos pai...')
  const todos = await blingGetAll('/produtos')
  const pais  = todos.filter(p => !/Cor:/i.test(p.nome) && !/Tamanho:/i.test(p.nome))
  const primeiro = pais[0]
  console.log(`   Primeiro pai: ${primeiro.nome} (id=${primeiro.id})\n`)

  // 2. GET completo do produto
  const { body: prodFull } = await blingGet(`/produtos/${primeiro.id}`)
  const prod = prodFull?.data || {}
  console.log('── Campos do produto (GET completo):')
  console.log(JSON.stringify(prod, null, 2).slice(0, 3000))
  console.log()
  await sleep(400)

  // 3. Verifica campo `atributos` e campos ML específicos
  console.log('── Campos relevantes:')
  console.log('  marca:     ', prod.marca)
  console.log('  modelo:    ', prod.modelo)
  console.log('  genero:    ', prod.genero)
  console.log('  atributos: ', JSON.stringify(prod.atributos))
  console.log()

  // 4. GET anúncios existentes
  console.log('📢  Buscando anúncios ML...')
  const anuncios = await blingGetAll(`/anuncios?tipo=mercadolivre&idLoja=${ML_LOJA_ID}`)
  console.log(`   ${anuncios.length} anúncios encontrados`)

  if (anuncios.length > 0) {
    const primeiro_ad = anuncios[0]
    console.log(`\n── GET /anuncios/${primeiro_ad.id} (completo):`)
    await sleep(300)
    const { body: adFull } = await blingGet(`/anuncios/${primeiro_ad.id}`)
    const ad = adFull?.data || adFull
    console.log(JSON.stringify(ad, null, 2).slice(0, 4000))

    // Campos relevantes do anúncio
    console.log('\n── Campos relevantes do anúncio:')
    const adData = adFull?.data || {}
    console.log('  garantia:         ', JSON.stringify(adData.garantia))
    console.log('  atributos:        ', JSON.stringify(adData.atributos))
    console.log('  atributosMl:      ', JSON.stringify(adData.atributosMl))
    console.log('  tabelasMedidas:   ', JSON.stringify(adData.tabelasMedidas))
    console.log('  idCategoriaMl:    ', adData.idCategoriaMl)
    console.log('  frete:            ', JSON.stringify(adData.frete))
    console.log('  status:           ', adData.status)
  }

  // 5. Testa se PUT /anuncios/:id com atributos funciona
  if (anuncios.length > 0) {
    const testAd = anuncios[0]
    console.log(`\n── Testando PUT /anuncios/${testAd.id} com garantia + atributos:`)
    await sleep(400)

    // Primeiro verifica o anúncio atual completo para não sobrescrever campos
    const { body: currentAdFull } = await blingGet(`/anuncios/${testAd.id}`)
    const currentAd = currentAdFull?.data || {}

    const putBody = {
      ...currentAd,
      garantia: { tipo: 'seller', periodo: 7, unidade: 'days' },
      atributos: [
        { id: 'BRAND', valor: 'Jaleca' },
        { id: 'MODEL', valor: 'Jaleco Feminino Gourmet' },
        { id: 'GENDER', valor: 'Feminino' },
      ],
    }
    // Remove campos de auditoria
    delete putBody.id
    delete putBody.dataCriacao
    delete putBody.dataAlteracao

    const putRes = await blingPut(`/anuncios/${testAd.id}`, putBody)
    console.log(`   Status: ${putRes.status}`)
    console.log(`   Body: ${JSON.stringify(putRes.body).slice(0, 600)}`)
  }

  console.log('\n✅  Inspeção concluída')
}

main().catch(e => { console.error('❌', e); process.exit(1) })
