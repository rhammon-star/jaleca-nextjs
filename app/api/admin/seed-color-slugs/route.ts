import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const COLOR_SLUGS_KEY = 'color-slugs'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-jaleca-secret') !== process.env.JALECA_PLUGIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let cursor = 0
  const slugs = new Set<string>()
  let scanned = 0

  do {
    const [next, keys] = await (kv as any).scan(cursor, { match: 'seo:produto/*', count: 100 })
    cursor = Number(next)
    for (const key of keys) {
      const entry = await kv.get<{ colorSlug?: string }>(key)
      if (entry?.colorSlug) slugs.add(entry.colorSlug)
    }
    scanned += keys.length
  } while (cursor !== 0)

  if (slugs.size > 0) {
    await kv.sadd(COLOR_SLUGS_KEY, ...[...slugs])
  }

  return NextResponse.json({ scanned, registered: slugs.size, slugs: [...slugs].sort() })
}
