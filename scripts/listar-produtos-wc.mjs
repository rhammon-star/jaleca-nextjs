#!/usr/bin/env node
/**
 * Listar todos os produtos do WooCommerce para encontrar slugs corretos
 */

const GRAPHQL_URL = 'https://wp.jaleca.com.br/graphql'

async function listarProdutos() {
  const query = `
    query GetAllProducts {
      products(first: 100) {
        nodes {
          id
          databaseId
          name
          slug
          variations(first: 1) {
            nodes {
              id
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
    throw new Error(`GraphQL error: ${res.status}`)
  }

  const data = await res.json()
  return data.data?.products?.nodes || []
}

async function main() {
  console.log('📋 LISTANDO PRODUTOS WOOCOMMERCE\n')

  const produtos = await listarProdutos()

  console.log(`Total: ${produtos.length} produtos\n`)

  // Filtrar produtos com variações (produtos variáveis)
  const produtosVariaveis = produtos.filter(p => p.variations?.nodes?.length > 0)

  console.log(`Produtos variáveis: ${produtosVariaveis.length}\n`)

  // Procurar os produtos problemáticos
  const nomesBuscar = [
    'universitario',
    'manga curta',
    'princesa manga',
    'princesa laise',
    'pala feminino',
    'gold pala',
    'gold feminino'
  ]

  console.log('🔍 Produtos que podem ter discrepância:\n')

  for (const busca of nomesBuscar) {
    const matches = produtosVariaveis.filter(p =>
      p.name.toLowerCase().includes(busca.toLowerCase())
    )

    if (matches.length > 0) {
      console.log(`\n📦 "${busca}":`)
      for (const p of matches) {
        console.log(`   • ${p.name}`)
        console.log(`     Slug: ${p.slug}`)
      }
    }
  }

  // Listar todos os slugs para referência
  console.log('\n\n📝 TODOS OS SLUGS (produtos variáveis):\n')
  for (const p of produtosVariaveis) {
    console.log(`${p.slug}`)
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
