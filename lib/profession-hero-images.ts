/**
 * Mapeamento de profissões → foto hero (produto PAI, sem cor)
 *
 * IMPORTANTE: Usar slug do produto PAI, NÃO da variação de cor
 * Exemplo: jaleco-slim-feminino... (correto) vs jaleco-slim-feminino...-branco (errado)
 */

export const PROFESSION_HERO_IMAGES: Record<string, string> = {
  // ── FEMININO ──────────────────────────────────────────────────────────
  'medica': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'dentista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'enfermeira': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'farmaceutica': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'nutricionista': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'veterinaria': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'psicologa': 'conjunto-puff-ziper-feminino-jaleca',
  'fisioterapeuta': 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  'podologa': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'biomedica': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'advogada': 'conjunto-executiva-feminino-jaleca',
  'cabeleireira': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'esteticista': 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  'massagista': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'professora': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'secretaria': 'conjunto-laco-feminino-jaleca',
  'tatuador': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'dona-casa': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
  'cozinheira': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
  'churrasqueira': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',

  // ── MASCULINO ─────────────────────────────────────────────────────────
  'medico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'dentista-masculino': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'enfermeiro': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'farmaceutico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'veterinario': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'biomedico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'advogado': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'barbeiro': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'cabeleireiro': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'professor': 'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
  'pastor': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'cozinheiro': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'churrasqueiro': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'sushiman': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',

  // ── UNISSEX / PÁGINAS ESPECIAIS ───────────────────────────────────────
  'enfermagem': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'universitario': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'odontologia': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'fisioterapia': 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  'nutricao': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'farmacia': 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
}

/**
 * Retorna o slug do produto para foto hero de uma profissão
 */
export function getHeroImageSlug(profession: string): string | null {
  return PROFESSION_HERO_IMAGES[profession] || null
}
