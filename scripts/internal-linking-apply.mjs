#!/usr/bin/env node
/**
 * Apply internal linking — high priority batch (v2).
 *
 * Estratégia em dois fallbacks:
 * 1. Se tem "Leia também", injeta dentro do bloco existente
 * 2. Senão, injeta um pequeno bloco antes de </article> ou </main>
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

const TARGETS = [
  { slug: 'como-escolher-jaleco-feminino-guia-completo', urls: ['/jaleco-feminino'] },
  { slug: 'como-lavar-jaleco-branco', urls: ['/jaleco-feminino'] },
  { slug: 'guia-completo-jaleco-feminino', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-branco-profissional', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-colorido-permitido-hospital-regras', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-estudante-medicina', urls: ['/jaleco-feminino', '/jaleco-masculino'] },
  { slug: 'jaleco-feminino-branco-ou-colorido-qual-usar', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-feminino-como-escolher-modelo-certo-especialidade', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-feminino-gestante-como-escolher', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-feminino-tamanho-certo-como-medir', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-manga-curta-quando-usar-profissionais', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-masculino-guia-completo', urls: ['/jaleco-feminino', '/jaleco-masculino'] },
  { slug: 'jaleco-para-enfermeira-regras-cofen', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-esteticista-guia', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-fisioterapeuta-guia', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-medica-guia-completo', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-nutricionista-consultorio', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-psicologa-guia', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-para-veterinaria-guia', urls: ['/jaleco-feminino'] },
  { slug: 'jaleco-slim-vs-jaleco-reto-diferencas', urls: ['/jaleco-feminino'] },
  { slug: 'onde-comprar-jaleco-online', urls: ['/jaleco-feminino'] },
  { slug: 'tecidos-para-jaleco-profissional', urls: ['/jaleco-feminino'] },
]

const ANCHOR_TEXT = {
  '/jaleco-feminino': 'Coleção completa de jaleco feminino',
  '/jaleco-masculino': 'Coleção completa de jaleco masculino',
}

let applied = 0, skipped = 0, notFound = 0, failed = 0

for (const t of TARGETS) {
  const path = join(ROOT, 'app/blog', t.slug, 'page.tsx')
  let content
  try { content = await readFile(path, 'utf8') } catch { notFound++; console.log(`❌ ${t.slug}`); continue }

  let modified = content
  let changed = false

  const urlsToAdd = t.urls.filter(u => !new RegExp(`href=["']${u}["']`).test(modified))
  if (urlsToAdd.length === 0) { skipped++; continue }

  // Monta o bloco a injetar
  const linksHtml = urlsToAdd.map(u =>
    `\n            <Link href="${u}" className="text-[#c4a97d] hover:underline text-sm block">→ ${ANCHOR_TEXT[u]}</Link>`
  ).join('')

  // Injeta antes de </article> ou </main>
  const closeTag = modified.includes('</article>') ? '</article>' : '</main>'
  const closeIdx = modified.lastIndexOf(closeTag)
  if (closeIdx === -1) { failed++; console.log(`⚠️  sem </article> nem </main>: ${t.slug}`); continue }

  const block = `\n          <div className="mt-6 pt-6 border-t border-border">${linksHtml}\n          </div>\n        `
  modified = modified.slice(0, closeIdx) + block + modified.slice(closeIdx)

  await writeFile(path, modified)
  applied++
  console.log(`✅ ${t.slug} (+${urlsToAdd.length})`)
  changed = true
}

console.log(`\n📊 Aplicado: ${applied} · Skipped: ${skipped} · Não encontrados: ${notFound} · Falhou: ${failed}`)
