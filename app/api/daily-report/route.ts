import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300 // 5 min — Vercel Pro

const CRON_SECRET      = process.env.CRON_SECRET!
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY!
const OPENAI_API_KEY   = process.env.OPENAI_API_KEY!
const BREVO_API_KEY    = process.env.BREVO_API_KEY!
const PAGARME_SECRET   = process.env.PAGARME_SECRET_KEY!
const WC_API_URL       = process.env.WOOCOMMERCE_API_URL!
const WC_CK            = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS            = process.env.WOOCOMMERCE_CONSUMER_SECRET!
const WP_USER          = process.env.WP_ADMIN_USER!
const WP_PASS          = process.env.WP_ADMIN_APP_PASSWORD!
const GSC_CLIENT_ID    = process.env.GSC_CLIENT_ID!
const GSC_CLIENT_SECRET= process.env.GSC_CLIENT_SECRET!
const GSC_REFRESH_TOKEN= process.env.GSC_REFRESH_TOKEN!
const GSC_PROPERTY     = 'sc-domain:jaleca.com.br'
const GA4_SA_JSON      = process.env.GA4_SERVICE_ACCOUNT_JSON!
const GA4_PROPERTY_ID  = process.env.GA4_PROPERTY_ID!

const RECIPIENTS = [
  { email: 'rhammon@objetivasolucao.com.br', name: 'Rhammon' },
  { email: 'contato@jaleca.com.br',          name: 'Jaleca' },
]

// ── Auth helpers ──────────────────────────────────────────────────────────────

function wcAuth() {
  return 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')
}

function pagarmeAuth() {
  return 'Basic ' + Buffer.from(`${PAGARME_SECRET}:`).toString('base64')
}

async function getGscToken(): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     GSC_CLIENT_ID,
        client_secret: GSC_CLIENT_SECRET,
        refresh_token: GSC_REFRESH_TOKEN,
        grant_type:    'refresh_token',
      }),
    })
    const data = await res.json()
    return data.access_token ?? null
  } catch { return null }
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function brazilDate(offsetDays = 0): string {
  const d = new Date()
  d.setHours(d.getHours() - 3) // BRT = UTC-3
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function fmt(date: string) {
  const [y, m, da] = date.split('-')
  return `${da}/${m}/${y}`
}

// ── GSC ───────────────────────────────────────────────────────────────────────

async function fetchGsc(token: string) {
  const today   = brazilDate(0)
  const d1Start = brazilDate(-1)
  const d2Start = brazilDate(-2)
  const d3Start = brazilDate(-3)
  const d4Start = brazilDate(-4)
  const d1End   = d1Start
  const w7End   = d1Start
  const w7Start = brazilDate(-7)
  const w7PEnd  = brazilDate(-8)
  const w7PStart= brazilDate(-14)

  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_PROPERTY)}/searchAnalytics/query`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function query(startDate: string, endDate: string, dimensions: string[], rowLimit = 15) {
    const r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
    })
    return r.json()
  }

  const [dayData, weekData, prevWeekData, topQueries, topPages, lowCtrRaw, d2Data, d3Data, d4Data] = await Promise.all([
    query(d1Start, d1End, ['date'], 1),
    query(w7Start, w7End, ['date'], 7),
    query(w7PStart, w7PEnd, ['date'], 7),
    query(w7Start, w7End, ['query'], 15),
    query(w7Start, w7End, ['page'], 10),
    query(w7Start, w7End, ['query'], 50),
    query(d2Start, d2Start, ['date'], 1),
    query(d3Start, d3Start, ['date'], 1),
    query(d4Start, d4Start, ['date'], 1),
  ])

  function sumRows(data: {rows?: {clicks:number;impressions:number;ctr:number;position:number}[]}) {
    const rows = data.rows ?? []
    if (!rows.length) return { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    const clicks      = rows.reduce((s, r) => s + r.clicks, 0)
    const impressions = rows.reduce((s, r) => s + r.impressions, 0)
    return {
      clicks,
      impressions,
      ctr:      impressions ? +((clicks / impressions) * 100).toFixed(2) : 0,
      position: +(rows.reduce((s, r) => s + r.position, 0) / rows.length).toFixed(1),
    }
  }

  const day  = sumRows(dayData)
  const week = sumRows(weekData)
  const prev = sumRows(prevWeekData)

  const opportunities = ((lowCtrRaw.rows ?? []) as {keys:string[];impressions:number;clicks:number;ctr:number;position:number}[])
    .filter(r => r.impressions > 80 && r.ctr < 0.03)
    .slice(0, 6)
    .map(r => ({ query: r.keys[0], impressions: r.impressions, clicks: r.clicks, ctr: +(r.ctr*100).toFixed(2), position: +r.position.toFixed(1) }))

  const d2 = sumRows(d2Data)
  const d3 = sumRows(d3Data)
  const d4 = sumRows(d4Data)

  return {
    dayDate:   fmt(d1Start),
    weekRange: `${fmt(w7Start)} a ${fmt(w7End)}`,
    day,
    week,
    prev,
    delta: {
      clicks:      week.clicks - prev.clicks,
      impressions: week.impressions - prev.impressions,
      ctr:         +(week.ctr - prev.ctr).toFixed(2),
      position:    +(week.position - prev.position).toFixed(1),
    },
    topQueries: ((topQueries.rows ?? []) as {keys:string[];clicks:number;impressions:number;ctr:number;position:number}[]).slice(0,10).map(r => ({
      query: r.keys[0], clicks: r.clicks, impressions: r.impressions,
      ctr: +(r.ctr*100).toFixed(2), position: +r.position.toFixed(1),
    })),
    topPages: ((topPages.rows ?? []) as {keys:string[];clicks:number;impressions:number;ctr:number;position:number}[]).slice(0,8).map(r => ({
      page: r.keys[0].replace('https://jaleca.com.br', '') || '/',
      clicks: r.clicks, impressions: r.impressions,
      ctr: +(r.ctr*100).toFixed(2), position: +r.position.toFixed(1),
    })),
    opportunities,
    days: [
      { date: fmt(d1Start), clicks: day.clicks },
      { date: fmt(d2Start), clicks: d2.clicks  },
      { date: fmt(d3Start), clicks: d3.clicks  },
      { date: fmt(d4Start), clicks: d4.clicks  },
    ],
  }
}

// ── Pagar.me ──────────────────────────────────────────────────────────────────

async function fetchPagarme() {
  const today     = brazilDate(0)
  const yesterday = brazilDate(-1)
  const d2        = brazilDate(-2)
  const d3        = brazilDate(-3)
  const d4        = brazilDate(-4)
  const weekStart = brazilDate(-7)

  async function getOrders(since: string, until: string) {
    const r = await fetch(
      `https://api.pagar.me/core/v5/orders?created_since=${since}T03:00:00Z&created_until=${until}T02:59:59Z&size=200`,
      { headers: { Authorization: pagarmeAuth() } }
    )
    const d = await r.json()
    return (d.data ?? []) as {status:string;charges:{status:string;amount:number;payment_method:string}[];created_at:string}[]
  }

  const [dayOrders, weekOrders, d2Orders, d3Orders, d4Orders] = await Promise.all([
    getOrders(yesterday, today),
    getOrders(weekStart, today),
    getOrders(d2, yesterday),
    getOrders(d3, d2),
    getOrders(d4, d3),
  ])

  function summarize(orders: typeof dayOrders) {
    const paid    = orders.filter(o => o.status === 'paid')
    const failed  = orders.filter(o => ['failed','canceled'].includes(o.status))
    const pending = orders.filter(o => ['pending','waiting_payment'].includes(o.status))
    const revenue = paid.reduce((s,o) => s + o.charges.filter(c=>c.status==='paid').reduce((x,c)=>x+c.amount,0), 0) / 100
    const lost    = failed.reduce((s,o) => s + o.charges.reduce((x,c)=>x+c.amount,0), 0) / 100
    const methods: Record<string,number> = {}
    for (const o of orders) for (const c of o.charges) methods[c.payment_method] = (methods[c.payment_method]??0)+1
    return { total: orders.length, paid: paid.length, failed: failed.length, pending: pending.length,
      revenue: +revenue.toFixed(2), lost: +lost.toFixed(2),
      convRate: orders.length ? +((paid.length/orders.length)*100).toFixed(1) : 0,
      methods }
  }

  const [daySum, weekSum, d2Sum, d3Sum, d4Sum] = [
    summarize(dayOrders), summarize(weekOrders),
    summarize(d2Orders), summarize(d3Orders), summarize(d4Orders),
  ]
  return {
    day: daySum,
    week: weekSum,
    dayDate: fmt(yesterday),
    days: [
      { date: fmt(yesterday), revenue: daySum.revenue, paid: daySum.paid, total: daySum.total },
      { date: fmt(d2),        revenue: d2Sum.revenue,  paid: d2Sum.paid,  total: d2Sum.total  },
      { date: fmt(d3),        revenue: d3Sum.revenue,  paid: d3Sum.paid,  total: d3Sum.total  },
      { date: fmt(d4),        revenue: d4Sum.revenue,  paid: d4Sum.paid,  total: d4Sum.total  },
    ],
  }
}

