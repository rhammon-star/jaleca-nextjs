import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/woocommerce'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Always require authentication
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const { id } = await params
    const orderId = Number(id)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const order = await getOrder(orderId)

    // SECURITY: Verify the order belongs to the authenticated user
    if (order.customer_id !== auth.id) {
      console.error(`[orders/${orderId}] IDOR attempt: auth.id=${auth.id} owns order but customer_id=${order.customer_id}`)
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pedido'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
