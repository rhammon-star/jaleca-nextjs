#!/usr/bin/env node
/**
 * VALIDAÇÃO GEMINI DIRETO — 164 Páginas (AI_BLACKLIST + SEO)
 *
 * Usa Gemini API diretamente (sem bash scripts)
 */

import { readFile, writeFile } from 'fs/promises'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY não configurada')
  process.exit(1)
}

// AI_BLACKLIST
const AI_BLACKLIST = [
  'Primeiramente', 'Ademais', 'Outrossim', 'Não obstante', 'Assim sendo',
  'Destarte', 'Por conseguinte', 'Em síntese', 'Em suma', 'No que diz respeito',
  'No tocante a', 'No que tange', 'No que se refere', 'Concernente a',
  'No que concerne', 'Por forma que', 'De sorte que', 'De tal maneira que',
  'A priori', 'A posteriori',
  'Potencializar', 'Maximizar', 'Otimizar', 'Ressignificar', 'Externalizar',
  'Internalizar', 'Consolidar', 'Estruturar', 'Perenizar', 'Verticalizar',
  'Tangenciar', 'Convergir', 'Propender',
  'Inédito', 'Transformador', 'Abrangente', 'Consistente', 'Profícuo',
  'É importante ressaltar que', 'É fundamental destacar que',
  'É válido salientar que', 'Deixe-me explicar', 'Como podemos observar',
  'Podemos notar que', 'É possível notar', 'Fica evidente', 'Nota-se que',
  'Ressalta-se que', 'Conclui-se que', 'É preciso destacar',
  'Neste sentido', 'Neste contexto', 'Nessa perspectiva', 'Sob tal óptica',
  'Com base nisso', 'À luz disso', 'Face ao exposto', 'Posto isso', 'Isto posto',
  'Cumpre destacar', 'Cabe ressaltar', 'Faz-se necessário', 'Torna-se imperativo',
  'É mister', 'Não resta dúvida que', 'Inquestionavelmente', 'Indubitavelmente',
  'Sem sombra de dúvida',
  'Bem-vindo a este artigo', 'Neste artigo vamos falar sobre',
  'Você sabia que', 'Você já se perguntou', 'Aqui está o que você precisa saber',
  'Sem mais delongas', 'Vamos direto ao ponto', 'Segundo especialistas',
  'No mundo atual', 'Nos dias de hoje', 'No cenário atual',
]

function checkBlacklist(text) {
  const lower = text.toLowerCase()
  const found = AI_BLACKLIST.filter(w => lower.includes(w.toLowerCase()))
  return { flagged: found.length > 0, found }
}

async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.3,
        },
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Resposta vazia do Gemini')

  // Limpar markdown code blocks
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

