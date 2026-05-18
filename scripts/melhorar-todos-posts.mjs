/**
 * Melhora TODOS os posts publicados do WordPress:
 * - Pula posts que já têm AEO (detecta blockquote cite ou FAQPage)
 * - Reescreve com padrão AEO em 2 chamadas Gemini separadas
 * - Adiciona foto a posts sem featured_media (rotação produto WC / Pexels)
 */

import fetch from 'node-fetch'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const WP_API = 'https://wp.jaleca.com.br/wp-json/wp/v2'
const WP_AUTH = Buffer.from('contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q').toString('base64')
const GEMINI_KEY = 'AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY'

const EXTERNAL_SOURCES = [
  'https://www.cofen.gov.br',
  'https://portal.cfm.org.br',
  'https://cfo.org.br',
  'https://www.gov.br/anvisa/pt-br',
  'https://www.abnt.org.br',
  'https://pt.wikipedia.org/wiki/Jaleco',
]

const TOPIC_TO_PRODUCT = {
  'plus size': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'enfermeira': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'veterinária': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'fisioterapeuta': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'estudante': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'jaleco-universitario-unissex-jaleca',
  'universitário': 'jaleco-universitario-unissex-jaleca',
  'dentista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'nutricionista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'biomédica': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'psicóloga': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'esteticista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'slim': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'colorido': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'médica': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'médico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'masculino': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'gestante': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'manga curta': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'manga longa': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'bordado': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'formatura': 'jaleco-universitario-unissex-jaleca',
  'tecido': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'tamanho': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'lavar': 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'pijama cirúrgico': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'scrub': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
function isTutorial(title) { return /como\s|passo\s|lavar\s|escolher\s|cuidar\s|guia\s/i.test(title) }
function hasAEO(content) {
  return content.includes('pesquisa-jaleca') || content.includes('FAQPage') || content.includes('blockquote cite')
}
function getProduct(title) {
  const t = title.toLowerCase()
  for (const [k, v] of Object.entries(TOPIC_TO_PRODUCT)) if (t.includes(k)) return v
  return null
}
function stripJson(raw) {
  return raw.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim()
}

async function callGemini(prompt, maxTokens = 8192, attempt = 0) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 90000)
  let res
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      { method:'POST', headers:{'Content-Type':'application/json'}, signal: controller.signal,
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:maxTokens} }) }
    )
  } finally { clearTimeout(timeout) }
  if (res.ok) {
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }
  if ((res.status===503||res.status===429) && attempt<5) { await sleep(20000); return callGemini(prompt,maxTokens,attempt+1) }
  throw new Error(`Gemini ${res.status}`)
}

async function getPexelsImage(query) {
  const key = process.env.PEXELS_API_KEY||''
  if (!key) return null
  try {
    const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers:{Authorization:key} })
    if (!r.ok) return null
    const d = await r.json()
    const p = d.photos?.[Math.floor(Math.random()*Math.min(d.photos?.length||1,5))]
    return p ? {type:'url',url:p.src.landscape} : null
  } catch { return null }
}

async function getWCImage(slug) {
  const ck=process.env.WOOCOMMERCE_CONSUMER_KEY||'', cs=process.env.WOOCOMMERCE_CONSUMER_SECRET||''
  const wcUrl=process.env.WOOCOMMERCE_API_URL||'https://wp.jaleca.com.br/wp-json/wc/v3'
  if (!ck) return null
  try {
    const auth=Buffer.from(`${ck}:${cs}`).toString('base64')
    const r=await fetch(`${wcUrl}/products?slug=${encodeURIComponent(slug)}&_fields=images&per_page=1`,
      {headers:{Authorization:`Basic ${auth}`}})
    if (!r.ok) return null
    const d=await r.json()
    const src=d[0]?.images?.[0]?.src
    return src ? {type:'url',url:src} : null
  } catch { return null }
}

async function uploadToWP(imageData, filename) {
  try {
    const ir=await fetch(imageData.url)
    if (!ir.ok) return null
    const buf=await ir.buffer()
    const ct=ir.headers.get('content-type')||'image/jpeg'
    const r=await fetch(`${WP_API}/media`, {
      method:'POST',
      headers:{Authorization:`Basic ${WP_AUTH}`,'Content-Type':ct,'Content-Disposition':`attachment; filename="${filename}"`},
      body:buf
    })
    if (!r.ok) return null
    return (await r.json()).id
  } catch { return null }
}

