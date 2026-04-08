import { NextRequest, NextResponse } from 'next/server'
import { sendOrderNote } from '@/lib/email'

const WEBHOOK_SECRET = process.env.JALECA_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      secret: string
      orderId: number
      note: string
      customerEmail: string
      customerName: string
    }

    if (body.secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, note, customerEmail, customerName } = body

    if (!orderId || !note || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendOrderNote(orderId, customerName, customerEmail, note)

    console.log(`[Orders Note] Pedido #${orderId} — nota enviada para ${customerEmail}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Orders Note] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
