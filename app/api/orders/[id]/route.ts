import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/woocommerce'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = Number(id)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const order = await getOrder(orderId)

    // If a customerId query param is provided, verify the order belongs to that customer
    const { searchParams } = new URL(request.url)
    const requestedCustomerId = searchParams.get('customerId')
    if (requestedCustomerId !== null) {
      const requestedId = Number(requestedCustomerId)
      if (isNaN(requestedId) || order.customer_id !== requestedId) {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pedido'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
