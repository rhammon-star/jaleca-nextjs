import { NextRequest, NextResponse } from 'next/server'
import { getAbandonedContacts, updateCartStage, removeFromRecoveryList } from '@/lib/brevo-cart'
import { sendCartRecovery1h, sendCartRecovery24h, sendCartRecovery72h } from '@/lib/email'

// Vercel Cron calls this endpoint. Secured via CRON_SECRET header.
export async function GET(request: NextRequest) {
  const secret = request.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contacts = await getAbandonedContacts()
  const now = Date.now()

  const results = { sent1h: 0, sent24h: 0, sent72h: 0, cleaned: 0, errors: 0 }

  for (const contact of contacts) {
    const { email, abandonedAt, cartItems, stage } = contact
    const elapsedMs = now - new Date(abandonedAt).getTime()
    const elapsedH = elapsedMs / (1000 * 60 * 60)

    try {
      if (stage === 0 && elapsedH >= 1) {
        await sendCartRecovery1h(cartItems, email)
        await updateCartStage(email, 1)
        results.sent1h++
      } else if (stage === 1 && elapsedH >= 24) {
        await sendCartRecovery24h(cartItems, email)
        await updateCartStage(email, 2)
        results.sent24h++
      } else if (stage === 2 && elapsedH >= 72) {
        await sendCartRecovery72h(cartItems, email)
        await updateCartStage(email, 3)
        results.sent72h++
      } else if (stage === 3 && elapsedH >= 168) {
        // 7 days — cleanup
        await removeFromRecoveryList(email)
        results.cleaned++
      }
    } catch {
      results.errors++
    }
  }

  return NextResponse.json({ ok: true, processed: contacts.length, ...results })
}
