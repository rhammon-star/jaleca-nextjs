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

const RECIPIENTS = [
  { email: 'rhammon@objetivasolucao.com.br', name: 'Rhammon' },
  { email: 'contato@jaleca.com.br',          name: 'Jaleca' },
  { email: 'financeiro@jaleca.com.br',       name: 'Financeiro Jaleca' },
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
  const d1End   = brazilDate(-1)           // ontem
  const d1Start = brazilDate(-1)           // ontem
  const w7End   = brazilDate(-1)           // fim semana = ontem
  const w7Start = brazilDate(-7)           // 7 dias atrás
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

  const [dayData, weekData, prevWeekData, topQueries, topPages, lowCtrRaw] = await Promise.all([
    query(d1Start, d1End, ['date'], 1),
    query(w7Start, w7End, ['date'], 7),
    query(w7PStart, w7PEnd, ['date'], 7),
    query(w7Start, w7End, ['query'], 15),
    query(w7Start, w7End, ['page'], 10),
    query(w7Start, w7End, ['query'], 50),
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
  }
}

// ── Pagar.me ──────────────────────────────────────────────────────────────────

async function fetchPagarme() {
  const today     = brazilDate(0)
  const yesterday = brazilDate(-1)
  const weekStart = brazilDate(-7)

  async function getOrders(since: string, until: string) {
    const r = await fetch(
      `https://api.pagar.me/core/v5/orders?created_since=${since}T03:00:00Z&created_until=${until}T02:59:59Z&size=200`,
      { headers: { Authorization: pagarmeAuth() } }
    )
    const d = await r.json()
    return (d.data ?? []) as {status:string;charges:{status:string;amount:number;payment_method:string}[];created_at:string}[]
  }

  const [dayOrders, weekOrders] = await Promise.all([
    getOrders(yesterday, today),
    getOrders(weekStart, today),
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

  return { day: summarize(dayOrders), week: summarize(weekOrders), dayDate: fmt(yesterday) }
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

async function generateCroAnalysis(gsc: GscData, pm: PagarmeData, wc: WcData): Promise<string> {
  const methods = Object.entries(pm.day.methods).map(([k,v])=>`${k}: ${v}`).join(', ')
  const wcDay = wc.day
  const wcWeek = wc.week

  const prompt = `
Analise os dados abaixo do site jaleca.com.br e responda com clareza: o que está impedindo as conversões e o que fazer AGORA.

━━━ TRÁFEGO (GSC) ━━━
Hoje: ${gsc.day.clicks} cliques, CTR ${gsc.day.ctr}%, posição ${gsc.day.position}
Semana: ${gsc.week.clicks} cliques, CTR ${gsc.week.ctr}%

━━━ PAGAMENTOS HOJE (${pm.dayDate}) ━━━
Tentativas: ${pm.day.total} | Aprovados: ${pm.day.paid} | Falharam: ${pm.day.failed} | Pendentes: ${pm.day.pending}
Receita aprovada: R$ ${pm.day.revenue.toFixed(2)} | Receita perdida: R$ ${pm.day.lost.toFixed(2)}
Taxa conversão pagamento: ${pm.day.convRate}%
Métodos: ${methods || 'sem dados'}

━━━ PAGAMENTOS SEMANA ━━━
Tentativas: ${pm.week.total} | Aprovados: ${pm.week.paid} | Receita: R$ ${pm.week.revenue.toFixed(2)}
Taxa conversão semana: ${pm.week.convRate}%

━━━ PEDIDOS WOOCOMMERCE ━━━
Hoje: ${wcDay?.total ?? 'N/A'} pedidos | Receita: R$ ${wcDay?.revenue?.toFixed(2) ?? 'N/A'}
Status hoje: ${wcDay ? Object.entries(wcDay.byStatus).map(([s,c])=>`${s}:${c}`).join(', ') : 'N/A'}
Semana: ${wcWeek?.total ?? 'N/A'} pedidos | Receita: R$ ${wcWeek?.revenue?.toFixed(2) ?? 'N/A'}
Top produtos semana: ${wcWeek?.topProducts?.map(p=>`${p.name.substring(0,30)} (${p.qty}x)`).join(', ') ?? 'N/A'}

━━━ CONTEXTO DO SITE ━━━
- Checkout: /finalizar-compra (Next.js + Pagar.me)
- Público: enfermeiras, médicas, profissionais de saúde
- Ticket médio: ~R$350
- Frete grátis SP/RJ/MG/ES acima de R$499
- PIX com 5% desconto

Responda em 4 blocos:

**1. DIAGNÓSTICO** — Por que não está convertendo? Seja específico com os números.

**2. AÇÕES URGENTES (fazer hoje/amanhã)** — Liste 5 ações prioritárias na página/checkout para aumentar conversão imediatamente. Para cada uma: o que fazer, onde, impacto esperado.

**3. AÇÕES SEMANA** — 3 melhorias de médio prazo que podem dobrar a conversão.

**4. ALERTA** — Algum número fora do padrão que merece atenção?

Máximo 450 palavras. Seja direto como um consultor de e-commerce experiente.
`
  return askGpt(prompt)
}

// ── Email HTML ────────────────────────────────────────────────────────────────

function buildEmail(
  dateStr: string,
  gsc: GscData,
  pm: PagarmeData,
  wc: WcData,
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

  <!-- Footer -->
  <div style="text-align:center;padding:20px;color:#94a3b8;font-size:11px;line-height:1.6">
    Jaleca Daily Report · Enviado automaticamente todo dia às 19h<br>
    Gemini SEO Expert + GPT-4.1 CRO + Google Search Console + Pagar.me + WooCommerce<br>
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
  // Auth — aceita cron secret ou token manual
  const authHeader = request.headers.get('authorization')
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') ?? authHeader?.replace('Bearer ', '')

  if (token !== CRON_SECRET) {
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

    const [gsc, pm, wc] = await Promise.all([
      gscToken ? fetchGsc(gscToken) : Promise.resolve(null),
      fetchPagarme(),
      fetchWc(),
    ])

    console.log(`[daily-report] Dados coletados — GSC: ${gsc?.week.clicks ?? 'N/A'} cliques | Pagar.me: ${pm.day.paid}/${pm.day.total} | WC: ${wc.day?.total ?? 'N/A'}`)

    // IA em paralelo
    const [seoText, croText] = await Promise.all([
      gsc ? generateSeoAnalysis(gsc) : Promise.resolve('Dados GSC indisponíveis.'),
      generateCroAnalysis(gsc!, pm, wc),
    ])

    console.log('[daily-report] Análises de IA geradas')

    const html = buildEmail(dateStr, gsc!, pm, wc, seoText, croText)
    const subject = `📊 Jaleca ${today.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})} — ${pm.day.paid} pedidos aprovados · R$${pm.day.revenue.toFixed(0)} · ${pm.day.convRate}% conv`

    const emailResult = await sendEmail(subject, html)
    console.log('[daily-report] Email enviado:', emailResult)

    return NextResponse.json({
      ok: true,
      date: dateStr,
      gsc: gsc ? { clicks: gsc.week.clicks, position: gsc.week.position } : null,
      pagarme: { paid: pm.day.paid, total: pm.day.total, revenue: pm.day.revenue },
      wc: wc.day ? { orders: wc.day.total, revenue: wc.day.revenue } : null,
      emailSent: !!emailResult.messageId,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('[daily-report] Erro:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
