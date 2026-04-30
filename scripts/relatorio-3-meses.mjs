import { GoogleAdsApi } from "google-ads-api";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: ".env.google-ads" });
dotenv.config({ path: ".env.local", override: false });

const hoje = new Date();
const inicio = new Date(hoje);
inicio.setMonth(inicio.getMonth() - 3);
const dataInicio = inicio.toISOString().split("T")[0];
const dataFim = hoje.toISOString().split("T")[0];

console.log(`\n📅 Período: ${dataInicio} → ${dataFim}\n`);

// ─── GOOGLE ADS ───────────────────────────────────────────────────────────────
let googleResumo = {};
try {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });
  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  const rows = await customer.query(`
    SELECT
      campaign.name,
      campaign.status,
      metrics.cost_micros,
      metrics.clicks,
      metrics.impressions,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc
    FROM campaign
    WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
      AND campaign.status IN ('ENABLED','PAUSED')
    ORDER BY metrics.cost_micros DESC
  `);

  let totalGasto = 0, totalCliques = 0, totalImpressoes = 0, totalConversoes = 0;
  const campanhas = [];

  for (const r of rows) {
    const gasto = (r.metrics.cost_micros || 0) / 1e6;
    const cliques = r.metrics.clicks || 0;
    const impressoes = r.metrics.impressions || 0;
    const conversoes = r.metrics.conversions || 0;
    const ctr = ((r.metrics.ctr || 0) * 100).toFixed(2);
    const cpc = ((r.metrics.average_cpc || 0) / 1e6).toFixed(2);

    totalGasto += gasto;
    totalCliques += cliques;
    totalImpressoes += impressoes;
    totalConversoes += conversoes;

    campanhas.push({ nome: r.campaign.name, status: r.campaign.status, gasto: gasto.toFixed(2), cliques, impressoes, conversoes, ctr, cpc });
  }

  googleResumo = { totalGasto: totalGasto.toFixed(2), totalCliques, totalImpressoes, totalConversoes, campanhas };

  console.log("═══ GOOGLE ADS ══════════════════════════════════════");
  console.log(`💰 Gasto total:    R$ ${totalGasto.toFixed(2)}`);
  console.log(`🖱  Cliques:        ${totalCliques.toLocaleString("pt-BR")}`);
  console.log(`👁  Impressões:     ${totalImpressoes.toLocaleString("pt-BR")}`);
  console.log(`🎯 Conversões:     ${totalConversoes}`);
  console.log("\nCampanhas:");
  for (const c of campanhas) {
    console.log(`  [${c.status}] ${c.nome}`);
    console.log(`    Gasto: R$${c.gasto} | Cliques: ${c.cliques} | CTR: ${c.ctr}% | CPC médio: R$${c.cpc} | Conversões: ${c.conversoes}`);
  }
} catch (e) {
  console.error("❌ Google Ads erro:", e.message);
  googleResumo = { erro: e.message };
}

