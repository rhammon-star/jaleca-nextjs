#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises'

const tsContent = await readFile(
  new URL('../lib/product-professions.ts', import.meta.url),
  'utf-8'
)

// Extrair PRODUCT_PROFESSIONS via regex
const match = tsContent.match(/export const PRODUCT_PROFESSIONS[^=]*=\s*(\[[^\]]*\])/s)
if (!match) {
  console.error('❌ Não encontrou PRODUCT_PROFESSIONS')
  process.exit(1)
}

// Converter TS para JSON válido
const tsArray = match[1]
const jsonArray = tsArray
  .replace(/\/\/.*/g, '') // Remove comments
  .replace(/professions:\s*\[([^\]]+)\]/g, (_, p) => {
    // Converte array de strings sem aspas para com aspas
    const items = p.split(',').map(item => {
      const cleaned = item.trim().replace(/['"]/g, '')
      return cleaned ? `"${cleaned}"` : ''
    }).filter(Boolean)
    return `"professions": [${items.join(', ')}]`
  })
  .replace(/(\w+):/g, '"$1":') // Converte keys para strings
  .replace(/'/g, '"') // Aspas simples → duplas
  .replace(/,\s*}/g, '}') // Remove trailing commas
  .replace(/,\s*\]/g, ']')

const data = JSON.parse(jsonArray)

await writeFile(
  new URL('../.cache/product-professions.json', import.meta.url),
  JSON.stringify(data, null, 2)
)

console.log(`✅ Extraído ${data.length} produtos para .cache/product-professions.json`)
