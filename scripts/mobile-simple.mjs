#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('📱 Mobile FIX - Approach SIMPLES (só adiciona classes)...\n');

const dirs = readdirSync(appDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && (d.name.startsWith('jaleco-') || d.name.startsWith('dolma-')))
  .map(d => d.name);

console.log(`📂 ${dirs.length} páginas\n`);

let updated = 0;

dirs.forEach(dir => {
  const pagePath = join(appDir, dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    const original = content;

    // 1. Hero section - adiciona classes grid responsivas
    content = content.replace(
      /<section\s+className="grid"\s+style=\{\{ gridTemplateColumns: '1fr 1fr'/,
      `<section className="grid grid-cols-1 lg:grid-cols-2" style={{ gridTemplateColumns: '1fr 1fr'`
    );

    // 2. Hero image - adiciona order classes
    content = content.replace(
      /<div className="relative" style=\{\{ background: '#e5e0d8', minHeight: 480/,
      `<div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: 480`
    );

    // 3. Hero text - adiciona order + responsive padding via Tailwind
    content = content.replace(
      /<div\s+className="flex flex-col justify-center"\s+style=\{\{ padding: 'clamp/,
      `<div className="flex flex-col justify-center order-2 lg:order-1 px-4 py-8 lg:px-16 lg:py-20" style={{ padding: 'clamp`
    );

    // 4. Hero buttons - stack em mobile
    content = content.replace(
      /<div className="flex gap-4 flex-wrap">/,
      `<div className="flex flex-col sm:flex-row gap-3 lg:gap-4">`
    );

    // 5. Trust bar - grid responsivo
    content = content.replace(
      /<div className="grid" style=\{\{ gridTemplateColumns: 'repeat\(4,1fr\)'/,
      `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0" style={{ gridTemplateColumns: 'repeat(4,1fr)'`
    );

    // 6. Produtos section - padding mobile
    content = content.replace(
      /\{produtos\.length > 0 && \(\s+<section style=\{\{ background: '#f9f7f4', padding: 'clamp/,
      `{produtos.length > 0 && (\n          <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp`
    );

    // 7. Guia section - padding mobile
    content = content.replace(
      /\{\/\* ── GUIA ── \*\/\}\s+<section style=\{\{ background: '#f9f7f4', padding: 'clamp/,
      `{/* ── GUIA ── */}\n        <section className="px-4 py-12 lg:px-16 lg:py-20" style={{ background: '#f9f7f4', padding: 'clamp`
    );

    // 8. Guia grid - responsivo
    content = content.replace(
      /<div className="grid" style=\{\{ gridTemplateColumns: '280px 1fr'/,
      `<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ gridTemplateColumns: '280px 1fr'`
    );

    // 9. Guia sidebar - hide nav on mobile
    content = content.replace(
      /<nav>\s+<ul style=\{\{ listStyle: 'none' \}\}>/,
      `<nav className="hidden lg:block">\n                  <ul style={{ listStyle: 'none' }}>`
    );

    if (content !== original) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${dir}`);
      updated++;
    }

  } catch (err) {
    console.log(`❌ ${dir} - ${err.message}`);
  }
});

console.log(`\n📊 ${updated} otimizadas`);
