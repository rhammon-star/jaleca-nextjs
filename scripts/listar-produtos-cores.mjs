#!/usr/bin/env node
/**
 * PROJETO JALECA CORES — Listagem de 140 URLs de produtos por cor
 *
 * Busca todos os produtos WooCommerce e gera lista de URLs individuais por cor
 * Saída: markdown com tabela de produtos × cores para planejamento SEO
 */

import { GraphQLClient } from 'graphql-request'

const endpoint = process.env.NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL || 'https://wp.jaleca.com.br/graphql'
const client = new GraphQLClient(endpoint)

const GET_ALL_PRODUCTS = `
  query GetAllProducts {
    products(first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        productCategories {
          nodes {
            name
            slug
          }
        }
        ... on SimpleProduct {
          stockStatus
        }
        ... on VariableProduct {
          attributes {
            nodes {
              name
              options
            }
          }
          variations(first: 100) {
            nodes {
              id
              databaseId
              stockStatus
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

function normalizeColor(color) {
  return color
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function slugifyColor(color) {
  return color
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

async function main() {
  console.log('🎨 PROJETO JALECA CORES — Listagem de URLs\n')
  console.log('Buscando produtos do WooCommerce...\n')

  const data = await client.request(GET_ALL_PRODUCTS)
  const products = data.products.nodes

  let totalUrls = 0
  let totalMaes = 0
  const urlsByCategory = {
    jalecos: [],
    conjuntos: [],
    dolmas: [],
    acessorios: [],
    outros: []
  }

  console.log('## 📋 LISTAGEM COMPLETA DE URLs POR COR\n')
  console.log('### Estrutura: Páginas Mães + Páginas Filhas\n')

  products.forEach(product => {
    const variations = product.variations?.nodes || []

    // Pular produtos sem variações ou simples
    if (variations.length === 0) {
      return
    }

    // Encontrar atributo de cor
    const attrs = product.attributes?.nodes || []
    const colorAttr = attrs.find(a => /cor|color/i.test(a.name))

    if (!colorAttr || !colorAttr.options || colorAttr.options.length === 0) {
      return
    }

    // Determinar categoria
    const categories = product.productCategories?.nodes || []
    const categorySlug = categories[0]?.slug || 'outros'
    let categoryKey = 'outros'

    if (categorySlug.includes('jaleco')) categoryKey = 'jalecos'
    else if (categorySlug.includes('conjunto')) categoryKey = 'conjuntos'
    else if (categorySlug.includes('dolma') || categorySlug.includes('doma')) categoryKey = 'dolmas'
    else if (categorySlug.includes('acessorio')) categoryKey = 'acessorios'

    const productName = product.name.replace(/ - Jaleca$/i, '')
    const baseUrl = `/produto/${product.slug}`

    // Página mãe
    totalMaes++
    urlsByCategory[categoryKey].push({
      type: 'mãe',
      name: productName,
      url: baseUrl,
      colors: colorAttr.options.length
    })

    console.log(`#### ${productName}`)
    console.log(`- **Página mãe:** ${baseUrl}`)
    console.log(`- **Cores (${colorAttr.options.length}):**`)

    // Páginas filhas (por cor)
    colorAttr.options.forEach(color => {
      const colorNormalized = normalizeColor(color)
      const colorSlug = slugifyColor(color)
      const childUrl = `/produto/${product.slug}-${colorSlug}`

      urlsByCategory[categoryKey].push({
        type: 'filha',
        name: `${productName} - ${colorNormalized}`,
        url: childUrl,
        color: colorNormalized
      })

      totalUrls++
      console.log(`  - \`${childUrl}\` — ${colorNormalized}`)
    })

    console.log('')
  })

  console.log('\n---\n')
  console.log('## 📊 RESUMO POR CATEGORIA\n')

  Object.entries(urlsByCategory).forEach(([key, urls]) => {
    const filhas = urls.filter(u => u.type === 'filha')
    const maes = urls.filter(u => u.type === 'mãe')

    if (filhas.length === 0) return

    console.log(`### ${key.toUpperCase()}`)
    console.log(`- Páginas mães: ${maes.length}`)
    console.log(`- Páginas filhas: ${filhas.length}`)
    console.log(`- Total URLs: ${maes.length + filhas.length}\n`)
  })

  console.log('---\n')
  console.log('## 🎯 TOTAIS GERAIS\n')
  console.log(`- **Páginas mães:** ${totalMaes}`)
  console.log(`- **Páginas filhas (por cor):** ${totalUrls}`)
  console.log(`- **Total URLs no sitemap:** ${totalMaes + totalUrls}`)
  console.log(`- **Aumento visual do catálogo:** +${Math.round((totalUrls / totalMaes - 1) * 100)}%\n`)

  // Salvar JSON para uso no Ponto 2 (geração de SEO)
  const output = {
    totalMaes,
    totalFilhas: totalUrls,
    totalUrls: totalMaes + totalUrls,
    categories: urlsByCategory,
    generatedAt: new Date().toISOString()
  }

  const fs = await import('fs/promises')
  await fs.writeFile(
    new URL('../docs/URLS-PRODUTOS-CORES.json', import.meta.url),
    JSON.stringify(output, null, 2)
  )

  console.log('✅ Arquivo salvo: `docs/URLS-PRODUTOS-CORES.json`\n')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
