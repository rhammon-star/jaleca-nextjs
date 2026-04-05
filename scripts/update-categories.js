/**
 * Script para atualizar categorias de produtos baseado no nome
 *
 * Regras:
 * - Nome contém "Jaleco":
 *     + "Feminino" → Jalecos + Jalecos Femininos (IDs: 1066, 1493)
 *     + "Masculino" → Jalecos + Jalecos Masculinos (IDs: 1066, 1495)
 *     + nenhum → Jalecos (ID: 1066)
 *
 * - Nome contém "Dólmã" ou "Dolma":
 *     + "Feminino" → Dólmãs + Dólmãs Feminino (IDs: 1405, 1496)
 *     + "Masculino" → Dólmãs + Dólmãs Masculino (IDs: 1405, 1497)
 *     + nenhum → Dólmãs (ID: 1405)
 *
 * - Nome contém "Conjunto":
 *     + "Feminino" → Conjuntos + Conjuntos Femininos (IDs: 1452, 1492)
 *     + "Masculino" → Conjuntos + Conjuntos Masculinos (IDs: 1452, 1494)
 *     + nenhum → Conjuntos (ID: 1452)
 *
 * - Nome contém "Touca" ou "Acessório" → Acessorios (ID: 1470)
 *
 * Uso:
 *   node update-categories.js        → apenas verificar (não altera nada)
 *   node update-categories.js apply  → aplica as mudanças
 */

const https = require('https');

const WC_URL = 'https://wp.jaleca.com.br';
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Configure WC_KEY e WC_SECRET');
  process.exit(1);
}

const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
const APPLY = process.argv.includes('apply');

// Category IDs
const CATS = {
  // Principais
  JALECOS: 1066,
  DOLMAS: 1405,
  CONJUNTOS: 1452,
  ACESSORIOS: 1470,
  // Jalecos
  JALECOS_FEM: 1493,
  JALECOS_MASC: 1495,
  // Dólmãs
  DOLMAS_FEM: 1496,
  DOLMAS_MASC: 1497,
  // Conjuntos
  CONJUNTOS_FEM: 1492,
  CONJUNTOS_MASC: 1494,
};

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function fetch(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, WC_URL);
    const opt = {
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      ...options,
    };
    https.get(url, opt, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`HTTP ${res.status}: ${data.slice(0, 100)}`)); }
      });
    }).on('error', reject);
  });
}

