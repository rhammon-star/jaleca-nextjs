/**
 * CRIAR CAMPANHAS GOOGLE ADS — NOVAS PÁGINAS + JALECO FEMININO/SLIM
 * Data: 22/04/2026
 * Orçamento adicionado: R$65/dia (Google)
 *
 * Campanhas criadas aqui:
 *   1. Jaleco Feminino + Slim (Search)  — R$20/dia  → /jaleco-feminino
 *   2. Loja de Jaleco (Search)          — R$15/dia  → /loja-jaleco
 *   3. Jaleco Preto (Search)            — R$10/dia  → /jaleco-preto
 *   4. Jaleco Premium (Search)          — R$10/dia  → /jaleco-premium
 *   5. Comprar Jaleco Online (Search)   — R$10/dia  → /comprar-jaleco-online
 *
 * Total novo Google: Core R$70 + Shopping R$25 + Marca R$5 + Este script R$65 = R$165/dia
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
  customer_id:       process.env.GOOGLE_ADS_CUSTOMER_ID,       // 4446591621
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID, // 6077867298
  refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

// ── helpers ──────────────────────────────────────────────────

function micro(reais) {
  return Math.round(reais * 1_000_000);
}

const RUN_ID = Date.now(); // milissegundos — sempre único

function parseRes(result) {
  // google-ads-api v23 pode retornar array de strings ou MutateResponse
  if (Array.isArray(result)) return result[0];
  if (result?.results?.[0]?.resource_name) return result.results[0].resource_name;
  return result;
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
  console.log(`  📢 Campanha "${name}" criada → ${res}`);
  return res;
}

async function targetBrasil(campaignRes) {
  await customer.campaignCriteria.create([{
    campaign: campaignRes,
    location: { geo_target_constant: "geoTargetConstants/1001548" }, // Brasil
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
  console.log(`    📁 Grupo "${label}" (CPC máx R$${cpcMax}) → ${res}`);
  return res;
}

async function addKeywords(adGroupRes, keywords) {
  const criteria = keywords.map(({ text, matchType, cpc }) => ({
    ad_group: adGroupRes,
    status: enums.AdGroupCriterionStatus.ENABLED,
    keyword: {
      text,
      match_type: enums.KeywordMatchType[matchType],
    },
    ...(cpc ? { cpc_bid_micros: micro(cpc) } : {}),
  }));
  await customer.adGroupCriteria.create(criteria);
  console.log(`      ✅ ${keywords.length} keywords adicionadas`);
}

async function addNegativeKeyword(adGroupRes, text, matchType = "PHRASE") {
  await customer.adGroupCriteria.create([{
    ad_group: adGroupRes,
    status: enums.AdGroupCriterionStatus.ENABLED,
    negative: true,
    keyword: { text, match_type: enums.KeywordMatchType[matchType] },
  }]);
}

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
  console.log(`      ✅ RSA criado → ${finalUrl}`);
}

async function ativarCampanha(campRes) {
  if (!campRes) { console.log("  ⚠️  campRes inválido, skip"); return; }
  await customer.campaigns.update([{
    resource_name: campRes,
    status: enums.CampaignStatus.ENABLED,
  }]);
  console.log(`  🚀 Campanha ATIVADA`);
}

// ── 1. JALECO FEMININO + SLIM ─────────────────────────────────

async function criarCampanhaFemininoSlim() {
  console.log("\n🟣 CAMPANHA 1 — JALECO FEMININO + SLIM (R$20/dia)");

  const budget   = await createBudget("Jaleca - Jaleco Feminino", 20);
  const campaign = await createSearchCampaign("Jaleca - Jaleco Feminino", budget);
  await targetBrasil(campaign);

  // Grupo A: Jaleco Feminino (keyword principal)
  console.log("\n  👗 Grupo: Jaleco Feminino");
  const grpFem = await createAdGroup("Jaleco Feminino", campaign, 1.5);
  await addKeywords(grpFem, [
    { text: "jaleco feminino",         matchType: "EXACT",  cpc: 1.5 },
    { text: "jaleco feminino",         matchType: "PHRASE", cpc: 1.3 },
    { text: "jaleco feminino branco",  matchType: "EXACT",  cpc: 1.3 },
    { text: "jaleco feminino moderno", matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco feminino estiloso",matchType: "PHRASE", cpc: 1.1 },
    { text: "jaleco feminino gabardine",matchType:"PHRASE", cpc: 1.1 },
    { text: "jaleco feminino plus size",matchType:"PHRASE", cpc: 1.0 },
    { text: "jaleco feminino elastano",matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco feminino preto",   matchType: "PHRASE", cpc: 1.1 },
    { text: "comprar jaleco feminino", matchType: "PHRASE", cpc: 1.4 },
  ]);
  await createRSA(
    grpFem,
    [
      "Jaleco Feminino com Corte Real",
      "Não é o Masculino Adaptado",
      "Molde Próprio do PP ao G3",
      "Com Elastano Bidirecional",
      "Branco, Preto e +10 Cores",
      "Vista com Autoridade",
      "Frete Grátis SP RJ MG ES",
      "Parcele em Até 10x Sem Juros",
      "Jaleco Feminino Premium Jaleca",
      "Gabardine sem Amassar",
      "Entrega Rápida — Todo Brasil",
      "Jornada de 12h Sem Desconforto",
      "Compre Online com Segurança",
      "Médica, Dentista, Enfermeira",
      "Troca Fácil em 30 Dias",
    ],
    [
      "Molde feminino com elastano bidirecional. Conforto real em jornadas longas. PP ao G3.",
      "12 cores, frete grátis no Sudeste acima de R$499. PIX c/ desconto. Troca 30 dias.",
    ],
    "https://jaleca.com.br/jaleco-feminino",
    "jaleco",
    "feminino"
  );
  // Negativa: não aparecer para masculino
  await addNegativeKeyword(grpFem, "masculino");
  await addNegativeKeyword(grpFem, "infantil");
  await addNegativeKeyword(grpFem, "grátis", "EXACT");

  // Grupo B: Jaleco Slim Feminino
  console.log("\n  ✨ Grupo: Jaleco Slim");
  const grpSlim = await createAdGroup("Jaleco Slim Feminino", campaign, 1.4);
  await addKeywords(grpSlim, [
    { text: "jaleco slim feminino",      matchType: "EXACT",  cpc: 1.4 },
    { text: "jaleco slim feminino",      matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco slim",               matchType: "EXACT",  cpc: 1.2 },
    { text: "jaleco slim branco",        matchType: "PHRASE", cpc: 1.1 },
    { text: "jaleco slim com zíper",     matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco princesa",           matchType: "EXACT",  cpc: 1.1 },
    { text: "jaleco acinturado feminino",matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco feminino slim fit",  matchType: "PHRASE", cpc: 1.0 },
  ]);
  await createRSA(
    grpSlim,
    [
      "Jaleco Slim Feminino — Jaleca",
      "Corte que Valoriza a Silhueta",
      "Recortes Laterais e Elastano",
      "Slim, Princesa e Elastex",
      "Visual Elegante p/ Consultório",
      "Branco, Preto e +10 Cores",
      "Frete Grátis no Sudeste R$499+",
      "Parcele em 10x Sem Juros",
      "PP ao G3 — Molde Próprio",
      "Tecido Que Não Amassa no Turno",
    ],
    [
      "Slim com recortes laterais e elastano. Visual moderno, conforto para quem trabalha.",
      "Slim, Princesa e Elastex. 12 cores, PP ao G3. Frete grátis no Sudeste (R$499+).",
    ],
    "https://jaleca.com.br/jaleco-feminino",
    "jaleco",
    "slim"
  );
  await addNegativeKeyword(grpSlim, "masculino");
  await addNegativeKeyword(grpSlim, "infantil");

  return campaign;
}

// ── 2. LOJA DE JALECO ─────────────────────────────────────────

async function criarCampanhaLojaDeJaleco() {
  console.log("\n🟢 CAMPANHA 2 — LOJA DE JALECO (R$15/dia)");

  const budget   = await createBudget("Jaleca - Loja de Jaleco", 15);
  const campaign = await createSearchCampaign("Jaleca - Loja de Jaleco", budget);
  await targetBrasil(campaign);

  const grp = await createAdGroup("Loja de Jaleco", campaign, 1.3);
  await addKeywords(grp, [
    { text: "loja de jaleco",            matchType: "EXACT",  cpc: 1.3 },
    { text: "loja de jaleco",            matchType: "PHRASE", cpc: 1.1 },
    { text: "loja de jalecos online",    matchType: "PHRASE", cpc: 1.1 },
    { text: "onde comprar jaleco",       matchType: "PHRASE", cpc: 1.0 },
    { text: "loja de jaleco feminino",   matchType: "PHRASE", cpc: 1.2 },
    { text: "loja jaleco profissional",  matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco online",             matchType: "EXACT",  cpc: 1.0 },
    { text: "jaleco online",             matchType: "PHRASE", cpc: 0.9 },
  ]);
  await createRSA(
    grp,
    [
      "Loja de Jaleco Profissional",
      "Mais de 30 Modelos Disponíveis",
      "Jaleca — Sua Loja de Jaleco",
      "Saúde, Beleza e Gastronomia",
      "Frete Grátis no Sudeste R$499+",
      "PIX com Desconto Imediato",
      "Parcele em 10x Sem Juros",
      "PP ao G3 — Grade Completa",
      "Tecido Premium Que Dura Anos",
      "Troca Fácil em 30 Dias",
      "Vista Confiança e Autoridade",
    ],
    [
      "30 modelos para saúde, beleza e gastronomia. Tecido premium, molde feminino.",
      "Frete grátis no Sudeste acima de R$499. PIX com desconto. Entrega rápida.",
    ],
    "https://jaleca.com.br/loja-jaleco",
    "jalecos",
    "profissionais"
  );
  await addNegativeKeyword(grp, "infantil");
  await addNegativeKeyword(grp, "grátis", "EXACT");

  return campaign;
}

// ── 3. JALECO PRETO ───────────────────────────────────────────

async function criarCampanhaJalecoPreto() {
  console.log("\n⚫ CAMPANHA 3 — JALECO PRETO (R$10/dia)");

  const budget   = await createBudget("Jaleca - Jaleco Preto", 10);
  const campaign = await createSearchCampaign("Jaleca - Jaleco Preto", budget);
  await targetBrasil(campaign);

  const grp = await createAdGroup("Jaleco Preto", campaign, 1.2);
  await addKeywords(grp, [
    { text: "jaleco preto",               matchType: "EXACT",  cpc: 1.2 },
    { text: "jaleco preto",               matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco preto feminino",      matchType: "EXACT",  cpc: 1.2 },
    { text: "jaleco preto feminino",      matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco preto esteticista",   matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco preto cabeleireiro",  matchType: "PHRASE", cpc: 0.9 },
    { text: "jaleco preto profissional",  matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco cor preta",           matchType: "PHRASE", cpc: 0.9 },
  ]);
  await createRSA(
    grp,
    [
      "Jaleco Preto — Profissional",
      "Preto Que Não Desbota",
      "Esteticista e Cabeleireiro",
      "Tecido Resiste Lavagem Diária",
      "Elegância Para Seu Ambiente",
      "Jaleco Preto Feminino PP ao G3",
      "Frete Grátis Sudeste — R$499+",
      "Modelos Disponíveis em Preto",
      "Parcele em 10x Sem Juros",
    ],
    [
      "Jaleco preto gabardine que mantém a cor. Esteticista, cabeleireiro, tatuador, chef.",
      "Feminino e masculino. PP ao G3. Frete grátis no Sudeste acima de R$499. Troca 30 dias.",
    ],
    "https://jaleca.com.br/jaleco-preto",
    "jaleco",
    "preto"
  );
  await addNegativeKeyword(grp, "infantil");
  await addNegativeKeyword(grp, "barato", "PHRASE");

  return campaign;
}

// ── 4. JALECO PREMIUM ─────────────────────────────────────────

async function criarCampanhaJalecoPremium() {
  console.log("\n💎 CAMPANHA 4 — JALECO PREMIUM (R$10/dia)");

  const budget   = await createBudget("Jaleca - Jaleco Premium", 10);
  const campaign = await createSearchCampaign("Jaleca - Jaleco Premium", budget);
  await targetBrasil(campaign);

  const grp = await createAdGroup("Jaleco Premium", campaign, 1.5);
  await addKeywords(grp, [
    { text: "jaleco premium",                 matchType: "EXACT",  cpc: 1.5 },
    { text: "jaleco premium",                 matchType: "PHRASE", cpc: 1.3 },
    { text: "jaleco premium feminino",        matchType: "PHRASE", cpc: 1.4 },
    { text: "jaleco luxo",                    matchType: "EXACT",  cpc: 1.3 },
    { text: "jaleco de qualidade",            matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco sofisticado",             matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco feminino de qualidade",   matchType: "PHRASE", cpc: 1.2 },
    { text: "melhor jaleco feminino",         matchType: "PHRASE", cpc: 1.3 },
  ]);
  await createRSA(
    grp,
    [
      "Jaleco Premium — Jaleca",
      "Tecido e Acabamento Superior",
      "Para Quem Exige Qualidade",
      "Gabardine 165g/m² com Elastano",
      "Visual que Fala Antes de Você",
      "Jaleco Que Dura Anos, Não Meses",
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

  return campaign;
}

// ── 5. COMPRAR JALECO ONLINE ──────────────────────────────────

async function criarCampanhaComprarJaleco() {
  console.log("\n🛒 CAMPANHA 5 — COMPRAR JALECO ONLINE (R$10/dia)");

  const budget   = await createBudget("Jaleca - Comprar Jaleco", 10);
  const campaign = await createSearchCampaign("Jaleca - Comprar Jaleco Online", budget);
  await targetBrasil(campaign);

  const grp = await createAdGroup("Comprar Jaleco", campaign, 1.3);
  await addKeywords(grp, [
    { text: "comprar jaleco",             matchType: "EXACT",  cpc: 1.3 },
    { text: "comprar jaleco",             matchType: "PHRASE", cpc: 1.1 },
    { text: "comprar jaleco online",      matchType: "EXACT",  cpc: 1.3 },
    { text: "comprar jaleco feminino",    matchType: "PHRASE", cpc: 1.2 },
    { text: "jaleco preço",               matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco profissional comprar",matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco com entrega rápida",  matchType: "PHRASE", cpc: 0.9 },
  ]);
  await createRSA(
    grp,
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
  await addNegativeKeyword(grp, "infantil");
  await addNegativeKeyword(grp, "grátis", "EXACT");
  await addNegativeKeyword(grp, "receita", "PHRASE");

  return campaign;
}

// ── MAIN ──────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log("🔥 CRIANDO NOVAS CAMPANHAS — JALECA");
  console.log("   Novas campanhas: R$65/dia");
  console.log("=".repeat(60));

  try {
    const c1 = await criarCampanhaFemininoSlim();
    const c2 = await criarCampanhaLojaDeJaleco();
    const c3 = await criarCampanhaJalecoPreto();
    const c4 = await criarCampanhaJalecoPremium();
    const c5 = await criarCampanhaComprarJaleco();

    console.log("\n🚀 Ativando todas as campanhas...");
    for (const c of [c1, c2, c3, c4, c5]) {
      await ativarCampanha(c);
    }

    console.log(`
${"=".repeat(60)}
✅ TUDO CRIADO COM SUCESSO!
${"=".repeat(60)}

📊 NOVAS CAMPANHAS:
┌──────────────────────────────────────┬───────────┐
│ Campanha                             │ R$/dia    │
├──────────────────────────────────────┼───────────┤
│ Jaleco Feminino + Slim               │ R$20      │
│ Loja de Jaleco                       │ R$15      │
│ Jaleco Preto                         │ R$10      │
│ Jaleco Premium                       │ R$10      │
│ Comprar Jaleco Online                │ R$10      │
├──────────────────────────────────────┼───────────┤
│ SUBTOTAL NOVAS                       │ R$65/dia  │
└──────────────────────────────────────┴───────────┘

📊 GOOGLE ADS TOTAL APÓS ESTE SCRIPT:
┌──────────────────────────────────────┬───────────┐
│ Core - Jalecos (existente)           │ R$70      │
│ Shopping (existente)                 │ R$25      │
│ Marca (existente)                    │ R$5       │
│ Novas (este script)                  │ R$65      │
├──────────────────────────────────────┼───────────┤
│ TOTAL GOOGLE ADS                     │ R$165/dia │
└──────────────────────────────────────┴───────────┘

⚠️  AÇÕES MANUAIS NECESSÁRIAS:
   1. Painel Google Ads → confirmar campanhas ativas
   2. Campaign "Core - Jalecos": remover keywords
      "jaleco feminino" e "jaleco slim" para evitar
      sobreposição com a nova campanha Feminino+Slim
   3. Shopping: mudar destino de /produtos para
      /categoria/jalecos-femininos (reduz bounce 76%)
   4. Ativar "Dia das Mães" em 28/04
    `);

  } catch (error) {
    console.error("\n❌ ERRO:", error.message ?? error);
    if (error.errors) {
      for (const e of error.errors) {
        console.error("  →", JSON.stringify(e, null, 2));
      }
    }
    process.exit(1);
  }
}

main();
