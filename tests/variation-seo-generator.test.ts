import { describe, it, expect } from 'vitest'
import { parseGeminiResponse } from '@/lib/variation-seo-generator'

describe('parseGeminiResponse', () => {
  it('extrai campos do JSON com fences', () => {
    const raw = '```json\n{"h1":"Jaleco Médico Azul","h2":"O preferido","metaDescription":"desc","title":"t","colorPsychology":"calma"}\n```'
    const out = parseGeminiResponse(raw)
    expect(out?.h1).toBe('Jaleco Médico Azul')
    expect(out?.colorPsychology).toBe('calma')
  })
  it('aceita JSON puro sem fences', () => {
    const raw = '{"h1":"X","h2":"Y","metaDescription":"D","title":"T","colorPsychology":"P"}'
    expect(parseGeminiResponse(raw)?.h1).toBe('X')
  })
  it('retorna null se faltar campo obrigatório', () => {
    expect(parseGeminiResponse('{"h1":"x"}')).toBeNull()
  })
  it('retorna null se JSON inválido', () => {
    expect(parseGeminiResponse('not json')).toBeNull()
  })
})
