#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('📱 Otimizando MOBILE - Approach v2 (seguro)...\n');

const dirs = readdirSync(appDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && (d.name.startsWith('jaleco-') || d.name.startsWith('dolma-')))
  .map(d => d.name);

console.log(`📂 ${dirs.length} páginas encontradas\n`);

let updated = 0;
let errors = 0;

dirs.forEach(dir => {
  const pagePath = join(appDir, dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    const original = content;

    // 1. Hero section - grid responsivo
    content = content.replace(
      /className="grid"\s+style=\{\{ gridTemplateColumns: '1fr 1fr', minHeight: '88vh'/,
      `className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'auto'`
    );

    // 2. Hero image container - order para mobile (foto primeiro)
    content = content.replace(
      /<div className="relative" style=\{\{ background: '#e5e0d8', minHeight: 480/,
      `<div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: '50vh'`
    );

    // 3. Hero text container - order + padding responsivo
    content = content.replace(
      /className="flex flex-col justify-center"\s+style=\{\{ padding: 'clamp\([^)]+\)[^)]+\)', background: '#f9f7f4'/,
      `className="flex flex-col justify-center order-2 lg:order-1" style={{ padding: '3rem 1.5rem', background: '#f9f7f4'`
    );

    // 4. Hero h1 - tamanho responsivo
    content = content.replace(
      /fontSize: 'clamp\(3rem,5\.5vw,5\.2rem\)'/,
      `fontSize: 'clamp(2.5rem, 10vw, 5.2rem)'`
    );

    // 5. Hero description - margins responsivos
    content = content.replace(
      /marginBottom: '2\.5rem'/,
      `marginBottom: '2rem'`
    );

    // 6. Hero buttons container - stack em mobile
    content = content.replace(
      /<div className="flex gap-4 flex-wrap">/,
      `<div className="flex flex-col sm:flex-row gap-3">`
    );

    // 7. Botões - touch targets 48px
    content = content.replace(
      /padding: '0\.9rem 2rem'/g,
      `padding: '1rem 2rem', minHeight: '48px'`
    );

    // 8. Trust bar - grid responsivo
    content = content.replace(
      /className="grid" style=\{\{ gridTemplateColumns: 'repeat\(4,1fr\)', /,
      `className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ `
    );

    // 9. Trust bar items - remove border desktop, add mobile
    content = content.replace(
      /className="flex items-center gap-4" style=\{\{ padding: '0\.5rem 1\.5rem', borderRight:/,
      `className="flex items-center gap-4 py-4 px-0 lg:px-6 border-b border-white/10 lg:border-b-0" style={{ borderRight:`
    );

    // 10. Guia section - padding responsivo
    content = content.replace(
      /style=\{\{ background: '#f9f7f4', padding: 'clamp\(4rem,8vw,7rem\) clamp\(1\.5rem,5vw,4rem\)'/,
      `className="px-6 py-12 lg:px-16 lg:py-28" style={{ background: '#f9f7f4'`
    );

    // 11. Guia grid - responsivo
    content = content.replace(
      /className="grid" style=\{\{ gridTemplateColumns: '280px 1fr'/,
      `className="grid grid-cols-1 lg:grid-cols-[280px_1fr]`
    );

    // 12. Guia sidebar - sticky apenas desktop
    content = content.replace(
      /<aside style=\{\{ position: 'sticky', top: 80 \}\}>/,
      `<aside className="mb-8 lg:mb-0 lg:sticky lg:top-20">`
    );

    // 13. Guia nav - esconder em mobile
    content = content.replace(
      /<nav>\s+<ul style=\{\{ listStyle: 'none'/,
      `<nav className="hidden lg:block">\n                  <ul style={{ listStyle: 'none'`
    );

    // 14. Produtos section - padding responsivo
    content = content.replace(
      /style=\{\{ background: '#f9f7f4', padding: 'clamp\(4rem,8vw,7rem\) clamp\(1\.5rem,5vw,4rem\)' \}\}>\s+<div style=\{\{ maxWidth: 1200/,
      `className="px-6 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4' }}>\n            <div style={{ maxWidth: 1200`
    );

    if (content !== original) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${dir}`);
      updated++;
    } else {
      console.log(`⏭️  ${dir} - sem mudanças`);
    }

  } catch (err) {
    console.log(`❌ ${dir} - ${err.message}`);
    errors++;
  }
});

console.log(`\n📊 ${updated} otimizadas, ${errors} erros`);
