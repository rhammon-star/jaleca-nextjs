import { NextResponse } from 'next/server'

// ENDPOINT DE DIAGNÓSTICO — remover após resolver o bug de cadastro
export async function GET() {
  const WC_API = process.env.WOOCOMMERCE_API_URL
  const CK = process.env.WOOCOMMERCE_CONSUMER_KEY
  const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET

  const checks: Record<string, unknown> = {
    WOOCOMMERCE_API_URL: WC_API ? `${WC_API.slice(0, 30)}...` : 'NÃO DEFINIDO',
    WOOCOMMERCE_CONSUMER_KEY: CK ? `${CK.slice(0, 8)}...` : 'NÃO DEFINIDO',
    WOOCOMMERCE_CONSUMER_SECRET: CS ? `${CS.slice(0, 8)}...` : 'NÃO DEFINIDO',
  }

  if (!WC_API || !CK || !CS) {
    return NextResponse.json({ error: 'Variáveis de ambiente faltando', checks })
  }

  const auth = Buffer.from(`${CK}:${CS}`).toString('base64')

  // Testa leitura de clientes (GET)
  const getRes = await fetch(`${WC_API}/customers?per_page=1`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  })
  const getStatus = getRes.status
  const getBody = await getRes.json().catch(() => null)

  // Testa criação de cliente (POST) com email aleatório
  const testEmail = `debug-test-${Date.now()}@jaleca-test.com`
  const postRes = await fetch(`${WC_API}/customers`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      first_name: 'Teste',
      last_name: 'Debug',
      password: 'Teste@123',
      username: testEmail,
    }),
  })
  const postStatus = postRes.status
  const postBody = await postRes.json().catch(() => null)

  // Limpa o cliente de teste se criou com sucesso
  if (postRes.ok && postBody?.id) {
    await fetch(`${WC_API}/customers/${postBody.id}?force=true`, {
      method: 'DELETE',
      headers: { Authorization: `Basic ${auth}` },
    }).catch(() => {})
  }

  return NextResponse.json({
    checks,
    get_customers: { status: getStatus, ok: getRes.ok, sample: getBody?.[0]?.id ?? getBody },
    post_customer: { status: postStatus, ok: postRes.ok, body: postBody },
  })
}
