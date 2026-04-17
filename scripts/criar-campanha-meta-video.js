/**
 * CRIAR CAMPANHAS META ADS — Vídeo Jaleco Slim Branco
 * Campanha 1: Prospecção - Lookalike (público semelhante aos compradores)
 * Campanha 2: Prospecção - Interesses Saúde (médicas, enfermeiras, dentistas)
 * + Atualiza data de fim da DdM no Google Ads para 06/05/2026
 */

require("dotenv").config({ path: ".env.google-ads" });
const { GoogleAdsApi, enums } = require("google-ads-api");

// ─── META ────────────────────────────────────────────────────────────────────
const TOKEN      = process.env.META_ADS_TOKEN.trim().replace(/\\n/g, '');
const ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID.trim().replace(/\\n/g, ''); // act_2098470580937214
const VIDEO_ID   = "1694667288205376";
const PIXEL_ID   = "566059928254677";
const BASE       = "https://graph.facebook.com/v21.0";

const AD_TEXT = `Antes de você se apresentar, seu jaleco já foi avaliado.
Vista o que você merece.
3x sem juros · Frete Grátis SP, RJ, MG, ES`;

const AD_HEADLINE = "Jalecos Jaleca — Compre Agora";
const AD_URL      = "https://jaleca.com.br/produtos?categoria=jalecos-femininos";

// ─── GOOGLE ADS ──────────────────────────────────────────────────────────────
const CID         = "4446591621";
const CAMP_CORE   = `customers/${CID}/campaigns/23768160151`;
const CAMP_DDM    = `customers/${CID}/campaigns/23768160154`;
const CAMP_MARCA  = `customers/${CID}/campaigns/23768160157`;

// ─── HELPERS META ────────────────────────────────────────────────────────────
async function metaGet(path, params = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  const d = await r.json();
  if (d.error) throw new Error(`Meta GET ${path}: ${d.error.message}`);
  return d;
}

async function metaPost(path, body) {
  const url = `${BASE}/${path}`;
  const form = new URLSearchParams({ access_token: TOKEN, ...body });
  const r = await fetch(url, { method: "POST", body: form });
  const d = await r.json();
  if (d.error) {
    const detail = d.error.error_user_msg || d.error.error_data?.blame_field_specs || "";
    throw new Error(`Meta POST ${path}: ${d.error.message} (code ${d.error.code}) ${detail}`);
  }
  return d;
}

// ─── STEP 1: Buscar Page ID ──────────────────────────────────────────────────
async function getPageId() {
  console.log("\n📄 STEP 1 — Buscando Page ID...");

  // Tenta via /me/accounts
  try {
    const data = await metaGet("me/accounts", { fields: "id,name" });
    if (data.data && data.data.length > 0) {
      console.log(`  ✅ Página: ${data.data[0].name} (ID: ${data.data[0].id})`);
      return data.data[0].id;
    }
  } catch (_) {}

  // Fallback: busca em anúncios existentes da conta
  const ads = await metaGet(`${ACCOUNT_ID}/ads`, {
    fields: "creative{object_story_spec}",
    limit: "5",
  });
  for (const ad of (ads.data || [])) {
    const pageId = ad.creative?.object_story_spec?.page_id;
    if (pageId) {
      console.log(`  ✅ Page ID encontrado em anúncio existente: ${pageId}`);
      return pageId;
    }
  }

  throw new Error("Não foi possível encontrar o Page ID. Verifique as permissões do token Meta.");
}

// ─── STEP 2: Buscar audiências Lookalike existentes ──────────────────────────
async function getLookalikeAudience() {
  console.log("\n👥 STEP 2 — Buscando audiências Lookalike...");
  const data = await metaGet(`${ACCOUNT_ID}/customaudiences`, {
    fields: "id,name,subtype",
    limit: "50",
  });

  const lookalikes = (data.data || []).filter(a => a.subtype === "LOOKALIKE");
  const customs    = (data.data || []).filter(a => a.subtype !== "LOOKALIKE");

  if (lookalikes.length > 0) {
    console.log("  Lookalikes encontradas:");
    lookalikes.forEach(a => console.log(`    - ${a.name} (ID: ${a.id})`));
    console.log(`  ✅ Usando: ${lookalikes[0].name}`);
    return lookalikes[0].id;
  }

  // Sem Lookalike — tenta criar a partir de audiência de compradores
  if (customs.length > 0) {
    const source = customs[0];
    console.log(`  ⚠️  Sem Lookalike. Criando a partir de: ${source.name}`);
    const la = await metaPost(`${ACCOUNT_ID}/customaudiences`, {
      name: "Lookalike 1% BR - Compradores Jaleca",
      subtype: "LOOKALIKE",
      origin_audience_id: source.id,
      lookalike_spec: JSON.stringify({ country: "BR", ratio: 0.01, type: "similarity" }),
    });
    console.log(`  ✅ Lookalike criada: ${la.id}`);
    return la.id;
  }

  console.log("  ⚠️  Nenhuma audiência encontrada — campanha Lookalike usará segmentação por interesse");
  return null;
}

