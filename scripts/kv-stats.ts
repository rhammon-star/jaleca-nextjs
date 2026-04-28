import { kv } from '@vercel/kv'

async function main() {
  let gemini = 0, template = 0, premium = 0
  let cursor: string | number = 0
  do {
    const [next, keys] = await kv.scan(cursor, { match: 'seo:*', count: 200 }) as [string | number, string[]]
    cursor = next
    for (const k of keys) {
      const e = await kv.get<{ seoQuality: string }>(k)
      if (e?.seoQuality === 'gemini') gemini++
      else if (e?.seoQuality === 'template') template++
      else if (e?.seoQuality === 'premium') premium++
    }
  } while (cursor !== 0 && cursor !== '0')
  console.log({ gemini, template, premium, total: gemini + template + premium })
}

main().catch(console.error)
