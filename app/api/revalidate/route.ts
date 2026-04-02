import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paths } = await req.json().catch(() => ({ paths: ['/produtos'] }))
  const toRevalidate: string[] = Array.isArray(paths) ? paths : ['/produtos']

  for (const path of toRevalidate) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: toRevalidate, now: Date.now() })
}
