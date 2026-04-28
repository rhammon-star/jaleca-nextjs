function stripMarkdownCodeBlock(text: string): string {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

async function callGemini(prompt: string, maxTokens = 2000): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = (err as { error?: { message?: string } }).error?.message ?? `Gemini API error: ${res.status}`
    throw new Error(message)
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected Gemini response')
  return text
}

export type GeneratedContent = {
  title: string
  content: string
  excerpt: string
  metaDescription: string
  suggestedSlug: string
  suggestedKeywords: string[]
}

const WRITING_STYLES = [
  {
    name: 'especialista-pratico',
    persona: 'um especialista em uniformes profissionais de saúde que escreve de forma direta e objetiva, focando em dicas práticas e benefícios concretos. Começa com o problema do leitor, vai direto ao ponto, usa listas quando ajuda.',
    tone: 'Direto, prático, sem enrolação. Parágrafos curtos. Usa "você" para falar com o leitor.',
  },
  {
    name: 'colega-de-profissao',
    persona: 'uma profissional de saúde que também escreve sobre moda e estilo clínico. Tom de conversa entre colegas da área, informal mas respeitoso.',
    tone: 'Caloroso, empático, usa expressões do dia a dia da área da saúde. Começa com uma situação que o leitor reconhece da rotina clínica.',
  },
  {
    name: 'narrativo-envolvente',
    persona: 'um redator que conta histórias. Começa com uma cena ou situação real que o leitor vai se identificar, depois traz as informações de forma fluida.',
    tone: 'Narrativo, descritivo, evocativo. O leitor se vê na história. Alterna entre storytelling e informação útil.',
  },
  {
    name: 'analitico-confiante',
    persona: 'um consultor de imagem profissional para a área da saúde que analisa tendências e dá recomendações embasadas.',
    tone: 'Confiante, analítico, usa dados e argumentos. Tom de autoridade mas acessível. Não usa jargão excessivo.',
  },
]

export async function generateContent(
  topic: string,
  keywords?: string[],
  linkedProduct?: string,
): Promise<GeneratedContent> {
  const keywordsStr = keywords?.length ? `Palavras-chave a incluir: ${keywords.join(', ')}.` : ''
  const style = WRITING_STYLES[Math.floor(Math.random() * WRITING_STYLES.length)]

  const validLinks = `
URLs VÁLIDAS que você pode usar como links internos (use APENAS estas, nunca invente outras):
Categorias:
- /categoria/jalecos
- /categoria/jalecos-femininos
- /categoria/jalecos-masculinos
- /categoria/jalecos-personalizados
- /categoria/scrub
- /categoria/conjuntos
- /categoria/dolmas
- /categoria/calcados
- /categoria/acessorios
Produtos:
- /produto/jaleco-slim-elastex-feminino-varias-cores-jaleca
- /produto/jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca
- /produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca
- /produto/jaleco-universitario-unissex-jaleca
- /produto/jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca
- /produto/jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca
- /produto/conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca
Páginas:
- /produtos
- /medida
- /faq
`

  const productLink = linkedProduct
    ? `- OBRIGATÓRIO: inclua um link para https://jaleca.com.br/produto/${linkedProduct} com texto natural relacionado ao produto`
    : ''

  const prompt = `Você é ${style.persona}. Crie um artigo de blog completo e otimizado para SEO sobre: "${topic}".

Tom de escrita: ${style.tone}

${keywordsStr}

Requisitos:
- Artigo entre 500 e 700 palavras (IMPORTANTE: seja conciso)
- Máximo 4 seções com H2, sem H3
- Foco em profissionais de saúde (médicos, enfermeiros, dentistas, etc.)
- SEMPRE inclua um link para https://jaleca.com.br com texto natural (ex: "confira na Jaleca", "veja na Jaleca")
${productLink}
- No máximo 3 links internos no total — use APENAS as URLs da lista abaixo ou as URLs absolutas acima
- PROIBIDO criar links para páginas que não existem na lista
- Integre as palavras-chave naturalmente no texto
- Conteúdo em português brasileiro
- NUNCA use frases genéricas de IA como "No mundo atual", "É fundamental destacar", "Neste artigo vamos explorar"

${validLinks}

Retorne APENAS um JSON válido (sem markdown, sem texto antes ou depois) no seguinte formato:
{
  "title": "Título do artigo (máx 60 chars)",
  "content": "Conteúdo HTML completo com tags h2, p, ul, li, strong",
  "excerpt": "Resumo de 1-2 frases (máx 160 chars)",
  "metaDescription": "Meta description SEO otimizada (máx 160 chars)",
  "suggestedSlug": "slug-do-artigo-sem-acento",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`

  const raw = await callGemini(prompt, 4000)
  return JSON.parse(stripMarkdownCodeBlock(raw)) as GeneratedContent
}

