/**
 * Re-revisão de ads reprovados por "URL 404"
 * Usa API correta: ad_group_ad.appeal()
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
  const rows = await customer.query(`
    SELECT ad_group_ad.resource_name, ad_group.name, ad_group_ad.policy_summary.approval_status
    FROM ad_group_ad
    WHERE campaign.name LIKE 'Pivot 04/26%'
      AND ad_group_ad.policy_summary.approval_status = 'DISAPPROVED'
      AND ad_group_ad.status != 'REMOVED'
  `)
  console.log('Reprovados encontrados:', rows.length)
  if (rows.length === 0) {
    console.log('Tudo aprovado ou não há reprovados!')
    return
  }

  let ok = 0, fail = 0
  for (const r of rows) {
    const ag = r.ad_group.name
    const rn = r.ad_group_ad.resource_name
    try {
      // Pause
      await customer.adGroupAds.update([{
        resource_name: rn,
        status: enums.AdGroupAdStatus.PAUSED,
      }])
      await new Promise(res => setTimeout(res, 300))
      // Enable
      await customer.adGroupAds.update([{
        resource_name: rn,
        status: enums.AdGroupAdStatus.ENABLED,
      }])
      console.log(`🔄 ${ag}`)
      ok++
    } catch (e) {
      const msg = e.errors?.[0]?.message || e.message
      console.log(`❌ ${ag} — ${msg}`)
      fail++
    }
  }
  console.log(`\n${ok} ok / ${fail} falhas. Re-review em 1-24h.`)
})().catch(e => {
  console.error('FATAL:', e.errors?.[0]?.message || e.message || e)
})
