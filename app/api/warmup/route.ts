import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// URLs de campanhas Google Ads + Meta Ads ativas (Pivot 04/26).
// Cron a cada 5min mantém ISR sempre quente — usuário sempre pega CDN HIT.
// Lista enxuta (09/05/2026): páginas com tráfego real (orgânico GSC + LPs Meta Ads).
const CAMPAIGN_URLS = [
  // Home + categorias principais
  '/',
  '/categoria/jalecos-femininos', // prioridade máxima — âncora SEO
  '/categoria/jalecos-masculinos',
  '/categoria/jalecos',
  '/produtos',
  '/produtos?cat=Conjuntos',

  // LPs de profissão / variação
  '/jaleco-medico',
  '/jaleco-dentista',
  '/jaleco-feminino',

  // Páginas institucionais
  '/nossas-lojas',

  // Cidades com tráfego orgânico (GSC top)
  '/cidade/jaleco-curitiba',
  '/cidade/jaleco-joinville',

  // Produtos top — femininos
  '/produto/jaleco-slim-tradicional-feminino-jaleca',
  '/produto/jaleco-slim-princesa-feminino-jaleca',
  '/produto/jaleco-slim-princesa-laise-feminino-jaleca',
  '/produto/jaleco-slim-gold-feminino-jaleca',
  '/produto/jaleco-slim-elastex-feminino-jaleca',
  '/produto/jaleco-slim-duquesa-feminino-jaleca',
  '/produto/jaleco-slim-dama-feminino-jaleca',

  // Produtos top — masculinos
  '/produto/jaleco-slim-tradicional-masculino-jaleca',
] as const

const SITE_URL = 'https://jaleca.com.br'

async function warmOne(path: string): Promise<{ path: string; status: number; cache: string }> {
  try {
    const res = await fetch(`${SITE_URL}${path}`, {
      headers: { 'User-Agent': 'Jaleca-Cache-Warmer/1.0' },
      signal: AbortSignal.timeout(15000),
    })
    return { path, status: res.status, cache: res.headers.get('x-vercel-cache') || '?' }
  } catch {
    return { path, status: 0, cache: 'ERR' }
  }
}

export async function GET() {
  const results = await Promise.all(CAMPAIGN_URLS.map(warmOne))
  const ok = results.filter(r => r.status === 200).length
  return NextResponse.json({
    ok: true,
    ts: Date.now(),
    warmed: results.length,
    success: ok,
    results,
  })
}
