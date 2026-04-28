const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const CK = 'ck_249fd8f54810651d8ab8f2393f0a3ae32ea29399'
const CS = 'cs_b5491d7176b4d1eddad40f63260f1e30cb67e659'
const JALECA_SECRET = process.env.JALECA_PLUGIN_SECRET ?? 'jaleca-register-secret-2026'
const NEXT_URL = process.env.NEXT_URL ?? 'https://jaleca.com.br'

const CATEGORIES = [
  { id: 1470, name: 'acessorios' },
  { id: 1452, name: 'conjuntos' },
  { id: 1066, name: 'jalecos' },
  { id: 1499, name: 'unissex' },
  // 1405 dolmas already seeded
]

const auth = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')

async function wcGet(path: string) {
  const res = await fetch(`${WC_URL}${path}`, { headers: { Authorization: auth } })
  if (!res.ok) throw new Error(`WC error ${res.status} ${path}`)
  return res.json()
}

async function seedCategory(catId: number, catName: string) {
  console.log(`\n=== Categoria: ${catName} (${catId}) ===`)
  const products = await wcGet(`/products?category=${catId}&per_page=100&status=publish&type=variable`)
  console.log(`Encontrados: ${products.length} produtos`)

  let created = 0

  for (const product of products) {
    if (!product.variations?.length) {
      console.log(`  [${product.id}] ${product.name} — sem variações, pulando`)
      continue
    }

    console.log(`\n[${product.id}] ${product.name} — ${product.variations.length} variações`)

    for (const varId of product.variations) {
      let variation: any
      try {
        variation = await wcGet(`/products/${product.id}/variations/${varId}`)
      } catch (e) {
        console.log(`  [${varId}] ERRO ao buscar variação: ${e}`)
        continue
      }

      const res = await fetch(`${NEXT_URL}/api/wc/variation-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-jaleca-secret': JALECA_SECRET,
        },
        body: JSON.stringify({ variationId: varId }),
      })

      const data = await res.json()
      console.log(`  [${varId}] ${variation.attributes?.[0]?.option ?? '?'} → ${data.action}`)
      created++

      await new Promise(r => setTimeout(r, 300))
    }
  }

  return created
}

async function main() {
  let total = 0

  for (const cat of CATEGORIES) {
    const count = await seedCategory(cat.id, cat.name)
    total += count
  }

  console.log(`\nConcluído: ${total} variações processadas`)
}

main().catch(console.error)
