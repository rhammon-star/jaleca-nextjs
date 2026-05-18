import map from './route-lastmod-map.json'

const MAP = map as Record<string, string>
const FALLBACK = new Date()

/**
 * Resolve last-modification date for a given URL path.
 * Tries: exact match → dynamic segment match (replace last segment with [slug]) → fallback.
 */
export function getLastMod(input: string): Date {
  const path = input.replace(/^https?:\/\/[^/]+/, '') || '/'
  const clean = path.replace(/\/$/, '') || '/'

  if (MAP[clean]) return new Date(MAP[clean])

  // Try dynamic match: replace last segment with [slug]
  const segs = clean.split('/').filter(Boolean)
  if (segs.length > 0) {
    segs[segs.length - 1] = '[slug]'
    const dyn = '/' + segs.join('/')
    if (MAP[dyn]) return new Date(MAP[dyn])
  }

  return FALLBACK
}
