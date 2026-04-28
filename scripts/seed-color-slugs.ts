// Lê todas as entradas seo:* do KV e registra colorSlugs no set global
import { kv } from '@vercel/kv'

const COLOR_SLUGS_KEY = 'color-slugs'

async function main() {
  let cursor = 0
  let total = 0
  const slugs = new Set<string>()

  do {
    const [next, keys] = await (kv as any).scan(cursor, { match: 'seo:produto/*', count: 100 })
    cursor = Number(next)
    for (const key of keys) {
      const entry = await kv.get<{ colorSlug?: string }>(key)
      if (entry?.colorSlug) slugs.add(entry.colorSlug)
    }
    total += keys.length
    console.log(`Escaneadas: ${total} entradas, ${slugs.size} slugs únicos`)
  } while (cursor !== 0)

  if (slugs.size > 0) {
    await kv.sadd(COLOR_SLUGS_KEY, ...slugs)
    console.log(`\nRegistrados ${slugs.size} colorSlugs no KV:`, [...slugs].sort().join(', '))
  } else {
    console.log('Nenhum colorSlug encontrado')
  }
}

main().catch(console.error)