async function rewriteAEO(title, content, productSlug, isTut) {
  const ext = EXTERNAL_SOURCES[Math.floor(Math.random()*EXTERNAL_SOURCES.length)]
  const prodInstruction = productSlug ? `Inclua UM link natural para https://jaleca.com.br/produto/${productSlug}` : 'Inclua link natural para https://jaleca.com.br/categoria/jalecos'

  // Chamada 1: HTML
  const htmlPrompt = `Reescreva o artigo abaixo sobre "${title}" no padrão AEO para citação por IAs (ChatGPT, Gemini, Perplexity).

CONTEÚDO ATUAL:
${content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,2000)}

REGRAS OBRIGATÓRIAS:
1. Cada H2 = pergunta interrogativa — ex: "Qual jaleco usar no plantão?"
2. Primeiro parágrafo de cada seção: <blockquote cite="https://jaleca.com.br/pesquisa-jaleca"><p>resposta direta autossuficiente</p></blockquote>
3. UMA tabela HTML <table><thead><tbody> comparando modelos, tecidos ou contextos
4. Para definições/comparações: <dl><dt>Termo</dt><dd>Definição completa.</dd></dl>
5. 800-1000 palavras, 4-5 seções H2, sem H3
6. Citar 2+ dados Jaleca com atribuição: P/M feminino=50% vendas, gabardine+elastano=80%, branco=mais vendido, ticket R$280, entrega 3-7 dias
7. Link externo natural: ${ext}
8. ${prodInstruction}
9. Parágrafo GEO respondendo intenção de compra explicitamente
${isTut ? '10. Seção passo a passo com <ol><li> bem estruturado' : ''}
10. Último parágrafo: <p><strong>Onde comprar:</strong> Se você busca onde comprar, a <a href="https://jaleca.com.br/categoria/jalecos">Jaleca tem seleção completa</a> com frete para todo o Brasil.</p>
- NUNCA: "No mundo atual", "É fundamental destacar", "Neste artigo", "Nos dias de hoje"
- Português brasileiro, tom direto e prático

Retorne APENAS o HTML puro (sem markdown, sem json).`

  const rawHtml = await callGemini(htmlPrompt, 8192)
  const html = rawHtml.replace(/^```html\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim()

  await sleep(2000)

  // Chamada 2: FAQ + meta
  const faqPrompt = `Para o artigo "${title}", gere APENAS este JSON:
{
  "metaDescription": "meta description SEO 150-160 chars",
  "faqItems": [
    {"question":"Pergunta 1 (igual ao H2)?","answer":"Resposta completa autossuficiente."},
    {"question":"Pergunta 2?","answer":"Resposta."},
    {"question":"Pergunta 3?","answer":"Resposta."},
    {"question":"Pergunta 4?","answer":"Resposta."}
  ]
}
Retorne APENAS JSON válido.`

  const rawFaq = await callGemini(faqPrompt, 1000)
  let faqData
  try {
    faqData = JSON.parse(stripJson(rawFaq))
  } catch {
    faqData = {
      metaDescription: `${title.slice(0,130)} — guia completo para profissionais de saúde.`,
      faqItems: [
        {question:`O que considerar ao escolher ${title.split(':')[0]}?`, answer:`É importante avaliar tecido, modelo e contexto de uso. Segundo dados da Jaleca, gabardine com elastano representa 80% das vendas por unir conforto e durabilidade.`},
        {question:'Onde comprar jaleco de qualidade?', answer:'A Jaleca oferece seleção completa com entrega para todo o Brasil em 3-7 dias úteis. O ticket médio de um jaleco profissional é R$280.'},
      ]
    }
  }

  return { html, ...faqData }
}

function buildContent(title, slug, rewritten, isTut, imageSource) {
  const today = new Date().toISOString().split('T')[0]
  const dateStr = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})

  const faqSchema = {
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: (rewritten.faqItems||[]).map(f=>({
      '@type':'Question', name:f.question,
      acceptedAnswer:{'@type':'Answer',text:f.answer}
    }))
  }
  const articleSchema = {
    '@context':'https://schema.org','@type':'Article',
    headline:title,
    author:{'@type':'Organization',name:'Jaleca',url:'https://jaleca.com.br'},
    publisher:{'@type':'Organization',name:'Jaleca',url:'https://jaleca.com.br',logo:{'@type':'ImageObject',url:'https://jaleca.com.br/logo-jaleca-512.png'}},
    dateModified:today,
    url:`https://jaleca.com.br/blog/${slug}`,
    about:[{'@type':'Thing',name:'Jaleco',sameAs:'https://pt.wikipedia.org/wiki/Jaleco'}],
  }
  let howTo = ''
  if (isTut && rewritten.faqItems?.length) {
    howTo = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'HowTo',name:title,step:rewritten.faqItems.map((f,i)=>({'@type':'HowToStep',position:i+1,name:f.question,text:f.answer}))})}</script>\n`
  }
  const imgLabel = imageSource==='product' ? '📦 Jaleca' : '📷 Pexels'
  const dateBlock = `<p style="font-size:0.8rem;color:#888;margin-bottom:1.5rem">📅 Atualizado em ${dateStr} · Equipe Jaleca · ${imgLabel}</p>\n`

  return `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n` +
    `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n` +
    howTo + dateBlock + rewritten.html
}

async function updatePost(id, content, meta, mediaId) {
  const body = {content}
  if (mediaId) body.featured_media = mediaId
  if (meta) body.meta = {_yoast_wpseo_metadesc: meta}
  const r = await fetch(`${WP_API}/posts/${id}`, {
    method:'POST',
    headers:{Authorization:`Basic ${WP_AUTH}`,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  })
  if (!r.ok) throw new Error(`WP ${r.status}: ${JSON.stringify(await r.json()).slice(0,100)}`)
}

async function fetchAllPublished() {
  const posts = []
  let page = 1
  while (true) {
    const r = await fetch(
      `${WP_API}/posts?status=publish&per_page=100&page=${page}&_fields=id,title,slug,content,featured_media,date`,
      {headers:{Authorization:`Basic ${WP_AUTH}`}}
    )
    if (!r.ok) break
    const batch = await r.json()
    if (!batch.length) break
    posts.push(...batch)
    if (batch.length < 100) break
    page++
  }
  return posts
}

async function main() {
  try {
    const env = fs.readFileSync(path.join(__dirname,'../.env.local'),'utf8')
    for (const line of env.split('\n')) {
      const m = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {}

  console.log('📥 Buscando todos os posts publicados...')
  const all = await fetchAllPublished()
  console.log(`📋 Total: ${all.length} posts\n`)

  // Filtrar: só posts SEM AEO
  const toProcess = all.filter(p => !hasAEO(p.content.rendered))
  const alreadyAEO = all.length - toProcess.length

  console.log(`✅ Já têm AEO: ${alreadyAEO} (pulando)`)
  console.log(`🔄 Para processar: ${toProcess.length}`)
  console.log(`🖼️  Sem foto: ${toProcess.filter(p=>!p.featured_media).length}\n`)

  // Log para arquivo
  const logLines = [`Início: ${new Date().toISOString()}`, `Total: ${all.length}`, `Já AEO: ${alreadyAEO}`, `Para processar: ${toProcess.length}`, '']
  const logFile = path.join(__dirname, '../ai-source-docs/historico/melhoria-posts-aeo.log')

  const results = {ok:0, skipped:0, error:[], total: toProcess.length}

  const START_INDEX = parseInt(process.env.START_INDEX || '0', 10)
  if (START_INDEX > 0) console.log(`⏩ Retomando a partir do índice ${START_INDEX}\n`)

  for (let i = START_INDEX; i < toProcess.length; i++) {
    const post = toProcess[i]
    const title = post.title.rendered
    const slug = post.slug
    const isTut = isTutorial(title)
    const needsImage = !post.featured_media
    const imageSource = i % 2 === 0 ? 'product' : 'pexels'

    process.stdout.write(`[${i+1}/${toProcess.length}] #${post.id} | ${title.slice(0,55)}...\n`)

    try {
      // Rewrite
      const productSlug = getProduct(title)
      const rewritten = await rewriteAEO(title, post.content.rendered, productSlug, isTut)

      // Image (só busca se não tem ou se rotação bate)
      let mediaId = null
      if (needsImage) {
        let imageData = null
        if (imageSource === 'product' && productSlug) {
          imageData = await getWCImage(productSlug)
        }
        if (!imageData) {
          const query = title.split(/[:\-–]/)[0].trim()
          imageData = await getPexelsImage(query + ' professional healthcare')
        }
        if (imageData) {
          mediaId = await uploadToWP(imageData, `${slug}.jpg`)
          if (mediaId) process.stdout.write(`  📸 Foto adicionada (${imageSource})\n`)
        }
      }

      const finalContent = buildContent(title, slug, rewritten, isTut, imageSource)
      await updatePost(post.id, finalContent, rewritten.metaDescription, mediaId)
      process.stdout.write(`  ✅ OK\n`)
      results.ok++
      logLines.push(`OK | #${post.id} | ${title}`)
    } catch (err) {
      process.stdout.write(`  ❌ ${err.message}\n`)
      results.error.push({id:post.id, title, err:err.message})
      logLines.push(`ERRO | #${post.id} | ${title} | ${err.message}`)
    }

    // Salva log a cada 10 posts
    if ((i+1) % 10 === 0) {
      fs.writeFileSync(logFile, logLines.join('\n'))
      process.stdout.write(`\n  💾 Log salvo (${i+1}/${toProcess.length})\n\n`)
    }

    if (i < toProcess.length - 1) await sleep(8000)
  }

  // Final
  logLines.push('', `Fim: ${new Date().toISOString()}`, `OK: ${results.ok}`, `Erros: ${results.error.length}`)
  fs.writeFileSync(logFile, logLines.join('\n'))

  console.log('\n' + '='.repeat(60))
  console.log(`📊 RESULTADO FINAL`)
  console.log('='.repeat(60))
  console.log(`✅ Atualizados: ${results.ok}/${results.total}`)
  console.log(`⏭️  Já tinham AEO: ${alreadyAEO}`)
  if (results.error.length) {
    console.log(`❌ Erros: ${results.error.length}`)
    results.error.forEach(e => console.log(`   #${e.id}: ${e.err}`))
  }
  console.log(`\n📁 Log completo: ai-source-docs/historico/melhoria-posts-aeo.log`)
}

main().catch(console.error)
