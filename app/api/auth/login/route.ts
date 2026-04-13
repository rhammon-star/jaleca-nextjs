import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const PLUGIN_SECRET = process.env.JALECA_PLUGIN_SECRET || 'jaleca-register-secret-2026'

/** Returns true if the string is a valid 3-part JWT */
function isValidJwt(token: unknown): token is string {
  return typeof token === 'string' && token.split('.').length === 3
}

/** Decode the user ID from a WP JWT token payload (supports both `sub` and `data.user.id`) */
function extractUserIdFromToken(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (payload.length % 4)) % 4)
    const decoded = JSON.parse(Buffer.from(padded, 'base64').toString())
    const id = decoded?.data?.user?.id ?? decoded?.sub
    return id ? Number(id) : null
  } catch {
    return null
  }
}


/**
 * Create a JWT signed with JALECA_PLUGIN_SECRET.
 * auth.ts verifyCustomerToken() already validates this via HMAC-SHA256.
 */
function createJalecaJwt(userId: number, email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    email,
    iss: 'https://jaleca.com.br',
    iat: now,
    exp: now + 60 * 60 * 24 * 30, // 30 days
  })).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  const sig = createHmac('sha256', PLUGIN_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  return `${header}.${payload}.${sig}`
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

    // Extract user ID from plugin response or JWT payload
    const userId = data.user_id ? Number(data.user_id) : extractUserIdFromToken(data.token)

    if (!userId) {
      console.error('[login] Could not extract user_id:', JSON.stringify(data).slice(0, 200))
      return NextResponse.json({ error: 'Erro ao identificar usuário' }, { status: 500 })
    }

    const userEmail: string = data.user_email || email

    // Use token from jaleca/v1/login if it's already a valid JWT,
    // otherwise issue our own JWT signed with JALECA_PLUGIN_SECRET.
    // (jwt-auth/v1/token skipped — JWT_AUTH_SECRET_KEY not configured on WP)
    const token: string = isValidJwt(data.token)
      ? data.token
      : createJalecaJwt(userId, userEmail)

    const user = {
      id: userId,
      name: data.user_display_name || '',
      email: userEmail,
      token,
    }

    console.log(`[login] Success: userId=${userId}, email=${userEmail}`)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 401 })
  }
}
