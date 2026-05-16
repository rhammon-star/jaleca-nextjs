/**
 * Substitui o hero inline (grid 2-col com imagem) pelo HeroCommercial
 * em todas as LPs jaleco-*. Mantém eyebrow/h1/description originais.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const SKIP = new Set([
  'jaleco-feminino', 'jaleco-medica', 'jaleco-dentista-feminino',
  'jaleco-feminino-branco', 'jaleco-feminino-acinturado',
  // já feitas manualmente nesta sessão
  'jaleco-medico', 'jaleco-dentista', 'jaleco-odontologia',
])

// Regex que captura o bloco hero inline
const HERO_RE = /\s*\{\/\* ── HERO ── \*\/\}\s*\n\s*<section className="grid grid-cols-1 lg:grid-cols-2"[\s\S]*?<\/section>/

// Regex para extrair eyebrow, h1Line1, h1Line2, description
function extractFields(heroBlock: string) {
  // eyebrow: texto após o <span ... /> dentro da div com letterSpacing 0.2em
  const eyebrowMatch = heroBlock.match(/<span style=\{\{ display: 'inline-block', width: 32[^}]+\}\} \/>\s*\n\s*([^\n<]+)/)
  const eyebrow = eyebrowMatch?.[1]?.trim() ?? 'Uniforme profissional'

  // h1: pegar antes de <br /> e dentro de <em>
  const h1Match = heroBlock.match(/<h1[\s\S]*?>\s*([^<\n]+?)<br \/>\s*<em[^>]*>([^<]+)<\/em>\s*<\/h1>/)
  const h1Line1 = h1Match?.[1]?.trim() ?? ''
  const h1Line2 = h1Match?.[2]?.trim() ?? ''

  // description: <p> após h1
  const descMatch = heroBlock.match(/<\/h1>\s*\n\s*<p[^>]*>\s*([^<]+?)\s*<\/p>/)
  const description = descMatch?.[1]?.trim() ?? 'Tecido premium, caimento perfeito, preço justo.'

  return { eyebrow, h1Line1, h1Line2, description }
}

function buildHeroCommercial(fields: ReturnType<typeof extractFields>, hasPlaceData: boolean): string {
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
let skipped = 0
let noMatch = 0

const entries = readdirSync(APP_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  if (SKIP.has(entry.name)) { skipped++; continue }

  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  try {
    let content = readFileSync(filePath, 'utf-8')

    if (content.includes('HeroCommercial')) { skipped++; continue }

    const match = content.match(HERO_RE)
    if (!match) {
      console.log(`⚠️  no hero match: ${entry.name}`)
      noMatch++
      continue
    }

    const fields = extractFields(match[0])
    const hasPlaceData = content.includes('placeData')
    const newHero = buildHeroCommercial(fields, hasPlaceData)

    content = content.replace(HERO_RE, newHero)
    content = addImport(content)

    writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ ${entry.name} — "${fields.h1Line1} ${fields.h1Line2}"`)
    changed++
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`\nDone: ${changed} changed, ${skipped} skipped, ${noMatch} no-match`)
