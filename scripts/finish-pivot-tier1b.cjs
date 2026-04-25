/**
 * Adiciona ad groups + ads que faltaram na TIER 1B (#536723)
 * Faltaram: Jaleco Odontologia, Jaleco Nutrição, Jaleco Farmácia
 * + Adiciona ads para os ad groups existentes sem anúncios:
 *   - Jaleco Psicóloga (TIER 1) — ad group sem ad
 *   - Jaleco Fisioterapia (TIER 1B) — ad group sem ad
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
const micro = (r) => Math.round(r * 1_000_000)

const HEADLINES = [
  'Jaleca Uniformes',
  'Tecido Premium · Elastano',
  'PIX 5% Off · 3x Sem Juros',
  'Frete Grátis SE R$499+',
  'Do PP ao G3 · 12 Cores',
  'Troca em Até 30 Dias',
  '+200 Mil Peças Vendidas',
]
const DESC = [
  'Tecido com elastano, modelagem que veste. PIX 5% off, 3x sem juros, frete grátis SE.',
  'Fabricante com estoque próprio. Do PP ao G3 em 12 cores. Troca em até 30 dias.',
  'Slim, Profissional ou Princesa. Comprou e não serviu? Trocamos em 30 dias.',
]

;(async () => {
  // Find TIER 1 and TIER 1B campaigns of #536723 set
  const camps = await customer.query(`
    SELECT campaign.resource_name, campaign.name FROM campaign
    WHERE campaign.name LIKE 'Pivot 04/26 — Saúde TIER%#536723' AND campaign.status != 'REMOVED'
  `)
  const tier1 = camps.find(c => c.campaign.name.includes('TIER 1 #'))?.campaign.resource_name
  const tier1b = camps.find(c => c.campaign.name.includes('TIER 1B'))?.campaign.resource_name
  console.log('TIER 1:', tier1)
  console.log('TIER 1B:', tier1b)

  // Find existing ad groups without ads
  const existingAGs = await customer.query(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.campaign FROM ad_group
    WHERE ad_group.campaign IN ('${tier1}', '${tier1b}') AND ad_group.status != 'REMOVED'
  `)
  console.log('Ad groups existentes:', existingAGs.length)
  for (const ag of existingAGs) console.log('  -', ag.ad_group.name)

  const psicAG = existingAGs.find(a => a.ad_group.name.includes('Psicóloga'))?.ad_group.resource_name
  const fisioAG = existingAGs.find(a => a.ad_group.name.includes('Fisioterapia'))?.ad_group.resource_name

  // 1) Add ads to existing AGs (Psicóloga, Fisioterapia) — use safer/non-medical copy
  const wrap = (arr) => arr.map(t => ({ text: t }))

  if (psicAG) {
    try {
      await customer.adGroupAds.create([{
        ad_group: psicAG,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: ['https://jaleca.com.br/jaleco-psicologa'],
          responsive_search_ad: {
            headlines: wrap(['Jaleco Profissional', 'Modelagem Feminina', 'Tecido Premium · 12 Cores', ...HEADLINES]),
            descriptions: wrap(['Jaleco profissional em tecido premium. Modelagem feminina em 12 cores.', ...DESC.slice(0,3)]),
            path1: 'jaleco', path2: 'profissional',
          },
        },
      }])
      console.log('✅ Ad criado: Jaleco Psicóloga')
    } catch (e) {
      console.log('❌ Psicóloga ad failed:', e.errors?.[0]?.message || e.message)
    }
  }

  if (fisioAG) {
    try {
      await customer.adGroupAds.create([{
        ad_group: fisioAG,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: ['https://jaleca.com.br/jaleco-fisioterapia'],
          responsive_search_ad: {
            headlines: wrap(['Jaleco Profissional', 'Conforto e Movimento', 'Tecido Premium · 12 Cores', ...HEADLINES]),
            descriptions: wrap(['Jaleco profissional com elastano. Modelagem que acompanha o corpo.', ...DESC.slice(0,3)]),
            path1: 'jaleco', path2: 'profissional',
          },
        },
      }])
      console.log('✅ Ad criado: Jaleco Fisioterapia')
    } catch (e) {
      console.log('❌ Fisioterapia ad failed:', e.errors?.[0]?.message || e.message)
    }
  }

  // 2) Create missing ad groups in TIER 1B: Odontologia, Nutrição, Farmácia
  const NEW_AGS = [
    {
      name: 'Jaleco Odontologia', cpc: 1.5,
      keywords: [
        { text: 'jaleco odontologia', match: 'PHRASE' },
        { text: 'jaleco dentista', match: 'PHRASE' },
      ],
      headlines: ['Jaleco para Odontologia', 'Aguenta Cloro e Autoclave', 'Tecido Premium · Caimento', ...HEADLINES],
      descriptions: ['Jaleco para odonto resistente a químicos. Tecido gabardine premium.', ...DESC.slice(0,3)],
      finalUrl: 'https://jaleca.com.br/jaleco-odontologia',
      path1: 'jaleco', path2: 'odonto',
    },
    {
      name: 'Jaleco Nutrição', cpc: 0.5,
      keywords: [
        { text: 'jaleco nutricionista', match: 'PHRASE' },
        { text: 'jaleco nutrição', match: 'PHRASE' },
      ],
      headlines: ['Jaleco para Nutrição', 'Modelagem Feminina', 'Tecido Premium · 12 Cores', ...HEADLINES],
      descriptions: ['Jaleco para nutricionista em tecido premium. Slim ou Princesa em 12 cores.', ...DESC.slice(0,3)],
      finalUrl: 'https://jaleca.com.br/jaleco-nutricao',
      path1: 'jaleco', path2: 'nutricao',
    },
    {
      name: 'Jaleco Farmácia', cpc: 0.5,
      keywords: [
        { text: 'jaleco farmácia', match: 'PHRASE' },
        { text: 'jaleco farmacia', match: 'PHRASE' },
      ],
      headlines: ['Jaleco para Farmácia', 'Visual Profissional', 'Tecido Premium · 12 Cores', ...HEADLINES],
      descriptions: ['Jaleco para farmácia em tecido premium. Modelagem profissional.', ...DESC.slice(0,3)],
      finalUrl: 'https://jaleca.com.br/jaleco-farmacia',
      path1: 'jaleco', path2: 'farmacia',
    },
  ]

  for (const ag of NEW_AGS) {
    try {
      const agR = await customer.adGroups.create([{
        name: ag.name,
        campaign: tier1b,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: micro(ag.cpc),
      }])
      const agRes = agR.results[0].resource_name
      console.log('✅ Grupo:', ag.name, agRes)

      await customer.adGroupCriteria.create(ag.keywords.map(k => ({
        ad_group: agRes,
        status: enums.AdGroupCriterionStatus.ENABLED,
        keyword: { text: k.text, match_type: enums.KeywordMatchType.PHRASE },
      })))
      console.log('  📝', ag.keywords.length, 'keywords')

      await customer.adGroupAds.create([{
        ad_group: agRes,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [ag.finalUrl],
          responsive_search_ad: {
            headlines: wrap(ag.headlines.slice(0, 15)),
            descriptions: wrap(ag.descriptions.slice(0, 4)),
            path1: ag.path1, path2: ag.path2,
          },
        },
      }])
      console.log('  📢 Ad criado →', ag.finalUrl)
    } catch (e) {
      console.log('❌', ag.name, 'failed:', e.errors?.[0]?.message || e.message)
    }
  }

  console.log('\n🟢 Finalização TIER 1B completa')
})().catch(e => {
  console.error('FATAL:', e.errors?.[0]?.message || e.message)
})
