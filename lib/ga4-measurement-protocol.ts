/**
 * GA4 Measurement Protocol — server-side purchase tracking
 *
 * Usado pelo webhook Cielo (PIX/Boleto) e pelo payment/create (cartão)
 * para registrar conversões no GA4 mesmo quando o browser fecha antes
 * da confirmação do pagamento.
 *
 * O client_id real do browser (cookie _ga) é capturado no checkout e
 * salvo no pedido WC como jaleca_ga_client_id. Quando o pagamento é
 * confirmado, esse client_id é reutilizado aqui — o evento é ligado
 * à sessão real do usuário e flui para Google Ads como conversão.
 *
 * Fallback: se não tiver client_id real, usa "server_wc_{orderId}".
 * Esses eventos chegam ao GA4 mas NÃO são atribuídos pelo Google Ads.
 */

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID
// Trim removes any stray \n that Vercel or .env files may introduce when pasting
const API_SECRET     = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET?.replace(/\\n/g, '').replace(/\n/g, '').trim()

export async function sendGA4PurchaseMP(params: {
  clientId?: string | null
  orderId: string
  value: number
  items: Array<{ id: string; name: string; price: number; quantity: number }>
}) {
  if (!MEASUREMENT_ID || !API_SECRET) {
    console.warn('[GA4 MP] Missing MEASUREMENT_ID or API_SECRET — skipping')
    return
  }

  // Usa o client_id real se disponível, senão fallback sem atribuição
  const clientId = params.clientId || `server_wc_${params.orderId}`
  const hasRealClientId = !!params.clientId

  const payload = {
    client_id: clientId,
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
      console.log(
        `[GA4 MP] Purchase sent — order ${params.orderId}, value R$${params.value}` +
        (hasRealClientId ? ` (real client_id ✓)` : ` (fallback client_id — sem atribuição Google Ads)`)
      )
    }
  } catch (err) {
    console.error('[GA4 MP] Failed to send purchase:', err)
  }
}
