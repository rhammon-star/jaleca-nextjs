import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const key = process.env.WOOCOMMERCE_CONSUMER_KEY!
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!

export async function POST(request: NextRequest) {
  try {
    const { login, resetKey, password } = await request.json()

    if (!login || !resetKey || !password) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const res = await fetch(
      `${WC_API}/jaleca-reset-password?consumer_key=${key}&consumer_secret=${secret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, key: resetKey, password }),
      }
    )

    const data = await res.json()
    if (!res.ok || data.error) {
      return NextResponse.json({ error: data.error || 'Link inválido ou expirado' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}
