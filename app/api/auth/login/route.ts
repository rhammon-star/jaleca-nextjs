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

    const wpUrl = process.env.NEXT_PUBLIC_WC_URL || 'https://jaleca.com.br'
    const res = await fetch(`${wpUrl}/wp-json/jaleca/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })

    const data = await res.json()
    console.log('[Login] WP response status:', res.status, 'data:', JSON.stringify(data))

    if (!res.ok || data.error) {
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
