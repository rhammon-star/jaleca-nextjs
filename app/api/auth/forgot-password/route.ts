import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const wcAuth = () =>
  'Basic ' + Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')
const BREVO_API = 'https://api.brevo.com/v3'

export async function POST(request: NextRequest) {
  try {
    const { email, isNewCustomer } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) return NextResponse.json({ success: true })

    // Find WC customer
    const searchRes = await fetch(
      `${WC_API}/customers?email=${encodeURIComponent(email)}&role=all`,
      { headers: { Authorization: wcAuth() }, cache: 'no-store' }
    )
    const customers = searchRes.ok ? await searchRes.json() : []
    if (!Array.isArray(customers) || customers.length === 0) {
      // Don't reveal if email exists — return success silently
      return NextResponse.json({ success: true })
    }
    const customer = customers[0]

    // Generate token and store in WC meta
    const token = crypto.randomBytes(32).toString('hex')
    const expires = String(Date.now() + 72 * 60 * 60 * 1000) // 72h

    await fetch(`${WC_API}/customers/${customer.id}`, {
      method: 'PUT',
      headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meta_data: [
          { key: 'email_verify_token', value: token },
          { key: 'email_verify_expires', value: expires },
        ],
      }),
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaleca.com.br'
    const resetLink = `${siteUrl}/redefinir-senha?key=${token}&login=${encodeURIComponent(email)}`

    const subject = isNewCustomer
      ? 'Sua conta Jaleca foi criada — defina sua senha'
      : 'Redefinição de senha — Jaleca'
    const heading = isNewCustomer ? 'Bem-vinda à Jaleca!' : 'Redefinição de senha'
    const body = isNewCustomer
      ? 'Sua conta foi criada com sucesso. Clique no botão abaixo para definir sua senha e acessar seus pedidos. O link é válido por 72 horas.'
      : 'Clique no botão abaixo para criar uma nova senha. O link é válido por 72 horas.'
    const btnText = isNewCustomer ? 'DEFINIR MINHA SENHA' : 'REDEFINIR SENHA'

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;max-width:600px;width:100%;">
        <tr><td style="background:#ffffff;padding:28px 32px;text-align:center;border-bottom:1px solid #e5e5e5;">
          <img src="${siteUrl}/logo-cropped.jpg" alt="Jaleca" width="180" style="display:inline-block;height:auto;" />
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h2 style="font-size:26px;margin:0 0 16px;font-family:Georgia,serif;font-weight:400;">${heading}</h2>
          <p style="color:#666;margin:0 0 24px;font-size:15px;line-height:1.6;">${body}</p>
          <a href="${resetLink}"
             style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-family:Arial,sans-serif;margin-bottom:32px;">
            ${btnText}
          </a>
          <p style="font-size:12px;color:#aaa;margin:0;">Se você não solicitou isso, ignore este email.</p>
        </td></tr>
        <tr><td style="background:#f5f5f0;padding:16px 32px;text-align:center;font-size:12px;color:#888;">
          <p style="margin:0;">Jaleca — Jalecos e Mimos · Ipatinga, MG</p>
          <p style="margin:4px 0 0;">Dúvidas? <a href="mailto:contato@jaleca.com.br" style="color:#1a1a1a;">contato@jaleca.com.br</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const brevoRes = await fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: { name: 'Jaleca', email: 'contato@jaleca.com.br' },
        to: [{ email }],
        subject,
        htmlContent: html,
      }),
    })

    if (!brevoRes.ok) {
      const errText = await brevoRes.text()
      console.error('[ForgotPassword] Brevo error:', brevoRes.status, errText)
      return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
    }

    console.log(`[ForgotPassword] Email enviado para ${email}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ForgotPassword] Unexpected error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
