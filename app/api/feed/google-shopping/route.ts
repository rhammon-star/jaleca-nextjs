import { NextResponse } from 'next/server'

export const revalidate = 3600 // regenera a cada 1 hora

const WC_URL = process.env.WOOCOMMERCE_API_URL!
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function auth() {
  return 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
}

async function wcGet<T>(path: string): Promise<T> {
  const res = await fetch(`${WC_URL}${path}`, {
    headers: { Authorization: auth() },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`WooCommerce ${res.status}: ${path}`)
  return res.json()
}

type WCProduct = {
  id: number
  name: string
  slug: string
  status: string
  description: string
  short_description: string
  price: string
  stock_status: string
  stock_quantity: number | null
  images: Array<{ src: string }>
  type: string
  attributes: Array<{ name: string; options: string[] }>
}

type WCVariation = {
  id: number
  price: string
  stock_status: string
  stock_quantity: number | null
  image?: { src: string }
  attributes: Array<{ name: string; option: string }>
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function stripHtml(s: string): string {
  return s
    .replace(/\[\/?\w[^\]]*\]/g, ' ')   // remove shortcodes WPBakery [vc_row], [/vc_column], etc.
    .replace(/<[^>]*>/g, ' ')            // remove tags HTML
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000)
}

function brl(price: string): string {
  const n = parseFloat(price)
  return isNaN(n) ? '' : `${n.toFixed(2)} BRL`
}

function gender(name: string): string {
  if (/feminino/i.test(name)) return 'female'
  if (/masculino/i.test(name)) return 'male'
  return 'unisex'
}

// Mapeia atributos WooCommerce → campos Google Shopping
function mapAttr(attrs: Array<{ name: string; option: string }>) {
  const get = (regex: RegExp) => attrs.find(a => regex.test(a.name))?.option
  return {
    color:    get(/^cor$/i),
    size:     get(/tamanho|size/i),
    material: get(/material/i),
    pattern:  get(/estampa|estampado|print|padrão/i),
  }
}

// Para produtos simples: usa options[] do atributo do produto pai
function mapProductAttr(attrs: Array<{ name: string; options: string[] }>) {
  const get = (regex: RegExp) => {
    const found = attrs.find(a => regex.test(a.name))
    return found?.options?.join(', ') || undefined
  }
  return {
    color:    get(/^cor$/i),
    size:     get(/tamanho|size/i),
    material: get(/material/i),
    pattern:  get(/estampa|estampado|print|padrão/i),
  }
}

function buildItem(fields: {
  id: string
  groupId?: string
  title: string
  description: string
  link: string
  image: string
  availability: string
  price: string
  gender: string
  quantity?: number
  color?: string
  size?: string
  material?: string
  pattern?: string
}): string {
  const title = fields.title.length > 65 ? fields.title.slice(0, 62) + '...' : fields.title
  const qty = fields.quantity && fields.quantity > 0 ? fields.quantity : 50
  return `
    <item>
      <g:id>${esc(fields.id)}</g:id>
      ${fields.groupId ? `<g:item_group_id>${esc(fields.groupId)}</g:item_group_id>` : ''}
      <title>${esc(title)}</title>
      <description>${esc(fields.description)}</description>
      <link>${esc(fields.link)}</link>
      <g:image_link>${esc(fields.image)}</g:image_link>
      <g:availability>${fields.availability}</g:availability>
      <g:quantity>${qty}</g:quantity>
      <g:price>${fields.price}</g:price>
      <g:brand>Jaleca</g:brand>
      <g:condition>new</g:condition>
      <g:age_group>adult</g:age_group>
      <g:gender>${fields.gender}</g:gender>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Uniforms</g:google_product_category>
      ${fields.color    ? `<g:color>${esc(fields.color)}</g:color>`         : ''}
      ${fields.size     ? `<g:size>${esc(fields.size)}</g:size>`             : ''}
      ${fields.material ? `<g:material>${esc(fields.material)}</g:material>` : ''}
      ${fields.pattern  ? `<g:pattern>${esc(fields.pattern)}</g:pattern>`    : ''}
    </item>`
}

