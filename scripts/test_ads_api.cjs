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
  try {
    const r = await customer.campaignBudgets.create([{
      name: 'TEST DELETE ' + Date.now(),
      amount_micros: 1_000_000,
      delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    }])
    console.log('RESULT TYPE:', typeof r, 'isArray:', Array.isArray(r))
    console.log('RESULT:', JSON.stringify(r, null, 2).slice(0, 500))
  } catch (e) {
    console.log('ERR:', e.message || e)
    if (e.errors) console.log('Detail:', JSON.stringify(e.errors[0]).slice(0, 300))
  }
})()
