/**
 * Loyalty points system for Jaleca.
 * 1 BRL spent = 1 point. 100 points = R$5 discount.
 *
 * Points are stored in WooCommerce customer meta_data (key: "jaleca_points").
 */

export { getPointsDiscount } from './loyalty-utils'
import { getPointsDiscount } from './loyalty-utils'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const auth = Buffer.from(
  `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
).toString('base64')

const META_KEY = 'jaleca_points'
const POINTS_PER_REAL = 1

async function getCustomerMeta(customerId: number | string): Promise<number> {
  try {
    const res = await fetch(`${WC_API}/customers/${customerId}`, {
      headers: { Authorization: `Basic ${auth}` },
      cache: 'no-store',
    })
    if (!res.ok) return 0
    const customer = await res.json()
    const meta = (customer.meta_data ?? []).find((m: { key: string; value: string }) => m.key === META_KEY)
    return meta ? parseInt(meta.value, 10) || 0 : 0
  } catch {
    return 0
  }
}

async function saveCustomerMeta(customerId: number | string, points: number): Promise<void> {
  await fetch(`${WC_API}/customers/${customerId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meta_data: [{ key: META_KEY, value: String(points) }],
    }),
  })
}

export async function getPoints(customerId: number | string): Promise<number> {
  return getCustomerMeta(customerId)
}

export async function addPoints(customerId: number | string, amount: number): Promise<number> {
  const current = await getCustomerMeta(customerId)
  const toAdd = Math.floor(amount * POINTS_PER_REAL)
  const newTotal = current + toAdd
  await saveCustomerMeta(customerId, newTotal)
  return newTotal
}

export async function redeemPoints(
  customerId: number | string,
  points: number
): Promise<{ ok: boolean; remaining: number; discount: number; error?: string }> {
  const current = await getCustomerMeta(customerId)

  if (points > current) {
    return { ok: false, remaining: current, discount: 0, error: 'Saldo insuficiente' }
  }

  const newTotal = current - points
  await saveCustomerMeta(customerId, newTotal)

  return { ok: true, remaining: newTotal, discount: getPointsDiscount(points) }
}
