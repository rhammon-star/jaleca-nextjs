#!/usr/bin/env node
/**
 * PROJETO JALECA CORES — Ponto 2: Geração e Validação de SEO
 *
 * Gera 164 textos SEO únicos (H1, H2, meta descriptions)
 * Valida unicidade e comprimento
 */

import { readFile, writeFile } from 'fs/promises'

// Inline SEO generator (evita import .ts em .mjs)
const COLOR_DESCRIPTION_TEMPLATES = {
  branco: ['na cor branca clássica', 'em branco atemporal', 'no tom branco tradicional', 'na elegante cor branca'],
  'branco-3': ['na cor branca premium', 'em branco sofisticado', 'no tom branco premium', 'na refinada cor branca'],
  preto: ['na cor preta elegante', 'em preto moderno', 'no tom preto sofisticado', 'na clássica cor preta'],
  'preto-3': ['na cor preta premium', 'em preto refinado', 'no tom preto executivo', 'na distinta cor preta'],
  'azul-marinho': ['na cor azul marinho profissional', 'em azul marinho clássico', 'no tom azul marinho elegante', 'na versátil cor azul marinho'],
  'marinho-3': ['na cor azul marinho premium', 'em azul marinho sofisticado', 'no tom marinho profissional', 'na refinada cor marinho'],
  rosa: ['na cor rosa delicada', 'em rosa feminino', 'no tom rosa suave', 'na elegante cor rosa'],
}

function normalizeColorSlug(color) {
  return color.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
}

function selectTemplate(templates, productId) {
  return templates[productId % templates.length]
}

function generateColorSEO(productName, colorName, productId, category) {
  const colorSlug = normalizeColorSlug(colorName)
  const baseColorSlug = colorSlug.replace(/-\d+$/, '')

  const templates = COLOR_DESCRIPTION_TEMPLATES[colorSlug] || COLOR_DESCRIPTION_TEMPLATES[baseColorSlug] || [
    `na cor ${colorName.toLowerCase()}`, `em ${colorName.toLowerCase()}`, `no tom ${colorName.toLowerCase()}`, `na versão ${colorName.toLowerCase()}`
  ]

  const colorDesc = selectTemplate(templates, productId)

  const categoryTerms = {
    jalecos: [
      'Jaleco profissional de tecido premium com modelagem confortável',
      'Uniforme médico de alta durabilidade com acabamento impecável',
      'Avental profissional com design moderno e funcional',
      'Jaleco premium com caimento perfeito e qualidade superior'
    ],
    conjuntos: [
      'Conjunto cirúrgico de tecido respirável com ajuste confortável',
      'Scrub profissional de alta qualidade com bolsos funcionais',
      'Pijama cirúrgico premium com modelagem anatômica',
      'Conjunto profissional durável com design ergonômico'
    ],
    dolmas: [
      'Dólmã profissional de tecido resistente com modelagem moderna',
      'Uniforme de cozinha premium com ventilação superior',
      'Dólmã de alta qualidade com acabamento refinado',
      'Uniforme gastronômico durável com design funcional'
    ],
    acessorios: [
      'Acessório profissional de qualidade premium',
      'Complemento essencial para seu uniforme',
      'Item profissional durável e prático',
      'Acessório premium com design funcional'
    ],
    outros: [
      'Uniforme profissional de qualidade superior',
      'Produto premium para área da saúde',
      'Item de alta durabilidade Jaleca',
      'Produto profissional com acabamento impecável'
    ]
  }

  const term = selectTemplate(categoryTerms[category], productId)
  const ctas = ['Frete grátis SP/RJ/MG/ES acima de R$499', 'Entrega para todo Brasil. 3x sem juros', 'PIX 5% off. Troca grátis 30 dias', 'Compre parcelado. Entrega expressa']
  const cta = selectTemplate(ctas, productId)

  const metaDescription = `${productName} ${colorDesc}. ${term}. ${cta}.`

  return {
    h1: `${productName} ${colorName}`,
    h2: `Uniforme profissional ${colorName.toLowerCase()} de qualidade premium`,
    metaDescription,
    title: `${productName} ${colorName} — Jaleca`
  }
}

