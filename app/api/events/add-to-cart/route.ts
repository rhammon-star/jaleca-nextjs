import { NextRequest, NextResponse } from 'next/server'
import { sendMetaAddToCart } from '@/lib/meta-conversions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, value, quantity } = body

    if (!id || !name || !value) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? undefined
    const clientUserAgent = req.headers.get('user-agent') ?? undefined
    const fbc = req.cookies.get('_fbc')?.value
    const fbp = req.cookies.get('_fbp')?.value

    await sendMetaAddToCart(
      { clientIp, clientUserAgent, fbc, fbp },
      { id: String(id), name, value: parseFloat(value), quantity: quantity ?? 1 },
      req.headers.get('referer') ?? 'https://jaleca.com.br'
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
