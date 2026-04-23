/**
 * Continuar criação: RSA campanha 4 + campanha 5 + ativar todas
 * Campanhas 1-3 já criadas (pausadas) pela execução anterior.
 * Campanha 4: budget+campaign+adGroup+keywords já criados, faltou RSA.
 */

import { GoogleAdsApi, enums } from "google-ads-api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.google-ads" });

const client = new GoogleAdsApi({
  client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id:       process.env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

function micro(reais) { return Math.round(reais * 1_000_000); }
const RUN_ID = Date.now();

function parseRes(result) {
  if (Array.isArray(result)) return result[0];
  if (result?.results?.[0]?.resource_name) return result.results[0].resource_name;
  return result;
}

// Resource names das execuções anteriores
const C1 = "customers/4446591621/campaigns/23782138685";
const C2 = "customers/4446591621/campaigns/23776847442";
const C3 = "customers/4446591621/campaigns/23782139438";
const C4 = "customers/4446591621/campaigns/23782140383";
const C4_ADGROUP = "customers/4446591621/adGroups/196041671419";

async function createRSA(adGroupRes, headlines, descriptions, finalUrl, path1 = "jalecos", path2 = "") {
  const toAsset = (texts) => texts.map(text => ({ text }));
  await customer.adGroupAds.create([{
    ad_group: adGroupRes,
    status: enums.AdGroupAdStatus.ENABLED,
    ad: {
      final_urls: [finalUrl],
      responsive_search_ad: {
        headlines: toAsset(headlines),
        descriptions: toAsset(descriptions),
        path1,
        path2: path2 || undefined,
      },
    },
  }]);
  console.log(`  ✅ RSA criado → ${finalUrl}`);
}

async function createBudget(name, amountPerDay) {
  const result = await customer.campaignBudgets.create([{
    name: `${name} — Budget ${RUN_ID}`,
    amount_micros: micro(amountPerDay),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
  }]);
  const res = parseRes(result);
  console.log(`  💰 Budget "${name}": R$${amountPerDay}/dia → ${res}`);
  return res;
}

async function createSearchCampaign(name, budgetRes) {
  const result = await customer.campaigns.create([{
    name: `${name} ${RUN_ID}`,
    advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
    status: enums.CampaignStatus.PAUSED,
    campaign_budget: budgetRes,
    manual_cpc: { enhanced_cpc_enabled: false },
    network_settings: {
      target_google_search:   true,
      target_search_network:  false,
      target_content_network: false,
    },
    geo_target_type_setting: {
      positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
    },
    contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
  }]);
  const res = parseRes(result);
  console.log(`  📢 Campanha "${name}" → ${res}`);
  return res;
}

async function targetBrasil(campaignRes) {
  await customer.campaignCriteria.create([{
    campaign: campaignRes,
    location: { geo_target_constant: "geoTargetConstants/1001548" },
  }]);
}

async function createAdGroup(label, campaignRes, cpcMax) {
  const result = await customer.adGroups.create([{
    name: label,
    campaign: campaignRes,
    status: enums.AdGroupStatus.ENABLED,
    type: enums.AdGroupType.SEARCH_STANDARD,
    cpc_bid_micros: micro(cpcMax),
  }]);
  const res = parseRes(result);
  console.log(`  📁 Grupo "${label}" → ${res}`);
  return res;
}

async function addKeywords(adGroupRes, keywords) {
  const criteria = keywords.map(({ text, matchType, cpc }) => ({
    ad_group: adGroupRes,
    status: enums.AdGroupCriterionStatus.ENABLED,
    keyword: { text, match_type: enums.KeywordMatchType[matchType] },
    ...(cpc ? { cpc_bid_micros: micro(cpc) } : {}),
  }));
  await customer.adGroupCriteria.create(criteria);
  console.log(`    ✅ ${keywords.length} keywords adicionadas`);
}

async function addNegativeKeyword(adGroupRes, text, matchType = "PHRASE") {
  await customer.adGroupCriteria.create([{
    ad_group: adGroupRes,
    status: enums.AdGroupCriterionStatus.ENABLED,
    negative: true,
    keyword: { text, match_type: enums.KeywordMatchType[matchType] },
  }]);
}

async function ativarCampanha(campRes) {
  await customer.campaigns.update([{
    resource_name: campRes,
    status: enums.CampaignStatus.ENABLED,
  }]);
  console.log(`  🚀 Ativada: ${campRes}`);
}

async function main() {
  console.log("=".repeat(60));
  console.log("🔧 CONTINUANDO: RSA C4 + CAMPANHA 5 + ATIVAR TUDO");
  console.log("=".repeat(60));

  // ── C4: só RSA (budget+campaign+adGroup+keywords já existem) ──
  console.log("\n💎 CAMPANHA 4 — RSA Jaleco Premium");
  await createRSA(
    C4_ADGROUP,
    [
      "Jaleco Premium — Jaleca",
      "Tecido e Acabamento Superior",
      "Para Quem Exige Qualidade",
      "Gabardine 165g/m² com Elastano",
      "Visual que Fala Antes de Você",
      "Jaleco Que Dura Anos",
      "Parcele em 10x Sem Juros",
      "Frete Grátis no Sudeste R$499+",
      "PP ao G3 — Molde Exclusivo",
    ],
    [
      "Gabardine 165 g/m² com elastano bidirecional. Acabamento superior para profissionais.",
      "Dura 200+ lavagens. Troca em 30 dias. Frete grátis no Sudeste acima de R$499.",
    ],
    "https://jaleca.com.br/jaleco-premium",
    "jaleco",
    "premium"
  );

  // ── C5: completa ──────────────────────────────────────────────
  console.log("\n🛒 CAMPANHA 5 — COMPRAR JALECO ONLINE (R$10/dia)");
  const budget5   = await createBudget("Jaleca - Comprar Jaleco", 10);
  const campaign5 = await createSearchCampaign("Jaleca - Comprar Jaleco Online", budget5);
  await targetBrasil(campaign5);

  const grp5 = await createAdGroup("Comprar Jaleco", campaign5, 1.3);
  await addKeywords(grp5, [
    { text: "comprar jaleco",             matchType: "EXACT",  cpc: 1.3 },
    { text: "comprar jaleco",             matchType: "PHRASE", cpc: 1.1 },
    { text: "comprar jaleco online",      matchType: "EXACT",  cpc: 1.3 },
    { text: "comprar jaleco feminino",    matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco preço",               matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco profissional comprar",matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco com entrega rápida",  matchType: "PHRASE", cpc: 0.9 },
  ]);
  await createRSA(
    grp5,
    [
      "Comprar Jaleco Online — Jaleca",
      "Entrega Rápida — Todo Brasil",
      "PIX com 5% de Desconto",
      "Mais de 30 Modelos Disponíveis",
      "Parcele em 10x Sem Juros",
      "Frete Grátis no Sudeste R$499+",
      "PP ao G3 — Grade Completa",
      "Compra Segura · Troca 30 Dias",
      "Jaleco Que Dura o Turno Todo",
    ],
    [
      "Compre com segurança. PIX 5% de desconto, parcele em 10x ou frete grátis no Sudeste.",
      "30 modelos para saúde, beleza e gastronomia. Entrega rápida. Troca fácil 30 dias.",
    ],
    "https://jaleca.com.br/comprar-jaleco-online",
    "comprar",
    "jaleco"
  );
  await addNegativeKeyword(grp5, "infantil");
  await addNegativeKeyword(grp5, "grátis", "EXACT");
  await addNegativeKeyword(grp5, "receita", "PHRASE");

  // ── ATIVAR TODAS (incluindo C1-C3 criadas anteriormente) ──────
  console.log("\n🚀 Ativando todas as 5 campanhas...");
  for (const c of [C1, C2, C3, C4, campaign5]) {
    await ativarCampanha(c);
  }

  console.log(`
${"=".repeat(60)}
✅ TUDO PRONTO!

Campanhas ativas:
  C1 Jaleco Feminino+Slim → R$20/dia
  C2 Loja de Jaleco       → R$15/dia
  C3 Jaleco Preto         → R$10/dia
  C4 Jaleco Premium       → R$10/dia
  C5 Comprar Jaleco       → R$10/dia
  TOTAL NOVAS             → R$65/dia

⚠️  LIMPEZA MANUAL NO GOOGLE ADS:
  - Excluir budgets/campanhas PAUSADAS duplicadas
    (criadas pelas tentativas anteriores com falha)
  - Confirmar que as 5 campanhas acima estão ENABLED

⚠️  AÇÕES RESTANTES:
  1. Core - Jalecos: remover keywords "jaleco feminino"
     e "jaleco slim" (sobreposição com C1)
  2. Shopping: destino → /categoria/jalecos-femininos
  3. Ativar "Dia das Mães" em 28/04
${"=".repeat(60)}
  `);
}

main().catch(err => {
  console.error("\n❌ ERRO:", err.message ?? err);
  if (err.errors) for (const e of err.errors) console.error(" →", JSON.stringify(e, null, 2));
  process.exit(1);
});
