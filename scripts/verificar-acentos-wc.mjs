#!/usr/bin/env node
/**
 * VERIFICAR ACENTOS NO WOOCOMMERCE
 *
 * Lista todas as cores das variações para verificar acentos
 */

const GRAPHQL_URL = 'https://wp.jaleca.com.br/graphql'

async function buscarProdutos() {
  const query = `
    query GetProducts {
      products(first: 100, where: { type: VARIABLE }) {
        nodes {
          name
          slug
          ... on VariableProduct {
            variations(first: 100) {
              nodes {
                name
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

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GraphQL HTTP error ${res.status}: ${text}`)
  }

  const data = await res.json()

  if (data.errors) {
    console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2))
  }

  return data.data?.products?.nodes || []
}

function temAcento(str) {
  return /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i.test(str)
}

async function main() {
  console.log('🔍 VERIFICANDO ACENTOS NO WOOCOMMERCE\n')

  const produtos = await buscarProdutos()

  console.log(`📦 Total de produtos encontrados: ${produtos.length}\n`)

  const coresComAcento = new Set()
  const todasCores = new Set()
  let totalCores = 0
  let produtosComVariacoes = 0

  for (const produto of produtos) {
    const variacoes = produto.variations?.nodes || []

    if (variacoes.length > 0) {
      produtosComVariacoes++
      console.log(`\n📦 ${produto.name} (${produto.slug})`)
      console.log(`   Variações: ${variacoes.length}`)
    }

    for (const variacao of variacoes) {
      const attrCor = variacao.attributes.nodes.find(a =>
        a.name.toLowerCase().includes('cor') ||
        a.name.toLowerCase().includes('color')
      )

      if (attrCor?.value) {
        totalCores++
        todasCores.add(attrCor.value)
        console.log(`   • ${attrCor.value}`)

        if (temAcento(attrCor.value)) {
          coresComAcento.add(attrCor.value)
        }
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
  console.log(`📊 Produtos com variações: ${produtosComVariacoes}`)
  console.log(`📊 Total de cores encontradas: ${totalCores}`)
  console.log(`📊 Cores únicas: ${todasCores.size}\n`)

  if (coresComAcento.size === 0) {
    console.log('✅ NENHUMA cor com acento encontrada!')
    console.log('   Todas as cores estão limpas.\n')
  } else {
    console.log(`⚠️  ${coresComAcento.size} cores COM ACENTOS:\n`)
    Array.from(coresComAcento).sort().forEach(cor => {
      console.log(`   • ${cor}`)
    })
    console.log('\n⚠️  AÇÃO NECESSÁRIA: Remover acentos dessas cores no WooCommerce\n')
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
