/**
 * Jaleca — Cache Warming Script
 * Visita todas as páginas de produto após o deploy para pré-construir o ISR.
 * Uso: node scripts/warm-cache.mjs
 */

const SITE_URL      = 'https://jaleca.com.br'
const GRAPHQL_URL   = 'https://wp.jaleca.com.br/graphql'
const DELAY_MS      = 1200 // pausa entre requisições para não sobrecarregar o WordPress

async function getSlugs() {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query { products(first: 100) { nodes { slug } } }` }),
  })
  const json = await res.json()
  return json.data.products.nodes.map(n => n.slug)
}

async function warmPage(slug) {
  const url = `${SITE_URL}/produto/${slug}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Jaleca-Cache-Warmer/1.0' } })
    console.log(`[${res.status}] ${url}`)
  } catch (e) {
    console.error(`[ERR] ${url} — ${e.message}`)
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function warmStaticPages() {
  const pages = [
    '/',
    '/produtos',
    '/categoria/jalecos-femininos',
    '/categoria/jalecos-masculinos',
    '/categoria/conjuntos',
    '/categoria/domas',
  ]
  for (const path of pages) {
    try {
      const res = await fetch(`${SITE_URL}${path}`, { headers: { 'User-Agent': 'Jaleca-Cache-Warmer/1.0' } })
      console.log(`[${res.status}] ${SITE_URL}${path}`)
    } catch (e) {
      console.error(`[ERR] ${SITE_URL}${path} — ${e.message}`)
    }
    await sleep(500)
  }
}

async function main() {
  console.log('Aquecendo páginas principais...')
  await warmStaticPages()

  console.log('\nBuscando slugs dos produtos...')
  const slugs = await getSlugs()
  console.log(`${slugs.length} produtos encontrados. Iniciando aquecimento...\n`)

  for (let i = 0; i < slugs.length; i++) {
    await warmPage(slugs[i])
    if (i < slugs.length - 1) await sleep(DELAY_MS)
  }

  console.log('\nAquecimento concluído!')
}

main().catch(err => { console.error(err); process.exit(1) })
