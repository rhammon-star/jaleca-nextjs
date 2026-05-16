// v2 — captura heros que escaparam da v1
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')

// Regex 1: hero com comentário {/* HERO */} ou {/* ── HERO ── */} + grid
const HERO_GRID_RE = /\s*\{\/\*[^*]*HERO[^*]*\*\/\}\s*\n\s*<section className="grid grid-cols-1 lg:grid-cols-2"[\s\S]*?<\/section>/

// Regex 2: hero single-column, captura desde o comentário (ou desde <section background f9f7f4 + h1 dentro) até a próxima </section>
// Tenta capturar a primeira <section> após o breadcrumb que tem <h1> de Cormorant
const HERO_SINGLE_RE = /\s*\{\/\*[^*]*HERO[^*]*\*\/\}\s*\n\s*<section style=\{\{[^}]*background:[^}]*\}\}[^>]*>[\s\S]*?<\/section>/

function extractFields(heroBlock: string) {
  // eyebrow: várias formas
  let eyebrow = ''
  const eyebrowPatterns = [
    /<span style=\{\{ display: 'inline-block', width: 32[^}]+\}\} \/>\s*\n\s*([^\n<]+?)\s*\n/,
    /letterSpacing: '0\.2em'[^>]*>\s*\n?\s*([^\n<{]+?)\s*\n/,
    /<div style=\{\{[^}]*letterSpacing: '0\.2em'[^}]*\}\}>\s*\n?\s*([^<\n]+)/,
  ]
  for (const re of eyebrowPatterns) {
    const m = heroBlock.match(re)
    if (m?.[1] && !m[1].includes('<')) { eyebrow = m[1].trim(); break }
  }
  if (!eyebrow) eyebrow = 'Uniforme profissional'

  // h1
  let h1Line1 = '', h1Line2 = ''
  const h1Patterns = [
    /<h1[\s\S]*?>\s*([^<\n]+?)<br \/>\s*<em[^>]*>([^<]+)<\/em>\s*<\/h1>/,
    /<h1[\s\S]*?>\s*([^<\n]+?)\s*<em[^>]*>([^<]+)<\/em>\s*<\/h1>/,
    /<h1[\s\S]*?>\s*([^<\n]+?)\s*<\/h1>/,
  ]
  for (const re of h1Patterns) {
    const m = heroBlock.match(re)
    if (m) {
      h1Line1 = m[1]?.trim() ?? ''
      h1Line2 = m[2]?.trim() ?? ''
      break
    }
  }
  // se só h1 sem em: splita pela última palavra
  if (h1Line1 && !h1Line2) {
    const words = h1Line1.split(/\s+/)
    if (words.length > 1) {
      h1Line2 = words[words.length - 1]
      h1Line1 = words.slice(0, -1).join(' ')
    }
  }

  // description
  let description = ''
  const descMatch = heroBlock.match(/<\/h1>\s*\n?\s*<p[^>]*>\s*([\s\S]+?)\s*<\/p>/)
  if (descMatch) {
    description = descMatch[1].replace(/\s+/g, ' ').replace(/<[^>]+>/g, '').trim()
  }
  if (!description) description = 'Tecido premium, caimento perfeito, preço justo.'
  // limitar tamanho
  if (description.length > 240) description = description.slice(0, 237) + '...'

  return { eyebrow, h1Line1, h1Line2, description }
}

function buildHero(fields: ReturnType<typeof extractFields>, hasPlaceData: boolean): string {
  const rating = hasPlaceData ? '\n          googleRating={placeData?.rating}' : ''
  return `
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow=${JSON.stringify(fields.eyebrow)}
          h1Line1=${JSON.stringify(fields.h1Line1)}
          h1Line2=${JSON.stringify(fields.h1Line2)}
          description=${JSON.stringify(fields.description)}
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"${rating}
        />`
}

function addImport(content: string): string {
  if (content.includes("import HeroCommercial")) return content
  const lines = content.split('\n')
  let lastImport = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImport = i
  }
  lines.splice(lastImport + 1, 0, "import HeroCommercial from '@/components/profession-lp/HeroCommercial'")
  return lines.join('\n')
}

let changed = 0
let stillNoMatch: string[] = []

const entries = readdirSync(APP_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  const filePath = join(APP_DIR, entry.name, 'page.tsx')

  try {
    let content = readFileSync(filePath, 'utf-8')
    if (content.includes('HeroCommercial')) continue

    let match = content.match(HERO_GRID_RE)
    let regex: RegExp = HERO_GRID_RE
    if (!match) {
      match = content.match(HERO_SINGLE_RE)
      regex = HERO_SINGLE_RE
    }
    if (!match) {
      stillNoMatch.push(entry.name)
      continue
    }

    const fields = extractFields(match[0])
    const hasPlaceData = content.includes('placeData')
    const newHero = buildHero(fields, hasPlaceData)

    content = content.replace(regex, newHero)
    content = addImport(content)

    writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ ${entry.name} — "${fields.h1Line1} ${fields.h1Line2}"`)
    changed++
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`\nDone: ${changed} changed`)
if (stillNoMatch.length) console.log(`No match: ${stillNoMatch.join(', ')}`)
