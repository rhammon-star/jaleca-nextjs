#!/usr/bin/env bun
/**
 * REGENERAÇÃO SEO — 164 Páginas com Correções
 *
 * Usa product-seo-generator.ts atualizado com:
 * - Title tags otimizados (50-60 chars)
 * - H1 diferenciado do Title
 * - Meta descriptions com psicologia da cor + CTAs fortes
 * - Texto de psicologia da cor para combater thin content
 */

import { readFile, writeFile } from 'fs/promises'
import { generateColorSEO, getColorPsychology } from '../lib/product-seo-generator'

async function main() {
  console.log('🎨 REGENERAÇÃO SEO — 164 Páginas (Otimizado)\n')

  // Carregar inventário de URLs
  const urlsData = JSON.parse(
    await readFile('./docs/URLS-PRODUTOS-CORES.json', 'utf-8')
  )

  const allSEO: any[] = []
  const seenH1 = new Set<string>()
  const seenTitles = new Set<string>()
  const seenDescriptions = new Set<string>()
  let duplicateCount = 0

  console.log('Gerando textos SEO otimizados...\n')

  // Processar cada categoria
  for (const [categoryKey, items] of Object.entries(urlsData.categories) as [string, any][]) {
    const category = (categoryKey === 'dolmas' ? 'dolmas' :
                     categoryKey === 'acessorios' ? 'acessorios' :
                     categoryKey === 'conjuntos' ? 'conjuntos' :
                     categoryKey === 'jalecos' ? 'jalecos' : 'outros') as any

    for (const item of items) {
      if (item.type !== 'filha') continue

      // Extrair nome base do produto (sem " - Cor")
      const parts = item.name.split(' - ')
      const productName = parts.slice(0, -1).join(' - ')
      const colorName = parts[parts.length - 1]

      // Gerar ID numérico baseado no hash do nome
      const productId = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

      const seo = generateColorSEO(productName, colorName, productId, category)

      // Validar duplicação
      if (seenH1.has(seo.h1)) {
        console.warn(`⚠️  H1 duplicado: "${seo.h1}"`)
        duplicateCount++
      }
      if (seenTitles.has(seo.title)) {
        console.warn(`⚠️  Title duplicado: "${seo.title}"`)
        duplicateCount++
      }
      if (seenDescriptions.has(seo.metaDescription)) {
        console.warn(`⚠️  Meta duplicada: "${seo.metaDescription}"`)
        duplicateCount++
      }

      seenH1.add(seo.h1)
      seenTitles.add(seo.title)
      seenDescriptions.add(seo.metaDescription)

      allSEO.push({
        url: item.url,
        productName,
        colorName,
        category,
        ...seo,
      })
    }
  }

  console.log(`\n✅ ${allSEO.length} textos SEO gerados\n`)

  // Validações
  console.log('## 📊 VALIDAÇÃO DE QUALIDADE\n')

  // 1. Unicidade
  const uniqueH1 = seenH1.size
  const uniqueTitles = seenTitles.size
  const uniqueDescriptions = seenDescriptions.size

  console.log(`- H1 únicos: ${uniqueH1}/${allSEO.length} (${(uniqueH1/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Titles únicos: ${uniqueTitles}/${allSEO.length} (${(uniqueTitles/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Descriptions únicos: ${uniqueDescriptions}/${allSEO.length} (${(uniqueDescriptions/allSEO.length*100).toFixed(1)}%)`)

  if (duplicateCount > 0) {
    console.log(`\n⚠️  ${duplicateCount} duplicações encontradas\n`)
  } else {
    console.log('\n✅ Nenhuma duplicação encontrada\n')
  }

  // 2. Comprimento
  const titleLengths = allSEO.map(s => s.title.length)
  const descLengths = allSEO.map(s => s.metaDescription.length)

  const avgTitleLength = titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length
  const avgDescLength = descLengths.reduce((a, b) => a + b, 0) / descLengths.length

  const titlesOK = titleLengths.filter(l => l >= 50 && l <= 60).length
  const titlesTooLong = titleLengths.filter(l => l > 60).length
  const titlesTooShort = titleLengths.filter(l => l < 50).length

  const descIdeal = descLengths.filter(l => l >= 120 && l <= 160).length
  const descTooShort = descLengths.filter(l => l < 120).length
  const descTooLong = descLengths.filter(l => l > 160).length

  console.log('### Comprimento Title Tags')
  console.log(`- Média: ${avgTitleLength.toFixed(0)} caracteres`)
  console.log(`- Ideal (50-60): ${titlesOK}/${allSEO.length} (${(titlesOK/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Muito curtos (<50): ${titlesTooShort}`)
  console.log(`- Muito longos (>60): ${titlesTooLong}\n`)

  console.log('### Comprimento Meta Descriptions')
  console.log(`- Média: ${avgDescLength.toFixed(0)} caracteres`)
  console.log(`- Ideal (120-160): ${descIdeal}/${allSEO.length} (${(descIdeal/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Muito curtas (<120): ${descTooShort}`)
  console.log(`- Muito longas (>160): ${descTooLong}\n`)

  // 3. Palavras-chave cobertura
  const withProductName = allSEO.filter(s =>
    s.metaDescription.toLowerCase().includes(s.productName.toLowerCase().split(' ')[0])
  ).length

  const withColorName = allSEO.filter(s =>
    s.metaDescription.toLowerCase().includes(s.colorName.toLowerCase().split(' ')[0])
  ).length

  console.log('### Cobertura de Keywords')
  console.log(`- Contém nome produto: ${withProductName}/${allSEO.length} (${(withProductName/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Contém cor: ${withColorName}/${allSEO.length} (${(withColorName/allSEO.length*100).toFixed(1)}%)\n`)

  // 4. Diferenciação H1 vs Title
  const h1DifferentFromTitle = allSEO.filter(s => s.h1 !== s.title).length
  console.log('### Diferenciação H1 vs Title')
  console.log(`- H1 ≠ Title: ${h1DifferentFromTitle}/${allSEO.length} (${(h1DifferentFromTitle/allSEO.length*100).toFixed(1)}%)\n`)

  // 5. Psicologia da cor presente
  const withPsychology = allSEO.filter(s => s.colorPsychology && s.colorPsychology.length > 20).length
  console.log('### Psicologia da Cor (combate thin content)')
  console.log(`- Com texto de psicologia: ${withPsychology}/${allSEO.length} (${(withPsychology/allSEO.length*100).toFixed(1)}%)\n`)

  // Exemplos
  console.log('## 📝 EXEMPLOS OTIMIZADOS\n')

  const samples = [
    allSEO.find(s => s.colorName.includes('Branco')),
    allSEO.find(s => s.colorName.includes('Azul Marinho')),
    allSEO.find(s => s.colorName.includes('Rosa')),
    allSEO.find(s => s.category === 'conjuntos'),
    allSEO.find(s => s.category === 'dolmas'),
  ].filter(Boolean)

  samples.forEach(sample => {
    console.log(`### ${sample.productName} - ${sample.colorName}`)
    console.log(`**Title:** ${sample.title} (${sample.title.length} chars)`)
    console.log(`**H1:** ${sample.h1}`)
    console.log(`**H2:** ${sample.h2}`)
    console.log(`**Meta:** ${sample.metaDescription} (${sample.metaDescription.length} chars)`)
    console.log(`**Psicologia:** ${sample.colorPsychology?.substring(0, 100)}...\n`)
  })

  // Salvar JSON completo
  await writeFile(
    './docs/SEO-PRODUTOS-CORES.json',
    JSON.stringify(allSEO, null, 2)
  )

  console.log('✅ Arquivo salvo: `docs/SEO-PRODUTOS-CORES.json`\n')

  // Relatório final
  console.log('## ✅ OTIMIZAÇÕES APLICADAS\n')
  console.log('1. ✅ Title tags encurtados (50-60 chars)')
  console.log('2. ✅ H1 diferenciado do Title (+contexto)')
  console.log('3. ✅ Meta descriptions com psicologia da cor + CTAs urgentes')
  console.log('4. ✅ Texto de psicologia da cor para cada página (combate thin content)\n')

  console.log('Próximo passo: Validar com GPT-4.1 + Gemini para confirmar score >75')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  console.error(err.stack)
  process.exit(1)
})
