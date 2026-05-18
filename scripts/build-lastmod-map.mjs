#!/usr/bin/env node
// Generates lib/route-lastmod-map.json mapping URL paths → ISO date of last git change.
// Runs at prebuild time. Vercel ships the .git history so this works in CI.
import { execSync } from 'child_process'
import { readdirSync, statSync, writeFileSync, existsSync } from 'fs'
import { join, relative } from 'path'

const ROOT = process.cwd()
const APP = join(ROOT, 'app')

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else if (entry === 'page.tsx' || entry === 'page.ts') acc.push(p)
  }
  return acc
}

function gitDate(filePath) {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return iso || null
  } catch {
    return null
  }
}

function fileToRoute(filePath) {
  const rel = relative(APP, filePath).replace(/\\/g, '/')
  // remove trailing /page.tsx
  let route = '/' + rel.replace(/\/page\.tsx?$/, '')
  if (route === '/page.tsx' || route === '/') route = '/'
  // segment groups: (group) — strip
  route = route.replace(/\/\([^)]+\)/g, '')
  // root layout's page
  if (route === '') route = '/'
  return route
}

const map = {}
const fallback = new Date().toISOString()

if (existsSync(APP)) {
  const files = walk(APP)
  for (const f of files) {
    const route = fileToRoute(f)
    const date = gitDate(f) || fallback
    // dynamic segments [slug] — keep as-is so callers can match the template
    map[route] = date
  }
}

const outPath = join(ROOT, 'lib', 'route-lastmod-map.json')
writeFileSync(outPath, JSON.stringify(map, null, 2) + '\n')
console.log(`Wrote ${Object.keys(map).length} routes to ${relative(ROOT, outPath)}`)
