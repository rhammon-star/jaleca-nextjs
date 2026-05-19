/**
 * 17track API client — registra códigos de rastreio para receber updates via webhook.
 * Docs: https://api.17track.net/en/doc?version=v2.4
 */

const API_BASE = 'https://api.17track.net/track/v2.2'

// 17track carrier codes — https://res.17track.net/asset/carrier/info/apicarrier.all.json
const CARRIER_CODES = {
  correios: 2151,
  jadlog: 190,
} as const

export function inferCarrierCode(carrierName: string): number | null {
  const c = carrierName.toLowerCase()
  if (c.includes('correios') || c.includes('pac') || c.includes('sedex')) return CARRIER_CODES.correios
  if (c.includes('jadlog')) return CARRIER_CODES.jadlog
  return null
}

type RegisterResult = {
  accepted: Array<{ number: string; carrier: number }>
  rejected: Array<{ number: string; error: { code: number; message: string } }>
}

export async function register17track(items: Array<{ trackingCode: string; carrierName: string }>): Promise<RegisterResult | null> {
  const token = process.env.TRACK17_API_KEY
  if (!token || items.length === 0) return null

  const payload = items
    .map(i => ({ number: i.trackingCode, carrier: inferCarrierCode(i.carrierName) }))
    .filter(p => p.carrier !== null)

  if (payload.length === 0) return null

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        '17token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error('[17track register] HTTP', res.status)
      return null
    }
    const data = await res.json() as { code: number; data: RegisterResult }
    if (data.code !== 0) {
      console.error('[17track register] API code', data.code)
    }
    return data.data ?? null
  } catch (err) {
    console.error('[17track register] error:', err)
    return null
  }
}
