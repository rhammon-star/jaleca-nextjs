/**
 * Meta Conversions API (server-side)
 * Sends events directly from the server to Meta, complementing the browser Pixel.
 * User data is hashed with SHA-256 as required by Meta.
 */

import crypto from 'crypto'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN
const API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`

function hash(value: string): string {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return crypto.createHash('sha256').update(digits).digest('hex')
}

export type MetaUserData = {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  clientIp?: string
  clientUserAgent?: string
  fbc?: string  // _fbc cookie from browser
  fbp?: string  // _fbp cookie from browser
}

export type MetaPurchaseData = {
  orderId: string
  value: number
  currency?: string
  items?: Array<{ id: string; quantity: number }>
}

function buildUserData(u: MetaUserData): Record<string, unknown> {
  const d: Record<string, unknown> = {}
  if (u.email) d.em = hash(u.email)
  if (u.phone) d.ph = hashPhone(u.phone)
  if (u.firstName) d.fn = hash(u.firstName)
  if (u.lastName) d.ln = hash(u.lastName)
  if (u.city) d.ct = hash(u.city)
  if (u.state) d.st = hash(u.state.toLowerCase())
  if (u.zip) d.zp = hash(u.zip.replace(/\D/g, ''))
  if (u.country) d.country = hash(u.country.toLowerCase())
  if (u.clientIp) d.client_ip_address = u.clientIp
  if (u.clientUserAgent) d.client_user_agent = u.clientUserAgent
  if (u.fbc) d.fbc = u.fbc
  if (u.fbp) d.fbp = u.fbp
  return d
}

async function sendEvent(events: object[]) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return

  try {
    const res = await fetch(`${API_URL}?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: events }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[Meta CAPI] Error:', res.status, text)
    }
  } catch (err) {
    console.error('[Meta CAPI] Failed to send event:', err)
  }
}

/**
 * Purchase event — call when order payment is confirmed.
 * Uses event_id for deduplication with the browser Pixel (same orderId).
 */
export async function sendMetaPurchase(
  userData: MetaUserData,
  purchase: MetaPurchaseData,
  sourceUrl = 'https://jaleca.com.br/pagamento'
) {
  await sendEvent([
    {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `purchase_${purchase.orderId}`,
      event_source_url: sourceUrl,
      action_source: 'website',
      user_data: buildUserData(userData),
      custom_data: {
        value: purchase.value,
        currency: purchase.currency || 'BRL',
        order_id: purchase.orderId,
        contents: purchase.items?.map(i => ({ id: String(i.id), quantity: i.quantity })),
        content_type: 'product',
      },
    },
  ])
}

/**
 * InitiateCheckout event — call when customer reaches checkout.
 */
export async function sendMetaInitiateCheckout(
  userData: MetaUserData,
  value: number,
  sourceUrl = 'https://jaleca.com.br/checkout'
) {
  await sendEvent([
    {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `checkout_${Date.now()}`,
      event_source_url: sourceUrl,
      action_source: 'website',
      user_data: buildUserData(userData),
      custom_data: { value, currency: 'BRL' },
    },
  ])
}
