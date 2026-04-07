import { NextRequest, NextResponse } from 'next/server'
import { findFranqueado } from '@/lib/franqueados'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    // Vercel injeta geo headers nativamente — sem API externa
    const city = req.headers.get('x-vercel-ip-city')
    const region = req.headers.get('x-vercel-ip-country-region')

    if (!city || !region) return NextResponse.json(null)

    // x-vercel-ip-city vem URL-encoded (ex: "Ipatinga" → "Ipatinga")
    const decodedCity = decodeURIComponent(city)

    // x-vercel-ip-country-region pode vir como "BR-MG" ou "MG"
    const state = region.includes('-') ? region.split('-').pop()! : region

    const franqueado = findFranqueado(decodedCity, state)
    return NextResponse.json(franqueado)
  } catch {
    return NextResponse.json(null)
  }
}
