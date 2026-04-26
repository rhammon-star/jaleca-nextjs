#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const baseDir = process.cwd();
const appDir = join(baseDir, 'app');

console.log('🔧 Otimizando páginas de profissão para MOBILE...\n');

// Encontra todos os diretórios jaleco-* e dolma-*
const dirs = readdirSync(appDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && (dirent.name.startsWith('jaleco-') || dirent.name.startsWith('dolma-')))
  .map(dirent => dirent.name);

console.log(`📂 Encontrados ${dirs.length} diretórios de profissão\n`);

let updated = 0;
let skipped = 0;

dirs.forEach(dir => {
  const pagePath = join(appDir, dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    let modified = false;

    // Fix 1: Hero section - mobile first grid
    const heroOld = /\{\/\* ── HERO ── \*\/\}\s*<section[^>]*className="grid"[^>]*style=\{\{ gridTemplateColumns: '1fr 1fr'[^}]*\}\}/;
    const heroNew = `{/* ── HERO ── MOBILE FIRST */}
        <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 'auto', padding: 0 }}`;

    if (heroOld.test(content)) {
      content = content.replace(heroOld, heroNew);
      modified = true;
    }

    // Fix 2: Hero image - add order classes for mobile (foto primeiro)
    const heroImgOld = /<div className="relative" style=\{\{ background: '#e5e0d8', minHeight: 480, overflow: 'hidden' \}\}>/;
    const heroImgNew = `<div className="relative order-1 lg:order-2" style={{ background: '#e5e0d8', minHeight: '50vh', overflow: 'hidden' }}>`;

    if (heroImgOld.test(content)) {
      content = content.replace(heroImgOld, heroImgNew);
      modified = true;
    }

    // Fix 3: Hero text - add order classes + responsive padding
    const heroTextOld = /<div\s+className="flex flex-col justify-center"\s+style=\{\{ padding: 'clamp\([^)]+\)[^)]+\)', background: '#f9f7f4' \}\}>/;
    const heroTextNew = `<div
            className="flex flex-col justify-center order-2 lg:order-1 px-6 py-12 lg:px-16 lg:py-20"
            style={{ background: '#f9f7f4' }}
          >`;

    if (heroTextOld.test(content)) {
      content = content.replace(heroTextOld, heroTextNew);
      modified = true;
    }

    // Fix 4: Hero title - responsive text size
    const heroTitleOld = /<h1\s+style=\{\{[^}]+fontFamily:[^}]+fontSize: 'clamp\(3rem,5\.5vw,5\.2rem\)'[^>]+>/;
    const heroTitleNew = `<h1
              className="text-5xl lg:text-7xl mb-4 lg:mb-6"
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
              }}
            >`;

    if (heroTitleOld.test(content)) {
      content = content.replace(heroTitleOld, heroTitleNew);
      modified = true;
    }

    // Fix 5: Hero description - responsive margins
    const heroDescOld = /style=\{\{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2\.5rem', lineHeight: 1\.8 \}\}>/;
    const heroDescNew = `className="text-base lg:text-lg mb-8 lg:mb-10" style={{ fontWeight: 300, color: '#6b6b6b', maxWidth: 420, lineHeight: 1.8 }}>`;

    if (heroDescOld.test(content)) {
      content = content.replace(heroDescOld, heroDescNew);
      modified = true;
    }

    // Fix 6: Hero buttons - touch targets + responsive layout
    const heroBtnContainerOld = /<div className="flex gap-4 flex-wrap">/;
    const heroBtnContainerNew = `<div className="flex flex-col sm:flex-row gap-3 lg:gap-4">`;

    if (heroBtnContainerOld.test(content)) {
      content = content.replace(heroBtnContainerOld, heroBtnContainerNew);
      modified = true;
    }

    // Fix 7: Buttons - add touch target classes
    const btnOld = /style=\{\{ display: 'inline-flex', alignItems: 'center', gap: '0\.5rem', padding: '0\.9rem 2rem'/g;
    const btnNew = `className="inline-flex items-center justify-center gap-2 px-8 py-3.5 lg:px-8 lg:py-3.5 text-center"
                style={{ minHeight: 48, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem'`;

    if (btnOld.test(content)) {
      content = content.replace(btnOld, btnNew);
      modified = true;
    }

    // Fix 8: Trust bar - responsive grid
    const trustBarOld = /<div className="grid" style=\{\{ gridTemplateColumns: 'repeat\(4,1fr\)'[^}]*\}\}>/;
    const trustBarNew = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0" style={{ background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>`;

    if (trustBarOld.test(content)) {
      content = content.replace(trustBarOld, trustBarNew);
      modified = true;
    }

    // Fix 9: Trust bar items - remove desktop borders for mobile
    const trustItemOld = /style=\{\{ padding: '0\.5rem 1\.5rem', borderRight: i < 3 \? '1px solid rgba\(255,255,255,0\.12\)' : 'none' \}\}>/;
    const trustItemNew = `className="flex items-center gap-4 px-0 py-2 lg:px-6 lg:py-2"
              style={{ borderRight: i < 3 ? 'none' : 'none', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}
            >`;

    if (trustItemOld.test(content)) {
      content = content.replace(trustItemOld, trustItemNew);
      modified = true;
    }

    // Fix 10: Guia section - responsive grid
    const guiaGridOld = /<div className="grid" style=\{\{ gridTemplateColumns: '280px 1fr'[^}]*\}\}>/;
    const guiaGridNew = `<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-24" style={{ alignItems: 'start' }}>`;

    if (guiaGridOld.test(content)) {
      content = content.replace(guiaGridOld, guiaGridNew);
      modified = true;
    }

    // Fix 11: Guia sidebar - sticky only on desktop, hidden nav on mobile
    const guiaSidebarOld = /<aside style=\{\{ position: 'sticky', top: 80 \}\}>/;
    const guiaSidebarNew = `<aside className="lg:sticky lg:top-20">`;

    if (guiaSidebarOld.test(content)) {
      content = content.replace(guiaSidebarOld, guiaSidebarNew);
      content = content.replace(/<nav>/, `<nav className="hidden lg:block">`);
      modified = true;
    }

    // Fix 12: Guia section padding
    const guiaPaddingOld = /<section style=\{\{ background: '#f9f7f4', padding: 'clamp\(4rem,8vw,7rem\) clamp\(1\.5rem,5vw,4rem\)' \}\}>/;
    const guiaPaddingNew = `<section className="px-6 py-16 lg:px-16 lg:py-28" style={{ background: '#f9f7f4' }}>`;

    if (guiaPaddingOld.test(content)) {
      content = content.replace(guiaPaddingOld, guiaPaddingNew);
      modified = true;
    }

    if (modified) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${dir}`);
      updated++;
    } else {
      console.log(`⏭️  ${dir} - sem alterações necessárias`);
      skipped++;
    }

  } catch (err) {
    console.log(`❌ ${dir} - ${err.message}`);
    skipped++;
  }
});

console.log(`\n📊 Resumo: ${updated} atualizadas, ${skipped} ignoradas`);
