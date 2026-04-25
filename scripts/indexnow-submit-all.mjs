// One-time script to submit all existing URLs to IndexNow
const KEY = '96f4dccdc25fd5e8303a0563fbef9c2a'
const HOST = 'jaleca.com.br'
const BASE = 'https://jaleca.com.br'
const WP_API = 'https://wp.jaleca.com.br/wp-json/wp/v2'

async function getPosts() {
  const urls = []
  let page = 1
  while (true) {
    const res = await fetch(`${WP_API}/posts?per_page=100&page=${page}&_fields=slug&status=publish`)
    if (!res.ok) break
    const posts = await res.json()
    if (!posts.length) break
    posts.forEach(p => urls.push(`${BASE}/blog/${p.slug}`))
    if (posts.length < 100) break
    page++
  }
  return urls
}

async function getProducts() {
  const res = await fetch(`${BASE}/api/feed/google-shopping`)
  const xml = await res.text()
  const slugs = [...xml.matchAll(/jaleca\.com\.br\/produto\/([^<"]+)/g)].map(m => `${BASE}/produto/${m[1]}`)
  return [...new Set(slugs)]
}

const staticUrls = [
  '/', '/produtos', '/blog', '/faq', '/sobre', '/contato', '/nossas-lojas',
  '/categoria/jalecos', '/categoria/jalecos-femininos', '/categoria/jalecos-masculinos',
  '/categoria/domas', '/categoria/conjuntos', '/categoria/acessorios',
  '/jaleco-dentista', '/jaleco-enfermeiro', '/jaleco-medico',
  '/jaleco-fisioterapeuta', '/jaleco-nutricionista', '/jaleco-biomedico',
  '/jaleco-farmaceutico', '/jaleco-veterinario', '/jaleco-podologo',
  '/jaleco-cabeleireiro', '/jaleco-barbeiro', '/jaleco-esteticista',
  '/jaleco-massagista', '/jaleco-tatuador', '/jaleco-cozinheiro',
  '/jaleco-churrasqueiro', '/jaleco-sushiman', '/jaleco-professor',
  '/jaleco-vendedor', '/jaleco-advogado', '/jaleco-pastor',
  '/jaleco-psicologa', '/jaleco-secretaria', '/jaleco-dona-casa',
  // Novas landings 25/04/2026
  '/jaleco-medicina', '/jaleco-fisioterapia', '/jaleco-odontologia',
  '/jaleco-nutricao', '/jaleco-farmacia', '/scrub-enfermagem',
  '/jaleco-universitario', '/uniformes-profissionais-saude', '/uniformes-beleza',
  '/uniformes-gastronomia', '/uniformes-servicos', '/uniformes-escritorio',
].map(p => `${BASE}${p}`)

console.log('Coletando posts do blog...')
const posts = await getPosts()
console.log(`${posts.length} posts encontrados`)

console.log('Coletando produtos...')
const products = await getProducts()
console.log(`${products.length} produtos encontrados`)

const urlList = [...new Set([...staticUrls, ...posts, ...products])]
console.log(`Total: ${urlList.length} URLs para submeter`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, urlList }),
})

console.log(`IndexNow response: ${res.status} ${res.statusText}`)
if (res.status === 200) console.log('✅ Todas as URLs submetidas com sucesso!')
else if (res.status === 202) console.log('✅ Aceito para processamento!')
else console.log('⚠️ Verifique o status acima')
