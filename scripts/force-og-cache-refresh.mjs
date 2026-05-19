#!/usr/bin/env node
// Força refresh de cache OG (WhatsApp/Facebook/Twitter) em TODAS as
// páginas de produto. Combina:
// 1. GET da URL og-image (força regenerar PNG no Vercel)
// 2. POST Facebook Scrape API (força Meta re-buscar metadados)
//
// Uso: node scripts/force-og-cache-refresh.mjs

import { readFileSync } from 'fs'

const META_TOKEN = 'EAASQD9N7C3EBRbqaaZCWi37m5P0lspk5tUcaTmo7VPlTpvEtRlQCry5DGFmTiCYyjeopsXmuFyDGl6QBmjIvopAwobpqbtCZCMCIm9ccKL8DF5YFZAA3gSo9Gm4DVydrnumuu2OrfvjpZBEhaRFZATR5HVMSmrTGbfeA4zo6QzxZAFHQEApowYsDIC2z6ePQZDZD'
const WP_AUTH = `Basic ${Buffer.from('contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q').toString('base64')}`
const BASE = 'https://jaleca.com.br'

console.log('📥 Buscando slugs dos produtos publicados...')
const wcRes = await fetch('https://wp.jaleca.com.br/wp-json/wc/v3/products?per_page=100&status=publish&_fields=slug',
  { headers: { Authorization: WP_AUTH } })
const products = await wcRes.json()
console.log(`Encontrados ${products.length} produtos\n`)

let okCount = 0, errCount = 0
for (const [i, p] of products.entries()) {
  const url = `${BASE}/produto/${p.slug}`
  const ogUrl = `${url}/opengraph-image`
  process.stdout.write(`[${i+1}/${products.length}] ${p.slug} ... `)

  try {
    // 1) Força Next.js regerar o og-image (cache busting com timestamp)
    await fetch(`${ogUrl}?_t=${Date.now()}`, { method: 'GET' })

    // 2) Força Facebook re-scrape
    const fbUrl = `https://graph.facebook.com/v20.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${META_TOKEN}`
    const fbRes = await fetch(fbUrl, { method: 'POST' })
    const fbJson = await fbRes.json()
    if (fbJson.error) {
      console.log(`❌ FB: ${fbJson.error.message}`)
      errCount++
    } else {
      console.log('✅')
      okCount++
    }
  } catch (e) {
    console.log(`❌ ${e.message}`)
    errCount++
  }

  // Throttle 1.5s — Facebook aceita ~10 calls/sec mas conservador
  await new Promise(r => setTimeout(r, 1500))
}

console.log(`\n✅ ${okCount} refreshed | ❌ ${errCount} erros`)
console.log('\n💡 WhatsApp pode ainda mostrar foto antiga em alguns devices por até 48h')
console.log('   pra forçar instantâneo num device específico: abra o link no Chrome desktop antes,')
console.log('   depois cole no WhatsApp — ele puxa do scrape fresco.')
