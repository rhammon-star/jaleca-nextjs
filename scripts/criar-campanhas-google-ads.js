/**
 * CRIAR CAMPANHAS GOOGLE ADS — JALECA
 * Plano validado por: Consultor + Gemini SEO + GPT-4.1 + Claude
 * Data: 17/04/2026 | Orçamento: R$100/dia
 *
 * Campanhas:
 *   1. CORE (Feminino + Masculino + Profissão) — R$40/dia
 *   2. DIA DAS MÃES — R$25/dia
 *   3. MARCA — R$15/dia
 *
 * + Lista de negativas compartilhada
 * + Shopping permanece como está (pausar manualmente)
 */

import { GoogleAdsApi, enums, ResourceNames } from "google-ads-api";
import dotenv from "dotenv";

dotenv.config({ path: ".env.google-ads" });

const client = new GoogleAdsApi({
  client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customer = client.Customer({
  customer_id:       process.env.GOOGLE_ADS_CUSTOMER_ID!,      // 4446591621
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!, // 6077867298
  refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN!,
});

const CID = process.env.GOOGLE_ADS_CUSTOMER_ID!;

// ============================================================
// HELPERS
// ============================================================

function microAmount(reais: number): number {
  return Math.round(reais * 1_000_000);
}

async function createCampaignBudget(name: string, amountPerDay: number) {
  const [result] = await customer.campaignBudgets.create([
    {
      name: `${name} — Budget`,
      amount_micros: microAmount(amountPerDay),
      delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    },
  ]);
  console.log(`  ✅ Budget "${name}": R$${amountPerDay}/dia → ${result}`);
  return result;
}

async function createSearchCampaign(
  name: string,
  budgetResourceName: string,
  opts?: { endDate?: string }
) {
  const campaign: Record<string, any> = {
    name,
    advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
    status: enums.CampaignStatus.PAUSED, // criamos pausada, ativamos no final
    campaign_budget: budgetResourceName,
    manual_cpc: { enhanced_cpc_enabled: false },
    network_settings: {
      target_google_search: true,
      target_search_network: false,
      target_content_network: false,
    },
    geo_target_type_setting: {
      positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
    },
  };
  if (opts?.endDate) {
    campaign.end_date = opts.endDate; // YYYY-MM-DD
  }
  const [result] = await customer.campaigns.create([campaign]);
  console.log(`  ✅ Campanha "${name}" → ${result}`);
  return result;
}

async function createAdGroup(
  name: string,
  campaignResourceName: string,
  cpcBid: number
) {
  const [result] = await customer.adGroups.create([
    {
      name,
      campaign: campaignResourceName,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: microAmount(cpcBid),
    },
  ]);
  console.log(`  ✅ Grupo "${name}" (CPC R$${cpcBid}) → ${result}`);
  return result;
}

async function addKeywords(
  adGroupResourceName: string,
  keywords: Array<{
    text: string;
    matchType: "EXACT" | "PHRASE";
    cpc?: number;
  }>
) {
  const criteria = keywords.map((kw) => {
    const obj: Record<string, any> = {
      ad_group: adGroupResourceName,
      status: enums.AdGroupCriterionStatus.ENABLED,
      keyword: {
        text: kw.text,
        match_type:
          kw.matchType === "EXACT"
            ? enums.KeywordMatchType.EXACT
            : enums.KeywordMatchType.PHRASE,
      },
    };
    if (kw.cpc) {
      obj.cpc_bid_micros = microAmount(kw.cpc);
    }
    return obj;
  });
  const results = await customer.adGroupCriteria.create(criteria);
  keywords.forEach((kw, i) => {
    const symbol = kw.matchType === "EXACT" ? `[${kw.text}]` : `"${kw.text}"`;
    console.log(`    ✅ KW: ${symbol}${kw.cpc ? ` CPC R$${kw.cpc}` : ""}`);
  });
  return results;
}

async function createResponsiveSearchAd(
  adGroupResourceName: string,
  headlines: string[],
  descriptions: string[],
  finalUrl: string,
  path1?: string,
  path2?: string
) {
  const [result] = await customer.ads.create([
    {
      ad_group: adGroupResourceName,
      status: enums.AdGroupAdStatus.ENABLED,
      ad: {
        final_urls: [finalUrl],
        responsive_search_ad: {
          headlines: headlines.map((h, i) => ({
            text: h,
            pinned_field:
              i === 0
                ? enums.ServedAssetFieldType.HEADLINE_1
                : undefined,
          })),
          descriptions: descriptions.map((d) => ({ text: d })),
          path1: path1 || undefined,
          path2: path2 || undefined,
        },
      },
    },
  ]);
  console.log(`    ✅ Anúncio responsivo criado`);
  return result;
}

// ============================================================
// LISTA DE NEGATIVAS COMPARTILHADA
// ============================================================

async function createSharedNegativeList() {
  console.log("\n📋 Criando lista de negativas compartilhada...");

  // Criar lista compartilhada
  const [listResult] = await customer.sharedSets.create([
    {
      name: "Negativas Jaleca - Master",
      type: enums.SharedSetType.NEGATIVE_KEYWORDS,
    },
  ]);
  console.log(`  ✅ Lista "Negativas Jaleca - Master" → ${listResult}`);

  // Todas as negativas
  const negatives: Array<{ text: string; matchType: "PHRASE" | "EXACT" }> = [
    // Concorrentes
    ...[
      "figs", "rachele modas", "rachele", "aspen jalecos", "aspen",
      "casa do jaleco", "boutique dos jalecos", "cherie jalecos", "cherie",
      "belle blanc", "dana jalecos", "dra charm", "companhia do branco",
      "ponto branco", "seu jaleco", "dr jaleco", "shopee", "mercado livre",
      "amazon",
    ].map((t) => ({ text: t, matchType: "PHRASE" as const })),

    // Informativos
    ...[
      "modelo de", "modelos de", "o que é", "o que e", "como fazer",
      "curso", "tutorial", "inspiração", "inspiracao", "molde", "download",
      "grátis", "gratis", "gratuito", "usado", "barato", "alugar", "diy",
    ].map((t) => ({ text: t, matchType: "PHRASE" as const })),

    // Produtos que não vendemos
    ...[
      "pijama", "pijama cirurgico", "scrub", "scrubs", "conjunto social",
      "roupa social", "esporte fino", "alfaiataria", "avental", "bordado",
      "personalizado",
    ].map((t) => ({ text: t, matchType: "PHRASE" as const })),

    // Locais irrelevantes
    ...[
      "teresina", "londrina", "manaus", "goiania", "curitiba",
      "recife", "fortaleza", "salvador", "brasilia",
    ].map((t) => ({ text: t, matchType: "PHRASE" as const })),
  ];

  // Adicionar keywords negativas à lista
  const sharedCriteria = negatives.map((n) => ({
    shared_set: listResult,
    keyword: {
      text: n.text,
      match_type:
        n.matchType === "EXACT"
          ? enums.KeywordMatchType.EXACT
          : enums.KeywordMatchType.PHRASE,
    },
  }));

  // API limita batch, enviar em chunks de 50
  for (let i = 0; i < sharedCriteria.length; i += 50) {
    const chunk = sharedCriteria.slice(i, i + 50);
    await customer.sharedCriteria.create(chunk);
  }
  console.log(`  ✅ ${negatives.length} palavras negativas adicionadas`);

  return listResult;
}

async function attachNegativeListToCampaign(
  sharedSetResourceName: string,
  campaignResourceName: string
) {
  await customer.campaignSharedSets.create([
    {
      campaign: campaignResourceName,
      shared_set: sharedSetResourceName,
    },
  ]);
}

// ============================================================
// GEO TARGETING — BRASIL
// ============================================================

async function targetBrasil(campaignResourceName: string) {
  await customer.campaignCriteria.create([
    {
      campaign: campaignResourceName,
      location: {
        geo_target_constant: ResourceNames.geoTargetConstant(2076), // Brasil
      },
    },
  ]);
}

// ============================================================
// CAMPANHA 1 — CORE (Feminino + Masculino + Profissão)
// ============================================================

async function criarCampanhaCore() {
  console.log("\n🟣 CAMPANHA 1 — CORE (R$40/dia)");

  const budget = await createCampaignBudget("Jaleca - Core", 40);
  const campaign = await createSearchCampaign("Jaleca - Core - Jalecos", budget);
  await targetBrasil(campaign);

  // --- Grupo: Feminino ---
  console.log("\n  👗 Grupo: Feminino");
  const grpFem = await createAdGroup("Feminino", campaign, 1.2);
  await addKeywords(grpFem, [
    { text: "jaleco feminino", matchType: "EXACT", cpc: 1.2 },
    { text: "jaleco feminino", matchType: "PHRASE", cpc: 1.1 },
  ]);
  await createResponsiveSearchAd(
    grpFem,
    [
      "Jaleco Feminino Premium",
      "Elegância e Conforto no Trabalho",
      "Modelagem Slim e Sofisticada",
      "Frete Grátis Acima de R$499",
      "Parcele em Até 10x Sem Juros",
      "Envio Rápido Para Todo Brasil",
      "Vista Autoridade no Atendimento",
    ],
    [
      "Jalecos femininos premium com caimento impecável. Conforto, elegância e presença profissional no seu dia a dia.",
      "Compre online com segurança. PIX com desconto e entrega rápida para todo o Brasil.",
    ],
    "https://jaleca.com.br/produtos?categoria=jalecos-femininos",
    "jalecos",
    "femininos"
  );

  // Negativa cruzada: masculino no grupo feminino
  await customer.adGroupCriteria.create([
    {
      ad_group: grpFem,
      status: enums.AdGroupCriterionStatus.ENABLED,
      negative: true,
      keyword: {
        text: "masculino",
        match_type: enums.KeywordMatchType.PHRASE,
      },
    },
  ]);
  console.log(`    ✅ Negativa cruzada: "masculino" no grupo Feminino`);

  // --- Grupo: Masculino ---
  console.log("\n  👔 Grupo: Masculino");
  const grpMasc = await createAdGroup("Masculino", campaign, 1.1);
  await addKeywords(grpMasc, [
    { text: "jaleco masculino", matchType: "EXACT", cpc: 1.1 },
    { text: "jaleco masculino", matchType: "PHRASE", cpc: 1.0 },
  ]);
  await createResponsiveSearchAd(
    grpMasc,
    [
      "Jaleco Masculino Premium",
      "Design Moderno e Confortável",
      "Caimento Perfeito Para Profissionais",
      "Jaleco Masculino de Alta Qualidade",
      "Frete Grátis Acima de R$499",
      "Parcele em Até 10x Sem Juros",
    ],
    [
      "Jalecos masculinos com modelagem moderna e tecido premium. Conforto e presença no ambiente profissional.",
      "Qualidade que transmite autoridade. Compre online com segurança e receba rápido.",
    ],
    "https://jaleca.com.br/produtos?categoria=jalecos-masculinos",
    "jalecos",
    "masculinos"
  );

  // --- Grupo: Profissão ---
  console.log("\n  🩺 Grupo: Profissão");
  const grpProf = await createAdGroup("Profissão", campaign, 0.9);
  await addKeywords(grpProf, [
    { text: "jaleco para médica", matchType: "PHRASE", cpc: 0.9 },
    { text: "jaleco para enfermagem", matchType: "PHRASE", cpc: 0.9 },
    { text: "jaleco para dentista", matchType: "EXACT", cpc: 0.9 },
    { text: "jaleco para veterinária", matchType: "PHRASE", cpc: 0.9 },
  ]);
  await createResponsiveSearchAd(
    grpProf,
    [
      "Jalecos Para Profissionais da Saúde",
      "Conforto e Elegância no Atendimento",
      "Jalecos Premium Para Seu Dia a Dia",
      "Frete Grátis Acima de R$499",
      "Parcele em Até 10x Sem Juros",
      "Para Médicas Enfermeiras e Dentistas",
    ],
    [
      "Jalecos ideais para médicas, enfermeiras e dentistas. Modelagem premium e conforto para longas jornadas.",
      "Eleve sua imagem profissional. Parcele em até 10x ou pague com desconto no PIX.",
    ],
    "https://jaleca.com.br/produtos",
    "jalecos",
    "profissionais"
  );

  return campaign;
}

// ============================================================
// CAMPANHA 2 — DIA DAS MÃES
// ============================================================

async function criarCampanhaDiaDasMaes() {
  console.log("\n🟠 CAMPANHA 2 — DIA DAS MÃES (R$25/dia | encerra 12/05/2026)");

  const budget = await createCampaignBudget("Jaleca - Dia das Mães", 25);
  const campaign = await createSearchCampaign(
    "Jaleca - Dia das Mães 2026",
    budget,
    { endDate: "2026-05-12" }
  );
  await targetBrasil(campaign);

  const grp = await createAdGroup("Presente Dia das Mães", campaign, 0.9);
  await addKeywords(grp, [
    { text: "presente dia das mães médica", matchType: "PHRASE", cpc: 0.9 },
    { text: "presente dia das mães enfermeira", matchType: "PHRASE", cpc: 0.9 },
    { text: "presente dia das mães dentista", matchType: "PHRASE", cpc: 0.9 },
    { text: "jaleco presente dia das mães", matchType: "PHRASE", cpc: 0.9 },
    { text: "jaleco feminino presente", matchType: "PHRASE", cpc: 0.9 },
    { text: "presente para mãe profissional de saúde", matchType: "PHRASE", cpc: 1.0 },
    { text: "presente mãe que é médica", matchType: "PHRASE", cpc: 1.0 },
    { text: "jaleco para presente", matchType: "PHRASE", cpc: 0.9 },
    { text: "presente para médica", matchType: "PHRASE", cpc: 0.9 },
    { text: "presente para enfermeira", matchType: "PHRASE", cpc: 0.9 },
  ]);

  await createResponsiveSearchAd(
    grp,
    [
      "Presente Dia das Mães | Jaleca",
      "Jalecos Premium Para Mães da Saúde",
      "Entrega Garantida Dia das Mães",
      "Até 10x Sem Juros + Frete Grátis",
      "Surpreenda Quem Cuida de Todos",
      "O Presente Perfeito Para Sua Mãe",
    ],
    [
      "O presente perfeito para mães da área da saúde. Jalecos premium com elegância e conforto. Compre agora.",
      "Entrega garantida para o Dia das Mães. Parcele em até 10x ou pague no PIX com desconto.",
    ],
    "https://jaleca.com.br/dia-das-maes/saude",
    "dia-das-maes",
    "presente"
  );

  return campaign;
}

// ============================================================
// CAMPANHA 3 — MARCA
// ============================================================

async function criarCampanhaMarca() {
  console.log("\n🔵 CAMPANHA 3 — MARCA (R$15/dia)");

  const budget = await createCampaignBudget("Jaleca - Marca", 15);
  const campaign = await createSearchCampaign("Jaleca - Marca", budget);
  await targetBrasil(campaign);

  const grp = await createAdGroup("Marca Jaleca", campaign, 0.5);
  await addKeywords(grp, [
    { text: "jaleca", matchType: "EXACT", cpc: 0.5 },
    { text: "jaleca oficial", matchType: "EXACT", cpc: 0.5 },
    { text: "jaleca jalecos", matchType: "EXACT", cpc: 0.5 },
    { text: "jaleca.com.br", matchType: "EXACT", cpc: 0.5 },
    { text: "site jaleca", matchType: "EXACT", cpc: 0.5 },
  ]);

  await createResponsiveSearchAd(
    grp,
    [
      "Jaleca | Loja Oficial",
      "Jalecos Premium Femininos e Masculinos",
      "Compre Direto do Site Oficial",
      "Frete Grátis SP/RJ/MG/ES acima R$499",
      "Parcele em Até 10x Sem Juros",
      "Jaleca Original com Entrega Rápida",
    ],
    [
      "Loja oficial Jaleca. Jalecos femininos e masculinos premium com entrega para todo o Brasil.",
      "Parcele em até 10x ou pague no PIX com desconto. Compre direto do site oficial.",
    ],
    "https://jaleca.com.br",
    "loja",
    "oficial"
  );

  return campaign;
}

// ============================================================
// EXTENSÕES DE ANÚNCIO (nível de conta)
// ============================================================

async function criarExtensoes(campaignResourceNames: string[]) {
  console.log("\n📎 Criando extensões de anúncio...");

  // Sitelinks
  const sitelinks = [
    {
      sitelink_text: "Jalecos Femininos",
      description1: "Modelagem slim e premium",
      description2: "Conforto e elegância",
      final_urls: ["https://jaleca.com.br/produtos?categoria=jalecos-femininos"],
    },
    {
      sitelink_text: "Jalecos Masculinos",
      description1: "Design moderno premium",
      description2: "Caimento perfeito",
      final_urls: ["https://jaleca.com.br/produtos?categoria=jalecos-masculinos"],
    },
    {
      sitelink_text: "Dia das Mães",
      description1: "Presente para mãe da saúde",
      description2: "Entrega garantida",
      final_urls: ["https://jaleca.com.br/dia-das-maes/saude"],
    },
    {
      sitelink_text: "Frete Grátis",
      description1: "SP, RJ, MG, ES acima R$499",
      description2: "Entrega rápida",
      final_urls: ["https://jaleca.com.br"],
    },
  ];

  for (const sl of sitelinks) {
    const [asset] = await customer.assets.create([
      {
        name: `Sitelink - ${sl.sitelink_text}`,
        type: enums.AssetType.SITELINK,
        sitelink_asset: {
          link_text: sl.sitelink_text,
          description1: sl.description1,
          description2: sl.description2,
          final_urls: sl.final_urls,
        },
      },
    ]);
    // Vincular a todas as campanhas
    for (const camp of campaignResourceNames) {
      await customer.campaignAssets.create([
        {
          campaign: camp,
          asset,
          field_type: enums.AssetFieldType.SITELINK,
        },
      ]);
    }
    console.log(`  ✅ Sitelink: ${sl.sitelink_text}`);
  }

  // Callout extensions (frases de destaque)
  const callouts = [
    "Frete Grátis acima de R$499",
    "Parcele em até 10x sem juros",
    "PIX com desconto",
    "Envio em 24h úteis",
    "Entrega para todo Brasil",
  ];

  for (const text of callouts) {
    const [asset] = await customer.assets.create([
      {
        name: `Callout - ${text}`,
        type: enums.AssetType.CALLOUT,
        callout_asset: { callout_text: text },
      },
    ]);
    for (const camp of campaignResourceNames) {
      await customer.campaignAssets.create([
        {
          campaign: camp,
          asset,
          field_type: enums.AssetFieldType.CALLOUT,
        },
      ]);
    }
    console.log(`  ✅ Destaque: ${text}`);
  }
}

// ============================================================
// ATIVAR CAMPANHAS
// ============================================================

async function ativarCampanhas(campaigns: string[]) {
  console.log("\n🚀 Ativando campanhas...");
  for (const camp of campaigns) {
    await customer.campaigns.update([
      {
        resource_name: camp,
        status: enums.CampaignStatus.ENABLED,
      },
    ]);
  }
  console.log("  ✅ Todas as campanhas ATIVAS");
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("=".repeat(60));
  console.log("🔥 CRIANDO CAMPANHAS GOOGLE ADS — JALECA");
  console.log("   Orçamento total: R$80/dia (Google) + R$20/dia (Meta)");
  console.log("=".repeat(60));

  try {
    // 1. Lista de negativas
    const negativeList = await createSharedNegativeList();

    // 2. Campanhas
    const core = await criarCampanhaCore();
    const ddm = await criarCampanhaDiaDasMaes();
    const marca = await criarCampanhaMarca();

    const allCampaigns = [core, ddm, marca];

    // 3. Vincular negativas a todas as campanhas
    console.log("\n🔗 Vinculando negativas às campanhas...");
    for (const camp of allCampaigns) {
      await attachNegativeListToCampaign(negativeList, camp);
    }
    console.log("  ✅ Lista de negativas vinculada a todas as campanhas");

    // 4. Extensões
    await criarExtensoes(allCampaigns);

    // 5. Ativar
    await ativarCampanhas(allCampaigns);

    // Resumo
    console.log("\n" + "=".repeat(60));
    console.log("✅ TUDO CRIADO COM SUCESSO!");
    console.log("=".repeat(60));
    console.log(`
📊 RESUMO:
┌────────────────────────────┬───────────┐
│ Campanha                   │ Orçamento │
├────────────────────────────┼───────────┤
│ Core (Fem+Masc+Profissão)  │ R$40/dia  │
│ Dia das Mães 2026          │ R$25/dia  │
│ Marca                      │ R$15/dia  │
├────────────────────────────┼───────────┤
│ TOTAL Google Ads           │ R$80/dia  │
│ Meta Remarketing Carrinho  │ R$20/dia  │
├────────────────────────────┼───────────┤
│ TOTAL GERAL                │ R$100/dia │
└────────────────────────────┴───────────┘

⚠️  LEMBRETE: Pausar Shopping manualmente no dashboard.
⚠️  LEMBRETE: Em 05/05 subir DdM para R$35/dia.
📋 ${negatives_count} palavras negativas aplicadas em todas as campanhas.
    `);
  } catch (error: any) {
    console.error("\n❌ ERRO:", error.message);
    if (error.errors) {
      for (const e of error.errors) {
        console.error("  →", JSON.stringify(e, null, 2));
      }
    }
    process.exit(1);
  }
}

const negatives_count = 57; // total de negativas na lista
main();
