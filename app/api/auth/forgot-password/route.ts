import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    // WordPress is at wp.jaleca.com.br — not the Next.js frontend
    const wpUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
    const body = new URLSearchParams()
    body.append('user_login', email)
    body.append('redirect_to', '')
    body.append('wp-submit', 'Obter nova senha')

    await fetch(`${wpUrl}/wp-login.php?action=lostpassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      redirect: 'manual',
    })

    // Always return success to avoid email enumeration
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
