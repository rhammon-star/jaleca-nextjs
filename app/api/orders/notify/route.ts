import { NextRequest, NextResponse } from 'next/server'
import {
  sendOrderUnderReview,
  sendOrderInvoiced,
  sendOrderPacking,
  sendOrderCancelled,
  sendOrderRefunded,
} from '@/lib/email'

const WEBHOOK_SECRET = process.env.JALECA_WEBHOOK_SECRET!

// Mapa de status WooCommerce → função de email
// Slugs confirmados nos prints do WP Admin (05/04/2026)
const STATUS_MAP: Record<string, 'under_review' | 'invoiced' | 'packing' | 'cancelled' | 'refunded'> = {
  // Padrão WooCommerce
  'on-hold':                    'under_review',  // Pagamento em análise
  'cancelled':                  'cancelled',     // Cancelado
  'refunded':                   'refunded',      // Reembolsado
  // Status customizados
  'wc-pagamento-analise':       'under_review',  // Pagamento em análise (custom)
  'pagamento-analise':          'under_review',
  'wc-faturado':                'invoiced',      // Faturado
  'faturado':                   'invoiced',
  'wc-em-separacao':            'packing',       // Em separação
  'em-separacao':               'packing',
  'wc-cancelado':               'cancelled',
  'wc-reembolsado':             'refunded',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      secret: string
      orderId: number
      newStatus: string
      customerEmail: string
      customerName: string
      orderTotal?: string
    }

    if (body.secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, newStatus, customerEmail, customerName, orderTotal } = body
    const action = STATUS_MAP[newStatus]

    if (!action) {
      return NextResponse.json({ ok: true, skipped: true, reason: `Status "${newStatus}" sem email mapeado` })
    }

    switch (action) {
      case 'under_review':
        await sendOrderUnderReview(orderId, customerName, customerEmail)
        break
      case 'invoiced':
        await sendOrderInvoiced(orderId, customerName, customerEmail)
        break
      case 'packing':
        await sendOrderPacking(orderId, customerName, customerEmail)
        break
      case 'cancelled':
        await sendOrderCancelled(orderId, customerName, customerEmail)
        break
      case 'refunded':
        await sendOrderRefunded(orderId, customerName, customerEmail, orderTotal ?? 'N/A')
        break
    }

    console.log(`[Orders Notify] Pedido #${orderId} status "${newStatus}" → email "${action}" enviado`)
    return NextResponse.json({ ok: true, action })
  } catch (err) {
    console.error('[Orders Notify] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
