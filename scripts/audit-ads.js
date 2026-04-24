import { GoogleAdsApi } from "google-ads-api";
import dotenv from "dotenv";
dotenv.config({ path: ".env.google-ads" });
dotenv.config({ path: ".env.local", override: false });

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});
const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const campaigns = await customer.query(`
  SELECT campaign.id, campaign.name, campaign.status,
         campaign_budget.resource_name, campaign_budget.amount_micros
  FROM campaign
  WHERE campaign.status IN ('ENABLED','PAUSED')
  ORDER BY campaign.name
`);
console.log("\n=== GOOGLE CAMPAIGNS ===");
for (const r of campaigns) {
  const budget = r.campaign_budget?.amount_micros ? (r.campaign_budget.amount_micros/1e6).toFixed(0) : '?';
  console.log(`${String(r.campaign.status).padEnd(8)} R$${String(budget).padStart(4)}/dia | ${r.campaign.name}`);
  console.log(`         budget_rn: ${r.campaign_budget?.resource_name}`);
}

const userLists = await customer.query(`
  SELECT user_list.resource_name, user_list.name, user_list.size_for_display
  FROM user_list
`);
console.log("\n=== GOOGLE USER LISTS ===");
for (const r of userLists) {
  console.log(`${String(r.user_list.size_for_display||0).padStart(8)} users | ${r.user_list.name} → ${r.user_list.resource_name}`);
}

const META_TOKEN = process.env.META_ADS_TOKEN;
const META_ACCOUNT = process.env.META_ADS_ACCOUNT_ID;
const metaRes = await fetch(`https://graph.facebook.com/v21.0/act_${META_ACCOUNT}/campaigns?fields=id,name,status,daily_budget,objective&access_token=${META_TOKEN}`);
const metaData = await metaRes.json();
console.log("\n=== META CAMPAIGNS ===");
if (metaData.data) {
  for (const c of metaData.data) {
    const budget = c.daily_budget ? `R$${(c.daily_budget/100).toFixed(0)}/dia` : 'lifetime/sem budget diário';
    console.log(`${c.status.padEnd(10)} ${budget.padEnd(16)} [${c.id}] ${c.name}`);
  }
} else console.log(JSON.stringify(metaData));

const catRes = await fetch(`https://graph.facebook.com/v21.0/1284297553808241/product_catalogs?fields=id,name&access_token=${META_TOKEN}`);
const catData = await catRes.json();
console.log("\n=== META CATALOGS ===");
if (catData.data) for (const c of catData.data) console.log(`[${c.id}] ${c.name}`);
else console.log(JSON.stringify(catData));
