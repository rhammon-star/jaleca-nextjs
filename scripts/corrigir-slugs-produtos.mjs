#!/usr/bin/env node
/**
 * CORREÇÃO DE SLUGS — 6 Produtos com Slugs Estranhos
 *
 * Atualiza slugs via WooCommerce REST API e cria redirects 301
 */

import { readFile, writeFile } from 'fs/promises'

const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Credenciais WooCommerce não configuradas')
  console.error('Defina WOOCOMMERCE_CONSUMER_KEY e WOOCOMMERCE_CONSUMER_SECRET')
  process.exit(1)
}

// Lista de correções
const CORRECOES = [
  {
    nome: 'Jaleco Slim Tradicional Feminino',
    slugAtual: 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
    slugNovo: 'jaleco-slim-tradicional-feminino-jaleca',
  },
  {
    nome: 'Jaleco Slim Feminino Lateral',
    slugAtual: 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
    slugNovo: 'jaleco-slim-feminino-lateral-jaleca',
  },
  {
    nome: 'Jaleco Slim Tradicional Masculino',
    slugAtual: 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
    slugNovo: 'jaleco-slim-tradicional-masculino-jaleca',
  },
  {
    nome: 'Conjunto Scrub Masculino',
    slugAtual: 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
    slugNovo: 'conjunto-scrub-masculino-jaleca',
  },
  {
    nome: 'Conjunto Scrub Feminino',
    slugAtual: 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
    slugNovo: 'conjunto-scrub-feminino-jaleca',
  },
  {
    nome: 'Conjunto Princesa Nobre Feminino',
    slugAtual: 'conjunto-pijama-cirurgico-princesa-scrub-feminino-varias-cores-jaleca',
    slugNovo: 'conjunto-princesa-nobre-feminino-jaleca',
  },
]

async function buscarProdutoPorSlug(slug) {
  const url = `${WC_URL}/products?slug=${slug}&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Erro ao buscar produto: ${res.status}`)
  }

  const produtos = await res.json()
  return produtos[0] || null
}

async function atualizarSlugProduto(id, novoSlug) {
  const url = `${WC_URL}/products/${id}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: novoSlug })
  })

  if (!res.ok) {
    const erro = await res.text()
    throw new Error(`Erro ao atualizar: ${res.status} - ${erro}`)
  }

  return await res.json()
}

async function main() {
  console.log('🔧 CORREÇÃO DE SLUGS — 6 Produtos\n')

  const redirects = []
  let sucessos = 0
  let erros = 0

  for (const correcao of CORRECOES) {
    console.log(`\n📦 ${correcao.nome}`)
    console.log(`   Slug atual: ${correcao.slugAtual}`)
    console.log(`   Slug novo: ${correcao.slugNovo}`)

    try {
      // Buscar produto
      console.log('   Buscando produto...')
      const produto = await buscarProdutoPorSlug(correcao.slugAtual)

      if (!produto) {
        console.log('   ❌ Produto não encontrado no WooCommerce')
        erros++
        continue
      }

      console.log(`   ✅ Encontrado (ID: ${produto.id})`)

      // Atualizar slug
      console.log('   Atualizando slug...')
      await atualizarSlugProduto(produto.id, correcao.slugNovo)
      console.log('   ✅ Slug atualizado com sucesso')

      // Adicionar redirect
      redirects.push({
        source: `/produto/${correcao.slugAtual}`,
        destination: `/produto/${correcao.slugNovo}`,
        permanent: true, // 301
      })

      sucessos++

      // Rate limit: aguardar 1s entre requests
      await new Promise(resolve => setTimeout(resolve, 1000))

    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`)
      erros++
    }
  }

  console.log(`\n\n## 📊 RESUMO\n`)
  console.log(`✅ Sucessos: ${sucessos}/${CORRECOES.length}`)
  console.log(`❌ Erros: ${erros}/${CORRECOES.length}\n`)

  if (redirects.length > 0) {
    console.log('## 🔀 REDIRECTS 301 NECESSÁRIOS\n')
    console.log('Adicionando ao next.config.ts...\n')

    // Ler next.config.ts
    const configPath = new URL('../next.config.ts', import.meta.url)
    let config = await readFile(configPath, 'utf-8')

    // Encontrar a seção de redirects
    const redirectsCode = redirects.map(r =>
      `    {\n      source: '${r.source}',\n      destination: '${r.destination}',\n      permanent: true,\n    },`
    ).join('\n')

    // Adicionar antes do último redirect existente
    if (config.includes('async redirects()')) {
      // Procurar o array de redirects
      const redirectsMatch = config.match(/async redirects\(\)\s*\{[\s\S]*?return\s*\[([\s\S]*?)\]\s*\}/m)

      if (redirectsMatch) {
        const existingRedirects = redirectsMatch[1]
        const newRedirects = existingRedirects.trim() + ',\n\n    // Correção de slugs (26/04/2026)\n' + redirectsCode

        config = config.replace(
          /async redirects\(\)\s*\{[\s\S]*?return\s*\[([\s\S]*?)\]\s*\}/m,
          `async redirects() {\n    return [\n${newRedirects}\n    ]\n  }`
        )

        await writeFile(configPath, config)
        console.log('✅ Redirects adicionados ao next.config.ts\n')

        redirects.forEach(r => {
          console.log(`   ${r.source} → ${r.destination}`)
        })
      }
    } else {
      console.log('⚠️  Não foi possível adicionar redirects automaticamente')
      console.log('    Adicione manualmente no next.config.ts:\n')
      console.log(redirectsCode)
    }
  }

  console.log('\n## ✅ PRÓXIMO PASSO\n')
  console.log('1. Commit das mudanças')
  console.log('2. Push para produção')
  console.log('3. Revalidar sitemap no GSC\n')
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  console.error(err.stack)
  process.exit(1)
})
