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
