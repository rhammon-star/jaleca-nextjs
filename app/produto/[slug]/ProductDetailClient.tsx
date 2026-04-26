'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageZoom from '@/components/ImageZoom'
import Breadcrumb from '@/components/Breadcrumb'
import { ShoppingBag, Heart, ChevronLeft, Ruler, Star, Loader2, CreditCard, Banknote, MessageCircle, Flame, AlertTriangle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'
import { trackViewItem } from '@/components/Analytics'
import SizeAdvisorModal from '@/components/SizeAdvisorModal'
import BackInStockButton from '@/components/BackInStockButton'
import ProductCard, { type WooProduct } from '@/components/ProductCard'
import RecentlyViewed from '@/components/RecentlyViewed'
import UrgencyToast from '@/components/UrgencyToast'
import { isBestSeller } from '@/lib/best-sellers'
import type { PlaceData } from '@/lib/google-places'

type AttributeTerm = { slug: string; name: string }

type VariationImage = {
  sourceUrl: string
  altText: string
}

type Variation = {
  id: string
  databaseId: number
  name: string
  stockStatus: string
  stockQuantity?: number | null
  price?: string
  regularPrice?: string
  salePrice?: string
  sku?: string
  image?: VariationImage
  jalecaGalleryImages?: GalleryImage[]
  attributes: {
    nodes: Array<{ name: string; value: string; label?: string }>
  }
}

type Attribute = {
  name: string
  options: string[]
  terms?: { nodes: AttributeTerm[] }
}

type GalleryImage = {
  sourceUrl: string
  altText: string
}

type ProductCategory = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  databaseId: number
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku?: string
  price?: string
  regularPrice?: string
  salePrice?: string
  stockStatus?: string
  stockQuantity?: number | null
  image?: { sourceUrl: string; altText: string }
  galleryImages?: { nodes: GalleryImage[] }
  attributes?: { nodes: Attribute[] }
  variations?: { nodes: Variation[] }
  productCategories?: { nodes: ProductCategory[] }
}

type Review = {
  id: number
  reviewer: string
  review: string
  rating: number
  date_created: string
  verified: boolean
}

type ActiveTab = 'dados-tecnicos' | 'informacoes' | 'avaliacoes'

// Build a slug → display name map from attribute terms
function buildSlugMap(attr: Attribute | undefined): Record<string, string> {
  const map: Record<string, string> = {}
  attr?.terms?.nodes.forEach(t => { map[t.slug] = t.name })
  return map
}

function formatAttrLabel(name: string): string {
  const clean = name.replace(/^pa_/i, '').replace(/_/g, ' ').toLowerCase()
  const ptMap: Record<string, string> = { 'color': 'Cor', 'cor': 'Cor', 'tamanho': 'Tamanho', 'size': 'Tamanho', 'estampa': 'Estampa' }
  return ptMap[clean] ?? clean.replace(/\b\w/g, c => c.toUpperCase())
}

function normalizeAttr(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_\s]/g, '')
}

function isColorAttr(a: { name: string; label?: string }) {
  const n = a.name.toLowerCase()
  const l = (a.label ?? '').toLowerCase()
  return n === 'pa_color' || n === 'pa_cor' || n.includes('color') || n.includes('cor') || n.includes('estampa') || l.includes('cor') || l.includes('estampa')
}
function isSizeAttr(a: { name: string; label?: string }) {
  const n = a.name.toLowerCase()
  const l = (a.label ?? '').toLowerCase()
  return n === 'pa_tamanho' || n.includes('tamanho') || n.includes('size') || l.includes('tamanho') || l.includes('size')
}

function StockBadge({ status, quantity }: { status?: string; quantity?: number | null }) {
  if (!status) return null
  if (status === 'OUT_OF_STOCK') {
    return <span className="text-xs text-red-600 font-medium">Esgotado</span>
  }
  if (status === 'ON_BACKORDER') {
    return <span className="text-xs text-yellow-600 font-medium flex items-center gap-1"><Flame size={12} /> Últimas unidades — compre agora!</span>
  }
  if (status === 'IN_STOCK') {
    if (quantity !== null && quantity !== undefined && quantity <= 5) {
      return <span className="text-xs text-orange-500 font-medium flex items-center gap-1"><Flame size={12} /> Apenas {quantity} em estoque!</span>
    }
    return <span className="text-xs text-green-600 font-medium">Em estoque</span>
  }
  return null
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30 fill-muted-foreground/10'}
        />
      ))}
    </div>
  )
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim()
}

// Clean WPBakery and other shortcodes from HTML
function cleanHtml(html: string): string {
  return html
    .replace(/\[\/?\w+[^\]]*\]/g, '') // Remove [shortcode] and [/shortcode]
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim()
}