// ── Blacklist de palavras/frases robóticas de IA ──────────────────────────────

export const AI_BLACKLIST = [
  // Conectivos robóticos
  'Primeiramente', 'Ademais', 'Outrossim', 'Não obstante', 'Assim sendo',
  'Destarte', 'Por conseguinte', 'Em síntese', 'Em suma', 'No que diz respeito',
  'No tocante a', 'No que tange', 'No que se refere', 'Concernente a',
  'No que concerne', 'Por forma que', 'De sorte que', 'De tal maneira que',
  'A priori', 'A posteriori',
  // Verbos pomposos
  'Potencializar', 'Maximizar', 'Otimizar', 'Ressignificar', 'Externalizar',
  'Internalizar', 'Consolidar', 'Estruturar', 'Perenizar', 'Verticalizar',
  'Tangenciar', 'Convergir', 'Propender',
  // Adjetivos vagos
  'Inédito', 'Transformador', 'Abrangente', 'Consistente', 'Profícuo',
  // Locuções clássicas de IA
  'É importante ressaltar que', 'É fundamental destacar que',
  'É válido salientar que', 'Deixe-me explicar', 'Como podemos observar',
  'Podemos notar que', 'É possível notar', 'Fica evidente', 'Nota-se que',
  'Ressalta-se que', 'Conclui-se que', 'É preciso destacar',
  'Neste sentido', 'Neste contexto', 'Nessa perspectiva', 'Sob tal óptica',
  'Com base nisso', 'À luz disso', 'Face ao exposto', 'Posto isso', 'Isto posto',
  'Cumpre destacar', 'Cabe ressaltar', 'Faz-se necessário', 'Torna-se imperativo',
  'É mister', 'Não resta dúvida que', 'Inquestionavelmente', 'Indubitavelmente',
  'Sem sombra de dúvida',
  // Frases iniciais robóticas
  'Bem-vindo a este artigo', 'Neste artigo vamos falar sobre',
  'Você sabia que', 'Você já se perguntou', 'Aqui está o que você precisa saber',
  'Sem mais delongas', 'Vamos direto ao ponto', 'Segundo especialistas',
  'No mundo atual', 'Nos dias de hoje', 'No cenário atual',
]

// Verifica se o texto contém palavras da blacklist
export function isAIContent(text: string): { flagged: boolean; found: string[] } {
  const lower = text.toLowerCase()
  const found = AI_BLACKLIST.filter(w => lower.includes(w.toLowerCase()))
  return { flagged: found.length > 0, found }
}

const BLACKLIST_STR = AI_BLACKLIST.slice(0, 30).join(', ')

export async function humanizeContent(content: string): Promise<string> {
  const prompt = `Você é um editor de conteúdo brasileiro especialista em remover linguagem robótica de textos gerados por IA. Reescreva o seguinte conteúdo HTML para soar como um brasileiro real escrevendo.

${content}

REGRAS OBRIGATÓRIAS:
- Mantenha TODA a estrutura HTML intacta (h2, p, ul, li, strong, a)
- NÃO altere links, slugs ou informações factuais
- PROIBIDO usar qualquer uma dessas palavras/frases: ${BLACKLIST_STR}
- Use linguagem direta, frases curtas, tom de conversa
- Pode usar: "pra", "vc", "né", "tipo" — mas sem exagero
- Parágrafos curtos (máx 3 linhas)
- NUNCA comece parágrafo com "Neste artigo", "É importante", "Vale ressaltar", "No mundo atual"

Retorne APENAS o HTML reescrito, sem explicações, sem markdown.`

  const raw = await callGemini(prompt, 4000)
  return stripMarkdownCodeBlock(raw)
}

export async function rewriteHumanized(content: string): Promise<string> {
  const prompt = `Você é um redator brasileiro que reescreve textos com linguagem robótica de IA para soar natural e humano. Reescreva o HTML abaixo.

${content}

REGRAS:
- Mantenha estrutura HTML (h2, p, ul, li, strong, a) — não altere tags
- NÃO mude links internos
- PROIBIDO: ${BLACKLIST_STR}
- Tom: conversa direta entre profissionais de saúde
- Frases curtas. Parágrafos de no máximo 2-3 linhas
- Sem introduções genéricas como "Neste artigo...", "É fundamental...", "No cenário atual..."
- Comece o primeiro parágrafo direto no assunto, sem rodeios
- Use vocabulário simples e cotidiano da área da saúde

Retorne APENAS o HTML reescrito, sem markdown, sem explicações.`

  const raw = await callGemini(prompt, 4000)
  return stripMarkdownCodeBlock(raw)
}

