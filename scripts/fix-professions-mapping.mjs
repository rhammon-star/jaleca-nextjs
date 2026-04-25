#!/usr/bin/env node
/**
 * PROJETO JALECA CORES — Ponto 4: Fix Mapeamento Profissões
 *
 * Corrige:
 * - Profissões sem produtos (Advogado: 0)
 * - Desbalanceamento masc/fem (Veterinário: 1, Veterinária: 20)
 * - Profissões com poucos produtos (≤3)
 */

import { readFile, writeFile } from 'fs/promises'

// Inline data (evita import .ts)
const PRODUCT_PROFESSIONS = JSON.parse(
  await readFile(new URL('../.cache/product-professions.json', import.meta.url).catch(() => '[]'))
)

const PROFESSION_MAP = {
  medica: { label: 'Médica', hub: '/jaleco-medico' },
  medico: { label: 'Médico', hub: '/jaleco-medico' },
  dentista: { label: 'Dentista', hub: '/jaleco-dentista' },
  enfermeira: { label: 'Enfermeira', hub: '/jaleco-enfermeiro' },
  enfermeiro: { label: 'Enfermeiro', hub: '/jaleco-enfermeiro' },
  farmaceutica: { label: 'Farmacêutica', hub: '/jaleco-farmaceutico' },
  farmaceutico: { label: 'Farmacêutico', hub: '/jaleco-farmaceutico' },
  nutricionista: { label: 'Nutricionista', hub: '/jaleco-nutricionista' },
  veterinaria: { label: 'Veterinária', hub: '/jaleco-veterinario' },
  veterinario: { label: 'Veterinário', hub: '/jaleco-veterinario' },
  psicologa: { label: 'Psicóloga', hub: '/jaleco-psicologa' },
  biomedica: { label: 'Biomédica', hub: '/jaleco-biomedico' },
  biomedico: { label: 'Biomédico', hub: '/jaleco-biomedico' },
  pastor: { label: 'Pastor', hub: '/jaleco-pastor' },
  'nail design': { label: 'Nail Design', hub: '/jaleco-esteticista' },
  micropigmentadora: { label: 'Micropigmentadora', hub: '/jaleco-esteticista' },
  massagista: { label: 'Massagista', hub: '/jaleco-massagista' },
  fisioterapeuta: { label: 'Fisioterapeuta', hub: '/jaleco-fisioterapeuta' },
  podologo: { label: 'Podólogo', hub: '/jaleco-podologo' },
  podologa: { label: 'Podóloga', hub: '/jaleco-podologo' },
  tatuador: { label: 'Tatuador', hub: '/jaleco-tatuador' },
  cabeleireira: { label: 'Cabeleireira', hub: '/jaleco-cabeleireiro' },
  cabeleireiro: { label: 'Cabeleireiro', hub: '/jaleco-cabeleireiro' },
  barbeiro: { label: 'Barbeiro', hub: '/jaleco-barbeiro' },
  professor: { label: 'Professor', hub: '/jaleco-professor' },
  professora: { label: 'Professora', hub: '/jaleco-professor' },
  esteticista: { label: 'Esteticista', hub: '/jaleco-esteticista' },
  churrasqueiro: { label: 'Churrasqueiro', hub: '/jaleco-churrasqueiro' },
  churrasqueira: { label: 'Churrasqueira', hub: '/jaleco-churrasqueiro' },
  cozinheiro: { label: 'Cozinheiro', hub: '/jaleco-cozinheiro' },
  cozinheira: { label: 'Cozinheira', hub: '/jaleco-cozinheiro' },
  sushiman: { label: 'Sushiman', hub: '/jaleco-sushiman' },
  advogada: { label: 'Advogada', hub: '/jaleco-advogado' },
  advogado: { label: 'Advogado', hub: '/jaleco-advogado' },
}

