#!/usr/bin/env node
/**
 * Listar produtos via WooCommerce REST API
 */

const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Credenciais WooCommerce não configuradas')
  process.exit(1)
}

async function buscarProdutos() {
  const url = `${WC_URL}/products?per_page=100&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`REST API error: ${res.status}`)
  }

  return await res.json()
}

async function main() {
  console.log('📋 LISTANDO PRODUTOS VIA REST API\n')

  const produtos = await buscarProdutos()

  console.log(`Total: ${produtos.length} produtos\n`)

  // Filtrar produtos variáveis
  const produtosVariaveis = produtos.filter(p => p.type === 'variable')

  console.log(`Produtos variáveis: ${produtosVariaveis.length}\n`)

  // Procurar os produtos problemáticos
  const nomesBuscar = [
    'universitario',
    'manga curta feminino',
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
        console.log(`     ID: ${p.id}`)
      }
    }
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  console.error(err.stack)
  process.exit(1)
})