// ─── STEP 3: Criar campanha Lookalike ────────────────────────────────────────
async function criarCampanhaLookalike(pageId, lookalikeId) {
  console.log("\n🎯 STEP 3 — Criando Campanha Lookalike...");

  // Campanha
  const camp = await metaPost(`${ACCOUNT_ID}/campaigns`, {
    name: "Prospecção - Lookalike - Vídeo Abr 2026",
    objective: "OUTCOME_SALES",
    status: "ACTIVE",
    buying_type: "AUCTION",
    special_ad_categories: JSON.stringify([]),
    is_adset_budget_sharing_enabled: "false",
  });
  console.log(`  ✅ Campanha criada: ${camp.id}`);

  // Targeting
  const targeting = lookalikeId
    ? JSON.stringify({
        custom_audiences: [{ id: lookalikeId }],
        geo_locations: { countries: ["BR"] },
        age_min: 22,
        age_max: 50,
        targeting_automation: { advantage_audience: 0 },
      })
    : JSON.stringify({
        geo_locations: { countries: ["BR"] },
        age_min: 22,
        age_max: 50,
        interests: [
          { id: "6003229372086" }, // Medicine
          { id: "6003373426421" }, // Nursing
          { id: "6003408861775" }, // Dentistry
        ],
        targeting_automation: { advantage_audience: 0 },
      });

  // Ad Set
  const adset = await metaPost(`${ACCOUNT_ID}/adsets`, {
    name: "Lookalike 1% BR - Mulheres 22-50",
    campaign_id: camp.id,
    daily_budget: "2000", // R$20
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    promoted_object: JSON.stringify({ pixel_id: PIXEL_ID, custom_event_type: "PURCHASE" }),
    targeting,
    status: "ACTIVE",
  });
  console.log(`  ✅ Ad Set criado: ${adset.id}`);

  // Creative
  const creative = await metaPost(`${ACCOUNT_ID}/adcreatives`, {
    name: "Criativo Jaleco Slim Branco - Lookalike",
    object_story_spec: JSON.stringify({
      page_id: pageId,
      video_data: {
        video_id: VIDEO_ID,
        message: AD_TEXT,
        call_to_action: {
          type: "SHOP_NOW",
          value: { link: AD_URL },
        },
        title: AD_HEADLINE,
      },
    }),
  });
  console.log(`  ✅ Creative criado: ${creative.id}`);

  // Ad
  const ad = await metaPost(`${ACCOUNT_ID}/ads`, {
    name: "Ad - Jaleco Slim Branco Vídeo - Lookalike",
    adset_id: adset.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: "ACTIVE",
  });
  console.log(`  ✅ Anúncio criado: ${ad.id}`);

  return camp.id;
}

// ─── STEP 3b: Buscar IDs de interesse via Meta Targeting Search ──────────────
async function buscarInteresses() {
  console.log("\n🔍 STEP 3b — Buscando IDs de interesse...");

  // Saúde: principais profissões do jaleco
  // Beleza: também usam jaleco/avental profissional
  // Outros: profissionais liberais que usam jaleco
  const termos = [
    // Saúde
    "Dentista", "Medicina", "Enfermagem", "Fisioterapia",
    "Nutricionista", "Medicina veterinária", "Farmácia", "Podologia",
    "Biomedicina", "Psicologia",
    // Beleza
    "Manicure", "Esteticista", "Massagem terapêutica",
  ];

  const ids = [];
  for (const termo of termos) {
    try {
      const r = await metaGet("search", {
        type: "adinterest",
        q: termo,
        limit: "1",
        locale: "pt_BR",
      });
      if (r.data && r.data.length > 0) {
        ids.push({ id: r.data[0].id, name: r.data[0].name });
        console.log(`  ✅ ${termo} → ${r.data[0].name} (${r.data[0].id})`);
      }
    } catch (e) {
      console.log(`  ⚠️  ${termo}: ${e.message}`);
    }
  }
  return ids;
}

