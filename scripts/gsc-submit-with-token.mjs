#!/usr/bin/env node
/** Submit massivo via access token do OAuth Playground (1h validade) */

const ACCESS_TOKEN = 'ya29.a0Aa7MYiomOsXIAx5wNPO15DB7hGcOnUXfwjPxWLj5ep8EUutf324DYdir_ETxO6H7300Wt_fYOMjF8Bk9t62_H3I9tu44jz9nFaL9qDbKpZO5I9k-byTttr--KXkV42zkd0dioDhcF0N05ZdeO5t8Q8YaI4DfbsdaLDKwX7za3RFTk4pFb_l4mT41bumqilGJwVnb3n8aCgYKAWUSARISFQHGX2MisDCB2kcIthIjLvQrcUxKwg0206'

const BASE = 'https://jaleca.com.br'

const STATIC_URLS = [
  // 6 landings novas
  '/jaleco-medicina', '/jaleco-fisioterapia', '/jaleco-odontologia',
  '/jaleco-nutricao', '/jaleco-farmacia', '/scrub-enfermagem',
  // Renomeadas
  '/jaleco-psicologa', '/jaleco-medico', '/jaleco-veterinario', '/jaleco-farmaceutico',
  '/jaleco-enfermeiro', '/jaleco-enfermagem', '/jaleco-dentista', '/jaleco-fisioterapeuta',
  '/jaleco-nutricionista', '/jaleco-esteticista', '/jaleco-cabeleireiro', '/jaleco-barbeiro',
  '/jaleco-podologo', '/jaleco-biomedico', '/jaleco-massagista', '/jaleco-tatuador',
  '/jaleco-cozinheiro', '/jaleco-churrasqueiro', '/jaleco-sushiman', '/jaleco-professor',
  '/jaleco-vendedor', '/jaleco-advogado', '/jaleco-pastor', '/jaleco-secretaria',
  '/jaleco-dona-casa', '/loja-jaleco', '/melhor-marca-jaleco', '/uniformes-profissionais-saude',
  // Outras existentes
  '/jaleco-feminino', '/jaleco-masculino', '/jaleco-branco', '/jaleco-preto',
  '/jaleco-preto-feminino', '/jaleco-colorido', '/jaleco-premium', '/jaleco-plus-size',
  '/jaleco-estiloso', '/jaleco-medico-feminino', '/jaleco-dentista-feminino',
  '/jaleco-enfermagem-feminino', '/jaleco-universitario', '/scrub-feminino', '/scrub-medico',
  '/pijama-cirurgico-feminino', '/comprar-jaleco-online',
  // Conjuntos/Dolmãs/Uniformes
  '/conjunto-advogado', '/conjunto-pastor', '/conjunto-psicologa', '/conjunto-farmaceutico',
  '/dolma-churrasqueiro', '/dolma-cozinheiro', '/dolma-sushiman', '/uniforme-professor',
  // Páginas core
  '/', '/produtos', '/blog', '/faq', '/sobre', '/contato', '/nossas-lojas',
  '/categoria/jalecos', '/categoria/jalecos-femininos', '/categoria/jalecos-masculinos',
  '/categoria/conjuntos', '/categoria/domas', '/categoria/acessorios',
  // Top 15 cidades
  '/cidade/sao-paulo', '/cidade/rio-de-janeiro', '/cidade/belo-horizonte',
  '/cidade/brasilia', '/cidade/salvador', '/cidade/fortaleza', '/cidade/curitiba',
  '/cidade/recife', '/cidade/porto-alegre', '/cidade/goiania', '/cidade/manaus',
  '/cidade/belem', '/cidade/campinas', '/cidade/florianopolis', '/cidade/uberlandia',
]

async function getBlogSlugs() {
  const slugs = []
  for (let page = 1; page < 10; page++) {
    const res = await fetch(`https://wp.jaleca.com.br/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug&status=publish`)
    if (!res.ok) break
    const posts = await res.json()
    if (!posts.length) break
    posts.forEach(p => slugs.push(`/blog/${p.slug}`))
    if (posts.length < 100) break
  }
  return slugs
}

async function submit(url) {
  const r = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  if (r.ok) return { ok: true }
  const err = await r.json().catch(() => ({}))
  return { ok: false, status: r.status, err: err.error?.message || JSON.stringify(err).slice(0, 100) }
}

async function main() {
  console.log('🔍 Buscando blog posts...')
  const blogPaths = await getBlogSlugs()
  console.log(`   ${blogPaths.length} posts`)

  const all = [...STATIC_URLS, ...blogPaths].map(p => p.startsWith('http') ? p : `${BASE}${p}`)
  console.log(`📤 Total: ${all.length} URLs\n`)

  let ok = 0, fail = 0
  const errors = []
  for (let i = 0; i < all.length; i++) {
    const url = all[i]
    const r = await submit(url)
    if (r.ok) {
      ok++
      if (i % 10 === 0) console.log(`  [${i+1}/${all.length}] ✅ ${url}`)
    } else {
      fail++
      errors.push({ url, err: r.err })
      console.log(`  [${i+1}/${all.length}] ❌ ${url} — ${r.err}`)
      if (r.status === 429) {
        console.log('  ⏸  Rate limit. Aguardando 30s...')
        await new Promise(r => setTimeout(r, 30000))
      }
      if (r.status === 401 || r.status === 403) {
        console.log('  🛑 Token inválido/expirado. Abortando.')
        break
      }
    }
    await new Promise(r => setTimeout(r, 200)) // 5/sec rate
  }

  console.log(`\n📊 Resultado: ✅ ${ok} sucesso · ❌ ${fail} falhas`)
  if (errors.length > 0 && errors.length < 10) {
    console.log('\nErros:')
    errors.forEach(e => console.log(`  ${e.url}: ${e.err}`))
  }
}

main().catch(e => console.error('FATAL:', e.message))
