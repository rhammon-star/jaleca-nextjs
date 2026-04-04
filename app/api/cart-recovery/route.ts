import { NextRequest, NextResponse } from 'next/server'
import { saveAbandonedCart, type CartItem } from '@/lib/brevo-cart'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; cartItems?: CartItem[] }
    const { email, cartItems } = body

    if (!email || !cartItems?.length) {
      return NextResponse.json({ error: 'email e cartItems são obrigatórios' }, { status: 400 })
    }

    await saveAbandonedCart(email, cartItems)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
