#!/usr/bin/env node
/**
 * ATUALIZAR SLUGS NOS JSONS
 *
 * Atualiza URLS-PRODUTOS-CORES.json e SEO-PRODUTOS-CORES.json
 * com os slugs novos (sem -varias-cores, -de-ziper-, etc)
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// Mapa de slugs antigos → novos (dos 16 produtos corrigidos)
const SLUG_MAP = {
  'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca': 'jaleco-slim-tradicional-feminino-jaleca',
  'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca': 'jaleco-slim-feminino-lateral-jaleca',
  'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca': 'jaleco-slim-tradicional-masculino-jaleca',
  'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca': 'conjunto-scrub-masculino-jaleca',
  'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca': 'conjunto-scrub-feminino-jaleca',
  'conjunto-pijama-cirurgico-princesa-scrub-feminino-varias-cores-jaleca': 'conjunto-princesa-nobre-feminino-jaleca',
  'jaleco-slim-recortes-masculino-varias-cores-jaleca': 'jaleco-slim-recortes-masculino-jaleca',
  'jaleco-slim-princesa-feminino-varias-cores-jaleca': 'jaleco-slim-princesa-feminino-jaleca',
  'jaleco-slim-moratty-masculino-ziper-central-jaleca': 'jaleco-slim-moratty-masculino-jaleca',
  'jaleco-slim-moratty-feminino-ziper-central-jaleca': 'jaleco-slim-moratty-feminino-jaleca',
  'jaleco-slim-elastex-feminino-varias-cores-jaleca': 'jaleco-slim-elastex-feminino-jaleca',
  'jaleco-slim-duquesa-feminino-varias-cores-jaleca': 'jaleco-slim-duquesa-feminino-jaleca',
  'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca': 'jaleco-padrao-aluno-masculino-jaleca',
  'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca': 'jaleco-padrao-aluno-feminino-jaleca',
  'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca': 'conjunto-dolma-cozinheiro-masculino-jaleca',
  'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca': 'conjunto-dolma-cozinheiro-feminino-jaleca',
}

async function main() {
  console.log('🔄 ATUALIZANDO SLUGS NOS JSONS\n')

  // 1. Atualizar URLS-PRODUTOS-CORES.json
  console.log('📄 Atualizando URLS-PRODUTOS-CORES.json...')
  const urlsPath = join(process.cwd(), 'docs', 'URLS-PRODUTOS-CORES.json')
  const urlsData = JSON.parse(await readFile(urlsPath, 'utf-8'))

  let urlsAtualizadas = 0

  // Atualizar slugs em cada categoria
  for (const cat of ['jalecos', 'conjuntos', 'dolmas', 'acessorios']) {
    if (!urlsData.categories[cat]) continue

    for (const item of urlsData.categories[cat]) {
      // Extrair slug da URL
      const slug = item.url.replace('/produto/', '')
      const baseSlug = slug.split('-branco-')[0].split('-preto-')[0].split('-azul-')[0]
        .split('-rosa-')[0].split('-verde-')[0].split('-marinho-')[0]
        .split('-vinho-')[0].split('-pink-')[0].split('-areia-')[0]
        .split('-gelo-')[0].split('-palha-')[0]

      if (SLUG_MAP[baseSlug]) {
        const oldUrl = item.url
        const newSlug = SLUG_MAP[baseSlug]

        // Substituir base slug mas manter sufixo de cor
        const colorSuffix = slug.replace(baseSlug, '')
        item.url = `/produto/${newSlug}${colorSuffix}`

        if (oldUrl !== item.url) {
          console.log(`  ✓ ${oldUrl} → ${item.url}`)
          urlsAtualizadas++
        }
      }
    }
  }

  await writeFile(urlsPath, JSON.stringify(urlsData, null, 2))
  console.log(`✅ ${urlsAtualizadas} URLs atualizadas em URLS-PRODUTOS-CORES.json\n`)

  // 2. Atualizar SEO-PRODUTOS-CORES.json
  console.log('📄 Atualizando SEO-PRODUTOS-CORES.json...')
  const seoPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const seoData = JSON.parse(await readFile(seoPath, 'utf-8'))

  let seoAtualizadas = 0

  for (const item of seoData) {
    const slug = item.url.replace('/produto/', '')
    const baseSlug = slug.split('-branco-')[0].split('-preto-')[0].split('-azul-')[0]
      .split('-rosa-')[0].split('-verde-')[0].split('-marinho-')[0]
      .split('-vinho-')[0].split('-pink-')[0].split('-areia-')[0]
      .split('-gelo-')[0].split('-palha-')[0]

    if (SLUG_MAP[baseSlug]) {
      const oldUrl = item.url
      const newSlug = SLUG_MAP[baseSlug]
      const colorSuffix = slug.replace(baseSlug, '')
      item.url = `/produto/${newSlug}${colorSuffix}`

      if (oldUrl !== item.url) {
        seoAtualizadas++
      }
    }
  }

  await writeFile(seoPath, JSON.stringify(seoData, null, 2))
  console.log(`✅ ${seoAtualizadas} URLs atualizadas em SEO-PRODUTOS-CORES.json\n`)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## ✅ CONCLUÍDO\n')
  console.log(`Total de atualizações: ${urlsAtualizadas + seoAtualizadas}`)
  console.log('\nPróximo passo: commit e deploy\n')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
