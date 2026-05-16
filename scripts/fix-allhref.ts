import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')

// gender per profession (matches lib/product-professions.ts logic)
const FEMININE = new Set([
  'advogada','biomedica','cabeleireira','dentista-feminino','dona-casa','enfermagem-feminino',
  'enfermeira','esteticista','farmaceutica','feminino','feminino-acinturado','feminino-branco',
  'manga-curta-feminino','massoterapia','medica','medico-feminino','nutricionista','pediatra',
  'podologa','preto-feminino','psicologa','secretaria','universitario-feminino','veterinaria',
])
const MASCULINE = new Set([
  'advogado','barbeiro','biomedico','cabeleireiro','churrasqueiro','dentista','enfermeiro',
  'farmaceutico','fisioterapeuta','masculino','massagista','medico','medicina','odontologia',
  'pastor','podologo','professor','sushiman','tatuador','universitario','vendedor','veterinario',
  'farmacia','fisioterapia','nutricao','enfermagem','para-residencia-medica',
])
// neutral: azul-marinho, branco, colorido, com-elastano, elegante, estiloso, plus-size,
// premium, preto — keep ?categoria=jalecos

function genderFor(profKey: string): 'feminino' | 'masculino' | 'neutral' {
  if (FEMININE.has(profKey)) return 'feminino'
  if (MASCULINE.has(profKey)) return 'masculino'
  return 'neutral'
}

function urlFor(profKey: string): string {
  const g = genderFor(profKey)
  if (g === 'feminino') return '/produtos?categoria=jalecos-femininos'
  if (g === 'masculino') return '/produtos?categoria=jalecos-masculinos'
  return '/produtos?categoria=jalecos'
}

let changed = 0
for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  const profKey = entry.name.replace(/^jaleco-/, '')
  const target = urlFor(profKey)
  if (target === '/produtos?categoria=jalecos') continue // already correct

  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  let src: string
  try { src = readFileSync(filePath, 'utf-8') } catch { continue }

  // Replace allHref="/produtos?categoria=jalecos" (generic) with gender-aware URL.
  // Skip allHref already correct or pointing elsewhere (categoria, /jaleco-*, /categoria/*)
  const before = src
  src = src.replace(/allHref="\/produtos\?categoria=jalecos"/g, `allHref="${target}"`)
  if (src !== before) {
    writeFileSync(filePath, src, 'utf-8')
    changed++
    console.log(`✓ ${entry.name} → ${target}`)
  }
}
console.log(`\nDone: ${changed} pages updated`)
