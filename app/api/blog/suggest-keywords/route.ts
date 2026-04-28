import { NextRequest, NextResponse } from 'next/server'

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  )
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic) return NextResponse.json({ keywords: [] })

    const prompt = `Você é um especialista em SEO para e-commerce de uniformes médicos no Brasil.
Para o tema de blog: "${topic}"
Sugira 8 palavras-chave de cauda longa relevantes, com bom volume de busca no Brasil.
Foque em termos que compradores de jalecos e uniformes médicos pesquisariam.
Retorne SOMENTE um JSON válido: {"keywords": ["kw1", "kw2", ...]}
Sem texto adicional, sem markdown.`

    const raw = await callGemini(prompt)
    const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*/i, '').trim()
    const parsed = JSON.parse(cleaned)
    return NextResponse.json({ keywords: parsed.keywords ?? [] })
  } catch (e) {
    console.error('[suggest-keywords]', e)
    return NextResponse.json({ keywords: [] })
  }
}
