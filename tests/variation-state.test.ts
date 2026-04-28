import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/kv', () => ({
  kv: {
    set: vi.fn(),
    del: vi.fn(),
  },
  lockKey: 'lock:seo-write',
}))

import { kv } from '@/lib/kv'
import { acquireLock, releaseLock } from '@/lib/variation-state'

describe('mutex', () => {
  beforeEach(() => vi.resetAllMocks())

  it('acquireLock retorna true quando KV aceita o SET NX', async () => {
    ;(kv.set as any).mockResolvedValue('OK')
    expect(await acquireLock('owner-1')).toBe(true)
    expect(kv.set).toHaveBeenCalledWith('lock:seo-write', 'owner-1', { nx: true, ex: 30 })
  })

  it('acquireLock retorna false quando lock já existe', async () => {
    ;(kv.set as any).mockResolvedValue(null)
    expect(await acquireLock('owner-2')).toBe(false)
  })

  it('releaseLock deleta a chave', async () => {
    ;(kv.del as any).mockResolvedValue(1)
    await releaseLock('owner-1')
    expect(kv.del).toHaveBeenCalledWith('lock:seo-write')
  })
})

import { decideAction } from '@/lib/variation-state'

describe('decideAction', () => {
  const wcLive = (over = {}) => ({
    stockStatus: 'instock' as const,
    status: 'publish' as const,
    price: '159.90',
    sku: 'SKU',
    updatedAt: '2026-04-27T14:00:00Z',
    ...over,
  })

  it('CRIAR quando snapshot vazio e WC publish+instock+price', () => {
    expect(decideAction(null, wcLive())).toBe('CRIAR')
  })

  it('IGNORAR quando snapshot vazio e price vazio', () => {
    expect(decideAction(null, wcLive({ price: '' }))).toBe('IGNORAR')
  })

  it('SEM_ESTOQUE quando snapshot instock vira outofstock', () => {
    const prev = wcLive()
    expect(decideAction(prev, wcLive({ stockStatus: 'outofstock', updatedAt: '2026-04-27T15:00:00Z' }))).toBe('SEM_ESTOQUE')
  })

  it('SEM_ESTOQUE quando status sai de publish', () => {
    const prev = wcLive()
    expect(decideAction(prev, wcLive({ status: 'draft', updatedAt: '2026-04-27T15:00:00Z' }))).toBe('SEM_ESTOQUE')
  })

  it('VOLTOU_ESTOQUE quando outofstock vira instock', () => {
    const prev = wcLive({ stockStatus: 'outofstock' })
    expect(decideAction(prev, wcLive({ updatedAt: '2026-04-27T15:00:00Z' }))).toBe('VOLTOU_ESTOQUE')
  })

  it('DESATIVAR quando status vira trash', () => {
    expect(decideAction(wcLive(), wcLive({ status: 'trash', updatedAt: '2026-04-27T15:00:00Z' }))).toBe('DESATIVAR')
  })

  it('IGNORAR quando updatedAt idêntico', () => {
    const same = wcLive()
    expect(decideAction(same, same)).toBe('IGNORAR')
  })
})
