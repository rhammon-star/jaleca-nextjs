/**
 * FINALIZAR GOOGLE ADS
 * 1. Remover keywords "jaleco feminino" do Core
 * 2. Excluir campanha duplicada (tentativa com erro)
 * 3. Criar Responsive Display Ad no Remarketing Display
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

// ── 1. REMOVER KEYWORDS SOBREPOSTAS DO CORE ──────────────────
console.log("\n🗑️  1. REMOVENDO keywords 'jaleco feminino' do Core - Jalecos");

const KWS_REMOVER = [
  "customers/4446591621/adGroupCriteria/197260252484~298386505583", // jaleco feminino EXACT
  "customers/4446591621/adGroupCriteria/197260252484~304017459993", // jaleco feminino PHRASE
];

for (const rn of KWS_REMOVER) {
  await customer.adGroupCriteria.remove([rn]);
  console.log(`  ✅ Removida: ${rn.split("~")[1]}`);
}

// ── 2. EXCLUIR CAMPANHA DUPLICADA ────────────────────────────
console.log("\n🗑️  2. EXCLUINDO campanha duplicada (falha anterior)");

const DUPLICATA_RN = "customers/4446591621/campaigns/23786728936"; // Jaleco Feminino 1776912667369
await customer.campaigns.remove([DUPLICATA_RN]);
console.log("  ✅ Campanha duplicada removida");

// ── 3. CRIAR DISPLAY AD NO REMARKETING ───────────────────────
console.log("\n🎨 3. CRIANDO Responsive Display Ad");

const DISPLAY_ADGROUP_RN = "customers/4446591621/adGroups/198881036547";

// Download e encode imagens do site
async function downloadAsBase64(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

function parseRes(r) {
  if (Array.isArray(r)) return r[0];
  if (r?.results?.[0]?.resource_name) return r.results[0].resource_name;
  return r;
}

// Upload imagem hero (1200x628 aprox — ratio 1.91:1)
console.log("  📥 Download imagem hero...");
const heroBase64 = await downloadAsBase64("https://jaleca.com.br/jaleco-hero-ORIGINAL.jpg");
const heroAssetResult = await customer.assets.create([{
  name: "Jaleca Hero 1.91:1",
  type: enums.AssetType.IMAGE,
  image_asset: { data: heroBase64 },
}]);
const heroAssetRN = parseRes(heroAssetResult);
console.log(`  ✅ Hero asset: ${heroAssetRN}`);

// Upload imagem quadrada (logo/produto)
console.log("  📥 Download imagem quadrada...");
const squareBase64 = await downloadAsBase64("https://jaleca.com.br/icon-flower.png");
const squareAssetResult = await customer.assets.create([{
  name: "Jaleca Logo Square",
  type: enums.AssetType.IMAGE,
  image_asset: { data: squareBase64 },
}]);
const squareAssetRN = parseRes(squareAssetResult);
console.log(`  ✅ Square asset: ${squareAssetRN}`);

// Criar Responsive Display Ad
await customer.adGroupAds.create([{
  ad_group: DISPLAY_ADGROUP_RN,
  status: enums.AdGroupAdStatus.ENABLED,
  ad: {
    final_urls: ["https://jaleca.com.br/jaleco-feminino"],
    responsive_display_ad: {
      marketing_images:       [{ asset: heroAssetRN }],
      square_marketing_images:[{ asset: squareAssetRN }],
      logo_images:            [{ asset: squareAssetRN }],
      headlines: [
        { text: "Jaleca — Jaleco Profissional" },
        { text: "Veja os Jalecos que Você Viu" },
        { text: "Frete Grátis no Sudeste" },
        { text: "PP ao G3 — 12 Cores" },
        { text: "Troca Fácil em 30 Dias" },
      ],
      long_headline: { text: "Jaleco premium para profissionais da saúde, beleza e gastronomia." },
      descriptions: [
        { text: "Volte e escolha seu jaleco. Frete grátis no Sudeste acima de R$499." },
        { text: "PP ao G3. 12 cores. PIX com 5% de desconto. Troca em 30 dias." },
      ],
      business_name: "Jaleca",
    },
  },
}]);
console.log("  ✅ Responsive Display Ad criado → jaleca.com.br/jaleco-feminino");

console.log(`
${"=".repeat(60)}
✅ GOOGLE ADS FINALIZADO!

  ✅ Keywords "jaleco feminino" removidas do Core
  ✅ Campanha duplicada excluída
  ✅ Responsive Display Ad criado no Remarketing

⚠️  AINDA MANUAL:
  - Shopping: destino não pode ser mudado via API para
    campanhas de produto (URLs vêm do Merchant Center feed).
    Para reduzir bounce, otimize as páginas de produto.
  - Dia das Mães: rode este script em 28/04:
    node scripts/ativar-dia-das-maes.js
${"=".repeat(60)}
`);
