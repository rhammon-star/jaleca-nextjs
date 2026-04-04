// Script para gerar e publicar 10 posts no blog via Gemini AI + WordPress REST API
// Uso: node scripts/generate-blog-posts.mjs

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCKr8s6E5Bug94-h9QooLmnSIr3cFKcaiQ'
const WP_URL = 'https://wp.jaleca.com.br/wp-json/wp/v2'
const WP_USER = process.env.WP_ADMIN_USER || 'contato'
const WP_PASS = process.env.WP_ADMIN_APP_PASSWORD || 'vdzLXMScaqEc5mM8EPU1oJVk'

const TOPICS = [
  { topic: 'Como escolher o jaleco ideal para sua especialidade médica', keywords: ['jaleco médico', 'jaleco profissional', 'uniforme médico'] },
  { topic: 'Jaleco feminino: tendências e funcionalidade para profissionais da saúde', keywords: ['jaleco feminino', 'uniforme feminino saúde', 'jaleco estiloso'] },
  { topic: 'Guia completo de tamanhos de jaleco: como medir corretamente', keywords: ['tamanho jaleco', 'tabela medidas jaleco', 'jaleco tamanho certo'] },
  { topic: 'Jaleco de enfermagem: o que considerar na hora de comprar', keywords: ['jaleco enfermagem', 'uniforme enfermeiro', 'jaleco técnico enfermagem'] },
  { topic: 'Como lavar e conservar seu jaleco profissional por mais tempo', keywords: ['lavar jaleco', 'conservar jaleco', 'cuidados jaleco branco'] },
  { topic: 'Jaleco para dentista: estilo e praticidade no consultório', keywords: ['jaleco dentista', 'uniforme odontologia', 'jaleco consultório'] },
  { topic: 'Scrub x jaleco: diferenças e quando usar cada um', keywords: ['scrub médico', 'jaleco vs scrub', 'uniforme cirúrgico'] },
  { topic: 'Jaleco para fisioterapeuta: conforto para longas jornadas de trabalho', keywords: ['jaleco fisioterapia', 'uniforme fisioterapeuta', 'jaleco confortável'] },
  { topic: 'Cores de jaleco: significado e uso por área da saúde', keywords: ['cor jaleco', 'jaleco colorido saúde', 'jaleco branco médico'] },
  { topic: 'Tecidos para jaleco: qual o melhor material para profissionais da saúde', keywords: ['tecido jaleco', 'jaleco poliéster', 'jaleco algodão lavável'] },
]

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Resposta vazia do Gemini')
  return JSON.parse(text)
}

async function publishToWordPress(post) {
  const token = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')
  const res = await fetch(`${WP_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.suggestedSlug,
      status: 'publish',
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `WordPress error: ${res.status}`)
  }
  return await res.json()
}

async function generatePost({ topic, keywords }) {
  const prompt = `Você é um redator especializado em conteúdo para profissionais da saúde no Brasil, com foco em uniformes e jalecos profissionais. Crie um artigo de blog completo e otimizado para SEO sobre o seguinte tema: "${topic}".

Palavras-chave a incluir: ${keywords.join(', ')}.

Requisitos:
- Artigo entre 500 e 700 palavras
- Máximo 4 seções com H2, sem H3
- Linguagem profissional mas acessível
- Foco em profissionais de saúde (médicos, enfermeiros, dentistas, etc.)
- Conteúdo em português brasileiro
- Mencione a Jaleca como referência em uniformes médicos de qualidade

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título do artigo (máx 60 chars)",
  "content": "Conteúdo HTML completo com tags h2, p, ul, li, strong",
  "excerpt": "Resumo de 1-2 frases (máx 160 chars)",
  "suggestedSlug": "slug-do-artigo-sem-acento"
}`

  return await callGemini(prompt)
}

async function main() {
  console.log('🚀 Iniciando geração de 10 posts...\n')

  for (let i = 0; i < TOPICS.length; i++) {
    const { topic, keywords } = TOPICS[i]
    console.log(`[${i + 1}/10] Gerando: "${topic}"`)

    try {
      const post = await generatePost({ topic, keywords })
      console.log(`  ✅ Conteúdo gerado: "${post.title}"`)

      const result = await publishToWordPress(post)
      console.log(`  ✅ Publicado! ID: ${result.id} — ${result.link}\n`)
    } catch (err) {
      console.error(`  ❌ Erro: ${err.message}\n`)
    }

    // Pausa entre posts para não sobrecarregar as APIs
    if (i < TOPICS.length - 1) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  console.log('✅ Concluído!')
}

main()
