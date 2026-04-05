import { NextRequest, NextResponse } from 'next/server'
import { sendPaymentReminder } from '@/lib/email'

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth() {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type WCOrder = {
  id: number
  number: string
  status: string
  total: string
  date_created: string
  billing: { first_name: string; email: string }
  meta_data: Array<{ key: string; value: string }>
}

async function markReminderSent(orderId: number) {
  await fetch(`${WC_API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta_data: [{ key: 'jaleca_payment_reminder_sent', value: '1' }] }),
  })
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      req.headers.get('x-vercel-cron') !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Busca pedidos pendentes
    const res = await fetch(`${WC_API_URL}/orders?status=pending&per_page=50`, {
      headers: { Authorization: wcAuth() },
      cache: 'no-store',
    })

    if (!res.ok) return NextResponse.json({ error: 'WC fetch failed' }, { status: 500 })

    const orders = await res.json() as WCOrder[]
    const now = Date.now()
    const TWELVE_HOURS = 12 * 60 * 60 * 1000

    let sent = 0

    for (const order of orders) {
      // Verifica se já enviou lembrete
      const alreadySent = order.meta_data.find(m => m.key === 'jaleca_payment_reminder_sent')?.value === '1'
      if (alreadySent) continue

      // Verifica se passaram +12h desde a criação
      const createdAt = new Date(order.date_created).getTime()
      if (now - createdAt < TWELVE_HOURS) continue

      const { first_name, email } = order.billing
      if (!email) continue

      await sendPaymentReminder(order.id, first_name, email, `R$ ${parseFloat(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      await markReminderSent(order.id)
      sent++
    }

    console.log(`[Payment Reminder] Verificados: ${orders.length} | Lembretes enviados: ${sent}`)
    return NextResponse.json({ ok: true, checked: orders.length, sent })
  } catch (err) {
    console.error('[Payment Reminder] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