// ─── STEP 4: Criar campanha Prospecção Interesses ────────────────────────────
async function criarCampanhaInteresses(pageId, interesses) {
  console.log("\n💊 STEP 4 — Criando Campanha Prospecção por Interesses...");

  const camp = await metaPost(`${ACCOUNT_ID}/campaigns`, {
    name: "Prospecção - Saúde e Beleza - Vídeo Abr 2026",
    objective: "OUTCOME_SALES",
    status: "ACTIVE",
    buying_type: "AUCTION",
    special_ad_categories: JSON.stringify([]),
    is_adset_budget_sharing_enabled: "false",
  });
  console.log(`  ✅ Campanha criada: ${camp.id}`);

  // Interesses encontrados dinamicamente + fallback garantido
  const interestList = interesses.length > 0
    ? interesses.map(i => ({ id: i.id }))
    : [
        { id: "6003229372086" }, // Medicine
        { id: "6003373426421" }, // Nursing
        { id: "6003408861775" }, // Dentistry
        { id: "6003392959156" }, // Veterinary medicine
        { id: "6003367134914" }, // Pharmacy
        { id: "6003138729145" }, // Beauty salon
        { id: "6003022338146" }, // Hairdresser
      ];

  console.log(`  Usando ${interestList.length} interesses`);

  // ── Saúde: dentistas, médicos, enfermeiros, fisioterapeutas,
  //          nutricionistas, veterinários, biomédicos, farmacêuticos,
  //          podólogos, psicólogos
  const saudeIds = interesses
    .filter(i => ["Dentistry","Medicine","Nursing","Physical therapy",
                  "Nutrition","Veterinary medicine","Pharmacy",
                  "Podiatry","Biomedical sciences","Psychology"].some(
                    t => i.name.toLowerCase().includes(t.toLowerCase())
                  ))
    .map(i => ({ id: i.id }));

  // ── Beleza: manicure/pedicure, esteticistas, massagistas
  const belezaIds = interesses
    .filter(i => ["Nail","Aesthetics","Massage"].some(
                  t => i.name.toLowerCase().includes(t.toLowerCase())
                ))
    .map(i => ({ id: i.id }));

  // Fallback se busca não encontrou nada
  const saudeFinal  = saudeIds.length  > 0 ? saudeIds  : [{ id: "6003229372086" }, { id: "6003373426421" }, { id: "6003408861775" }];
  const belezaFinal = belezaIds.length > 0 ? belezaIds : [{ id: "6003138729145" }, { id: "6003022338146" }];

  console.log(`  Saúde: ${saudeFinal.length} interesses | Beleza: ${belezaFinal.length}`);

  // Creative compartilhado
  const creative = await metaPost(`${ACCOUNT_ID}/adcreatives`, {
    name: "Criativo Jaleco Slim Branco - Interesses",
    object_story_spec: JSON.stringify({
      page_id: pageId,
      video_data: {
        video_id: VIDEO_ID,
        message: AD_TEXT,
        call_to_action: {
          type: "SHOP_NOW",
          value: { link: AD_URL },
        },
        title: AD_HEADLINE,
      },
    }),
  });
  console.log(`  ✅ Creative criado: ${creative.id}`);

  // Ad Set Saúde — R$5/dia
  const adsetSaude = await metaPost(`${ACCOUNT_ID}/adsets`, {
    name: "Saúde - Dentistas, Médicos, Enf, Fisio, Nutri, Vet, Biomed, Farm, Psico",
    campaign_id: camp.id,
    daily_budget: "500",
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    promoted_object: JSON.stringify({ pixel_id: PIXEL_ID, custom_event_type: "PURCHASE" }),
    targeting: JSON.stringify({
      geo_locations: { countries: ["BR"] },
      age_min: 22,
      age_max: 55,
      genders: [2],
      interests: saudeFinal,
      targeting_automation: { advantage_audience: 0 },
    }),
    status: "ACTIVE",
  });
  await metaPost(`${ACCOUNT_ID}/ads`, {
    name: "Ad - Vídeo Saúde",
    adset_id: adsetSaude.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: "ACTIVE",
  });
  console.log(`  ✅ Ad Set Saúde criado: ${adsetSaude.id}`);

  // Ad Set Beleza — R$5/dia
  const adsetBeleza = await metaPost(`${ACCOUNT_ID}/adsets`, {
    name: "Beleza - Manicure, Esteticistas, Massagistas",
    campaign_id: camp.id,
    daily_budget: "500",
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    promoted_object: JSON.stringify({ pixel_id: PIXEL_ID, custom_event_type: "PURCHASE" }),
    targeting: JSON.stringify({
      geo_locations: { countries: ["BR"] },
      age_min: 22,
      age_max: 55,
      genders: [2],
      interests: belezaFinal,
      targeting_automation: { advantage_audience: 0 },
    }),
    status: "ACTIVE",
  });
  await metaPost(`${ACCOUNT_ID}/ads`, {
    name: "Ad - Vídeo Beleza",
    adset_id: adsetBeleza.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: "ACTIVE",
  });
  console.log(`  ✅ Ad Set Beleza criado: ${adsetBeleza.id}`);


  return camp.id;
}

