import { dataForSeoRequest } from './client'

const TARGET = 'jaleca.com.br'

export interface BacklinkSummary {
  target: string
  rank: number
  backlinks: number
  referring_domains: number
  crawled_pages: number
  spam_score: number
  first_seen: string
  broken_backlinks: number
  countries: Record<string, number>
  platforms: Record<string, number>
}

export interface AnchorData {
  anchor: string | null
  count: number
  spam_score: number
}

export interface ReferringDomain {
  domain: string
  rank: number
  backlinks: number
  spam_score: number
  country: string | null
}

export interface BacklinkItem {
  url_from: string
  url_to: string
  anchor: string | null
  backlink_spam_score: number
  url_to_status_code: number
  is_broken: boolean
  first_seen: string
}

export interface TimeseriesData {
  date: string
  new_backlinks: number
  lost_backlinks: number
  new_referring_domains: number
  lost_referring_domains: number
}

export async function fetchBacklinksSummary(): Promise<BacklinkSummary> {
  const data = await dataForSeoRequest<{
    tasks: Array<{ result: Array<{ items: Array<Record<string, unknown>> }> }>
  }>('/backlinks/summary/live', [{ target: TARGET }])

  const item = data.tasks?.[0]?.result?.[0]?.items?.[0] as Record<string, unknown> | undefined

  return {
    target: String(item?.target ?? TARGET),
    rank: Number(item?.rank ?? 0),
    backlinks: Number(item?.backlinks ?? 0),
    referring_domains: Number(item?.referring_domains ?? 0),
    crawled_pages: Number(item?.crawled_pages ?? 0),
    spam_score: Number(item?.backlinks_spam_score ?? 0),
    first_seen: String(item?.first_seen ?? ''),
    broken_backlinks: Number(item?.broken_backlinks ?? 0),
    countries: (item?.referring_links_countries as Record<string, number>) ?? {},
    platforms: (item?.referring_links_platform_types as Record<string, number>) ?? {},
  }
}

export async function fetchAnchors(): Promise<AnchorData[]> {
  const data = await dataForSeoRequest<{
    tasks: Array<{ result: Array<{ items: AnchorData[] }> }>
  }>('/backlinks/anchors/live', [{ target: TARGET }])

  return data.tasks?.[0]?.result?.[0]?.items ?? []
}

export async function fetchReferringDomains(limit = 50): Promise<ReferringDomain[]> {
  const data = await dataForSeoRequest<{
    tasks: Array<{ result: Array<{ items: ReferringDomain[] }> }>
  }>('/backlinks/referring_domains/live', [{ target: TARGET, limit }])

  return data.tasks?.[0]?.result?.[0]?.items ?? []
}

export async function fetchBrokenBacklinks(limit = 100): Promise<BacklinkItem[]> {
  const data = await dataForSeoRequest<{
    tasks: Array<{ result: Array<{ items: BacklinkItem[]; total_count: number }> }>
  }>('/backlinks/backlinks/live', [
    {
      target: TARGET,
      limit,
      filters: ['is_broken', '=', true],
    },
  ])

  return data.tasks?.[0]?.result?.[0]?.items ?? []
}

export async function fetchTimeseries(dateFrom: string, dateTo: string): Promise<TimeseriesData[]> {
  const data = await dataForSeoRequest<{
    tasks: Array<{ result: Array<{ items: TimeseriesData[] }> }>
  }>('/backlinks/timeseries_new_lost_summary/live', [
    { target: TARGET, date_from: dateFrom, date_to: dateTo },
  ])

  return data.tasks?.[0]?.result?.[0]?.items ?? []
}

export async function fetchDomainIntersection(target2: string): Promise<{
  domains: Array<{ domain: string; rank: number; spam_score: number; jl_backlinks: number; amoda_backlinks: number }>
  total_count: number
}> {
  const data = await dataForSeoRequest<{
    tasks: Array<{
      result: Array<{
        total_count?: number
        items: Array<{
          domain_intersection: Record<string, { target: string; rank: number; backlinks_spam_score: number; backlinks: number }>
        }>
      }>
    }>
  }>('/backlinks/domain_intersection/live', [
    { targets: { '1': TARGET, '2': target2 }, limit: 50 },
  ])

  const items = data.tasks?.[0]?.result?.[0]?.items ?? []
  const domains = items.map((item: { domain_intersection: Record<string, { target: string; rank: number; backlinks_spam_score: number; backlinks: number }> }) => {
    const d = item.domain_intersection
    return {
      domain: d['1']?.target ?? '',
      rank: d['1']?.rank ?? 0,
      spam_score: d['1']?.backlinks_spam_score ?? 0,
      jl_backlinks: d['1']?.backlinks ?? 0,
      amoda_backlinks: d['2']?.backlinks ?? 0,
    }
  })

  const result = data.tasks?.[0]?.result?.[0] as { total_count?: number; items?: unknown[] } | undefined
  return { domains, total_count: result?.total_count ?? 0 }
}

export function extractPbnDomains(backlinks: BacklinkItem[], minSpamScore = 50): string[] {
  const domains: string[] = []
  const seen = new Set<string>()
  backlinks
    .filter(b => b.backlink_spam_score >= minSpamScore && !b.url_from.includes('cylex'))
    .forEach(b => {
      try {
        const host = new URL(b.url_from).hostname
        if (!seen.has(host)) {
          seen.add(host)
          domains.push(host)
        }
      } catch { /* skip */ }
    })
  return domains.sort()
}

export function extractCylexLinks(backlinks: BacklinkItem[]): Array<{ from: string; to: string }> {
  return backlinks
    .filter(b => b.url_from.includes('cylex') && b.url_to.includes(TARGET))
    .map(b => ({ from: b.url_from, to: b.url_to }))
}