// ── WooCommerce ───────────────────────────────────────────────────────────────

async function fetchWc() {
  const today     = brazilDate(0)
  const yesterday = brazilDate(-1)
  const weekStart = brazilDate(-7)

  async function getOrders(after: string, before: string) {
    const r = await fetch(
      `${WC_API_URL}/orders?after=${after}T00:00:00&before=${before}T23:59:59&per_page=100&status=any`,
      { headers: { Authorization: wcAuth() } }
    )
    return r.json()
  }

  const [dayRaw, weekRaw] = await Promise.all([
    getOrders(yesterday, yesterday),
    getOrders(weekStart, today),
  ])

  function summarize(orders: {status:string;total:string;line_items:{name:string;quantity:number}[]}[]) {
    if (!Array.isArray(orders)) return null
    const byStatus: Record<string,number> = {}
    const products: Record<string,number> = {}
    let revenue = 0
    for (const o of orders) {
      byStatus[o.status] = (byStatus[o.status]??0)+1
      revenue += parseFloat(o.total??'0')
      for (const item of o.line_items??[]) products[item.name] = (products[item.name]??0)+item.quantity
    }
    const topProducts = Object.entries(products).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,qty])=>({name,qty}))
    return { total: orders.length, byStatus, revenue: +revenue.toFixed(2), topProducts }
  }

  return { day: summarize(dayRaw), week: summarize(weekRaw) }
}

// ── Google Ads API ────────────────────────────────────────────────────────────

async function getGoogleAdsToken(): Promise<string | null> {
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        grant_type:    'refresh_token',
      }),
    })
    const d = await res.json()
    return d.access_token ?? null
  } catch { return null }
}

async function fetchGoogleAds() {
  const devToken      = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId    = process.env.GOOGLE_ADS_CUSTOMER_ID
  const loginCustomer = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  if (!devToken || !customerId) return null

  const token = await getGoogleAdsToken()
  if (!token) { console.warn('[google-ads] token indisponível'); return null }

  const url = `https://googleads.googleapis.com/v20/customers/${customerId}/googleAds:search`
  const headers: Record<string, string> = {
    Authorization:    `Bearer ${token}`,
    'developer-token': devToken,
    'Content-Type':   'application/json',
  }
  if (loginCustomer) headers['login-customer-id'] = loginCustomer

  async function query(startDate: string, endDate: string) {
    const gaql = `
      SELECT
        campaign.name,
        campaign.status,
        metrics.cost_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions,
        metrics.conversions_value,
        metrics.search_impression_share
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
      LIMIT 20`
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ query: gaql }) })
    return r.json()
  }

  try {
    const yesterday = brazilDate(-1)
    const d2        = brazilDate(-2)
    const d3        = brazilDate(-3)
    const d4        = brazilDate(-4)
    const weekStart = brazilDate(-7)

    const [weekRaw, dayRaw, d2Raw, d3Raw, d4Raw] = await Promise.all([
      query(weekStart, yesterday),
      query(yesterday, yesterday),
      query(d2, d2),
      query(d3, d3),
      query(d4, d4),
    ])

    type GAdsRow = {
      campaign?: { name: string; status: string }
      metrics?: {
        costMicros?: string; impressions?: string; clicks?: string; ctr?: string
        averageCpc?: string; conversions?: string; conversionsValue?: string
        searchImpressionShare?: string
      }
    }

    function summarize(raw: { results?: GAdsRow[] }) {
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
        conversions += +parseFloat(m.conversions ?? '0').toFixed(2)
        convValue   += +parseFloat(m.conversionsValue ?? '0').toFixed(2)
        if (r.campaign?.name) campaigns.push({
          name: r.campaign.name, cost: +c.toFixed(2),
          clicks: +(m.clicks ?? '0'), conversions: +parseFloat(m.conversions ?? '0').toFixed(0),
        })
      }
      const cpc  = clicks ? +(cost / clicks).toFixed(2) : 0
      const roas = cost  ? +(convValue / cost).toFixed(2) : 0
      const ctr  = impressions ? +((clicks / impressions) * 100).toFixed(2) : 0
      return { cost: +cost.toFixed(2), impressions, clicks, ctr, cpc, conversions: +conversions.toFixed(0), convValue: +convValue.toFixed(2), roas, campaigns }
    }

    const getCost = (raw: { results?: GAdsRow[] }) => {
      const rows = raw.results ?? []
      return +rows.reduce((s, r) => s + +(r.metrics?.costMicros ?? '0') / 1_000_000, 0).toFixed(2)
    }

    return {
      week: summarize(weekRaw),
      day:  summarize(dayRaw),
      days: [
        { date: fmt(yesterday), cost: getCost(dayRaw) },
        { date: fmt(d2),        cost: getCost(d2Raw)  },
        { date: fmt(d3),        cost: getCost(d3Raw)  },
        { date: fmt(d4),        cost: getCost(d4Raw)  },
      ],
    }
  } catch (e) { console.error('[google-ads] erro:', e); return null }
}