async function main() {
  console.log('🤖 VALIDAÇÃO GEMINI DIRETO — 164 Páginas\n')

  // Carregar SEO data
  const seoData = JSON.parse(
    await readFile(
      new URL('../docs/SEO-PRODUTOS-CORES.json', import.meta.url),
      'utf-8'
    )
  )

  console.log(`Total: ${seoData.length} páginas\n`)

  // 1. AI_BLACKLIST em TODAS
  console.log('### 🚫 AI_BLACKLIST — Verificação Local\n')

  const blacklistResults = []
  let totalViolations = 0

  seoData.forEach(page => {
    const texts = [page.h1, page.h2, page.metaDescription, page.title].join(' ')
    const check = checkBlacklist(texts)

    if (check.flagged) {
      blacklistResults.push({
        url: page.url,
        productName: page.productName,
        colorName: page.colorName,
        violations: check.found
      })
      totalViolations += check.found.length
    }
  })

  if (blacklistResults.length === 0) {
    console.log('✅ NENHUMA palavra proibida detectada!\n')
  } else {
    console.log(`❌ ${blacklistResults.length} páginas com violações (${totalViolations} total)\n`)
    blacklistResults.slice(0, 5).forEach(result => {
      console.log(`  ${result.productName} - ${result.colorName}`)
      console.log(`    Palavras: ${result.violations.join(', ')}\n`)
    })
  }

  // 2. Validação Gemini em SAMPLE de 10 páginas
  console.log('### 🎯 GEMINI SEO — Análise de Conteúdo (10 páginas sample)\n')

  const samples = [
    seoData.find(p => p.colorName.includes('Branco 3')),
    seoData.find(p => p.colorName.includes('Azul Marinho')),
    seoData.find(p => p.colorName.includes('Rosa')),
    seoData.find(p => p.colorName.includes('Preto')),
    seoData.find(p => p.colorName.includes('Verde')),
    seoData.find(p => p.category === 'conjuntos'),
    seoData.find(p => p.category === 'dolmas'),
    seoData.find(p => p.category === 'acessorios'),
    seoData[Math.floor(Math.random() * seoData.length)],
    seoData[Math.floor(Math.random() * seoData.length)],
  ].filter(Boolean)

  const geminiResults = []

  for (let i = 0; i < samples.length; i++) {
    const page = samples[i]
    console.log(`[${i + 1}/${samples.length}] ${page.productName} - ${page.colorName}`)

    const prompt = `Você é especialista em SEO e detecção de conteúdo gerado por IA.

Analise este texto de produto:

**Title:** ${page.title}
**H1:** ${page.h1}
**H2:** ${page.h2}
**Meta Description:** ${page.metaDescription}

Avalie 4 aspectos (0-100 cada):

1. **AI Detection Score** (0=humano, 100=robótico)
   - Detecta: estrutura formulaica, palavras pomposas, padrões de IA

2. **Keyword Optimization** (0=ruim, 100=excelente)
   - Produto, cor, categoria presentes naturalmente?
   - Long-tail keywords?

3. **Intent Match** (0=ruim, 100=excelente)
   - Responde busca "jaleco [cor]"?
   - Informação útil para comprador?

4. **Persuasiveness** (0=fraco, 100=forte)
   - CTA claro?
   - Benefícios destacados?

Responda APENAS JSON válido:
{
  "aiScore": número,
  "keywordScore": número,
  "intentScore": número,
  "persuasionScore": número,
  "issues": ["issue1", "issue2"],
  "strengths": ["strength1", "strength2"]
}`

    try {
      const response = await callGemini(prompt)
      const parsed = JSON.parse(response)

      geminiResults.push({
        url: page.url,
        productName: page.productName,
        colorName: page.colorName,
        ...parsed
      })

      console.log(`  AI: ${parsed.aiScore}/100 | Keywords: ${parsed.keywordScore}/100 | Intent: ${parsed.intentScore}/100 | Persuasão: ${parsed.persuasionScore}/100`)
      if (parsed.issues && parsed.issues.length > 0) {
        console.log(`  Issues: ${parsed.issues.slice(0, 2).join(', ')}`)
      }
      console.log('')

      // Rate limit: 2s entre chamadas
      if (i < samples.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (err) {
      console.error(`  ❌ Erro: ${err.message}\n`)
    }
  }

  // Calcular médias
  const avgAI = geminiResults.reduce((sum, r) => sum + r.aiScore, 0) / geminiResults.length
  const avgKeyword = geminiResults.reduce((sum, r) => sum + r.keywordScore, 0) / geminiResults.length
  const avgIntent = geminiResults.reduce((sum, r) => sum + r.intentScore, 0) / geminiResults.length
  const avgPersuasion = geminiResults.reduce((sum, r) => sum + r.persuasionScore, 0) / geminiResults.length

  // Consolidar issues
  const allIssues = geminiResults.flatMap(r => r.issues || [])
  const issueCount = {}
  allIssues.forEach(issue => {
    issueCount[issue] = (issueCount[issue] || 0) + 1
  })
  const topIssues = Object.entries(issueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([issue, count]) => ({ issue, count }))

  console.log('\n## 📊 RESUMO FINAL\n')
  console.log(`AI_BLACKLIST: ${blacklistResults.length === 0 ? '✅ APROVADO' : `❌ ${blacklistResults.length} violações`}`)
  console.log(`AI Detection (Gemini): ${Math.round(avgAI)}/100 ${avgAI > 70 ? '⚠️ Alto' : '✅ OK'}`)
  console.log(`Keywords (Gemini): ${Math.round(avgKeyword)}/100`)
  console.log(`Intent Match (Gemini): ${Math.round(avgIntent)}/100`)
  console.log(`Persuasão (Gemini): ${Math.round(avgPersuasion)}/100\n`)

  console.log('### Top Issues Detectados:\n')
  topIssues.forEach(({ issue, count }) => {
    console.log(`  - ${issue} (${count}x)`)
  })
  console.log('')

  // Salvar relatório
  const report = {
    generatedAt: new Date().toISOString(),
    totalPages: seoData.length,
    blacklistCheck: {
      pagesWithViolations: blacklistResults.length,
      totalViolations,
      violations: blacklistResults
    },
    geminiAnalysis: geminiResults,
    summary: {
      blacklistPassed: blacklistResults.length === 0,
      avgAiScore: Math.round(avgAI),
      avgKeywordScore: Math.round(avgKeyword),
      avgIntentScore: Math.round(avgIntent),
      avgPersuasionScore: Math.round(avgPersuasion),
      topIssues
    }
  }

  await writeFile(
    new URL('../docs/VALIDACAO-GEMINI-DIRETO.json', import.meta.url),
    JSON.stringify(report, null, 2)
  )

  console.log('✅ Relatório: `docs/VALIDACAO-GEMINI-DIRETO.json`\n')

  // Status final
  const passed = blacklistResults.length === 0 && avgAI < 70 && avgKeyword >= 60

  if (passed) {
    console.log('🎉 VALIDAÇÃO APROVADA!\n')
  } else {
    console.log('⚠️ VALIDAÇÃO COM RESSALVAS:\n')
    if (blacklistResults.length > 0) {
      console.log(`  ❌ AI_BLACKLIST: ${blacklistResults.length} violações`)
    }
    if (avgAI >= 70) {
      console.log(`  ⚠️ AI Detection alto: ${Math.round(avgAI)}/100`)
    }
    if (avgKeyword < 60) {
      console.log(`  ⚠️ Keywords baixo: ${Math.round(avgKeyword)}/100`)
    }
    console.log('')
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  console.error(err.stack)
  process.exit(1)
})