// Format technical content: bold uppercase words, separators, clean structure
function formatTechnicalContent(html: string): string {
  const cleaned = cleanHtml(html)

  // Split into HTML tags and text nodes — only process text nodes
  const parts = cleaned.split(/(<[^>]+>)/)
  const processed = parts.map(part => {
    if (part.startsWith('<')) return part
    // Bold sequences of 3+ uppercase letters (including accented Portuguese chars)
    return part.replace(
      /([A-ZÁÉÍÓÚÃÊÇÂÔÀÜÕ]{3,}(?:[\s\-\/][A-ZÁÉÍÓÚÃÊÇÂÔÀÜÕ\d]{2,})*)/g,
      '<strong>$1</strong>'
    )
  })

  let result = processed.join('')

  // Convert plain line-breaks to paragraphs if no block tags present
  if (!/<(p|ul|ol|h[1-6]|div|br)/i.test(result)) {
    result = result
      .split(/\n{2,}/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `<p>${s.replace(/\n/g, '<br/>')}</p>`)
      .join('')
  }

  // Inject decorative separator between every <p> block
  const SEPARATOR = `<div class="tech-separator"><span></span><span class="tech-dot">✦</span><span></span></div>`
  result = result.replace(/<\/p>\s*<p>/g, `</p>${SEPARATOR}<p>`)

  // Also inject separator between </li></ul> and next <p>, or between </p> and <ul>
  result = result.replace(/<\/ul>\s*<p>/g, `</ul>${SEPARATOR}<p>`)
  result = result.replace(/<\/p>\s*<ul>/g, `</p>${SEPARATOR}<ul>`)

  return result
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}


