// Mapeamento central: produto ↔ profissões
// Atualizado em 19/04/2026 — lista oficial do dono

export type ProfessionInfo = {
  label: string   // Nome exibido
  hub: string     // URL do hub (vazio se não tiver hub ainda)
}

/** Todas as profissões reconhecidas pelo sistema */
export const PROFESSION_MAP: Record<string, ProfessionInfo> = {
  medica:              { label: 'Médica',              hub: '/jaleco-medico' },
  medico:              { label: 'Médico',              hub: '/jaleco-medico' },
  dentista:            { label: 'Dentista',            hub: '/jaleco-dentista' },
  enfermeira:          { label: 'Enfermeira',          hub: '/jaleco-enfermeiro' },
  enfermeiro:          { label: 'Enfermeiro',          hub: '/jaleco-enfermeiro' },
  farmaceutica:        { label: 'Farmacêutica',        hub: '/jaleco-farmaceutico' },
  farmaceutico:        { label: 'Farmacêutico',        hub: '/jaleco-farmaceutico' },
  nutricionista:       { label: 'Nutricionista',       hub: '/jaleco-nutricionista' },
  veterinaria:         { label: 'Veterinária',         hub: '/jaleco-veterinario' },
  veterinario:         { label: 'Veterinário',         hub: '/jaleco-veterinario' },
  psicologa:           { label: 'Psicóloga',           hub: '/jaleco-psicologa' },
  biomedica:           { label: 'Biomédica',           hub: '/jaleco-biomedico' },
  biomedico:           { label: 'Biomédico',           hub: '/jaleco-biomedico' },
  pastor:              { label: 'Pastor',              hub: '/jaleco-pastor' },
  'nail design':       { label: 'Nail Design',         hub: '/jaleco-esteticista' },
  micropigmentadora:   { label: 'Micropigmentadora',   hub: '/jaleco-esteticista' },
  massagista:          { label: 'Massagista',          hub: '/jaleco-massagista' },
  fisioterapeuta:      { label: 'Fisioterapeuta',      hub: '/jaleco-fisioterapeuta' },
  podologo:            { label: 'Podólogo',            hub: '/jaleco-podologo' },
  podologa:            { label: 'Podóloga',            hub: '/jaleco-podologo' },
  tatuador:            { label: 'Tatuador',            hub: '/jaleco-tatuador' },
  cabeleireira:        { label: 'Cabeleireira',        hub: '/jaleco-cabeleireiro' },
  cabeleireiro:        { label: 'Cabeleireiro',        hub: '/jaleco-cabeleireiro' },
  barbeiro:            { label: 'Barbeiro',            hub: '/jaleco-barbeiro' },
  professor:           { label: 'Professor',           hub: '/jaleco-professor' },
  professora:          { label: 'Professora',          hub: '/jaleco-professor' },
  esteticista:         { label: 'Esteticista',         hub: '/jaleco-esteticista' },
  churrasqueiro:       { label: 'Churrasqueiro',       hub: '/jaleco-churrasqueiro' },
  churrasqueira:       { label: 'Churrasqueira',       hub: '/jaleco-churrasqueiro' },
  cozinheiro:          { label: 'Cozinheiro',          hub: '/dolma-cozinheiro' },
  cozinheira:          { label: 'Cozinheira',          hub: '/dolma-cozinheiro' },
  sushiman:            { label: 'Sushiman',            hub: '/jaleco-sushiman' },
  advogada:            { label: 'Advogada',            hub: '/jaleco-advogado' },
  advogado:            { label: 'Advogado',            hub: '/jaleco-advogado' },
  secretaria:          { label: 'Secretária',          hub: '/jaleco-secretaria' },
  aluno:               { label: 'Aluno',               hub: '/jaleco-universitario' },
  universitario:       { label: 'Universitário',       hub: '/jaleco-universitario' },
  estudante:           { label: 'Estudante',           hub: '/jaleco-universitario' },
  buffet:              { label: 'Buffet',              hub: '/dolma-cozinheiro' },
  confeiteira:         { label: 'Confeiteira',         hub: '/dolma-cozinheiro' },
  confeiteiro:         { label: 'Confeiteiro',         hub: '/dolma-cozinheiro' },
  'secretaria do lar': { label: 'Secretária do Lar',  hub: '/jaleco-dona-casa' },
  'dona-de-casa':      { label: 'Dona de Casa',        hub: '/jaleco-dona-casa' },
  'cirurgico-feminino': { label: 'Pijama Cirúrgico Feminino', hub: '/pijama-cirurgico-feminino' },
  'cirurgico-masculino': { label: 'Scrub Masculino',   hub: '/scrub-medico' },
  'cirurgico':         { label: 'Scrub Médico',        hub: '/scrub-medico' },
  'estiloso':          { label: 'Estiloso',            hub: '/jaleco-estiloso' },
  'preto':             { label: 'Preto',                hub: '/jaleco-preto' },
}

