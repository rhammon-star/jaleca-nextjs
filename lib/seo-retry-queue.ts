import { kv, retryQueueKey } from './kv'

export type RetryItem = {
  variationId: number
  attempts: number
  nextRetryAt: string
  lastError?: string
}

export async function enqueueRetry(item: RetryItem): Promise<void> {
  await kv.lpush(retryQueueKey, JSON.stringify(item))
}

export async function drainRetries(maxAttempts = 3): Promise<RetryItem[]> {
  const all: RetryItem[] = []
  while (true) {
    const raw = await kv.rpop<string>(retryQueueKey)
    if (!raw) break
    try {
      const item = JSON.parse(raw) as RetryItem
      if (item.attempts >= maxAttempts) continue
      if (new Date(item.nextRetryAt) > new Date()) {
        await kv.lpush(retryQueueKey, raw)
        break
      }
      all.push(item)
    } catch {
      // item corrompido — descarta
    }
  }
  return all
}
