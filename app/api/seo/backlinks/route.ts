import { NextRequest, NextResponse } from 'next/server'
import {
  fetchBacklinksSummary,
  fetchAnchors,
  fetchReferringDomains,
  fetchBrokenBacklinks,
  fetchTimeseries,
  fetchDomainIntersection,
  extractPbnDomains,
  extractCylexLinks,
} from '@/lib/dataforseo/backlinks'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') ?? 'summary'
  const target2 = searchParams.get('target2') ?? 'amodabranca.com.br'
  const limit = parseInt(searchParams.get('limit') ?? '100')
  const dateFrom = searchParams.get('dateFrom') ?? '2026-03-01'
  const dateTo = searchParams.get('dateTo') ?? new Date().toISOString().split('T')[0]

  try {
    switch (action) {
      case 'summary': {
        const data = await fetchBacklinksSummary()
        return NextResponse.json(data)
      }

      case 'anchors': {
        const data = await fetchAnchors()
        return NextResponse.json({ anchors: data })
      }

      case 'domains': {
        const data = await fetchReferringDomains(limit)
        return NextResponse.json({ domains: data })
      }

      case 'broken': {
        const data = await fetchBrokenBacklinks(limit)
        const cylex = extractCylexLinks(data)
        const pbn = extractPbnDomains(data)
        return NextResponse.json({
          total: data.length,
          cylex_legitimate: cylex,
          pbn_domains: pbn,
          full_data: data,
        })
      }

      case 'timeseries': {
        const data = await fetchTimeseries(dateFrom, dateTo)
        return NextResponse.json({ timeseries: data })
      }

      case 'intersection': {
        const data = await fetchDomainIntersection(target2)
        return NextResponse.json(data)
      }

      case 'report': {
        const [summary, anchors, broken, timeseries] = await Promise.all([
          fetchBacklinksSummary(),
          fetchAnchors(),
          fetchBrokenBacklinks(limit),
          fetchTimeseries(dateFrom, dateTo),
        ])
        const pbn = extractPbnDomains(broken)
        const cylex = extractCylexLinks(broken)
        return NextResponse.json({
          summary,
          anchors,
          broken_backlinks: broken,
          timeseries,
          action_items: {
            disavow_domains: pbn,
            cylex_redirects: cylex,
            total_broken: broken.length,
            pbn_count: pbn.length,
            cylex_count: cylex.length,
          },
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[SEO Backlinks API]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}