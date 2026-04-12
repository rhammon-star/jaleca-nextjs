import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/woocommerce'

// ── Simple in-memory rate limiter ────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 20 // max 20 requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ───────────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
               || request.headers.get('x-real-ip')
               || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Código do cupom é obrigatório' }, { status: 400 })
    }

    const coupon = await validateCoupon(code.trim().toLowerCase())

    // Check if expired
    if (coupon.date_expires) {
      const expires = new Date(coupon.date_expires)
      if (expires < new Date()) {
        return NextResponse.json({ valid: false, error: 'Cupom expirado' }, { status: 400 })
      }
    }

    // Check usage limit
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, error: 'Cupom esgotado' }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      amount: coupon.amount,
      minimum_amount: coupon.minimum_amount,
      maximum_amount: coupon.maximum_amount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cupom inválido'
    return NextResponse.json({ valid: false, error: message }, { status: 400 })
  }
}
