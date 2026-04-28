import { NextRequest, NextResponse } from 'next/server'
import { drainRetries } from '@/lib/seo-retry-queue'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
import { getAllSeoSlugs } from '@/lib/variation-seo'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const results: { from: string; variationId: number }[] = []

  // 1) Drena fila de retry
  const retries = await drainRetries(3)
  for (const r of retries) {
    await tryGeminiOrEnqueue(r.variationId)
    results.push({ from: 'queue', variationId: r.variationId })
  }

  // 2) Varre entradas seoQuality="template" sem tentativa recente (> 1h)
  const slugs = await getAllSeoSlugs()
  const ONE_HOUR = 3600 * 1000
  for (const slug of slugs) {
    const e = await kv.get<SeoEntry>(seoKey(slug))
    if (!e || e.seoQuality !== 'template') continue
    if (e.geminiAttempts >= 3) continue
    const lastAttempt = e.lastGeminiAttempt ? new Date(e.lastGeminiAttempt).getTime() : 0
    if (Date.now() - lastAttempt < ONE_HOUR) continue
    await tryGeminiOrEnqueue(e.variationId)
    results.push({ from: 'scan', variationId: e.variationId })
  }

  return NextResponse.json({ processed: results.length, results })
}
