/**
 * Pausa TODAS campanhas antigas (não-Pivot) que estão ENABLED
 * Ativa TODAS campanhas "Pivot 04/26" que estão PAUSED
 */
const { GoogleAdsApi, enums } = require('google-ads-api')
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
  const all = await customer.query(`
    SELECT campaign.resource_name, campaign.name, campaign.status
    FROM campaign WHERE campaign.status != 'REMOVED'
  `)

  const toPause = all.filter(r => r.campaign.status === 2 && !r.campaign.name.startsWith('Pivot 04/26'))
  const toEnable = all.filter(r => r.campaign.status === 3 && r.campaign.name.startsWith('Pivot 04/26'))

  console.log(`\n⏸  PAUSAR (${toPause.length} antigas):`)
  for (const r of toPause) console.log(`  - ${r.campaign.name}`)
  console.log(`\n▶️  ATIVAR (${toEnable.length} Pivot):`)
  for (const r of toEnable) console.log(`  - ${r.campaign.name}`)

  if (toPause.length > 0) {
    await customer.campaigns.update(toPause.map(r => ({
      resource_name: r.campaign.resource_name,
      status: enums.CampaignStatus.PAUSED,
    })))
    console.log(`\n✅ ${toPause.length} campanhas antigas PAUSADAS`)
  }

  if (toEnable.length > 0) {
    await customer.campaigns.update(toEnable.map(r => ({
      resource_name: r.campaign.resource_name,
      status: enums.CampaignStatus.ENABLED,
    })))
    console.log(`✅ ${toEnable.length} campanhas Pivot ATIVADAS`)
  }

  // Verify final state
  const after = await customer.query(`
    SELECT campaign.resource_name, campaign.name, campaign.status, campaign_budget.amount_micros
    FROM campaign WHERE campaign.status = 'ENABLED'
  `)
  console.log(`\n=== ${after.length} CAMPANHAS ATIVAS APÓS SWAP ===`)
  let total = 0
  for (const r of after) {
    const reais = (r.campaign_budget?.amount_micros || 0) / 1_000_000
    total += reais
    console.log(`  R$${reais}/dia | ${r.campaign.name}`)
  }
  console.log(`TOTAL: R$${total}/dia → R$${total*30}/mês`)
})().catch(e => {
  console.error('FATAL:', e.errors?.[0]?.message || e.message)
})
