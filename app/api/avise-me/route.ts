import { NextRequest, NextResponse } from 'next/server'
import { kv, notifyKey } from '@/lib/kv'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; variationId?: number }
    | null
  const { email, variationId } = body ?? {}
  if (!email || !variationId) {
    return NextResponse.json({ error: 'email e variationId obrigatórios' }, { status: 400 })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'email inválido' }, { status: 400 })
  }
  await kv.sadd(notifyKey(variationId), email.toLowerCase().trim())
  return NextResponse.json({ ok: true })
}
