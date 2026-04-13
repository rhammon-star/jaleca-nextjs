import { NextRequest, NextResponse } from 'next/server'

/** Decode the user ID from a WP JWT token payload (supports both `sub` and `data.user.id`) */
function extractUserIdFromToken(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (payload.length % 4)) % 4)
    const decoded = JSON.parse(Buffer.from(padded, 'base64').toString())
    // WP JWT Auth plugin uses `data.user.id`; standard JWT uses `sub`
    const id = decoded?.data?.user?.id ?? decoded?.sub
    return id ? Number(id) : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const wpUrl = process.env.NEXT_PUBLIC_WC_URL || 'https://wp.jaleca.com.br'
    const res = await fetch(`${wpUrl}/wp-json/jaleca/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
    }

    // user_id may come directly in the response body, or must be decoded from the JWT payload
    const userId = data.user_id ? Number(data.user_id) : extractUserIdFromToken(data.token)

    if (!userId) {
      console.error('[login] Could not extract user_id from login response:', JSON.stringify(data).slice(0, 200))
      return NextResponse.json({ error: 'Erro ao identificar usuário' }, { status: 500 })
    }

    const user = {
      id: userId,
      name: data.user_display_name || '',
      email: data.user_email || email,
      token: data.token,
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 401 })
  }
}