// ── Meta Ads ──────────────────────────────────────────────────────────────────

async function fetchMetaAds() {
  const token     = process.env.META_ADS_TOKEN
  const accountId = process.env.META_ADS_ACCOUNT_ID
  if (!token || !accountId) return null

  try {
    const fields = 'spend,impressions,clicks,cpm,cpc,reach,actions'
    const base = `https://graph.facebook.com/v20.0/${accountId}/insights?fields=${fields}&access_token=${token}`
    const tr = (d: string) => `time_range=${encodeURIComponent(JSON.stringify({ since: d, until: d }))}`
    const d1 = brazilDate(-1)
    const d2 = brazilDate(-2)
    const d3 = brazilDate(-3)
    const d4 = brazilDate(-4)

    const [week, day, meta2, meta3, meta4] = await Promise.all([
      fetch(`${base}&date_preset=last_7d`).then(r => r.json()),
      fetch(`${base}&date_preset=yesterday`).then(r => r.json()),
      fetch(`${base}&${tr(d2)}`).then(r => r.json()),
      fetch(`${base}&${tr(d3)}`).then(r => r.json()),
      fetch(`${base}&${tr(d4)}`).then(r => r.json()),
    ])

    function parse(d: { data?: { spend?: string; impressions?: string; clicks?: string; cpm?: string; cpc?: string; reach?: string; actions?: {action_type:string;value:string}[] }[] }) {
      const row = d.data?.[0]
      if (!row) return null
      const purchases = row.actions?.find((a: {action_type:string}) => a.action_type === 'purchase')?.value ?? '0'
      return {
        spend:       +parseFloat(row.spend ?? '0').toFixed(2),
        impressions: +(row.impressions ?? '0'),
        clicks:      +(row.clicks ?? '0'),
        cpm:         +parseFloat(row.cpm ?? '0').toFixed(2),
        cpc:         +parseFloat(row.cpc ?? '0').toFixed(2),
        reach:       +(row.reach ?? '0'),
        purchases:   +purchases,
        roas:        row.spend && +purchases > 0 ? +((+purchases * 350) / parseFloat(row.spend)).toFixed(2) : 0,
      }
    }

    const parseSpend = (d: { data?: { spend?: string }[] }) => +parseFloat(d.data?.[0]?.spend ?? '0').toFixed(2)

    return {
      week: parse(week),
      day:  parse(day),
      days: [
        { date: fmt(d1), spend: parseSpend(day)   },
        { date: fmt(d2), spend: parseSpend(meta2)  },
        { date: fmt(d3), spend: parseSpend(meta3)  },
        { date: fmt(d4), spend: parseSpend(meta4)  },
      ],
    }
  } catch { return null }
}

// ── Google Analytics 4 ───────────────────────────────────────────────────────

async function getGa4Token(): Promise<string | null> {
  try {
    const sa = JSON.parse(GA4_SA_JSON)
    // Build JWT for service account
    const now = Math.floor(Date.now() / 1000)
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })).toString('base64url')

    // Sign with RSA private key using Node.js crypto
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
  } catch (e) { console.error('[GA4] token error:', e); return null }
}

