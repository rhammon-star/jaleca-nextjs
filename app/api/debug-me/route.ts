import { NextResponse } from 'next/server'

// Endpoint temporário de diagnóstico — remove após confirmar
// Uso: GET /api/debug-me?cep=01310100
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cep = (searchParams.get('cep') || '01310100').replace(/\D/g, '')

  const token = process.env.MELHOR_ENVIO_TOKEN
  if (!token || token === 'PLACEHOLDER') {
    return NextResponse.json({ error: 'MELHOR_ENVIO_TOKEN não configurado' }, { status: 500 })
  }

  const API_BASE = process.env.MELHOR_ENVIO_SANDBOX === 'true'
    ? 'https://sandbox.melhorenvio.com.br/api/v2'
    : 'https://melhorenvio.com.br/api/v2'

  const body = {
    from: { postal_code: '35160294' },
    to: { postal_code: cep },
    products: [{ id: 'jaleco', height: 31, width: 4, length: 41, weight: 0.6, quantity: 1, insurance_value: 0 }],
    // sem filtro de services = retorna TODOS os disponíveis na conta
    options: { insurance_value: 0, receipt: false, own_hand: false, collect: false },
  }

  try {
    const res = await fetch(`${API_BASE}/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'JalecaApp/1.0 (contato@jaleca.com.br)',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const raw = await res.json()
    return NextResponse.json({ status: res.status, cep, body_sent: body, response: raw })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
