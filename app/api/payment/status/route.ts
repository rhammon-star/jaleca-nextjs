import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation } from '@/lib/email'
import { getPaymentStatus } from '@/lib/cielo'
import { sendMetaPurchase } from '@/lib/meta-conversions'
import { sendGA4PurchaseMP } from '@/lib/ga4-measurement-protocol'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function confirmWCOrder(wcOrderId: string) {
  const getRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (getRes.ok) {
    const current = await getRes.json()
    if (current.status !== 'pending') return
  }

  const res = await fetch(`${WC_API}/orders/${wcOrderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'processing' }),
  })
  if (!res.ok) return

  const order = await res.json()
  const email = order.billing?.email
  if (email) {
    sendOrderConfirmation(order, email).catch(() => {})
    import('@/lib/brevo-cart').then(m => m.removeFromRecoveryList(email)).catch(() => {})

    const meta = (order.meta_data as Array<{ key: string; value: string }> | undefined) ?? []
    const metaVal = (k: string) => meta.find(m => m.key === k)?.value

    sendGA4PurchaseMP({
      clientId: metaVal('jaleca_ga_client_id'),
      orderId: String(order.id),
      value: parseFloat(order.total || '0'),
      email,
      items: (order.line_items ?? []).map((i: { product_id: number; name: string; total: string; quantity: number }) => ({
        id: String(i.product_id),
        name: i.name,
        price: parseFloat(i.total || '0') / (i.quantity || 1),
        quantity: i.quantity,
      })),
      gclid:          metaVal('_gclid'),
      campaignSource: metaVal('_utm_source'),
      campaignMedium: metaVal('_utm_medium'),
      campaignName:   metaVal('_utm_campaign'),
    }).catch(err => console.error('[GA4 MP] status route error:', err))

    sendMetaPurchase(
      {
        email,
        phone: order.billing?.phone,
        firstName: order.billing?.first_name,
        lastName: order.billing?.last_name,
        city: order.billing?.city,
        state: order.billing?.state,
        zip: order.billing?.postcode,
        country: order.billing?.country,
      },
      {
        orderId: String(order.id),
        value: parseFloat(order.total || '0'),
        items: order.line_items?.map((i: { product_id: number; quantity: number }) => ({
          id: String(i.product_id),
          quantity: i.quantity,
        })),
      }
    ).catch(err => console.error('[CAPI] sendMetaPurchase failed (status route):', err))
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('paymentId')
  const wcOrderId = searchParams.get('wc')

  if (!paymentId) {
    return NextResponse.json({ error: 'paymentId é obrigatório' }, { status: 400 })
  }

  try {
    const data = await getPaymentStatus(paymentId)
    // Cielo: Status 2 = PaymentConfirmed
    const isPaid = data.Payment.Status === 2

    if (isPaid && wcOrderId) {
      confirmWCOrder(wcOrderId).catch(() => {})
    }

    return NextResponse.json({ status: data.Payment.Status, paid: isPaid })
  } catch {
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
