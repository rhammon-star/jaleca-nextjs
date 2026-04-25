/**
 * Limpa campanhas/budgets do Pivot que estão incompletos (sem ads).
 * Para rodar antes de re-executar criar-campanhas-pivot-2026-04.cjs
 */
const { GoogleAdsApi } = require('google-ads-api')
const fs = require('fs')

const env = {}
fs.readFileSync('/Users/rhammon/SiteJaleca/jaleca-nextjs/.env.tmp','utf-8').split('\n').forEach(l => {
  const m = l.match(/^([A-Z_]+)="?(.+?)"?$/); if (m) env[m[1]] = m[2]
})
const client = new GoogleAdsApi({
  client_id: env.GOOGLE_ADS_CLIENT_ID,
  client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: env.GOOGLE_ADS_DEVELOPER_TOKEN,
})
const customer = client.Customer({
  customer_id: env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, ''),
  login_customer_id: env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, ''),
  refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
})

;(async () => {
  // Find all Pivot 04/26 campaigns
  const campaigns = await customer.query(`
    SELECT campaign.resource_name, campaign.name, campaign.campaign_budget
    FROM campaign
    WHERE campaign.name LIKE 'Pivot 04/26%' AND campaign.status != 'REMOVED'
  `)
  console.log(`Encontradas ${campaigns.length} campanhas Pivot 04/26`)
  for (const row of campaigns) console.log(`  - ${row.campaign.name} → ${row.campaign.resource_name}`)

  // Delete campaigns
  const campResources = campaigns.map(r => r.campaign.resource_name)
  if (campResources.length > 0) {
    await customer.campaigns.remove(campResources)
    console.log(`✅ ${campResources.length} campanhas deletadas`)
  }

  // Delete orphan budgets
  const budgets = await customer.query(`
    SELECT campaign_budget.resource_name, campaign_budget.name
    FROM campaign_budget
    WHERE campaign_budget.name LIKE 'Pivot 04/26%' AND campaign_budget.reference_count = 0
  `)
  const budResources = budgets.map(r => r.campaign_budget.resource_name)
  if (budResources.length > 0) {
    await customer.campaignBudgets.remove(budResources)
    console.log(`✅ ${budResources.length} budgets órfãos deletados`)
  }
  console.log('\n🟢 Cleanup completo. Agora rode: node scripts/criar-campanhas-pivot-2026-04.cjs')
})().catch(e => {
  console.error('ERR:', e.errors?.[0]?.message || e.message)
  if (e.errors) console.error(JSON.stringify(e.errors, null, 2).slice(0, 800))
})
