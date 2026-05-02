import { NextResponse } from 'next/server'

function brazilDate(offsetDays = 0): string {
  const d = new Date()
  d.setHours(d.getHours() - 3)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

async function fetchAllMeta() {
  const token     = process.env.META_ADS_TOKEN
  const accountId = process.env.META_ADS_ACCOUNT_ID
  if (!token || !accountId) return { error: 'META vars ausentes' }

  const fields = 'campaign_name,campaign_id,spend,impressions,clicks,reach,cpm,cpc,actions'
  const url = `https://graph.facebook.com/v20.0/${accountId}/insights?fields=${fields}&level=campaign&date_preset=last_14d&limit=50&access_token=${token}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.error) return { error: data.error }

  type MetaCamp = {
    campaign_name: string
    campaign_id: string
    spend?: string
    impressions?: string
    clicks?: string
    reach?: string
    cpm?: string
    cpc?: string
    actions?: { action_type: string; value: string }[]
  }

  const campaigns = (data.data ?? []).map((r: MetaCamp) => {
    const purchases = r.actions?.find(a => a.action_type === 'purchase')?.value ?? '0'
    const addToCart = r.actions?.find(a => a.action_type === 'add_to_cart')?.value ?? '0'
    const initCheckout = r.actions?.find(a => a.action_type === 'initiate_checkout')?.value ?? '0'
    const spend = parseFloat(r.spend ?? '0')
    return {
      name:         r.campaign_name,
      spend:        +spend.toFixed(2),
      impressions:  +(r.impressions ?? '0'),
      clicks:       +(r.clicks ?? '0'),
      reach:        +(r.reach ?? '0'),
      cpm:          +parseFloat(r.cpm ?? '0').toFixed(2),
      cpc:          +parseFloat(r.cpc ?? '0').toFixed(2),
      purchases:    +purchases,
      add_to_cart:  +addToCart,
      init_checkout:+initCheckout,
      cpa:          +purchases > 0 ? +(spend / +purchases).toFixed(2) : null,
    }
  }).sort((a: {spend: number}, b: {spend: number}) => b.spend - a.spend)

  const total = campaigns.reduce((s: {spend:number;impressions:number;clicks:number;purchases:number}, c: {spend:number;impressions:number;clicks:number;purchases:number}) => ({
    spend:       +(s.spend + c.spend).toFixed(2),
    impressions: s.impressions + c.impressions,
    clicks:      s.clicks + c.clicks,
    purchases:   s.purchases + c.purchases,
  }), { spend: 0, impressions: 0, clicks: 0, purchases: 0 })

  return { period: 'últimos 14 dias', total, campaigns }
}

async function fetchAllGoogleAds() {
  const devToken      = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const customerId    = process.env.GOOGLE_ADS_CUSTOMER_ID
  const loginCustomer = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  if (!devToken || !customerId) return { error: 'GOOGLE_ADS vars ausentes' }

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
  const { access_token } = await tokenRes.json()
  if (!access_token) return { error: 'token Google Ads falhou' }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${access_token}`,
    'developer-token': devToken,
    'Content-Type': 'application/json',
  }
  if (loginCustomer) headers['login-customer-id'] = loginCustomer

  const start = brazilDate(-14)
  const end   = brazilDate(-1)

  const gaql = `
    SELECT
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc,
      metrics.conversions,
      metrics.conversions_value,
      metrics.search_impression_share,
      metrics.view_through_conversions
    FROM campaign
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
    LIMIT 50`

  const res = await fetch(
    `https://googleads.googleapis.com/v20/customers/${customerId}/googleAds:search`,
    { method: 'POST', headers, body: JSON.stringify({ query: gaql }) }
  )
  const data = await res.json()
  if (data.error) return { error: data.error }

  type GAdsRow = {
    campaign?: { name: string; status: string; advertisingChannelType: string }
    metrics?: {
      costMicros?: string; impressions?: string; clicks?: string
      ctr?: string; averageCpc?: string; conversions?: string
      conversionsValue?: string; searchImpressionShare?: string
      viewThroughConversions?: string
    }
  }

  const campaigns = (data.results ?? []).map((r: GAdsRow) => {
    const m = r.metrics ?? {}
    const cost = +(m.costMicros ?? '0') / 1_000_000
    const conversions = +parseFloat(m.conversions ?? '0').toFixed(1)
    return {
      name:         r.campaign?.name ?? '',
      status:       r.campaign?.status ?? '',
      type:         r.campaign?.advertisingChannelType ?? '',
      cost:         +cost.toFixed(2),
      impressions:  +(m.impressions ?? '0'),
      clicks:       +(m.clicks ?? '0'),
      ctr:          +((+(m.ctr ?? '0')) * 100).toFixed(2),
      cpc:          +(+(m.averageCpc ?? '0') / 1_000_000).toFixed(2),
      conversions,
      conv_value:   +parseFloat(m.conversionsValue ?? '0').toFixed(2),
      roas:         cost > 0 && conversions > 0 ? +(parseFloat(m.conversionsValue ?? '0') / cost).toFixed(2) : 0,
      cpa:          conversions > 0 ? +(cost / conversions).toFixed(2) : null,
      imp_share:    m.searchImpressionShare ? +(+m.searchImpressionShare * 100).toFixed(1) : null,
    }
  })

  const active   = campaigns.filter((c: {cost: number}) => c.cost > 0)
  const inactive = campaigns.filter((c: {cost: number}) => c.cost === 0)

  const total = active.reduce((s: {cost:number;impressions:number;clicks:number;conversions:number}, c: {cost:number;impressions:number;clicks:number;conversions:number}) => ({
    cost:        +(s.cost + c.cost).toFixed(2),
    impressions: s.impressions + c.impressions,
    clicks:      s.clicks + c.clicks,
    conversions: +(s.conversions + c.conversions).toFixed(1),
  }), { cost: 0, impressions: 0, clicks: 0, conversions: 0 })

  return {
    period: `${start} → ${end} (14 dias)`,
    total,
    active_campaigns: active,
    paused_campaigns: inactive.map((c: {name: string; status: string; type: string}) => ({ name: c.name, status: c.status, type: c.type })),
  }
}

export async function GET() {
  const [meta, google] = await Promise.all([fetchAllMeta(), fetchAllGoogleAds()])
  return NextResponse.json({ meta_ads: meta, google_ads: google })
}
