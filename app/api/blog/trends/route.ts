import { NextResponse } from 'next/server'

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

export async function POST() {
  try {
    const today = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const prompt = `Você é um especialista em marketing de uniformes médicos e moda clínica no Brasil.
Liste 8 temas de blog relevantes para ${today} para uma loja de jalecos chamada Jaleca.
Temas devem envolver: saúde, moda clínica, bem-estar no trabalho, tendências de uniformes, profissões da saúde.
Retorne SOMENTE um JSON válido no formato: {"trends": ["tema 1", "tema 2", ...]}
Sem texto adicional, sem markdown.`

    const raw = await callGemini(prompt)
    const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*/i, '').trim()
    const parsed = JSON.parse(cleaned)
    return NextResponse.json({ trends: parsed.trends ?? [] })
  } catch (e) {
    console.error('[trends]', e)
    return NextResponse.json({ trends: [] })
  }
}
