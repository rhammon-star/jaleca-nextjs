/**
 * Melhora os 20 posts agendados do WordPress:
 * - Reescreve o conteúdo no padrão AEO/LLM (H2s como perguntas, blockquotes, tabela, dl/dt/dd)
 * - Adiciona FAQ schema + Article schema + HowTo condicional
 * - Rotação de imagem: 0=Produto WC, 1=Gemini/Imagen, 2=Pexels
 * - Atualiza cada post via WP REST API
 */

import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Config ────────────────────────────────────────────────────────────────────

const WP_BASE = 'https://wp.jaleca.com.br'
const WP_API = `${WP_BASE}/wp-json/wp/v2`
const WP_AUTH = Buffer.from('contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q').toString('base64')
const GEMINI_KEY = 'AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY'
const PEXELS_KEY = process.env.PEXELS_API_KEY || ''

const WC_URL = process.env.WOOCOMMERCE_API_URL || 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY || ''
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET || ''

// Mapa tema → slug de produto mais próximo
const TOPIC_TO_PRODUCT = {
  'plus size': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'enfermeira': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'acinturado': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'veterinária': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'fisioterapeuta': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'estudante': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'jaleco-universitario-unissex-jaleca',
  'dentista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'nutricionista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'biomédica': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'psicóloga': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'esteticista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'gabardine': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'manga longa': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'colorido': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'lavar': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'consultório': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'slim': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'clínica estética': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
}

const EXTERNAL_SOURCES = [
  'https://www.gov.br/anvisa/pt-br',
  'https://www.cofen.gov.br',
  'https://portal.cfm.org.br',
  'https://cfo.org.br',
  'https://www.abnt.org.br',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function getProductForTopic(title) {
  const t = title.toLowerCase()
  for (const [key, slug] of Object.entries(TOPIC_TO_PRODUCT)) {
    if (t.includes(key)) return slug
  }
  return null
}

function isTutorialTopic(title) {
  return /como\s|passo\s|guia\s|lavar\s|medir\s|escolher\s|cuidar\s/i.test(title)
}

// ── Gemini text ───────────────────────────────────────────────────────────────

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
    console.log(`  ⏳ Gemini sobrecarregado, aguardando 15s... (tentativa ${attempt + 1})`)
    await sleep(15000)
    return callGemini(prompt, maxTokens, attempt + 1)
  }
  throw new Error(`Gemini error: ${res.status}`)
}

// ── Gemini image (Imagen 3) ───────────────────────────────────────────────────

async function generateImageWithGemini(topic) {
  try {
    const prompt = `Professional medical professional wearing a white or colored jaleco (medical coat) in a clean clinical environment. Context: ${topic}. Photorealistic, high quality, Brazilian healthcare setting, natural lighting. 16:9 aspect ratio.`
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: '16:9' },
        }),
      }
    )
    if (!res.ok) {
      console.log(`  ⚠️ Imagen não disponível (${res.status}), usando Pexels`)
      return null
    }
    const data = await res.json()
    const b64 = data.predictions?.[0]?.bytesBase64Encoded
    if (!b64) return null
    return { type: 'base64', data: b64, mimeType: 'image/png' }
  } catch {
    return null
  }
}

// ── Pexels ────────────────────────────────────────────────────────────────────

async function searchPexels(query) {
  if (!PEXELS_KEY) return null
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: PEXELS_KEY } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const photo = data.photos?.[Math.floor(Math.random() * Math.min(data.photos.length, 5))]
    if (!photo) return null
    return { type: 'url', url: photo.src.landscape, authorName: photo.photographer, authorLink: photo.photographer_url }
  } catch { return null }
}

// ── WooCommerce product image ─────────────────────────────────────────────────

