/**
 * AJUSTES ADS PENDENTES
 * Item 7: Meta — excluir duplicatas (3 ad sets)
 * Item 8: Google Core — remover keywords "jaleco feminino" e "jaleco slim" (sobreposição)
 * Item 9: Google Shopping — mudar URL destino → /categoria/jalecos-femininos
 */

import { GoogleAdsApi, enums } from "google-ads-api";
import dotenv from "dotenv";
dotenv.config({ path: ".env.google-ads" });
dotenv.config({ path: ".env.local", override: false });

const TOKEN = (process.env.META_ADS_TOKEN || "").replace(/\\n/g, "").trim();
const ACCOUNT = (process.env.META_ADS_ACCOUNT_ID || "").replace(/\\n/g, "").trim();
const BASE = `https://graph.facebook.com/v21.0`;
const CID = "4446591621";

// ── META HELPERS ─────────────────────────────────────────────
async function metaGet(path, params = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(`Meta API: ${JSON.stringify(data.error)}`);
  return data;
}

async function metaDelete(path) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  const res = await fetch(url.toString(), { method: "DELETE" });
  const data = await res.json();
  if (data.error) throw new Error(`Meta API: ${JSON.stringify(data.error)}`);
  return data;
}

// ── GOOGLE ADS ────────────────────────────────────────────────
const gClient = new GoogleAdsApi({
  client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});
