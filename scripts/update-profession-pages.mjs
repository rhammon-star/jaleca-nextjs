#!/usr/bin/env node

/**
 * Script para atualizar todas as páginas de profissão
 * Adiciona produtos filhos + priorização de cores + link "Ver mais" correto
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Mapeamento URL → chave de profissão
const PROFESSION_PAGES = {
  // SAÚDE
  'jaleco-medico': 'medico',
  'jaleco-medico-feminino': 'medica',
  'jaleco-medicina': 'medica',
  'jaleco-enfermeiro': 'enfermeiro',
  'jaleco-enfermagem': 'enfermagem',
  'jaleco-enfermagem-feminino': 'enfermeira',
  'jaleco-dentista': 'dentista',
  'jaleco-dentista-feminino': 'dentista',
  'jaleco-farmaceutico': 'farmaceutico',
  'jaleco-farmacia': 'farmaceutica',
  'jaleco-nutricionista': 'nutricionista',
  'jaleco-nutricao': 'nutricionista',
  'jaleco-psicologa': 'psicologa',
  'jaleco-biomedico': 'biomedico',
  'jaleco-fisioterapeuta': 'fisioterapeuta',
  'jaleco-fisioterapia': 'fisioterapeuta',
  'jaleco-podologo': 'podologo',
  'jaleco-odontologia': 'dentista',
  'jaleco-veterinario': 'veterinario', // Já feito (referência)

  // JURÍDICO/EDUCAÇÃO
  'jaleco-advogado': 'advogado',
  'jaleco-professor': 'professor',
  'jaleco-universitario': 'universitario',

  // ESTÉTICA/BELEZA
  'jaleco-esteticista': 'esteticista',
  'jaleco-massagista': 'massagista',
  'jaleco-tatuador': 'tatuador',
  'jaleco-barbeiro': 'barbeiro',
  'jaleco-cabeleireiro': 'cabeleireiro',

  // GASTRONOMIA
  'jaleco-churrasqueiro': 'churrasqueiro',
  'jaleco-cozinheiro': 'cozinheiro',
  'jaleco-sushiman': 'sushiman',

  // OUTROS
  'jaleco-pastor': 'pastor',
  'jaleco-secretaria': 'secretaria',
  'jaleco-dona-casa': 'dona-de-casa',

  // ESPECIAIS
  'jaleco-preto': 'preto',
  'jaleco-estiloso': 'estiloso',
};

function updateProfessionPage(pageDir, professionKey) {
  const pagePath = join(process.cwd(), 'app', pageDir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    let modified = false;

    // 1. Atualizar imports
    if (!content.includes("import { getAllProducts }")) {
      content = content.replace(
        "import { PROFESSION_PRODUCT_SLUGS } from '@/lib/product-professions'",
        "import { PROFESSION_PRODUCT_SLUGS, prioritizeByColor, getVerMaisUrl } from '@/lib/product-professions'\nimport { getAllProducts } from '@/lib/all-products'"
      );

      // Remover import GET_PRODUCTS se existir (não precisamos mais)
      content = content.replace(
        /(import.*GET_PRODUCTS.*from '@\/lib\/graphql')/,
        (match) => match.replace(', GET_PRODUCTS', '').replace('GET_PRODUCTS, ', '')
      );

      modified = true;
      console.log(`✓ Imports atualizados: ${pageDir}`);
    }

    // 2. Substituir função getJalecos() ou equivalente
    const jalecosRegex = /async function get\w+\(\): Promise<WooProduct\[\]> \{[\s\S]*?catch.*?\{[\s\S]*?return \[\][\s\S]*?\}[\s\S]*?\}/;

    if (jalecosRegex.test(content)) {
      const newGetJalecos = `async function getJalecos(): Promise<WooProduct[]> {
  try {
    // Busca TODOS os produtos (inclui produtos filhos/cores)
    const allProducts = await getAllProducts()

    // Filtra por profissão ${professionKey}
    const slugs = PROFESSION_PRODUCT_SLUGS['${professionKey}'] ?? []
    const professionProducts = allProducts.filter(p => {
      // Produto mãe está na lista OU produto filho cujo pai está na lista
      if (slugs.includes(p.slug)) return true

      // Verifica se é produto filho (tem cor no slug)
      const parts = p.slug.split('-')
      const possibleColor = parts[parts.length - 1]
      const baseSlug = parts.slice(0, -1).join('-')

      return slugs.includes(baseSlug)
    })

    // Prioriza branco e preto primeiro (mais vendidos)
    const prioritized = prioritizeByColor(professionProducts)

    // Retorna 6 produtos
    return prioritized.slice(0, 6)
  } catch (error) {
    console.error('[getJalecos] Error:', error)
    return []
  }
}`;

      content = content.replace(jalecosRegex, newGetJalecos);
      modified = true;
      console.log(`✓ Função getJalecos() atualizada: ${pageDir}`);
    }

    // 3. Atualizar link "Ver todos" ou "Ver mais"
    const linkRegex = /<Link href="\/produtos\?categoria=jalecos"[^>]*>\s*Ver (todos|mais)/g;
    if (linkRegex.test(content)) {
      content = content.replace(
        linkRegex,
        `<Link href={getVerMaisUrl('${professionKey}')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>\n                  Ver mais`
      );
      modified = true;
      console.log(`✓ Link "Ver mais" atualizado: ${pageDir}`);
    }

    if (modified) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${pageDir} atualizado com sucesso!\n`);
      return true;
    } else {
      console.log(`⚠️  ${pageDir} não precisou de mudanças (já atualizado?)\n`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Erro ao processar ${pageDir}:`, error.message);
    return false;
  }
}

// Executar
console.log('🚀 Atualizando páginas de profissão...\n');

let updated = 0;
let total = 0;

for (const [pageDir, professionKey] of Object.entries(PROFESSION_PAGES)) {
  if (pageDir === 'jaleco-veterinario') {
    console.log(`⏭️  ${pageDir} (já atualizado manualmente)\n`);
    continue;
  }

  total++;
  const success = updateProfessionPage(pageDir, professionKey);
  if (success) updated++;
}

console.log(`\n✨ Concluído! ${updated}/${total} páginas atualizadas.`);
