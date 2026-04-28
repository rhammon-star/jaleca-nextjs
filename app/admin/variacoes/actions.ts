'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
import { notifyAllForUrl } from '@/lib/google-indexing'
import { upsertSeo } from '@/lib/variation-state'

export async function regenerateGemini(variationId: number) {
  await requireAdmin()
  await tryGeminiOrEnqueue(variationId)
  revalidatePath('/admin/variacoes')
}

export async function forceRevalidate(slug: string) {
  await requireAdmin()
  const entry = await kv.get<SeoEntry>(seoKey(slug))
  if (entry) revalidatePath(entry.url)
  revalidatePath('/admin/variacoes')
}

export async function submitToGoogle(slug: string) {
  await requireAdmin()
  const entry = await kv.get<SeoEntry>(seoKey(slug))
  if (entry) await notifyAllForUrl(entry.url)
}

export async function savePremium(slug: string, formData: FormData) {
  await requireAdmin()
  const current = await kv.get<SeoEntry>(seoKey(slug))
  if (!current) throw new Error('Entry não encontrada')

  const updated: SeoEntry = {
    ...current,
    h1: String(formData.get('h1') ?? ''),
    h2: String(formData.get('h2') ?? ''),
    title: String(formData.get('title') ?? ''),
    metaDescription: String(formData.get('metaDescription') ?? ''),
    colorPsychology: String(formData.get('colorPsychology') ?? ''),
    seoQuality: 'premium',
    lastSyncedAt: new Date().toISOString(),
  }
  await upsertSeo(updated)
  revalidatePath(updated.url)
  revalidatePath('/admin/variacoes')
}

export async function setNoindex(slug: string, noindex: boolean) {
  await requireAdmin()
  const current = await kv.get<SeoEntry>(seoKey(slug))
  if (!current) return
  await upsertSeo({ ...current, noindex, lastSyncedAt: new Date().toISOString() })
  revalidatePath(current.url)
  revalidatePath('/admin/variacoes')
}
