// Captura e persiste click-IDs (Google Ads / Meta) e UTMs no localStorage.
// Janela de atribuição: 90 dias (padrão Google Ads).
// Usado pelo checkout para enviar atribuição ao GA4 MP e ao WC meta.

const STORAGE_KEY = 'jaleca_click_ids'
const TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90 dias

export type ClickIds = {
  gclid?: string
  gbraid?: string
  wbraid?: string
  fbclid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  capturedAt?: number
  landingPage?: string
  referrer?: string
}

const TRACKED_KEYS: (keyof ClickIds)[] = [
  'gclid', 'gbraid', 'wbraid', 'fbclid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
]

export function captureClickIds(): void {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    const fresh: Record<string, string> = {}
    for (const key of TRACKED_KEYS) {
      const value = url.searchParams.get(key)
      if (value) fresh[key] = value
    }
    if (Object.keys(fresh).length === 0) return // nada novo na URL — preserva existente

    const existing = readClickIds() ?? {}
    const merged: ClickIds = {
      ...existing,
      ...fresh,
      capturedAt: Date.now(),
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer || existing.referrer,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // ignora — localStorage indisponível ou URL malformada
  }
}

export function readClickIds(): ClickIds | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ClickIds
    if (parsed.capturedAt && Date.now() - parsed.capturedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}