export type SEOAnalysis = {
  score: number
  keywordDensity: Array<{ keyword: string; count: number; density: string }>
  readability: { score: number; level: string }
  headingsAnalysis: { h1: number; h2: number; h3: number; issues: string[] }
  metaDescriptionAnalysis: { length: number; hasKeyword: boolean; issues: string[] }
  titleAnalysis: { length: number; hasKeyword: boolean; issues: string[] }
  internalLinksCount: number
  scannability: { bulletPoints: boolean; shortParagraphs: boolean; boldText: boolean }
  suggestions: string[]
}

export async function analyzeSEO(data: {
  title: string
  content: string
  metaDescription: string
  slug: string
}): Promise<SEOAnalysis> {
  const prompt = `Analise o SEO do seguinte conteúdo e retorne APENAS um JSON válido com a análise completa.

Título: ${data.title}
Meta Description: ${data.metaDescription}
Slug: ${data.slug}
Conteúdo HTML:
${data.content.slice(0, 3000)}

Retorne APENAS JSON válido (sem markdown) no formato:
{
  "score": 75,
  "keywordDensity": [{"keyword": "jaleco", "count": 8, "density": "1.2%"}],
  "readability": {"score": 65, "level": "Intermediário"},
  "headingsAnalysis": {"h1": 0, "h2": 3, "h3": 2, "issues": []},
  "metaDescriptionAnalysis": {"length": 155, "hasKeyword": true, "issues": []},
  "titleAnalysis": {"length": 58, "hasKeyword": true, "issues": []},
  "internalLinksCount": 2,
  "scannability": {"bulletPoints": true, "shortParagraphs": true, "boldText": true},
  "suggestions": ["Adicione mais palavras-chave no primeiro parágrafo"]
}`

  try {
    const raw = await callGemini(prompt, 1000)
    return JSON.parse(stripMarkdownCodeBlock(raw)) as SEOAnalysis
  } catch {
    return {
      score: 50,
      keywordDensity: [],
      readability: { score: 60, level: 'Intermediário' },
      headingsAnalysis: { h1: 0, h2: 2, h3: 1, issues: [] },
      metaDescriptionAnalysis: { length: data.metaDescription.length, hasKeyword: true, issues: [] },
      titleAnalysis: { length: data.title.length, hasKeyword: true, issues: [] },
      internalLinksCount: 0,
      scannability: { bulletPoints: false, shortParagraphs: true, boldText: false },
      suggestions: ['Análise SEO indisponível no momento'],
    }
  }
}

export async function improveSEOContent(
  content: string,
  suggestions: string[],
  keywords: string[]
): Promise<string> {
  if (!suggestions.length) return content
  const prompt = `Você é um especialista em SEO. Reescreva o conteúdo HTML abaixo aplicando TODAS as melhorias listadas, mantendo a estrutura HTML intacta.

MELHORIAS A APLICAR:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

PALAVRAS-CHAVE ALVO: ${keywords.join(', ')}

CONTEÚDO ATUAL:
${content}

REGRAS:
- Mantenha todas as tags HTML (h2, h3, p, ul, li, strong, a)
- Não adicione texto antes ou depois do HTML
- Integre as palavras-chave de forma natural
- Melhore a legibilidade conforme sugerido
- NUNCA adicione ou altere links — mantenha apenas os links já existentes no conteúdo
- Retorne APENAS o HTML melhorado`

  const raw = await callGemini(prompt, 4000)
  return stripMarkdownCodeBlock(raw)
}

export async function generateLookDescription(
  title: string,
  products: string[]
): Promise<string> {
  const prompt = `Crie uma descrição curta e elegante (máx 120 caracteres) para um look editorial de moda profissional chamado "${title}".
Produtos incluídos: ${products.filter(Boolean).join(', ') || 'jalecos e uniformes profissionais'}.
A descrição deve ser inspiradora, profissional e focada em estilo de uniformes médicos/saúde.
Retorne APENAS a descrição, sem aspas, sem explicações.`

  const result = await callGemini(prompt, 200)
  return result.trim()
}

export async function generateImageQuery(topic: string): Promise<string> {
  const prompt = `Crie uma query de busca em inglês para a API do Unsplash para encontrar uma imagem relevante para um artigo de blog sobre: "${topic}".

A imagem deve ser profissional, relacionada à área da saúde ou uniformes médicos.

Retorne APENAS a query de busca, sem aspas, sem explicações. Máximo 5 palavras.`

  const result = await callGemini(prompt, 200)
  return result.trim()
}
