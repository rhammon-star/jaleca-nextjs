/**
 * OTIMIZAÇÃO ADS — 07/05/2026
 * Itens executados:
 *   1. Adicionar negative keywords nas campanhas ativas
 *   4. Atualizar copies RSA da campanha Jaleco Feminino
 *   5. Adicionar novas keywords à campanha Jaleco Feminino
 */

import { GoogleAdsApi, enums } from "google-ads-api";

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});

const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID;

// IDs coletados via API
const CAMP_MARCA        = "23768160157";
const CAMP_SHOPPING     = "23738362243";
const CAMP_JF           = "23812704668"; // Jaleca — Search — Jaleco Feminino
const ADGROUP_JF        = "197682819002";
const AD_JF             = "807529387864";

// ============================================================
// ITEM 1 — NEGATIVE KEYWORDS
// ============================================================

async function addNegatives() {
  console.log("\n📛 ITEM 1 — Adicionando negative keywords...");

  // Negativas novas (além das que já existem na lista compartilhada)
  const negatives = [
    // Concorrentes detectados nos search terms
    { text: "dra cherie", matchType: enums.KeywordMatchType.PHRASE },
    { text: "dracherie", matchType: enums.KeywordMatchType.PHRASE },
    { text: "dra charm", matchType: enums.KeywordMatchType.PHRASE },
    { text: "dracharm", matchType: enums.KeywordMatchType.PHRASE },
    { text: "rute falco", matchType: enums.KeywordMatchType.PHRASE },
    // Produto errado - detectados nos search terms
    { text: "scrub", matchType: enums.KeywordMatchType.PHRASE },
    { text: "pijama cirurgico", matchType: enums.KeywordMatchType.PHRASE },
    { text: "pijama cirúrgico", matchType: enums.KeywordMatchType.PHRASE },
    { text: "macacão", matchType: enums.KeywordMatchType.PHRASE },
    { text: "macacao", matchType: enums.KeywordMatchType.PHRASE },
    { text: "touca", matchType: enums.KeywordMatchType.PHRASE },
    { text: "propé", matchType: enums.KeywordMatchType.PHRASE },
    { text: "luva cirurgica", matchType: enums.KeywordMatchType.PHRASE },
    // Intenção fabricante/atacado
    { text: "fabrica de jaleco", matchType: enums.KeywordMatchType.PHRASE },
    { text: "fabrica jaleco", matchType: enums.KeywordMatchType.PHRASE },
    { text: "fabricante", matchType: enums.KeywordMatchType.PHRASE },
    { text: "atacadista", matchType: enums.KeywordMatchType.PHRASE },
    { text: "distribuidora", matchType: enums.KeywordMatchType.PHRASE },
    { text: "fornecedor", matchType: enums.KeywordMatchType.PHRASE },
    { text: "revenda", matchType: enums.KeywordMatchType.PHRASE },
    { text: "atacado jaleco", matchType: enums.KeywordMatchType.PHRASE },
    // Informacional
    { text: "como lavar", matchType: enums.KeywordMatchType.PHRASE },
    { text: "como passar", matchType: enums.KeywordMatchType.PHRASE },
    { text: "tabela de medidas", matchType: enums.KeywordMatchType.PHRASE },
    { text: "o que é jaleco", matchType: enums.KeywordMatchType.PHRASE },
    { text: "historia do jaleco", matchType: enums.KeywordMatchType.PHRASE },
    { text: "faculdade", matchType: enums.KeywordMatchType.PHRASE },
    { text: "universidade", matchType: enums.KeywordMatchType.PHRASE },
    { text: "escola", matchType: enums.KeywordMatchType.PHRASE },
    // Segunda mão / grátis
    { text: "segunda mao", matchType: enums.KeywordMatchType.PHRASE },
    { text: "segunda mão", matchType: enums.KeywordMatchType.PHRASE },
    { text: "aluguel", matchType: enums.KeywordMatchType.PHRASE },
    { text: "aluguer", matchType: enums.KeywordMatchType.PHRASE },
  ];

  const campaignIds = [CAMP_MARCA, CAMP_SHOPPING, CAMP_JF];
  let total = 0;

  for (const campaignId of campaignIds) {
    const campResource = `customers/${CUSTOMER_ID}/campaigns/${campaignId}`;
    const criteria = negatives.map((n) => ({
      campaign: campResource,
      negative: true,
      keyword: {
        text: n.text,
        match_type: n.matchType,
      },
    }));

    try {
      await customer.campaignCriteria.create(criteria);
      console.log(`  ✅ Campanha ${campaignId}: ${negatives.length} negatives adicionados`);
      total += negatives.length;
    } catch (e) {
      // Ignorar duplicatas (error code 7)
      const errs = e.errors || [];
      const dupes = errs.filter(er => er.error_code?.criterion_error === 7 || String(er.message).includes('already exists'));
      const real = errs.length - dupes.length;
      if (real === 0) {
        console.log(`  ⚠️  Campanha ${campaignId}: já existiam (sem novas adicionadas)`);
      } else {
        console.error(`  ❌ Campanha ${campaignId}: ${e.message?.slice(0, 300)}`);
      }
    }
  }

  console.log(`  → Total: ${total} negatives adicionados\n`);
}

