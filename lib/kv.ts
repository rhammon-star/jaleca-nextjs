// lib/kv.ts
import { kv } from '@vercel/kv'

export { kv }

export type SeoQuality = 'template' | 'gemini' | 'premium'

export type SeoEntry = {
  url: string
  productName: string
  productSlug: string
  colorName: string
  colorSlug: string
  variationId: number
  category: string
  h1?: string
  h2?: string
  metaDescription?: string
  title?: string
  colorPsychology?: string
  seoQuality: SeoQuality
  stockStatus: 'instock' | 'outofstock'
  noindex: boolean
  lastSyncedAt: string
  lastGeminiAttempt?: string
  geminiAttempts: number
}

export type VariationSnapshot = {
  stockStatus: 'instock' | 'outofstock'
  status: 'publish' | 'draft' | 'trash' | 'private'
  price: string
  sku: string
  updatedAt: string
}

export const seoKey = (slug: string) => `seo:${slug}`
export const variationKey = (id: number) => `variation:${id}`
export const lockKey = 'lock:seo-write'
export const retryQueueKey = 'gemini-retry-queue'
export const notifyKey = (id: number) => `notify:${id}`
