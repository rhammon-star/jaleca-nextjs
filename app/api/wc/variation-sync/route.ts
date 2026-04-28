// app/api/wc/variation-sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { fetchVariation, type FullVariation } from '@/lib/wc-variation'
import {
  decideAction,
  getSnapshot,
  setSnapshot,
  getSeoByVariationId,
  upsertSeo,
  withLock,
  type Action,
} from '@/lib/variation-state'
import type { SeoEntry } from '@/lib/kv'

export const runtime = 'nodejs'

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

function buildTemplateSeo(
  variationId: number,
  live: FullVariation,
  now: string,
): SeoEntry {
  // Fallback names — Phase 4 enriches with real parent product name
  const colorName = live.attributes['Cor'] ?? live.attributes['cor'] ?? 'Padrão'
  const colorSlug = slugify(colorName)
  const productSlug = `produto-${live.parentId}`
  const productName = `Produto ${live.parentId}`
  const url = `/${productSlug}-${colorSlug}`

  return {
    url,
    productName,
    productSlug,
    colorName,
    colorSlug,
    variationId,
    category: 'geral',
    title: `${productName} ${colorName} | Jaleca`,
    metaDescription: `${productName} na cor ${colorName}. Compre online com entrega para todo Brasil.`,
    seoQuality: 'template',
    stockStatus: live.snapshot.stockStatus,
    noindex: live.snapshot.stockStatus === 'outofstock',
    lastSyncedAt: now,
    geminiAttempts: 0,
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-jaleca-secret') !== process.env.JALECA_PLUGIN_SECRET) {
    return unauthorized()
  }

  const body = (await req.json().catch(() => null)) as { variationId?: number } | null
  const variationId = body?.variationId
  if (!variationId) {
    return NextResponse.json({ error: 'variationId required' }, { status: 400 })
  }

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
    return NextResponse.json({ action: 'DESATIVAR (deletada)', variationId })
  }

  const prev = await getSnapshot(variationId)
  const action: Action = decideAction(prev, live.snapshot)

  if (action === 'IGNORAR') {
    return NextResponse.json({ action, variationId })
  }

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
      seo = buildTemplateSeo(variationId, live, now)
    }

    await upsertSeo(seo)
    await setSnapshot(variationId, live.snapshot)
    revalidatePath(seo.url)
  })

  return NextResponse.json({ action, variationId })
}
