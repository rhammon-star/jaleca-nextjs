// lib/wc-variation.ts
import type { VariationSnapshot } from './kv'

type WcVariationResponse = {
  id: number
  status: 'publish' | 'draft' | 'trash' | 'private'
  stock_status: 'instock' | 'outofstock'
  price: string
  sku: string
  date_modified_gmt: string
  parent_id: number
  attributes: Array<{ name: string; option: string }>
}

export type FullVariation = {
  snapshot: VariationSnapshot
  parentId: number
  attributes: Record<string, string>
  raw: WcVariationResponse
}

export async function fetchVariation(variationId: number): Promise<FullVariation | null> {
  const secret = process.env.JALECA_PLUGIN_SECRET
  if (!secret) {
    console.error('[fetchVariation] JALECA_PLUGIN_SECRET ausente')
    return null
  }

  const res = await fetch(
    `https://wp.jaleca.com.br/wp-json/jaleca/v1/variation/${variationId}`,
    {
      headers: { 'X-Jaleca-Secret': secret },
      next: { revalidate: 0 },
    },
  )
  if (!res.ok) {
    console.error('[fetchVariation] HTTP', res.status, 'for variation', variationId)
    return null
  }
  const data = (await res.json()) as WcVariationResponse

  const attributes = Object.fromEntries(data.attributes.map((a) => [a.name, a.option]))

  return {
    snapshot: {
      stockStatus: data.stock_status,
      status: data.status,
      price: data.price ?? '',
      sku: data.sku ?? '',
      updatedAt: data.date_modified_gmt,
    },
    parentId: data.parent_id,
    attributes,
    raw: data,
  }
}
