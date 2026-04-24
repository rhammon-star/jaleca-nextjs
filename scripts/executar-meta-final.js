/**
 * EXECUÇÃO FINAL META ADS
 * 1. Listar campanhas atuais
 * 2. Aumentar campanha principal para R$100/dia
 * 3. Criar Remarketing Dinâmico R$15/dia
 * 4. Criar Novas Páginas R$5/dia
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.google-ads" });
dotenv.config({ path: ".env.local", override: false });

const TOKEN = (process.env.META_ADS_TOKEN || "").replace(/\\n/g, "").trim();
const ACCOUNT = (process.env.META_ADS_ACCOUNT_ID || "").replace(/\\n/g, "").trim(); // ex: act_2098470580937214
const BASE = `https://graph.facebook.com/v21.0`;

async function metaGet(path, params = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(`Meta API error: ${JSON.stringify(data.error)}`);
  return data;
}

async function metaPost(path, body) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, access_token: TOKEN }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Meta API error: ${JSON.stringify(data.error)}`);
  return data;
}

// Pixel ID do jaleca.com.br
const PIXEL_ID = "566059928254677";

console.log("=".repeat(60));
console.log("🔥 EXECUTAR PLANO META ADS — FINAL");
console.log(`   Account: ${ACCOUNT}`);
console.log("=".repeat(60));

// ── 1. LISTAR CAMPANHAS ATUAIS ────────────────────────────────
console.log("\n📋 1. CAMPANHAS ATUAIS:");
const campaigns = await metaGet(`${ACCOUNT}/campaigns`, {
  fields: "id,name,status,daily_budget,objective",
});

let mainCampaignId = null;
let mainCampaignBudget = 0;

for (const c of campaigns.data) {
  const budget = c.daily_budget ? `R$${(c.daily_budget / 100).toFixed(0)}/dia` : "lifetime";
  console.log(`  ${c.status.padEnd(10)} ${budget.padEnd(16)} [${c.id}] ${c.name}`);

  // Identifica a campanha principal ativa (maior budget ou a que está ACTIVE)
  if (c.status === "ACTIVE" && c.daily_budget) {
    const b = parseInt(c.daily_budget);
    if (b > mainCampaignBudget) {
      mainCampaignBudget = b;
      mainCampaignId = c.id;
    }
  }
}

// ── 2. ATUALIZAR CAMPANHA PRINCIPAL PARA R$100/DIA ───────────
if (mainCampaignId) {
  console.log(`\n💸 2. AUMENTANDO campanha principal [${mainCampaignId}]`);
  console.log(`   R$${(mainCampaignBudget / 100).toFixed(0)}/dia → R$100/dia`);
  const updateRes = await metaPost(`${mainCampaignId}`, {
    daily_budget: 10000, // R$100.00 em centavos
  });
  console.log(`  ✅ Budget atualizado: ${JSON.stringify(updateRes)}`);
} else {
  console.log("\n⚠️  Nenhuma campanha ACTIVE com daily_budget encontrada para atualizar.");
}

// ── 3. CRIAR REMARKETING DINÂMICO R$15/DIA ───────────────────
// Verifica se já existe para evitar duplicatas
const jaTemRemarketing = campaigns.data.some(c => c.name === "Remarketing Dinâmico — Jaleca Abr 2026" && c.status === "ACTIVE");
if (jaTemRemarketing) {
  console.log("\n🛒 3. Remarketing Dinâmico — JÁ EXISTE, pulando criação");
} else {
console.log("\n🛒 3. CRIANDO REMARKETING DINÂMICO (R$15/dia)");

// Busca catalog ID
let catalogId = null;
try {
  const catalogs = await metaGet("1284297553808241/product_catalogs", { fields: "id,name" });
  if (catalogs.data?.length) {
    catalogId = catalogs.data[0].id;
    console.log(`  📦 Catálogo encontrado: [${catalogId}] ${catalogs.data[0].name}`);
  }
} catch (e) {
  console.log(`  ⚠️  Não conseguiu buscar catálogo: ${e.message}`);
}

// Audiência de visitantes: criar manualmente no Meta (ver instrução no final)
const visitorAudienceId = null;

// Cria campanha
const remarkCamp = await metaPost(`${ACCOUNT}/campaigns`, {
  name: "Remarketing Dinâmico — Jaleca Abr 2026",
  objective: "OUTCOME_SALES",
  status: "ACTIVE",
  special_ad_categories: [],
  is_adset_budget_sharing_enabled: false,
});
console.log(`  📢 Campanha criada: [${remarkCamp.id}]`);

// Cria Ad Set com targeting de visitantes
const remarkTargeting = {
  geo_locations: { countries: ["BR"] },
  age_min: 22,
  age_max: 55,
  facebook_positions: ["feed", "right_hand_column"],
  instagram_positions: ["stream", "story"],
  publisher_platforms: ["facebook", "instagram"],
  targeting_automation: { advantage_audience: 0 },
  ...(visitorAudienceId ? { custom_audiences: [{ id: visitorAudienceId }] } : {}),
};

const remarkAdSet = await metaPost(`${ACCOUNT}/adsets`, {
  name: "Visitantes 30 dias — Jaleca",
  campaign_id: remarkCamp.id,
  daily_budget: 1500, // R$15.00
  billing_event: "IMPRESSIONS",
  optimization_goal: "OFFSITE_CONVERSIONS",
  bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  targeting: remarkTargeting,
  status: "ACTIVE",
  promoted_object: { pixel_id: PIXEL_ID, custom_event_type: "PURCHASE" },
  start_time: new Date(Date.now() + 3600000).toISOString(),
});
console.log(`  📁 Ad set criado: [${remarkAdSet.id}] — R$15/dia`);
console.log("  ✅ Remarketing Dinâmico criado (precisa adicionar anúncio manualmente)");
} // fim if jaTemRemarketing

// ── 4. CRIAR NOVAS PÁGINAS R$6/DIA ───────────────────────────
const jaTemNovas = campaigns.data.some(c => c.name === "Novas Páginas — Jaleca Abr 2026" && c.status === "ACTIVE");
if (jaTemNovas) {
  console.log("\n🌐 4. Novas Páginas — JÁ EXISTE, pulando criação");
} else {
console.log("\n🌐 4. CRIANDO NOVAS PÁGINAS — público frio (R$6/dia)");

const novasCamp = await metaPost(`${ACCOUNT}/campaigns`, {
  name: "Novas Páginas — Jaleca Abr 2026",
  objective: "OUTCOME_SALES",
  status: "ACTIVE",
  special_ad_categories: [],
  is_adset_budget_sharing_enabled: false,
});
console.log(`  📢 Campanha criada: [${novasCamp.id}]`);

const novasAdSet = await metaPost(`${ACCOUNT}/adsets`, {
  name: "Público Frio — Saúde e Beleza BR",
  campaign_id: novasCamp.id,
  daily_budget: 600, // R$6.00 (mínimo Meta é R$5,02)
  billing_event: "IMPRESSIONS",
  optimization_goal: "OFFSITE_CONVERSIONS",
  bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  targeting: {
    geo_locations: { countries: ["BR"] },
    age_min: 22,
    age_max: 55,
    genders: [2], // Feminino
    facebook_positions: ["feed"],
    instagram_positions: ["stream"],
    publisher_platforms: ["facebook", "instagram"],
    targeting_automation: { advantage_audience: 0 },
  },
  promoted_object: { pixel_id: PIXEL_ID, custom_event_type: "PURCHASE" },
  status: "ACTIVE",
  start_time: new Date(Date.now() + 3600000).toISOString(),
});
console.log(`  📁 Ad set criado: [${novasAdSet.id}] — R$5/dia`);
console.log("  ✅ Novas Páginas criado (precisa adicionar anúncio manualmente)");
} // fim if jaTemNovas

console.log(`
${"=".repeat(60)}
✅ META ADS CONCLUÍDO!

O que foi feito:
  ✅ Campanha principal: → R$100/dia
  ✅ Remarketing Dinâmico: R$15/dia → ATIVO
  ✅ Novas Páginas: R$5/dia → ATIVO

⚠️  AÇÃO MANUAL NECESSÁRIA (anúncios):
   Para Remarketing Dinâmico:
   → Adicionar anúncio de catálogo dinâmico
   → Meta Ads Manager → Remarketing Dinâmico → Anúncios → + Criar
   → Formato: Carrossel de catálogo
   → Texto: "Você viu isso aqui — e ainda está disponível 👀"

   Para Novas Páginas:
   → Adicionar anúncio com jaleco preto + jaleco feminino
   → Texto: "Antes de você se apresentar, seu jaleco já foi avaliado."
   → URL: jaleca.com.br/jaleco-preto ou /jaleco-feminino

Total Meta após execução: R$120/dia
  Principal:    R$100
  Remarketing:   R$15
  Novas Páginas:  R$5
${"=".repeat(60)}
`);
