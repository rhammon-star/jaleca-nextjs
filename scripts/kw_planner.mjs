import { GoogleAdsApi } from 'google-ads-api'
import fs from 'fs'

// Load env
const env = fs.readFileSync('/Users/rhammon/SiteJaleca/jaleca-nextjs/.env.tmp', 'utf-8')
  .split('\n').filter(l => l.startsWith('GOOGLE_ADS_'))
  .reduce((o, l) => { const [k, ...v] = l.split('='); o[k] = v.join('=').replace(/^"|"$/g, ''); return o }, {})

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

const KEYWORDS = [
  // TIER 1 saúde
  'jaleco para médico', 'jaleco para enfermeiro', 'jaleco para enfermagem',
  'jaleco para dentista', 'jaleco para fisioterapeuta', 'jaleco para veterinário',
  // TIER 2 saúde
  'jaleco para nutricionista', 'jaleco para biomédico', 'jaleco para podólogo',
  'jaleco para psicóloga', 'jaleco para farmacêutico',
  // Beleza
  'jaleco para esteticista', 'jaleco para cabeleireiro', 'jaleco para barbeiro',
  'jaleco para massagista', 'jaleco para tatuador',
  // Cozinha
  'jaleco para cozinheiro', 'jaleco para sushiman', 'jaleco para churrasqueiro',
  // Outros
  'jaleco para professor', 'jaleco para advogado', 'jaleco para vendedor',
  'jaleco universitário', 'jaleco para secretaria',
  // Modelos
  'jaleco preto feminino', 'jaleco plus size', 'jaleco premium',
  'jaleco branco', 'jaleco colorido', 'jaleco estiloso',
  'jaleco dentista feminino', 'jaleco enfermagem feminino', 'jaleco médico feminino',
  // Comerciais
  'comprar jaleco online', 'loja de jaleco', 'melhor marca de jaleco',
  // Genéricos referência
  'jaleco', 'jaleco feminino', 'jaleco masculino',
]

try {
  const res = await customer.keywordPlanIdeas.generateKeywordIdeas({
    customer_id: env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, ''),
    language: 'languageConstants/1014', // pt
    geo_target_constants: ['geoTargetConstants/2076'], // Brazil
    keyword_seed: { keywords: KEYWORDS },
    include_adult_keywords: false,
  })

  const wanted = new Set(KEYWORDS.map(k => k.toLowerCase()))
  const rows = res
    .map(r => ({
      kw: r.text,
      vol: Number(r.keyword_idea_metrics?.avg_monthly_searches || 0),
      cpcLow: Number(r.keyword_idea_metrics?.low_top_of_page_bid_micros || 0) / 1_000_000,
      cpcHigh: Number(r.keyword_idea_metrics?.high_top_of_page_bid_micros || 0) / 1_000_000,
      comp: r.keyword_idea_metrics?.competition,
    }))
    .filter(r => wanted.has(r.kw.toLowerCase()))
    .sort((a, b) => b.vol - a.vol)

  console.log(JSON.stringify(rows, null, 2))
} catch (e) {
  console.error('ERR:', e.message || e)
}
