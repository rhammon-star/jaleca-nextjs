/**
 * Mapeamento de profissões → foto hero
 *
 * Regras:
 * - Jalecos: sempre branco ou preto
 * - Dólmã: preto
 * - Conjunto: qualquer cor
 * - Atenção ao gênero: feminino usa fotos de mulher, masculino usa fotos de homem
 */

export const PROFESSION_HERO_IMAGES: Record<string, string> = {
  // ── FEMININO ──────────────────────────────────────────────────────────
  'medica': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'dentista': 'jaleco-slim-tradicional-feminino-jaleca-branco',
  'enfermeira': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'farmaceutica': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'nutricionista': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'veterinaria': 'jaleco-slim-tradicional-feminino-jaleca-branco',
  'psicologa': 'conjunto-puff-ziper-feminino-jaleca',
  'fisioterapeuta': 'jaleco-slim-feminino-lateral-jaleca-branco',
  'podologa': 'jaleco-slim-tradicional-feminino-jaleca-branco',
  'biomedica': 'jaleco-slim-tradicional-feminino-jaleca-branco',
  'advogada': 'conjunto-executiva-feminino-jaleca',
  'cabeleireira': 'jaleco-slim-tradicional-feminino-jaleca-preto',
  'esteticista': 'jaleco-slim-feminino-lateral-jaleca-branco',
  'massagista': 'conjunto-scrub-feminino-varias-cores-jaleca',
  'professora': 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
  'secretaria': 'conjunto-laco-feminino-jaleca',
  'tatuador': 'jaleco-slim-tradicional-feminino-jaleca-preto',
  'dona-casa': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
  'cozinheira': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
  'churrasqueira': 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',

  // ── MASCULINO ─────────────────────────────────────────────────────────
  'medico': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'dentista-masculino': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-branco',
  'enfermeiro': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'farmaceutico': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'veterinario': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-branco',
  'biomedico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-branco',
  'advogado': 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
  'barbeiro': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-preto',
  'cabeleireiro': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-preto',
  'professor': 'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
  'pastor': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-branco',
  'cozinheiro': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'churrasqueiro': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
  'sushiman': 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',

  // ── UNISSEX / PÁGINAS ESPECIAIS ───────────────────────────────────────
  'enfermagem': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca', // Página unissex, usa feminino
  'universitario': 'jaleco-universitario-unissex-jaleca',
  'medicina': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'odontologia': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'fisioterapia': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'nutricao': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
  'farmacia': 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
}

/**
 * Retorna o slug do produto para foto hero de uma profissão
 */
export function getHeroImageSlug(profession: string): string | null {
  return PROFESSION_HERO_IMAGES[profession] || null
}