// ─── META ADS ─────────────────────────────────────────────────────────────────
let metaResumo = {};
try {
  const token = process.env.META_ADS_TOKEN;
  const account = (process.env.META_ADS_ACCOUNT_ID || "").trim();

  const url = `https://graph.facebook.com/v21.0/${account}/insights?fields=campaign_name,spend,clicks,impressions,actions,ctr,cpc&time_range={"since":"${dataInicio}","until":"${dataFim}"}&level=campaign&limit=50&access_token=${token}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.error) throw new Error(JSON.stringify(json.error));

  let totalGasto = 0, totalCliques = 0, totalImpressoes = 0, totalCompras = 0;
  const campanhas = [];

  for (const d of json.data || []) {
    const gasto = parseFloat(d.spend || 0);
    const cliques = parseInt(d.clicks || 0);
    const impressoes = parseInt(d.impressions || 0);
    const compras = (d.actions || []).find(a => a.action_type === "purchase")?.value || 0;
    const ctr = parseFloat(d.ctr || 0).toFixed(2);
    const cpc = parseFloat(d.cpc || 0).toFixed(2);

    totalGasto += gasto;
    totalCliques += cliques;
    totalImpressoes += impressoes;
    totalCompras += parseInt(compras);

    campanhas.push({ nome: d.campaign_name, gasto: gasto.toFixed(2), cliques, impressoes, compras, ctr, cpc });
  }

  metaResumo = { totalGasto: totalGasto.toFixed(2), totalCliques, totalImpressoes, totalCompras, campanhas };

  console.log("\n═══ META ADS ════════════════════════════════════════");
  console.log(`💰 Gasto total:    R$ ${totalGasto.toFixed(2)}`);
  console.log(`🖱  Cliques:        ${totalCliques.toLocaleString("pt-BR")}`);
  console.log(`👁  Impressões:     ${totalImpressoes.toLocaleString("pt-BR")}`);
  console.log(`🛒 Compras:        ${totalCompras}`);
  console.log("\nCampanhas:");
  for (const c of campanhas) {
    console.log(`  ${c.nome}`);
    console.log(`    Gasto: R$${c.gasto} | Cliques: ${c.cliques} | CTR: ${c.ctr}% | CPC médio: R$${c.cpc} | Compras: ${c.compras}`);
  }
} catch (e) {
  console.error("❌ Meta Ads erro:", e.message);
  metaResumo = { erro: e.message };
}

// ─── GA4 (sessões orgânicas vs pago) ─────────────────────────────────────────
let ga4Resumo = {};
try {
  const rawJson = process.env.GA4_SERVICE_ACCOUNT_JSON
    .replace(/\\n/g, "\n")   // escaped newlines (private key)
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    // Strip control characters that are invalid outside JSON string literals
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  const credJson = JSON.parse(rawJson);
  const propertyId = process.env.GA4_PROPERTY_ID;

  // JWT para Google OAuth
  const { google } = await import("googleapis");
  const auth = new google.auth.GoogleAuth({
    credentials: credJson,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  const analyticsData = google.analyticsdata({ version: "v1beta", auth });

  const report = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: dataInicio, endDate: dataFim }],
      dimensions: [{ name: "sessionDefaultChannelGrouping" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "conversions" },
        { name: "totalRevenue" },
      ],
    },
  });

  const canais = [];
  for (const row of report.data.rows || []) {
    canais.push({
      canal: row.dimensionValues[0].value,
      sessoes: row.metricValues[0].value,
      usuarios: row.metricValues[1].value,
      conversoes: row.metricValues[2].value,
      receita: parseFloat(row.metricValues[3].value).toFixed(2),
    });
  }
  ga4Resumo = { canais };

  console.log("\n═══ GA4 — CANAIS DE TRÁFEGO ═════════════════════════");
  for (const c of canais) {
    console.log(`  ${c.canal.padEnd(25)} Sessões: ${String(c.sessoes).padStart(6)} | Conversões: ${c.conversoes} | Receita: R$${c.receita}`);
  }
} catch (e) {
  console.error("❌ GA4 erro:", e.message);
  ga4Resumo = { erro: e.message };
}

// ─── ANÁLISE GPT ──────────────────────────────────────────────────────────────
console.log("\n⏳ Enviando dados para análise GPT-4o...\n");

try {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Você é um especialista em marketing digital e e-commerce. Analise os dados de mídia paga dos últimos 3 meses da Jaleca (loja de jalecos/uniformes médicos no Brasil) e forneça:

1. **Resumo executivo** (3 bullets principais)
2. **Eficiência por plataforma** — qual está performando melhor (custo x resultado)?
3. **Alertas** — campanhas com alto gasto e baixo retorno, CTR abaixo do mercado (Google <5%, Meta <1%), CPC elevado
4. **Oportunidades** — onde escalar ou realocar budget
5. **Recomendação de ação imediata** (top 3 ações concretas)

---

DADOS GOOGLE ADS:
${JSON.stringify(googleResumo, null, 2)}

DADOS META ADS:
${JSON.stringify(metaResumo, null, 2)}

DADOS GA4 (canais de tráfego):
${JSON.stringify(ga4Resumo, null, 2)}

Período analisado: ${dataInicio} a ${dataFim}
Responda em português, de forma objetiva e prática.`;

  const resp = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  console.log("═══ ANÁLISE CLAUDE (IA) ═════════════════════════════");
  console.log(resp.content[0].text);
} catch (e) {
  console.error("❌ IA erro:", e.message);
}