async function fetchGa4() {
  const token = await getGa4Token()
  if (!token) return null

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const dr7 = { startDate: '7daysAgo', endDate: 'yesterday' }
  const dr1 = { startDate: 'yesterday', endDate: 'yesterday' }

  async function run(body: object) {
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    return r.json()
  }

  const [byChannel, topPages, events, byChannelDay, convByChannel] = await Promise.all([
    // Sessões por canal — semana
    run({ dateRanges: [dr7], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'bounceRate' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }], limit: 10,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    // Top páginas — semana
    run({ dateRanges: [dr7], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'bounceRate' }],
      dimensions: [{ name: 'pagePath' }], limit: 12,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }),
    // Eventos funil — semana
    run({ dateRanges: [dr7], metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'eventName' }], limit: 30,
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] }),
    // Sessões por canal — ontem
    run({ dateRanges: [dr1], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }], limit: 8,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    // Conversões + receita por canal — semana (para Google Ads atribuição)
    run({ dateRanges: [dr7], metrics: [{ name: 'conversions' }, { name: 'totalRevenue' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }], limit: 15,
      orderBys: [{ metric: { metricName: 'conversions' }, desc: true }] }),
  ])

  type Row = { dimensionValues: { value: string }[]; metricValues: { value: string }[] }

  const channels = (byChannel.rows ?? []).map((r: Row) => ({
    channel: r.dimensionValues[0].value,
    sessions: +r.metricValues[0].value,
    users: +r.metricValues[1].value,
    bounceRate: +(+r.metricValues[2].value * 100).toFixed(1),
  }))

  const channelsDay = (byChannelDay.rows ?? []).map((r: Row) => ({
    channel: r.dimensionValues[0].value,
    sessions: +r.metricValues[0].value,
    users: +r.metricValues[1].value,
  }))

  const pages = (topPages.rows ?? [])
    .filter((r: Row) => !r.dimensionValues[0].value.startsWith('/api'))
    .slice(0, 8)
    .map((r: Row) => ({
      path: r.dimensionValues[0].value,
      views: +r.metricValues[0].value,
      users: +r.metricValues[1].value,
      bounceRate: +(+r.metricValues[2].value * 100).toFixed(0),
    }))

  const eventMap: Record<string, number> = {}
  for (const r of (events.rows ?? []) as Row[]) eventMap[r.dimensionValues[0].value] = +r.metricValues[0].value

  const funnel = {
    pageViews:     eventMap['page_view'] ?? 0,
    viewItem:      eventMap['view_item'] ?? 0,
    addToCart:     eventMap['add_to_cart'] ?? 0,
    beginCheckout: eventMap['begin_checkout'] ?? 0,
    purchase:      eventMap['purchase'] ?? 0,
  }

  const totalSessions = channels.reduce((s: number, c: { sessions: number }) => s + c.sessions, 0)

  // Google Ads — extrai Paid Search + Paid Shopping do GA4
  type ConvRow = { dimensionValues: { value: string }[]; metricValues: { value: string }[] }
  const convMap: Record<string, { conversions: number; revenue: number }> = {}
  for (const r of (convByChannel.rows ?? []) as ConvRow[]) {
    const ch = r.dimensionValues[0].value
    convMap[ch] = { conversions: +r.metricValues[0].value, revenue: +parseFloat(r.metricValues[1].value).toFixed(2) }
  }

  const paidSearch   = channels.find((c: { channel: string }) => c.channel === 'Paid Search')
  const paidShopping = channels.find((c: { channel: string }) => c.channel === 'Paid Shopping')
  const paidSearchDay   = channelsDay.find((c: { channel: string }) => c.channel === 'Paid Search')
  const paidShoppingDay = channelsDay.find((c: { channel: string }) => c.channel === 'Paid Shopping')

  const googleAds = {
    week: {
      sessions:   (paidSearch?.sessions ?? 0) + (paidShopping?.sessions ?? 0),
      users:      (paidSearch?.users ?? 0) + (paidShopping?.users ?? 0),
      bounceRate: paidSearch?.bounceRate ?? 0,
      purchases:  (convMap['Paid Search']?.conversions ?? 0) + (convMap['Paid Shopping']?.conversions ?? 0),
      revenue:    +((convMap['Paid Search']?.revenue ?? 0) + (convMap['Paid Shopping']?.revenue ?? 0)).toFixed(2),
    },
    day: {
      sessions: (paidSearchDay?.sessions ?? 0) + (paidShoppingDay?.sessions ?? 0),
      users:    (paidSearchDay?.users ?? 0) + (paidShoppingDay?.users ?? 0),
    },
  }

  return { channels, channelsDay, pages, funnel, totalSessions, googleAds }
}

// ── AI Analysis ───────────────────────────────────────────────────────────────

async function askGemini(prompt: string): Promise<string> {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  )
  const d = await r.json()
  return d.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Gemini indisponível.'
}

async function askGpt(prompt: string): Promise<string> {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'Você é especialista em CRO e e-commerce brasileiro. Analise dados do site jaleca.com.br (jalecos e uniformes femininos para profissionais de saúde, preço médio R$350) e dê recomendações práticas e diretas. Responda em português. Seja objetivo e priorize ações de alto impacto.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1400,
      temperature: 0.7,
    }),
  })
  const d = await r.json()
  return d.choices?.[0]?.message?.content ?? 'GPT indisponível.'
}

type GscData = Awaited<ReturnType<typeof fetchGsc>>
type PagarmeData = Awaited<ReturnType<typeof fetchPagarme>>
type WcData = Awaited<ReturnType<typeof fetchWc>>

async function generateSeoAnalysis(gsc: GscData): Promise<string> {
  const prompt = `
Você é especialista em SEO. Analise os dados do Google Search Console do site jaleca.com.br (jalecos e uniformes femininos para profissionais de saúde) e forneça análise estratégica acionável.

MÉTRICAS DE HOJE (${gsc.dayDate}):
- Cliques: ${gsc.day.clicks} | Impressões: ${gsc.day.impressions} | CTR: ${gsc.day.ctr}% | Posição: ${gsc.day.position}

MÉTRICAS 7 DIAS (${gsc.weekRange}):
- Cliques: ${gsc.week.clicks} (${gsc.delta.clicks > 0 ? '+' : ''}${gsc.delta.clicks} vs semana anterior)
- Impressões: ${gsc.week.impressions} (${gsc.delta.impressions > 0 ? '+' : ''}${gsc.delta.impressions})
- CTR: ${gsc.week.ctr}% (${gsc.delta.ctr > 0 ? '+' : ''}${gsc.delta.ctr}%)
- Posição média: ${gsc.week.position} (${gsc.delta.position > 0 ? '+' : ''}${gsc.delta.position})

TOP 10 QUERIES (7 dias):
${gsc.topQueries.map(q => `- "${q.query}": ${q.clicks} cliques, pos ${q.position}, CTR ${q.ctr}%`).join('\n')}

TOP PÁGINAS (7 dias):
${gsc.topPages.slice(0,6).map(p => `- ${p.page}: ${p.clicks} cliques, pos ${p.position}`).join('\n')}

OPORTUNIDADES (impressão alta, CTR baixo — title/description fraco):
${gsc.opportunities.length ? gsc.opportunities.map(o => `- "${o.query}": ${o.impressions} impressões, CTR ${o.ctr}%, pos ${o.position}`).join('\n') : 'Nenhuma identificada'}

Forneça:
1. **Diagnóstico geral** do dia e da semana (2-3 frases)
2. **Top 3 ações de SEO para fazer HOJE** (específicas, com qual página editar e o quê mudar)
3. **Oportunidades de conteúdo** — palavras-chave para criar página/post novo
4. **Alertas** — algo caindo ou preocupante?

Seja direto. Máximo 350 palavras. Use marcadores.
`
  return askGemini(prompt)
}

type Ga4Data = Awaited<ReturnType<typeof fetchGa4>>

