import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/kv', () => ({
  kv: { get: vi.fn() },
  seoKey: (s: string) => `seo:${s}`,
}))

import { kv } from '@/lib/kv'
import { getVariationSEO } from '@/lib/variation-seo'

describe('getVariationSEO', () => {
  it('retorna entry do KV se existir', async () => {
    ;(kv.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ url: '/x', seoQuality: 'gemini' })
    const seo = await getVariationSEO('x')
    expect(seo?.seoQuality).toBe('gemini')
  })
  it('retorna null quando KV vazio e JSON não tem o slug', async () => {
    ;(kv.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)
    const seo = await getVariationSEO('slug-inexistente-xyz-404')
    expect(seo).toBeNull()
  })
})
