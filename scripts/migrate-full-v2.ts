// v2 — parser linha a linha para trust bar + demais adições seguras
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const ALREADY_DONE = new Set([
  'jaleco-feminino', 'jaleco-medica', 'jaleco-dentista-feminino',
  'jaleco-feminino-branco', 'jaleco-feminino-acinturado',
])

function addImportAtEnd(content: string, importLine: string): string {
  const pkg = importLine.match(/'([^']+)'/)?.[1] ?? ''
  if (content.includes(pkg)) return content
  const lines = content.split('\n')
  let lastImport = 0
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('import ')) lastImport = i
  lines.splice(lastImport + 1, 0, importLine)
  return lines.join('\n')
}

/**
 * Remove um bloco JSX que começa em startLine e tem profundidade de tags gerenciada.
 * startLine: número (0-indexed) onde o bloco começa.
 * Retorna o conteúdo sem o bloco.
 */
function removeJSXBlock(lines: string[], startLine: number): string[] {
  // Conta tags abertas/fechadas a partir de startLine para encontrar o fim
  let depth = 0
  let end = startLine
  let started = false

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i]
    // Conta <tag (exceto self-closing <tag />) e </tag>
    const opens = (line.match(/<[A-Za-z][^/!][^>]*[^/]>/g) ?? []).length +
                  (line.match(/<[A-Za-z][^>]*[^/]>(?!\s*<\/)/g) ?? []).filter(t => !t.includes('/>')).length
    const opensSimple = (line.match(/(?<!\/)(?:<[A-Za-z][^>]*>)(?!.*\/>)/g) ?? []).length
    const closes = (line.match(/<\/[A-Za-z][^>]*>/g) ?? []).length
    const selfClose = (line.match(/<[A-Za-z][^>]*\/>/g) ?? []).length

    // Abordagem simples: contar < que abrem e </
    const openCount = (line.match(/<[A-Za-z]/g) ?? []).length
    const closeCount = (line.match(/<\/[A-Za-z]/g) ?? []).length
    const selfCloseCount = (line.match(/\/>/g) ?? []).length

    if (!started && openCount > 0) {
      started = true
      depth += openCount - closeCount - selfCloseCount
    } else if (started) {
      depth += openCount - closeCount - selfCloseCount
    }

    if (started && depth <= 0) {
      end = i
      break
    }
  }

  return [...lines.slice(0, startLine), ...lines.slice(end + 1)]
}

/**
 * Remove a seção de trust bar inline identificada pelo comentário TRUST BAR
 * usando parser linha a linha seguro.
 */
function removeTrustBarSection(content: string): string {
  const lines = content.split('\n')
  const trustIdx = lines.findIndex(l => l.includes('TRUST BAR') && l.includes('/*'))
  if (trustIdx === -1) return content

  // Encontra o início do bloco JSX (próxima linha com <div ou <section)
  let blockStart = -1
  for (let i = trustIdx + 1; i < Math.min(trustIdx + 5, lines.length); i++) {
    if (lines[i].match(/^\s*<(div|section)/)) { blockStart = i; break }
  }
  if (blockStart === -1) return content

  // Conta tags abertas/fechadas para encontrar o fim do bloco
  let depth = 0
  let blockEnd = blockStart
  for (let i = blockStart; i < lines.length; i++) {
    const line = lines[i]
    // Count opening tags (not self-closing)
    const allTags = line.match(/<\/?[A-Za-z][A-Za-z0-9]*/g) ?? []
    for (const tag of allTags) {
      if (tag.startsWith('</')) depth--
      else depth++
    }
    // Account for self-closing on same line
    const selfClose = (line.match(/\/>/g) ?? []).length
    depth -= selfClose

    if (i > blockStart && depth <= 0) { blockEnd = i; break }
  }

  // Remove comentário + bloco
  const result = [
    ...lines.slice(0, trustIdx),
    ...lines.slice(blockEnd + 1),
  ]
  return result.join('\n')
}

// Adiciona CompactTrustBar após HeroCommercial
function addCompactTrustBar(content: string): string {
  if (content.includes('<CompactTrustBar')) return content

  // Remove trust bar inline primeiro
  content = removeTrustBarSection(content)

  // Adiciona após HeroCommercial />
  content = content.replace(
    /(<HeroCommercial[\s\S]*?\/>\s*\n)/,
    `$1\n        {/* ── ② COMPACT TRUST BAR ── */}\n        <CompactTrustBar />\n`
  )
  return content
}

