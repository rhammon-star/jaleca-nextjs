import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return NextResponse.json({
    city: req.headers.get('x-vercel-ip-city'),
    region: req.headers.get('x-vercel-ip-country-region'),
    country: req.headers.get('x-vercel-ip-country'),
    ip: req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for'),
  })
}
