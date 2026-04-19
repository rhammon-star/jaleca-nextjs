/**
 * GA4 Measurement Protocol — server-side purchase tracking
 *
 * Usado pelo webhook Cielo (PIX/Boleto) e pelo payment/create (cartão)
 * para registrar conversões no GA4 mesmo quando o browser fecha antes
 * da confirmação do pagamento.
 *
 * client_id: capturado no checkout via cookie _ga / localStorage / gtag API.
 * Enhanced Conversions: email SHA-256 enviado como user_data — permite ao
 * Google Ads atribuir a conversão mesmo sem client_id (adblocker, incógnito).
 *
 * Fallback: se não tiver client_id real, usa "server_wc_{orderId}".
 * Esses eventos chegam ao GA4 mas a atribuição depende do Enhanced Conversion.
 */

import { createHash } from 'crypto'

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID
// Trim removes any stray \n that Vercel or .env files may introduce when pasting
const API_SECRET     = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET?.replace(/\\n/g, '').replace(/\n/g, '').trim()

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function sendGA4PurchaseMP(params: {
  clientId?: string | null
  orderId: string
  value: number
  email?: string | null
  items: Array<{ id: string; name: string; price: number; quantity: number }>
}) {
  if (!MEASUREMENT_ID || !API_SECRET) {
    console.warn('[GA4 MP] Missing MEASUREMENT_ID or API_SECRET — skipping')
    return
  }

  const clientId = params.clientId || `server_wc_${params.orderId}`
  const hasRealClientId = !!params.clientId

  // Enhanced Conversions: email hasheado permite atribuição mesmo sem client_id
  const userEmail = params.email?.trim().toLowerCase()
  const userData = userEmail
    ? { sha256_email_address: sha256(userEmail) }
    : undefined

  const payload: Record<string, unknown> = {
    client_id: clientId,
    ...(userData && { user_data: userData }),
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: params.orderId,
          value: params.value,
          currency: 'BRL',
          items: params.items.map(i => ({
            item_id: i.id,
            item_name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
    ],
  }

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error(`[GA4 MP] Error ${res.status}:`, text)
    } else {
      const cidStatus = hasRealClientId ? '(real client_id ✓)' : '(fallback client_id)'
      const ecStatus  = userData ? '(enhanced conversion ✓)' : '(sem email — sem enhanced conversion)'
      console.log(`[GA4 MP] Purchase sent — order ${params.orderId}, R$${params.value} ${cidStatus} ${ecStatus}`)
    }
  } catch (err) {
    console.error('[GA4 MP] Failed to send purchase:', err)
  }
}
