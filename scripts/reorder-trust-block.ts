import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(process.cwd(), 'app')
const SKIP = new Set([
  'jaleco-feminino', 'jaleco-medica', 'jaleco-dentista-feminino',
  'jaleco-feminino-branco', 'jaleco-feminino-acinturado',
])

let changed = 0
let skippedNoGrid = 0
let skippedAlreadyOk = 0

for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('jaleco-')) continue
  if (SKIP.has(entry.name)) continue
  const filePath = join(APP_DIR, entry.name, 'page.tsx')
  let src: string
  try { src = readFileSync(filePath, 'utf-8') } catch { continue }

  const ratingIdx = src.indexOf('<GoogleRatingCarousel')
  if (ratingIdx === -1) continue

  const lines = src.split('\n')
  const ratingLine = lines.findIndex(l => l.includes('<GoogleRatingCarousel'))
  if (ratingLine === -1) continue

  // Find start of trust block: walk back over comment + blank lines
  let blockStart = ratingLine
  for (let i = ratingLine - 1; i >= Math.max(0, ratingLine - 3); i--) {
    if (lines[i].includes('GOOGLE RATING') && lines[i].includes('/*')) { blockStart = i; break }
    if (lines[i].trim() === '') continue
    break
  }

  // Find end of block: last of GoogleRatingCarousel | UGCSection | InstagramLazy + their preceding comments
  let blockEnd = ratingLine
  for (let i = ratingLine + 1; i < Math.min(lines.length, ratingLine + 12); i++) {
    const l = lines[i]
    if (l.includes('<UGCSection') || l.includes('<InstagramLazy') ||
        l.trim() === '' || (l.includes('/*') && (l.includes('INSTAGRAM') || l.includes('UGC') || l.includes('DEPOIMENT')))) {
      blockEnd = i
      continue
    }
    break
  }
  // Trim trailing blank
  while (blockEnd > blockStart && lines[blockEnd].trim() === '') blockEnd--

  // Extract block content
  const blockLines = lines.slice(blockStart, blockEnd + 1)

  // Find insertion point: after product grid section close.
  // Two patterns:
  //   A) ProfessionProductGrid inside <div id="colecao">...</div>
  //   B) inline `</section>\n)}` ending the produtos.slice section
  let insertAfter = -1
  const colecaoIdx = lines.findIndex(l => l.includes('<div id="colecao"'))
  if (colecaoIdx !== -1) {
    // find closing </div> at same indent
    const indent = lines[colecaoIdx].match(/^\s*/)?.[0] ?? ''
    for (let i = colecaoIdx + 1; i < lines.length; i++) {
      if (lines[i] === indent + '</div>') { insertAfter = i; break }
    }
  } else {
    // find `produtos.slice` then walk forward to the `)}` line that closes the conditional
    const prodIdx = lines.findIndex(l => l.includes('produtos.slice'))
    if (prodIdx !== -1) {
      for (let i = prodIdx; i < lines.length; i++) {
        if (lines[i].trim() === ')}') { insertAfter = i; break }
      }
    }
  }
  if (insertAfter === -1) { skippedNoGrid++; continue }

  // Skip if block already right after insertion (within 2 lines)
  if (blockStart >= insertAfter && blockStart - insertAfter <= 3) { skippedAlreadyOk++; continue }
  // Also skip if insertion point is inside block
  if (insertAfter >= blockStart && insertAfter <= blockEnd) { skippedAlreadyOk++; continue }

  // Build new lines
  let newLines: string[]
  if (insertAfter < blockStart) {
    newLines = [
      ...lines.slice(0, insertAfter + 1),
      '',
      ...blockLines,
      ...lines.slice(insertAfter + 1, blockStart),
      ...lines.slice(blockEnd + 1),
    ]
    // strip leading blank if already had
  } else {
    newLines = [
      ...lines.slice(0, blockStart),
      ...lines.slice(blockEnd + 1, insertAfter + 1),
      '',
      ...blockLines,
      ...lines.slice(insertAfter + 1),
    ]
  }

  writeFileSync(filePath, newLines.join('\n'), 'utf-8')
  changed++
  console.log(`✓ ${entry.name} (block ${blockStart+1}-${blockEnd+1} → after ${insertAfter+1})`)
}

console.log(`\nDone: ${changed} changed, ${skippedAlreadyOk} ok, ${skippedNoGrid} no-grid`)
