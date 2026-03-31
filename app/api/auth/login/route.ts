import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const key = process.env.WOOCOMMERCE_CONSUMER_KEY!
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const res = await fetch(
      `${WC_API}/jaleca-login?consumer_key=${key}&consumer_secret=${secret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      }
    )

    const data = await res.json()

    if (!res.ok || data.code === 'invalid_credentials' || data.error) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
    }

    const user = {
      id: data.user_id ?? null,
      name: data.user_display_name || '',
      email: data.user_email || email,
      token: data.token,
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 401 })
  }
}
