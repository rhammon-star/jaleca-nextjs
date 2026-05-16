/**
 * Migra todas as LPs de jaleco para o layout padrão:
 * GoogleRatingCarousel → UGCSection → InstagramLazy
 * Mantém todos os dados (SEO, FAQ, schema, texto) intactos.
 * Adiciona schema AEO (speakable) onde faltar.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const ALREADY_DONE = new Set([
  'jaleco-feminino',
  'jaleco-medica',
  'jaleco-dentista-feminino',
  'jaleco-feminino-branco',
  'jaleco-feminino-acinturado',
])

function hasComponent(content: string, name: string): boolean {
  return content.includes(name)
}

function addImport(content: string, importLine: string, anchor: string): string {
  if (content.includes(importLine)) return content
  // Insert after the anchor import line
  const idx = content.indexOf(anchor)
  if (idx === -1) {
    // Insert after last import block
    const lastImport = content.lastIndexOf("^import ", 0)
    const lines = content.split('\n')
    let lastImportLine = 0
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportLine = i
    }
    lines.splice(lastImportLine + 1, 0, importLine)
    return lines.join('\n')
  }
  const end = content.indexOf('\n', idx)
  return content.slice(0, end + 1) + importLine + '\n' + content.slice(end + 1)
}

function addImportAtEnd(content: string, importLine: string): string {
  if (content.includes(importLine)) return content
  const lines = content.split('\n')
  let lastImportLine = 0
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportLine = i
  }
  lines.splice(lastImportLine + 1, 0, importLine)
  return lines.join('\n')
}

function addSpeakableSchema(content: string): string {
  if (content.includes('speakable')) return content
  const speakable = `
  const schemaSpeakable = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.faq-section', 'h2'],
    },
  }`
  // Insert before 'return (' inside export default
  const returnIdx = content.indexOf('  return (')
  if (returnIdx === -1) return content
  return content.slice(0, returnIdx) + speakable + '\n\n' + content.slice(returnIdx)
}

function addSpeakableScriptTag(content: string): string {
  if (content.includes('schemaSpeakable')) return content
  // Insert after last existing ld+json script tag inside return
  const lastScript = content.lastIndexOf('<script type="application/ld+json"')
  if (lastScript === -1) return content
  const endOfTag = content.indexOf('/>', lastScript) + 2
  const scriptLine = `\n      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSpeakable).replace(/</g, '\\\\u003c') }} />`
  return content.slice(0, endOfTag) + scriptLine + content.slice(endOfTag)
}

function injectComponents(content: string, hasPlaceData: boolean): string {
  const ratingProp = hasPlaceData ? '{placeData?.rating}' : '{4.9}'
  const gcTag = `        {/* ── GOOGLE RATING ── */}\n        <GoogleRatingCarousel rating=${ratingProp} />`
  const ugcTag = `        {/* ── UGC PROFISSIONAIS ── */}\n        <UGCSection />`
  const igTag = `        {/* ── INSTAGRAM ── */}\n        <InstagramLazy />`

  const hasUGC = hasComponent(content, '<UGCSection')
  const hasIG = hasComponent(content, '<InstagramLazy')
  const hasGC = hasComponent(content, '<GoogleRatingCarousel')

  if (hasUGC) {
    // Add GC before UGCSection if not present
    if (!hasGC) {
      content = content.replace(
        /(\s*\{?\/\*[^*]*ugc[^*]*\*\/\}?\s*)?<UGCSection/i,
        `\n${gcTag}\n\n        <UGCSection`
      )
    }
    // Add IG after UGCSection /> if not present
    if (!hasIG) {
      content = content.replace(
        /<UGCSection\s*\/>/,
        `<UGCSection />\n\n${igTag}`
      )
    }
  } else {
    // No UGCSection: inject all 3 before </main>
    if (!hasGC) {
      content = content.replace(
        /(\s*<\/main>)/,
        `\n\n${gcTag}\n\n${ugcTag}\n\n${igTag}$1`
      )
    }
  }
  return content
}

let changed = 0
let skipped = 0

const entries = readdirSync(APP_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory()) continue
  if (!entry.name.startsWith('jaleco-')) continue
  if (ALREADY_DONE.has(entry.name)) { skipped++; continue }

  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  try {
    let content = readFileSync(filePath, 'utf-8')

    if (hasComponent(content, 'GoogleRatingCarousel') && hasComponent(content, 'InstagramLazy')) {
      skipped++
      continue
    }

    const hasPlaceData = content.includes('getGooglePlaceData') || content.includes('placeData')

    // Add imports
    if (!hasComponent(content, "GoogleRatingCarousel")) {
      content = addImportAtEnd(content, "import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'")
    }
    if (!hasComponent(content, "UGCSection")) {
      content = addImportAtEnd(content, "import UGCSection from '@/components/UGCSection'")
    }
    if (!hasComponent(content, "InstagramLazy")) {
      content = addImportAtEnd(content, "import InstagramLazy from '@/components/profession-lp/InstagramLazy'")
    }

    // Add speakable schema
    if (content.includes('schemaFaq') || content.includes('FAQ_ITEMS')) {
      content = addSpeakableSchema(content)
      content = addSpeakableScriptTag(content)
    }

    // Inject layout components
    content = injectComponents(content, hasPlaceData)

    writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ ${entry.name}`)
    changed++
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`\nDone: ${changed} changed, ${skipped} skipped`)