export default function ProductDetailClient({
  product,
  initialReviews = [],
  relatedProducts = [],
  googlePlace,
  initialColor,
}: {
  product: Product
  initialReviews?: Review[]
  relatedProducts?: WooProduct[]
  googlePlace?: PlaceData
  initialColor?: string | null
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize]   = useState<string | null>(null)

  // Pré-seleciona cor vinda do link do catálogo (?cor=azul_marinho&vid=123)
  // OU da URL por cor (/produto/jaleco-slim-branco → initialColor="Branco")
  useEffect(() => {
    const corParam = searchParams.get('cor')
    const vidParam = searchParams.get('vid')

    if (initialColor) {
      // Prioridade 1: cor vinda da URL estruturada (/produto/x-cor)
      setSelectedColor(initialColor)
    } else if (corParam) {
      // Prioridade 2: query param ?cor=
      setSelectedColor(corParam.replace(/_/g, ' '))
    } else if (vidParam) {
      // Prioridade 3: fallback por variation ID
      const variation = product.variations?.nodes.find(
        v => String(v.databaseId) === vidParam
      )
      const colorAttr = variation?.attributes?.nodes?.find((a: { name: string }) =>
        isColorAttr({ name: a.name })
      )
      if (colorAttr?.value) setSelectedColor(colorAttr.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialColor])

  // Handle browser back/forward with color state
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && 'color' in event.state) {
        setSelectedColor(event.state.color)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const galleryRef  = useRef<HTMLDivElement>(null)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [showAdvisor, setShowAdvisor]     = useState(false)
  const [activeTab, setActiveTab] = useState<ActiveTab>('dados-tecnicos')

  // Viewers counter — pseudo-random seeded by productId + hour, changes hourly
  const [viewerCount, setViewerCount] = useState<number | null>(null)
  useEffect(() => {
    const id = product.databaseId
    const now = new Date()
    const seed = (id * 7 + now.getHours() * 3 + now.getDate() * 13 + now.getMonth() * 31) % 100
    const count = 3 + (seed % 13) // 3–15
    // Show on ~65% of products (skip when hash is low)
    const slugHash = product.slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    if (slugHash % 10 >= 3) setViewerCount(count)
  }, [product.databaseId, product.slug])

  // Sticky CTA — aparece quando botão original sai da viewport (mobile)
  const addToCartBtnRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  useEffect(() => {
    const el = addToCartBtnRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Reviews — loaded server-side, updated after new submission
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reviewsLoading] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewEmail, setReviewEmail] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewError, setReviewError] = useState('')

  // Field shaking validation
  const [shakeColor, setShakeColor] = useState(false)
  const [shakeSize, setShakeSize] = useState(false)

  // Variation galleries: databaseId → images[]
  const [variationGalleries, setVariationGalleries] = useState<Record<number, GalleryImage[]>>({})
  const [galleryLoading, setGalleryLoading] = useState(false)

  // Related products — loaded server-side
  const [related] = useState<WooProduct[]>(relatedProducts)

  const { user } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(String(product.databaseId))

  // Find color and size attributes
  const colorAttrDef = product.attributes?.nodes.find(a => isColorAttr(a))
  const sizeAttrDef  = product.attributes?.nodes.find(a => isSizeAttr(a))

  const colorNames = buildSlugMap(colorAttrDef)
  const sizeNames  = buildSlugMap(sizeAttrDef)

  // Derive available values from actual variations — avoids showing all global attribute terms
  const variations = product.variations?.nodes ?? []
  // Only show colors/sizes that have at least one in-stock variation WITH a valid price
  const inStockVariations = variations.filter(v => v.stockStatus !== 'OUT_OF_STOCK' && !!v.price && parsePrice(v.price) > 0)
  const activeVariations = inStockVariations.length > 0 ? inStockVariations : variations.filter(v => !!v.price && parsePrice(v.price) > 0)

  const colorSlugs = (variations.length > 0
    ? [...new Set(activeVariations.flatMap(v => v.attributes.nodes.filter(a => isColorAttr(a)).map(a => a.value)).filter(Boolean))]
    : (colorAttrDef?.options ?? [])
  ).sort((a, b) => (colorNames[a] ?? a).toLowerCase().localeCompare((colorNames[b] ?? b).toLowerCase(), 'pt-BR'))

  // Sizes: when color is selected, only show sizes in-stock for that color
  const sizeSlugs = (() => {
    if (variations.length === 0) return sizeAttrDef?.options ?? []
    const relevantVariations = selectedColor
      ? activeVariations.filter(v => {
          const vColor = v.attributes.nodes.find(a => isColorAttr(a))
          if (!vColor) return false
          const selectedColorName = colorNames[selectedColor] ?? selectedColor
          return normalizeAttr(vColor.value) === normalizeAttr(selectedColor) ||
            normalizeAttr(vColor.value) === normalizeAttr(selectedColorName)
        })
      : activeVariations
    const sizeOrder = ['pp', 'p', 'm', 'g', 'gg', 'g1', 'g2', 'g3']
    const slugs = [...new Set(relevantVariations.flatMap(v => v.attributes.nodes.filter(a => isSizeAttr(a)).map(a => a.value)).filter(Boolean))]
    return slugs.sort((a, b) => {
      const ai = sizeOrder.indexOf(a.toLowerCase())
      const bi = sizeOrder.indexOf(b.toLowerCase())
      if (ai === -1 && bi === -1) return a.localeCompare(b)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  })()

  // Only match a variation when ALL present attributes are selected to avoid wrong prices
  const allAttrsSelected =
    (colorSlugs.length === 0 || !!selectedColor) &&
    (sizeSlugs.length  === 0 || !!selectedSize)

  const matchedVariation = allAttrsSelected && (selectedColor || selectedSize)
    ? product.variations?.nodes.find(v => {
        const attrs = v.attributes.nodes
        const vColor = attrs.find(a => isColorAttr(a))
        const vSize  = attrs.find(a => isSizeAttr(a))
        // WooCommerce GraphQL inconsistency: options returns slugs but variation value returns term NAME
        // So compare case-insensitively and also against the term display name
        const selectedColorName = selectedColor ? (colorNames[selectedColor] ?? selectedColor) : null
        const selectedSizeName  = selectedSize  ? (sizeNames[selectedSize]  ?? selectedSize)  : null
        const colorMatch = !selectedColor || !vColor || vColor.value === '' ||
          normalizeAttr(vColor.value) === normalizeAttr(selectedColor) ||
          (selectedColorName && normalizeAttr(vColor.value) === normalizeAttr(selectedColorName))
        const sizeMatch = !selectedSize || !vSize || vSize.value === '' ||
          normalizeAttr(vSize.value) === normalizeAttr(selectedSize) ||
          (selectedSizeName && normalizeAttr(vSize.value) === normalizeAttr(selectedSizeName))
        return colorMatch && sizeMatch
      })
    : undefined

  // Before any selection: show regularPrice range (no promos). After match: show variation price.
  const activePrice   = matchedVariation?.price ?? (product.regularPrice ?? product.price ?? '')
  const activeRegular = matchedVariation?.regularPrice
  const activeSale    = matchedVariation?.salePrice
  const isOnSale      = !!(activeSale && activeRegular && activeSale !== activeRegular)
  const displayPrice  = isOnSale ? activeSale! : activePrice

  const stockStatus = matchedVariation?.stockStatus ?? product.stockStatus
  const stockQty = matchedVariation?.stockQuantity ?? product.stockQuantity
  const isOutOfStock = stockStatus === 'OUT_OF_STOCK'

  // Helper to remove accents for color matching
  function removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  // Find a variation just by color (for image preview before size is selected)
  const colorPreviewVariation = selectedColor && !matchedVariation
    ? product.variations?.nodes.find(v => {
        const vColor = v.attributes.nodes.find(a => isColorAttr(a))
        if (!vColor) return false
        const selectedColorName = colorNames[selectedColor] ?? selectedColor
        const normalizedTarget = removeAccents(normalizeAttr(selectedColor))
        const normalizedTargetName = removeAccents(normalizeAttr(selectedColorName))
        const normalizedVColor = removeAccents(normalizeAttr(vColor.value))
        return normalizedVColor === normalizedTarget ||
          normalizedVColor === normalizedTargetName ||
          normalizedVColor.includes(normalizedTarget) ||
          normalizedTarget.includes(normalizedVColor)
      })
    : undefined

  // Build gallery: never mix product-level gallery (contains all colors) with variation images
  const activeVariationForGallery = matchedVariation ?? colorPreviewVariation
  const varGallery = activeVariationForGallery?.databaseId ? (variationGalleries[activeVariationForGallery.databaseId] ?? []) : []
  const baseImage = activeVariationForGallery?.image?.sourceUrl ? activeVariationForGallery.image : product.image

  const allImages = varGallery.length > 0
    ? varGallery  // variation has its own gallery → use it entirely
    : baseImage ? [baseImage] : []  // only show the single main/variation image

  const displayImage = allImages[activeImageIdx] ?? baseImage

  // Reset to first image when variation changes
  const prevMatchedId = matchedVariation?.id ?? colorPreviewVariation?.id
  useEffect(() => { setActiveImageIdx(0) }, [prevMatchedId])

  // Mobile UX: ao selecionar cor, rolar suavemente de volta para a foto
  useEffect(() => {
    if (!selectedColor || typeof window === 'undefined') return
    if (window.innerWidth >= 768) return // só mobile
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedColor])

  const matchedVariationHasPrice = !matchedVariation || (!!matchedVariation.price && parsePrice(matchedVariation.price) > 0)
  const canAdd = (colorSlugs.length === 0 || selectedColor) &&
    (sizeSlugs.length === 0 || selectedSize) &&
    !isOutOfStock &&
    matchedVariationHasPrice

  const { addItem } = useCart()

  // Price calculations for PIX and installments
  const priceValue = parsePrice(displayPrice)
  const pixPrice = priceValue * 0.95
  const installmentValue = priceValue > 0 ? priceValue / 3 : 0

  function handleAddToCart() {
    // Validate and shake missing fields
    const needsColor = colorSlugs.length > 0 && !selectedColor
    const needsSize = sizeSlugs.length > 0 && !selectedSize

    if (needsColor || needsSize || isOutOfStock || !matchedVariationHasPrice) {
      if (needsColor) {
        setShakeColor(true)
        setTimeout(() => setShakeColor(false), 600)
      }
      if (needsSize) {
        setShakeSize(true)
        setTimeout(() => setShakeSize(false), 600)
      }
      return
    }

    const colorLabel = selectedColor ? (colorNames[selectedColor] ?? selectedColor) : undefined
    const sizeLabel  = selectedSize  ? (sizeNames[selectedSize]   ?? selectedSize.toUpperCase()) : undefined
    addItem({
      id: product.id,
      databaseId: product.databaseId,
      variationId: matchedVariation?.databaseId,
      slug: product.slug,
      name: product.name.replace(/ - Jaleca$/i, ''),
      image: displayImage?.sourceUrl,
      price: displayPrice,
      size: sizeLabel,
      color: colorLabel,
    })
  }

  function handleBuyNow() {
    // Validate and shake missing fields
    const needsColor = colorSlugs.length > 0 && !selectedColor
    const needsSize = sizeSlugs.length > 0 && !selectedSize

    if (needsColor || needsSize || isOutOfStock || !matchedVariationHasPrice) {
      if (needsColor) {
        setShakeColor(true)
        setTimeout(() => setShakeColor(false), 600)
      }
      if (needsSize) {
        setShakeSize(true)
        setTimeout(() => setShakeSize(false), 600)
      }
      return
    }

    const colorLabel = selectedColor ? (colorNames[selectedColor] ?? selectedColor) : undefined
    const sizeLabel  = selectedSize  ? (sizeNames[selectedSize]   ?? selectedSize.toUpperCase()) : undefined
    addItem({
      id: product.id,
      databaseId: product.databaseId,
      variationId: matchedVariation?.databaseId,
      slug: product.slug,
      name: product.name.replace(/ - Jaleca$/i, ''),
      image: displayImage?.sourceUrl,
      price: displayPrice,
      size: sizeLabel,
      color: colorLabel,
    })

    // Redirect to checkout
    router.push('/finalizar-compra')
  }

  // view_item — dispara uma vez ao montar a página
  useEffect(() => {
    trackViewItem({
      id: String(product.databaseId),
      name: product.name.replace(/ - Jaleca$/i, ''),
      price: product.price ?? '',
      category: product.productCategories?.nodes[0]?.name,
      email: user?.email,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load reviews
  // Prepopulate review form if logged in
  useEffect(() => {
    if (user) {
      setReviewName(user.name)
      setReviewEmail(user.email)
    }
  }, [user])


  // Load variation galleries from GraphQL jalecaGalleryImages (no REST fallback)
  useEffect(() => {
    if (!product.variations?.nodes.length) return
    const fromGraphQL: Record<number, GalleryImage[]> = {}
    for (const v of product.variations.nodes) {
      if (v.jalecaGalleryImages && v.jalecaGalleryImages.length > 0) {
        fromGraphQL[v.databaseId] = v.jalecaGalleryImages
      }
    }
    if (Object.keys(fromGraphQL).length > 0) setVariationGalleries(fromGraphQL)
  }, [product.variations])

  // Track recently viewed
  useEffect(() => {
    try {
      const MAX = 8
      const key = 'jaleca-recently-viewed'
      const existing: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
      const updated = [product.slug, ...existing.filter(s => s !== product.slug)].slice(0, MAX)
      localStorage.setItem(key, JSON.stringify(updated))
    } catch {}
  }, [product.slug])

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    setReviewError('')
    setReviewSubmitting(true)
    try {
      const res = await fetch(`/api/reviews/${product.databaseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          review: reviewText,
          reviewer: reviewName,
          reviewer_email: reviewEmail,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        setReviewError(err.error || 'Erro ao enviar avaliação')
        return
      }
      const newReview = await res.json()
      setReviews(prev => [newReview, ...prev])
      setReviewText('')
      setReviewRating(5)
      setReviewSuccess(true)
    } catch {
      setReviewError('Erro ao enviar avaliação')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  // SKU: variation sku or product sku
  const displaySku = matchedVariation?.sku || product.sku

  // Attributes for "Informações Adicionais" tab
  const productAttributes = product.attributes?.nodes ?? []

  const productName = product.name.replace(/ - Jaleca$/i, '')
  const categoryNode = product.productCategories?.nodes[0]
  const whatsappText = encodeURIComponent(`Olá! Gostaria de tirar dúvidas sobre o produto: ${productName} (jaleca.com.br/produto/${product.slug})`)

  return (
    <>
    <main className="py-8 md:py-12">
      <div className="container">
        <Breadcrumb crumbs={[
          { label: 'Início', href: '/' },
          { label: 'Produtos', href: '/produtos' },
          ...(categoryNode ? [{ label: categoryNode.name, href: `/produtos?cat=${categoryNode.name}` }] : []),
          { label: productName },
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-8 md:gap-16 lg:gap-20 items-start">
          {/* Mobile header — nome + badges + trust acima da foto (só mobile) */}
          <div className="md:hidden order-1 col-span-full pb-2">
            <p className="text-[13px] text-primary-text tracking-[0.2em] uppercase mb-1">Jaleca</p>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.03em] mb-2 text-balance">
              {product.name.replace(/ - Jaleca$/i, '')}
            </h1>
            {isBestSeller(product.slug) && (
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#c4a97d] px-4 py-2 mb-3 self-start">
                <span className="text-sm">🏆</span>
                <span className="text-[12px] font-bold tracking-[0.2em] uppercase">Campeão de Vendas</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground"><span className="text-green-600">✔</span> Envio rápido para todo o Brasil</span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground"><span className="text-green-600">✔</span> Troca fácil em até 30 dias</span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground"><span className="text-green-600">✔</span> Compra 100% segura</span>
            </div>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={Math.round(avgRating)} size={13} />
                <span className="text-xs text-muted-foreground">{avgRating.toFixed(1)}</span>
              </div>
            ) : googlePlace && googlePlace.reviewCount > 0 ? (
              <button onClick={() => setActiveTab('avaliacoes')} className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                <StarRating rating={Math.round(googlePlace.rating)} size={13} />
                <span className="underline underline-offset-2"><strong className="text-foreground font-medium">{googlePlace.rating.toFixed(1)}</strong> no Google</span>
              </button>
            ) : null}
          </div>

          {/* Image gallery — order-2 no mobile */}
          <div ref={galleryRef} className="flex flex-col gap-3 order-2 md:order-none">
            {/* Main image with zoom */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-secondary/20 ring-1 ring-secondary/30"
                 title="Passe o mouse para ver os detalhes"
                 onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
                 onTouchEnd={e => {
                   if (touchStartX.current === null || allImages.length <= 1) return
                   const delta = e.changedTouches[0].clientX - touchStartX.current
                   if (delta < -50) setActiveImageIdx(i => Math.min(i + 1, allImages.length - 1))
                   else if (delta > 50) setActiveImageIdx(i => Math.max(i - 1, 0))
                   touchStartX.current = null
                 }}>
              {displayImage?.sourceUrl ? (
                <ImageZoom
                  key={displayImage.sourceUrl}
                  src={displayImage.sourceUrl}
                  alt={displayImage.altText || product.name}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Sem imagem
                </div>
              )}
              {allImages.length > 1 && (
                <>
                  <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none hidden md:block">
                    🔍 Zoom
                  </div>
                  {/* Dots — indicador de swipe no mobile */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden pointer-events-none">
                    {allImages.map((_, idx) => (
                      <span key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${idx === activeImageIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryLoading ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-16 h-20 rounded-md bg-secondary/40 animate-pulse" />
                ))}
              </div>
            ) : allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={img.sourceUrl}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={img.altText || `Ver imagem ${idx + 1} do produto`}
                    aria-pressed={activeImageIdx === idx}
                    className={`flex-shrink-0 w-16 h-20 relative overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      activeImageIdx === idx
                        ? 'border-primary shadow-sm'
                        : 'border-border hover:border-foreground/40'
                    }`}
                  >
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || `${product.name} ${idx + 1}`}
                      width={64}
                      height={80}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info — order-3 no mobile, coluna direita no desktop */}
          <div className="flex flex-col md:pt-4 order-3 md:order-none">
            {/* Desktop only: nome + badge + trust + rating (no mobile ficam acima da foto) */}
            <div className="hidden md:block">
              <p className="text-[11px] text-primary-text tracking-[0.28em] uppercase mb-1">Jaleca</p>
              <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-[-0.03em] mb-2 text-balance">
                {product.name.replace(/ - Jaleca$/i, '')}
              </h1>
              {isBestSeller(product.slug) && (
                <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#c4a97d] px-4 py-2 mb-4 self-start">
                  <span className="text-sm">🏆</span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Campeão de Vendas</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="text-green-600">✔</span> Envio rápido para todo o Brasil</span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="text-green-600">✔</span> Troca fácil em até 30 dias</span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="text-green-600">✔</span> Compra 100% segura</span>
              </div>
              {reviews.length > 0 ? (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={Math.round(avgRating)} size={13} />
                  <span className="text-xs text-muted-foreground">{avgRating.toFixed(1)}</span>
                </div>
              ) : googlePlace && googlePlace.reviewCount > 0 ? (
                <button onClick={() => setActiveTab('avaliacoes')} className="flex items-center gap-2 mb-4 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                  <StarRating rating={Math.round(googlePlace.rating)} size={13} />
                  <span className="underline underline-offset-2 group-hover:no-underline">
                    <strong className="text-foreground font-medium">{googlePlace.rating.toFixed(1)}</strong>{' '}no Google
                  </span>
                </button>
              ) : null}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl md:text-[2rem] font-semibold tabular-nums">
                {displayPrice}
              </span>
              {isOnSale && activeRegular && (
                <span className="text-base text-muted-foreground line-through tabular-nums">{activeRegular}</span>
              )}
            </div>

            {/* PIX / Installments pricing */}
            {priceValue > 0 && (
              <div className="mb-3 space-y-0.5">
                {installmentValue > 0 && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <CreditCard size={13} />
                    3x de {formatCurrency(installmentValue)} sem juros
                  </p>
                )}
                {pixPrice > 0 && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Banknote size={13} />
                    {formatCurrency(pixPrice)} no PIX (5% de desconto)
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <StockBadge status={stockStatus} quantity={stockQty} />
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <div
                className="max-w-[52ch] text-sm md:text-[15px] text-muted-foreground leading-relaxed mb-8 text-pretty prose prose-sm"
                dangerouslySetInnerHTML={{ __html: cleanHtml(product.shortDescription) }}
              />
            )}

            {/* Available colors - SEO links */}
            {colorSlugs.length > 0 && (
              <div className="mb-8 text-sm text-muted-foreground">
                <span className="font-medium">Cores disponíveis: </span>
                {colorSlugs.map((slug, idx) => {
                  const label = colorNames[slug] ?? slug
                  const colorSlugPart = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                  const colorUrl = `/produto/${product.slug}-${colorSlugPart}`
                  return (
                    <span key={slug}>
                      <Link
                        href={colorUrl}
                        className="text-primary-text hover:underline underline-offset-2"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedColor(slug)
                          window.history.pushState({ color: slug }, '', colorUrl)
                        }}
                      >
                        {label}
                      </Link>
                      {idx < colorSlugs.length - 1 && ', '}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Color/Estampa selector */}
            {colorSlugs.length > 0 && (
              <div className={`mb-6 ${shakeColor ? 'animate-shake' : ''}`}>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  {formatAttrLabel(colorAttrDef?.name ?? 'Cor')}{selectedColor ? `: ${colorNames[selectedColor] ?? selectedColor}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colorSlugs.map(slug => {
                    const label = colorNames[slug] ?? slug
                    const isActive = selectedColor === slug
                    return (
                      <button
                        key={slug}
                        onClick={() => {
                          const newColor = isActive ? null : slug
                          setSelectedColor(newColor)

                          // Update URL without page reload (SEO + browser history)
                          if (typeof window !== 'undefined') {
                            const colorSlugPart = newColor
                              ? `-${(colorNames[newColor] ?? newColor).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`
                              : ''
                            const newUrl = `/produto/${product.slug}${colorSlugPart}`
                            window.history.pushState({ color: newColor }, '', newUrl)
                          }
                        }}
                        aria-label={`Cor ${label}${isActive ? ' (selecionada)' : ''}`}
                        aria-pressed={isActive}
                        className={`filter-chip min-h-12 px-4 py-2 text-xs font-medium tracking-wide uppercase ${isActive ? 'filter-chip--active' : ''}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizeSlugs.length > 0 && (
              <div className={`mb-6 ${shakeSize ? 'animate-shake' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    Tamanho{selectedSize ? `: ${sizeNames[selectedSize] ?? selectedSize.toUpperCase()}` : ''}
                  </p>
                  <button
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary-text hover:underline underline-offset-4"
                  >
                    <Ruler size={12} /> Tabela de medidas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeSlugs.map(slug => {
                    const label = sizeNames[slug] ?? slug.toUpperCase()
                    const isActive = selectedSize === slug
                    return (
                      <button
                        key={slug}
                        onClick={() => setSelectedSize(isActive ? null : slug)}
                        aria-label={`Tamanho ${label}${isActive ? ' (selecionado)' : ''}`}
                        aria-pressed={isActive}
                        className={`filter-chip flex h-12 w-12 items-center justify-center text-xs font-medium tracking-wide uppercase ${isActive ? 'filter-chip--active' : ''}`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Descubra seu Tamanho — logo após seletor de tamanho */}
            {sizeSlugs.length > 0 && (
              <button
                onClick={() => setShowAdvisor(true)}
                className="inline-flex w-full min-h-11 items-center justify-center border border-secondary bg-background px-6 py-3 text-xs font-semibold tracking-widest uppercase text-secondary transition-all duration-300 hover:bg-secondary hover:text-background active:scale-[0.98] rounded-none mb-6"
              >
                Descubra seu Tamanho Ideal
              </button>
            )}

            {/* Inline size chart */}
            {showSizeChart && (
              <div className="mb-8 overflow-hidden border border-border animate-fade-in">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-secondary/30">
                      <th className="py-2 px-3 text-left font-semibold">Tam.</th>
                      <th className="py-2 px-3 text-left font-semibold">Busto</th>
                      <th className="py-2 px-3 text-left font-semibold">Cintura</th>
                      <th className="py-2 px-3 text-left font-semibold">Quadril</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'PP', busto: '82-86', cintura: '64-68', quadril: '88-92' },
                      { size: 'P',  busto: '86-90', cintura: '68-72', quadril: '92-96' },
                      { size: 'M',  busto: '90-94', cintura: '72-76', quadril: '96-100' },
                      { size: 'G',  busto: '94-100', cintura: '76-82', quadril: '100-106' },
                      { size: 'GG', busto: '100-106', cintura: '82-88', quadril: '106-112' },
                      { size: 'XGG', busto: '106-112', cintura: '88-94', quadril: '112-118' },
                    ].map(row => (
                      <tr key={row.size} className="border-t border-border">
                        <td className="py-2 px-3 font-medium">{row.size}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.busto}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.cintura}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.quadril}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Viewers counter */}
            {viewerCount !== null && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <span>🔥</span>
                <span><strong className="text-foreground">{viewerCount} pessoas</strong> viram isso nas últimas 24h</span>
              </p>
            )}

            {/* Stock urgency */}
            {stockQty != null && stockQty >= 1 && stockQty <= 10 && (
              <div className="mb-3">
                {stockQty <= 5 ? (
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                    <Flame size={14} className="flex-shrink-0" />
                    Últimas unidades disponíveis!
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    Poucas unidades disponíveis
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div ref={addToCartBtnRef} className="flex flex-col gap-3 mt-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-ink px-6 py-4 text-xs font-semibold tracking-widest uppercase text-background transition-transform duration-300 hover:bg-ink active:scale-[0.98] ${!canAdd ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <ShoppingBag size={18} />
                  {isOutOfStock ? 'Esgotado nessa variação' : 'Adicionar à Sacola'}
                </button>
                <button
                  onClick={() => toggleWishlist(String(product.databaseId))}
                  className={`h-14 w-14 rounded-full border border-border bg-background transition-colors hover:bg-muted active:scale-95 flex items-center justify-center ${
                    inWishlist ? 'text-red-500' : 'text-foreground'
                  }`}
                  aria-label={inWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart size={20} className={inWishlist ? 'fill-red-500' : ''} />
                </button>
              </div>
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className={`w-full inline-flex min-h-14 items-center justify-center gap-2 border-2 border-ink px-6 py-4 text-xs font-semibold tracking-widest uppercase text-ink bg-background transition-all duration-300 hover:bg-ink hover:text-background active:scale-[0.98] ${!canAdd ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <CreditCard size={18} />
                  Comprar Agora
                </button>
              )}
            </div>
            {!canAdd && !isOutOfStock && (colorSlugs.length > 0 || sizeSlugs.length > 0) && (
              <p className="text-xs text-muted-foreground mt-2">
                Escolha {colorSlugs.length > 0 && sizeSlugs.length > 0 ? 'cor e tamanho' : colorSlugs.length > 0 ? 'a cor' : 'o tamanho'} para adicionar à sacola
              </p>
            )}
            {/* WhatsApp — ask about this product */}
            <a
              href={`https://wa.me/5531992901940?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <MessageCircle size={14} />
              Dúvidas sobre este produto? Fale conosco pelo WhatsApp
            </a>


            {isOutOfStock && (
              <div className="mt-3">
                <BackInStockButton productId={product.slug} productName={product.name.replace(/ - Jaleca$/i, '')} />
              </div>
            )}
          </div>
        </div>

        {/* Content tabs */}
        <div className="mt-16 md:mt-24">
          {/* Tab headers */}
          <div role="tablist" aria-label="Informações do produto" className="flex flex-wrap gap-2 border-b border-border pb-0">
            {([
              { id: 'dados-tecnicos', label: 'Dados Técnicos' },
              { id: 'informacoes', label: 'Informações Adicionais' },
              { id: 'avaliacoes', label: `Avaliações${reviews.length > 0 ? ` (${reviews.length})` : ''}` },
            ] as { id: ActiveTab; label: string }[]).map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 md:py-3 text-[13px] md:text-[11px] font-semibold tracking-[0.15em] md:tracking-[0.18em] uppercase transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-foreground text-foreground bg-transparent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            role="tabpanel"
            id={`tab-panel-${activeTab}`}
            aria-label={activeTab === 'dados-tecnicos' ? 'Dados Técnicos' : activeTab === 'informacoes' ? 'Informações Adicionais' : 'Avaliações'}
            className="py-8"
          >
            {/* Dados Técnicos */}
            {activeTab === 'dados-tecnicos' && (
              <div className="max-w-3xl">
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">Dados Técnicos</h2>
                {product.description ? (
                  <div className="technical-content">
                    <div
                      dangerouslySetInnerHTML={{ __html: formatTechnicalContent(product.description) }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Informações técnicas não disponíveis.</p>
                )}
              </div>
            )}

            {/* Informações Adicionais */}
            {activeTab === 'informacoes' && (
              <div className="max-w-lg">
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">Informações Adicionais</h2>
                {productAttributes.length > 0 ? (
                  <table className="w-full text-sm border border-border">
                    <tbody>
                      {productAttributes.map(attr => (
                        <tr key={attr.name} className="border-b border-border last:border-0">
                          <td className="py-3 px-4 font-semibold capitalize w-1/3 bg-secondary/10">
                            {attr.name.replace(/^pa_/, '').replace(/_/g, ' ')}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {attr.terms?.nodes?.map(t => t.name).join(', ') || attr.options.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">Informações adicionais não disponíveis.</p>
                )}
              </div>
            )}

            {/* Avaliações */}
            {activeTab === 'avaliacoes' && (
              <div>
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-[1fr_360px] gap-12">
                    {/* Reviews list */}
                    <div>
                      {reviews.length === 0 && googlePlace && googlePlace.reviewCount > 0 ? (
                        <div>
                          {/* Google Reviews badge */}
                          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                            <div className="text-3xl">⭐</div>
                            <div>
                              <p className="text-sm font-semibold text-green-800">
                                {googlePlace.rating.toFixed(1)} / 5,0 — Avaliação no Google
                              </p>
                              <p className="text-xs text-green-700">
                                Avaliações verificadas de clientes reais
                              </p>
                              {googlePlace.mapsUrl && (
                                <a
                                  href={googlePlace.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-green-600 underline hover:no-underline"
                                >
                                  Ver todas no Google →
                                </a>
                              )}
                            </div>
                          </div>
                          {/* Google review excerpts */}
                          <div className="space-y-4">
                            {googlePlace.reviews.map((r, i) => (
                              <div key={i} className="border-b border-border pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <StarRating rating={r.rating} size={11} />
                                  <span className="text-[13px] md:text-[11px] text-muted-foreground">{r.authorName} · {r.relativeTime}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{r.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map(review => (
                            <div key={review.id} className="border-b border-border pb-6">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-secondary/40 flex items-center justify-center text-sm font-semibold">
                                  {review.reviewer.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{review.reviewer}</p>
                                  <div className="flex items-center gap-2">
                                    <StarRating rating={review.rating} size={12} />
                                    <span className="text-[11px] text-muted-foreground">
                                      {new Date(review.date_created).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {stripHtml(review.review)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review form */}
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-4">Deixe sua Avaliação</h3>
                      {reviewSuccess ? (
                        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
                          Obrigada pela sua avaliação! Ela será publicada após revisão.
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <p className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5" id="review-rating-label">
                              Nota
                            </p>
                            <div className="flex items-center gap-1" role="group" aria-labelledby="review-rating-label">
                              {[1, 2, 3, 4, 5].map(i => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setReviewRating(i)}
                                  aria-label={`${i} ${i === 1 ? 'estrela' : 'estrelas'}`}
                                  aria-pressed={reviewRating === i}
                                  className="transition-transform hover:scale-110 active:scale-95"
                                >
                                  <Star
                                    size={24}
                                    aria-hidden="true"
                                    className={i <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label htmlFor="review-name" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Nome *</label>
                            <input
                              id="review-name"
                              type="text"
                              value={reviewName}
                              onChange={e => setReviewName(e.target.value)}
                              required
                              autoComplete="name"
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="review-email" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Email *</label>
                            <input
                              id="review-email"
                              type="email"
                              value={reviewEmail}
                              onChange={e => setReviewEmail(e.target.value)}
                              required
                              autoComplete="email"
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="review-text" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Avaliação *</label>
                            <textarea
                              id="review-text"
                              value={reviewText}
                              onChange={e => setReviewText(e.target.value)}
                              required
                              rows={4}
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                              placeholder="Conte sua experiência..."
                            />
                          </div>
                          {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}
                          <button
                            type="submit"
                            disabled={reviewSubmitting}
                            className="w-full bg-ink text-background py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                          >
                            {reviewSubmitting && <Loader2 size={14} className="animate-spin" />}
                            Enviar Avaliação
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-8 md:mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">Você também pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        <RecentlyViewed excludeSlug={product.slug} />
      </div>
    </main>

    {showAdvisor && (
      <SizeAdvisorModal
        productName={product.name.replace(/ - Jaleca$/i, '')}
        onClose={() => setShowAdvisor(false)}
      />
    )}

    {isBestSeller(product.slug) && <UrgencyToast />}

    {/* Sticky Add-to-Cart — mobile only, aparece quando botão original sai da viewport */}
    {showStickyBar && !isOutOfStock && (
      <div className="fixed left-0 right-0 z-[80] md:hidden bg-background border-t border-border px-4 py-3 flex items-center gap-3 shadow-lg animate-fade-up" style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom))' }}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{product.name.replace(/ - Jaleca$/i, '')}</p>
          <p className="text-base font-bold text-foreground">{displayPrice}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="flex-shrink-0 bg-ink text-background px-6 min-h-[56px] text-xs font-semibold tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
        >
          <ShoppingBag size={16} />
          {canAdd ? 'COMPRAR' : 'ESCOLHA COR/TAM'}
        </button>
      </div>
    )}

    </>
  )
}