// Mapeia profissões por gênero
const GENDER_PAIRS = {
  medica: 'medico',
  medico: 'medica',
  enfermeira: 'enfermeiro',
  enfermeiro: 'enfermeira',
  farmaceutica: 'farmaceutico',
  farmaceutico: 'farmaceutica',
  veterinaria: 'veterinario',
  veterinario: 'veterinaria',
  biomedica: 'biomedico',
  biomedico: 'biomedica',
  professora: 'professor',
  professor: 'professora',
  cabeleireira: 'cabeleireiro',
  cabeleireiro: 'cabeleireira',
  podologa: 'podologo',
  podologo: 'podologa',
  advogada: 'advogado',
  advogado: 'advogada',
  cozinheira: 'cozinheiro',
  cozinheiro: 'cozinheira',
  churrasqueira: 'churrasqueiro',
  churrasqueiro: 'churrasqueira',
  confeiteira: 'confeiteiro',
  confeiteiro: 'confeiteira',
}

async function main() {
  console.log('🔧 PROJETO JALECA CORES — Ponto 4: Fix Mapeamento Profissões\n')

  // Analisar estado atual
  const professionStats = {}

  PRODUCT_PROFESSIONS.forEach(product => {
    product.professions.forEach(prof => {
      if (!professionStats[prof]) {
        professionStats[prof] = {
          count: 0,
          products: []
        }
      }
      professionStats[prof].count++
      professionStats[prof].products.push(product.slug)
    })
  })

  console.log('## 📊 ESTADO ATUAL\n')

  // Profissões com 0 produtos
  const zeroProfessions = Object.keys(PROFESSION_MAP).filter(
    prof => !professionStats[prof] || professionStats[prof].count === 0
  )

  console.log(`### Profissões SEM produtos (${zeroProfessions.length}):`)
  zeroProfessions.forEach(prof => {
    console.log(`  - ${PROFESSION_MAP[prof].label} (${prof})`)
  })
  console.log('')

  // Profissões com poucos produtos (≤3)
  const lowProfessions = Object.entries(professionStats)
    .filter(([_, stats]) => stats.count > 0 && stats.count <= 3)
    .sort((a, b) => a[1].count - b[1].count)

  console.log(`### Profissões com POUCOS produtos (≤3): ${lowProfessions.length}`)
  lowProfessions.forEach(([prof, stats]) => {
    console.log(`  - ${PROFESSION_MAP[prof]?.label || prof}: ${stats.count} produtos`)
  })
  console.log('')

  // Desbalanceamento masc/fem
  console.log('### Desbalanceamento Masculino/Feminino:\n')

  const genderIssues = []

  Object.entries(GENDER_PAIRS).forEach(([fem, masc]) => {
    const femCount = professionStats[fem]?.count || 0
    const mascCount = professionStats[masc]?.count || 0

    if (Math.abs(femCount - mascCount) > 5) {
      genderIssues.push({
        fem,
        masc,
        femCount,
        mascCount,
        diff: Math.abs(femCount - mascCount)
      })
    }
  })

  genderIssues.sort((a, b) => b.diff - a.diff).forEach(issue => {
    console.log(`  - ${PROFESSION_MAP[issue.fem]?.label || issue.fem}: ${issue.femCount}`)
    console.log(`    ${PROFESSION_MAP[issue.masc]?.label || issue.masc}: ${issue.mascCount}`)
    console.log(`    Diferença: ${issue.diff} produtos\n`)
  })

  // Gerar correções automáticas
  console.log('## 🔧 CORREÇÕES AUTOMÁTICAS\n')

  const fixes = []

  // Fix 1: Balancear gêneros (copiar profissões do par)
  genderIssues.forEach(issue => {
    const source = issue.femCount > issue.mascCount ? issue.fem : issue.masc
    const target = issue.femCount > issue.mascCount ? issue.masc : issue.fem

    const sourceProducts = professionStats[source]?.products || []

    sourceProducts.forEach(productSlug => {
      const product = PRODUCT_PROFESSIONS.find(p => p.slug === productSlug)
      if (product && !product.professions.includes(target)) {
        // Verificar se produto é realmente unissex ou aplicável
        const isFeminine = product.name.toLowerCase().includes('feminino')
        const isMasculine = product.name.toLowerCase().includes('masculino')

        if (!isFeminine && !isMasculine) {
          // Unissex — pode adicionar
          fixes.push({
            type: 'add-profession',
            productSlug,
            productName: product.name,
            profession: target,
            reason: `Balancear ${PROFESSION_MAP[target]?.label} (atualmente ${professionStats[target]?.count || 0} produtos)`
          })
        }
      }
    })
  })

  // Fix 2: Profissões com 0 produtos — adicionar aos produtos genéricos
  const genericProducts = PRODUCT_PROFESSIONS.filter(p =>
    !p.name.toLowerCase().includes('feminino') &&
    !p.name.toLowerCase().includes('masculino')
  )

  zeroProfessions.forEach(prof => {
    // Pegar profissões similares
    const pair = GENDER_PAIRS[prof]
    if (pair && professionStats[pair]?.products) {
      professionStats[pair].products.forEach(productSlug => {
        const product = PRODUCT_PROFESSIONS.find(p => p.slug === productSlug)
        if (product && !product.professions.includes(prof)) {
          const isFeminine = product.name.toLowerCase().includes('feminino')
          const isMasculine = product.name.toLowerCase().includes('masculino')

          if (!isFeminine && !isMasculine) {
            fixes.push({
              type: 'add-profession',
              productSlug,
              productName: product.name,
              profession: prof,
              reason: `Adicionar ${PROFESSION_MAP[prof]?.label} (0 produtos atualmente)`
            })
          }
        }
      })
    }
  })

  console.log(`Total de correções sugeridas: ${fixes.length}\n`)

  // Agrupar por produto
  const fixesByProduct = {}
  fixes.forEach(fix => {
    if (!fixesByProduct[fix.productSlug]) {
      fixesByProduct[fix.productSlug] = {
        productName: fix.productName,
        professionsToAdd: []
      }
    }
    fixesByProduct[fix.productSlug].professionsToAdd.push({
      profession: fix.profession,
      label: PROFESSION_MAP[fix.profession]?.label,
      reason: fix.reason
    })
  })

  console.log('### Correções por Produto:\n')

  Object.entries(fixesByProduct).forEach(([slug, data]) => {
    console.log(`#### ${data.productName}`)
    console.log(`Slug: ${slug}`)
    console.log('Adicionar profissões:')
    data.professionsToAdd.forEach(p => {
      console.log(`  - ${p.label} (${p.profession}) — ${p.reason}`)
    })
    console.log('')
  })

  // Salvar relatório
  const report = {
    generatedAt: new Date().toISOString(),
    currentStats: professionStats,
    issues: {
      zeroProfessions: zeroProfessions.map(p => ({
        key: p,
        label: PROFESSION_MAP[p]?.label
      })),
      lowProfessions: lowProfessions.map(([prof, stats]) => ({
        key: prof,
        label: PROFESSION_MAP[prof]?.label,
        count: stats.count
      })),
      genderIssues
    },
    fixes: fixes,
    fixesByProduct
  }

  await writeFile(
    new URL('../docs/FIX-PROFESSIONS-REPORT.json', import.meta.url),
    JSON.stringify(report, null, 2)
  )

  console.log('✅ Relatório salvo: `docs/FIX-PROFESSIONS-REPORT.json`\n')

  // Gerar código de correção
  console.log('## 📝 CÓDIGO DE CORREÇÃO\n')
  console.log('Adicionar manualmente em `lib/product-professions.ts`:\n')

  Object.entries(fixesByProduct).slice(0, 5).forEach(([slug, data]) => {
    console.log(`// ${data.productName}`)
    console.log(`{`)
    console.log(`  slug: '${slug}',`)
    console.log(`  name: '${data.productName}',`)
    console.log(`  professions: [`)
    const product = PRODUCT_PROFESSIONS.find(p => p.slug === slug)
    const allProfessions = [
      ...product.professions,
      ...data.professionsToAdd.map(p => p.profession)
    ]
    console.log(`    ${allProfessions.map(p => `'${p}'`).join(', ')}`)
    console.log(`  ]`)
    console.log(`},\n`)
  })

  console.log('⚠️  Total de produtos a corrigir:', Object.keys(fixesByProduct).length)
  console.log('⚠️  Revisar relatório antes de aplicar correções\n')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
