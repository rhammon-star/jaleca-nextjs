import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, isNewCustomer } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const apiKey = process.env.BREVO_API_KEY
    if (apiKey && apiKey !== 'PLACEHOLDER') {
      const resetUrl = `https://wp.jaleca.com.br/wp-login.php?action=lostpassword`
      const subject = isNewCustomer
        ? 'Sua conta Jaleca foi criada — defina sua senha'
        : 'Redefinição de senha — Jaleca'
      const heading = isNewCustomer
        ? 'Bem-vinda à Jaleca!'
        : 'Redefinição de senha'
      const body = isNewCustomer
        ? 'Sua conta foi criada com sucesso. Clique no botão abaixo para definir sua senha e acessar seus pedidos.'
        : 'Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.'
      const btnText = isNewCustomer ? 'DEFINIR MINHA SENHA' : 'REDEFINIR SENHA'

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;max-width:600px;width:100%;">
        <tr><td style="background:#1a1a1a;padding:24px 32px;text-align:center;">
          <span style="color:#ffffff;font-size:24px;letter-spacing:6px;font-family:Georgia,serif;font-weight:400;">JALECA</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <div style="text-align:center;margin-bottom:28px;">
            <img src="https://jaleca.com.br/logo-full.jpg" alt="Jaleca" style="max-width:260px;height:auto;" />
          </div>
          <h2 style="font-size:22px;margin:0 0 8px;font-family:Georgia,serif;">${heading}</h2>
          <p style="color:#666;margin:0 0 16px;font-size:15px;">${body}</p>
          <p style="color:#888;font-size:13px;margin:0 0 16px;">Se você não fez essa solicitação, ignore este e-mail.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 28px;text-decoration:none;font-size:13px;letter-spacing:2px;font-family:Arial,sans-serif;margin-top:8px;">${btnText}</a>
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

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'Jaleca', email: 'contato@jaleca.com.br' },
          to: [{ email }],
          subject,
          htmlContent: html,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
