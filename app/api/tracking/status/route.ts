import { NextRequest, NextResponse } from 'next/server'
import { trackShipments } from '@/lib/melhor-envio'

export async function GET(req: NextRequest) {
  const meTag = req.nextUrl.searchParams.get('meTag')
  if (!meTag) return NextResponse.json({ error: 'meTag required' }, { status: 400 })

  const results = await trackShipments([meTag])
  return NextResponse.json(results[0] ?? { error: 'Not found' })
}
