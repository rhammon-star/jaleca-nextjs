#!/usr/bin/env node
/**
 * Gera sitemap-priority.xml com TODAS as URLs prioritárias
 * Blog + Cidades + Hubs Profissão
 */

import { writeFileSync } from 'fs'

const SITE_URL = 'https://jaleca.com.br'
const TODAY = new Date().toISOString().split('T')[0]

async function fetchSitemap() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`)
  const xml = await response.text()
  return xml
}

function extractUrls(xml, pattern) {
  const regex = new RegExp(pattern, 'g')
  const matches = xml.match(regex) || []
  return matches
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
  console.log('🔍 Buscando sitemap principal...')
  const sitemap = await fetchSitemap()

  console.log('📊 Extraindo URLs...')

  // Extrair todas as URLs
  const blogUrls = extractUrls(sitemap, `${SITE_URL}/blog/[^<]+`)
  const cidadeUrls = extractUrls(sitemap, `${SITE_URL}/cidade/[^<]+`)
  const hubUrls = extractUrls(sitemap, `${SITE_URL}/(jaleco-para-|dolma-para-|conjunto-para-)[^<]+`)

  console.log(`  ✅ ${blogUrls.length} posts de blog`)
  console.log(`  ✅ ${cidadeUrls.length} cidades`)
  console.log(`  ✅ ${hubUrls.length} hubs profissão`)
  console.log(`  📝 Total: ${blogUrls.length + cidadeUrls.length + hubUrls.length} URLs\n`)

  // Gerar XML
  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    '  <!-- PRIORIDADE MÁXIMA: Hubs Profissão (30 URLs) -->',
    ...hubUrls.map(url => buildXmlUrl(url, '1.0')),
    '',
    '  <!-- PRIORIDADE ALTA: Blog Posts (84 URLs) -->',
    ...blogUrls.map(url => buildXmlUrl(url, '0.9')),
    '',
    '  <!-- PRIORIDADE MÉDIA: Cidades (75 URLs) -->',
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
  console.log('🎯 Próximo passo: Adicionar no Google Search Console')
  console.log('   1. https://search.google.com/search-console')
  console.log('   2. Sitemaps → Adicionar sitemap-priority.xml')
}

main().catch(console.error)
