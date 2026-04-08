import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return new NextResponse(
      `<h2>Erro na autorização</h2><p>${error ?? 'Código não recebido'}</p>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 })
  }

  const isSandbox = process.env.MELHOR_ENVIO_SANDBOX === 'true'
  const baseUrl = isSandbox
    ? 'https://sandbox.melhorenvio.com.br'
    : 'https://melhorenvio.com.br'

  const redirectUri = 'https://jaleca.com.br/api/melhor-envio/callback'

  try {
    const res = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    })

    const data = await res.json() as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      error?: string
    }

    if (!data.access_token) {
      return new NextResponse(
        `<h2>Erro ao obter token</h2><pre>${JSON.stringify(data, null, 2)}</pre>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Melhor Envio — Token Obtido</title>
<style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:20px}
.token{background:#f0f9ff;border:2px solid #0ea5e9;padding:16px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px}
.steps{background:#f0fdf4;border:2px solid #22c55e;padding:16px;border-radius:8px;margin-top:20px}
</style></head>
<body>
<h2>✅ Token obtido com sucesso!</h2>
<p><strong>ACCESS TOKEN — copie e adicione na Vercel como <code>MELHOR_ENVIO_TOKEN</code>:</strong></p>
<div class="token">${data.access_token}</div>
${data.refresh_token ? `<p style="margin-top:16px"><strong>REFRESH TOKEN (guarde em local seguro):</strong></p><div class="token">${data.refresh_token}</div>` : ''}
<div class="steps">
<strong>Próximos passos:</strong>
<ol>
<li>Copie o ACCESS TOKEN acima</li>
<li>Acesse <a href="https://vercel.com" target="_blank">vercel.com</a> → projeto Jaleca → Settings → Environment Variables</li>
<li>Adicione: <code>MELHOR_ENVIO_TOKEN</code> = o token copiado</li>
<li>Se for sandbox: adicione também <code>MELHOR_ENVIO_SANDBOX</code> = <code>true</code></li>
<li>Redeploy</li>
</ol>
</div>
</body></html>`

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    return new NextResponse(
      `<h2>Erro</h2><pre>${String(err)}</pre>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}