// Adiciona FabricGuideCards no FAQ
function addFabricGuideCards(content: string): string {
  if (content.includes('<FabricGuideCards')) return content
  if (!content.includes('FAQ_ITEMS') && !content.includes('<details')) return content

  // Encontra o fechamento do accordion de FAQ (último </div> após série de details)
  // Padrão mais comum: )}\n      </div> ← fecha o map, seguido de </div> fechando a section
  const patterns = [
    // map de FAQ_ITEMS: )} fechando a função map, seguido de </div>
    /(\}\)\s*\n(\s*)<\/div>)(\s*\n\s*(?:<FabricGuideCards|<\/div>|<\/section>))/,
    // Último </details> seguido de )} e </div>
    /(<\/details>\s*\n(\s*)\}\)\s*\n\s*<\/div>)/,
  ]

  for (const re of patterns) {
    if (re.test(content)) {
      content = content.replace(re, (match, p1, p2) => {
        return p1 + `\n${p2 ?? '            '}<FabricGuideCards />`
      })
      break
    }
  }

  return content
}

// Substitui seção inline de links por ProfessionLinksNeutral
function addProfessionLinks(content: string): string {
  if (content.includes('<ProfessionLinksNeutral')) return content
  if (!content.includes('INTERNAL_LINKS')) return content

  // Remove a seção de links inline usando parser
  const lines = content.split('\n')
  const linksIdx = lines.findIndex(l =>
    (l.includes('LINKS INTERNOS') || l.includes('links internos') || l.includes('Links relacionados') ||
     l.includes('Guias por profissão')) && l.includes('/*')
  )

  if (linksIdx === -1) return content

  let blockStart = -1
  for (let i = linksIdx + 1; i < Math.min(linksIdx + 5, lines.length); i++) {
    if (lines[i].match(/^\s*<(div|section)/)) { blockStart = i; break }
  }
  if (blockStart === -1) return content

  let depth = 0
  let blockEnd = blockStart
  for (let i = blockStart; i < lines.length; i++) {
    const line = lines[i]
    const allTags = line.match(/<\/?[A-Za-z][A-Za-z0-9]*/g) ?? []
    for (const tag of allTags) {
      if (tag.startsWith('</')) depth--
      else depth++
    }
    depth -= (line.match(/\/>/g) ?? []).length
    if (i > blockStart && depth <= 0) { blockEnd = i; break }
  }

  const newLines = [
    ...lines.slice(0, linksIdx),
    `        {/* ── LINKS INTERNOS ── */}`,
    `        <ProfessionLinksNeutral`,
    `          title="Jaleco para sua profissão"`,
    `          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}`,
    `        />`,
    ...lines.slice(blockEnd + 1),
  ]
  return newLines.join('\n')
}

let changed = 0
let stats = { trust: 0, fabric: 0, links: 0 }

for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  if (ALREADY_DONE.has(entry.name)) continue

  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  try {
    let content = readFileSync(filePath, 'utf-8')
    const orig = content

    // Imports
    content = addImportAtEnd(content, "import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'")
    if (content.includes('FAQ_ITEMS') || content.includes('<details')) {
      content = addImportAtEnd(content, "import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'")
    }
    if (content.includes('INTERNAL_LINKS')) {
      content = addImportAtEnd(content, "import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'")
    }

    const before = {
      trust: content.includes('<CompactTrustBar'),
      fabric: content.includes('<FabricGuideCards'),
      links: content.includes('<ProfessionLinksNeutral'),
    }

    content = addCompactTrustBar(content)
    content = addFabricGuideCards(content)
    content = addProfessionLinks(content)

    if (!before.trust && content.includes('<CompactTrustBar')) stats.trust++
    if (!before.fabric && content.includes('<FabricGuideCards')) stats.fabric++
    if (!before.links && content.includes('<ProfessionLinksNeutral')) stats.links++

    if (content !== orig) {
      writeFileSync(filePath, content, 'utf-8')
      changed++
    }
  } catch (e) {
    console.error(`❌ ${entry.name}: ${e}`)
  }
}

console.log(`Done: ${changed} files`)
console.log(`  CompactTrustBar: ${stats.trust}`)
console.log(`  FabricGuideCards: ${stats.fabric}`)
console.log(`  ProfessionLinksNeutral: ${stats.links}`)
