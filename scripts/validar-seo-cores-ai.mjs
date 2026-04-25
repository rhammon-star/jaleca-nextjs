#!/usr/bin/env node
/**
 * VALIDAÇÃO AI: GPT-4.1 + Gemini SEO — 164 Páginas de Produtos por Cor
 *
 * Valida:
 * - SEO técnico (title, meta, canonical, schema)
 * - Qualidade do conteúdo (AI detection, thin content)
 * - Keywords e intent match
 * - User experience
 *
 * Usa:
 * - GPT-4.1 via ~/.claude/ask-gpt.sh (análise técnica)
 * - Gemini SEO via ~/.claude/ask-seo.sh (conteúdo + keywords)
 */

import { readFile, writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// AI_BLACKLIST (do lib/ai-content.ts)
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

// Executa GPT-4.1
async function askGPT(prompt) {
  const { stdout } = await execAsync(`bash ~/.claude/ask-gpt.sh "${prompt.replace(/"/g, '\\"')}"`)
  return stdout.trim()
}

// Executa Gemini SEO
async function askGeminiSEO(prompt) {
  const { stdout } = await execAsync(`bash ~/.claude/ask-seo.sh "${prompt.replace(/"/g, '\\"')}"`)
  const cleaned = stdout.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return cleaned
}

// Executa GPT-4.1
async function askGPT4(prompt) {
  const { stdout } = await execAsync(`bash ~/.claude/ask-gpt.sh "${prompt.replace(/"/g, '\\"')}"`)
  const cleaned = stdout.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  return cleaned
}

async function main() {
  console.log('🤖 VALIDAÇÃO AI — Produtos por Cor (164 páginas)\n')
  console.log('Usando: GPT-4.1 (técnico) + Gemini SEO (conteúdo)\n')

  // Carregar dados SEO gerados
  const seoData = JSON.parse(
    await readFile(
      new URL('../docs/SEO-PRODUTOS-CORES.json', import.meta.url),
      'utf-8'
    )
  )

  console.log(`Total de páginas: ${seoData.length}\n`)

  // Validação AI_BLACKLIST em TODAS as páginas
  console.log('### 🚫 AI_BLACKLIST — Verificação de Palavras Proibidas\n')

  const blacklistResults = []
  let totalViolations = 0

  seoData.forEach(page => {
    const texts = [
      page.h1,
      page.h2,
      page.metaDescription,
      page.title
    ].join(' ')

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
    console.log('✅ NENHUMA palavra da blacklist detectada!\n')
  } else {
    console.log(`❌ ${blacklistResults.length} páginas com violações (${totalViolations} palavras total)\n`)
    blacklistResults.slice(0, 10).forEach(result => {
      console.log(`  ${result.productName} - ${result.colorName}`)
      console.log(`    URL: ${result.url}`)
      console.log(`    Palavras: ${result.violations.join(', ')}`)
      console.log('')
    })
    if (blacklistResults.length > 10) {
      console.log(`  ... e mais ${blacklistResults.length - 10} páginas\n`)
    }
  }

  console.log('📊 INICIANDO VALIDAÇÃO AI EM BATCH\n')

  // Agrupar em batches de 10 para análise
  const batchSize = 10
  const batches = []
  for (let i = 0; i < seoData.length; i += batchSize) {
    batches.push(seoData.slice(i, i + batchSize))
  }

  const results = {
    totalPages: seoData.length,
    batchesAnalyzed: batches.length,
    gptAnalysis: [],
    geminiAnalysis: [],
    issues: [],
    recommendations: [],
    generatedAt: new Date().toISOString()
  }

  // Análise GPT-4.1 — Técnico
  console.log('### 🔍 GPT-4.1 — Análise Técnica SEO\n')

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`Batch ${i + 1}/${batches.length} (${batch.length} páginas)...`)

    const batchSummary = batch.map(page => ({
      url: page.url,
      title: page.title,
      metaLength: page.metaDescription.length,
      h1: page.h1,
      category: page.category
    }))

    const gptPrompt = `Você é um especialista em SEO técnico. Analise este batch de ${batch.length} páginas de produtos por cor:

${JSON.stringify(batchSummary, null, 2)}

Verifique:
1. Title tags: comprimento ideal (50-60 chars), keywords, duplicação
2. Meta descriptions: comprimento (120-160 chars), CTA, keywords
3. H1: estrutura, keywords, unicidade
4. Thin content: risco de penalização por conteúdo duplicado

Responda em JSON:
{
  "issues": ["issue 1", "issue 2"],
  "score": 0-100,
  "recommendations": ["rec 1", "rec 2"]
}`

    try {
      const gptResponse = await askGPT4(gptPrompt)
      const parsed = JSON.parse(gptResponse)

      results.gptAnalysis.push({
        batchIndex: i + 1,
        pages: batch.length,
        ...parsed
      })

      if (parsed.issues && parsed.issues.length > 0) {
        results.issues.push(...parsed.issues.map(issue => `[Batch ${i + 1}] ${issue}`))
      }

      if (parsed.recommendations && parsed.recommendations.length > 0) {
        results.recommendations.push(...parsed.recommendations)
      }

      console.log(`  ✅ Score: ${parsed.score}/100`)
      if (parsed.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${parsed.issues.length}`)
      }
    } catch (err) {
      console.error(`  ❌ Erro GPT batch ${i + 1}:`, err.message)
    }

    // Rate limit: 1 segundo entre batches
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.log('\n### 🎯 Gemini SEO — Análise de Conteúdo\n')

  // Análise Gemini SEO — Conteúdo (sample de 5 páginas)
  const samplePages = [
    seoData.find(p => p.colorName.includes('Branco')),
    seoData.find(p => p.colorName.includes('Azul Marinho')),
    seoData.find(p => p.colorName.includes('Rosa')),
    seoData.find(p => p.category === 'conjuntos'),
    seoData.find(p => p.category === 'dolmas'),
  ].filter(Boolean)

  for (let i = 0; i < samplePages.length; i++) {
    const page = samplePages[i]
    console.log(`Analisando: ${page.productName} - ${page.colorName}`)

    const geminiPrompt = `Você é um especialista em SEO de conteúdo. Analise esta página de produto:

Produto: ${page.productName} ${page.colorName}
URL: ${page.url}
Title: ${page.title}
Meta: ${page.metaDescription}
H1: ${page.h1}
H2: ${page.h2}
Categoria: ${page.category}

Verifique:
1. AI detection: o texto soa como escrito por IA? (palavras robóticas, estrutura formulaica)
2. Intent match: a meta description responde a intenção de busca "jaleco [cor]"?
3. Keywords: cor + categoria + marca estão presentes naturalmente?
4. User experience: a descrição é útil e persuasiva?

Responda em JSON:
{
  "aiDetectionScore": 0-100 (0=humano, 100=IA),
  "intentMatch": true/false,
  "keywordCoverage": 0-100,
  "uxScore": 0-100,
  "recommendations": ["rec 1", "rec 2"]
}`

    try {
      const geminiResponse = await askGeminiSEO(geminiPrompt)
      const parsed = JSON.parse(geminiResponse)

      results.geminiAnalysis.push({
        url: page.url,
        productName: page.productName,
        colorName: page.colorName,
        ...parsed
      })

      console.log(`  AI Detection: ${parsed.aiDetectionScore}/100`)
      console.log(`  Intent Match: ${parsed.intentMatch ? '✅' : '❌'}`)
      console.log(`  Keywords: ${parsed.keywordCoverage}/100`)
      console.log(`  UX: ${parsed.uxScore}/100`)

      if (parsed.recommendations && parsed.recommendations.length > 0) {
        results.recommendations.push(...parsed.recommendations)
      }
    } catch (err) {
      console.error(`  ❌ Erro Gemini: ${err.message}`)
    }

    // Rate limit: 2 segundos entre chamadas
    if (i < samplePages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Calcular scores finais
  const avgGptScore = results.gptAnalysis.reduce((sum, b) => sum + b.score, 0) / results.gptAnalysis.length
  const avgAiDetection = results.geminiAnalysis.reduce((sum, p) => sum + p.aiDetectionScore, 0) / results.geminiAnalysis.length
  const avgKeywords = results.geminiAnalysis.reduce((sum, p) => sum + p.keywordCoverage, 0) / results.geminiAnalysis.length
  const avgUx = results.geminiAnalysis.reduce((sum, p) => sum + p.uxScore, 0) / results.geminiAnalysis.length

  results.blacklistCheck = {
    totalPagesChecked: seoData.length,
    pagesWithViolations: blacklistResults.length,
    totalViolations,
    violations: blacklistResults
  }

  results.summary = {
    avgTechnicalScore: Math.round(avgGptScore),
    avgAiDetection: Math.round(avgAiDetection),
    avgKeywordCoverage: Math.round(avgKeywords),
    avgUxScore: Math.round(avgUx),
    totalIssues: results.issues.length,
    totalRecommendations: [...new Set(results.recommendations)].length,
    blacklistViolations: blacklistResults.length,
    blacklistPassed: blacklistResults.length === 0
  }

  console.log('\n## 📊 RESUMO FINAL\n')
  console.log(`AI_BLACKLIST: ${results.summary.blacklistPassed ? '✅ APROVADO' : `❌ ${results.summary.blacklistViolations} violações`}`)
  console.log(`SEO Técnico (GPT-4.1): ${results.summary.avgTechnicalScore}/100`)
  console.log(`AI Detection (Gemini): ${results.summary.avgAiDetection}/100 ${results.summary.avgAiDetection > 70 ? '⚠️  Alto' : '✅ OK'}`)
  console.log(`Keywords (Gemini): ${results.summary.avgKeywordCoverage}/100`)
  console.log(`UX (Gemini): ${results.summary.avgUxScore}/100`)
  console.log(`Issues encontrados: ${results.summary.totalIssues}`)
  console.log(`Recomendações únicas: ${results.summary.totalRecommendations}\n`)

  // Salvar relatório
  await writeFile(
    new URL('../docs/VALIDACAO-AI-SEO-CORES.json', import.meta.url),
    JSON.stringify(results, null, 2)
  )

  console.log('✅ Relatório salvo: `docs/VALIDACAO-AI-SEO-CORES.json`\n')

  // Markdown resumido
  const markdown = [
    '# Validação AI — SEO Produtos por Cor',
    '',
    `**Data:** ${new Date().toLocaleString('pt-BR')}`,
    `**Total de páginas:** ${results.totalPages}`,
    '',
    '## Scores',
    '',
    `- **SEO Técnico (GPT-4.1):** ${results.summary.avgTechnicalScore}/100`,
    `- **AI Detection (Gemini):** ${results.summary.avgAiDetection}/100 ${results.summary.avgAiDetection > 70 ? '⚠️ **ALTO - REQUER AÇÃO**' : '✅'}`,
    `- **Keyword Coverage (Gemini):** ${results.summary.avgKeywordCoverage}/100`,
    `- **UX Score (Gemini):** ${results.summary.avgUxScore}/100`,
    '',
    '## Issues Críticos',
    '',
    ...(results.issues.length > 0
      ? results.issues.map(issue => `- ⚠️ ${issue}`)
      : ['✅ Nenhum issue crítico encontrado']),
    '',
    '## Top Recomendações',
    '',
    ...[...new Set(results.recommendations)].slice(0, 10).map(rec => `- 💡 ${rec}`),
    '',
    '## Análise Detalhada',
    '',
    'Ver `docs/VALIDACAO-AI-SEO-CORES.json` para dados completos.',
  ]

  await writeFile(
    new URL('../docs/VALIDACAO-AI-SEO-CORES.md', import.meta.url),
    markdown.join('\n')
  )

  console.log('✅ Relatório markdown: `docs/VALIDACAO-AI-SEO-CORES.md`\n')

  // Status final
  const blacklistOk = results.summary.blacklistPassed
  const technicalOk = results.summary.avgTechnicalScore >= 80
  const aiDetectionOk = results.summary.avgAiDetection < 70

  if (blacklistOk && technicalOk && aiDetectionOk) {
    console.log('🎉 VALIDAÇÃO APROVADA — Pronto para produção!\n')
  } else {
    console.log('⚠️  VALIDAÇÃO COM RESSALVAS:\n')
    if (!blacklistOk) console.log(`  ❌ AI_BLACKLIST: ${results.summary.blacklistViolations} violações detectadas`)
    if (!technicalOk) console.log(`  ❌ SEO Técnico: ${results.summary.avgTechnicalScore}/100 (mínimo: 80)`)
    if (!aiDetectionOk) console.log(`  ❌ AI Detection: ${results.summary.avgAiDetection}/100 (máximo: 70)`)
    console.log('\nRevisar antes do deploy!\n')
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
