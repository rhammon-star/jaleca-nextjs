/**
 * COMPLETAR CAMPANHAS — Grupos, Keywords, Anúncios, Negativas, Ativar
 * Campanhas já criadas:
 *   Core:  customers/4446591621/campaigns/23768160151
 *   DdM:   customers/4446591621/campaigns/23768160154
 *   Marca: customers/4446591621/campaigns/23768160157
 */

const { GoogleAdsApi, enums } = require("google-ads-api");

require("dotenv").config({ path: ".env.google-ads" });

const client = new GoogleAdsApi({
  client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id:       process.env.GOOGLE_ADS_CUSTOMER_ID || "4446591621",
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "6077867298",
  refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const CID = "4446591621";
const micro = (r) => Math.round(r * 1_000_000);

const CAMP_CORE  = `customers/${CID}/campaigns/23768160151`;
const CAMP_DDM   = `customers/${CID}/campaigns/23768160154`;
const CAMP_MARCA = `customers/${CID}/campaigns/23768160157`;

const EXACT = enums.KeywordMatchType.EXACT;
const PHRASE = enums.KeywordMatchType.PHRASE;

async function step2_adGroups() {
  console.log("\n📁 STEP 2 — Criando Grupos de Anúncios...");

  const result = await customer.mutateResources([
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-20`,
      name: "Feminino", campaign: CAMP_CORE,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(1.2),
    }},
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-21`,
      name: "Masculino", campaign: CAMP_CORE,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(1.1),
    }},
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-22`,
      name: "Profissão", campaign: CAMP_CORE,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(0.9),
    }},
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-23`,
      name: "Presente Dia das Mães", campaign: CAMP_DDM,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(0.9),
    }},
    { entity: "AdGroup", operation: "create", resource: {
      resource_name: `customers/${CID}/adGroups/-24`,
      name: "Marca Jaleca", campaign: CAMP_MARCA,
      status: enums.AdGroupStatus.ENABLED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: micro(0.5),
    }},
  ]);

  // Get real resource names
  const groups = await customer.query(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.campaign
    FROM ad_group
    WHERE ad_group.campaign IN ('${CAMP_CORE}', '${CAMP_DDM}', '${CAMP_MARCA}')
  `);

  const map = {};
  for (const g of groups) {
    map[g.ad_group.name] = g.ad_group.resource_name;
  }
  console.log("  ✅ Grupos criados:", Object.keys(map).join(", "));
  return map;
}

async function step3_keywords(groups) {
  console.log("\n🔑 STEP 3 — Adicionando Keywords...");

  const kws = [
    { ag: groups["Feminino"], text: "jaleco feminino", match: EXACT, cpc: 1.2 },
    { ag: groups["Feminino"], text: "jaleco feminino", match: PHRASE, cpc: 1.1 },
    { ag: groups["Masculino"], text: "jaleco masculino", match: EXACT, cpc: 1.1 },
    { ag: groups["Masculino"], text: "jaleco masculino", match: PHRASE, cpc: 1.0 },
    { ag: groups["Profissão"], text: "jaleco para médica", match: PHRASE, cpc: 0.9 },
    { ag: groups["Profissão"], text: "jaleco para enfermagem", match: PHRASE, cpc: 0.9 },
    { ag: groups["Profissão"], text: "jaleco para dentista", match: EXACT, cpc: 0.9 },
    { ag: groups["Profissão"], text: "jaleco para veterinária", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "presente dia das mães médica", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "presente dia das mães enfermeira", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "presente dia das mães dentista", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "jaleco presente dia das mães", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "jaleco feminino presente", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "presente para mãe profissional de saúde", match: PHRASE, cpc: 1.0 },
    { ag: groups["Presente Dia das Mães"], text: "presente para médica", match: PHRASE, cpc: 0.9 },
    { ag: groups["Presente Dia das Mães"], text: "presente para enfermeira", match: PHRASE, cpc: 0.9 },
    { ag: groups["Marca Jaleca"], text: "jaleca", match: EXACT, cpc: 0.5 },
    { ag: groups["Marca Jaleca"], text: "jaleca oficial", match: EXACT, cpc: 0.5 },
    { ag: groups["Marca Jaleca"], text: "jaleca jalecos", match: EXACT, cpc: 0.5 },
    { ag: groups["Marca Jaleca"], text: "jaleca.com.br", match: EXACT, cpc: 0.5 },
    { ag: groups["Marca Jaleca"], text: "site jaleca", match: EXACT, cpc: 0.5 },
  ];

  const mutations = kws.map(kw => ({
    entity: "AdGroupCriterion", operation: "create",
    resource: {
      ad_group: kw.ag,
      status: enums.AdGroupCriterionStatus.ENABLED,
      keyword: { text: kw.text, match_type: kw.match },
      cpc_bid_micros: micro(kw.cpc),
    },
  }));

  // Negativa cruzada
  mutations.push({
    entity: "AdGroupCriterion", operation: "create",
    resource: {
      ad_group: groups["Feminino"],
      negative: true,
      keyword: { text: "masculino", match_type: PHRASE },
    },
  });

  await customer.mutateResources(mutations);
  console.log(`  ✅ ${kws.length} keywords + 1 negativa cruzada`);
}

async function step4_ads(groups) {
  console.log("\n📝 STEP 4 — Criando Anúncios Responsivos...");

  // Headlines max 30 chars, Descriptions max 90 chars
  const ads = [
    {
      ag: groups["Feminino"],
      headlines: ["Jaleco Feminino Premium", "Elegância no Trabalho", "Modelagem Slim Premium", "Frete Grátis Acima R$499", "Parcele em Até 10x", "Envio Rápido Todo Brasil", "Vista Autoridade"],
      descriptions: ["Jalecos femininos premium com caimento impecável. Conforto e presença no dia a dia.", "Compre com segurança. PIX com desconto e entrega rápida para todo o Brasil."],
      url: "https://jaleca.com.br/produtos?categoria=jalecos-femininos",
      path1: "jalecos", path2: "femininos",
    },
    {
      ag: groups["Masculino"],
      headlines: ["Jaleco Masculino Premium", "Design Moderno Confortável", "Caimento Perfeito", "Jaleco Alta Qualidade", "Frete Grátis Acima R$499", "Parcele em Até 10x"],
      descriptions: ["Jalecos masculinos modernos e premium. Conforto e presença no ambiente profissional.", "Qualidade que transmite autoridade. Compre online e receba rápido."],
      url: "https://jaleca.com.br/produtos?categoria=jalecos-masculinos",
      path1: "jalecos", path2: "masculinos",
    },
    {
      ag: groups["Profissão"],
      headlines: ["Jalecos Para Profissionais", "Conforto Para Longas Jornadas", "Jalecos Premium Diários", "Frete Grátis Acima R$499", "Parcele em Até 10x", "Médicas e Enfermeiras"],
      descriptions: ["Jalecos para médicas, enfermeiras e dentistas. Premium e conforto para o dia todo.", "Eleve sua imagem profissional. Parcele em 10x ou PIX com desconto."],
      url: "https://jaleca.com.br/produtos",
      path1: "jalecos", path2: "profissional",
    },
    {
      ag: groups["Presente Dia das Mães"],
      headlines: ["Presente Dia das Mães", "Jalecos Para Mães Saúde", "Entrega Dia das Mães", "10x Sem Juros + Frete", "Surpreenda Sua Mãe", "Presente Perfeito Mãe"],
      descriptions: ["Presente perfeito para mães da saúde. Jalecos premium com elegância. Compre agora.", "Entrega garantida Dia das Mães. Parcele em 10x ou PIX com desconto."],
      url: "https://jaleca.com.br/dia-das-maes/saude",
      path1: "dia-das-maes", path2: "presente",
    },
    {
      ag: groups["Marca Jaleca"],
      headlines: ["Jaleca | Loja Oficial", "Jalecos Premium Jaleca", "Compre no Site Oficial", "Frete Grátis SP RJ MG ES", "Parcele em Até 10x", "Jaleca Entrega Rápida"],
      descriptions: ["Loja oficial Jaleca. Jalecos premium femininos e masculinos. Todo o Brasil.", "Parcele em 10x ou PIX com desconto. Compre direto do site oficial."],
      url: "https://jaleca.com.br",
      path1: "loja", path2: "oficial",
    },
  ];

  for (const ad of ads) {
    await customer.mutateResources([{
      entity: "AdGroupAd", operation: "create",
      resource: {
        ad_group: ad.ag,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [ad.url],
          responsive_search_ad: {
            headlines: ad.headlines.map(h => ({ text: h })),
            descriptions: ad.descriptions.map(d => ({ text: d })),
            path1: ad.path1,
            path2: ad.path2,
          },
        },
      },
    }]);
    console.log(`  ✅ ${ad.headlines[0]}`);
  }
}

async function step5_negatives() {
  console.log("\n🚫 STEP 5 — Lista de negativas compartilhada...");

  await customer.mutateResources([{
    entity: "SharedSet", operation: "create",
    resource: {
      resource_name: `customers/${CID}/sharedSets/-100`,
      name: "Negativas Jaleca - Master 2026",
      type: enums.SharedSetType.NEGATIVE_KEYWORDS,
    },
  }]);

  const sets = await customer.query(`SELECT shared_set.resource_name, shared_set.name FROM shared_set WHERE shared_set.name = 'Negativas Jaleca - Master 2026'`);
  const sharedSet = sets[0].shared_set.resource_name;
  console.log(`  ✅ Lista: ${sharedSet}`);

  const terms = [
    "figs", "rachele modas", "rachele", "aspen jalecos", "aspen",
    "casa do jaleco", "boutique dos jalecos", "cherie jalecos", "cherie",
    "belle blanc", "dana jalecos", "dra charm", "companhia do branco",
    "ponto branco", "seu jaleco", "dr jaleco", "shopee", "mercado livre", "amazon",
    "modelo de", "modelos de", "o que é", "o que e", "como fazer",
    "curso", "tutorial", "inspiração", "inspiracao", "molde", "download",
    "grátis", "gratis", "gratuito", "usado", "barato", "alugar", "diy",
    "pijama", "pijama cirurgico", "scrub", "scrubs", "conjunto social",
    "roupa social", "esporte fino", "alfaiataria", "avental", "bordado", "personalizado",
    "teresina", "londrina", "manaus", "goiania", "curitiba",
    "recife", "fortaleza", "salvador", "brasilia",
  ];

  for (let i = 0; i < terms.length; i += 30) {
    const chunk = terms.slice(i, i + 30);
    await customer.mutateResources(chunk.map(t => ({
      entity: "SharedCriterion", operation: "create",
      resource: {
        shared_set: sharedSet,
        keyword: { text: t, match_type: PHRASE },
      },
    })));
  }
  console.log(`  ✅ ${terms.length} negativas adicionadas`);

  // Vincular às 3 novas campanhas + 2 existentes
  const allCampaigns = [CAMP_CORE, CAMP_DDM, CAMP_MARCA,
    `customers/${CID}/campaigns/23728432716`, // Search antigo
    `customers/${CID}/campaigns/23738362243`, // Shopping
  ];
  await customer.mutateResources(allCampaigns.map(c => ({
    entity: "CampaignSharedSet", operation: "create",
    resource: { campaign: c, shared_set: sharedSet },
  })));
  console.log("  ✅ Vinculada a 5 campanhas (3 novas + Search antigo + Shopping)");
}

async function step6_activate() {
  console.log("\n🚀 STEP 6 — Ativando campanhas...");

  await customer.mutateResources([CAMP_CORE, CAMP_DDM, CAMP_MARCA].map(c => ({
    entity: "Campaign", operation: "update",
    resource: { resource_name: c, status: enums.CampaignStatus.ENABLED },
  })));
  console.log("  ✅ 3 campanhas ATIVAS!");
}

async function main() {
  console.log("=".repeat(60));
  console.log("🔥 COMPLETANDO CAMPANHAS GOOGLE ADS — JALECA");
  console.log("=".repeat(60));

  try {
    // Groups + keywords already created — fetch existing groups
    const groupsQuery = await customer.query(`
      SELECT ad_group.resource_name, ad_group.name, ad_group.campaign
      FROM ad_group
      WHERE ad_group.campaign IN ('${CAMP_CORE}', '${CAMP_DDM}', '${CAMP_MARCA}')
    `);
    const groups = {};
    for (const g of groupsQuery) {
      groups[g.ad_group.name] = g.ad_group.resource_name;
    }
    console.log("  Grupos existentes:", Object.keys(groups).join(", "));
    // Skip step2 and step3 - already done
    await step4_ads(groups);
    await step5_negatives();
    await step6_activate();

    console.log("\n" + "=".repeat(60));
    console.log("✅ TUDO PRONTO! CAMPANHAS ATIVAS NO GOOGLE ADS!");
    console.log("=".repeat(60));
    console.log(`
┌────────────────────────────┬───────────┬──────────┐
│ Campanha                   │ Orçamento │ Status   │
├────────────────────────────┼───────────┼──────────┤
│ Core (Fem+Masc+Profissão)  │ R$40/dia  │ ✅ ATIVA  │
│ Dia das Mães 2026          │ R$25/dia  │ ✅ ATIVA  │
│ Marca                      │ R$15/dia  │ ✅ ATIVA  │
│ Shopping                   │ R$20/dia  │ PAUSAR   │
├────────────────────────────┼───────────┼──────────┤
│ TOTAL Google               │ R$80/dia  │          │
│ Meta Remarketing Carrinho  │ R$20/dia  │          │
├────────────────────────────┼───────────┼──────────┤
│ TOTAL GERAL                │ R$100/dia │          │
└────────────────────────────┴───────────┴──────────┘

⚠️  PAUSAR Shopping manualmente no dashboard
⚠️  Em 05/05 subir DdM para R$35/dia
📊  Monitorar em 48h: CTR, add-to-cart, checkout
    `);
  } catch (error) {
    console.error("\n❌ ERRO:", error.message || error);
    if (error.errors) {
      error.errors.forEach((e, i) => {
        console.error(`  Erro ${i+1}:`, e.message, e.location?.field_path_elements?.map(f => f.field_name).join('.'));
      });
    }
    process.exit(1);
  }
}

main();