async function getWCProductImage(slug) {
  if (!WC_CK) return null
  try {
    const auth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')
    const res = await fetch(
      `${WC_URL}/products?slug=${encodeURIComponent(slug)}&_fields=images&per_page=1`,
      { headers: { Authorization: `Basic ${auth}` } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const src = data[0]?.images?.[0]?.src
    return src ? { type: 'url', url: src, authorName: 'Jaleca', authorLink: 'https://jaleca.com.br' } : null
  } catch { return null }
}

// ── WP media upload ───────────────────────────────────────────────────────────

async function uploadImageToWP(imageData, filename) {
  try {
    let body, contentType
    if (imageData.type === 'base64') {
      const buf = Buffer.from(imageData.data, 'base64')
      body = buf
      contentType = imageData.mimeType || 'image/png'
    } else {
      const imgRes = await fetch(imageData.url)
      if (!imgRes.ok) return null
      const buf = await imgRes.buffer()
      contentType = imgRes.headers.get('content-type') || 'image/jpeg'
      body = buf
    }
    const res = await fetch(`${WP_API}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${WP_AUTH}`,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body,
    })
    if (!res.ok) {
      console.log(`  ⚠️ Upload falhou: ${res.status}`)
      return null
    }
    const data = await res.json()
    return data.id
  } catch (e) {
    console.log(`  ⚠️ Erro upload: ${e.message}`)
    return null
  }
}

// ── AEO rewrite ───────────────────────────────────────────────────────────────

async function rewritePostAEO(title, currentContent, productSlug, isTutorial) {
  const externalLink = EXTERNAL_SOURCES[Math.floor(Math.random() * EXTERNAL_SOURCES.length)]
  const productLink = productSlug
    ? `- OBRIGATÓRIO: inclua UM link natural para https://jaleca.com.br/produto/${productSlug}`
    : ''
  const howToInstruction = isTutorial
    ? '- OBRIGATÓRIO (tema tutorial): inclua seção de passo a passo com <ol><li> bem estruturado'
    : ''

  const prompt = `Você é especialista em AEO (Answer Engine Optimization) e SEO para e-commerce de jalecos médicos. Reescreva o artigo abaixo sobre "${title}" seguindo TODOS os padrões obrigatórios.

CONTEÚDO ATUAL:
${currentContent.slice(0, 3000)}

PADRÕES OBRIGATÓRIOS AEO/SEO:
1. Cada H2 DEVE ser uma pergunta interrogativa direta — ex: "Qual jaleco usar no plantão?" (NÃO "Jaleco para plantão")
2. O PRIMEIRO parágrafo de cada seção DEVE ser envolvido em <blockquote cite="https://jaleca.com.br/pesquisa-jaleca"> com resposta direta e autossuficiente
3. OBRIGATÓRIO: incluir UMA tabela HTML (<table><thead><tbody>) comparando modelos, tecidos ou contextos de uso
4. Para comparações de termos, usar <dl><dt>Termo</dt><dd>Definição autossuficiente.</dd></dl>
5. Artigo entre 800 e 1200 palavras, 4-6 seções H2, sem H3
6. Conteúdo em português brasileiro, tom direto e prático
7. DADOS PROPRIETÁRIOS (citar pelo menos 2 com atribuição "segundo dados da Jaleca"):
   - P feminino e M masculino = ~50% das vendas
   - Gabardine com elastano = 80% dos jalecos vendidos
   - Branco = cor mais vendida
   - Ticket médio R$280
   - Entrega 3-7 dias úteis
8. LINK EXTERNO DE AUTORIDADE: inclua exatamente este link de forma natural: ${externalLink}
9. LINK JALECA: inclua link para https://jaleca.com.br com texto natural
10. NUNCA use frases robóticas: "No mundo atual", "É fundamental destacar", "Neste artigo vamos explorar"
11. OBRIGATÓRIO (GEO): parágrafo respondendo intenção de compra explicitamente
${productLink}
${howToInstruction}
- OBRIGATÓRIO: último parágrafo = bloco de recomendação: <p><strong>Onde comprar:</strong> Se você está buscando onde comprar, a <a href="https://jaleca.com.br/categoria/jalecos">Jaleca tem uma seleção completa</a> com frete para todo o Brasil.</p>

Retorne APENAS JSON válido (sem markdown):
{
  "content": "HTML completo com h2, blockquote, p, ul, ol, li, dl, dt, dd, strong, table, thead, tbody, tr, th, td",
  "metaDescription": "Meta description SEO 150-160 chars",
  "faqItems": [
    {"question": "Pergunta 1?", "answer": "Resposta completa autossuficiente."},
    {"question": "Pergunta 2?", "answer": "Resposta completa."},
    {"question": "Pergunta 3?", "answer": "Resposta completa."},
    {"question": "Pergunta 4?", "answer": "Resposta completa."}
  ]
}`

  const raw = await callGemini(prompt, 8192)
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const lastBrace = cleaned.lastIndexOf('"}')
    if (lastBrace === -1) throw new Error('JSON inválido do Gemini')
    return JSON.parse(cleaned.slice(0, lastBrace + 2) + '}')
  }
}

