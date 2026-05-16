// v3 — heros sem comentário, primeira section após breadcrumb com h1 Cormorant
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')

// Captura: <section style={{ background: ... padding: clamp(3rem,8vw,6rem)... }}> ... <h1 ... Cormorant ... </h1> ... </section>
const HERO_RE = /<section style=\{\{ background: '#[0-9a-fA-F]+', padding: 'clamp\(3rem,8vw,6rem\)[^}]*\}\}>[\s\S]*?<h1 style=\{\{[^}]*Cormorant[\s\S]*?<\/section>/

function extractFields(heroBlock: string) {
  let eyebrow = ''
  const eyebrowPatterns = [
    /<div style=\{\{[^}]*letterSpacing: '0\.2em'[^}]*\}\}>\s*\n?\s*([^<\n{]+?)\s*\n?\s*<\/div>/,
    /letterSpacing: '0\.2em'[^>]*>\s*\n?\s*([^\n<{]+?)\s*\n/,
  ]
  for (const re of eyebrowPatterns) {
    const m = heroBlock.match(re)
    if (m?.[1] && !m[1].includes('<')) { eyebrow = m[1].trim(); break }
  }
  if (!eyebrow) eyebrow = 'Uniforme profissional'

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
  if (h1Line1 && !h1Line2) {
    const words = h1Line1.split(/\s+/)
    if (words.length > 1) {
      h1Line2 = words[words.length - 1]
      h1Line1 = words.slice(0, -1).join(' ')
    }
  }

  let description = ''
  const descMatch = heroBlock.match(/<\/h1>\s*\n?\s*<p[^>]*>\s*([\s\S]+?)\s*<\/p>/)
  if (descMatch) {
    description = descMatch[1].replace(/\s+/g, ' ').replace(/<[^>]+>/g, '').trim()
  }
  if (!description) description = 'Tecido premium, caimento perfeito, preço justo.'
  if (description.length > 240) description = description.slice(0, 237) + '...'

  return { eyebrow, h1Line1, h1Line2, description }
}

function buildHero(f: ReturnType<typeof extractFields>, hasPlaceData: boolean): string {
  const rating = hasPlaceData ? '\n          googleRating={placeData?.rating}' : ''
  return `
        {/* ── HERO ── */}
        <HeroCommercial
          eyebrow=${JSON.stringify(f.eyebrow)}
          h1Line1=${JSON.stringify(f.h1Line1)}
          h1Line2=${JSON.stringify(f.h1Line2)}
          description=${JSON.stringify(f.description)}
          startingPrice="R$220"
          collectionHref="#produtos"
          allHref="/produtos?categoria=jalecos"${rating}
        />`
}

function addImport(content: string): string {
  if (content.includes("import HeroCommercial")) return content
  const lines = content.split('\n')
  let lastImport = 0
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('import ')) lastImport = i
  lines.splice(lastImport + 1, 0, "import HeroCommercial from '@/components/profession-lp/HeroCommercial'")
  return lines.join('\n')
}

let changed = 0
let stillNoMatch: string[] = []

for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  try {
    let content = readFileSync(filePath, 'utf-8')
    if (content.includes('HeroCommercial')) continue

    const match = content.match(HERO_RE)
    if (!match) { stillNoMatch.push(entry.name); continue }

    const fields = extractFields(match[0])
    const hasPlaceData = content.includes('placeData')
    content = content.replace(HERO_RE, buildHero(fields, hasPlaceData))
    content = addImport(content)

    writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ ${entry.name} — "${fields.h1Line1} ${fields.h1Line2}"`)
    changed++
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`\nDone: ${changed}`)
if (stillNoMatch.length) console.log(`No match: ${stillNoMatch.join(', ')}`)
