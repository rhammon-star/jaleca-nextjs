// app/api/wc/variation-sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { waitUntil } from '@vercel/functions'
import { tryGeminiOrEnqueue } from '@/lib/variation-seo-generator'
import { fetchVariation, fetchParentProduct, type FullVariation } from '@/lib/wc-variation'
import {
  decideAction,
  getSnapshot,
  setSnapshot,
  getSeoByVariationId,
  upsertSeo,
  withLock,
  type Action,
} from '@/lib/variation-state'
import { kv, notifyKey, type SeoEntry } from '@/lib/kv'
import { notifyAllForUrl } from '@/lib/google-indexing'
import { sendBackInStock } from '@/lib/email'

export const runtime = 'nodejs'

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), src: 'variation-sync', event, ...data }))
}

function unauthorized() {
  return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function buildTemplateSeo(
  variationId: number,
  live: FullVariation,
  now: string,
): Promise<SeoEntry> {
  const parent = await fetchParentProduct(live.parentId)
  const productName = parent?.name ?? `Produto ${live.parentId}`
  const productSlug = parent?.slug ?? `produto-${live.parentId}`
  const category = parent?.categories?.[0] ?? 'geral'
  const colorName = live.attributes['Cor'] ?? live.attributes['cor'] ?? live.attributes['pa_color'] ?? 'Padrão'
  const colorSlug = slugify(colorName)
  const url = `/produto/${productSlug}-${colorSlug}`

  return {
    url,
    productName,
    productSlug,
    colorName,
    colorSlug,
    variationId,
    category,
    title: `${productName} ${colorName} | Jaleca`,
    metaDescription: `${productName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
    seoQuality: 'template',
    stockStatus: live.snapshot.stockStatus,
    noindex: live.snapshot.stockStatus === 'outofstock',
    lastSyncedAt: now,
    geminiAttempts: 0,
  }
}

async function drainAndNotify(seo: SeoEntry) {
  const emails = (await kv.smembers(notifyKey(seo.variationId))) as string[]
  if (!emails.length) return
  for (const email of emails) {
    await sendBackInStock({
      to: email,
      productName: seo.productName,
      colorName: seo.colorName,
      url: seo.url,
    }).catch((e) => console.error('[backinstock email]', email, e))
  }
  await kv.del(notifyKey(seo.variationId))
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-jaleca-secret') !== process.env.JALECA_PLUGIN_SECRET) {
    log('unauthorized', {})
    return unauthorized()
  }

  const body = (await req.json().catch(() => null)) as { variationId?: number } | null
  const variationId = body?.variationId
  if (!variationId) {
    log('bad_request', { reason: 'variationId required' })
    return NextResponse.json({ error: 'variationId required' }, { status: 400 })
  }

  const t0 = Date.now()
  log('received', { variationId })

  const live = await fetchVariation(variationId)

  // Variation deleted from WC — mark existing SEO as noindex/outofstock
  if (!live) {
    const seo = await getSeoByVariationId(variationId)
    if (seo) {
      const now = new Date().toISOString()
      await upsertSeo({
        ...seo,
        noindex: true,
        stockStatus: 'outofstock',
        lastSyncedAt: now,
      })
      revalidatePath(seo.url)
    }
    log('done', { variationId, action: 'DESATIVAR_DELETED', ms: Date.now() - t0 })
    return NextResponse.json({ action: 'DESATIVAR (deletada)', variationId })
  }

  const prev = await getSnapshot(variationId)
  const action: Action = decideAction(prev, live.snapshot)
  log('decided', {
    variationId,
    action,
    prevStock: prev?.stockStatus ?? null,
    nextStock: live.snapshot.stockStatus,
    prevStatus: prev?.status ?? null,
    nextStatus: live.snapshot.status,
  })

  if (action === 'IGNORAR') {
    log('done', { variationId, action, ms: Date.now() - t0 })
    return NextResponse.json({ action, variationId })
  }

  let updatedSeo: SeoEntry | null = null
  const owner = `webhook-${variationId}-${Date.now()}`
  await withLock(owner, async () => {
    const existingSeo = await getSeoByVariationId(variationId)
    const now = new Date().toISOString()

    let seo: SeoEntry
    if (existingSeo) {
      seo = {
        ...existingSeo,
        stockStatus: live.snapshot.stockStatus,
        noindex: action === 'SEM_ESTOQUE' || action === 'DESATIVAR',
        lastSyncedAt: now,
      }
    } else {
      seo = await buildTemplateSeo(variationId, live, now)
    }

    await upsertSeo(seo)
    await setSnapshot(variationId, live.snapshot)
    revalidatePath(seo.url)
    updatedSeo = seo
    log('upserted', { variationId, slug: seo.url, seoQuality: seo.seoQuality, noindex: seo.noindex })
  })

  if (updatedSeo) {
    const seo = updatedSeo as SeoEntry
    if (action === 'CRIAR' || action === 'VOLTOU_ESTOQUE') {
      waitUntil(notifyAllForUrl(seo.url))
    }
    if (action === 'CRIAR') {
      waitUntil(tryGeminiOrEnqueue(variationId))
    }
    if (action === 'VOLTOU_ESTOQUE') {
      waitUntil(drainAndNotify(seo))
    }
  }

  log('done', { variationId, action, ms: Date.now() - t0 })
  return NextResponse.json({ action, variationId })
}
