// lib/variation-state.ts
import { kv, lockKey } from './kv'
import type { VariationSnapshot } from './kv'

export async function acquireLock(owner: string, ttlSeconds = 30): Promise<boolean> {
  const result = await kv.set(lockKey, owner, { nx: true, ex: ttlSeconds })
  return result === 'OK'
}

export async function releaseLock(owner: string): Promise<void> {
  await kv.del(lockKey)
}

export async function withLock<T>(
  owner: string,
  fn: () => Promise<T>,
  maxWaitMs = 5000,
): Promise<T> {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    if (await acquireLock(owner)) {
      try {
        return await fn()
      } finally {
        await releaseLock(owner)
      }
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('Could not acquire lock within timeout')
}

export type Action = 'CRIAR' | 'SEM_ESTOQUE' | 'VOLTOU_ESTOQUE' | 'DESATIVAR' | 'IGNORAR'

const ACTIVE = (s: VariationSnapshot) =>
  s.status === 'publish' && s.stockStatus === 'instock' && Number(s.price) > 0

export function decideAction(
  prev: VariationSnapshot | null,
  next: VariationSnapshot,
): Action {
  if (prev && prev.updatedAt === next.updatedAt) return 'IGNORAR'

  if (next.status === 'trash') return 'DESATIVAR'

  const wasActive = prev ? ACTIVE(prev) : false
  const isActive = ACTIVE(next)

  if (!prev && isActive) return 'CRIAR'
  if (wasActive && !isActive) return 'SEM_ESTOQUE'
  if (!wasActive && isActive) return 'VOLTOU_ESTOQUE'
  return 'IGNORAR'
}
