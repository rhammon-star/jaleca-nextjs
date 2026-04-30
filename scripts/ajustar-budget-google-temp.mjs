/**
 * Ajuste temporário de budgets Google Ads — 29/04/2026
 * Reduz gastos enquanto rastreamento de conversão está sendo corrigido.
 * Total: R$130/dia → R$45/dia
 */

import { GoogleAdsApi } from "google-ads-api";
import { readFileSync } from "fs";

const envFile = readFileSync("/Users/rhammon/SiteJaleca/jaleca-nextjs/.env.tmp", "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const m = line.match(/^([A-Z_0-9]+)="?(.+?)"?$/);
  if (m) env[m[1]] = m[2];
});

const client = new GoogleAdsApi({
  client_id: env.GOOGLE_ADS_CLIENT_ID,
  client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, ""),
  login_customer_id: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, ""),
  refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
});

// Novos orçamentos aprovados pelo usuário
const NOVOS_BUDGETS = {
  "Branded":       10,
  "Saúde TIER 1":  10,
  "Saúde TIER 1B":  7,
  "Modelos":        5,
  "Defesa":         3,
  "Comerciais":     5,
  "WhatsApp":       5,
};

const microAmount = (r) => Math.round(r * 1_000_000);

console.log("\n🔧 Ajuste de Budgets Google Ads — Temporário");
console.log("━".repeat(55));

// Buscar campanhas e seus budgets ativos
const rows = await customer.query(`
  SELECT
    campaign.name,
    campaign.status,
    campaign_budget.resource_name,
    campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.status IN ('ENABLED','PAUSED')
  ORDER BY campaign_budget.amount_micros DESC
`);

console.log(`\n📋 Campanhas encontradas: ${rows.length}\n`);

const updates = [];

for (const r of rows) {
  const nome = r.campaign.name;
  const budgetRN = r.campaign_budget.resource_name;
  const atualMicros = r.campaign_budget.amount_micros || 0;
  const atualReais = atualMicros / 1_000_000;

  // Encontra a chave correspondente no mapa (busca parcial)
  const chave = Object.keys(NOVOS_BUDGETS).find((k) =>
    nome.toLowerCase().includes(k.toLowerCase())
  );

  if (!chave) {
    console.log(`  ⏭  Ignorando: ${nome} (não mapeada)`);
    continue;
  }

  const novoReais = NOVOS_BUDGETS[chave];
  const novoMicros = microAmount(novoReais);

  if (atualMicros === novoMicros) {
    console.log(`  ✅ ${nome}: R$${atualReais} — já correto`);
    continue;
  }

  console.log(`  📝 ${nome}: R$${atualReais} → R$${novoReais}`);
  updates.push({ resource_name: budgetRN, amount_micros: novoMicros, _label: nome, _novo: novoReais });
}

if (updates.length === 0) {
  console.log("\n✅ Nenhuma atualização necessária.");
  process.exit(0);
}

console.log(`\n🚀 Aplicando ${updates.length} atualizações...`);

try {
  await customer.campaignBudgets.update(
    updates.map(({ resource_name, amount_micros }) => ({ resource_name, amount_micros }))
  );
  console.log("✅ Budgets atualizados com sucesso!\n");
} catch (e) {
  console.error("❌ Erro ao atualizar:", e.message);
  process.exit(1);
}

// Verificação final
console.log("🔍 Verificando valores atualizados...");
console.log("━".repeat(55));

const rowsAfter = await customer.query(`
  SELECT
    campaign.name,
    campaign.status,
    campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.status IN ('ENABLED','PAUSED')
  ORDER BY campaign_budget.amount_micros DESC
`);

let totalDia = 0;
for (const r of rowsAfter) {
  const reais = (r.campaign_budget.amount_micros || 0) / 1_000_000;
  totalDia += reais;
  console.log(`  [${r.campaign.status}] ${r.campaign.name}: R$${reais}/dia`);
}

console.log("━".repeat(55));
console.log(`  💰 TOTAL: R$${totalDia}/dia`);
console.log("\n✅ Ajuste concluído.\n");
