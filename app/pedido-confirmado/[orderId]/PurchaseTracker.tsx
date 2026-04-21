'use client'

import { useEffect } from 'react'
import { trackPurchase } from '@/components/Analytics'

type LineItem = {
  id: number
  name: string
  quantity: number
  total: string
  product_id?: number
}

type OrderData = {
  id: number | string
  number?: string
  total?: string
  line_items?: LineItem[]
  billing?: { email?: string; phone?: string }
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PurchaseTracker({ order, orderId }: { order: OrderData | null; orderId: string }) {
  useEffect(() => {
    if (!order) return
    const value = order.total ? parseFloat(order.total) : 0
    const items = (order.line_items ?? []).map(item => ({
      id: String(item.product_id ?? item.id),
      name: item.name,
      price: parseFloat(item.total) / item.quantity,
      quantity: item.quantity,
    }))
    trackPurchase(order.number || orderId, value, items)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uetq: any[] = (window as any).uetq || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).uetq = uetq

    // Microsoft Ads UET — Purchase event
    uetq.push('event', 'Purchase', { revenue_value: value, currency: 'BRL' })

    // Microsoft Ads — Enhanced Conversions (hashed email/phone)
    const email = order.billing?.email?.trim().toLowerCase()
    const phone = order.billing?.phone?.trim()
    if (email) {
      sha256(email).then(hashedEmail => {
        const pid: Record<string, string> = { em: hashedEmail }
        if (phone) pid.ph = phone
        uetq.push('set', { pid })
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