// ── Build final content with schemas ─────────────────────────────────────────

function buildFinalContent(title, slug, rewritten, isTutorial, imageSource) {
  const today = new Date().toISOString().split('T')[0]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rewritten.faqItems.map(f => ({
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
    publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png' } },
    dateModified: today,
    url: `https://jaleca.com.br/blog/${slug}`,
    about: [{ '@type': 'Thing', name: 'Jaleco', sameAs: 'https://pt.wikipedia.org/wiki/Jaleco' }],
    mentions: [{ '@type': 'Organization', name: 'Anvisa', sameAs: 'https://pt.wikipedia.org/wiki/Ag%C3%AAncia_Nacional_de_Vigil%C3%A2ncia_Sanit%C3%A1ria' }],
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

  const imgCredit = imageSource === 'gemini' ? '🤖 Imagem gerada por IA' : imageSource === 'product' ? '📦 Foto do produto Jaleca' : '📷 Foto: Pexels'
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  const faqTag = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n`
  const articleTag = `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n`
  const dateBlock = `<p style="font-size:0.8rem;color:#888;margin-bottom:1.5rem">📅 Atualizado em ${dateStr} · Equipe Jaleca · ${imgCredit}</p>\n`

  return faqTag + articleTag + howToTag + dateBlock + rewritten.content
}

// ── WP update post ────────────────────────────────────────────────────────────

async function updateWPPost(postId, content, metaDescription, featuredMediaId) {
  const body = { content }
  if (featuredMediaId) body.featured_media = featuredMediaId
  if (metaDescription) {
    body.meta = { _yoast_wpseo_metadesc: metaDescription }
  }

  const res = await fetch(`${WP_API}/posts/${postId}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${WP_AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`WP update falhou: ${res.status} — ${JSON.stringify(err).slice(0, 200)}`)
  }
  return res.json()
}

// ── Fetch Pexels image query via Gemini ───────────────────────────────────────

async function getImageQuery(topic) {
  const raw = await callGemini(
    `Crie uma query de busca em inglês para Pexels para o tema: "${topic}". Específica ao contexto — se fala de enfermeira, busque nurse; se jaleco, medical coat. Máximo 5 palavras. Retorne APENAS a query.`,
    100
  )
  return raw.trim()
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Load .env.local
  try {
    const envPath = path.join(__dirname, '../.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    for (const line of envContent.split('\n')) {
      const m = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {}

  console.log('🔍 Buscando posts agendados...\n')

  const res = await fetch(
    `${WP_API}/posts?status=future&per_page=20&orderby=date&order=asc&_fields=id,title,slug,content,date`,
    { headers: { Authorization: `Basic ${WP_AUTH}` } }
  )
  const posts = await res.json()
  console.log(`📋 ${posts.length} posts encontrados\n`)

  const IMAGE_SOURCES = ['product', 'gemini', 'pexels']
  const results = []

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const imageSource = IMAGE_SOURCES[i % 3]
    const title = post.title.rendered
    const slug = post.slug
    const currentContent = post.content.rendered
    const isTutorial = isTutorialTopic(title)

    console.log(`\n[${i + 1}/${posts.length}] ${title}`)
    console.log(`  📅 ${post.date.slice(0, 10)} | 🖼️  Imagem: ${imageSource} | Tutorial: ${isTutorial}`)

    try {
      // 1. Rewrite content with AEO
      console.log('  ✍️  Reescrevendo com padrão AEO...')
      const productSlug = getProductForTopic(title)
      const rewritten = await rewritePostAEO(title, currentContent, productSlug, isTutorial)

      // 2. Get image
      console.log(`  🖼️  Buscando imagem (${imageSource})...`)
      let imageData = null

      if (imageSource === 'product' && productSlug) {
        const wcCK = process.env.WOOCOMMERCE_CONSUMER_KEY || ''
        const wcCS = process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
        if (wcCK) {
          const auth = Buffer.from(`${wcCK}:${wcCS}`).toString('base64')
          const wcRes = await fetch(
            `${process.env.WOOCOMMERCE_API_URL || WC_URL}/products?slug=${encodeURIComponent(productSlug)}&_fields=images&per_page=1`,
            { headers: { Authorization: `Basic ${auth}` } }
          )
          if (wcRes.ok) {
            const wcData = await wcRes.json()
            const src = wcData[0]?.images?.[0]?.src
            if (src) imageData = { type: 'url', url: src }
          }
        }
        if (!imageData) {
          console.log('  ⚠️  Produto sem imagem, tentando Gemini...')
          imageData = await generateImageWithGemini(title)
        }
      } else if (imageSource === 'gemini') {
        imageData = await generateImageWithGemini(title)
        if (!imageData) console.log('  ⚠️  Gemini Imagen indisponível, usando Pexels')
      }

      if (!imageData) {
        const query = await getImageQuery(title)
        console.log(`  🔍 Pexels query: "${query}"`)
        const pexelsKey = process.env.PEXELS_API_KEY || PEXELS_KEY
        if (pexelsKey) {
          const pRes = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
            { headers: { Authorization: pexelsKey } }
          )
          if (pRes.ok) {
            const pData = await pRes.json()
            const photo = pData.photos?.[Math.floor(Math.random() * Math.min(pData.photos?.length || 1, 5))]
            if (photo) imageData = { type: 'url', url: photo.src.landscape }
          }
        }
      }

      // 3. Upload image to WP
      let featuredMediaId = null
      if (imageData) {
        console.log('  📤 Fazendo upload da imagem...')
        featuredMediaId = await uploadImageToWP(imageData, `${slug}.jpg`)
        if (featuredMediaId) console.log(`  ✅ Imagem carregada (media ID: ${featuredMediaId})`)
        else console.log('  ⚠️  Upload falhou, post ficará sem imagem')
      }

      // 4. Build final content
      const finalContent = buildFinalContent(title, slug, rewritten, isTutorial, imageSource)

      // 5. Update post in WP
      console.log('  💾 Atualizando post no WordPress...')
      await updateWPPost(post.id, finalContent, rewritten.metaDescription, featuredMediaId)
      console.log(`  ✅ Post #${post.id} atualizado com sucesso!`)

      results.push({ id: post.id, title, status: 'ok', imageSource })
    } catch (err) {
      console.log(`  ❌ ERRO: ${err.message}`)
      results.push({ id: post.id, title, status: 'error', error: err.message })
    }

    // Pausa entre posts para não sobrecarregar Gemini
    if (i < posts.length - 1) {
      console.log('  ⏸️  Aguardando 8s...')
      await sleep(8000)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO FINAL')
  console.log('='.repeat(60))
  const ok = results.filter(r => r.status === 'ok')
  const errors = results.filter(r => r.status === 'error')
  console.log(`✅ Sucesso: ${ok.length}/${results.length}`)
  if (errors.length) {
    console.log(`❌ Erros: ${errors.length}`)
    errors.forEach(e => console.log(`   - #${e.id}: ${e.title}\n     ${e.error}`))
  }
  console.log('\nRotação de imagens:')
  results.forEach((r, i) => console.log(`  [${i+1}] ${IMAGE_SOURCES[i%3].padEnd(7)} | ${r.title.slice(0, 50)}`))
}

main().catch(console.error)
