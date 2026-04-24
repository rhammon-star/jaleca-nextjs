#!/usr/bin/env node
/**
 * Gera sitemap-priority.xml consultando APIs reais
 * WordPress API para blog + Sitemap para cidades/hubs
 */

import { writeFileSync } from 'fs'

const SITE_URL = 'https://jaleca.com.br'
const WP_API = 'https://wp.jaleca.com.br/wp-json/wp/v2'
const TODAY = new Date().toISOString().split('T')[0]

async function fetchBlogPosts() {
  const posts = []
  let page = 1

  while (true) {
    const response = await fetch(`${WP_API}/posts?per_page=100&page=${page}&status=publish`)
    if (!response.ok) break

    const batch = await response.json()
    if (!batch.length) break

    posts.push(...batch.map(p => `${SITE_URL}/blog/${p.slug}`))

    if (batch.length < 100) break
    page++
  }

  return posts
}

async function fetchSitemap() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`)
  const xml = await response.text()
  return xml
}

function extractUrls(xml, pattern) {
  const regex = new RegExp(pattern, 'g')
  const matches = xml.match(regex) || []
  return [...new Set(matches)] // Remove duplicatas
}

function buildXmlUrl(url, priority, changefreq = 'monthly') {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  console.log('🔍 Buscando dados reais...\n')

  // Blog posts direto da API WordPress
  console.log('📝 Buscando posts do blog (WordPress API)...')
  const blogUrls = await fetchBlogPosts()
  console.log(`  ✅ ${blogUrls.length} posts publicados`)

  // Cidades e Hubs do sitemap
  console.log('\n🗺️  Buscando cidades e hubs (Sitemap)...')
  const sitemap = await fetchSitemap()
  const cidadeUrls = extractUrls(sitemap, `${SITE_URL}/cidade/[^<]+`)
  const hubUrls = extractUrls(sitemap, `${SITE_URL}/(jaleco-para-|dolma-para-|conjunto-para-)[^<]+`)

  console.log(`  ✅ ${cidadeUrls.length} cidades`)
  console.log(`  ✅ ${hubUrls.length} hubs profissão`)

  const total = blogUrls.length + cidadeUrls.length + hubUrls.length
  console.log(`\n  📊 Total: ${total} URLs\n`)

  // Gerar XML
  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    `  <!-- PRIORIDADE MÁXIMA: Hubs Profissão (${hubUrls.length} URLs) -->`,
    ...hubUrls.map(url => buildXmlUrl(url, '1.0')),
    '',
    `  <!-- PRIORIDADE ALTA: Blog Posts (${blogUrls.length} URLs) -->`,
    ...blogUrls.map(url => buildXmlUrl(url, '0.9')),
    '',
    `  <!-- PRIORIDADE MÉDIA: Cidades (${cidadeUrls.length} URLs) -->`,
    ...cidadeUrls.map(url => buildXmlUrl(url, '0.8')),
    '',
    '</urlset>'
  ]

  const xml = xmlParts.join('\n')

  // Salvar arquivo
  const outputPath = 'public/sitemap-priority.xml'
  writeFileSync(outputPath, xml, 'utf-8')

  console.log(`✅ Sitemap gerado: ${outputPath}`)
  console.log(`📍 URL: ${SITE_URL}/sitemap-priority.xml\n`)
  console.log('📋 Resumo:')
  console.log(`   - ${hubUrls.length} hubs profissão (priority 1.0)`)
  console.log(`   - ${blogUrls.length} posts blog (priority 0.9)`)
  console.log(`   - ${cidadeUrls.length} cidades (priority 0.8)`)
  console.log(`   - ${total} URLs total\n`)
  console.log('🎯 Próximo passo: Adicionar no Google Search Console')
  console.log('   1. https://search.google.com/search-console')
  console.log('   2. Sitemaps → Adicionar sitemap-priority.xml')
}

main().catch(console.error)
