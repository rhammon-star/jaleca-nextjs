/**
 * EXECUÇÃO FINAL GOOGLE ADS
 * 1. Core - Jalecos: R$84 → R$70
 * 2. Pause "Jaleco Slim Feminino" antigo (sobreposição com novo Feminino+Slim)
 * 3. Criar Remarketing Display R$15/dia
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

function micro(r) { return Math.round(r * 1_000_000); }
function parseRes(r) {
  if (Array.isArray(r)) return r[0];
  if (r?.results?.[0]?.resource_name) return r.results[0].resource_name;
  return r;
}
const RUN_ID = Date.now();

// ── 1. ATUALIZAR BUDGET CORE ──────────────────────────────────
async function updateCoreBudget() {
  console.log("\n📦 1. ATUALIZANDO CORE - JALECOS: R$84 → R$70/dia");
  const CORE_BUDGET_RN = "customers/4446591621/campaignBudgets/15516545938";
  await customer.campaignBudgets.update([{
    resource_name: CORE_BUDGET_RN,
    amount_micros: micro(70),
  }]);
  console.log("  ✅ Core budget atualizado para R$70/dia");
}

// ── 2. PAUSAR JALECO SLIM FEMININO ANTIGO ────────────────────
async function pauseOldSlimCampaign() {
  console.log("\n⏸️  2. PAUSANDO campanha antiga 'Jaleco Slim Feminino' (sobreposição)");
  // Busca a campanha pelo nome
  const result = await customer.query(`
    SELECT campaign.resource_name, campaign.name, campaign.status
    FROM campaign
    WHERE campaign.name = 'Jaleca - Jaleco Slim Feminino'
    AND campaign.status = 'ENABLED'
  `);
  if (!result.length) {
    console.log("  ℹ️  Campanha não encontrada ou já pausada");
    return;
  }
  const rn = result[0].campaign.resource_name;
  await customer.campaigns.update([{
    resource_name: rn,
    status: enums.CampaignStatus.PAUSED,
  }]);
  console.log(`  ✅ Pausada: ${result[0].campaign.name}`);
}

// ── 3. CRIAR REMARKETING DISPLAY ─────────────────────────────
async function criarRemarketingDisplay() {
  console.log("\n🎯 3. CRIANDO REMARKETING DISPLAY (R$15/dia)");

  // Budget
  const budgetResult = await customer.campaignBudgets.create([{
    name: `Jaleca - Remarketing Display Budget ${RUN_ID}`,
    amount_micros: micro(15),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
  }]);
  const budgetRN = parseRes(budgetResult);
  console.log(`  💰 Budget criado → ${budgetRN}`);

  // Campaign
  const campResult = await customer.campaigns.create([{
    name: `Jaleca - Remarketing Display ${RUN_ID}`,
    advertising_channel_type: enums.AdvertisingChannelType.DISPLAY,
    status: enums.CampaignStatus.PAUSED,
    campaign_budget: budgetRN,
    manual_cpm: {},
    network_settings: { target_content_network: true },
    geo_target_type_setting: {
      positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
    },
    contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
  }]);
  const campaignRN = parseRes(campResult);
  console.log(`  📢 Campanha Display criada → ${campaignRN}`);

  // Geo Brasil
  await customer.campaignCriteria.create([{
    campaign: campaignRN,
    location: { geo_target_constant: "geoTargetConstants/1001548" },
  }]);

  // Ad Group
  const adGroupResult = await customer.adGroups.create([{
    name: "Visitantes — Jaleca",
    campaign: campaignRN,
    status: enums.AdGroupStatus.ENABLED,
    type: enums.AdGroupType.DISPLAY_STANDARD,
    cpm_bid_micros: micro(8), // CPM máx R$8
  }]);
  const adGroupRN = parseRes(adGroupResult);
  console.log(`  📁 Ad group criado → ${adGroupRN}`);

  // Targeting: user list "All visitors (AdWords)"
  const USER_LIST_RN = "customers/4446591621/userLists/9361952428";
  await customer.adGroupCriteria.create([{
    ad_group: adGroupRN,
    status: enums.AdGroupCriterionStatus.ENABLED,
    user_list: { user_list: USER_LIST_RN },
  }]);
  console.log("  🎯 Targeting: All visitors (620 usuários) adicionado");

  // Ativar campanha
  await customer.campaigns.update([{
    resource_name: campaignRN,
    status: enums.CampaignStatus.ENABLED,
  }]);
  console.log("  🚀 Campanha Remarketing Display ATIVADA");

  return campaignRN;
}

// ── MAIN ──────────────────────────────────────────────────────
console.log("=".repeat(60));
console.log("🔥 EXECUTAR PLANO GOOGLE ADS — FINAL");
console.log("=".repeat(60));

try {
  await updateCoreBudget();
  await pauseOldSlimCampaign();
  const displayCamp = await criarRemarketingDisplay();

  console.log(`
${"=".repeat(60)}
✅ GOOGLE ADS CONCLUÍDO!

O que foi feito:
  ✅ Core - Jalecos: R$84 → R$70/dia
  ✅ Jaleco Slim Feminino antigo: PAUSADO
  ✅ Remarketing Display: R$15/dia → ATIVO
     Audience: All visitors (620 usuários)
     Campaign: ${displayCamp}

⚠️  AÇÃO MANUAL NECESSÁRIA — Remarketing Display:
   O Google Ads exige imagens para anúncios Display.
   Para adicionar o criativo:
   1. Abra o Google Ads → Campanhas → Remarketing Display
   2. Ad group "Visitantes — Jaleca" → Anúncios → + Novo anúncio
   3. Escolha "Anúncio display responsivo"
   4. Use as imagens do jaleca.com.br (hero, produtos)
   5. Headlines: "Jaleca — Jaleco Profissional", "Veja os Jalecos que Você Viu"
   6. Description: "Volte e encontre o jaleco ideal. Frete grátis no Sudeste acima de R$499."

⚠️  AINDA MANUAL:
   - Shopping: mudar destino → /categoria/jalecos-femininos
   - Dia das Mães: ativar em 28/04
${"=".repeat(60)}
  `);
} catch (err) {
  console.error("\n❌ ERRO:", err.message ?? err);
  if (err.errors) for (const e of err.errors) console.error(" →", JSON.stringify(e, null, 2));
  process.exit(1);
}
