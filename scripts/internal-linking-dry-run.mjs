#!/usr/bin/env node
/**
 * Internal Linking — DRY-RUN scanner.
 *
 * Procura páginas (blog posts, cidades, profissões) que NÃO mencionam
 * /jaleco, /jaleco-feminino ou /jaleco-masculino e gera um relatório CSV
 * com sugestões de inserção. NÃO altera nenhum arquivo.
 *
 * Uso: node scripts/internal-linking-dry-run.mjs
 * Saída: ai-source-docs/historico/internal-linking-sugestoes-YYYYMMDD.csv
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const APP = join(ROOT, 'app')
const TARGETS = [
  { url: '/jaleco', anchor: 'jaleco profissional' },
  { url: '/jaleco-feminino', anchor: 'jaleco feminino' },
  { url: '/jaleco-masculino', anchor: 'jaleco masculino' },
]

const SCAN_DIRS = ['blog', 'cidade']

async function* walk(dir) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) yield* walk(full)
    else if (e.name === 'page.tsx') yield full
  }
}

function pageSlug(filePath) {
  const rel = filePath.replace(APP, '').replace(/\/page\.tsx$/, '')
  return rel
}

async function main() {
  const rows = [['page', 'missing_target', 'suggested_anchor', 'priority']]

  for (const sub of SCAN_DIRS) {
    const dir = join(APP, sub)
    try { await stat(dir) } catch { continue }
    for await (const file of walk(dir)) {
      const content = await readFile(file, 'utf8')
      const slug = pageSlug(file)
      for (const t of TARGETS) {
        const hasLink = new RegExp(`href=["']${t.url}["']`).test(content)
        if (!hasLink) {
          const priority = /jaleco-feminino|jaleco feminino/i.test(content) && t.url === '/jaleco-feminino' ? 'high'
                         : /jaleco-masculino|jaleco masculino/i.test(content) && t.url === '/jaleco-masculino' ? 'high'
                         : /jaleco/i.test(content) ? 'medium' : 'low'
          rows.push([slug, t.url, t.anchor, priority])
        }
      }
    }
  }

  // Cidades estão em app/cidade/[slug] (dinâmico) — adicionar nota
  rows.push(['app/cidade/[slug]/page.tsx', '/jaleco-feminino + /jaleco-masculino', 'jaleco feminino, jaleco masculino', 'high'])

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const out = join(ROOT, `ai-source-docs/historico/internal-linking-sugestoes-${date}.csv`)
  await writeFile(out, rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'))
  console.log(`✅ Relatório salvo em: ${out}`)
  console.log(`📊 Total de sugestões: ${rows.length - 1}`)

  const byPriority = rows.slice(1).reduce((acc, r) => { acc[r[3]] = (acc[r[3]] || 0) + 1; return acc }, {})
  console.log(`   - high: ${byPriority.high || 0}`)
  console.log(`   - medium: ${byPriority.medium || 0}`)
  console.log(`   - low: ${byPriority.low || 0}`)
}

main().catch(e => { console.error(e); process.exit(1) })
