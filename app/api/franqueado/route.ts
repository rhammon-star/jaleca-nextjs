import { NextRequest, NextResponse } from 'next/server'
import { findFranqueadoByRadius } from '@/lib/franqueados'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const latStr = req.headers.get('x-vercel-ip-latitude')
    const lngStr = req.headers.get('x-vercel-ip-longitude')

    if (!latStr || !lngStr) return NextResponse.json(null)

    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)

    if (isNaN(lat) || isNaN(lng)) return NextResponse.json(null)

    const franqueado = findFranqueadoByRadius(lat, lng, 100)
    return NextResponse.json(franqueado)
  } catch {
    return NextResponse.json(null)
  }
}
