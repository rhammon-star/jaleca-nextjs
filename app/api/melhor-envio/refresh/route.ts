import { NextRequest, NextResponse } from 'next/server'

const VERCEL_PROJECT_ID = 'prj_ZnxbA82Ir1acVYfNVOBUir8IboKw'
const VERCEL_TEAM_ID    = 'team_JJo92IMcvI67jStq0UFvF4Ml'
const ME_BASE           = 'https://melhorenvio.com.br'

export async function GET(request: NextRequest) {
  // Proteção: só cron Vercel ou chamada com secret
  const cronHeader = request.headers.get('x-vercel-cron')
  const authHeader = request.headers.get('authorization')
  const secret     = process.env.REVALIDATE_SECRET

  if (!cronHeader && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const refreshToken = process.env.MELHOR_ENVIO_REFRESH_TOKEN
  const clientId     = process.env.MELHOR_ENVIO_CLIENT_ID
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET
  const vercelToken  = process.env.VERCEL_API_TOKEN

  if (!refreshToken || !clientId || !clientSecret) {
    return NextResponse.json({ error: 'Credenciais ME não configuradas' }, { status: 500 })
  }
  if (!vercelToken) {
    return NextResponse.json({ error: 'VERCEL_API_TOKEN não configurado' }, { status: 500 })
  }

  // 1. Obter novo access token usando o refresh token
  const tokenRes = await fetch(`${ME_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  })

  const tokenData = await tokenRes.json() as {
    access_token?: string
    refresh_token?: string
    expires_in?: number
    error?: string
  }

  if (!tokenData.access_token) {
    console.error('[ME Refresh] Falha ao renovar token:', tokenData)
    return NextResponse.json({ error: 'Falha ao renovar token', detail: tokenData }, { status: 500 })
  }

  // 2. Atualizar variável no Vercel via API
  async function updateVercelEnv(key: string, value: string) {
    const listRes = await fetch(
      `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
      { headers: { Authorization: `Bearer ${vercelToken}` } }
    )
    const listData = await listRes.json() as { envs?: Array<{ id: string; key: string }> }
    const existing = listData.envs?.find(e => e.key === key)

    if (existing) {
      await fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${existing.id}?teamId=${VERCEL_TEAM_ID}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, type: 'encrypted', target: ['production'] }),
        }
      )
    } else {
      await fetch(
        `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value, type: 'encrypted', target: ['production'] }),
        }
      )
    }
  }

  await updateVercelEnv('MELHOR_ENVIO_TOKEN', tokenData.access_token)
  if (tokenData.refresh_token) {
    await updateVercelEnv('MELHOR_ENVIO_REFRESH_TOKEN', tokenData.refresh_token)
  }

  console.log('[ME Refresh] Token Melhor Envio renovado com sucesso')
  return NextResponse.json({
    ok: true,
    message: 'Token Melhor Envio renovado com sucesso',
    expires_in: tokenData.expires_in,
  })
}
