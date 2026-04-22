/**
 * Cria campanha "Jaleca - Jaleco Slim Feminino" usando mutateResources
 * Budget: R$10/dia | Data: 20/04/2026
 */
const { GoogleAdsApi, enums } = require("google-ads-api");
require("dotenv").config({ path: ".env.google-ads" });

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

const CID   = process.env.GOOGLE_ADS_CUSTOMER_ID;
const micro = (r) => Math.round(r * 1_000_000);
const PHRASE = enums.KeywordMatchType.PHRASE;
const EXACT  = enums.KeywordMatchType.EXACT;

async function main() {
  console.log("Criando campanha Jaleco Slim Feminino...");

  const result = await customer.mutateResources([
    // Budget
    { entity: "CampaignBudget", operation: "create", resource: {
      resource_name: `customers/${CID}/campaignBudgets/-1`,
      name: "Budget - Jaleco Slim Feminino",
      amount_micros: micro(10),
      delivery_method: enums.BudgetDeliveryMethod.STANDARD,
      explicitly_shared: false,
    }},
    // Campanha
    { entity: "Campaign", operation: "create", resource: {
      resource_name: `customers/${CID}/campaigns/-2`,
      name: "Jaleca - Jaleco Slim Feminino",
      status: enums.CampaignStatus.ENABLED,
      advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
      campaign_budget: `customers/${CID}/campaignBudgets/-1`,
      manual_cpc: { enhanced_cpc_enabled: false },
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
      },
      geo_target_type_setting: {
        positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
      },
    }},
    // Geo — Brasil
    { entity: "CampaignCriterion", operation: "create", resource: {
      campaign: `customers/${CID}/campaigns/-2`,
      location: { geo_target_constant: "geoTargetConstants/2076" },
    }},
    // Ad Group
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-3`,
      name: "Jaleco Slim Tradicional Feminino",
      campaign: `customers/${CID}/campaigns/-2`,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(1.5),
    }},
    // Keywords
    ...[
      { text: "jaleco slim feminino branco",        match_type: PHRASE },
      { text: "jaleco slim feminino",               match_type: PHRASE },
      { text: "jaleco slim tradicional",            match_type: PHRASE },
      { text: "jaleco dia das maes",               match_type: PHRASE },
      { text: "jaleco para dia das maes",          match_type: PHRASE },
      { text: "presente dia das maes medica",      match_type: PHRASE },
      { text: "jaleco slim branco",                match_type: PHRASE },
      { text: "jaleco slim feminino branco",       match_type: EXACT },
      { text: "jaleco slim tradicional feminino",  match_type: EXACT },
    ].map(k => ({ entity: "AdGroupCriterion", operation: "create", resource: {
      ad_group: `customers/${CID}/adGroups/-3`,
      status: enums.AdGroupCriterionStatus.ENABLED,
      keyword: k,
    }})),
    // RSA
    { entity: "AdGroupAd", operation: "create", resource: {
      ad_group: `customers/${CID}/adGroups/-3`,
      status: enums.AdGroupAdStatus.ENABLED,
      ad: {
        final_urls: ["https://jaleca.com.br/categoria/jalecos-femininos"],
        responsive_search_ad: {
          headlines: [
            { text: "Jaleco Slim Feminino Branco" },
            { text: "Mais Vendido da Jaleca" },
            { text: "Presente Dia das Mães" },
            { text: "Frete Grátis SP MG RJ ES" },
            { text: "Pronta Entrega" },
            { text: "Tecido Premium com Elastano" },
            { text: "3x Sem Juros no Cartão" },
            { text: "Médicas e Enfermeiras Amam" },
            { text: "Corte Slim Acinturado" },
            { text: "PP ao G3 Disponível" },
            { text: "A Partir de R$289" },
            { text: "Compre Agora" },
            { text: "Jaleca Oficial" },
            { text: "Para Profissionais de Saúde" },
            { text: "Elegância no Consultório" },
          ],
          descriptions: [
            { text: "O jaleco mais vendido. Corte slim, tecido com elastano e acabamento impecável. PP ao G3." },
            { text: "Frete grátis SP MG RJ ES. 3x sem juros. Presente perfeito pro Dia das Mães!" },
            { text: "Bolsos funcionais, caimento perfeito para longas jornadas. Branco, preto e colorido." },
            { text: "Usado por médicas, dentistas e enfermeiras. Tecido resistente e durável. Peça agora!" },
          ],
        },
      },
    }},
  ]);

  // mutateResources pode retornar objeto ou array — normalizar
  const arr = Array.isArray(result) ? result : (result ? Array.from(result) : []);
  console.log("Operacoes processadas:", arr.length || "ok");

  const campRN = arr.map(r => r.resourceName || r.resource_name || "").find(rn => rn.includes("/campaigns/"));
  if (campRN) {
    console.log(`\n✅ CAMPANHA CRIADA — ID: ${campRN.split("/").pop()}`);
  } else {
    console.log("\n✅ Mutate executado. Verificar campanha no Google Ads UI.");
    console.log("Resource names:", arr.map(r => r.resourceName || r.resource_name || JSON.stringify(r)).slice(0, 5));
  }
  console.log("R$10/dia | ENABLED | /categoria/jalecos-femininos");
}

main().catch(e => {
  console.error("ERRO:", e.message || e);
  if (e.errors) console.error("Detalhes:", JSON.stringify(e.errors, null, 2));
  process.exit(1);
});
