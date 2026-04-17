/**
 * bling-auth.mjs
 * Faz o fluxo OAuth2 do Bling v3 e salva access_token + refresh_token no .env.local
 *
 * Uso: node scripts/bling-auth.mjs
 */

import http from 'http'
import https from 'https'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const CLIENT_ID     = process.env.BLING_CLIENT_ID
const CLIENT_SECRET = process.env.BLING_CLIENT_SECRET
const REDIRECT_URI  = 'http://localhost:9000/callback'
const ENV_FILE      = resolve(process.cwd(), '.env.local')

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌  BLING_CLIENT_ID e BLING_CLIENT_SECRET não encontrados no .env.local')
  process.exit(1)
}

// ── Trocar code por tokens ────────────────────────────────────────────────────
function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    const body = new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }).toString()

    const options = {
      hostname: 'www.bling.com.br',
      port: 443,
      path: '/Api/v3/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + credentials,
        'Accept':        'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }

    const req = https.request(options, res => {
      let raw = ''
      res.on('data', c => (raw += c))
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) } catch { resolve(raw) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ── Salvar tokens no .env.local ───────────────────────────────────────────────
function saveTokens(accessToken, refreshToken) {
  let env = readFileSync(ENV_FILE, 'utf8')
  env = env.replace(/^BLING_ACCESS_TOKEN=.*/m, '')
  env = env.replace(/^BLING_REFRESH_TOKEN=.*/m, '')
  env = env.replace(/\n{3,}/g, '\n\n').trimEnd()
  env += `\nBLING_ACCESS_TOKEN="${accessToken}"\n`
  env += `BLING_REFRESH_TOKEN="${refreshToken}"\n`
  writeFileSync(ENV_FILE, env)
  console.log('✅  Tokens salvos no .env.local')
}

// ── Servidor local para capturar o callback ───────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url    = new URL(req.url, 'http://localhost:9000')
  const code   = url.searchParams.get('code')
  const error  = url.searchParams.get('error')

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<h2>❌ Erro: ${error}</h2>`)
    server.close()
    return
  }

  if (!code) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  console.log('\n🔄  Código recebido, trocando por tokens...')

  const tokens = await exchangeCode(code)

  if (tokens.access_token) {
    saveTokens(tokens.access_token, tokens.refresh_token || '')
    console.log(`   Access token:  ${tokens.access_token.slice(0, 20)}...`)
    console.log(`   Refresh token: ${(tokens.refresh_token || '').slice(0, 20)}...`)
    console.log(`   Expira em:     ${tokens.expires_in}s`)

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h2>✅ Autenticado com sucesso! Pode fechar esta aba.</h2>')
  } else {
    console.error('❌  Erro ao trocar tokens:', JSON.stringify(tokens))
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`<h2>❌ Erro: ${JSON.stringify(tokens)}</h2>`)
  }

  server.close()
})

server.listen(9000, () => {
  const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&state=jaleca&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`

  console.log('\n🔐  Autenticação Bling OAuth2')
  console.log('─────────────────────────────────────────')
  console.log('Abra esta URL no navegador e autorize:\n')
  console.log(authUrl)
  console.log('\n─────────────────────────────────────────')
  console.log('Aguardando autorização em http://localhost:9000/callback...\n')
})