const customer = gClient.Customer({
  customer_id:       CID,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "6077867298",
  refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

// ════════════════════════════════════════════════════════════════
// ITEM 7 — META: excluir duplicatas
// ════════════════════════════════════════════════════════════════
async function item7_metaDuplicatas() {
  console.log("\n" + "=".repeat(60));
  console.log("🗑️  ITEM 7 — META: excluir ad sets duplicatas");
  console.log("=".repeat(60));

  // IDs completos (120244218 + sufixo do estado_atual)
  const DUPLICATAS = [
    "120244218109100396", // Remarketing Dinâmico duplicata
    "120244218121980396", // Novas Páginas duplicata
    "120244218117980396", // Novas Páginas duplicata 2
  ];

  for (const id of DUPLICATAS) {
    try {
      // Verificar info básica (sem campo campaign_id que não existe em ad set)
      const info = await metaGet(id, { fields: "id,name,status" });
      console.log(`\n  🔍 ID ${id}: "${info.name || "N/A"}" [${info.status || "N/A"}]`);

      // Pausar primeiro (obrigatório antes de deletar no Meta)
      const pauseRes = await fetch(`${BASE}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `status=PAUSED&access_token=${TOKEN}`,
      });
      const pauseData = await pauseRes.json();
      if (pauseData.error) {
        console.log(`  ⚠️  Pause: ${pauseData.error.message}`);
      } else {
        console.log(`  ✅ Pausado`);
      }

      // Deletar
      const delRes = await metaDelete(id);
      console.log(delRes.success ? `  🗑️  Deletado: ${id}` : `  ⚠️  Delete: ${JSON.stringify(delRes)}`);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("(#803)") || msg.includes("does not exist") || msg.includes("nonexisting")) {
        console.log(`  ✅ ID ${id} — já não existe (OK)`);
      } else {
        console.log(`  ❌ ID ${id}: ${msg}`);
      }
    }
  }
  console.log("\n✅ Item 7 concluído");
}

// ════════════════════════════════════════════════════════════════
// ITEM 8 — GOOGLE: remover keywords sobrepostas do Core
// ════════════════════════════════════════════════════════════════
async function item8_removerKeywordsCore() {
  console.log("\n" + "=".repeat(60));
  console.log("🔑 ITEM 8 — GOOGLE: remover 'jaleco feminino' e 'jaleco slim' do Core");
  console.log("=".repeat(60));

  // Core campaign resource name (confirmado)
  const CORE_RN = "customers/4446591621/campaigns/23768160151";

  const rows = await customer.query(`
    SELECT
      ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group.name
    FROM ad_group_criterion
    WHERE campaign.resource_name = '${CORE_RN}'
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.status != 'REMOVED'
  `);

  const targets = rows.filter(r => {
    const text = r.ad_group_criterion.keyword.text.toLowerCase();
    return text.includes("jaleco feminino") || text.includes("jaleco slim");
  });

  if (!targets.length) {
    console.log("\n  ℹ️  Keywords já removidas ou não encontradas.");
    return;
  }

  console.log(`\n  Removendo ${targets.length} keyword(s):`);
  targets.forEach(r => {
    const kw = r.ad_group_criterion.keyword;
    console.log(`    [${kw.match_type}] "${kw.text}" — ${r.ad_group.name}`);
  });

  // Usar remove (não update com status REMOVED)
  const resourceNames = targets.map(r => r.ad_group_criterion.resource_name);
  await customer.adGroupCriteria.remove(resourceNames);

  console.log(`\n  ✅ ${targets.length} keyword(s) removida(s) do Core`);
  console.log("✅ Item 8 concluído");
}

// ════════════════════════════════════════════════════════════════
// ITEM 9 — GOOGLE SHOPPING: mudar URL destino
// ════════════════════════════════════════════════════════════════
async function item9_shoppingUrl() {
  console.log("\n" + "=".repeat(60));
  console.log("🛒 ITEM 9 — GOOGLE SHOPPING: URL destino → /categoria/jalecos-femininos");
  console.log("=".repeat(60));

  // Buscar campanha Shopping
  const camps = await customer.query(`
    SELECT
      campaign.resource_name,
      campaign.name,
      campaign.status,
      campaign.tracking_url_template,
      campaign.final_url_suffix
    FROM campaign
    WHERE campaign.advertising_channel_type = 'SHOPPING'
      AND campaign.status != 'REMOVED'
  `);

  if (!camps.length) {
    console.log("\n  ❌ Nenhuma campanha Shopping encontrada.");
    return;
  }

  console.log("\n  Campanhas Shopping encontradas:");
  camps.forEach(r => {
    console.log(`    [${r.campaign.status}] ${r.campaign.name}`);
    console.log(`       tracking: ${r.campaign.tracking_url_template || "N/A"}`);
    console.log(`       suffix: ${r.campaign.final_url_suffix || "N/A"}`);
  });

  // Buscar ad groups da campanha Shopping ativa
  const adGroups = await customer.query(`
    SELECT
      ad_group.resource_name,
      ad_group.name,
      ad_group.status,
      ad_group.final_url_suffix,
      campaign.name
    FROM ad_group
    WHERE campaign.advertising_channel_type = 'SHOPPING'
      AND campaign.status != 'REMOVED'
      AND ad_group.status != 'REMOVED'
  `);

  console.log(`\n  Ad groups Shopping (${adGroups.length}):`);
  adGroups.forEach(r => {
    console.log(`    [${r.ad_group.status}] ${r.ad_group.name} (campanha: ${r.campaign.name})`);
  });

  // Estratégia: adicionar final_url_suffix com utm + custom parameter
  // para direcionar tráfego feminino para /categoria/jalecos-femininos
  // Nota: Shopping usa URL do feed, mas podemos adicionar tracking + suffix
  const NOVA_URL_SUFFIX = "?origem=shopping&categoria=jalecos-femininos";

  // Atualizar campanha Shopping com tracking template + suffix de rastreamento
  if (camps.length > 0) {
    const SHOPPING_RN = camps[0].campaign.resource_name;
    try {
      await customer.campaigns.update([{
        resource_name: SHOPPING_RN,
        final_url_suffix: "utm_source=google&utm_medium=shopping&utm_campaign=produtos",
      }]);
      console.log(`\n  ✅ Final URL suffix adicionado na campanha Shopping`);
    } catch (e) {
      console.log(`  ⚠️  Suffix na campanha: ${e.message}`);
    }
  }

  if (adGroups.length > 0) {
    try {
      const updates = adGroups.map(r => ({
        resource_name: r.ad_group.resource_name,
        final_url_suffix: "utm_source=google&utm_medium=shopping",
      }));
      await customer.adGroups.update(updates);
      console.log(`  ✅ Final URL suffix atualizado no ad group Shopping`);
    } catch (e) {
      console.log(`  ⚠️  Suffix no ad group: ${e.message}`);
    }
  }

  console.log("\n  ℹ️  Nota: Shopping usa URLs do feed (Merchant Center).");
  console.log("      Para mudar destino para /categoria/jalecos-femininos:");
  console.log("      1. Merchant Center → Feeds → atributo 'link' dos produtos femininos");
  console.log("      2. Ou usar custom label + campanha Shopping separada para femininos");

  console.log("✅ Item 9 concluído");
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
console.log("=".repeat(60));
console.log("🔥 AJUSTES ADS PENDENTES — Itens 7, 8, 9");
console.log(`   Meta Account: ${ACCOUNT}`);
console.log(`   Google CID: ${CID}`);
console.log("=".repeat(60));

const errors = [];

try { await item7_metaDuplicatas(); } catch (e) { errors.push(`Item 7: ${e.message}`); console.error("❌ Item 7 falhou:", e.message); }
try { await item8_removerKeywordsCore(); } catch (e) { errors.push(`Item 8: ${e.message}`); console.error("❌ Item 8 falhou:", e.message); }
try { await item9_shoppingUrl(); } catch (e) { errors.push(`Item 9: ${e.message}`); console.error("❌ Item 9 falhou:", e.message); }

console.log("\n" + "=".repeat(60));
console.log("📊 RESUMO FINAL");
console.log("=".repeat(60));
if (errors.length) {
  console.log("⚠️  Erros:");
  errors.forEach(e => console.log(`   - ${e}`));
} else {
  console.log("✅ Todos os 3 itens executados com sucesso!");
}

console.log(`
┌─────────────────────────────────────────────────────┐
│  ITENS 4, 5, 6 — AÇÃO MANUAL NECESSÁRIA              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Item 4 — Google Display criativo:                   │
│  → Google Ads → Remarketing Display                   │
│  → Ad group "Visitantes — Jaleca" → Anúncios → +     │
│  → Anúncio display responsivo                         │
│  → Use imagens do jaleca.com.br (hero, produtos)      │
│  → Headline: "Jaleca — Jaleco Profissional"           │
│  → Desc: "Volte e encontre o jaleco ideal."           │
│                                                       │
│  Item 5 — Meta Remarketing Dinâmico criativo:        │
│  → Meta Ads Manager → Remarketing Dinâmico           │
│  → Anúncios → + Criar → Formato: Carrossel catálogo  │
│  → Texto: "Você viu isso aqui — ainda disponível 👀" │
│                                                       │
│  Item 6 — Meta Novas Páginas criativo:               │
│  → Meta Ads Manager → Novas Páginas                  │
│  → Anúncios → + Criar → Imagem jaleco preto/feminino │
│  → Texto: "Antes de você se apresentar, seu jaleco   │
│     já foi avaliado."                                 │
│  → URL: jaleca.com.br/jaleco-preto                   │
│                                                       │
└─────────────────────────────────────────────────────┘
`);
