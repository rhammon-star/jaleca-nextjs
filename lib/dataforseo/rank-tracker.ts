import { dataForSeoRequest } from './client'
import fs from 'fs/promises'
import path from 'path'

const POSITIONS_FILE = path.join(process.cwd(), 'data/seo-tracking/positions.json')
const LOCATION_CODE = 1001767 // Brasil
const LANGUAGE_CODE = 'pt'

export const KEYWORDS_TO_TRACK = [
  // Core — maior volume
  'jalecos',
  'jaleco feminino',
  'jaleco masculino',
  'jaleco branco',
  'comprar jaleco online',

  // Cluster pages PRD SEO
  'melhor marca de jaleco',
  'jaleco premium',
  'jaleco estiloso',

  // Domínios satélite — keywords diretas
  'jaleco slim',
  'jaleco slim feminino',
  'jaleco princesa',
  'jaleco preto',
  'jaleco de luxo',
  'jaleco médico',
  'jaleco universitário',
  'loja de jaleco',
  'comprar jaleco feminino',

  // Hubs profissão — maior potencial comercial
  'jaleco para dentista',
  'jaleco para médico',
  'jaleco para enfermeira',
  'jaleco para veterinário',
  'jaleco para farmacêutico',
  'jaleco para barbeiro',
  'jaleco para advogado',
  'jaleco para cozinheiro',
]

export interface PositionRecord {
  keyword: string
  position: number | null
  url: string | null
  title: string | null
  date: string
}

export interface PositionsHistory {
  updatedAt: string
  records: PositionRecord[]
}

export async function fetchCurrentPositions(): Promise<PositionRecord[]> {
  const payload = KEYWORDS_TO_TRACK.map((keyword) => ({
    keyword,
    location_code: LOCATION_CODE,
    language_code: LANGUAGE_CODE,
    device: 'desktop',
    depth: 100,
  }))

  const data = await dataForSeoRequest<{ tasks: Array<{ result: Array<{ items: Array<{ type: string; rank_absolute: number; url: string; title: string }> }> }> }>(
    '/serp/google/organic/live/advanced',
    payload
  )

  const date = new Date().toISOString()

  return KEYWORDS_TO_TRACK.map((keyword, i) => {
    const task = data.tasks?.[i]
    const items = task?.result?.[0]?.items ?? []

    const jalecaResult = items.find(
      (item) =>
        item.type === 'organic' &&
        item.url?.includes('jaleca.com.br')
    )

    return {
      keyword,
      position: jalecaResult?.rank_absolute ?? null,
      url: jalecaResult?.url ?? null,
      title: jalecaResult?.title ?? null,
      date,
    }
  })
}

export async function loadHistory(): Promise<PositionsHistory | null> {
  try {
    const raw = await fs.readFile(POSITIONS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function saveHistory(records: PositionRecord[]): Promise<void> {
  const history: PositionsHistory = {
    updatedAt: new Date().toISOString(),
    records,
  }
  await fs.writeFile(POSITIONS_FILE, JSON.stringify(history, null, 2))
}

export function detectDrops(
  previous: PositionRecord[],
  current: PositionRecord[],
  threshold = 3
): Array<{ keyword: string; before: number; after: number }> {
  const drops: Array<{ keyword: string; before: number; after: number }> = []

  for (const curr of current) {
    const prev = previous.find((p) => p.keyword === curr.keyword)
    if (!prev?.position || !curr.position) continue

    const diff = curr.position - prev.position
    if (diff >= threshold) {
      drops.push({ keyword: curr.keyword, before: prev.position, after: curr.position })
    }
  }

  return drops
}
