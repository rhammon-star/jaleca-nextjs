#!/usr/bin/env node
/**
 * CORRIGIR CORES FANTASMA
 *
 * Adiciona cores faltantes nos JSONs baseado nas variações reais do WooCommerce
 *
 * Problema: 7 produtos têm menos cores no JSON do que existem no WooCommerce
 * Solução: Buscar variações reais via GraphQL e adicionar URLs que faltam
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const GRAPHQL_URL = 'https://wp.jaleca.com.br/graphql'

// Produtos com discrepância (slug correto + cores esperadas)
const PRODUTOS_CORRIGIR = [
  { slug: 'jaleco-universitario-unissex-jaleca', coresEsperadas: 10 },
  { slug: 'jaleco-slim-tradicional-manga-curta-feminino-jaleca', coresEsperadas: 15 },
  { slug: 'jaleco-slim-princesa-manga-curta-feminino-jaleca', coresEsperadas: 20 },
  { slug: 'jaleco-slim-princesa-laise-feminino-jaleca', coresEsperadas: 5 },
  { slug: 'jaleco-slim-pala-feminino-jaleca', coresEsperadas: 10 },
  { slug: 'jaleco-slim-gold-pala-feminino-jaleca', coresEsperadas: 5 },
  { slug: 'jaleco-slim-gold-feminino-jaleca', coresEsperadas: 25 },
]

// Normaliza nome de cor
function normalizarCor(cor) {
  return cor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/ê/g, 'e')
    .replace(/ô/g, 'o')
    .replace(/â/g, 'a')
}

// Busca produto no WooCommerce GraphQL
async function buscarProduto(slug) {
  const query = `
    query GetProduct($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        slug
        variations(first: 100) {
          nodes {
            id
            databaseId
            name
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  `

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } })
  })

  if (!res.ok) {
    throw new Error(`GraphQL error: ${res.status}`)
  }

  const data = await res.json()
  return data.data?.product
}

// Extrai cores únicas das variações
function extrairCores(produto) {
  const cores = new Set()

  for (const variacao of produto.variations.nodes) {
    const attrCor = variacao.attributes.nodes.find(a =>
      a.name.toLowerCase().includes('cor') ||
      a.name.toLowerCase().includes('color')
    )

    if (attrCor?.value) {
      cores.add(attrCor.value)
    }
  }

  return Array.from(cores)
}

// Determina categoria do produto
function determinarCategoria(produto) {
  const catSlug = produto.productCategories?.nodes[0]?.slug || ''

  if (catSlug.includes('jaleco')) return 'jalecos'
  if (catSlug.includes('conjunto')) return 'conjuntos'
  if (catSlug.includes('dolma') || catSlug.includes('doma')) return 'dolmas'
  if (catSlug.includes('acessorio')) return 'acessorios'

  return 'jalecos' // fallback
}

// Gera meta description para cor
function gerarMetaDescription(nomeProduto, cor, categoria) {
  const templates = {
    jalecos: `Jaleco ${nomeProduto} ${cor} | Tecido premium, modelagem ajustada e acabamento superior. Entrega rápida para todo Brasil. Frete grátis SP, RJ, MG, ES acima de R$499.`,
    conjuntos: `Conjunto ${nomeProduto} ${cor} | Conforto e elegância para o seu dia a dia. Tecido de alta qualidade. Frete grátis acima de R$499 no Sudeste.`,
    dolmas: `Dólmã ${nomeProduto} ${cor} | Elegância profissional com tecido premium. Jaleca - uniformes que valorizam sua imagem. Entrega para todo Brasil.`,
    acessorios: `${nomeProduto} ${cor} | Acessórios profissionais Jaleca. Qualidade premium e design funcional. Compre com frete grátis acima de R$499.`
  }

  return templates[categoria] || templates.jalecos
}

async function main() {
  console.log('🔧 CORRIGINDO CORES FANTASMA\n')

  // 1. Carregar JSONs
  const urlsPath = join(process.cwd(), 'docs', 'URLS-PRODUTOS-CORES.json')
  const seoPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')

  const urlsData = JSON.parse(await readFile(urlsPath, 'utf-8'))
  const seoData = JSON.parse(await readFile(seoPath, 'utf-8'))

  let totalAdicionadas = 0

  // 2. Processar cada produto com discrepância
  for (const { slug, coresEsperadas } of PRODUTOS_CORRIGIR) {
    console.log(`\n📦 ${slug}`)
    console.log(`   Cores esperadas: ${coresEsperadas}`)

    // Buscar produto no WooCommerce
    const produto = await buscarProduto(slug)

    if (!produto) {
      console.log('   ❌ Produto não encontrado')
      continue
    }

    // Extrair cores reais
    const coresReais = extrairCores(produto)
    console.log(`   Cores reais encontradas: ${coresReais.length}`)

    // Verificar cores já presentes no JSON
    const coresNoJson = seoData
      .filter(item => item.url.includes(slug.replace('-jaleca', '')))
      .map(item => {
        const match = item.url.match(/-([^-]+)-jaleca$/)
        return match ? match[1] : null
      })
      .filter(Boolean)

    console.log(`   Cores já no JSON: ${coresNoJson.length}`)

    // Encontrar cores faltantes
    const coresFaltantes = coresReais.filter(cor => {
      const corNorm = normalizarCor(cor)
      return !coresNoJson.some(cJson => cJson === corNorm)
    })

    if (coresFaltantes.length === 0) {
      console.log('   ✅ Nenhuma cor faltando')
      continue
    }

    console.log(`   ⚠️  Faltam ${coresFaltantes.length} cores: ${coresFaltantes.join(', ')}`)

    // Determinar categoria
    const categoria = determinarCategoria(produto)
    const nomeProduto = produto.name.replace(/ - Jaleca$/i, '')

    // Adicionar cores faltantes
    for (const cor of coresFaltantes) {
      const corSlug = normalizarCor(cor)
      const urlCor = `/produto/${slug.replace('-jaleca', '')}-${corSlug}-jaleca`

      // Adicionar em URLS-PRODUTOS-CORES.json
      if (!urlsData.categories[categoria]) {
        console.log(`   ⚠️  Categoria ${categoria} não encontrada, usando jalecos`)
        urlsData.categories.jalecos.push({ url: urlCor })
      } else {
        urlsData.categories[categoria].push({ url: urlCor })
      }

      // Adicionar em SEO-PRODUTOS-CORES.json
      const metaDesc = gerarMetaDescription(nomeProduto, cor, categoria)
      seoData.push({
        url: urlCor,
        title: `${nomeProduto} ${cor}`,
        description: metaDesc
      })

      console.log(`   ✅ Adicionada: ${cor} → ${urlCor}`)
      totalAdicionadas++
    }
  }

  // 3. Salvar JSONs atualizados
  await writeFile(urlsPath, JSON.stringify(urlsData, null, 2))
  await writeFile(seoPath, JSON.stringify(seoData, null, 2))

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## ✅ CONCLUÍDO\n')
  console.log(`Total de cores adicionadas: ${totalAdicionadas}`)
  console.log(`\n📊 Resumo:`)
  console.log(`   URLS-PRODUTOS-CORES.json: atualizado`)
  console.log(`   SEO-PRODUTOS-CORES.json: atualizado`)
  console.log(`\n⚠️  PRÓXIMOS PASSOS:`)
  console.log(`   1. Revisar os JSONs atualizados`)
  console.log(`   2. Commit + deploy`)
  console.log(`   3. Submeter sitemap atualizado ao GSC\n`)
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  console.error(err.stack)
  process.exit(1)
})
