// Migra layout completo: CompactTrustBar + FabricGuideCards + ProfessionLinksNeutral
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const ALREADY_DONE = new Set([
  'jaleco-feminino', 'jaleco-medica', 'jaleco-dentista-feminino',
  'jaleco-feminino-branco', 'jaleco-feminino-acinturado',
])

function addImportAtEnd(content: string, importLine: string): string {
  if (content.includes(importLine.split("'")[1])) return content
  const lines = content.split('\n')
  let lastImport = 0
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('import ')) lastImport = i
  lines.splice(lastImport + 1, 0, importLine)
  return lines.join('\n')
}

// 1. Adiciona CompactTrustBar após HeroCommercial e remove trust bar inline
function addCompactTrustBar(content: string): string {
  if (content.includes('<CompactTrustBar')) return content

  // Adiciona após HeroCommercial closing tag
  content = content.replace(
    /(<HeroCommercial[\s\S]*?\/>\s*\n)/,
    `$1\n        {/* ── ② COMPACT TRUST BAR ── */}\n        <CompactTrustBar />\n`
  )

  // Remove trust bar inline (div.grid com background #1a1a1a logo após hero)
  // Padrão: {/* ── TRUST BAR ── */} + <div className="grid ... background: '#1a1a1a' ...> ... </div>
  content = content.replace(
    /\s*\{\/\*[^*]*TRUST BAR[^*]*\*\/\}\s*\n\s*<div className="grid[^>]*>[\s\S]*?<\/div>\s*\n/,
    '\n'
  )

  // Padrão alternativo: trust bar sem comentário específico (div grid dark logo após hero)
  content = content.replace(
    /\s*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4[^>]*background: '#1a1a1a'[^>]*>[\s\S]{50,1500}?<\/div>\s*\n(?=\s*\{\/\*|\s*<section|\s*<div)/,
    '\n'
  )

  return content
}

// 2. Adiciona FabricGuideCards no final da seção FAQ (após o map de details)
function addFabricGuideCards(content: string): string {
  if (content.includes('<FabricGuideCards')) return content
  if (!content.includes('FAQ_ITEMS') && !content.includes('details')) return content

  // Encontra o fechamento do map de FAQ: )}\n</div> dentro da seção FAQ
  // Padrão: )}\n            </div>\n          </div> (final do FAQ accordion)
  const faqEndRe = /(\s*\}\)\s*\}\)\s*\}\s*\n\s*<\/div>)(\s*\n\s*<\/div>)/
  if (faqEndRe.test(content)) {
    content = content.replace(faqEndRe, `$1\n            <FabricGuideCards />$2`)
    return content
  }

  // Alternativa: após o último </details> dentro de FAQ
  const detailsRe = /(<\/details>\s*\n\s*\]\)[\s\S]{0,200}?<\/div>)/
  if (detailsRe.test(content)) {
    content = content.replace(detailsRe, `$1\n            <FabricGuideCards />`)
  }

  return content
}

// 3. Substitui seção de links internos por ProfessionLinksNeutral
function addProfessionLinks(content: string): string {
  if (content.includes('<ProfessionLinksNeutral')) return content
  if (!content.includes('INTERNAL_LINKS')) return content

  // Extrai o título da seção de links se houver
  const titleMatch = content.match(/Guias por profissão|Profissões relacionadas|Links relacionados|Explorar mais|Para sua profissão/)
  const title = 'Jaleco para sua profissão'

  // Remove seção de links inline e substitui por componente
  content = content.replace(
    /\s*\{\/\*[^*]*LINKS[^*]*\*\/\}\s*\n\s*<section[^>]*>[\s\S]*?<\/section>/,
    `\n\n        {/* ── LINKS INTERNOS ── */}\n        <ProfessionLinksNeutral\n          title=${JSON.stringify(title)}\n          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}\n        />`
  )

  return content
}

let changed = 0
let stats = { trustBar: 0, fabricGuide: 0, profLinks: 0 }

const entries = readdirSync(APP_DIR, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  if (ALREADY_DONE.has(entry.name)) continue

  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  try {
    let content = readFileSync(filePath, 'utf-8')
    const orig = content

    // Imports
    if (!content.includes('CompactTrustBar')) {
      content = addImportAtEnd(content, "import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'")
    }
    if (!content.includes('FabricGuideCards') && (content.includes('FAQ_ITEMS') || content.includes('details'))) {
      content = addImportAtEnd(content, "import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'")
    }
    if (!content.includes('ProfessionLinksNeutral') && content.includes('INTERNAL_LINKS')) {
      content = addImportAtEnd(content, "import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'")
    }

    const before = { trust: content.includes('<CompactTrustBar'), fabric: content.includes('<FabricGuideCards'), links: content.includes('<ProfessionLinksNeutral') }

    content = addCompactTrustBar(content)
    content = addFabricGuideCards(content)
    content = addProfessionLinks(content)

    if (!before.trust && content.includes('<CompactTrustBar')) stats.trustBar++
    if (!before.fabric && content.includes('<FabricGuideCards')) stats.fabricGuide++
    if (!before.links && content.includes('<ProfessionLinksNeutral')) stats.profLinks++

    if (content !== orig) {
      writeFileSync(filePath, content, 'utf-8')
      console.log(`✅ ${entry.name}`)
      changed++
    } else {
      console.log(`⚠️  sem mudança: ${entry.name}`)
    }
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`\nDone: ${changed} files`)
console.log(`  CompactTrustBar: ${stats.trustBar}`)
console.log(`  FabricGuideCards: ${stats.fabricGuide}`)
console.log(`  ProfessionLinksNeutral: ${stats.profLinks}`)