export async function GET() {
  try {
    // Busca todos os produtos publicados (paginado)
    const allProducts: WCProduct[] = []
    let page = 1
    while (true) {
      const batch = await wcGet<WCProduct[]>(
        `/products?status=publish&per_page=100&page=${page}`
      )
      if (!batch.length) break
      allProducts.push(...batch)
      if (batch.length < 100) break
      page++
    }

    const items: string[] = []

    // Produtos em estoque apenas
    const variableProducts = allProducts.filter(p => p.type === 'variable' && p.price !== '')
    const simpleProducts = allProducts.filter(p => p.type === 'simple' && p.price && p.stock_status === 'instock')

    // Produtos simples
    for (const p of simpleProducts) {
      if (p.stock_quantity !== null && p.stock_quantity <= 0) continue
      const image = p.images[0]?.src
      if (!image) continue
      const price = brl(p.price)
      if (!price) continue

      const attrs = mapProductAttr(p.attributes ?? [])
      const g = gender(p.name)

      items.push(buildItem({
        id: String(p.id),
        title: p.name,
        description: stripHtml(p.description || p.short_description || p.name),
        link: `https://jaleca.com.br/produto/${p.slug}`,
        image,
        availability: 'in_stock',
        price,
        gender: g,
        quantity: p.stock_quantity ?? 1,
        ...attrs,
      }))
    }

    // Produtos variáveis — busca variações em paralelo
    const variationResults = await Promise.all(
      variableProducts.map(p =>
        wcGet<WCVariation[]>(`/products/${p.id}/variations?per_page=100`)
          .then(v => ({ product: p, variations: v }))
          .catch(() => ({ product: p, variations: [] as WCVariation[] }))
      )
    )

    for (const { product: p, variations } of variationResults) {
      const baseImage = p.images[0]?.src || ''
      // Fix: usar short_description (texto curto abaixo do preço), não a descrição longa
      const description = stripHtml(p.short_description || p.description || p.name)
      const g = gender(p.name)

      // Agrupar variações por cor — 1 item por cor no catálogo, tamanho NÃO gera item separado
      const colorGroups = new Map<string, {
        colorLabel: string
        image: string
        rep: WCVariation
        sizes: string[]
      }>()

      for (const v of variations) {
        if (!v.price || v.stock_status !== 'instock') continue
        if (v.stock_quantity !== null && v.stock_quantity <= 0) continue
        const attrs = mapAttr(v.attributes)
        const colorLabel = attrs.color ?? attrs.pattern ?? ''
        const colorKey = colorLabel.toLowerCase().replace(/\s+/g, '_') || 'unica'
        const image = v.image?.src || baseImage
        if (!image) continue

        if (!colorGroups.has(colorKey)) {
          colorGroups.set(colorKey, { colorLabel, image, rep: v, sizes: [] })
        }
        if (attrs.size) colorGroups.get(colorKey)!.sizes.push(attrs.size)
      }

      // Um item por cor
      for (const [colorKey, group] of colorGroups) {
        const price = brl(group.rep.price)
        if (!price) continue

        const repAttrs = mapAttr(group.rep.attributes)

        // Título: nome do produto + cor (sem tamanho)
        const titleParts = [p.name, group.colorLabel].filter(Boolean)
        const title = titleParts.join(' — ')

        // Link abre na cor certa via nome e ID da variação representativa
        const link = `https://jaleca.com.br/produto/${p.slug}?cor=${encodeURIComponent(colorKey)}&vid=${group.rep.id}`

        items.push(buildItem({
          id: `${p.id}_${colorKey}`,
          title,
          description,
          link,
          image: group.image,
          availability: 'in_stock',
          price,
          gender: g,
          quantity: group.rep.stock_quantity ?? 50,
          color: group.colorLabel || undefined,
          size: group.sizes[0] || undefined,
          material: repAttrs.material,
          pattern: repAttrs.pattern,
        }))
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Jaleca — Jalecos e Mimos</title>
    <link>https://jaleca.com.br</link>
    <description>Uniformes médicos premium. Jalecos e scrubs para profissionais da saúde.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('')}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[Google Shopping Feed]', err)
    return new NextResponse('Erro ao gerar feed', { status: 500 })
  }
}