export type ProductProfessions = {
  /** Slug real do WooCommerce */
  slug: string
  /** Nome de exibição do produto */
  name: string
  /** Chaves das profissões (de PROFESSION_MAP) */
  professions: string[]
}

/** Lista completa de produtos com suas profissões indicadas */
export const PRODUCT_PROFESSIONS: ProductProfessions[] = [
  // ── JALECOS FEMININOS ──────────────────────────────────────────────────────
  {
    slug: 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
    name: 'Jaleco Slim Tradicional Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-pala-feminino-jaleca',
    name: 'Jaleco Slim Pala Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-gold-feminino-jaleca',
    name: 'Jaleco Slim Gold Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-gold-pala-feminino-jaleca',
    name: 'Jaleco Slim Gold Pala Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-duquesa-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Duquesa Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Elastex Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','tatuador','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
    name: 'Jaleco Slim Feminino Lateral',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-princesa-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Princesa Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-princesa-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Princesa Manga Curta Feminino',
    professions: ['massagista','enfermeira','cabeleireira','nutricionista','fisioterapeuta','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-princesa-laise-feminino-jaleca',
    name: 'Jaleco Slim Princesa Laise Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-moratty-feminino-ziper-central-jaleca',
    name: 'Jaleco Slim Moratty Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Tradicional Manga Curta Feminino',
    professions: ['massagista','enfermeira','cabeleireira','nutricionista','fisioterapeuta','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora','estiloso'],
  },
  {
    slug: 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
    name: 'Jaleco Padrão Aluno Feminino',
    professions: ['aluno','universitario','professor','estudante'],
  },

  // ── JALECOS MASCULINOS ─────────────────────────────────────────────────────
  {
    slug: 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
    name: 'Jaleco Slim Tradicional Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','veterinario','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-slim-recortes-masculino-varias-cores-jaleca',
    name: 'Jaleco Slim Recortes Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','veterinario','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-slim-moratty-masculino-ziper-central-jaleca',
    name: 'Jaleco Slim Moratty Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','veterinario','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
    name: 'Jaleco Padrão Aluno Masculino',
    professions: ['aluno','universitario','estudante','professor'],
  },

  // ── UNISSEX ────────────────────────────────────────────────────────────────
  {
    slug: 'jaleco-universitario-unissex-jaleca',
    name: 'Jaleco Universitário Unissex',
    professions: ['aluno','universitario','estudante','professor'],
  },

  // ── CONJUNTOS / SCRUB ──────────────────────────────────────────────────────
  {
    slug: 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
    name: 'Conjunto Scrub Feminino',
    professions: ['dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','massagista','cirurgico-feminino','cirurgico'],
  },
  {
    slug: 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
    name: 'Conjunto Scrub Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','veterinario','advogado','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','professor','massagista','tatuador','cirurgico-masculino','cirurgico'],
  },
  {
    slug: 'conjunto-puff-ziper-feminino-jaleca',
    name: 'Conjunto Puff Zíper Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'conjunto-laco-feminino-jaleca',
    name: 'Conjunto Laço Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'conjunto-pijama-cirurgico-princesa-scrub-feminino-varias-cores-jaleca',
    name: 'Conjunto Princesa Nobre Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','cirurgico-feminino','cirurgico'],
  },
  {
    slug: 'conjunto-executiva-feminino-jaleca',
    name: 'Conjunto Executiva Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'macacao-paris-feminino-jaleca',
    name: 'Macacão Paris Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },

  // ── DÓLMÃS ────────────────────────────────────────────────────────────────
  {
    slug: 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Feminino',
    professions: ['churrasqueira','cozinheira','buffet','confeiteira','secretaria do lar','dona-de-casa','sushiman'],
  },
  {
    slug: 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Masculino',
    professions: ['churrasqueiro','cozinheiro','buffet','confeiteiro','sushiman'],
  },

  // ── ACESSÓRIOS ────────────────────────────────────────────────────────────
  {
    slug: 'colete-multiuso-jaleca',
    name: 'Colete Multiuso',
    professions: ['farmaceutica','podologa','esteticista','cabeleireira','professor','nail design','tatuador','secretaria do lar','dona-de-casa','micropigmentadora'],
  },
  {
    slug: 'max-colete-jaleca',
    name: 'Max Colete',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'faixa-de-cabelo-jaleca',
    name: 'Faixa de Cabelo',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'touca-de-elastico-jaleca',
    name: 'Touca de Elástico',
    professions: [], // Complementar - não aparece em páginas de profissão
  },
  {
    slug: 'touca-de-amarrar-jaleca',
    name: 'Touca de Amarrar',
    professions: [], // Complementar - não aparece em páginas de profissão
  },
]

