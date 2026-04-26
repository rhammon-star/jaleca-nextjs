#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('📱 Corrigindo overflow mobile — removendo inline gridTemplateColumns...\n');

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

    // 1. Hero grid - remover gridTemplateColumns inline (conflita com grid-cols-1 lg:grid-cols-2)
    content = content.replace(
      /className="grid grid-cols-1 lg:grid-cols-2" style=\{\{ gridTemplateColumns: '1fr 1fr',/g,
      `className="grid grid-cols-1 lg:grid-cols-2" style={{`
    );

    // 2. Trust bar - remover gridTemplateColumns inline
    content = content.replace(
      /className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4[^"]*" style=\{\{ gridTemplateColumns: 'repeat\(4,1fr\)',/g,
      `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0" style={{`
    );

    // 3. Guia grid - remover gridTemplateColumns inline
    content = content.replace(
      /className="grid grid-cols-1 lg:grid-cols-\[280px_1fr\][^"]*" style=\{\{ gridTemplateColumns: '280px 1fr',/g,
      `className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{`
    );

    // 4. Remove gridTemplateColumns sozinho se sobrar
    content = content.replace(
      /style=\{\{ gridTemplateColumns: '[^']*', /g,
      'style={{ '
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
