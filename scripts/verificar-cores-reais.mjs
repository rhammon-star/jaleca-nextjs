#!/usr/bin/env node
/**
 * VERIFICAR CORES REAIS vs JSON
 *
 * Compara as cores listadas no SEO-PRODUTOS-CORES.json
 * com as cores reais que existem no WooCommerce
 */

import { readFile } from 'fs/promises'

const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Credenciais WooCommerce não configuradas')
  process.exit(1)
}

async function buscarProdutoPorSlug(slug) {
  const url = `${WC_URL}/products?slug=${slug}&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
  const res = await fetch(url)
  if (!res.ok) return null
  const produtos = await res.json()
  return produtos[0] || null
}

async function buscarVariacoesProduto(produtoId) {
  const url = `${WC_URL}/products/${produtoId}/variations?per_page=100&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
  const res = await fetch(url)
  if (!res.ok) return []
  return await res.json()
}

async function main() {
  console.log('🔍 VERIFICANDO CORES REAIS vs JSON\n')

  // Ler JSON atual
  const jsonPath = new URL('../docs/URLS-PRODUTOS-CORES.json', import.meta.url)
  const jsonData = JSON.parse(await readFile(jsonPath, 'utf-8'))

  const problemas = []
  let totalProdutos = 0
  let totalDiscrepancias = 0

  // Pegar apenas produtos mãe de todas as categorias
  const categorias = ['jalecos', 'conjuntos', 'dolmas', 'acessorios']
  const produtosMae = []

  for (const cat of categorias) {
    if (!jsonData.categories[cat]) continue

    const produtos = jsonData.categories[cat].filter(p => p.type === 'mãe')
    produtosMae.push(...produtos)
  }

  console.log(`📦 Total de produtos mãe no JSON: ${produtosMae.length}\n`)

  for (const produtoJson of produtosMae) {
    totalProdutos++

    // Extrair slug do produto (remover /produto/ e qualquer sufixo de cor)
    const slug = produtoJson.url.replace('/produto/', '')

    console.log(`\n📦 ${produtoJson.name}`)
    console.log(`   Slug: ${slug}`)
    console.log(`   Cores no JSON: ${produtoJson.colors}`)

    try {
      // Buscar produto no WooCommerce
      const produto = await buscarProdutoPorSlug(slug)

      if (!produto) {
        console.log('   ❌ Produto não encontrado no WooCommerce!')
        problemas.push({
          nome: produtoJson.name,
          slug,
          problema: 'Produto não existe no WooCommerce',
          coresJson: produtoJson.colors,
          coresWc: 0
        })
        continue
      }

      // Buscar variações
      const variacoes = await buscarVariacoesProduto(produto.id)
      const coresReais = variacoes.filter(v => v.status === 'publish').length

      console.log(`   Cores no WooCommerce: ${coresReais}`)

      if (coresReais !== produtoJson.colors) {
        console.log(`   ⚠️  DISCREPÂNCIA: JSON tem ${produtoJson.colors}, WC tem ${coresReais}`)

        totalDiscrepancias++

        // Listar cores no WooCommerce
        const coresNomes = variacoes
          .filter(v => v.status === 'publish')
          .map(v => v.attributes.find(a => a.name === 'Cor')?.option || 'Sem cor')

        console.log(`   Cores reais: ${coresNomes.join(', ')}`)

        problemas.push({
          nome: produtoJson.name,
          slug,
          problema: 'Quantidade diferente',
          coresJson: produtoJson.colors,
          coresWc: coresReais,
          diferenca: produtoJson.colors - coresReais,
          coresReais: coresNomes
        })
      } else {
        console.log('   ✅ Correto')
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`)
    }
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## 📊 RESUMO\n')
  console.log(`Total de produtos verificados: ${totalProdutos}`)
  console.log(`Produtos com discrepância: ${totalDiscrepancias}`)
  console.log(`Produtos corretos: ${totalProdutos - totalDiscrepancias}\n`)

  if (problemas.length > 0) {
    console.log('## ⚠️  PROBLEMAS ENCONTRADOS\n')

    for (const p of problemas) {
      console.log(`${p.nome}`)
      console.log(`  Problema: ${p.problema}`)
      console.log(`  JSON: ${p.coresJson} cores | WC: ${p.coresWc} cores`)

      if (p.diferenca) {
        console.log(`  Diferença: ${p.diferenca > 0 ? '+' : ''}${p.diferenca} (JSON tem a ${p.diferenca > 0 ? 'mais' : 'menos'})`)
      }

      if (p.coresReais) {
        console.log(`  Cores reais no WC: ${p.coresReais.join(', ')}`)
      }

      console.log('')
    }

    console.log('\n## 💡 SOLUÇÃO\n')
    console.log('Você precisa regenerar o SEO-PRODUTOS-CORES.json com as cores')
    console.log('REAIS do WooCommerce, não com dados desatualizados.')
    console.log('\nOu verificar por que essas variações estão com status "draft"')
    console.log('ou foram deletadas no WooCommerce.\n')
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  console.error(err.stack)
  process.exit(1)
})
