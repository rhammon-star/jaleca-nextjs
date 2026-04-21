import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { notifyIndexNow } from '@/lib/indexnow'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paths } = await req.json().catch(() => ({ paths: ['/produtos'] }))
  const toRevalidate: string[] = Array.isArray(paths) ? paths : ['/produtos']

  // Invalida o cache de produtos (unstable_cache tag)
  revalidateTag('products', 'hours')

  for (const path of toRevalidate) {
    revalidatePath(path)
  }

  notifyIndexNow(toRevalidate.map(p => `https://jaleca.com.br${p}`))

  return NextResponse.json({ revalidated: toRevalidate, now: Date.now() })
}
