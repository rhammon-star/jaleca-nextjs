import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Mapeamento profissão → pasta
const PROFESSION_PAGES = {
  'medica': 'jaleco-medico-feminino',
  'medico': 'jaleco-medico',
  'medicina': 'jaleco-medicina',
  'dentista': 'jaleco-dentista',
  'dentista-feminino': 'jaleco-dentista-feminino',
  'enfermeira': 'jaleco-enfermeiro', // Página usa enfermeiro no slug mas pode ser unissex
  'enfermeiro': 'jaleco-enfermeiro',
  'enfermagem': 'jaleco-enfermagem',
  'farmaceutica': 'jaleco-farmacia',
  'farmaceutico': 'jaleco-farmaceutico',
  'farmacia': 'jaleco-farmacia',
  'veterinario': 'jaleco-veterinario',
  'nutricionista': 'jaleco-nutricionista',
  'nutricao': 'jaleco-nutricao',
  'fisioterapeuta': 'jaleco-fisioterapeuta',
  'fisioterapia': 'jaleco-fisioterapia',
  'psicologa': 'jaleco-psicologa',
  'biomedico': 'jaleco-biomedico',
  'odontologia': 'jaleco-odontologia',
  'podologo': 'jaleco-podologo',
  'advogado': 'jaleco-advogado',
  'pastor': 'jaleco-pastor',
  'professor': 'jaleco-professor',
  'universitario': 'jaleco-universitario',
  'secretaria': 'jaleco-secretaria',
  'esteticista': 'jaleco-esteticista',
  'cabeleireiro': 'jaleco-cabeleireiro',
  'barbeiro': 'jaleco-barbeiro',
  'tatuador': 'jaleco-tatuador',
  'massagista': 'jaleco-massagista',
  'dona-casa': 'jaleco-dona-casa',
  'cozinheiro': 'dolma-cozinheiro',
  'churrasqueiro': 'jaleco-churrasqueiro',
  'sushiman': 'jaleco-sushiman',
};

const baseDir = process.cwd();

console.log('📸 Atualizando fotos hero nas páginas de profissão...\n');

let updated = 0;
let skipped = 0;

Object.entries(PROFESSION_PAGES).forEach(([profession, folder]) => {
  const filePath = join(baseDir, 'app', folder, 'page.tsx');

  try {
    let content = readFileSync(filePath, 'utf-8');

    // Verifica se já tem o import
    if (!content.includes('getHeroImageSlug')) {
      // Adiciona import após outros imports
      const lastImportIndex = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      const beforeImports = content.substring(0, endOfLastImport + 1);
      const afterImports = content.substring(endOfLastImport + 1);

      content = beforeImports +
        "import { getHeroImageSlug } from '@/lib/profession-hero-images'\n" +
        afterImports;
    }

    // Atualiza função getHeroImage para usar slug fixo
    const oldGetHeroImage = /async function getHeroImage\(\): Promise<\{ src: string; alt: string \} \| null> \{[\s\S]*?^}/m;

    const newGetHeroImage = `async function getHeroImage(): Promise<{ src: string; alt: string } | null> {
  try {
    const heroSlug = getHeroImageSlug('${profession}')
    if (!heroSlug) return null

    const data = await graphqlClient.request<{ product: { name: string; image: { sourceUrl: string; altText: string } } | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug: heroSlug }
    )

    if (data?.product?.image?.sourceUrl) {
      return {
        src: data.product.image.sourceUrl,
        alt: data.product.image.altText || data.product.name
      }
    }
    return null
  } catch {
    return null
  }
}`;

    if (oldGetHeroImage.test(content)) {
      content = content.replace(oldGetHeroImage, newGetHeroImage);
      writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ ${folder} (${profession})`);
      updated++;
    } else {
      console.log(`⏭️  ${folder} - função getHeroImage não encontrada`);
      skipped++;
    }

  } catch (err) {
    console.log(`❌ ${folder} - ${err.message}`);
    skipped++;
  }
});

console.log(`\n📊 Resumo: ${updated} atualizadas, ${skipped} ignoradas`);