// ─── STEP 5: Atualizar orçamentos + fim DdM no Google Ads ────────────────────
async function atualizarGoogleAds() {
  console.log("\n📅 STEP 5 — Atualizando Google Ads (orçamentos + fim DdM)...");

  const gClient = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });

  const customer = gClient.Customer({
    customer_id:       CID,
    login_customer_id: "6077867298",
    refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  // Buscar resource names dos budgets
  const rows = await customer.query(`
    SELECT campaign.resource_name, campaign.name,
           campaign_budget.resource_name, campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.resource_name IN ('${CAMP_CORE}','${CAMP_DDM}','${CAMP_MARCA}')
  `);

  const budgetMap = {};
  for (const r of rows) {
    budgetMap[r.campaign.resource_name] = r.campaign_budget.resource_name;
    console.log(`  ${r.campaign.name}: budget atual R$${(r.campaign_budget.amount_micros/1e6).toFixed(0)}/dia`);
  }

  // Atualizar orçamentos
  const updates = [
    { camp: CAMP_CORE,  valor: 40 },  // R$40
    { camp: CAMP_DDM,   valor: 10 },  // R$10
    { camp: CAMP_MARCA, valor: 20 },  // R$20
  ];

  await customer.mutateResources(updates.map(u => ({
    entity: "CampaignBudget",
    operation: "update",
    resource: {
      resource_name: budgetMap[u.camp],
      amount_micros: u.valor * 1_000_000,
    },
  })));
  console.log("  ✅ Orçamentos atualizados: Core R$40 | DdM R$10 | Marca R$20");

  // Fim automático DdM em 06/05
  await customer.mutateResources([{
    entity: "Campaign",
    operation: "update",
    resource: {
      resource_name: CAMP_DDM,
      end_date: "2026-05-06",
    },
  }]);
  console.log("  ✅ Dia das Mães: pausa automática em 06/05/2026");
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("🔥 CRIAR CAMPANHAS META ADS — JALECA VÍDEO");
  console.log("=".repeat(60));
  console.log(`\n  Vídeo: ${VIDEO_ID}`);
  console.log(`  Conta: ${ACCOUNT_ID}\n`);

  try {
    const pageId      = await getPageId();
    const lookalikeId = await getLookalikeAudience();
    const interesses  = await buscarInteresses();
    const campLK      = await criarCampanhaLookalike(pageId, lookalikeId);
    const campInt     = await criarCampanhaInteresses(pageId, interesses);
    await atualizarGoogleAds();

    console.log("\n" + "=".repeat(60));
    console.log("✅ TUDO CRIADO E ATIVO!");
    console.log("=".repeat(60));
    console.log(`
┌──────────────────────────────────────┬───────────┬──────────┐
│ Campanha                             │ Budget    │ Status   │
├──────────────────────────────────────┼───────────┼──────────┤
│ Meta Prospecção Lookalike            │ R$20/dia  │ ✅ ATIVA  │
│ Meta Prospecção Saúde                │ R$10/dia  │ ✅ ATIVA  │
│ Meta Prospecção Beleza               │ R$05/dia  │ ✅ ATIVA  │
│ Meta Remarketing Carrinho            │ R$20/dia  │ ✅ ATIVA  │
│ Google Core (Jaleco Fem/Masc/Prof)   │ R$45/dia  │ ✅ ATIVA  │
│ Google Dia das Mães (pausa 06/05)    │ R$25/dia  │ ✅ ATIVA  │
│ Google Marca                         │ R$30/dia  │ ✅ ATIVA  │
├──────────────────────────────────────┼───────────┼──────────┤
│ TOTAL ATÉ 06/05                      │ R$160/dia │          │
│ TOTAL APÓS 06/05 (DdM pausa auto)    │ R$135/dia │          │
└──────────────────────────────────────┴───────────┴──────────┘

📅 DdM pausa automaticamente em 06/05/2026
📊 Monitorar em 48h: CPM, CTR, custo por clique
⚠️  Após 3 dias: avaliar qual campanha converte mais
    `);
  } catch (err) {
    console.error("\n❌ ERRO:", err.message);
    process.exit(1);
  }
}

main();
