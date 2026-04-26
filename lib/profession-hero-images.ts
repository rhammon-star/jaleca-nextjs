/**
 * Mapeamento de profissões → foto hero (produto PAI, sem cor)
 *
 * IMPORTANTE: Usar slug do produto PAI, NÃO da variação de cor
 * Exemplo: jaleco-slim-feminino... (correto) vs jaleco-slim-feminino...-branco (errado)
 */

export const PROFESSION_HERO_IMAGES: Record<string, string> = {
  // ── FEMININO ──────────────────────────────────────────────────────────
  'medica': 'jaleco-slim-tradicional-feminino-jaleca',
  'dentista': 'jaleco-slim-tradicional-feminino-jaleca',
  'enfermeira': 'conjunto-scrub-feminino-jaleca',
  'farmaceutica': 'jaleco-slim-tradicional-feminino-jaleca',
  'nutricionista': 'jaleco-slim-tradicional-feminino-jaleca',
  'veterinaria': 'jaleco-slim-tradicional-feminino-jaleca',
  'psicologa': 'conjunto-puff-ziper-feminino-jaleca',
  'fisioterapeuta': 'jaleco-slim-feminino-lateral-jaleca',
  'podologa': 'jaleco-slim-tradicional-feminino-jaleca',
  'podologo': 'jaleco-slim-tradicional-masculino-jaleca',
  'biomedica': 'jaleco-slim-tradicional-feminino-jaleca',
  'cabeleireira': 'jaleco-slim-tradicional-feminino-jaleca',
  'advogada': 'conjunto-executiva-feminino-jaleca',
  'esteticista': 'jaleco-slim-feminino-lateral-jaleca',
  'massagista': 'conjunto-scrub-feminino-jaleca',
  'professora': 'jaleco-padrao-aluno-feminino-jaleca',
  'secretaria': 'conjunto-laco-feminino-jaleca',
  'tatuador': 'jaleco-slim-tradicional-masculino-jaleca',
  'dona-casa': 'conjunto-dolma-cozinheiro-feminino-jaleca',
  'cozinheira': 'conjunto-dolma-cozinheiro-feminino-jaleca',
  'churrasqueira': 'conjunto-dolma-cozinheiro-feminino-jaleca',

  // ── MASCULINO ─────────────────────────────────────────────────────────
  'medico': 'jaleco-slim-tradicional-masculino-jaleca',
  'dentista-masculino': 'jaleco-slim-tradicional-masculino-jaleca',
  'enfermeiro': 'jaleco-slim-tradicional-masculino-jaleca',
  'farmaceutico': 'jaleco-slim-tradicional-masculino-jaleca',
  'veterinario': 'jaleco-slim-tradicional-masculino-jaleca',
  'biomedico': 'jaleco-slim-tradicional-masculino-jaleca',
  'advogado': 'conjunto-scrub-masculino-jaleca',
  'barbeiro': 'jaleco-slim-tradicional-masculino-jaleca',
  'cabeleireiro': 'jaleco-slim-tradicional-masculino-jaleca',
  'professor': 'jaleco-padrao-aluno-masculino-jaleca',
  'pastor': 'jaleco-slim-tradicional-masculino-jaleca',
  'cozinheiro': 'conjunto-dolma-cozinheiro-masculino-jaleca',
  'churrasqueiro': 'conjunto-dolma-cozinheiro-masculino-jaleca',
  'sushiman': 'conjunto-dolma-cozinheiro-masculino-jaleca',

  // ── UNISSEX / PÁGINAS ESPECIAIS ───────────────────────────────────────
  'enfermagem': 'conjunto-scrub-feminino-jaleca',
  'universitario': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'jaleco-slim-tradicional-feminino-jaleca',
  'odontologia': 'jaleco-slim-tradicional-feminino-jaleca',
  'fisioterapia': 'jaleco-slim-feminino-lateral-jaleca',
  'nutricao': 'jaleco-slim-tradicional-feminino-jaleca',
  'farmacia': 'jaleco-slim-tradicional-feminino-jaleca',
}

/**
 * Retorna o slug do produto para foto hero de uma profissão
 */
export function getHeroImageSlug(profession: string): string | null {
  return PROFESSION_HERO_IMAGES[profession] || null
}
