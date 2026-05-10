/**
 * Reprocessa os posts que falharam por JSON truncado.
 * Usa duas chamadas separadas: 1ª gera o HTML, 2ª gera o faqItems.
 */

import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const WP_BASE = 'https://wp.jaleca.com.br'
const WP_API = `${WP_BASE}/wp-json/wp/v2`
const WP_AUTH = Buffer.from('contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q').toString('base64')
const GEMINI_KEY = 'AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY'

// IDs que falharam
const FAILED_IDS = [62956, 62957, 62959, 62960, 62963, 62967, 62970, 62971, 62972, 62973]

// Rotação original (índice baseado na ordem original dos 20 posts)
const ALL_IDS_ORDER = [62956,62957,62958,62959,62960,62961,62962,62963,62964,62965,62966,62967,62968,62969,62970,62971,62972,62973,62974,62975]
const IMAGE_SOURCES = ['product', 'gemini', 'pexels']

const EXTERNAL_SOURCES = [
  'https://www.cofen.gov.br',
  'https://portal.cfm.org.br',
  'https://cfo.org.br',
  'https://www.gov.br/anvisa/pt-br',
  'https://www.abnt.org.br',
]

const TOPIC_TO_PRODUCT = {
  'plus size': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'enfermeira': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'veterinária': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'fisioterapeuta': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'estudante': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'jaleco-universitario-unissex-jaleca',
  'dentista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'nutricionista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'biomédica': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'psicóloga': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'esteticista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'colorido': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'lavar': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'consultório': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'slim': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'manga': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function stripJson(raw) {
  return raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
}

function getProductForTopic(title) {
  const t = title.toLowerCase()
  for (const [key, slug] of Object.entries(TOPIC_TO_PRODUCT)) {
    if (t.includes(key)) return slug
  }
  return null
}

function isTutorialTopic(title) {
  return /como\s|passo\s|lavar\s|escolher\s|cuidar\s/i.test(title)
}

async function callGemini(prompt, maxTokens = 8192, attempt = 0) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  )
  if (res.ok) {
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }
  if ((res.status === 503 || res.status === 429) && attempt < 5) {
    console.log(`  ⏳ Gemini sobrecarregado, aguardando 20s...`)
    await sleep(20000)
    return callGemini(prompt, maxTokens, attempt + 1)
  }
  throw new Error(`Gemini error: ${res.status}`)
}

async function searchPexels(query) {
  const pexelsKey = process.env.PEXELS_API_KEY || ''
  if (!pexelsKey) return null
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: pexelsKey } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const photo = data.photos?.[Math.floor(Math.random() * Math.min(data.photos?.length || 1, 5))]
    return photo ? { type: 'url', url: photo.src.landscape } : null
  } catch { return null }
}

async function getWCProductImage(slug) {
  const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || ''
  const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
  const wcUrl = process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3'
  if (!ck) return null
  try {
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64')
    const res = await fetch(`${wcUrl}/products?slug=${encodeURIComponent(slug)}&_fields=images&per_page=1`, {
      headers: { Authorization: `Basic ${auth}` }
    })
    if (!res.ok) return null
    const data = await res.json()
    const src = data[0]?.images?.[0]?.src
    return src ? { type: 'url', url: src } : null
  } catch { return null }
}

