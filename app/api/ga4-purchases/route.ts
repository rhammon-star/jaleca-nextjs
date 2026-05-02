import { NextResponse } from 'next/server'

const GA4_SA_JSON     = process.env.GA4_SERVICE_ACCOUNT_JSON!
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID!
const MEASUREMENT_ID  = process.env.NEXT_PUBLIC_GA4_ID

async function getToken(): Promise<string | null> {
  try {
    const sa = JSON.parse(GA4_SA_JSON)
    const now = Math.floor(Date.now() / 1000)
    const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })).toString('base64url')
    const { createSign } = await import('crypto')
    const sign = createSign('RSA-SHA256')
    sign.update(`${header}.${payload}`)
    const signature = sign.sign(sa.private_key, 'base64url')
    const jwt = `${header}.${payload}.${signature}`
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })
    const d = await res.json()
    return d.access_token ?? null
  } catch (e) { console.error('[GA4-CHECK] token error:', e); return null }
}

export async function GET() {
  if (!GA4_SA_JSON || !GA4_PROPERTY_ID) {
    return NextResponse.json({ error: 'GA4_SERVICE_ACCOUNT_JSON ou GA4_PROPERTY_ID não configurado' }, { status: 500 })
  }

  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Falha ao obter token GA4 — verifique GA4_SERVICE_ACCOUNT_JSON' }, { status: 500 })
  }

  const url     = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // Eventos de compra por dia — últimos 4 dias
  const [byDay, byEvent, rawPurchases] = await Promise.all([
    fetch(url, {
      method: 'POST', headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: '4daysAgo', endDate: 'today' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalRevenue' }],
        dimensions: [{ name: 'date' }, { name: 'eventName' }],
        dimensionFilter: {
          filter: { fieldName: 'eventName', stringFilter: { value: 'purchase', matchType: 'EXACT' } }
        },
        orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
        limit: 20,
      }),
    }).then(r => r.json()),

    // Todos os eventos (funil) — últimos 4 dias
    fetch(url, {
      method: 'POST', headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: '4daysAgo', endDate: 'today' }],
        metrics: [{ name: 'eventCount' }],
        dimensions: [{ name: 'eventName' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: { values: ['view_item', 'add_to_cart', 'begin_checkout', 'purchase', 'conversion_event_purchase'] }
          }
        },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 10,
      }),
    }).then(r => r.json()),

    // Receita + transações pelo relatório de e-commerce
    fetch(url, {
      method: 'POST', headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: '4daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'transactions' },
          { name: 'totalRevenue' },
          { name: 'ecommercePurchases' },
        ],
        limit: 1,
      }),
    }).then(r => r.json()),
  ])

  type Row = { dimensionValues: { value: string }[]; metricValues: { value: string }[] }

  const purchasesByDay = (byDay.rows ?? []).map((r: Row) => ({
    date:     r.dimensionValues[0].value,
    event:    r.dimensionValues[1].value,
    count:    +r.metricValues[0].value,
    revenue:  +parseFloat(r.metricValues[1].value).toFixed(2),
  }))

  const funnel = (byEvent.rows ?? []).map((r: Row) => ({
    event: r.dimensionValues[0].value,
    count: +r.metricValues[0].value,
  }))

  const ecom = rawPurchases.rows?.[0]
    ? {
        transactions:      +rawPurchases.rows[0].metricValues[0].value,
        totalRevenue:      +parseFloat(rawPurchases.rows[0].metricValues[1].value).toFixed(2),
        ecommercePurchases:+rawPurchases.rows[0].metricValues[2].value,
      }
    : null

  return NextResponse.json({
    measurement_id: MEASUREMENT_ID,
    property_id: GA4_PROPERTY_ID,
    period: 'últimos 4 dias (4daysAgo → today)',
    ecommerce: ecom,
    funnel,
    purchase_by_day: purchasesByDay,
    raw_ga4: byDay.rowCount === undefined ? { error: 'GA4 API retornou erro', detail: byDay } : undefined,
  })
}
