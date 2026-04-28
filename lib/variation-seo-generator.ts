import type { SeoEntry } from './kv'
import { upsertSeo, getSeoByVariationId } from './variation-state'
import { enqueueRetry } from './seo-retry-queue'

const REQUIRED = ['h1', 'h2', 'metaDescription', 'title', 'colorPsychology'] as const
type GeminiSeo = Record<(typeof REQUIRED)[number], string>

export function parseGeminiResponse(raw: string): GeminiSeo | null {
  let body = raw.trim()
  const fence = body.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) body = fence[1].trim()
  try {
    const parsed = JSON.parse(body)
    for (const k of REQUIRED) {
      if (typeof parsed[k] !== 'string' || !parsed[k].trim()) return null
    }
    return parsed as GeminiSeo
  } catch {
    return null
  }
}

const PROMPT = (productName: string, colorName: string, category: string) => `
Você é especialista em SEO para e-commerce de uniformes profissionais (jalecos médicos no Brasil).
Gere SEO para a página de variação: produto "${productName}", cor "${colorName}", categoria "${category}".

Responda APENAS um JSON com os campos:
- "h1": título da página (50-65 chars), com produto + cor + benefício
- "h2": subtítulo (60-90 chars), foco em quem usa e por quê
- "title": meta title (55-60 chars), com "| Jaleca" no fim
- "metaDescription": meta description (140-160 chars), CTA + diferencial
- "colorPsychology": 1 frase (80-120 chars) sobre o que essa cor transmite no contexto profissional

Não use clichês. Português brasileiro. Sem emoji.
`

export async function generateSeoForVariation(
  productName: string,
  colorName: string,
  category: string,
): Promise<GeminiSeo | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY ausente')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: PROMPT(productName, colorName, category) }] }] }),
    },
  )
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const json = await res.json()
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return parseGeminiResponse(text)
}

export function applyGeminiToEntry(entry: SeoEntry, gen: GeminiSeo): SeoEntry {
  return {
    ...entry,
    h1: gen.h1,
    h2: gen.h2,
    title: gen.title,
    metaDescription: gen.metaDescription,
    colorPsychology: gen.colorPsychology,
    seoQuality: 'gemini',
    lastGeminiAttempt: new Date().toISOString(),
    geminiAttempts: (entry.geminiAttempts ?? 0) + 1,
  }
}

export async function tryGeminiOrEnqueue(variationId: number): Promise<void> {
  const seo = await getSeoByVariationId(variationId)
  if (!seo) return
  if (seo.seoQuality === 'premium') return

  try {
    const gen = await generateSeoForVariation(seo.productName, seo.colorName, seo.category)
    if (!gen) throw new Error('Gemini retornou JSON inválido')
    await upsertSeo(applyGeminiToEntry(seo, gen))
  } catch (err) {
    const attempts = (seo.geminiAttempts ?? 0) + 1
    const backoffHours = Math.min(24, 2 ** attempts)
    await upsertSeo({
      ...seo,
      lastGeminiAttempt: new Date().toISOString(),
      geminiAttempts: attempts,
    })
    if (attempts < 3) {
      await enqueueRetry({
        variationId,
        attempts,
        nextRetryAt: new Date(Date.now() + backoffHours * 3600 * 1000).toISOString(),
        lastError: String(err).slice(0, 200),
      })
    }
  }
}