async function put(path, body) {
  return fetch(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getTargetCategories(name) {
  const n = norm(name);

  // Ignorar produtos de teste
  if (n.includes('teste') || n.includes('ecom-d')) {
    return null;
  }

  // Acessorios (prioridade mais baixa)
  if (n.includes('touca') || n.includes('acessório') || n.includes('accessorio')) {
    return [{ id: CATS.ACESSORIOS, name: 'Acessorios' }];
  }

  // Jalecos
  if (n.includes('jaleco')) {
    const cats = [{ id: CATS.JALECOS, name: 'Jalecos' }];
    if (n.includes('feminino')) {
      cats.push({ id: CATS.JALECOS_FEM, name: 'Jalecos Femininos' });
    } else if (n.includes('masculino')) {
      cats.push({ id: CATS.JALECOS_MASC, name: 'Jalecos Masculinos' });
    }
    return cats;
  }

  // Dólmãs
  if (n.includes('dólmã') || n.includes('dolma')) {
    const cats = [{ id: CATS.DOLMAS, name: 'Dólmãs' }];
    if (n.includes('feminino')) {
      cats.push({ id: CATS.DOLMAS_FEM, name: 'Dólmãs Feminino' });
    } else if (n.includes('masculino')) {
      cats.push({ id: CATS.DOLMAS_MASC, name: 'Dólmãs Masculino' });
    }
    return cats;
  }

  // Conjuntos (qualquer produto com "Conjunto" ou "Macacão" no nome)
  if (n.includes('conjunto') || n.includes('macação') || n.includes('macacao')) {
    const cats = [{ id: CATS.CONJUNTOS, name: 'Conjuntos' }];
    if (n.includes('feminino')) {
      cats.push({ id: CATS.CONJUNTOS_FEM, name: 'Conjuntos Femininos' });
    } else if (n.includes('masculino')) {
      cats.push({ id: CATS.CONJUNTOS_MASC, name: 'Conjuntos Masculinos' });
    }
    return cats;
  }

  // Sem categoria definida
  return null;
}

async function main() {
  console.log(APPLY ? '🔄 MODO: APLICANDO MUDANÇAS\n' : '🔍 MODO: VERIFICAÇÃO (sem alterações)\n');

  // Get all products
  const allProducts = [];
  for (let page = 1; page <= 30; page++) {
    const products = await fetch(`/wp-json/wc/v3/products?page=${page}&per_page=100`);
    if (!products.length) break;
    allProducts.push(...products);
    if (products.length < 100) break;
  }

  console.log(`📦 Total de produtos: ${allProducts.length}\n`);

  const results = {
    updated: 0,
    skipped: 0,
    needs_review: 0,
    errors: 0,
  };

  const needsReview = [];
  const changes = [];

  for (const p of allProducts) {
    const name = p.name;
    const currentCats = (p.categories || []).map(c => c.id);
    const suggestedCats = getTargetCategories(name);

    if (!suggestedCats) {
      needsReview.push({
        id: p.id,
        name: p.name,
        sku: p.sku,
        categories: p.categories.map(c => c.name).join(', ') || 'Nenhuma',
      });
      results.needs_review++;
      continue;
    }

    // Check if already has all the correct categories
    const suggestedIds = suggestedCats.map(c => c.id).sort();
    const currentSorted = [...currentCats].sort();
    const isCorrect = JSON.stringify(suggestedIds) === JSON.stringify(currentSorted);

    if (isCorrect) {
      results.skipped++;
      continue;
    }

    changes.push({
      id: p.id,
      name: p.name,
      sku: p.sku,
      from: p.categories.map(c => c.name).join(', ') || 'Nenhuma',
      to: suggestedCats.map(c => c.name).join(' + '),
      toIds: suggestedCats.map(c => c.id),
    });

    if (APPLY) {
      try {
        await put(`/wp-json/wc/v3/products/${p.id}`, {
          categories: suggestedCats.map(c => ({ id: c.id })),
        });
        results.updated++;
        await sleep(200);
      } catch (e) {
        console.log(`   ❌ Erro: ${e.message}`);
        results.errors++;
      }
    }
  }

  // Show changes
  if (changes.length > 0) {
    console.log('═'.repeat(70));
    console.log(`📋 MUDANÇAS (${changes.length} produtos):`);
    console.log('═'.repeat(70));
    for (const c of changes) {
      console.log(`\n📝 ${c.name}`);
      console.log(`   ID: ${c.id} | SKU: ${c.sku || 'N/A'}`);
      console.log(`   De: ${c.from}`);
      console.log(`   Para: ${c.to}`);
      if (!APPLY) console.log(`   (Simulação — não aplicou)`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('📊 RESUMO');
  console.log('═'.repeat(70));
  console.log(`✅ Categorias atualizadas: ${APPLY ? results.updated : changes.length} ${APPLY ? '' : '(simulação)'}`);
  console.log(`⏭️  Já estavam corretas: ${results.skipped}`);
  console.log(`⚠️  Precisam revisão manual: ${results.needs_review}`);
  console.log(`❌ Erros: ${results.errors}`);

  if (needsReview.length > 0) {
    console.log('\n📋 PRODUTOS QUE PRECISAM REVISÃO MANUAL:');
    for (const p of needsReview) {
      console.log(`  - ${p.name} (ID: ${p.id})`);
      console.log(`    Categorias atuais: ${p.categories}`);
    }
  }

  if (!APPLY && changes.length > 0) {
    console.log('\n💡 Para aplicar as mudanças, rode: node update-categories.js apply');
  }
}

main().catch(console.error);
