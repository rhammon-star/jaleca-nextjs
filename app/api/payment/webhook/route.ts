import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmation, sendInternalPaymentFailureAlert } from '@/lib/email'
import { sendMetaPurchase } from '@/lib/meta-conversions'
import { sendGA4PurchaseMP } from '@/lib/ga4-measurement-protocol'
import { getPaymentStatus } from '@/lib/cielo'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

async function updateWCOrderStatus(wcOrderId: string, status: string) {
  await fetch(`${WC_API}/orders/${wcOrderId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

// Cielo status → WooCommerce status
const STATUS_MAP: Record<number, string> = {
  2: 'processing',  // PaymentConfirmed
  3: 'failed',      // Denied
  10: 'cancelled',  // Voided
  11: 'refunded',   // Refunded
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Cielo sends: { PaymentId: "uuid", ChangeType: 1 }
    const { PaymentId, ChangeType } = body

    if (!PaymentId) {
      return NextResponse.json({ ok: true })
    }

    console.log(`[Webhook Cielo] PaymentId=${PaymentId} ChangeType=${ChangeType}`)

    // Query Cielo to get actual payment status + MerchantOrderId (= WC order ID)
    const cieloData = await getPaymentStatus(PaymentId)
    const cieloStatus = cieloData.Payment.Status
    // MerchantOrderId is the WC order ID we set when creating the payment
    const wcOrderId = (cieloData as Record<string, unknown>).MerchantOrderId as string | undefined

    console.log(`[Webhook Cielo] status=${cieloStatus} wcOrderId=${wcOrderId ?? 'NOT FOUND'}`)

    if (!wcOrderId) {
      return NextResponse.json({ ok: true })
    }

    const wcStatus = STATUS_MAP[cieloStatus]
    if (!wcStatus) {
      return NextResponse.json({ ok: true })
    }

    // Check current WC status to avoid duplicate email
    let wasAlreadyProcessing = false
    if (wcStatus === 'processing') {
      try {
        const getRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
          headers: { Authorization: wcAuth() },
          cache: 'no-store',
        })
        if (getRes.ok) {
          const current = await getRes.json()
          wasAlreadyProcessing = current.status !== 'pending'
        }
      } catch {}
    }

    await updateWCOrderStatus(wcOrderId, wcStatus)

    // Payment confirmed — send email + tracking
    if (wcStatus === 'processing' && !wasAlreadyProcessing) {
      try {
        const orderRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
          headers: { Authorization: wcAuth() },
          cache: 'no-store',
        })
        if (orderRes.ok) {
          const order = await orderRes.json()
          const email = order.billing?.email
          if (email) {
            sendOrderConfirmation(order, email).catch(err => console.error('[Webhook] sendOrderConfirmation failed:', err))
            import('@/lib/brevo-cart').then(m => m.removeFromRecoveryList(email)).catch(() => {})

            // GA4 Measurement Protocol — usa client_id real salvo no pedido
            const gaClientId = (order.meta_data as Array<{key:string;value:string}>|undefined)
              ?.find(m => m.key === 'jaleca_ga_client_id')?.value
            sendGA4PurchaseMP({
              clientId: gaClientId,
              orderId: String(order.id),
              value: parseFloat(order.total || '0'),
              email: order.billing?.email,
              items: (order.line_items ?? []).map((i: { product_id: number; name: string; total: string; quantity: number }) => ({
                id: String(i.product_id),
                name: i.name,
                price: parseFloat(i.total || '0') / (i.quantity || 1),
                quantity: i.quantity,
              })),
            }).catch(err => console.error('[GA4 MP] webhook error:', err))

            await sendMetaPurchase(
              {
                email: order.billing?.email,
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
            ).catch(err => console.error('[CAPI] sendMetaPurchase failed (webhook):', err))
          }
        }
      } catch {}
    }

    // Payment failed alert
    if (wcStatus === 'failed') {
      try {
        const orderRes = await fetch(`${WC_API}/orders/${wcOrderId}`, {
          headers: { Authorization: wcAuth() }, cache: 'no-store',
        })
        if (orderRes.ok) {
          const order = await orderRes.json()
          const methodMap: Record<string, string> = {
            'cielo-pix': 'PIX',
            'cielo-boleto': 'Boleto',
            'cielo-credit-card': 'Cartão de Crédito',
          }
          const method = methodMap[order.payment_method] ?? order.payment_method_title ?? 'Desconhecido'
          const amount = `R$ ${parseFloat(order.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          sendInternalPaymentFailureAlert({
            orderId:       order.id,
            orderNumber:   order.number || String(order.id),
            customerName:  `${order.billing?.first_name} ${order.billing?.last_name}`.trim(),
            customerEmail: order.billing?.email ?? '',
            customerPhone: order.billing?.phone,
            paymentMethod: method,
            failureReason: `Pagamento negado Cielo (status ${cieloStatus})`,
            amount,
          }).catch(() => {})
        }
      } catch {}
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook Cielo] Error:', error)
    return NextResponse.json({ ok: true })
  }
}
