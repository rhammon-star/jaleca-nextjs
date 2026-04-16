import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Keep-warm endpoint — chamado pelo cron a cada 5 minutos
// Mantém as funções serverless aquecidas para reduzir cold starts
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() })
}
