#!/usr/bin/env node
// Smoke schema — valida JSON-LD nas URLs críticas.
// Falha = schema removido/quebrado em produção.
// Roda local + CI (daily + on push).

const BASE = process.env.SMOKE_BASE_URL || 'https://jaleca.com.br'

const CHECKS = [
  {
    url: '/',
    required: ['Organization', 'WebSite'],
  },
  {
    url: '/jaleco-feminino',
    required: ['Article', 'Product', 'FAQPage', 'BreadcrumbList'],
    extra: (schemas) => {
      const product = schemas.find(s => s['@type'] === 'Product')
      if (!product?.aggregateRating) return '❌ Product sem aggregateRating'
      const r = product.aggregateRating
      if (!r.ratingValue || (!r.reviewCount && !r.ratingCount))
        return '❌ aggregateRating sem ratingValue+reviewCount (rich snippet bloqueado)'
      return null
    },
  },
  {
    url: '/categoria/jalecos-femininos',
    required: ['CollectionPage', 'BreadcrumbList', 'Product'],
    extra: (schemas) => {
      const product = schemas.find(s => s['@type'] === 'Product')
      if (!product?.aggregateRating?.reviewCount)
        return '❌ AggregateRating sem reviewCount — perde estrela no SERP'
      return null
    },
  },
  {
    url: '/jaleco-medica',
    required: ['Article', 'FAQPage', 'BreadcrumbList'],
  },
]

async function fetchSchemas(url) {
  const res = await fetch(`${BASE}${url}`, { headers: { 'User-Agent': 'JalecaSmoke/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const matches = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  const schemas = []
  for (const m of matches) {
    try {
      const parsed = JSON.parse(m[1].replace(/\\u003c/g, '<'))
      if (Array.isArray(parsed)) schemas.push(...parsed)
      else schemas.push(parsed)
    } catch { /* ignore parse error */ }
  }
  return schemas
}

let failed = 0
for (const c of CHECKS) {
  process.stdout.write(`${c.url} ... `)
  try {
    const schemas = await fetchSchemas(c.url)
    const types = schemas.map(s => s['@type']).filter(Boolean)
    const missing = c.required.filter(t => !types.includes(t))
    if (missing.length) {
      console.error(`❌ schemas faltando: ${missing.join(', ')}`)
      failed++
      continue
    }
    if (c.extra) {
      const err = c.extra(schemas)
      if (err) { console.error(err); failed++; continue }
    }
    console.log(`✅ ${types.length} schemas, todos os ${c.required.length} obrigatórios OK`)
  } catch (e) {
    console.error(`❌ erro: ${e.message}`)
    failed++
  }
}

if (failed) {
  console.error(`\n🚨 ${failed}/${CHECKS.length} URLs com schema quebrado`)
  process.exit(1)
}
console.log(`\n✅ Todos os ${CHECKS.length} schemas OK`)
