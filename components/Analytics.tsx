'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GOOGLE_ADS_ID = 'AW-18072506944'

// ── GA4 helpers ──────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    uetq?: unknown[]
  }
}

// Lê o cookie _fbc (Meta Click ID) — presente apenas quando usuário veio de anúncio Meta
function getFbc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)_fbc=([^;]+)/)
  return match?.[1]
}

// Lê o cookie _fbp (Meta Browser ID) — gerado automaticamente para TODOS os visitantes pelo Pixel
// É o sinal de identidade mais importante para usuários anônimos (melhora match quality)
function getFbp(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/)
  return match?.[1]
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return
  window.gtag?.('event', name, params)
  window.fbq?.('trackCustom', name, params)
}

// Retorna true se este dispositivo for tráfego interno (Ipatinga/testes)
function isInternalTraffic(): boolean {
  try {
    return localStorage.getItem('jaleca_internal_traffic') === '1'
  } catch {
    return false
  }
}

export function trackPurchase(
  orderId: string,
  value: number,
  items: Array<{ id: string; name: string; price: number; quantity: number }>
) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return // ignora tráfego de teste (ex: Ipatinga)

  // GA4 purchase — importado pelo Google Ads como "Compra (purchase)"
  window.gtag?.('event', 'purchase', {
    transaction_id: orderId,
    value,
    currency: 'BRL',
    items: items.map(i => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  })

  // Google Ads conversion direta — mapeada à ação "PURCHASE" (conversion_event_purchase)
  window.gtag?.('event', 'conversion_event_purchase', {
    transaction_id: orderId,
    value,
    currency: 'BRL',
  })

  // Meta Pixel — eventID deve coincidir com CAPI para deduplicação correta
  const purchaseFbc = getFbc()
  const purchaseFbp = getFbp()
  window.fbq?.('track', 'Purchase', {
    value,
    currency: 'BRL',
    contents: items.map(i => ({ id: i.id, quantity: i.quantity })),
    content_type: 'product',
    num_items: items.reduce((s, i) => s + i.quantity, 0),
    ...(purchaseFbc && { fbc: purchaseFbc }),
    ...(purchaseFbp && { fbp: purchaseFbp }),
  }, { eventID: `purchase_${orderId}` })
}

export function trackViewItem(product: {
  id: string
  name: string
  price: string
  category?: string
  email?: string
}) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return

  const price = parseFloat(product.price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0

  // GA4
  window.gtag?.('event', 'view_item', {
    currency: 'BRL',
    value: price,
    items: [{ item_id: product.id, item_name: product.name, price, item_category: product.category }],
  })

  // Meta Pixel
  const viewFbc = getFbc()
  const viewFbp = getFbp()
  window.fbq?.('track', 'ViewContent', {
    value: price,
    currency: 'BRL',
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    content_category: product.category ?? 'Uniformes Profissionais',
    ...(viewFbc && { fbc: viewFbc }),
    ...(viewFbp && { fbp: viewFbp }),
    ...(product.email && { em: product.email }),
  })
}

export function trackInitiateCheckout(value: number, numItems: number) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return

  // GA4
  window.gtag?.('event', 'begin_checkout', {
    currency: 'BRL',
    value,
  })

  // Meta Pixel
  const checkoutFbc = getFbc()
  const checkoutFbp = getFbp()
  window.fbq?.('track', 'InitiateCheckout', {
    value,
    currency: 'BRL',
    num_items: numItems,
    ...(checkoutFbc && { fbc: checkoutFbc }),
    ...(checkoutFbp && { fbp: checkoutFbp }),
  })
}

export function trackSearch(term: string) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return

  // GA4
  window.gtag?.('event', 'search', { search_term: term })

  // Meta Pixel
  window.fbq?.('track', 'Search', { search_string: term })
}

export function trackAddPaymentInfo(value: number, method: string) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return
  window.fbq?.('track', 'AddPaymentInfo', {
    value,
    currency: 'BRL',
    content_category: method,
  })
}

export function trackAddToCart(product: {
  id: string
  name: string
  price: string
  quantity?: number
}) {
  if (typeof window === 'undefined') return
  if (isInternalTraffic()) return

  const price = parseFloat(product.price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
  const qty = product.quantity ?? 1

  // GA4
  window.gtag?.('event', 'add_to_cart', {
    currency: 'BRL',
    value: price * qty,
    items: [{ item_id: product.id, item_name: product.name, price, quantity: qty }],
  })

  // Meta Pixel
  const cartFbc = getFbc()
  const cartFbp = getFbp()
  window.fbq?.('track', 'AddToCart', {
    value: price * qty,
    currency: 'BRL',
    contents: [{ id: product.id, quantity: qty }],
    content_type: 'product',
    ...(cartFbc && { fbc: cartFbc }),
    ...(cartFbp && { fbp: cartFbp }),
  })
}

// ── Pageview tracker (inner — needs Suspense) ─────────────────────────────────

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA4_ID || !window.gtag) return
    // Não rastrear rotas internas de admin
    if (pathname.startsWith('/blog/admin')) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA4_ID, { page_path: url })
    window.fbq?.('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Analytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="lazyOnload"
          />
          <Script
            id="ga4-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', { send_page_view: false });
                gtag('config', '${GOOGLE_ADS_ID}');
                // Captura client_id assim que GA4 inicializa e persiste no localStorage
                // Usado no checkout para rastreamento server-side via GA4 Measurement Protocol
                gtag('get', '${GA4_ID}', 'client_id', function(cid) {
                  if (cid) { try { localStorage.setItem('jaleca_ga4_cid', cid); } catch(e){} }
                });
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel */}
      {META_PIXEL_ID && (
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
            `,
          }}
        />
      )}

      {/* Pageview tracking on route changes */}
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
