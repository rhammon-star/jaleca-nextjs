import { NextResponse } from 'next/server'

function brazilDate(offsetDays = 0): string {
  const d = new Date()
  d.setHours(d.getHours() - 3)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}
function fmt(date: string) {
  const [y, m, da] = date.split('-')
  return `${da}/${m}/${y}`
}

async function fetchMetaAds() {
  const token     = process.env.META_ADS_TOKEN
  const accountId = process.env.META_ADS_ACCOUNT_ID
  if (!token || !accountId) return { error: 'META_ADS_TOKEN ou META_ADS_ACCOUNT_ID ausente' }

  const fields = 'spend,impressions,clicks,cpm,cpc,reach,actions'
  const base = `https://graph.facebook.com/v20.0/${accountId}/insights?fields=${fields}&access_token=${token}`
  const tr = (d: string) => `time_range=${encodeURIComponent(JSON.stringify({ since: d, until: d }))}`
  const d1 = brazilDate(-1)
  const d2 = brazilDate(-2)
  const d3 = brazilDate(-3)
  const d4 = brazilDate(-4)

  const [day, meta2, meta3, meta4] = await Promise.all([
    fetch(`${base}&date_preset=yesterday`).then(r => r.json()),
    fetch(`${base}&${tr(d2)}`).then(r => r.json()),
    fetch(`${base}&${tr(d3)}`).then(r => r.json()),
    fetch(`${base}&${tr(d4)}`).then(r => r.json()),
  ])

  type MetaRow = { spend?: string; impressions?: string; clicks?: string; cpm?: string; cpc?: string; reach?: string; actions?: { action_type: string; value: string }[] }
  function parse(d: { data?: MetaRow[]; error?: unknown }) {
    if (d.error) return { error: d.error }
    const row = d.data?.[0]
    if (!row) return null
    const purchases = row.actions?.find(a => a.action_type === 'purchase')?.value ?? '0'
    const linkClicks = row.actions?.find(a => a.action_type === 'link_click')?.value ?? '0'
    return {
      spend:       +parseFloat(row.spend ?? '0').toFixed(2),
      impressions: +(row.impressions ?? '0'),
      clicks:      +(row.clicks ?? '0'),
      linkClicks:  +linkClicks,
      cpm:         +parseFloat(row.cpm ?? '0').toFixed(2),
      cpc:         +parseFloat(row.cpc ?? '0').toFixed(2),
      reach:       +(row.reach ?? '0'),
      purchases:   +purchases,
    }
  }

  return {
    days: [
      { date: fmt(d1), ...parse(day) },
      { date: fmt(d2), ...parse(meta2) },
      { date: fmt(d3), ...parse(meta3) },
      { date: fmt(d4), ...parse(meta4) },
    ],
    total: {
      spend: +[day, meta2, meta3, meta4].reduce((s, d) => s + parseFloat(d.data?.[0]?.spend ?? '0'), 0).toFixed(2),
      purchases: +[day, meta2, meta3, meta4].reduce((s, d) => {
        const p = d.data?.[0]?.actions?.find((a: { action_type: string }) => a.action_type === 'purchase')?.value ?? '0'
        return s + +p
      }, 0).toFixed(0),
    }
  }
}

async function fetchGoogleAds() {
  const devToken      = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId    = process.env.GOOGLE_ADS_CUSTOMER_ID
  const loginCustomer = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  if (!devToken || !customerId) return { error: 'GOOGLE_ADS vars ausentes' }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        grant_type:    'refresh_token',
      }),
    })
    const tokenData = await tokenRes.json()
    const token = tokenData.access_token
    if (!token) return { error: 'Token Google Ads indisponível', detail: tokenData }

    const url = `https://googleads.googleapis.com/v20/customers/${customerId}/googleAds:search`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'developer-token': devToken,
      'Content-Type': 'application/json',
    }
    if (loginCustomer) headers['login-customer-id'] = loginCustomer

    const d1 = brazilDate(-1)
    const d2 = brazilDate(-2)
    const d3 = brazilDate(-3)
    const d4 = brazilDate(-4)

    async function query(startDate: string, endDate: string) {
      const gaql = `
        SELECT campaign.name, campaign.status,
          metrics.cost_micros, metrics.impressions, metrics.clicks,
          metrics.conversions, metrics.conversions_value
        FROM campaign
        WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC LIMIT 20`
      const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ query: gaql }) })
      return r.json()
    }

    type GAdsRow = { campaign?: { name: string }; metrics?: { costMicros?: string; impressions?: string; clicks?: string; conversions?: string; conversionsValue?: string } }
    function summarize(raw: { results?: GAdsRow[]; error?: unknown }) {
      if (raw.error) return { error: raw.error }
      const rows = raw.results ?? []
      if (!rows.length) return null
      let cost = 0, impressions = 0, clicks = 0, conversions = 0, convValue = 0
      const campaigns: { name: string; cost: number; clicks: number; conversions: number }[] = []
      for (const r of rows) {
        const m = r.metrics ?? {}
        const c = +(m.costMicros ?? '0') / 1_000_000
        cost        += c
        impressions += +(m.impressions ?? '0')
        clicks      += +(m.clicks ?? '0')
        conversions += +parseFloat(m.conversions ?? '0')
        convValue   += +parseFloat(m.conversionsValue ?? '0')
        if (r.campaign?.name) campaigns.push({ name: r.campaign.name, cost: +c.toFixed(2), clicks: +(m.clicks ?? '0'), conversions: +parseFloat(m.conversions ?? '0').toFixed(1) })
      }
      return { cost: +cost.toFixed(2), impressions, clicks, conversions: +conversions.toFixed(1), convValue: +convValue.toFixed(2), roas: cost ? +(convValue / cost).toFixed(2) : 0, campaigns }
    }

    const [dayRaw, d2Raw, d3Raw, d4Raw] = await Promise.all([
      query(d1, d1), query(d2, d2), query(d3, d3), query(d4, d4),
    ])

    return {
      days: [
        { date: fmt(d1), ...summarize(dayRaw) },
        { date: fmt(d2), ...summarize(d2Raw) },
        { date: fmt(d3), ...summarize(d3Raw) },
        { date: fmt(d4), ...summarize(d4Raw) },
      ],
    }
  } catch (e) { return { error: String(e) } }
}

export async function GET() {
  const [meta, gads] = await Promise.all([fetchMetaAds(), fetchGoogleAds()])
  return NextResponse.json({ meta, google_ads: gads })
}