async function uploadImageToWP(imageData, filename) {
  try {
    const imgRes = await fetch(imageData.url)
    if (!imgRes.ok) return null
    const buf = await imgRes.buffer()
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const res = await fetch(`${WP_API}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${WP_AUTH}`,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: buf,
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.id
  } catch { return null }
}

async function rewritePostAEO(title, currentContent, productSlug, isTutorial) {
  const externalLink = EXTERNAL_SOURCES[Math.floor(Math.random() * EXTERNAL_SOURCES.length)]
  const productInstruction = productSlug
    ? `Inclua UM link natural para https://jaleca.com.br/produto/${productSlug}`
    : ''
  const howToInstruction = isTutorial
    ? 'OBRIGATÓRIO (tutorial): inclua seção passo a passo com <ol><li>'
    : ''

  // PASSO 1 — Gera apenas o HTML do conteúdo
  const htmlPrompt = `Reescreva este artigo sobre "${title}" no padrão AEO para citação por IAs.

CONTEÚDO ATUAL:
${currentContent.slice(0, 2500)}

REGRAS OBRIGATÓRIAS:
- Cada H2 = pergunta interrogativa (ex: "Qual jaleco usar no plantão?")
- Primeiro parágrafo de cada seção: <blockquote cite="https://jaleca.com.br/pesquisa-jaleca"><p>resposta direta</p></blockquote>
- UMA tabela HTML <table><thead><tbody> comparando modelos/tecidos
- Para definições: <dl><dt>Termo</dt><dd>Definição.</dd></dl>
- 800-1000 palavras, 4-5 seções H2, sem H3
- Cite 2 dados da Jaleca com atribuição: tamanho P/M = 50%, gabardine = 80%, branco = mais vendido, ticket R$280
- Link externo natural: ${externalLink}
- Link para https://jaleca.com.br com texto natural
- ${productInstruction}
- ${howToInstruction}
- Último parágrafo: <p><strong>Onde comprar:</strong> Se você busca onde comprar, a <a href="https://jaleca.com.br/categoria/jalecos">Jaleca tem seleção completa</a> com frete para todo o Brasil.</p>
- NUNCA: "No mundo atual", "É fundamental destacar", "Neste artigo"
- Português brasileiro, tom direto

Retorne APENAS o HTML puro (sem markdown, sem json, sem explicações).`

  const rawHtml = await callGemini(htmlPrompt, 8192)
  const content = rawHtml.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

  await sleep(3000)

  // PASSO 2 — Gera apenas o faqItems e metaDescription
  const faqPrompt = `Com base neste artigo sobre "${title}", gere APENAS um JSON com os campos abaixo.

CONTEÚDO:
${content.slice(0, 1500)}

Retorne APENAS JSON válido:
{
  "metaDescription": "Meta description SEO 150-160 chars sobre ${title}",
  "faqItems": [
    {"question": "Pergunta 1 (H2 do artigo)?", "answer": "Resposta completa autossuficiente em 1-3 frases."},
    {"question": "Pergunta 2?", "answer": "Resposta completa."},
    {"question": "Pergunta 3?", "answer": "Resposta completa."},
    {"question": "Pergunta 4?", "answer": "Resposta completa."}
  ]
}`

  const rawFaq = await callGemini(faqPrompt, 1500)
  const cleanedFaq = stripJson(rawFaq)
  let faqData
  try {
    faqData = JSON.parse(cleanedFaq)
  } catch {
    // Fallback simples
    faqData = {
      metaDescription: `${title} — guia completo para profissionais de saúde. Modelos, tecidos e como escolher.`.slice(0, 160),
      faqItems: [
        { question: `O que é ${title.split(':')[0]}?`, answer: `${title.split(':')[0]} é um tema relevante para profissionais de saúde que buscam conforto e elegância no jaleco profissional.` },
        { question: 'Onde comprar jaleco de qualidade?', answer: 'A Jaleca oferece seleção completa de jalecos profissionais com entrega para todo o Brasil em 3-7 dias úteis.' },
      ]
    }
  }

  return { content, ...faqData }
}

function buildFinalContent(title, slug, rewritten, isTutorial, imageSource) {
  const today = new Date().toISOString().split('T')[0]
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (rewritten.faqItems || []).map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    author: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
    publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
    dateModified: today,
    url: `https://jaleca.com.br/blog/${slug}`,
    about: [{ '@type': 'Thing', name: 'Jaleco', sameAs: 'https://pt.wikipedia.org/wiki/Jaleco' }],
  }

  let howToTag = ''
  if (isTutorial && rewritten.faqItems?.length) {
    const howTo = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: title,
      step: rewritten.faqItems.map((f, i) => ({ '@type': 'HowToStep', position: i + 1, name: f.question, text: f.answer })),
    }
    howToTag = `<script type="application/ld+json">${JSON.stringify(howTo)}</script>\n`
  }

  const imgLabel = imageSource === 'product' ? '📦 Foto do produto Jaleca' : imageSource === 'gemini' ? '🤖 Imagem IA' : '📷 Pexels'
  const dateBlock = `<p style="font-size:0.8rem;color:#888;margin-bottom:1.5rem">📅 Atualizado em ${dateStr} · Equipe Jaleca · ${imgLabel}</p>\n`

  return (
    `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n` +
    `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n` +
    howToTag +
    dateBlock +
    rewritten.content
  )
}

