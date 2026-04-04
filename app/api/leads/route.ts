import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const wcAuth = () =>
  'Basic ' +
  Buffer.from(
    `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64')

const BREVO_API = 'https://api.brevo.com/v3'
const COUPON = 'PRIMEIRACOMPRA10'

async function customerExistsByEmail(email: string): Promise<number | null> {
  const res = await fetch(`${WC_API}/customers?email=${encodeURIComponent(email)}&role=all`, {
    headers: { Authorization: wcAuth() },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const list = await res.json()
  return Array.isArray(list) && list.length > 0 ? (list[0].id as number) : null
}

async function createWCCustomer(email: string): Promise<number> {
  const tempPassword = crypto.randomBytes(16).toString('hex')
  const res = await fetch(`${WC_API}/customers`, {
    method: 'POST',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      username: email,
      password: tempPassword,
      meta_data: [{ key: 'jaleca_lead_source', value: 'first-purchase-popup' }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `WC error ${res.status}`)
  }
  const customer = await res.json()
  return customer.id as number
}

async function sendWelcomeEmail(email: string, customerId: number): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return

  // Generate password reset token and save to WC customer meta
  const token = crypto.randomBytes(32).toString('hex')
  const expires = String(Date.now() + 72 * 60 * 60 * 1000) // 72h

  await fetch(`${WC_API}/customers/${customerId}`, {
    method: 'PUT',
    headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meta_data: [
        { key: 'email_verify_token', value: token },
        { key: 'email_verify_expires', value: expires },
        { key: 'email_verified', value: '0' },
      ],
    }),
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaleca.com.br'
  const accountLink = `${siteUrl}/minha-conta`

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>Bem-vinda à Jaleca!</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;max-width:600px;width:100%;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;text-align:center;">
          <span style="color:#ffffff;font-size:24px;letter-spacing:6px;font-family:Georgia,serif;font-weight:400;">JALECA</span>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          <h2 style="font-size:26px;margin:0 0 8px;font-family:Georgia,serif;font-weight:400;">Bem-vinda à Jaleca! 🎉</h2>
          <p style="color:#666;margin:0 0 8px;font-size:15px;line-height:1.6;">
            Sua conta foi criada com o email <strong>${email}</strong>.
          </p>
          <p style="color:#666;margin:0 0 24px;font-size:15px;line-height:1.6;">
            Para definir sua senha, clique no botão abaixo, acesse sua conta e clique em <strong>"Esqueci minha senha"</strong>.
          </p>

          <a href="${accountLink}"
             style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-family:Arial,sans-serif;margin-bottom:32px;">
            DEFINIR MINHA SENHA
          </a>

          <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;" />

          <p style="font-size:13px;color:#888;margin:0 0 8px;text-align:center;">Seu cupom exclusivo de boas-vindas:</p>
          <div style="background:#f5f5f0;border:1px dashed #c9a96e;padding:16px 24px;text-align:center;margin-bottom:12px;">
            <span style="font-size:24px;font-family:monospace;font-weight:bold;letter-spacing:4px;color:#1a1a1a;">${COUPON}</span>
          </div>
          <p style="font-size:13px;color:#666;margin:0 0 24px;text-align:center;">
            Use no checkout e ganhe <strong>10% de desconto</strong> na sua primeira compra.
          </p>

          <p style="font-size:12px;color:#aaa;margin:0;">
            Se você não se cadastrou na Jaleca, ignore este email.
          </p>
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

  await fetch(`${BREVO_API}/smtp/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender: { name: 'Jaleca', email: 'contato@jaleca.com.br' },
      to: [{ email }],
      subject: 'Bem-vinda à Jaleca! Seu cupom de 10% está aqui 🎉',
      htmlContent: html,
    }),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; source?: string }
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Check if already a WC customer
    const existingId = await customerExistsByEmail(email)
    if (existingId) {
      // Already registered — just return ok (don't spam)
      return NextResponse.json({ ok: true, existing: true })
    }

    // Create WC customer + send welcome email
    const customerId = await createWCCustomer(email)
    await sendWelcomeEmail(email, customerId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao cadastrar'
    console.error('[Leads] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
