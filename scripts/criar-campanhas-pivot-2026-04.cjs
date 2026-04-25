/**
 * CRIAR TODAS CAMPANHAS PIVOT — 25/04/2026
 * Estratégia validada com DataForSEO + Gemini + GPT
 * Total: R$125/dia (R$3.750/mês)
 *
 * Estrutura:
 *   1. Branded Protection — R$10/dia
 *   2. TIER 1 Saúde (5 ad groups) — R$65/dia
 *   3. TIER 1 Modelos (preto/plus/premium) — R$15/dia
 *   4. TIER 2 Defesa (vet, farmacêutico) — R$6/dia
 *   5. TIER 2 Comerciais (loja, comprar) — R$8/dia
 *   6. Click-to-WhatsApp — R$5/dia (Search)
 *   7. Shopping Remarketing — R$15/dia
 */

const { GoogleAdsApi, enums, ResourceNames } = require('google-ads-api')
const fs = require('fs')

// Load env
const envFile = fs.readFileSync('/Users/rhammon/SiteJaleca/jaleca-nextjs/.env.tmp', 'utf-8')
const env = {}
envFile.split('\n').forEach(line => {
  const m = line.match(/^([A-Z_]+)="?(.+?)"?$/)
  if (m) env[m[1]] = m[2]
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

const microAmount = (reais) => Math.round(reais * 1_000_000)

const RUN_ID = Date.now().toString().slice(-6)

async function createBudget(name, daily) {
  const r = await customer.campaignBudgets.create([{
    name: `${name} — Budget #${RUN_ID}`,
    amount_micros: microAmount(daily),
    delivery_method: enums.BudgetDeliveryMethod.STANDARD,
  }])
  const resource = r.results[0].resource_name
  console.log(`  💰 Budget "${name}": R$${daily}/dia → ${resource}`)
  return resource
}

async function createSearchCampaign(name, budget) {
  const r = await customer.campaigns.create([{
    name: `${name} #${RUN_ID}`,
    advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
    status: enums.CampaignStatus.PAUSED,
    campaign_budget: budget,
    manual_cpc: { enhanced_cpc_enabled: false },
    network_settings: {
      target_google_search: true,
      target_search_network: false,
      target_content_network: false,
    },
    geo_target_type_setting: {
      positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
    },
    contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
  }])
  const resource = r.results[0].resource_name
  console.log(`  🎯 Campanha "${name}" → ${resource}`)
  // Brazil targeting
  await customer.campaignCriteria.create([{
    campaign: resource,
    location: { geo_target_constant: ResourceNames.geoTargetConstant(2076) },
  }])
  return resource
}

async function createAdGroup(name, campaign, cpc) {
  const r = await customer.adGroups.create([{
    name,
    campaign,
    status: enums.AdGroupStatus.ENABLED,
    type: enums.AdGroupType.SEARCH_STANDARD,
    cpc_bid_micros: microAmount(cpc),
  }])
  const resource = r.results[0].resource_name
  console.log(`    ➕ Grupo "${name}" CPC R$${cpc} → ${resource}`)
  return resource
}

async function addKeywords(adGroup, keywords) {
  const criteria = keywords.map(kw => ({
    ad_group: adGroup,
    status: enums.AdGroupCriterionStatus.ENABLED,
    keyword: {
      text: kw.text,
      match_type: kw.match === 'EXACT' ? enums.KeywordMatchType.EXACT : enums.KeywordMatchType.PHRASE,
    },
  }))
  await customer.adGroupCriteria.create(criteria)
  console.log(`      📝 ${keywords.length} keywords`)
}

async function createAd(adGroup, headlines, descriptions, finalUrl, path1, path2) {
  await customer.adGroupAds.create([{
    ad_group: adGroup,
    status: enums.AdGroupAdStatus.ENABLED,
    ad: {
      final_urls: [finalUrl],
      responsive_search_ad: {
        headlines: headlines.map(h => ({ text: h })),
        descriptions: descriptions.map(d => ({ text: d })),
        path1, path2,
      },
    },
  }])
  console.log(`      📢 Anúncio criado → ${finalUrl}`)
}

// ─── COMMON HEADLINES & DESCRIPTIONS POOLS (max 30 chars / 90 chars) ───
const COMMON_HEADLINES = [
  'Jaleca Uniformes',                  // 16
  'Tecido Premium · Elastano',         // 25
  'PIX 5% Off · 3x Sem Juros',         // 25
  'Frete Grátis SE R$499+',            // 22
  'Do PP ao G3 · 12 Cores',            // 22
  'Troca em Até 30 Dias',              // 20
  '+200 Mil Peças Vendidas',           // 23
  '6 Lojas Físicas no Brasil',         // 25
]
const COMMON_DESC = [
  'Tecido com elastano, modelagem que veste. PIX 5% off, 3x sem juros, frete grátis SE.',  // 86
  'Fabricante com estoque próprio. Do PP ao G3 em 12 cores. Troca em até 30 dias.',         // 79
  'Slim, Profissional ou Princesa. Comprou e não serviu? Trocamos em 30 dias.',             // 76
  'WhatsApp 7 dias para dúvidas de tamanho. PIX 5% off, 3x sem juros, frete grátis SE.',    // 86
]

// ─── CAMPAIGN DEFINITIONS ───
const CAMPAIGNS = [
  // 1. BRANDED PROTECTION
  {
    name: 'Pivot 04/26 — Branded',
    daily: 10,
    adGroups: [
      {
        name: 'Branded Jaleca',
        cpc: 1.5,
        keywords: [
          { text: 'jaleca', match: 'EXACT' },
          { text: 'jaleca jalecos', match: 'PHRASE' },
          { text: 'loja jaleca', match: 'PHRASE' },
          { text: 'jaleca uniformes', match: 'PHRASE' },
          { text: 'jaleca ipatinga', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleca — Site Oficial', 'Jalecos Premium · PIX 5% Off', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Site oficial Jaleca. Tecido premium, modelagem que veste, PIX 5% off, frete grátis SE.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br',
          path1: 'jaleca', path2: 'oficial',
        },
      },
    ],
  },
  // 2. TIER 1 SAÚDE — 5 ad groups
  {
    name: 'Pivot 04/26 — Saúde TIER 1',
    daily: 65,
    adGroups: [
      {
        name: 'Scrub Feminino',
        cpc: 1.0,
        keywords: [
          { text: 'scrub feminino', match: 'PHRASE' },
          { text: 'scrub para enfermagem feminino', match: 'PHRASE' },
          { text: 'scrub médico feminino', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Scrub Feminino Premium', 'Pijama Cirúrgico Jaleca', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Scrub feminino com elastano, do PP ao G3 em 12 cores. PIX 5% off + frete grátis SE.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/scrub-feminino',
          path1: 'scrub', path2: 'feminino',
        },
      },
      {
        name: 'Pijama Cirúrgico Feminino',
        cpc: 1.0,
        keywords: [
          { text: 'pijama cirúrgico feminino', match: 'PHRASE' },
          { text: 'pijama cirurgico feminino', match: 'PHRASE' },
          { text: 'conjunto cirúrgico feminino', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Pijama Cirúrgico Feminino', 'Conjunto Scrub Premium', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Conjunto blusa + calça em tecido respirável com elastano. Do PP ao G3 em 12 cores.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/pijama-cirurgico-feminino',
          path1: 'pijama', path2: 'cirurgico',
        },
      },
      {
        name: 'Jaleco Enfermagem',
        cpc: 0.8,
        keywords: [
          { text: 'jaleco enfermagem', match: 'PHRASE' },
          { text: 'jaleco enfermeiro', match: 'PHRASE' },
          { text: 'jaleco enfermeira', match: 'PHRASE' },
          { text: 'jaleco enfermagem feminino', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Enfermagem', 'Tecido Premium e Movimento', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para enfermagem com elastano. Tecido premium que aguenta a rotina hospitalar.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-enfermagem',
          path1: 'jaleco', path2: 'enfermagem',
        },
      },
      {
        name: 'Scrub Enfermagem',
        cpc: 0.8,
        keywords: [
          { text: 'scrub enfermagem', match: 'PHRASE' },
          { text: 'scrub enfermeira', match: 'PHRASE' },
          { text: 'scrub feminino enfermagem', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Scrub para Enfermagem', 'Conforto e Movimento Livre', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Scrub para enfermagem em tecido respirável. Conjunto blusa + calça do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/scrub-enfermagem',
          path1: 'scrub', path2: 'enfermagem',
        },
      },
      {
        name: 'Jaleco Psicóloga',
        cpc: 0.8,
        keywords: [
          { text: 'jaleco psicóloga', match: 'PHRASE' },
          { text: 'jaleco psicologa', match: 'PHRASE' },
          { text: 'jaleco psicologia', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Psicóloga', 'Modelagem Feminina · 12 Cores', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para psicologia com elastano. Modelagem feminina em 12 cores. Do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-psicologa',
          path1: 'jaleco', path2: 'psicologa',
        },
      },
    ],
  },
  // 3. TIER 1 SAÚDE — 6 sub-clusters menores (1 campanha, 6 ad groups)
  {
    name: 'Pivot 04/26 — Saúde TIER 1B',
    daily: 21,
    adGroups: [
      {
        name: 'Jaleco Médico',
        cpc: 1.5,
        keywords: [
          { text: 'jaleco médico', match: 'PHRASE' },
          { text: 'jaleco medico', match: 'PHRASE' },
          { text: 'jaleco médico feminino', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Médico', 'Tecido Premium · Caimento', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para médico com elastano e modelagem que veste. PIX 5% off + frete grátis SE.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-medico',
          path1: 'jaleco', path2: 'medico',
        },
      },
      {
        name: 'Jaleco Medicina',
        cpc: 1.0,
        keywords: [{ text: 'jaleco medicina', match: 'PHRASE' }],
        ad: {
          headlines: ['Jaleco para Medicina', 'Para Quem Constrói Carreira', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para medicina com tecido premium. PIX 5% off + frete grátis SE acima R$499.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-medicina',
          path1: 'jaleco', path2: 'medicina',
        },
      },
      {
        name: 'Jaleco Fisioterapia',
        cpc: 0.5,
        keywords: [
          { text: 'jaleco fisioterapia', match: 'PHRASE' },
          { text: 'jaleco fisioterapeuta', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Fisioterapia', 'Movimento Livre · Respirável', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para fisio com elastano. Modelagem que acompanha o movimento. Do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-fisioterapia',
          path1: 'jaleco', path2: 'fisio',
        },
      },
      {
        name: 'Jaleco Odontologia',
        cpc: 1.5,
        keywords: [
          { text: 'jaleco odontologia', match: 'PHRASE' },
          { text: 'jaleco dentista', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Odontologia', 'Aguenta Cloro e Autoclave', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para odonto resistente a químicos. Tecido gabardine premium. Do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-odontologia',
          path1: 'jaleco', path2: 'odonto',
        },
      },
      {
        name: 'Jaleco Nutrição',
        cpc: 0.5,
        keywords: [
          { text: 'jaleco nutricionista', match: 'PHRASE' },
          { text: 'jaleco nutrição', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Nutrição', 'Modelagem Feminina · Conforto', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para nutricionista em tecido premium. Modelo Slim ou Princesa em 12 cores.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-nutricao',
          path1: 'jaleco', path2: 'nutricao',
        },
      },
      {
        name: 'Jaleco Farmácia',
        cpc: 0.5,
        keywords: [
          { text: 'jaleco farmácia', match: 'PHRASE' },
          { text: 'jaleco farmacia', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Farmácia', 'Visual Profissional', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para farmácia em tecido premium. Modelagem que transmite profissionalismo.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-farmacia',
          path1: 'jaleco', path2: 'farmacia',
        },
      },
    ],
  },
  // 4. TIER 1 MODELOS
  {
    name: 'Pivot 04/26 — Modelos',
    daily: 13,
    adGroups: [
      {
        name: 'Jaleco Preto',
        cpc: 1.0,
        keywords: [
          { text: 'jaleco preto', match: 'PHRASE' },
          { text: 'jaleco preto feminino', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco Preto Feminino', 'Modelagem Slim · Cores Premium', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco preto com elastano. Modelagem Slim valoriza a silhueta. Do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-preto-feminino',
          path1: 'jaleco', path2: 'preto',
        },
      },
      {
        name: 'Jaleco Plus Size',
        cpc: 1.0,
        keywords: [
          { text: 'jaleco plus size', match: 'PHRASE' },
          { text: 'jaleco g3', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco Plus Size · Até G3', 'Grade Completa do PP ao G3', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco do PP ao G3, modelagem para corpo real. PIX 5% off + frete grátis SE.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-plus-size',
          path1: 'jaleco', path2: 'plus-size',
        },
      },
      {
        name: 'Jaleco Premium',
        cpc: 1.5,
        keywords: [
          { text: 'jaleco premium', match: 'PHRASE' },
          { text: 'melhor jaleco', match: 'PHRASE' },
          { text: 'melhor marca de jaleco', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco Premium · Jaleca', 'A Melhor Marca de Jaleco', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco premium com tecido gabardine + elastano. +200 mil peças vendidas. Do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-premium',
          path1: 'jaleco', path2: 'premium',
        },
      },
    ],
  },
  // 5. TIER 2 DEFESA
  {
    name: 'Pivot 04/26 — Defesa',
    daily: 6,
    adGroups: [
      {
        name: 'Jaleco Veterinário',
        cpc: 0.5,
        keywords: [
          { text: 'jaleco veterinário', match: 'PHRASE' },
          { text: 'jaleco veterinario', match: 'PHRASE' },
          { text: 'jaleco veterinária', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Veterinário', 'Tecido Resistente a Sujeira', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para veterinário em tecido premium. Resistente, do PP ao G3 em 12 cores.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-veterinario',
          path1: 'jaleco', path2: 'veterinario',
        },
      },
      {
        name: 'Jaleco Farmacêutico',
        cpc: 0.5,
        keywords: [
          { text: 'jaleco farmacêutico', match: 'PHRASE' },
          { text: 'jaleco farmaceutico', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Jaleco para Farmacêutico', 'Visual Profissional', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Jaleco para farmacêutico em tecido gabardine. Modelagem profissional, do PP ao G3.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/jaleco-farmaceutico',
          path1: 'jaleco', path2: 'farmaceutico',
        },
      },
    ],
  },
  // 6. TIER 2 COMERCIAIS
  {
    name: 'Pivot 04/26 — Comerciais',
    daily: 10,
    adGroups: [
      {
        name: 'Loja de Jaleco',
        cpc: 0.8,
        keywords: [
          { text: 'loja de jaleco', match: 'PHRASE' },
          { text: 'comprar jaleco online', match: 'PHRASE' },
          { text: 'comprar jaleco', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Loja Online de Jaleco', 'Comprar Jaleco · PIX 5% Off', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Loja online de jalecos premium. PIX 5% off + frete grátis SE acima R$499.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://jaleca.com.br/produtos',
          path1: 'comprar', path2: 'jaleco',
        },
      },
    ],
  },
  // 7. CLICK-TO-WHATSAPP
  {
    name: 'Pivot 04/26 — WhatsApp',
    daily: 5,
    adGroups: [
      {
        name: 'Dúvidas Tamanho/Modelo',
        cpc: 1.0,
        keywords: [
          { text: 'jaleco tamanho', match: 'PHRASE' },
          { text: 'qual jaleco comprar', match: 'PHRASE' },
          { text: 'jaleco como escolher', match: 'PHRASE' },
        ],
        ad: {
          headlines: ['Atendimento WhatsApp', 'Tire Dúvidas Antes de Comprar', ...COMMON_HEADLINES.slice(0, 6)],
          descriptions: ['Não sabe o tamanho? Fala no WhatsApp e te ajudamos. Atendemos 7 dias por semana.', ...COMMON_DESC.slice(0, 3)],
          finalUrl: 'https://wa.me/5531992901940',
          path1: 'whatsapp', path2: 'duvidas',
        },
      },
    ],
  },
]

// ─── EXECUTE ───
async function main() {
  console.log('🚀 CRIANDO TODAS CAMPANHAS PIVOT — 25/04/2026')
  console.log('Total budget: R$' + CAMPAIGNS.reduce((s, c) => s + c.daily, 0) + '/dia\n')

  const results = []
  for (const camp of CAMPAIGNS) {
    console.log(`\n📦 ${camp.name} (R$${camp.daily}/dia)`)
    try {
      const budget = await createBudget(camp.name, camp.daily)
      const campaign = await createSearchCampaign(camp.name, budget)
      for (const ag of camp.adGroups) {
        const adGroup = await createAdGroup(ag.name, campaign, ag.cpc)
        await addKeywords(adGroup, ag.keywords)
        await createAd(
          adGroup,
          ag.ad.headlines.slice(0, 15), // Max 15 headlines
          ag.ad.descriptions.slice(0, 4), // Max 4 descriptions
          ag.ad.finalUrl, ag.ad.path1, ag.ad.path2
        )
      }
      results.push({ campaign: camp.name, ok: true })
    } catch (e) {
      const detail = e.errors?.[0]?.message || e.message || JSON.stringify(e).slice(0, 300)
      console.error(`  ❌ ${camp.name}: ${detail}`)
      if (e.errors) console.error('     Full error:', JSON.stringify(e.errors, null, 2).slice(0, 800))
      results.push({ campaign: camp.name, ok: false, err: detail })
    }
  }

  console.log('\n📊 RESUMO:')
  results.forEach(r => console.log(`  ${r.ok ? '✅' : '❌'} ${r.campaign}${r.err ? ' — ' + r.err : ''}`))
  console.log('\n⚠️  TODAS as campanhas criadas como PAUSADAS. Revise e ative no Google Ads.')
  console.log('⚠️  PAUSE manualmente as campanhas antigas: "Jaleca - Search - Jalecos" e Shopping aberto.')
}

main().catch(e => { console.error('FATAL:', e); process.exit(1) })
