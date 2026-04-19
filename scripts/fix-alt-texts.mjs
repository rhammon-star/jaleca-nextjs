/**
 * fix-alt-texts.mjs
 * Corrige alt texts errados nas variações de 4 produtos específicos.
 * Usa WooCommerce REST API + WordPress REST API.
 *
 * Rodar: node scripts/fix-alt-texts.mjs
 */

const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WP_URL = 'https://wp.jaleca.com.br/wp-json/wp/v2'
const CK = 'ck_b04a01d4853493fca62b8da0131fce57caf291ba'
const CS = 'cs_77ccf5bc3c83060f38afaf659ed9f8bc209de480'

const AUTH = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')

async function wcGet(path) {
  const res = await fetch(`${WC_URL}${path}`, {
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`WC GET ${path} → ${res.status} ${await res.text()}`)
  return res.json()
}

async function wcPut(path, body) {
  const res = await fetch(`${WC_URL}${path}`, {
    method: 'PUT',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`WC PUT ${path} → ${res.status} ${await res.text()}`)
  return res.json()
}

async function wpUpdateAlt(mediaId, altText) {
  const res = await fetch(`${WP_URL}/media/${mediaId}`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ alt_text: altText }),
  })
  if (!res.ok) throw new Error(`WP POST media/${mediaId} → ${res.status} ${await res.text()}`)
  return res.json()
}

/** Extrai a cor de uma variação pelo atributo */
function getColor(variation) {
  const colorAttr = variation.attributes?.find(a =>
    /cor|color/i.test(a.name)
  )
  return colorAttr?.option ?? null
}

/** Corrige alt texts de todas as variações de um produto */
async function fixProduct(productSlug, productDisplayName) {
  console.log(`\n── ${productDisplayName} (${productSlug}) ──`)

  // Busca produto pelo slug
  const products = await wcGet(`/products?slug=${productSlug}&_fields=id,name,slug`)
  if (!products.length) {
    console.log(`  ⚠️  Produto não encontrado: ${productSlug}`)
    return
  }
  const product = products[0]
  console.log(`  ID: ${product.id} | Nome: ${product.name}`)

  // Busca variações (paginando se necessário)
  let page = 1
  let allVariations = []
  while (true) {
    const batch = await wcGet(
      `/products/${product.id}/variations?per_page=100&page=${page}&_fields=id,attributes,image`
    )
    if (!batch.length) break
    allVariations = allVariations.concat(batch)
    if (batch.length < 100) break
    page++
  }

  console.log(`  Variações encontradas: ${allVariations.length}`)

  let fixed = 0
  let skipped = 0

  for (const variation of allVariations) {
    const color = getColor(variation)
    const imageId = variation.image?.id
    const currentAlt = variation.image?.alt ?? ''

    if (!imageId) {
      console.log(`    [${variation.id}] Sem imagem — pulando`)
      skipped++
      continue
    }

    const expectedAlt = color
      ? `${productDisplayName} ${color}`
      : productDisplayName

    if (currentAlt === expectedAlt) {
      console.log(`    [${variation.id}] ✅ Já correto: "${currentAlt}"`)
      skipped++
      continue
    }

    console.log(`    [${variation.id}] ❌ "${currentAlt}" → "${expectedAlt}"`)

    // 1. Atualiza alt na variação WooCommerce
    await wcPut(`/products/${product.id}/variations/${variation.id}`, {
      image: { id: imageId, alt: expectedAlt },
    })

    // 2. Atualiza alt na mídia WordPress (garante consistência no media library)
    try {
      await wpUpdateAlt(imageId, expectedAlt)
    } catch (e) {
      console.log(`      ⚠️  WP media update falhou (não crítico): ${e.message}`)
    }

    fixed++
  }

  console.log(`  → Corrigidas: ${fixed} | Já corretas: ${skipped}`)
}

async function main() {
  console.log('🔧 Iniciando correção de alt texts...\n')

  const produtos = [
    {
      slug: 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
      nome: 'Jaleco Slim Elastex Feminino',
    },
    {
      slug: 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
      nome: 'Conjunto Scrub Feminino',
    },
    {
      slug: 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
      nome: 'Conjunto Scrub Masculino',
    },
    {
      slug: 'jaleco-slim-duquesa-feminino-varias-cores-jaleca',
      nome: 'Jaleco Slim Duquesa Feminino',
    },
  ]

  for (const p of produtos) {
    try {
      await fixProduct(p.slug, p.nome)
    } catch (err) {
      console.error(`  🔴 Erro em ${p.slug}: ${err.message}`)
    }
  }

  console.log('\n✅ Concluído.')
}

main()
