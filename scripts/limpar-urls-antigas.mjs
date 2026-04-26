#!/usr/bin/env node
/**
 * LIMPAR URLs ANTIGAS
 *
 * Remove entradas com slugs antigos (antes da correção) dos JSONs
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// Padrões de slugs antigos para remover
const SLUG_ANTIGOS_PATTERNS = [
  'de-ziper-central-varias-cores',
  'de-ziper-lateral-varias-cores',
  'pijama-cirurgico-scrub',
  'varias-cores-jaleca',
  'de-ziper-e-avental',
  'de-botao-varias',
]

async function main() {
  console.log('🧹 LIMPANDO URLs ANTIGAS DOS JSONs\n')

  // 1. Limpar SEO-PRODUTOS-CORES.json
  console.log('📄 Processando SEO-PRODUTOS-CORES.json...')
  const seoPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const seoData = JSON.parse(await readFile(seoPath, 'utf-8'))

  const seoAntes = seoData.length
  const seoLimpo = seoData.filter(item => {
    const url = item.url
    // Remove se URL contém qualquer padrão antigo
    return !SLUG_ANTIGOS_PATTERNS.some(pattern => url.includes(pattern))
  })

  await writeFile(seoPath, JSON.stringify(seoLimpo, null, 2))
  console.log(`   Antes: ${seoAntes} URLs`)
  console.log(`   Depois: ${seoLimpo.length} URLs`)
  console.log(`   Removidas: ${seoAntes - seoLimpo.length}\n`)

  // 2. Limpar URLS-PRODUTOS-CORES.json
  console.log('📄 Processando URLS-PRODUTOS-CORES.json...')
  const urlsPath = join(process.cwd(), 'docs', 'URLS-PRODUTOS-CORES.json')
  const urlsData = JSON.parse(await readFile(urlsPath, 'utf-8'))

  let totalRemovidas = 0

  for (const cat of ['jalecos', 'conjuntos', 'dolmas', 'acessorios']) {
    if (!urlsData.categories[cat]) continue

    const antes = urlsData.categories[cat].length
    urlsData.categories[cat] = urlsData.categories[cat].filter(item => {
      const url = item.url
      return !SLUG_ANTIGOS_PATTERNS.some(pattern => url.includes(pattern))
    })
    const depois = urlsData.categories[cat].length
    const removidas = antes - depois

    if (removidas > 0) {
      console.log(`   ${cat}: ${antes} → ${depois} (${removidas} removidas)`)
      totalRemovidas += removidas
    }
  }

  await writeFile(urlsPath, JSON.stringify(urlsData, null, 2))
  console.log(`   Total removidas: ${totalRemovidas}\n`)

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## ✅ CONCLUÍDO\n')
  console.log(`URLs antigas removidas dos JSONs.`)
  console.log(`Total final: ${seoLimpo.length} páginas de cores\n`)
  console.log('⚠️  PRÓXIMO PASSO: commit + deploy + resubmeter sitemap ao GSC\n')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
