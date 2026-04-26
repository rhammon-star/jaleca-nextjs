#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const updates = [
  {
    dir: 'jaleco-medica',
    professionKey: 'medica',
    professionLabel: 'Médica',
    professionLabelPlural: 'Médicas',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-medica',
    titleSuffix: 'Médica',
    oldWord: 'Médico',
    oldWordPlural: 'Médicos',
    oldGender: 'médico'
  },
  {
    dir: 'jaleco-enfermeira',
    professionKey: 'enfermeira',
    professionLabel: 'Enfermeira',
    professionLabelPlural: 'Enfermeiras',
    gender: 'feminino',
    category: 'conjuntos-femininos',
    url: '/jaleco-enfermeira',
    titleSuffix: 'Enfermeira',
    oldWord: 'Enfermeiro',
    oldWordPlural: 'Enfermeiros',
    oldGender: 'enfermeiro'
  },
  {
    dir: 'jaleco-farmaceutica',
    professionKey: 'farmaceutica',
    professionLabel: 'Farmacêutica',
    professionLabelPlural: 'Farmacêuticas',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-farmaceutica',
    titleSuffix: 'Farmacêutica',
    oldWord: 'Farmacêutico',
    oldWordPlural: 'Farmacêuticos',
    oldGender: 'farmaceutico'
  },
  {
    dir: 'jaleco-veterinaria',
    professionKey: 'veterinaria',
    professionLabel: 'Veterinária',
    professionLabelPlural: 'Veterinárias',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-veterinaria',
    titleSuffix: 'Veterinária',
    oldWord: 'Veterinário',
    oldWordPlural: 'Veterinários',
    oldGender: 'veterinario'
  },
  {
    dir: 'jaleco-biomedica',
    professionKey: 'biomedica',
    professionLabel: 'Biomédica',
    professionLabelPlural: 'Biomédicas',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-biomedica',
    titleSuffix: 'Biomédica',
    oldWord: 'Biomédico',
    oldWordPlural: 'Biomédicos',
    oldGender: 'biomedico'
  },
  {
    dir: 'jaleco-podologa',
    professionKey: 'podologa',
    professionLabel: 'Podóloga',
    professionLabelPlural: 'Podólogas',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-podologa',
    titleSuffix: 'Podóloga',
    oldWord: 'Podólogo',
    oldWordPlural: 'Podólogos',
    oldGender: 'podologo'
  },
  {
    dir: 'jaleco-cabeleireira',
    professionKey: 'cabeleireira',
    professionLabel: 'Cabeleireira',
    professionLabelPlural: 'Cabeleireiras',
    gender: 'feminino',
    category: 'jalecos-femininos',
    url: '/jaleco-cabeleireira',
    titleSuffix: 'Cabeleireira',
    oldWord: 'Cabeleireiro',
    oldWordPlural: 'Cabeleireiros',
    oldGender: 'cabeleireiro'
  },
];

console.log('✨ Atualizando páginas femininas...\n');

let updated = 0;

updates.forEach(config => {
  const pagePath = join(process.cwd(), 'app', config.dir, 'page.tsx');

  try {
    let content = readFileSync(pagePath, 'utf-8');
    const original = content;

    // 1. Update metadata - title
    content = content.replace(
      /title: '[^']*'/,
      `title: 'Jaleco para ${config.professionLabel}: Tecido Premium, Caimento Perfeito | Jaleca 2026'`
    );

    // 2. Update canonical URL
    content = content.replace(
      /canonical: 'https:\/\/jaleca\.com\.br\/[^']*'/,
      `canonical: 'https://jaleca.com.br${config.url}'`
    );

    // 3. Update openGraph url
    content = content.replace(
      /url: 'https:\/\/jaleca\.com\.br\/[^']*'/,
      `url: 'https://jaleca.com.br${config.url}'`
    );

    // 4. Update breadcrumb final item
    content = content.replace(
      /{ '@type': 'ListItem', position: 3, name: '[^']*', item: '[^']*' }/,
      `{ '@type': 'ListItem', position: 3, name: 'Jaleco para ${config.professionLabel}', item: 'https://jaleca.com.br${config.url}' }`
    );

    // 5. Update article headline
    content = content.replace(
      /headline: '[^']*'/,
      `headline: 'Jaleco para ${config.professionLabel}: Tecido Premium, Caimento Perfeito'`
    );

    // 6. Update article url
    content = content.replace(
      /@type': 'Article'[\s\S]*?url: '[^']*'/,
      match => match.replace(/url: '[^']*'/, `url: 'https://jaleca.com.br${config.url}'`)
    );

    // 7. Update profession key in getJalecos and getHeroImage
    content = content.replace(
      new RegExp(`PROFESSION_PRODUCT_SLUGS\\['${config.oldGender}'\\]`, 'g'),
      `PROFESSION_PRODUCT_SLUGS['${config.professionKey}']`
    );

    content = content.replace(
      new RegExp(`getHeroImageSlug\\('${config.oldGender}'\\)`, 'g'),
      `getHeroImageSlug('${config.professionKey}')`
    );

    content = content.replace(
      new RegExp(`getVerMaisUrl\\('${config.oldGender}'\\)`, 'g'),
      `getVerMaisUrl('${config.professionKey}')`
    );

    // 8. Update H1 title
    content = content.replace(
      /<em[^>]*>[^<]*<\/em>/,
      `<em style={{ fontStyle: 'italic', fontWeight: 300 }}>${config.professionLabel}</em>`
    );

    // 9. Update collection label
    content = content.replace(
      /Coleção [^<]*/,
      `Coleção ${config.professionLabel.toLowerCase()}`
    );

    // 10. Update H2 "Jalecos para X"
    content = content.replace(
      /Jalecos para<br \/><em[^>]*>[^<]*<\/em>/,
      `Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>${config.professionLabelPlural}</em>`
    );

    // 11. Update button links (Feminino first, Masculino second for feminine pages)
    content = content.replace(
      /<Link href="\/produtos\?categoria=jalecos-femininos"[\s\S]*?Feminino[\s\S]*?<\/Link>\s*<Link href="\/produtos\?categoria=jalecos-masculinos"[\s\S]*?Masculino[\s\S]*?<\/Link>/,
      match => match // Keep as is - Feminino already first
    );

    // 12. Update breadcrumb label
    content = content.replace(
      /{ label: 'Para [^']*', href: null }/,
      `{ label: 'Para ${config.professionLabel}', href: null }`
    );

    if (content !== original) {
      writeFileSync(pagePath, content, 'utf-8');
      console.log(`✅ ${config.dir}`);
      updated++;
    } else {
      console.log(`➖ ${config.dir} — sem alterações`);
    }

  } catch (err) {
    console.log(`❌ ${config.dir} — ${err.message}`);
  }
});

console.log(`\n📊 ${updated} páginas atualizadas`);
