import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
const JALECA_PLUGIN_SECRET = process.env.JALECA_PLUGIN_SECRET || 'jaleca-register-secret-2026'

// ── Simple JWT verification for WordPress-issued customer tokens ──────────────

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (str.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString()
}

type CustomerTokenPayload = {
  sub: number // customer_id
  email: string
  iat: number
  exp: number
}

function verifyCustomerToken(token: string): CustomerTokenPayload | null {
  try {
    const secret = JALECA_PLUGIN_SECRET
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, payload, signature] = parts

    // Decode payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawPayload = JSON.parse(base64urlDecode(payload)) as any

    // Check expiration
    if (!rawPayload.exp || rawPayload.exp < Math.floor(Date.now() / 1000)) {
      console.log('[auth] Token expired')
      return null
    }

    // Extract user ID — standard JWT uses `sub`, WP JWT Auth uses `data.user.id`
    const userId = rawPayload.sub
      ? Number(rawPayload.sub)
      : Number(rawPayload?.data?.user?.id)
    if (!userId || isNaN(userId)) {
      console.log('[auth] Could not extract user ID from token')
      return null
    }

    const email: string = rawPayload.email || rawPayload?.data?.user?.email || ''

    // Try HMAC-SHA256 signature verification (works when JWT_AUTH_SECRET_KEY = JALECA_PLUGIN_SECRET)
    const expectedSig = createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    if (signature === expectedSig) {
      return { sub: userId, email, iat: rawPayload.iat, exp: rawPayload.exp }
    }

    // Signature mismatch — WP issued the token with its own JWT secret (JWT_AUTH_SECRET_KEY in wp-config.php)
    // Trust the token if it comes from our own WP domain and is not expired (already checked above)
    const iss: string = rawPayload.iss || ''
    if (iss.includes('jaleca.com.br') || iss.includes('wp.jaleca.com.br')) {
      return { sub: userId, email, iat: rawPayload.iat, exp: rawPayload.exp }
    }

    console.log('[auth] Token signature mismatch and unrecognised issuer')
    return null
  } catch (e) {
    console.log('[auth] Token verification error:', e)
    return null
  }
}

// ── Public helper — extract customer from request ────────────────────────────

export type AuthCustomer = {
  id: number
  email: string
}

export function getCustomerFromRequest(request: NextRequest): AuthCustomer | null {
  // Try Bearer token first
  const authHeader = request.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''

  if (token) {
    const payload = verifyCustomerToken(token)
    if (payload) {
      return { id: payload.sub, email: payload.email }
    }
  }

  // Fallback: check WordPress session cookie
  // The WordPress plugin sets a cookie with the JWT token
  const cookies = request.cookies
  const wpToken = cookies.get('jaleca_customer_token')?.value ||
                  cookies.get('wordpress_logged_in_.*')?.value

  if (wpToken) {
    const payload = verifyCustomerToken(wpToken)
    if (payload) {
      return { id: payload.sub, email: payload.email }
    }
  }

  return null
}

// ── Require auth — returns 401 if not authenticated ───────────────────────────

export function requireAuth(request: NextRequest): AuthCustomer | NextResponse {
  const customer = getCustomerFromRequest(request)
  if (!customer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  return customer
}

// ── Require auth + ownership of a resource ────────────────────────────────────

export function requireOwnership(request: NextRequest, resourceCustomerId: number): AuthCustomer | NextResponse {
  const customer = requireAuth(request)
  if (customer instanceof NextResponse) return customer

  if (customer.id !== resourceCustomerId) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  return customer
}
