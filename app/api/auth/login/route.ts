import { NextRequest, NextResponse } from 'next/server'

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
    // WP JWT Auth plugin uses `data.user.id`; standard JWT uses `sub`
    const id = decoded?.data?.user?.id ?? decoded?.sub
    return id ? Number(id) : null
  } catch {
    return null
  }
}

/** Call WP JWT Auth directly to get a valid JWT token */
async function getJwtDirect(wpUrl: string, email: string, password: string): Promise<string | null> {
  try {
    const res = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return isValidJwt(data.token) ? data.token : null
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

    // Use the token from jaleca/v1/login if it's a valid JWT.
    // If not (jaleca-api.php returned user_id only or a non-JWT hash),
    // fall back to calling jwt-auth/v1/token directly with the same credentials.
    let token: string | null = isValidJwt(data.token) ? data.token : null

    if (!token) {
      console.log(`[login] jaleca/v1/login returned no valid JWT for user ${userId} — falling back to jwt-auth/v1/token`)
      token = await getJwtDirect(wpUrl, email, password)
    }

    if (!token) {
      console.error(`[login] Could not obtain JWT for user ${userId} via any method`)
      return NextResponse.json({ error: 'Erro ao autenticar. Tente novamente.' }, { status: 500 })
    }

    const user = {
      id: userId,
      name: data.user_display_name || '',
      email: data.user_email || email,
      token,
    }

    console.log(`[login] Success: userId=${userId}, email=${user.email}, jwtValid=true`)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 401 })
  }
}
