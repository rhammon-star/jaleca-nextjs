import { NextRequest, NextResponse } from 'next/server'
import { sendOrderShippedWithTracking } from '@/lib/email'

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!
const WEBHOOK_SECRET = process.env.JALECA_WEBHOOK_SECRET!

function wcAuth() {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function saveTrackingMeta(orderId: number, meta: Record<string, string>) {
  for (const [key, value] of Object.entries(meta)) {
    await fetch(`${WC_API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta_data: [{ key, value }] }),
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      secret: string
      orderId: number
      trackingCode: string
      carrier: string
      meTag: string
      customerEmail: string
      customerName: string
      estimatedDays?: number
    }

    if (body.secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, trackingCode, carrier, meTag, customerEmail, customerName, estimatedDays } = body

    if (!orderId || !trackingCode || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Salva meta no WooCommerce
    await saveTrackingMeta(orderId, {
      jaleca_tracking_code: trackingCode,
      jaleca_tracking_carrier: carrier,
      jaleca_me_tag: meTag,
      jaleca_tracking_active: '1',
      jaleca_tracking_status: 'posted',
      jaleca_notified_statuses: 'shipped',
    })

    // Envia email #5
    await sendOrderShippedWithTracking(orderId, customerName, customerEmail, trackingCode, carrier, estimatedDays)

    console.log(`[Tracking] Pedido #${orderId} registrado — ${carrier} ${trackingCode}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Tracking Register] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