async function generateCroAnalysis(gsc: GscData, pm: PagarmeData, wc: WcData, ga4: Ga4Data): Promise<string> {
  const methods = Object.entries(pm.day.methods).map(([k,v])=>`${k}: ${v}`).join(', ')
  const wcDay = wc.day
  const wcWeek = wc.week

  const ga4Channels = ga4?.channels.map((c: { channel: string; sessions: number; bounceRate: number }) => `${c.channel}: ${c.sessions} sessões, bounce ${c.bounceRate}%`).join(' | ') ?? 'N/A'
  const ga4Funnel = ga4?.funnel
  const funnelText = ga4Funnel ? `
Views de produto: ${ga4Funnel.viewItem} | Adicionou ao carrinho: ${ga4Funnel.addToCart} (${ga4Funnel.viewItem ? ((ga4Funnel.addToCart/ga4Funnel.viewItem)*100).toFixed(1) : 0}%)
Iniciou checkout: ${ga4Funnel.beginCheckout} | Comprou: ${ga4Funnel.purchase} (${ga4Funnel.beginCheckout ? ((ga4Funnel.purchase/ga4Funnel.beginCheckout)*100).toFixed(1) : 0}% do checkout)
Taxa geral: ${ga4?.totalSessions ? ((ga4Funnel.purchase/ga4.totalSessions)*100).toFixed(2) : 0}%` : 'N/A'

  const topPages = ga4?.pages.slice(0,5).map((p: { path: string; views: number; bounceRate: number }) => `${p.path}: ${p.views} views, bounce ${p.bounceRate}%`).join(' | ') ?? 'N/A'

  const gAds = ga4?.googleAds
  const gAdsText = gAds?.week.sessions ? `
━━━ GOOGLE ADS (via GA4 — sem gasto R$) ━━━
Sessões pagas semana: ${gAds.week.sessions} | Usuários: ${gAds.week.users}
Compras atribuídas: ${gAds.week.purchases} | Receita GA4: R$${gAds.week.revenue}
Taxa conversão paga: ${gAds.week.sessions ? ((gAds.week.purchases / gAds.week.sessions) * 100).toFixed(2) : 0}% | Bounce: ${gAds.week.bounceRate}%
Ontem: ${gAds.day.sessions} sessões pagas` : ''

  const prompt = `
Analise os dados abaixo do site jaleca.com.br e responda com clareza: o que está impedindo as conversões e o que fazer AGORA.

━━━ TRÁFEGO GA4 — SEMANA ━━━
Total sessões: ${ga4?.totalSessions ?? 'N/A'}
Por canal (sessões | bounce): ${ga4Channels}
${gAdsText}

━━━ FUNIL DE CONVERSÃO (semana) ━━━${funnelText}

━━━ PÁGINAS MAIS VISITADAS ━━━
${topPages}

━━━ TRÁFEGO GSC ━━━
Hoje: ${gsc?.day.clicks ?? 0} cliques, CTR ${gsc?.day.ctr ?? 0}%, posição ${gsc?.day.position ?? 0}
Semana: ${gsc?.week.clicks ?? 0} cliques

━━━ PAGAMENTOS HOJE (${pm.dayDate}) ━━━
Tentativas: ${pm.day.total} | Aprovados: ${pm.day.paid} | Falharam: ${pm.day.failed}
Receita aprovada: R$ ${pm.day.revenue.toFixed(2)} | Receita perdida: R$ ${pm.day.lost.toFixed(2)}
Conversão pagamento: ${pm.day.convRate}% | Métodos: ${methods || 'sem dados'}

━━━ PAGAMENTOS SEMANA ━━━
${pm.week.paid}/${pm.week.total} aprovados | R$ ${pm.week.revenue.toFixed(2)} | ${pm.week.convRate}% conversão

━━━ PEDIDOS WC ━━━
Hoje: ${wcDay?.total ?? 0} pedidos | R$ ${wcDay?.revenue?.toFixed(2) ?? 0}
Semana: ${wcWeek?.total ?? 0} pedidos | R$ ${wcWeek?.revenue?.toFixed(2) ?? 0}
Top produtos: ${wcWeek?.topProducts?.map(p=>`${p.name.substring(0,30)} (${p.qty}x)`).join(', ') ?? 'N/A'}

━━━ CONTEXTO ━━━
- Público: enfermeiras, médicas, profissionais de saúde — ticket médio R$350
- Frete grátis SP/RJ/MG/ES acima de R$499 | PIX 5% desconto
- Checkout: /finalizar-compra (Next.js + Pagar.me)

Responda em 4 blocos:

**1. DIAGNÓSTICO** — Por que não está convertendo? Use os números do funil e bounce por canal.

**2. AÇÕES URGENTES (fazer hoje/amanhã)** — 5 ações específicas: o que fazer, em qual página/elemento, impacto esperado.

**3. AÇÕES SEMANA** — 3 melhorias de médio prazo para dobrar a conversão.

**4. ALERTA** — Número mais preocupante do dia.

Máximo 500 palavras. Seja direto como consultor de e-commerce sênior.
`
  return askGpt(prompt)
}

// ── Email HTML ────────────────────────────────────────────────────────────────

type MetaData = Awaited<ReturnType<typeof fetchMetaAds>>
type GoogleAdsData = Awaited<ReturnType<typeof fetchGoogleAds>>