// ============================================================
// ITEM 4 — ATUALIZAR COPIES RSA (Jaleco Feminino)
// ============================================================

async function updateRSACopy() {
  console.log("✏️  ITEM 4 — Atualizando copies RSA Jaleco Feminino...");

  const adResource = `customers/${CUSTOMER_ID}/adGroupAds/${ADGROUP_JF}~${AD_JF}`;

  const newHeadlines = [
    "Jaleco Feminino com Entrega Rápida",
    "200 Mil Peças Vendidas",
    "Avaliação 4,9 ⭐ — Troca Grátis",
    "Jaleco Slim, Princesa e Elastex",
    "Para Médica, Dentista e Estudante",
    "Jaleco Feminino PP ao G3",
    "Jaleco Feminino 12 Cores",
    "Jaleco Feminino Acinturado",
    "Jaleco Feminino Branco Premium",
    "Frete Grátis Sudeste Acima R$499",
    "Comprar Jaleco Feminino Online",
    "Modelagem Feminina Exclusiva",
    "Parcele em 3x Sem Juros",
    "PIX com 5% de Desconto",
    "Jaleco para Médica Online",
  ];

  const newDescriptions = [
    "Jaleco feminino com modelagem exclusiva. Slim, Princesa e Elastex. Branco, preto e +10 cores. Troca grátis.",
    "Para médicas, dentistas, farmacêuticas e estudantes. PP ao G3. Entrega rápida para todo Brasil.",
    "200 mil peças vendidas. Avaliação 4,9. Troca 30 dias. Frete grátis Sudeste acima de R$499.",
    "Jaleco acinturado e confortável. Tamanhos PP ao G3. PIX com 5% off ou parcele em 3x sem juros.",
  ];

  try {
    await customer.adGroupAds.update([
      {
        resource_name: adResource,
        ad: {
          responsive_search_ad: {
            headlines: newHeadlines.map((h, i) => ({
              text: h,
              pinned_field: i === 0 ? enums.ServedAssetFieldType.HEADLINE_1 : undefined,
            })),
            descriptions: newDescriptions.map((d) => ({ text: d })),
          },
        },
      },
    ]);
    console.log(`  ✅ RSA atualizado: ${newHeadlines.length} headlines, ${newDescriptions.length} descriptions\n`);
  } catch (e) {
    console.error(`  ❌ Erro ao atualizar RSA: ${e.message?.slice(0, 400)}\n`);
    console.error(JSON.stringify(e.errors || e, null, 2));
  }
}

// ============================================================
// ITEM 5 — NOVAS KEYWORDS (Jaleco Feminino)
// ============================================================

async function addKeywords() {
  console.log("🔑 ITEM 5 — Adicionando novas keywords à campanha Jaleco Feminino...");

  const adGroupResource = `customers/${CUSTOMER_ID}/adGroups/${ADGROUP_JF}`;

  const newKeywords = [
    { text: "jaleco para estudante de medicina", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino hospitalar", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino medicina", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino odontologia", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino psicologia", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino farmácia", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino enfermagem", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco médico feminino", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco branco feminino", matchType: enums.KeywordMatchType.PHRASE },
    { text: "comprar jaleco feminino online", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino com nome", matchType: enums.KeywordMatchType.PHRASE },
    { text: "jaleco feminino tamanho grande", matchType: enums.KeywordMatchType.PHRASE },
  ];

  const criteria = newKeywords.map((kw) => ({
    ad_group: adGroupResource,
    status: enums.AdGroupCriterionStatus.ENABLED,
    keyword: {
      text: kw.text,
      match_type: kw.matchType,
    },
  }));

  try {
    await customer.adGroupCriteria.create(criteria);
    console.log(`  ✅ ${newKeywords.length} keywords adicionadas:`);
    newKeywords.forEach((kw) => console.log(`     → "${kw.text}"`));
  } catch (e) {
    console.error(`  ❌ Erro ao adicionar keywords: ${e.message?.slice(0, 400)}`);
    console.error(JSON.stringify(e.errors || e, null, 2));
  }
}

// ============================================================
// MAIN
// ============================================================

console.log("🚀 Otimização Google Ads — Jaleca — 07/05/2026\n");

await addNegatives();
await updateRSACopy();
await addKeywords();

console.log("\n✅ Otimização concluída!");
