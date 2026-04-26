#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('📱 Corrigindo maxWidth mobile — adiciona width: 100%...\n');

const dirs = readdirSync(appDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && (
    d.name.startsWith('jaleco-') ||
    d.name.startsWith('conjunto-') ||
    d.name.startsWith('dolma-')
  ))
  .map(d => d.name);

console.log(`📂 ${dirs.length} páginas\n`);

let updated = 0;

dirs.forEach(dir => {
  const pagePath = join(appDir, dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    const original = content;

    // Adicionar width: '100%' em todos os containers com maxWidth: 1200
    // Padrão: style={{ maxWidth: 1200, margin: '0 auto' }}
    // Fix: style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}
    content = content.replace(
      /style=\{\{ maxWidth: 1200, margin: '0 auto' \}\}/g,
      `style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}`
    );

    // Casos onde já tem outras propriedades
    content = content.replace(
      /style=\{\{ maxWidth: 1200,(?! width:)/g,
      `style={{ maxWidth: 1200, width: '100%',`
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

console.log(`\n📊 ${updated} páginas corrigidas`);
