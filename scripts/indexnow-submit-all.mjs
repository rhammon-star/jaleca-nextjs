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
  '/jaleco-para-dentista', '/jaleco-para-enfermeiro', '/jaleco-para-medico',
  '/jaleco-para-fisioterapeuta', '/jaleco-para-nutricionista', '/jaleco-para-biomedico',
  '/jaleco-para-farmaceutico', '/jaleco-para-veterinario', '/jaleco-para-podologo',
  '/jaleco-para-cabeleireiro', '/jaleco-para-barbeiro', '/jaleco-para-esteticista',
  '/jaleco-para-massagista', '/jaleco-para-tatuador', '/jaleco-para-cozinheiro',
  '/jaleco-para-churrasqueiro', '/jaleco-para-sushiman', '/jaleco-para-professor',
  '/jaleco-para-vendedor', '/jaleco-para-advogado', '/jaleco-para-pastor',
  '/jaleco-para-psicologa', '/jaleco-para-secretaria', '/jaleco-para-dona-de-casa',
  '/jaleco-universitario', '/uniformes-profissionais-para-saude', '/uniformes-beleza',
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
