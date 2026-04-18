/**
 * fix-ad-strength-core.mjs
 * Aumenta Ad Strength dos anúncios "Jaleca - Core - Jalecos" de Pobre → Excelente
 *
 * Problema: cada ad tem só 6-7 headlines e 2 descriptions → Google mostra
 * "Qualificada (limitada) — qualidade baixa".
 *
 * Solução: expandir para 15 headlines e 4 descriptions em todos os ad groups.
 *
 * Uso: node scripts/fix-ad-strength-core.mjs
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.google-ads' })

const CUSTOMER    = process.env.GOOGLE_ADS_CUSTOMER_ID   // 4446591621
const DEV_TOKEN   = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const LOGIN       = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
const CLIENT_ID   = process.env.GOOGLE_ADS_CLIENT_ID
const CLIENT_SEC  = process.env.GOOGLE_ADS_CLIENT_SECRET
const REFRESH     = process.env.GOOGLE_ADS_REFRESH_TOKEN

// ── Auth ──────────────────────────────────────────────────────────────────────
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SEC,
      refresh_token: REFRESH,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Token error: ' + JSON.stringify(data))
  return data.access_token
}

// ── Headlines/Descriptions por ad group ──────────────────────────────────────
// Limite: headline ≤ 30 chars | description ≤ 90 chars

const ADS = [
  // ── Feminino — ad 805692226953 (7 headlines existentes)
  {
    adGroupAdResourceName: 'customers/4446591621/adGroupAds/197260252484~805692226953',
    adGroupResourceName:   'customers/4446591621/adGroups/197260252484',
    finalUrl: 'https://jaleca.com.br/produtos?categoria=jalecos-femininos',
    path1: 'jalecos', path2: 'femininos',
    headlines: [
      'Jaleco Feminino Premium',
      'Elegância no Trabalho',
      'Modelagem Slim Premium',
      'Frete Grátis Acima R$499',
      'Parcele em Até 3x',
      'Envio Rápido Todo Brasil',
      'Vista Autoridade',
      'Jaleco Slim Feminino',
      'Compre com PIX 5% Off',
      'Para Médicas e Dentistas',
      'Tamanhos PP ao G3',
      'Tecido Premium Lavável',
      'Troca Fácil Garantida',
      'Jaleco Modelo Princesa',
      'Compre Agora na Jaleca',
    ],
    descriptions: [
      'Jalecos femininos premium com caimento impecável. Conforto e presença no dia a dia.',
      'Compre com segurança. PIX com desconto e entrega rápida para todo o Brasil.',
      'Slim e Princesa. PP ao G3. Tecido premium, lavagem fácil. Entregamos em todo o Brasil.',
      'Para médicas, enfermeiras e nutricionistas. Frete grátis no Sudeste acima de R$499.',
    ],
  },
  // ── Feminino — ad 805797892223 (variante)
  {
    adGroupAdResourceName: 'customers/4446591621/adGroupAds/197260252484~805797892223',
    adGroupResourceName:   'customers/4446591621/adGroups/197260252484',
    finalUrl: 'https://jaleca.com.br/produtos?categoria=jalecos-femininos',
    path1: 'jalecos', path2: 'femininos',
    headlines: [
      'Jaleco Feminino Premium',
      'Elegância no Trabalho',
      'Modelagem Slim Premium',
      'Frete Grátis Acima R$499',
      'Parcele em Até 3x',
      'Envio Rápido Todo Brasil',
      'Vista Autoridade',
      'Jaleco Slim Feminino',
      'Compre com PIX 5% Off',
      'Para Médicas e Dentistas',
      'Tamanhos PP ao G3',
      'Tecido Premium Lavável',
      'Troca Fácil Garantida',
      'Jaleco Modelo Princesa',
      'Compre Agora na Jaleca',
    ],
    descriptions: [
      'Jalecos femininos premium. Conforto e presença profissional no dia a dia.',
      'PIX com desconto e entrega rápida para todo o Brasil.',
      'Slim e Princesa. PP ao G3. Tecido premium, lavagem fácil. Entregamos em todo o Brasil.',
      'Para médicas, enfermeiras e nutricionistas. Frete grátis no Sudeste acima de R$499.',
    ],
  },
  // ── Masculino — ad 805728924871 (6 headlines)
  {
    adGroupAdResourceName: 'customers/4446591621/adGroupAds/197260252524~805728924871',
    adGroupResourceName:   'customers/4446591621/adGroups/197260252524',
    finalUrl: 'https://jaleca.com.br/produtos?categoria=jalecos-masculinos',
    path1: 'jalecos', path2: 'masculinos',
    headlines: [
      'Jaleco Masculino Premium',
      'Design Moderno Confortável',
      'Caimento Perfeito',
      'Jaleco Alta Qualidade',
      'Frete Grátis Acima R$499',
      'Parcele em Até 3x',
      'Jaleco Slim Masculino',
      'Compre com PIX 5% Off',
      'Para Médicos e Dentistas',
      'Tamanhos PP ao G3',
      'Tecido Premium Lavável',
      'Troca Fácil Garantida',
      'Envio Rápido Brasil',
      'Vista Autoridade',
      'Compre Agora na Jaleca',
    ],
    descriptions: [
      'Jalecos masculinos modernos e premium. Conforto e presença no ambiente profissional.',
      'Qualidade que transmite autoridade. Compre online e receba rápido.',
      'Slim e tradicional. PP ao G3. Para médicos, dentistas e profissionais de saúde.',
      'PIX com 5% de desconto. Parcele em até 3x. Frete grátis no Sudeste acima R$499.',
    ],
  },
  // ── Masculino — ad 805797893717 (variante)
  {
    adGroupAdResourceName: 'customers/4446591621/adGroupAds/197260252524~805797893717',
    adGroupResourceName:   'customers/4446591621/adGroups/197260252524',
    finalUrl: 'https://jaleca.com.br/produtos?categoria=jalecos-masculinos',
    path1: 'jalecos', path2: 'masculinos',
    headlines: [
      'Jaleco Masculino Premium',
      'Design Moderno Confortável',
      'Caimento Perfeito',
      'Jaleco Alta Qualidade',
      'Frete Grátis Acima R$499',
      'Parcele em Até 3x',
      'Jaleco Slim Masculino',
      'Compre com PIX 5% Off',
      'Para Médicos e Dentistas',
      'Tamanhos PP ao G3',
      'Tecido Premium Lavável',
      'Troca Fácil Garantida',
      'Envio Rápido Brasil',
      'Vista Autoridade',
      'Compre Agora na Jaleca',
    ],
    descriptions: [
      'Jalecos masculinos modernos e premium. Conforto e presença profissional.',
      'Qualidade que transmite autoridade. Compre online e receba rápido.',
      'Slim e tradicional. PP ao G3. Para médicos, dentistas e profissionais de saúde.',
      'PIX com 5% de desconto. Parcele em até 3x. Frete grátis no Sudeste acima R$499.',
    ],
  },
  // ── Profissão — ad 805722921055 (6 headlines)
  {
    adGroupAdResourceName: 'customers/4446591621/adGroupAds/197260252684~805722921055',
    adGroupResourceName:   'customers/4446591621/adGroups/197260252684',
    finalUrl: 'https://jaleca.com.br/produtos',
    path1: 'jalecos', path2: 'profissional',
    headlines: [
      'Jalecos Para Profissionais',
      'Conforto Para Longas Jornadas',
      'Jalecos Premium Diários',
      'Frete Grátis Acima R$499',
      'Parcele em Até 3x',
      'Médicas e Enfermeiras',
      'Jaleco Para Médica',
      'Jaleco Para Enfermeira',
      'Jaleco Para Dentista',
      'Compre com PIX 5% Off',
      'Tamanhos PP ao G3',
      'Tecido Premium Lavável',
      'Troca Fácil Garantida',
      'Envio Rápido Brasil',
      'Compre Agora na Jaleca',
    ],
    descriptions: [
      'Jalecos para médicas, enfermeiras e dentistas. Premium e conforto para o dia todo.',
      'Eleve sua imagem. Parcele em 3x ou pague no PIX com desconto.',
      'Uniforme que transmite profissionalismo. Modelos slim e tradicionais para saúde.',
      'Tecido premium e durável. Frete grátis no Sudeste acima de R$499. Troca fácil.',
    ],
  },
]

// ── Validação de caracteres ───────────────────────────────────────────────────
function validate() {
  let ok = true
  for (const ad of ADS) {
    for (const h of ad.headlines) {
      if (h.length > 30) {
        console.error(`❌ Headline muito longa (${h.length}): "${h}"`)
        ok = false
      }
    }
    for (const d of ad.descriptions) {
      if (d.length > 90) {
        console.error(`❌ Description muito longa (${d.length}): "${d}"`)
        ok = false
      }
    }
  }
  if (ok) console.log('✅ Validação de caracteres OK')
  return ok
}

// ── Criar novo ad e remover o antigo ─────────────────────────────────────────
// RSA headlines/descriptions são imutáveis via UPDATE — precisa criar novo + remover antigo.
async function replaceAd(token, ad) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'developer-token': DEV_TOKEN,
    'login-customer-id': LOGIN,
    'Content-Type': 'application/json',
  }

  // 1. Criar novo ad com todas as headlines/descriptions
  const createBody = {
    operations: [{
      create: {
        adGroup: ad.adGroupResourceName,
        status: 'ENABLED',
        ad: {
          finalUrls: [ad.finalUrl],
          responsiveSearchAd: {
            headlines: ad.headlines.map(text => ({ text })),
            descriptions: ad.descriptions.map(text => ({ text })),
            path1: ad.path1,
            path2: ad.path2,
          },
        },
      },
    }],
  }

  const createRes = await fetch(
    `https://googleads.googleapis.com/v20/customers/${CUSTOMER}/adGroupAds:mutate`,
    { method: 'POST', headers, body: JSON.stringify(createBody) }
  )
  const createData = await createRes.json()
  if (!createRes.ok) {
    console.error(`❌ Create failed for ${ad.adGroupAdResourceName}:`, JSON.stringify(createData?.error?.details?.[0]?.errors?.[0]?.message || createData, null, 2))
    return false
  }
  const newResourceName = createData.results?.[0]?.resourceName
  console.log(`  ✅ Novo ad criado: ${newResourceName}`)

  // 2. Remover o antigo
  const removeBody = {
    operations: [{ remove: ad.adGroupAdResourceName }],
  }
  const removeRes = await fetch(
    `https://googleads.googleapis.com/v20/customers/${CUSTOMER}/adGroupAds:mutate`,
    { method: 'POST', headers, body: JSON.stringify(removeBody) }
  )
  const removeData = await removeRes.json()
  if (!removeRes.ok) {
    console.warn(`  ⚠️ Remove falhou (ad antigo pode precisar ser removido manualmente):`, JSON.stringify(removeData?.error?.details?.[0]?.errors?.[0]?.message || removeData))
  } else {
    console.log(`  ✅ Ad antigo removido: ${ad.adGroupAdResourceName}`)
  }

  console.log(`✅ Ad group ${ad.adGroupAdResourceName.split('/').slice(-1)[0].split('~')[0]} atualizado (${ad.headlines.length} headlines, ${ad.descriptions.length} descriptions)`)
  return true
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Fix Ad Strength — Jaleca Core Jalecos\n')

  if (!validate()) {
    console.error('\n❌ Corrija os erros acima antes de continuar.')
    process.exit(1)
  }

  console.log('\n🔑 Obtendo access token...')
  const token = await getAccessToken()
  console.log('✅ Token OK\n')

  let success = 0
  for (const ad of ADS) {
    console.log(`\n🔄 ${ad.adGroupAdResourceName}`)
    const ok = await replaceAd(token, ad)
    if (ok) success++
  }

  console.log(`\n✅ ${success}/${ADS.length} anúncios atualizados`)
  console.log('⏳ Ad Strength leva até 24h para atualizar no painel Google Ads')
  console.log('📈 Esperado: Qualidade "Boa" ou "Excelente" (remove "limitada")')
}

main().catch(console.error)