function buildEmail(
  dateStr: string,
  gsc: GscData,
  pm: PagarmeData,
  wc: WcData,
  ga4: Ga4Data,
  meta: MetaData,
  gads: GoogleAdsData,
  seoText: string,
  croText: string,
): string {
  const sign = (n: number, invert = false) => {
    if (n === 0) return '<span style="color:#94a3b8">—</span>'
    const good = invert ? n < 0 : n > 0
    return `<span style="color:${good ? '#22c55e' : '#ef4444'}">${n > 0 ? '▲' : '▼'} ${Math.abs(n)}</span>`
  }

  const formatAI = (text: string) =>
    text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/#{1,3} (.+)/g, '<strong style="font-size:14px">$1</strong>')
      .replace(/\n/g, '<br>')

  const convColor = pm.day.convRate > 50 ? '#22c55e' : pm.day.convRate > 20 ? '#f59e0b' : '#ef4444'

  const queriesRows = gsc.topQueries.map(q => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;font-size:13px">${q.query}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:13px">${q.clicks}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:13px">${q.impressions}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:13px">${q.ctr}%</td>
      <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:13px">${q.position}</td>
    </tr>`).join('')

  const oppsRows = gsc.opportunities.map(o => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #fef9c3;font-size:13px">${o.query}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #fef9c3;text-align:center;font-size:13px">${o.impressions}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #fef9c3;text-align:center;font-size:13px;color:#dc2626">${o.ctr}%</td>
      <td style="padding:6px 10px;border-bottom:1px solid #fef9c3;text-align:center;font-size:13px">${o.position}</td>
    </tr>`).join('')

  const topProductsHtml = (wc.week?.topProducts ?? []).map(p =>
    `<div style="padding:4px 0;font-size:13px;color:#374151">• ${p.name.substring(0,40)} <strong>${p.qty}x</strong></div>`
  ).join('')

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;margin:0;padding:20px">
<div style="max-width:680px;margin:0 auto">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);border-radius:16px;padding:28px;margin-bottom:16px;text-align:center">
    <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Relatório Diário</p>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">Jaleca — ${dateStr}</h1>
    <p style="color:#64748b;margin:6px 0 0;font-size:12px">Gerado às 19h BRT · GSC + Pagar.me + WooCommerce + IA</p>
  </div>

  <!-- KPIs do DIA -->
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">📅 Resumo de hoje — ${pm.dayDate}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${[
        { label: 'Cliques GSC', value: String(gsc.day.clicks), sub: `CTR ${gsc.day.ctr}%` },
        { label: 'Pedidos aprovados', value: `${pm.day.paid}/${pm.day.total}`, sub: `${pm.day.convRate}% conv`, color: convColor },
        { label: 'Receita', value: `R$${pm.day.revenue.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}`, sub: 'aprovado' },
        { label: 'Receita perdida', value: `R$${pm.day.lost.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}`, sub: 'falhou', color: pm.day.lost > 0 ? '#ef4444' : '#22c55e' },
      ].map(k => `
        <div style="background:#f8fafc;border-radius:8px;padding:12px;text-align:center">
          <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase">${k.label}</p>
          <p style="font-size:20px;font-weight:700;margin:0;color:${k.color ?? '#1e293b'}">${k.value}</p>
          <p style="font-size:11px;color:#94a3b8;margin:2px 0 0">${k.sub}</p>
        </div>`).join('')}
    </div>
  </div>

  <!-- KPIs da SEMANA -->
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">📆 Semana — ${gsc.weekRange}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
      ${[
        { label: 'Cliques', value: String(gsc.week.clicks), delta: sign(gsc.delta.clicks) },
        { label: 'Impressões', value: String(gsc.week.impressions), delta: sign(gsc.delta.impressions) },
        { label: 'CTR médio', value: `${gsc.week.ctr}%`, delta: sign(gsc.delta.ctr) },
        { label: 'Posição média', value: String(gsc.week.position), delta: sign(gsc.delta.position, true) },
      ].map(k => `
        <div style="background:#f8fafc;border-radius:8px;padding:12px;text-align:center">
          <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase">${k.label}</p>
          <p style="font-size:20px;font-weight:700;margin:0;color:#1e293b">${k.value}</p>
          <p style="font-size:12px;margin:2px 0 0">${k.delta}</p>
        </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding:10px 14px;background:#f0fdf4;border-radius:8px;border-left:3px solid #22c55e">
      <span style="font-size:13px;color:#166534">
        <strong>Semana Pagar.me:</strong> ${pm.week.paid}/${pm.week.total} aprovados · R$${pm.week.revenue.toFixed(2)} receita · ${pm.week.convRate}% conversão
      </span>
    </div>
  </div>

  <!-- Top Queries -->
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">🔑 Top Palavras-chave — 7 dias</p>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f8fafc">
        <th style="padding:8px 10px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Query</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Cliques</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Impressões</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">CTR</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Posição</th>
      </tr></thead>
      <tbody>${queriesRows}</tbody>
    </table>
  </div>

  ${oppsRows ? `
  <!-- Oportunidades CTR -->
  <div style="background:#fffbeb;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #fcd34d">
    <p style="font-size:11px;color:#92400e;margin:0 0 6px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">⚡ Oportunidades — Alta impressão, CTR baixo</p>
    <p style="font-size:12px;color:#78716c;margin:0 0 12px">Essas queries aparecem muito mas ninguém clica — reescrever title/meta description pode triplicar o tráfego sem mudar posição</p>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        <th style="padding:6px 10px;text-align:left;font-size:11px;color:#92400e">Query</th>
        <th style="padding:6px 10px;text-align:center;font-size:11px;color:#92400e">Impressões</th>
        <th style="padding:6px 10px;text-align:center;font-size:11px;color:#92400e">CTR</th>
        <th style="padding:6px 10px;text-align:center;font-size:11px;color:#92400e">Posição</th>
      </tr></thead>
      <tbody>${oppsRows}</tbody>
    </table>
  </div>` : ''}

  <!-- GA4 — Sessões por canal -->
  ${ga4 ? `
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">👥 De onde vieram — 7 dias (${ga4.totalSessions} sessões)</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f8fafc">
        <th style="padding:7px 10px;text-align:left;color:#64748b;font-weight:600;font-size:11px">Canal</th>
        <th style="padding:7px 10px;text-align:center;color:#64748b;font-weight:600;font-size:11px">Sessões</th>
        <th style="padding:7px 10px;text-align:center;color:#64748b;font-weight:600;font-size:11px">Usuários</th>
        <th style="padding:7px 10px;text-align:center;color:#64748b;font-weight:600;font-size:11px">Bounce</th>
      </tr></thead>
      <tbody>${ga4.channels.map((c: { channel: string; sessions: number; users: number; bounceRate: number }) => {
        const bounceColor = c.bounceRate > 75 ? '#ef4444' : c.bounceRate > 50 ? '#f59e0b' : '#22c55e'
        return `<tr>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9">${c.channel}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${c.sessions}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center">${c.users}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:center;color:${bounceColor};font-weight:600">${c.bounceRate}%</td>
        </tr>`}).join('')}</tbody>
    </table>
  </div>

  <!-- GA4 — Funil -->
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">🔽 Funil de conversão — 7 dias</p>
    <div style="display:flex;align-items:flex-end;gap:8px">
      ${[
        { label: 'Pageviews', value: ga4.funnel.pageViews, max: ga4.funnel.pageViews },
        { label: 'Viram produto', value: ga4.funnel.viewItem, max: ga4.funnel.pageViews },
        { label: 'Adicionou', value: ga4.funnel.addToCart, max: ga4.funnel.pageViews },
        { label: 'Checkout', value: ga4.funnel.beginCheckout, max: ga4.funnel.pageViews },
        { label: 'Comprou', value: ga4.funnel.purchase, max: ga4.funnel.pageViews },
      ].map(step => {
        const pct = step.max ? Math.round((step.value / step.max) * 100) : 0
        const color = pct > 50 ? '#3b82f6' : pct > 10 ? '#f59e0b' : '#ef4444'
        return `<div style="flex:1;text-align:center">
          <p style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 4px">${step.value}</p>
          <div style="background:#f1f5f9;border-radius:4px;height:60px;position:relative;overflow:hidden">
            <div style="position:absolute;bottom:0;width:100%;height:${Math.max(pct,3)}%;background:${color};border-radius:4px"></div>
          </div>
          <p style="font-size:10px;color:#64748b;margin:4px 0 0">${step.label}</p>
          <p style="font-size:10px;color:${color};margin:0;font-weight:600">${pct}%</p>
        </div>`
      }).join('')}
    </div>
    <p style="font-size:11px;color:#94a3b8;margin:10px 0 0;text-align:center">
      Add-to-cart rate: <strong>${ga4.funnel.viewItem ? ((ga4.funnel.addToCart/ga4.funnel.viewItem)*100).toFixed(1) : 0}%</strong> ·
      Checkout completion: <strong>${ga4.funnel.beginCheckout ? ((ga4.funnel.purchase/ga4.funnel.beginCheckout)*100).toFixed(1) : 0}%</strong> ·
      Conversão geral: <strong>${ga4.totalSessions ? ((ga4.funnel.purchase/ga4.totalSessions)*100).toFixed(2) : 0}%</strong>
    </p>
  </div>` : ''}

  <!-- Meta Ads -->
  ${meta?.week ? `
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">📘 Meta Ads — últimos 7 dias</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
      ${[
        { label: 'Investido', value: `R$${meta.week.spend.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
        { label: 'Impressões', value: meta.week.impressions.toLocaleString('pt-BR') },
        { label: 'Cliques', value: meta.week.clicks.toLocaleString('pt-BR') },
        { label: 'CPC', value: `R$${meta.week.cpc.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
        { label: 'CPM', value: `R$${meta.week.cpm.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
        { label: 'Alcance', value: meta.week.reach.toLocaleString('pt-BR') },
      ].map(k => `<div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center">
        <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase">${k.label}</p>
        <p style="font-size:17px;font-weight:700;margin:0;color:#1e293b">${k.value}</p>
      </div>`).join('')}
    </div>
    ${meta.day ? `<p style="font-size:12px;color:#64748b;margin:0;text-align:center">
      Ontem: <strong>R$${meta.day.spend}</strong> investido · <strong>${meta.day.clicks}</strong> cliques · CPC <strong>R$${meta.day.cpc}</strong>
    </p>` : ''}
  </div>` : ''}

  <!-- Google Ads API -->
  ${gads?.week ? `
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">🟢 Google Ads — últimos 7 dias</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
      ${[
        { label: 'Investido', value: `R$${gads.week.cost.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
        { label: 'Cliques', value: gads.week.clicks.toLocaleString('pt-BR') },
        { label: 'Impressões', value: gads.week.impressions.toLocaleString('pt-BR') },
        { label: 'CPC médio', value: `R$${gads.week.cpc.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
        { label: 'Conversões', value: String(gads.week.conversions) },
        { label: 'ROAS', value: String(gads.week.roas), color: gads.week.roas >= 3 ? '#22c55e' : gads.week.roas >= 1 ? '#f59e0b' : '#ef4444' },
      ].map(k => `<div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center">
        <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase">${k.label}</p>
        <p style="font-size:17px;font-weight:700;margin:0;color:${k.color ?? '#1e293b'}">${k.value}</p>
      </div>`).join('')}
    </div>
    ${gads.week.campaigns?.length ? `
    <div style="margin-top:10px">
      ${gads.week.campaigns.slice(0,4).map(c => `
      <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;font-size:12px">
        <span style="color:#374151">${c.name.substring(0,45)}</span>
        <span style="color:#64748b">R$${c.cost.toFixed(0)} · ${c.clicks} cliques · ${c.conversions} conv</span>
      </div>`).join('')}
    </div>` : ''}
    ${gads.day ? `<p style="font-size:12px;color:#64748b;margin:10px 0 0;text-align:center">
      Ontem: <strong>R$${gads.day.cost}</strong> investido · <strong>${gads.day.clicks}</strong> cliques · <strong>${gads.day.conversions}</strong> conversões
    </p>` : ''}
  </div>` : ga4?.googleAds?.week.sessions ? `
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">🟢 Google Ads — via GA4 (7 dias)</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      ${[
        { label: 'Sessões pagas', value: ga4.googleAds.week.sessions.toLocaleString('pt-BR') },
        { label: 'Compras atribuídas', value: String(ga4.googleAds.week.purchases) },
        { label: 'Receita GA4', value: `R$${ga4.googleAds.week.revenue.toLocaleString('pt-BR',{minimumFractionDigits:2})}` },
      ].map(k => `<div style="background:#f8fafc;border-radius:8px;padding:10px;text-align:center">
        <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase">${k.label}</p>
        <p style="font-size:17px;font-weight:700;margin:0;color:#1e293b">${k.value}</p>
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- Análise SEO — Gemini -->
  <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #86efac">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <span style="background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">GEMINI SEO</span>
      <p style="margin:0;font-size:14px;font-weight:600;color:#14532d">Análise de SEO do Dia</p>
    </div>
    <div style="font-size:13px;color:#166534;line-height:1.75">${formatAI(seoText)}</div>
  </div>

  <!-- Análise CRO — GPT-4.1 -->
  <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #93c5fd">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <span style="background:#2563eb;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px">GPT-4.1</span>
      <p style="margin:0;font-size:14px;font-weight:600;color:#1e3a8a">Diagnóstico de Conversão + Ações</p>
    </div>
    <div style="font-size:13px;color:#1e40af;line-height:1.75">${formatAI(croText)}</div>
  </div>

  <!-- Top Produtos Semana -->
  ${topProductsHtml ? `
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 12px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">🏆 Produtos mais vendidos — semana</p>
    ${topProductsHtml}
  </div>` : ''}

  <!-- Evolução 4 dias -->
  <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:12px;border:1px solid #e2e8f0">
    <p style="font-size:11px;color:#64748b;margin:0 0 14px;text-transform:uppercase;letter-spacing:.8px;font-weight:600">📈 Evolução 4 dias</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f8fafc">
          <th style="padding:8px 10px;text-align:left;font-size:11px;color:#64748b;font-weight:600">Data</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Receita</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Pedidos</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">GSC Cliques</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Meta Ads</th>
          <th style="padding:8px 10px;text-align:center;font-size:11px;color:#64748b;font-weight:600">Google Ads</th>
        </tr>
      </thead>
      <tbody>
        ${(pm.days ?? []).map((d, i) => {
          const gscDay   = gsc?.days?.[i]
          const metaDay  = meta?.days?.[i]
          const gadsDay  = gads?.days?.[i]
          const isToday  = i === 0
          const rowBg    = isToday ? '#f0f9ff' : 'transparent'
          const revenue  = `R$${d.revenue.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}`
          const gscClicks = gscDay?.clicks ?? '—'
          const metaSpend = metaDay ? `R$${metaDay.spend.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}` : '—'
          const gadsCost  = gadsDay ? `R$${gadsDay.cost.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}` : '—'
          return `<tr style="background:${rowBg}">
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:12px;font-weight:${isToday ? '700' : '400'};color:#1e293b">${d.date}${isToday ? ' ◀' : ''}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:12px;font-weight:600;color:${d.revenue > 0 ? '#059669' : '#94a3b8'}">${revenue}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:12px">${d.paid}/${d.total}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:12px">${gscClicks}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:12px;color:#1877f2">${metaSpend}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:12px;color:#4285f4">${gadsCost}</td>
          </tr>`
        }).join('')}
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:20px;color:#94a3b8;font-size:11px;line-height:1.6">
    Jaleca Daily Report · Enviado automaticamente todo dia às 19h<br>
    Gemini SEO Expert + GPT-4.1 CRO + GSC + GA4 + Meta Ads + Google Ads (via GA4) + Pagar.me + WooCommerce<br>
    <a href="https://jaleca.com.br" style="color:#3b82f6;text-decoration:none">jaleca.com.br</a>
  </div>

</div>
</body></html>`
}

// ── Send via Brevo ────────────────────────────────────────────────────────────

async function sendEmail(subject: string, html: string) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Jaleca Report', email: 'contato@jaleca.com.br' },
      to: RECIPIENTS,
      subject,
      htmlContent: html,
    }),
  })
  return r.json()
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Auth — mesmo padrão dos outros crons: Bearer header ou x-vercel-cron
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const isBearer = authHeader === `Bearer ${CRON_SECRET}`

  if (!isVercelCron && !isBearer) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const today = new Date()
  today.setHours(today.getHours() - 3) // BRT
  const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  try {
    console.log('[daily-report] Iniciando coleta de dados...')

    // Coleta em paralelo (GSC token precisa ser obtido primeiro)
    const gscToken = await getGscToken()
    if (!gscToken) console.warn('[daily-report] GSC token não disponível')

    const [gsc, pm, wc, ga4, meta, gads] = await Promise.all([
      gscToken ? fetchGsc(gscToken) : Promise.resolve(null),
      fetchPagarme(),
      fetchWc(),
      fetchGa4(),
      fetchMetaAds().catch(e => { console.error('[meta-ads] falha:', e); return null }),
      fetchGoogleAds().catch(e => { console.error('[google-ads] falha:', e); return null }),
    ])

    console.log(`[daily-report] Dados coletados — GSC: ${gsc?.week.clicks ?? 'N/A'} | Pagar.me: ${pm.day.paid}/${pm.day.total} | WC: ${wc.day?.total ?? 'N/A'} | GA4: ${ga4?.totalSessions ?? 'N/A'} sessões | GoogAds: R$${gads?.week?.cost ?? 'N/A'} / ${gads?.week?.conversions ?? 'N/A'} conv | Meta: R$${meta?.week?.spend ?? 'N/A'}`)
    if (!meta) console.warn('[daily-report] Meta Ads retornou null — token expirado ou variável ausente')
    if (!gads) console.warn('[daily-report] Google Ads retornou null — token ou variável ausente')

    // IA em paralelo
    const [seoText, croText] = await Promise.all([
      gsc ? generateSeoAnalysis(gsc) : Promise.resolve('Dados GSC indisponíveis.'),
      generateCroAnalysis(gsc!, pm, wc, ga4),
    ])

    console.log('[daily-report] Análises de IA geradas')

    const html = buildEmail(dateStr, gsc!, pm, wc, ga4, meta, gads, seoText, croText)
    const subject = `📊 Jaleca ${today.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})} — ${pm.day.paid} pedidos aprovados · R$${pm.day.revenue.toFixed(0)} · ${pm.day.convRate}% conv`

    const emailResult = await sendEmail(subject, html)
    console.log('[daily-report] Email enviado:', emailResult)

    return NextResponse.json({
      ok: true,
      date: dateStr,
      gsc: gsc ? { clicks: gsc.week.clicks, position: gsc.week.position } : null,
      ga4: ga4 ? { sessions: ga4.totalSessions, purchase: ga4.funnel.purchase, addToCart: ga4.funnel.addToCart, convRate: ga4.totalSessions ? +((ga4.funnel.purchase/ga4.totalSessions)*100).toFixed(2) : 0 } : null,
      pagarme: { paid: pm.day.paid, total: pm.day.total, revenue: pm.day.revenue },
      wc: wc.day ? { orders: wc.day.total, revenue: wc.day.revenue } : null,
      meta: meta?.week ? { spend7d: meta.week.spend, clicks7d: meta.week.clicks, cpc7d: meta.week.cpc, reach7d: meta.week.reach, spendOntem: meta.day?.spend ?? null } : null,
      googleAds: gads?.week ? { cost7d: gads.week.cost, clicks7d: gads.week.clicks, conversions7d: gads.week.conversions, cpc7d: gads.week.cpc, costOntem: gads.day?.cost ?? null } : null,
      emailSent: !!emailResult.messageId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('[daily-report] Erro:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
