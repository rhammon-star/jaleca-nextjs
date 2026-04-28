// lib/variation-state.ts
import { kv, lockKey } from './kv'

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
