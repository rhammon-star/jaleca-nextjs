#!/usr/bin/env node
/**
 * Submit URLs to Google Search Console for indexing
 * Uses GSC API credentials from environment variables
 */

import { google } from 'googleapis'

// URLs prioritárias para submeter
const PRIORITY_URLS = [
  // 10 cidades top
  'https://jaleca.com.br/cidade/sao-paulo',
  'https://jaleca.com.br/cidade/rio-de-janeiro',
  'https://jaleca.com.br/cidade/belo-horizonte',
  'https://jaleca.com.br/cidade/brasilia',
  'https://jaleca.com.br/cidade/salvador',
  'https://jaleca.com.br/cidade/fortaleza',
  'https://jaleca.com.br/cidade/curitiba',
  'https://jaleca.com.br/cidade/recife',
  'https://jaleca.com.br/cidade/porto-alegre',
  'https://jaleca.com.br/cidade/goiania',

  // 10 cidades MG
  'https://jaleca.com.br/cidade/juiz-de-fora',
  'https://jaleca.com.br/cidade/uberlandia',
  'https://jaleca.com.br/cidade/betim',
  'https://jaleca.com.br/cidade/montes-claros',
  'https://jaleca.com.br/cidade/ribeirao-das-neves',
  'https://jaleca.com.br/cidade/uberaba',
  'https://jaleca.com.br/cidade/governador-valadares',
  'https://jaleca.com.br/cidade/sete-lagoas',
  'https://jaleca.com.br/cidade/divinopolis',
  'https://jaleca.com.br/cidade/ipatinga',

  // 10 hubs profissão
  'https://jaleca.com.br/jaleco-dentista',
  'https://jaleca.com.br/jaleco-medico',
  'https://jaleca.com.br/jaleco-enfermeiro',
  'https://jaleca.com.br/jaleco-veterinario',
  'https://jaleca.com.br/jaleco-nutricionista',
  'https://jaleca.com.br/jaleco-fisioterapeuta',
  'https://jaleca.com.br/jaleco-biomedico',
  'https://jaleca.com.br/jaleco-podologo',
  'https://jaleca.com.br/jaleco-farmaceutico',
  'https://jaleca.com.br/jaleco-esteticista',

  // 6 NOVAS landings (25/04/2026) — prioridade máxima
  'https://jaleca.com.br/jaleco-medicina',
  'https://jaleca.com.br/jaleco-fisioterapia',
  'https://jaleca.com.br/jaleco-odontologia',
  'https://jaleca.com.br/jaleco-nutricao',
  'https://jaleca.com.br/jaleco-farmacia',
  'https://jaleca.com.br/scrub-enfermagem',
  'https://jaleca.com.br/jaleco-psicologa',
]

async function main() {
  const CLIENT_ID = process.env.GSC_CLIENT_ID
  const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET
  const REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error('❌ Credenciais GSC não encontradas!')
    console.error('Defina: GSC_CLIENT_ID, GSC_CLIENT_SECRET, GSC_REFRESH_TOKEN')
    process.exit(1)
  }

  // Configurar OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  })

  const indexing = google.indexing({
    version: 'v3',
    auth: oauth2Client
  })

  console.log(`📤 Submetendo ${PRIORITY_URLS.length} URLs ao Google Search Console...\n`)

  let success = 0
  let failed = 0
  let alreadyIndexed = 0

  for (const url of PRIORITY_URLS) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      })

      if (response.status === 200) {
        console.log(`✅ ${url}`)
        success++
      } else {
        console.log(`⚠️  ${url} - Status ${response.status}`)
        alreadyIndexed++
      }

      // Rate limiting - Google permite ~200/min
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      if (error.code === 429) {
        console.log(`⏸️  Rate limit - aguardando 60s...`)
        await new Promise(resolve => setTimeout(resolve, 60000))
        // Retry
        try {
          await indexing.urlNotifications.publish({
            requestBody: { url: url, type: 'URL_UPDATED' }
          })
          console.log(`✅ ${url} (retry)`)
          success++
        } catch (retryError) {
          console.log(`❌ ${url} - ${retryError.message}`)
          failed++
        }
      } else {
        console.log(`❌ ${url} - ${error.message}`)
        failed++
      }
    }
  }

  console.log(`\n📊 Resultado:`)
  console.log(`   ✅ Sucesso: ${success}`)
  console.log(`   ⚠️  Já indexadas: ${alreadyIndexed}`)
  console.log(`   ❌ Falhas: ${failed}`)
  console.log(`   📝 Total: ${PRIORITY_URLS.length}`)
}

main().catch(console.error)
