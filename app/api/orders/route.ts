import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrders } from '@/lib/woocommerce'
import type { WCOrderData } from '@/lib/woocommerce'
import { sendOrderConfirmation } from '@/lib/email'
import { addPoints } from '@/lib/loyalty'

// ── Stock verification helpers ────────────────────────────────────────────────

const WC_API_URL = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuthHeader(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type WCStockProduct = {
  id: number
  name: string
  stock_status: string
  stock_quantity: number | null
  manage_stock: boolean
}

async function fetchProductStock(productId: number): Promise<WCStockProduct> {
  const res = await fetch(`${WC_API_URL}/products/${productId}`, {
    headers: { Authorization: wcAuthHeader(), 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Erro ao verificar estoque do produto ${productId}`)
  return res.json()
}

async function fetchVariationStock(productId: number, variationId: number): Promise<WCStockProduct> {
  const res = await fetch(`${WC_API_URL}/products/${productId}/variations/${variationId}`, {
    headers: { Authorization: wcAuthHeader(), 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Erro ao verificar estoque da variação ${variationId}`)
  return res.json()
}

async function verifyLineItemStock(
  item: { product_id: number; variation_id?: number; quantity: number }
): Promise<{ ok: boolean; message?: string }> {
  const stock = item.variation_id
    ? await fetchVariationStock(item.product_id, item.variation_id)
    : await fetchProductStock(item.product_id)

  // If stock is not managed, assume unlimited — never block
  if (!stock.manage_stock) {
    if (stock.stock_status !== 'instock') {
      return { ok: false, message: `O produto '${stock.name}' está sem estoque` }
    }
    return { ok: true }
  }

  // manage_stock is true: check status and quantity
  if (stock.stock_status !== 'instock') {
    return { ok: false, message: `O produto '${stock.name}' está sem estoque` }
  }
  if (stock.stock_quantity !== null && stock.stock_quantity < item.quantity) {
    return {
      ok: false,
      message: `O produto '${stock.name}' não tem estoque suficiente (disponível: ${stock.stock_quantity})`,
    }
  }
  return { ok: true }
}

// Pagar.me payment method IDs
const PAGARME_METHODS = {
  pix: 'woo-pagarme-payments-pix',
  boleto: 'woo-pagarme-payments-billet',
  credit_card: 'woo-pagarme-payments-credit_card',
} as const

const PAGARME_TITLES = {
  'woo-pagarme-payments-pix': 'PIX',
  'woo-pagarme-payments-billet': 'Boleto Bancário',
  'woo-pagarme-payments-credit_card': 'Cartão de Crédito',
} as const

export async function GET(request: NextRequest) {
  try {
    // Require a non-empty Bearer token
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    if (!customerId) {
      return NextResponse.json({ error: 'customerId é obrigatório' }, { status: 400 })
    }

    // Validate the JWT token against WordPress
    const wcUrl = process.env.NEXT_PUBLIC_WC_URL || 'https://jaleca.com.br'
    const validateRes = await fetch(`${wcUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!validateRes.ok) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
    }

    const orders = await getOrders(Number(customerId))
    return NextResponse.json(orders)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pedidos'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WCOrderData = await request.json()

    if (!body.billing || !body.line_items?.length) {
      return NextResponse.json({ error: 'Dados de faturamento e itens são obrigatórios' }, { status: 400 })
    }

    // Normalize payment method to Pagar.me IDs
    const pmKey = body.payment_method as string
    const validPagarme = Object.values(PAGARME_METHODS) as string[]

    if (!validPagarme.includes(pmKey)) {
      // Try to map legacy method IDs to Pagar.me
      const legacyMap: Record<string, string> = {
        pix: PAGARME_METHODS.pix,
        bacs: PAGARME_METHODS.boleto,
        boleto: PAGARME_METHODS.boleto,
        credit_card: PAGARME_METHODS.credit_card,
      }
      if (legacyMap[pmKey]) {
        body.payment_method = legacyMap[pmKey]
        body.payment_method_title =
          PAGARME_TITLES[legacyMap[pmKey] as keyof typeof PAGARME_TITLES] ??
          body.payment_method_title
      }
    }

    // Verify stock for every line item before creating the order
    for (const item of body.line_items) {
      const stockCheck = await verifyLineItemStock(item)
      if (!stockCheck.ok) {
        return NextResponse.json({ error: stockCheck.message }, { status: 409 })
      }
    }

    const order = await createOrder(body)

    // Send confirmation email (fire-and-forget)
    const customerEmail = body.billing?.email
    if (customerEmail) {
      sendOrderConfirmation(order, customerEmail).catch(err =>
        console.error('[Orders] Failed to send confirmation email:', err)
      )
    }

    // Award loyalty points: 1 point per R$1 spent (fire-and-forget)
    if (body.customer_id && order.total) {
      addPoints(body.customer_id, parseFloat(order.total)).catch(err =>
        console.error('[Orders] Failed to award loyalty points:', err)
      )
    }

    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber: order.number,
        orderKey: order.order_key,
        total: order.total,
        status: order.status,
        paymentMethod: order.status,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar pedido'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
