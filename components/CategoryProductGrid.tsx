import Link from 'next/link'
import { getAllProducts } from '@/lib/all-products'
import ProductCard, { type WooProduct } from '@/components/ProductCard'

type Props = {
  categorySlug: string
  color?: string
  professionLabel: string
  collectionLabel?: string
  productLabel?: string
  allHref?: string
  limit?: number
  dark?: boolean
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_]+/g, '-')
}

function matchesColor(p: WooProduct, color: string): boolean {
  const target = normalize(color)
  for (const attr of (p.attributes?.nodes ?? [])) {
    if (!/cor|color|pa_cor/i.test(attr.name)) continue
    for (const opt of (attr.options ?? [])) {
      const v = normalize(String(opt))
      if (v === target || v.startsWith(target + '-') || target.startsWith(v + '-')) return true
    }
  }
  return false
}

function matchesCategory(p: WooProduct, slug: string): boolean {
  const target = normalize(slug)
  for (const c of (p.productCategories?.nodes ?? [])) {
    const s = normalize(c.slug || c.name || '')
    if (s === target) return true
  }
  return false
}

export default async function CategoryProductGrid({
  categorySlug,
  color,
  professionLabel,
  collectionLabel,
  productLabel = 'Jalecos',
  allHref,
  limit = 12,
  dark = false,
}: Props) {
  const all = await getAllProducts()

  const filtered = all.filter(p => {
    if (!matchesCategory(p, categorySlug)) return false
    if (color && !matchesColor(p, color)) return false
    return true
  }).slice(0, limit)

  if (filtered.length === 0) return null

  const href = allHref || `/produtos?categoria=${categorySlug}${color ? `&cor=${color}` : ''}`
  const bg = dark ? '#1a1a1a' : '#f9f7f4'
  const txt = dark ? '#fff' : '#1a1a1a'
  const subTxt = dark ? 'rgba(255,255,255,0.45)' : '#c8c4bc'
  const border = dark ? 'rgba(255,255,255,0.4)' : '#1a1a1a'

  return (
    <section style={{ background: bg, padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            {collectionLabel && (
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: subTxt, marginBottom: '0.75rem' }}>
                {collectionLabel}
              </div>
            )}
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: txt }}>
              {productLabel} para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{professionLabel}</em>
            </h2>
          </div>
          <Link
            href={href}
            style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: `1px solid ${border}`, color: txt, whiteSpace: 'nowrap' }}
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
