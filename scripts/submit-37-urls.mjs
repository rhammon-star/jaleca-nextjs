#!/usr/bin/env node
import { google } from 'googleapis'

const KEY_FILE = '/Users/rhammon/Downloads/gen-lang-client-0367275269-197c83acdb1d.json'

const URLS = [
  // 25 blogs
  'https://jaleca.com.br/blog/bordado-jaleco-crm-coren-cro',
  'https://jaleca.com.br/blog/como-escolher-jaleco-feminino-guia-profissao',
  'https://jaleca.com.br/blog/jaleco-para-dentista-guia',
  'https://jaleca.com.br/blog/jaleco-para-enfermeira-normas-cofen',
  'https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto',
  'https://jaleca.com.br/blog/jaleco-universitario-feminino-guia',
  'https://jaleca.com.br/blog/melhores-marcas-jaleco-feminino-brasil-2026',
  'https://jaleca.com.br/blog/scrub-vs-jaleco-quando-usar',
  'https://jaleca.com.br/blog/como-lavar-jaleco-branco-sem-amarelar',
  'https://jaleca.com.br/blog/jaleco-para-medica',
  'https://jaleca.com.br/blog/jaleco-ou-scrub-consultorio',
  'https://jaleca.com.br/blog/jaleco-elastano-vale-a-pena',
  'https://jaleca.com.br/blog/jaleco-feminino-tamanho-certo',
  'https://jaleca.com.br/blog/jaleco-colorido-clinica',
  'https://jaleca.com.br/blog/onde-comprar-scrub-feminino',
  'https://jaleca.com.br/blog/scrub-feminino-gravidas',
  'https://jaleca.com.br/blog/scrub-feminino-plus-size',
  'https://jaleca.com.br/blog/scrub-feminino-colorido',
  'https://jaleca.com.br/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher',
  'https://jaleca.com.br/blog/scrubs-femininos-tendencias',
  'https://jaleca.com.br/blog/terapia-online-vestindo-vinculo-camera',
  'https://jaleca.com.br/blog/jaleco-farmacia-rdc-67-ozempic-manipulacao',
  'https://jaleca.com.br/blog/conjunto-ou-jaleco-advogado-autoridade',
  'https://jaleca.com.br/blog/jaleco-barbearia-vs-jaleco-medico-diferencas-e-tendencias',
  'https://jaleca.com.br/blog/biosseguranca-estudio-tatuagem-epi-jaleco-sangue-tinta',
  // 12 produtos
  'https://jaleca.com.br/produto/conjunto-dolma-cozinheiro-feminino-jaleca',
  'https://jaleca.com.br/produto/conjunto-puff-ziper-feminino-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-princesa-manga-curta-feminino-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-princesa-manga-curta-feminino-jaleca-rose',
  'https://jaleca.com.br/produto/jaleco-slim-tradicional-feminino-jaleca-rosê',
  'https://jaleca.com.br/produto/touca-de-elastico-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-moratty-feminino-ziper-central-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-recortes-masculino-varias-cores-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-pala-feminino-jaleca',
  'https://jaleca.com.br/produto/jaleco-slim-tradicional-manga-curta-feminino-jaleca',
  'https://jaleca.com.br/produto/touca-de-amarrar-jaleca',
]

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/indexing'],
})
const indexing = google.indexing({ version: 'v3', auth })

let ok = 0, fail = 0
for (const url of URLS) {
  try {
    await indexing.urlNotifications.publish({ requestBody: { url, type: 'URL_UPDATED' } })
    console.log(`✅ ${url}`)
    ok++
  } catch (e) {
    console.log(`❌ ${url} — ${e.message}`)
    fail++
    if (e.code === 429) { await new Promise(r => setTimeout(r, 60000)) }
  }
  await new Promise(r => setTimeout(r, 500))
}
console.log(`\n📊 ${ok} OK / ${fail} falhas / ${URLS.length} total`)