async function main() {
  console.log('🎨 PROJETO JALECA CORES — Geração de SEO (Ponto 2)\n')

  // Carregar inventário de URLs
  const urlsData = JSON.parse(
    await readFile(
      new URL('../docs/URLS-PRODUTOS-CORES.json', import.meta.url),
      'utf-8'
    )
  )

  const allSEO = []
  const seenH1 = new Set()
  const seenDescriptions = new Set()
  let duplicateCount = 0

  console.log('Gerando textos SEO para 164 páginas filhas...\n')

  // Processar cada categoria
  for (const [categoryKey, items] of Object.entries(urlsData.categories)) {
    const category = categoryKey === 'dolmas' ? 'dolmas' :
                     categoryKey === 'acessorios' ? 'acessorios' :
                     categoryKey === 'conjuntos' ? 'conjuntos' :
                     categoryKey === 'jalecos' ? 'jalecos' : 'outros'

    for (const item of items) {
      if (item.type !== 'filha') continue

      // Extrair nome base do produto (sem " - Cor")
      const parts = item.name.split(' - ')
      const productName = parts.slice(0, -1).join(' - ')
      const colorName = parts[parts.length - 1]

      // Gerar ID numérico fictício baseado no hash do nome
      const productId = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

      const seo = generateColorSEO(productName, colorName, productId, category)

      // Validar duplicação
      if (seenH1.has(seo.h1)) {
        console.warn(`⚠️  H1 duplicado: "${seo.h1}"`)
        duplicateCount++
      }
      if (seenDescriptions.has(seo.metaDescription)) {
        console.warn(`⚠️  Meta duplicada: "${seo.metaDescription}"`)
        duplicateCount++
      }

      seenH1.add(seo.h1)
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
  const uniqueDescriptions = seenDescriptions.size
  console.log(`- H1 únicos: ${uniqueH1}/${allSEO.length} (${(uniqueH1/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Descriptions únicos: ${uniqueDescriptions}/${allSEO.length} (${(uniqueDescriptions/allSEO.length*100).toFixed(1)}%)`)

  if (duplicateCount > 0) {
    console.log(`\n⚠️  ${duplicateCount} duplicações encontradas\n`)
  } else {
    console.log('\n✅ Nenhuma duplicação encontrada\n')
  }

  // 2. Comprimento das descriptions (150-160 ideal)
  const descLengths = allSEO.map(s => s.metaDescription.length)
  const avgLength = descLengths.reduce((a, b) => a + b, 0) / descLengths.length
  const tooShort = descLengths.filter(l => l < 120).length
  const tooLong = descLengths.filter(l => l > 160).length
  const ideal = descLengths.filter(l => l >= 120 && l <= 160).length

  console.log('### Comprimento Meta Descriptions')
  console.log(`- Média: ${avgLength.toFixed(0)} caracteres`)
  console.log(`- Ideal (120-160): ${ideal}/${allSEO.length} (${(ideal/allSEO.length*100).toFixed(1)}%)`)
  console.log(`- Muito curtas (<120): ${tooShort}`)
  console.log(`- Muito longas (>160): ${tooLong}\n`)

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

  // Exemplos
  console.log('## 📝 EXEMPLOS GERADOS\n')

  const samples = [
    allSEO.find(s => s.colorName.includes('Branco')),
    allSEO.find(s => s.colorName.includes('Azul Marinho')),
    allSEO.find(s => s.colorName.includes('Rosa')),
    allSEO.find(s => s.category === 'conjuntos'),
    allSEO.find(s => s.category === 'dolmas'),
  ].filter(Boolean)

  samples.forEach(sample => {
    console.log(`### ${sample.productName} - ${sample.colorName}`)
    console.log(`**URL:** ${sample.url}`)
    console.log(`**H1:** ${sample.h1}`)
    console.log(`**H2:** ${sample.h2}`)
    console.log(`**Meta:** ${sample.metaDescription}`)
    console.log(`**Tamanho:** ${sample.metaDescription.length} caracteres\n`)
  })

  // Salvar JSON completo
  await writeFile(
    new URL('../docs/SEO-PRODUTOS-CORES.json', import.meta.url),
    JSON.stringify(allSEO, null, 2)
  )

  console.log('✅ Arquivo salvo: `docs/SEO-PRODUTOS-CORES.json`\n')

  // Salvar markdown para revisão
  const markdown = [
    '# SEO Personalizado — Produtos por Cor',
    '',
    `**Gerado em:** ${new Date().toLocaleString('pt-BR')}`,
    '',
    '## Resumo',
    '',
    `- Total de URLs: ${allSEO.length}`,
    `- H1 únicos: ${uniqueH1} (${(uniqueH1/allSEO.length*100).toFixed(1)}%)`,
    `- Meta descriptions únicos: ${uniqueDescriptions} (${(uniqueDescriptions/allSEO.length*100).toFixed(1)}%)`,
    `- Comprimento médio: ${avgLength.toFixed(0)} caracteres`,
    '',
    '## Listagem Completa',
    '',
  ]

  // Agrupar por categoria
  const byCategory = {}
  allSEO.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = []
    byCategory[item.category].push(item)
  })

  for (const [cat, items] of Object.entries(byCategory)) {
    markdown.push(`### ${cat.toUpperCase()} (${items.length})`)
    markdown.push('')

    items.forEach(item => {
      markdown.push(`#### ${item.h1}`)
      markdown.push('')
      markdown.push(`- **URL:** \`${item.url}\``)
      markdown.push(`- **Title:** ${item.title}`)
      markdown.push(`- **H2:** ${item.h2}`)
      markdown.push(`- **Meta:** ${item.metaDescription} _(${item.metaDescription.length} chars)_`)
      markdown.push('')
    })
  }

  await writeFile(
    new URL('../docs/SEO-PRODUTOS-CORES.md', import.meta.url),
    markdown.join('\n')
  )

  console.log('✅ Arquivo salvo: `docs/SEO-PRODUTOS-CORES.md`\n')
  console.log('---')
  console.log('Ponto 2 concluído! Próximo: Ponto 3 (Canonical tags + Schema.org)')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
