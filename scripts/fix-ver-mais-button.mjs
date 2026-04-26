#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('🔧 Movendo botão "Ver mais" para DEPOIS do grid de produtos...\n');

const dirs = readdirSync(appDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && (
    d.name.startsWith('jaleco-') ||
    d.name.startsWith('conjunto-') ||
    d.name.startsWith('dolma-')
  ))
  .map(d => d.name);

console.log(`📂 ${dirs.length} páginas encontradas\n`);

let updated = 0;
let skipped = 0;

dirs.forEach(dir => {
  const pagePath = join(appDir, dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    const original = content;

    // Verificar se a página tem produtos (getVerMaisUrl presente)
    if (!content.includes('getVerMaisUrl')) {
      skipped++;
      return;
    }

    // 1. Encontrar e capturar o bloco completo do header com botão
    // Padrão: <div className="flex justify-between..."> até </div>
    const headerRegex = /(<div className="flex justify-between items-end flex-wrap gap-4 mb-10">[\s\S]*?)<Link href=\{getVerMaisUrl\([^)]+\)\}[^>]*>\s*Ver mais[^<]*<\/Link>\s*<\/div>/;

    const headerMatch = content.match(headerRegex);
    if (!headerMatch) {
      console.log(`⚠️  ${dir} — estrutura do header não encontrada`);
      return;
    }

    // 2. Remover todo o flex container e substituir por div simples com título
    content = content.replace(
      headerRegex,
      '$1</div>'
    );

    // 3. Trocar a classe do container de flex para simples
    content = content.replace(
      '<div className="flex justify-between items-end flex-wrap gap-4 mb-10">',
      '<div className="mb-10">'
    );

    // 4. Encontrar o final do grid de produtos e adicionar botão centralizado ANTES do </div></div>
    // Padrão: grid com ProductCard... </div> + 2 fechamentos de div
    const gridEndPattern = /(\{produtos\.slice\(0, 6\)\.map\(product => \(\s*<ProductCard[^/]*\/>\s*\)\)\}\s*<\/div>)/;

    if (!gridEndPattern.test(content)) {
      console.log(`⚠️  ${dir} — fim do grid não encontrado`);
      return;
    }

    content = content.replace(
      gridEndPattern,
      `$1\n              <div className="flex justify-center mt-8">\n                <Link href={getVerMaisUrl('${dir.replace(/^(jaleco|conjunto|dolma)-/, '')}')} style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>\n                  Ver mais →\n                </Link>\n              </div>`
    );

    if (content !== original) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${dir}`);
      updated++;
    }

  } catch (err) {
    console.log(`❌ ${dir} — ${err.message}`);
  }
});

console.log(`\n📊 ${updated} páginas atualizadas | ${skipped} páginas sem produtos (ignoradas)`);