// ── ÍNDICE REVERSO: profissão → slugs de produtos ─────────────────────────

/** Dado uma chave de profissão, retorna os slugs dos produtos indicados */
export const PROFESSION_PRODUCT_SLUGS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const p of PRODUCT_PROFESSIONS) {
    for (const prof of p.professions) {
      if (!map[prof]) map[prof] = []
      map[prof].push(p.slug)
    }
  }
  return map
})()

/** Dado um slug de produto, retorna as profissões indicadas (com info de hub) */
export function getProfessionsForProduct(productSlug: string): ProfessionInfo[] {
  const entry = PRODUCT_PROFESSIONS.find(p => p.slug === productSlug)
  if (!entry) return []
  // deduplicar por hub (ex: medica + medico → mesmo hub)
  const seen = new Set<string>()
  const result: ProfessionInfo[] = []
  for (const key of entry.professions) {
    const info = PROFESSION_MAP[key]
    if (!info) continue
    const dedupeKey = info.hub || info.label
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    result.push(info)
  }
  return result
}

// ── PRODUTOS POR COR ───────────────────────────────────────────────────────

/** Slugs de produtos disponíveis em preto */
export const PRETO_PRODUCT_SLUGS = [
  'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
  'jaleco-slim-pala-feminino-jaleca',
  'jaleco-slim-gold-feminino-jaleca',
  'jaleco-slim-gold-pala-feminino-jaleca',
  'jaleco-slim-duquesa-feminino-varias-cores-jaleca',
  'jaleco-slim-elastex-feminino-varias-cores-jaleca',
  'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
  'jaleco-slim-princesa-feminino-varias-cores-jaleca',
  'jaleco-slim-princesa-manga-curta-feminino-jaleca',
  'jaleco-slim-princesa-laise-feminino-jaleca',
  'jaleco-slim-moratty-feminino-ziper-central-jaleca',
  'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
  'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  'jaleco-slim-recortes-masculino-varias-cores-jaleca',
  'jaleco-slim-moratty-masculino-ziper-central-jaleca',
]

