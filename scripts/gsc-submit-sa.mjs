#!/usr/bin/env node
/**
 * Submit URLs ao Google Indexing API via Service Account
 * Service Account: contaclaude@gen-lang-client-0367275269.iam.gserviceaccount.com
 *
 * REQUISITOS:
 *   1. Habilitar Indexing API no projeto:
 *      https://console.cloud.google.com/apis/library/indexing.googleapis.com?project=gen-lang-client-0367275269
 *   2. Adicionar SA como Owner na propriedade GSC:
 *      https://search.google.com/search-console/users → Adicionar usuário
 *      Email: contaclaude@gen-lang-client-0367275269.iam.gserviceaccount.com
 *      Permissão: Proprietário
 */

import { google } from 'googleapis'

const KEY_FILE = '/Users/rhammon/Downloads/gen-lang-client-0367275269-197c83acdb1d.json'

const URLS = [
  // Top prioridade — 6 landings novas
  'https://jaleca.com.br/jaleco-medicina',
  'https://jaleca.com.br/jaleco-fisioterapia',
  'https://jaleca.com.br/jaleco-odontologia',
  'https://jaleca.com.br/jaleco-nutricao',
  'https://jaleca.com.br/jaleco-farmacia',
  'https://jaleca.com.br/scrub-enfermagem',
  // URL high-value renomeada
  'https://jaleca.com.br/jaleco-psicologa',
  'https://jaleca.com.br/jaleco-medico',
  'https://jaleca.com.br/jaleco-veterinario',
  'https://jaleca.com.br/jaleco-farmaceutico',
  // Resto das renomeadas
  'https://jaleca.com.br/jaleco-enfermeiro',
  'https://jaleca.com.br/jaleco-enfermagem',
  'https://jaleca.com.br/jaleco-dentista',
  'https://jaleca.com.br/jaleco-fisioterapeuta',
  'https://jaleca.com.br/jaleco-nutricionista',
  'https://jaleca.com.br/jaleco-esteticista',
  'https://jaleca.com.br/jaleco-cabeleireiro',
  'https://jaleca.com.br/jaleco-barbeiro',
  'https://jaleca.com.br/jaleco-podologo',
  'https://jaleca.com.br/jaleco-biomedico',
  'https://jaleca.com.br/jaleco-massagista',
  'https://jaleca.com.br/jaleco-tatuador',
  'https://jaleca.com.br/jaleco-cozinheiro',
  'https://jaleca.com.br/jaleco-churrasqueiro',
  'https://jaleca.com.br/jaleco-sushiman',
  'https://jaleca.com.br/jaleco-professor',
  'https://jaleca.com.br/jaleco-vendedor',
  'https://jaleca.com.br/jaleco-advogado',
  'https://jaleca.com.br/jaleco-pastor',
  'https://jaleca.com.br/jaleco-secretaria',
  'https://jaleca.com.br/jaleco-dona-casa',
  'https://jaleca.com.br/loja-jaleco',
  'https://jaleca.com.br/melhor-marca-jaleco',
  'https://jaleca.com.br/uniformes-profissionais-saude',
]

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })
  const authClient = await auth.getClient()
  const indexing = google.indexing({ version: 'v3', auth: authClient })

  console.log(`📤 Submetendo ${URLS.length} URLs ao Google Indexing API...\n`)

  let success = 0, failed = 0
  for (const url of URLS) {
    try {
      const r = await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      })
      const status = r.data?.urlNotificationMetadata?.latestUpdate?.notifyTime || 'OK'
      console.log(`✅ ${url}`)
      success++
      await new Promise(r => setTimeout(r, 200)) // 5/sec rate limit
    } catch (e) {
      const msg = e.errors?.[0]?.message || e.message
      console.log(`❌ ${url} — ${msg}`)
      failed++
      if (msg?.includes('not been used') || msg?.includes('disabled')) {
        console.log('\n⚠️  Indexing API não habilitada. Habilite em:')
        console.log('   https://console.cloud.google.com/apis/library/indexing.googleapis.com?project=gen-lang-client-0367275269')
        process.exit(1)
      }
      if (msg?.includes('Permission denied') || msg?.includes('not verified')) {
        console.log('\n⚠️  Service Account não é Owner do GSC. Adicione em:')
        console.log('   https://search.google.com/search-console/users')
        console.log('   Email: contaclaude@gen-lang-client-0367275269.iam.gserviceaccount.com')
        console.log('   Permissão: Proprietário')
        process.exit(1)
      }
    }
  }

  console.log(`\n📊 Resultado: ✅ ${success} sucesso · ❌ ${failed} falhas`)
}

main().catch(console.error)