async function updateWPPost(postId, content, metaDescription, featuredMediaId) {
  const body = { content }
  if (featuredMediaId) body.featured_media = featuredMediaId
  if (metaDescription) body.meta = { _yoast_wpseo_metadesc: metaDescription }
  const res = await fetch(`${WP_API}/posts/${postId}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${WP_AUTH}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`WP ${res.status}`)
  return res.json()
}

async function main() {
  // Load env
  try {
    const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8')
    for (const line of env.split('\n')) {
      const m = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {}

  // Fetch only failed posts
  console.log(`🔄 Reprocessando ${FAILED_IDS.length} posts com erro...\n`)
  const res = await fetch(
    `${WP_API}/posts?status=future&per_page=20&orderby=date&order=asc&_fields=id,title,slug,content,date`,
    { headers: { Authorization: `Basic ${WP_AUTH}` } }
  )
  const allPosts = await res.json()
  const posts = allPosts.filter(p => FAILED_IDS.includes(p.id))
  console.log(`📋 ${posts.length} posts para reprocessar\n`)

  const results = []
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const originalIdx = ALL_IDS_ORDER.indexOf(post.id)
    const imageSource = originalIdx >= 0 ? IMAGE_SOURCES[originalIdx % 3] : 'pexels'
    const title = post.title.rendered
    const slug = post.slug
    const isTutorial = isTutorialTopic(title)

    console.log(`\n[${i + 1}/${posts.length}] #${post.id} ${title}`)
    console.log(`  🖼️  Imagem: ${imageSource} | Tutorial: ${isTutorial}`)

    try {
      console.log('  ✍️  Reescrevendo (2 chamadas separadas)...')
      const productSlug = getProductForTopic(title)
      const rewritten = await rewritePostAEO(title, post.content.rendered, productSlug, isTutorial)

      // Image
      console.log(`  🖼️  Imagem (${imageSource})...`)
      let imageData = null

      if (imageSource === 'product' && productSlug) {
        imageData = await getWCProductImage(productSlug)
      }
      if (!imageData) {
        const query = title.split(' ').slice(0, 4).join(' ')
        console.log(`  🔍 Pexels: "${query}"`)
        imageData = await searchPexels(query + ' medical professional')
      }

      let featuredMediaId = null
      if (imageData) {
        console.log('  📤 Upload imagem...')
        featuredMediaId = await uploadImageToWP(imageData, `${slug}.jpg`)
        if (featuredMediaId) console.log(`  ✅ Media ID: ${featuredMediaId}`)
      }

      const finalContent = buildFinalContent(title, slug, rewritten, isTutorial, imageSource)
      await updateWPPost(post.id, finalContent, rewritten.metaDescription, featuredMediaId)
      console.log(`  ✅ Post #${post.id} atualizado!`)
      results.push({ id: post.id, title, status: 'ok' })
    } catch (err) {
      console.log(`  ❌ ERRO: ${err.message}`)
      results.push({ id: post.id, title, status: 'error', error: err.message })
    }

    if (i < posts.length - 1) {
      console.log('  ⏸️  Aguardando 10s...')
      await sleep(10000)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ OK: ${results.filter(r => r.status === 'ok').length}/${results.length}`)
  const errors = results.filter(r => r.status === 'error')
  if (errors.length) errors.forEach(e => console.log(`❌ #${e.id}: ${e.error}`))
}

main().catch(console.error)
