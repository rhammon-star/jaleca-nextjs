import { NextRequest, NextResponse } from 'next/server'
import {
  fetchCurrentPositions,
  loadHistory,
  saveHistory,
  detectDrops,
} from '@/lib/dataforseo/rank-tracker'
import { sendSeoDropAlert } from '@/lib/email'

export async function GET(request: NextRequest) {
  const secret = request.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const previous = await loadHistory()
    const current = await fetchCurrentPositions()

    const drops =
      previous?.records ? detectDrops(previous.records, current) : []

    await saveHistory(current)

    if (drops.length > 0) {
      await sendSeoDropAlert(drops).catch((err) =>
        console.error('[seo-track] erro ao enviar alerta:', err)
      )
    }

    const tracked = current.length
    const ranking = current.filter((r) => r.position !== null).length

    console.log(
      `[seo-track] ${ranking}/${tracked} keywords ranqueando. ${drops.length} quedas detectadas.`
    )

    return NextResponse.json({ ok: true, tracked, ranking, drops })
  } catch (err) {
    console.error('[seo-track] erro:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
