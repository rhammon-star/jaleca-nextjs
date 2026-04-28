import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { FullVariation } from '@/lib/wc-variation'
import type { SeoEntry, VariationSnapshot } from '@/lib/kv'

const store = new Map<string, unknown>()

vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(async (k: string) => store.get(k) ?? null),
    set: vi.fn(async (k: string, v: unknown, opts?: { nx?: boolean }) => {
      if (opts?.nx && store.has(k)) return null
      store.set(k, v)
      return 'OK'
    }),
    del: vi.fn(async (k: string) => {
      store.delete(k)
      return 1
    }),
    scan: vi.fn(async () => [0, [] as string[]]),
  },
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const fetchVariationMock = vi.fn<[number], Promise<FullVariation | null>>()
vi.mock('@/lib/wc-variation', () => ({
  fetchVariation: (id: number) => fetchVariationMock(id),
}))

process.env.JALECA_PLUGIN_SECRET = 'test-secret'

const { POST } = await import('@/app/api/wc/variation-sync/route')

function makeReq(body: unknown, secret = 'test-secret') {
  return new Request('http://localhost/api/wc/variation-sync', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-jaleca-secret': secret },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0]
}

let tick = 0
function liveOf(stock: 'instock' | 'outofstock', status: 'publish' | 'draft' = 'publish'): FullVariation {
  tick++
  const snap: VariationSnapshot = {
    stockStatus: stock,
    status,
    price: '99',
    sku: 'SKU-1',
    updatedAt: `2026-04-27T00:00:${String(tick).padStart(2, '0')}.000Z`,
  }
  return {
    snapshot: snap,
    parentId: 1234,
    attributes: { Cor: 'Azul' },
    raw: {},
  }
}

describe('POST /api/wc/variation-sync', () => {
  beforeEach(() => {
    store.clear()
    fetchVariationMock.mockReset()
  })

  it('returns 401 without secret', async () => {
    const res = await POST(makeReq({ variationId: 1 }, 'wrong'))
    expect(res.status).toBe(401)
  })

  it('CRIAR: cria SEO template para variação nova com estoque', async () => {
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    const res = await POST(makeReq({ variationId: 100 }))
    const json = await res.json()
    expect(json.action).toBe('CRIAR')
    const seo = store.get('seo:produto-1234-azul') as SeoEntry
    expect(seo).toBeTruthy()
    expect(seo.noindex).toBe(false)
    expect(seo.stockStatus).toBe('instock')
  })

  it('SEM_ESTOQUE: marca noindex quando estoque vai a zero', async () => {
    // primeiro estado: instock
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    await POST(makeReq({ variationId: 200 }))
    // agora outofstock
    fetchVariationMock.mockResolvedValueOnce(liveOf('outofstock'))
    const res = await POST(makeReq({ variationId: 200 }))
    const json = await res.json()
    expect(json.action).toBe('SEM_ESTOQUE')
    const seo = store.get('seo:produto-1234-azul') as SeoEntry
    expect(seo.noindex).toBe(true)
    expect(seo.stockStatus).toBe('outofstock')
  })

  it('VOLTOU_ESTOQUE: tira noindex quando voltou', async () => {
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    await POST(makeReq({ variationId: 300 }))
    fetchVariationMock.mockResolvedValueOnce(liveOf('outofstock'))
    await POST(makeReq({ variationId: 300 }))
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    const res = await POST(makeReq({ variationId: 300 }))
    const json = await res.json()
    expect(json.action).toBe('VOLTOU_ESTOQUE')
    const seo = store.get('seo:produto-1234-azul') as SeoEntry
    expect(seo.noindex).toBe(false)
  })

  it('IGNORAR: nenhuma mudança relevante', async () => {
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    await POST(makeReq({ variationId: 400 }))
    fetchVariationMock.mockResolvedValueOnce(liveOf('instock'))
    const res = await POST(makeReq({ variationId: 400 }))
    const json = await res.json()
    expect(json.action).toBe('IGNORAR')
  })
})
