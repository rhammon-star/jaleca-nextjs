/**
 * Script para verificar variações duplicadas em todos os produtos WooCommerce
 *
 * Uso:
 *   node check-duplicate-variations.js
 *
 * Este script lista todos os produtos variáveis e verifica se há
 * combinações duplicadas de atributos (ex: cor + tamanho)
 */

const https = require('https');

const WC_URL = process.env.WC_URL || 'https://wp.jaleca.com.br';
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Configure WC_KEY e WC_SECRET no ambiente');
  console.error('   export WC_KEY=seu_consumer_key');
  console.error('   export WC_SECRET=seu_consumer_secret');
  process.exit(1);
}

const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

async function fetchAll(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, WC_URL);
    const options = {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getProducts() {
  const products = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    console.log(`📦 Buscando página ${page}...`);
    const result = await fetchAll(`/wp-json/wc/v3/products?page=${page}&per_page=100&type=variable`);

    if (result.length === 0) {
      hasMore = false;
    } else {
      products.push(...result);
      page++;
      if (result.length < 100) hasMore = false;
    }
  }

  return products;
}

function normalizeAttr(value) {
  if (!value) return '';
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_\s]/g, '');
}

function findDuplicates(variations) {
  const seen = new Map();
  const duplicates = [];

  for (const variation of variations) {
    // Extract color and size from attributes
    let color = '';
    let size = '';
    let variationId = variation.id;

    for (const attr of variation.attributes) {
      const name = attr.name.toLowerCase();
      const value = attr.option;

      if (name.includes('cor') || name.includes('color')) {
        color = normalizeAttr(value);
      }
      if (name.includes('tamanho') || name.includes('size')) {
        size = normalizeAttr(value);
      }
    }

    const key = `${color}|${size}`;

    if (seen.has(key)) {
      duplicates.push({
        productId: variation.product_id,
        variationId: variationId,
        duplicateOf: seen.get(key),
        color,
        size,
        attributes: variation.attributes
      });
    } else {
      seen.set(key, variationId);
    }
  }

  return duplicates;
}

async function main() {
  console.log('🔍 Verificando variações duplicadas...\n');

  const products = await getProducts();
  console.log(`\n✅ Encontrei ${products.length} produtos variáveis\n`);

  let totalDuplicates = 0;
  const productsWithIssues = [];

  for (const product of products) {
    if (!product.variations || product.variations.length === 0) continue;

    // Get full variation details
    const variationsWithAttrs = [];

    for (const varId of product.variations) {
      try {
        const variation = await fetchAll(`/wp-json/wc/v3/products/${product.id}/variations/${varId}`);
        variationsWithAttrs.push(variation);
      } catch (e) {
        console.log(`   ⚠️ Erro ao buscar variação ${varId}: ${e.message}`);
      }
    }

    const duplicates = findDuplicates(variationsWithAttrs);

    if (duplicates.length > 0) {
      totalDuplicates += duplicates.length;
      productsWithIssues.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        variations: product.variations.length,
        duplicates: duplicates.length,
        duplicateDetails: duplicates
      });
    }
  }

  // Print results
  console.log('═'.repeat(80));
  console.log('📊 RESULTADO DA VERIFICAÇÃO');
  console.log('═'.repeat(80));

  if (productsWithIssues.length === 0) {
    console.log('\n✅ NENHUMA VARIAÇÃO DUPLICADA ENCONTRADA!\n');
  } else {
    console.log(`\n🔴 ENCONTREI ${totalDuplicates} VARIAÇÕES DUPLICADAS EM ${productsWithIssues.length} PRODUTOS:\n`);

    for (const p of productsWithIssues) {
      console.log('─'.repeat(80));
      console.log(`🔴 Produto: ${p.name}`);
      console.log(`   ID: ${p.id} | SKU: ${p.sku || 'N/A'}`);
      console.log(`   Variações: ${p.variations} | Duplicadas: ${p.duplicates}`);
      console.log('');

      for (const d of p.duplicateDetails) {
        console.log(`   ⚠️  Duplicata: Cor="${d.color}" Tamanho="${d.size}"`);
        console.log(`      Variação ID: ${d.variationId}`);
      }
      console.log('');
    }

    console.log('═'.repeat(80));
    console.log('📋 PRODUTOS COM PROBLEMAS (para você verificar no WooCommerce):');
    console.log('═'.repeat(80));

    for (const p of productsWithIssues) {
      console.log(`- ${p.name} (ID: ${p.id}) - ${p.duplicates}x duplicado`);
    }

    console.log('\n💡 AÇÃO RECOMENDADA:');
    console.log('   Vá em WooCommerce → Produtos → Edite cada produto acima');
    console.log('   Na aba Variações, exclua as variações duplicadas');
    console.log('');
  }
}

main().catch(console.error);