/** Dado uma chave de profissão, retorna os slugs dos produtos */
export function getProductSlugsForProfession(professionKey: string): string[] {
  return PROFESSION_PRODUCT_SLUGS[professionKey] ?? []
}

/** Retorna slugs dos produtos em preto */
export function getPretoProductSlugs(): string[] {
  return PRETO_PRODUCT_SLUGS
}

/** Mapeamento profissão → filtro de gênero preferido */
const PROFESSION_GENDER_FILTER: Record<string, 'feminino' | 'masculino' | null> = {
  // Feminino
  'medica': 'feminino',
  'enfermeira': 'feminino',
  'dentista': 'feminino',  // Por padrão feminino (mais comum)
  'nutricionista': 'feminino',
  'veterinaria': 'feminino',
  'psicologa': 'feminino',
  'farmaceutica': 'feminino',
  'biomedica': 'feminino',
  'podologa': 'feminino',
  'advogada': 'feminino',
  'secretaria': 'feminino',
  'professora': 'feminino',
  'cabeleireira': 'feminino',
  'esteticista': 'feminino',
  'massagista': 'feminino',
  'fisioterapeuta': 'feminino',  // Profissão unissex, mas tendência feminina
  'micropigmentadora': 'feminino',
  'nail design': 'feminino',
  'confeiteira': 'feminino',
  'cozinheira': 'feminino',
  'churrasqueira': 'feminino',
  'dona-de-casa': 'feminino',
  'secretaria do lar': 'feminino',

  // Masculino
  'medico': 'masculino',
  'enfermeiro': 'masculino',
  'veterinario': 'masculino',
  'farmaceutico': 'masculino',
  'biomedico': 'masculino',
  'podologo': 'masculino',
  'advogado': 'masculino',
  'professor': 'masculino',
  'cabeleireiro': 'masculino',
  'barbeiro': 'masculino',
  'tatuador': 'masculino',
  'pastor': 'masculino',
  'confeiteiro': 'masculino',
  'cozinheiro': 'masculino',
  'churrasqueiro': 'masculino',
  'sushiman': 'masculino',

  // Sem filtro de gênero (unissex ou genérico)
  'enfermagem': null,
  'aluno': null,
  'universitario': null,
  'estudante': null,
  'buffet': null,
  'cirurgico': null,
  'cirurgico-feminino': 'feminino',
  'cirurgico-masculino': 'masculino',
  'estiloso': null,
  'preto': null,
}

/**
 * Retorna URL do filtro "Ver mais" para uma profissão
 *
 * @example
 * getVerMaisUrl('medica') // '/produtos?categoria=jalecos-femininos'
 * getVerMaisUrl('medico') // '/produtos?categoria=jalecos-masculinos'
 * getVerMaisUrl('enfermagem') // '/produtos?categoria=jalecos'
 */
export function getVerMaisUrl(professionKey: string): string {
  const gender = PROFESSION_GENDER_FILTER[professionKey]

  if (gender === 'feminino') {
    return '/produtos?categoria=jalecos-femininos'
  } else if (gender === 'masculino') {
    return '/produtos?categoria=jalecos-masculinos'
  } else {
    return '/produtos?categoria=jalecos'
  }
}

/**
 * Prioriza produtos por cor: branco e preto primeiro (mais vendidos)
 *
 * @param products - Lista de produtos WooCommerce
 * @returns Lista ordenada com branco/preto primeiro
 */
export function prioritizeByColor<T extends { slug: string; name: string }>(products: T[]): T[] {
  const priority: T[] = []
  const others: T[] = []

  products.forEach(product => {
    const slug = product.slug.toLowerCase()
    const name = product.name.toLowerCase()

    // Branco ou preto no slug ou nome
    if (slug.includes('branco') || name.includes('branco')) {
      priority.unshift(product) // Branco no início
    } else if (slug.includes('preto') || name.includes('preto')) {
      priority.push(product) // Preto depois do branco
    } else {
      others.push(product)
    }
  })

  return [...priority, ...others]
}
