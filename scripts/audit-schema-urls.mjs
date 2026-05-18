#!/usr/bin/env node
import { readFileSync } from 'fs'
import { execSync } from 'child_process'

const files = execSync(
  "grep -rl 'schemaArticle = {' app --include='*.tsx'",
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean)

// Extracts top-level keys/values from `const schemaArticle = { ... }` block
function extractTopLevel(src) {
  const start = src.indexOf('schemaArticle = {')
  if (start < 0) return null
  let i = src.indexOf('{', start)
  let depth = 0
  const out = {}
  let buf = ''
  let inStr = null
  let escape = false
  for (; i < src.length; i++) {
    const c = src[i]
    buf += c
    if (escape) { escape = false; continue }
    if (c === '\\') { escape = true; continue }
    if (inStr) {
      if (c === inStr) inStr = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) break
    }
  }
  // parse top-level entries: only depth==1 commas split
  const body = buf.slice(1, -1)
  let d = 0, s = null, esc = false
  const parts = []
  let cur = ''
  for (const c of body) {
    if (esc) { esc = false; cur += c; continue }
    if (c === '\\') { esc = true; cur += c; continue }
    if (s) {
      if (c === s) s = null
      cur += c
      continue
    }
    if (c === '"' || c === "'" || c === '`') { s = c; cur += c; continue }
    if (c === '{' || c === '[') d++
    else if (c === '}' || c === ']') d--
    if (c === ',' && d === 0) { parts.push(cur); cur = '' }
    else cur += c
  }
  if (cur.trim()) parts.push(cur)
  for (const p of parts) {
    const m = p.match(/^\s*(\w+)\s*:\s*(['"])([^'"]*)\2/)
    if (m) out[m[1]] = m[3]
  }
  return out
}

const mismatches = []
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const schema = extractTopLevel(src)
  const m = f.match(/^app\/(.+)\/page\.tsx$/)
  if (!m) continue
  const route = m[1]
  const expected = `https://jaleca.com.br/${route}`
  if (!schema) { mismatches.push({ file: f, field: 'parse', got: 'failed', expected }); continue }
  if (schema.url !== expected) {
    mismatches.push({ file: f, field: 'url', got: schema.url ?? '(missing)', expected })
  }
  if (schema.mainEntityOfPage && schema.mainEntityOfPage !== expected) {
    mismatches.push({ file: f, field: 'mainEntityOfPage', got: schema.mainEntityOfPage, expected })
  }
}

if (mismatches.length === 0) {
  console.log('OK — todos os schemaArticle.url batem com a rota.')
} else {
  console.log(`${mismatches.length} mismatches:`)
  for (const x of mismatches) {
    console.log(`  ${x.file} [${x.field}]\n    got:      ${x.got}\n    expected: ${x.expected}`)
  }
}
