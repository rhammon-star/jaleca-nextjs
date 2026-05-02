import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// URLs de campanhas Google Ads + Meta Ads ativas (Pivot 04/26).
// Cron a cada 5min mantém ISR sempre quente — usuário sempre pega CDN HIT.
const CAMPAIGN_URLS = [
  '/',
  '/categoria/jalecos-femininos', // prioridade máxima — âncora SEO
  '/produto/jaleco-slim-tradicional-manga-curta-feminino-jaleca',
  '/produto/jaleco-slim-tradicional-feminino-jaleca',
  '/produto/jaleco-slim-princesa-manga-curta-feminino-jaleca',
  '/produto/jaleco-slim-princesa-laise-feminino-jaleca',
  '/produto/jaleco-slim-princesa-feminino-jaleca',
  '/produto/jaleco-slim-pala-feminino-jaleca',
  '/produto/jaleco-slim-moratty-feminino-jaleca',
  '/produto/jaleco-slim-gold-pala-feminino-jaleca',
  '/produto/jaleco-slim-gold-feminino-jaleca',
  '/produto/jaleco-slim-feminino-lateral-jaleca',
  '/produto/jaleco-slim-elastex-feminino-jaleca',
  '/produto/jaleco-slim-duquesa-feminino-jaleca',
  '/produto/jaleco-slim-dama-feminino-jaleca',
  '/produto/jaleco-padrao-aluno-feminino-jaleca',
  '/produto/colete-multiuso-jaleca',
  '/produto/macacao-paris-feminino-jaleca',
  '/produto/conjunto-scrub-feminino-jaleca',
  '/produto/conjunto-puff-ziper-feminino-jaleca',
  '/produto/conjunto-princesa-nobre-feminino-jaleca',
  '/produto/conjunto-laco-feminino-jaleca',
  '/produto/conjunto-executiva-feminino-jaleca',
  '/produto/conjunto-dolma-cozinheiro-feminino-jaleca',
  '/produtos',
  '/jaleco-farmaceutico',
  '/jaleco-veterinario',
  '/jaleco-premium',
  '/jaleco-preto-feminino',
  '/jaleco-plus-size',
  '/scrub-feminino',
  '/pijama-cirurgico-feminino',
  '/jaleco-psicologa',
  '/scrub-enfermagem',
  '/jaleco-enfermagem',
  '/jaleco-nutricao',
  '/jaleco-odontologia',
  '/jaleco-farmacia',
  '/jaleco-medicina',
  '/jaleco-fisioterapia',
  '/jaleco-medico',
  '/produto/jaleco-slim-princesa-laise-feminino-jaleca',
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
