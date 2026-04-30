/**
 * Migra páginas de profissão para usar getCachedHeroImage e getCachedBlogPosts.
 */

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const pages = await glob([
  'app/jaleco-*/page.tsx',
  'app/uniforme-*/page.tsx',
  'app/conjunto-*/page.tsx',
  'app/dolma-*/page.tsx',
  'app/scrub-*/page.tsx',
  'app/pijama-*/page.tsx',
])

/**
 * Remove uma função top-level pelo nome.
 * Encontra o `{` que abre o CORPO da função (depois do `)` que fecha os parâmetros).
 */
function removeFn(src, fnName) {
  const startMarker = `\nasync function ${fnName}(`
  const start = src.indexOf(startMarker)
  if (start === -1) return src

  // Percorre para frente encontrando `)` que fecha os parâmetros
  // A assinatura é: `async function NAME(): ReturnType {`
  // Precisamos encontrar o `{` que é o corpo da função, não o do tipo de retorno.
  // Estratégia: encontrar o `) {` ou `> {\n` que marca o início do corpo.

  // Encontra o fim da assinatura: o `{` seguido de newline que abre o corpo
  // A assinatura termina com `> {` ou `) {` antes de uma nova linha
  let signatureEnd = -1
  {
    // Busca após o `(` da função
    let i = start + startMarker.length
    // Avança até o `) {` que abre o corpo (contando parênteses)
    let parenDepth = 1
    while (i < src.length && parenDepth > 0) {
      if (src[i] === '(') parenDepth++
      else if (src[i] === ')') parenDepth--
      i++
    }
    // Agora `i` está após o `)` de fechamento dos parâmetros
    // Avança para encontrar o `{` do corpo (ignorando o return type)
    let angleDepth = 0
    while (i < src.length) {
      if (src[i] === '<') angleDepth++
      else if (src[i] === '>') angleDepth--
      else if (src[i] === '{' && angleDepth === 0) {
        signatureEnd = i
        break
      }
      i++
    }
  }

  if (signatureEnd === -1) return src

  // Conta chaves a partir do corpo
  let depth = 0
  let i = signatureEnd
  while (i < src.length) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) {
        const end = i + 1
        // Inclui a newline seguinte
        const tail = src.slice(end).match(/^\s*\n/)
        return src.slice(0, start) + (tail ? src.slice(end + tail[0].length) : src.slice(end))
      }
    }
    i++
  }
  return src
}

let updated = 0
let skipped = 0

for (const pagePath of pages) {
  let src = readFileSync(pagePath, 'utf-8')

  const hasLocalHero = src.includes('async function getHeroImage()')
  const hasLocalBlog = src.includes('async function getBlogPosts()')

  if (!hasLocalHero && !hasLocalBlog) {
    skipped++
    continue
  }

  // ── 1. Extrair slug do hero ─────────────────────────────────────────
  const heroSlugKeyMatch = src.match(/getHeroImageSlug\('([^']+)'\)/)

  // Slug hardcoded dentro do corpo da função getHeroImage
  let heroSlugHard = null
  {
    const fnStart = src.indexOf('async function getHeroImage()')
    const fnBody = fnStart !== -1 ? src.slice(fnStart, fnStart + 600) : ''
    // Ignora matches que vêm de getHeroImageSlug
    if (!heroSlugKeyMatch) {
      const m = fnBody.match(/slug:\s*'([^']+)'/)
      if (m) heroSlugHard = m[1]
    }
  }

  let heroArg = null
  if (heroSlugKeyMatch) {
    heroArg = `getHeroImageSlug('${heroSlugKeyMatch[1]}') ?? ''`
  } else if (heroSlugHard) {
    heroArg = `'${heroSlugHard}'`
  }

  // ── 2. Extrair search do blog ────────────────────────────────────────
  let blogSearch = 'jaleco'
  {
    const fnStart = src.indexOf('async function getBlogPosts()')
    const fnBody = fnStart !== -1 ? src.slice(fnStart, fnStart + 300) : ''
    const m = fnBody.match(/search:\s*'([^']+)'/)
    if (m) blogSearch = m[1]
  }

  // ── 3. Remover funções locais ────────────────────────────────────────
  if (hasLocalHero) src = removeFn(src, 'getHeroImage')
  if (hasLocalBlog) src = removeFn(src, 'getBlogPosts')

  // ── 4. Substituir chamadas ───────────────────────────────────────────
  if (hasLocalHero && heroArg) {
    src = src.replace(/\bgetHeroImage\(\)/g, `getCachedHeroImage(${heroArg})`)
  }
  if (hasLocalBlog) {
    src = src.replace(/\bgetBlogPosts\(\)/g, `getCachedBlogPosts('${blogSearch}')`)
  }

  // ── 5. Adicionar import ──────────────────────────────────────────────
  const importNames = [
    hasLocalHero && heroArg ? 'getCachedHeroImage' : null,
    hasLocalBlog ? 'getCachedBlogPosts' : null,
  ].filter(Boolean).join(', ')
  const importLine = `import { ${importNames} } from '@/lib/profession-page-data'\n`

  const lastImportMatch = [...src.matchAll(/^import [^\n]+\n/gm)].at(-1)
  if (lastImportMatch) {
    const pos = lastImportMatch.index + lastImportMatch[0].length
    src = src.slice(0, pos) + importLine + src.slice(pos)
  }

  // ── 6. Limpar import de getPosts se não mais usado ───────────────────
  if (hasLocalBlog) {
    const withoutImportLines = src.replace(/^import [^\n]+\n/gm, '')
    if (!withoutImportLines.includes('getPosts')) {
      src = src.replace(/^import \{ getPosts[^}]*\} from '@\/lib\/wordpress'\n/m, '')
      src = src.replace(/,\s*getPosts(\s*[},])/g, '$1')
      src = src.replace(/getPosts,\s*/g, '')
    }
  }

  writeFileSync(pagePath, src)
  updated++
  console.log(`✓ ${pagePath}`)
}

console.log(`\nConcluído: ${updated} atualizados, ${skipped} sem funções locais.`)
